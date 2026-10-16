import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'motion/react';
import { ProjectCard } from '../ProjectCard';
import { usePortfolioData } from '../usePortfolioData';

export function ProjectsSection() {
    const { t } = useTranslation();
    const { projects } = usePortfolioData();

    const sectionRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const maxX = useRef(0);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end end'],
    });

    const x = useTransform(scrollYProgress, (progress) => -progress * maxX.current);

    useEffect(() => {
        const measure = () => {
            const section = sectionRef.current;
            const track = trackRef.current;
            if (!section || !track) return;

            if (!window.matchMedia('(min-width: 1280px)').matches) {
                maxX.current = 0;
                section.style.height = '';
                return;
            }

            maxX.current = Math.max(0, track.scrollWidth - window.innerWidth);
            section.style.height = `${window.innerHeight + maxX.current}px`;
        };

        measure();
        window.addEventListener('resize', measure);
        const observer = new ResizeObserver(measure);
        if (trackRef.current) observer.observe(trackRef.current);

        return () => {
            window.removeEventListener('resize', measure);
            observer.disconnect();
        };
    }, []);

    return (
        <div ref={sectionRef} className="relative">
            <div className="flex flex-col gap-10 xl:sticky xl:top-0 xl:h-screen xl:justify-center xl:overflow-hidden xl:pt-20">
                <h2 className="w-full px-5 text-center text-4xl font-bold text-title">
                    {t('standard.projects.title1')} <span className="text-brand">{t('standard.projects.title2')}</span>
                </h2>

                <motion.div
                    ref={trackRef}
                    style={{ x }}
                    className="flex flex-col items-center gap-8 px-5 max-xl:!transform-none lg:px-20 xl:w-max xl:flex-row xl:items-stretch"
                >
                    {projects.map((project, index) => (
                        <div key={project.repoLink} className="w-full max-w-2xl shrink-0 xl:w-[40rem]">
                            <ProjectCard project={project} index={index} />
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
