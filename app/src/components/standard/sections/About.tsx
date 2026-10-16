import { useTranslation } from 'react-i18next';
import { GraduationCap, Mail } from 'lucide-react';
import { SectionCard } from '../SectionCard';
import { usePortfolioData } from '../usePortfolioData';

export function About() {
    const { t } = useTranslation();
    const { about, experiences } = usePortfolioData();
    const current = experiences[0];

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 xl:flex-row">
            <SectionCard
                tag={t('standard.about.tag')}
                title1={t('standard.about.title')}
                title2="Leonardo"
                description={about.overviewParagraph}
                sticky
                className="xl:w-96 xl:shrink-0"
            >
                <div className="my-3 border-t border-line" />

                <div className="flex items-center gap-6">
                    <span className="w-20 shrink-0 text-[10px]">{t('standard.about.role')}</span>
                    <div>
                        <p className="font-semibold text-title">{current.experiencePosition}</p>
                        <p className="text-xs">{current.organization} · {current.period}</p>
                    </div>
                </div>

                <div className="mt-3 flex items-center gap-6">
                    <span className="w-20 shrink-0 text-[10px]">{t('standard.about.education')}</span>
                    <div>
                        <p className="font-semibold text-title">{about.education.title}</p>
                        <p className="text-xs">{about.education.college} · {about.education.period}</p>
                    </div>
                </div>

                <div className="my-3 border-t border-line" />

                <div className="flex items-center justify-between gap-4">
                    <p className="flex items-center gap-2 text-xs">
                        <span className="h-2 w-2 rounded-full bg-brand" />
                        {t('standard.about.reachOut')}
                    </p>

                    <a
                        href="#contact"
                        className="flex items-center gap-2 rounded-2xl bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand hover:text-on-brand transition-colors"
                    >
                        <Mail size={15} />
                        {t('standard.menu.contact')}
                    </a>
                </div>
            </SectionCard>

            <div className="flex min-w-0 flex-1 flex-col gap-6">
                <div className="flex gap-3">
                    <img
                        src="/images/logo.png"
                        alt="Logo"
                        className="mt-1 h-10 w-10 shrink-0 rounded-md border border-brand/50 object-cover"
                    />
                    <div className="flex flex-col gap-3">
                        <p className="text-sm">{about.interestsDescription}</p>
                        <div className="flex flex-wrap gap-2">
                            {about.interestsTags.map((tag) => (
                                <span key={tag} className="rounded-xl border border-brand/40 px-2 py-0.5 text-[11px] text-brand">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-line bg-surface/95 p-5 shadow-brand backdrop-blur-xl">
                    <span className="text-[10px] text-brand">{t('standard.about.educationTag')}</span>

                    <div className="mt-3 flex gap-3">
                        <div className="h-max rounded-md border border-brand/50 bg-brand/10 p-2 text-brand">
                            <GraduationCap size={18} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                                <h3 className="text-lg font-semibold text-title">
                                    {about.education.title} - {about.education.college}
                                </h3>
                                <span className="text-xs">{about.education.period}</span>
                            </div>

                            <p className="text-xs leading-relaxed">{about.education.description}</p>

                            <div className="mt-1 flex flex-wrap gap-2">
                                {about.education.tags.map((tag) => (
                                    <span key={tag} className="rounded-xl border border-line px-2 py-0.5 text-[11px]">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <span className="text-[10px] text-brand">{t('standard.about.goals')}</span>

                <div className="-mt-3 grid gap-5 md:grid-cols-2">
                    {about.goals.map((goal, index) => (
                        <div
                            key={goal.title}
                            className={`flex flex-col gap-3 rounded-2xl border border-line bg-surface/95 p-5 shadow-brand backdrop-blur-xl ${
                                index === about.goals.length - 1 && about.goals.length % 2 === 1 ? 'md:col-span-2' : ''
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-bold text-title">{String(index + 1).padStart(2, '0')}</span>
                                <span className="text-[10px] uppercase text-brand">{goal.title}</span>
                            </div>
                            <p className="text-sm">{goal.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
