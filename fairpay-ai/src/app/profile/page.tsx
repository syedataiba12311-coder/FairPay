'use client';
import React, { useState } from 'react';
import AppShell from '@/components/AppShell';
import {
    User, Star, Briefcase, Code2, Camera, Save, Edit3,
    Plus, X, MapPin, Globe, Link2, GitBranch, Upload,
    CheckCircle2, AlertCircle, ChevronRight
} from 'lucide-react';

const EMPTY_PROFILE = {
    firstName: '',
    lastName: '',
    title: '',
    bio: '',
    rate: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
};

type PortfolioItem = { title: string; desc: string; tags: string[]; year: string; color: string };
type ExperienceItem = { role: string; company: string; period: string; desc: string };

const COLORS = [
    'from-violet-500 to-indigo-600',
    'from-indigo-500 to-blue-600',
    'from-violet-400 to-pink-500',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
];

export default function ProfilePage() {
    const [editing, setEditing] = useState(false);
    const [saved, setSaved] = useState(false);
    const [profile, setProfile] = useState(EMPTY_PROFILE);
    const [draft, setDraft] = useState(EMPTY_PROFILE);
    const [skills, setSkills] = useState<string[]>([]);
    const [newSkill, setNewSkill] = useState('');
    const [activeTab, setActiveTab] = useState<'Portfolio' | 'Experience'>('Portfolio');

    // Portfolio state
    const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
    const [addingPortfolio, setAddingPortfolio] = useState(false);
    const [newPortfolio, setNewPortfolio] = useState({ title: '', desc: '', tags: '', year: new Date().getFullYear().toString(), color: COLORS[0] });

    // Experience state
    const [experience, setExperience] = useState<ExperienceItem[]>([]);
    const [addingExp, setAddingExp] = useState(false);
    const [newExp, setNewExp] = useState({ role: '', company: '', period: '', desc: '' });

    const isProfileEmpty = !profile.firstName && !profile.lastName;

    const handleEdit = () => {
        setDraft({ ...profile });
        setEditing(true);
    };

    const handleSave = () => {
        setProfile({ ...draft });
        setEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleCancel = () => {
        setDraft({ ...profile });
        setEditing(false);
    };

    const addSkill = () => {
        const trimmed = newSkill.trim();
        if (trimmed && !skills.includes(trimmed)) {
            setSkills([...skills, trimmed]);
            setNewSkill('');
        }
    };

    const addPortfolio = () => {
        if (!newPortfolio.title.trim()) return;
        setPortfolio([...portfolio, {
            title: newPortfolio.title,
            desc: newPortfolio.desc,
            tags: newPortfolio.tags.split(',').map(t => t.trim()).filter(Boolean),
            year: newPortfolio.year,
            color: newPortfolio.color,
        }]);
        setNewPortfolio({ title: '', desc: '', tags: '', year: new Date().getFullYear().toString(), color: COLORS[0] });
        setAddingPortfolio(false);
    };

    const addExperience = () => {
        if (!newExp.role.trim() || !newExp.company.trim()) return;
        setExperience([...experience, { ...newExp }]);
        setNewExp({ role: '', company: '', period: '', desc: '' });
        setAddingExp(false);
    };

    const displayName = profile.firstName || profile.lastName
        ? `${profile.firstName} ${profile.lastName}`.trim()
        : null;

    const initials = profile.firstName && profile.lastName
        ? `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase()
        : profile.firstName
            ? profile.firstName[0].toUpperCase()
            : '?';

    return (
        <AppShell title="My Profile" subtitle="Build your freelancer profile to attract clients">
            {/* Save toast */}
            {saved && (
                <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-fade-in">
                    <CheckCircle2 className="w-4 h-4" /> Profile saved successfully!
                </div>
            )}

            {/* Onboarding banner for empty profile */}
            {isProfileEmpty && !editing && (
                <div className="mb-6 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-6 text-white flex items-center justify-between gap-4 shadow-lg shadow-violet-500/20">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                            <AlertCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-base">Your profile is empty</h3>
                            <p className="text-violet-200 text-sm mt-0.5">Complete your profile to start receiving project invitations and stand out to clients.</p>
                        </div>
                    </div>
                    <button
                        onClick={handleEdit}
                        className="shrink-0 px-5 py-2.5 bg-white text-violet-700 text-sm font-extrabold rounded-xl hover:bg-violet-50 transition-colors shadow"
                    >
                        Set Up Profile
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ── Left Panel ── */}
                <div className="lg:col-span-1 space-y-5">

                    {/* Avatar + Identity */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
                        {/* Avatar */}
                        <div className="relative inline-block mb-4">
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-extrabold mx-auto shadow-lg ${isProfileEmpty ? 'bg-slate-200' : 'bg-gradient-to-br from-violet-500 to-indigo-600 shadow-violet-500/30'}`}>
                                {isProfileEmpty ? <User className="w-10 h-10 text-slate-400" /> : initials}
                            </div>
                            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border-2 border-violet-500 flex items-center justify-center shadow hover:bg-violet-50 transition">
                                <Camera className="w-3.5 h-3.5 text-violet-600" />
                            </button>
                        </div>

                        {editing ? (
                            <div className="space-y-2 text-left">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">First Name</label>
                                        <input
                                            value={draft.firstName}
                                            onChange={e => setDraft(d => ({ ...d, firstName: e.target.value }))}
                                            placeholder="Alex"
                                            className="w-full mt-1 px-3 py-2 rounded-lg border border-violet-200 bg-violet-50/30 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Name</label>
                                        <input
                                            value={draft.lastName}
                                            onChange={e => setDraft(d => ({ ...d, lastName: e.target.value }))}
                                            placeholder="Johnson"
                                            className="w-full mt-1 px-3 py-2 rounded-lg border border-violet-200 bg-violet-50/30 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Professional Title</label>
                                    <input
                                        value={draft.title}
                                        onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
                                        placeholder="e.g. Full-Stack Developer"
                                        className="w-full mt-1 px-3 py-2 rounded-lg border border-violet-200 bg-violet-50/30 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                                {displayName ? (
                                    <>
                                        <h2 className="text-xl font-extrabold text-slate-900">{displayName}</h2>
                                        <p className="text-xs text-slate-500 mt-1">{profile.title || <span className="italic text-slate-300">No title set</span>}</p>
                                    </>
                                ) : (
                                    <>
                                        <h2 className="text-base font-bold text-slate-400 italic">Your Name</h2>
                                        <p className="text-xs text-slate-300 mt-1">Professional title</p>
                                    </>
                                )}
                                <div className="flex items-center justify-center gap-1 mt-2">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <Star key={s} className="w-3.5 h-3.5 text-slate-200" />
                                    ))}
                                    <span className="text-xs text-slate-300 ml-1">No reviews yet</span>
                                </div>
                            </>
                        )}

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-slate-100">
                            {[{ label: 'Jobs Done', value: '0' }, { label: 'Clients', value: '0' }, { label: 'On Time', value: '—' }].map(s => (
                                <div key={s.label}>
                                    <p className="text-lg font-extrabold text-slate-300">{s.value}</p>
                                    <p className="text-[10px] text-slate-400 font-medium">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Hourly Rate */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-violet-500" /> Hourly Rate
                        </h3>
                        {editing ? (
                            <div className="flex items-center gap-2">
                                <span className="text-slate-500 font-bold text-lg">$</span>
                                <input
                                    type="number"
                                    value={draft.rate}
                                    onChange={e => setDraft(d => ({ ...d, rate: e.target.value }))}
                                    placeholder="85"
                                    className="w-24 text-2xl font-extrabold text-violet-700 border-b border-violet-300 bg-transparent focus:outline-none"
                                />
                                <span className="text-slate-400 text-sm font-medium">/hr</span>
                            </div>
                        ) : profile.rate ? (
                            <p className="text-3xl font-extrabold text-violet-700">${profile.rate}<span className="text-slate-400 text-sm font-medium">/hr</span></p>
                        ) : (
                            <p className="text-sm text-slate-400 italic">Not set — add your hourly rate</p>
                        )}
                    </div>

                    {/* Location & Links */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-violet-500" /> Location & Links
                        </h3>
                        {editing ? (
                            <div className="space-y-2">
                                {[
                                    { key: 'location', icon: MapPin, placeholder: 'e.g. New York, USA' },
                                    { key: 'website', icon: Globe, placeholder: 'https://yoursite.com' },
                                    { key: 'linkedin', icon: Link2, placeholder: 'LinkedIn profile URL' },
                                    { key: 'github', icon: GitBranch, placeholder: 'GitHub profile URL' },
                                ].map(({ key, icon: Icon, placeholder }) => (
                                    <div key={key} className="relative">
                                        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                        <input
                                            value={draft[key as keyof typeof draft]}
                                            onChange={e => setDraft(d => ({ ...d, [key]: e.target.value }))}
                                            placeholder={placeholder}
                                            className="w-full pl-8 pr-3 py-2 rounded-lg border border-violet-200 bg-violet-50/30 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {[
                                    { val: profile.location, icon: MapPin, empty: 'Add location' },
                                    { val: profile.website, icon: Globe, empty: 'Add website' },
                                    { val: profile.linkedin, icon: Link2, empty: 'Add LinkedIn' },
                                    { val: profile.github, icon: GitBranch, empty: 'Add GitHub' },
                                ].map(({ val, icon: Icon, empty }, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                        {val ? (
                                            <span className="text-xs text-slate-600 truncate">{val}</span>
                                        ) : (
                                            <span className="text-xs text-slate-300 italic">{empty}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Edit / Save Buttons */}
                    {editing ? (
                        <div className="flex gap-2">
                            <button
                                onClick={handleSave}
                                className="flex-1 py-3 rounded-2xl bg-emerald-600 text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition shadow-sm shadow-emerald-500/25"
                            >
                                <Save className="w-4 h-4" /> Save Profile
                            </button>
                            <button
                                onClick={handleCancel}
                                className="px-4 py-3 rounded-2xl border border-slate-200 text-slate-500 text-sm font-bold hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleEdit}
                            className="w-full py-3 rounded-2xl bg-violet-600 text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-violet-700 transition shadow-sm shadow-violet-500/25"
                        >
                            <Edit3 className="w-4 h-4" /> {isProfileEmpty ? 'Set Up Profile' : 'Edit Profile'}
                        </button>
                    )}
                </div>

                {/* ── Right Panel ── */}
                <div className="lg:col-span-2 space-y-5">

                    {/* About Me */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                            <User className="w-4 h-4 text-violet-500" /> About Me
                        </h3>
                        {editing ? (
                            <textarea
                                value={draft.bio}
                                onChange={e => setDraft(d => ({ ...d, bio: e.target.value }))}
                                rows={5}
                                placeholder="Write a compelling bio — describe your expertise, the types of projects you love, and what makes you stand out as a freelancer…"
                                className="w-full text-sm text-slate-600 border border-violet-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-violet-500/30 resize-none bg-violet-50/30 placeholder-slate-300"
                            />
                        ) : profile.bio ? (
                            <p className="text-sm text-slate-600 leading-relaxed">{profile.bio}</p>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
                                <User className="w-7 h-7 text-slate-300 mb-2" />
                                <p className="text-sm text-slate-400 font-medium">No bio yet</p>
                                <p className="text-xs text-slate-300 mt-0.5">Tell clients about yourself and your expertise</p>
                                <button onClick={handleEdit} className="mt-3 text-xs text-violet-600 font-bold hover:underline flex items-center gap-1">
                                    Add Bio <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Skills */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                            <Code2 className="w-4 h-4 text-violet-500" /> Skills
                        </h3>
                        {skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2 mb-3">
                                {skills.map(s => (
                                    <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 text-violet-700 text-xs font-bold rounded-lg border border-violet-200">
                                        {s}
                                        <button onClick={() => setSkills(skills.filter(sk => sk !== s))}>
                                            <X className="w-3 h-3 text-violet-400 hover:text-rose-500 transition-colors" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-slate-400 italic mb-3">No skills added yet — add the technologies and tools you work with.</p>
                        )}
                        <div className="flex gap-2">
                            <input
                                value={newSkill}
                                onChange={e => setNewSkill(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && addSkill()}
                                placeholder="Type a skill and press Enter…"
                                className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-300 transition"
                            />
                            <button
                                onClick={addSkill}
                                className="w-9 h-9 rounded-lg bg-violet-600 text-white flex items-center justify-center hover:bg-violet-700 transition"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Portfolio & Experience Tabs */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="flex border-b border-slate-100">
                            {(['Portfolio', 'Experience'] as const).map(t => (
                                <button
                                    key={t}
                                    onClick={() => setActiveTab(t)}
                                    className={`flex-1 py-3.5 text-xs font-bold transition-colors ${activeTab === t ? 'text-violet-700 border-b-2 border-violet-600 bg-violet-50/40' : 'text-slate-500 hover:text-slate-800'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>

                        <div className="p-6">
                            {/* Portfolio Tab */}
                            {activeTab === 'Portfolio' && (
                                <>
                                    {portfolio.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                            {portfolio.map((p, i) => (
                                                <div key={i} className="group rounded-xl overflow-hidden border border-slate-100 hover:shadow-md transition-shadow">
                                                    <div className={`h-24 bg-gradient-to-br ${p.color} flex items-center justify-center relative`}>
                                                        <span className="text-white font-extrabold text-xs opacity-70 uppercase tracking-widest">{p.year}</span>
                                                        <button
                                                            onClick={() => setPortfolio(portfolio.filter((_, j) => j !== i))}
                                                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X className="w-3 h-3 text-white" />
                                                        </button>
                                                    </div>
                                                    <div className="p-3">
                                                        <h4 className="text-xs font-bold text-slate-800 leading-tight">{p.title}</h4>
                                                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{p.desc}</p>
                                                        <div className="flex flex-wrap gap-1 mt-2">
                                                            {p.tags.map(t => <span key={t} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-medium">{t}</span>)}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : !addingPortfolio && (
                                        <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-slate-200 rounded-xl mb-4">
                                            <Upload className="w-7 h-7 text-slate-300 mb-2" />
                                            <p className="text-sm text-slate-400 font-medium">No portfolio items yet</p>
                                            <p className="text-xs text-slate-300 mt-0.5">Showcase your best work to impress clients</p>
                                        </div>
                                    )}

                                    {addingPortfolio ? (
                                        <div className="border border-violet-200 rounded-xl p-4 bg-violet-50/30 space-y-3">
                                            <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Add Portfolio Item</h4>
                                            <input
                                                value={newPortfolio.title}
                                                onChange={e => setNewPortfolio(p => ({ ...p, title: e.target.value }))}
                                                placeholder="Project title *"
                                                className="w-full px-3 py-2 text-sm border border-violet-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                                            />
                                            <input
                                                value={newPortfolio.desc}
                                                onChange={e => setNewPortfolio(p => ({ ...p, desc: e.target.value }))}
                                                placeholder="Short description"
                                                className="w-full px-3 py-2 text-sm border border-violet-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                                            />
                                            <div className="grid grid-cols-2 gap-2">
                                                <input
                                                    value={newPortfolio.tags}
                                                    onChange={e => setNewPortfolio(p => ({ ...p, tags: e.target.value }))}
                                                    placeholder="Tags (comma separated)"
                                                    className="px-3 py-2 text-sm border border-violet-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                                                />
                                                <input
                                                    value={newPortfolio.year}
                                                    onChange={e => setNewPortfolio(p => ({ ...p, year: e.target.value }))}
                                                    placeholder="Year"
                                                    className="px-3 py-2 text-sm border border-violet-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Card Color</p>
                                                <div className="flex gap-2">
                                                    {COLORS.map(c => (
                                                        <button
                                                            key={c}
                                                            onClick={() => setNewPortfolio(p => ({ ...p, color: c }))}
                                                            className={`w-7 h-7 rounded-lg bg-gradient-to-br ${c} ${newPortfolio.color === c ? 'ring-2 ring-offset-1 ring-violet-500' : ''}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={addPortfolio} className="flex-1 py-2 bg-violet-600 text-white text-xs font-bold rounded-lg hover:bg-violet-700 transition">Add Item</button>
                                                <button onClick={() => setAddingPortfolio(false)} className="px-4 py-2 border border-slate-200 text-slate-500 text-xs rounded-lg hover:bg-slate-50 transition">Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setAddingPortfolio(true)}
                                            className="w-full py-2.5 border-2 border-dashed border-violet-200 text-violet-600 text-xs font-bold rounded-xl hover:border-violet-400 hover:bg-violet-50 transition flex items-center justify-center gap-2"
                                        >
                                            <Plus className="w-4 h-4" /> Add Portfolio Item
                                        </button>
                                    )}
                                </>
                            )}

                            {/* Experience Tab */}
                            {activeTab === 'Experience' && (
                                <>
                                    {experience.length > 0 ? (
                                        <div className="space-y-4 mb-4">
                                            {experience.map((e, i) => (
                                                <div key={i} className="flex gap-4 group">
                                                    <div className="mt-1.5 w-2 h-2 rounded-full bg-violet-500 shrink-0" />
                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <h4 className="text-sm font-bold text-slate-800">{e.role}</h4>
                                                                    <span className="text-xs text-violet-600 font-semibold">@ {e.company}</span>
                                                                </div>
                                                                <p className="text-[11px] text-slate-400 mb-1">{e.period}</p>
                                                                <p className="text-sm text-slate-500 leading-relaxed">{e.desc}</p>
                                                            </div>
                                                            <button
                                                                onClick={() => setExperience(experience.filter((_, j) => j !== i))}
                                                                className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0"
                                                            >
                                                                <X className="w-4 h-4 text-slate-400 hover:text-rose-500" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : !addingExp && (
                                        <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-slate-200 rounded-xl mb-4">
                                            <Briefcase className="w-7 h-7 text-slate-300 mb-2" />
                                            <p className="text-sm text-slate-400 font-medium">No experience added yet</p>
                                            <p className="text-xs text-slate-300 mt-0.5">Add your work history to build trust with clients</p>
                                        </div>
                                    )}

                                    {addingExp ? (
                                        <div className="border border-violet-200 rounded-xl p-4 bg-violet-50/30 space-y-3">
                                            <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Add Experience</h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                <input
                                                    value={newExp.role}
                                                    onChange={e => setNewExp(p => ({ ...p, role: e.target.value }))}
                                                    placeholder="Job title *"
                                                    className="px-3 py-2 text-sm border border-violet-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                                                />
                                                <input
                                                    value={newExp.company}
                                                    onChange={e => setNewExp(p => ({ ...p, company: e.target.value }))}
                                                    placeholder="Company name *"
                                                    className="px-3 py-2 text-sm border border-violet-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                                                />
                                            </div>
                                            <input
                                                value={newExp.period}
                                                onChange={e => setNewExp(p => ({ ...p, period: e.target.value }))}
                                                placeholder="Period (e.g. 2022 – 2024)"
                                                className="w-full px-3 py-2 text-sm border border-violet-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                                            />
                                            <textarea
                                                value={newExp.desc}
                                                onChange={e => setNewExp(p => ({ ...p, desc: e.target.value }))}
                                                placeholder="Describe your role and achievements…"
                                                rows={3}
                                                className="w-full px-3 py-2 text-sm border border-violet-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 resize-none"
                                            />
                                            <div className="flex gap-2">
                                                <button onClick={addExperience} className="flex-1 py-2 bg-violet-600 text-white text-xs font-bold rounded-lg hover:bg-violet-700 transition">Add Experience</button>
                                                <button onClick={() => setAddingExp(false)} className="px-4 py-2 border border-slate-200 text-slate-500 text-xs rounded-lg hover:bg-slate-50 transition">Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setAddingExp(true)}
                                            className="w-full py-2.5 border-2 border-dashed border-violet-200 text-violet-600 text-xs font-bold rounded-xl hover:border-violet-400 hover:bg-violet-50 transition flex items-center justify-center gap-2"
                                        >
                                            <Plus className="w-4 h-4" /> Add Experience
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
