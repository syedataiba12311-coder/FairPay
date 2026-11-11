import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY || '';
const geminiClient = apiKey ? new GoogleGenAI({ apiKey }) : null;

export interface AgreementData {
    agreementTitle: string;
    freelancerName: string;
    clientName: string;
    projectSummary: string;
    startDate: string;
    endDate: string;
    totalAmount: number;
    currency: string;
    paymentSchedule: string;
    scopeOfWork: string[];
    deliverables: string[];
    revisionPolicy: string;
    ipOwnership: string;
    confidentiality: string;
    terminationClause: string;
    disputeResolution: string;
    milestones: Array<{
        id: string;
        title: string;
        description: string;
        amount: number;
        dueDate: string;
        deliverables: string[];
    }>;
    protectionClauses: string[];
    governingLaw: string;
}

function generateFallback(details: Record<string, string>): AgreementData {
    const projectType = details.projectType || 'Software Development';
    const totalAmount = parseFloat(details.totalAmount) || 3000;
    const m1 = Math.round(totalAmount * 0.3);
    const m2 = Math.round(totalAmount * 0.4);
    const m3 = totalAmount - m1 - m2;

    return {
        agreementTitle: `Freelance ${projectType} Agreement`,
        freelancerName: details.freelancerName || 'Freelancer',
        clientName: details.clientName || 'Client',
        projectSummary: details.projectDescription ||
            `This agreement covers the delivery of a complete ${projectType} solution including design, development, testing, and handoff.`,
        startDate: details.startDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        endDate: details.endDate || new Date(Date.now() + 42 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        totalAmount,
        currency: 'USD',
        paymentSchedule: 'Milestone-based via FairPay Escrow. Funds are locked at each milestone start and released upon client approval.',
        scopeOfWork: [
            `Deliver a fully functional ${projectType} solution as described in the project brief.`,
            'Provide clean, documented, and maintainable code/deliverables.',
            'Participate in regular check-ins and respond to feedback within 2 business days.',
            'Conduct up to 2 rounds of revisions per milestone.',
        ],
        deliverables: [
            'Complete project source files and assets',
            'Deployment or handoff documentation',
            'Testing and QA report',
            'Post-launch support for 14 days',
        ],
        revisionPolicy: 'Each milestone includes up to 2 rounds of revisions at no additional cost. Additional revisions beyond this limit will be quoted separately.',
        ipOwnership: 'Upon receipt of full payment, all intellectual property rights, including source code, designs, and documentation, are assigned exclusively to the Client.',
        confidentiality: 'Both parties agree to keep all project-related information, business data, and communications strictly confidential for a period of 2 years following contract completion.',
        terminationClause: 'Either party may terminate this agreement with 7 days written notice. Work completed to the termination date will be compensated at the agreed milestone rates. Escrowed funds for incomplete milestones will be returned to the Client.',
        disputeResolution: 'Any disputes arising under this agreement will first be resolved via good-faith negotiation within 14 days. If unresolved, the matter will proceed to FairPay AI arbitration, whose decision is final and binding.',
        milestones: [
            {
                id: 'm-1',
                title: 'Phase 1 — Discovery & Planning',
                description: 'Requirements gathering, technical specification, wireframes or architecture plan.',
                amount: m1,
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                deliverables: ['Technical specification document', 'Wireframes or architecture diagram', 'Project timeline'],
            },
            {
                id: 'm-2',
                title: 'Phase 2 — Core Development',
                description: 'Full implementation of the primary features and functionality.',
                amount: m2,
                dueDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                deliverables: ['Functional build with core features', 'Staging environment or preview link', 'Progress report'],
            },
            {
                id: 'm-3',
                title: 'Phase 3 — QA, Revisions & Handoff',
                description: 'Final testing, client feedback rounds, and project delivery.',
                amount: m3,
                dueDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                deliverables: ['Production-ready deliverables', 'Full documentation', 'Source files & credentials handoff'],
            },
        ],
        protectionClauses: [
            'All milestone payments are locked in FairPay Escrow prior to work commencement.',
            'Escrow funds auto-release 7 business days after milestone delivery if no dispute is raised.',
            'Client may not use partial deliverables without releasing associated milestone payment.',
            'Freelancer retains work-in-progress ownership until milestone payment is confirmed.',
            'FairPay AI arbitration guarantees fair dispute resolution within 5 business days.',
        ],
        governingLaw: 'This agreement is governed by the laws of the jurisdiction agreed upon by both parties at signing.',
    };
}

async function generateWithGemini(details: Record<string, string>): Promise<AgreementData> {
    if (!geminiClient) return generateFallback(details);

    const prompt = `
You are a professional freelance contract lawyer and FairPay AI agreement specialist.
Generate a comprehensive, professional freelance agreement based on the following project details.

Project Details:
- Freelancer Name: ${details.freelancerName || 'Freelancer'}
- Client Name: ${details.clientName || 'Client'}
- Project Type: ${details.projectType || 'Software Development'}
- Project Description: ${details.projectDescription || 'Custom software project'}
- Total Budget: $${details.totalAmount || '3000'} USD
- Start Date: ${details.startDate || 'Immediately'}
- End Date: ${details.endDate || 'TBD'}
- Special Terms: ${details.specialTerms || 'None'}

Respond ONLY with valid JSON matching this EXACT schema (no markdown, no explanation):
{
  "agreementTitle": "string",
  "freelancerName": "string",
  "clientName": "string",
  "projectSummary": "string (2-3 sentences)",
  "startDate": "string",
  "endDate": "string",
  "totalAmount": number,
  "currency": "USD",
  "paymentSchedule": "string",
  "scopeOfWork": ["string", "string", "string", "string"],
  "deliverables": ["string", "string", "string", "string"],
  "revisionPolicy": "string",
  "ipOwnership": "string",
  "confidentiality": "string",
  "terminationClause": "string",
  "disputeResolution": "string",
  "milestones": [
    {
      "id": "m-1",
      "title": "string",
      "description": "string",
      "amount": number,
      "dueDate": "string",
      "deliverables": ["string", "string"]
    }
  ],
  "protectionClauses": ["string", "string", "string", "string", "string"],
  "governingLaw": "string"
}

Generate 3 milestones that logically divide the project. Make the language professional, clear, and legally sound.
`;

    try {
        const response = await geminiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        const text = response.text || '';
        const clean = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        return JSON.parse(clean);
    } catch (err) {
        console.warn('Gemini failed, using fallback:', err);
        return generateFallback(details);
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { freelancerName, clientName, projectType, projectDescription, totalAmount, startDate, endDate, specialTerms } = body;

        if (!projectDescription || typeof projectDescription !== 'string' || projectDescription.trim().length < 10) {
            return NextResponse.json(
                { error: 'Please provide a project description of at least 10 characters.' },
                { status: 400 }
            );
        }

        const agreement = await generateWithGemini({
            freelancerName, clientName, projectType, projectDescription, totalAmount, startDate, endDate, specialTerms,
        });

        return NextResponse.json({ success: true, data: agreement });
    } catch (error) {
        console.error('Error generating agreement:', error);
        return NextResponse.json({ error: 'Failed to generate agreement.' }, { status: 500 });
    }
}
