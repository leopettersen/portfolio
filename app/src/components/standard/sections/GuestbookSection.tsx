import { useTranslation } from 'react-i18next';
import { Send } from 'lucide-react';
import { useGuestbook } from '../../../hooks/useGuestbook';
import { FormField } from '../FormField';
import { SectionCard } from '../SectionCard';

export function GuestbookSection() {
    const { t } = useTranslation();
    const {
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
        sending,
        statusText,
        handleSubmit,
        handleLoadMore,
        formatDate,
    } = useGuestbook();

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 lg:flex-row">
            <SectionCard
                tag={t('standard.guestbook.tag')}
                title1={t('standard.guestbook.title1')}
                title2={t('standard.guestbook.title2')}
                description={t('standard.guestbook.text')}
                sticky
                className="lg:w-[26rem] lg:shrink-0"
            >
                <form onSubmit={handleSubmit} noValidate className="relative mt-4 flex flex-col">
                    <FormField
                        label={t('guestbook.form.name')}
                        name="guestbook-name"
                        placeholder={t('guestbook.form.namePlaceholder')}
                        value={newName}
                        onChange={setNewName}
                        error={formErrors.name}
                        disabled={sending}
                        maxLength={40}
                    />

                    <FormField
                        label={t('guestbook.form.message')}
                        name="guestbook-message"
                        multiline
                        placeholder={t('guestbook.form.messagePlaceholder')}
                        value={newMessage}
                        onChange={setNewMessage}
                        error={formErrors.message}
                        disabled={sending}
                        maxLength={500}
                    />

                    <input
                        type="text"
                        name="website"
                        value={website}
                        onChange={(event) => setWebsite(event.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        className="sr-only"
                    />

                    <p className="mb-3 text-xs">{t('guestbook.form.privacy')}</p>

                    <button
                        type="submit"
                        disabled={sending}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-3 py-3 text-sm font-bold text-on-brand hover:opacity-90 transition-opacity disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    >
                        <Send size={16} />
                        {sending ? t('guestbook.form.sending') : t('guestbook.form.submit')}
                    </button>

                    <p role="status" className={`mt-3 min-h-5 text-sm ${status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                        {statusText}
                    </p>
                </form>
            </SectionCard>

            <div className="flex min-w-0 flex-1 flex-col gap-4 lg:max-h-[46rem] lg:overflow-y-auto lg:pr-2">
                {loading && <p>{t('guestbook.loading')}</p>}

                {!loading && error && messages.length === 0 && (
                    <p className="text-red-500">{t('guestbook.error')}</p>
                )}

                {!loading && !error && messages.length === 0 && (
                    <p>{t('guestbook.empty')}</p>
                )}

                {messages.map((message) => (
                    <article key={message.id} className="flex flex-col gap-2 rounded-2xl border border-line bg-surface/95 p-5 shadow-brand backdrop-blur-xl">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <h3 className="text-lg font-bold text-title">{message.name}</h3>
                            <span className="text-xs">{formatDate(message.created_at)}</span>
                        </div>
                        <p className="whitespace-pre-wrap break-words text-sm">{message.message}</p>
                    </article>
                ))}

                {!loading && messages.length > 0 && error && (
                    <p className="text-red-500">{t('guestbook.error')}</p>
                )}

                {!loading && messages.length > 0 && hasMore && (
                    <button
                        type="button"
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="self-center rounded-lg border border-body/20 px-4 py-2 text-sm hover:border-brand hover:text-brand transition-colors disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    >
                        {loadingMore ? t('guestbook.loadingMore') : t('guestbook.loadMore')}
                    </button>
                )}
            </div>
        </div>
    );
}
