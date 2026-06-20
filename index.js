
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "on-tertiary-fixed-variant": "#234d51",
                    "error-container": "#ffdad6",
                    "secondary-container": "#2A3B42",
                    "on-tertiary-fixed": "#002023",
                    "on-background": "#F5F7F8",
                    "on-primary-fixed": "#001f29",
                    "on-tertiary": "#1E2B30",
                    "tertiary": "#AED9DE",
                    "primary-fixed-dim": "#a7ccdd",
                    "on-secondary-container": "#AED9DE",
                    "on-primary-container": "#F5F7F8",
                    "secondary": "#AED9DE",
                    "surface-bright": "#2A3B42",
                    "inverse-on-surface": "#1E2B30",
                    "surface-container-low": "#243339",
                    "outline-variant": "#3F535B",
                    "surface-container-lowest": "#1E2B30",
                    "on-secondary-fixed-variant": "#AED9DE",
                    "primary-container": "#74A0A4",
                    "tertiary-fixed-dim": "#a3ced3",
                    "on-surface": "#F5F7F8",
                    "primary-fixed": "#c3e8f9",
                    "on-surface-variant": "#AED9DE",
                    "tertiary-fixed": "#bfeaef",
                    "on-error-container": "#93000a",
                    "surface-tint": "#74A0A4",
                    "surface-variant": "#2A3B42",
                    "surface-container": "#2A3B42",
                    "inverse-primary": "#74A0A4",
                    "inverse-surface": "#F5F7F8",
                    "surface-dim": "#1E2B30",
                    "on-error": "#ffffff",
                    "secondary-fixed-dim": "#a1ced3",
                    "error": "#ba1a1a",
                    "on-secondary": "#1E2B30",
                    "surface": "#1E2B30",
                    "on-secondary-fixed": "#002022",
                    "on-primary-fixed-variant": "#274b59",
                    "on-primary": "#1E2B30",
                    "background": "#1E2B30",
                    "secondary-fixed": "#AED9DE",
                    "surface-container-high": "#31454D",
                    "primary": "#74A0A4",
                    "on-tertiary-container": "#AED9DE",
                    "outline": "#72787b",
                    "tertiary-container": "#2f595d"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "spacing": {
                    "margin-mobile": "20px",
                    "base": "8px",
                    "container-max": "1200px",
                    "gutter": "24px",
                    "section-gap": "128px",
                    "margin-desktop": "64px"
            },
            "fontFamily": {
                    "body-md": ["Inter"],
                    "headline-lg": ["Inter"],
                    "label-sm": ["Inter"],
                    "label-md": ["Inter"],
                    "headline-md": ["Inter"],
                    "display-lg-mobile": ["Inter"],
                    "display-lg": ["Inter"],
                    "body-lg": ["Inter"]
            },
            "fontSize": {
                    "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                    "headline-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
                    "label-sm": ["12px", {"lineHeight": "16px", "letterSpacing": "0.02em", "fontWeight": "500"}],
                    "label-md": ["14px", {"lineHeight": "20px", "letterSpacing": "0.05em", "fontWeight": "500"}],
                    "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
                    "display-lg-mobile": ["40px", {"lineHeight": "48px", "letterSpacing": "-0.01em", "fontWeight": "700"}],
                    "display-lg": ["64px", {"lineHeight": "72px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                    "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}]
            }
          },
        },
      }
        const canvas = document.getElementById('shader-canvas');
        const gl = canvas.getContext('webgl');

        if (gl) {
            const vertexSource = `
                attribute vec2 position;
                varying vec2 v_texCoord;
                void main() {
                    v_texCoord = position * 0.5 + 0.5;
                    v_texCoord.y = 1.0 - v_texCoord.y;
                    gl_Position = vec4(position, 0.0, 1.0);
                }
            `;

            const fragmentSource = `
                precision highp float;
                uniform float u_time;
                uniform vec2 u_resolution;
                varying vec2 v_texCoord;

                void main() {
                    vec2 uv = v_texCoord;
                    
                    float wave1 = sin(uv.x * 2.0 + u_time * 0.5) * 0.1;
                    float wave2 = cos(uv.y * 3.0 + u_time * 0.3) * 0.1;
                    float wave3 = sin((uv.x + uv.y) * 1.5 + u_time * 0.4) * 0.05;
                    
                    float totalWave = wave1 + wave2 + wave3;
                    
                    // Dark Coastal Palette
                    vec3 deepOcean = vec3(0.12, 0.17, 0.19); // #1E2B30 base
                    vec3 seafoam = vec3(0.16, 0.23, 0.26);   // Darker shade
                    vec3 mistBlue = vec3(0.45, 0.63, 0.64);  // #74A0A4
                    vec3 accent = vec3(0.68, 0.85, 0.87);    // #AED9DE
                    
                    vec3 color = mix(seafoam, accent, uv.y + totalWave);
                    color = mix(color, mistBlue, pow(uv.y + totalWave, 2.0));
                    color = mix(color, deepOcean, pow(uv.y + totalWave, 4.0) * 0.5);
                    
                    float shimmer = sin(u_time * 0.2 + (uv.x + uv.y) * 10.0) * 0.01;
                    color += shimmer;

                    gl_FragColor = vec4(color, 1.0);
                }
            `;

            function createShader(gl, type, source) {
                const shader = gl.createShader(type);
                gl.shaderSource(shader, source);
                gl.compileShader(shader);
                return shader;
            }

            const program = gl.createProgram();
            gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vertexSource));
            gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fragmentSource));
            gl.linkProgram(program);

            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

            const positionLocation = gl.getAttribLocation(program, "position");
            const timeLocation = gl.getUniformLocation(program, "u_time");
            const resolutionLocation = gl.getUniformLocation(program, "u_resolution");

            function render(time) {
                time *= 0.001;
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                gl.viewport(0, 0, canvas.width, canvas.height);

                gl.useProgram(program);
                gl.enableVertexAttribArray(positionLocation);
                gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
                gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

                gl.uniform1f(timeLocation, time);
                gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
                requestAnimationFrame(render);
            }
            requestAnimationFrame(render);
        }

        /**
         * Particle Background Logic
         */
        const particlesContainer = document.getElementById('particles-container');
        const particleCount = 40;

        function createParticle() {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 8 + 4;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * 5;

            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.opacity = Math.random() * 0.3 + 0.05;
            
            particle.animate([
                { transform: 'translate(0, 0)', opacity: 0.1 },
                { transform: `translate(${(Math.random() - 0.5) * 100}px, ${(Math.random() - 0.5) * 100}px)`, opacity: 0.3 },
                { transform: 'translate(0, 0)', opacity: 0.1 }
            ], {
                duration: duration * 1000,
                iterations: Infinity,
                easing: 'linear',
                delay: delay * 1000
            });

            particlesContainer.appendChild(particle);
        }

        for (let i = 0; i < particleCount; i++) {
            createParticle();
        }

        /**
         * Scroll Reveal Intersection Observer
         */
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px' 
        });

        document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

        /**
         * Animated Counters
         */
        const countUpElements = document.querySelectorAll('.count-up');
        const countUpObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseFloat(entry.target.getAttribute('data-target'));
                    const decimals = parseInt(entry.target.getAttribute('data-decimals') || '0');
                    const duration = 2000;
                    const startTime = performance.now();

                    const updateCount = (currentTime) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const easeOutQuad = 1 - (1 - progress) * (1 - progress);
                        const currentCount = easeOutQuad * target;
                        
                        let suffix = '';
                        if (entry.target.parentElement.innerText.includes('LeetCode')) suffix = '+';
                        else if (entry.target.parentElement.innerText.includes('Semester')) suffix = 'th';

                        entry.target.innerText = currentCount.toFixed(decimals) + suffix;
                        
                        if (progress < 1) {
                            requestAnimationFrame(updateCount);
                        } else {
                            entry.target.innerText = target.toFixed(decimals) + suffix;
                        }
                    };
                    requestAnimationFrame(updateCount);
                    countUpObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        countUpElements.forEach(el => countUpObserver.observe(el));

        /**
         * Navigation Bar Effect
         */
        window.addEventListener('scroll', () => {
            const nav = document.getElementById('main-nav');
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });

        /**
         * Smooth Scroll for Nav Links
         */
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; 
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        /**
         * Theme Toggle Logic
         */
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            themeToggle.innerText = isDark ? 'light_mode' : 'dark_mode';
            themeToggle.setAttribute('data-icon', isDark ? 'light_mode' : 'dark_mode');
        });