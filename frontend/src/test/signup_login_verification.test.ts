import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import apiClient from '../services/api';
import authService from '../services/authService';

function createMemoryStorage() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, String(value));
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
  };
}

describe('Strict Sign-Up & Login Credential Verification', () => {
  const originalPost = apiClient.post.bind(apiClient);
  const originalLocalStorage = (globalThis as any).localStorage;

  beforeEach(() => {
    (globalThis as any).localStorage = createMemoryStorage();
    // Simulate backend offline (503) from Vite proxy bypass
    (apiClient as any).post = async () => {
      const err: any = new Error('Backend offline');
      err.response = {
        status: 503,
        data: { code: 'BACKEND_OFFLINE', message: 'Backend API server is not running.' },
      };
      throw err;
    };
  });

  afterEach(() => {
    (apiClient as any).post = originalPost;
    (globalThis as any).localStorage = originalLocalStorage;
  });

  it('rejects login for an email that has never signed up', async () => {
    await expect(
      authService.login({ email: 'unregistered@university.edu', password: 'Password123' })
    ).rejects.toThrow('No account found with this email. Please sign up first.');
    expect(localStorage.getItem('projectkit_auth_token')).toBeNull();
  });

  it('requires explicit login after sign up and rejects wrong passwords', async () => {
    const regResult = await authService.register({
      fullName: 'Hari Krishna',
      email: 'Hari@University.EDU',
      password: 'MySecretPassword99',
      collegeName: 'VIT Vellore',
    });

    expect(regResult.user.email).toBe('hari@university.edu');
    expect(regResult.token).toBe('');
    expect(localStorage.getItem('projectkit_auth_token')).toBeNull();

    // Wrong password must fail
    await expect(
      authService.login({ email: 'hari@university.edu', password: 'WrongPassword!' })
    ).rejects.toThrow('Invalid email or password. Please verify your credentials.');
    expect(localStorage.getItem('projectkit_auth_token')).toBeNull();

    // Exact email + password from Sign Up succeeds
    const loginResult = await authService.login({
      email: 'hari@university.edu',
      password: 'MySecretPassword99',
    });

    expect(loginResult.user.fullName).toBe('Hari Krishna');
    expect(loginResult.user.collegeName).toBe('VIT Vellore');
    expect(loginResult.token.startsWith('pk_session_')).toBe(true);
    expect(localStorage.getItem('projectkit_auth_token')).toBe(loginResult.token);
  });

  it('rejects duplicate sign up for an already registered email', async () => {
    await authService.register({
      fullName: 'Student One',
      email: 'student1@university.edu',
      password: 'Password123',
      collegeName: 'NIT Warangal',
    });

    await expect(
      authService.register({
        fullName: 'Student One Duplicate',
        email: 'student1@university.edu',
        password: 'AnotherPassword123',
        collegeName: 'NIT Warangal',
      })
    ).rejects.toThrow('An account with this email is already registered. Please sign in.');
  });

  it('propagates 401 errors from live backend without falling back to local login', async () => {
    await authService.register({
      fullName: 'Real User',
      email: 'real@university.edu',
      password: 'Password123',
      collegeName: 'IIT Madras',
    });

    // Simulate live backend rejecting credentials with 401 Unauthorized
    (apiClient as any).post = async () => {
      const err: any = new Error('Unauthorized');
      err.response = {
        status: 401,
        data: { message: 'Invalid email or password from server.' },
      };
      throw err;
    };

    await expect(
      authService.login({ email: 'real@university.edu', password: 'Password123' })
    ).rejects.toThrow('Invalid email or password from server.');
  });

  it('supports one-time administrator setup, locks repeat setup, and blocks student login to admin', async () => {
    expect(authService.hasLocalAdmin()).toBe(false);

    // Register a normal student
    await authService.register({
      fullName: 'Regular Student',
      email: 'student@university.edu',
      password: 'StudentPassword123',
      collegeName: 'VIT',
    });

    // Student credentials must be rejected by loginAdmin
    await expect(
      authService.loginAdmin({ email: 'student@university.edu', password: 'StudentPassword123' })
    ).rejects.toThrow('Access denied: This account does not have Administrator privileges.');
    expect(localStorage.getItem('projectkit_auth_token')).toBeNull();

    // First-time Admin setup creates an admin account
    const admin = await authService.setupInitialAdmin({
      fullName: 'Chief Admin',
      email: 'admin@projectkit.in',
      password: 'AdminStrongPassword!1',
    });
    expect(admin.role).toBe('admin');
    expect(authService.hasLocalAdmin()).toBe(true);

    // Repeat setup must be blocked once an admin exists
    await expect(
      authService.setupInitialAdmin({
        fullName: 'Second Admin',
        email: 'admin2@projectkit.in',
        password: 'AnotherStrongPassword!2',
      })
    ).rejects.toThrow('An administrator account is already configured. Please sign in.');

    // Admin login succeeds with verified admin credentials
    const loggedAdmin = await authService.loginAdmin({
      email: 'admin@projectkit.in',
      password: 'AdminStrongPassword!1',
    });
    expect(loggedAdmin.user.role).toBe('admin');
    expect(loggedAdmin.user.email).toBe('admin@projectkit.in');
  });

  it('deletes student account cleanly and blocks subsequent login with deleted credentials', async () => {
    await authService.register({
      fullName: 'Delete Target',
      email: 'delete.me@university.edu',
      password: 'TempPassword123',
      collegeName: 'SRM',
    });

    const logged = await authService.login({
      email: 'delete.me@university.edu',
      password: 'TempPassword123',
    });
    expect(localStorage.getItem('projectkit_auth_token')).toBe(logged.token);

    localStorage.setItem(`projectkit_claims_${logged.user.id}`, JSON.stringify(['proj-1']));
    await authService.deleteAccount('Completed semester', logged.user);

    expect(localStorage.getItem('projectkit_auth_token')).toBeNull();
    expect(localStorage.getItem('projectkit_user')).toBeNull();
    expect(localStorage.getItem(`projectkit_claims_${logged.user.id}`)).toBeNull();

    await expect(
      authService.login({ email: 'delete.me@university.edu', password: 'TempPassword123' })
    ).rejects.toThrow('No account found with this email. Please sign up first.');
  });

  it('supports admin forgot password token generation, reset password, and password change', async () => {
    await authService.setupInitialAdmin({
      fullName: 'Recovery Admin',
      email: 'recovery.admin@projectkit.in',
      password: 'OldAdminPassword!1',
    });

    // Reject forgot password for unknown email
    await expect(
      authService.forgotAdminPassword('unknown.admin@projectkit.in')
    ).rejects.toThrow('No administrator account found with this email.');

    // Generate recovery token for valid admin email
    const forgotRes = await authService.forgotAdminPassword('recovery.admin@projectkit.in');
    expect(forgotRes.previewResetToken).toBeDefined();
    expect(forgotRes.previewResetToken?.startsWith('PK-ADM-')).toBe(true);

    // Reject invalid token
    await expect(
      authService.resetAdminPassword('INVALID-TOKEN', 'NewAdminPassword!2')
    ).rejects.toThrow('Invalid administrator reset token.');

    // Valid token updates password
    await authService.resetAdminPassword(forgotRes.previewResetToken!, 'NewAdminPassword!2');

    // Old password fails; new password succeeds
    await expect(
      authService.loginAdmin({ email: 'recovery.admin@projectkit.in', password: 'OldAdminPassword!1' })
    ).rejects.toThrow('Invalid email or password. Please verify your credentials.');

    const signedIn = await authService.loginAdmin({
      email: 'recovery.admin@projectkit.in',
      password: 'NewAdminPassword!2',
    });
    expect(signedIn.user.role).toBe('admin');

    // Authenticated changeAdminPassword requires valid current password
    await expect(
      authService.changeAdminPassword('recovery.admin@projectkit.in', 'WrongCurrent!', 'FinalAdminPassword!3')
    ).rejects.toThrow('Current password is incorrect.');

    await authService.changeAdminPassword(
      'recovery.admin@projectkit.in',
      'NewAdminPassword!2',
      'FinalAdminPassword!3'
    );

    const relogged = await authService.loginAdmin({
      email: 'recovery.admin@projectkit.in',
      password: 'FinalAdminPassword!3',
    });
    expect(relogged.user.email).toBe('recovery.admin@projectkit.in');
  });

  it('adds a Co-Founder / second admin, changes existing admin designation, and enforces removal safety', async () => {
    const founder = await authService.setupInitialAdmin({
      fullName: 'Founder Admin',
      email: 'founder@projectkit.in',
      password: 'FounderPassword!1',
      adminTitle: 'Lead Administrator',
    });
    expect(founder.adminTitle).toBe('Lead Administrator');

    // Add a Co-Founder admin
    const cofounder = await authService.addAdminAccount({
      fullName: 'Ravi Verma',
      email: 'cofounder@projectkit.in',
      password: 'CoFounderPassword!2',
      adminTitle: 'Co-Founder',
    });
    expect(cofounder.role).toBe('admin');
    expect(cofounder.adminTitle).toBe('Co-Founder');

    const team = authService.getAdminAccounts();
    expect(team.length).toBe(2);

    // Newly added Co-Founder can immediately sign in as admin
    const signedInCoFounder = await authService.loginAdmin({
      email: 'cofounder@projectkit.in',
      password: 'CoFounderPassword!2',
    });
    expect(signedInCoFounder.user.adminTitle).toBe('Co-Founder');

    // Change founder's designation to Co-Founder and rotate password
    const updatedFounder = await authService.updateAdminAccount(founder.id, {
      fullName: 'Founder Updated',
      adminTitle: 'Co-Founder',
      newPassword: 'FounderNewPassword!3',
    });
    expect(updatedFounder.fullName).toBe('Founder Updated');
    expect(updatedFounder.adminTitle).toBe('Co-Founder');

    const signedInFounder = await authService.loginAdmin({
      email: 'founder@projectkit.in',
      password: 'FounderNewPassword!3',
    });
    expect(signedInFounder.user.fullName).toBe('Founder Updated');

    // Cannot remove currently signed-in admin
    expect(() => authService.removeAdminAccount(founder.id, founder.id)).toThrow(
      'You cannot remove the administrator account you are currently signed in with.'
    );

    // Can remove secondary admin
    authService.removeAdminAccount(cofounder.id, founder.id);
    expect(authService.getAdminAccounts().length).toBe(1);

    // Cannot remove the sole remaining admin
    expect(() => authService.removeAdminAccount(founder.id)).toThrow(
      'At least one administrator account must remain active.'
    );
  });
});
