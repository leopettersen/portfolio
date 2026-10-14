import { useState } from 'react';
import { BootScreen } from './components/boot/BootScreen';
import { DesktopLayout } from './components/desktop/DesktopLayout';
import { LandingInfoPage } from './components/desktop/LandingInfoPage';
import { LoginScreen } from './components/login/LoginScreen';

type Stage = 'boot' | 'login' | 'desktop';

export default function App() {
    const [stage, setStage] = useState<Stage>('boot');
    const [showLanding, setShowLanding] = useState(false);

    function closeLanding() {
        try {
            sessionStorage.setItem('landing-popup-seen', 'true');
        } catch {
        }
        setShowLanding(false);
    }

    return (
        <>
            {stage === 'boot' && (
                <BootScreen onFinish={() => setStage('login')} />
            )}
            {stage === 'login' && (
                <LoginScreen onEnter={() => { setStage('desktop'); setShowLanding(true); }} />
            )}
            {stage === 'desktop' && <DesktopLayout />}
            {stage === 'desktop' && showLanding && (
                <LandingInfoPage onClose={closeLanding} />
            )}
        </>
    );
}
