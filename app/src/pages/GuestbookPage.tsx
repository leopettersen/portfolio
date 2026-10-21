import { useTranslation } from 'react-i18next';

import { useGuestbook } from '../hooks/useGuestbook';

export function GuestbookPage() {
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
        handleSubmit,
        handleLoadMore,
        formatDate,
    } = useGuestbook();

    return (
        <div className="flex flex-col gap-8">

            {/* Formulário */}
            <div className="flex flex-col gap-4">

                <h2 className="text-xl font-bold">
                    {t('guestbook.form.title')}
                </h2>

                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

                    <div className="flex flex-col gap-2">
                        <label htmlFor="guestbook-name" className="text-sm text-slate-400">
                            {t('guestbook.form.name')}
                        </label>

                        <input
                            id="guestbook-name"
                            type="text"
                            maxLength={40}
                            value={newName}
                            onChange={(event) => setNewName(event.target.value)}
                            placeholder={t('guestbook.form.namePlaceholder')}
                            aria-invalid={!!formErrors.name}
                            aria-describedby={formErrors.name ? 'guestbook-name-error' : undefined}
                            className={`w-full bg-slate-800/60 border ${formErrors.name ? 'border-red-400' : 'border-slate-700/60'} rounded-md px-3 py-2 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-slate-500`}
                        />

                        {formErrors.name && (
                            <p id="guestbook-name-error" className="text-sm text-red-400">
                                {formErrors.name}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="guestbook-message" className="text-sm text-slate-400">
                            {t('guestbook.form.message')}
                        </label>

                        <textarea
                            id="guestbook-message"
                            maxLength={500}
                            value={newMessage}
                            onChange={(event) => setNewMessage(event.target.value)}
                            placeholder={t('guestbook.form.messagePlaceholder')}
                            rows={5}
                            aria-invalid={!!formErrors.message}
                            aria-describedby={formErrors.message ? 'guestbook-message-error' : undefined}
                            className={`w-full bg-slate-800/60 border ${formErrors.message ? 'border-red-400' : 'border-slate-700/60'} rounded-md px-3 py-2 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-slate-500 resize-none`}
                        />

                        <div className="flex justify-between gap-4">
                            {formErrors.message ? (
                                <p id="guestbook-message-error" className="text-sm text-red-400">
                                    {formErrors.message}
                                </p>
                            ) : (
                                <span />
                            )}

                            <span className="text-xs text-slate-400">
                                {newMessage.length}/500
                            </span>
                        </div>
                    </div>

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

                    <p className="text-xs text-slate-400">
                        {t('guestbook.form.privacy')}
                    </p>

                    <button
                        type="submit"
                        disabled={status === 'sending'}
                        className="self-start border border-slate-700/60 px-4 py-2 rounded-md text-sm text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status === 'sending'
                            ? t('guestbook.form.sending')
                            : t('guestbook.form.submit')}
                    </button>

                    {status === 'success' && (
                        <p role="status" className="text-sm text-green-400">
                            {t('guestbook.form.success')}
                        </p>
                    )}

                    {status === 'error' && (
                        <p role="status" className="text-sm text-red-400">
                            {formErrors.message === t('guestbook.form.wait')
                                ? t('guestbook.form.wait')
                                : t('guestbook.form.error')}
                        </p>
                    )}

                </form>

            </div>

            {/* Lista */}
            <div className="flex flex-col gap-6">

                {loading && (
                    <p className="text-slate-400">
                        {t('guestbook.loading')}
                    </p>
                )}

                {!loading && error && messages.length === 0 && (
                    <p className="text-red-400">
                        {t('guestbook.error')}
                    </p>
                )}

                {!loading && !error && messages.length === 0 && (
                    <p className="text-slate-400">
                        {t('guestbook.empty')}
                    </p>
                )}

                {!loading && messages.length > 0 && (
                    <>
                        <div className="flex flex-col gap-6">
                            {messages.map((message) => (
                                <div key={message.id} className="flex flex-col gap-2 bg-slate-800/60 p-4 rounded-lg">

                                    <div className="flex items-baseline justify-between gap-4">
                                        <h2 className="text-xl font-bold">
                                            {message.name}
                                        </h2>

                                        <span className="text-sm font-semibold text-slate-400">
                                            {formatDate(message.created_at)}
                                        </span>
                                    </div>

                                    <p className="text-slate-400 whitespace-pre-wrap break-words">
                                        {message.message}
                                    </p>

                                </div>
                            ))}
                        </div>

                        {error && (
                            <p className="text-red-400">
                                {t('guestbook.error')}
                            </p>
                        )}

                        {hasMore && (
                            <button
                                type="button"
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                className="self-start border border-slate-700/60 px-4 py-2 rounded-md text-sm text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loadingMore
                                    ? t('guestbook.loadingMore')
                                    : t('guestbook.loadMore')}
                            </button>
                        )}
                    </>
                )}

            </div>

        </div>
    );
}