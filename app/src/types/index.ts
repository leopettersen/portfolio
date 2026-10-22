import type {LucideIcon} from 'lucide-react';

export type Language = 'pt' | 'en';

export type Localized = Record<Language, string>;

export type PortfolioMode = 'system' | 'standard';

export type SectionId = 'about' | 'experience' | 'contact' | 'projects' | 'guestbook' | 'agent' | 'resume';

export type WindowId = 'terminal' | SectionId;

export interface AgentDraft {
    id: number;
    text: string;
}

export type ToastKind = 'welcome' | 'windows' | 'shortcuts' | 'offline' | 'online' | 'linkCopied' | 'copyFailed';

export interface ToastItem {
    id: number;
    kind: ToastKind;
}

export type WindowLeave = 'close' | 'minimize';

export interface Point {
    x: number;
    y: number;
}

export interface WindowLayout extends Point {
    width?: number;
    height?: number;
    maximized: boolean;
}

export interface OpenWindow {
    id: WindowId;
    layer: number;
    offset: number;
    minimized: boolean;
    leaving?: WindowLeave;
}

export interface Section {
    id: SectionId;
    command: Localized;
    windowTitle: Localized;
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

export type TerminalOutput =
  | { type: 'text'; text: string }
  | { type: 'help' }
  | { type: 'neofetch'; uptimeMinutes: number; resolution: string }
  | { type: 'agent'; requestId: number };

export interface TerminalAnswer {
  question: string;
  text: string;
  streaming: boolean;
  stopped?: boolean;
  errorCode?: string;
  retryAfter?: number | null;
}

export interface HistoryEntry {
  id: number;
  command: string;
  output: TerminalOutput;
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