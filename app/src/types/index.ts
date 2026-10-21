import type {LucideIcon} from 'lucide-react';

export type Language = 'pt' | 'en';

export type PortfolioMode = 'system' | 'standard';

export type SectionId = 'about' | 'experience' | 'contact' | 'projects' | 'guestbook' | 'agent';

export type WindowId = 'terminal' | SectionId;

export interface AgentDraft {
    id: number;
    text: string;
}

export interface OpenWindow {
    id: WindowId;
    layer: number;
    offset: number;
    minimized: boolean;
}

export interface Section {
    id: SectionId;
    command: string;
    windowTitle: string;
    icon: LucideIcon;
    showShortcut: boolean;
    showChip: boolean;
}

export interface Goal {
    title: string;
    description: string;
}

export interface Education {
    title: string;
    period: string;
    college: string;
    description: string;
    tags: string[];
}

export interface About {
    profilePicture: string;
    overviewTitle: string;
    overviewParagraph: string;
    education: Education;
    interestsDescription: string;
    interestsTags: string[];
    goals: Goal[];
}

export interface HistoryEntry {
  command: string;
  output: string;
}

export type WorkModel = 'onsite' | 'hybrid' | 'remote';

export interface Experience {
    organization: string;
    period: string;
    experiencePosition: string;
    workModel: WorkModel;
    description: string;
    skills: string[];
}

export interface Project {
    name: string;
    date: string;
    description: string;
    technologies: string[];
    repoLink: string;
    image?: string;
}

export interface ContactLink {
    name: string;
    link: string;
    text: string;
    icon: LucideIcon;
}

export interface GuestbookMessage {
    id: number;
    name: string;
    message: string;
    created_at: string;
}

export type SendStatus = 'idle' | 'sending' | 'success' | 'error';

export type AgentRole = 'user' | 'model';

export interface AgentHistoryEntry {
    role: AgentRole;
    text: string;
}

export interface AgentMessage extends AgentHistoryEntry {
    id: number;
    streaming?: boolean;
    stopped?: boolean;
    errorCode?: string;
    retryAfter?: number | null;
}