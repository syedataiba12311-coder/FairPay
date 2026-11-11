'use client';

import React, { useState } from 'react';
import AppShell from '@/components/AppShell';
import type { AgreementData } from '@/app/api/generate-agreement/route';
import {
    Sparkles, FileText, Edit3, CheckCircle2, ChevronDown, ChevronUp,
    Plus, X, DollarSign, Calendar, Shield, AlertCircle, Loader2,
    Printer, Download, ArrowLeft, Lock, Clock, User, Briefcase
} from 'lucide-react';

/* ─── Types ─────────────────────────────────────── */
type Step = 'form' | 'generating' | 'edit' | 'approved';

/* ─── Editable text field ────────────────────────── */
function EditableField({ label, value, onChange, multiline = false, hint }: {
    label: string; value: string; onChange: (v: string) => void;
    multiline?: boolean; hint?: string;
}) {
    const cls = 'w-full px-3 py-2 text-sm text-slate-700 border border-violet-200 rounded-xl bg-violet-50/30 focus:outline-none focus:ring-2 focus:ring-violet-500/30 resize-none transition';
    return (
        <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">{label}</label>
            {multiline
                ? <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} className={cls} />
                : <input value={value} onChange={e => onChange(e.target.value)} className={cls} />}
            {hint && <p className="text-[10px] text-slate-400 mt-1">{hint}</p>}
        </div>
    );
}

/* ─── Editable list field ────────────────────────── */
function EditableList({ label, items, onChange }: {
    label: string; items: string[]; onChange: (v: string[]) => void;
}) {
    const update = (i: number, v: string) => { const n = [...items]; n[i] = v; onChange(n); };
    const remove = (i: number) => onChange(items.filter((_, j) => j !== i));
    const add = () => onChange([...items, '']);
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{label}</label>
                <button onClick={add} className="flex items-center gap-1 text-[10px] text-violet-600 font-bold hover:underline">
                    <Plus className="w-3 h-3" /> Add
                </button>
            </div>
            <div className="space-y-1.5">
                {items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                        <input
                            value={item}
                            onChange={e => update(i, e.target.value)}
                            className="flex-1 px-2.5 py-1.5 text-sm text-slate-700 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                        />
                        <button onClick={() => remove(i)}><X className="w-3.5 h-3.5 text-slate-300 hover:text-rose-500 transition" /></button>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─── Section wrapper ────────────────────────────── */
function Section({ title, icon: Icon, children, defaultOpen = true }: {
    title: string; icon: React.ElementType; children: React.ReactNode; defaultOpen?: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition"
            >
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
                        <Icon className="w-3.5 h-3.5 text-violet-500" />
                    </div>
                    <span className="text-sm font-extrabold text-slate-800">{title}</span>
                </div>
                {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {open && <div className="px-6 pb-6 space-y-4 border-t border-slate-100 pt-4">{children}</div>}
        </div>
    );
}

/* ─── Main Page ──────────────────────────────────── */
export default function AgreementsPage() {
    const [step, setStep] = useState<Step>('form');
    const [error, setError] = useState('');

    /* Form fields */
    const [form, setForm] = useState({
        freelancerName: '',
        clientName: '',
        projectType: 'Web Development',
        projectDescription: '',
        totalAmount: '',
        startDate: '',
        endDate: '',
        specialTerms: '',
    });

    /* Agreement draft (editable) */
    const [draft, setDraft] = useState<AgreementData | null>(null);

    /* ── Generate ── */
    const handleGenerate = async () => {
        if (!form.projectDescription.trim() || form.projectDescription.trim().length < 10) {
            setError('Please write a project description (at least 10 characters).');
            return;
        }
        setError('');
        setStep('generating');
        try {
            const res = await fetch('/api/generate-agreement', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const json = await res.json();
            if (!res.ok || !json.success) throw new Error(json.error || 'Generation failed');
            setDraft(json.data);
            setStep('edit');
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
            setStep('form');
        }
    };

    /* ── Patch draft helper ── */
    const patch = (key: keyof AgreementData, value: AgreementData[keyof AgreementData]) =>
        setDraft(d => d ? { ...d, [key]: value } : d);

    const patchMilestone = (i: number, key: string, value: string | number | string[]) =>
        setDraft(d => {
            if (!d) return d;
            const milestones = [...d.milestones];
            milestones[i] = { ...milestones[i], [key]: value };
            return { ...d, milestones };
        });

    const addMilestone = () =>
        setDraft(d => d ? {
            ...d, milestones: [...d.milestones, {
                id: `m-${d.milestones.length + 1}`,
                title: 'New Milestone',
                description: '',
                amount: 0,
                dueDate: '',
                deliverables: [''],
            }]
        } : d);

    const removeMilestone = (i: number) =>
        setDraft(d => d ? { ...d, milestones: d.milestones.filter((_, j) => j !== i) } : d);

    /* ─────────────────────────────────────── FORM STEP */
    if (step === 'form' || step === 'generating') return (
        <AppShell title="AI Agreement Generator" subtitle="Generate a professional freelance contract in seconds">
            <div className="max-w-2xl mx-auto">
                {/* Header card */}
                <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-7 text-white mb-7 shadow-lg shadow-violet-500/20">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-extrabold">AI Agreement Generator</h2>
                            <p className="text-violet-200 text-sm mt-1 leading-relaxed">
                                Describe your project and our AI will draft a complete, professional freelance agreement with milestones, protection clauses, IP rights, and payment terms — fully editable before you approve.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-violet-500" /> Your Name (Freelancer)
                            </label>
                            <input
                                value={form.freelancerName}
                                onChange={e => setForm(f => ({ ...f, freelancerName: e.target.value }))}
                                placeholder="Alex Johnson"
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1.5">
                                <Briefcase className="w-3.5 h-3.5 text-violet-500" /> Client Name / Company
                            </label>
                            <input
                                value={form.clientName}
                                onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))}
                                placeholder="TechNova Inc."
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1.5">Project Type</label>
                            <select
                                value={form.projectType}
                                onChange={e => setForm(f => ({ ...f, projectType: e.target.value }))}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition"
                            >
                                {['Web Development', 'Mobile App', 'UI/UX Design', 'AI / ML', 'DevOps', 'Backend API', 'Consulting', 'Writing & Content', 'Other'].map(t => (
                                    <option key={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1.5">
                                <DollarSign className="w-3.5 h-3.5 text-violet-500" /> Total Budget (USD)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                <input
                                    type="number"
                                    value={form.totalAmount}
                                    onChange={e => setForm(f => ({ ...f, totalAmount: e.target.value }))}
                                    placeholder="5000"
                                    className="w-full pl-7 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-violet-500" /> Start Date
                            </label>
                            <input
                                type="date"
                                value={form.startDate}
                                onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-violet-500" /> End Date
                            </label>
                            <input
                                type="date"
                                value={form.endDate}
                                onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5">Project Description *</label>
                        <textarea
                            rows={5}
                            value={form.projectDescription}
                            onChange={e => setForm(f => ({ ...f, projectDescription: e.target.value }))}
                            placeholder="Describe the project in detail — what needs to be built, the tech stack, key features, any existing codebase, special requirements, etc. The more detail you provide, the more accurate and tailored the agreement will be."
                            className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 resize-none transition leading-relaxed"
                        />
                        <p className="text-[11px] text-slate-400 mt-1">{form.projectDescription.length} characters</p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5">Special Terms or Notes <span className="text-slate-400 font-normal">(optional)</span></label>
                        <input
                            value={form.specialTerms}
                            onChange={e => setForm(f => ({ ...f, specialTerms: e.target.value }))}
                            placeholder="e.g. NDA required, specific payment terms, non-compete clause…"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition"
                        />
                    </div>

                    {error && (
                        <div className="flex items-center gap-2.5 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">
                            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                        </div>
                    )}

                    <button
                        onClick={handleGenerate}
                        disabled={step === 'generating'}
                        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-extrabold flex items-center justify-center gap-2.5 hover:from-violet-700 hover:to-indigo-700 transition-all shadow-md shadow-violet-500/25 disabled:opacity-70"
                    >
                        {step === 'generating' ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Generating Agreement…</>
                        ) : (
                            <><Sparkles className="w-4 h-4" /> Generate Agreement with AI</>
                        )}
                    </button>

                    {step === 'generating' && (
                        <div className="text-center">
                            <p className="text-xs text-slate-500 animate-pulse">AI is drafting your agreement — this takes a few seconds…</p>
                            <div className="flex justify-center gap-2 mt-3">
                                {['Analyzing project scope', 'Drafting clauses', 'Structuring milestones', 'Finalising terms'].map((t, i) => (
                                    <span key={t} className="text-[10px] bg-violet-50 text-violet-600 font-semibold px-2.5 py-1 rounded-full border border-violet-100" style={{ animationDelay: `${i * 0.3}s` }}>
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );

    /* ─────────────────────────────────────── APPROVED STEP */
    if (step === 'approved' && draft) return (
        <AppShell title="Agreement Approved" subtitle="">
            <div className="max-w-xl mx-auto text-center py-16">
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900">Agreement Approved!</h2>
                <p className="text-slate-500 text-sm mt-3 leading-relaxed max-w-sm mx-auto">
                    <strong className="text-slate-700">{draft.agreementTitle}</strong> has been approved and is ready to be shared with your client.
                </p>
                <div className="mt-7 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-left space-y-3">
                    {[
                        { label: 'Freelancer', value: draft.freelancerName },
                        { label: 'Client', value: draft.clientName },
                        { label: 'Total Value', value: `$${draft.totalAmount.toLocaleString()} ${draft.currency}` },
                        { label: 'Milestones', value: `${draft.milestones.length} milestones` },
                        { label: 'Status', value: '✅ Approved', color: 'text-emerald-600' },
                    ].map(r => (
                        <div key={r.label} className="flex justify-between text-sm">
                            <span className="text-slate-400">{r.label}</span>
                            <span className={`font-bold text-slate-700 ${r.color || ''}`}>{r.value}</span>
                        </div>
                    ))}
                </div>
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={() => window.print()}
                        className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 flex items-center justify-center gap-2 transition"
                    >
                        <Printer className="w-4 h-4" /> Print / Save PDF
                    </button>
                    <button
                        onClick={() => { setStep('form'); setDraft(null); setForm({ freelancerName: '', clientName: '', projectType: 'Web Development', projectDescription: '', totalAmount: '', startDate: '', endDate: '', specialTerms: '' }); }}
                        className="flex-1 py-3 rounded-2xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-700 flex items-center justify-center gap-2 transition shadow"
                    >
                        <FileText className="w-4 h-4" /> New Agreement
                    </button>
                </div>
            </div>
        </AppShell>
    );

    /* ─────────────────────────────────────── EDIT STEP */
    if (!draft) return null;

    return (
        <AppShell title="Review & Edit Agreement" subtitle="Edit any section before approving — all fields are fully customisable">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <button onClick={() => setStep('form')} className="flex items-center gap-2 text-sm text-slate-500 font-semibold hover:text-violet-600 transition group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back to Form
                </button>
                <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs font-bold">
                    <Edit3 className="w-3.5 h-3.5" /> AI Draft — Review all sections before approving
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition"
                    >
                        <Download className="w-3.5 h-3.5" /> Export
                    </button>
                    <button
                        onClick={() => setStep('approved')}
                        className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition shadow-sm shadow-emerald-500/25"
                    >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve Agreement
                    </button>
                </div>
            </div>

            {/* Agreement Title Banner */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-700 rounded-2xl p-6 text-white mb-6 shadow-lg shadow-violet-500/20">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                        <p className="text-violet-300 text-[11px] font-bold uppercase tracking-widest mb-1">Freelance Agreement</p>
                        <input
                            value={draft.agreementTitle}
                            onChange={e => patch('agreementTitle', e.target.value)}
                            className="text-xl font-extrabold bg-transparent border-b border-white/30 focus:outline-none focus:border-white w-full max-w-lg text-white placeholder-white/50"
                        />
                        <div className="flex gap-6 mt-4 text-sm">
                            <div>
                                <p className="text-violet-300 text-[10px] uppercase font-bold">Freelancer</p>
                                <p className="font-semibold mt-0.5">{draft.freelancerName || '—'}</p>
                            </div>
                            <div>
                                <p className="text-violet-300 text-[10px] uppercase font-bold">Client</p>
                                <p className="font-semibold mt-0.5">{draft.clientName || '—'}</p>
                            </div>
                            <div>
                                <p className="text-violet-300 text-[10px] uppercase font-bold">Total Value</p>
                                <p className="font-extrabold text-base mt-0.5">${draft.totalAmount.toLocaleString()} {draft.currency}</p>
                            </div>
                            <div>
                                <p className="text-violet-300 text-[10px] uppercase font-bold">Duration</p>
                                <p className="font-semibold mt-0.5">{draft.startDate} → {draft.endDate}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/15 border border-white/20 rounded-xl px-3.5 py-2 text-sm font-bold">
                        <Lock className="w-3.5 h-3.5" /> FairPay Protected
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {/* ── Parties */}
                <Section title="Parties" icon={User}>
                    <div className="grid grid-cols-2 gap-4">
                        <EditableField label="Freelancer Name" value={draft.freelancerName} onChange={v => patch('freelancerName', v)} />
                        <EditableField label="Client Name / Company" value={draft.clientName} onChange={v => patch('clientName', v)} />
                    </div>
                    <EditableField label="Project Summary" value={draft.projectSummary} onChange={v => patch('projectSummary', v)} multiline />
                    <div className="grid grid-cols-2 gap-4">
                        <EditableField label="Start Date" value={draft.startDate} onChange={v => patch('startDate', v)} />
                        <EditableField label="End / Estimated Completion Date" value={draft.endDate} onChange={v => patch('endDate', v)} />
                    </div>
                </Section>

                {/* ── Payment */}
                <Section title="Payment Terms" icon={DollarSign}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Total Amount (USD)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                <input
                                    type="number"
                                    value={draft.totalAmount}
                                    onChange={e => patch('totalAmount', parseFloat(e.target.value) || 0)}
                                    className="w-full pl-7 pr-3 py-2 text-sm font-extrabold text-slate-800 border border-violet-200 rounded-xl bg-violet-50/30 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                                />
                            </div>
                        </div>
                        <EditableField label="Currency" value={draft.currency} onChange={v => patch('currency', v)} />
                    </div>
                    <EditableField label="Payment Schedule" value={draft.paymentSchedule} onChange={v => patch('paymentSchedule', v)} multiline />
                </Section>

                {/* ── Milestones */}
                <Section title="Payment Milestones" icon={Calendar}>
                    <div className="space-y-4">
                        {draft.milestones.map((m, i) => (
                            <div key={m.id} className="relative border border-slate-200 rounded-2xl p-5 bg-slate-50/50 hover:border-violet-200 transition">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-violet-600 text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                                            {i + 1}
                                        </div>
                                        <input
                                            value={m.title}
                                            onChange={e => patchMilestone(i, 'title', e.target.value)}
                                            className="font-bold text-sm text-slate-800 bg-transparent border-b border-slate-200 focus:outline-none focus:border-violet-400 w-full max-w-xs"
                                        />
                                    </div>
                                    <button onClick={() => removeMilestone(i)} className="text-slate-300 hover:text-rose-500 transition">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-3 gap-3 mb-3">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Amount</label>
                                        <div className="relative mt-1">
                                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">$</span>
                                            <input type="number" value={m.amount} onChange={e => patchMilestone(i, 'amount', parseFloat(e.target.value) || 0)}
                                                className="w-full pl-5 pr-2 py-1.5 text-sm font-bold text-slate-700 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Due Date</label>
                                        <input value={m.dueDate} onChange={e => patchMilestone(i, 'dueDate', e.target.value)}
                                            className="w-full mt-1 px-2.5 py-1.5 text-sm text-slate-700 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Description</label>
                                    <textarea value={m.description} rows={2} onChange={e => patchMilestone(i, 'description', e.target.value)}
                                        className="w-full mt-1 px-2.5 py-1.5 text-sm text-slate-600 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 resize-none" />
                                </div>
                                <EditableList
                                    label="Deliverables"
                                    items={m.deliverables}
                                    onChange={v => patchMilestone(i, 'deliverables', v)}
                                />
                            </div>
                        ))}
                    </div>
                    <button onClick={addMilestone}
                        className="w-full py-2.5 border-2 border-dashed border-violet-200 text-violet-600 text-xs font-bold rounded-xl hover:border-violet-400 hover:bg-violet-50 transition flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" /> Add Milestone
                    </button>
                    {/* Milestone total check */}
                    <div className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold ${draft.milestones.reduce((s, m) => s + m.amount, 0) === draft.totalAmount
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                        <span>Milestone Total</span>
                        <span>${draft.milestones.reduce((s, m) => s + m.amount, 0).toLocaleString()} / ${draft.totalAmount.toLocaleString()}</span>
                    </div>
                </Section>

                {/* ── Scope of Work */}
                <Section title="Scope of Work" icon={Briefcase}>
                    <EditableList label="Scope Items" items={draft.scopeOfWork} onChange={v => patch('scopeOfWork', v)} />
                </Section>

                {/* ── Deliverables */}
                <Section title="Deliverables" icon={CheckCircle2}>
                    <EditableList label="Final Deliverables" items={draft.deliverables} onChange={v => patch('deliverables', v)} />
                </Section>

                {/* ── Legal Terms */}
                <Section title="Legal Terms" icon={FileText}>
                    <EditableField label="Revision Policy" value={draft.revisionPolicy} onChange={v => patch('revisionPolicy', v)} multiline />
                    <EditableField label="IP & Ownership" value={draft.ipOwnership} onChange={v => patch('ipOwnership', v)} multiline />
                    <EditableField label="Confidentiality" value={draft.confidentiality} onChange={v => patch('confidentiality', v)} multiline />
                    <EditableField label="Termination Clause" value={draft.terminationClause} onChange={v => patch('terminationClause', v)} multiline />
                    <EditableField label="Dispute Resolution" value={draft.disputeResolution} onChange={v => patch('disputeResolution', v)} multiline />
                    <EditableField label="Governing Law" value={draft.governingLaw} onChange={v => patch('governingLaw', v)} />
                </Section>

                {/* ── Protection Clauses */}
                <Section title="FairPay Protection Clauses" icon={Shield}>
                    <div className="flex items-start gap-2 p-3 bg-violet-50 border border-violet-100 rounded-xl text-xs text-violet-700 mb-2">
                        <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>These clauses are enforced by the FairPay escrow engine and dispute arbitration system.</span>
                    </div>
                    <EditableList label="Protection Terms" items={draft.protectionClauses} onChange={v => patch('protectionClauses', v)} />
                </Section>
            </div>

            {/* Bottom Approve Bar */}
            <div className="sticky bottom-0 mt-6 bg-white/95 backdrop-blur border-t border-slate-100 py-4 px-1 flex items-center justify-between gap-4 rounded-2xl shadow-lg">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock className="w-4 h-4 text-violet-400" />
                    <span>Review all sections, then approve to lock the agreement.</span>
                </div>
                <button
                    onClick={() => setStep('approved')}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-extrabold hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md shadow-emerald-500/25"
                >
                    <CheckCircle2 className="w-4 h-4" /> Approve & Finalise
                </button>
            </div>
        </AppShell>
    );
}
