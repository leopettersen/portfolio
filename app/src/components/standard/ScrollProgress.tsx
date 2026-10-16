import { motion, useScroll } from 'motion/react';

export function ScrollProgress() {
    const { scrollYProgress } = useScroll();

    return (
        <motion.div
            className="fixed inset-x-0 top-0 z-[60] h-[1.5px] origin-left bg-brand"
            style={{ scaleX: scrollYProgress }}
        />
    );
}
