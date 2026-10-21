import { useTranslation } from 'react-i18next';
import type { Experience } from '../types';
import { Tag } from '../components/ui/Tag';

export function ExperiencePage() {
    const { t } = useTranslation();
    
    const experiences = t('experiences', { returnObjects: true }) as Experience[];

    return (
        <div className="flex flex-col gap-6">

            {experiences.map((experience) => (
                <div key={experience.organization} className="flex flex-col gap-2 bg-slate-800/60 p-4 rounded-lg">

                    <div className="flex flex-wrap items-baseline justify-between gap-2 md:gap-4">
                        <h2 className="text-xl font-bold">
                            {experience.organization}
                        </h2>

                        <span className="text-sm font-semibold text-slate-400">
                            {experience.period}
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold">
                            {experience.experiencePosition}
                        </h3>

                        <span className="bg-slate-700/60 px-2 py-1 rounded-md text-sm text-slate-400">
                            {t(`workModels.${experience.workModel}`)}
                        </span>
                    </div>

                    <p className="text-slate-400">
                        {experience.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-2">
                        {experience.skills.map((skill) => (
                            <Tag key={skill}>{skill}</Tag>
                        ))}
                    </div>

                </div>
            ))}

        </div>
    );
}