import { useCallback, useEffect, useRef, useState, type ComponentType, type MouseEvent } from 'react';
import { CodeXml, Info, Languages, LayoutGrid, Link, Maximize, Minimize, RefreshCw, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { AgentDraft, Language, Point, SectionId, WindowId, WindowLayout, WindowLeave, HistoryEntry, OpenWindow, TerminalOutput } from '../../types';
import { sections } from '../../data/sections';
import { appInfo, terminalApp } from '../../data/apps';
import { neofetchOutput, normalizeCommand, resolveCommand } from '../../data/commands';
import { Window } from '../window/Window';
import { Taskbar } from './Taskbar';
import { StartMenu } from './StartMenu';
import { DesktopIcon } from './DesktopIcon';
import { ToastStack } from './ToastStack';
import { ContextMenu, type ContextMenuItem } from './ContextMenu';
import { ConfirmDialog } from './ConfirmDialog';
import { useFullscreen } from '../../hooks/useFullscreen';
import { REPO_URL, SITE_URL } from '../../data/site';
import { useToasts } from '../../hooks/useToasts';
import { useTerminalAgent } from '../../hooks/useTerminalAgent';
import { MAX_MESSAGE } from '../../services/gemini';
import { loadDesktopState, saveDesktopState, type DesktopItemId, type DesktopState } from '../../services/desktopStorage';
import { GithubWidget } from './GithubWidget';
import { Terminal } from '../terminal/Terminal';
import { AboutPage } from '../../pages/AboutPage';
import { ExperiencePage } from '../../pages/ExperiencePage';
import { ProjectsPage } from '../../pages/ProjectsPage';
import { ContactPage } from '../../pages/ContactPage';
import { GuestbookPage } from '../../pages/GuestbookPage';
import { AgentPage } from '../../pages/AgentPage';
import { ResumePage } from '../../pages/ResumePage';

const sectionComponents: Record<SectionId, ComponentType> = {
    about: AboutPage,
    experience: ExperiencePage,
    projects: ProjectsPage,
    contact: ContactPage,
    guestbook: GuestbookPage,
    agent: AgentPage,
    resume: ResumePage
}

const LEAVE_DURATION = 150;
const MAX_HISTORY = 50;

const languageArguments: Record<string, Language> = {
    pt: 'pt',
    portugues: 'pt',
    en: 'en',
    english: 'en',
    ingles: 'en',
};

function cascadeOffset(index: number) {
    return (index % 5) * 24;
}

function reducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export interface DesktopLayoutProps {
    welcome?: boolean;
    onLogout: () => void;
    onRestart: () => void;
    onShutdown: () => void;
}

export function DesktopLayout({ welcome = false, onLogout, onRestart, onShutdown }: DesktopLayoutProps) {
    const { t, i18n } = useTranslation();
    const language = i18n.resolvedLanguage as Language;
    const [saved] = useState(loadDesktopState);
    const [windows, setWindows] = useState<OpenWindow[]>(() => saved.windows.map((item, index) => ({
        id: item.id,
        layer: index + 1,
        offset: cascadeOffset(index),
        minimized: item.minimized,
    })));
    const [unlocked, setUnlocked] = useState(saved.unlocked);
    const [layouts, setLayouts] = useState(saved.layouts);
    const [iconPositions, setIconPositions] = useState(saved.icons);
    const [iconsVersion, setIconsVersion] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [desktopMenu, setDesktopMenu] = useState<Point | null>(null);
    const [confirmReset, setConfirmReset] = useState(false);
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [typedCommands, setTypedCommands] = useState<string[]>([]);
    const [matrixRun, setMatrixRun] = useState<number | null>(null);
    const [startOpen, setStartOpen] = useState(false);
    const [agentDraft, setAgentDraft] = useState<AgentDraft | null>(null);
    const nextLayer = useRef(saved.windows.length + 1);
    const persisted = useRef<DesktopState>(saved);
    const { toasts, push: pushToast, dismiss: dismissToast } = useToasts();
    const terminalAgent = useTerminalAgent();
    const fullscreen = useFullscreen();

    const focusedWindow = windows
        .filter(item => !item.minimized && !item.leaving)
        .reduce<OpenWindow | null>((top, item) => (!top || item.layer > top.layer ? item : top), null)?.id ?? null;

    const closeStart = useCallback(() => setStartOpen(false), []);
    const finishMatrix = useCallback(() => setMatrixRun(null), []);
    const closeDesktopMenu = useCallback(() => setDesktopMenu(null), []);

    const persist = useCallback((patch: Partial<DesktopState>) => {
        persisted.current = { ...persisted.current, ...patch };
        saveDesktopState(persisted.current);
    }, []);

    useEffect(() => {
        persist({
            unlocked,
            windows: windows
                .filter(item => item.leaving !== 'close')
                .sort((a, b) => a.layer - b.layer)
                .map(item => ({ id: item.id, minimized: item.minimized || item.leaving === 'minimize' })),
        });
    }, [windows, unlocked, persist]);

    useEffect(() => {
        persist({ layouts });
    }, [layouts, persist]);

    useEffect(() => {
        persist({ icons: iconPositions });
    }, [iconPositions, persist]);

    function saveIcon(id: DesktopItemId, position: Point) {
        setIconPositions(prev => ({ ...prev, [id]: position }));
    }

    function saveLayout(id: WindowId, layout: WindowLayout) {
        setLayouts(prev => ({ ...prev, [id]: layout }));
    }

    const leaveWindow = useCallback((id: WindowId, kind: WindowLeave) => {
        setWindows(prev => prev.map(item => item.id === id ? { ...item, leaving: kind } : item));

        setTimeout(() => {
            setWindows(prev => kind === 'close'
                ? prev.filter(item => !(item.id === id && item.leaving === 'close'))
                : prev.map(item => item.id === id && item.leaving === 'minimize' ? { ...item, minimized: true, leaving: undefined } : item));
        }, reducedMotion() ? 0 : LEAVE_DURATION);
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                setStartOpen(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (startOpen) return;

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key !== 'Escape' || event.defaultPrevented) return;

            const active = document.activeElement;
            if (active instanceof HTMLElement && active.matches('input, textarea, select, [contenteditable="true"]')) {
                active.blur();
                return;
            }

            if (focusedWindow) leaveWindow(focusedWindow, 'close');
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [startOpen, focusedWindow, leaveWindow]);

    useEffect(() => {
        if (!welcome) return;

        const kinds = ['welcome', 'windows', 'shortcuts'] as const;
        const timers = kinds.map((kind, index) => setTimeout(() => pushToast(kind), 600 + index * 1500));

        return () => timers.forEach(clearTimeout);
    }, [welcome, pushToast]);

    useEffect(() => {
        const handleOffline = () => pushToast('offline', ['online']);
        const handleOnline = () => pushToast('online', ['offline']);

        window.addEventListener('offline', handleOffline);
        window.addEventListener('online', handleOnline);

        return () => {
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('online', handleOnline);
        };
    }, [pushToast]);

    function openApp(id: WindowId) {
        const layer = nextLayer.current++;

        setWindows(prev => prev.some(item => item.id === id)
            ? prev.map(item => item.id === id ? { ...item, layer, minimized: false, leaving: undefined } : item)
            : [...prev, { id, layer, offset: cascadeOffset(prev.length), minimized: false }]);

        if (id === 'terminal') setUnlocked(true);
    }

    function focusWindow(id: WindowId) {
        if (id === focusedWindow) return;

        const layer = nextLayer.current++;
        setWindows(prev => prev.map(item => item.id === id ? { ...item, layer } : item));
    }

    function minimizeWindow(id: WindowId) {
        leaveWindow(id, 'minimize');
    }

    function toggleFromTaskbar(id: WindowId) {
        if (id === focusedWindow) {
            minimizeWindow(id);
        } else {
            openApp(id);
        }
    }

    function openFromStart(id: WindowId) {
        setStartOpen(false);
        openApp(id);
    }

    function commandFromStart(command: string) {
        setStartOpen(false);
        runCommand(command);
    }

    function askAgentFromStart(question: string) {
        setStartOpen(false);
        setAgentDraft(prev => ({ id: (prev?.id ?? 0) + 1, text: question }));
        openApp('agent');
    }

    function closeWindow(id: WindowId) {
        leaveWindow(id, 'close');
    }

    function arrangeIcons() {
        setIconPositions({});
        setIconsVersion(prev => prev + 1);
    }

    function refreshDesktop() {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 150);
    }

    function resetDesktop() {
        setConfirmReset(false);
        setWindows([]);
        setLayouts({});
        setUnlocked(false);
        arrangeIcons();
    }

    function copyLink() {
        Promise.resolve()
            .then(() => navigator.clipboard.writeText(SITE_URL))
            .then(() => pushToast('linkCopied', ['copyFailed']), () => pushToast('copyFailed', ['linkCopied']));
    }

    function showSystemInfo() {
        addToHistory('neofetch', neofetchOutput());
        openApp('terminal');
    }

    function openDesktopMenu(event: MouseEvent<HTMLElement>) {
        const target = event.target;
        if (!(target instanceof Element) || !window.matchMedia('(min-width: 768px)').matches) return;
        if (target.closest('[data-window-id], input, textarea, a')) return;

        event.preventDefault();
        const rect = target.getBoundingClientRect();
        const fromKeyboard = event.clientX === 0 && event.clientY === 0;
        setDesktopMenu(fromKeyboard ? { x: rect.left + 16, y: rect.top + 16 } : { x: event.clientX, y: event.clientY });
    }

    const desktopMenuItems: ContextMenuItem[] = [
        { key: 'terminal', label: t('contextMenu.openTerminal'), icon: terminalApp.icon, run: () => openApp('terminal') },
        { key: 'refresh', label: t('contextMenu.refresh'), icon: RefreshCw, run: refreshDesktop },
        { key: 'arrange', label: t('contextMenu.arrangeIcons'), icon: LayoutGrid, run: arrangeIcons },
        { key: 'language', label: t('contextMenu.switchLanguage'), icon: Languages, run: () => i18n.changeLanguage(language === 'en' ? 'pt' : 'en'), separatorBefore: true },
        ...(fullscreen.supported ? [{
            key: 'fullscreen',
            label: fullscreen.active ? t('contextMenu.exitFullscreen') : t('contextMenu.fullscreen'),
            icon: fullscreen.active ? Minimize : Maximize,
            run: fullscreen.toggle,
        }] : []),
        { key: 'copy', label: t('contextMenu.copyLink'), icon: Link, run: copyLink, separatorBefore: true },
        { key: 'source', label: t('contextMenu.viewSource'), icon: CodeXml, run: () => window.open(REPO_URL, '_blank', 'noopener,noreferrer') },
        { key: 'about', label: t('contextMenu.about'), icon: Info, run: showSystemInfo, separatorBefore: true },
        { key: 'reset', label: t('contextMenu.reset'), icon: RotateCcw, run: () => setConfirmReset(true), danger: true },
    ];

    function addToHistory(command: string, output: TerminalOutput | string) {
        const value = typeof output === 'string' ? { type: 'text' as const, text: output } : output;

        setHistory(prev => [...prev, { id: (prev[prev.length - 1]?.id ?? 0) + 1, command, output: value }].slice(-MAX_HISTORY));
    }

    function changeLanguage(rawCommand: string, value?: string) {
        if (!value) {
            addToHistory(rawCommand, t('terminal.languageCurrent'));
            return;
        }

        const target = languageArguments[normalizeCommand(value)];
        if (!target) {
            addToHistory(rawCommand, t('terminal.languageUsage', { value }));
            return;
        }

        i18n.changeLanguage(target);
        addToHistory(rawCommand, i18n.getFixedT(target)('terminal.languageChanged'));
    }

    function runCommand(rawCommand: string) {
        if (!rawCommand.trim()) return;

        setTypedCommands(prev => prev[prev.length - 1] === rawCommand ? prev : [...prev, rawCommand].slice(-MAX_HISTORY));
        const command = resolveCommand(rawCommand);

        if (command?.kind === 'section') {
            addToHistory(rawCommand, t('terminal.openingSection', { title: appInfo(command.id, language).title }));
            openApp(command.id);
        } else if (command?.id === 'close') {
            addToHistory(rawCommand, t('terminal.closingSection'));
            if (focusedWindow) closeWindow(focusedWindow);
        } else if (command?.id === 'clear') {
            setHistory([]);
            terminalAgent.reset();
        } else if (command?.id === 'logout') {
            onLogout();
        } else if (command?.id === 'help') {
            addToHistory(rawCommand, { type: 'help' });
            openApp('terminal');
        } else if (command?.id === 'ask') {
            const question = command.args.join(' ').slice(0, MAX_MESSAGE);

            if (!question) {
                addToHistory(rawCommand, t('terminal.askUsage'));
            } else if (terminalAgent.busy) {
                addToHistory(rawCommand, t('terminal.askBusy'));
            } else {
                addToHistory(rawCommand, { type: 'agent', requestId: terminalAgent.ask(question) });
            }
            openApp('terminal');
        } else if (command?.id === 'lang') {
            changeLanguage(rawCommand, command.args[0]);
        } else if (command?.id === 'neofetch') {
            addToHistory(rawCommand, neofetchOutput());
            openApp('terminal');
        } else if (command?.id === 'reboot') {
            onRestart();
        } else if (command?.id === 'shutdown') {
            onShutdown();
        } else if (command?.id === 'matrix') {
            if (reducedMotion()) {
                addToHistory(rawCommand, t('terminal.matrixReduced'));
            } else {
                setMatrixRun(prev => (prev ?? 0) + 1);
            }
            openApp('terminal');
        } else {
            addToHistory(rawCommand, t('terminal.commandNotFound', { command: rawCommand }));
            openApp('terminal');
        }
    }

    return (
        <div className="relative h-[100dvh] w-full overflow-hidden bg-slate-900 flex flex-col">
            <main onContextMenu={openDesktopMenu} className="relative isolate flex-1 overflow-clip bg-[#0b1120] bg-[radial-gradient(45%_45%_at_50%_48%,rgba(59,130,246,0.16),transparent_70%)]">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex select-none items-center justify-center font-mono text-[32vmin] font-extrabold leading-none text-transparent [-webkit-text-stroke:1px_rgba(59,130,246,0.18)]">
                    LP
                </div>

                <div key={iconsVersion} className={`absolute top-0 left-0 grid grid-cols-4 gap-4 p-4 md:flex md:flex-col ${refreshing ? 'invisible' : ''}`}>
                    <DesktopIcon
                        icon={terminalApp.icon}
                        label={terminalApp.label}
                        onOpen={() => openApp('terminal')}
                        initialPosition={iconPositions.terminal}
                        onMove={(position) => saveIcon('terminal', position)}
                    />

                    {unlocked && sections
                        .filter(section => section.showShortcut)
                        .map(section => (
                            <DesktopIcon
                                key={section.id}
                                icon={section.icon}
                                label={section.command[language]}
                                onOpen={() => openApp(section.id)}
                                initialPosition={iconPositions[section.id]}
                                onMove={(position) => saveIcon(section.id, position)}
                            />
                        ))}
                </div>

                <div className={refreshing ? 'invisible' : ''}>
                    <GithubWidget key={iconsVersion} initialPosition={iconPositions.github} onMove={(position) => saveIcon('github', position)} />
                </div>

                {windows.map(({ id, layer, offset, minimized, leaving }) => {
                    const section = sections.find(item => item.id === id);
                    const Page = section ? sectionComponents[section.id] : null;
                    const windowProps = {
                        onClose: () => closeWindow(id),
                        onMinimize: () => minimizeWindow(id),
                        onCommand: runCommand,
                        active: id === focusedWindow,
                        onFocus: () => focusWindow(id),
                        initialOffset: offset,
                        leaving,
                        initialLayout: layouts[id],
                        onLayoutChange: (layout: WindowLayout) => saveLayout(id, layout),
                        commandHistory: typedCommands,
                    };

                    return (
                        <div
                            key={id}
                            data-window-id={id}
                            className={`absolute inset-0 items-center justify-center pointer-events-none ${minimized ? 'hidden' : 'flex'}`}
                            style={{ zIndex: layer }}
                        >
                            {id === 'terminal' ? (
                                <Terminal history={history} answers={terminalAgent.answers} matrixRun={matrixRun} onMatrixDone={finishMatrix} {...windowProps} />
                            ) : (
                                <Window title={appInfo(id, language).title} icon={appInfo(id, language).icon} scrollBody={id !== 'resume'} {...windowProps}>
                                    {id === 'agent' ? <AgentPage draft={agentDraft} /> : Page ? <Page /> : <p>{t('window.pageNotFound')}</p>}
                                </Window>
                            )}
                        </div>
                    );
                })}
            </main>

            {startOpen && (
                <StartMenu
                    onOpen={openFromStart}
                    onCommand={commandFromStart}
                    onAskAgent={askAgentFromStart}
                    onSwitchMode={onLogout}
                    onRestart={onRestart}
                    onShutdown={onShutdown}
                    onClose={closeStart}
                />
            )}

            <ToastStack toasts={toasts} onDismiss={dismissToast} />

            {desktopMenu && (
                <ContextMenu x={desktopMenu.x} y={desktopMenu.y} label={t('contextMenu.desktop')} items={desktopMenuItems} onClose={closeDesktopMenu} />
            )}

            {confirmReset && (
                <ConfirmDialog
                    title={t('contextMenu.resetConfirm.title')}
                    text={t('contextMenu.resetConfirm.text')}
                    cancelLabel={t('contextMenu.resetConfirm.cancel')}
                    confirmLabel={t('contextMenu.resetConfirm.confirm')}
                    onCancel={() => setConfirmReset(false)}
                    onConfirm={resetDesktop}
                />
            )}

            <Taskbar
                windows={windows}
                focusedWindow={focusedWindow}
                startOpen={startOpen}
                onStartToggle={() => setStartOpen(prev => !prev)}
                onWindowClick={toggleFromTaskbar}
                onWindowClose={closeWindow}
            />
        </div>
    )
}
