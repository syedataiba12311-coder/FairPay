'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import {
    ArrowLeft, MapPin, Clock, Users, Star, CheckCircle2,
    DollarSign, Calendar, Sparkles, Send, Briefcase, Award,
    ChevronRight, AlertCircle
} from 'lucide-react';
import { getProjectById } from '@/lib/projects-data';

export default function ProjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const project = getProjectById(Number(params.id));

    const [bidAmount, setBidAmount] = useState('');
    const [timeline, setTimeline] = useState('');
    const [coverLetter, setCoverLetter] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [aiGenerating, setAiGenerating] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    if (!project) {
        return (
            <AppShell title="Project Not Found" subtitle="">
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
                    <p className="text-base font-bold text-slate-700">Project not found</p>
                    <button onClick={() => router.back()} className="mt-4 px-5 py-2.5 bg-violet-600 text-white text-sm font-bold rounded-xl hover:bg-violet-700 transition">
                        Go Back
                    </button>
                </div>
            </AppShell>
        );
    }

    const validate = () => {
        const e: Record<string, string> = {};
        if (!bidAmount || isNaN(Number(bidAmount)) || Number(bidAmount) <= 0)
            e.bidAmount = 'Please enter a valid bid amount.';
        if (!timeline.trim())
            e.timeline = 'Please specify your proposed timeline.';
        if (coverLetter.trim().length < 50)
            e.coverLetter = 'Cover letter must be at least 50 characters.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 1500);
    };

    const handleAIGenerate = () => {
        setAiGenerating(true);
        setTimeout(() => {
            setCoverLetter(
                `I'm excited to apply for the "${project.title}" project at ${project.client}. ` +
                `With extensive experience in ${project.skills.slice(0, 2).join(' and ')}, I'm confident I can deliver exactly what you need.\n\n` +
                `I've previously built similar solutions and understand the technical depth required. My approach will be to first align on requirements, then deliver iterative milestones with clear communication at every step.\n\n` +
                `I'm available to start immediately and can commit to your ${project.duration} timeline. I'd love to discuss further — please feel free to reach out with any questions.`
            );
            setAiGenerating(false);
        }, 2000);
    };

    if (submitted) {
        return (
            <AppShell title="Proposal Submitted" subtitle="">
                <div className="flex flex-col items-center justify-center py-24 text-center max-w-md mx-auto">
                    <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-900">Proposal Sent!</h2>
                    <p className="text-sm text-slate-500 mt-3 leading-relaxed">
                        Your proposal for <span className="font-semibold text-slate-700">{project.title}</span> has been submitted to <span className="font-semibold text-slate-700">{project.client}</span>. You'll be notified when they respond.
                    </p>
                    <div className="mt-6 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 w-full text-left space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400 font-medium">Your Bid</span>
                            <span className="font-extrabold text-violet-600">${Number(bidAmount).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400 font-medium">Timeline</span>
                            <span className="font-semibold text-slate-700">{timeline}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400 font-medium">Status</span>
                            <span className="flex items-center gap-1 text-amber-600 font-bold text-xs">
                                <Clock className="w-3.5 h-3.5" /> Under Review
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-6 w-full">
                        <button onClick={() => router.push('/proposals')} className="flex-1 py-3 rounded-2xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-700 transition shadow">
                            View My Proposals
                        </button>
                        <button onClick={() => router.push('/find-projects')} className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition">
                            Find More Projects
                        </button>
                    </div>
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell title={project.title} subtitle={`${project.client} · Posted ${project.posted}`}>
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-sm text-slate-500 font-semibold hover:text-violet-600 transition mb-6 group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Back to Projects
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Project Detail */}
                <div className="lg:col-span-2 space-y-5">
                    {/* Header Card */}
                    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${project.featured ? 'border-violet-200' : 'border-slate-100'}`}>
                        {project.featured && (
                            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest px-5 py-1.5">
                                ⭐ Featured Project
                            </div>
                        )}
                        <div className="p-6">
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div>
                                    <span className="text-[10px] font-bold bg-violet-100 text-violet-600 px-2.5 py-1 rounded-full uppercase tracking-wide">
                                        {project.category}
                                    </span>
                                    <h1 className="text-xl font-extrabold text-slate-900 mt-2">{project.title}</h1>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <span className="text-sm font-semibold text-slate-600">{project.client}</span>
                                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                        <span className="text-sm text-slate-500">{project.clientRating}</span>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-xl font-extrabold text-slate-900">{project.budget}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{project.duration}</p>
                                </div>
                            </div>

                            {/* Meta pills */}
                            <div className="flex flex-wrap gap-3 mb-5 pb-5 border-b border-slate-100">
                                <span className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg">
                                    <MapPin className="w-3.5 h-3.5 text-violet-400" />{project.location}
                                </span>
                                <span className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg">
                                    <Clock className="w-3.5 h-3.5 text-violet-400" />{project.duration}
                                </span>
                                <span className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg">
                                    <Users className="w-3.5 h-3.5 text-violet-400" />{project.proposals} proposals sent
                                </span>
                                <span className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg">
                                    <Calendar className="w-3.5 h-3.5 text-violet-400" />Posted {project.posted}
                                </span>
                            </div>

                            {/* Skills */}
                            <div className="flex flex-wrap gap-2">
                                {project.skills.map(s => (
                                    <span key={s} className="px-3 py-1.5 bg-violet-50 text-violet-700 text-xs font-bold rounded-lg border border-violet-100">{s}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Full Description */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <h3 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-violet-500" /> Project Description
                        </h3>
                        <div className="text-sm text-slate-600 leading-7 whitespace-pre-line">{project.fullDesc}</div>
                    </div>

                    {/* Requirements */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <h3 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-2">
                            <Award className="w-4 h-4 text-violet-500" /> Requirements
                        </h3>
                        <ul className="space-y-2.5">
                            {project.requirements.map((r, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                                    <ChevronRight className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
                                    {r}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Deliverables */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <h3 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-violet-500" /> Expected Deliverables
                        </h3>
                        <ul className="space-y-2.5">
                            {project.deliverables.map((d, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                    </div>
                                    {d}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right: Client Info + Proposal Form */}
                <div className="space-y-5">
                    {/* Client Card */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <h3 className="text-sm font-extrabold text-slate-800 mb-4">About the Client</h3>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shrink-0">
                                {project.client.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800">{project.client}</p>
                                <div className="flex items-center gap-1 mt-0.5">
                                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                    <span className="text-xs font-semibold text-slate-600">{project.clientRating} rating</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2 text-xs text-slate-500">
                            <div className="flex justify-between">
                                <span>Location</span>
                                <span className="font-semibold text-slate-700">{project.clientLocation}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Member since</span>
                                <span className="font-semibold text-slate-700">{project.clientJoined}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Jobs posted</span>
                                <span className="font-semibold text-slate-700">{project.clientJobsPosted}</span>
                            </div>
                        </div>
                    </div>

                    {/* Proposal Form */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <h3 className="text-sm font-extrabold text-slate-800 mb-5 flex items-center gap-2">
                            <Send className="w-4 h-4 text-violet-500" /> Submit Your Proposal
                        </h3>

                        {/* Bid Amount */}
                        <div className="mb-4">
                            <label className="block text-xs font-bold text-slate-600 mb-1.5">
                                <DollarSign className="w-3.5 h-3.5 inline mr-1 text-violet-500" />Your Bid (USD)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                                <input
                                    type="number"
                                    value={bidAmount}
                                    onChange={e => { setBidAmount(e.target.value); setErrors(p => ({ ...p, bidAmount: '' })); }}
                                    placeholder="e.g. 4000"
                                    className={`w-full pl-8 pr-4 py-2.5 rounded-xl border text-sm font-semibold text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition ${errors.bidAmount ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-slate-50'}`}
                                />
                            </div>
                            {errors.bidAmount && <p className="text-[11px] text-rose-500 mt-1">{errors.bidAmount}</p>}
                            <p className="text-[11px] text-slate-400 mt-1">Client budget: {project.budget}</p>
                        </div>

                        {/* Timeline */}
                        <div className="mb-4">
                            <label className="block text-xs font-bold text-slate-600 mb-1.5">
                                <Clock className="w-3.5 h-3.5 inline mr-1 text-violet-500" />Your Timeline
                            </label>
                            <input
                                type="text"
                                value={timeline}
                                onChange={e => { setTimeline(e.target.value); setErrors(p => ({ ...p, timeline: '' })); }}
                                placeholder="e.g. 5 weeks"
                                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition ${errors.timeline ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-slate-50'}`}
                            />
                            {errors.timeline && <p className="text-[11px] text-rose-500 mt-1">{errors.timeline}</p>}
                            <p className="text-[11px] text-slate-400 mt-1">Client expects: {project.duration}</p>
                        </div>

                        {/* Cover Letter */}
                        <div className="mb-5">
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-xs font-bold text-slate-600">Cover Letter</label>
                                <button
                                    onClick={handleAIGenerate}
                                    disabled={aiGenerating}
                                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-violet-50 text-violet-600 text-[11px] font-bold border border-violet-200 hover:bg-violet-100 transition disabled:opacity-60"
                                >
                                    <Sparkles className="w-3 h-3" />
                                    {aiGenerating ? 'Generating…' : 'AI Draft'}
                                </button>
                            </div>
                            <textarea
                                rows={7}
                                value={coverLetter}
                                onChange={e => { setCoverLetter(e.target.value); setErrors(p => ({ ...p, coverLetter: '' })); }}
                                placeholder="Introduce yourself, describe your relevant experience, and explain why you're the best fit for this project…"
                                className={`w-full p-3.5 rounded-xl border text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/30 resize-none transition leading-relaxed ${errors.coverLetter ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-slate-50'}`}
                            />
                            {errors.coverLetter && <p className="text-[11px] text-rose-500 mt-1">{errors.coverLetter}</p>}
                            <p className="text-[11px] text-slate-400 mt-1">{coverLetter.length} characters {coverLetter.length < 50 ? `· ${50 - coverLetter.length} more needed` : '· ✓ Good length'}</p>
                        </div>

                        {/* Submit */}
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-extrabold hover:from-violet-700 hover:to-indigo-700 transition-all shadow-md shadow-violet-500/25 flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {loading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    Submitting…
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Submit Proposal
                                </>
                            )}
                        </button>
                        <p className="text-[11px] text-slate-400 text-center mt-3">
                            Your proposal will be visible only to {project.client}.
                        </p>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
