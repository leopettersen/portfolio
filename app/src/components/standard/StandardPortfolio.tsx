import '@fontsource-variable/geist';
import '@fontsource-variable/orbitron';
import { lazy, Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeBoundary } from './SafeBoundary';
import { Header } from './Header';
import { Footer } from './Footer';
import { ScrollProgress } from './ScrollProgress';
import { useTheme } from './theme';
import { Home } from './sections/Home';
import { About } from './sections/About';
import { ExperienceSection } from './sections/ExperienceSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { ContactSection } from './sections/ContactSection';
import { AgentSection } from './sections/AgentSection';
import { GuestbookSection } from './sections/GuestbookSection';

const ResumeSection = lazy(() => import('./sections/ResumeSection'));

export interface StandardPortfolioProps {
    onSwitchMode: () => void;
}

export default function StandardPortfolio({ onSwitchMode }: StandardPortfolioProps) {
    const { t } = useTranslation();
    const theme = useTheme();

    useEffect(() => {
        const root = document.documentElement;
        root.dataset.theme = theme;

        return () => {
            delete root.dataset.theme;
        };
    }, [theme]);

    return (
        <div className="relative isolate min-h-screen overflow-x-clip bg-page font-geist standard-mode text-body">
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

                <section id="projects" className="scroll-mt-32">
                    <ProjectsSection />
                </section>

                <section id="agent" className="scroll-mt-32">
                    <AgentSection />
                </section>

                <section id="resume" className="scroll-mt-32">
                    <SafeBoundary fallback={<p className="text-center">{t('standard.resume.error')}</p>}>
                        <Suspense fallback={null}>
                            <ResumeSection />
                        </Suspense>
                    </SafeBoundary>
                </section>

                <section id="contact" className="scroll-mt-32">
                    <ContactSection />
                </section>

                <section id="guestbook" className="scroll-mt-32">
                    <GuestbookSection />
                </section>
            </main>

            <Footer />
        </div>
    );
}
