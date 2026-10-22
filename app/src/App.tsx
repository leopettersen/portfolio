import { lazy, Suspense, useState } from 'react';
import type { PortfolioMode } from './types';
import { BootScreen } from './components/boot/BootScreen';
import { PowerScreen, type PowerAction } from './components/boot/PowerScreen';
import { CrashScreen } from './components/boot/CrashScreen';
import { SafeBoundary } from './components/standard/SafeBoundary';
import { clearDesktopState } from './services/desktopStorage';
import { DesktopLayout } from './components/desktop/DesktopLayout';
import { LoginScreen } from './components/login/LoginScreen';

const StandardPortfolio = lazy(() => import('./components/standard/StandardPortfolio'));

type Stage = 'boot' | 'login' | 'desktop' | 'standard' | PowerAction;

const WELCOME_SEEN_KEY = 'welcome-seen';

function takeWelcome() {
    try {
        const seen = sessionStorage.getItem(WELCOME_SEEN_KEY) === 'true';
        sessionStorage.setItem(WELCOME_SEEN_KEY, 'true');
        return !seen;
    } catch {
        return true;
    }
}

export default function App() {
    const [stage, setStage] = useState<Stage>('boot');
    const [welcome, setWelcome] = useState(false);

    function enter(mode: PortfolioMode) {
        if (mode === 'system') {
            setStage('desktop');
            setWelcome(takeWelcome());
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
                <SafeBoundary
                    fallback={(error) => (
                        <CrashScreen
                            error={error}
                            onRestart={() => {
                                clearDesktopState();
                                setStage('boot');
                            }}
                            onStandard={() => setStage('standard')}
                        />
                    )}
                >
                    <DesktopLayout
                        welcome={welcome}
                        onLogout={() => setStage('login')}
                        onRestart={() => setStage('restart')}
                        onShutdown={() => setStage('shutdown')}
                    />
                </SafeBoundary>
            )}
            {(stage === 'restart' || stage === 'shutdown') && (
                <PowerScreen action={stage} onBoot={() => setStage('boot')} />
            )}
            {stage === 'standard' && (
                <Suspense fallback={<div className="fixed inset-0 bg-slate-950" />}>
                    <StandardPortfolio onSwitchMode={() => setStage('login')} />
                </Suspense>
            )}
        </>
    );
}
