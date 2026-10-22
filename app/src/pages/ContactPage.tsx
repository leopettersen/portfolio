import { useTranslation } from 'react-i18next';
import { contacts } from '../data/contacts';
import { useContactForm } from '../hooks/useContactForm';

export function ContactPage() {
    const { t } = useTranslation();
    const { form, setField, website, setWebsite, errors, status, sending, statusText, handleSubmit } = useContactForm();

    return (
        <div className="flex flex-col gap-8">

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {contacts.map((contact, index) => (
                    <a key={contact.name} href={contact.link} target="_blank" rel="noreferrer" className="flex flex-col gap-2 bg-slate-800/60 border border-slate-800/60 rounded-lg p-4 transition-colors hover:border-slate-500">
                        <div className="flex items-center justify-between gap-2">
                            <contact.icon size={20} />

                            <span className="text-xs text-slate-400">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                        </div>

                        <span className="font-semibold text-slate-200">
                            {contact.name}
                        </span>

                        <span className="text-sm text-slate-400 break-words min-w-0">
                            {contact.text}
                        </span>
                    </a>
                ))}
            </div>

            <div className="flex flex-col gap-4">

                <h2 className="text-xl font-bold">
                    {t('contact.title')}
                </h2>

                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

                    <div className="flex flex-col gap-2">
                        <label htmlFor="name" className="text-sm text-slate-400">
                            {t('contact.nameLabel')}
                        </label>

                        <input id="name" type="text" value={form.name} onChange={(event) => setField('name')(event.target.value)} disabled={sending} placeholder={t('contact.namePlaceholder')} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} className={`w-full bg-slate-800/60 border ${errors.name ? 'border-red-400' : 'border-slate-700/60'} rounded-md px-3 py-2 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-slate-500`} />

                        {errors.name && (
                            <p id="name-error" className="text-sm text-red-400">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm text-slate-400">
                            {t('contact.emailLabel')}
                        </label>

                        <input id="email" type="email" value={form.email} onChange={(event) => setField('email')(event.target.value)} disabled={sending} placeholder={t('contact.emailPlaceholder')} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} className={`w-full bg-slate-800/60 border ${errors.email ? 'border-red-400' : 'border-slate-700/60'} rounded-md px-3 py-2 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-slate-500`} />

                        {errors.email && (
                            <p id="email-error" className="text-sm text-red-400">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="message" className="text-sm text-slate-400">
                            {t('contact.messageLabel')}
                        </label>

                        <textarea id="message" value={form.message} onChange={(event) => setField('message')(event.target.value)} disabled={sending} placeholder={t('contact.messagePlaceholder')} rows={5} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-error' : undefined} className={`w-full bg-slate-800/60 border ${errors.message ? 'border-red-400' : 'border-slate-700/60'} rounded-md px-3 py-2 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-slate-500 resize-none`} />

                        {errors.message && (
                            <p id="message-error" className="text-sm text-red-400">
                                {errors.message}
                            </p>
                        )}
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

                    <button type="submit" disabled={sending} className="self-start border border-slate-700/60 px-4 py-2 rounded-md text-sm text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {sending ? t('contact.sendingButton') : t('contact.sendButton')}
                    </button>

                    <p role="status" className={`text-sm ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                        {statusText}
                    </p>

                </form>

            </div>

        </div>
    );
}