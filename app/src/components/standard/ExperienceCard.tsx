import { useTranslation } from 'react-i18next';
import { Briefcase, CalendarDays } from 'lucide-react';
import type { Experience } from '../../types';

export function ExperienceCard({ experience }: { experience: Experience }) {
    const { t } = useTranslation();
    const topics = experience.description.split(/(?<=\.)\s+/);

    return (
        <div className="flex flex-col gap-2 rounded-2xl border border-line bg-surface/95 p-5 shadow-brand backdrop-blur-xl">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                    <h3 className="text-xl font-bold text-title">{experience.experiencePosition}</h3>
                    <p className="font-bold text-brand">{experience.organization}</p>
                </div>

                <div className="flex flex-wrap gap-2 md:shrink-0 md:flex-col md:items-end">
                    <span className="flex items-center gap-1 whitespace-nowrap rounded-xl border border-body/40 px-2 py-1 text-xs uppercase">
                        <Briefcase size={12} />
                        {t(`workModels.${experience.workModel}`)}
                    </span>
                    <span className="flex items-center gap-1 whitespace-nowrap rounded-xl border border-body/40 px-2 py-1 text-xs">
                        <CalendarDays size={12} />
                        {experience.period}
                    </span>
                </div>
            </div>

            <ul className="mt-4 flex flex-col gap-3">
                {topics.map((topic) => (
                    <li key={topic} className="flex gap-2 text-sm">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand" />
                        {topic}
                    </li>
                ))}
            </ul>

            <div className="mt-2 flex flex-wrap gap-2">
                {experience.skills.map((skill) => (
                    <span key={skill} className="rounded-xl border border-brand/40 px-2 py-0.5 text-xs text-brand">
                        {skill}
                    </span>
                ))}
            </div>
        </div>
    );
}
