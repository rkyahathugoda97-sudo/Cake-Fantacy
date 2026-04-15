document.addEventListener('DOMContentLoaded', () => {

    // --- Dynamic Images ---
    const imageMap = {
        'hero-img': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1089&auto=format&fit=crop', // Unsplash dark cake (placeholder)
        'kitchen-img': 'assets/kitchen_baking.png', // The generated kitchen image
        'cake-1-img': 'https://images.unsplash.com/photo-1606890737302-7c3d2e5b7b9f?q=80&w=1024&auto=format&fit=crop', // Unsplash Chocolate cake
        'cake-2-img': 'assets/red_velvet.png', // Red velvet
        'cake-3-img': 'assets/fruit_cake.png' // Fruit cake
    };

    for (const [id, src] of Object.entries(imageMap)) {
        const el = document.getElementById(id);
        if(el) el.src = src;
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
                mobileMenu.classList.add('hidden');
            }, 300); // match duration
            menuToggle.innerHTML = '<i class="fa-solid fa-bars-staggered"></i>';
            document.body.style.overflow = 'auto';
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

});
