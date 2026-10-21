import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import type { AgentDraft, Language, SectionId, WindowId, HistoryEntry, OpenWindow } from '../../types';
import { sections } from '../../data/sections';
import { appInfo, terminalApp } from '../../data/apps';
import { resolveCommand, systemCommandNames, systemCommands } from '../../data/commands';
import { Window } from '../window/Window';
import { Taskbar } from './Taskbar';
import { StartMenu } from './StartMenu';
import { DesktopIcon } from './DesktopIcon';
import { ToastStack } from './ToastStack';
import { useToasts } from '../../hooks/useToasts';
import { Terminal } from '../terminal/Terminal';
import { AboutPage } from '../../pages/AboutPage';
import { ExperiencePage } from '../../pages/ExperiencePage';
import { ProjectsPage } from '../../pages/ProjectsPage';
import { ContactPage } from '../../pages/ContactPage';
import { GuestbookPage } from '../../pages/GuestbookPage';
import { AgentPage } from '../../pages/AgentPage';

const sectionComponents: Record<SectionId, ComponentType> = {
    about: AboutPage,
    experience: ExperiencePage,
    projects: ProjectsPage,
    contact: ContactPage,
    guestbook: GuestbookPage,
    agent: AgentPage
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
    const [windows, setWindows] = useState<OpenWindow[]>([]);
    const [unlocked, setUnlocked] = useState(false);
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [startOpen, setStartOpen] = useState(false);
    const [agentDraft, setAgentDraft] = useState<AgentDraft | null>(null);
    const nextLayer = useRef(1);
    const { toasts, push: pushToast, dismiss: dismissToast } = useToasts();

    const focusedWindow = windows
        .filter(item => !item.minimized)
        .reduce<OpenWindow | null>((top, item) => (!top || item.layer > top.layer ? item : top), null)?.id ?? null;

    const closeStart = useCallback(() => setStartOpen(false), []);

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
            ? prev.map(item => item.id === id ? { ...item, layer, minimized: false } : item)
            : [...prev, { id, layer, offset: (prev.length % 5) * 24, minimized: false }]);

        if (id === 'terminal') setUnlocked(true);
    }

    function focusWindow(id: WindowId) {
        if (id === focusedWindow) return;

        const layer = nextLayer.current++;
        setWindows(prev => prev.map(item => item.id === id ? { ...item, layer } : item));
    }

    function minimizeWindow(id: WindowId) {
        setWindows(prev => prev.map(item => item.id === id ? { ...item, minimized: true } : item));
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
        setWindows(prev => prev.filter(item => item.id !== id));
    }

    function addToHistory(command: string, output: string) {
        setHistory(prev => {
            const next = [...prev, { command, output}];
            const maxEntries = 4;
            return next.slice(-maxEntries);
        });
    }

    function runCommand(rawCommand: string) {
        if (!rawCommand.trim()) return;

        const command = resolveCommand(rawCommand);

        if (command?.kind === 'section') {
            addToHistory(rawCommand, t('terminal.openingSection', { title: appInfo(command.id, language).title }));
            openApp(command.id);
        } else if (command?.id === 'close') {
            addToHistory(rawCommand, t('terminal.closingSection'));
            if (focusedWindow) closeWindow(focusedWindow);
        } else if (command?.id === 'clear') {
            setHistory([]);
        } else if (command?.id === 'logout') {
            onLogout();
        } else if (command?.id === 'help') {
            addToHistory(rawCommand, t('terminal.availableCommands', {
                commands: [
                    ...sections.map((s) => s.command[language]),
                    ...systemCommands.map((id) => systemCommandNames[id][language]),
                ].join(', ')
            }));
            openApp('terminal');
        } else {
            addToHistory(rawCommand, t('terminal.commandNotFound', { command: rawCommand }));
            openApp('terminal');
        }
    }

    return (
        <div className="relative h-[100dvh] w-full overflow-hidden bg-slate-900 flex flex-col">
            <main className="relative isolate flex-1 overflow-clip bg-[#0b1120] bg-[radial-gradient(45%_45%_at_50%_48%,rgba(59,130,246,0.16),transparent_70%)]">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex select-none items-center justify-center font-mono text-[32vmin] font-extrabold leading-none text-transparent [-webkit-text-stroke:1px_rgba(59,130,246,0.18)]">
                    LP
                </div>

                <div className="absolute top-0 left-0 grid grid-cols-4 gap-4 p-4 md:flex md:flex-col">
                    <DesktopIcon
                        icon={terminalApp.icon}
                        label={terminalApp.label}
                        onOpen={() => openApp('terminal')}
                    />

                    {unlocked && sections
                        .filter(section => section.showShortcut)
                        .map(section => (
                            <DesktopIcon
                                key={section.id}
                                icon={section.icon}
                                label={section.command[language]}
                                onOpen={() => openApp(section.id)}
                            />
                        ))}
                </div>

                {windows.map(({ id, layer, offset, minimized }) => {
                    const section = sections.find(item => item.id === id);
                    const Page = section ? sectionComponents[section.id] : null;
                    const windowProps = {
                        onClose: () => closeWindow(id),
                        onMinimize: () => minimizeWindow(id),
                        onCommand: runCommand,
                        active: id === focusedWindow,
                        onFocus: () => focusWindow(id),
                        initialOffset: offset,
                    };

                    return (
                        <div
                            key={id}
                            className={`absolute inset-0 items-center justify-center pointer-events-none ${minimized ? 'hidden' : 'flex'}`}
                            style={{ zIndex: layer }}
                        >
                            {id === 'terminal' ? (
                                <Terminal history={history} {...windowProps} />
                            ) : (
                                <Window title={appInfo(id, language).title} icon={appInfo(id, language).icon} {...windowProps}>
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

            <Taskbar
                windows={windows}
                focusedWindow={focusedWindow}
                startOpen={startOpen}
                onStartToggle={() => setStartOpen(prev => !prev)}
                onWindowClick={toggleFromTaskbar}
            />
        </div>
    )
}
