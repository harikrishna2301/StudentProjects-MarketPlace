import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Order, Project } from '../types';
import { INITIAL_PROJECTS } from '../data/projects';
import authService from '../services/authService';
import orderService from '../services/orderService';
import studentService from '../services/studentService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password?: string) => Promise<User>;
  loginAdmin: (email: string, password: string) => Promise<User>;
  setupInitialAdmin: (data: {
    fullName: string;
    email: string;
    password: string;
    adminTitle?: string;
  }) => Promise<User>;
  hasLocalAdmin: () => boolean;
  getAdminAccounts: () => User[];
  addAdminAccount: (data: {
    fullName: string;
    email: string;
    password: string;
    adminTitle: string;
  }) => Promise<User>;
  updateAdminAccount: (
    adminId: string,
    updates: { fullName: string; adminTitle: string; newPassword?: string }
  ) => Promise<User>;
  removeAdminAccount: (adminId: string) => void;
  logout: () => void;
  deleteAccount: (reason: string) => Promise<void>;
  register: (data: {
    fullName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    collegeName?: string;
  }) => Promise<boolean>;
  myOrders: Order[];
  purchasedProjectIds: string[];
  claimedProjectIds: string[];
  claimFreeKit: (project: Project) => Promise<boolean>;
  hasAccessToProject: (projectId: string) => boolean;
  completePurchase: (project: Project, paymentMethod: string) => Order;
  downloadProjectKit: (project: Project, fileType?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('projectkit_user');
    const token = localStorage.getItem('projectkit_auth_token');
    if (saved && token) {
      try {
        const parsed = JSON.parse(saved) as User;
        // Clear any legacy auto-seeded demo user without a real session
        if (parsed.id === 'usr-student-01' && token.startsWith('mock_jwt_')) {
          localStorage.removeItem('projectkit_user');
          localStorage.removeItem('projectkit_auth_token');
          return null;
        }
        return parsed;
      } catch {
        return null;
      }
    }
    if (saved && !token) {
      localStorage.removeItem('projectkit_user');
    }
    return null;
  });

  const [allOrders, setAllOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('projectkit_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Order[];
        // Filter out legacy seeded demo orders so accounts only reflect real purchases
        return parsed.filter(
          (o) => !(o.userId === 'usr-student-01' && (o.id === 'ord-101' || o.id === 'ord-102'))
        );
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('projectkit_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('projectkit_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('projectkit_orders', JSON.stringify(allOrders));
  }, [allOrders]);

  const [claimedProjectIds, setClaimedProjectIds] = useState<string[]>(() => {
    if (!user) return [];
    try {
      const saved = localStorage.getItem(`projectkit_claims_${user.id}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Keep claimedProjectIds in sync when user switches or loads
  useEffect(() => {
    if (user) {
      try {
        const saved = localStorage.getItem(`projectkit_claims_${user.id}`);
        setClaimedProjectIds(saved ? JSON.parse(saved) : []);
      } catch {
        setClaimedProjectIds([]);
      }
    } else {
      setClaimedProjectIds([]);
    }
  }, [user?.id]);

  // myOrders strictly scoped to active logged-in user so newly registered users do not see default demo orders
  const myOrders = user ? allOrders.filter((o) => o.userId === user.id) : [];
  const purchasedProjectIds = myOrders.map((o) => o.projectId);

  const hasAccessToProject = (projectId: string): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return claimedProjectIds.includes(projectId) || purchasedProjectIds.includes(projectId);
  };

  const claimFreeKit = async (project: Project): Promise<boolean> => {
    if (!user) {
      throw new Error('Please log in as a student to claim this free kit.');
    }
    if (!project.isFree && project.accessType !== 'FREE') {
      throw new Error('This project is not a free kit and requires purchase verification.');
    }

    try {
      await studentService.claimFreeProject(project.id);
    } catch (err) {
      // Backend may be offline in dev/preview or already claimed; fallback gracefully
    }

    const updated = Array.from(new Set([...claimedProjectIds, project.id]));
    setClaimedProjectIds(updated);
    localStorage.setItem(`projectkit_claims_${user.id}`, JSON.stringify(updated));
    return true;
  };

  const login = async (email: string, password?: string): Promise<User> => {
    const { user: loggedInUser } = await authService.login({ email, password });
    setUser(loggedInUser);
    return loggedInUser;
  };

  const loginAdmin = async (email: string, password: string): Promise<User> => {
    const { user: adminUser } = await authService.loginAdmin({ email, password });
    setUser(adminUser);
    return adminUser;
  };

  const setupInitialAdmin = async (data: {
    fullName: string;
    email: string;
    password: string;
    adminTitle?: string;
  }): Promise<User> => {
    return authService.setupInitialAdmin(data);
  };

  const hasLocalAdmin = (): boolean => {
    return authService.hasLocalAdmin();
  };

  const getAdminAccounts = (): User[] => {
    return authService.getAdminAccounts();
  };

  const addAdminAccount = async (data: {
    fullName: string;
    email: string;
    password: string;
    adminTitle: string;
  }): Promise<User> => {
    return authService.addAdminAccount(data);
  };

  const updateAdminAccount = async (
    adminId: string,
    updates: { fullName: string; adminTitle: string; newPassword?: string }
  ): Promise<User> => {
    const updated = await authService.updateAdminAccount(adminId, updates);
    if (user && user.id === updated.id) {
      setUser(updated);
    }
    return updated;
  };

  const removeAdminAccount = (adminId: string): void => {
    authService.removeAdminAccount(adminId, user?.id);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    localStorage.removeItem('projectkit_user');
    localStorage.removeItem('projectkit_auth_token');
    localStorage.removeItem('projectkit_refresh_token');
  };

  const deleteAccount = async (reason: string): Promise<void> => {
    const currentUser = user;
    await authService.deleteAccount(reason, currentUser);
    if (currentUser) {
      setAllOrders((prev) => prev.filter((o) => o.userId !== currentUser.id));
    }
    setClaimedProjectIds([]);
    setUser(null);
  };

  const register = async (data: {
    fullName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    collegeName?: string;
  }) => {
    // Clear any existing active session so newly registered account must explicitly sign in
    setUser(null);
    localStorage.removeItem('projectkit_user');
    localStorage.removeItem('projectkit_auth_token');
    localStorage.removeItem('projectkit_refresh_token');

    await authService.register({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      phone: data.phoneNumber,
      collegeName: data.collegeName,
    });

    // Deliberately DO NOT call setUser here; user must log in with verified credentials
    return true;
  };

  const completePurchase = (project: Project, paymentMethod: string): Order => {
    if (!user) {
      throw new Error('You must be signed in to complete a purchase.');
    }
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `PK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: user.id,
      projectId: project.id,
      projectTitle: project.title,
      category: project.category,
      amount: project.price,
      date: new Date().toISOString().split('T')[0],
      status: 'Completed',
      paymentMethod,
      invoiceId: `INV-${Date.now().toString().slice(-6)}`,
      downloadToken: `pk_dl_${Math.random().toString(36).substring(2, 9)}`,
    };

    setAllOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const downloadProjectKit = async (project: Project, fileType: string = 'Full Project ZIP') => {
    if (!hasAccessToProject(project.id)) {
      const isFree = project.isFree || project.accessType === 'FREE';
      const errMsg = isFree
        ? 'Access Denied: You must claim this free kit before downloading.'
        : 'Access Denied: You have not purchased this project. Please complete checkout to download.';
      throw new Error(errMsg);
    }

    try {
      const numericId = parseInt(project.id.replace(/[^0-9]/g, ''), 10) || 1;
      if (fileType.toLowerCase().includes('source') || fileType.toLowerCase().includes('zip')) {
        await orderService.downloadSource(numericId, project.title);
        return;
      } else if (
        fileType.toLowerCase().includes('report') ||
        fileType.toLowerCase().includes('doc') ||
        fileType.toLowerCase().includes('viva')
      ) {
        await orderService.downloadDocumentation(numericId, project.title);
        return;
      } else if (
        fileType.toLowerCase().includes('presentation') ||
        fileType.toLowerCase().includes('ppt') ||
        fileType.toLowerCase().includes('slides')
      ) {
        await orderService.downloadPresentation(numericId, project.title);
        return;
      }
    } catch {
      // Graceful fallback to client bundle download
    }

    const content = `# ProjectKit Academic Kit: ${project.title}
Project ID: ${project.id}
Academic Year: ${project.academicYear}
Primary Stack: ${project.primaryLanguage} (${project.techStack.join(', ')})

NOTICE:
This archive represents a demonstration package in the ProjectKit frontend evaluation environment.
When connected to the production Java 17 + Spring Boot 3 secure asset server, this link streams the encrypted, verified source bundle with Maven/Gradle dependencies and MySQL seed scripts.

INCLUDED FILES IN BUNDLE:
1. /src - Complete clean annotated source code
2. /database - Schema definition and MySQL seed scripts (.sql)
3. /docs/IEEE_Report_${project.slug}.docx - Complete 80+ page project report
4. /docs/SRS_${project.slug}.pdf - Software Requirements Specification (IEEE 830)
5. /docs/Viva_Voce_Questions.pdf - Examiner question bank with model answers
6. /presentation/Seminar_Defense.pptx - Ready presentation deck

SETUP COMMANDS:
${project.installationSteps.map((s) => `Step ${s.step}: ${s.title}\n  Command: ${s.codeCommand || 'N/A'}\n  Note: ${s.description}`).join('\n\n')}

Support: support@projectkit.edu
Thank you for using ProjectKit!`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.slug}-kit-${fileType.toLowerCase().replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        loginAdmin,
        setupInitialAdmin,
        hasLocalAdmin,
        getAdminAccounts,
        addAdminAccount,
        updateAdminAccount,
        removeAdminAccount,
        logout,
        deleteAccount,
        register,
        myOrders,
        purchasedProjectIds,
        claimedProjectIds,
        claimFreeKit,
        hasAccessToProject,
        completePurchase,
        downloadProjectKit,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
