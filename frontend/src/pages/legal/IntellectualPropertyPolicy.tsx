import React from 'react';
import { LegalLayout } from '../../components/LegalLayout';
import { Copyright, ShieldAlert, FileText, CheckCircle2, AlertOctagon } from 'lucide-react';

export const IntellectualPropertyPolicy: React.FC = () => {
  return (
    <LegalLayout
      title="Copyright & Intellectual Property Policy"
      documentType="INTELLECTUAL_PROPERTY"
      version="1.0"
      lastUpdated="November 2026"
    >
      <div className="space-y-6 text-slate-700 dark:text-slate-300">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            1. Ownership of Platform Intellectual Property
          </h2>
          <p>
            The ProjectKit website, visual themes, custom UI components, branding trademarks, system icons, and automated build algorithms are the proprietary property of <span className="font-semibold text-slate-900 dark:text-white">[PROJECTKIT_LEGAL_ENTITY_NAME]</span> and are protected by Indian copyright laws (Copyright Act, 1957) and international intellectual property conventions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            2. Licensing of Project Kits & Academic Materials
          </h2>
          <p>
            ProjectKit distributes project materials under an <strong>Educational Capstone License</strong>. We explicitly do NOT claim original ownership of underlying open-source runtimes, libraries, frameworks (e.g., Spring Boot, React, Vite, MySQL Driver, Tailwind CSS), or standardized public protocols utilized within projects. All such third-party tools remain under their respective open-source licenses (MIT, Apache 2.0, BSD, GPL).
          </p>
          <p>
            Project deliverables created by our contributing engineering faculty are licensed to the individual student solely for academic study, research extensions, and classroom viva presentation.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            3. Permitted Academic Uses vs. Prohibited Commercial Acts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900/40 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Permitted Educational Use</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                <li>Compiling, running, and debugging code on personal computers.</li>
                <li>Adding new features, refactoring components, and writing tests.</li>
                <li>Presenting system architecture diagrams in your academic thesis.</li>
                <li>Defending your project implementation during viva voce exams.</li>
              </ul>
            </div>

            <div className="p-3 bg-red-50/60 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900/40 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-red-800 dark:text-red-300">
                <AlertOctagon className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span>Strictly Prohibited Infringements</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                <li>Uploading unauthenticated source code to public GitHub repos.</li>
                <li>Reselling, auctioning, or leasing packages on third-party portals.</li>
                <li>Bulk distributing files on social media or group messaging channels.</li>
                <li>Publishing ProjectKit proprietary viva question banks online.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            4. Notice & Take-Down Procedure (Copyright Infringement)
          </h2>
          <p>
            ProjectKit respects the intellectual property rights of software developers, authors, and researchers. In adherence to Section 52 of the Indian Copyright Act, 1957, and standard Notice and Takedown mechanisms:
          </p>
          <p>
            If you are a copyright owner or an agent authorized to act on behalf of one, and you believe in good faith that any project package or material hosted on ProjectKit infringes upon your copyright, please furnish a formal written notice containing:
          </p>
          <ol className="list-decimal pl-5 space-y-1 text-xs text-slate-600 dark:text-slate-400">
            <li>Physical or electronic signature of the authorized copyright holder.</li>
            <li>Specific identification of the copyrighted work claimed to have been infringed.</li>
            <li>Exact URL link and title of the project kit on ProjectKit claimed to be infringing.</li>
            <li>Sufficient contact details, including full legal name, telephone number, and physical mailing address.</li>
            <li>A statement that you have a good faith belief that disputed use is not authorized by the copyright owner, its agent, or the law.</li>
            <li>A statement made under penalty of perjury that the information in the notification is accurate.</li>
          </ol>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            5. Platform Action & Takedown Protocol
          </h2>
          <p>
            Upon receipt of a valid and complete infringement notice, ProjectKit will promptly:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600 dark:text-slate-400">
            <li>Temporarily suspend or disable public access to the challenged project within 48 hours.</li>
            <li>Notify the contributing creator or uploader of the takedown claim.</li>
            <li>Provide reasonable opportunity for counter-notification pursuant to applicable law.</li>
          </ul>
        </section>

        <section className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            6. Designated Copyright & IP Officer
          </h2>
          <p className="text-xs">
            Send all official DMCA / Copyright infringement notices to:
          </p>
          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg text-xs space-y-1 border border-slate-200 dark:border-slate-800">
            <div><strong>Designated Agent:</strong> Copyright & Compliance Officer</div>
            <div><strong>Entity:</strong> [PROJECTKIT_LEGAL_ENTITY_NAME]</div>
            <div><strong>Email:</strong> copyright@[PROJECTKIT_OFFICIAL_DOMAIN].com</div>
            <div><strong>Physical Address:</strong> [OFFICIAL_REGISTERED_OFFICE_ADDRESS]</div>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
};
