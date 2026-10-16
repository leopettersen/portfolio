import { useTranslation } from 'react-i18next';
import type { About, Experience, Project } from '../../types';
import { techIcons } from '../../data/techIcons';

export function usePortfolioData() {
    const { t } = useTranslation();

    const about = t('about', { returnObjects: true }) as About;
    const experiences = t('experiences', { returnObjects: true }) as Experience[];
    const projects = t('projects', { returnObjects: true }) as Project[];

    const technologies = [...new Set([
        ...projects.flatMap((project) => project.technologies),
        ...experiences.flatMap((experience) => experience.skills),
    ])].filter((name) => techIcons.has(name));

    return { about, experiences, projects, technologies };
}
