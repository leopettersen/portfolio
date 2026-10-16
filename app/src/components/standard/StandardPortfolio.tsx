import '@fontsource-variable/geist';
import 'devicon/devicon.min.css';
import { useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { ScrollProgress } from './ScrollProgress';
import { useTheme } from './theme';

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
            </main>

            <Footer />
        </div>
    );
}
