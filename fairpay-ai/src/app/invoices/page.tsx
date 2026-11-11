'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import AiGeneratorModal from '@/components/AiGeneratorModal';
import {
    FileText,
    Plus,
    Download,
    CheckCircle2,
    Clock,
    AlertCircle,
    Sparkles,
    CreditCard,
    Inbox
} from 'lucide-react';

interface Invoice {
    id: string;
    invoiceNumber: string;
    client: string;
    clientEmail: string;
    amount: number;
    issueDate: string;
    dueDate: string;
    status: 'PAID' | 'PENDING' | 'ESCROW_LOCKED';
    paymentMethod: string;
}

export default function InvoicesPage() {
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [invoices, setInvoices] = useState<Invoice[]>([]);

    const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalSettled = invoices
        .filter((inv) => inv.status === 'PAID')
        .reduce((sum, inv) => sum + inv.amount, 0);
    const heldInEscrow = invoices
        .filter((inv) => inv.status === 'ESCROW_LOCKED')
        .reduce((sum, inv) => sum + inv.amount, 0);

    const handlePaySandbox = (invId: string) => {
        setInvoices((prev) =>
            prev.map((inv) => (inv.id === invId ? { ...inv, status: 'PAID' } : inv))
        );
        alert('Payment confirmed via PayPal Sandbox checkout! Status changed to PAID.');
    };

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            <Sidebar onOpenAiModal={() => setIsAiModalOpen(true)} />

            <div className="flex-1 flex flex-col min-w-0">
                <Header />

                <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">My Invoices</h2>
                            <p className="text-sm text-slate-500 mt-0.5">
                                Manage, send, and track client invoice payouts with automatic milestone reconciliation.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsAiModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider shadow-md transition"
                            >
                                <Sparkles className="w-4 h-4" />
                                <span>AI INVOICE GENERATOR</span>
                            </button>

                            <Link
                                href="/projects/new"
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wider shadow-md transition"
                            >
                                <Plus className="w-4 h-4" />
                                <span>NEW INVOICE</span>
                            </Link>
                        </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Invoiced</span>
                            <div className="text-2xl font-black text-slate-900 mt-1">${totalInvoiced.toFixed(2)} USD</div>
                            <span className="text-xs text-slate-500 mt-1 block">{invoices.length} total contracts</span>
                        </div>

                        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Total Settled</span>
                            <div className="text-2xl font-black text-emerald-600 mt-1">${totalSettled.toFixed(2)} USD</div>
                            <span className="text-xs text-slate-500 mt-1 block">Cleared to payout wallet</span>
                        </div>

                        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Held in Escrow</span>
                            <div className="text-2xl font-black text-blue-600 mt-1">${heldInEscrow.toFixed(2)} USD</div>
                            <span className="text-xs text-slate-500 mt-1 block">Protected by smart contract</span>
                        </div>
                    </div>

                    {/* Invoices Table */}
                    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-extrabold text-base text-slate-900">All Invoices</h3>
                            <span className="text-xs font-semibold text-slate-400">{invoices.length} invoices</span>
                        </div>

                        {invoices.length === 0 ? (
                            <div className="py-16 px-4 text-center">
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-3">
                                    <Inbox className="w-6 h-6 text-blue-500" />
                                </div>
                                <h4 className="text-sm font-bold text-slate-800">No invoices generated yet</h4>
                                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-5">
                                    Generate your first milestone invoice in seconds using the AI generator or create a custom invoice.
                                </p>
                                <button
                                    onClick={() => setIsAiModalOpen(true)}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    <span>Generate Invoice with AI</span>
                                </button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/60">
                                        <tr>
                                            <th className="py-3.5 px-6">Invoice #</th>
                                            <th className="py-3.5 px-6">Client</th>
                                            <th className="py-3.5 px-6">Amount</th>
                                            <th className="py-3.5 px-6">Status</th>
                                            <th className="py-3.5 px-6">Issue / Due Date</th>
                                            <th className="py-3.5 px-6">Payment Rails</th>
                                            <th className="py-3.5 px-6 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {invoices.map((inv) => (
                                            <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                                                <td className="py-4 px-6 font-bold text-slate-900">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="w-4 h-4 text-blue-600" />
                                                        <span>{inv.invoiceNumber}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="font-semibold text-slate-800">{inv.client}</div>
                                                    <div className="text-xs text-slate-400">{inv.clientEmail}</div>
                                                </td>
                                                <td className="py-4 px-6 font-extrabold text-slate-900">
                                                    ${inv.amount.toFixed(2)} USD
                                                </td>
                                                <td className="py-4 px-6">
                                                    {inv.status === 'PAID' && (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                            <span>Paid</span>
                                                        </span>
                                                    )}
                                                    {inv.status === 'PENDING' && (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            <span>Pending</span>
                                                        </span>
                                                    )}
                                                    {inv.status === 'ESCROW_LOCKED' && (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                                            <AlertCircle className="w-3.5 h-3.5" />
                                                            <span>In Escrow</span>
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-6 text-xs text-slate-600">
                                                    <div>Issued: {inv.issueDate}</div>
                                                    <div className="text-slate-400">Due: {inv.dueDate}</div>
                                                </td>
                                                <td className="py-4 px-6 text-xs font-medium text-slate-600">
                                                    {inv.paymentMethod}
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {inv.status !== 'PAID' && (
                                                            <button
                                                                onClick={() => handlePaySandbox(inv.id)}
                                                                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1 transition"
                                                            >
                                                                <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                                                                <span>PayPal Pay</span>
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => alert(`Downloaded invoice PDF for ${inv.invoiceNumber}`)}
                                                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                                                            title="Download PDF"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <AiGeneratorModal
                isOpen={isAiModalOpen}
                onClose={() => setIsAiModalOpen(false)}
                onApplyPlan={(plan) => {
                    const newInv: Invoice = {
                        id: `inv-${Date.now()}`,
                        invoiceNumber: `INV-2026-00${invoices.length + 1}`,
                        client: plan.clientName || 'Partner Client',
                        clientEmail: 'billing@client.com',
                        amount: plan.totalAmount,
                        issueDate: 'Today',
                        dueDate: 'In 30 days',
                        status: 'ESCROW_LOCKED',
                        paymentMethod: 'PayPal Escrow Engine',
                    };
                    setInvoices([newInv, ...invoices]);
                }}
            />
        </div>
    );
}
