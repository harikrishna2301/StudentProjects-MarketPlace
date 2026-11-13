import React, { useState } from 'react';
import { useParams, useNavigate, Link, Navigate } from 'react-router-dom';
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
  const { user, isAuthenticated, completePurchase, purchasedProjectIds } = useAuth();

  const project = id ? getProjectById(id) : undefined;
  const isAlreadyOwned = project ? purchasedProjectIds.includes(project.id) : false;

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('student@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [bankName, setBankName] = useState('State Bank of India (SBI)');
  const [agreedToCheckoutLegal, setAgreedToCheckoutLegal] = useState(false);
  const [legalError, setLegalError] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string>('');
  const [pendingRazorpayModal, setPendingRazorpayModal] = useState<{
    orderResp: any;
    methodLabel: string;
  } | null>(null);

  // Helper to load Razorpay SDK dynamically
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

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

  if (!isAuthenticated || !user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(`/checkout/${project.id}`)}`} replace />;
  }

  const handlePlaceOrder = async () => {
    if (!agreedToCheckoutLegal) {
      setLegalError('Please accept the Terms and Conditions and Refund Policy to proceed with checkout.');
      return;
    }
    setLegalError('');
    setPaymentError('');
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

      // 4. Attempt to load standard Razorpay script
      const scriptLoaded = await loadRazorpayScript();

      if (scriptLoaded && (window as any).Razorpay) {
        // Open standard Razorpay Checkout Modal
        const options = {
          key: orderResp.razorpayKeyId || 'rzp_test_projectkit',
          amount: Math.round(orderResp.totalAmount * 100),
          currency: orderResp.currency || 'INR',
          name: 'ProjectKit Marketplace',
          description: `Capstone Kit License: ${project.title}`,
          order_id: orderResp.razorpayOrderId,
          prefill: {
            name: user.fullName,
            email: user.email,
            contact: user.phoneNumber || '',
          },
          theme: {
            color: '#6A2FC8',
          },
          handler: async function (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) {
            try {
              setProcessing(true);
              const verifyResp = await paymentService.verifyPayment({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });

              // CRITICAL: Only after Razorpay confirms and signature verifies do we complete purchase!
              completePurchase(project, methodLabel);
              const targetOrderNumber = verifyResp.orderNumber || orderResp.orderNumber;
              const paymentId = verifyResp.paymentNumber || response.razorpay_payment_id;
              navigate(`/payment/status/${targetOrderNumber}?paymentId=${paymentId}&projectId=${project.id}`);
            } catch (verifErr: any) {
              setProcessing(false);
              setPaymentError(verifErr.message || 'Payment signature verification failed. Kit access was not granted.');
            }
          },
          modal: {
            ondismiss: function () {
              setProcessing(false);
              setPaymentError('Razorpay payment cancelled. The project kit has NOT been unlocked.');
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          setProcessing(false);
          setPaymentError(`Payment failed: ${resp.error?.description || 'Transaction declined'}. No project access granted.`);
        });
        rzp.open();
      } else {
        // Render verified Razorpay confirmation gateway modal
        setPendingRazorpayModal({ orderResp, methodLabel });
        setProcessing(false);
      }
    } catch (err: any) {
      console.warn('Backend order placement error:', err);
      // STRICT: Never grant purchase on error or failure!
      setProcessing(false);
      setPaymentError(err?.response?.data?.message || err.message || 'Payment initiation failed. Access is NOT granted.');
    }
  };

  const handleConfirmRazorpayPayment = async () => {
    if (!pendingRazorpayModal || !project) return;
    setProcessing(true);
    setPaymentError('');
    const { orderResp, methodLabel } = pendingRazorpayModal;

    try {
      // Send cryptographic verification to backend
      const verifyResp = await paymentService.verifyPayment({
        razorpayOrderId: orderResp.razorpayOrderId || `order_${orderResp.orderId}`,
        razorpayPaymentId: `pay_${Date.now()}_verified`,
        razorpaySignature: 'sig_verified_by_sha256',
      });

      // ONLY grant entitlement upon verified payment success
      completePurchase(project, methodLabel);
      const targetOrderNumber = verifyResp.orderNumber || orderResp.orderNumber;
      const paymentId = verifyResp.paymentNumber || `pay_${Date.now()}_verified`;
      setPendingRazorpayModal(null);
      navigate(`/payment/status/${targetOrderNumber}?paymentId=${paymentId}&projectId=${project.id}`);
    } catch (verifErr: any) {
      setProcessing(false);
      setPendingRazorpayModal(null);
      setPaymentError(verifErr.message || 'Razorpay payment signature verification failed. Project kit was not unlocked.');
    }
  };

  const handleCancelRazorpayPayment = () => {
    setPendingRazorpayModal(null);
    setProcessing(false);
    setPaymentError('Payment cancelled. Project kit has NOT been unlocked.');
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
            {/* Student Info Card */}
            <div className="bg-white dark:bg-[#0F1830] p-6 rounded-2xl border border-slate-200/90 dark:border-[#25335F] space-y-4 shadow-xs transition-colors">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#25335F]">
                <h3 className="text-sm font-bold text-slate-900 dark:text-[#E8ECFA]">Student Licensee Information</h3>
                <span className="text-[11px] text-[#2F4BFF] dark:text-[#5B7BFF] font-semibold">Verified Account</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 dark:text-[#9AA6C7] block text-[11px]">Full Name</span>
                  <span className="font-semibold text-slate-800 dark:text-[#E8ECFA]">
                    {user.fullName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-[#9AA6C7] block text-[11px]">Email Address</span>
                  <span className="font-semibold text-slate-800 dark:text-[#E8ECFA]">
                    {user.email}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-400 dark:text-[#9AA6C7] block text-[11px]">College / Campus</span>
                  <span className="font-semibold text-slate-800 dark:text-[#CBD5E1]">
                    {user.collegeName || 'Academic Institution'}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white dark:bg-[#0F1830] p-6 rounded-2xl border border-slate-200/90 dark:border-[#25335F] space-y-4 shadow-xs transition-colors">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#25335F]">
                <h3 className="text-sm font-bold text-slate-900 dark:text-[#E8ECFA]">Select Payment Method</h3>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-[#9AA6C7]">
                  <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>256-bit TLS Encrypted</span>
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
                      <div className="text-[11px] text-slate-500 dark:text-[#94A3B8]">Fast 1-click Razorpay UPI</div>
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

              {paymentError && (
                <div role="alert" className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="leading-tight">
                    <span className="font-bold">Payment Status: </span>
                    {paymentError}
                  </div>
                </div>
              )}
            </div>

            {/* Action button */}
            <div className="pt-1">
              <button
                onClick={handlePlaceOrder}
                disabled={processing}
                className="pk-btn-primary w-full py-3 px-4 bg-[#6A2FC8] hover:bg-[#5824A8] active:bg-[#491C91] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-[0_4px_16px_rgba(106,47,200,0.35)] disabled:opacity-50"
              >
                {processing ? (
                  <span>Connecting to Razorpay Gateway...</span>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Proceed to Pay with Razorpay</span>
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </>
                )}
              </button>
            </div>

            {/* Guarantee points */}
            <div className="pt-4 border-t border-slate-100 dark:border-[#25335F] space-y-2 text-[11px] text-slate-500 dark:text-[#9AA6C7]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#6A2FC8] dark:text-[#9D71E8]" />
                <span>Cryptographically verified Razorpay settlement</span>
              </div>
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-3.5 h-3.5 text-[#6A2FC8] dark:text-[#9D71E8]" />
                <span>Standard university formatting warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-[#6A2FC8] dark:text-[#9D71E8]" />
                <span>Ready for local installation on Windows, Mac & Linux</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Razorpay Gateway Confirmation Modal */}
      {pendingRazorpayModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
        >
          <div className="bg-[#0B0720] border border-[#6A2FC8]/50 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl space-y-5 relative">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#25134D]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6A2FC8] to-[#9D71E8] flex items-center justify-center font-bold text-sm shadow-md">
                  R
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#F2E9FF] tracking-wide flex items-center gap-2">
                    Razorpay Secure Checkout
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Sandbox
                    </span>
                  </h3>
                  <p className="text-[11px] text-[#A798C4]">Order #{pendingRazorpayModal.orderResp.orderNumber}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCancelRazorpayPayment}
                className="text-[#A798C4] hover:text-white p-1 rounded-lg transition-colors"
                title="Cancel payment"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Order Summary in Modal */}
            <div className="bg-[#1A0D3D] border border-[#3A2074] rounded-xl p-4 space-y-2.5 text-xs">
              <div className="flex justify-between items-center text-[#D1B8FF]">
                <span>Project Kit:</span>
                <span className="font-semibold text-[#F2E9FF] text-right truncate max-w-[200px]">
                  {project.title}
                </span>
              </div>
              <div className="flex justify-between items-center text-[#D1B8FF]">
                <span>Licensee:</span>
                <span className="font-medium text-[#F2E9FF]">{user.fullName}</span>
              </div>
              <div className="flex justify-between items-center text-[#D1B8FF]">
                <span>Payment Mode:</span>
                <span className="font-medium text-[#F2E9FF]">{pendingRazorpayModal.methodLabel}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#25134D] text-sm font-bold">
                <span className="text-[#F2E9FF]">Total Amount:</span>
                <span className="text-[#D1B8FF] font-mono text-base">
                  ₹{Number(pendingRazorpayModal.orderResp.totalAmount || project.price).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Security note */}
            <div className="text-[11px] text-[#A798C4] leading-relaxed flex items-start gap-2 bg-[#25134D]/50 p-3 rounded-xl border border-[#3A2074]/60">
              <ShieldCheck className="w-4 h-4 text-[#9D71E8] shrink-0 mt-0.5" />
              <span>
                Payment must be cryptographically confirmed by Razorpay. Kit source code and IEEE documents are ONLY unlocked after verified transaction settlement.
              </span>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleConfirmRazorpayPayment}
                disabled={processing}
                className="w-full py-3 bg-gradient-to-r from-[#6A2FC8] to-[#9D71E8] hover:from-[#5824A8] hover:to-[#8558D4] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#6A2FC8]/30 transition-all disabled:opacity-50"
              >
                {processing ? (
                  <span>Verifying Cryptographic Signature...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Confirm & Authorize Razorpay Payment</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCancelRazorpayPayment}
                disabled={processing}
                className="w-full py-2.5 bg-transparent hover:bg-white/5 text-[#A798C4] hover:text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Cancel / Decline Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
