import { useRef, useState, useEffect, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';

export interface CommandPromptProps {
    onSubmit: (command: string) => void;
    active?: boolean;
}

export function CommandPrompt({ onSubmit, active = true }: CommandPromptProps) {
    const { t } = useTranslation();
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const [isTouch] = useState(() => window.matchMedia('(pointer: coarse)').matches);

    function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            onSubmit(inputValue);
            setInputValue('');
        }
    }

    function handleClick() {
        inputRef.current?.focus({ preventScroll: true });
    }

    useEffect(() => {
        if (active && !isTouch) {
            inputRef.current?.focus({ preventScroll: true });
        }
    }, [active, isTouch]);

    useEffect(() => {
        if (!active || isTouch) {
            return;
        }

        const handleGlobalClick = (event: MouseEvent) => {
            if (window.getSelection()?.toString()) {
                return;
            }

            const target = event.target;

            if (target instanceof HTMLElement) {
                const interactiveElement = target.closest('input, textarea, button, a');

                if (interactiveElement) {
                    return;
                }
            }

            inputRef.current?.focus({ preventScroll: true });
        };

        document.addEventListener('click', handleGlobalClick);

        return () => {
            document.removeEventListener('click', handleGlobalClick);
        };
    }, [active, isTouch]);

    return (

        <div className="flex items-center gap-2 cursor-text" onClick={handleClick}>
            <span className="text-blue-500">guest@os:~$</span>
            <input
                onKeyDown={handleKeyDown}
                className="sr-only"
                type="text" 
                ref={inputRef}
                aria-label={t('terminal.inputLabel')}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            <div className="flex items-center">
                <span className="text-slate-400 whitespace-pre">{inputValue}</span>
                <div className="w-2 h-4 bg-blue-500 animate-pulse"></div>
            </div>
        </div>
    );
}