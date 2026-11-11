'use client';

import React, { useState } from 'react';
import { X, Sparkles, FolderPlus, ShieldCheck } from 'lucide-react';

interface NewProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddProject: (project: {
        title: string;
        client: string;
        amount: number;
        inEscrow: number;
        currentMilestone: string;
        progressPercent: number;
        status: string;
    }) => void;
    onOpenAiGenerator: () => void;
}

export default function NewProjectModal({
    isOpen,
    onClose,
    onAddProject,
    onOpenAiGenerator,
}: NewProjectModalProps) {
    const [title, setTitle] = useState('');
    const [client, setClient] = useState('');
    const [amount, setAmount] = useState('');
    const [escrowDeposit, setEscrowDeposit] = useState('');
    const [milestones, setMilestones] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !client) return;

        onAddProject({
            title,
            client,
            amount: parseFloat(amount) || 1000,
            inEscrow: parseFloat(escrowDeposit) || 0,
            currentMilestone: milestones,
            progressPercent: 15,
            status: 'Active Escrow',
        });

        setTitle('');
        setClient('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-950 text-white flex items-center justify-center">
                            <FolderPlus className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-base">Create Escrow Protected Project</h3>
                            <p className="text-xs text-slate-500">Lock funds upfront, release by validated milestones</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="bg-blue-50 border border-blue-200/60 rounded-2xl p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-blue-900 font-semibold">
                            <Sparkles className="w-4 h-4 text-blue-600" />
                            <span>Want AI to draft milestone specs for you?</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                onOpenAiGenerator();
                            }}
                            className="text-xs font-bold bg-blue-600 text-white px-3 py-1.5 rounded-xl hover:bg-blue-700 transition"
                        >
                            Use Gemini AI
                        </button>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Project Title
                        </label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Next.js SaaS Web App & API"
                            className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Client / Organization Name
                        </label>
                        <input
                            type="text"
                            required
                            value={client}
                            onChange={(e) => setClient(e.target.value)}
                            placeholder="e.g. Acme Tech Ventures"
                            className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Total Contract ($)
                            </label>
                            <input
                                type="number"
                                value={amount}
                                placeholder="1000"
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-slate-800"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Upfront Escrow ($)
                            </label>
                            <input
                                type="number"
                                value={escrowDeposit}
                                placeholder="500"
                                onChange={(e) => setEscrowDeposit(e.target.value)}
                                className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-slate-800"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Initial Milestone Deliverable
                        </label>
                        <input
                            type="text"
                            value={milestones}
                            placeholder="e.g. Milestone 1: Initial Discovery & Architecture"
                            onChange={(e) => setMilestones(e.target.value)}
                            className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full py-3.5 px-4 rounded-xl bg-slate-950 hover:bg-black text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition"
                        >
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span>Initialize Project & Escrow Contract</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
