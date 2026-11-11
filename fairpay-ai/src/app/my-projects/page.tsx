'use client';

import React, { useState } from 'react';
import AppShell from '@/components/AppShell';
import {
    Briefcase, CheckCircle2, Shield, Inbox, Plus
} from 'lucide-react';

export default function MyProjectsPage() {
    const projects: never[] = [];

    return (
        <AppShell title="My Projects" subtitle="Your active contracts, milestones, and deliverables">
            {/* Summary Bar */}
            <div className="grid grid-cols-3 gap-4 mb-7">
                {[
                    { label: 'Active Contracts', value: '0', icon: Briefcase, color: 'bg-violet-50 text-violet-600' },
                    { label: 'In Escrow', value: '$0', icon: Shield, color: 'bg-indigo-50 text-indigo-600' },
                    { label: 'Completed', value: '0', icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
                ].map(s => {
                    const Icon = s.icon;
                    return (
                        <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xl font-extrabold text-slate-900">{s.value}</p>
                                <p className="text-xs text-slate-400 font-medium">{s.label}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {projects.length === 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-20 px-4 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-5">
                        <Inbox className="w-8 h-8 text-violet-400" />
                    </div>
                    <p className="text-base font-bold text-slate-800">No projects yet</p>
                    <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto">
                        Your active contracts and milestones will appear here once a client accepts your proposal.
                    </p>
                    <a
                        href="/find-projects"
                        className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white text-sm font-bold rounded-xl hover:bg-violet-700 transition-colors shadow"
                    >
                        <Plus className="w-4 h-4" /> Find Projects
                    </a>
                </div>
            )}
        </AppShell>
    );
}
