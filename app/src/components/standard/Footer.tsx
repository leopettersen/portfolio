import { useTranslation } from 'react-i18next';
import { contacts } from '../../data/contacts';
import { navLinks } from './links';
import { RESUME_FILE_NAME, RESUME_URL } from './resume';

export function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="mx-auto my-5 w-[calc(100%-2.5rem)] max-w-6xl rounded-3xl border border-line bg-surface/70 px-5 py-3 text-body shadow-brand backdrop-blur-md">

            <nav className="flex items-center justify-between gap-3 pt-3">
                <a href="#home" className="flex items-center gap-2">
                    <img src="/images/logo.png" alt="Logo" className="h-6 w-6 shrink-0 rounded-md object-cover" />
                    <span className="whitespace-nowrap text-sm font-medium">
                        Leonardo Pettersen
                    </span>
                </a>

                <ul className="hidden items-center gap-5 text-xs lg:flex">
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <a href={link.href} className="hover:text-brand transition-colors">
                                {t(`standard.menu.${link.key}`)}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="my-5 border-t border-line" />

            <div className="flex flex-col items-center justify-between gap-5 lg:flex-row">
                <p className="max-w-xl text-center text-sm font-semibold text-title/80 lg:text-left">
                    {t('standard.footer.text')}
                </p>

                <div className="flex flex-col items-center gap-4">
                    <a
                        href={RESUME_URL}
                        download={RESUME_FILE_NAME}
                        className="rounded-2xl border border-brand/30 bg-brand/10 px-3 py-2 text-xs font-bold text-brand hover:bg-brand/30 transition-colors"
                    >
                        {t('standard.resume.downloadResume')}
                    </a>

                    <div className="flex items-center gap-2">
                        {contacts.map((contact) => (
                            <a
                                key={contact.name}
                                href={contact.link}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={contact.name}
                                title={contact.name}
                                className="rounded-full border border-line p-2 hover:border-brand hover:bg-brand/5 hover:text-brand transition-colors"
                            >
                                <contact.icon size={18} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <p className="mt-5 text-center text-[10px] lg:text-left">
                {t('standard.footer.copy')}
            </p>
        </footer>
    );
}
