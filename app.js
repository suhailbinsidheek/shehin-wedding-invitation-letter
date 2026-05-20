/* ==========================================================================
   INTERACTIVE ENGINE - SHEHIN & AMEENA WEDDING (ROMANTIC PRESETS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. STATE MANAGEMENT
    const weddingDate = new Date('May 21, 2026 16:00:00').getTime();
    let activeTheme = 'day';
    let isMusicPlaying = false;
    let synthIntervalId = null;
    let audioCtx = null;
    let mainGainNode = null;
    
    // Default blessings to populate wishes wall
    const defaultWishes = [
        { name: "Parents", message: "Our hearts are overflowing with joy for you both. May your lifetime together be filled with laughter, adventure, and endless love.", category: "Parents" },
        { name: "Saahir (Best Man)", message: "To my best friend Shehin and the wonderful Ameena—wishing you a beautiful wedding and a marriage that grows stronger every day. Cheers!", category: "Best Man" },
        { name: "Safwana (Maid of Honor)", message: "I've watched your love blossom into this beautiful journey. So honored to stand by you on this blessed day!", category: "Maid of Honor" }
    ];

    // 2. CANVAS PARTICLE ENGINE (Falling Rose Petals & Golden Stardust)
    const canvas = document.getElementById('ambient-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId = null;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height; // scatter at start
        }

        reset(burst = false) {
            this.x = Math.random() * canvas.width;
            this.y = burst ? canvas.height + 20 : -20;
            this.size = Math.random() * 8 + 6;
            
            if (activeTheme === 'day') {
                // Falling Pink Rose Petals: drift down and sway elegantly
                this.speedY = Math.random() * 0.8 + 0.5;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.rotation = Math.random() * 360;
                this.rotationSpeed = Math.random() * 1.5 - 0.75;
                this.swingRange = Math.random() * 15 + 8;
                this.swingSpeed = Math.random() * 0.01 + 0.005;
                this.swingStep = Math.random() * 100;
                
                // Varied soft pink petal hues
                const pinks = ['rgba(255, 192, 203, 0.7)', 'rgba(255, 182, 193, 0.75)', 'rgba(255, 209, 220, 0.65)', 'rgba(244, 194, 194, 0.7)'];
                this.color = pinks[Math.floor(Math.random() * pinks.length)];
                this.isRosePetal = true;
            } else {
                // Twinkling Royal Gold Stardust: sparkle and fall gently
                this.speedY = Math.random() * 0.4 + 0.2;
                this.speedX = Math.random() * 0.3 - 0.15;
                this.rotation = Math.random() * 360;
                this.rotationSpeed = Math.random() * 2 - 1;
                this.swingRange = Math.random() * 8 + 4;
                this.swingSpeed = Math.random() * 0.008 + 0.003;
                this.swingStep = Math.random() * 100;
                this.color = `rgba(229, 193, 88, ${Math.random() * 0.65 + 0.25})`; // Royal Gold
                this.isRosePetal = false;
            }
            
            this.isBurstEvent = false;
        }

        makeCelebrationBurst() {
            this.isBurstEvent = true;
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 10;
            this.speedY = -(Math.random() * 6 + 4); // shoot upwards
            this.speedX = Math.random() * 3 - 1.5;
            this.size = Math.random() * 12 + 8;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 4 - 2;
            
            if (activeTheme === 'day') {
                const celebrationPinks = ['#FFC0CB', '#FF69B4', '#FFB6C1', '#DB7093'];
                this.color = celebrationPinks[Math.floor(Math.random() * celebrationPinks.length)];
            } else {
                const celebrationGolds = ['#FFE259', '#FFA751', '#E5C158', '#FFE066'];
                this.color = celebrationGolds[Math.floor(Math.random() * celebrationGolds.length)];
            }
        }

        update() {
            if (this.isBurstEvent) {
                this.x += this.speedX;
                this.y += this.speedY;
                this.speedY += 0.1; // gravity effect
                this.rotation += this.rotationSpeed;
                
                if (this.y > canvas.height + 20) {
                    this.reset();
                }
                return;
            }

            this.y += this.speedY;
            this.swingStep += this.swingSpeed;
            this.x += this.speedX + Math.sin(this.swingStep) * 0.25;
            this.rotation += this.rotationSpeed;
            
            if (this.y > canvas.height + 20 || this.x < -20 || this.x > canvas.width + 20) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            
            if (this.isRosePetal) {
                // Draw a beautiful soft organic rose petal (curved heart/tear shape)
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-this.size/2, -this.size/2, -this.size, this.size/3, 0, this.size);
                ctx.bezierCurveTo(this.size, this.size/3, this.size/2, -this.size/2, 0, 0);
                ctx.fill();
            } else {
                // Draw a glowing, glittering golden stardust four-point star sparkle
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.moveTo(0, -this.size);
                ctx.quadraticCurveTo(0, 0, this.size, 0);
                ctx.quadraticCurveTo(0, 0, 0, this.size);
                ctx.quadraticCurveTo(0, 0, -this.size, 0);
                ctx.quadraticCurveTo(0, 0, 0, -this.size);
                ctx.fill();
            }
            ctx.restore();
        }
    }

    function initParticles() {
        particles = [];
        const count = Math.min(Math.floor(window.innerWidth / 18), 70);
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        animationFrameId = requestAnimationFrame(animate);
    }

    initParticles();
    animate();

    function triggerCelebrationBurst() {
        particles.forEach(p => {
            p.makeCelebrationBurst();
        });
    }


    // 3. COUNTDOWN TIMER SYSTEM (Target: September 18, 2026)
    const cdDaysVal = document.querySelector('#cd-days .countdown-value');
    const cdHoursVal = document.querySelector('#cd-hours .countdown-value');
    const cdMinutesVal = document.querySelector('#cd-minutes .countdown-value');
    const cdSecondsVal = document.querySelector('#cd-seconds .countdown-value');

    function updateCountdown() {
        const now = new Date().getTime();
        const gap = weddingDate - now;

        if (checkCountdownComplete(gap)) return;

        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;

        const d = Math.floor(gap / day);
        const h = Math.floor((gap % day) / hour);
        const m = Math.floor((gap % hour) / minute);
        const s = Math.floor((gap % minute) / second);

        if (cdDaysVal) cdDaysVal.textContent = d.toString().padStart(2, '0');
        if (cdHoursVal) cdHoursVal.textContent = h.toString().padStart(2, '0');
        if (cdMinutesVal) cdMinutesVal.textContent = m.toString().padStart(2, '0');
        if (cdSecondsVal) cdSecondsVal.textContent = s.toString().padStart(2, '0');
    }

    function checkCountdownComplete(gap) {
        if (gap <= 0) {
            const grid = document.querySelector('.countdown-grid');
            if (grid) {
                grid.innerHTML = `
                    <div class="countdown-card" style="grid-column: span 4; padding: 3rem;">
                        <span class="countdown-value" style="font-size: 1.8rem; letter-spacing: 2px;">THE WEDDING HAS BEGUN!</span>
                        <span class="countdown-label">Celebrating Shehin & Ameena's Marriage | May 21, 2026</span>
                    </div>`;
            }
            return true;
        }
        return false;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);


    // 4. MUSIC ENGINE & REAL-TIME WEB AUDIO SYNTHESIZER
    const audioToggle = document.getElementById('audio-toggle');
    const romanticStream = document.getElementById('romantic-stream');

    function initAudio() {
        if (audioCtx) return;
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        mainGainNode = audioCtx.createGain();
        mainGainNode.gain.setValueAtTime(0.15, audioCtx.currentTime); // gentle volume
        mainGainNode.connect(audioCtx.destination);
    }

    // Classic Dreamy Romantic Piano Arpeggio (Fallback)
    function playRomanticPianoSynth() {
        if (!audioCtx) initAudio();
        
        let step = 0;
        // Dreamy chord progression: Cmaj7 -> Am9 -> Fmaj7 -> Gadd9
        const chords = [
            [60, 64, 67, 71, 74], // C4, E4, G4, B4, D5 (Cmaj7/9)
            [57, 60, 64, 67, 71], // A3, C4, E4, G4, B4 (Am9)
            [53, 57, 60, 64, 69], // F3, A3, C4, E4, A4 (Fmaj7)
            [55, 59, 62, 66, 69]  // G3, B3, D4, F#4, A4 (Gadd9)
        ];
        
        const arpeggioPattern = [0, 1, 2, 3, 4, 3, 2, 1]; // Up and down arpeggiation
        const tempo = 200; // milliseconds per note
        
        function scheduleNextPluck() {
            if (!isMusicPlaying) return;
            
            const chordIndex = Math.floor(step / arpeggioPattern.length) % chords.length;
            const noteIndex = step % arpeggioPattern.length;
            const midiNote = chords[chordIndex][arpeggioPattern[noteIndex]];
            const freq = Math.pow(2, (midiNote - 69) / 12) * 440;
            
            // Soft sine/triangle hybrid wave pluck
            playPianoTone(freq);
            
            step++;
        }
        
        synthIntervalId = setInterval(scheduleNextPluck, tempo);
    }

    function playPianoTone(freq) {
        if (!audioCtx || audioCtx.state === 'suspended' || !isMusicPlaying) return;
        
        const osc = audioCtx.createOscillator();
        const toneGain = audioCtx.createGain();
        
        // Triangle wave gives a soft wood-like organic mallet/piano tone
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        
        // Envelope: Instant attack, slow exponential decay ring
        toneGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
        toneGain.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 0.05); // attack
        toneGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.6); // ring release
        
        osc.connect(toneGain);
        toneGain.connect(mainGainNode);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 1.8);
    }

    function toggleMusic() {
        if (isMusicPlaying) {
            romanticStream.pause();
            if (synthIntervalId) {
                clearInterval(synthIntervalId);
                synthIntervalId = null;
            }
            audioToggle.classList.remove('playing');
            isMusicPlaying = false;
        } else {
            initAudio();
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            
            isMusicPlaying = true;
            audioToggle.classList.add('playing');
            
            romanticStream.play().then(() => {
                // Audio streaming succeeded
            }).catch(err => {
                // Fallback to real-time classical synthesiser arpeggio
                playRomanticPianoSynth();
            });
        }
    }

    audioToggle.classList.remove('playing');
    isMusicPlaying = false;

    audioToggle.addEventListener('click', toggleMusic);

    // Attempt immediate autoplay without requiring any button click
    function attemptAutoplay() {
        initAudio();
        isMusicPlaying = true;
        audioToggle.classList.add('playing');
        
        romanticStream.play().then(() => {
            // Immediate autoplay succeeded!
        }).catch(err => {
            // Immediate autoplay was blocked by the browser. Reset state and wait for first interaction.
            isMusicPlaying = false;
            audioToggle.classList.remove('playing');
            
            const startOnInteraction = () => {
                if (!isMusicPlaying) {
                    toggleMusic();
                }
                // Clean up all fallback listeners
                document.removeEventListener('click', startOnInteraction);
                document.removeEventListener('touchstart', startOnInteraction);
                document.removeEventListener('scroll', startOnInteraction);
            };
            
            document.addEventListener('click', startOnInteraction);
            document.addEventListener('touchstart', startOnInteraction);
            document.addEventListener('scroll', startOnInteraction);
        });
    }

    // Launch autoplay attempt
    attemptAutoplay();

    // 4.5 CUSTOM LOCAL AUDIO LOADER
    const localAudioInput = document.getElementById('local-audio-input');
    const audioUploadBtn = document.getElementById('audio-upload');

    if (audioUploadBtn && localAudioInput) {
        audioUploadBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent body click triggers
            localAudioInput.click();
        });

        localAudioInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                // Security Check: Enforce audio files only to prevent execution/XSS masquerading
                if (!file.type.startsWith('audio/')) {
                    alert("Security Alert: Only valid audio files (e.g., MP3) are permitted.");
                    localAudioInput.value = ''; // clear selection
                    return;
                }
                
                // If synthesizer arpeggios are currently running, silence them
                if (synthIntervalId) {
                    clearInterval(synthIntervalId);
                    synthIntervalId = null;
                }
                
                // Create local object URL for the uploaded MP3
                const fileURL = URL.createObjectURL(file);
                
                // Set as stream source
                romanticStream.src = fileURL;
                romanticStream.load();
                
                // Force play
                isMusicPlaying = false; // toggleMusic will flip this and play
                toggleMusic();
                
                // Visual notification on the upload button
                audioUploadBtn.style.borderColor = "var(--color-brand-primary)";
                audioUploadBtn.style.color = "var(--color-brand-primary)";
                setTimeout(() => {
                    audioUploadBtn.style.borderColor = "";
                    audioUploadBtn.style.color = "";
                }, 2000);
            }
        });
    }


    // 5. RSVP & LOCAL STORAGE WISHES WALL
    const rsvpForm = document.getElementById('rsvp-form');
    const wishesBoard = document.getElementById('wishes-board');
    const guestCountGroup = document.getElementById('guest-count-group');
    const dietGroup = document.getElementById('diet-group');

    document.querySelectorAll('input[name="attendance"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'no') {
                guestCountGroup.style.display = 'none';
                dietGroup.style.display = 'none';
            } else {
                guestCountGroup.style.display = 'block';
                dietGroup.style.display = 'block';
            }
        });
    });

    // Zero-dependency HTML Sanitizer/Escaper to protect wishes against Stored & DOM XSS
    function escapeHTML(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function getSavedWishes() {
        const stored = localStorage.getItem('wedding_rsvps_shehin_ameena');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) return parsed;
            } catch (e) {
                console.error("Security Alert: Local storage corrupted or modified maliciously, resetting.", e);
            }
        }
        localStorage.setItem('wedding_rsvps_shehin_ameena', JSON.stringify(defaultWishes));
        return defaultWishes;
    }

    function renderWishes() {
        if (!wishesBoard) return;
        wishesBoard.innerHTML = '';
        const wishes = getSavedWishes();
        
        wishes.forEach(wish => {
            const card = document.createElement('div');
            card.className = 'wish-card';
            
            const catBadge = wish.category ? `<span class="wish-badge">${escapeHTML(wish.category)}</span>` : `<span class="wish-badge">Guest</span>`;
            
            card.innerHTML = `
                <p class="wish-text">${escapeHTML(wish.message || "Sending you all our love!")}</p>
                <div class="wish-author">
                    <span class="wish-name">${escapeHTML(wish.name)}</span>
                    ${catBadge}
                </div>
            `;
            wishesBoard.appendChild(card);
        });
    }

    renderWishes();

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('guest-name').value.trim();
            const attending = document.querySelector('input[name="attendance"]:checked').value;
            const message = document.getElementById('guest-message').value.trim();
            
            if (!name) return;

            let category = "Guest";
            if (attending === 'no') {
                category = "Absent";
            } else {
                category = "Attending";
            }

            const newWish = {
                name: name,
                message: message || (attending === 'yes' ? "Can't wait to celebrate this perfect romance! Sending all our love!" : "Sending our heartfelt blessings and warm congratulations!"),
                category: category
            };

            const existing = getSavedWishes();
            existing.unshift(newWish);
            localStorage.setItem('wedding_rsvps_shehin_ameena', JSON.stringify(existing));

            triggerCelebrationBurst();
            
            const btnSubmit = document.getElementById('btn-submit-rsvp');
            if (btnSubmit) {
                btnSubmit.textContent = "VIBES LOCKED IN! 💖";
                btnSubmit.style.backgroundColor = "var(--color-brand-primary)";
                
                setTimeout(() => {
                    btnSubmit.textContent = "SEND VIBES // RSVP NOW";
                    btnSubmit.style.backgroundColor = "";
                    rsvpForm.reset();
                    
                    guestCountGroup.style.display = 'block';
                    dietGroup.style.display = 'block';
                    
                    renderWishes();
                    
                    const wishesSec = document.getElementById('wishes');
                    if (wishesSec) wishesSec.scrollIntoView({ behavior: 'smooth' });
                }, 1500);
            }
        });
    }


    // 6. THEME TOGGLE (Day Romance / Starry Night)
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (activeTheme === 'day') {
                document.body.classList.remove('theme-day');
                document.body.classList.add('theme-night');
                activeTheme = 'night';
            } else {
                document.body.classList.remove('theme-night');
                document.body.classList.add('theme-day');
                activeTheme = 'day';
            }
            
            initParticles();
        });
    }


    // 7. PHOTO & VIDEO GALLERY LIGHTBOX SYSTEM
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxVideo = document.getElementById('lightbox-video');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentGalleryIdx = 0;

    function openLightbox(idx) {
        if (!lightbox || !lightboxImg || !lightboxVideo || !lightboxCaption) return;
        currentGalleryIdx = idx;
        const item = galleryItems[idx];
        const type = item.getAttribute('data-type') || 'image';
        
        if (type === 'video') {
            const video = item.querySelector('.gallery-video');
            lightboxImg.style.display = 'none';
            lightboxVideo.style.display = 'block';
            lightboxVideo.src = video.src;
            lightboxCaption.textContent = item.querySelector('.polaroid-caption').textContent;
            
            // Auto-play the lightbox video
            lightboxVideo.play().catch(err => console.log("Video auto play blocked"));
        } else {
            lightboxVideo.pause();
            lightboxVideo.style.display = 'none';
            lightboxImg.style.display = 'block';
            
            const img = item.querySelector('.gallery-img');
            lightboxImg.src = img.src;
            lightboxCaption.textContent = img.alt;
        }
        
        lightbox.setAttribute('aria-hidden', 'false');
        setTimeout(() => {
            lightbox.classList.add('active');
        }, 50);
    }

    function closeLightbox() {
        if (!lightbox) return;
        if (lightboxVideo) lightboxVideo.pause();
        lightbox.classList.remove('active');
        setTimeout(() => {
            lightbox.setAttribute('aria-hidden', 'true');
        }, 400);
    }

    function showNextImage() {
        if (lightboxVideo) lightboxVideo.pause();
        let nextIdx = (currentGalleryIdx + 1) % galleryItems.length;
        openLightbox(nextIdx);
    }

    function showPrevImage() {
        if (lightboxVideo) lightboxVideo.pause();
        let prevIdx = (currentGalleryIdx - 1 + galleryItems.length) % galleryItems.length;
        openLightbox(prevIdx);
    }

    galleryItems.forEach((item, idx) => {
        item.addEventListener('click', () => {
            openLightbox(idx);
        });
    });

    const closeBtn = document.getElementById('lightbox-close');
    const nextBtn = document.getElementById('lightbox-next');
    const prevBtn = document.getElementById('lightbox-prev');

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (nextBtn) nextBtn.addEventListener('click', showNextImage);
    if (prevBtn) prevBtn.addEventListener('click', showPrevImage);
    
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (lightbox && lightbox.getAttribute('aria-hidden') === 'false') {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        }
    });


    // 8. SCROLL REVEAL OBSERVER
    const revealElements = document.querySelectorAll('.reveal-on-scroll, .timeline-item, .schedule-card, .rsvp-box, .slide-up-reveal, .slide-left-reveal, .slide-right-reveal, .scale-in-reveal, .polaroid-card');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: "0px 0px -20px 0px"
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });


    // 9. DYNAMIC ADD TO CALENDAR (.ics generator)
    const calendarButtons = document.querySelectorAll('.add-calendar');

    calendarButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const eventType = btn.getAttribute('data-event');
            
            let title = "Shehin & Ameena's Solemn Nikah Ceremony";
            let desc = "Witness the sacred Nikah wedding vows of Shehin & Ameena.";
            let start = "20260521T113000";
            let end = "20260521T120000";
            let location = "Vallakkadavu Convention Centre";

            if (eventType === 'reception') {
                title = "Shehin & Ameena's Grand Feast & Banquet";
                desc = "Celebrate the marriage of Shehin & Ameena with gourmet dining and delicious treats.";
                start = "20260521T180000";
                end = "20260521T210000";
                location = "Kamaleswaram Nagarasabha Convention Centre, MLA Road, Manacaud P.Ο.";
            }

            const icsContent = [
                "BEGIN:VCALENDAR",
                "VERSION:2.0",
                "BEGIN:VEVENT",
                `DTSTART:${start}`,
                `DTEND:${end}`,
                `SUMMARY:${title}`,
                `DESCRIPTION:${desc}`,
                `LOCATION:${location}`,
                "END:VEVENT",
                "END:VCALENDAR"
            ].join("\n");

            const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', `${eventType === 'ceremony' ? 'celebration_ceremony' : 'soiree_and_feast'}.ics`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    });

    // 10. SCROLL PROGRESS INDICATOR
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const scrollBar = document.getElementById('scroll-progress');
        if (scrollBar) {
            scrollBar.style.width = scrolled + '%';
        }
    });

});
