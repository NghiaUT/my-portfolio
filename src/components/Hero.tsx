import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../hooks/useTheme';
import { TECH_ICONS } from '../data/portfolio';

interface RingConfig {
    a: number; // semi-major axis (local units)
    b: number; // semi-minor axis (local units)
    rotZ: number; // in-plane rotation, staggers the ellipses atom-style
    tiltX: number; // slight tilt for 3D depth as the atom turns
    speed: number; // radians/sec, sign controls direction
    techIndexes: number[];
}

const RING_CONFIGS: RingConfig[] = [
    { a: 1.0, b: 0.38, rotZ: 0, tiltX: THREE.MathUtils.degToRad(14), speed: 0.32, techIndexes: [0, 1, 2, 3] },
    { a: 1.2, b: 0.45, rotZ: THREE.MathUtils.degToRad(60), tiltX: THREE.MathUtils.degToRad(14), speed: -0.26, techIndexes: [4, 5, 6, 7] },
    { a: 1.4, b: 0.52, rotZ: THREE.MathUtils.degToRad(-60), tiltX: THREE.MathUtils.degToRad(14), speed: 0.2, techIndexes: [8, 9, 10, 11] },
];

const NUCLEUS_RADIUS = 0.22;

/** Draws a circular badge (background + border) onto a canvas, used as the
 * base sprite texture. The tech icon is layered on top once it loads. */
function drawBadgeBase(ctx: CanvasRenderingContext2D, size: number, bgColor: string, borderColor: string) {
    ctx.clearRect(0, 0, size, size);
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 4, 0, Math.PI * 2);
    ctx.fillStyle = bgColor;
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = borderColor;
    ctx.stroke();
}

function createBadgeTexture(iconUrl: string, bgColor: string, borderColor: string): THREE.CanvasTexture {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const texture = new THREE.CanvasTexture(canvas);
    if (!ctx) return texture;

    drawBadgeBase(ctx, size, bgColor, borderColor);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
        drawBadgeBase(ctx, size, bgColor, borderColor);
        const iconSize = size * 0.56;
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
        const badgeBg = isDark ? '#111a2e' : '#ffffff';
        const glowColor = isDark ? 'rgba(61,122,245,0.35)' : 'rgba(29,78,216,0.25)';

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
        const cameraDistance = 11;
        camera.position.z = cameraDistance;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // The whole atom is built at unit scale, then scaled to fill the
        // viewport based on the camera's visible frustum at its depth — this
        // is what keeps it "big and encompassing" across any screen size.
        const atomGroup = new THREE.Group();
        scene.add(atomGroup);

        const disposables: Array<{ dispose: () => void }> = [];

        // Nucleus + glow
        const glowTexture = createGlowTexture(glowColor);
        const glowMaterial = new THREE.SpriteMaterial({
            map: glowTexture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        const glow = new THREE.Sprite(glowMaterial);
        glow.scale.setScalar(NUCLEUS_RADIUS * 5);
        atomGroup.add(glow);
        disposables.push(glowTexture, glowMaterial);

        const nucleusGeometry = new THREE.IcosahedronGeometry(NUCLEUS_RADIUS, 1);
        const nucleusMaterial = new THREE.MeshBasicMaterial({
            color: accentColor,
            wireframe: true,
            transparent: true,
            opacity: 0.9,
        });
        const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
        atomGroup.add(nucleus);
        disposables.push(nucleusGeometry, nucleusMaterial);

        const nucleusCoreGeometry = new THREE.SphereGeometry(NUCLEUS_RADIUS * 0.55, 24, 24);
        const nucleusCoreMaterial = new THREE.MeshBasicMaterial({ color: accentColor });
        const nucleusCore = new THREE.Mesh(nucleusCoreGeometry, nucleusCoreMaterial);
        atomGroup.add(nucleusCore);
        disposables.push(nucleusCoreGeometry, nucleusCoreMaterial);

        // Rings + orbiting tech badges
        const ringPivots: THREE.Group[] = [];
        const spriteData: Array<{ sprite: THREE.Sprite; a: number; b: number; angle: number; speed: number }> = [];

        RING_CONFIGS.forEach((ring) => {
            const pivot = new THREE.Group();
            pivot.rotation.z = ring.rotZ;
            pivot.rotation.x = ring.tiltX;
            atomGroup.add(pivot);
            ringPivots.push(pivot);

            const curvePoints = new THREE.EllipseCurve(0, 0, ring.a, ring.b, 0, Math.PI * 2, false, 0)
                .getPoints(64)
                .map((p) => new THREE.Vector3(p.x, p.y, 0));
            const ringGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
            const ringMaterial = new THREE.LineBasicMaterial({
                color: accentColor,
                transparent: true,
                opacity: 0.3,
            });
            const ringLine = new THREE.LineLoop(ringGeometry, ringMaterial);
            pivot.add(ringLine);
            disposables.push(ringGeometry, ringMaterial);

            const count = ring.techIndexes.length;
            ring.techIndexes.forEach((techIndex, i) => {
                const tech = TECH_ICONS[techIndex];
                const texture = createBadgeTexture(tech.url, badgeBg, accentColor);
                const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
                const sprite = new THREE.Sprite(material);
                sprite.scale.setScalar(0.22 + Math.random() * 0.03);
                const initialAngle = (i / count) * Math.PI * 2;
                sprite.position.set(ring.a * Math.cos(initialAngle), ring.b * Math.sin(initialAngle), 0.01);
                sprite.position.z =
                    (Math.random() - 0.5) * 0.06;
                pivot.add(sprite);
                disposables.push(texture, material);

                spriteData.push({ sprite, a: ring.a, b: ring.b, angle: initialAngle, speed: ring.speed });
            });
        });

        // Scale + position the whole atom to fill the hero viewport
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

            const scale = limiting * 0.32;      // nhỏ hơn khoảng 25%

            atomGroup.scale.setScalar(scale);

            atomGroup.position.x =
                Math.min(visibleWidth, visibleHeight) *
                (aspect > 1 ? 0.42 : 0.08);      // đẩy sang phải nhiều hơn

            atomGroup.position.y = -0.1;         // hạ xuống nhẹ nếu cần
        };
        applyResponsiveScale();

        const mouse = { x: 0, y: 0 };
        const handleMouseMove = (event: MouseEvent) => {
            mouse.x = (event.clientX / window.innerWidth - 0.5) * 2;
            mouse.y = (event.clientY / window.innerHeight - 0.5) * 2;
        };
        if (!prefersReducedMotion) {
            window.addEventListener('mousemove', handleMouseMove);
        }

        const clock = new THREE.Clock();
        let frameId: number;

        const animate = () => {
            const delta = clock.getDelta();

            if (!prefersReducedMotion) {
                atomGroup.rotation.y += 0.09 * delta;
                atomGroup.rotation.x += (mouse.y * 0.1 - atomGroup.rotation.x) * 0.02;

                nucleus.rotation.y += 0.15 * delta;
                nucleus.rotation.x += 0.1 * delta;

                spriteData.forEach((item) => {
                    item.angle += item.speed * delta;
                    item.sprite.position.set(
                        item.a * Math.cos(item.angle),
                        item.b * Math.sin(item.angle),
                        0.01
                    );
                });

                frameId = requestAnimationFrame(animate);
            }

            renderer.render(scene, camera);
        };
        animate();

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
                    Final-year Computer Science student at HCMUT (BKU) — building backend
                    systems and the APIs that hold them together.
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