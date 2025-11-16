/*=============== CLOSE ALL DROPDOWNS ===============*/
function closeAllDropdowns() {
    // Close nav menu
    const navMenu = document.getElementById("nav-menu");
    if (navMenu) {
        navMenu.classList.remove("show-menu");
    }
    
    // Close language switcher
    const languageSwitcher = document.getElementById("language-switcher");
    if (languageSwitcher) {
        languageSwitcher.classList.remove("active");
    }
    
    // Close theme sidebar
    const themeSidebar = document.getElementById("theme-sidebar");
    if (themeSidebar && themeSidebar.classList.contains("open")) {
        themeSidebar.classList.remove("open");
        document.body.style.overflow = '';
    }
}

/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById("nav-menu"),
    navToggle = document.getElementById("nav-toggle"),
    navClose = document.getElementById("nav-close");

/* Menu show */
if (navToggle) {
    navToggle.addEventListener("click", () => {
        // Close other dropdowns first
        const languageSwitcher = document.getElementById("language-switcher");
        if (languageSwitcher) {
            languageSwitcher.classList.remove("active");
        }
        const themeSidebar = document.getElementById("theme-sidebar");
        if (themeSidebar && themeSidebar.classList.contains("open")) {
            themeSidebar.classList.remove("open");
            document.body.style.overflow = '';
        }
        
        // Then open nav menu
        navMenu.classList.add("show-menu");
    });
}

/* Menu hidden */
if (navClose) {
    navClose.addEventListener("click", () => {
        navMenu.classList.remove("show-menu");
    });
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll(".nav__link");

const linkAction = () => {
    const navMenu = document.getElementById("nav-menu");
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove("show-menu");
};
navLink.forEach((n) => n.addEventListener("click", linkAction));

/*=============== SHADOW HEADER ===============*/
const shadowHeader = () => {
    const header = document.getElementById('header')
    // Add a class if the bottom offset is greater than 50 of the viewport
    this.scrollY >= 50 ? header.classList.add('shadow-header')
        : header.classList.remove('shadow-header')
}
window.addEventListener('scroll', shadowHeader)

/*=============== EMAIL JS ===============*/
const contactForm = document.getElementById('contact-form'),
    contactMessage = document.getElementById('contact-message')

const sendEmail = (e) => {
    e.preventDefault()

    // serviceID - templateID - #form - publicKey
    emailjs.sendForm('service_nbwc1dd', 'template_e5fsgkp', '#contact-form', 'fafKKYW9GFTrxFYv3').then(() => {
        // Show sent message
        contactMessage.textContent = 'Message sent successfully ✅'

        // Remove message after five seconds
        setTimeout(() => {
            contactMessage.textContent = ''
        }, 5000)

        // Clear form
        contactForm.reset()
    }, () => {
        // Show error message
        contactMessage.textContent = 'Message not sent (service error) ❌'
    })
}

contactForm.addEventListener('submit', sendEmail)

/*=============== SHOW SCROLL UP ===============*/
const scrollUp = () => {
    const scrollUp = document.getElementById('scroll-up')
    this.scrollY >= 350 ? scrollUp.classList.add('show-scroll')
        : scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]')

const scrollActive = () => {
    const scrollDown = window.scrollY

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight,
            sectionTop = current.offsetTop - 200, // Increased offset for better detection
            sectionId = current.getAttribute('id'),
            sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')

        if (sectionsClass) {
            if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
                sectionsClass.classList.add('active-link')
            } else {
                sectionsClass.classList.remove('active-link')
            }
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2500,
    delay: 400,
    // reset: true
})

sr.reveal(`.home__perfil, .contact__mail`, {origin: 'right'})
sr.reveal(`.home__name, .home__info, .about__container, .about__image, .section__title-1, .about__info, .contact__social, .contact__data`, {origin: 'left'})
sr.reveal(`.services__card, .projects__card`, {interval: 100})
sr.reveal(`.testimonials__gallery`, {origin: 'bottom'})

/*=============== TESTIMONIALS CIRCULAR GALLERY ===============*/
const testimonialsTrack = document.querySelector('.testimonials__track');

// Clone testimonial cards to create seamless infinite scroll
if (testimonialsTrack) {
    const cards = Array.from(testimonialsTrack.children);
    const originalCardsCount = cards.length;
    
    // Clone all cards exactly once to create seamless loop
    // When animation reaches -50%, it will show the cloned set
    // which looks identical to the original, creating seamless effect
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        testimonialsTrack.appendChild(clone);
    });
    
    console.log(`Testimonials: ${originalCardsCount} original cards + ${originalCardsCount} cloned = ${testimonialsTrack.children.length} total`);
}

