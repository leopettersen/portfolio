import { useEffect, useState } from 'react';

interface BatteryManager extends EventTarget {
    level: number;
    charging: boolean;
}

interface NavigatorWithBattery extends Navigator {
    getBattery?: () => Promise<BatteryManager>;
}

export interface BatteryStatus {
    level: number;
    charging: boolean;
}

export function useBattery() {
    const [status, setStatus] = useState<BatteryStatus | null>(null);

    useEffect(() => {
        const getBattery = (navigator as NavigatorWithBattery).getBattery;
        if (!getBattery) return;

        let battery: BatteryManager | null = null;
        let cancelled = false;

        const update = () => {
            if (battery) setStatus({ level: battery.level, charging: battery.charging });
        };

        getBattery.call(navigator).then((manager) => {
            if (cancelled) return;
            battery = manager;
            update();
            battery.addEventListener('levelchange', update);
            battery.addEventListener('chargingchange', update);
        }).catch(() => {});

        return () => {
            cancelled = true;
            battery?.removeEventListener('levelchange', update);
            battery?.removeEventListener('chargingchange', update);
        };
    }, []);

    return status;
}
