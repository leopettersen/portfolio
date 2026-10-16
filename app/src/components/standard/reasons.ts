import { Briefcase, MessageSquare, Users } from 'lucide-react';

export const reasons = [
    { value: 'hiring', icon: Briefcase },
    { value: 'collaboration', icon: Users },
    { value: 'other', icon: MessageSquare },
] as const;

export type Reason = (typeof reasons)[number]['value'];
