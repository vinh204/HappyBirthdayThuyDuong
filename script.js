// CONFIGURATION - Thay đổi thông tin ở đây
const CONFIG = {
    // Thay đổi ngày bắt đầu yêu nhau (định dạng: YYYY-MM-DD)
    startDate: '2023-10-01',  
    
    // Tùy chỉnh số lượng sao và hiệu ứng
    numberOfStars: 50,
    numberOfBalloons: 8,
    numberOfGifts: 6,
    numberOfCakes: 4,
    
    // Tùy chỉnh tần suất tim bay (milliseconds)
    heartInterval: 3000,
    
    // Tùy chỉnh thời gian tự động chuyển slide (0 = tắt auto)
    autoSlideInterval: 0, // milliseconds (ví dụ: 5000 = 5 giây)
    
    // Slide settings
    totalSlides: 9,
    enableSwipe: true,
    enableKeyboard: true
};

// Global variables
let currentSlide = 1;
let isLoggedIn = false;
let autoSlideTimer = null;
let touchStartY = 0;
let touchEndY = 0;

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    console.log('🎂 Thiệp sinh nhật kỹ thuật số đã sẵn sàng!');
    
    // Create background animations
    createStars();
    createBackgroundElements();
    
    // Setup navigation dots
    createNavigationDots();
    
    // Setup event listeners
    setupEventListeners();
    
    // Update navigation state
    updateNavigation();
    
    // Update progress bar
    updateProgressBar();
    
    // Add birthday card effects
    setTimeout(createConfetti, 2000);
    
    console.log('📅 Ngày yêu nhau hiện tại:', CONFIG.startDate);
    console.log('💡 Để thay đổi ngày, sửa CONFIG.startDate trong script.js');
}

// Create stars background
function createStars() {
    const starsContainer = document.getElementById('stars');
    
    for (let i = 0; i < CONFIG.numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.innerHTML = '✨';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.fontSize = (Math.random() * 8 + 8) + 'px';
        star.style.animationDelay = Math.random() * 3 + 's';
        starsContainer.appendChild(star);
    }
}

// Create floating background elements
function createBackgroundElements() {
    const bgContainer = document.getElementById('bgAnimation');
    
    // Create balloons
    for (let i = 0; i < CONFIG.numberOfBalloons; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'floating-element balloon';
        balloon.style.left = Math.random() * 100 + '%';
        balloon.style.top = Math.random() * 100 + '%';
        balloon.style.animationDelay = Math.random() * 6 + 's';
        balloon.style.animationDuration = (Math.random() * 3 + 4) + 's';
        bgContainer.appendChild(balloon);
    }
    
    // Create gifts
    for (let i = 0; i < CONFIG.numberOfGifts; i++) {
        const gift = document.createElement('div');
        gift.className = 'floating-element gift';
        gift.style.left = Math.random() * 100 + '%';
        gift.style.top = Math.random() * 100 + '%';
        gift.style.animationDelay = Math.random() * 6 + 's';
        gift.style.animationDuration = (Math.random() * 3 + 4) + 's';
        bgContainer.appendChild(gift);
    }
    
    // Create cake emojis
    for (let i = 0; i < CONFIG.numberOfCakes; i++) {
        const cake = document.createElement('div');
        cake.className = 'floating-element cake';
        cake.innerHTML = ['🎂', '🧁', '🍰'][Math.floor(Math.random() * 3)];
        cake.style.left = Math.random() * 100 + '%';
        cake.style.top = Math.random() * 100 + '%';
        cake.style.animationDelay = Math.random() * 6 + 's';
        cake.style.animationDuration = (Math.random() * 3 + 4) + 's';
        bgContainer.appendChild(cake);
    }
}

// Create confetti effect
function createConfetti() {
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = ['#FFD700', '#FF6B9D', '#667eea', '#764ba2', '#FFA500'][Math.floor(Math.random() * 5)];
            confetti.style.animationDelay = Math.random() * 2 + 's';
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, i * 100);
    }
}

// Create navigation dots
function createNavigationDots() {
    const navDots = document.getElementById('navDots');
    navDots.innerHTML = '';
    
    for (let i = 1; i <= CONFIG.totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'nav-dot';
        if (i === currentSlide) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        navDots.appendChild(dot);
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Password input enter key
    const passwordInput = document.getElementById('passwordDate');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', handleEnterKey);
    }
    
    // Keyboard navigation
    if (CONFIG.enableKeyboard) {
        document.addEventListener('keydown', handleKeyboard);
    }
    
    // Touch/swipe navigation
    if (CONFIG.enableSwipe) {
        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
    
    // Mouse wheel navigation
    document.addEventListener('wheel', handleWheel, { passive: false });
    
    // Click navigation on slides (except login)
    document.addEventListener('click', handleSlideClick);
}

// Handle enter key on password input
function handleEnterKey(event) {
    if (event.key === 'Enter') {
        checkPassword();
    }
}

// Handle keyboard navigation
function handleKeyboard(event) {
    if (!isLoggedIn) return;
    
    switch (event.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
            event.preventDefault();
            previousSlide();
            break;
        case 'ArrowDown':
        case 'ArrowRight':
        case ' ': // Spacebar
            event.preventDefault();
            nextSlide();
            break;
        case 'Home':
            event.preventDefault();
            goToSlide(2); // First slide after login
            break;
        case 'End':
            event.preventDefault();
            goToSlide(CONFIG.totalSlides);
            break;
    }
}

// Handle touch start
function handleTouchStart(event) {
    if (!isLoggedIn) return;
    touchStartY = event.touches[0].clientY;
}

// Handle touch end (swipe detection)
function handleTouchEnd(event) {
    if (!isLoggedIn) return;
    
    touchEndY = event.changedTouches[0].clientY;
    const swipeDistance = touchStartY - touchEndY;
    const minSwipeDistance = 50;
    
    if (Math.abs(swipeDistance) > minSwipeDistance) {
        if (swipeDistance > 0) {
            // Swipe up - next slide
            nextSlide();
        } else {
            // Swipe down - previous slide
            previousSlide();
        }
    }
}

// Handle mouse wheel
function handleWheel(event) {
    if (!isLoggedIn) return;
    
    event.preventDefault();
    
    if (event.deltaY > 0) {
        // Scroll down - next slide
        nextSlide();
    } else {
        // Scroll up - previous slide
        previousSlide();
    }
}

// Handle click navigation on slides
function handleSlideClick(event) {
    if (!isLoggedIn) return;
    
    const clickedSlide = event.target.closest('.slide');
    if (clickedSlide && clickedSlide.classList.contains('active')) {
        // Click on active slide to go to next
        if (!event.target.closest('.nav-arrow') && 
            !event.target.closest('.nav-dot') && 
            !event.target.closest('.login-btn') &&
            !event.target.closest('.restart-btn')) {
            nextSlide();
        }
    }
}

// Check password function
function checkPassword() {
    const inputDate = document.getElementById('passwordDate').value;
    const errorMessage = document.getElementById('errorMessage');
    
    if (inputDate === CONFIG.startDate) {
        // Correct password
        isLoggedIn = true;
        errorMessage.textContent = '';
        
        // Create celebration effect
        createConfetti();
        
        // Move to next slide
        setTimeout(() => {
            nextSlide();
            calculateLoveDays();
            createHeartAnimation();
            startAutoSlide();
        }, 500);
        
    } else {
        // Wrong password
        errorMessage.textContent = 'Ngày không chính xác! Hãy thử lại nhé 💕';
        
        // Add shake effect to login card
        const loginCard = document.querySelector('.login-card');
        loginCard.style.animation = 'shake 0.5s ease-in-out';
        
        setTimeout(() => {
            loginCard.style.animation = '';
            errorMessage.textContent = '';
        }, 3000);
    }
}

// Navigate to next slide
function nextSlide() {
    if (currentSlide < CONFIG.totalSlides) {
        goToSlide(currentSlide + 1);
    }
}

// Navigate to previous slide
function previousSlide() {
    if (currentSlide > 1) {
        goToSlide(currentSlide - 1);
    }
}

// Go to specific slide
function goToSlide(slideNumber) {
    if (slideNumber < 1 || slideNumber > CONFIG.totalSlides) return;
    if (slideNumber === currentSlide) return;
    if (!isLoggedIn && slideNumber > 1) return;
    
    // Remove active class from current slide
    const currentSlideElement = document.getElementById(`slide${currentSlide}`);
    if (currentSlideElement) {
        currentSlideElement.classList.remove('active');
        if (slideNumber > currentSlide) {
            currentSlideElement.classList.add('prev');
        } else {
            currentSlideElement.classList.remove('prev');
        }
    }
    
    // Add active class to new slide
    const newSlideElement = document.getElementById(`slide${slideNumber}`);
    if (newSlideElement) {
        setTimeout(() => {
            currentSlideElement?.classList.remove('prev');
            newSlideElement.classList.add('active');
            
            // Trigger slide-specific animations
            triggerSlideAnimations(slideNumber);
        }, 50);
    }
    
    currentSlide = slideNumber;
    updateNavigation();
    updateProgressBar();
    resetAutoSlide();
}

// Trigger animations for specific slides
function triggerSlideAnimations(slideNumber) {
    switch (slideNumber) {
        case 3: // Wishes slide
            animateWishesText();
            break;
        case 4: // Timeline intro
            animateTimelineIntro();
            break;
        case 9: // Final slide
            setTimeout(createConfetti, 1000);
            break;
    }
}

// Animate wishes text
function animateWishesText() {
    const textElements = document.querySelectorAll('#slide3 .fade-in-text');
    textElements.forEach((element, index) => {
        element.style.animation = 'none';
        setTimeout(() => {
            element.style.animation = `fadeInText 0.8s ease-out forwards`;
            element.style.animationDelay = `${index * 0.4}s`;
        }, 100);
    });
}

// Animate timeline intro
function animateTimelineIntro() {
    const bookElement = document.querySelector('#slide4 .story-book');
    if (bookElement) {
        bookElement.style.animation = 'none';
        setTimeout(() => {
            bookElement.style.animation = 'bookOpen 2s ease-in-out infinite';
        }, 100);
    }
}

// Update navigation state
function updateNavigation() {
    // Update dots
    const dots = document.querySelectorAll('.nav-dot');
    dots.forEach((dot, index) => {
        if (index + 1 === currentSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
    
    // Update arrow buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.disabled = (currentSlide <= 1);
    }
    
    if (nextBtn) {
        nextBtn.disabled = (currentSlide >= CONFIG.totalSlides);
    }
    
    // Hide navigation on login screen
    const navigation = document.querySelector('.slide-navigation');
    if (navigation) {
        navigation.style.display = isLoggedIn ? 'flex' : 'none';
    }
}

function openGift(giftNumber) {
            const giftBox = document.getElementById(`giftBox${giftNumber}`);
            if (!giftBox.classList.contains('opened')) {
                giftBox.classList.add('opened');
                
                // Tạo hiệu ứng confetti
                createConfetti();
            }
        }

        // Tạo hiệu ứng confetti khi mở quà
        function createConfetti() {
            const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'];
            const confettiCount = 50;
            
            for (let i = 0; i < confettiCount; i++) {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    left: ${Math.random() * 100}vw;
                    top: -10px;
                    z-index: 1000;
                    pointer-events: none;
                    animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
                    transform: rotate(${Math.random() * 360}deg);
                `;
                
                document.body.appendChild(confetti);
                
                setTimeout(() => {
                    confetti.remove();
                }, 5000);
            }
        }

// Update progress bar
function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        const progress = ((currentSlide - 1) / (CONFIG.totalSlides - 1)) * 100;
        progressFill.style.width = `${Math.max(0, progress)}%`;
    }
}

// Calculate and display love days
function calculateLoveDays() {
    const startDate = new Date(CONFIG.startDate);
    const today = new Date();
    const timeDifference = today.getTime() - startDate.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
    
    // Animate counter from 0 to actual days
    let currentCount = 0;
    const counter = document.getElementById('loveCounter');
    const increment = daysDifference / 60; // 60 steps animation
    
    const timer = setInterval(() => {
        currentCount += increment;
        
        if (currentCount >= daysDifference) {
            currentCount = daysDifference;
            clearInterval(timer);
        }
        
        if (counter) {
            counter.textContent = Math.floor(currentCount);
        }
    }, 50); // Update every 50ms
}

// Create floating hearts animation
function createHeartAnimation() {
    setInterval(() => {
        if (isLoggedIn) {
            const heart = document.createElement('div');
            heart.className = 'heart-float';
            heart.innerHTML = getRandomHeart();
            heart.style.left = Math.random() * 100 + '%';
            heart.style.bottom = '0px';
            heart.style.fontSize = (Math.random() * 10 + 15) + 'px';
            
            document.body.appendChild(heart);
            
            // Remove heart after animation completes
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, 3000);
        }
    }, CONFIG.heartInterval);
}

// Get random heart emoji
function getRandomHeart() {
    const hearts = ['💖', '💕', '💗', '💝', '💘', '💞', '💓', '💌', '❤️', '💟'];
    return hearts[Math.floor(Math.random() * hearts.length)];
}

// Auto slide functionality
function startAutoSlide() {
    if (CONFIG.autoSlideInterval > 0) {
        autoSlideTimer = setInterval(() => {
            if (currentSlide < CONFIG.totalSlides) {
                nextSlide();
            } else {
                stopAutoSlide();
            }
        }, CONFIG.autoSlideInterval);
    }
}

function stopAutoSlide() {
    if (autoSlideTimer) {
        clearInterval(autoSlideTimer);
        autoSlideTimer = null;
    }
}

function resetAutoSlide() {
    stopAutoSlide();
    if (CONFIG.autoSlideInterval > 0 && isLoggedIn) {
        startAutoSlide();
    }
}

// Restart slideshow
function restartSlideshow() {
    isLoggedIn = false;
    goToSlide(1);
    
    // Reset login form
    const passwordInput = document.getElementById('passwordDate');
    if (passwordInput) {
        passwordInput.value = '';
    }
    
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
        errorMessage.textContent = '';
    }
    
    stopAutoSlide();
    
    // Reset counter
    const counter = document.getElementById('loveCounter');
    if (counter) {
        counter.textContent = '0';
    }
}

// Utility functions for enhanced features
const Utils = {
    // Format date to Vietnamese
    formatDate: function(dateString) {
        const date = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            locale: 'vi-VN'
        };
        return date.toLocaleDateString('vi-VN', options);
    },
    
    // Calculate detailed love duration
    getDetailedLoveDuration: function() {
        const start = new Date(CONFIG.startDate);
        const now = new Date();
        
        let years = now.getFullYear() - start.getFullYear();
        let months = now.getMonth() - start.getMonth();
        let days = now.getDate() - start.getDate();
        
        if (days < 0) {
            months--;
            days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
        }
        
        if (months < 0) {
            years--;
            months += 12;
        }
        
        return { years, months, days };
    },
    
    // Add sparkle effect on click
    createSparkle: function(x, y) {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = '✨';
        sparkle.style.position = 'fixed';
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.fontSize = '20px';
        sparkle.style.zIndex = '1000';
        
        document.body.appendChild(sparkle);
        
        sparkle.animate([
            { opacity: 1, transform: 'scale(0) rotate(0deg)' },
            { opacity: 0, transform: 'scale(1.5) rotate(180deg)' }
        ], {
            duration: 1000,
            easing: 'ease-out'
        }).onfinish = () => {
            sparkle.remove();
        };
    }
};

// Add click sparkle effect
document.addEventListener('click', function(event) {
    if (isLoggedIn) {
        Utils.createSparkle(event.clientX, event.clientY);
    }
});

// Additional enhanced features
function createRandomBubble() {
    const bubble = document.createElement('div');
    bubble.style.position = 'fixed';
    bubble.style.width = '20px';
    bubble.style.height = '20px';
    bubble.style.borderRadius = '50%';
    bubble.style.background = 'rgba(255, 255, 255, 0.3)';
    bubble.style.left = Math.random() * window.innerWidth + 'px';
    bubble.style.bottom = '-20px';
    bubble.style.animation = 'floatUp 4s linear forwards';
    bubble.style.zIndex = '2';
    
    document.body.appendChild(bubble);
    
    setTimeout(() => {
        bubble.remove();
    }, 4000);
}

// Create bubbles periodically
setInterval(() => {
    if (isLoggedIn && Math.random() > 0.7) {
        createRandomBubble();
    }
}, 2000);