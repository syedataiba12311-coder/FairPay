'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import { Search, SlidersHorizontal, MapPin, Clock, DollarSign, Bookmark, ChevronRight, Star, Users } from 'lucide-react';
import { projects } from '@/lib/projects-data';

const categories = ['All', 'Web Dev', 'Mobile', 'UI/UX Design', 'AI/ML', 'Backend', 'DevOps', 'Writing'];
const budgets = ['Any Budget', 'Under $500', '$500–$2K', '$2K–$5K', '$5K+'];

export default function FindProjectsPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeBudget, setActiveBudget] = useState('Any Budget');
    const [savedIds, setSavedIds] = useState<number[]>([]);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const filtered = projects.filter(p => {
        const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchCat = activeCategory === 'All' || p.category === activeCategory;
        return matchSearch && matchCat;
    });

    return (
        <AppShell title="Find Projects" subtitle="Browse open opportunities that match your skills">
            {/* Search & Filters */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
                <div className="flex gap-3 mb-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search by title, skill, or keyword..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-600 hover:border-violet-300 hover:text-violet-600 transition">
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                    </button>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap gap-2 mb-3">
                    {categories.map(c => (
                        <button
                            key={c}
                            onClick={() => setActiveCategory(c)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${activeCategory === c
                                ? 'bg-violet-600 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-600 hover:bg-violet-100 hover:text-violet-700'
                                }`}
                        >{c}</button>
                    ))}
                </div>

                {/* Budget Pills */}
                <div className="flex flex-wrap gap-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider self-center mr-1 flex items-center gap-1"><DollarSign className="w-3 h-3" />Budget:</span>
                    {budgets.map(b => (
                        <button
                            key={b}
                            onClick={() => setActiveBudget(b)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${activeBudget === b
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-indigo-100 hover:text-indigo-700'
                                }`}
                        >{b}</button>
                    ))}
                </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-slate-500"><span className="font-bold text-slate-800">{filtered.length}</span> projects found</p>
                <select className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30">
                    <option>Most Recent</option>
                    <option>Budget: High to Low</option>
                    <option>Fewest Proposals</option>
                </select>
            </div>

            {/* Project Cards */}
            <div className="space-y-4">
                {filtered.map(p => (
                    <div key={p.id} className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all ${p.featured ? 'border-violet-200 ring-1 ring-violet-200/60' : 'border-slate-100'}`}>
                        {p.featured && (
                            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-t-2xl">
                                ⭐ Featured Project
                            </div>
                        )}
                        <div className="p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-bold bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full uppercase tracking-wide">{p.category}</span>
                                        <span className="text-[10px] text-slate-400">{p.posted}</span>
                                    </div>
                                    <h3
                                        className="text-base font-bold text-slate-900 hover:text-violet-700 cursor-pointer transition-colors"
                                        onClick={() => router.push(`/find-projects/${p.id}`)}
                                    >
                                        {p.title}
                                    </h3>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="text-xs font-semibold text-slate-600">{p.client}</span>
                                        <Star className="w-3 h-3 text-amber-400 fill-amber-400 ml-1" />
                                        <span className="text-xs text-slate-500">{p.clientRating}</span>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-base font-extrabold text-slate-900">{p.budget}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{p.duration}</p>
                                </div>
                            </div>

                            {/* Meta */}
                            <div className="flex items-center gap-4 mt-3 mb-3">
                                <span className="flex items-center gap-1 text-xs text-slate-400"><MapPin className="w-3.5 h-3.5" />{p.location}</span>
                                <span className="flex items-center gap-1 text-xs text-slate-400"><Clock className="w-3.5 h-3.5" />{p.duration}</span>
                                <span className="flex items-center gap-1 text-xs text-slate-400"><Users className="w-3.5 h-3.5" />{p.proposals} proposals</span>
                            </div>

                            {/* Description */}
                            <p className={`text-sm text-slate-500 leading-relaxed mb-4 ${expandedId === p.id ? '' : 'line-clamp-2'}`}>{p.desc}</p>
                            {expandedId !== p.id && (
                                <button onClick={() => setExpandedId(p.id)} className="text-xs text-violet-600 font-semibold flex items-center gap-1 mb-3 hover:underline">
                                    Read more <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            )}

                            {/* Skills */}
                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {p.skills.map(s => (
                                    <span key={s} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-semibold rounded-lg">{s}</span>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => router.push(`/find-projects/${p.id}`)}
                                    className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all bg-violet-600 text-white hover:bg-violet-700 shadow-sm shadow-violet-500/25"
                                >
                                    Apply Now
                                </button>
                                <button
                                    onClick={() => setSavedIds(prev => prev.includes(p.id) ? prev.filter(i => i !== p.id) : [...prev, p.id])}
                                    className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors ${savedIds.includes(p.id)
                                        ? 'bg-violet-100 border-violet-300 text-violet-600'
                                        : 'border-slate-200 text-slate-400 hover:border-violet-300 hover:text-violet-600'
                                        }`}
                                >
                                    <Bookmark className="w-4 h-4" fill={savedIds.includes(p.id) ? 'currentColor' : 'none'} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </AppShell>
    );
}
