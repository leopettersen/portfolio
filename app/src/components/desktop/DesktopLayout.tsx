import { useCallback, useRef, useState, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import type { SectionId, WindowId, HistoryEntry, OpenWindow } from '../../types';
import { sections } from '../../data/sections';
import { appInfo, terminalApp } from '../../data/apps';
import { Window } from '../window/Window';
import { Taskbar } from './Taskbar';
import { StartMenu } from './StartMenu';
import { DesktopIcon } from './DesktopIcon';
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
    onLogout: () => void;
}

export function DesktopLayout({ onLogout }: DesktopLayoutProps) {
    const { t } = useTranslation();
    const [windows, setWindows] = useState<OpenWindow[]>([]);
    const [unlocked, setUnlocked] = useState(false);
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [startOpen, setStartOpen] = useState(false);
    const nextLayer = useRef(1);

    const focusedWindow = windows
        .filter(item => !item.minimized)
        .reduce<OpenWindow | null>((top, item) => (!top || item.layer > top.layer ? item : top), null)?.id ?? null;

    const closeStart = useCallback(() => setStartOpen(false), []);

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
        const command = rawCommand.trim().toLowerCase();
        if (!command) return;

        const section = sections.find((s) => s.command === command);

        if (section) {
            addToHistory(rawCommand, t('terminal.openingSection', { title: section.windowTitle }));
            openApp(section.id);
        } else if (command === 'close') {
            addToHistory(rawCommand, t('terminal.closingSection'));
            if (focusedWindow) closeWindow(focusedWindow);
        } else if (command === 'clear') {
            setHistory([]);
        } else if (command === 'logout' || command === 'exit') {
            onLogout();
        } else if (command === 'help') {
            addToHistory(rawCommand, t('terminal.availableCommands', {
                commands: sections.map((s) => s.command).join(', ') + ', clear, close, logout'
            }));
            openApp('terminal');
        } else {
            addToHistory(rawCommand, t('terminal.commandNotFound', { command: rawCommand }));
            openApp('terminal');
        }
    }

    return (
        <div className="relative h-[100dvh] w-full overflow-hidden bg-slate-900 flex flex-col">
            <main className="relative isolate flex-1 overflow-clip">
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
                                label={section.command}
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
                                <Window title={appInfo(id).title} icon={appInfo(id).icon} {...windowProps}>
                                    {Page ? <Page /> : <p>{t('window.pageNotFound')}</p>}
                                </Window>
                            )}
                        </div>
                    );
                })}
            </main>

            {startOpen && (
                <StartMenu onOpen={openFromStart} onSwitchMode={onLogout} onClose={closeStart} />
            )}

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
