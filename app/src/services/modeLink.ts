import type { PortfolioMode } from '../types';
import { SITE_URL } from '../data/site';

const MODE_PARAM = 'mode';

const modeValues = new Map<string, PortfolioMode>([
    ['sistema', 'system'],
    ['system', 'system'],
    ['normal', 'standard'],
    ['standard', 'standard'],
]);

const modeNames: Record<PortfolioMode, string> = {
    system: 'sistema',
    standard: 'normal',
};

export function readModeFromUrl() {
    const value = new URLSearchParams(window.location.search).get(MODE_PARAM)?.trim().toLowerCase() ?? '';
    return modeValues.get(value) ?? null;
}

export function writeModeToUrl(mode: PortfolioMode | null) {
    const url = new URL(window.location.href);
    if (mode) url.searchParams.set(MODE_PARAM, modeNames[mode]);
    else url.searchParams.delete(MODE_PARAM);
    if (url.href !== window.location.href) window.history.replaceState(window.history.state, '', url);
}

export function linkToMode(mode: PortfolioMode) {
    const url = new URL(SITE_URL);
    url.searchParams.set(MODE_PARAM, modeNames[mode]);
    return url.href;
}
