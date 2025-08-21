// Script para el menú hamburguesa y submenús móviles
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const qsBtn = document.getElementById('qs-btn');
const qsSubmenu = document.getElementById('qs-submenu');
const nivelesBtn = document.getElementById('niveles-btn');
const nivelesSubmenu = document.getElementById('niveles-submenu');

menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

qsBtn.addEventListener('click', () => {
    const isExpanded = qsBtn.getAttribute('aria-expanded') === 'true';
    qsBtn.setAttribute('aria-expanded', !isExpanded);
    qsSubmenu.classList.toggle('hidden');
});

nivelesBtn.addEventListener('click', () => {
    const isExpanded = nivelesBtn.getAttribute('aria-expanded') === 'true';
    nivelesBtn.setAttribute('aria-expanded', !isExpanded);
    nivelesSubmenu.classList.toggle('hidden');
});

// Script para el carrusel
const carousel = document.getElementById('carousel');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
if (carousel && prevBtn && nextBtn) {
    const totalSlides = carousel.children.length;
    let currentIndex = 0;

    function updateCarousel() {
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateCarousel();
    });

    // Movimiento automático cada 3 segundos
    setInterval(() => {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
    }, 3000);
}


// Script para el formulario de contacto (si lo agregas)
// Revisa que el formulario con ID "contactForm" exista antes de ejecutar
const contactForm = document.getElementById("contactForm");
if (contactForm) {
    contactForm.addEventListener("submit", function(e) {
        e.preventDefault();

        fetch("https://script.google.com/macros/s/AKfycbxnFIoALyRnSmnw4HMN82tLadWNHWAmoObE5gwACMbjziDbw29pAAHQYOAn1yy6mDk2zA/exec", {
                method: "POST",
                body: JSON.stringify({
                    nombre: this.nombre.value,
                    email: this.email.value,
                    mensaje: this.mensaje.value
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(res => {
                if (res.ok) {
                    alert("¡Formulario enviado con éxito!");
                    this.reset();
                } else {
                    alert("Hubo un error al enviar");
                }
            })
            .catch(err => alert("Error de conexión"));
    });
}


// Script para el scroll suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
            // Oculta el menú móvil si está abierto
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        }
    });
});