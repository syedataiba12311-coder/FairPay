'use client';

import React from 'react';
import { ArrowUpRight, CheckCircle, Clock, ShieldCheck, ChevronRight, Inbox, Plus } from 'lucide-react';

export interface ProjectStreamItem {
    id: string;
    title: string;
    client: string;
    amount: number;
    inEscrow: number;
    currentMilestone: string;
    progressPercent: number;
    status: 'In Escrow' | 'Pending Approval' | 'Active Escrow' | 'Released';
    dueDate: string;
}

interface PaymentStreamsListProps {
    projects: ProjectStreamItem[];
    onReleaseFunds?: (id: string) => void;
    onViewProject?: (project: ProjectStreamItem) => void;
    onNewProject?: () => void;
}

export default function PaymentStreamsList({
    projects,
    onReleaseFunds,
    onViewProject,
    onNewProject,
}: PaymentStreamsListProps) {
    return (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Payment Streams</h3>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                        REAL-TIME STATUS OF YOUR PROJECTS
                    </p>
                </div>
                {projects.length > 0 && (
                    <a
                        href="/proposals"
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors group"
                    >
                        <span>FULL LIST</span>
                        <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                    </a>
                )}
            </div>

            {/* Empty State when no demo data exists */}
            {projects.length === 0 ? (
                <div className="py-12 px-4 text-center rounded-2xl border-2 border-dashed border-slate-200/80 bg-slate-50/50">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-3">
                        <Inbox className="w-6 h-6 text-blue-500" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800">No active payment streams</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-5">
                        You don't have any projects in escrow yet. Create a new contract or generate an invoice using AI to start tracking milestones.
                    </p>
                    {onNewProject && (
                        <button
                            onClick={onNewProject}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition shadow-xs"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Create First Project</span>
                        </button>
                    )}
                </div>
            ) : (
                /* Streams list */
                <div className="divide-y divide-slate-100">
                    {projects.map((proj) => {
                        const isPending = proj.status === 'Pending Approval';
                        const isReleased = proj.status === 'Released';

                        return (
                            <div
                                key={proj.id}
                                className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-slate-50/70 p-3 -mx-3 rounded-2xl transition-all"
                            >
                                {/* Left project details */}
                                <div className="flex items-start gap-3.5">
                                    <div
                                        className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${isReleased
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : isPending
                                                    ? 'bg-amber-100 text-amber-700'
                                                    : 'bg-blue-100 text-blue-700'
                                            }`}
                                    >
                                        {isReleased ? (
                                            <CheckCircle className="w-5 h-5" />
                                        ) : isPending ? (
                                            <Clock className="w-5 h-5" />
                                        ) : (
                                            <ShieldCheck className="w-5 h-5" />
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4
                                                onClick={() => onViewProject && onViewProject(proj)}
                                                className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors cursor-pointer"
                                            >
                                                {proj.title}
                                            </h4>
                                            <span
                                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${isReleased
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                        : isPending
                                                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                                                    }`}
                                            >
                                                {proj.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                            <span className="font-medium text-slate-600">Client: {proj.client}</span>
                                            <span>•</span>
                                            <span className="text-slate-400">Current: {proj.currentMilestone}</span>
                                        </div>

                                        {/* Progress bar */}
                                        <div className="mt-2 flex items-center gap-2 max-w-xs">
                                            <div className="w-48 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                                                    style={{ width: `${proj.progressPercent}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-[11px] font-semibold text-slate-500">
                                                {proj.progressPercent}%
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right amount and actions */}
                                <div className="flex items-center justify-between md:justify-end gap-5 shrink-0 pl-13 md:pl-0">
                                    <div className="text-right">
                                        <div className="text-base font-extrabold text-slate-900">
                                            ${proj.amount.toLocaleString()}
                                        </div>
                                        <div className="text-[11px] font-medium text-slate-400">
                                            {proj.inEscrow > 0 ? `$${proj.inEscrow} in vault` : 'Milestone payout ready'}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {onReleaseFunds && !isReleased && (
                                            <button
                                                onClick={() => onReleaseFunds(proj.id)}
                                                className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white transition shadow-2xs flex items-center gap-1"
                                            >
                                                <span>Claim Payout</span>
                                                <ArrowUpRight className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                        {onViewProject && (
                                            <button
                                                onClick={() => onViewProject(proj)}
                                                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition"
                                                title="Inspect details"
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
