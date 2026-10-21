import { Code, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Project } from '../types';
import { Tag } from '../components/ui/Tag';

export function ProjectsPage() {
    const { t } = useTranslation();
    
    const projects = t('projects', { returnObjects: true }) as Project[];

    return (
        <div className="flex flex-col gap-6">

            <div className="flex flex-col gap-6 border-l border-slate-700/60 pl-5 md:pl-8">

                {projects.map((project, index) => (
                    <div key={project.name} className="relative flex flex-col gap-2 bg-slate-800/60 p-4 rounded-lg">

                        <div className="absolute -left-[1.6rem] md:-left-[2.35rem] top-6 w-3 h-3 rounded-full bg-slate-500 border-2 border-slate-900"></div>

                        <div className="flex flex-wrap items-baseline justify-between gap-2 md:gap-4">

                            <div className="flex items-baseline gap-3">

                                <span className="text-sm font-semibold text-slate-400">
                                    {String(index + 1).padStart(2, '0')}
                                </span>

                                <h1 className="text-xl font-bold">
                                    {project.name}
                                </h1>

                            </div>

                            <span className="text-sm font-semibold text-slate-400">
                                {project.date}
                            </span>

                        </div>

                        <p className="text-slate-400">
                            {project.description}
                        </p>

                        {project.image ? (
                            <img src={project.image} alt={project.name} loading="lazy" decoding="async" className="w-full aspect-video object-cover rounded-lg mt-4" />
                        ) : (
                            <div className="w-full aspect-video rounded-lg mt-4 flex items-center justify-center bg-slate-700/30 text-slate-400">
                                {t('projectUI.imageComingSoon', 'Imagem em breve')}
                            </div>
                        )}

                        <div className="flex flex-col items-start gap-3 mt-2 md:flex-row md:items-center md:justify-between">

                            <div className="flex flex-wrap gap-2">
                                {project.technologies.map((technology) => (
                                    <Tag key={technology}>
                                        {technology}
                                    </Tag>
                                ))}
                            </div>

                            <a href={project.repoLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 border border-slate-700/60 px-3 py-1.5 rounded-md text-sm text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-colors">
                                <Code size={16} />
                                GitHub
                                <ArrowUpRight size={15} />
                            </a>

                        </div>

                    </div>
                ))}

            </div>

        </div>
    );
}