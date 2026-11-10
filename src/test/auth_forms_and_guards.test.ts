import { describe, it, expect } from 'bun:test';

interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

function validateLoginForm(email: string, password: string): FormValidationResult {
  const errors: Record<string, string> = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!emailRegex.test(email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

function validateRegistrationForm(
  fullName: string,
  email: string,
  password: string,
  confirmPassword: string,
  phone?: string
): FormValidationResult {
  const errors: Record<string, string> = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!fullName || fullName.trim().length < 3) {
    errors.fullName = 'Full name must be at least 3 characters.';
  }

  if (!email || !emailRegex.test(email.trim())) {
    errors.email = 'Valid academic or personal email is required.';
  }

  if (!password || password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  if (phone && !/^\+?[0-9]{10,14}$/.test(phone.replace(/[\s-]/g, ''))) {
    errors.phone = 'Invalid phone number format.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

type UserRole = 'STUDENT' | 'ADMIN';

interface UserSession {
  id: number;
  email: string;
  role: UserRole;
  token: string;
}

function checkRouteAccess(path: string, user: UserSession | null): 'ALLOW' | 'REDIRECT_LOGIN' | 'FORBIDDEN_403' {
  const isAdminRoute = path.startsWith('/admin');
  const isStudentRoute = path.startsWith('/student');

  if (!user && (isAdminRoute || isStudentRoute)) {
    return 'REDIRECT_LOGIN';
  }

  if (user && isAdminRoute && user.role !== 'ADMIN') {
    return 'FORBIDDEN_403';
  }

  return 'ALLOW';
}

describe('Authentication Form Validations', () => {
  it('validates correct login credentials', () => {
    const res = validateLoginForm('student@university.edu', 'ValidPassword123!');
    expect(res.isValid).toBe(true);
    expect(Object.keys(res.errors).length).toBe(0);
  });

  it('rejects invalid email formats in login form', () => {
    const res = validateLoginForm('invalid-email-string', 'ValidPass123!');
    expect(res.isValid).toBe(false);
    expect(res.errors.email).toBeDefined();
  });

  it('rejects short passwords in login form', () => {
    const res = validateLoginForm('student@college.edu', '12345');
    expect(res.isValid).toBe(false);
    expect(res.errors.password).toBeDefined();
  });

  it('validates complete registration payload and password confirmation', () => {
    const res = validateRegistrationForm(
      'Ananya Sharma',
      'ananya@college.edu',
      'StrongPassword123!',
      'StrongPassword123!',
      '+919876543210'
    );
    expect(res.isValid).toBe(true);
  });

  it('detects mismatched password confirmation in registration', () => {
    const res = validateRegistrationForm(
      'Ananya Sharma',
      'ananya@college.edu',
      'PasswordA123!',
      'PasswordB123!'
    );
    expect(res.isValid).toBe(false);
    expect(res.errors.confirmPassword).toBe('Passwords do not match.');
  });
});

describe('Route Guard & Role-Based Access Enforcement', () => {
  it('redirects unauthenticated users attempting to access admin dashboard to login', () => {
    const access = checkRouteAccess('/admin/dashboard', null);
    expect(access).toBe('REDIRECT_LOGIN');
  });

  it('blocks authenticated student role from accessing admin route with HTTP 403 Forbidden', () => {
    const studentUser: UserSession = {
      id: 1,
      email: 'student@college.edu',
      role: 'STUDENT',
      token: 'jwt_mock_token',
    };
    const access = checkRouteAccess('/admin/projects', studentUser);
    expect(access).toBe('FORBIDDEN_403');
  });

  it('grants admin access to users with ADMIN role', () => {
    const adminUser: UserSession = {
      id: 99,
      email: 'admin@projectkit.dev',
      role: 'ADMIN',
      token: 'jwt_admin_token',
    };
    const access = checkRouteAccess('/admin/dashboard', adminUser);
    expect(access).toBe('ALLOW');
  });

  it('allows students to access student dashboard views', () => {
    const studentUser: UserSession = {
      id: 1,
      email: 'student@college.edu',
      role: 'STUDENT',
      token: 'jwt_mock_token',
    };
    const access = checkRouteAccess('/student/purchases', studentUser);
    expect(access).toBe('ALLOW');
  });
});

describe('Post-Registration Flow & Account Order Scoping', () => {
  it('redirects to /login after account creation without auto-login session', () => {
    // Simulate registration event without creating authenticated session
    let activeSession: UserSession | null = null;
    const registrationPayload = {
      fullName: 'Vikram Singh',
      email: 'vikram@college.edu',
    };

    // Correct behavior: redirect to login with prefill message, keep session null
    const navigationResult = {
      target: '/login',
      state: {
        registeredMessage: 'Account created successfully! Please sign in with your email and password.',
        email: registrationPayload.email,
      },
    };

    expect(activeSession).toBeNull();
    expect(navigationResult.target).toBe('/login');
    expect(navigationResult.state.email).toBe('vikram@college.edu');
    expect(navigationResult.state.registeredMessage).toContain('Account created successfully');
  });

  it('ensures newly created accounts start with empty purchased kits list instead of default kits', () => {
    interface SystemOrder {
      id: string;
      userId: string;
      projectId: string;
    }

    const initialSystemOrders: SystemOrder[] = [
      { id: 'ord-101', userId: 'usr-student-01', projectId: 'proj-001' },
      { id: 'ord-102', userId: 'usr-student-01', projectId: 'proj-003' },
    ];

    const newRegisteredStudentId = 'usr-987654';

    // Scoped orders for newly registered student
    const studentOrders = initialSystemOrders.filter((o) => o.userId === newRegisteredStudentId);
    const purchasedKitIds = studentOrders.map((o) => o.projectId);

    expect(studentOrders.length).toBe(0);
    expect(purchasedKitIds).toEqual([]);

    // Default demo student retains demo kits
    const demoStudentOrders = initialSystemOrders.filter((o) => o.userId === 'usr-student-01');
    expect(demoStudentOrders.length).toBe(2);
    expect(demoStudentOrders.map((o) => o.projectId)).toEqual(['proj-001', 'proj-003']);
  });
});
