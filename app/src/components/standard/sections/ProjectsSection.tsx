import { useTranslation } from 'react-i18next';
import { ProjectCard } from '../ProjectCard';
import { usePortfolioData } from '../usePortfolioData';

export function ProjectsSection() {
    const { t } = useTranslation();
    const { projects } = usePortfolioData();

    return (
        <div className="flex flex-col gap-10">
            <h2 className="w-full px-5 text-center text-4xl font-bold text-title">
                {t('standard.projects.title1')} <span className="text-brand">{t('standard.projects.title2')}</span>
            </h2>

            <div className="flex flex-col items-center gap-8 px-5 lg:px-20 lg:pb-20">
                {projects.map((project, index) => (
                    <div
                        key={project.repoLink}
                        className="w-full max-w-2xl lg:sticky"
                        style={{ top: `calc(max(10vh, 6rem) + ${index * 30}px)`, zIndex: index }}
                    >
                        <ProjectCard project={project} index={index} />
                    </div>
                ))}
            </div>
        </div>
    );
}
