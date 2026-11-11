'use client';
import React, { useState } from 'react';
import AppShell from '@/components/AppShell';
import { FileText, Clock, CheckCircle2, XCircle, Send, Sparkles, DollarSign, Calendar, Inbox } from 'lucide-react';

const sc: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
    'Accepted': { color: 'text-emerald-600', bg: 'bg-emerald-100', icon: CheckCircle2 },
    'Under Review': { color: 'text-amber-600', bg: 'bg-amber-100', icon: Clock },
    'Declined': { color: 'text-rose-500', bg: 'bg-rose-100', icon: XCircle },
};

type Proposal = {
    id: number;
    project: string;
    client: string;
    proposedPrice: number;
    timeline: string;
    status: string;
    submittedOn: string;
    decidedOn: string | null;
    coverNote: string;
};

export default function ProposalsPage() {
    const [filter, setFilter] = useState('All');
    const [expanded, setExpanded] = useState<number | null>(null);
    const [showAI, setShowAI] = useState(false);
    const filters = ['All', 'Accepted', 'Under Review', 'Declined'];

    const proposals: Proposal[] = [];
    const filtered = filter === 'All' ? proposals : proposals.filter(p => p.status === filter);

    return (
        <AppShell title="My Proposals" subtitle="Track your submitted proposals and client decisions">
            <div className="grid grid-cols-4 gap-4 mb-7">
                {[
                    { label: 'Total Sent', value: 0, color: 'text-slate-800' },
                    { label: 'Accepted', value: 0, color: 'text-emerald-600' },
                    { label: 'Under Review', value: 0, color: 'text-amber-600' },
                    { label: 'Declined', value: 0, color: 'text-rose-500' },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
                        <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
                        <p className="text-xs text-slate-400 font-semibold mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between mb-5">
                <div className="flex gap-2">
                    {filters.map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === f ? 'bg-violet-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:border-violet-300'}`}>{f}</button>
                    ))}
                </div>
                <button onClick={() => setShowAI(!showAI)} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all">
                    <Sparkles className="w-4 h-4" /> AI Proposal
                </button>
            </div>

            {showAI && (
                <div className="bg-violet-50 border border-violet-200 rounded-2xl p-6 mb-6">
                    <h3 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2"><Sparkles className="w-4 h-4 text-violet-600" />AI Proposal Generator</h3>
                    <p className="text-xs text-slate-500 mb-4">Describe your approach and AI will draft a compelling proposal.</p>
                    <textarea rows={4} className="w-full p-3 rounded-xl border border-violet-200 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 resize-none" placeholder="Describe the project and your approach..." />
                    <div className="flex gap-3 mt-3">
                        <button className="flex-1 py-2.5 bg-violet-600 text-white text-sm font-bold rounded-xl hover:bg-violet-700 transition-colors">Generate Draft</button>
                        <button onClick={() => setShowAI(false)} className="px-4 py-2.5 border border-slate-200 text-slate-500 text-sm rounded-xl hover:bg-slate-50 transition">Cancel</button>
                    </div>
                </div>
            )}

            {filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-20 px-4 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-4">
                        <Inbox className="w-7 h-7 text-violet-400" />
                    </div>
                    <p className="text-sm font-bold text-slate-700">No proposals submitted yet</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                        Use the AI Proposal generator to craft winning bids and land your first client.
                    </p>
                    <button onClick={() => setShowAI(true)} className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white text-sm font-bold rounded-xl hover:bg-violet-700 transition-colors shadow">
                        <Sparkles className="w-4 h-4" /> Create First Proposal
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map(p => {
                        const cfg = sc[p.status];
                        const Icon = cfg.icon;
                        const isEx = expanded === p.id;
                        return (
                            <div key={p.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                <div className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => setExpanded(isEx ? null : p.id)}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                                            <FileText className="w-5 h-5 text-violet-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900">{p.project}</h3>
                                            <p className="text-xs text-slate-400 mt-0.5">{p.client} · {p.submittedOn}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <p className="text-sm font-extrabold text-slate-900">${p.proposedPrice.toLocaleString()}</p>
                                            <p className="text-[11px] text-slate-400">{p.timeline}</p>
                                        </div>
                                        <span className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full ${cfg.bg} ${cfg.color}`}><Icon className="w-3.5 h-3.5" />{p.status}</span>
                                    </div>
                                </div>
                                {isEx && (
                                    <div className="px-5 pb-5 border-t border-slate-100">
                                        <div className="grid grid-cols-3 gap-4 py-4 mb-4">
                                            <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-violet-500" /><div><p className="text-[10px] text-slate-400 uppercase font-bold">Quoted</p><p className="text-sm font-bold text-slate-800">${p.proposedPrice.toLocaleString()}</p></div></div>
                                            <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-violet-500" /><div><p className="text-[10px] text-slate-400 uppercase font-bold">Timeline</p><p className="text-sm font-bold text-slate-800">{p.timeline}</p></div></div>
                                            <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-violet-500" /><div><p className="text-[10px] text-slate-400 uppercase font-bold">{p.decidedOn ? 'Decided' : 'Waiting'}</p><p className="text-sm font-bold text-slate-800">{p.decidedOn || 'Pending'}</p></div></div>
                                        </div>
                                        <div className="bg-slate-50 rounded-xl p-4"><p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Cover Note</p><p className="text-sm text-slate-600 leading-relaxed">{p.coverNote}</p></div>
                                        {p.status === 'Under Review' && (
                                            <div className="flex gap-3 mt-4">
                                                <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"><Send className="w-3.5 h-3.5" />Follow Up</button>
                                                <button className="px-4 py-2 rounded-xl border border-rose-200 text-rose-500 text-xs font-bold hover:bg-rose-50">Withdraw</button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </AppShell>
    );
}
