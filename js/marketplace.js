// DOM Elements
const createTaskBtn = document.getElementById('createTaskBtn');
const createTaskModal = document.getElementById('createTaskModal');
const taskDetailsModal = document.getElementById('taskDetailsModal');
const resetFiltersBtn = document.getElementById('resetFilters');
const taskSkillsInput = document.getElementById('taskSkills');
const skillsTagsContainer = document.querySelector('.skills-tags');
const addMilestoneBtn = document.getElementById('addMilestone');
const milestonesContainer = document.querySelector('.milestones-container');
const ratingStars = document.querySelectorAll('.rating-input .stars i');
const taskCards = document.querySelectorAll('.task-card');

// Initialize Marketplace
document.addEventListener('DOMContentLoaded', () => {
    // Check for any saved filters
    const savedFilters = JSON.parse(localStorage.getItem('marketplaceFilters')) || {};
    if (Object.keys(savedFilters).length > 0) {
        applySavedFilters(savedFilters);
    }
});

// Create Task Modal
createTaskBtn.addEventListener('click', () => {
    createTaskModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

// View Task Details
taskCards.forEach(card => {
    const viewBtn = card.querySelector('.btn-outline');
    viewBtn.addEventListener('click', () => {
        taskDetailsModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

// Reset Filters
resetFiltersBtn.addEventListener('click', () => {
    document.querySelectorAll('.filter-group select').forEach(select => {
        select.value = '';
    });
    localStorage.removeItem('marketplaceFilters');
});

// Apply Filters
document.querySelectorAll('.filter-group select').forEach(select => {
    select.addEventListener('change', () => {
        const filters = {
            category: document.getElementById('categoryFilter').value,
            price: document.getElementById('priceFilter').value,
            time: document.getElementById('timeFilter').value
        };
        localStorage.setItem('marketplaceFilters', JSON.stringify(filters));
        filterTasks(filters);
    });
});

// Skills Input
taskSkillsInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        const skill = taskSkillsInput.value.trim();
        if (skill && !document.querySelector(`.skill-tag[data-skill="${skill}"]`)) {
            addSkillTag(skill);
        }
        taskSkillsInput.value = '';
    }
});

// Add Milestone
addMilestoneBtn.addEventListener('click', () => {
    const milestoneItem = document.createElement('div');
    milestoneItem.className = 'milestone-item';
    milestoneItem.innerHTML = `
        <input type="text" placeholder="Milestone description">
        <input type="number" placeholder="Amount">
        <button type="button" class="btn btn-sm btn-outline remove-milestone">
            <i class="fas fa-times"></i>
        </button>
    `;
    milestonesContainer.insertBefore(milestoneItem, addMilestoneBtn);
    
    // Add event to remove button
    milestoneItem.querySelector('.remove-milestone').addEventListener('click', () => {
        milestoneItem.remove();
    });
});

// Rating Stars
ratingStars.forEach((star, index) => {
    star.addEventListener('click', () => {
        setRating(index + 1);
    });
    
    star.addEventListener('mouseover', () => {
        highlightStars(index);
    });
});

document.querySelector('.rating-input .stars').addEventListener('mouseleave', () => {
    const currentRating = document.querySelector('.stars').getAttribute('data-rating') || 0;
    highlightStars(currentRating - 1);
});

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

// Functions
function applySavedFilters(filters) {
    document.getElementById('categoryFilter').value = filters.category || '';
    document.getElementById('priceFilter').value = filters.price || '';
    document.getElementById('timeFilter').value = filters.time || '';
    filterTasks(filters);
}

function filterTasks(filters) {
    const tasks = document.querySelectorAll('.task-card');
    
    tasks.forEach(task => {
        const category = task.querySelector('.task-category').textContent.toLowerCase();
        const priceText = task.querySelector('.task-price').textContent;
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
        const timeText = task.querySelector('.task-time').textContent;
        
        let matchesFilters = true;
        
        // Category filter
        if (filters.category && !category.includes(filters.category.toLowerCase())) {
            matchesFilters = false;
        }
        
        // Price filter
        if (filters.price) {
            const [min, max] = filters.price.split('-').map(Number);
            
            if (filters.price.endsWith('+')) {
                if (price < min) matchesFilters = false;
            } else if (price < min || price > max) {
                matchesFilters = false;
            }
        }
        
        // Time filter
        if (filters.time) {
            const [min, max] = filters.time.split('-').map(Number);
            const taskDays = parseInt(timeText);
            
            if (filters.time.endsWith('+')) {
                if (taskDays < min) matchesFilters = false;
            } else if (taskDays < min || taskDays > max) {
                matchesFilters = false;
            }
        }
        
        // Show/hide task based on filters
        if (matchesFilters) {
            task.style.display = 'block';
        } else {
            task.style.display = 'none';
        }
    });
}

function addSkillTag(skill) {
    const tag = document.createElement('span');
    tag.className = 'skill-tag';
    tag.textContent = skill;
    tag.dataset.skill = skill;
    
    const removeBtn = document.createElement('button');
    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
    removeBtn.className = 'remove-skill';
    removeBtn.addEventListener('click', () => tag.remove());
    
    tag.appendChild(removeBtn);
    skillsTagsContainer.appendChild(tag);
}

function setRating(rating) {
    document.querySelector('.stars').setAttribute('data-rating', rating);
    highlightStars(rating - 1);
}

function highlightStars(index) {
    ratingStars.forEach((star, i) => {
        if (i <= index) {
            star.classList.remove('far');
            star.classList.add('fas', 'active');
        } else {
            star.classList.remove('fas', 'active');
            star.classList.add('far');
        }
    });
}

// Simulate task creation
document.querySelector('.task-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Task...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        alert('Task created successfully!');
        
        // Reset form
        e.target.reset();
        skillsTagsContainer.innerHTML = '';
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Close modal
        createTaskModal.classList.remove('active');
        document.body.style.overflow = '';
    }, 1500);
});

// Simulate hiring a freelancer
document.querySelectorAll('.task-actions .btn-primary').forEach(btn => {
    btn.addEventListener('click', () => {
        // In a real app, this would open the escrow transaction modal
        alert('This would initiate the escrow transaction process');
    });
});