document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navbar = document.getElementById('navbar');
    
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navbar.classList.toggle('nav-active');
    });

    // Close menu when a link is clicked
    const navLinks = document.querySelectorAll('.nav-links a, .nav-actions a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navbar.classList.remove('nav-active');
        });
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
    // 9. PWA – SERVICE WORKER + INSTALL PROMPT
    // =================================================================

    // ── Inject the install banner HTML ──────────────────────────────
    const installBannerHTML = `
    <div id="pwa-install-banner" style="
        position: fixed; bottom: -120px; left: 50%; transform: translateX(-50%);
        width: min(420px, calc(100vw - 2rem));
        background: rgba(15,17,26,0.92);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border: 1px solid rgba(147,51,234,0.35);
        border-radius: 20px;
        padding: 1rem 1.25rem;
        display: flex; align-items: center; gap: 1rem;
        box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(147,51,234,0.1);
        z-index: 9999;
        transition: bottom 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    ">
        <img src="icon-192.png" alt="Konnect" style="width:52px;height:52px;border-radius:12px;flex-shrink:0;">
        <div style="flex:1; min-width:0;">
            <p style="margin:0;font-weight:700;font-size:0.95rem;color:#fff;">Install Campus Konnect</p>
            <p style="margin:0;font-size:0.8rem;color:#94a3b8;margin-top:2px;">Add to Home Screen for the best experience</p>
        </div>
        <div style="display:flex;gap:0.5rem;flex-shrink:0;">
            <button id="pwa-install-dismiss" style="
                background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
                color: #94a3b8; border-radius: 10px; padding: 0.45rem 0.8rem;
                font-size: 0.8rem; cursor: pointer; font-family: inherit;
                transition: background 0.2s;
            ">Later</button>
            <button id="pwa-install-btn" style="
                background: linear-gradient(135deg, #9333ea, #f97316);
                border: none; color: white; border-radius: 10px;
                padding: 0.45rem 1rem; font-size: 0.85rem; font-weight: 600;
                cursor: pointer; font-family: inherit;
                box-shadow: 0 4px 15px rgba(147,51,234,0.4);
                transition: opacity 0.2s, transform 0.2s;
            ">Install</button>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', installBannerHTML);
    const installBanner = document.getElementById('pwa-install-banner');
    const installBtn    = document.getElementById('pwa-install-btn');
    const dismissBtn    = document.getElementById('pwa-install-dismiss');

    let deferredPrompt = null;

    // Hover effect on Install button
    installBtn.addEventListener('mouseenter', () => { installBtn.style.opacity = '0.9'; installBtn.style.transform = 'scale(1.02)'; });
    installBtn.addEventListener('mouseleave', () => { installBtn.style.opacity = '1';   installBtn.style.transform = 'scale(1)'; });

    // Capture the install prompt (fired by browser when app is installable)
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        console.log('[PWA] Install prompt captured, showing banner.');
        // Slide the banner up
        setTimeout(() => { installBanner.style.bottom = '1.5rem'; }, 800);
    });

    // User clicks "Install"
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        installBanner.style.bottom = '-120px';
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log('[PWA] Install outcome:', outcome);
        deferredPrompt = null;
        if (outcome === 'accepted') {
            console.log('[PWA] User accepted installation 🎉');
        }
    });

    // User clicks "Later"
    dismissBtn.addEventListener('click', () => {
        installBanner.style.bottom = '-120px';
        // Don't prompt again this session
        deferredPrompt = null;
    });

    // Already installed – hide the banner
    window.addEventListener('appinstalled', () => {
        console.log('[PWA] Campus Konnect was installed!');
        installBanner.style.bottom = '-120px';
        deferredPrompt = null;
    });

    // ── Register Service Worker ─────────────────────────────────────
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(reg => {
                    console.log('[SW] Registered ✅', reg.scope);
                    // Handle updates gracefully
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
                // Since frontend and backend are hosted on same server, we can use relative path
                const response = await fetch('/api/businesses');
                if (response.ok) {
                    const businesses = await response.json();
                    renderFeed(businesses);
                }
            } catch (error) {
                console.error("Failed to fetch businesses:", error);
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
                    category: document.getElementById('category').value,
                    description: document.getElementById('description').value,
                    contact_phone: document.getElementById('contact_phone').value,
                    profile_picture_url: picPreview.dataset.base64 || ''
                };

                try {
                    const res = await fetch('/api/businesses', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    if (res.ok) {
                        alert('Profile Created Successfully! Your business is now live on the feed.');
                        window.location.href = 'index.html';
                    } else {
                        const err = await res.json();
                        alert('Error setting up profile. Please check your inputs.');
                        btn.innerText = 'Launch Profile';
                        btn.disabled = false;
                    }
                } catch (error) {
                    console.error(error);
                    alert('Network error failed to create profile.');
                    btn.innerText = 'Launch Profile';
                    btn.disabled = false;
                }
            });
        }
    }
});
