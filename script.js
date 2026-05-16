
// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // MOBILE MENU TOGGLE LOGIC
    // =========================================
    const btn = document.getElementById('mobile-menu-btn');
    const drawer = document.getElementById('mobile-menu-drawer');
    const iconMenu = document.getElementById('icon-menu');
    const iconClose = document.getElementById('icon-close');

    if (btn && drawer && iconMenu && iconClose) {
        btn.addEventListener('click', () => {
            // Toggle visibility of the mobile menu drawer
            drawer.classList.toggle('hidden');

            // Prevent body scrolling when menu is open
            document.body.style.overflow = drawer.classList.contains('hidden') ? 'auto' : 'hidden';

            // Swap Hamburger and Close icons
            iconMenu.classList.toggle('hidden');
            iconClose.classList.toggle('hidden');
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

    // Initialize drag-to-scroll for both sliders
    enableDragScroll('testimonial-slider');
    enableDragScroll('ngo-slider');
});