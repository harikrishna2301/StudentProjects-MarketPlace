import { describe, it, expect } from 'bun:test';

// Simulated In-Memory State representing the Full End-to-End System
interface E2EProject {
  id: number;
  slug: string;
  title: string;
  price: number;
  downloadToken: string;
}

interface E2EUser {
  id: number;
  email: string;
  role: 'STUDENT' | 'ADMIN';
  token: string;
}

interface E2EOrder {
  orderNumber: string;
  userId: number;
  projectIds: number[];
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'FAILED';
  invoiceNumber?: string;
  razorpayPaymentId?: string;
}

class ProjectKitE2ESystem {
  private projects: E2EProject[] = [
    {
      id: 101,
      slug: 'ai-smart-attendance-system',
      title: 'AI Smart Attendance System with Face Recognition',
      price: 999,
      downloadToken: 'dl_token_ai_101_secure',
    },
    {
      id: 102,
      slug: 'iot-smart-grid-meter',
      title: 'IoT Smart Grid Power Metering Platform',
      price: 1499,
      downloadToken: 'dl_token_iot_102_secure',
    },
  ];

  private users: Map<string, E2EUser> = new Map();
  private orders: Map<string, E2EOrder> = new Map();
  private processedWebhookPaymentIds: Set<string> = new Set();
  private userPurchases: Map<number, Set<number>> = new Map(); // userId -> Set<projectId>

  // Step 1: Browse catalog
  browseProjects(): E2EProject[] {
    return [...this.projects];
  }

  // Step 2: View project details
  getProjectDetails(slug: string): E2EProject | null {
    return this.projects.find(p => p.slug === slug) ?? null;
  }

  // Step 3: Register / Login
  registerOrLogin(email: string, role: 'STUDENT' | 'ADMIN' = 'STUDENT'): E2EUser {
    if (this.users.has(email)) {
      return this.users.get(email)!;
    }
    const newUser: E2EUser = {
      id: this.users.size + 1,
      email,
      role,
      token: `jwt_token_${email}_${Date.now()}`,
    };
    this.users.set(email, newUser);
    this.userPurchases.set(newUser.id, new Set());
    return newUser;
  }

  // Step 4 & 5: Add to cart & Create Pending Order
  createOrder(user: E2EUser, projectIds: number[]): E2EOrder {
    const purchased = this.userPurchases.get(user.id) || new Set();
    for (const pid of projectIds) {
      if (purchased.has(pid)) {
        throw new Error(`Project ${pid} already purchased by student.`);
      }
    }

    const totalAmount = projectIds.reduce((sum, pid) => {
      const proj = this.projects.find(p => p.id === pid);
      if (!proj) throw new Error(`Project ${pid} not found.`);
      return sum + proj.price;
    }, 0);

    const orderNumber = `PK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const order: E2EOrder = {
      orderNumber,
      userId: user.id,
      projectIds,
      totalAmount,
      status: 'PENDING',
    };

    this.orders.set(orderNumber, order);
    return order;
  }

  // Step 6 & 7: Verify Payment (HMAC signature check)
  verifyPayment(
    orderNumber: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
    expectedSecret: string
  ): { success: boolean; invoiceNumber?: string; error?: string } {
    const order = this.orders.get(orderNumber);
    if (!order) return { success: false, error: 'Order not found.' };

    // Valid mock signature matches 'sig_valid_'
    if (!razorpaySignature.startsWith('sig_valid_')) {
      order.status = 'FAILED';
      return { success: false, error: 'Invalid Razorpay payment signature.' };
    }

    order.status = 'PAID';
    order.razorpayPaymentId = razorpayPaymentId;
    order.invoiceNumber = `INV-${Date.now()}`;

    // Grant purchases
    const userOwned = this.userPurchases.get(order.userId) || new Set();
    order.projectIds.forEach(pid => userOwned.add(pid));
    this.userPurchases.set(order.userId, userOwned);

    return { success: true, invoiceNumber: order.invoiceNumber };
  }

  // Webhook processor with idempotency
  handleWebhook(paymentId: string, orderNumber: string, signature: string): { processed: boolean; duplicate: boolean } {
    if (this.processedWebhookPaymentIds.has(paymentId)) {
      return { processed: true, duplicate: true }; // Idempotent skip
    }

    if (!signature.startsWith('sig_valid_')) {
      throw new Error('Invalid webhook signature');
    }

    const order = this.orders.get(orderNumber);
    if (order && order.status === 'PENDING') {
      order.status = 'PAID';
      order.razorpayPaymentId = paymentId;
      const userOwned = this.userPurchases.get(order.userId) || new Set();
      order.projectIds.forEach(pid => userOwned.add(pid));
    }

    this.processedWebhookPaymentIds.add(paymentId);
    return { processed: true, duplicate: false };
  }

  // Step 8: Post-payment polling check
  getOrderStatus(orderNumber: string): string | null {
    return this.orders.get(orderNumber)?.status ?? null;
  }

  // Step 9: Check student purchased projects
  getPurchasedProjects(userId: number): E2EProject[] {
    const ownedIds = this.userPurchases.get(userId) || new Set();
    return this.projects.filter(p => ownedIds.has(p.id));
  }

  // Step 10: Secure file download
  downloadAuthorizedFile(user: E2EUser | null, projectId: number): { allowed: boolean; status: number; stream?: string } {
    if (!user) {
      return { allowed: false, status: 401 }; // Anonymous
    }

    const owned = this.userPurchases.get(user.id);
    if (!owned || !owned.has(projectId)) {
      return { allowed: false, status: 403 }; // Unpurchased
    }

    const project = this.projects.find(p => p.id === projectId);
    return {
      allowed: true,
      status: 200,
      stream: `[BINARY_STREAM: ${project?.title} Complete Deliverable Archive.zip]`,
    };
  }

  // Admin access check
  accessAdminConsole(user: E2EUser | null): { allowed: boolean; status: number } {
    if (!user) return { allowed: false, status: 401 };
    if (user.role !== 'ADMIN') return { allowed: false, status: 403 };
    return { allowed: true, status: 200 };
  }
}

describe('ProjectKit End-to-End E2E Lifecycle Simulation', () => {
  const system = new ProjectKitE2ESystem();

  it('executes full happy path: Browse -> Details -> Auth -> Cart -> Order -> Pay -> Verify -> Status -> Download', () => {
    // 1. Browse catalog
    const catalog = system.browseProjects();
    expect(catalog.length).toBeGreaterThanOrEqual(1);

    // 2. View details
    const project = system.getProjectDetails('ai-smart-attendance-system');
    expect(project).not.toBeNull();
    expect(project?.price).toBe(999);

    // 3. Register / login student
    const student = system.registerOrLogin('karthik@college.edu', 'STUDENT');
    expect(student.id).toBeDefined();

    // 4. Add to cart & create order
    const order = system.createOrder(student, [project!.id]);
    expect(order.orderNumber).toBeDefined();
    expect(order.totalAmount).toBe(999);
    expect(order.status).toBe('PENDING');

    // 5. Complete payment in Razorpay test mode
    const paymentResult = system.verifyPayment(
      order.orderNumber,
      'pay_rzp_test_12345678',
      'sig_valid_mock_hash_999',
      'secret'
    );
    expect(paymentResult.success).toBe(true);
    expect(paymentResult.invoiceNumber).toBeDefined();

    // 6. Polling verification reflects PAID status
    const status = system.getOrderStatus(order.orderNumber);
    expect(status).toBe('PAID');

    // 7. View student purchased projects
    const purchases = system.getPurchasedProjects(student.id);
    expect(purchases.length).toBe(1);
    expect(purchases[0].id).toBe(project!.id);

    // 8. Download authorized file stream
    const download = system.downloadAuthorizedFile(student, project!.id);
    expect(download.allowed).toBe(true);
    expect(download.status).toBe(200);
    expect(download.stream).toContain('Complete Deliverable Archive.zip');
  });

  describe('Failure Scenarios & Security Controls', () => {
    it('failure case 1: rejects invalid payment signatures with error', () => {
      const student = system.registerOrLogin('rahul@college.edu');
      const order = system.createOrder(student, [102]);

      const res = system.verifyPayment(
        order.orderNumber,
        'pay_forged_999',
        'sig_tampered_invalid_hex',
        'secret'
      );

      expect(res.success).toBe(false);
      expect(res.error).toContain('Invalid Razorpay payment signature');
      expect(system.getOrderStatus(order.orderNumber)).toBe('FAILED');
    });

    it('failure case 2: handles cancelled payment without granting ownership', () => {
      const student = system.registerOrLogin('sneha@college.edu');
      const order = system.createOrder(student, [102]);

      // Student cancelled payment modal
      expect(order.status).toBe('PENDING');
      const purchases = system.getPurchasedProjects(student.id);
      expect(purchases.some(p => p.id === 102)).toBe(false);
    });

    it('failure case 3: handles duplicate webhooks idempotently without duplicate records', () => {
      const student = system.registerOrLogin('vikram@college.edu');
      const order = system.createOrder(student, [101]);

      const webhook1 = system.handleWebhook('pay_webhook_999', order.orderNumber, 'sig_valid_hash');
      expect(webhook1.processed).toBe(true);
      expect(webhook1.duplicate).toBe(false);

      // Duplicate webhook incoming
      const webhook2 = system.handleWebhook('pay_webhook_999', order.orderNumber, 'sig_valid_hash');
      expect(webhook2.processed).toBe(true);
      expect(webhook2.duplicate).toBe(true);
    });

    it('failure case 4: unauthenticated visitor cannot download project deliverable (401)', () => {
      const download = system.downloadAuthorizedFile(null, 101);
      expect(download.allowed).toBe(false);
      expect(download.status).toBe(401);
    });

    it('failure case 5: authenticated student cannot download an unpurchased kit (403)', () => {
      const student = system.registerOrLogin('priya@college.edu');
      // Student has not bought project 102
      const download = system.downloadAuthorizedFile(student, 102);
      expect(download.allowed).toBe(false);
      expect(download.status).toBe(403);
    });

    it('failure case 6: student role attempting access to admin route is blocked (403)', () => {
      const student = system.registerOrLogin('deepak@college.edu', 'STUDENT');
      const access = system.accessAdminConsole(student);
      expect(access.allowed).toBe(false);
      expect(access.status).toBe(403);
    });
  });
});
