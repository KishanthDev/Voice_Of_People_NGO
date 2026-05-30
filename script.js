document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // MOBILE MENU TOGGLE LOGIC
    // =========================================
    const btn = document.getElementById('mobile-menu-btn');
    const drawer = document.getElementById('mobile-menu-drawer');
    const iconMenu = document.getElementById('icon-menu');
    const iconClose = document.getElementById('icon-close');

    if (btn && drawer && iconMenu && iconClose) {

        // Helper function to close the menu
        const closeMobileMenu = () => {
            drawer.classList.add('hidden');
            document.body.style.overflow = 'auto'; // Restore scrolling
            iconMenu.classList.remove('hidden');
            iconClose.classList.add('hidden');
        };

        // 1. Toggle on hamburger click
        btn.addEventListener('click', () => {
            drawer.classList.toggle('hidden');
            document.body.style.overflow = drawer.classList.contains('hidden') ? 'auto' : 'hidden';
            iconMenu.classList.toggle('hidden');
            iconClose.classList.toggle('hidden');
        });

        // 2. Close on any link click inside the drawer
        const mobileLinks = drawer.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }


    // =========================================
    // FAQ ACCORDION LOGIC
    // =========================================
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const iconPlus = item.querySelector('.icon-plus');
        const iconMinus = item.querySelector('.icon-minus');

        if (header && iconPlus && iconMinus) {
            header.addEventListener('click', () => {
                const isOpen = item.classList.contains('is-open');

                // Close all other accordions when one is opened
                accordionItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('is-open');
                        otherItem.querySelector('.icon-plus').classList.remove('hidden');
                        otherItem.querySelector('.icon-minus').classList.add('hidden');
                        // Reset text color for inactive headers
                        const otherHeaderSpan = otherItem.querySelector('.accordion-header span:first-child');
                        if (otherHeaderSpan) {
                            otherHeaderSpan.classList.remove('text-[#E7424B]');
                        }
                    }
                });

                // Toggle current accordion
                item.classList.toggle('is-open');
                iconPlus.classList.toggle('hidden');
                iconMinus.classList.toggle('hidden');

                // Add/remove active color state to the clicked header text
                const headerSpan = header.querySelector('span:first-child');
                if (headerSpan) {
                    headerSpan.classList.toggle('text-[#E7424B]', !isOpen);
                }
            });
        }
    });


    // =========================================
    // DRAG-TO-SCROLL LOGIC FOR SLIDERS
    // =========================================
    function enableDragScroll(sliderId) {
        const slider = document.getElementById(sliderId);
        if (!slider) return;

        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active'); // Disables smooth scroll for 1:1 dragging
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        slider.addEventListener('mouseleave', () => { isDown = false; slider.classList.remove('active'); });
        slider.addEventListener('mouseup', () => { isDown = false; slider.classList.remove('active'); });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 1.5; // Scroll speed multiplier
            slider.scrollLeft = scrollLeft - walk;
        });
    }

    enableDragScroll('testimonial-slider');
    enableDragScroll('ngo-slider');
    enableDragScroll('hero-slider');

    // =========================================
    // INFINITE HERO BANNER SLIDER LOGIC
    // =========================================
    const heroSlider = document.getElementById('hero-slider');
    const originalSlides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dots = document.querySelectorAll('.dot');

    if (heroSlider && originalSlides.length > 0 && prevBtn && nextBtn && dots.length > 0) {

        // 1. CLONE SLIDES FOR INFINITY
        // Clone the first and last slides
        const firstClone = originalSlides[0].cloneNode(true);
        const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);

        // Append to the end, prepend to the beginning
        heroSlider.appendChild(firstClone);
        heroSlider.insertBefore(lastClone, originalSlides[0]);

        // Re-query all slides including the newly added clones
        const allSlides = document.querySelectorAll('.slide');

        // Wait a brief moment for the DOM to render the clones before calculating widths
        setTimeout(() => {
            const slideWidth = allSlides[0].offsetWidth;
            const gap = allSlides.length > 1 ? allSlides[1].offsetLeft - allSlides[0].offsetLeft - slideWidth : 0;
            const slidePlusGap = slideWidth + gap;

            // 2. SET INITIAL POSITION
            // Start at the first REAL slide (index 1), skipping the prepended clone
            heroSlider.style.scrollBehavior = 'auto'; // Disable animation for the setup jump
            heroSlider.scrollLeft = slidePlusGap;

            // Re-enable smooth behavior for user interactions
            setTimeout(() => heroSlider.style.scrollBehavior = 'smooth', 50);

            // 3. NAVIGATION FUNCTIONS
            const scrollToSlide = (index) => {
                // Add 1 to the index to account for the prepended clone
                const scrollPosition = (index + 1) * slidePlusGap;
                heroSlider.scrollTo({ left: scrollPosition, behavior: 'smooth' });
            };

            const updateDots = () => {
                // Calculate physical index
                const currentIndex = Math.round(heroSlider.scrollLeft / slidePlusGap);

                // Map physical index back to the logical dot index
                let dotIndex = currentIndex - 1;
                if (dotIndex < 0) dotIndex = originalSlides.length - 1; // If on left clone, highlight last dot
                if (dotIndex >= originalSlides.length) dotIndex = 0;    // If on right clone, highlight first dot

                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === dotIndex);
                });
            };

            // 4. THE MAGIC: SILENT JUMPS
            const handleScrollJumps = () => {
                const scrollLeft = heroSlider.scrollLeft;
                const maxScroll = heroSlider.scrollWidth - heroSlider.clientWidth;

                // If user scrolls to the cloned first slide (at the very end)
                if (scrollLeft >= maxScroll - 10) {
                    heroSlider.style.scrollBehavior = 'auto'; // Disable smooth scroll
                    heroSlider.classList.remove('snap-x', 'snap-mandatory'); // Disable snapping

                    heroSlider.scrollLeft = slidePlusGap; // Jump back to real first slide

                    // Force DOM reflow, then re-enable smooth/snap
                    void heroSlider.offsetWidth;
                    heroSlider.style.scrollBehavior = 'smooth';
                    heroSlider.classList.add('snap-x', 'snap-mandatory');
                }
                // If user scrolls to the cloned last slide (at the very beginning)
                else if (scrollLeft <= 10) {
                    heroSlider.style.scrollBehavior = 'auto';
                    heroSlider.classList.remove('snap-x', 'snap-mandatory');

                    heroSlider.scrollLeft = slidePlusGap * originalSlides.length; // Jump to real last slide

                    void heroSlider.offsetWidth;
                    heroSlider.style.scrollBehavior = 'smooth';
                    heroSlider.classList.add('snap-x', 'snap-mandatory');
                }
            };

            // 5. EVENT LISTENERS
            prevBtn.addEventListener('click', () => {
                heroSlider.scrollBy({ left: -slidePlusGap, behavior: 'smooth' });
            });

            nextBtn.addEventListener('click', () => {
                heroSlider.scrollBy({ left: slidePlusGap, behavior: 'smooth' });
            });

            dots.forEach(dot => {
                dot.addEventListener('click', (e) => {
                    const index = parseInt(e.target.getAttribute('data-index'));
                    scrollToSlide(index);
                });
            });

            // Use a debounce on the scroll event to trigger the silent jump safely
            let scrollTimeout;
            heroSlider.addEventListener('scroll', () => {
                updateDots();
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(handleScrollJumps, 150); // Fires after snapping finishes
            });

            // 6. AUTOPLAY
            let autoPlayInterval;
            const startAutoPlay = () => {
                clearInterval(autoPlayInterval);
                autoPlayInterval = setInterval(() => {
                    heroSlider.scrollBy({ left: slidePlusGap, behavior: 'smooth' });
                }, 5000); // 5 seconds
            };

            heroSlider.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
            heroSlider.addEventListener('mouseleave', startAutoPlay);

            startAutoPlay();
            updateDots();

        }, 100); // 100ms timeout ensures CSS constraints are painted before calculating widths
    }
});