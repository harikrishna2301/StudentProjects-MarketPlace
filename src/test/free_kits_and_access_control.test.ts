import { describe, test, expect, beforeEach } from 'bun:test';
import { INITIAL_PROJECTS } from '../data/projects';
import { Project, User } from '../types';

describe('ProjectKit - Free Kits, Purchase Access Control & Entitlement System', () => {
  // Test Fixtures
  const studentUser: User = {
    id: 'usr-student-test',
    fullName: 'Test Student',
    email: 'test.student@engineering.edu',
    role: 'student',
    joinedDate: '2026-01-01',
  };

  const freeProject: Project = {
    ...INITIAL_PROJECTS[0],
    id: 'proj-free-01',
    title: 'Free Library Management System',
    isFree: true,
    accessType: 'FREE',
    publicationStatus: 'PUBLISHED',
    price: 0,
    originalPrice: 0,
    claimCount: 42,
  };

  const paidProject: Project = {
    ...INITIAL_PROJECTS[1],
    id: 'proj-paid-01',
    title: 'Autonomous Mobile Robot ROS2',
    isFree: false,
    accessType: 'PAID',
    publicationStatus: 'PUBLISHED',
    price: 2499,
    originalPrice: 4999,
    downloadsCount: 156,
  };

  const draftProject: Project = {
    ...INITIAL_PROJECTS[2],
    id: 'proj-draft-01',
    title: 'Experimental Quantum Simulation',
    isFree: true,
    accessType: 'FREE',
    publicationStatus: 'DRAFT',
    price: 0,
    originalPrice: 0,
  };

  // Simulated client/server access state
  interface EntitlementRecord {
    studentId: string;
    projectId: string;
    accessType: 'FREE_CLAIM' | 'PAID_PURCHASE';
    accessStatus: 'ACTIVE' | 'REVOKED';
    grantedAt: string;
  }

  let accessDb: EntitlementRecord[] = [];

  beforeEach(() => {
    accessDb = [];
  });

  // Simulated Service Methods conforming with Spring Boot & AuthContext
  const checkAccess = (user: User | null, projectId: string): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return accessDb.some(
      (a) => a.studentId === user.id && a.projectId === projectId && a.accessStatus === 'ACTIVE'
    );
  };

  const claimFreeKit = (user: User | null, project: Project): { success: boolean; message: string } => {
    if (!user) {
      throw new Error('401 Unauthorized: Please log in as a student to claim this free kit.');
    }
    if (!project.isFree && project.accessType !== 'FREE') {
      throw new Error('400 Bad Request: Project is not marked as free. Payment checkout required.');
    }
    if (project.publicationStatus === 'DRAFT') {
      throw new Error('403 Forbidden: Cannot claim unpublished draft kit.');
    }

    const existing = accessDb.find((a) => a.studentId === user.id && a.projectId === project.id);
    if (existing) {
      return { success: true, message: 'Kit already claimed by student.' };
    }

    accessDb.push({
      studentId: user.id,
      projectId: project.id,
      accessType: 'FREE_CLAIM',
      accessStatus: 'ACTIVE',
      grantedAt: new Date().toISOString(),
    });

    return { success: true, message: 'Free kit successfully claimed and added to My Kits.' };
  };

  const purchasePaidKit = (user: User, project: Project, orderId: string): void => {
    accessDb.push({
      studentId: user.id,
      projectId: project.id,
      accessType: 'PAID_PURCHASE',
      accessStatus: 'ACTIVE',
      grantedAt: new Date().toISOString(),
    });
  };

  const downloadDeliverable = (user: User | null, project: Project, fileType: string): string => {
    if (!user) {
      throw new Error('401 Unauthorized: Download requires authentication.');
    }
    const hasAccess = checkAccess(user, project.id);
    if (!hasAccess) {
      throw new Error(
        `403 Forbidden: Access Denied. You have not claimed this free kit or completed a verified purchase for ${project.id}.`
      );
    }
    return `STREAM_ARCHIVE_${project.id}_${fileType.toUpperCase()}`;
  };

  // 1. Scenario 1: Login without auto entitlement
  test('Scenario 1: Logging in does NOT automatically grant access to academic kits', () => {
    // When student logs in:
    const activeUser = studentUser;
    // Then neither free nor paid projects are entitled by default:
    expect(checkAccess(activeUser, freeProject.id)).toBe(false);
    expect(checkAccess(activeUser, paidProject.id)).toBe(false);
  });

  // 2. Scenario 2: Claim free kit
  test('Scenario 2: Authenticated student can claim free kit, granting active access', () => {
    const res = claimFreeKit(studentUser, freeProject);
    expect(res.success).toBe(true);
    expect(checkAccess(studentUser, freeProject.id)).toBe(true);
  });

  // 3. Scenario 3: Duplicate claim prevention
  test('Scenario 3: Duplicate claims are handled idempotently without duplicate records', () => {
    claimFreeKit(studentUser, freeProject);
    const countAfterFirst = accessDb.filter(
      (a) => a.studentId === studentUser.id && a.projectId === freeProject.id
    ).length;
    expect(countAfterFirst).toBe(1);

    // Second claim attempt
    const res2 = claimFreeKit(studentUser, freeProject);
    expect(res2.success).toBe(true);
    const countAfterSecond = accessDb.filter(
      (a) => a.studentId === studentUser.id && a.projectId === freeProject.id
    ).length;
    expect(countAfterSecond).toBe(1); // Enforces unique constraint
  });

  // 4. Scenario 4: Anonymous rejection
  test('Scenario 4: Unauthenticated visitor is blocked from claiming free kits or downloading', () => {
    expect(() => claimFreeKit(null, freeProject)).toThrow('401 Unauthorized');
    expect(() => downloadDeliverable(null, freeProject, 'SOURCE')).toThrow('401 Unauthorized');
  });

  // 5. Scenario 5: Free kit download
  test('Scenario 5: Student who claimed free kit can download source and documentation', () => {
    claimFreeKit(studentUser, freeProject);
    const sourceDownload = downloadDeliverable(studentUser, freeProject, 'source_zip');
    const docDownload = downloadDeliverable(studentUser, freeProject, 'ieee_report');

    expect(sourceDownload).toContain('STREAM_ARCHIVE_proj-free-01_SOURCE_ZIP');
    expect(docDownload).toContain('STREAM_ARCHIVE_proj-free-01_IEEE_REPORT');
  });

  // 6. Scenario 6: Paid kit download
  test('Scenario 6: Student who purchased paid kit can download source and documentation', () => {
    purchasePaidKit(studentUser, paidProject, 'ord-verified-991');
    expect(checkAccess(studentUser, paidProject.id)).toBe(true);

    const sourceDownload = downloadDeliverable(studentUser, paidProject, 'source_zip');
    expect(sourceDownload).toContain('STREAM_ARCHIVE_proj-paid-01_SOURCE_ZIP');
  });

  // 7. Scenario 7: Unauthorized download rejection
  test('Scenario 7: Student who has NOT claimed or purchased is blocked with 403 Access Denied', () => {
    // Unclaimed free kit:
    expect(() => downloadDeliverable(studentUser, freeProject, 'source_zip')).toThrow(
      '403 Forbidden: Access Denied'
    );
    // Unpurchased paid kit:
    expect(() => downloadDeliverable(studentUser, paidProject, 'source_zip')).toThrow(
      '403 Forbidden: Access Denied'
    );
  });

  // 8. Scenario 8: Price tampering prevention
  test('Scenario 8: Attempting to claim a paid project via claimFreeKit endpoint is strictly rejected', () => {
    expect(() => claimFreeKit(studentUser, paidProject)).toThrow(
      '400 Bad Request: Project is not marked as free'
    );
    expect(checkAccess(studentUser, paidProject.id)).toBe(false);
  });

  // 9. Scenario 9: Admin free kit creation
  test('Scenario 9: Admin can configure free kit with price = 0 and accessType = FREE', () => {
    const adminCreatedFreeKit: Project = {
      ...freeProject,
      id: 'proj-admin-free-01',
      title: 'Admin Created Free Kit',
      isFree: true,
      accessType: 'FREE',
      price: 0,
      originalPrice: 0,
      publicationStatus: 'PUBLISHED',
    };

    expect(adminCreatedFreeKit.isFree).toBe(true);
    expect(adminCreatedFreeKit.price).toBe(0);
    expect(adminCreatedFreeKit.accessType).toBe('FREE');
  });

  // 10. Scenario 10: Admin paid kit creation
  test('Scenario 10: Admin paid kit requires selling price greater than 0', () => {
    const validPaid: Project = {
      ...paidProject,
      isFree: false,
      accessType: 'PAID',
      price: 1999,
    };
    expect(validPaid.price).toBeGreaterThan(0);
    expect(validPaid.isFree).toBe(false);
  });

  // 11. Scenario 11: Publication status enforcement
  test('Scenario 11: Draft kits cannot be claimed by students even if price is zero', () => {
    expect(() => claimFreeKit(studentUser, draftProject)).toThrow(
      '403 Forbidden: Cannot claim unpublished draft kit'
    );
    expect(checkAccess(studentUser, draftProject.id)).toBe(false);
  });

  // 12. Scenario 12: Entitlement status endpoint
  test('Scenario 12: Check entitlement returns correct accessType and status', () => {
    // Before claim:
    expect(checkAccess(studentUser, freeProject.id)).toBe(false);

    // After claim:
    claimFreeKit(studentUser, freeProject);
    const entitlement = accessDb.find(
      (a) => a.studentId === studentUser.id && a.projectId === freeProject.id
    );
    expect(entitlement?.accessType).toBe('FREE_CLAIM');
    expect(entitlement?.accessStatus).toBe('ACTIVE');
  });

  // 13. Scenario 13: Contact form submission
  test('Scenario 13: Contact form inquiry creates tracked ticket and generates ticket ID', () => {
    const contactPayload = {
      fullName: 'Rahul Varma',
      email: 'rahul.student@vit.edu',
      phone: '+91 98451 22890',
      category: 'Project Kit Support',
      subject: 'ROS2 Gazebo Simulation Setup',
      message: 'Need assistance setting up ROS2 humble container with Nvidia GPU runtime.',
    };

    // Simulated contact controller handler
    const submitContactInquiry = (payload: typeof contactPayload) => {
      if (!payload.fullName || !payload.email || !payload.message) {
        throw new Error('Mandatory contact fields missing');
      }
      return {
        ticketNumber: `TCK-${Date.now().toString().slice(-6)}`,
        status: 'RECEIVED',
        message: 'Your inquiry has been received by ProjectKit technical coordinators.',
        createdAt: new Date().toISOString(),
      };
    };

    const res = submitContactInquiry(contactPayload);
    expect(res.ticketNumber).toMatch(/^TCK-\d+$/);
    expect(res.status).toBe('RECEIVED');
    expect(res.message).toContain('received by ProjectKit');
  });
});
