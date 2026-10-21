import { useSyncExternalStore } from 'react';

function subscribe(callback: () => void) {
    document.addEventListener('fullscreenchange', callback);

    return () => {
        document.removeEventListener('fullscreenchange', callback);
    };
}

export function useFullscreen() {
    const active = useSyncExternalStore(subscribe, () => document.fullscreenElement !== null, () => false);
    const supported = typeof document !== 'undefined' && document.fullscreenEnabled === true;

    function toggle() {
        const request = active ? document.exitFullscreen() : document.documentElement.requestFullscreen();
        request.catch(() => {});
    }

    return { supported, active, toggle };
}
