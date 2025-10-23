document.addEventListener('DOMContentLoaded', () => {
    
    // ------------------------------------------
    // Selectores Globales y Elementos del Header
    // ------------------------------------------
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const iconOpen = document.getElementById('icon-open');
    const iconClose = document.getElementById('icon-close');
    const allMobileLinks = document.querySelectorAll('#mobile-menu a'); 
    
    // Selectores para los botones de submenú móvil
    const qsBtn = document.getElementById('qs-btn');
    const qsSubmenu = document.getElementById('qs-submenu');
    const nivelesBtn = document.getElementById('niveles-btn');
    const nivelesSubmenu = document.getElementById('niveles-submenu');

    // ------------------------------------------
    // Función de Cierre de Menú (para reutilizar)
    // ------------------------------------------
    const closeMobileMenu = () => {
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
            if (iconOpen && iconClose) {
                iconOpen.classList.remove('hidden'); 
                iconClose.classList.add('hidden'); 
            }
            // Asegura que todos los submenús se cierren al cerrar el menú principal
            document.querySelectorAll('.mobile-submenu').forEach(sub => {
                sub.classList.add('hidden');
                // Nota: Los botones asociados también deberían tener aria-expanded="false",
                // pero lo controlaremos solo en los botones que tienen setupButtonToggle.
            });
        }
    };


    // ------------------------------------------
    // Lógica del Patrón "Clic para Desplegar, Clic para Navegar"
    // ------------------------------------------

    /**
     * @param {HTMLElement} button - El botón de menú (ej: qsBtn).
     * @param {HTMLElement} submenu - El div del submenú.
     * @param {string} targetUrl - La URL a navegar si ya está desplegado.
     */
    const setupButtonToggle = (button, submenu, targetUrl) => {
        if (button && submenu) {
            button.addEventListener('click', (e) => {
                e.preventDefault(); 
                const isCurrentlyExpanded = button.getAttribute('aria-expanded') === 'true';

                if (isCurrentlyExpanded) {
                    // Si ya está abierto (segundo clic): NAVEGAR
                    closeMobileMenu(); 
                    window.location.href = targetUrl; 
                    return;
                }

                // Si está cerrado (primer clic): DESPLEGAR

                // 1. Cierra todos los demás submenús abiertos y actualiza su estado ARIA
                document.querySelectorAll('.mobile-submenu').forEach(otherSubmenu => {
                    if (otherSubmenu !== submenu && !otherSubmenu.classList.contains('hidden')) {
                        otherSubmenu.classList.add('hidden');
                        const associatedButton = otherSubmenu.previousElementSibling;
                        if (associatedButton && associatedButton.tagName === 'BUTTON') {
                           associatedButton.setAttribute('aria-expanded', 'false');
                        }
                    }
                });

                // 2. Despliega el submenú actual y actualiza ARIA
                submenu.classList.remove('hidden');
                button.setAttribute('aria-expanded', 'true');
            });
        }
    };
    
    
    // Aplicación de la lógica a los botones con su URL de destino
    setupButtonToggle(qsBtn, qsSubmenu, 'quienes-somos.html');
    setupButtonToggle(nivelesBtn, nivelesSubmenu, 'index.html#niveles'); 
    
   
    // Manejo del menú principal (Hamburguesa)
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden'); 
            const isExpanded = mobileMenu.classList.contains('hidden'); // true si está CERRADO
            
            if (iconOpen && iconClose) {
                iconOpen.classList.toggle('hidden');
                iconClose.classList.toggle('hidden');
            }
            // El aria-expanded del botón menú ahora refleja si está ABIERTO
            menuBtn.setAttribute('aria-expanded', String(!isExpanded));
        });
    }

    // CERRAR MENÚ AL HACER CLIC en cualquier ENLACE (incluyendo submenú y enlaces directos)
    allMobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Permite que el enlace navegue, y luego cierra el menú
            setTimeout(closeMobileMenu, 150); 
        });
    });
    
    // ------------------------------------------
    // 4. Script para el scroll suave (Ajustado el cierre del menú)
    // ------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            const headerHeight = document.querySelector('.main-header')?.offsetHeight || 0;
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
                
                // Cierra el menú DESPUÉS de hacer scroll a una ancla
                closeMobileMenu();
            }
        });
    });

   
    function handleScrollHeader() {
        const header = document.querySelector('.main-header');
        if (!header) return; 

        const scrollThreshold = 50; 

        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', handleScrollHeader);
    window.addEventListener('DOMContentLoaded', handleScrollHeader); 


});


    // ------------------------------------------
    // 2. Lógica del Carrusel (Unificado)
    // ------------------------------------------

    /**
     * Inicializa un carrusel.
     * @param {string} id - Prefijo del ID (ej: 'historia')
     */
    function initCarousel(id) {
        const carousel = document.getElementById(`${id}-carousel`);
        const prevButton = document.getElementById(`${id}-prev`);
        const nextButton = document.getElementById(`${id}-next`);
        const dotsContainer = document.getElementById(`${id}-dots`);

        if (!carousel || !prevButton || !nextButton) return;

        const slides = carousel.querySelectorAll('.carousel-slide'); // Usamos la clase CSS
        const totalSlides = slides.length;
        let currentIndex = 0;
        const autoplayDuration = 4000;

        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot'); // Usamos una clase CSS
                dot.setAttribute('aria-label', `Ir a diapositiva ${i + 1}`);
                dot.addEventListener('click', () => moveToSlide(i));
                dotsContainer.appendChild(dot);
            }
        }
        const dots = dotsContainer ? dotsContainer.querySelectorAll('.carousel-dot') : [];


        const updateCarousel = () => {
            const containerWidth = carousel.parentElement.clientWidth; 
            carousel.style.transform = `translateX(-${currentIndex * containerWidth}px)`;
            
            // Actualizar dots (asumiendo clases CSS definidas en style.css)
            dots.forEach((dot, index) => {
                dot.classList.toggle('dot-active', index === currentIndex);
                dot.classList.toggle('dot-inactive', index !== currentIndex);
            });
        };

        const moveToSlide = (index) => {
            currentIndex = (index + totalSlides) % totalSlides;
            updateCarousel();
        }

        prevButton.addEventListener('click', () => moveToSlide(currentIndex - 1));
        nextButton.addEventListener('click', () => moveToSlide(currentIndex + 1));
        
        let autoPlayInterval = setInterval(() => moveToSlide(currentIndex + 1), autoplayDuration);

        carousel.parentElement.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        carousel.parentElement.addEventListener('mouseleave', () => {
            autoPlayInterval = setInterval(() => moveToSlide(currentIndex + 1), autoplayDuration);
        });

        updateCarousel();
        window.addEventListener('resize', updateCarousel);
    }
    
    // Inicialización al cargar la ventana
    window.addEventListener('load', () => {
        initCarousel('historia');
        initCarousel('infra'); 
        // Agrega otras inicializaciones de carrusel si es necesario
    });


    // ------------------------------------------
    // 3. Script para el scroll suave
    // ------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            const headerHeight = document.querySelector('.main-header')?.offsetHeight || 0; // Usamos la clase CSS
            
            if (targetElement) {
                // Scroll manual con offset para compensar el header fijo
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
                
                // Oculta el menú móvil si está abierto
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
                    if (iconOpen && iconClose) {
                        iconOpen.classList.remove('menu-icon-close');
                        iconClose.classList.add('menu-icon-close');
                    }
                }
            }
        });
    });

    // ------------------------------------------
    // 5. Lógica de Cambio de Header al hacer Scroll
    // ------------------------------------------
    function handleScrollHeader() {
        const header = document.querySelector('.main-header');
        if (!header) return; 

        // Define cuántos píxeles debe bajar antes de cambiar el color
        const scrollThreshold = 50; 

        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Escuchar el evento de scroll en la ventana
    window.addEventListener('scroll', handleScrollHeader);
    window.addEventListener('DOMContentLoaded', handleScrollHeader); 
