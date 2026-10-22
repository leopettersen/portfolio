import { useTranslation } from 'react-i18next';
import { AgentChat } from '../../agent/AgentChat';
import { SectionCard } from '../SectionCard';

export function AgentSection() {
    const { t } = useTranslation();

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 xl:flex-row">
            <SectionCard
                tag={t('standard.agent.tag')}
                title1={t('standard.agent.title1')}
                title2={t('standard.agent.title2')}
                description={t('standard.agent.text')}
                sticky
                className="xl:w-96 xl:shrink-0"
            />

            <AgentChat tone="standard" />
        </div>
    );
}
