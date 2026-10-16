import '@fontsource-variable/geist';
import 'devicon/devicon.min.css';
import { useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { ScrollProgress } from './ScrollProgress';
import { useTheme } from './theme';
import { Home } from './sections/Home';
import { About } from './sections/About';
import { ExperienceSection } from './sections/ExperienceSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { SkillsSection } from './sections/SkillsSection';

export interface StandardPortfolioProps {
    onSwitchMode: () => void;
}

export default function StandardPortfolio({ onSwitchMode }: StandardPortfolioProps) {
    const theme = useTheme();

    useEffect(() => {
        const root = document.documentElement;
        root.dataset.theme = theme;

        return () => {
            delete root.dataset.theme;
        };
    }, [theme]);

    return (
        <div className="relative isolate min-h-screen overflow-x-clip bg-page font-geist text-body">
            <ScrollProgress />
            <Header onSwitchMode={onSwitchMode} />

            <main className="flex flex-col gap-24 pt-28 pb-16 lg:gap-40 lg:pt-36">
                <section id="home" className="scroll-mt-32">
                    <Home />
                </section>

                <section id="about" className="scroll-mt-32">
                    <About />
                </section>

                <section id="experience" className="scroll-mt-32">
                    <ExperienceSection />
                </section>

                <section id="projects" className="scroll-mt-32 xl:scroll-mt-0">
                    <ProjectsSection />
                </section>

                <section id="skills" className="scroll-mt-32">
                    <SkillsSection />
                </section>
            </main>

            <Footer />
        </div>
    );
}
