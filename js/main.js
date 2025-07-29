// DOM Elements
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;
const loadingOverlay = document.querySelector('.loading-overlay');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuClose = document.querySelector('.mobile-menu-close');
const authModal = document.querySelector('.auth-modal');
const authModalClose = document.querySelector('.auth-modal-close');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');
const showPasswordBtns = document.querySelectorAll('.show-password');
const passwordInputs = document.querySelectorAll('input[type="password"]');
const signupPassword = document.getElementById('signupPassword');
const passwordStrengthMeter = document.querySelector('.strength-meter');
const passwordStrengthText = document.querySelector('.strength-text span');
const navLinks = document.querySelectorAll('.nav-link');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-list a'); // Fixed selector
const mobileLoginBtn = document.querySelector('.mobile-login-btn');
const mobileSignupBtn = document.querySelector('.mobile-signup-btn');


console.log('Mobile Menu Toggle:', mobileMenuToggle);
console.log('Mobile Menu:', mobileMenu);
console.log('Login Button:', loginBtn);
console.log('Signup Button:', signupBtn);
console.log('Auth Modal:', authModal);
console.log('Auth Modal Close Button:', authModalClose);
console.log('Mobile Menu Toggle:', mobileMenuToggle);
console.log('Mobile Menu:', mobileMenu);

// Current page
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

// Theme Management
function setTheme(theme) {
    body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

// Initialize theme from localStorage or prefer-color-scheme
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme(prefersDark ? 'dark' : 'light');
    }
}

// Loading Overlay
function simulateLoading() {
    setTimeout(() => {
        loadingOverlay.classList.add('hidden');
        
        // Remove from DOM after animation completes
        setTimeout(() => {
            loadingOverlay.remove();
        }, 500);
    }, 1500);
}

// Mobile Menu
function toggleMobileMenu() {
    console.log('Toggle mobile menu called');
    
    if (!mobileMenu || !mobileMenuToggle) {
        console.error('Mobile menu elements not found');
        return;
    }
    
    const isOpen = mobileMenu.classList.contains('active');
    console.log('Menu is currently:', isOpen ? 'open' : 'closed');
    
    // Toggle menu
    mobileMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
    
    // Toggle the menu icon
    const icon = mobileMenuToggle.querySelector('i');
    if (icon) {
        if (!isOpen) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
}


// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (mobileMenu.classList.contains('active') && 
        !e.target.closest('.mobile-menu') && 
        !e.target.closest('.mobile-menu-toggle')) {
        toggleMobileMenu();
    }
});

// Auth Modal
function openAuthModal(formType = 'login') {
    // Close mobile menu if open
    if (mobileMenu.classList.contains('active')) {
        toggleMobileMenu();
    }
    
    authModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    switchAuthTab(formType);
}

function closeAuthModal() {
    if (authModal) {
        authModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal when clicking outside
authModal.addEventListener('click', (e) => {
    if (e.target === authModal) {
        closeAuthModal();
    }
});

function switchAuthTab(tabName) {
    authTabs.forEach(tab => {
        if (tab.dataset.tab === tabName) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    authForms.forEach(form => {
        if (form.id === `${tabName}Form`) {
            form.classList.add('active');
        } else {
            form.classList.remove('active');
        }
    });
}

// Password Strength Checker
function checkPasswordStrength(password) {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Character type checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return strength;
}

function updatePasswordStrength() {
    const password = signupPassword.value;
    const strength = checkPasswordStrength(password);
    
    // Update meter width
    const width = (strength / 5) * 100;
    passwordStrengthMeter.style.width = `${width}%`;
    
    // Update text and color
    let strengthText = 'weak';
    let color = 'var(--danger)';
    
    if (strength >= 4) {
        strengthText = 'strong';
        color = 'var(--success)';
    } else if (strength >= 2) {
        strengthText = 'medium';
        color = 'var(--warning)';
    }
    
    passwordStrengthMeter.style.backgroundColor = color;
    passwordStrengthText.textContent = strengthText;
    passwordStrengthText.style.color = color;
}

// Show/Hide Password
function togglePasswordVisibility(input, button) {
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    
    // Update icon
    if (type === 'text') {
        button.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        button.innerHTML = '<i class="fas fa-eye"></i>';
    }
}

// Active Nav Link Highlighting
function setActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-list');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
        
        mobileNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Scroll Animation
function animateOnScroll() {
    const elements = document.querySelectorAll('.feature-card, .step, .testimonial-card');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        
        if (elementPosition < screenPosition) {
            element.classList.add('active');
        }
    });
}

// Count Up Animation
function animateCountUp() {
    const counters = document.querySelectorAll('[data-count]');
    const speed = 200;
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-count');
        const count = +counter.innerText;
        const increment = target / speed;
        
        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(animateCountUp, 1);
        } else {
            counter.innerText = target;
        }
    });
}

// Testimonial Slider
function initTestimonialSlider() {
    const sliderContainer = document.querySelector('.slider-container');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;
    
    function goToSlide(index) {
        sliderContainer.scrollTo({
            left: index * sliderContainer.offsetWidth,
            behavior: 'smooth'
        });
        
        // Update active dot
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        currentIndex = index;
    }
    
    // Button events
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + dots.length) % dots.length;
        goToSlide(currentIndex);
    });
    
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % dots.length;
        goToSlide(currentIndex);
    });
    
    // Dot events
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // Auto-advance (optional)
    setInterval(() => {
        currentIndex = (currentIndex + 1) % dots.length;
        goToSlide(currentIndex);
    }, 5000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    simulateLoading();
    setActiveNavLink();
    
    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', toggleMobileMenu);
    }
    
    // Only add auth modal listeners if elements exist
    if (authModal && authModalClose) {
        authModalClose.addEventListener('click', (e) => {
            e.preventDefault();
            closeAuthModal();
        });
        
        // Close modal when clicking outside
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                closeAuthModal();
            }
        });
    }
    
    // Auth buttons
    if (loginBtn) {
        loginBtn.addEventListener('click', () => openAuthModal('login'));
    }
    
    if (signupBtn) {
        signupBtn.addEventListener('click', () => openAuthModal('signup'));
    }

    if (mobileLoginBtn) {
        mobileLoginBtn.addEventListener('click', () => {
            toggleMobileMenu();
            openAuthModal('login');
        });
    }

    if (mobileSignupBtn) {
        mobileSignupBtn.addEventListener('click', () => {
            toggleMobileMenu();
            openAuthModal('signup');
        });
    }

    if (authModalClose) {
        authModalClose.addEventListener('click', (e) => {
            e.preventDefault();
            closeAuthModal();
        });
    }
    
    // Only run these on the home page
    if (currentPage === 'index.html' || currentPage === '') {
        animateCountUp();
        initTestimonialSlider();
        
        // Animate steps progress
        const steps = document.querySelectorAll('.step');
        const progress = document.querySelector('.progress');
        
        function updateProgress() {
            let activeSteps = 0;
            
            steps.forEach(step => {
                const stepPosition = step.getBoundingClientRect().top;
                const screenPosition = window.innerHeight / 1.5;
                
                if (stepPosition < screenPosition) {
                    step.classList.add('active');
                    activeSteps++;
                }
            });
            
            // Update progress bar
            const progressPercentage = (activeSteps / steps.length) * 100;
            progress.style.height = `${progressPercentage}%`;
        }
        
        // Initial check
        updateProgress();
        
        // Check on scroll
        window.addEventListener('scroll', updateProgress);
    }
    
    // Scroll animation for all pages
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
});

themeToggle.addEventListener('click', toggleTheme);
mobileMenuToggle.addEventListener('click', toggleMobileMenu);
mobileMenuClose.addEventListener('click', toggleMobileMenu);
loginBtn.addEventListener('click', () => openAuthModal('login'));
signupBtn.addEventListener('click', () => openAuthModal('signup'));
authModalClose.addEventListener('click', closeAuthModal);

// Auth button event listeners
document.querySelectorAll('.auth-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const isSignup = this.id === 'signupBtn' || this.textContent.toLowerCase().includes('sign up');
        openAuthModal(isSignup ? 'signup' : 'login');
    });
});

authModalClose.addEventListener('click', closeAuthModal);

// Close modal when clicking outside
authModal.addEventListener('click', (e) => {
    if (e.target === authModal) {
        closeAuthModal();
    }
});

// Auth tab switching
authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        switchAuthTab(tabName);
    });
});

// Show password toggle
showPasswordBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        togglePasswordVisibility(passwordInputs[index], btn);
    });
});

// Password strength indicator
if (signupPassword) {
    signupPassword.addEventListener('input', updatePasswordStrength);
}

// Close mobile menu when clicking a link
mobileNavLinks.forEach(link => {
    link.addEventListener('click', toggleMobileMenu);
});

