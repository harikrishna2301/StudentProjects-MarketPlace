import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectsContext';
import orderService, { BackendOrderResponse } from '../services/orderService';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  FileText,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { SEOHead } from '../components/SEOHead';

type StepStatus = 'waiting' | 'in_progress' | 'complete' | 'failed';

interface ProcessingStep {
  id: string;
  title: string;
  description: string;
  status: StepStatus;
}

export const PaymentStatus: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [searchParams] = useSearchParams();
  const paymentIdParam = searchParams.get('paymentId') || '';
  const projectIdParam = searchParams.get('projectId') || '';

  const navigate = useNavigate();
  const { user, completePurchase, purchasedProjectIds } = useAuth();
  const { getProjectById } = useProjects();

  const [order, setOrder] = useState<BackendOrderResponse | null>(null);
  const [overallState, setOverallState] = useState<'polling' | 'success' | 'failed' | 'timeout'>('polling');
  const [pollCount, setPollCount] = useState<number>(0);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const maxPolls = 25; // ~45 seconds maximum polling time
  const pollingIntervalRef = useRef<number | null>(null);

  const initialSteps: ProcessingStep[] = [
    {
      id: 'gateway',
      title: 'Verifying with Razorpay Gateway',
      description: 'Checking cryptographic signature and payment authorization...',
      status: 'in_progress',
    },
    {
      id: 'settlement',
      title: 'Validating Banking Settlement',
      description: 'Verifying UPI / Card / NetBanking settlement against order total...',
      status: 'waiting',
    },
    {
      id: 'licensing',
      title: 'Allocating Academic License',
      description: 'Granting student access rights and unlocking download tokens...',
      status: 'waiting',
    },
    {
      id: 'invoice',
      title: 'Issuing Tax Invoice & Email Confirmation',
      description: 'Generating official GST invoice receipt and dispatching notification...',
      status: 'waiting',
    },
  ];

  const [steps, setSteps] = useState<ProcessingStep[]>(initialSteps);

  // Sync purchase into local auth state once verified
  const finalizeLocalOwnership = useCallback((fetchedOrder: BackendOrderResponse) => {
    if (!fetchedOrder.items || fetchedOrder.items.length === 0) return;
    fetchedOrder.items.forEach((item) => {
      const proj = getProjectById(String(item.projectId));
      if (proj && !purchasedProjectIds.includes(proj.id)) {
        completePurchase(proj, 'Razorpay Verified');
      }
    });
  }, [getProjectById, purchasedProjectIds, completePurchase]);

  const pollOrderStatus = useCallback(async () => {
    if (!orderNumber) return;

    try {
      const fetchedOrder = await orderService.getByOrderNumber(orderNumber);

      if (fetchedOrder) {
        setOrder(fetchedOrder);

        if (fetchedOrder.status === 'PAID') {
          // Success reached! Mark all steps complete
          setSteps((prev) =>
            prev.map((s) => ({ ...s, status: 'complete' }))
          );
          setActiveStepIndex(4);
          setOverallState('success');
          finalizeLocalOwnership(fetchedOrder);
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
          return;
        }

        if (fetchedOrder.status === 'FAILED' || fetchedOrder.status === 'CANCELLED') {
          setSteps((prev) =>
            prev.map((s, idx) => ({
              ...s,
              status: idx === 0 ? 'failed' : 'waiting',
            }))
          );
          setOverallState('failed');
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
          return;
        }
      }

      // If still PENDING, animate progress steps smoothly
      setPollCount((prev) => {
        const next = prev + 1;
        // Advance visual steps
        if (next >= 2 && next < 5) {
          setActiveStepIndex(1);
          setSteps((s) => [
            { ...s[0], status: 'complete' },
            { ...s[1], status: 'in_progress' },
            s[2],
            s[3],
          ]);
        } else if (next >= 5 && next < 8) {
          setActiveStepIndex(2);
          setSteps((s) => [
            { ...s[0], status: 'complete' },
            { ...s[1], status: 'complete' },
            { ...s[2], status: 'in_progress' },
            s[3],
          ]);
        } else if (next >= 8 && next < 12) {
          setActiveStepIndex(3);
          setSteps((s) => [
            { ...s[0], status: 'complete' },
            { ...s[1], status: 'complete' },
            { ...s[2], status: 'complete' },
            { ...s[3], status: 'in_progress' },
          ]);
        }

        // If reach max polls without explicit failure, transition to asynchronous pending timeout
        if (next >= maxPolls) {
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
          setOverallState('timeout');
        }
        return next;
      });
    } catch (err) {
      console.warn('Status poll attempt failed (will retry):', err);
    }
  }, [orderNumber, finalizeLocalOwnership]);

  // Main polling lifecycle
  useEffect(() => {
    if (!orderNumber) {
      setOverallState('failed');
      return;
    }

    // Run first check immediately
    pollOrderStatus();

    // Start background interval
    pollingIntervalRef.current = window.setInterval(() => {
      pollOrderStatus();
    }, 2000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [orderNumber, pollOrderStatus]);

  // Manual refresh trigger
  const handleManualRefresh = async () => {
    setIsManualRefreshing(true);
    await pollOrderStatus();
    setIsManualRefreshing(false);
  };

  // Fallback project reference
  const firstProject = projectIdParam ? getProjectById(projectIdParam) : undefined;
  const projectTitle =
    order?.items?.[0]?.projectTitle || firstProject?.title || 'Academic Capstone Project Kit';
  const displayAmount = order?.totalAmount
    ? `₹${order.totalAmount.toLocaleString('en-IN')}`
    : firstProject?.price
    ? `₹${firstProject.price.toLocaleString('en-IN')}`
    : '₹1,499.00';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 text-slate-900 dark:text-[#F8FAFC]">
      <SEOHead
        title="Processing Payment & Academic License"
        description="Real-time transaction status and license provisioning."
        noIndex={true}
      />
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#9AA6C7] mb-6">
        <Link to="/projects" className="hover:text-[#2F4BFF] dark:hover:text-[#5B7BFF]">
          Catalog
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span>Checkout</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 dark:text-white font-semibold">Payment Status</span>
      </div>

      {/* Main Status Container */}
      <div className="bg-white dark:bg-[#0F1830] border border-slate-200 dark:border-[#25335F] rounded-2xl shadow-sm overflow-hidden transition-all">
        {/* Top Header Banner */}
        <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-[#25335F] bg-slate-50/50 dark:bg-[#16224A]/40">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#2F4BFF] dark:text-[#5B7BFF] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#2F4BFF] dark:text-[#5B7BFF]" />
                <span>Razorpay Encrypted Verification</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-[#E8ECFA] mt-1 tracking-tight">
                {overallState === 'success'
                  ? 'Payment Confirmed & Verified!'
                  : overallState === 'failed'
                  ? 'Payment Could Not Be Verified'
                  : overallState === 'timeout'
                  ? 'Payment Processing in Background'
                  : 'Processing Your Project Kit Purchase...'}
              </h1>
              <p className="text-xs text-slate-500 dark:text-[#9AA6C7] mt-1 font-mono">
                Order Reference: <strong className="text-slate-800 dark:text-[#E8ECFA]">{orderNumber || 'PENDING'}</strong>
              </p>
            </div>

            {/* Quick Status Pill */}
            <div className="shrink-0">
              {overallState === 'success' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  PAID & UNLOCKED
                </span>
              )}
              {overallState === 'polling' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-[#16224A] text-[#2F4BFF] dark:text-[#5B7BFF] border border-blue-200 dark:border-[#25335F]">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#2F4BFF] dark:text-[#5B7BFF]" />
                  Real-time Verification
                </span>
              )}
              {overallState === 'timeout' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  Awaiting Settlement
                </span>
              )}
              {overallState === 'failed' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                  <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  PAYMENT FAILED
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content Section: Detailed Step Progress or Result */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Order Snapshot Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0E1726] border border-slate-200 dark:border-[#1A2846] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-[#94A3B8] uppercase tracking-wider block">
                Purchased Kit Item
              </span>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                {projectTitle}
              </h2>
              {paymentIdParam && (
                <p className="text-[11px] text-slate-500 dark:text-[#94A3B8] font-mono">
                  Gateway Payment ID: <span className="text-slate-700 dark:text-slate-300">{paymentIdParam}</span>
                </p>
              )}
            </div>
            <div className="sm:text-right shrink-0">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-[#9AA6C7] uppercase tracking-wider block">
                Total Amount
              </span>
              <div className="text-lg font-black text-[#2F4BFF] dark:text-[#5B7BFF]">
                {displayAmount}
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* STATE 1: POLLING / PROCESSING STEPS */}
          {/* ============================================================== */}
          {overallState === 'polling' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Verification Lifecycle (Attempt {pollCount}/{maxPolls})
                </span>
                <span className="text-xs text-slate-500 dark:text-[#9AA6C7] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#2F4BFF] dark:bg-[#5B7BFF] animate-ping" />
                  Polling server every 2s
                </span>
              </div>

              {/* Progress Stepper List */}
              <div className="space-y-3 pt-2">
                {steps.map((step, idx) => (
                  <div
                    key={step.id}
                    className={`p-3.5 rounded-xl border transition-all flex items-start gap-3.5 ${
                      step.status === 'complete'
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 text-emerald-950 dark:text-emerald-200'
                        : step.status === 'in_progress'
                        ? 'bg-blue-50/60 dark:bg-[#16224A] border-[#2F4BFF]/40 dark:border-[#5B7BFF]/40 shadow-xs'
                        : 'bg-white dark:bg-[#0F1830] border-slate-200 dark:border-[#25335F] text-slate-400 dark:text-slate-500 opacity-60'
                    }`}
                  >
                    <div className="pt-0.5 shrink-0">
                      {step.status === 'complete' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      ) : step.status === 'in_progress' ? (
                        <RefreshCw className="w-5 h-5 text-[#2F4BFF] dark:text-[#5B7BFF] animate-spin" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-[10px] font-bold">
                          {idx + 1}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200">
                          {step.title}
                        </h3>
                        <span className="text-[10px] font-semibold uppercase tracking-wider">
                          {step.status === 'complete'
                            ? 'Verified'
                            : step.status === 'in_progress'
                            ? 'Checking...'
                            : 'Queued'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-[#94A3B8] mt-0.5">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Security Advisory note */}
              <div className="p-3.5 bg-slate-50 dark:bg-[#0E1726] rounded-xl border border-slate-200 dark:border-[#1A2846] text-[11px] text-slate-500 dark:text-[#94A3B8] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  Please keep this window open while cryptographic signatures and banking authorization finalize.
                </span>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STATE 2: SUCCESS / PURCHASE UNLOCKED */}
          {/* ============================================================== */}
          {overallState === 'success' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Confirmed Celebration Box */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Purchase Completed Successfully!
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-[#CBD5E1] max-w-md mx-auto mt-1 leading-relaxed">
                    Your digital student technology license has been recorded in the database. Full source code, circuit diagrams, reports, and viva answers are ready for instant download.
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-3.5 py-1.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>GST Tax Invoice & Confirmation Sent to {user?.email || 'your registered email'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Link
                  to="/student/purchases"
                  className="px-5 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs hover:shadow-[0_4px_14px_rgba(37,99,235,0.35)]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Project Files</span>
                </Link>

                <Link
                  to="/student/purchases"
                  className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#1A2846] dark:hover:bg-[#23355B] text-slate-800 dark:text-slate-100 font-bold text-xs flex items-center justify-center gap-2 transition-all border border-slate-200 dark:border-[#1A2846]"
                >
                  <FileText className="w-4 h-4" />
                  <span>View Tax Invoice</span>
                </Link>
              </div>

              <div className="text-center pt-2">
                <Link
                  to="/student"
                  className="text-xs text-slate-500 hover:text-slate-800 dark:text-[#94A3B8] dark:hover:text-white inline-flex items-center gap-1.5 transition-colors font-medium"
                >
                  <span>Go to Student Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STATE 3: TIMEOUT / ASYNCHRONOUS SETTLEMENT */}
          {/* ============================================================== */}
          {overallState === 'timeout' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Payment Settlement in Progress</span>
                </div>
                <p className="leading-relaxed">
                  Your banking network or UPI app has authorized the transaction, but the webhook confirmation is taking longer than usual to reconcile.
                </p>
                <p className="font-semibold text-amber-800 dark:text-amber-300">
                  Do not make a second payment. Your order reference <span className="font-mono">{orderNumber}</span> is saved and will unlock automatically once Razorpay posts confirmation.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleManualRefresh}
                  disabled={isManualRefreshing}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isManualRefreshing ? 'animate-spin' : ''}`} />
                  <span>{isManualRefreshing ? 'Checking Gateway...' : 'Refresh Status Now'}</span>
                </button>

                <Link
                  to="/student/purchases"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#1A2846] dark:hover:bg-[#23355B] text-slate-800 dark:text-slate-100 font-semibold text-xs flex items-center justify-center gap-2 transition-all text-center border border-slate-200 dark:border-[#1A2846]"
                >
                  <span>Check in My Purchases</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STATE 4: FAILED */}
          {/* ============================================================== */}
          {overallState === 'failed' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>Transaction Authorization Failed</span>
                </div>
                <p className="leading-relaxed">
                  The payment gateway reported that the transaction was canceled, declined by the issuing bank, or failed signature authentication.
                </p>
                <p className="text-[11px] text-rose-700 dark:text-rose-300">
                  <strong>Reversal Assurance:</strong> If funds were deducted from your bank or UPI wallet, Razorpay will issue an automated reversal within 3 to 5 business days.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {firstProject ? (
                  <Link
                    to={`/checkout/${firstProject.id}`}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <span>Try Payment Again</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <Link
                    to="/projects"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <span>Return to Catalog</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}

                <a
                  href="mailto:support@projectkit.in?subject=Payment%20Dispute%20Order%20"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#1A2846] dark:hover:bg-[#23355B] text-slate-800 dark:text-slate-100 font-semibold text-xs flex items-center justify-center gap-2 transition-all text-center border border-slate-200 dark:border-[#1A2846]"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Contact Billing Support</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer Support Desk */}
        <div className="p-4 sm:px-8 bg-slate-50 dark:bg-[#070D1F] border-t border-slate-200 dark:border-[#25335F] flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 dark:text-[#9AA6C7] gap-2">
          <span>
            Need help? Email <a href="mailto:support@projectkit.in" className="text-[#2F4BFF] dark:text-[#5B7BFF] underline">support@projectkit.in</a>
          </span>
          <span className="font-mono">
            Secure 256-bit SSL | Razorpay PCI-DSS Level 1
          </span>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;
