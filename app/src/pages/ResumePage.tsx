import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeBoundary } from '../components/standard/SafeBoundary';

const ResumeViewer = lazy(() => import('../components/resume/ResumeViewer'));

export function ResumePage() {
    const { t } = useTranslation();

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <SafeBoundary fallback={<p>{t('standard.resume.error')}</p>}>
                <Suspense fallback={<p role="status" className="text-sm text-slate-400">{t('standard.resume.loading')}</p>}>
                    <ResumeViewer tone="system" />
                </Suspense>
            </SafeBoundary>
        </div>
    );
}
