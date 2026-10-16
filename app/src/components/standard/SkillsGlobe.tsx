import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type RefObject } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';

export interface Skill {
    icon: string;
    label: string;
}

export interface SkillsGlobeProps {
    skills: Skill[];
    dark: boolean;
    radius?: number;
    className?: string;
    style?: CSSProperties;
}

const ICON_PX = 64;
const ICON_WORLD = 0.5;

const worldPoint = new THREE.Vector3();
const direction = new THREE.Vector3();
const cameraDirection = new THREE.Vector3();
const ndc = new THREE.Vector3();
const viewPoint = new THREE.Vector3();

function fibonacciSphere(count: number, radius: number) {
    const golden = Math.PI * (3 - Math.sqrt(5));

    return Array.from({ length: count }, (_, i) => {
        const y = 1 - (2 * (i + 0.5)) / count;
        const r = Math.sqrt(1 - y * y);
        const theta = golden * i;
        return new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(radius);
    });
}

interface GlobeProps {
    count: number;
    radius: number;
    accent: string;
    items: RefObject<(HTMLDivElement | null)[]>;
    dark: boolean;
}

function Globe({ count, radius, accent, items, dark }: GlobeProps) {
    const group = useRef<THREE.Group>(null);
    const points = useMemo(() => fibonacciSphere(count, radius), [count, radius]);
    const shell = radius * 0.85;

    const look = dark
        ? { line: accent, front: 0.08, back: 0.02, core: '#000000', coreOpacity: 0.2, haloOpacity: 0.05, halo: THREE.AdditiveBlending }
        : { line: '#1d4ed8', front: 0.45, back: 0.12, core: accent, coreOpacity: 0.05, haloOpacity: 0.12, halo: THREE.NormalBlending };

    useFrame((state, delta) => {
        const globe = group.current;
        if (!globe) return;

        const camera = state.camera as THREE.PerspectiveCamera;
        const { width, height } = state.size;

        globe.rotation.y += delta * 0.06;
        globe.updateWorldMatrix(true, false);
        camera.updateMatrixWorld();
        cameraDirection.copy(camera.position).normalize();
        const tanHalfFov = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);

        points.forEach((point, i) => {
            const element = items.current[i];
            if (!element) return;

            worldPoint.copy(point).applyMatrix4(globe.matrixWorld);

            const facing = THREE.MathUtils.clamp((direction.copy(worldPoint).normalize().dot(cameraDirection) - 0.1) * 2, 0, 1);

            ndc.copy(worldPoint).project(camera);
            const x = (ndc.x + 1) * 0.5 * width;
            const y = (1 - ndc.y) * 0.5 * height;
            const depth = -viewPoint.copy(worldPoint).applyMatrix4(camera.matrixWorldInverse).z;
            const pxPerUnit = height / (2 * tanHalfFov * depth);
            const scale = ((ICON_WORLD * pxPerUnit) / ICON_PX) * (0.8 + 0.4 * facing);

            element.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${scale})`;
            element.style.opacity = String(facing);
            element.style.zIndex = String(Math.round(facing * 100));
            element.style.pointerEvents = facing > 0.8 ? 'auto' : 'none';
        });
    });

    return (
        <group ref={group}>
            <mesh>
                <icosahedronGeometry args={[shell, 2]} />
                <meshBasicMaterial color={look.line} wireframe transparent opacity={look.front} />
            </mesh>
            <mesh>
                <icosahedronGeometry args={[shell, 2]} />
                <meshBasicMaterial color={look.line} wireframe transparent opacity={look.back} side={THREE.BackSide} />
            </mesh>
            <mesh>
                <sphereGeometry args={[shell * 0.98, 32, 32]} />
                <meshBasicMaterial color={look.core} transparent opacity={look.coreOpacity} side={THREE.DoubleSide} />
            </mesh>
            <mesh>
                <sphereGeometry args={[shell * 1.035, 32, 32]} />
                <meshBasicMaterial color={accent} transparent opacity={look.haloOpacity} blending={look.halo} side={THREE.BackSide} />
            </mesh>
        </group>
    );
}

function FitCamera({ radius }: { radius: number }) {
    const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
    const aspect = useThree((state) => state.size.width / state.size.height);

    useLayoutEffect(() => {
        const vFov = THREE.MathUtils.degToRad(camera.fov);
        const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
        camera.position.setLength(radius / Math.sin(Math.min(vFov, hFov) / 2));
    }, [camera, aspect, radius]);

    return null;
}

const CSS = `
.skills-globe{position:relative;width:100%;overflow:hidden;cursor:grab}
.skills-globe:active{cursor:grabbing}
.skills-globe__layer{position:absolute;inset:0;pointer-events:none}
.skills-globe__item{position:absolute;left:0;top:0;opacity:0;display:flex;flex-direction:column;align-items:center;gap:8px;padding:6px;user-select:none;cursor:pointer}
.skills-globe__item i{font-size:${ICON_PX}px;line-height:1;transition:transform .3s,filter .3s}
.skills-globe__item span{font:700 12px/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;white-space:nowrap;color:var(--body);opacity:.9;transition:color .3s,opacity .3s}
.skills-globe__item:hover i{transform:scale(1.12);filter:drop-shadow(0 0 14px var(--brand))}
.skills-globe__item:hover span{color:var(--brand);opacity:1}
`;

export default function SkillsGlobe({ skills, dark, radius = 3.3, className = '', style }: SkillsGlobeProps) {
    const container = useRef<HTMLDivElement>(null!);
    const items = useRef<(HTMLDivElement | null)[]>([]);
    const [visible, setVisible] = useState(false);

    const accent = dark ? '#3b82f6' : '#2563eb';
    const fog = dark ? '#0f172a' : '#f1f5f9';

    useEffect(() => {
        const element = container.current;
        if (!element) return;

        const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0 });
        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={container} className={`skills-globe ${className}`} style={style}>
            <style>{CSS}</style>

            <Canvas frameloop={visible ? 'always' : 'never'} eventSource={container} camera={{ position: [0, 0, 9], fov: 50 }} dpr={[1, 1.5]}>
                <fog attach="fog" args={[fog, 10, 25]} />
                <FitCamera radius={radius * 1.2} />
                <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
                    <Globe count={skills.length} radius={radius} accent={accent} items={items} dark={dark} />
                </Float>
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={0.8}
                    minPolarAngle={Math.PI / 3}
                    maxPolarAngle={Math.PI / 1.5}
                />
            </Canvas>

            <div className="skills-globe__layer">
                {skills.map((skill, i) => (
                    <div
                        key={skill.label}
                        ref={(element) => {
                            items.current[i] = element;
                        }}
                        className="skills-globe__item"
                    >
                        <i className={`${skill.icon} colored`} />
                        <span>{skill.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
