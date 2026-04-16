document.addEventListener('DOMContentLoaded', () => {

    // --- Dynamic Images & Original Assets ---
    // User added new images: cake2.jpeg to cake17.jpeg
    const imageMap = {
        'hero-img': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1089&auto=format&fit=crop', 
        'kitchen-img': 'assets/kitchen_baking.png', 
        'cake-1-img': 'assets/cake2.jpeg', // Fudge Brownie Cake visual
        'cake-2-img': 'assets/cake3.jpeg', // Velvet
        'cake-3-img': 'assets/cake4.jpeg' // Fruit Cake
    };

    for (const [id, src] of Object.entries(imageMap)) {
        const el = document.getElementById(id);
        if(el) el.src = src;
    }

    // --- Video Reel & Gallery Logic ---
    const allCakes = Array.from({length: 16}, (_, i) => `assets/cake${i+2}.jpeg`); // cake2 to cake17
    
    // Setup Marquee Track
    const track1 = document.getElementById('marquee-track-1');
    const track2 = document.getElementById('marquee-track-2');
    
    if (track1 && track2) {
        let marqueeHTML = '';
        allCakes.forEach((src) => {
            marqueeHTML += `
                <div class="w-48 h-64 sm:w-64 sm:h-80 rounded-[24px] sm:rounded-[30px] overflow-hidden flex-shrink-0 relative marquee-card shadow-lg bg-white dark:bg-dark-surface border border-blush/20 dark:border-white/5">
                    <img src="${src}" alt="Gallery Cake" class="w-full h-full object-cover">
                </div>
            `;
        });
        track1.innerHTML = marqueeHTML;
        track2.innerHTML = marqueeHTML; // Duplicate for infinite scroll
    }

    // Setup Video Reel
    const reelImg = document.getElementById('reel-current-img');
    const reelPlayBtn = document.getElementById('reel-play-btn');
    const playIcon = document.getElementById('play-icon');
    const progressBar = document.getElementById('reel-progress');
    
    if (reelImg && reelPlayBtn) {
        let reelInterval;
        let isPlaying = true; // Auto-play initially
        let currentIndex = 0;
        
        function updateReel() {
            currentIndex = (currentIndex + 1) % allCakes.length;
            // Add tiny fade effect
            reelImg.style.opacity = '0.8';
            setTimeout(() => {
                reelImg.src = allCakes[currentIndex];
                reelImg.style.opacity = '1';
                // Update progress bar
                progressBar.style.width = `${((currentIndex + 1) / allCakes.length) * 100}%`;
            }, 150); // fast transition for "stop motion" feel
        }

        function toggleReel() {
            if (isPlaying) {
                clearInterval(reelInterval);
                playIcon.classList.remove('fa-pause');
                playIcon.classList.add('fa-play');
                reelImg.style.filter = 'brightness(0.7)';
                isPlaying = false;
            } else {
                updateReel();
                reelInterval = setInterval(updateReel, 1500); // Change image every 1.5 seconds
                playIcon.classList.remove('fa-play');
                playIcon.classList.add('fa-pause');
                reelImg.style.filter = 'brightness(1)';
                isPlaying = true;
            }
        }

        // Start reel automatically
        reelInterval = setInterval(updateReel, 1500);
        
        reelPlayBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent click from triggering anything underneath
            toggleReel();
        });
        
        // Also toggle on image click
        document.getElementById('video-reel').addEventListener('click', toggleReel);
    }

    // --- Theme Toggle Setup ---
    const themeToggleBtnDesktop = document.getElementById('theme-toggle-desktop');
    const themeToggleBtnMobile = document.getElementById('theme-toggle-mobile');

    // Make both buttons sync toggle
    function toggleTheme() {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    }

    if(themeToggleBtnDesktop) themeToggleBtnDesktop.addEventListener('click', toggleTheme);
    if(themeToggleBtnMobile) themeToggleBtnMobile.addEventListener('click', toggleTheme);

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        // Toggle dark-nav transition class
        if (window.scrollY > 30) {
            navbar.classList.add('nav-scrolled');
        } else {
            navbar.classList.remove('nav-scrolled');
        }
    });

    // --- Mobile Menu Logic ---
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        if(isMenuOpen) {
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('flex');
            // small delay to allow display flex to apply before transitioning opacity
            setTimeout(() => {
                mobileMenu.classList.remove('opacity-0');
                mobileMenu.classList.add('opacity-100');
            }, 10);
            menuToggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
            document.body.style.overflow = 'hidden';
        } else {
            mobileMenu.classList.remove('opacity-100');
            mobileMenu.classList.add('opacity-0');
            setTimeout(() => {
                mobileMenu.classList.remove('flex');
                mobileMenu.classList.add('hidden');
            }, 300); // match duration
            menuToggle.innerHTML = '<i class="fa-solid fa-bars-staggered"></i>';
            document.body.style.overflow = '';
        }
    }

    menuToggle.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if(isMenuOpen) toggleMenu();
        });
    });

    // --- Intersection Observer for gentle scroll reveals ---
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('active');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.slide-up, .fade-in');
    
    // Quick load for items already in viewport
    setTimeout(() => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if(rect.top < window.innerHeight) {
                el.classList.add('active');
            } else {
                observer.observe(el);
            }
        });
    }, 100);

    // --- Modal Logic ---
    const customizeBtn = document.getElementById('customize-btn');
    const contactModal = document.getElementById('contact-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cardContent = document.getElementById('card-content');

    function openModal(e) {
        if(e) e.preventDefault();
        contactModal.classList.remove('hidden');
        contactModal.classList.add('flex');
        
        // Small delay to allow display flex to apply before opacity transition
        setTimeout(() => {
            contactModal.classList.remove('opacity-0');
            contactModal.classList.add('opacity-100');
            cardContent.classList.remove('scale-95');
            cardContent.classList.add('scale-100');
        }, 10);
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        contactModal.classList.remove('opacity-100');
        contactModal.classList.add('opacity-0');
        cardContent.classList.remove('scale-100');
        cardContent.classList.add('scale-95');
        
        setTimeout(() => {
            contactModal.classList.remove('flex');
            contactModal.classList.add('hidden');
        }, 300);
        document.body.style.overflow = '';
    }

    if (customizeBtn) {
        customizeBtn.addEventListener('click', openModal);
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (contactModal) {
        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) {
                closeModal();
            }
        });
    }

});
