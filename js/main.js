/**
 * Portfolio Website Main JavaScript - Grain & Mortar
 * Handles navigation, animations, and form handling with security features
 */

// ============================================================================
// NAVIGATION & INTERACTIONS
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeAnimations();
    initializeForms();
});

/**
 * Smooth scroll to section
 */
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const scrollTarget = element.closest('section') || element;
    scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Handle navigation clicks with smooth transitions
 */
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            const href = this.getAttribute('href');

            if (!href || !href.trim()) return;

            if (href.startsWith('#')) {
                e.preventDefault();
                smoothScrollTo(href.slice(1));
                return;
            }

            if (href.startsWith('/')) {
                e.preventDefault();
                const pageName = href.replace(/^\/+/, '').replace(/\/+$/, '');
                const targetPath = pageName.includes('.html') ? `/${pageName}` : `/pages/${pageName}.html`;
                window.location.href = targetPath;
            }
        });
    });

    /**
     * Navbar scroll effect
     */
    const navbar = document.getElementById('navbar');
    
    function handleNavbarScroll() {
        if (!navbar) return;
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            // Apply blur effect and backdrop for scrolling navbars
            navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
            navbar.style.backdropFilter = 'blur(16px)';
        } else {
            navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.85)';
            navbar.style.backdropFilter = 'blur(12px)';
        }
    }

    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll(); // Initial call
}

/**
 * Initialize scroll-based animations
 */
function initializeAnimations() {
    
    /**
     * Intersection Observer for fade-in animations on scroll
     */
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px -80px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation class when element enters viewport
                entry.target.classList.add('fade-in');
                
                // Optional: Stop observing once animated
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all cards and sections for animations
    const animatedElements = document.querySelectorAll('.card, .section > div:not(.hero)');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        observer.observe(el);
    });

    /**
     * Reveal animations for hero sections
     */
    const heroTitles = document.querySelectorAll('.hero-title');
    
    heroTitles.forEach(title => {
        title.style.opacity = '0';
        title.style.transform = 'translateY(32px)';
        
        // Animate on scroll
        let animated = false;
        
        window.addEventListener('scroll', () => {
            const rect = title.getBoundingClientRect();
            
            if (rect.top < window.innerHeight && !animated) {
                title.style.transition = 'all 0.8s ease';
                title.classList.add('fade-in');
                animated = true;
            }
        }, { once: true });
    });

    /**
     * Button hover effects with ripple (optional enhancement)
     */
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Create ripple effect
            const rect = this.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                left: ${centerX}px;
                top: ${centerY}px;
                width: 0;
                height: 0;
                background-color: rgba(232, 230, 222, 0.5);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                pointer-events: none;
                animation: ripple-effect 0.6s ease-out forwards;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            
            // Add ripple element
            const styleSheet = document.createElement('style');
            styleSheet.textContent = `
                @keyframes ripple-effect {
                    to {
                        width: 300px;
                        height: 300px;
                        opacity: 0;
                    }
                }
            `;
            
            document.head.appendChild(styleSheet);
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
}

/**
 * Form handling with security integration
 */
function initializeForms() {
    
    /**
     * Contact form submission handler
     */
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Security: Validate form using security.js utilities
            const formData = new FormData(this);
            
            let isValid = true;
            let errorMessages = [];

            // Get form fields and validate
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');

            if (!sanitizeInput(nameInput.value.trim())) {
                isValid = false;
                errorMessages.push('Name is required');
            }

            if (sanitizeInput(emailInput.value.trim()) !== sanitizeInput(emailInput.value.trim())) {
                isValid = false;
                emailInput.classList.add('error');
                setTimeout(() => emailInput.classList.remove('error'), 2000);
            } else {
                const emailValidation = validateFormInput('email', sanitizeInput(emailInput.value.trim()));
                if (!emailValidation.valid) {
                    isValid = false;
                    errorMessages.push(emailValidation.reason);
                }
            }

            if (sanitizeInput(messageInput.value.trim()).length < 10) {
                isValid = false;
                errorMessages.push('Please provide more details about your project');
            }

            // Display validation feedback
            if (!isValid) {
                const container = document.querySelector('.card');
                
                if (container && !container.querySelector('.error-msg')) {
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'form-error';
                    errorMsg.style.cssText = `
                        color: #ff6b6b;
                        margin-top: 16px;
                        padding: var(--spacing-md);
                        background-color: rgba(255, 107, 107, 0.1);
                        border-radius: 4px;
                        font-size: 0.875rem;
                    `;
                    
                    errorMsg.textContent = 'Please fix the following errors:';
                    container.appendChild(errorMsg);

                    errorMessages.forEach(msg => {
                        const fieldError = document.createElement('div');
                        fieldError.className = 'form-error-field';
                        fieldError.style.cssText = `color: #ff6b6b; font-size: 0.875rem; margin-top: var(--spacing-xs);`;
                        fieldError.textContent = msg;
                        errorMsg.appendChild(fieldError);
                    });

                    contactForm.insertBefore(errorMsg, contactForm.firstChild);
                }
                
                return; // Stop submission
            }

            // Security: Sanitize form data before sending
            const formDataObject = {};
            
            for (let [key, value] of formData.entries()) {
                const sanitizedValue = sanitizeInput(value.toString());
                
                // Special handling for email validation
                if (key === 'email') {
                    if (!isValidEmail(sanitizedValue)) {
                        isValid = false;
                        errorMessages.push('Please enter a valid email address');
                        return;
                    }
                }

                formDataObject[key] = sanitizedValue;
            }

            // Security: Prepare data for server-side processing (CSRF token)
            const csrfToken = document.getElementById('csrf_token').value;

            if (!csrfToken || csrfToken.length < 10) {
                alert('Security issue detected. Please contact support.');
                return;
            }

            // Simulate form submission success
            console.log('Form submitted with sanitized data:', formDataObject);
            
            // Show success message
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            setTimeout(() => {
                // Reset form
                contactForm.reset();
                
                // Remove error messages if any
                const errors = document.querySelectorAll('.form-error');
                errors.forEach(err => err.remove());

                // Show success message
                const container = this.querySelector('.card');
                if (!container) return;

                const successMsg = document.createElement('div');
                successMsg.className = 'form-success';
                successMsg.style.cssText = `
                    color: #4ec54e;
                    margin-top: 16px;
                    padding: var(--spacing-md);
                    background-color: rgba(78, 197, 78, 0.1);
                    border-radius: 4px;
                    font-size: 0.875rem;
                `;
                
                successMsg.textContent = 'Thank you! Your message has been sent successfully. We\'ll be in touch soon.';
                container.appendChild(successMsg);

                submitBtn.disabled = false;
                submitBtn.textContent = originalText;

                // Remove success message after 5 seconds
                setTimeout(() => {
                    if (successMsg.parentNode) {
                        successMsg.remove();
                    }
                }, 5000);

            }, 1500);
        });
    }

    /**
     * Add form error/success styles dynamically
     */
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .form-error {
            animation: shake 0.3s ease-out;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-8px); }
            75% { transform: translateX(8px); }
        }

        .form-success, .form-error-field {
            animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .form-input.error {
            border-color: #ff6b6b !important;
        }

        /* Button loading state */
        button[disabled] {
            cursor: not-allowed;
            opacity: 0.7;
        }
    `;
    
    document.head.appendChild(styleSheet);
}

/**
 * Parallax effect for hero sections (optional enhancement)
 */
function initializeParallax() {
    const parallaxElements = document.querySelectorAll('.hero-title, .hero-subtitle');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = -(scrolled * speed * 2);
            
            element.style.transform = `translateY(${yPos}px)`;
        });
    }, { passive: true });
}

// ============================================================================
// SECURITY ENHANCEMENTS
// ============================================================================

/**
 * Prevent XSS attacks in user input
 */
function escapeHTML(str) {
    const div = document.createElement('div');
    
    try {
        div.textContent = str || '';
        return div.innerHTML;
    } catch (e) {
        // Fallback if DOM is not available
        return str.replace(/[&<>"']/g, function(c) {
            switch (c) {
                case '&': return '&amp;';
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '"': return '&quot;';
                case "'": return '&#39;';
            }
        });
    }
}

/**
 * Add security warnings to console (bypassed in production)
 */
function addSecurityWarning(message, severity = 'warning') {
    // In production, this is disabled via DEBUG_MODE protection
    
    switch(severity) {
        case 'error':
            if (!window.SecurityConfig || window.SecurityConfig.DEBUG_MODE) {
                console.error('[Security Warning]', message);
            } else {
                console.warn(message);
            }
            break;
        
        case 'warning':
            if (window.SecurityConfig && !window.SecurityConfig.DEBUG_MODE) {
                console.log(`[Security] ${message}`);
            } else {
                console.warn('[Security Warning]', message);
            }
            break;
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate random unique ID (for form tokens, etc.)
 */
function generateUniqueId(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
}

/**
 * Debounce function for performance optimization
 */
function debounce(func, wait) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = function() {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// Initialize parallax effect after all animations are ready
initializeParallax();

// Security: Log initialization with security context
addSecurityWarning('Portfolio website initialized successfully', 'info');
