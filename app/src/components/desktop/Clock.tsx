import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Language } from '../../types/';
import { localeMap } from '../../i18n/localeMap';


export function Clock() {
    const { i18n } = useTranslation();
    const language = i18n.resolvedLanguage as Language;
    const locale = localeMap[language];

    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    const time = now.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
    });

    const date = now.toLocaleDateString(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    return (
        <time dateTime={now.toISOString()} className="flex flex-col items-end font-mono text-xs leading-tight text-zinc-200">
            <span>{time}</span>
            <span className="hidden text-zinc-400 sm:inline">{date}</span>
        </time>
    );
}
