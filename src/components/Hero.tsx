import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../hooks/useTheme';
import { TECH_ICONS } from '../data/portfolio';

interface RingConfig {
    a: number; // semi-major axis (strictly layered to prevent overlap)
    b: number; // semi-minor axis
    rotX: number; // 3D inclination
    rotY: number;
    rotZ: number;
    precession: number; // subtle slow rotation of orbital plane
    speed: number; // orbital angular velocity (rad/s)
    phaseOffset: number; // initial angular offset for visual balance
    techIndexes: number[];
}

// 3 non-overlapping concentric orbital shells (Quantum levels n=1, 2, 3):
// Shell 1: r in [0.82, 0.98] (clearance >= 0.60 from nucleus)
// Shell 2: r in [1.28, 1.48] (clearance >= 0.30 from Shell 1)
// Shell 3: r in [1.76, 1.98] (clearance >= 0.28 from Shell 2)
const RING_CONFIGS: RingConfig[] = [
    {
        a: 0.98,
        b: 0.82,
        rotX: THREE.MathUtils.degToRad(66),
        rotY: THREE.MathUtils.degToRad(18),
        rotZ: THREE.MathUtils.degToRad(20),
        precession: 0.02,
        speed: 0.35,
        phaseOffset: 0,
        techIndexes: [0, 1, 2, 3], // JavaScript, TypeScript, React, Node.js
    },
    {
        a: 1.48,
        b: 1.28,
        rotX: THREE.MathUtils.degToRad(-54),
        rotY: THREE.MathUtils.degToRad(-30),
        rotZ: THREE.MathUtils.degToRad(-45),
        precession: -0.018,
        speed: -0.26,
        phaseOffset: Math.PI / 4,
        techIndexes: [4, 5, 6, 7], // Express, PostgreSQL, MySQL, Redis
    },
    {
        a: 1.98,
        b: 1.76,
        rotX: THREE.MathUtils.degToRad(38),
        rotY: THREE.MathUtils.degToRad(48),
        rotZ: THREE.MathUtils.degToRad(68),
        precession: 0.014,
        speed: 0.20,
        phaseOffset: Math.PI / 6,
        techIndexes: [8, 9, 10, 11], // Python, Java, C++, TailwindCSS
    },
];

const NUCLEUS_RADIUS = 0.22;

/** Draws a circular badge (background + border) onto a canvas, used as the
 * base sprite texture. The tech icon is layered on top once it loads. */
function drawBadgeBase(ctx: CanvasRenderingContext2D, size: number, bgColor: string, borderColor: string) {
    ctx.clearRect(0, 0, size, size);

    // Subtle drop shadow around badge
    ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;

    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 6, 0, Math.PI * 2);
    ctx.fillStyle = bgColor;
    ctx.fill();

    // Reset shadow for crisp border
    ctx.shadowColor = 'transparent';
    ctx.lineWidth = 3;
    ctx.strokeStyle = borderColor;
    ctx.stroke();
}

function createBadgeTexture(iconUrl: string, bgColor: string, borderColor: string): THREE.CanvasTexture {
    const size = 160;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const texture = new THREE.CanvasTexture(canvas);
    if (!ctx) return texture;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    drawBadgeBase(ctx, size, bgColor, borderColor);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
        drawBadgeBase(ctx, size, bgColor, borderColor);
        const iconSize = size * 0.54;
        ctx.drawImage(img, (size - iconSize) / 2, (size - iconSize) / 2, iconSize, iconSize);
        texture.needsUpdate = true;
    };
    img.src = iconUrl;

    return texture;
}

/** Radial-gradient glow sprite sitting behind the nucleus. */
function createGlowTexture(color: string): THREE.CanvasTexture {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        gradient.addColorStop(0, color);
        gradient.addColorStop(0.5, color.replace(/[\d.]+\)$/, '0.12)'));
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}

export default function Hero() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const container = canvas.parentElement;
        const getSize = () => ({
            width: container?.clientWidth ?? window.innerWidth,
            height: container?.clientHeight ?? window.innerHeight,
        });
        const { width, height } = getSize();

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const isDark = theme === 'dark';
        const accentColor = isDark ? '#5b93ff' : '#1d4ed8';
        const badgeBg = isDark ? '#0e1629' : '#ffffff';
        const glowColor = isDark ? 'rgba(91,147,255,0.45)' : 'rgba(29,78,216,0.30)';

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
        const cameraDistance = 11;
        camera.position.z = cameraDistance;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const disposables: Array<{ dispose: () => void }> = [];

        /** ================== Stars Background */
        const starsCount = 1400;
        const positions = new Float32Array(starsCount * 3);

        for (let i = 0; i < starsCount; i++) {
            let x, y, z;
            do {
                x = THREE.MathUtils.randFloatSpread(150);
                y = THREE.MathUtils.randFloatSpread(150);
                z = THREE.MathUtils.randFloatSpread(150);
            } while (Math.sqrt(x * x + y * y + z * z) < 15);

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
        }

        const starsGeometry = new THREE.BufferGeometry();
        starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const starColor = isDark ? 0xffffff : 0xb5c6e8;
        const starsMaterial = new THREE.PointsMaterial({
            color: starColor,
            size: 0.12 + 0.08 * Math.random(),
            transparent: true,
            opacity: isDark ? 0.7 : 0.8,
            sizeAttenuation: true,
        });

        const stars = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(stars);
        disposables.push(starsGeometry, starsMaterial);

        // ==========================================
        // Atom System Group
        // ==========================================
        const atomGroup = new THREE.Group();
        scene.add(atomGroup);

        // ==========================================
        // Nucleus (Hạt nhân) + Core + Ambient Glow
        // ==========================================
        const nucleusGroup = new THREE.Group();
        atomGroup.add(nucleusGroup);

        // Ambient radial glow behind the nucleus
        const glowTexture = createGlowTexture(glowColor);
        const glowMaterial = new THREE.SpriteMaterial({
            map: glowTexture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        const glow = new THREE.Sprite(glowMaterial);
        glow.scale.setScalar(NUCLEUS_RADIUS * 4.6);
        nucleusGroup.add(glow);
        disposables.push(glowTexture, glowMaterial);

        // Outer faceted crystal cage (wireframe)
        const nucleusCageGeometry = new THREE.IcosahedronGeometry(NUCLEUS_RADIUS, 1);
        const nucleusCageMaterial = new THREE.MeshBasicMaterial({
            color: accentColor,
            wireframe: true,
            transparent: true,
            opacity: 0.85,
        });
        const nucleusCage = new THREE.Mesh(nucleusCageGeometry, nucleusCageMaterial);
        nucleusGroup.add(nucleusCage);
        disposables.push(nucleusCageGeometry, nucleusCageMaterial);

        // Translucent inner faceted crystal shell
        const nucleusShellMaterial = new THREE.MeshBasicMaterial({
            color: accentColor,
            transparent: true,
            opacity: 0.16,
            depthWrite: false,
        });
        const nucleusShell = new THREE.Mesh(nucleusCageGeometry, nucleusShellMaterial);
        nucleusGroup.add(nucleusShell);
        disposables.push(nucleusShellMaterial);

        // Central solid energy core
        const nucleusCoreGeometry = new THREE.SphereGeometry(NUCLEUS_RADIUS * 0.52, 32, 32);
        const nucleusCoreMaterial = new THREE.MeshBasicMaterial({ color: accentColor });
        const nucleusCore = new THREE.Mesh(nucleusCoreGeometry, nucleusCoreMaterial);
        nucleusGroup.add(nucleusCore);
        disposables.push(nucleusCoreGeometry, nucleusCoreMaterial);

        // ==========================================
        // Concentric Rings & Orbiting Tech Badges
        // ==========================================
        const ringPivots: Array<{ pivot: THREE.Group; precession: number }> = [];
        const spriteData: Array<{
            sprite: THREE.Sprite;
            a: number;
            b: number;
            angle: number;
            speed: number;
        }> = [];

        RING_CONFIGS.forEach((ring) => {
            const pivot = new THREE.Group();
            pivot.rotation.x = ring.rotX;
            pivot.rotation.y = ring.rotY;
            pivot.rotation.z = ring.rotZ;
            pivot.rotation.order = 'ZYX';
            atomGroup.add(pivot);
            ringPivots.push({ pivot, precession: ring.precession });

            // Smooth orbit path line
            const curvePoints = new THREE.EllipseCurve(0, 0, ring.a, ring.b, 0, Math.PI * 2, false, 0)
                .getPoints(96)
                .map((p) => new THREE.Vector3(p.x, p.y, 0));
            const ringGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
            const ringMaterial = new THREE.LineDashedMaterial({
                color: accentColor,
                transparent: true,
                opacity: isDark ? 0.32 : 0.24,
                dashSize: 0.06,
                gapSize: 0.04,
            });
            const ringLine = new THREE.LineLoop(ringGeometry, ringMaterial);
            ringLine.computeLineDistances();
            pivot.add(ringLine);
            disposables.push(ringGeometry, ringMaterial);

            // Orbiting badges along this shell
            const count = ring.techIndexes.length;
            ring.techIndexes.forEach((techIndex, i) => {
                const tech = TECH_ICONS[techIndex];
                const texture = createBadgeTexture(tech.url, badgeBg, accentColor);
                const material = new THREE.SpriteMaterial({
                    map: texture,
                    transparent: true,
                    depthWrite: false,
                    depthTest: true,
                });
                const sprite = new THREE.Sprite(material);
                sprite.scale.setScalar(0.205);

                // Equidistant angles along the ring to ensure they NEVER overlap
                const initialAngle = ring.phaseOffset + (i / count) * Math.PI * 2;
                sprite.position.set(ring.a * Math.cos(initialAngle), ring.b * Math.sin(initialAngle), 0);
                pivot.add(sprite);
                disposables.push(texture, material);

                spriteData.push({
                    sprite,
                    a: ring.a,
                    b: ring.b,
                    angle: initialAngle,
                    speed: ring.speed,
                });
            });
        });

        // ==========================================
        // Responsive Scaling & Positioning
        // ==========================================
        const applyResponsiveScale = () => {
            const { width: w, height: h } = getSize();
            const aspect = w / h;
            camera.aspect = aspect;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);

            const vFov = (camera.fov * Math.PI) / 180;
            const visibleHeight = 2 * Math.tan(vFov / 2) * cameraDistance;
            const visibleWidth = visibleHeight * aspect;
            const limiting = Math.min(visibleHeight, visibleWidth);

            const isDesktop = w > 900;
            // Accommodate outer shell radius (1.98) comfortably
            const scale = limiting * (isDesktop ? 0.235 : 0.18);
            atomGroup.scale.setScalar(scale);

            atomGroup.position.x = isDesktop
                ? Math.min(visibleWidth, visibleHeight) * 0.44
                : 0;

            atomGroup.position.y = isDesktop ? -0.1 : visibleHeight * 0.1;
        };
        applyResponsiveScale();

        // ==========================================
        // Smooth Mouse Parallax
        // ==========================================
        const targetMouse = { x: 0, y: 0 };
        const currentMouse = { x: 0, y: 0 };

        const handleMouseMove = (event: MouseEvent) => {
            targetMouse.x = (event.clientX / window.innerWidth - 0.5) * 2;
            targetMouse.y = (event.clientY / window.innerHeight - 0.5) * 2;
        };
        if (!prefersReducedMotion) {
            window.addEventListener('mousemove', handleMouseMove, { passive: true });
        }

        // ==========================================
        // Animation Loop
        // ==========================================
        const timer = new THREE.Timer();
        let frameId: number;
        let elapsedTime = 0;
        const worldPos = new THREE.Vector3();

        const animate = (timestamp: number) => {
            timer.update(timestamp);
            const delta = Math.min(timer.getDelta(), 0.1);
            elapsedTime += delta;

            if (!prefersReducedMotion) {
                // Background starfield gentle drift
                stars.rotation.y += 0.015 * delta;
                stars.rotation.z -= 0.005 * delta;

                // Mouse smoothing (lerp)
                currentMouse.x += (targetMouse.x - currentMouse.x) * 0.05;
                currentMouse.y += (targetMouse.y - currentMouse.y) * 0.05;

                // Atom group smooth base spin + mouse parallax
                atomGroup.rotation.y += 0.07 * delta;
                atomGroup.rotation.x = currentMouse.y * 0.16;
                atomGroup.rotation.z = -currentMouse.x * 0.08;

                // Nucleus energy breathing & core pulse
                const pulse = 1 + 0.07 * Math.sin(elapsedTime * 2.5);
                nucleusCore.scale.setScalar(pulse);
                glow.scale.setScalar(NUCLEUS_RADIUS * (4.2 + 0.6 * Math.sin(elapsedTime * 2.5)));

                // Multi-axis rotation of outer crystalline cage
                nucleusCage.rotation.y += 0.22 * delta;
                nucleusCage.rotation.x += 0.14 * delta;
                nucleusCage.rotation.z += 0.08 * delta;
                nucleusShell.rotation.copy(nucleusCage.rotation);

                // Counter-rotation of inner energy core
                nucleusCore.rotation.y -= 0.18 * delta;
                nucleusCore.rotation.z += 0.12 * delta;

                // Subtle orbital plane precession
                ringPivots.forEach((rp) => {
                    rp.pivot.rotation.z += rp.precession * delta;
                });

                // Update orbiting badges along non-overlapping tracks
                spriteData.forEach((item) => {
                    item.angle += item.speed * delta;
                    item.sprite.position.set(
                        item.a * Math.cos(item.angle),
                        item.b * Math.sin(item.angle),
                        0
                    );

                    // Dynamic 3D depth sorting
                    item.sprite.getWorldPosition(worldPos);
                    item.sprite.renderOrder = Math.round((worldPos.z + 10) * 100);
                    const depthFactor = (worldPos.z + 2.5) / 5;
                    item.sprite.material.opacity = THREE.MathUtils.lerp(0.82, 1, Math.max(0, Math.min(1, depthFactor)));
                });

                frameId = requestAnimationFrame(animate);
            }

            renderer.render(scene, camera);
        };
        animate(0);

        const handleResize = () => applyResponsiveScale();
        window.addEventListener('resize', handleResize);

        return () => {
            if (frameId) cancelAnimationFrame(frameId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            disposables.forEach((item) => item.dispose());
            renderer.dispose();
        };
    }, [theme]);

    return (
        <section id="hero" className="hero">
            <canvas ref={canvasRef} className="hero__canvas" aria-hidden="true" />

            <div className="hero__content">
                <p className="hero__prompt">
                    nghia@backend:~$ <span className="hero__cursor">▍</span>
                </p>
                <h1 className="hero__name">Trọng Nghĩa</h1>
                <p className="hero__role">
                    Final-year Computer Science student at HCMUT (BKU) — building full-stack applications and scalable backend systems.
                </p>
                <p className="hero__location">Ho Chi Minh City, Vietnam</p>

                <div className="hero__actions">
                    <a href="#projects" className="btn btn--primary">
                        View Projects
                    </a>
                    <a href="#contact" className="btn btn--outline">
                        Get in Touch
                    </a>
                </div>
            </div>
        </section>
    );
}