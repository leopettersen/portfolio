import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { techIcons } from '../../../data/techIcons';
import { SafeBoundary } from '../SafeBoundary';
import { SectionCard } from '../SectionCard';
import { useTheme } from '../theme';
import { usePortfolioData } from '../usePortfolioData';

const SkillsGlobe = lazy(() => import('../SkillsGlobe'));

export function SkillsSection() {
    const { t } = useTranslation();
    const { technologies } = usePortfolioData();
    const theme = useTheme();

    const skills = technologies.map((name) => ({ label: name, icon: techIcons.get(name) ?? '' }));

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-5 xl:flex-row xl:items-start xl:justify-between">
            <SectionCard
                tag={t('standard.stack.tag')}
                title1={t('standard.stack.title1')}
                title2={t('standard.stack.title2')}
                description={t('standard.stack.text')}
                className="w-full xl:mt-20 xl:w-96 xl:shrink-0"
            />

            <SafeBoundary>
                <Suspense fallback={null}>
                    <SkillsGlobe
                        skills={skills}
                        dark={theme === 'dark'}
                        style={{ width: '100%', maxWidth: 600, aspectRatio: '1 / 1' }}
                    />
                </Suspense>
            </SafeBoundary>
        </div>
    );
}
