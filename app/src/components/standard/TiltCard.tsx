import { useRef, useState, type PointerEvent, type ReactNode } from 'react';

export interface TiltCardProps {
    tiltLimit?: number;
    scale?: number;
    perspective?: number;
    className?: string;
    children?: ReactNode;
}

export function TiltCard({ tiltLimit = 10, scale = 1.03, perspective = 1200, className = '', children }: TiltCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const rest = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    const [transform, setTransform] = useState(rest);
    const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });
    const [isHovered, setIsHovered] = useState(false);

    function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
        const card = cardRef.current;
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        const xRot = (py - 0.5) * tiltLimit * 2 * -1;
        const yRot = (px - 0.5) * tiltLimit * 2;

        setTransform(`perspective(${perspective}px) rotateX(${xRot}deg) rotateY(${yRot}deg) scale3d(${scale}, ${scale}, ${scale})`);
        setSpotlight({ x: px * 100, y: py * 100 });
    }

    function handlePointerLeave() {
        setTransform(rest);
        setIsHovered(false);
    }

    return (
        <div
            ref={cardRef}
            onPointerEnter={() => setIsHovered(true)}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            className={`relative overflow-hidden will-change-transform ${className}`}
            style={{ transform, transition: 'transform 0.2s ease-out', transformStyle: 'preserve-3d' }}
        >
            {children}

            <div
                className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
                style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s' }}
            >
                <div
                    className="absolute h-[200%] w-[200%] rounded-full opacity-50"
                    style={{
                        left: `${spotlight.x}%`,
                        top: `${spotlight.y}%`,
                        transform: 'translate(-50%, -50%)',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 40%)',
                    }}
                />
            </div>
        </div>
    );
}
