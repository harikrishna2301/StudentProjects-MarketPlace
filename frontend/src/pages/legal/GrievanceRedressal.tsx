import React from 'react';
import { LegalLayout } from '../../components/LegalLayout';
import { HelpCircle, Mail, Phone, MapPin, Clock, ShieldCheck } from 'lucide-react';

export const GrievanceRedressal: React.FC = () => {
  return (
    <LegalLayout
      title="Contact & Grievance Redressal Information"
      documentType="GRIEVANCE_REDRESSAL"
      version="1.0"
      lastUpdated="November 2026"
    >
      <div className="space-y-6 text-slate-700 dark:text-slate-300">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            1. Grievance Redressal Mandate
          </h2>
          <p>
            In compliance with the <strong>Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</strong>, and the <strong>Digital Personal Data Protection Act, 2023</strong>, ProjectKit has designated a nodal Grievance Redressal Officer to receive and resolve student complaints, privacy concerns, copyright disputes, and payment issues in a structured, timely manner.
          </p>
        </section>

        {/* Nodal Officer Card */}
        <section className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                Designated Statutory Authority
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                Nodal Grievance Redressal Officer
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Officer Name</span>
              <span className="font-semibold text-slate-900 dark:text-white">[GRIEVANCE_OFFICER_NAME]</span>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Designation</span>
              <span className="font-semibold text-slate-900 dark:text-white">Head of Student Grievance & Compliance</span>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Official Entity Name</span>
              <span className="font-semibold text-slate-900 dark:text-white">[PROJECTKIT_LEGAL_ENTITY_NAME]</span>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Dedicated Grievance Email</span>
              <a
                href="mailto:grievance@[PROJECTKIT_OFFICIAL_DOMAIN].com"
                className="font-mono text-blue-600 dark:text-blue-400 hover:underline"
              >
                grievance@[PROJECTKIT_OFFICIAL_DOMAIN].com
              </a>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Registered Office Address</span>
              <span className="font-semibold text-slate-900 dark:text-white">[OFFICIAL_REGISTERED_OFFICE_ADDRESS]</span>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Official Phone Contact</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">[OFFICIAL_GRIEVANCE_PHONE_NUMBER]</span>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Working Hours</span>
              <span className="font-semibold text-slate-900 dark:text-white">Monday to Friday (10:00 AM – 6:00 PM IST)</span>
            </div>
          </div>
        </section>

        {/* SLA Timelines */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>2. Statutory Escalation & Resolution Timelines</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-bold text-blue-600 dark:text-blue-400">Within 24 Hours</span>
              <p className="text-slate-600 dark:text-slate-400">
                Formal electronic receipt and ticket number issued to the student for tracking purposes.
              </p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Within 15 Days</span>
              <p className="text-slate-600 dark:text-slate-400">
                Thorough investigation, factual review, and written redressal or final dispute determination communicated.
              </p>
            </div>
          </div>
        </section>

        {/* Specialized Contact Desks */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            3. Specialized Student Support Desks
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white block">Technical & Code Setup</span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">Maven builds, database imports, and runtime setup assistance.</p>
              <div className="font-mono text-blue-600 dark:text-blue-400 text-[11px] pt-1">support@[PROJECTKIT_OFFICIAL_DOMAIN].com</div>
            </div>

            <div className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white block">Billing & Refunds</span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">Razorpay transaction tracking, failed debits, duplicate charge reversals.</p>
              <div className="font-mono text-blue-600 dark:text-blue-400 text-[11px] pt-1">billing@[PROJECTKIT_OFFICIAL_DOMAIN].com</div>
            </div>

            <div className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white block">Academic Integrity</span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">Fair educational licensing, citation inquiries, copyright takedowns.</p>
              <div className="font-mono text-blue-600 dark:text-blue-400 text-[11px] pt-1">legal@[PROJECTKIT_OFFICIAL_DOMAIN].com</div>
            </div>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
};
