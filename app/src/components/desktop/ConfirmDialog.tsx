import { useId, type KeyboardEvent } from 'react';

export interface ConfirmDialogProps {
    title: string;
    text: string;
    cancelLabel: string;
    confirmLabel: string;
    onCancel: () => void;
    onConfirm: () => void;
}

export function ConfirmDialog({ title, text, cancelLabel, confirmLabel, onCancel, onConfirm }: ConfirmDialogProps) {
    const titleId = useId();
    const textId = useId();

    function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
        if (event.key === 'Escape') {
            event.preventDefault();
            onCancel();
        }
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4" onPointerDown={(event) => event.target === event.currentTarget && onCancel()}>
            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={textId}
                onKeyDown={handleKeyDown}
                className="w-full max-w-md rounded-lg border border-slate-700/60 bg-slate-900 p-6 font-mono text-zinc-100 shadow-2xl shadow-black/60"
            >
                <h2 id={titleId} className="text-lg font-bold">{title}</h2>
                <p id={textId} className="mt-2 text-sm leading-relaxed text-slate-400">{text}</p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        autoFocus
                        onClick={onCancel}
                        className="rounded-md border border-slate-700/60 px-4 py-2 text-sm text-slate-300 hover:border-slate-500 hover:text-white transition-colors"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="rounded-md bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-500 transition-colors"
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
