import { useState, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import type { SectionId, WindowId, HistoryEntry } from '../../types';
import { sections } from '../../data/sections';
import { terminalApp } from '../../data/apps';
import { Window } from '../window/Window';
import { TopBar } from './TopBar';
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

export function DesktopLayout() {
    const { t } = useTranslation();
    const [openWindow, setOpenWindow] = useState<WindowId | null>(null);
    const [unlocked, setUnlocked] = useState(false);
    const [history, setHistory] = useState<HistoryEntry[]>([]);

    const activeSection = sections.find(section => section.id === openWindow);
    const ActivePage = activeSection ? sectionComponents[activeSection.id] : null;

    function openApp(id: WindowId) {
        setOpenWindow(id);
        if (id === 'terminal') setUnlocked(true);
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
            setOpenWindow(null);
        } else if (command === 'clear') {
            setHistory([]);
        } else if (command === 'help') {
            addToHistory(rawCommand, t('terminal.availableCommands', {
                commands: sections.map((s) => s.command).join(', ') + ', clear, close'
            }));
            openApp('terminal');
        } else {
            addToHistory(rawCommand, t('terminal.commandNotFound', { command: rawCommand }));
            openApp('terminal');
        }
    }

    return (
        <div className="h-[100dvh] w-full overflow-hidden bg-slate-900 flex flex-col">
            <TopBar />

            <main className="relative flex-1 overflow-hidden">
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

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {openWindow === 'terminal' && (
                        <Terminal
                            history={history}
                            onCommand={runCommand}
                            onClose={() => setOpenWindow(null)}
                        />
                    )}

                    {activeSection && (
                        <Window
                            title={activeSection.windowTitle}
                            onClose={() => setOpenWindow(null)}
                            onCommand={runCommand}
                        >
                            {ActivePage ? <ActivePage /> : <p>{t('window.pageNotFound')}</p>}
                        </Window>
                    )}
                </div>
            </main>
        </div>
    )
}
