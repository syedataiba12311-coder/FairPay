'use client';

import React, { useState } from 'react';
import AppShell from '@/components/AppShell';
import {
    DollarSign, Shield, Clock, TrendingUp, Sparkles, ArrowUpRight,
    Calendar, Briefcase
} from 'lucide-react';

const stats = [
    { label: 'Total Earnings', value: '$0', change: 'No earnings yet', icon: DollarSign, bg: 'bg-violet-50', iconColor: 'text-violet-500', changeColor: 'text-slate-400' },
    { label: 'In Escrow', value: '$0', change: 'No active contracts', icon: Shield, bg: 'bg-indigo-50', iconColor: 'text-indigo-500', changeColor: 'text-slate-400' },
    { label: 'Pending', value: '$0', change: 'Nothing pending', icon: Clock, bg: 'bg-amber-50', iconColor: 'text-amber-500', changeColor: 'text-slate-400' },
    { label: 'Success Rate', value: '—', change: 'Complete jobs to track', icon: TrendingUp, bg: 'bg-emerald-50', iconColor: 'text-emerald-500', changeColor: 'text-slate-400' },
];

export default function DashboardPage() {
    const [timeRange, setTimeRange] = useState('This Month');

    return (
        <AppShell title="Freelancer Dashboard" subtitle="Your performance overview and active work">
            {/* Time Filter */}
            <div className="flex items-center justify-between mb-7">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Overview</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Track earnings, projects, and upcoming deadlines.</p>
                </div>
                <div className="flex gap-2">
                    {['This Week', 'This Month', 'This Quarter'].map(r => (
                        <button
                            key={r}
                            onClick={() => setTimeRange(r)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${timeRange === r
                                ? 'bg-violet-600 text-white shadow-md shadow-violet-500/30'
                                : 'bg-white text-slate-600 border border-slate-200 hover:border-violet-300'
                                }`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
                {stats.map((s) => {
                    const Icon = s.icon;
                    return (
                        <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-4`}>
                                <Icon className={`w-5 h-5 ${s.iconColor}`} />
                            </div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{s.label}</p>
                            <p className="text-2xl font-extrabold text-slate-900 mt-1">{s.value}</p>
                            <p className={`text-[11px] font-semibold mt-2 ${s.changeColor}`}>{s.change}</p>
                        </div>
                    );
                })}
            </div>

            {/* Middle section: Active Projects + Deadlines */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-7">
                {/* Active Projects */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-base font-bold text-slate-800">Active Projects</h3>
                        <a href="/my-projects" className="text-xs text-violet-600 font-semibold hover:underline">View All</a>
                    </div>
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center mb-4">
                            <Briefcase className="w-7 h-7 text-violet-400" />
                        </div>
                        <p className="text-sm font-bold text-slate-700">No active projects yet</p>
                        <p className="text-xs text-slate-400 mt-1 max-w-xs">Browse open opportunities and apply to start earning.</p>
                        <a href="/find-projects" className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white text-xs font-bold rounded-xl hover:bg-violet-700 transition-colors">
                            <ArrowUpRight className="w-3.5 h-3.5" /> Find Projects
                        </a>
                    </div>
                </div>

                {/* Upcoming Deadlines */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <Calendar className="w-4 h-4 text-violet-500" />
                        <h3 className="text-base font-bold text-slate-800">Upcoming Deadlines</h3>
                    </div>
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-3">
                            <Calendar className="w-6 h-6 text-slate-300" />
                        </div>
                        <p className="text-sm font-semibold text-slate-500">No upcoming deadlines</p>
                        <p className="text-[11px] text-slate-400 mt-1">Deadlines will appear here once you have active contracts.</p>
                    </div>
                </div>
            </div>

            {/* Recent Activity + AI Banner */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="text-base font-bold text-slate-800 mb-5">Recent Activity</h3>
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-3">
                            <Clock className="w-6 h-6 text-slate-300" />
                        </div>
                        <p className="text-sm font-semibold text-slate-500">No activity yet</p>
                        <p className="text-[11px] text-slate-400 mt-1">Milestones, payments, and updates will show up here.</p>
                    </div>
                </div>

                {/* AI Banner */}
                <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-6 text-white flex flex-col justify-between shadow-lg shadow-violet-500/20">
                    <div>
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-extrabold leading-tight">AI-Powered Proposals</h3>
                        <p className="text-sm text-violet-200 mt-2 leading-relaxed">Generate winning proposals in seconds using FairPay AI.</p>
                    </div>
                    <a href="/proposals" className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-violet-700 text-sm font-bold rounded-xl hover:bg-violet-50 transition-colors shadow">
                        <Sparkles className="w-4 h-4" />
                        Generate Now
                        <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                </div>
            </div>
        </AppShell>
    );
}
