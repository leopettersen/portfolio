import { useTranslation } from 'react-i18next';
import { BatteryCharging, BatteryFull, BatteryLow, BatteryMedium, Maximize, Minimize, Wifi, WifiOff } from 'lucide-react';
import { useOnline } from '../../hooks/useOnline';
import { useBattery, type BatteryStatus } from '../../hooks/useBattery';
import { useFullscreen } from '../../hooks/useFullscreen';

function batteryIcon(level: number, charging: boolean) {
    if (charging) return <BatteryCharging size={18} />;
    if (level < 0.25) return <BatteryLow size={18} />;
    if (level < 0.6) return <BatteryMedium size={18} />;
    return <BatteryFull size={18} />;
}

function BatteryIndicator({ level, charging }: BatteryStatus) {
    const { t } = useTranslation();
    const percent = Math.round(level * 100);
    const low = !charging && level < 0.25;
    const label = charging ? t('tray.batteryCharging', { percent }) : t('tray.battery', { percent });

    return (
        <span role="img" aria-label={label} title={label} className={`hidden h-8 items-center gap-1 px-1 text-xs md:flex ${low ? 'text-red-400' : 'text-zinc-300'}`}>
            {batteryIcon(level, charging)}
            <span aria-hidden="true">{percent}%</span>
        </span>
    );
}

export function SystemTray() {
    const { t } = useTranslation();
    const online = useOnline();
    const battery = useBattery();
    const fullscreen = useFullscreen();

    const onlineLabel = online ? t('tray.online') : t('tray.offline');
    const OnlineIcon = online ? Wifi : WifiOff;

    return (
        <div className="flex items-center gap-1">
            <span role="img" aria-label={onlineLabel} title={onlineLabel} className="flex h-8 w-8 items-center justify-center">
                <OnlineIcon size={16} className={online ? 'text-zinc-300' : 'text-red-400'} />
            </span>

            {battery && <BatteryIndicator {...battery} />}

            {fullscreen.supported && (
                <button
                    type="button"
                    onClick={fullscreen.toggle}
                    aria-label={fullscreen.active ? t('tray.exitFullscreen') : t('tray.fullscreen')}
                    aria-pressed={fullscreen.active}
                    title={fullscreen.active ? t('tray.exitFullscreen') : t('tray.fullscreen')}
                    className="hidden h-8 w-8 items-center justify-center rounded-md text-zinc-300 hover:bg-slate-800/80 hover:text-white transition-colors md:flex"
                >
                    {fullscreen.active ? <Minimize size={16} /> : <Maximize size={16} />}
                </button>
            )}
        </div>
    );
}
