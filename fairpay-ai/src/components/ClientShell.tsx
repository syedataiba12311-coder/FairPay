'use client';

import React, { useState } from 'react';
import ClientSidebar from './ClientSidebar';
import { Bell, Search, User } from 'lucide-react';

interface ClientShellProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
}

export default function ClientShell({ children, title, subtitle }: ClientShellProps) {
    const [notifOpen, setNotifOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#f0f4ff]">
            <ClientSidebar />

            <div className="flex-1 flex flex-col ml-64 min-w-0">
                {/* Top Navigation Bar */}
                <header className="h-16 bg-white border-b border-blue-100 px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
                    <div>
                        <h1 className="text-lg font-bold text-slate-800 leading-none">{title}</h1>
                        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="relative hidden md:flex items-center">
                            <Search className="absolute left-3 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-9 pr-4 py-2 text-sm bg-blue-50 border border-blue-100 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition w-52"
                            />
                        </div>

                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => setNotifOpen(!notifOpen)}
                                className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative"
                            >
                                <Bell className="w-4.5 h-4.5" />
                                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-white" />
                            </button>
                            {notifOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50">
                                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Notifications</span>
                                        <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">3 New</span>
                                    </div>
                                    <div className="space-y-2">
                                        {[
                                            { title: 'New Proposal Received', desc: 'A freelancer applied to your React project', time: '10m ago' },
                                            { title: 'Milestone Completed', desc: 'Phase 1 deliverables submitted for review', time: '2h ago' },
                                            { title: 'Contract Signed', desc: 'David Chen accepted the agreement', time: '5h ago' },
                                        ].map((n, i) => (
                                            <div key={i} className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 transition-colors cursor-pointer">
                                                <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                                                <p className="text-[11px] text-slate-500 mt-0.5">{n.desc}</p>
                                                <span className="text-[10px] text-blue-400 font-medium mt-1 block">{n.time}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold text-sm shadow cursor-pointer hover:scale-105 transition-transform">
                            <User className="w-4 h-4" />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
