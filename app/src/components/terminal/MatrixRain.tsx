import { useEffect, useRef, useState } from 'react';

const DURATION = 4000;
const FADE = 400;
const FONT_SIZE = 16;
const CHARACTERS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789LEOPETTERSEN';

export interface MatrixRainProps {
    onDone: () => void;
}

export function MatrixRain({ onDone }: MatrixRainProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [fading, setFading] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (!canvas || !context) return;

        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;
        const ratio = window.devicePixelRatio || 1;
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        context.scale(ratio, ratio);

        const drops = Array.from({ length: Math.ceil(width / FONT_SIZE) }, () => Math.floor(Math.random() * -40));
        let frame = 0;
        let last = 0;

        const draw = (time: number) => {
            frame = requestAnimationFrame(draw);
            if (time - last < 50) return;
            last = time;

            context.fillStyle = 'rgba(2, 6, 23, 0.15)';
            context.fillRect(0, 0, width, height);
            context.font = `${FONT_SIZE}px 'JetBrains Mono Variable', monospace`;

            drops.forEach((drop, index) => {
                const character = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
                context.fillStyle = Math.random() > 0.95 ? '#d1fae5' : '#22c55e';
                context.fillText(character, index * FONT_SIZE, drop * FONT_SIZE);

                drops[index] = drop * FONT_SIZE > height && Math.random() > 0.97 ? 0 : drop + 1;
            });
        };

        frame = requestAnimationFrame(draw);
        const fadeTimer = setTimeout(() => setFading(true), DURATION - FADE);
        const doneTimer = setTimeout(onDone, DURATION);

        return () => {
            cancelAnimationFrame(frame);
            clearTimeout(fadeTimer);
            clearTimeout(doneTimer);
        };
    }, [onDone]);

    useEffect(() => {
        const stop = (event: KeyboardEvent) => {
            event.preventDefault();
            onDone();
        };

        window.addEventListener('keydown', stop, { capture: true });
        return () => window.removeEventListener('keydown', stop, { capture: true });
    }, [onDone]);

    return (
        <canvas
            ref={canvasRef}
            onPointerDown={onDone}
            aria-hidden="true"
            className={`absolute inset-0 z-20 h-full w-full bg-slate-950 transition-opacity duration-[400ms] ${fading ? 'opacity-0' : 'opacity-100'}`}
        />
    );
}
