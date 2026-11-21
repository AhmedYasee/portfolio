/* Portfolio interactions: particle constellation + typing effect. */
(function () {
    'use strict';

    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- particle constellation ---------- */
    var canvas = document.getElementById('particles');
    if (canvas && canvas.parentElement) {
        var ctx = canvas.getContext('2d');
        var host = canvas.parentElement;
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var w = 0, h = 0, pts = [], raf = 0;

        function seed() {
            var n = Math.round(Math.min(80, Math.max(30, (w * h) / 16000)));
            pts = [];
            for (var i = 0; i < n; i++) {
                pts.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.32,
                    vy: (Math.random() - 0.5) * 0.32,
                    r: Math.random() * 1.5 + 0.6
                });
            }
        }

        function resize() {
            var rect = host.getBoundingClientRect();
            w = rect.width;
            h = rect.height;
            canvas.width = Math.max(1, Math.round(w * dpr));
            canvas.height = Math.max(1, Math.round(h * dpr));
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            if (pts.length === 0) seed();
        }

        function draw() {
            ctx.clearRect(0, 0, w, h);
            for (var i = 0; i < pts.length; i++) {
                for (var j = i + 1; j < pts.length; j++) {
                    var a = pts[i], b = pts[j];
                    var dx = a.x - b.x, dy = a.y - b.y;
                    var d = Math.sqrt(dx * dx + dy * dy);
                    if (d < 110) {
                        ctx.strokeStyle = 'rgba(94, 234, 212, ' + ((1 - d / 110) * 0.16).toFixed(3) + ')';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
            }
            for (var k = 0; k < pts.length; k++) {
                var p = pts[k];
                ctx.fillStyle = 'rgba(165, 243, 252, 0.75)';
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function step() {
            for (var i = 0; i < pts.length; i++) {
                var p = pts[i];
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;
            }
            draw();
            raf = requestAnimationFrame(step);
        }

        resize();
        draw();
        window.addEventListener('resize', function () { resize(); draw(); });
        if (!reduced) raf = requestAnimationFrame(step);
        document.addEventListener('visibilitychange', function () {
            if (reduced) return;
            if (document.hidden) {
                cancelAnimationFrame(raf);
            } else {
                raf = requestAnimationFrame(step);
            }
        });
    }

    /* ---------- typing effect ---------- */
    var typed = document.getElementById('typed');
    if (typed && !reduced) {
        var phrases = [
            'I build .NET backends and APIs.',
            'I engineer SCADA configuration tooling.',
            'I ship Windows desktop apps in WPF.',
            'I turn requirements into working software.'
        ];
        var phrase = 0;
        var chars = phrases[0].length;
        var deleting = true;

        function tick() {
            if (deleting) {
                chars = Math.max(0, chars - 2);
                if (chars === 0) {
                    deleting = false;
                    phrase = (phrase + 1) % phrases.length;
                }
            } else {
                chars = Math.min(phrases[phrase].length, chars + 1);
            }
            typed.textContent = phrases[phrase].slice(0, chars);
            var delay = deleting ? 28 : 52;
            if (!deleting && chars === phrases[phrase].length) {
                deleting = true;
                delay = 2400;
            }
            setTimeout(tick, delay);
        }

        setTimeout(tick, 2600);
    }
})();

/* Project gallery lightbox */
(function () {
    var lb = document.getElementById('lightbox');
    if (!lb) return;
    var img = document.getElementById('lightbox-img');
    var cap = document.getElementById('lightbox-cap');
    var closeBtn = document.getElementById('lightbox-close');
    document.querySelectorAll('[data-gallery] .shot').forEach(function (shot) {
        shot.addEventListener('click', function () {
            var cls = Array.from(shot.classList).find(function (c) { return c.indexOf('shot-') === 0 && c !== 'shot'; });
            img.className = 'lightbox-img ' + cls;
            cap.textContent = shot.getAttribute('data-cap') || '';
            lb.hidden = false;
            document.body.style.overflow = 'hidden';
        });
    });
    function close() { lb.hidden = true; document.body.style.overflow = ''; }
    closeBtn.addEventListener('click', close);
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !lb.hidden) close(); });
})();
