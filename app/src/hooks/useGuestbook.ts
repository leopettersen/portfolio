import { useEffect, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { GuestbookMessage, SendStatus } from '../types';
import { addMessage, fetchMessages, PAGE_SIZE } from '../services/guestbook';
import { localeMap } from '../i18n/localeMap';

interface FormErrors {
    name?: string;
    message?: string;
}

const LAST_SENT_KEY = 'guestbook:lastSent';
const SEND_INTERVAL = 30_000;

export function useGuestbook() {
    const { t, i18n } = useTranslation();

    const [messages, setMessages] = useState<GuestbookMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const [newName, setNewName] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [website, setWebsite] = useState('');

    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [status, setStatus] = useState<SendStatus>('idle');

    const locale = localeMap[i18n.resolvedLanguage === 'en' ? 'en' : 'pt'];

    useEffect(() => {
        let ignore = false;

        async function loadMessages() {
            try {
                const data = await fetchMessages();

                if (!ignore) {
                    setMessages(data);
                    setHasMore(data.length === PAGE_SIZE);
                }
            } catch {
                if (!ignore) {
                    setError(true);
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        }

        loadMessages();

        return () => {
            ignore = true;
        };
    }, []);

    async function handleLoadMore() {
        if (loadingMore || messages.length === 0) return;

        setLoadingMore(true);
        setError(false);

        const lastId = messages[messages.length - 1].id;

        try {
            const newMessages = await fetchMessages(lastId);

            setMessages((prev) => [...prev, ...newMessages]);
            setHasMore(newMessages.length === PAGE_SIZE);
        } catch (error) {
            setError(true);
            console.error(error);
        } finally {
            setLoadingMore(false);
        }
    }

    function validate(): FormErrors {
        const errors: FormErrors = {};

        if (!newName.trim()) {
            errors.name = t('guestbook.form.nameError');
        }

        if (!newMessage.trim()) {
            errors.message = t('guestbook.form.messageError');
        }

        return errors;
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (website.trim()) {
            setStatus('success');

            setNewName('');
            setNewMessage('');
            setWebsite('');
            setFormErrors({});

            return;
        }

        const lastSent = localStorage.getItem(LAST_SENT_KEY);

        if (lastSent) {
            const elapsed = Date.now() - Number(lastSent);

            if (elapsed < SEND_INTERVAL) {
                setStatus('error');

                setFormErrors({
                    ...formErrors,
                    message: t('guestbook.form.wait'),
                });

                return;
            }
        }

        const validationErrors = validate();

        setFormErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            setStatus('idle');
            return;
        }

        setStatus('sending');

        try {
            const createdMessage = await addMessage(newName, newMessage);

            setMessages((prev) => [createdMessage, ...prev]);

            localStorage.setItem(LAST_SENT_KEY, String(Date.now()));

            setNewName('');
            setNewMessage('');
            setWebsite('');
            setFormErrors({});
            setStatus('success');
        } catch (error) {
            setStatus('error');
            console.error(error);
        }
    }

    function formatDate(date: string) {
        return new Date(date).toLocaleDateString(locale, {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    }

    const statusText = status === 'success'
        ? t('guestbook.form.success')
        : status === 'error'
            ? formErrors.message === t('guestbook.form.wait') ? t('guestbook.form.wait') : t('guestbook.form.error')
            : '';

    return {
        messages,
        loading,
        loadingMore,
        error,
        hasMore,
        newName,
        setNewName,
        newMessage,
        setNewMessage,
        website,
        setWebsite,
        formErrors,
        status,
        statusText,
        handleSubmit,
        handleLoadMore,
        formatDate,
    };
}
