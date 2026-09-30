// ════════════════════════════════════════════════════════════════════
// Living Atmosphere — Gentle Ambient Floating Particles Canvas
// ════════════════════════════════════════════════════════════════════

(function initLivingCanvas() {
    const canvas = document.getElementById('living-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let mouse = { x: -1000, y: -1000, radius: 120 };
    let isVisible = true;

    // Gentle particle density
    const particleCount = Math.min(Math.floor((width * height) / 24000), 45);
    const particles = [];

    class Particle {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * width;
            this.y = initial ? Math.random() * height : height + 15;
            this.size = Math.random() * 2 + 0.8;
            this.baseAlpha = Math.random() * 0.4 + 0.15;
            this.alpha = this.baseAlpha;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = -(Math.random() * 0.5 + 0.2); // Gentle upward drift
            this.pulseSpeed = Math.random() * 0.02 + 0.01;
            this.pulseOffset = Math.random() * Math.PI * 2;
            
            // Soft luminescence: cyan, blue, emerald tones
            const colors = [
                'rgba(96, 165, 250, ',   // Blue
                'rgba(56, 189, 248, ',   // Cyan
                'rgba(52, 211, 153, '    // Emerald
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Breathing alpha glow
            this.pulseOffset += this.pulseSpeed;
            this.alpha = this.baseAlpha + Math.sin(this.pulseOffset) * 0.12;

            // Subtle mouse interaction
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < mouse.radius) {
                const force = (mouse.radius - dist) / mouse.radius;
                const angle = Math.atan2(dy, dx);
                this.x -= Math.cos(angle) * force * 2;
                this.y -= Math.sin(angle) * force * 2;
            }

            // Wrap around edges
            if (this.y < -20 || this.x < -20 || this.x > width + 20) {
                this.reset(false);
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color + Math.max(0, this.alpha) + ')';
            ctx.shadowBlur = this.size * 4;
            ctx.shadowColor = this.color + '0.6)';
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function onResize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', onResize);

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    document.addEventListener('visibilitychange', () => {
        isVisible = !document.hidden;
    });

    function animate() {
        if (isVisible) {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
        }
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
})();
