// ════════════════════════════════════════════════════════════════════
// Living Systems — Ambient Organic Spore & Particle Atmosphere
// ════════════════════════════════════════════════════════════════════

(function initLivingCanvas() {
    const canvas = document.getElementById('living-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let mouse = { x: -1000, y: -1000, radius: 140 };
    let isVisible = true;

    // Responsive Spore Count based on screen size
    const sporeCount = Math.min(Math.floor((width * height) / 22000), 55);
    const spores = [];

    class Spore {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * width;
            this.y = initial ? Math.random() * height : height + 15;
            this.size = Math.random() * 2.2 + 0.8;
            this.baseAlpha = Math.random() * 0.45 + 0.15;
            this.alpha = this.baseAlpha;
            this.vx = (Math.random() - 0.5) * 0.45;
            this.vy = -(Math.random() * 0.55 + 0.25); // Gentle upward drift
            this.pulseSpeed = Math.random() * 0.02 + 0.01;
            this.pulseOffset = Math.random() * Math.PI * 2;
            // Warm cyan, electric blue, and gentle emerald tones
            const colors = [
                'rgba(96, 165, 250, ',   // Blue
                'rgba(56, 189, 248, ',   // Cyan
                'rgba(52, 211, 153, ',   // Emerald / Leaf
                'rgba(167, 139, 250, '   // Lavender
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Soft breathing glow
            this.pulseOffset += this.pulseSpeed;
            this.alpha = this.baseAlpha + Math.sin(this.pulseOffset) * 0.15;

            // Mouse proximity interaction (subtle gentle avoidance)
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < mouse.radius) {
                const force = (mouse.radius - dist) / mouse.radius;
                const angle = Math.atan2(dy, dx);
                this.x -= Math.cos(angle) * force * 2.5;
                this.y -= Math.sin(angle) * force * 2.5;
            }

            // Boundary wrapping
            if (this.y < -20 || this.x < -20 || this.x > width + 20) {
                this.reset(false);
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color + Math.max(0, this.alpha) + ')';
            ctx.shadowBlur = this.size * 5;
            ctx.shadowColor = this.color + '0.7)';
            ctx.fill();
            ctx.shadowBlur = 0; // Reset for performance
        }
    }

    // Populate Spores
    for (let i = 0; i < sporeCount; i++) {
        spores.push(new Spore());
    }

    // Handle Window Resize
    function onResize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', onResize);

    // Mouse Tracking
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    // Visibility management
    document.addEventListener('visibilitychange', () => {
        isVisible = !document.hidden;
    });

    // Animation Loop
    function animate() {
        if (isVisible) {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < spores.length; i++) {
                spores[i].update();
                spores[i].draw();
            }
        }
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
})();
