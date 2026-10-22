import { useTranslation } from 'react-i18next';
import { ArrowUpRight, Download, Send } from 'lucide-react';
import { RESUME_FILE_NAME, RESUME_URL } from '../resume';
import { contacts } from '../../../data/contacts';
import { useContactForm } from '../../../hooks/useContactForm';
import { FormField } from '../FormField';

export function ContactSection() {
    const { t } = useTranslation();
    const { form, setField, website, setWebsite, errors, status, sending, statusText, handleSubmit } = useContactForm();

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
                    value={website}
                    onChange={(event) => setWebsite(event.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute -left-[9999px] h-0 w-0 opacity-0"
                />

                <p role="status" className={`mb-3 min-h-4 text-sm ${status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                    {statusText}
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
