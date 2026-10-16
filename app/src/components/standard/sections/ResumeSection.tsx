import '../pdfPolyfills';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Document, Page, pdfjs } from 'react-pdf';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { Download, ExternalLink, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import { RESUME_FILE_NAME, RESUME_URL } from '../resume';

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2;
const ZOOM_STEP = 0.25;

const zoomButton = 'rounded-md border border-brand bg-brand/10 p-1 text-title hover:bg-brand/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer';

export default function ResumeSection() {
    const { t } = useTranslation();
    const areaRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState<number | null>(null);
    const [pages, setPages] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        const area = areaRef.current;
        if (!area) return;

        const observer = new ResizeObserver(([entry]) => setWidth(Math.max(200, Math.floor(entry.contentRect.width))));
        observer.observe(area);

        return () => observer.disconnect();
    }, []);

    function changeZoom(delta: number) {
        setZoom((current) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, current + delta)));
    }

    const pageWidth = width ? Math.round(width * zoom) : undefined;
    const loading = !failed && pages === 0;

    return (
        <div className="mx-auto w-[calc(100%-2.5rem)] max-w-6xl rounded-2xl border border-line bg-surface/95 shadow-brand backdrop-blur-xl">
            <div className="flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-7">
                <div className="flex items-baseline gap-3">
                    <h2 className="text-2xl font-bold text-title md:text-3xl">{t('standard.resume.title')}</h2>
                    {pages > 0 && <span className="text-sm">{t('standard.resume.pages', { count: pages })}</span>}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => changeZoom(-ZOOM_STEP)}
                        disabled={zoom <= ZOOM_MIN}
                        aria-label={t('standard.resume.zoomOut')}
                        title={t('standard.resume.zoomOut')}
                        className={zoomButton}
                    >
                        <ZoomOut size={18} />
                    </button>
                    <span className="w-12 text-center font-medium">{Math.round(zoom * 100)}%</span>
                    <button
                        type="button"
                        onClick={() => changeZoom(ZOOM_STEP)}
                        disabled={zoom >= ZOOM_MAX}
                        aria-label={t('standard.resume.zoomIn')}
                        title={t('standard.resume.zoomIn')}
                        className={zoomButton}
                    >
                        <ZoomIn size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={() => setZoom(1)}
                        disabled={zoom === 1}
                        aria-label={t('standard.resume.zoomFit')}
                        title={t('standard.resume.zoomFit')}
                        className={zoomButton}
                    >
                        <Maximize2 size={18} />
                    </button>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                    <a
                        href={RESUME_URL}
                        download={RESUME_FILE_NAME}
                        className="flex items-center justify-center gap-1 rounded-md bg-brand px-3 py-1.5 text-xs font-bold text-on-brand hover:opacity-90 transition-opacity"
                    >
                        <Download size={18} />
                        {t('standard.resume.download')}
                    </a>
                    <a
                        href={RESUME_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1 rounded-md bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand hover:text-on-brand transition-colors"
                    >
                        <ExternalLink size={18} />
                        {t('standard.resume.open')}
                    </a>
                </div>
            </div>

            <div
                ref={areaRef}
                className="flex max-h-[80vh] flex-col items-center gap-6 overflow-auto rounded-b-2xl bg-black/40 p-4 md:p-6"
            >
                {loading && <p role="status" className="py-10 text-sm">{t('standard.resume.loading')}</p>}

                {failed ? (
                    <p className="py-10 text-center text-sm">{t('standard.resume.error')}</p>
                ) : (
                    <Document
                        file={RESUME_URL}
                        onLoadSuccess={({ numPages }) => setPages(numPages)}
                        onLoadError={(error) => {
                            console.error(error);
                            setFailed(true);
                        }}
                        loading={null}
                        error={null}
                        externalLinkTarget="_blank"
                        externalLinkRel="noopener noreferrer"
                    >
                        {pageWidth && Array.from({ length: pages }, (_, i) => (
                            <div key={i} className="shrink-0 rounded-sm bg-white leading-none shadow-2xl shadow-black/60">
                                <Page pageNumber={i + 1} width={pageWidth} loading={null} />
                            </div>
                        ))}
                    </Document>
                )}
            </div>
        </div>
    );
}
