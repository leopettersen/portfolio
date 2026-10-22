import { useState, type FormEvent } from 'react';
import emailjs, { EmailJSResponseStatus, type StorageProvider } from '@emailjs/browser';
import { useTranslation } from 'react-i18next';
import type { SendStatus } from '../types';

const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const LAST_SENT_KEY = 'contact:lastSent';
const SEND_INTERVAL = 60_000;

const storage: StorageProvider = {
    get: async (key) => {
        try {
            return localStorage.getItem(key);
        } catch {
            return null;
        }
    },
    set: async (key, value) => {
        try {
            localStorage.setItem(key, value);
        } catch {
            return;
        }
    },
    remove: async (key) => {
        try {
            localStorage.removeItem(key);
        } catch {
            return;
        }
    },
};

export interface ContactForm {
    name: string;
    email: string;
    message: string;
}

export type ContactStatus = SendStatus | 'limited';

type ContactErrors = Partial<Record<keyof ContactForm, string>>;

const INITIAL: ContactForm = { name: '', email: '', message: '' };

export function useContactForm() {
    const { t } = useTranslation();
    const [form, setForm] = useState<ContactForm>(INITIAL);
    const [website, setWebsite] = useState('');
    const [errors, setErrors] = useState<ContactErrors>({});
    const [status, setStatus] = useState<ContactStatus>('idle');
    const sending = status === 'sending';

    function validate(): ContactErrors {
        const found: ContactErrors = {};

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

    function setField<K extends keyof ContactForm>(field: K) {
        return (value: ContactForm[K]) => {
            setForm((prev) => ({ ...prev, [field]: value }));
            setErrors((prev) => ({ ...prev, [field]: undefined }));
            if (status !== 'idle' && status !== 'sending') setStatus('idle');
        };
    }

    function finish() {
        setForm(INITIAL);
        setWebsite('');
        setErrors({});
        setStatus('success');
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (sending) return;

        if (website.trim()) {
            finish();
            return;
        }

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
                {
                    publicKey,
                    blockHeadless: true,
                    limitRate: { id: LAST_SENT_KEY, throttle: SEND_INTERVAL },
                    storageProvider: storage,
                }
            );

            finish();
        } catch (error) {
            if (error instanceof EmailJSResponseStatus && error.status === 429) {
                setStatus('limited');
                return;
            }

            await storage.remove(LAST_SENT_KEY);
            console.error(error);
            setStatus('error');
        }
    }

    const statusText = {
        idle: '',
        sending: '',
        success: t('contact.successMsg'),
        error: t('contact.errorMsg'),
        limited: t('contact.limitedMsg'),
    }[status];

    return {
        form,
        setField,
        website,
        setWebsite,
        errors,
        status,
        sending,
        statusText,
        handleSubmit,
    };
}
