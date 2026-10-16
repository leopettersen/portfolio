import { useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, ChevronDown } from 'lucide-react';
import { reasons, type Reason } from './reasons';

export interface ReasonSelectProps {
    value: Reason;
    onChange: (value: Reason) => void;
    disabled?: boolean;
}

export function ReasonSelect({ value, onChange, disabled }: ReasonSelectProps) {
    const { t } = useTranslation();
    const id = useId();
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);
    const selected = reasons.find((reason) => reason.value === value) ?? reasons[0];

    useEffect(() => {
        if (!open) return;

        function handlePointerDown(event: PointerEvent) {
            if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') setOpen(false);
        }

        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [open]);

    function choose(reason: Reason) {
        onChange(reason);
        setOpen(false);
    }

    return (
        <div ref={rootRef} className="relative mb-5">
            <span id={`${id}-label`} className="mb-1 block text-[10px] font-medium uppercase">
                {t('standard.contact.reason')}
            </span>

            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-labelledby={`${id}-label`}
                className="flex w-full items-center justify-between gap-2 rounded-md border border-body/20 bg-body/5 px-3 py-2.5 text-sm text-title transition-colors hover:border-brand hover:bg-brand/5 cursor-pointer"
            >
                <span className="flex items-center gap-2">
                    <selected.icon size={16} className="text-brand" />
                    {t(`standard.contact.reasons.${selected.value}`)}
                </span>
                <ChevronDown size={16} className={`text-brand transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <ul
                    role="listbox"
                    aria-labelledby={`${id}-label`}
                    className="absolute inset-x-0 top-full z-20 mt-1 overflow-hidden rounded-md border border-line bg-surface p-1 shadow-brand"
                >
                    {reasons.map((reason) => (
                        <li key={reason.value} role="option" aria-selected={reason.value === value}>
                            <button
                                type="button"
                                onClick={() => choose(reason.value)}
                                className="flex w-full items-center justify-between gap-2 rounded px-3 py-2 text-left text-sm text-title hover:bg-brand/10 cursor-pointer"
                            >
                                <span className="flex items-center gap-2">
                                    <reason.icon size={16} className="text-brand" />
                                    {t(`standard.contact.reasons.${reason.value}`)}
                                </span>
                                {reason.value === value && <Check size={16} className="text-brand" />}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
