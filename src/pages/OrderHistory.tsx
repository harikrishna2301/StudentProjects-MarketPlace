import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Receipt, Download, Search, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const OrderHistory: React.FC = () => {
  const { myOrders } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = myOrders.filter((order) => {
    const q = searchTerm.toLowerCase();
    return (
      order.orderNumber.toLowerCase().includes(q) ||
      order.projectTitle.toLowerCase().includes(q) ||
      order.paymentMethod.toLowerCase().includes(q)
    );
  });

  const downloadInvoice = (order: any) => {
    const invoiceContent = `================================================
PROJECTKIT ACADEMIC MARKETPLACE
TAX INVOICE / ORDER RECEIPT
================================================
Invoice No: ${order.invoiceId}
Order No:   ${order.orderNumber}
Date:       ${order.date}
Payment:    ${order.paymentMethod}
Status:     ${order.status}

BILLED TO:
Student ID: ${order.userId}
Platform:   ProjectKit Evaluation Portal

ITEM DESCRIPTION:
1. ${order.projectTitle}
   Domain: ${order.category}
   Price:  INR ₹${order.amount.toLocaleString('en-IN')}

TOTAL PAID: INR ₹${order.amount.toLocaleString('en-IN')}
================================================
Notice: Demonstration Invoice for academic evaluation.
Support: help@projectkit.edu
================================================`;

    const blob = new Blob([invoiceContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${order.orderNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-[#25335F] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-[#E8ECFA]">
            Order & License History
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#9AA6C7] mt-1">
            Complete transaction records, tax invoices, and verification references.
          </p>
        </div>

        {/* Search inside orders */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search orders..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-[#070D1F] border border-slate-300 dark:border-[#25335F] rounded-xl outline-none text-slate-800 dark:text-[#E8ECFA] placeholder-slate-400 dark:placeholder-[#64748B] focus:border-[#2F4BFF]"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 dark:text-[#9AA6C7] absolute left-2.5 top-2.5" />
        </div>
      </div>

      <div className="bg-white dark:bg-[#0F1830] rounded-2xl border border-slate-200 dark:border-[#25335F] shadow-xs overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#070D1F] border-b border-slate-200 dark:border-[#25335F] text-slate-500 dark:text-[#9AA6C7] uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4 font-semibold">Order Number</th>
                <th className="py-3 px-4 font-semibold">Project Title</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Payment Mode</th>
                <th className="py-3 px-4 font-semibold text-right">Amount</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#25335F]">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 dark:hover:bg-[#16224A]/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-800 dark:text-[#CBD5E1]">
                      {order.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-[#E8ECFA]">{order.projectTitle}</div>
                      <div className="text-[11px] text-slate-400 dark:text-[#9AA6C7]">{order.category}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-[#9AA6C7] font-mono tabular-nums">
                      {order.date}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-[#CBD5E1]">{order.paymentMethod}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-[#E8ECFA] tabular-nums">
                      ₹{order.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{order.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => downloadInvoice(order)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-600 dark:text-[#CBD5E1] hover:text-[#2F4BFF] dark:hover:text-[#5B7BFF] hover:bg-slate-100 dark:hover:bg-[#16224A] rounded-lg text-xs transition-colors font-medium border border-transparent hover:border-slate-200 dark:hover:border-[#25335F]"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 dark:text-[#64748B]">
                    No orders match your search term.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
