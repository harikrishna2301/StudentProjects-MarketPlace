import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  Shield,
  Cookie,
  RotateCcw,
  Copyright,
  HelpCircle,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye,
  Edit3,
  PlusCircle,
  Search,
  Check,
  X,
  UserX,
  ExternalLink,
  Save,
  Filter,
} from 'lucide-react';

interface LegalDoc {
  id: number;
  documentType: string;
  version: string;
  title: string;
  content: string;
  isPublished: boolean;
  requiresReview: boolean;
  publishedAt: string;
  updatedAt: string;
}

interface ConsentRecord {
  id: number;
  userId: number;
  userEmail: string;
  documentType: string;
  documentVersion: string;
  ipAddress: string;
  userAgent: string;
  acceptedAt: string;
}

interface DeletionRequest {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  requestedAt: string;
  processedAt?: string;
  adminNotes?: string;
}

export const LegalComplianceAdmin: React.FC = () => {
  const [subTab, setSubTab] = useState<'documents' | 'consents' | 'deletions'>('documents');

  // 1. Legal Documents State
  const [documents, setDocuments] = useState<LegalDoc[]>([
    {
      id: 1,
      documentType: 'TERMS_AND_CONDITIONS',
      version: '1.0',
      title: 'Terms and Conditions of Use',
      content: '## Terms and Conditions...\nEducational use only disclaimer. No grade guarantees.',
      isPublished: true,
      requiresReview: true,
      publishedAt: '2026-11-01T10:00:00Z',
      updatedAt: '2026-11-01T10:00:00Z',
    },
    {
      id: 2,
      documentType: 'PRIVACY_POLICY',
      version: '1.0',
      title: 'Privacy Policy & Personal Data Governance',
      content: '## Privacy Policy...\nIn accordance with Digital Personal Data Protection Act (DPDPA), 2023.',
      isPublished: true,
      requiresReview: true,
      publishedAt: '2026-11-01T10:00:00Z',
      updatedAt: '2026-11-01T10:00:00Z',
    },
    {
      id: 3,
      documentType: 'COOKIE_POLICY',
      version: '1.0',
      title: 'Cookie & Tracking Technologies Policy',
      content: '## Cookie Policy...\nZero-pill consent discipline. Essential, Functional, Analytics classification.',
      isPublished: true,
      requiresReview: false,
      publishedAt: '2026-11-01T10:00:00Z',
      updatedAt: '2026-11-01T10:00:00Z',
    },
    {
      id: 4,
      documentType: 'REFUND_POLICY',
      version: '1.0',
      title: 'Refund and Cancellation Policy for Digital Goods',
      content: '## Refund Policy...\nVerified duplicate debits and defective package replacement procedures.',
      isPublished: true,
      requiresReview: true,
      publishedAt: '2026-11-01T10:00:00Z',
      updatedAt: '2026-11-01T10:00:00Z',
    },
    {
      id: 5,
      documentType: 'INTELLECTUAL_PROPERTY',
      version: '1.0',
      title: 'Copyright & Intellectual Property Policy',
      content: '## IP Policy...\nSingle-user educational license. DMCA notice & takedown officer designated.',
      isPublished: true,
      requiresReview: false,
      publishedAt: '2026-11-01T10:00:00Z',
      updatedAt: '2026-11-01T10:00:00Z',
    },
    {
      id: 6,
      documentType: 'GRIEVANCE_REDRESSAL',
      version: '1.0',
      title: 'Contact & Grievance Redressal Information',
      content: '## Grievance Redressal...\nStatutory nodal officer under IT Rules 2021 & DPDPA 2023.',
      isPublished: true,
      requiresReview: true,
      publishedAt: '2026-11-01T10:00:00Z',
      updatedAt: '2026-11-01T10:00:00Z',
    },
  ]);

  // 2. Consent Audit State
  const [consents, setConsents] = useState<ConsentRecord[]>([
    {
      id: 101,
      userId: 1,
      userEmail: 'john.doe@mit.edu',
      documentType: 'TERMS_AND_CONDITIONS',
      documentVersion: '1.0',
      ipAddress: '157.48.12.94',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0.0',
      acceptedAt: '2026-11-02T14:32:10Z',
    },
    {
      id: 102,
      userId: 1,
      userEmail: 'john.doe@mit.edu',
      documentType: 'PRIVACY_POLICY',
      documentVersion: '1.0',
      ipAddress: '157.48.12.94',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0.0',
      acceptedAt: '2026-11-02T14:32:10Z',
    },
    {
      id: 103,
      userId: 2,
      userEmail: 'sneha.patel@bits-pilani.ac.in',
      documentType: 'TERMS_AND_CONDITIONS',
      documentVersion: '1.0',
      ipAddress: '115.112.44.8',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
      acceptedAt: '2026-11-03T09:15:44Z',
    },
    {
      id: 104,
      userId: 2,
      userEmail: 'sneha.patel@bits-pilani.ac.in',
      documentType: 'REFUND_POLICY',
      documentVersion: '1.0',
      ipAddress: '115.112.44.8',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
      acceptedAt: '2026-11-03T09:18:20Z',
    },
  ]);

  // 3. Deletion Requests State
  const [deletionRequests, setDeletionRequests] = useState<DeletionRequest[]>([
    {
      id: 201,
      userId: 4,
      userName: 'Kiran Deep',
      userEmail: 'kiran.deep@srmist.edu.in',
      reason: 'Graduated B.Tech in June 2026. Requesting complete removal of student account and logs under DPDPA.',
      status: 'PENDING',
      requestedAt: '2026-11-02T18:40:00Z',
    },
  ]);

  // Modals state
  const [editingDoc, setEditingDoc] = useState<LegalDoc | null>(null);
  const [processingDeletion, setProcessingDeletion] = useState<DeletionRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [consentFilter, setConsentFilter] = useState('ALL');
  const [consentSearch, setConsentSearch] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync with real backend if available
  useEffect(() => {
    fetch('/api/admin/legal/documents')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setDocuments(res.data);
        }
      })
      .catch(() => {});

    // Check localStorage for simulated deletion requests
    const localReq = localStorage.getItem('projectkit_deletion_request');
    if (localReq) {
      try {
        const parsed = JSON.parse(localReq);
        setDeletionRequests((prev) => {
          if (prev.some((r) => r.userEmail === parsed.userEmail)) return prev;
          return [
            {
              id: Date.now(),
              userId: 99,
              userName: 'Current Student',
              userEmail: parsed.userEmail,
              reason: parsed.reason,
              status: 'PENDING',
              requestedAt: parsed.requestedAt,
            },
            ...prev,
          ];
        });
      } catch {}
    }
  }, []);

  // Save Document Draft
  const handleSaveDocDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc) return;

    setDocuments((prev) =>
      prev.map((d) => (d.id === editingDoc.id ? { ...editingDoc, updatedAt: new Date().toISOString() } : d))
    );

    // Call backend API
    fetch('/api/admin/legal/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentType: editingDoc.documentType,
        version: editingDoc.version,
        title: editingDoc.title,
        content: editingDoc.content,
        isPublished: editingDoc.isPublished,
      }),
    }).catch(() => {});

    showToast(`Saved draft version ${editingDoc.version} for "${editingDoc.title}"`);
    setEditingDoc(null);
  };

  // Publish Document
  const handlePublishDoc = (docId: number) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === docId
          ? { ...d, isPublished: true, requiresReview: false, publishedAt: new Date().toISOString() }
          : d
      )
    );

    fetch(`/api/admin/legal/documents/${docId}/publish`, {
      method: 'PUT',
    }).catch(() => {});

    showToast('Legal policy published successfully and made live for students.');
  };

  // Process Deletion Request
  const handleProcessDeletion = (status: 'APPROVED' | 'REJECTED' | 'COMPLETED') => {
    if (!processingDeletion) return;

    setDeletionRequests((prev) =>
      prev.map((r) =>
        r.id === processingDeletion.id
          ? {
              ...r,
              status,
              adminNotes: adminNotes.trim(),
              processedAt: new Date().toISOString(),
            }
          : r
      )
    );

    fetch(`/api/admin/legal/deletion-requests/${processingDeletion.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminNotes: adminNotes.trim() }),
    }).catch(() => {});

    showToast(`Account deletion request marked as ${status}`);
    setProcessingDeletion(null);
    setAdminNotes('');
  };

  // Filtered consents
  const filteredConsents = consents.filter((c) => {
    const matchesType = consentFilter === 'ALL' || c.documentType === consentFilter;
    const matchesEmail = c.userEmail.toLowerCase().includes(consentSearch.toLowerCase());
    return matchesType && matchesEmail;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Info */}
      <div className="bg-white dark:bg-[#0F1830] rounded-2xl border border-slate-200 dark:border-[#25335F] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs transition-colors">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#2F4BFF] dark:text-[#5B7BFF] uppercase tracking-wider mb-1">
            <Scale className="w-4 h-4" />
            <span>Legal Governance & Compliance Module</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-[#E8ECFA]">
            Policy Versioning & Student Rights
          </h2>
          <p className="text-xs text-slate-500 dark:text-[#9AA6C7] mt-1">
            Maintain legally binding policies, audit student consent records, and process DPDPA 2023 erasure requests.
          </p>
        </div>

        {/* Sub-tab pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#070D1F] border border-slate-200 dark:border-[#25335F] rounded-xl shrink-0">
          <button
            onClick={() => setSubTab('documents')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              subTab === 'documents'
                ? 'bg-white dark:bg-[#0F1830] text-[#2F4BFF] dark:text-[#5B7BFF] shadow-xs border border-slate-200 dark:border-[#25335F]'
                : 'text-slate-600 dark:text-[#9AA6C7] hover:text-slate-900 dark:hover:text-[#E8ECFA]'
            }`}
          >
            Legal Policies ({documents.length})
          </button>
          <button
            onClick={() => setSubTab('consents')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              subTab === 'consents'
                ? 'bg-white dark:bg-[#0F1830] text-[#2F4BFF] dark:text-[#5B7BFF] shadow-xs border border-slate-200 dark:border-[#25335F]'
                : 'text-slate-600 dark:text-[#9AA6C7] hover:text-slate-900 dark:hover:text-[#E8ECFA]'
            }`}
          >
            Consent Audit Log ({consents.length})
          </button>
          <button
            onClick={() => setSubTab('deletions')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              subTab === 'deletions'
                ? 'bg-white dark:bg-[#0F1830] text-rose-600 dark:text-rose-400 shadow-xs border border-slate-200 dark:border-[#25335F]'
                : 'text-slate-600 dark:text-[#9AA6C7] hover:text-slate-900 dark:hover:text-[#E8ECFA]'
            }`}
          >
            <span>Deletion Requests</span>
            {deletionRequests.filter((r) => r.status === 'PENDING').length > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center font-bold">
                {deletionRequests.filter((r) => r.status === 'PENDING').length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: LEGAL DOCUMENTS */}
      {subTab === 'documents' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/60 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Mandatory Compliance Notice: </strong>
              All draft policy updates must be marked as requiring review by a qualified legal professional before commercial publication. Immutable consent histories are retained so that past student purchases remain bound to their accepted version.
            </div>
          </div>

          <div className="bg-white dark:bg-[#0B1329] rounded-2xl border border-slate-200 dark:border-[#1A2846] shadow-xs overflow-hidden transition-colors">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#080E20] border-b border-slate-200 dark:border-[#1A2846] text-slate-500 dark:text-[#94A3B8] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Document Title & Type</th>
                    <th className="py-3.5 px-4">Version</th>
                    <th className="py-3.5 px-4">Publication Status</th>
                    <th className="py-3.5 px-4">Legal Review</th>
                    <th className="py-3.5 px-4">Last Published</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#1A2846] text-slate-700 dark:text-[#CBD5E1]">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-[#101C38]/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-[#F8FAFC]">{doc.title}</div>
                        <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">
                          {doc.documentType}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[11px]">
                          v{doc.version}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {doc.isPublished ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Published Active</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                            <Clock className="w-3 h-3" />
                            <span>Draft Revision</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {doc.requiresReview ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded">
                            Requires Counsel Review
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                            Verified
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {new Date(doc.publishedAt || doc.updatedAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <Link
                          to={
                            doc.documentType === 'TERMS_AND_CONDITIONS'
                              ? '/terms'
                              : doc.documentType === 'PRIVACY_POLICY'
                              ? '/privacy'
                              : doc.documentType === 'COOKIE_POLICY'
                              ? '/cookies'
                              : doc.documentType === 'REFUND_POLICY'
                              ? '/refund-policy'
                              : doc.documentType === 'INTELLECTUAL_PROPERTY'
                              ? '/copyright'
                              : '/grievance'
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-500 hover:text-[#2F4BFF] dark:hover:text-[#5B7BFF] inline-block rounded"
                          title="View live policy"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => setEditingDoc({ ...doc })}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
                        >
                          Edit Version
                        </button>
                        {!doc.isPublished && (
                          <button
                            onClick={() => handlePublishDoc(doc.id)}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                          >
                            Publish
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: CONSENT AUDIT LOG */}
      {subTab === 'consents' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="relative flex-1 w-full sm:max-w-xs">
              <input
                type="text"
                value={consentSearch}
                onChange={(e) => setConsentSearch(e.target.value)}
                placeholder="Search by student email..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={consentFilter}
                onChange={(e) => setConsentFilter(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 outline-none"
              >
                <option value="ALL">All Documents</option>
                <option value="TERMS_AND_CONDITIONS">Terms & Conditions</option>
                <option value="PRIVACY_POLICY">Privacy Policy</option>
                <option value="REFUND_POLICY">Refund Policy</option>
              </select>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Student Account</th>
                  <th className="py-3 px-4">Document Accepted</th>
                  <th className="py-3 px-4">Version</th>
                  <th className="py-3 px-4">Timestamp (IST / UTC)</th>
                  <th className="py-3 px-4">IP Address & Browser</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredConsents.map((consent) => (
                  <tr key={consent.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900 dark:text-white block">{consent.userEmail}</span>
                      <span className="text-[10px] text-slate-400 font-mono">User ID: #{consent.userId}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#2F4BFF] dark:text-[#5B7BFF] font-bold">
                      {consent.documentType}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                      v{consent.documentVersion}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(consent.acceptedAt).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-[11px]">
                      <div className="font-mono text-slate-800 dark:text-slate-200">{consent.ipAddress}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-xs">{consent.userAgent}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: DELETION REQUESTS */}
      {subTab === 'deletions' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-3 text-xs text-slate-700 dark:text-slate-300">
            <UserX className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>DPDPA 2023 Erasure Mandate: </strong>
              Students may exercise their right to withdraw consent and delete their profiles. Once marked as <em>Completed</em>, the student account is deactivated, preventing future logins while retaining financial invoices for mandatory tax compliance.
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Reason / Notes</th>
                  <th className="py-3 px-4">Requested At</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {deletionRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{req.userName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{req.userEmail}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-sm">
                      <p className="line-clamp-2 text-slate-600 dark:text-slate-300">{req.reason}</p>
                      {req.adminNotes && (
                        <div className="text-[10px] text-slate-400 mt-1 italic">
                          Admin note: {req.adminNotes}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(req.requestedAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          req.status === 'PENDING'
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300'
                            : req.status === 'COMPLETED' || req.status === 'APPROVED'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {req.status === 'PENDING' && (
                        <button
                          onClick={() => {
                            setProcessingDeletion(req);
                            setAdminNotes(req.adminNotes || '');
                          }}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-[11px] rounded-lg transition-colors shadow-sm"
                        >
                          Process Request
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EDIT LEGAL DOCUMENT DRAFT MODAL */}
      {editingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0F1830] rounded-2xl border border-slate-200 dark:border-[#25335F] max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#25335F]">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Edit Legal Policy: {editingDoc.title}
                </h3>
                <span className="text-[11px] text-[#2F4BFF] dark:text-[#5B7BFF] font-mono">
                  {editingDoc.documentType}
                </span>
              </div>
              <button onClick={() => setEditingDoc(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDocDraft} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Version Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingDoc.version}
                    onChange={(e) => setEditingDoc({ ...editingDoc, version: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#070D1F] border border-slate-200 dark:border-[#25335F] rounded-lg text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Document Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingDoc.title}
                    onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#070D1F] border border-slate-200 dark:border-[#25335F] rounded-lg text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Policy Body Content (Markdown supported) *
                </label>
                <textarea
                  rows={8}
                  required
                  value={editingDoc.content}
                  onChange={(e) => setEditingDoc({ ...editingDoc, content: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#070D1F] border border-slate-200 dark:border-[#25335F] rounded-lg text-slate-900 dark:text-slate-100 font-mono resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pubCheck"
                  checked={editingDoc.isPublished}
                  onChange={(e) => setEditingDoc({ ...editingDoc, isPublished: e.target.checked })}
                  className="rounded border-slate-300 text-[#2F4BFF] focus:ring-[#2F4BFF] w-4 h-4"
                />
                <label htmlFor="pubCheck" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Publish immediately (Active for student marketplace)
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-[#25335F] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingDoc(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 pk-btn-primary bg-[#2F4BFF] hover:bg-[#1E36D6] text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
                >
                  Save Policy Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROCESS DELETION REQUEST MODAL */}
      {processingDeletion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Process Account Deletion Request
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Student: <strong>{processingDeletion.userName}</strong> ({processingDeletion.userEmail})
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
              <span className="font-semibold block mb-0.5">Submitted Reason:</span>
              <p>{processingDeletion.reason}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Administrative Notes / Compliance Justification
              </label>
              <textarea
                rows={2}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="e.g. Identity verified; personal profile purged, order receipts archived for statutory audit."
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setProcessingDeletion(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleProcessDeletion('REJECTED')}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg"
              >
                Reject Request
              </button>
              <button
                type="button"
                onClick={() => handleProcessDeletion('COMPLETED')}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Approve & Deactivate Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
