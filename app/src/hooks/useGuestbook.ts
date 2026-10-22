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

type GuestbookStatus = SendStatus | 'limited';

function secondsToWait() {
    try {
        const elapsed = Date.now() - Number(localStorage.getItem(LAST_SENT_KEY) ?? 0);
        return Math.max(0, Math.ceil((SEND_INTERVAL - elapsed) / 1000));
    } catch {
        return 0;
    }
}

function saveLastSent() {
    try {
        localStorage.setItem(LAST_SENT_KEY, String(Date.now()));
    } catch {
        return;
    }
}

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
    const [status, setStatus] = useState<GuestbookStatus>('idle');
    const [waitSeconds, setWaitSeconds] = useState(0);
    const sending = status === 'sending';

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

    function clearStatus() {
        if (status !== 'idle' && status !== 'sending') setStatus('idle');
    }

    function changeName(value: string) {
        setNewName(value);
        setFormErrors((prev) => ({ ...prev, name: undefined }));
        clearStatus();
    }

    function changeMessage(value: string) {
        setNewMessage(value);
        setFormErrors((prev) => ({ ...prev, message: undefined }));
        clearStatus();
    }

    function finish() {
        setNewName('');
        setNewMessage('');
        setWebsite('');
        setFormErrors({});
        setStatus('success');
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (sending) return;

        if (website.trim()) {
            finish();
            return;
        }

        const validationErrors = validate();
        setFormErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        const wait = secondsToWait();

        if (wait > 0) {
            setWaitSeconds(wait);
            setStatus('limited');
            return;
        }

        setStatus('sending');

        try {
            const createdMessage = await addMessage(newName, newMessage);

            setMessages((prev) => [createdMessage, ...prev]);
            saveLastSent();
            finish();
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

    const statusText = {
        idle: '',
        sending: '',
        success: t('guestbook.form.success'),
        error: t('guestbook.form.error'),
        limited: t('guestbook.form.wait', { seconds: waitSeconds }),
    }[status];

    return {
        messages,
        loading,
        loadingMore,
        error,
        hasMore,
        newName,
        setNewName: changeName,
        newMessage,
        setNewMessage: changeMessage,
        website,
        setWebsite,
        formErrors,
        status,
        sending,
        statusText,
        handleSubmit,
        handleLoadMore,
        formatDate,
    };
}
