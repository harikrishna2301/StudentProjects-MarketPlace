import React from 'react';
import { LegalLayout } from '../../components/LegalLayout';
import { RotateCcw, AlertTriangle, CheckCircle2, XCircle, Mail, HelpCircle } from 'lucide-react';

export const RefundPolicy: React.FC = () => {
  return (
    <LegalLayout
      title="Refund and Cancellation Policy for Digital Goods"
      documentType="REFUND_POLICY"
      version="1.0"
      lastUpdated="November 2026"
    >
      <div className="space-y-6 text-slate-700 dark:text-slate-300">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            1. Nature of Digital Deliverables
          </h2>
          <p>
            ProjectKit specializes in delivering intangible digital goods, including production-ready source code archives, IEEE format documentation manuals, relational database SQL scripts, and viva examination cheat sheets. Because digital archives are immediately downloadable and cannot be physically returned or revoked once delivered to a student workstation, distinct cancellation and refund rules apply.
          </p>
          <p>
            We do <strong>not</strong> operate a blanket &quot;all sales are final with zero refunds&quot; policy. In compliance with the Consumer Protection (E-Commerce) Rules, 2020 (India) and fair commercial standards, we honor legitimate claims as detailed below.
          </p>
        </section>

        {/* Eligible Situations */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>2. Scenarios Eligible for Full or Partial Refunds</span>
          </h2>
          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-900/40">
              <span className="font-bold text-slate-900 dark:text-white block">A. Duplicate Payments & Billing Timeouts</span>
              <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                If your account or bank statement reflects multiple debits for the same project kit due to network timeouts or double-clicking the checkout button, the duplicated charge(s) will be reversed automatically upon verification.
              </p>
            </div>

            <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-900/40">
              <span className="font-bold text-slate-900 dark:text-white block">B. Account Debited but Order Not Activated</span>
              <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                If funds were successfully deducted from your UPI or card, but due to webhook communication failures the project download was never unlocked in your student dashboard, we will either manually activate access within 4 hours or issue a full refund upon your request.
              </p>
            </div>

            <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-900/40">
              <span className="font-bold text-slate-900 dark:text-white block">C. Verified Defective Package or Missing Major Files</span>
              <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                If an uploaded project ZIP file is corrupt or materially missing core deliverables advertised in the catalog (e.g., completely absent database schemas or missing primary backend services), and our engineering support team is unable to provide a functional replacement archive within 5 business days of your report, a 100% refund will be granted.
              </p>
            </div>
          </div>
        </section>

        {/* Non-Eligible Situations */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
            <XCircle className="w-5 h-5 shrink-0" />
            <span>3. Non-Refundable Scenarios</span>
          </h2>
          <p className="text-xs">
            To prevent digital piracy and fraudulent abuse of academic licenses, refund claims cannot be approved in the following circumstances:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li>
              <strong>Change of Mind After Downloading:</strong> Once the source code archive or documentation PDF has been downloaded by the student, requests citing change of interest are ineligible.
            </li>
            <li>
              <strong>Faculty or Committee Topic Rejections:</strong> Students are responsible for verifying project feasibility, title approval, and technical domain suitability with their college guide prior to purchasing.
            </li>
            <li>
              <strong>Inadequate Student Hardware or Missing Run-times:</strong> Inability to execute software caused by student computers failing to meet listed specifications (e.g., missing Java 17, missing Node 18, or insufficient RAM) does not qualify for refunds. Our technical desk will provide installation runbooks to assist.
            </li>
            <li>
              <strong>Academic Examination Marks:</strong> Displeasure with internal college grading, syndicate marks, or viva outcomes is not grounds for reimbursement.
            </li>
          </ul>
        </section>

        {/* Refund Procedure */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            4. Step-by-Step Refund Application Procedure
          </h2>
          <p>To request an investigation for a payment issue or defective download:</p>
          <ol className="list-decimal pl-5 space-y-1 text-xs text-slate-600 dark:text-slate-400">
            <li>Send an email to <span className="font-mono text-blue-600 dark:text-blue-400">[PAYMENTS_DISPUTE_EMAIL]</span> within 7 calendar days of transaction completion.</li>
            <li>Provide your <strong>Order Reference ID</strong> (e.g., <code>PK-ORD-...</code>), registered student email, and Razorpay payment ID.</li>
            <li>Attach screenshots demonstrating the deduction proof and/or technical defect encounter.</li>
          </ol>
        </section>

        {/* Review and Processing Timelines */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            5. Dispute Review & Banking Reversal Timelines
          </h2>
          <p>
            All submitted claims are logged by our finance desk within 24 hours. Upon approval, funds are credited back directly to the original payment source (UPI VPA, Debit Card, or Net Banking account) within <strong>7 to 10 banking days</strong>, in adherence to Reserve Bank of India (RBI) and Razorpay settlement protocols.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            6. Payment Dispute Desk & Contact
          </h2>
          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg text-xs space-y-1 border border-slate-200 dark:border-slate-800">
            <div><strong>Department:</strong> Billing & Payment Disputes Desk</div>
            <div><strong>Entity:</strong> [PROJECTKIT_LEGAL_ENTITY_NAME]</div>
            <div><strong>Direct Email:</strong> billing@[PROJECTKIT_OFFICIAL_DOMAIN].com</div>
            <div><strong>Escalation Contact:</strong> [OFFICIAL_PAYMENTS_PHONE_NUMBER]</div>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
};
