'use client';

import React, { useState } from 'react';
import { Bell, Power, Check, Copy, Inbox } from 'lucide-react';

interface NotificationItem {
    id: string;
    title: string;
    description: string;
    time: string;
}

interface HeaderProps {
    walletAddress?: string;
    notifications?: NotificationItem[];
    onWalletClick?: () => void;
}

export default function Header({
    walletAddress = 'Connect Wallet',
    notifications = [],
    onWalletClick
}: HeaderProps) {
    const [copied, setCopied] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    const handleCopy = () => {
        if (walletAddress && walletAddress !== 'Connect Wallet') {
            navigator.clipboard?.writeText(walletAddress);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const isConnected = walletAddress && walletAddress !== 'Connect Wallet';

    return (
        <header className="h-20 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
            {/* Left greeting */}
            <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                    <span>Welcome back!</span>
                    <span className="text-xl">👋</span>
                </h1>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-4">
                {/* Notifications button */}
                <div className="relative">
                    <button
                        onClick={() => setNotificationsOpen(!notificationsOpen)}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative"
                        aria-label="Notifications"
                    >
                        <Bell className="w-5 h-5" />
                        {notifications.length > 0 && (
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
                        )}
                    </button>

                    {/* Notifications dropdown */}
                    {notificationsOpen && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Recent Activity</span>
                                <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-semibold">
                                    {notifications.length} New
                                </span>
                            </div>
                            {notifications.length === 0 ? (
                                <div className="py-6 text-center text-slate-400">
                                    <Inbox className="w-6 h-6 mx-auto mb-1.5 opacity-50" />
                                    <p className="text-xs font-medium">No recent notifications</p>
                                </div>
                            ) : (
                                <div className="space-y-2.5 text-xs">
                                    {notifications.map((n) => (
                                        <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                            <p className="font-semibold text-slate-800">{n.title}</p>
                                            <p className="text-slate-500 text-[11px]">{n.description}</p>
                                            <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Connected Wallet / Identity Badge */}
                <div
                    onClick={onWalletClick || handleCopy}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-mono font-medium text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer shadow-2xs"
                    title={isConnected ? 'Click to copy address' : 'Click to connect wallet'}
                >
                    <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
                    <span>{walletAddress}</span>
                    {isConnected && (
                        copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />
                    )}
                </div>

                {/* LOGOUT button */}
                <button
                    onClick={() => alert('Session cleared.')}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-400 text-xs font-bold tracking-wider uppercase transition-all shadow-2xs"
                >
                    <Power className="w-3.5 h-3.5" />
                    <span>LOGOUT</span>
                </button>
            </div>
        </header>
    );
}
