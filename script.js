document.addEventListener('DOMContentLoaded', () => {

    // =================================================================
    // SUPABASE CONFIGURATION — Migrated from Local Node.js
    // =================================================================
    // Handled by supabaseClient-config.js
    const API = ''; // Resetting local API prefix



    // =================================================================
    // 1. Navbar: Scroll glassmorphism + hamburger + active link
    // =================================================================
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navbar           = document.getElementById('navbar');
    const navLinksEl       = document.getElementById('nav-links');

    // ── Scroll: add/remove .scrolled class for denser glass ──────
    const onScroll = () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load

    // ── Hamburger toggle ─────────────────────────────────────────
    if (mobileMenuToggle && navLinksEl) {
        mobileMenuToggle.addEventListener('click', () => {
            const isOpen = mobileMenuToggle.classList.toggle('open');
            navLinksEl.classList.toggle('nav-open', isOpen);
            // Prevent body scroll when menu is open
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close when a nav link is clicked
        navLinksEl.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('open');
                navLinksEl.classList.remove('nav-open');
                document.body.style.overflow = '';
            });
        });

        // Close on backdrop click (outside the panel)
        document.addEventListener('click', (e) => {
            if (navLinksEl.classList.contains('nav-open')
                && !navLinksEl.contains(e.target)
                && !mobileMenuToggle.contains(e.target)) {
                mobileMenuToggle.classList.remove('open');
                navLinksEl.classList.remove('nav-open');
                document.body.style.overflow = '';
            }
        });
    }

    // ── Active link highlight ─────────────────────────────────────
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes(currentPage)) {
            link.classList.add('active');
        }
    });

    // 2. Scroll Reveal Animations utilizing Intersection Observer
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // 3. Navbar background opacity on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(15, 17, 26, 0.95)';
            navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
        } else {
            navbar.style.background = 'rgba(15, 17, 26, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    });

    // 4. Parallax effect for the Konnect Card
    const konnectCardWrapper = document.querySelector('.konnect-card-3d-wrapper');
    const konnectCard = document.querySelector('.konnect-card');

    if(konnectCardWrapper && konnectCard) {
        konnectCardWrapper.addEventListener('mousemove', (e) => {
            const rect = konnectCardWrapper.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.
            
            // Calculate rotation. Max rotation is 15deg
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -15; // Invert y
            const rotateY = ((x - centerX) / centerX) * 15;
            
            konnectCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            konnectCard.style.transition = 'none';
        });

        konnectCardWrapper.addEventListener('mouseleave', () => {
            konnectCard.style.transform = `rotateY(-15deg) rotateX(10deg)`;
            konnectCard.style.transition = 'var(--transition-smooth)';
        });
    }

    // 5. Phase 3: Liquid Glass 3D Interactive Feed Cards
    const interactiveCards = document.querySelectorAll('.tilt-interactive');

    interactiveCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top; 

            // Calculate rotation for dramatic liquid glass feel (max rotation 6deg for size)
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -6; // Invert y
            const rotateY = ((x - centerX) / centerX) * 6;
            
            card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = 'none';

            // Glow tracking light effect
            const glow = card.querySelector('.post-glow');
            if(glow) {
                glow.style.top = `${y - 125}px`; // center the 250px circle
                glow.style.left = `${x - 125}px`;
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = 'transform var(--transition-smooth)';
        });
    });

    // 6. Action Button Toggles (Like / Recommend)
    const likeBtns = document.querySelectorAll('.like-btn');
    const reccBtns = document.querySelectorAll('.recommend-btn');

    const handleActionToggle = (btn, type) => {
        btn.addEventListener('click', () => {
            const isActive = btn.classList.contains('active');
            const countSpan = btn.querySelector('.count');
            
            // Simple string parsing to simulate visual addition/subtraction safely
            // (In a real app, this interacts with a DB and handles thousands formatting correctly)
            let currValStr = countSpan.innerText;
            if(!currValStr.includes('k')) {
                let val = parseInt(currValStr);
                if(isActive) val -= 1; else val += 1;
                countSpan.innerText = val.toString();
            }

            btn.classList.toggle('active');
        });
    };

    likeBtns.forEach(btn => handleActionToggle(btn, 'like'));
    reccBtns.forEach(btn => handleActionToggle(btn, 'recc'));

    // 7. Search Functionality
    const feedSearch = document.getElementById('feed-search');
    if(feedSearch) {
        feedSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const posts = document.querySelectorAll('.feed-post');
            posts.forEach(post => {
                const text = post.innerText.toLowerCase();
                post.style.display = text.includes(query) ? '' : 'none';
            });
        });
    }

    const zoneSearch = document.getElementById('zone-search');
    if(zoneSearch) {
        zoneSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.biz-card');
            cards.forEach(card => {
                const text = card.innerText.toLowerCase();
                card.style.display = text.includes(query) ? '' : 'none';
            });
        });
    }

    // 8. Global Antigravity Mouse Particles
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0'; 
    document.body.insertBefore(canvas, document.body.firstChild);

    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let mouse = { x: null, y: null, radius: 120 };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    window.addEventListener('touchmove', (event) => {
        mouse.x = event.touches[0].clientX;
        mouse.y = event.touches[0].clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor(x, y, dx, dy, size, color) {
            this.x = x; this.y = y;
            this.dx = dx; this.dy = dy;
            this.size = size; this.color = color;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        update() {
            if (this.x > canvas.width || this.x < 0) this.dx = -this.dx;
            if (this.y > canvas.height || this.y < 0) this.dy = -this.dy;
            
            if (mouse.x != null && mouse.y != null) {
                let dX = mouse.x - this.x;
                let dY = mouse.y - this.y;
                let distance = Math.sqrt(dX * dX + dY * dY);
                if (distance < mouse.radius + this.size) {
                    if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 2;
                    if (mouse.x > this.x && this.x > this.size * 10) this.x -= 2;
                    if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 2;
                    if (mouse.y > this.y && this.y > this.size * 10) this.y -= 2;
                }
            }
            this.x += this.dx;
            this.y += this.dy;
            this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        let num = (canvas.height * canvas.width) / 12000;
        for (let i = 0; i < num; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let dx = (Math.random() * 1) - 0.5;
            let dy = (Math.random() * 1) - 0.5;
            let color = Math.random() < 0.5 ? 'rgba(147, 51, 234, 0.4)' : 'rgba(249, 115, 22, 0.4)';
            particlesArray.push(new Particle(x, y, dx, dy, size, color));
        }
    }

    function connectParticles() {
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dist = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                         + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                if (dist < 7000) {
                    ctx.strokeStyle = 'rgba(147, 51, 234,' + (1 - dist / 7000) + ')';
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        particlesArray.forEach(p => p.update());
        connectParticles();
    }

    initParticles();
    animateParticles();
    window.addEventListener('resize', initParticles);

    // =================================================================
    // 9. PWA – CROSS-PLATFORM INSTALL PROMPT (Android, iOS, Windows, macOS)
    // =================================================================

    // ── Detect OS / Browser ────────────────────────────────────────
    const ua = navigator.userAgent;
    const isIOS        = /iphone|ipad|ipod/i.test(ua);
    const isMacOS      = /Macintosh/i.test(ua) && !isIOS;
    const isAndroid    = /android/i.test(ua);
    const isWindows    = /windows/i.test(ua);
    const isInStandalone = window.matchMedia('(display-mode: standalone)').matches
                        || window.navigator.standalone === true;
    const isSamsungBrowser = /SamsungBrowser/i.test(ua);
    const isFirefox    = /firefox/i.test(ua);

    // Don't show if already installed as PWA
    if (isInStandalone) return;

    // ── Build the install banner HTML ─────────────────────────────
    let installInstructions = '';
    let installBtnLabel     = 'Install';
    let showManualGuide     = false;

    if (isIOS) {
        showManualGuide = true;
        installBtnLabel = 'How to Install';
        installInstructions = `
            <div id="ios-guide" style="display:none; margin-top:1rem; background:rgba(0,243,255,0.05);
                border:1px solid rgba(0,243,255,0.2); border-radius:4px; padding:0.75rem; font-size:0.8rem; color:#94a3b8;">
                <strong style="color:#00f3ff;">iOS Instructions:</strong><br>
                1. Tap the <strong>Share</strong> button (📤) at the bottom of Safari<br>
                2. Scroll down and tap <strong>"Add to Home Screen"</strong><br>
                3. Tap <strong>"Add"</strong> to confirm
            </div>`;
    } else if (isFirefox) {
        showManualGuide = true;
        installBtnLabel = 'How to Install';
        installInstructions = `
            <div id="ios-guide" style="display:none; margin-top:1rem; background:rgba(0,243,255,0.05);
                border:1px solid rgba(0,243,255,0.2); border-radius:4px; padding:0.75rem; font-size:0.8rem; color:#94a3b8;">
                <strong style="color:#00f3ff;">Firefox Instructions:</strong><br>
                1. Tap the <strong>⋮ Menu</strong> in the top-right<br>
                2. Select <strong>"Install"</strong> or <strong>"Add to Home Screen"</strong>
            </div>`;
    }

    const installBannerHTML = `
    <div id="pwa-install-banner" style="
        position: fixed; bottom: -120px; right: 20px;
        z-index: 9999;
        display: flex; flex-direction: column; align-items: flex-end; gap: 10px;
        transition: all 0.7s cubic-bezier(0.19, 1, 0.22, 1);
    ">
        <!-- Close Button -->
        <button id="pwa-install-dismiss" style="
            width: 24px; height: 24px; border-radius: 50%;
            background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2);
            color: #fff; font-size: 10px; cursor: pointer;
            backdrop-filter: blur(5px); display: flex; align-items: center; justify-content: center;
            opacity: 0.8; transition: 0.2s;
        ">✕</button>

        <!-- Main FAB Icon -->
        <div id="pwa-install-btn" style="
            width: 60px; height: 60px; border-radius: 50%;
            background: rgba(8, 9, 15, 0.7);
            backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(0, 243, 255, 0.5);
            display: flex; align-items: center; justify-content: center;
            cursor: pointer;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5), inset 0 0 15px rgba(0,243,255,0.1);
            animation: fab-float 3s ease-in-out infinite;
        ">
            <img src="assets/icon.svg" alt="Install" style="width:32px; height:32px; filter: drop-shadow(0 0 8px rgba(0,243,255,0.4));">
        </div>

        <!-- Tooltip Instructions for iOS/Firefox -->
        <div id="ios-guide" style="
            display: none; position: absolute; bottom: 85px; right: 0;
            width: 260px; background: rgba(8, 9, 15, 0.98); border: 1px solid rgba(0, 243, 255, 0.5);
            border-radius: 16px; padding: 15px; color: #fff; font-size: 0.8rem;
            box-shadow: 0 15px 50px rgba(0,0,0,0.9);
            animation: fadeInScale 0.3s ease-out;
        ">
            ${installInstructions}
        </div>
    </div>
    <style>
        @keyframes fab-float {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-10px) scale(1.05); }
        }
        @keyframes fadeInScale {
            from { opacity: 0; transform: scale(0.9) translateY(10px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
        }
    </style>`;

    document.body.insertAdjacentHTML('beforeend', installBannerHTML);
    const installBanner = document.getElementById('pwa-install-banner');
    const installBtn    = document.getElementById('pwa-install-btn');
    const dismissBtn    = document.getElementById('pwa-install-dismiss');
    const iosGuide      = document.getElementById('ios-guide');

    let deferredPrompt = null;

    // ── Android / Chrome / Edge / Windows (Automatic Prompt) ─────
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        console.log('[PWA] beforeinstallprompt captured. OS supports auto-install.');
        setTimeout(() => { installBanner.style.bottom = '90px'; }, 1200);
    });

    // ── Fallback: Show banner for iOS / Firefox / other platforms ─
    // Only show if beforeinstallprompt never fires (non-Chrome)
    let autoPromptFired = false;
    window.addEventListener('beforeinstallprompt', () => { autoPromptFired = true; });
    setTimeout(() => {
        if (!autoPromptFired && !isInStandalone) {
            installBanner.style.bottom = '20px';
        }
    }, 2000);

    // ── Install button handler ────────────────────────────────────
    installBtn.addEventListener('click', async () => {
        if (showManualGuide) {
            // iOS / Firefox: toggle instructions panel
            if (iosGuide) {
                const visible = iosGuide.style.display === 'block';
                iosGuide.style.display = visible ? 'none' : 'block';
                installBanner.style.bottom = '90px';
            }
            return;
        }
        if (!deferredPrompt) return;
        installBanner.style.bottom = '-100px';
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log('[PWA] Install outcome:', outcome);
        deferredPrompt = null;
    });

    // ── Dismiss button ────────────────────────────────────────────
    dismissBtn.addEventListener('click', () => {
        installBanner.style.bottom = '-100px';
        deferredPrompt = null;
        // Suppress for the rest of this session
        sessionStorage.setItem('pwa_dismissed', '1');
    });

    // Don't re-show if user already dismissed this session
    if (sessionStorage.getItem('pwa_dismissed')) {
        installBanner.remove();
    }

    // ── Already installed – hide ──────────────────────────────────
    window.addEventListener('appinstalled', () => {
        console.log('[PWA] Campus Konnect installed! 🎉');
        installBanner.style.bottom = '-100px';
        deferredPrompt = null;
    });

    // ── Register Service Worker ────────────────────────────────────
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(reg => {
                    console.log('[SW] Registered ✅', reg.scope);
                    reg.addEventListener('updatefound', () => {
                        const newWorker = reg.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                console.log('[SW] New version available – refresh to update.');
                            }
                        });
                    });
                })
                .catch(err => console.error('[SW] Registration failed:', err));
        });
    }



    // =================================================================
    // 10. BACKEND INTEGRATION (Live API connection)
    // =================================================================
    
    // Fetch and Render Businesses on the Feed Page
    const feedColumn = document.querySelector('.feed-column');
    if (feedColumn && document.getElementById('feed')) {
        async function fetchBusinesses() {
            try {
                // Supabase Migration: Fetch from 'posts' table with business details
                const { data: posts, error } = await supabaseClient
                    .from('posts')
                    .select('*, businesses(*)')
                    .eq('is_approved', true) 
                    .order('created_at', { ascending: false });

                if (error) throw error;
                
                // Map columns to match existing render logic if necessary
                const mappedPosts = posts.map(p => ({
                    ...p,
                    ...p.businesses, // Flatten business details
                    description: p.content || p.businesses.description // use post content if available
                }));

                renderFeed(mappedPosts);
            } catch (error) {
                console.error("Failed to fetch businesses from Supabase:", error);
            }
        }
        
        function renderFeed(businesses) {
            // Remove mock posts
            const loader = feedColumn.querySelector('.feed-loader');
            feedColumn.innerHTML = ''; 
            
            if (businesses.length === 0) {
                feedColumn.innerHTML = '<p class="text-center" style="color:var(--text-secondary); padding: 2rem;">No adverts found. Be the first to create one!</p>';
                return;
            }

            businesses.forEach((biz, index) => {
                const delay = index % 3 === 0 ? '' : `delay-${index % 3}`;
                const initial = biz.name.substring(0, 2).toUpperCase();
                
                let mediaHtml = '';
                if (biz.profile_picture_url) {
                    const isVideo = biz.profile_picture_url.startsWith('data:video');
                    mediaHtml = `
                    <div class="post-media">
                        ${isVideo ? `<video src="${biz.profile_picture_url}" autoplay loop muted playsinline style="width:100%; max-height:400px; object-fit:cover;"></video>` 
                                  : `<img src="${biz.profile_picture_url}" alt="${biz.name} preview" loading="lazy">`}
                        <div class="media-overlay"></div>
                    </div>`;
                }

                const article = document.createElement('article');
                article.className = `feed-post liquid-glass tilt-interactive reveal fade-up ${delay}`;
                article.innerHTML = `
                    <div class="post-glow"></div>
                    <header class="post-header">
                        <div class="post-identity" style="cursor: pointer;" onclick="openCatalogue('${encodeURIComponent(biz.name)}', '${encodeURIComponent(biz.category)}', '${encodeURIComponent(biz.profile_picture_url || '')}')">
                            <div class="avatar bg-gradient-purple">${initial}</div>
                            <div class="post-meta">
                                <h3 class="biz-name">${biz.name}</h3>
                                <span class="biz-category">${biz.category}</span>
                            </div>
                        </div>
                        <div class="post-rating">
                            <span class="stars">★★★★★</span>
                            <span class="rating-val">5.0</span>
                        </div>
                    </header>
                    <div class="post-content">
                        <p class="post-text">${biz.description}</p>
                        ${mediaHtml}
                    </div>
                `;
                feedColumn.appendChild(article);
            });
            if (loader) feedColumn.appendChild(loader);
        }
        
        fetchBusinesses();
    }

    // =================================================================
    // 11. Instagram-Style Catalogue Modal Logic
    // =================================================================
    window.openCatalogue = function(encodedName, encodedCategory, encodedMedia) {
        const name = decodeURIComponent(encodedName);
        const category = decodeURIComponent(encodedCategory);
        const media = decodeURIComponent(encodedMedia);
        
        const modal = document.getElementById('catalogueModal');
        const header = document.getElementById('cat-header');
        const grid = document.getElementById('cat-grid');
        
        if(!modal || !header || !grid) return;

        // Generate Header
        header.innerHTML = `
            <div class="catalogue-avatar">${name.substring(0,2).toUpperCase()}</div>
            <div class="catalogue-info">
                <h2 class="catalogue-name">${name}</h2>
                <div class="catalogue-category">${category}</div>
                <div class="catalogue-stats">
                    <div class="stat-box"><span class="stat-val">1</span><span class="stat-label">Posts</span></div>
                    <div class="stat-box"><span class="stat-val">4.9</span><span class="stat-label">Rating</span></div>
                </div>
            </div>
        `;

        // Generate Grid (Simulating a catalogue logic with the one available post)
        let gridHtml = '';
        if (media) {
            const isVideo = media.startsWith('data:video');
            const mediaTag = isVideo 
                ? `<video src="${media}" loop muted playsinline autoplay></video><div class="video-icon">▶</div>` 
                : `<img src="${media}">`;
            
            // To make it look like a catalogue, we can duplicate the item visually once for demo purposes
            gridHtml += `<div class="catalogue-item">${mediaTag}</div>`;
        } else {
            gridHtml = `<div style="grid-column: 1 / -1; padding: 40px; text-align: center; color: var(--text-secondary);">No ad media available</div>`;
        }
        grid.innerHTML = gridHtml;
        
        modal.classList.add('active');
    };

    window.closeCatalogue = function() {
        const modal = document.getElementById('catalogueModal');
        if (modal) modal.classList.remove('active');
    };

    // =================================================================
    // 12. Profile Creation Submission handling (Hidden for normal users, kept in JS structure)
    // =================================================================
    const profilePicInput = document.getElementById('profile_picture');
    const picPreview = document.getElementById('pic-preview');

    if (profilePicInput && picPreview) {
        profilePicInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    picPreview.innerHTML = `<img src="${event.target.result}" alt="Profile Preview">`;
                    picPreview.classList.add('has-image');
                    // Storing base64 purely for demo/prototype purposes
                    picPreview.dataset.base64 = event.target.result;
                }
                reader.readAsDataURL(file);
            }
        });

        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const btn = profileForm.querySelector('button[type="submit"]');
                btn.innerText = 'Creating Profile...';
                btn.disabled = true;

                const payload = {
                    name: document.getElementById('business_name').value,
                    email: document.getElementById('email').value,
                    password: document.getElementById('password').value,
                    category: document.getElementById('category').value,
                    description: document.getElementById('description').value,
                    contact_phone: document.getElementById('contact_phone').value,
                    profile_picture_url: picPreview.dataset.base64 || ''
                };

                try {
                    // Supabase Migration: Map registration to 'businesses' table
                    const { data, error } = await supabaseClient
                        .from('businesses')
                        .insert([{
                            ...payload,
                            is_approved: false // Approval System: Map to is_approved boolean
                        }])
                        .select();

                    if (error) throw error;

                    alert('Profile Created Successfully! Your business is now pending approval.');
                    window.location.href = 'index.html';
                } catch (error) {
                    console.error("Supabase Error:", error);
                    alert('Error setting up profile: ' + (error.message || 'Check connection'));
                    btn.innerText = 'Launch Profile';
                    btn.disabled = false;
                }
            });
        }
    }

    // =================================================================
    // 13. Business Portal Login Submission
    // =================================================================
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btn = loginForm.querySelector('button[type="submit"]');
            btn.innerText = 'Authenticating...';
            btn.disabled = true;

            const payload = {
                email: document.getElementById('login_email').value,
                password: document.getElementById('login_password').value
            };

            try {
                // Supabase Migration: Query businesses table directly (Simple Login Logic)
                const { data, error } = await supabaseClient
                    .from('businesses')
                    .select('*')
                    .eq('email', payload.email)
                    .eq('password', payload.password) // Note: In production use Auth.signInWithPassword
                    .single();

                if (error || !data) throw new Error('Invalid email or password.');

                // Store simplified session data
                localStorage.setItem('campus_konnect_business', JSON.stringify(data));
                localStorage.setItem('campus_konnect_token', 'supabaseClient_managed_session');
                
                alert(`Welcome to your private proxy, ${data.name}!`);
                
                loginForm.style.display = 'none';
                document.getElementById('business-dashboard').style.display = 'block';
                document.getElementById('dashboard-welcome').innerText = `Welcome, ${data.name}`;
            } catch (error) {
                console.error("Login Error:", error);
                alert(error.message || 'Login failed.');
                btn.innerText = 'Access Portal';
                btn.disabled = false;
            }
        });
    }

    // =================================================================
    // 14. Standard User Login & Registration
    // =================================================================
    const studentLoginForm = document.getElementById('student-login-form');
    const toggleStudentMode = document.getElementById('toggle-student-mode');
    const studentNameGroup = document.getElementById('student_name_group');
    const studentModalTitle = document.getElementById('student-modal-title');
    let isStudentRegisterMode = false;

    if (toggleStudentMode) {
        toggleStudentMode.addEventListener('click', (e) => {
            e.preventDefault();
            isStudentRegisterMode = !isStudentRegisterMode;
            if (isStudentRegisterMode) {
                studentNameGroup.style.display = 'block';
                document.getElementById('student_name').required = true;
                studentModalTitle.innerText = 'Student Registration';
                document.getElementById('student-login-btn').innerText = 'Register';
                toggleStudentMode.innerText = 'Already have an account? Log In';
            } else {
                studentNameGroup.style.display = 'none';
                document.getElementById('student_name').required = false;
                studentModalTitle.innerText = 'Student Log In';
                document.getElementById('student-login-btn').innerText = 'Log In';
                toggleStudentMode.innerText = 'Need an account? Register';
            }
        });
    }

    if (studentLoginForm) {
        studentLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('student-login-btn');
            const originalText = btn.innerText;
            btn.innerText = 'Please wait...';
            btn.disabled = true;

            const endpoint = isStudentRegisterMode ? `${API}/api/users/register` : `${API}/api/users/login`;
            const payload = {
                email: document.getElementById('student_email').value,
                password: document.getElementById('student_password').value
            };
            
            if (isStudentRegisterMode) {
                payload.name = document.getElementById('student_name').value;
            }

            try {
                let data, error;

                if (isStudentRegisterMode) {
                    const { data: newUser, error: regError } = await supabaseClient
                        .from('users')
                        .insert([{
                            ...payload,
                            role: 'student'
                        }])
                        .select()
                        .single();
                    data = newUser;
                    error = regError;
                } else {
                    const { data: user, error: loginError } = await supabaseClient
                        .from('users')
                        .select('*')
                        .eq('email', payload.email)
                        .eq('password', payload.password)
                        .single();
                    data = user;
                    error = loginError;
                }
                
                if (error || !data) throw new Error(error?.message || 'Authentication failed.');

                localStorage.setItem('campus_konnect_user', JSON.stringify(data));
                localStorage.setItem('campus_konnect_token', 'supabaseClient_managed_session');
                
                alert(`Success! Logged in as ${data.name}`);
                document.getElementById('user-login-modal').classList.remove('active');
                
                if (data.role === 'admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.reload();
                }
            } catch (error) {
                console.error("Auth Error:", error);
                alert(error.message || 'Authentication failed.');
            } finally {
                btn.innerText = originalText;
                btn.disabled = false;
            }
        });
    }
});

    // =================================================================
    // MOBILE SYNC: Search & Infinite Scroll
    // =================================================================
    const mobileSearchInput = document.getElementById('mobile-global-search');
    if (mobileSearchInput) {
        mobileSearchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const posts = document.querySelectorAll('.feed-post, .biz-card');
            posts.forEach(post => {
                const text = post.innerText.toLowerCase();
                post.style.display = text.includes(query) ? '' : 'none';
            });
        });
    }

    // Infinite Scroll Implementation (Zero-Break Protocol)
    let isFetchingBatch = false;
    const handleInfiniteScroll = () => {
        if (isFetchingBatch) return;
        const scrollBottom = window.innerHeight + window.pageYOffset;
        const threshold = document.documentElement.scrollHeight - 600;

        if (scrollBottom >= threshold) {
            fetchNextBatch();
        }
    };

    async function fetchNextBatch() {
        isFetchingBatch = true;
        const feedContainer = document.getElementById('feed');
        if (!feedContainer) return;

        // Show loading indicator
        const loader = document.createElement('div');
        loader.className = 'batch-loader';
        loader.innerHTML = '<div class="skeleton" style="height: 200px; border-radius: 12px; margin: 20px 0;"></div>';
        feedContainer.appendChild(loader);

        // Simulation of Supabase pagination logic
        setTimeout(() => {
            const originalPost = document.querySelector('.feed-post');
            if (originalPost) {
                const clone = originalPost.cloneNode(true);
                feedContainer.appendChild(clone);
            }
            loader.remove();
            isFetchingBatch = false;
        }, 1200);
    }

    window.addEventListener('scroll', handleInfiniteScroll, { passive: true });

    // Touch Event Optimization
    document.querySelectorAll('.btn, .icon-btn-mobile, .gate-btn').forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.96)';
            this.style.transition = '0.1s';
        }, { passive: true });
        button.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        }, { passive: true });
    });
