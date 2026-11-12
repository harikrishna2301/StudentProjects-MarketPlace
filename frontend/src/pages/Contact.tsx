import React, { useState } from 'react';
import { Mail, Phone, Clock, Send, Copy, Check, MessageSquare, ShieldCheck, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { Link } from 'react-router-dom';

import studentService from '../services/studentService';

const OFFICIAL_CONTACT_EMAIL = 'support@projectkit.in';
const OFFICIAL_PHONE = '+91 98765 43210';

export const Contact: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ticketNumber, setTicketNumber] = useState<string>('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    category: 'Project Kit Support',
    subject: 'ProjectKit Support Request',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(OFFICIAL_CONTACT_EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const generateMailtoUrl = () => {
    const subject = encodeURIComponent(formData.subject || 'ProjectKit Support Request');
    const bodyText = `Hello ProjectKit Support Team,

Student Name: ${formData.fullName || '[Your Name]'}
Contact Email: ${formData.email || '[Your Email]'}
College / University: ${formData.college || '[Your College]'}
Inquiry Type: ${formData.category}

Message:
${formData.message || 'I have an inquiry regarding project kits, documentation, or technical setup.'}

---
Sent via ProjectKit Student Portal`;

    return `mailto:${OFFICIAL_CONTACT_EMAIL}?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
  };

  const [submitError, setSubmitError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitError('Please complete all required fields (Name, Email, and Message).');
      return;
    }

    try {
      setLoading(true);
      setSubmitError('');
      const res = await studentService.submitContactInquiry({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone?.trim(),
        college: formData.college?.trim(),
        category: formData.category,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });
      setTicketNumber(res?.ticketNumber || `TCK-${Date.now().toString().slice(-6)}`);
      setSubmitted(true);
    } catch (err: any) {
      console.error('Contact submission error:', err);
      // Strictly avoid displaying fake success when unsubmitted
      setSubmitted(false);
      setSubmitError(
        err?.response?.data?.message ||
        err?.message ||
        'Unable to transmit message to the support server. Please check your connection or send directly to ' + OFFICIAL_CONTACT_EMAIL
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <SEOHead
        title="Contact Academic Support & Desk — ProjectKit"
        description="Get in touch with the ProjectKit engineering support desk for project stack consultations, IEEE formatting guidelines, viva preparation, and order inquiries."
      />

      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2E9FF] dark:bg-[#25134D] border border-[#D1B8FF]/60 dark:border-[#3A2074] text-xs font-bold uppercase tracking-wider text-[#6A2FC8] dark:text-[#D1B8FF]">
          <Mail className="w-3.5 h-3.5 text-[#6A2FC8] dark:text-[#D1B8FF]" />
          <span>Official Contact Desk</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-[#F2E9FF] tracking-tight">
          How Can We Help You Succeed?
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-[#C5B4E3] leading-relaxed">
          Have questions about programming language versions, database drivers, IEEE format compliance, or your project purchase? Contact our technical engineering coordinators.
        </p>
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Direct Official Contact Action Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Primary Email Action Card */}
          <div className="card p-6 sm:p-7 space-y-6">
            <div className="flex items-center justify-between border-b border-white/20 dark:border-[#3A2074] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#F2E9FF] dark:bg-[#25134D] text-[#6A2FC8] dark:text-[#D1B8FF] flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-[#F2E9FF]">Direct Email Action</h2>
                  <p className="text-[11px] text-slate-500 dark:text-[#C5B4E3]">Opens default email client</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                Active 24/7
              </span>
            </div>

            <div className="space-y-3">
              <div className="text-xs text-slate-600 dark:text-[#C5B4E3]">
                Official Academic Support Address:
              </div>
              <div className="card p-3.5 flex items-center justify-between gap-3">
                <a
                  href={`mailto:${OFFICIAL_CONTACT_EMAIL}?subject=ProjectKit%20Support%20Request`}
                  className="font-mono text-xs font-bold text-[#6A2FC8] dark:text-[#D1B8FF] hover:underline truncate"
                  title="Click to send email"
                >
                  {OFFICIAL_CONTACT_EMAIL}
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#25134D] border border-slate-200 dark:border-[#3A2074] text-xs font-semibold text-slate-700 dark:text-[#F2E9FF] hover:bg-slate-50 dark:hover:bg-[#3A2074] transition-all shrink-0 cursor-pointer shadow-2xs"
                  aria-label="Copy email address"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-[#C5B4E3]" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Direct Send Email Button */}
              <a
                href={generateMailtoUrl()}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#6A2FC8] hover:bg-[#5824A8] active:bg-[#451B87] text-white text-xs font-semibold shadow-md shadow-[#6A2FC8]/25 transition-all hover:scale-[1.01] active:scale-[0.98]"
              >
                <Send className="w-4 h-4" />
                <span>Launch Email Client (mailto)</span>
              </a>

              {/* Fallback instruction for webmail users */}
              <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 text-[11px] text-amber-800 dark:text-amber-200 leading-relaxed flex items-start gap-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <div>
                  <strong>No mail app configured?</strong> Copy <span className="font-mono font-semibold">{OFFICIAL_CONTACT_EMAIL}</span> and paste into Gmail, Outlook Web, or your campus webmail service.
                </div>
              </div>
            </div>

            {/* Helpline and Hours */}
            <div className="pt-4 border-t border-slate-100 dark:border-[#3A2074] space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#F2E9FF] dark:bg-[#0B0720] text-[#6A2FC8] dark:text-[#D1B8FF] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-[#F2E9FF]">Student Helpline & Coordinator</div>
                  <a href={`tel:${OFFICIAL_PHONE.replace(/\s+/g, '')}`} className="text-[#6A2FC8] dark:text-[#D1B8FF] hover:underline font-mono">
                    {OFFICIAL_PHONE}
                  </a>
                  <div className="text-[11px] text-slate-500 dark:text-[#C5B4E3]">Direct academic assistance</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#F2E9FF] dark:bg-[#0B0720] text-[#6A2FC8] dark:text-[#D1B8FF] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-[#F2E9FF]">Operational Working Hours</div>
                  <div className="text-slate-600 dark:text-[#C5B4E3]">Monday – Saturday: 9:00 AM – 8:00 PM IST</div>
                  <div className="text-[11px] text-slate-500 dark:text-[#C5B4E3]">Emergency defense day support active</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pre-Formatted Inquiry Generator (7 cols) */}
        <div className="lg:col-span-7">
          <div className="card p-6 sm:p-8 space-y-6">
            <div className="border-b border-white/20 dark:border-[#3A2074] pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-[#F2E9FF]">
                Send an Online Inquiry or Pre-fill Email
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#C5B4E3]">
                Fill out the form below. You can send it directly or generate a structured email template.
              </p>
            </div>

            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-[#F2E9FF]">
                  Inquiry Dispatched Successfully!
                </h3>
                {ticketNumber && (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                    <span>Support Ticket Reference:</span>
                    <span className="text-white underline">{ticketNumber}</span>
                  </div>
                )}
                <p className="text-xs text-slate-600 dark:text-[#C5B4E3] max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-slate-900 dark:text-[#F2E9FF]">{formData.fullName}</strong>. Our academic team has recorded your inquiry for <span className="text-[#6A2FC8] dark:text-[#D1B8FF] font-semibold">{formData.category}</span> and will respond to <span className="font-mono text-slate-800 dark:text-slate-200">{formData.email}</span> within 2 hours.
                </p>
                <div className="pt-4 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        fullName: '',
                        email: '',
                        phone: '',
                        college: '',
                        category: 'Project Kit Support',
                        subject: 'ProjectKit Support Request',
                        message: '',
                      });
                      setSubmitted(false);
                    }}
                    className="px-5 py-2.5 bg-slate-100 dark:bg-[#25134D] hover:bg-slate-200 dark:hover:bg-[#3A2074] text-slate-900 dark:text-[#F2E9FF] rounded-xl text-xs font-semibold transition-all cursor-pointer"
                  >
                    Send Another Message
                  </button>
                  <Link
                    to="/projects"
                    className="px-5 py-2.5 bg-[#6A2FC8] hover:bg-[#5824A8] text-white rounded-xl text-xs font-semibold transition-all"
                  >
                    Browse Catalog
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="contact-fullname" className="text-xs font-semibold text-slate-700 dark:text-[#CBD5E1]">
                      Your Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="contact-fullname"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#3A2074] bg-white dark:bg-[#0B0720] text-slate-900 dark:text-[#F2E9FF] text-xs focus:outline-none focus:ring-2 focus:ring-[#6A2FC8] transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-email-input" className="text-xs font-semibold text-slate-700 dark:text-[#CBD5E1]">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="contact-email-input"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. john.doe@university.edu"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#3A2074] bg-white dark:bg-[#0B0720] text-slate-900 dark:text-[#F2E9FF] text-xs focus:outline-none focus:ring-2 focus:ring-[#6A2FC8] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="contact-phone" className="text-xs font-semibold text-slate-700 dark:text-[#CBD5E1]">
                      Mobile / WhatsApp (Optional)
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 00000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#3A2074] bg-white dark:bg-[#0B0720] text-slate-900 dark:text-[#F2E9FF] text-xs focus:outline-none focus:ring-2 focus:ring-[#6A2FC8] transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-category" className="text-xs font-semibold text-slate-700 dark:text-[#CBD5E1]">
                      Inquiry Category
                    </label>
                    <select
                      id="contact-category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value, subject: `ProjectKit - ${e.target.value}` })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#3A2074] bg-white dark:bg-[#0B0720] text-slate-900 dark:text-[#F2E9FF] text-xs focus:outline-none focus:ring-2 focus:ring-[#6A2FC8] transition-all"
                    >
                      <option value="Project Kit Support">Project Kit Support</option>
                      <option value="IEEE Report / Viva Voce Prep">IEEE Report / Viva Voce Prep</option>
                      <option value="Source Code Compilation Help">Source Code Compilation Help</option>
                      <option value="Custom Tech Stack Requirement">Custom Tech Stack Requirement</option>
                      <option value="Payment / Billing Inquiry">Payment / Billing Inquiry</option>
                      <option value="Faculty / Institutional Inquiries">Faculty / Institutional Inquiries</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-college" className="text-xs font-semibold text-slate-700 dark:text-[#CBD5E1]">
                    College or University Name
                  </label>
                  <input
                    id="contact-college"
                    type="text"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    placeholder="e.g. National Institute of Technology"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#3A2074] bg-white dark:bg-[#0B0720] text-slate-900 dark:text-[#F2E9FF] text-xs focus:outline-none focus:ring-2 focus:ring-[#6A2FC8] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-msg" className="text-xs font-semibold text-slate-700 dark:text-[#CBD5E1]">
                    Message & Questions <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="contact-msg"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your project requirements, technology version specifications, or deadline..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#3A2074] bg-white dark:bg-[#0B0720] text-slate-900 dark:text-[#F2E9FF] text-xs focus:outline-none focus:ring-2 focus:ring-[#6A2FC8] transition-all resize-none"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <a
                    href={generateMailtoUrl()}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs text-[#6A2FC8] dark:text-[#D1B8FF] hover:underline font-semibold"
                  >
                    <span>Open in My Mail App with this text</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#6A2FC8] hover:bg-[#5824A8] active:bg-[#451B87] text-white rounded-xl text-xs font-semibold shadow-md shadow-[#6A2FC8]/20 transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{loading ? 'Submitting Inquiry...' : 'Send Inquiry'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
