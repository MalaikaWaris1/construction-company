const navlinks = document.querySelectorAll('.nav-links a');
const sliderImage = document.getElementById('slider-img');
const cards = document.querySelectorAll('.team-card');

const API_BASE_URL = "http://localhost:8000/api";

// --- 🟢 ALL DOM DEPENDENT LOGIC GOES HERE ---
document.addEventListener("DOMContentLoaded", () => {
    
    // Mobile Menu Logic
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const navMenu = document.getElementById("nav-menu");

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener("click", () => {
            navMenu.classList.toggle("active");
            mobileMenuBtn.classList.toggle("open");
        });

        const navLinks = navMenu.querySelectorAll("a");
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("active");
                mobileMenuBtn.classList.remove("open");
            });
        });
    }

    // --- NEWSLETTER LIVE SUBMISSION (Safe & Connected) ---
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Humne specific ID se input target kiya hai taake error na aaye
            const emailInput = document.getElementById('newsletter-email-input');
            const emailValue = emailInput ? emailInput.value.trim() : "";

            if (!emailValue) return;

            try {
                // Backend API Call
                const response = await fetch(`${API_BASE_URL}/newsletter`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: emailValue })
                });

                const data = await response.json();

                if (response.ok) {
                    alert(`Thank you! "${emailValue}" has been subscribed successfully. 🎉`);
                    this.reset(); // Input field clear karne ke liye
                } else {
                    alert(data.message || "Subscription failed. Try again.");
                }
            } catch (error) {
                console.error("Newsletter Connection Error:", error);
                alert("Server down! Could not subscribe.");
            }
        });
    }
});

// 1. Navigation Links Smooth Scroll & Active State Logic
navlinks.forEach(link => {
    link.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');

        if (targetId && targetId.startsWith('#')) {
            e.preventDefault();
            navlinks.forEach(item => item.classList.remove("active"));
            this.classList.add('active');

            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// 2. Construction Slider Images Array
const constructionImages = [
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
    "https://plus.unsplash.com/premium_photo-1670315264879-59cc6b15db5f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8b2ZmaWNlJTIwYnVpbGRpbmd8ZW58MHx8MHx8fDA%3D",
    "https://img.magnific.com/free-photo/observation-urban-building-business-steel_1127-2397.jpg?semt=ais_hybrid&w=740&q=80",
];

let currentIndex = 0;
function changeImage() {
    if (!sliderImage) return;
       
    sliderImage.classList.add('image-hidden');

    setTimeout(() => {
        currentIndex = (currentIndex + 1) % constructionImages.length;
        const tempImage = new Image();
        tempImage.src = constructionImages[currentIndex];

        tempImage.onload = () => {
            sliderImage.src = tempImage.src;
            sliderImage.classList.remove('image-hidden');
        };
    }, 800);
}
setInterval(changeImage, 5000);

// --- REAL NEWSLETTER LIVE SUBMISSION ---
// if (newsletterForm) {
//     newsletterForm.addEventListener('submit', async function (e) {
//         e.preventDefault();

//         const emailInput = this.querySelector('input[type="email"]');
//         const emailValue = emailInput.value;

//         try {
//             const response = await fetch(`${API_BASE_URL}/newsletter`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ email: emailValue })
//             });

//             if (response.ok) {
//                 alert(`Thank you! "${emailValue}" has been subscribed successfully. 🎉`);
//                 this.reset();
//             } else {
//                 alert("Subscription failed. Try again.");
//             }
//         } catch (error) {
//             alert("Server down! Could not subscribe.");
//         }
//     });
// }

// Counter Logic (Expertise)
document.addEventListener("DOMContentLoaded", () => {
    const counters = document.querySelectorAll('.counter');
    const animationDuration = 2000;

    const animateCounter = (counter) => {
        const targetValue = parseInt(counter.getAttribute('data-target'), 10);
        let startValue = 0;
        const frameDuration = 1000 / 60;
        const totalFrames = Math.round(animationDuration / frameDuration);
        const increment = targetValue / totalFrames;

        if (counter.dataset.timeoutId) {
            clearTimeout(parseInt(counter.dataset.timeoutId, 10));
        }

        const updateValue = () => {
            startValue += increment;
            if (startValue < targetValue) {
                counter.innerText = Math.floor(startValue).toLocaleString();
                counter.dataset.timeoutId = setTimeout(updateValue, frameDuration);
            } else {
                counter.innerText = targetValue.toLocaleString();
                delete counter.dataset.timeoutId;
            }
        };
        updateValue();
    };

    const resetCounter = (counter) => {
        if (counter.dataset.timeoutId) {
            clearTimeout(parseInt(counter.dataset.timeoutId, 10));
            delete counter.dataset.timeoutId;
        }
        counter.innerText = "0";
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) animateCounter(entry.target);
            else resetCounter(entry.target);
        });
    }, { threshold: 0.3 });

    counters.forEach(counter => statsObserver.observe(counter));
});

// Carousel Logic for Expert Team
document.addEventListener("DOMContentLoaded", function () {
    const track = document.getElementById('carouselTrack');
    if(!track) return;
    const slides = Array.from(track.children);
    const dotsContainer = document.getElementById('carouselDots');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;

    function createDynamicDots() {
        dotsContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot-indicator');
            if (index === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }

    function updateCarousel() {
        slides.forEach((slide, index) => {
            slide.className = 'carousel-slide';
            if (index === currentIndex) slide.classList.add('active-slide');
            else if (index === (currentIndex - 1 + slides.length) % slides.length) slide.classList.add('prev-slide');
            else if (index === (currentIndex + 1) % slides.length) slide.classList.add('next-slide');
        });

        const dots = dotsContainer.querySelectorAll('.dot-indicator');
        dots.forEach((dot, index) => {
            index === currentIndex ? dot.classList.add('active') : dot.classList.remove('active');
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel();
    });

    createDynamicDots();
    updateCarousel();
});

// Project Slide Show Logic
document.addEventListener("DOMContentLoaded", function () {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        const images = card.querySelectorAll('.slide-img');
        const indicatorContainer = card.querySelector('.slideshow-indicators');
        let currentImageIndex = 0;
        const totalImages = images.length;

        if (totalImages === 0) return;

        for (let i = 0; i < totalImages; i++) {
            const dot = document.createElement('div');
            dot.classList.add('indicator-dot');
            if (i === 0) dot.classList.add('active');
            indicatorContainer.appendChild(dot);
        }

        const dots = indicatorContainer.querySelectorAll('.indicator-dot');
        setInterval(() => {
            images[currentImageIndex].classList.remove('active');
            dots[currentImageIndex].classList.remove('active');
            currentImageIndex = (currentImageIndex + 1) % totalImages;
            images[currentImageIndex].classList.add('active');
            dots[currentImageIndex].classList.add('active');
        }, 2000);
    });
});

// --- REAL LIVE "GET A QUOTE" ROUTE FUNCTIONALITY ---
document.addEventListener("DOMContentLoaded", function () {
    const messageInput = document.getElementById('message');
    const charCounter = document.getElementById('charCount');
    const inquiryTypeSelect = document.getElementById('inquiry_type');
    const submitBtn = document.getElementById('submitBtn');
    const combinedForm = document.getElementById('combinedForm');

    // Country Dropdown
    const countryDropdown = document.getElementById('countryDropdown');
    const countryList = document.getElementById('countryList');
    const currentFlag = document.getElementById('currentFlag');
    const countryCodeInput = document.getElementById('countryCodeInput');

    if (countryDropdown && countryList) {
        countryDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
            countryList.classList.toggle('hidden');
        });
        document.addEventListener('click', (e) => {
            if (!countryDropdown.contains(e.target)) countryList.classList.add('hidden');
        });

        const countryItems = countryList.querySelectorAll('.country-item');
        countryItems.forEach(item => {
            item.addEventListener('click', function () {
                const code = item.getAttribute('data-code');
                const flagCode = item.getAttribute('data-flag');
                currentFlag.src = `https://flagcdn.com/w20/${flagCode}.png`;
                countryCodeInput.value = code;
                countryList.classList.add('hidden');
            });
        });
    }

    if (messageInput && charCounter) {
        messageInput.addEventListener('input', function () {
            const currentLength = messageInput.value.length;
            charCounter.textContent = `${currentLength}/300`;
            charCounter.style.color = currentLength >= 280 ? '#ef4444' : '#94a3b8';
        });
    }

    if (inquiryTypeSelect && submitBtn) {
        const btnSpan = submitBtn.querySelector('span');
        inquiryTypeSelect.addEventListener('change', function () {
            btnSpan.textContent = inquiryTypeSelect.value === 'request_quote' ? 'Request Quote' : 'Submit Request';
        });
    }

    // Live Submit Handler
    // Live Submit Handler
// Live Submit Handler
if (combinedForm) {
    combinedForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // 1. Aapke HTML ke mutabiq exact IDs se values lena
        const firstNameVal = document.getElementById('first_name').value;
        const lastNameVal = document.getElementById('last_name').value;
        const emailVal = document.getElementById('email').value;
        
        // Country Code aur Phone Number ko combine karna
        const countryCode = document.getElementById('countryCodeInput').value || "";
        const rawPhone = document.getElementById('phone').value;
        const combinedPhone = `${countryCode}${rawPhone}`.trim();

        // 2. Data Object jo Mongoose Schema se 100% match karta hai
        const dataObject = {
            firstName: firstNameVal,   // HTML ke first_name se value li
            lastName: lastNameVal,     // HTML ke last_name se value li
            email: emailVal,
            phone: combinedPhone,
            inquiryType: inquiryTypeSelect.value, // HTML ke inquiry_type se value li
            details: messageInput.value           // HTML ke message textarea se value li
        };

        const originalBtnHTML = submitBtn.innerHTML;

        // STATE 1: LOADING
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        submitBtn.innerHTML = `<span>Sending...</span> <div class="spinner"></div>`;

        try {
            // 🚀 NETWORK FETCH CALL
            const response = await fetch(`${API_BASE_URL}/inquiries`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataObject)
            });

            const resData = await response.json();

            if (response.ok && resData.success) {
                // STATE 2: SUCCESS
                submitBtn.style.backgroundColor = '#10b981';
                submitBtn.innerHTML = `<span>Sent Successfully!</span> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`;
                
                combinedForm.reset();
                if (charCounter) charCounter.textContent = '0/300';
            } else {
                // Agar backend abhi bhi validation fail kare toh alert mein error show ho
                console.error("Backend Error Details:", resData);
                alert(`Failed to submit: ${resData.message || resData.error || "Invalid Data"}`);
            }
        } catch (error) {
            console.error("Database connection failed:", error);
            alert("Server down! Request could not be sent.");
        } finally {
            // STATE 3: RESET
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.style.backgroundColor = '';
                submitBtn.innerHTML = originalBtnHTML;
            }, 2000);
        }
    });
}
});

// Back to Top and Scroll Animations
document.addEventListener("DOMContentLoaded", () => {
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            window.scrollY > 350 ? backToTopBtn.classList.add('show') : backToTopBtn.classList.remove('show');
        }, { passive: true });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const elements = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            entry.isIntersecting ? entry.target.classList.add("active") : entry.target.classList.remove("active");
        });
    }, { threshold: 0.2 });
    elements.forEach(el => observer.observe(el));
});