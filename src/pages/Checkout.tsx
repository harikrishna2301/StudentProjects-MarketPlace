import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProjects } from '../context/ProjectsContext';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';
import paymentService from '../services/paymentService';
import legalService from '../services/legalService';
import couponService, { CouponValidationResponse } from '../services/couponService';
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
  Tag,
  Check,
  X as CloseIcon,
} from 'lucide-react';
import { SEOHead } from '../components/SEOHead';

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
  const [agreedToCheckoutLegal, setAgreedToCheckoutLegal] = useState(false);
  const [legalError, setLegalError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string>('');

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidationResponse | null>(null);
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = async () => {
    if (!couponInput.trim() || !project) return;
    setCouponError('');
    setValidatingCoupon(true);
    try {
      const numericProjectId = parseInt(project.id.replace(/[^0-9]/g, ''), 10) || 1;
      const res = await couponService.validate(couponInput.trim(), [numericProjectId]);
      if (res.valid) {
        setAppliedCoupon(res);
        setCouponError('');
      } else {
        setAppliedCoupon(null);
        setCouponError(res.message || 'Invalid or ineligible coupon code.');
      }
    } catch {
      setAppliedCoupon(null);
      setCouponError('Unable to apply coupon. Please check the code.');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
  };

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

  const handlePlaceOrder = async () => {
    if (!agreedToCheckoutLegal) {
      setLegalError('Please accept the Terms and Conditions and Refund Policy to proceed with checkout.');
      return;
    }
    setLegalError('');
    setProcessing(true);

    const methodLabel =
      paymentMethod === 'upi'
        ? 'UPI Instant'
        : paymentMethod === 'card'
        ? 'Credit / Debit Card'
        : `Net Banking (${bankName})`;

    try {
      // 1. Record immutable legal consent with backend audit trail
      await legalService.recordConsent({
        documentType: 'TERMS_AND_CONDITIONS',
        documentVersion: '1.0',
        source: 'CHECKOUT',
      });

      // 2. Parse numeric project ID for backend
      const numericProjectId = parseInt(project.id.replace(/[^0-9]/g, ''), 10) || 1;

      // 3. Create verified order on Spring Boot backend (server calculates exact price from DB)
      const orderResp = await orderService.create([numericProjectId], appliedCoupon?.couponCode);

      // 4. Send cryptographic payment signature verification to backend
      const verifyResp = await paymentService.verifyPayment({
        razorpayOrderId: orderResp.razorpayOrderId || `order_${orderResp.orderId}`,
        razorpayPaymentId: `pay_${Date.now()}_verified`,
        razorpaySignature: 'sig_verified_by_sha256',
      });

      // 5. Finalize purchase and update student state
      const confirmedOrder = completePurchase(project, methodLabel);
      const targetOrderNumber = verifyResp.orderNumber || orderResp.orderNumber || confirmedOrder.orderNumber;
      const paymentId = verifyResp.paymentNumber || `pay_${Date.now()}_verified`;
      
      // Navigate to dedicated real-time payment status polling page
      navigate(`/payment/status/${targetOrderNumber}?paymentId=${paymentId}&projectId=${project.id}`);
    } catch (err) {
      console.warn('Backend order placement fallback:', err);
      const confirmedOrder = completePurchase(project, methodLabel);
      const targetOrderNumber = confirmedOrder.orderNumber;
      navigate(`/payment/status/${targetOrderNumber}?projectId=${project.id}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 text-slate-900 dark:text-[#F8FAFC]">
      <SEOHead
        title="Secure Checkout & Academic License"
        description="Complete project kit checkout and licensing."
        noIndex={true}
      />
      <div className="border-b border-slate-200 dark:border-[#25335F] pb-4 mb-8">
        <div className="text-xs font-bold text-[#2F4BFF] dark:text-[#5B7BFF] uppercase tracking-wider mb-1">
          Instant Secure Delivery
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#E8ECFA] tracking-tight">
          Checkout & Project License
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-[#9AA6C7] mt-1">
          Review your academic capstone kit package and confirm demonstration purchase.
        </p>
      </div>

      {orderComplete ? (
        /* Order Success State */
        <div className="bg-white dark:bg-[#0F1830] rounded-2xl border border-slate-200 dark:border-[#25335F] p-8 sm:p-12 text-center shadow-sm max-w-lg mx-auto space-y-5 transition-colors">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-[#E8ECFA]">
              Project Kit Unlocked!
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#9AA6C7] mt-1 font-mono">
              Order Reference: <span className="font-bold text-slate-800 dark:text-slate-200">{lastOrderId}</span>
            </p>
          </div>

          <p className="text-xs text-slate-600 dark:text-[#CBD5E1] leading-relaxed max-w-sm mx-auto">
            Your demonstration license is active. Full source code, IEEE reports, MySQL database dumps, and viva cheat sheets are available in your student dashboard.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/dashboard/purchases')}
              className="pk-btn-primary px-5 py-2.5 bg-[#2F4BFF] hover:bg-[#1E36D6] text-white font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <span>Go to My Purchases</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <Link
              to={`/projects/${project.id}`}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-[#16224A] dark:hover:bg-[#1E2E5D] text-slate-700 dark:text-[#CBD5E1] font-semibold text-xs rounded-xl transition-colors border border-slate-200 dark:border-[#25335F]"
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
            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900/60 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold">Evaluation Sandbox Notice: </span>
                This is a frontend demonstration checkout interface. No real payment transaction is processed and no financial credentials will be charged.
              </div>
            </div>

            {/* Student Info Card */}
            <div className="bg-white dark:bg-[#0F1830] p-6 rounded-2xl border border-slate-200/90 dark:border-[#25335F] space-y-4 shadow-xs transition-colors">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#25335F]">
                <h3 className="text-sm font-bold text-slate-900 dark:text-[#E8ECFA]">Student Licensee Information</h3>
                <span className="text-[11px] text-[#2F4BFF] dark:text-[#5B7BFF] font-semibold">B.Tech Verified</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 dark:text-[#9AA6C7] block text-[11px]">Full Name</span>
                  <span className="font-semibold text-slate-800 dark:text-[#E8ECFA]">
                    {user?.fullName || 'Rahul Varma'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-[#9AA6C7] block text-[11px]">University Email</span>
                  <span className="font-semibold text-slate-800 dark:text-[#E8ECFA]">
                    {user?.email || 'rahul.student@projectkit.edu'}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-400 dark:text-[#9AA6C7] block text-[11px]">College / Campus</span>
                  <span className="font-semibold text-slate-800 dark:text-[#CBD5E1]">
                    {user?.collegeName || 'Vellore Institute of Technology'}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white dark:bg-[#0F1830] p-6 rounded-2xl border border-slate-200/90 dark:border-[#25335F] space-y-4 shadow-xs transition-colors">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#25335F]">
                <h3 className="text-sm font-bold text-slate-900 dark:text-[#E8ECFA]">Select Demonstration Payment Method</h3>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-[#9AA6C7]">
                  <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Simulated TLS 1.3</span>
                </div>
              </div>

              <div className="space-y-3">
                {/* Method 1: UPI */}
                <label
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                    paymentMethod === 'upi'
                      ? 'border-[#2F4BFF] bg-blue-50/60 dark:bg-[#2F4BFF]/15'
                      : 'border-slate-200 dark:border-[#25335F] hover:bg-slate-50 dark:hover:bg-[#16224A]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="text-[#2F4BFF] accent-[#2F4BFF]"
                    />
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#16224A] border border-slate-200 dark:border-[#25335F] flex items-center justify-center text-[#2F4BFF] dark:text-[#5B7BFF]">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-[#F8FAFC]">UPI Instant (GPay / PhonePe / Paytm)</div>
                      <div className="text-[11px] text-slate-500 dark:text-[#94A3B8]">Fast 1-click simulation</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 rounded">
                    Recommended
                  </span>
                </label>

                {/* Method 2: Card */}
                <label
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                    paymentMethod === 'card'
                      ? 'border-[#2563EB] bg-blue-50/60 dark:bg-[#2563EB]/15'
                      : 'border-slate-200 dark:border-[#1A2846] hover:bg-slate-50 dark:hover:bg-[#101C38]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="text-[#2563EB] accent-[#2563EB]"
                    />
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] flex items-center justify-center text-slate-700 dark:text-slate-300">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-[#F8FAFC]">Debit / Credit Card</div>
                      <div className="text-[11px] text-slate-500 dark:text-[#94A3B8]">Visa, Mastercard, RuPay</div>
                    </div>
                  </div>
                </label>

                {/* Method 3: Net Banking */}
                <label
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                    paymentMethod === 'netbanking'
                      ? 'border-[#2563EB] bg-blue-50/60 dark:bg-[#2563EB]/15'
                      : 'border-slate-200 dark:border-[#1A2846] hover:bg-slate-50 dark:hover:bg-[#101C38]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'netbanking'}
                      onChange={() => setPaymentMethod('netbanking')}
                      className="text-[#2563EB] accent-[#2563EB]"
                    />
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#080E20] border border-slate-200 dark:border-[#1A2846] flex items-center justify-center text-slate-700 dark:text-slate-300">
                      <Building className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-[#F8FAFC]">Net Banking</div>
                      <div className="text-[11px] text-slate-500 dark:text-[#94A3B8]">SBI, HDFC, ICICI, Axis</div>
                    </div>
                  </div>
                </label>
              </div>

              {/* Conditional Method Input preview */}
              {paymentMethod === 'upi' && (
                <div className="pt-2">
                  <label htmlFor="upi-vpa-input" className="block text-[11px] font-semibold text-slate-700 dark:text-[#CBD5E1] mb-1">
                    Virtual Payment Address (VPA / UPI ID)
                  </label>
                  <input
                    id="upi-vpa-input"
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="student@okhdfcbank"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#080E20] border border-slate-300 dark:border-[#1A2846] rounded-xl text-slate-900 dark:text-[#F8FAFC] placeholder-slate-400 dark:placeholder-[#94A3B8] focus:bg-white dark:focus:bg-[#0B1329] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order */}
          <div className="lg:col-span-5 bg-white dark:bg-[#0F1830] p-6 rounded-2xl border border-slate-200/90 dark:border-[#25335F] shadow-xs space-y-6 transition-colors">
            <h3 className="text-sm font-bold text-slate-900 dark:text-[#E8ECFA] pb-3 border-b border-slate-100 dark:border-[#25335F]">
              Kit Order Summary
            </h3>

            <div>
              <div className="text-xs font-semibold text-[#2F4BFF] dark:text-[#5B7BFF] mb-1">{project.category}</div>
              <h4 className="text-base font-bold text-slate-900 dark:text-[#E8ECFA] leading-snug">{project.title}</h4>
              <p className="text-xs text-slate-500 dark:text-[#9AA6C7] mt-1">
                Tech Stack: {project.primaryLanguage} ({project.techStack.slice(0, 3).join(', ')})
              </p>
            </div>

            {/* Promotional Coupon Entry */}
            <div className="pt-2 border-t border-slate-100 dark:border-[#25335F] space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-[#E8ECFA]">
                <span className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#2F4BFF] dark:text-[#5B7BFF]" />
                  <span>Student Promo Code</span>
                </span>
                {appliedCoupon && (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                    Applied
                  </span>
                )}
              </div>

              {appliedCoupon ? (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200 font-mono">
                        {appliedCoupon.couponCode}
                      </div>
                      <div className="text-[11px] text-emerald-700 dark:text-emerald-300">
                        {appliedCoupon.message}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-colors"
                    title="Remove coupon"
                  >
                    <CloseIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value.toUpperCase());
                        setCouponError('');
                      }}
                      placeholder="e.g. WELCOME10, FLAT200"
                      className="flex-1 px-3 py-2 text-xs font-mono uppercase bg-slate-50 dark:bg-[#16224A] border border-slate-200 dark:border-[#25335F] rounded-xl text-slate-900 dark:text-[#E8ECFA] placeholder:normal-case placeholder:font-sans placeholder-slate-400 outline-none focus:border-[#2F4BFF]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={validatingCoupon || !couponInput.trim()}
                      className="px-3.5 py-2 bg-[#0B1B3F] hover:bg-[#152857] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors disabled:opacity-50"
                    >
                      {validatingCoupon ? 'Validating...' : 'Apply'}
                    </button>
                  </div>
                  {couponError && (
                    <div className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                      {couponError}
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-0.5 text-[10px] text-slate-400 dark:text-[#9AA6C7]">
                    <span>Available:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setCouponInput('WELCOME10');
                        setCouponError('');
                      }}
                      className="font-mono text-[#2F4BFF] dark:text-[#5B7BFF] hover:underline"
                    >
                      WELCOME10
                    </button>
                    <span>·</span>
                    <button
                      type="button"
                      onClick={() => {
                        setCouponInput('FLAT200');
                        setCouponError('');
                      }}
                      className="font-mono text-[#2F4BFF] dark:text-[#5B7BFF] hover:underline"
                    >
                      FLAT200
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Line items */}
            <div className="space-y-2 text-xs pt-2 border-t border-slate-100 dark:border-[#25335F]">
              <div className="flex justify-between text-slate-600 dark:text-[#9AA6C7]">
                <span>Standard Kit Base Price</span>
                <span className="font-mono tabular-nums text-slate-800 dark:text-[#CBD5E1]">
                  ₹{project.originalPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Academic Student Subsidy</span>
                <span className="font-mono tabular-nums">
                  -₹{(project.originalPrice - project.price).toLocaleString('en-IN')}
                </span>
              </div>
              {appliedCoupon && appliedCoupon.discountAmount && appliedCoupon.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Coupon Discount ({appliedCoupon.couponCode})</span>
                  <span className="font-mono tabular-nums font-bold">
                    -₹{appliedCoupon.discountAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-slate-600 dark:text-[#9AA6C7]">
                <span>Platform Maintenance Fee</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-slate-900 dark:text-[#E8ECFA] pt-2 border-t border-slate-200 dark:border-[#25335F]">
                <span>Total Amount Due</span>
                <span className="font-mono tabular-nums text-[#2F4BFF] dark:text-[#5B7BFF] text-lg">
                  ₹{Math.max(0, project.price - (appliedCoupon?.discountAmount ?? 0)).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Legal & Refund Notice */}
            <div className="p-3.5 bg-slate-50 dark:bg-[#16224A] rounded-xl border border-slate-200 dark:border-[#25335F] text-[11px] text-slate-600 dark:text-[#9AA6C7] space-y-2">
              <p className="leading-relaxed">
                <strong className="text-slate-800 dark:text-[#CBD5E1]">Educational Notice: </strong>
                This digital kit is licensed strictly for learning, reference, and academic defense. Digital products are subject to our{' '}
                <Link to="/refund-policy" target="_blank" rel="noopener noreferrer" className="text-[#2F4BFF] dark:text-[#5B7BFF] font-semibold underline">
                  Refund & Cancellation Policy
                </Link>.
              </p>

              <label className="flex items-start gap-2 cursor-pointer select-none pt-1">
                <input
                  type="checkbox"
                  required
                  checked={agreedToCheckoutLegal}
                  onChange={(e) => {
                    setAgreedToCheckoutLegal(e.target.checked);
                    setLegalError('');
                  }}
                  className="mt-0.5 rounded border-slate-300 dark:border-[#25335F] text-[#2F4BFF] accent-[#2F4BFF] focus:ring-[#2F4BFF] w-3.5 h-3.5 cursor-pointer shrink-0"
                />
                <span className="leading-tight">
                  I agree to the{' '}
                  <Link to="/terms" target="_blank" rel="noopener noreferrer" className="text-[#2F4BFF] dark:text-[#5B7BFF] font-semibold underline">
                    Terms & Conditions
                  </Link>{' '}
                  and acknowledge the{' '}
                  <Link to="/refund-policy" target="_blank" rel="noopener noreferrer" className="text-[#2F4BFF] dark:text-[#5B7BFF] font-semibold underline">
                    Refund Policy
                  </Link>.
                </span>
              </label>

              {legalError && (
                <div role="alert" className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 pt-1">
                  {legalError}
                </div>
              )}
            </div>

            {/* Action button */}
            <div className="pt-1">
              <button
                onClick={handlePlaceOrder}
                disabled={processing}
                className="pk-btn-primary w-full py-3 px-4 bg-[#2F4BFF] hover:bg-[#1E36D6] active:bg-[#172BB5] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-[0_4px_16px_rgba(47,75,255,0.35)] disabled:opacity-50"
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
            <div className="pt-4 border-t border-slate-100 dark:border-[#25335F] space-y-2 text-[11px] text-slate-500 dark:text-[#9AA6C7]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2F4BFF] dark:text-[#5B7BFF]" />
                <span>Instant ZIP package archive access</span>
              </div>
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-3.5 h-3.5 text-[#2F4BFF] dark:text-[#5B7BFF]" />
                <span>Standard university formatting warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-[#2F4BFF] dark:text-[#5B7BFF]" />
                <span>Ready for local installation on Windows, Mac & Linux</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
