import apiClient, { BackendApiResponse } from './api';
import { User } from '../types';

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password?: string;
  collegeName?: string;
  phone?: string;
}

export interface AuthBackendResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: {
    id: number;
    email: string;
    fullName: string;
    collegeName?: string;
    phone?: string;
    role: string;
    status: string;
    createdAt?: string;
  };
}

const REGISTERED_ACCOUNTS_KEY = 'projectkit_registered_accounts';

interface StoredAccountRecord {
  user: User;
  passwordHash: string;
}

function isBackendOfflineError(err: any): boolean {
  return (
    !err?.response ||
    err?.response?.status === 502 ||
    err?.response?.status === 503 ||
    err?.response?.data?.code === 'BACKEND_OFFLINE' ||
    err?.code === 'ERR_NETWORK'
  );
}

async function hashCredential(password: string, normalizedEmail: string): Promise<string> {
  const input = `${normalizedEmail}:${password}`;
  if (typeof globalThis.crypto !== 'undefined' && globalThis.crypto.subtle) {
    const encoded = new TextEncoder().encode(input);
    const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', encoded);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  // Deterministic fallback digest for environments without SubtleCrypto
  let h1 = 0xdeadbeef ^ input.length;
  let h2 = 0x41c6ce57 ^ input.length;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return `${(h2 >>> 0).toString(16).padStart(8, '0')}${(h1 >>> 0).toString(16).padStart(8, '0')}`;
}

function loadRegisteredAccounts(): StoredAccountRecord[] {
  try {
    const raw = localStorage.getItem(REGISTERED_ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRegisteredAccounts(records: StoredAccountRecord[]): void {
  localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(records));
}

const ADMIN_RESET_KEY = 'projectkit_admin_reset_token';

interface StoredResetToken {
  email: string;
  token: string;
  expiresAt: number;
}

let inMemoryAdminReset: StoredResetToken | null = null;

function saveAdminResetToken(data: StoredResetToken | null): void {
  inMemoryAdminReset = data;
  try {
    if (typeof sessionStorage !== 'undefined') {
      if (data) {
        sessionStorage.setItem(ADMIN_RESET_KEY, JSON.stringify(data));
      } else {
        sessionStorage.removeItem(ADMIN_RESET_KEY);
      }
    }
  } catch {
    // Ignore storage errors in non-browser test envs
  }
}

function loadAdminResetToken(): StoredResetToken | null {
  try {
    if (typeof sessionStorage !== 'undefined') {
      const raw = sessionStorage.getItem(ADMIN_RESET_KEY);
      if (raw) return JSON.parse(raw) as StoredResetToken;
    }
  } catch {
    // Fallback to in-memory
  }
  return inMemoryAdminReset;
}

export const authService = {
  /**
   * Authenticate student or admin against Spring Boot /api/auth/login,
   * or verify strictly against accounts created via Sign Up when backend is offline.
   */
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const normalizedEmail = (credentials.email || '').trim().toLowerCase();
    const password = credentials.password || '';

    if (!normalizedEmail || !password) {
      throw new Error('Please enter both your email address and password.');
    }

    try {
      const response = await apiClient.post<BackendApiResponse<AuthBackendResponse>>(
        '/api/auth/login',
        { email: normalizedEmail, password }
      );

      const authData = response.data.data;
      if (authData?.accessToken) {
        localStorage.setItem('projectkit_auth_token', authData.accessToken);
        if (authData.refreshToken) {
          localStorage.setItem('projectkit_refresh_token', authData.refreshToken);
        }
      }

      const u = authData.user;
      const user: User = {
        id: String(u.id),
        email: u.email,
        fullName: u.fullName,
        collegeName: u.collegeName,
        phoneNumber: u.phone,
        role: (u.role || 'STUDENT').toLowerCase() === 'admin' ? 'admin' : 'student',
        joinedDate: u.createdAt ? u.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
      };
      return { user, token: authData.accessToken };
    } catch (error: any) {
      if (!isBackendOfflineError(error)) {
        const message =
          error?.response?.data?.message ||
          'Invalid email or password. Please verify your credentials.';
        throw new Error(message);
      }

      // Backend offline: strictly verify email + password hash against registered accounts
      const accounts = loadRegisteredAccounts();
      const matchedAccount = accounts.find(
        (acc) => acc.user.email.trim().toLowerCase() === normalizedEmail
      );

      if (!matchedAccount) {
        throw new Error('No account found with this email. Please sign up first.');
      }

      const providedHash = await hashCredential(password, normalizedEmail);
      if (providedHash !== matchedAccount.passwordHash) {
        throw new Error('Invalid email or password. Please verify your credentials.');
      }

      const token = `pk_session_${Date.now()}`;
      localStorage.setItem('projectkit_auth_token', token);
      return { user: matchedAccount.user, token };
    }
  },

  /**
   * Register a new student account at /api/auth/register
   * Stores hashed credential locally only when backend is offline so subsequent Login verifies it strictly.
   */
  async register(payload: RegisterPayload): Promise<{ user: User; token: string }> {
    const normalizedEmail = (payload.email || '').trim().toLowerCase();
    const password = payload.password || '';

    if (!payload.fullName?.trim()) {
      throw new Error('Please enter your full name.');
    }
    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      throw new Error('Please provide a valid email address.');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    try {
      const response = await apiClient.post<BackendApiResponse<AuthBackendResponse>>(
        '/api/auth/register',
        {
          fullName: payload.fullName.trim(),
          email: normalizedEmail,
          password,
          collegeName: payload.collegeName?.trim(),
          phone: payload.phone?.trim(),
        }
      );

      const authData = response.data.data;
      const u = authData.user;
      const user: User = {
        id: String(u.id),
        email: u.email,
        fullName: u.fullName,
        collegeName: u.collegeName,
        phoneNumber: u.phone,
        role: 'student',
        joinedDate: u.createdAt ? u.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
      };
      return { user, token: '' };
    } catch (error: any) {
      if (!isBackendOfflineError(error)) {
        const message =
          error?.response?.data?.message ||
          'Registration failed. This email may already be registered.';
        throw new Error(message);
      }

      // Backend offline: persist account cleanly in local registered accounts store (never auto-login)
      const accounts = loadRegisteredAccounts();
      const alreadyExists = accounts.some(
        (acc) => acc.user.email.trim().toLowerCase() === normalizedEmail
      );
      if (alreadyExists) {
        throw new Error('An account with this email is already registered. Please sign in.');
      }

      const user: User = {
        id: `usr-${Date.now()}`,
        fullName: payload.fullName.trim(),
        email: normalizedEmail,
        phoneNumber: payload.phone?.trim() || '',
        collegeName: payload.collegeName?.trim() || '',
        role: 'student',
        joinedDate: new Date().toISOString().split('T')[0],
      };
      const passwordHash = await hashCredential(password, normalizedEmail);
      accounts.push({ user, passwordHash });
      saveRegisteredAccounts(accounts);

      return { user, token: '' };
    }
  },

  /**
   * Check whether a local preview administrator account has already been configured
   */
  hasLocalAdmin(): boolean {
    return loadRegisteredAccounts().some((acc) => acc.user.role === 'admin');
  },

  /**
   * One-time initial administrator setup for preview/offline environments without a hardcoded password.
   * Permanently disabled once an administrator account exists locally.
   */
  async setupInitialAdmin(payload: {
    fullName: string;
    email: string;
    password: string;
    adminTitle?: string;
  }): Promise<User> {
    if (this.hasLocalAdmin()) {
      throw new Error('An administrator account is already configured. Please sign in.');
    }

    const normalizedEmail = (payload.email || '').trim().toLowerCase();
    const password = payload.password || '';

    if (!payload.fullName?.trim() || payload.fullName.trim().length < 2) {
      throw new Error('Please enter the administrator full name.');
    }
    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      throw new Error('Please provide a valid administrator email address.');
    }
    if (password.length < 8) {
      throw new Error('Administrator password must be at least 8 characters.');
    }

    const accounts = loadRegisteredAccounts();
    if (accounts.some((acc) => acc.user.email.trim().toLowerCase() === normalizedEmail)) {
      throw new Error('This email is already registered as a student. Use a dedicated admin email.');
    }

    const adminUser: User = {
      id: `usr-admin-${Date.now()}`,
      fullName: payload.fullName.trim(),
      email: normalizedEmail,
      phoneNumber: '',
      collegeName: 'ProjectKit Administration',
      role: 'admin',
      adminTitle: (payload.adminTitle || 'Lead Administrator').trim(),
      joinedDate: new Date().toISOString().split('T')[0],
    };

    const passwordHash = await hashCredential(password, normalizedEmail);
    accounts.push({ user: adminUser, passwordHash });
    saveRegisteredAccounts(accounts);

    return adminUser;
  },

  /**
   * List all configured administrator & co-founder accounts
   */
  getAdminAccounts(): User[] {
    return loadRegisteredAccounts()
      .filter((acc) => acc.user.role === 'admin')
      .map((acc) => ({
        ...acc.user,
        adminTitle: acc.user.adminTitle || 'Lead Administrator',
      }));
  },

  /**
   * Add another Administrator or Co-Founder account from the Admin Console
   */
  async addAdminAccount(payload: {
    fullName: string;
    email: string;
    password: string;
    adminTitle: string;
  }): Promise<User> {
    const normalizedEmail = (payload.email || '').trim().toLowerCase();
    const password = payload.password || '';
    const fullName = (payload.fullName || '').trim();
    const adminTitle = (payload.adminTitle || 'Co-Founder').trim();

    if (fullName.length < 2) {
      throw new Error('Please enter the administrator or co-founder full name.');
    }
    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      throw new Error('Please provide a valid email address.');
    }
    if (password.length < 8) {
      throw new Error('Administrator password must be at least 8 characters.');
    }

    const accounts = loadRegisteredAccounts();
    if (accounts.some((acc) => acc.user.email.trim().toLowerCase() === normalizedEmail)) {
      throw new Error('An account with this email already exists.');
    }

    const newAdmin: User = {
      id: `usr-admin-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      fullName,
      email: normalizedEmail,
      phoneNumber: '',
      collegeName: 'ProjectKit Leadership',
      role: 'admin',
      adminTitle,
      joinedDate: new Date().toISOString().split('T')[0],
    };

    const passwordHash = await hashCredential(password, normalizedEmail);
    accounts.push({ user: newAdmin, passwordHash });
    saveRegisteredAccounts(accounts);

    return newAdmin;
  },

  /**
   * Update an existing Administrator or Co-Founder's details / designation / optional password
   */
  async updateAdminAccount(
    adminId: string,
    updates: {
      fullName: string;
      adminTitle: string;
      newPassword?: string;
    }
  ): Promise<User> {
    const fullName = (updates.fullName || '').trim();
    const adminTitle = (updates.adminTitle || '').trim();
    if (fullName.length < 2) {
      throw new Error('Administrator full name must be at least 2 characters.');
    }
    if (!adminTitle) {
      throw new Error('Please select or enter a role designation (e.g. Co-Founder).');
    }
    if (updates.newPassword && updates.newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters.');
    }

    const accounts = loadRegisteredAccounts();
    const idx = accounts.findIndex((acc) => acc.user.id === adminId && acc.user.role === 'admin');
    if (idx === -1) {
      throw new Error('Administrator account not found.');
    }

    const updatedUser: User = {
      ...accounts[idx].user,
      fullName,
      adminTitle,
    };

    accounts[idx].user = updatedUser;
    if (updates.newPassword) {
      accounts[idx].passwordHash = await hashCredential(
        updates.newPassword,
        updatedUser.email.trim().toLowerCase()
      );
    }
    saveRegisteredAccounts(accounts);

    // Sync active localStorage session if editing currently logged-in admin
    try {
      const rawCurrent = localStorage.getItem('projectkit_user');
      if (rawCurrent) {
        const current = JSON.parse(rawCurrent) as User;
        if (current.id === updatedUser.id) {
          localStorage.setItem('projectkit_user', JSON.stringify(updatedUser));
        }
      }
    } catch {
      // Ignore storage parse error
    }

    return updatedUser;
  },

  /**
   * Remove a secondary administrator / co-founder account (guards against removing active self or last admin)
   */
  removeAdminAccount(adminId: string, requesterId?: string): void {
    const accounts = loadRegisteredAccounts();
    const adminRecords = accounts.filter((acc) => acc.user.role === 'admin');
    if (adminRecords.length <= 1) {
      throw new Error('At least one administrator account must remain active.');
    }
    if (requesterId && adminId === requesterId) {
      throw new Error('You cannot remove the administrator account you are currently signed in with.');
    }

    const remaining = accounts.filter((acc) => !(acc.user.id === adminId && acc.user.role === 'admin'));
    if (remaining.length === accounts.length) {
      throw new Error('Administrator account not found.');
    }
    saveRegisteredAccounts(remaining);
  },

  /**
   * Authenticate strictly as an administrator (rejects student accounts)
   */
  async loginAdmin(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const result = await this.login(credentials);
    if (result.user.role !== 'admin') {
      await this.logout();
      throw new Error('Access denied: This account does not have Administrator privileges.');
    }
    return result;
  },

  /**
   * Request administrator password reset token (backend email or local preview recovery token)
   */
  async forgotAdminPassword(email: string): Promise<{ message: string; previewResetToken?: string }> {
    const normalizedEmail = (email || '').trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      throw new Error('Please enter a valid administrator email address.');
    }

    try {
      const response = await apiClient.post<BackendApiResponse<void>>('/api/auth/forgot-password', {
        email: normalizedEmail,
      });
      return {
        message:
          response.data?.message ||
          'Password reset instructions have been dispatched to your administrator email.',
      };
    } catch (err: any) {
      if (!isBackendOfflineError(err)) {
        if (err.response?.status === 429) {
          throw new Error('Too many password reset attempts. Please wait 60 seconds.');
        }
        throw new Error(err.response?.data?.message || 'Unable to process password reset request.');
      }

      const accounts = loadRegisteredAccounts();
      const adminRecord = accounts.find(
        (acc) => acc.user.role === 'admin' && acc.user.email.trim().toLowerCase() === normalizedEmail
      );
      if (!adminRecord) {
        throw new Error('No administrator account found with this email.');
      }

      const token = `PK-ADM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      saveAdminResetToken({
        email: normalizedEmail,
        token,
        expiresAt: Date.now() + 15 * 60 * 1000,
      });

      return {
        message: 'Recovery code generated (offline preview mode). Enter the token below to set a new password.',
        previewResetToken: token,
      };
    }
  },

  /**
   * Reset administrator password using reset token
   */
  async resetAdminPassword(token: string, newPassword: string): Promise<string> {
    const trimmedToken = (token || '').trim();
    if (!trimmedToken) {
      throw new Error('Please enter your administrator reset token.');
    }
    if (!newPassword || newPassword.length < 8) {
      throw new Error('New administrator password must be at least 8 characters.');
    }

    try {
      const response = await apiClient.post<BackendApiResponse<void>>('/api/auth/reset-password', {
        token: trimmedToken,
        newPassword,
      });
      return (
        response.data?.message ||
        'Administrator password has been reset successfully. You can now sign in.'
      );
    } catch (err: any) {
      if (!isBackendOfflineError(err)) {
        throw new Error(err.response?.data?.message || 'Invalid or expired password reset token.');
      }

      const stored = loadAdminResetToken();
      if (!stored || stored.token !== trimmedToken) {
        throw new Error('Invalid administrator reset token.');
      }
      if (Date.now() > stored.expiresAt) {
        saveAdminResetToken(null);
        throw new Error('Reset token has expired. Please request a new reset token.');
      }

      const accounts = loadRegisteredAccounts();
      const idx = accounts.findIndex(
        (acc) => acc.user.role === 'admin' && acc.user.email.trim().toLowerCase() === stored.email
      );
      if (idx === -1) {
        throw new Error('Administrator account not found.');
      }

      accounts[idx].passwordHash = await hashCredential(newPassword, stored.email);
      saveRegisteredAccounts(accounts);
      saveAdminResetToken(null);

      return 'Administrator password has been updated successfully. You can now sign in.';
    }
  },

  /**
   * Update authenticated administrator password directly inside the Admin Console
   */
  async changeAdminPassword(
    email: string,
    currentPassword: string,
    newPassword: string
  ): Promise<string> {
    const normalizedEmail = (email || '').trim().toLowerCase();
    if (!currentPassword) {
      throw new Error('Please enter your current password.');
    }
    if (!newPassword || newPassword.length < 8) {
      throw new Error('New administrator password must be at least 8 characters.');
    }

    try {
      await apiClient.put('/api/students/change-password', {
        currentPassword,
        newPassword,
        confirmPassword: newPassword,
      });
      return 'Administrator password updated successfully.';
    } catch (err: any) {
      if (!isBackendOfflineError(err)) {
        throw new Error(err.response?.data?.message || 'Current password is incorrect.');
      }

      const accounts = loadRegisteredAccounts();
      const idx = accounts.findIndex(
        (acc) => acc.user.role === 'admin' && acc.user.email.trim().toLowerCase() === normalizedEmail
      );
      if (idx === -1) {
        throw new Error('Administrator account not found.');
      }

      const currentHash = await hashCredential(currentPassword, normalizedEmail);
      if (currentHash !== accounts[idx].passwordHash) {
        throw new Error('Current password is incorrect.');
      }

      accounts[idx].passwordHash = await hashCredential(newPassword, normalizedEmail);
      saveRegisteredAccounts(accounts);
      return 'Administrator password updated successfully.';
    }
  },

  /**
   * Permanently delete student account and revoke active session
   */
  async deleteAccount(reason: string, activeUser: User | null): Promise<void> {
    const trimmedReason = (reason || '').trim();
    if (!activeUser) {
      throw new Error('You must be signed in to delete your account.');
    }

    try {
      await apiClient.post('/api/users/account-deletion-request', {
        reason: trimmedReason || 'User initiated account deletion',
      });
    } catch (err: any) {
      if (!isBackendOfflineError(err) && err?.response?.status !== 401) {
        throw new Error(err?.response?.data?.message || 'Unable to process account deletion.');
      }
    }

    // Remove registered account from local store so those credentials can no longer log in
    const normalizedEmail = activeUser.email.trim().toLowerCase();
    const accounts = loadRegisteredAccounts();
    const remaining = accounts.filter(
      (acc) => acc.user.email.trim().toLowerCase() !== normalizedEmail && acc.user.id !== activeUser.id
    );
    saveRegisteredAccounts(remaining);

    // Clear all user-scoped session & storage data
    localStorage.removeItem(`projectkit_claims_${activeUser.id}`);
    localStorage.removeItem(`projectkit_wishlist_${activeUser.id}`);
    localStorage.removeItem('projectkit_deletion_request');
    localStorage.removeItem('projectkit_auth_token');
    localStorage.removeItem('projectkit_refresh_token');
    localStorage.removeItem('projectkit_user');
  },

  /**
   * Log out current user and invalidate refresh token on backend
   */
  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('projectkit_refresh_token');
    try {
      if (refreshToken) {
        await apiClient.post('/api/auth/logout', { refreshToken });
      }
    } catch {
      // Ignore network failure on logout
    } finally {
      localStorage.removeItem('projectkit_auth_token');
      localStorage.removeItem('projectkit_refresh_token');
      localStorage.removeItem('projectkit_user');
    }
  },

  /**
   * Fetch current authenticated user profile from /api/auth/me
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get<BackendApiResponse<any>>('/api/auth/me');
      const u = response.data?.data;
      if (!u) return null;
      return {
        id: String(u.id),
        email: u.email,
        fullName: u.fullName,
        collegeName: u.collegeName,
        phoneNumber: u.phone,
        role: (u.role || 'STUDENT').toLowerCase() === 'admin' ? 'admin' : 'student',
        joinedDate: u.createdAt ? u.createdAt.split('T')[0] : '2025-01-01',
      };
    } catch {
      return null;
    }
  },

  /**
   * Request email-based password reset token from /api/auth/forgot-password
   */
  async forgotPassword(email: string): Promise<string> {
    try {
      const response = await apiClient.post<BackendApiResponse<void>>('/api/auth/forgot-password', {
        email: email.trim().toLowerCase(),
      });
      return (
        response.data?.message ||
        'If your email is registered with ProjectKit, password reset instructions have been dispatched.'
      );
    } catch (err: any) {
      if (err.response?.status === 429) {
        throw new Error('Too many password reset attempts. Please wait 60 seconds.');
      }
      return 'If your email is registered with ProjectKit, password reset instructions have been dispatched.';
    }
  },

  /**
   * Complete password reset using token and new password via /api/auth/reset-password
   */
  async resetPassword(token: string, newPassword: string): Promise<string> {
    const response = await apiClient.post<BackendApiResponse<void>>('/api/auth/reset-password', {
      token: token.trim(),
      newPassword,
    });
    return (
      response.data?.message ||
      'Password has been reset successfully. You can now log in with your new credentials.'
    );
  },
};

export default authService;
