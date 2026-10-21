import { useTranslation } from 'react-i18next';

interface LandingInfoPageProps {
  onClose: () => void;
}

export function LandingInfoPage({ onClose }: LandingInfoPageProps) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-3 md:p-4">
      <div className="bg-slate-900 border border-slate-800/60 rounded-lg shadow-2xl shadow-black/50 max-w-[min(680px,95vw)] w-full font-mono text-zinc-100 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800/60 rounded-t-lg">
          <div className="flex gap-2">
            <button
            onClick={onClose}
            className="w-3 h-3 rounded-full bg-red-500 hover:cursor-pointer"
            aria-label={t('window.close')}
            ></button>
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
        </div>
        <div className="p-4 md:p-6 space-y-3">
          <h2 className="text-lg font-semibold text-slate-100">
            {t('landingInfo.title')}
          </h2>
          <p className="text-slate-300 leading-relaxed">
            {t('landingInfo.info')}
          </p>
        </div>
        <div className="flex justify-end px-4 py-3 border-t border-slate-800/60 bg-slate-950/50">
          <button
            onClick={onClose}
            className="border border-slate-700/60 px-3 py-1.5 rounded-md text-sm text-slate-400 hover:text-slate-200 hover:border-slate-500 hover:cursor-pointer transition-colors"
          >
            {t('window.close')}
          </button>
        </div>
      </div>
    </div>
  );
}