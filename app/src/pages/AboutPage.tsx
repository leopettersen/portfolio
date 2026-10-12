import { useTranslation } from 'react-i18next';
import type { About } from '../types';
import { Tag } from '../components/ui/Tag';

export function AboutPage() {
    const { t } = useTranslation();

    const about = t('about', { returnObjects: true }) as About;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center gap-2 bg-slate-800/60 p-4 rounded-lg">
                    <img src={about.profilePicture} alt={about.profilePicture} className="object-cover rounded-full w-[calc(100dvw-100rem)] border border-slate-800/60 shadow-black/50"/>
                <div className="flex flex-col gap-2 bg-slate-800/60 p-4 rounded-lg">
                    <h1 className="text-2xl font-bold">{about.overviewTitle}</h1>
                    <p className="text-slate-400">{about.overviewParagraph}</p>
                </div>
            </div>

            <div className="flex flex-col gap-2 bg-slate-800/60 p-4 rounded-lg">
                <div className="flex flex-wrap items-baseline justify-between gap-2 md:gap-4">
                    <h1 className="text-xl font-bold">{t('about.sections.education', 'Educação')}</h1>
                    <span className="text-sm font-semibold text-slate-400">{about.education.period}</span>
                </div>
                <h2 className="text-lg font-semibold">{about.education.title} - {about.education.college}</h2>
                <p className="text-slate-400">{about.education.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                    {about.education.tags.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-2 bg-slate-800/60 p-4 rounded-lg">
                <h1 className="text-xl font-bold">{t('about.sections.interests', 'Interesses')}</h1>
                <p className="text-slate-400">{about.interestsDescription}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                    {about.interestsTags.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-2 bg-slate-800/60 p-4 rounded-lg">
                <h1 className="text-xl font-bold">{t('about.sections.goals', 'Metas')}</h1>
                <ul className="flex flex-col gap-4">
                    {about.goals.map((goal) => (
                        <li key={goal.title}>
                            <h2 className="text-lg font-semibold">{goal.title}</h2>
                            <p className="text-slate-400">{goal.description}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}