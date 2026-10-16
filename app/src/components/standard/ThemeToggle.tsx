import { Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { setTheme, useTheme } from './theme';

export function ThemeToggle() {
    const { t } = useTranslation();
    const theme = useTheme();
    const isDark = theme === 'dark';
    const label = isDark ? t('standard.lightTheme') : t('standard.darkTheme');

    return (
        <button
            type="button"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label={label}
            title={label}
            className="text-body hover:text-brand transition-colors cursor-pointer"
        >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
}
