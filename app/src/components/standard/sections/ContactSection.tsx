import { useState, type FormEvent } from 'react';
import emailjs from '@emailjs/browser';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, Download, Send } from 'lucide-react';
import { RESUME_FILE_NAME, RESUME_URL } from '../resume';
import type { SendStatus } from '../../../types';
import { contacts } from '../../../data/contacts';
import { FormField } from '../FormField';

const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

interface FormState {
    name: string;
    email: string;
    message: string;
}

type FormErrors = Partial<Record<'name' | 'email' | 'message', string>>;

const INITIAL: FormState = { name: '', email: '', message: '' };

export function ContactSection() {
    const { t } = useTranslation();
    const [form, setForm] = useState<FormState>(INITIAL);
    const [errors, setErrors] = useState<FormErrors>({});
    const [status, setStatus] = useState<SendStatus>('idle');
    const sending = status === 'sending';

    function validate(): FormErrors {
        const found: FormErrors = {};

        if (!form.name.trim()) {
            found.name = t('contact.errors.nameRequired');
        }

        if (!form.email.trim()) {
            found.email = t('contact.errors.emailRequired');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
            found.email = t('contact.errors.emailInvalid');
        }

        if (!form.message.trim()) {
            found.message = t('contact.errors.messageRequired');
        } else if (form.message.trim().length < 10) {
            found.message = t('contact.errors.messageMinLength');
        }

        return found;
    }

    function setField<K extends keyof FormState>(field: K) {
        return (value: FormState[K]) => {
            setForm((prev) => ({ ...prev, [field]: value }));
            setErrors((prev) => ({ ...prev, [field]: undefined }));
            if (status === 'success' || status === 'error') setStatus('idle');
        };
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (new FormData(event.currentTarget).get('website')) return;

        const found = validate();
        setErrors(found);
        if (Object.keys(found).length > 0) return;

        setStatus('sending');

        try {
            await emailjs.send(
                serviceId,
                templateId,
                {
                    name: form.name.trim(),
                    email: form.email.trim(),
                    message: form.message.trim(),
                },
                publicKey
            );

            setStatus('success');
            setForm(INITIAL);
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    }

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 lg:flex-row lg:items-stretch">
            <div className="flex flex-col rounded-2xl border border-line bg-surface/95 p-5 shadow-brand backdrop-blur-xl lg:w-1/2 lg:p-10">
                <h2 className="text-3xl font-bold text-title xl:text-4xl">{t('standard.contact.title')}</h2>
                <p className="my-5">{t('standard.contact.text')}</p>

                <div className="flex flex-col gap-4">
                    {contacts.map((contact) => (
                        <a
                            key={contact.name}
                            href={contact.link}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between gap-3 rounded-md border border-body/10 px-3 py-2.5 transition-colors hover:border-brand hover:bg-brand/5 hover:text-brand"
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex shrink-0 items-center justify-center rounded-md bg-brand/10 p-2">
                                    <contact.icon size={20} className="text-brand" />
                                </div>
                                <div className="min-w-0">
                                    <span className="text-xs uppercase">{contact.name}</span>
                                    <p className="truncate text-sm font-semibold text-title">{contact.text.replace(' @', '@')}</p>
                                </div>
                            </div>
                            <ArrowUpRight size={22} className="shrink-0" />
                        </a>
                    ))}
                </div>

                <a
                    href={RESUME_URL}
                    download={RESUME_FILE_NAME}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-3 py-3 text-sm font-bold text-on-brand hover:opacity-90 transition-opacity"
                >
                    <Download size={16} />
                    {t('standard.resume.downloadResume')}
                </a>

                <div className="mt-auto pt-8">
                    <div className="mb-3 border-t border-line" />
                    <small className="flex items-center gap-2 text-xs">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                        {t('standard.contact.available')}
                    </small>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                noValidate
                className="relative rounded-2xl border border-line bg-surface/95 p-5 shadow-brand backdrop-blur-xl lg:w-1/2 lg:p-10"
            >
                <h2 className="text-3xl font-bold text-title xl:text-4xl">{t('contact.title')}</h2>
                <p className="my-5">{t('standard.contact.formText')}</p>

                <div className="flex w-full flex-col xl:flex-row xl:gap-3">
                    <FormField
                        label={t('contact.nameLabel')}
                        name="name"
                        placeholder={t('contact.namePlaceholder')}
                        value={form.name}
                        onChange={setField('name')}
                        error={errors.name}
                        disabled={sending}
                    />
                    <FormField
                        label={t('contact.emailLabel')}
                        name="email"
                        type="email"
                        placeholder={t('contact.emailPlaceholder')}
                        value={form.email}
                        onChange={setField('email')}
                        error={errors.email}
                        disabled={sending}
                    />
                </div>

                <FormField
                    label={t('contact.messageLabel')}
                    name="message"
                    multiline
                    placeholder={t('contact.messagePlaceholder')}
                    value={form.message}
                    onChange={setField('message')}
                    error={errors.message}
                    disabled={sending}
                />

                <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute -left-[9999px] h-0 w-0 opacity-0"
                />

                <p role="status" className={`mb-3 min-h-4 text-sm ${status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                    {status === 'success' && t('contact.successMsg')}
                    {status === 'error' && t('contact.errorMsg')}
                </p>

                <button
                    type="submit"
                    disabled={sending}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-body/20 px-3 py-3 text-sm font-bold text-title transition-colors hover:border-brand hover:bg-brand/5 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                    <Send size={16} className="text-brand" />
                    {sending ? t('contact.sendingButton') : t('contact.sendButton')}
                </button>

                <div className="mt-8 mb-3 border-t border-line" />
                <small className="block text-center text-xs">{t('standard.contact.privacy')}</small>
            </form>
        </div>
    );
}
