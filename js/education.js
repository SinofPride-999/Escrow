// DOM Elements
const categoryBtns = document.querySelectorAll('.category-btn');
const educationCards = document.querySelectorAll('[data-category]');
const earnBtns = document.querySelectorAll('.earn-btn');
const quizStartBtns = document.querySelectorAll('.quiz-card .btn-primary');
const quizModal = document.getElementById('quizModal');
const rewardModal = document.getElementById('rewardModal');

// Initialize Education Page
document.addEventListener('DOMContentLoaded', () => {
    // Set up quiz timer simulation
    if (quizModal) {
        setupQuizTimer();
    }
});

// Category Filtering
categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filter cards
        const category = btn.dataset.category;
        filterEducationCards(category);
    });
});

// Filter education cards by category
function filterEducationCards(category) {
    educationCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 10);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// Earn Reward Buttons
earnBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const rewardAmount = btn.dataset.reward || '5';
        showRewardModal(rewardAmount);
    });
});

// Show Reward Modal
function showRewardModal(amount) {
    // Update modal content
    const rewardText = rewardModal.querySelector('.reward-text span');
    rewardText.textContent = `${amount} ESC`;
    
    // Show modal
    rewardModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add shine animation to earn buttons
    earnBtns.forEach(btn => {
        btn.classList.add('animate-shine');
        setTimeout(() => {
            btn.classList.remove('animate-shine');
        }, 3000);
    });
}

// Quiz Start Buttons
quizStartBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        quizModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Reset quiz progress
        resetQuiz();
    });
});

// Setup Quiz Timer
function setupQuizTimer() {
    let seconds = 105; // 1:45
    
    const timerElement = quizModal.querySelector('.quiz-timer');
    const timerInterval = setInterval(() => {
        seconds--;
        
        if (seconds <= 0) {
            clearInterval(timerInterval);
            timerElement.innerHTML = '<i class="fas fa-clock"></i> Time\'s up!';
            timerElement.style.color = 'var(--danger)';
        } else {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            timerElement.innerHTML = `<i class="fas fa-clock"></i> ${mins}:${secs < 10 ? '0' : ''}${secs}`;
        }
    }, 1000);
}

// Reset Quiz Progress
function resetQuiz() {
    const progressBar = quizModal.querySelector('.progress');
    const progressText = quizModal.querySelector('.quiz-progress span');
    const options = quizModal.querySelectorAll('.option-card input');
    
    progressBar.style.width = '20%';
    progressText.textContent = 'Question 1 of 5';
    options.forEach(option => {
        option.checked = false;
    });
}

// Close Modals
document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    });
});

// Close modals when clicking outside
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Quiz Option Selection
const optionCards = document.querySelectorAll('.option-card');
if (optionCards.length > 0) {
    optionCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove selected state from all options
            optionCards.forEach(c => {
                c.style.borderColor = 'var(--dark-border)';
                if (lightMode) {
                    c.style.borderColor = 'var(--light-border)';
                }
            });
            
            // Add selected state to clicked option
            this.style.borderColor = 'var(--primary)';
        });
    });
}

// Submit Quiz Answer
const quizSubmitBtn = document.querySelector('.quiz-footer .btn-primary');
if (quizSubmitBtn) {
    quizSubmitBtn.addEventListener('click', () => {
        const selectedOption = document.querySelector('.option-card input:checked');
        
        if (!selectedOption) {
            alert('Please select an answer before submitting.');
            return;
        }
        
        // Simulate answer processing
        quizSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking...';
        quizSubmitBtn.disabled = true;
        
        setTimeout(() => {
            // Update progress
            const progressBar = document.querySelector('.quiz-progress .progress');
            const progressText = document.querySelector('.quiz-progress span');
            
            const currentWidth = parseInt(progressBar.style.width);
            const newWidth = Math.min(currentWidth + 20, 100);
            progressBar.style.width = `${newWidth}%`;
            
            const currentQuestion = parseInt(progressText.textContent.match(/\d+/)[0]);
            progressText.textContent = `Question ${currentQuestion + 1} of 5`;
            
            // Reset for next question or complete
            if (newWidth >= 100) {
                showRewardModal('20');
                quizModal.classList.remove('active');
            } else {
                document.querySelectorAll('.option-card input').forEach(option => {
                    option.checked = false;
                });
                document.querySelectorAll('.option-card').forEach(card => {
                    card.style.borderColor = 'var(--dark-border)';
                    if (lightMode) {
                        card.style.borderColor = 'var(--light-border)';
                    }
                });
            }
            
            quizSubmitBtn.innerHTML = 'Submit Answer';
            quizSubmitBtn.disabled = false;
        }, 1000);
    });
}

// Light mode detection
let lightMode = document.body.classList.contains('light-mode');

// Watch for theme changes
const observer = new MutationObserver(() => {
    lightMode = document.body.classList.contains('light-mode');
});

observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class']
});