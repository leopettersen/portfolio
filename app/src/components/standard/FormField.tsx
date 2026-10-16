import { useId } from 'react';

export interface FormFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    type?: string;
    multiline?: boolean;
    error?: string;
    disabled?: boolean;
}

export function FormField({ label, name, value, onChange, placeholder, type = 'text', multiline = false, error, disabled }: FormFieldProps) {
    const id = useId();
    const errorId = `${id}-error`;
    const fieldClass = 'w-full bg-transparent text-sm text-title placeholder:text-body/70 focus:outline-none';

    return (
        <div className="w-full">
            <label htmlFor={id} className="mb-1 block text-[10px] font-medium uppercase">{label}</label>

            <div className={`rounded-md border bg-body/5 px-3 py-2 transition-colors hover:border-brand hover:bg-brand/5 focus-within:border-brand focus-within:bg-brand/5 ${error ? 'border-red-500' : 'border-body/20'}`}>
                {multiline ? (
                    <textarea
                        id={id}
                        name={name}
                        value={value}
                        placeholder={placeholder}
                        disabled={disabled}
                        rows={5}
                        aria-invalid={!!error}
                        aria-describedby={error ? errorId : undefined}
                        onChange={(event) => onChange(event.target.value)}
                        className={`${fieldClass} resize-none`}
                    />
                ) : (
                    <input
                        id={id}
                        name={name}
                        type={type}
                        value={value}
                        placeholder={placeholder}
                        disabled={disabled}
                        autoComplete={type === 'email' ? 'email' : 'name'}
                        aria-invalid={!!error}
                        aria-describedby={error ? errorId : undefined}
                        onChange={(event) => onChange(event.target.value)}
                        className={fieldClass}
                    />
                )}
            </div>

            <p id={errorId} className="mt-1 mb-3 min-h-4 text-[11px] text-red-500">{error}</p>
        </div>
    );
}
