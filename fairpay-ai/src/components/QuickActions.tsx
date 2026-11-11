'use client';

import React from 'react';
import { Plus, FileDown, Link as LinkIcon, Headphones, ChevronRight } from 'lucide-react';

interface QuickActionsProps {
    onNewInvoice: () => void;
    onExportData: () => void;
    onLinkWallet: () => void;
    onSupport: () => void;
}

export default function QuickActions({
    onNewInvoice,
    onExportData,
    onLinkWallet,
    onSupport,
}: QuickActionsProps) {
    const actions = [
        {
            label: 'NEW INVOICE',
            icon: Plus,
            onClick: onNewInvoice,
        },
        {
            label: 'EXPORT DATA',
            icon: FileDown,
            onClick: onExportData,
        },
        {
            label: 'LINK WALLET',
            icon: LinkIcon,
            onClick: onLinkWallet,
        },
        {
            label: 'SUPPORT',
            icon: Headphones,
            onClick: onSupport,
        },
    ];

    return (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs h-full flex flex-col justify-between">
            <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-4">Quick Actions</h3>
                <div className="space-y-3">
                    {actions.map((act) => {
                        const Icon = act.icon;
                        return (
                            <button
                                key={act.label}
                                onClick={act.onClick}
                                className="w-full py-3.5 px-4 rounded-2xl bg-slate-50 hover:bg-slate-100/90 border border-slate-100 hover:border-slate-200 text-slate-800 transition-all flex items-center justify-between group shadow-2xs"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="text-slate-500 group-hover:text-blue-600 transition-colors">
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-extrabold tracking-wider text-slate-800">
                                        {act.label}
                                    </span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
