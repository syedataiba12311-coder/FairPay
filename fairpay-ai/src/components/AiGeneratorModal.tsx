'use client';

import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, ShieldCheck, DollarSign, ArrowRight, Loader2, Calendar } from 'lucide-react';
import { ScopeAnalysisResult } from '@/lib/gemini';

interface AiGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApplyPlan?: (plan: ScopeAnalysisResult) => void;
}

export default function AiGeneratorModal({ isOpen, onClose, onApplyPlan }: AiGeneratorModalProps) {
    const [scopeText, setScopeText] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ScopeAnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleGenerate = async () => {
        if (!scopeText.trim()) return;
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scope: scopeText }),
            });

            const data = await res.json();
            if (res.ok && data.data) {
                setResult(data.data);
            } else {
                setError(data.error || 'Failed to generate structure. Please try again.');
            }
        } catch (err: unknown) {
            console.error(err);
            setError('Network error connecting to Gemini AI engine.');
        } finally {
            setLoading(false);
        }
    };

    const samplePrompts = [
        'E-commerce redesign with Stripe/PayPal payment checkout and Supabase auth',
        'Mobile Flutter app MVP with 3 sprint milestones and design sign-offs',
        'Full-stack Next.js SaaS landing page with dark mode, animations & CMS'
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-10">
                    <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                            <Sparkles className="w-4 h-4" />
                        </span>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold text-slate-900">FairPay AI Contract Generator</h3>
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                    Gemini 2.5
                                </span>
                            </div>
                            <p className="text-xs text-slate-500">Auto-structure milestones, amounts, and protection terms</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Prompt input */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Describe Project Scope & Deliverables
                        </label>
                        <textarea
                            rows={3}
                            value={scopeText}
                            onChange={(e) => setScopeText(e.target.value)}
                            placeholder="e.g. Build a modern Next.js SaaS app with PayPal payment escrow and user profiles..."
                            className="w-full text-sm p-4 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition resize-none text-slate-800 placeholder-slate-400"
                        />

                        {/* Quick sample pills */}
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                            <span className="text-[11px] text-slate-400 font-medium py-0.5">Quick scope ideas:</span>
                            {samplePrompts.map((p, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setScopeText(p)}
                                    className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-1 rounded-full transition-colors truncate max-w-[280px]"
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Action button */}
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !scopeText.trim()}
                        className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Gemini is generating milestone protections...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                <span>Generate Milestones & Escrow Terms</span>
                            </>
                        )}
                    </button>

                    {error && (
                        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                            {error}
                        </div>
                    )}

                    {/* Generated Result Preview */}
                    {result && (
                        <div className="space-y-5 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                                <div>
                                    <h4 className="font-bold text-slate-900 text-base">{result.title}</h4>
                                    <p className="text-xs text-slate-500">Client: {result.clientName || 'Partner'}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-black text-blue-600 flex items-center gap-0.5">
                                        <DollarSign className="w-5 h-5 -mr-1" />
                                        <span>{result.totalAmount.toLocaleString()}</span>
                                        <span className="text-xs font-semibold text-slate-400 ml-1">{result.currency}</span>
                                    </div>
                                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                        {result.suggestedEscrowPercentage}% Escrow Protected
                                    </span>
                                </div>
                            </div>

                            {/* Milestones */}
                            <div>
                                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                    <span>Structured Milestones ({result.milestones.length})</span>
                                </h5>
                                <div className="space-y-2.5">
                                    {result.milestones.map((m, idx) => (
                                        <div
                                            key={m.id || idx}
                                            className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex items-start justify-between gap-4"
                                        >
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[11px] font-bold flex items-center justify-center">
                                                        {idx + 1}
                                                    </span>
                                                    <span className="font-bold text-sm text-slate-900">{m.title}</span>
                                                </div>
                                                <p className="text-xs text-slate-600 pl-7">{m.description}</p>
                                                {m.deliverables && (
                                                    <div className="flex flex-wrap gap-1.5 pl-7 pt-1">
                                                        {m.deliverables.map((d, dIdx) => (
                                                            <span
                                                                key={dIdx}
                                                                className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                                                            >
                                                                {d}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-right shrink-0">
                                                <span className="font-bold text-slate-900 text-sm">${m.amount}</span>
                                                <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{m.deadlineDays}d</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Protection terms */}
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-1.5">
                                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                    <span>FairPay Protection Terms</span>
                                </h5>
                                <ul className="space-y-1.5 text-xs text-slate-600">
                                    {result.protectionTerms.map((term, tIdx) => (
                                        <li key={tIdx} className="flex items-start gap-2">
                                            <span className="text-emerald-500 font-bold">•</span>
                                            <span>{term}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Action */}
                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    onClick={() => {
                                        if (onApplyPlan && result) {
                                            onApplyPlan(result);
                                        }
                                        onClose();
                                    }}
                                    className="w-full py-3 px-6 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-sm flex items-center justify-center gap-2 transition"
                                >
                                    <span>Apply to New Project & Invoice</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
