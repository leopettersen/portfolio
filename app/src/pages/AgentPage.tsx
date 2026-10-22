import type { AgentDraft } from '../types';
import { AgentChat } from '../components/agent/AgentChat';

export interface AgentPageProps {
    draft?: AgentDraft | null;
}

export function AgentPage({ draft = null }: AgentPageProps) {
    return <AgentChat tone="system" draft={draft} />;
}
