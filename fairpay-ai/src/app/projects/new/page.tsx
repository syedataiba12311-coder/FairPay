'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import {
    ArrowLeft,
    Sparkles,
    ShieldCheck,
    DollarSign,
    Plus,
    Trash2,
    Calendar,
    Lock,
    Loader2
} from 'lucide-react';

export default function NewProjectPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [client, setClient] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [totalBudget, setTotalBudget] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [scopeDescription, setScopeDescription] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [escrowDepositRate, setEscrowDepositRate] = useState(50); // 50% upfront

    const [milestones, setMilestones] = useState([
        {
            id: '1',
            title: '',
            amount: 0,
            days: 7,
            deliverables: '',
        },
    ]);

    const handleAiAutoFill = async () => {
        if (!scopeDescription.trim()) return;
        setIsAiLoading(true);

        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scope: scopeDescription }),
            });
            const data = await res.json();
            if (res.ok && data.data) {
                setTitle(data.data.title || title);
                setClient(data.data.clientName || client);
                setTotalBudget(data.data.totalAmount?.toString() || totalBudget);
                if (data.data.milestones?.length > 0) {
                    setMilestones(
                        data.data.milestones.map((m: any, idx: number) => ({
                            id: String(idx + 1),
                            title: m.title,
                            amount: m.amount,
                            days: m.deadlineDays || 7,
                            deliverables: Array.isArray(m.deliverables) ? m.deliverables.join(', ') : '',
                        }))
                    );
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleAddMilestone = () => {
        setMilestones([
            ...milestones,
            {
                id: String(Date.now()),
                title: `Milestone ${milestones.length + 1}: Final Polish`,
                amount: 300,
                days: 7,
                deliverables: 'Review and sign-off',
            },
        ]);
    };

    const handleRemoveMilestone = (idx: number) => {
        setMilestones(milestones.filter((_, i) => i !== idx));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Project "${title || 'Untitled Project'}" successfully created with escrow protections!`);
        router.push('/dashboard');
    };

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0">
                <Header />

                <main className="p-8 max-w-4xl mx-auto w-full space-y-6">
                    {/* Back link */}
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Dashboard</span>
                    </Link>

                    {/* Heading */}
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create New Escrow Project</h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Set milestones, define protection clauses, and invite your client to fund smart escrow.
                        </p>
                    </div>

                    {/* AI Scoping Assistant Card */}
                    <div className="bg-[#0B1123] rounded-3xl p-6 text-white border border-slate-800 shadow-xl space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="p-2 rounded-xl bg-blue-600 text-white">
                                    <Sparkles className="w-4 h-4" />
                                </span>
                                <div>
                                    <h3 className="font-bold text-sm text-white">Gemini AI Project Assistant</h3>
                                    <p className="text-xs text-slate-400">Paste your raw client notes to auto-fill milestones and pricing</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleAiAutoFill}
                                disabled={isAiLoading || !scopeDescription.trim()}
                                className="px-4 py-2 rounded-full bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-900 font-bold text-xs flex items-center gap-1.5 transition"
                            >
                                {isAiLoading ? (
                                    <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        <span>Analyzing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                                        <span>Auto-Structure with Gemini</span>
                                    </>
                                )}
                            </button>
                        </div>
                        <textarea
                            rows={2}
                            value={scopeDescription}
                            onChange={(e) => setScopeDescription(e.target.value)}
                            placeholder="e.g. Build an analytics portal for a crypto hedge fund with wallet connect, charts, and export features. Budget is around $2500."
                            className="w-full text-xs p-3 rounded-2xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-400 outline-none focus:border-blue-500 resize-none"
                        />
                    </div>

                    {/* Project Form */}
                    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-xs space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                    Project Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Full-Stack Web Application"
                                    className="w-full text-sm p-3.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none font-semibold text-slate-800"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                    Client / Organization Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={client}
                                    onChange={(e) => setClient(e.target.value)}
                                    placeholder="e.g. TechCorp Labs"
                                    className="w-full text-sm p-3.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none font-semibold text-slate-800"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                    Client Email Address
                                </label>
                                <input
                                    type="email"
                                    value={clientEmail}
                                    onChange={(e) => setClientEmail(e.target.value)}
                                    placeholder="client@company.com"
                                    className="w-full text-sm p-3.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none font-semibold text-slate-800"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                    Total Budget ({currency})
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <DollarSign className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="number"
                                        value={totalBudget}
                                        onChange={(e) => setTotalBudget(e.target.value)}
                                        className="w-full text-sm pl-9 pr-3.5 py-3.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none font-black text-slate-900"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Escrow protection slider */}
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                                <span className="flex items-center gap-1.5">
                                    <Lock className="w-4 h-4 text-blue-600" />
                                    <span>Upfront Escrow Deposit Requirement: {escrowDepositRate}%</span>
                                </span>
                                <span className="text-blue-600">${Math.round((parseFloat(totalBudget || '0') * escrowDepositRate) / 100)} USD</span>
                            </div>
                            <input
                                type="range"
                                min="20"
                                max="100"
                                step="5"
                                value={escrowDepositRate}
                                onChange={(e) => setEscrowDepositRate(Number(e.target.value))}
                                className="w-full accent-blue-600"
                            />
                            <p className="text-[11px] text-slate-500">
                                Client must lock this amount into FairPay PayPal Smart Escrow before the first sprint begins.
                            </p>
                        </div>

                        {/* Milestones editor */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                    Project Milestones ({milestones.length})
                                </h4>
                                <button
                                    type="button"
                                    onClick={handleAddMilestone}
                                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Add Milestone</span>
                                </button>
                            </div>

                            <div className="space-y-3">
                                {milestones.map((m, idx) => (
                                    <div
                                        key={m.id}
                                        className="p-4 rounded-2xl border border-slate-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-3"
                                    >
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                                                    {idx + 1}
                                                </span>
                                                <input
                                                    type="text"
                                                    value={m.title}
                                                    placeholder="Milestone title (e.g. Discovery & Wireframes)"
                                                    onChange={(e) => {
                                                        const updated = [...milestones];
                                                        updated[idx].title = e.target.value;
                                                        setMilestones(updated);
                                                    }}
                                                    className="font-bold text-sm text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none w-full"
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                value={m.deliverables}
                                                placeholder="Deliverables..."
                                                onChange={(e) => {
                                                    const updated = [...milestones];
                                                    updated[idx].deliverables = e.target.value;
                                                    setMilestones(updated);
                                                }}
                                                className="text-xs text-slate-500 border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none w-full pl-8"
                                            />
                                        </div>

                                        <div className="flex items-center gap-3 pl-8 md:pl-0">
                                            <div className="flex items-center gap-1 border border-slate-200 rounded-xl px-2.5 py-1 text-xs">
                                                <span className="text-slate-400 font-bold">$</span>
                                                <input
                                                    type="number"
                                                    value={m.amount}
                                                    onChange={(e) => {
                                                        const updated = [...milestones];
                                                        updated[idx].amount = Number(e.target.value);
                                                        setMilestones(updated);
                                                    }}
                                                    className="w-16 font-extrabold text-slate-900 outline-none"
                                                />
                                            </div>

                                            <div className="flex items-center gap-1 border border-slate-200 rounded-xl px-2.5 py-1 text-xs text-slate-600">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                <span>{m.days}d</span>
                                            </div>

                                            {milestones.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveMilestone(idx)}
                                                    className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                            <Link
                                href="/dashboard"
                                className="px-5 py-3 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 flex items-center gap-2 transition"
                            >
                                <ShieldCheck className="w-4 h-4" />
                                <span>Publish Project & Escrow Contract</span>
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
}
