import { describe, it, expect } from 'bun:test';

interface CartItem {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  slug: string;
}

class CartStore {
  private items: CartItem[] = [];

  addItem(item: CartItem): boolean {
    if (this.items.some(i => i.id === item.id)) {
      return false; // Already in cart
    }
    this.items.push(item);
    return true;
  }

  removeItem(id: number): void {
    this.items = this.items.filter(i => i.id !== id);
  }

  clear(): void {
    this.items = [];
  }

  getItems(): CartItem[] {
    return [...this.items];
  }

  getItemCount(): number {
    return this.items.length;
  }

  getSubtotal(): number {
    return this.items.reduce((sum, i) => sum + i.price, 0);
  }

  getTotalSavings(): number {
    return this.items.reduce((sum, i) => {
      const orig = i.originalPrice ?? i.price;
      return sum + Math.max(0, orig - i.price);
    }, 0);
  }
}

describe('Cart Calculations & Item Management', () => {
  it('initializes empty cart with zero subtotal and count', () => {
    const cart = new CartStore();
    expect(cart.getItemCount()).toBe(0);
    expect(cart.getSubtotal()).toBe(0);
    expect(cart.getTotalSavings()).toBe(0);
  });

  it('calculates subtotal and discount savings accurately when adding kits', () => {
    const cart = new CartStore();

    const kit1: CartItem = {
      id: 1,
      title: 'AI Smart Attendance System',
      price: 999,
      originalPrice: 1999,
      slug: 'ai-smart-attendance-system',
    };

    const kit2: CartItem = {
      id: 2,
      title: 'IoT Smart Grid Monitoring',
      price: 1499,
      originalPrice: 2499,
      slug: 'iot-smart-grid-monitoring',
    };

    expect(cart.addItem(kit1)).toBe(true);
    expect(cart.addItem(kit2)).toBe(true);

    expect(cart.getItemCount()).toBe(2);
    // 999 + 1499 = 2498
    expect(cart.getSubtotal()).toBe(2498);
    // Savings: (1999 - 999) + (2499 - 1499) = 1000 + 1000 = 2000
    expect(cart.getTotalSavings()).toBe(2000);
  });

  it('prevents adding duplicate project kits to the cart', () => {
    const cart = new CartStore();
    const kit: CartItem = {
      id: 1,
      title: 'AI Smart Attendance System',
      price: 999,
      originalPrice: 1999,
      slug: 'ai-smart-attendance-system',
    };

    expect(cart.addItem(kit)).toBe(true);
    expect(cart.addItem(kit)).toBe(false); // Duplicate rejected
    expect(cart.getItemCount()).toBe(1);
    expect(cart.getSubtotal()).toBe(999);
  });

  it('updates subtotal and item count when removing an item', () => {
    const cart = new CartStore();
    cart.addItem({ id: 1, title: 'Kit 1', price: 999, slug: 'kit-1' });
    cart.addItem({ id: 2, title: 'Kit 2', price: 1499, slug: 'kit-2' });

    expect(cart.getItemCount()).toBe(2);
    expect(cart.getSubtotal()).toBe(2498);

    cart.removeItem(1);
    expect(cart.getItemCount()).toBe(1);
    expect(cart.getSubtotal()).toBe(1499);
  });
});
