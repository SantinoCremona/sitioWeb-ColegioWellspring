document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------------
    // 1. Lógica del Menú Móvil (Hamburguesa y Submenús)
    // ------------------------------------------
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const iconOpen = document.getElementById('icon-open'); // Asumiendo que usas los iconos de cerrar/abrir
    const iconClose = document.getElementById('icon-close'); // Asumiendo que usas los iconos de cerrar/abrir

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
            
            // Toggle del menú principal
            if (isExpanded) {
                mobileMenu.classList.add('hidden');
                if (iconOpen && iconClose) {
                    iconOpen.classList.remove('hidden');
                    iconClose.classList.add('hidden');
                }
                menuBtn.setAttribute('aria-expanded', 'false');
            } else {
                mobileMenu.classList.remove('hidden');
                if (iconOpen && iconClose) {
                    iconOpen.classList.add('hidden');
                    iconClose.classList.remove('hidden');
                }
                menuBtn.setAttribute('aria-expanded', 'true');
            }
            
            // Opcional: Asegura que los submenús se cierren o abran según la lógica de enlaces
            document.getElementById('qs-submenu')?.classList.remove('hidden');
            document.getElementById('niveles-submenu')?.classList.remove('hidden');
        });

        // Lógica de Toggle para los submenús (usando los enlaces principales en el móvil)
        const qsLink = mobileMenu.querySelector('a[href="quienes-somos.html"]');
        const qsSubmenu = document.getElementById('qs-submenu');
        const academicLink = mobileMenu.querySelector('a[href="#"]'); // Ajusta este selector si es necesario
        const nivelesSubmenu = document.getElementById('niveles-submenu');

        const setupSubmenuToggle = (link, submenu) => {
            if (link && submenu) {
                link.addEventListener('click', (e) => {
                    // Evita la navegación si estamos en la página y queremos hacer toggle
                    const isCurrentPage = window.location.pathname.includes('quienes-somos.html') && link.href.includes('quienes-somos.html') && link.href.split('#').length === 1;
                    const isPlaceholderLink = link.getAttribute('href') === '#';

                    if (isCurrentPage || isPlaceholderLink) {
                        e.preventDefault(); 
                        submenu.classList.toggle('hidden');
                    }
                });
            }
        };

        setupSubmenuToggle(qsLink, qsSubmenu);
        setupSubmenuToggle(academicLink, nivelesSubmenu);
    }
    
    // ------------------------------------------
    // 2. Lógica del Carrusel (Unificado y Mejorado)
    // ------------------------------------------

    /**
     * Inicializa un carrusel. Se llama al cargar la ventana para asegurar el ancho correcto.
     * @param {string} id - Prefijo del ID (ej: 'historia')
     */
    function initCarousel(id) {
        const carousel = document.getElementById(`${id}-carousel`);
        const prevButton = document.getElementById(`${id}-prev`);
        const nextButton = document.getElementById(`${id}-next`);
        const dotsContainer = document.getElementById(`${id}-dots`); // Asumiendo que tienes dots

        if (!carousel || !prevButton || !nextButton) return;

        const slides = carousel.querySelectorAll('img');
        const totalSlides = slides.length;
        let currentIndex = 0;
        const autoplayDuration = 4000; // 4 segundos

        // Crear los Dots (si el contenedor existe)
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('button');
                dot.classList.add('h-3', 'w-3', 'rounded-full', 'mx-1', 'transition-colors', 'duration-300', 'bg-gray-300');
                dot.setAttribute('aria-label', `Ir a diapositiva ${i + 1}`);
                dot.addEventListener('click', () => moveToSlide(i));
                dotsContainer.appendChild(dot);
            }
        }
        const dots = dotsContainer ? dotsContainer.querySelectorAll('button') : [];


        // Función principal de actualización
        const updateCarousel = () => {
            // Usa el ancho del contenedor padre para manejar la responsividad.
            const containerWidth = carousel.parentElement.clientWidth; 
            carousel.style.transform = `translateX(-${currentIndex * containerWidth}px)`;
            
            // Actualizar dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('bg-secondary', index === currentIndex);
                dot.classList.toggle('bg-gray-300', index !== currentIndex);
            });
        };

        const moveToSlide = (index) => {
            currentIndex = (index + totalSlides) % totalSlides; // Asegura que el índice sea válido
            updateCarousel();
        }

        // Navegación
        prevButton.addEventListener('click', () => moveToSlide(currentIndex - 1));
        nextButton.addEventListener('click', () => moveToSlide(currentIndex + 1));
        
        // Autoplay
        let autoPlayInterval = setInterval(() => moveToSlide(currentIndex + 1), autoplayDuration);

        // Pausar autoplay al interactuar (Mejora de UX)
        carousel.parentElement.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        carousel.parentElement.addEventListener('mouseleave', () => {
            autoPlayInterval = setInterval(() => moveToSlide(currentIndex + 1), autoplayDuration);
        });

        // Manejo de redimensionamiento
        updateCarousel(); // Llamada inicial
        window.addEventListener('resize', updateCarousel);
    }
    
    // Inicializar el carrusel de historia (usando 'historia' como ID)
    // Se usa 'load' para asegurar que las imágenes tengan un ancho definido.
    window.addEventListener('load', () => {
        initCarousel('historia');
        initCarousel('infra'); 
    });

    // NOTA: Si tienes OTRO carrusel con ID 'carousel' (y botones 'prev'/'next'),
    // descomenta la siguiente línea y asegúrate que sus IDs en HTML sean:

    // ------------------------------------------
    // 3. Script para el scroll suave
    // ------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            const headerHeight = document.querySelector('header')?.offsetHeight || 0;
            
            if (targetElement) {
                // Scroll manual con offset para compensar el header fijo
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
                
                // Oculta el menú móvil si está abierto
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    // Opcional: restablece los iconos del menú
                    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
                    if (iconOpen && iconClose) {
                        iconOpen.classList.remove('hidden');
                        iconClose.classList.add('hidden');
                    }
                }
            }
        });
    });

    // ------------------------------------------
    // 4. Script para el formulario de contacto (Fetch API)
    // ------------------------------------------
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", function(e) {
            e.preventDefault();
            
            // Deshabilita el botón mientras se envía para evitar doble envío
            const submitButton = contactForm.querySelector('button[type="submit"]');
            if(submitButton) submitButton.disabled = true;

            // Recopilar datos del formulario
            const formData = {
                nombre: this.nombre.value,
                email: this.email.value,
                mensaje: this.mensaje.value
            };

            fetch("https://script.google.com/macros/s/AKfycbxnFIoALyRnSmnw4HMN82tLadWNHWAmoObE5gwACMbjziDbw29pAAHQYOAn1yy6mDk2zA/exec", {
                    method: "POST",
                    body: JSON.stringify(formData),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                .then(res => {
                    if (res.ok) {
                        alert("¡Formulario enviado con éxito! Nos pondremos en contacto pronto.");
                        this.reset();
                    } else {
                        // Intentar leer la respuesta de error si el estado no es OK
                        return res.text().then(text => Promise.reject(new Error(text)));
                    }
                })
                .catch(err => alert("Error al enviar el formulario o de conexión. Intente más tarde."))
                .finally(() => {
                     // Reactiva el botón
                     if(submitButton) submitButton.disabled = false;
                });
        });
    }
});
