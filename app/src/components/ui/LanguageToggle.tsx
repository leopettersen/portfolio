import { useTranslation } from 'react-i18next';

const tones = {
    system: {
        pill: 'border-slate-700/60 hover:border-slate-500',
        active: 'text-blue-500 font-bold',
        muted: 'text-zinc-500',
        divider: 'text-zinc-700',
    },
    standard: {
        pill: 'border-line hover:border-brand',
        active: 'text-brand font-bold',
        muted: 'text-body',
        divider: 'text-line',
    },
};

export interface LanguageToggleProps {
    tone?: keyof typeof tones;
    className?: string;
}

export function LanguageToggle({ tone = 'system', className = '' }: LanguageToggleProps) {
    const { i18n } = useTranslation();
    const isEnglish = i18n.resolvedLanguage === 'en';
    const colors = tones[tone];
    const label = isEnglish ? 'Mudar para português' : 'Switch to English';

    return (
        <button
            type="button"
            onClick={() => i18n.changeLanguage(isEnglish ? 'pt' : 'en')}
            aria-label={label}
            title={label}
            className={`flex items-center gap-2 rounded-full border px-3 py-0.5 transition-colors cursor-pointer ${colors.pill} ${className}`}
        >
            <span className={isEnglish ? colors.muted : colors.active}>
                PT
            </span>

            <span className={colors.divider} aria-hidden="true">
                |
            </span>

            <span className={isEnglish ? colors.active : colors.muted}>
                EN
            </span>
        </button>
    );
}
