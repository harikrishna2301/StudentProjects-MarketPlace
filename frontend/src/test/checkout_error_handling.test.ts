import { describe, it, expect } from 'bun:test';

interface RazorpayPaymentResponse {
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
  error?: {
    code: string;
    description: string;
    reason: string;
  };
}

type CheckoutStep =
  | 'IDLE'
  | 'CREATING_ORDER'
  | 'WAITING_FOR_PAYMENT'
  | 'VERIFYING_PAYMENT'
  | 'SUCCESS'
  | 'FAILED';

class CheckoutStateManager {
  private currentStep: CheckoutStep = 'IDLE';
  private errorMessage: string | null = null;
  private orderNumber: string | null = null;

  getStep(): CheckoutStep {
    return this.currentStep;
  }

  getError(): string | null {
    return this.errorMessage;
  }

  getOrderNumber(): string | null {
    return this.orderNumber;
  }

  startCheckout(orderNumber: string) {
    this.currentStep = 'CREATING_ORDER';
    this.errorMessage = null;
    this.orderNumber = orderNumber;
  }

  onOrderCreated() {
    this.currentStep = 'WAITING_FOR_PAYMENT';
  }

  onPaymentSuccess(res: RazorpayPaymentResponse) {
    if (!res.razorpay_payment_id || !res.razorpay_signature) {
      this.currentStep = 'FAILED';
      this.errorMessage = 'Payment signature missing from gateway response.';
      return;
    }
    this.currentStep = 'VERIFYING_PAYMENT';
  }

  onPaymentCancelled() {
    this.currentStep = 'FAILED';
    this.errorMessage = 'Payment was cancelled. You can retry checkout at any time.';
  }

  onVerificationConfirmed() {
    this.currentStep = 'SUCCESS';
    this.errorMessage = null;
  }

  onVerificationFailed(serverErrorMsg: string) {
    this.currentStep = 'FAILED';
    this.errorMessage = serverErrorMsg || 'Payment verification failed.';
  }
}

describe('Checkout Error Handling and State Transitions', () => {
  it('transitions state through successful checkout flow', () => {
    const manager = new CheckoutStateManager();
    expect(manager.getStep()).toBe('IDLE');

    manager.startCheckout('ORD-TEST-001');
    expect(manager.getStep()).toBe('CREATING_ORDER');

    manager.onOrderCreated();
    expect(manager.getStep()).toBe('WAITING_FOR_PAYMENT');

    manager.onPaymentSuccess({
      razorpay_order_id: 'order_123',
      razorpay_payment_id: 'pay_123',
      razorpay_signature: 'sig_valid_hash',
    });
    expect(manager.getStep()).toBe('VERIFYING_PAYMENT');

    manager.onVerificationConfirmed();
    expect(manager.getStep()).toBe('SUCCESS');
    expect(manager.getError()).toBeNull();
  });

  it('handles user dismissing Razorpay modal gracefully without crashing', () => {
    const manager = new CheckoutStateManager();
    manager.startCheckout('ORD-TEST-002');
    manager.onOrderCreated();

    // User closes the Razorpay modal
    manager.onPaymentCancelled();

    expect(manager.getStep()).toBe('FAILED');
    expect(manager.getError()).toContain('cancelled');
  });

  it('handles signature mismatch during backend verification', () => {
    const manager = new CheckoutStateManager();
    manager.startCheckout('ORD-TEST-003');
    manager.onOrderCreated();
    manager.onPaymentSuccess({
      razorpay_order_id: 'order_123',
      razorpay_payment_id: 'pay_123',
      razorpay_signature: 'sig_invalid',
    });

    manager.onVerificationFailed('Invalid payment signature. Transaction flagged.');

    expect(manager.getStep()).toBe('FAILED');
    expect(manager.getError()).toBe('Invalid payment signature. Transaction flagged.');
  });
});
