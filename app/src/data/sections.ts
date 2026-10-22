import type { Section } from '../types';
import { User, Mail, BriefcaseBusiness, Folder, BookBookmark, Sparkles, FileText } from 'lucide-react';

export const sections: Section[] = [
    {
        id: 'about',
        command: { pt: 'sobre', en: 'about' },
        windowTitle: { pt: 'sobre.md', en: 'about.md' },
        icon: User,
        showShortcut: true,
        showChip: true
    },
    {
        id: 'projects',
        command: { pt: 'projetos', en: 'projects' },
        windowTitle: { pt: 'projetos/', en: 'projects/' },
        icon: Folder,
        showShortcut: true,
        showChip: true
    },
        {
        id: 'experience',
        command: { pt: 'experiencia', en: 'experience' },
        windowTitle: { pt: 'experiencia/', en: 'experience/' },
        icon: BriefcaseBusiness,
        showShortcut: true,
        showChip: true
    },
    {
        id: 'contact',
        command: { pt: 'contato', en: 'contact' },
        windowTitle: { pt: 'contato.sh', en: 'contact.sh' },
        icon: Mail,
        showShortcut: true,
        showChip: true
    },
    {
        id: 'guestbook',
        command: { pt: 'guestbook', en: 'guestbook' },
        windowTitle: { pt: 'guestbook.md', en: 'guestbook.md' },
        icon: BookBookmark,
        showShortcut: false,
        showChip: false
    },
    {
        id: 'agent',
        command: { pt: 'agente', en: 'agent' },
        windowTitle: { pt: 'agente.md', en: 'agent.md' },
        icon: Sparkles,
        showShortcut: true,
        showChip: true
    },
    {
        id: 'resume',
        command: { pt: 'curriculo', en: 'resume' },
        windowTitle: { pt: 'curriculo.pdf', en: 'resume.pdf' },
        icon: FileText,
        showShortcut: true,
        showChip: false
    }
]