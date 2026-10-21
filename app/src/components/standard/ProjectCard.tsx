import { useTranslation } from 'react-i18next';
import type { Project } from '../../types';
import { githubIcon, techIcons } from '../../data/techIcons';
import { TechIcon } from './TechIcon';

export interface ProjectCardProps {
    project: Project;
    index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
    const { t } = useTranslation();

    return (
        <div className="flex h-full w-full flex-col gap-3 rounded-2xl border border-line bg-surface p-5 shadow-brand">
            <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <span className="shrink-0 rounded-md border border-brand/50 bg-brand/10 px-2 py-1 text-sm font-bold text-brand">
                        {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-xl font-bold text-title">{project.name}</h3>
                </div>
                <span className="shrink-0 text-xs">{project.date}</span>
            </div>

            {project.image ? (
                <img
                    src={project.image}
                    alt={project.name}
                    loading="lazy"
                    decoding="async"
                    className="aspect-video w-full rounded-lg object-cover"
                />
            ) : (
                <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-line/40">
                    {t('projectUI.imageComingSoon')}
                </div>
            )}

            <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((technology) => {
                        const icon = techIcons.get(technology);

                        return (
                            <span
                                key={technology}
                                className="flex items-center gap-1 rounded-xl border border-brand px-2 py-0.5 text-xs text-brand"
                            >
                                {icon && <TechIcon src={icon} />}
                                {technology}
                            </span>
                        );
                    })}
                </div>

                <a
                    href={project.repoLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-sm text-brand hover:underline"
                >
                    <TechIcon src={githubIcon} />
                    GitHub
                </a>
            </div>

            <p className="mt-2 text-sm leading-relaxed">{project.description}</p>
        </div>
    );
}
