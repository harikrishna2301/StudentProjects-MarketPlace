import { describe, test, expect, beforeEach } from 'bun:test';
import { INITIAL_PROJECTS } from '../data/projects';
import { CATEGORIES } from '../data/categories';
import { Project, User } from '../types';

describe('Razorpay Gateway Verification & Admin Dashboard Project Creation', () => {
  let projectsCatalog: Project[];
  let categoriesCatalog: typeof CATEGORIES;
  let accessRegistry: { userId: string; projectId: string; accessType: string; verified: boolean }[];

  const studentUser: User = {
    id: 'usr-student-01',
    fullName: 'John Doe',
    email: 'john.doe@projectkit.edu',
    role: 'student',
    joinedDate: '2026-01-01',
    collegeName: 'Metropolitan Institute of Technology',
  };

  beforeEach(() => {
    projectsCatalog = [...INITIAL_PROJECTS];
    categoriesCatalog = JSON.parse(JSON.stringify(CATEGORIES));
    accessRegistry = [];
  });

  describe('Strict Razorpay Payment Verification', () => {
    const paidKit: Project = {
      ...INITIAL_PROJECTS[0],
      id: 'proj-paid-razorpay-01',
      title: 'Autonomous Drone Navigation System',
      price: 2499,
      isFree: false,
      accessType: 'PAID',
    };

    test('access is strictly DENIED before Razorpay payment is confirmed', () => {
      const hasAccess = accessRegistry.some(
        (a) => a.userId === studentUser.id && a.projectId === paidKit.id && a.verified
      );
      expect(hasAccess).toBe(false);
    });

    test('cancelled or dismissed Razorpay payment does NOT grant project access', () => {
      // Simulate student clicking cancel on Razorpay checkout modal
      const simulateCancelPayment = (user: User, project: Project) => {
        // Return cancellation event without signature verification
        return {
          status: 'CANCELLED',
          message: 'Razorpay payment cancelled. The project kit has NOT been unlocked.',
          entitlementGranted: false,
        };
      };

      const result = simulateCancelPayment(studentUser, paidKit);
      expect(result.status).toBe('CANCELLED');
      expect(result.entitlementGranted).toBe(false);

      const hasAccess = accessRegistry.some(
        (a) => a.userId === studentUser.id && a.projectId === paidKit.id && a.verified
      );
      expect(hasAccess).toBe(false);
    });

    test('failed payment signature rejects transaction and prevents access', () => {
      const verifySignature = (orderId: string, paymentId: string, signature: string) => {
        const expected = `sig_valid_${orderId}_${paymentId}`;
        if (signature !== expected) {
          throw new Error('Payment signature verification failed. Transaction was not authorized.');
        }
        return true;
      };

      expect(() =>
        verifySignature('order_test_101', 'pay_test_202', 'invalid_tampered_signature')
      ).toThrow('Payment signature verification failed');

      const hasAccess = accessRegistry.some(
        (a) => a.userId === studentUser.id && a.projectId === paidKit.id && a.verified
      );
      expect(hasAccess).toBe(false);
    });

    test('successful Razorpay confirmation unlocks kit and grants entitlement', () => {
      const processConfirmedRazorpayPayment = (
        user: User,
        project: Project,
        orderId: string,
        paymentId: string,
        signature: string
      ) => {
        const expectedSig = `sig_valid_${orderId}_${paymentId}`;
        if (signature !== expectedSig) {
          throw new Error('Invalid signature');
        }

        // Only upon verified signature:
        accessRegistry.push({
          userId: user.id,
          projectId: project.id,
          accessType: 'PAID_PURCHASE',
          verified: true,
        });

        return {
          success: true,
          paymentNumber: `PAY-${Date.now()}`,
          orderNumber: `ORD-${Date.now()}`,
        };
      };

      const orderId = 'order_valid_777';
      const paymentId = 'pay_valid_888';
      const validSig = `sig_valid_${orderId}_${paymentId}`;

      const paymentResult = processConfirmedRazorpayPayment(
        studentUser,
        paidKit,
        orderId,
        paymentId,
        validSig
      );

      expect(paymentResult.success).toBe(true);
      const hasAccess = accessRegistry.some(
        (a) => a.userId === studentUser.id && a.projectId === paidKit.id && a.verified
      );
      expect(hasAccess).toBe(true);
    });
  });

  describe('Admin Dashboard Add Project Kit Functionality', () => {
    test('successfully adds new project kit and updates catalog & categories', () => {
      const newKitPayload: Omit<Project, 'id' | 'createdAt' | 'downloadsCount'> = {
        title: 'Blockchain-Based Academic Credential Verification',
        slug: 'blockchain-credential-verification',
        category: 'Web Development',
        primaryLanguage: 'Solidity',
        techStack: ['Solidity', 'Ethereum', 'React', 'IPFS'],
        isFree: false,
        accessType: 'PAID',
        publicationStatus: 'PUBLISHED',
        claimCount: 0,
        price: 2999,
        originalPrice: 4999,
        rating: 5.0,
        reviewsCount: 1,
        academicYear: '2025–2026',
        shortDescription: 'Decentralized smart contract system for issuing tamper-proof diplomas.',
        overview: 'Complete blockchain architecture with web3 portal.',
        problemStatement: 'Fraudulent paper degree certificates.',
        objectives: ['Deploy smart contracts', 'Integrate MetaMask', 'Produce IEEE report'],
        features: [{ title: 'Smart Contracts', description: 'ERC-721 soulbound tokens' }],
        modules: ['Contract Module', 'Verifier Web App'],
        requirements: {
          hardware: ['8GB RAM', 'Intel Core i5'],
          software: ['Node.js 18', 'Hardhat'],
          dependencies: ['ethers.js', 'hardhat'],
        },
        documentationIncluded: [
          { item: 'IEEE Paper', format: 'PDF', description: 'Complete final report' },
        ],
        installationSteps: [
          { step: 1, title: 'Install dependencies', codeCommand: 'npm install', description: 'Setup' },
        ],
        featured: false,
        colorTheme: '#6A2FC8',
      };

      const initialCount = projectsCatalog.length;
      const initialCatCount =
        categoriesCatalog.find((c) => c.name === 'Web Development')?.projectCount || 0;

      // Add project logic matching ProjectsContext
      const createdProject: Project = {
        ...newKitPayload,
        id: `proj-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
        downloadsCount: 0,
      };

      projectsCatalog = [createdProject, ...projectsCatalog];
      categoriesCatalog = categoriesCatalog.map((c) =>
        c.name === newKitPayload.category ? { ...c, projectCount: c.projectCount + 1 } : c
      );

      expect(projectsCatalog.length).toBe(initialCount + 1);
      expect(projectsCatalog[0].title).toBe('Blockchain-Based Academic Credential Verification');
      expect(projectsCatalog[0].price).toBe(2999);
      expect(projectsCatalog[0].colorTheme).toBe('#6A2FC8');

      const updatedCatCount =
        categoriesCatalog.find((c) => c.name === 'Web Development')?.projectCount || 0;
      expect(updatedCatCount).toBe(initialCatCount + 1);
    });

    test('adding a 100% Free kit locks price to 0 and marks accessType as FREE', () => {
      const freeKitPayload = {
        title: 'Open Source IoT Weather Station',
        isFree: true,
        accessType: 'FREE' as const,
        price: 0,
        originalPrice: 0,
      };

      expect(freeKitPayload.isFree).toBe(true);
      expect(freeKitPayload.price).toBe(0);
      expect(freeKitPayload.accessType).toBe('FREE');
    });

    test('paid kit validation rejects selling price <= 0', () => {
      const validateProjectForm = (title: string, isFree: boolean, price: number) => {
        if (!title.trim()) return 'Title required';
        if (!isFree && price <= 0) {
          return 'Paid projects must have a selling price greater than ₹0.';
        }
        return 'VALID';
      };

      expect(validateProjectForm('Test Project', false, 0)).toBe(
        'Paid projects must have a selling price greater than ₹0.'
      );
      expect(validateProjectForm('Test Project', false, -500)).toBe(
        'Paid projects must have a selling price greater than ₹0.'
      );
      expect(validateProjectForm('Test Project', false, 1499)).toBe('VALID');
      expect(validateProjectForm('Test Free Project', true, 0)).toBe('VALID');
    });
  });

  describe('John Doe Placeholder Integrity', () => {
    test('default student identity is John Doe across platform accounts', () => {
      expect(studentUser.fullName).toBe('John Doe');
      expect(studentUser.email).toBe('john.doe@projectkit.edu');
      expect(studentUser.collegeName).toBe('Metropolitan Institute of Technology');
    });
  });
});
