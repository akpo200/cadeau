import './style.css'
import '@fontsource/playfair-display';
import '@fontsource/montserrat';

// --- CONFIGURATION ---
const PHONE_NUMBER = "221760258373"; // Format international sans '+'
const BASE_MSG = "Bonjour, je souhaite commander le magazine cadeau.";

// --- DOM ELEMENTS ---
const whatsappLinks = document.querySelectorAll('.whatsapp-link');
const revealElements = document.querySelectorAll('.reveal');

// --- AMBASSADOR SYSTEM ---
function getAmbassadorRef() {
    const urlParams = new URLSearchParams(window.location.search);
    // Check for 'ref' or 'ambassadeur' or 'code'
    return urlParams.get('ref') || urlParams.get('ambassadeur') || urlParams.get('code');
}

function updateWhatsappLinks() {
    const ref = getAmbassadorRef();
    let message = BASE_MSG;

    if (ref) {
        message += ` (Code Ambassadeur: ${ref})`;
        // Store in session storage to persist during navigation if we had multiple pages
        sessionStorage.setItem('cadeau_ambassadeur', ref);
    } else {
        // Check session storage just in case
        const storedRef = sessionStorage.getItem('cadeau_ambassadeur');
        if (storedRef) {
            message += ` (Code Ambassadeur: ${storedRef})`;
        }
    }

    const encodedMsg = encodeURIComponent(message);
    const waUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodedMsg}`;

    whatsappLinks.forEach(link => {
        link.href = waUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
    });
}

// --- SCROLL ANIMATIONS (Intersection Observer) ---
const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Optional: stop observing once visible
            // observer.unobserve(entry.target);
        }
    });
}, observerOptions);

revealElements.forEach(el => observer.observe(el));

// --- INITIALIZATION ---
// --- INITIALIZATION ---
window.addEventListener('DOMContentLoaded', () => {
    updateWhatsappLinks();

    // Ambassador Generator Logic
    const generateBtn = document.getElementById('generateBtn');
    const nameInput = document.getElementById('ambassadorName');
    const feedbackMsg = document.getElementById('feedbackMsg');

    if (generateBtn && nameInput) {
        generateBtn.addEventListener('click', () => {
            // Basic sanitation
            const name = nameInput.value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');

            if (name.length < 2) {
                feedbackMsg.textContent = "Veuillez entrer un prénom valide (min 2 lettres).";
                feedbackMsg.style.color = "red";
                return;
            }

            // ALWAYS point to the homepage (root)
            const origin = window.location.origin;
            const link = `${origin}/?ref=${name}`;

            navigator.clipboard.writeText(link).then(() => {
                feedbackMsg.textContent = `✅ Lien copié ! Partagez-le partout.`;
                feedbackMsg.style.color = "#4CAF50"; // Green for success
                const originalText = generateBtn.textContent;
                generateBtn.textContent = "COPIÉ !";
                setTimeout(() => { generateBtn.textContent = originalText; }, 2000);
            }).catch((err) => {
                console.error('Erreur copie:', err);
                feedbackMsg.textContent = `Sélectionnez et copiez ce lien : ${link}`;
                feedbackMsg.style.color = "#fff";
                // Select the text for manual copy if possible (fallback)
                nameInput.value = link;
                nameInput.select();
            });
        });
    }

    // Ambassador Logic Specific Link
    const ambLink = document.querySelector('.whatsapp-ambassador-link');
    if (ambLink) {
        const msg = encodeURIComponent("Bonjour, je souhaite avoir plus d'infos sur le programme Ambassadeur CADEAU.");
        ambLink.href = `https://wa.me/${PHONE_NUMBER}?text=${msg}`;
        ambLink.target = "_blank";
    }

    console.log('Cadeau App Initialized');
});
