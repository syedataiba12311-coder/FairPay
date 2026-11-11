'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Zap,
    LayoutDashboard,
    Search,
    FolderOpen,
    FileText,
    FilePenLine,
    CreditCard,
    User,
    LogOut,
    ChevronDown
} from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Find Projects', href: '/find-projects', icon: Search },
        { name: 'My Projects', href: '/my-projects', icon: FolderOpen },
        { name: 'Proposals', href: '/proposals', icon: FileText },
        { name: 'Agreements', href: '/agreements', icon: FilePenLine },
        { name: 'Payments', href: '/payments', icon: CreditCard },
        { name: 'My Profile', href: '/profile', icon: User },
    ];

    const isCurrent = (href: string) => {
        if (href === '/dashboard' && (pathname === '/dashboard' || pathname === '/')) return true;
        return pathname === href;
    };

    return (
        <aside className="w-64 bg-[#0d0f1e] text-white flex flex-col justify-between p-5 min-h-screen border-r border-violet-900/30 select-none shrink-0 fixed left-0 top-0 z-40">
            {/* Brand */}
            <div>
                <Link href="/dashboard" className="flex items-center gap-3 px-2 py-3 mb-8 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/40 group-hover:scale-105 transition-transform">
                        <Zap className="w-5 h-5 fill-white text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-extrabold tracking-tight text-white leading-none">FairPay</span>
                        <span className="text-[10px] font-semibold text-violet-400 tracking-widest uppercase">AI Platform</span>
                    </div>
                </Link>

                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-4 mb-3">Main Menu</p>

                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isCurrent(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${active
                                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Icon className={`w-4.5 h-4.5 ${active ? 'text-white' : 'text-slate-500'}`} />
                                <span>{item.name}</span>
                                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom */}
            <div className="pt-6 border-t border-white/5 space-y-4">
                <button
                    onClick={() => alert('Logged out (Demo)')}
                    className="flex items-center gap-3 px-4 py-2.5 w-full text-slate-400 hover:text-rose-400 text-sm font-medium rounded-xl hover:bg-white/5 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                </button>

                <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
                    <div className="text-[10px] tracking-widest uppercase font-bold text-slate-500 mb-1.5 flex items-center justify-between">
                        <span>Network</span>
                        <span className="text-[9px] bg-violet-500/20 text-violet-300 px-1.5 py-0.5 rounded">v2.4</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-300 cursor-pointer hover:text-white">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Ethereum Mainnet</span>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                </div>
            </div>
        </aside>
    );
}
