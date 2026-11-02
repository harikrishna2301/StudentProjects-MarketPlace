import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProjects } from '../context/ProjectsContext';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  CreditCard,
  Smartphone,
  Building,
  ArrowRight,
  AlertCircle,
  FileCheck2,
  HelpCircle,
} from 'lucide-react';

export const Checkout: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProjectById } = useProjects();
  const { user, completePurchase, purchasedProjectIds } = useAuth();

  const project = id ? getProjectById(id) : undefined;
  const isAlreadyOwned = project ? purchasedProjectIds.includes(project.id) : false;

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('student@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [bankName, setBankName] = useState('State Bank of India (SBI)');
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string>('');

  if (!project) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-800">Project Not Found</h2>
        <p className="text-xs text-slate-500 mt-2 mb-6">
          The requested project kit is not available in our catalog.
        </p>
        <Link
          to="/projects"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
        >
          Browse Projects
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = () => {
    setProcessing(true);
    setTimeout(() => {
      const methodLabel =
        paymentMethod === 'upi'
          ? 'UPI Instant'
          : paymentMethod === 'card'
          ? 'Credit / Debit Card'
          : `Net Banking (${bankName})`;

      const order = completePurchase(project, methodLabel);
      setLastOrderId(order.orderNumber);
      setProcessing(false);
      setOrderComplete(true);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Checkout & Project License
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Review your academic capstone kit package and confirm demonstration purchase.
        </p>
      </div>

      {orderComplete ? (
        /* Order Success State */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center shadow-sm max-w-lg mx-auto space-y-5 transition-colors">
          <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Project Kit Unlocked!
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
              Order Reference: <span className="font-bold text-slate-800 dark:text-slate-200">{lastOrderId}</span>
            </p>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm mx-auto">
            Your demonstration license is active. Full source code, IEEE reports, MySQL database dumps, and viva cheat sheets are available in your student dashboard.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/dashboard/purchases')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Go to My Purchases</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <Link
              to={`/projects/${project.id}`}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-lg transition-colors"
            >
              View Project Setup Guide
            </Link>
          </div>
        </div>
      ) : (
        /* Checkout Review Form */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Student Details & Payment Methods */}
          <div className="lg:col-span-7 space-y-6">
            {/* Disclaimer Box */}
            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/60 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold">Evaluation Sandbox Notice: </span>
                This is a frontend demonstration checkout interface. No real payment transaction is processed and no financial credentials will be charged.
              </div>
            </div>

            {/* Student Info Card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 transition-colors">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Student Licensee Information</h3>
                <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">B.Tech Verified</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Full Name</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {user?.fullName || 'Rahul Varma'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[11px]">University Email</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {user?.email || 'rahul.student@projectkit.edu'}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-400 dark:text-slate-500 block text-[11px]">College / Campus</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {user?.collegeName || 'Vellore Institute of Technology'}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 transition-colors">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Select Demonstration Payment Method</h3>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                  <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Simulated TLS 1.3</span>
                </div>
              </div>

              <div className="space-y-3">
                {/* Method 1: UPI */}
                <label
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                    paymentMethod === 'upi'
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="text-blue-600 dark:text-blue-500"
                    />
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">UPI Instant (GPay / PhonePe / Paytm)</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Fast 1-click simulation</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
                    Recommended
                  </span>
                </label>

                {/* Method 2: Card */}
                <label
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                    paymentMethod === 'card'
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="text-blue-600 dark:text-blue-500"
                    />
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Debit / Credit Card</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Visa, Mastercard, RuPay</div>
                    </div>
                  </div>
                </label>

                {/* Method 3: Net Banking */}
                <label
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                    paymentMethod === 'netbanking'
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'netbanking'}
                      onChange={() => setPaymentMethod('netbanking')}
                      className="text-blue-600 dark:text-blue-500"
                    />
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300">
                      <Building className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Net Banking</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">SBI, HDFC, ICICI, Axis</div>
                    </div>
                  </div>
                </label>
              </div>

              {/* Conditional Method Input preview */}
              {paymentMethod === 'upi' && (
                <div className="pt-2">
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Virtual Payment Address (VPA / UPI ID)
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="student@okhdfcbank"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              Kit Order Summary
            </h3>

            <div>
              <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">{project.category}</div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">{project.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Tech Stack: {project.primaryLanguage} ({project.techStack.slice(0, 3).join(', ')})
              </p>
            </div>

            {/* Line items */}
            <div className="space-y-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Standard Kit Base Price</span>
                <span className="font-mono tabular-nums text-slate-800 dark:text-slate-200">
                  ₹{project.originalPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Academic Student Subsidy</span>
                <span className="font-mono tabular-nums">
                  -₹{(project.originalPrice - project.price).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Platform Maintenance Fee</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">FREE</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                <span>Total Amount Due</span>
                <span className="font-mono tabular-nums text-blue-600 dark:text-blue-400 text-lg">
                  ₹{project.price.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Action button */}
            <div className="pt-2">
              <button
                onClick={handlePlaceOrder}
                disabled={processing}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-colors shadow-md disabled:opacity-50"
              >
                {processing ? (
                  <span>Authorizing Demonstration Purchase...</span>
                ) : (
                  <>
                    <span>Confirm & Unlock Academic Kit</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Guarantee points */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Instant ZIP package archive access</span>
              </div>
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Standard university formatting warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Ready for local installation on Windows, Mac & Linux</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
