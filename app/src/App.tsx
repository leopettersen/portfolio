import { lazy, Suspense, useState } from 'react';
import type { PortfolioMode } from './types';
import { BootScreen } from './components/boot/BootScreen';
import { DesktopLayout } from './components/desktop/DesktopLayout';
import { LandingInfoPage } from './components/desktop/LandingInfoPage';
import { LoginScreen } from './components/login/LoginScreen';

const StandardPortfolio = lazy(() => import('./components/standard/StandardPortfolio'));

type Stage = 'boot' | 'login' | 'desktop' | 'standard';

const LANDING_SEEN_KEY = 'landing-popup-seen';

function landingSeen() {
    try {
        return sessionStorage.getItem(LANDING_SEEN_KEY) === 'true';
    } catch {
        return false;
    }
}

export default function App() {
    const [stage, setStage] = useState<Stage>('boot');
    const [showLanding, setShowLanding] = useState(false);

    function closeLanding() {
        try {
            sessionStorage.setItem(LANDING_SEEN_KEY, 'true');
        } catch {
        }
        setShowLanding(false);
    }

    function enter(mode: PortfolioMode) {
        if (mode === 'system') {
            setStage('desktop');
            setShowLanding(!landingSeen());
        } else {
            setStage('standard');
        }
    }

    return (
        <>
            {stage === 'boot' && (
                <BootScreen onFinish={() => setStage('login')} />
            )}
            {stage === 'login' && (
                <LoginScreen onEnter={enter} />
            )}
            {stage === 'desktop' && (
                <DesktopLayout onLogout={() => { setStage('login'); setShowLanding(false); }} />
            )}
            {stage === 'desktop' && showLanding && (
                <LandingInfoPage onClose={closeLanding} />
            )}
            {stage === 'standard' && (
                <Suspense fallback={<div className="fixed inset-0 bg-slate-950" />}>
                    <StandardPortfolio onSwitchMode={() => setStage('login')} />
                </Suspense>
            )}
        </>
    );
}
