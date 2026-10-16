import { useTranslation } from 'react-i18next';
import { ProfileCard } from '../ProfileCard';
import { TiltCard } from '../TiltCard';
import { usePortfolioData } from '../usePortfolioData';

export function Home() {
    const { t } = useTranslation();
    const { about, experiences, projects, technologies } = usePortfolioData();
    const current = experiences[0];

    const stats = [
        { value: String(projects.length), label: t('standard.home.stats.projects') },
        { value: String(experiences.length), label: t('standard.home.stats.experiences') },
        { value: `${technologies.length}+`, label: t('standard.home.stats.technologies') },
        { value: about.education.period.split(' ').pop() ?? '', label: t('standard.home.stats.graduation') },
    ];

    return (
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-10 px-5">
            <div className="max-w-xl">
                <p className="mb-8 flex max-w-max items-center gap-2 rounded-xl border border-brand/30 px-3 py-1 text-xs font-medium text-brand">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                    {current.experiencePosition} · {current.organization}
                </p>

                <h1 className="text-4xl font-bold text-title sm:text-5xl">{about.overviewTitle}</h1>

                <p className="mt-3 text-xl font-medium sm:text-2xl">
                    {t('terminal.role')} <span className="whitespace-nowrap text-brand">· {t('terminal.university')}</span>
                </p>

                <p className="mt-10">{about.overviewParagraph}</p>

                <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4">
                    {stats.map((stat) => (
                        <div key={stat.label} className="min-w-0 border-l border-brand pl-3">
                            <h3 className="text-xl font-semibold text-title">{stat.value}</h3>
                            <p className="mt-2 text-[10px] uppercase">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="hidden xl:block">
                <TiltCard className="rounded-2xl">
                    <ProfileCard name={about.overviewTitle} picture={about.profilePicture} />
                </TiltCard>
            </div>
        </div>
    );
}
