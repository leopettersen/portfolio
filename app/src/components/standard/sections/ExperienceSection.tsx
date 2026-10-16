import { useTranslation } from 'react-i18next';
import { ExperienceCard } from '../ExperienceCard';
import { SectionCard } from '../SectionCard';
import { Timeline, TimelineItem } from '../Timeline';
import { usePortfolioData } from '../usePortfolioData';

export function ExperienceSection() {
    const { t } = useTranslation();
    const { experiences } = usePortfolioData();

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 xl:flex-row xl:gap-6">
            <SectionCard
                tag={t('standard.experience.tag')}
                title1={t('standard.experience.title1')}
                title2={t('standard.experience.title2')}
                description={t('standard.experience.text')}
                sticky
                className="xl:w-96 xl:shrink-0"
            />

            <Timeline>
                {experiences.map((experience) => (
                    <TimelineItem key={experience.organization}>
                        <ExperienceCard experience={experience} />
                    </TimelineItem>
                ))}
            </Timeline>
        </div>
    );
}
