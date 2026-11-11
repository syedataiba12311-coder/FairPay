'use client';

import React, { useState } from 'react';
import { X, Wallet, Shield } from 'lucide-react';

interface WalletModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentAddress: string;
    onSaveAddress: (addr: string) => void;
}

export default function WalletModal({
    isOpen,
    onClose,
    currentAddress,
    onSaveAddress,
}: WalletModalProps) {
    const [addr, setAddr] = useState(currentAddress === 'Connect Wallet' ? '' : currentAddress);

    if (!isOpen) return null;

    const handleSave = () => {
        if (addr.trim()) {
            onSaveAddress(addr.trim());
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Wallet className="w-4 h-4" />
                        </div>
                        <h3 className="font-bold text-slate-900 text-base">Configure Payout Channel</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                            Payout Destination (Wallet Address or PayPal Email)
                        </label>
                        <input
                            type="text"
                            value={addr}
                            onChange={(e) => setAddr(e.target.value)}
                            placeholder="e.g. 0x... or billing@company.com"
                            className="w-full text-sm font-mono p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                        />
                    </div>

                    <div className="p-3 bg-blue-50 rounded-xl text-blue-800 text-xs flex items-center gap-2">
                        <Shield className="w-4 h-4 shrink-0 text-blue-600" />
                        <span>Funds released from completed milestones will be routed directly to this destination.</span>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={!addr.trim()}
                        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition"
                    >
                        Save Payout Channel
                    </button>
                </div>
            </div>
        </div>
    );
}
