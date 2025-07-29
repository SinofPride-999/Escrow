// DOM Elements
const userDropdown = document.querySelector('.user-dropdown');
const newTransactionBtn = document.getElementById('newTransactionBtn');
const transactionModal = document.getElementById('transactionModal');
const modalClose = document.querySelector('.modal-close');

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    // Check for KYC hash in URL
    if (window.location.hash === '#kyc') {
        const kycSection = document.getElementById('kycSection');
        if (kycSection) {
            kycSection.scrollIntoView({ behavior: 'smooth' });
            
            // Highlight for attention
            setTimeout(() => {
                kycSection.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.5)';
                setTimeout(() => {
                    kycSection.style.boxShadow = 'none';
                }, 2000);
            }, 500);
        }
    }
});

// User dropdown toggle
userDropdown.addEventListener('click', (e) => {
    e.stopPropagation();
    userDropdown.classList.toggle('active');
});

// Close dropdown when clicking outside
document.addEventListener('click', () => {
    userDropdown.classList.remove('active');
});

// New transaction modal
newTransactionBtn.addEventListener('click', () => {
    transactionModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

modalClose.addEventListener('click', () => {
    transactionModal.classList.remove('active');
    document.body.style.overflow = '';
});

// Close modal when clicking outside
transactionModal.addEventListener('click', (e) => {
    if (e.target === transactionModal) {
        transactionModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Copy referral link
const copyReferralBtn = document.querySelector('.referral-link button');
if (copyReferralBtn) {
    copyReferralBtn.addEventListener('click', () => {
        const referralInput = document.querySelector('.referral-link input');
        if (referralInput) {
            referralInput.select();
            document.execCommand('copy');
            
            // Show feedback
            const originalText = copyReferralBtn.innerHTML;
            copyReferralBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            
            setTimeout(() => {
                copyReferralBtn.innerHTML = originalText;
            }, 2000);
        }
    });
}

// Transaction item actions
document.querySelectorAll('.transaction-action').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        // In a real app, this would show a context menu with options
        alert('Transaction options would appear here');
    });
});

// Simulate transaction form submission
const transactionForm = document.querySelector('.transaction-form');
if (transactionForm) {
    transactionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simulate processing
        const submitBtn = transactionForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            // Show success message
            alert('Transaction created successfully!');
            
            // Reset form
            transactionForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Close modal
            transactionModal.classList.remove('active');
            document.body.style.overflow = '';
        }, 1500);
    });
}

// Plan selection
document.querySelectorAll('.plan-option').forEach(plan => {
    plan.addEventListener('click', () => {
        if (!plan.classList.contains('recommended')) {
            alert(`You've selected the ${plan.querySelector('h4').textContent} plan. In a real app, this would initiate the upgrade process.`);
        }
    });
});