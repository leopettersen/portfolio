import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileUser, Globe, Menu, Monitor, X } from 'lucide-react';
import { LanguageToggle } from '../ui/LanguageToggle';
import { ThemeToggle } from './ThemeToggle';
import { navLinks } from './links';
import { useActiveSection } from './useActiveSection';

const sectionIds = ['home', ...navLinks.map((link) => link.href.slice(1)), 'resume'];

export interface HeaderProps {
    onSwitchMode: () => void;
}

export function Header({ onSwitchMode }: HeaderProps) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const active = useActiveSection(sectionIds);
    const toggleRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const resumeActive = active === 'resume';

    useEffect(() => {
        if (!isOpen) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Escape') return;
            setIsOpen(false);
            toggleRef.current?.focus();
        };

        const onPointerDown = (event: PointerEvent) => {
            const target = event.target as Node;
            if (panelRef.current?.contains(target) || toggleRef.current?.contains(target)) return;
            setIsOpen(false);
        };

        window.addEventListener('keydown', onKeyDown);
        document.addEventListener('pointerdown', onPointerDown, true);

        return () => {
            window.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('pointerdown', onPointerDown, true);
        };
    }, [isOpen]);

    function isActive(href: string) {
        return active === href.slice(1);
    }

    return (
        <header className="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] xl:max-w-max">

            <nav className="relative mt-5 flex items-center justify-between gap-3 rounded-3xl border border-line bg-surface/70 px-5 py-3 text-body shadow-brand backdrop-blur-md">
                <a href="#home" className="flex items-center gap-3">
                    <img src="/images/logo.png" alt="Logo" className="h-7 w-7 shrink-0 rounded-md object-cover" />
                    <span className="whitespace-nowrap text-sm font-semibold text-title xl:me-8 2xl:me-32">
                        Leonardo Pettersen
                    </span>
                </a>

                <div className="hidden items-center gap-6 xl:flex">
                    <ul className="flex items-center gap-5 text-sm">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    aria-current={isActive(link.href) ? 'location' : undefined}
                                    className={`rounded-xl px-1.5 py-1 hover:text-title hover:bg-brand/10 transition-colors ${isActive(link.href) ? 'text-title bg-brand/10' : ''}`}
                                >
                                    {t(`standard.menu.${link.key}`)}
                                </a>
                            </li>
                        ))}
                    </ul>

                    <div className="flex items-center gap-5 text-sm">
                        <div className="flex items-center gap-2">
                            <Globe size={18} className="text-brand" aria-hidden="true" />
                            <LanguageToggle tone="standard" />
                        </div>

                        <ThemeToggle />

                        <button
                            type="button"
                            onClick={onSwitchMode}
                            aria-label={t('standard.systemMode')}
                            title={t('standard.systemMode')}
                            className="text-body hover:text-brand transition-colors cursor-pointer"
                        >
                            <Monitor size={20} />
                        </button>

                        <a
                            href="#resume"
                            aria-current={resumeActive ? 'location' : undefined}
                            className={`flex items-center gap-2 rounded-2xl px-3 py-1.5 text-xs font-semibold hover:bg-brand hover:text-on-brand transition-colors ${resumeActive ? 'bg-brand text-on-brand' : 'bg-brand/10 text-brand'}`}
                        >
                            <FileUser size={15} />
                            {t('standard.menu.resume')}
                        </a>
                    </div>
                </div>

                <button
                    ref={toggleRef}
                    type="button"
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="rounded-lg p-1 text-title hover:bg-brand/10 transition-colors xl:hidden"
                    aria-label={isOpen ? t('standard.closeMenu') : t('standard.openMenu')}
                    aria-expanded={isOpen}
                >
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </nav>

            <div
                ref={panelRef}
                className={`absolute right-0 top-full mt-3 w-full overflow-hidden rounded-2xl border border-line bg-surface/95 p-4 text-body shadow-brand backdrop-blur-xl transition-all duration-300 motion-reduce:transition-none xl:hidden ${
                    isOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0 pointer-events-none motion-reduce:translate-y-0'
                }`}
            >
                <ul className="flex flex-col">
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                aria-current={isActive(link.href) ? 'location' : undefined}
                                className={`block rounded-lg px-3 py-3 text-sm font-medium hover:bg-brand/10 hover:text-title transition-colors ${isActive(link.href) ? 'bg-brand/10 text-title' : ''}`}
                            >
                                {t(`standard.menu.${link.key}`)}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="my-3 border-t border-line" />

                <div className="flex items-center justify-between gap-3 px-1 py-1 text-sm">
                    <div className="flex items-center gap-4">
                        <LanguageToggle tone="standard" />
                        <ThemeToggle />
                    </div>

                    <a
                        href="#resume"
                        onClick={() => setIsOpen(false)}
                        aria-current={resumeActive ? 'location' : undefined}
                        className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2 font-semibold text-on-brand hover:opacity-90 transition-opacity"
                    >
                        <FileUser size={15} />
                        {t('standard.menu.resume')}
                    </a>
                </div>

                <button
                    type="button"
                    onClick={onSwitchMode}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-line px-4 py-2 text-sm font-semibold hover:border-brand hover:text-brand transition-colors cursor-pointer"
                >
                    <Monitor size={15} />
                    {t('standard.systemMode')}
                </button>
            </div>
        </header>
    );
}
