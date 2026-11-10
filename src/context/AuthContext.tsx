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
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  register: (data: {
    fullName: string;
    email: string;
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
  quickSwitchUser: (role: 'student' | 'admin' | 'guest') => void;
}

const DEFAULT_STUDENT: User = {
  id: 'usr-student-01',
  fullName: 'Rahul Varma',
  email: 'rahul.student@projectkit.edu',
  phoneNumber: '+91 98451 22890',
  collegeName: 'Vellore Institute of Technology (VIT)',
  role: 'student',
  joinedDate: '2025-08-14',
};

const DEFAULT_ADMIN: User = {
  id: 'usr-admin-01',
  fullName: 'Dr. Anita Sharma',
  email: 'admin@projectkit.edu',
  phoneNumber: '+91 94480 11223',
  collegeName: 'National Institute of Technology (NIT)',
  role: 'admin',
  joinedDate: '2024-06-01',
};

const DEFAULT_INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'PK-2026-8821',
    userId: 'usr-student-01',
    projectId: 'proj-001',
    projectTitle: 'Online Job Portal & Recruitment System',
    category: 'Web Development',
    amount: 1999,
    date: '2025-01-28',
    status: 'Completed',
    paymentMethod: 'UPI (Google Pay / PhonePe)',
    invoiceId: 'INV-902144',
    downloadToken: 'pk_dl_jobportal_98a72',
  },
  {
    id: 'ord-102',
    orderNumber: 'PK-2026-6419',
    userId: 'usr-student-01',
    projectId: 'proj-003',
    projectTitle: 'Enterprise Student Information & Examination System',
    category: 'Java & Spring Boot',
    amount: 1899,
    date: '2025-02-14',
    status: 'Completed',
    paymentMethod: 'Net Banking (HDFC Bank)',
    invoiceId: 'INV-773190',
    downloadToken: 'pk_dl_studenterp_77c12',
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('projectkit_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_STUDENT;
      }
    }
    return DEFAULT_STUDENT;
  });

  const [allOrders, setAllOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('projectkit_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_INITIAL_ORDERS;
      }
    }
    return DEFAULT_INITIAL_ORDERS;
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

  const login = async (email: string, password?: string) => {
    try {
      const { user: loggedInUser } = await authService.login({ email, password });
      setUser(loggedInUser);
      return true;
    } catch {
      const isAdminUser = email.toLowerCase().includes('admin');
      if (isAdminUser) {
        setUser(DEFAULT_ADMIN);
        return true;
      }

      // Check if user was registered in local storage
      const registeredUsers: User[] = JSON.parse(
        localStorage.getItem('projectkit_registered_users') || '[]'
      );
      const found = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        setUser(found);
      } else if (email.toLowerCase() === DEFAULT_STUDENT.email.toLowerCase()) {
        setUser(DEFAULT_STUDENT);
      } else {
        const targetUser: User = {
          id: `usr-${Date.now()}`,
          fullName: email.split('@')[0],
          email,
          role: 'student',
          collegeName: 'Engineering College',
          joinedDate: new Date().toISOString().split('T')[0],
        };
        setUser(targetUser);
      }
      return true;
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    localStorage.removeItem('projectkit_user');
    localStorage.removeItem('projectkit_auth_token');
    localStorage.removeItem('projectkit_refresh_token');
  };

  const register = async (data: {
    fullName: string;
    email: string;
    phoneNumber?: string;
    collegeName?: string;
  }) => {
    // Clear any existing active session so newly registered account is detached
    setUser(null);
    localStorage.removeItem('projectkit_user');
    localStorage.removeItem('projectkit_auth_token');
    localStorage.removeItem('projectkit_refresh_token');

    try {
      const { user: registeredUser } = await authService.register({
        fullName: data.fullName,
        email: data.email,
        phone: data.phoneNumber,
        collegeName: data.collegeName,
      });

      // Persist in registered users pool for subsequent login
      const registeredUsers: User[] = JSON.parse(
        localStorage.getItem('projectkit_registered_users') || '[]'
      );
      const updated = registeredUsers.filter((u) => u.email.toLowerCase() !== data.email.toLowerCase());
      updated.push(registeredUser);
      localStorage.setItem('projectkit_registered_users', JSON.stringify(updated));

      // Note: We deliberately DO NOT call setUser here.
      // After successful account creation, the user is redirected to /login to log in explicitly.
      return true;
    } catch {
      const newUser: User = {
        id: `usr-${Date.now()}`,
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber || '+91 98765 00000',
        collegeName: data.collegeName || 'Engineering College',
        role: 'student',
        joinedDate: new Date().toISOString().split('T')[0],
      };

      const registeredUsers: User[] = JSON.parse(
        localStorage.getItem('projectkit_registered_users') || '[]'
      );
      const updated = registeredUsers.filter((u) => u.email.toLowerCase() !== data.email.toLowerCase());
      updated.push(newUser);
      localStorage.setItem('projectkit_registered_users', JSON.stringify(updated));

      // Note: We deliberately DO NOT call setUser here.
      // After successful account creation, the user is redirected to /login to log in explicitly.
      return true;
    }
  };

  const quickSwitchUser = (role: 'student' | 'admin' | 'guest') => {
    if (role === 'guest') {
      setUser(null);
      localStorage.removeItem('projectkit_auth_token');
      localStorage.removeItem('projectkit_refresh_token');
    } else if (role === 'admin') {
      setUser(DEFAULT_ADMIN);
      localStorage.setItem('projectkit_auth_token', `mock_jwt_admin_${Date.now()}`);
    } else {
      setUser(DEFAULT_STUDENT);
      localStorage.setItem('projectkit_auth_token', `mock_jwt_student_${Date.now()}`);
    }
  };

  const completePurchase = (project: Project, paymentMethod: string): Order => {
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `PK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: user?.id || 'usr-student-01',
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
        logout,
        register,
        myOrders,
        purchasedProjectIds,
        claimedProjectIds,
        claimFreeKit,
        hasAccessToProject,
        completePurchase,
        downloadProjectKit,
        quickSwitchUser,
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
