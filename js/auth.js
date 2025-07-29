// DOM Elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const forgotPasswordLink = document.querySelector('.forgot-password');

// Simulated user database
const users = JSON.parse(localStorage.getItem('secureEscrowUsers')) || [
    // Default admin user for demo
    {
        id: 1,
        name: 'Admin User',
        email: 'admin@secureescrow.com',
        password: 'Secure123!',
        verified: true,
        kycCompleted: true,
        balance: 10000,
        transactions: []
    }
];

// Current user
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Auth Functions
function loginUser(email, password) {
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        return true;
    }
    
    return false;
}

function registerUser(name, email, password) {
    // Check if user already exists
    const userExists = users.some(u => u.email === email);
    
    if (userExists) {
        return { success: false, message: 'User already exists with this email' };
    }
    
    // Create new user
    const newUser = {
        id: users.length + 1,
        name,
        email,
        password,
        verified: false,
        kycCompleted: false,
        balance: 0,
        transactions: []
    };
    
    users.push(newUser);
    localStorage.setItem('secureEscrowUsers', JSON.stringify(users));
    
    // Automatically log in the new user
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    return { success: true, user: newUser };
}

function showAlert(message, type = 'success') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.style.position = 'fixed';
    alert.style.top = '20px';
    alert.style.right = '20px';
    alert.style.padding = '15px 20px';
    alert.style.borderRadius = 'var(--radius-md)';
    alert.style.backgroundColor = type === 'success' ? 'var(--success)' : 'var(--danger)';
    alert.style.color = 'white';
    alert.style.zIndex = '10000';
    alert.style.boxShadow = 'var(--shadow-md)';
    alert.style.transform = 'translateX(200%)';
    alert.style.transition = 'transform 0.3s ease';
    
    document.body.appendChild(alert);
    
    // Animate in
    setTimeout(() => {
        alert.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        alert.style.transform = 'translateX(200%)';
        setTimeout(() => {
            alert.remove();
        }, 300);
    }, 3000);
}

// Form Submissions
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (loginUser(email, password)) {
            showAlert('Login successful! Redirecting...');
            
            // Simulate KYC check
            if (!currentUser.kycCompleted) {
                setTimeout(() => {
                    window.location.href = 'dashboard.html#kyc';
                }, 1500);
            } else {
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            }
        } else {
            showAlert('Invalid email or password', 'error');
        }
    });
}

if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        
        // Validate passwords match
        if (password !== confirmPassword) {
            showAlert('Passwords do not match', 'error');
            return;
        }
        
        // Register user
        const result = registerUser(name, email, password);
        
        if (result.success) {
            showAlert('Registration successful! Please complete KYC verification.');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html#kyc';
            }, 1500);
        } else {
            showAlert(result.message, 'error');
        }
    });
}

if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        showAlert('Password reset link sent to your email (simulated)');
    });
}

// Social Login Buttons
document.querySelectorAll('.btn-social').forEach(btn => {
    btn.addEventListener('click', () => {
        showAlert(`Social login with ${btn.textContent.trim()} is simulated for this demo`, 'info');
    });
});