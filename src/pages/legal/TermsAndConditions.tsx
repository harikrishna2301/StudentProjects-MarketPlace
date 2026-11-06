import React from 'react';
import { LegalLayout } from '../../components/LegalLayout';
import { Link } from 'react-router-dom';
import { AlertCircle, ShieldAlert, BookOpen, Scale } from 'lucide-react';

export const TermsAndConditions: React.FC = () => {
  return (
    <LegalLayout
      title="Terms and Conditions of Use"
      documentType="TERMS_AND_CONDITIONS"
      version="1.0"
      lastUpdated="November 2026"
    >
      <div className="space-y-6 text-slate-700 dark:text-slate-300">
        {/* Section 1 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>1. Introduction & Acceptance of Agreement</span>
          </h2>
          <p>
            Welcome to ProjectKit (operated by <span className="font-semibold text-slate-900 dark:text-white">[PROJECTKIT_LEGAL_ENTITY_NAME]</span>, hereinafter referred to as the &quot;Platform&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). These Terms and Conditions constitute a legally binding agreement between you (&quot;Student&quot;, &quot;User&quot;, &quot;Licensee&quot;, or &quot;You&quot;) and the Platform governing your access to and use of our academic marketplace, project kits, documentation, source code repositories, and online digital checkout services.
          </p>
          <p>
            By creating an account, clicking &quot;I Agree&quot;, browsing our project catalog, or executing a digital purchase, you explicitly acknowledge that you have read, understood, and consented to be bound by these Terms in full, together with our{' '}
            <Link to="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Privacy Policy
            </Link>{' '}
            and{' '}
            <Link to="/refund-policy" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Refund Policy
            </Link>.
          </p>
        </section>

        {/* Section 2: Educational Disclaimer */}
        <section className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
          <h2 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>2. Strict Educational & Non-Grading Guarantee Disclaimer</span>
          </h2>
          <p className="text-xs leading-relaxed">
            All project kits, architectural schematics, IEEE standard SRS reports, viva voce answer guides, and database dumps hosted on ProjectKit are provided solely and strictly for <strong>EDUCATIONAL, RESEARCH, AND SELF-LEARNING PURPOSES</strong>.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>
              <strong>No Academic Guarantee:</strong> ProjectKit does NOT advertise, represent, or warrant that purchased materials constitute guaranteed original work for direct submission without citation or modification. We do NOT guarantee academic grades, marks, syndicate approvals, internal assessment outcomes, or degree awards.
            </li>
            <li>
              <strong>Institutional Honor Codes:</strong> You remain solely responsible for adhering to your respective university, college, and institution&apos;s academic integrity rules, plagiarism thresholds, and examination guidelines.
            </li>
            <li>
              <strong>Defense Preparation:</strong> The student assumes full responsibility for compiling, executing, modifying, and verbally defending all technical project deliverables during oral examinations and viva voce presentations.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            3. Eligibility to Use the Platform
          </h2>
          <p>
            To use this Platform and purchase project kits, you must be at least 18 years of age or possess valid consent and supervision from a parent or legal guardian. By registering, you warrant that all information supplied is truthful, complete, and pertains to your personal academic enrollment.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            4. Student Account Registration & Security Responsibilities
          </h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials, password, and session access tokens. You agree to:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>Immediately notify our security desk at <span className="font-mono text-blue-600 dark:text-blue-400">[SECURITY_EMAIL_ADDRESS]</span> of any unauthorized account activity.</li>
            <li>Never transfer, lease, or lend your account access to third parties.</li>
            <li>Ensure that logout is performed upon completing sessions on shared university laboratory workstations.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            5. Project Browsing, Pricing & Payment Terms
          </h2>
          <p>
            Project prices displayed on the Platform are in Indian Rupees (INR) and are subject to change without notice prior to checkout. Payments are securely processed through our authorized PCI-DSS compliant payment partner, <strong>Razorpay</strong>.
          </p>
          <p>
            We do not store your financial payment card credentials, CVVs, or bank authentication passwords on our servers. All transactions are subject to validation by your issuing bank and Razorpay&apos;s fraud monitoring systems.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            6. Digital Product Delivery & Download Permissions
          </h2>
          <p>
            Upon successful payment verification and signature authentication by Razorpay, the purchased project kit is automatically unlocked in your Student Dashboard. You are granted permission to:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>Download the complete project source code ZIP package archive.</li>
            <li>Download the standard IEEE 830 compliant documentation report (PDF format).</li>
            <li>Review installation instructions, hardware/software specifications, and database setup scripts.</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            7. Strict Restrictions on Redistribution & Resale
          </h2>
          <p>
            Purchasing a project kit grants you a personal, single-user educational license. You are <strong>STRICTLY PROHIBITED</strong> from:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>Publishing purchased project source code in public GitHub, GitLab, or Bitbucket repositories without private repository controls.</li>
            <li>Distributing, reselling, or batch-sharing project packages on Telegram, WhatsApp, Discord, or peer-to-peer file sharing networks.</li>
            <li>Sub-licensing or commercializing any deliverable for monetary gain.</li>
          </ul>
        </section>

        {/* Section 8 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            8. Prohibited Platform Activities
          </h2>
          <p>You agree not to engage in any of the following activities:</p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>Attempting unauthorized penetration testing, vulnerability scanning, or DDoS attacks against our servers.</li>
            <li>Using automated web scrapers, bots, or spiders to harvest catalog contents or prices.</li>
            <li>Falsifying payment confirmations or fabricating cryptographic Razorpay HMAC signatures.</li>
          </ul>
        </section>

        {/* Section 9 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            9. Account Suspension & Termination
          </h2>
          <p>
            We reserve the right to suspend or terminate accounts without prior refund in cases of confirmed fraud, intellectual property violations, or abusive behavior toward platform support staff.
          </p>
        </section>

        {/* Section 10 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            10. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by applicable Indian law, ProjectKit, its founders, and partners shall not be liable for any indirect, incidental, punitive, or consequential damages arising out of academic project evaluations, viva examination results, software compilation errors on outdated student operating systems, or platform downtimes. In all circumstances, our maximum aggregate liability shall not exceed the amount actually paid by you for the specific project kit in dispute.
          </p>
        </section>

        {/* Section 11 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            11. Governing Law & Dispute Resolution Jurisdiction
          </h2>
          <p>
            These Terms shall be interpreted, governed, and enforced in accordance with the substantive laws of India, without regard to conflict of law principles. Any dispute arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts in <span className="font-semibold text-slate-900 dark:text-white">[OFFICIAL_JURISDICTION_CITY]</span>, India.
          </p>
        </section>

        {/* Section 12 */}
        <section className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            12. Contact Information for Legal Notices
          </h2>
          <p className="text-xs">
            For formal legal inquiries, notice of breaches, or contractual inquiries, please address correspondence to:
          </p>
          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg text-xs space-y-1 border border-slate-200 dark:border-slate-800">
            <div><strong>Entity:</strong> [PROJECTKIT_LEGAL_ENTITY_NAME]</div>
            <div><strong>Attn:</strong> Legal & Compliance Desk</div>
            <div><strong>Email:</strong> legal@[PROJECTKIT_OFFICIAL_DOMAIN].com</div>
            <div><strong>Address:</strong> [OFFICIAL_REGISTERED_OFFICE_ADDRESS]</div>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
};
