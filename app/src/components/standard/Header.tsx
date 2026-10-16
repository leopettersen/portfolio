import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Menu, Monitor, X } from 'lucide-react';
import { LanguageToggle } from '../ui/LanguageToggle';
import { ThemeToggle } from './ThemeToggle';
import { navLinks } from './links';

export interface HeaderProps {
    onSwitchMode: () => void;
}

export function Header({ onSwitchMode }: HeaderProps) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] lg:max-w-max">

            <nav className="relative mt-5 flex items-center justify-between gap-3 rounded-3xl border border-line bg-surface/70 px-5 py-3 text-body shadow-brand backdrop-blur-md">
                <a href="#home" className="flex items-center gap-3">
                    <img src="/images/logo.png" alt="Logo" className="h-7 w-7 shrink-0 rounded-md object-cover" />
                    <span className="whitespace-nowrap text-sm font-semibold text-title lg:me-16 xl:me-40">
                        Leonardo Pettersen
                    </span>
                </a>

                <div className="hidden items-center gap-6 lg:flex">
                    <ul className="flex items-center gap-5 text-sm">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <a href={link.href} className="rounded-xl px-1.5 py-1 hover:text-title hover:bg-brand/10 transition-colors">
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
                            className="flex items-center gap-2 rounded-2xl bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand hover:text-on-brand transition-colors cursor-pointer"
                        >
                            <Monitor size={15} />
                            {t('standard.systemMode')}
                        </button>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="rounded-lg p-1 text-title hover:bg-brand/10 transition-colors lg:hidden"
                    aria-label={isOpen ? t('standard.closeMenu') : t('standard.openMenu')}
                    aria-expanded={isOpen}
                >
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </nav>

            <div
                className={`absolute right-0 top-full mt-3 w-full overflow-hidden rounded-2xl border border-line bg-surface/95 p-4 text-body shadow-brand backdrop-blur-xl transition-all duration-300 lg:hidden ${
                    isOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0 pointer-events-none'
                }`}
            >
                <ul className="flex flex-col">
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="block rounded-lg px-3 py-3 text-sm font-medium hover:bg-brand/10 hover:text-title transition-colors"
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

                    <button
                        type="button"
                        onClick={onSwitchMode}
                        className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2 font-semibold text-on-brand hover:opacity-90 transition-opacity cursor-pointer"
                    >
                        <Monitor size={15} />
                        {t('standard.systemMode')}
                    </button>
                </div>
            </div>
        </header>
    );
}
