'use client';

import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import AppShell from '@/components/AppShell';
import {
    DollarSign, CheckCircle2, Clock, AlertCircle, ArrowDownLeft,
    Download, Inbox, Plus, X, Shield, Wallet, ExternalLink
} from 'lucide-react';
import { PAYPAL_CLIENT_ID } from '@/lib/paypal';

// ── Types ──────────────────────────────────────────────────────────────────

interface Transaction {
    id: string;
    project: string;
    client: string;
    milestone: string;
    amount: number;
    currency: string;
    status: 'Completed' | 'In Escrow' | 'Pending' | 'Failed';
    date: string;
    paypalOrderId?: string;
    payerEmail?: string;
}

// ── Status config ──────────────────────────────────────────────────────────

const statusCfg: Record<string, { color: string; bg: string; dot: string; icon: React.ElementType }> = {
    Completed: { color: 'text-emerald-700', bg: 'bg-emerald-50 border border-emerald-200', dot: 'bg-emerald-500', icon: CheckCircle2 },
    'In Escrow': { color: 'text-blue-700', bg: 'bg-blue-50 border border-blue-200', dot: 'bg-blue-500', icon: Shield },
    Pending: { color: 'text-amber-700', bg: 'bg-amber-50 border border-amber-200', dot: 'bg-amber-500', icon: Clock },
    Failed: { color: 'text-rose-700', bg: 'bg-rose-50 border border-rose-200', dot: 'bg-rose-400', icon: AlertCircle },
};

// ── PayPal checkout modal ──────────────────────────────────────────────────

interface CheckoutModalProps {
    onClose: () => void;
    onSuccess: (tx: Omit<Transaction, 'id' | 'date'>) => void;
}

function CheckoutModal({ onClose, onSuccess }: CheckoutModalProps) {
    const [amount, setAmount] = useState('50.00');
    const [project, setProject] = useState('');
    const [milestone, setMilestone] = useState('');
    const [client, setClient] = useState('');
    const [step, setStep] = useState<'form' | 'pay' | 'success' | 'error'>('form');
    const [errorMsg, setErrorMsg] = useState('');
    const [successData, setSuccessData] = useState<{ orderId: string; email: string } | null>(null);

    const isFormValid = project.trim() && milestone.trim() && client.trim() && parseFloat(amount) > 0;

    const handleApprove = async (data: { orderID: string }) => {
        try {
            const res = await fetch('/api/paypal/capture-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderID: data.orderID }),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error ?? 'Capture failed');

            const email = result.payer?.email_address ?? 'paypal-user@example.com';
            setSuccessData({ orderId: data.orderID, email });
            setStep('success');

            onSuccess({
                project,
                client,
                milestone,
                amount: parseFloat(amount),
                currency: 'USD',
                status: 'In Escrow',
                paypalOrderId: data.orderID,
                payerEmail: email,
            });
        } catch (err: unknown) {
            setErrorMsg(err instanceof Error ? err.message : 'Payment capture failed');
            setStep('error');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-violet-600 to-indigo-600">
                    <div className="flex items-center gap-3 text-white">
                        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                            <Wallet className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-base leading-tight">PayPal Sandbox Checkout</h3>
                            <p className="text-violet-200 text-xs">Secure escrow deposit via PayPal</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-6">
                    {/* ── Step 1: Form ── */}
                    {step === 'form' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Project Name *</label>
                                    <input
                                        value={project}
                                        onChange={e => setProject(e.target.value)}
                                        placeholder="e.g. Brand Redesign"
                                        className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Client Name *</label>
                                    <input
                                        value={client}
                                        onChange={e => setClient(e.target.value)}
                                        placeholder="e.g. Acme Corp"
                                        className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Milestone *</label>
                                <input
                                    value={milestone}
                                    onChange={e => setMilestone(e.target.value)}
                                    placeholder="e.g. Phase 1 – Wireframes"
                                    className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Amount (USD) *</label>
                                <div className="relative mt-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                                    <input
                                        type="number"
                                        min="1"
                                        step="0.01"
                                        value={amount}
                                        onChange={e => setAmount(e.target.value)}
                                        className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2.5 p-3 bg-blue-50 rounded-xl border border-blue-100">
                                <Shield className="w-4 h-4 text-blue-600 shrink-0" />
                                <p className="text-xs text-blue-700 font-medium">
                                    Funds are held in secure escrow and released only when you approve the milestone.
                                </p>
                            </div>

                            <button
                                onClick={() => setStep('pay')}
                                disabled={!isFormValid}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-sm shadow disabled:opacity-40 hover:from-violet-700 hover:to-indigo-700 transition"
                            >
                                Continue to PayPal →
                            </button>
                        </div>
                    )}

                    {/* ── Step 2: PayPal Buttons ── */}
                    {step === 'pay' && (
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex justify-between text-xs text-slate-500 mb-1">
                                    <span>Project</span><span className="font-semibold text-slate-700">{project}</span>
                                </div>
                                <div className="flex justify-between text-xs text-slate-500 mb-1">
                                    <span>Milestone</span><span className="font-semibold text-slate-700">{milestone}</span>
                                </div>
                                <div className="flex justify-between text-xs text-slate-500 mb-3">
                                    <span>Client</span><span className="font-semibold text-slate-700">{client}</span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                                    <span className="text-sm font-bold text-slate-700">Total</span>
                                    <span className="text-xl font-extrabold text-violet-700">${parseFloat(amount).toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="text-center text-xs text-slate-400 font-medium">🧪 Sandbox mode — use PayPal test credentials</div>

                            <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: 'USD' }}>
                                <PayPalButtons
                                    style={{ layout: 'vertical', color: 'blue', shape: 'rect', label: 'pay' }}
                                    createOrder={async () => {
                                        const res = await fetch('/api/paypal/create-order', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                                amount: parseFloat(amount).toFixed(2),
                                                currency: 'USD',
                                                description: `FairPay AI – ${project} / ${milestone}`,
                                            }),
                                        });
                                        const data = await res.json();
                                        if (!res.ok || !data.id) throw new Error(data.error ?? 'Order creation failed');
                                        return data.id;
                                    }}
                                    onApprove={handleApprove}
                                    onError={(err) => {
                                        setErrorMsg(String(err));
                                        setStep('error');
                                    }}
                                    onCancel={() => setStep('form')}
                                />
                            </PayPalScriptProvider>

                            <button
                                onClick={() => setStep('form')}
                                className="w-full text-xs text-slate-400 hover:text-slate-600 font-medium transition"
                            >
                                ← Back
                            </button>
                        </div>
                    )}

                    {/* ── Step 3: Success ── */}
                    {step === 'success' && successData && (
                        <div className="text-center space-y-4 py-2">
                            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                            </div>
                            <div>
                                <h4 className="text-lg font-extrabold text-slate-900">Payment Captured!</h4>
                                <p className="text-sm text-slate-500 mt-1">Funds are now held in escrow</p>
                            </div>
                            <div className="bg-slate-50 rounded-2xl p-4 text-left space-y-2 border border-slate-100">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400">PayPal Order ID</span>
                                    <span className="font-mono font-semibold text-slate-700 text-right truncate max-w-[180px]">{successData.orderId}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400">Payer</span>
                                    <span className="font-semibold text-slate-700">{successData.email}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400">Amount</span>
                                    <span className="font-extrabold text-emerald-700">${parseFloat(amount).toFixed(2)} USD</span>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition"
                            >
                                Done
                            </button>
                        </div>
                    )}

                    {/* ── Step 4: Error ── */}
                    {step === 'error' && (
                        <div className="text-center space-y-4 py-2">
                            <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto">
                                <AlertCircle className="w-8 h-8 text-rose-500" />
                            </div>
                            <div>
                                <h4 className="text-lg font-extrabold text-slate-900">Payment Failed</h4>
                                <p className="text-sm text-rose-600 mt-1 font-mono bg-rose-50 px-3 py-2 rounded-xl">{errorMsg}</p>
                            </div>
                            <button
                                onClick={() => setStep('form')}
                                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-black text-white font-bold text-sm transition"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Main Payments Page ─────────────────────────────────────────────────────

export default function PaymentsPage() {
    const [filter, setFilter] = useState('All');
    const [showCheckout, setShowCheckout] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const filters = ['All', 'Completed', 'In Escrow', 'Pending', 'Failed'];
    const filtered = filter === 'All' ? transactions : transactions.filter(t => t.status === filter);

    const totalEarned = transactions.filter(t => t.status === 'Completed').reduce((s, t) => s + t.amount, 0);
    const inEscrow = transactions.filter(t => t.status === 'In Escrow').reduce((s, t) => s + t.amount, 0);
    const pending = transactions.filter(t => t.status === 'Pending').reduce((s, t) => s + t.amount, 0);

    const handleSuccess = (tx: Omit<Transaction, 'id' | 'date'>) => {
        const newTx: Transaction = {
            ...tx,
            id: `TXN-${Date.now().toString(36).toUpperCase()}`,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        };
        setTransactions(prev => [newTx, ...prev]);
    };

    const exportCSV = () => {
        const header = ['ID', 'Project', 'Client', 'Milestone', 'Amount', 'Currency', 'Status', 'Date', 'PayPal Order ID', 'Payer Email'];
        const rows = transactions.map(t => [
            t.id, t.project, t.client, t.milestone, t.amount, t.currency, t.status, t.date, t.paypalOrderId ?? '', t.payerEmail ?? ''
        ]);
        const csv = [header, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'fairpay-transactions.csv'; a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <AppShell title="Payments" subtitle="Manage milestone payouts powered by PayPal Sandbox">

            {showCheckout && (
                <CheckoutModal
                    onClose={() => setShowCheckout(false)}
                    onSuccess={handleSuccess}
                />
            )}

            {/* ── Summary Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-7">
                {[
                    { label: 'Total Earned', value: `$${totalEarned.toLocaleString()}`, icon: DollarSign, bg: 'bg-emerald-50', ic: 'text-emerald-600', border: 'border-emerald-200', val: 'text-emerald-700' },
                    { label: 'In Escrow', value: `$${inEscrow.toLocaleString()}`, icon: Shield, bg: 'bg-blue-50', ic: 'text-blue-600', border: 'border-blue-200', val: 'text-blue-700' },
                    { label: 'Pending', value: `$${pending.toLocaleString()}`, icon: Clock, bg: 'bg-amber-50', ic: 'text-amber-600', border: 'border-amber-200', val: 'text-amber-700' },
                ].map(s => {
                    const Icon = s.icon;
                    return (
                        <div key={s.label} className={`bg-white rounded-2xl border ${s.border} shadow-sm p-6 flex items-center gap-4`}>
                            <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                                <Icon className={`w-6 h-6 ${s.ic}`} />
                            </div>
                            <div>
                                <p className={`text-2xl font-extrabold ${s.val}`}>{s.value}</p>
                                <p className="text-xs text-slate-400 font-semibold mt-0.5">{s.label}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── PayPal Sandbox Banner ── */}
            <div className="mb-6 flex items-center gap-4 bg-gradient-to-r from-[#003087] to-[#009cde] rounded-2xl p-5 shadow-lg shadow-blue-500/20">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    {/* PayPal P-mark */}
                    <span className="text-white font-black text-xl italic">P</span>
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-white font-extrabold text-sm">PayPal Sandbox Ready</h4>
                    <p className="text-blue-200 text-xs mt-0.5">Securely collect milestone payments from clients via PayPal. Funds held in escrow until approved.</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <a
                        href="https://developer.paypal.com/dashboard/accounts"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-2 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-xl transition"
                    >
                        <ExternalLink className="w-3.5 h-3.5" /> Dev Portal
                    </a>
                    <button
                        onClick={() => setShowCheckout(true)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-white text-[#003087] text-xs font-extrabold rounded-xl hover:bg-blue-50 transition shadow"
                    >
                        <Plus className="w-3.5 h-3.5" /> Request Payment
                    </button>
                </div>
            </div>

            {/* ── Filter + Export ── */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div className="flex gap-2 flex-wrap">
                    {filters.map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === f ? 'bg-violet-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:border-violet-300'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <button
                    onClick={exportCSV}
                    disabled={transactions.length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:border-violet-300 hover:text-violet-600 transition disabled:opacity-40"
                >
                    <Download className="w-3.5 h-3.5" /> Export CSV
                </button>
            </div>

            {/* ── Transactions ── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="py-20 px-4 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-4">
                            <Inbox className="w-7 h-7 text-violet-400" />
                        </div>
                        <p className="text-sm font-bold text-slate-700">No transactions yet</p>
                        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                            Click <strong>Request Payment</strong> above to initiate a PayPal sandbox checkout.
                        </p>
                        <button
                            onClick={() => setShowCheckout(true)}
                            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl shadow transition"
                        >
                            <Plus className="w-3.5 h-3.5" /> Request Payment
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Table header */}
                        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100">
                            {[
                                { label: 'Transaction', span: 'col-span-2' },
                                { label: 'Project', span: 'col-span-3' },
                                { label: 'Milestone', span: 'col-span-2' },
                                { label: 'Amount', span: 'col-span-1' },
                                { label: 'Date', span: 'col-span-1' },
                                { label: 'Status', span: 'col-span-2' },
                                { label: '', span: 'col-span-1' },
                            ].map(h => (
                                <div key={h.label} className={`text-[10px] font-bold uppercase tracking-wider text-slate-400 ${h.span}`}>{h.label}</div>
                            ))}
                        </div>
                        <div className="divide-y divide-slate-50">
                            {filtered.map(t => {
                                const cfg = statusCfg[t.status] ?? statusCfg.Pending;
                                const Icon = cfg.icon;
                                return (
                                    <div key={t.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 items-center hover:bg-slate-50/60 transition-colors">
                                        <div className="md:col-span-2 flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                                                <ArrowDownLeft className="w-4 h-4 text-violet-500" />
                                            </div>
                                            <span className="text-[11px] font-mono font-semibold text-slate-500">{t.id}</span>
                                        </div>
                                        <div className="md:col-span-3">
                                            <p className="text-sm font-semibold text-slate-800 leading-tight">{t.project}</p>
                                            <p className="text-[11px] text-slate-400">{t.client}</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <p className="text-xs text-slate-600 font-medium">{t.milestone}</p>
                                            {t.payerEmail && (
                                                <p className="text-[10px] text-slate-400 mt-0.5 truncate">{t.payerEmail}</p>
                                            )}
                                        </div>
                                        <div className="md:col-span-1">
                                            <p className="text-sm font-extrabold text-slate-900">${t.amount.toLocaleString()}</p>
                                            <p className="text-[10px] text-slate-400">{t.currency}</p>
                                        </div>
                                        <div className="md:col-span-1">
                                            <p className="text-xs text-slate-500">{t.date}</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
                                                <Icon className="w-3 h-3" /> {t.status}
                                            </span>
                                        </div>
                                        <div className="md:col-span-1 text-right">
                                            {t.paypalOrderId && (
                                                <a
                                                    href={`https://www.sandbox.paypal.com/activity/payment/${t.paypalOrderId}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[11px] text-violet-600 font-bold hover:underline inline-flex items-center gap-1"
                                                    title="View on PayPal Sandbox"
                                                >
                                                    View <ExternalLink className="w-3 h-3" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            {/* ── Total footer ── */}
            {filtered.length > 0 && (
                <div className="mt-4 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-5 flex items-center justify-between text-white shadow-lg shadow-violet-500/20">
                    <span className="text-sm font-bold">Total Showing ({filtered.length} transaction{filtered.length !== 1 ? 's' : ''})</span>
                    <span className="text-xl font-extrabold">${filtered.reduce((s, t) => s + t.amount, 0).toLocaleString()}</span>
                </div>
            )}
        </AppShell>
    );
}
