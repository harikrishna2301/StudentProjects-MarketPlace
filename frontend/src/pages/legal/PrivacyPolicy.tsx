import React from 'react';
import { LegalLayout } from '../../components/LegalLayout';
import { Link } from 'react-router-dom';
import { Shield, Lock, FileCheck2, UserX } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <LegalLayout
      title="Privacy Policy & Personal Data Governance"
      documentType="PRIVACY_POLICY"
      version="1.0"
      lastUpdated="November 2026"
    >
      <div className="space-y-6 text-slate-700 dark:text-slate-300">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            1. Commitment to Personal Data Protection
          </h2>
          <p>
            <span className="font-semibold text-slate-900 dark:text-white">[PROJECTKIT_LEGAL_ENTITY_NAME]</span> (&quot;ProjectKit&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is deeply committed to safeguarding the privacy and digital autonomy of students who utilize our academic projects marketplace.
          </p>
          <p>
            This Privacy Policy sets forth our principles and practices governing the collection, processing, transfer, storage, and erasure of personal data in compliance with the <strong>Digital Personal Data Protection Act (DPDPA), 2023</strong> (India), the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and where applicable, international data governance standards.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            2. Personal Information Collected & Lawful Bases
          </h2>
          <p>
            We process digital personal data solely on lawful grounds, specifically for the performance of our contract with you (delivering purchased educational materials) and upon your explicit consent. The data collected comprises:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white block">A. Registration Information</span>
              <p className="text-slate-600 dark:text-slate-400">
                Full legal name, valid university or personal email address, mobile contact number, and engineering institution or college campus name.
              </p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white block">B. Order & License History</span>
              <p className="text-slate-600 dark:text-slate-400">
                Project kit identifiers purchased, transaction timestamps, payment reference numbers, order monetary totals, and delivery status.
              </p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white block">C. Technical & Security Logs</span>
              <p className="text-slate-600 dark:text-slate-400">
                IP address, device browser type, and cryptographic authentication tokens (JWT) used to prevent unauthorized downloads.
              </p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white block">D. Consent Records</span>
              <p className="text-slate-600 dark:text-slate-400">
                Immutable records detailing the exact version of Terms and Privacy Policy accepted, along with timestamps and client metadata.
              </p>
            </div>
          </div>
        </section>

        <section className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
          <h2 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
            <Shield className="w-4 h-4 shrink-0" />
            <span>3. Financial Data Exemption: Zero Card Storage</span>
          </h2>
          <p className="text-xs leading-relaxed">
            ProjectKit does <strong>NOT</strong> collect, view, or retain your payment card numbers, CVV codes, bank login credentials, or UPI MPINs. All checkout operations are handled through encrypted server-to-server APIs with <strong>Razorpay Software Private Limited</strong>, which maintains PCI-DSS Level 1 compliance.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            4. Purpose of Information Processing
          </h2>
          <p>Your personal data is used strictly for the following legitimate purposes:</p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>Creating, verifying, and securing your student marketplace account.</li>
            <li>Authorizing and streaming ZIP source packages and documentation reports.</li>
            <li>Verifying digital payment transactions and issuing downloadable GST receipts.</li>
            <li>Auditing legal compliance and preventing unauthorized commercial redistribution.</li>
            <li>Responding to student support tickets and academic setup inquiries.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            5. Data Sharing with Third-Party Providers
          </h2>
          <p>
            We do <strong>not</strong> sell, rent, or monetize your personal data. We disclose personal information strictly on a need-to-know basis to:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li><strong>Payment Gateways:</strong> Razorpay (to process and verify checkout transactions).</li>
            <li><strong>Cloud Infrastructure:</strong> Secure cloud host data centers maintaining strict technical and organizational measures (SOC 2, ISO 27001).</li>
            <li><strong>Law Enforcement:</strong> Solely upon receipt of a lawful order or warrant issued by a competent court or governmental agency in India.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            6. Data Retention & Security Measures
          </h2>
          <p>
            We retain personal data for the duration of your active account lifecycle. Order financial records and consent receipts are retained for the statutory retention period required by Indian accounting and taxation laws (typically 7 years).
          </p>
          <p>
            We enforce industry-standard security safeguards, including TLS 1.3 transit encryption, BCrypt salted password hashing, stateless JWT authorization, and strict directory sandboxing to prevent file traversal attacks.
          </p>
        </section>

        <section className="space-y-3 pt-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <UserX className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>7. Your Rights under DPDPA 2023 & Account Deletion</span>
          </h2>
          <p>Under the Digital Personal Data Protection Act, 2023, you have the right to:</p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li><strong>Access & Summary:</strong> Request a summary of personal data processed by the platform.</li>
            <li><strong>Correction & Erasure:</strong> Request rectification of inaccurate details or erasure of personal information that is no longer necessary for service delivery.</li>
            <li><strong>Account Deletion:</strong> You may submit an Account Deletion Request directly within your{' '}
              <Link to="/dashboard/profile" className="text-blue-600 dark:text-blue-400 underline font-semibold">
                Profile Settings
              </Link>{' '}
              portal. Legitimate requests are reviewed and executed within 30 days.
            </li>
          </ul>
        </section>

        <section className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            8. Privacy Grievance Officer & Contact
          </h2>
          <p className="text-xs">
            For privacy inquiries, rights enforcement, or DPDPA inquiries, please contact our designated Data Protection & Grievance Officer:
          </p>
          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg text-xs space-y-1 border border-slate-200 dark:border-slate-800">
            <div><strong>Officer Name:</strong> [GRIEVANCE_OFFICER_NAME]</div>
            <div><strong>Designation:</strong> Data Protection & Grievance Officer</div>
            <div><strong>Entity:</strong> [PROJECTKIT_LEGAL_ENTITY_NAME]</div>
            <div><strong>Email:</strong> privacy@[PROJECTKIT_OFFICIAL_DOMAIN].com</div>
            <div><strong>Address:</strong> [OFFICIAL_REGISTERED_OFFICE_ADDRESS]</div>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
};
