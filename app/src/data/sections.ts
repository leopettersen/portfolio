import type { Section } from '../types';
import { User, Mail, BriefcaseBusiness, Folder, BookBookmark, Sparkles } from 'lucide-react';

export const sections: Section[] = [
    {
        id: 'about',
        command: 'about',
        windowTitle: 'about.md',
        icon: User,
        showShortcut: true,
        showChip: true
    },
    {
        id: 'projects',
        command: 'projects',
        windowTitle: 'projects/',
        icon: Folder,
        showShortcut: true,
        showChip: true
    },
        {
        id: 'experience',
        command: 'experience',
        windowTitle: 'experience/',
        icon: BriefcaseBusiness,
        showShortcut: true,
        showChip: true
    },
    {
        id: 'contact',
        command: 'contact',
        windowTitle: 'contact.sh',
        icon: Mail,
        showShortcut: true,
        showChip: true
    },
    {
        id: 'guestbook',
        command: 'guestbook',
        windowTitle: 'guestbook.md',
        icon: BookBookmark,
        showShortcut: false,
        showChip: false
    },
    {
        id: 'agent',
        command: 'agent',
        windowTitle: 'agent.md',
        icon: Sparkles,
        showShortcut: true,
        showChip: true
    }
]