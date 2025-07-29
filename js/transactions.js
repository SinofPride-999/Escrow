// DOM Elements
const exportBtn = document.getElementById('exportBtn');
const exportModal = document.getElementById('exportModal');
const newTransactionBtn = document.getElementById('newTransactionBtn');
const modalClose = document.querySelectorAll('.modal-close');
const applyFiltersBtn = document.getElementById('applyFilters');
const exportRange = document.getElementById('exportRange');
const customDateRange = document.getElementById('customDateRange');
const transactionForm = document.querySelector('.transaction-form');
const exportForm = document.querySelector('.export-form');

// Initialize transactions
document.addEventListener('DOMContentLoaded', () => {
    // Simulate real-time status updates
    setInterval(updateTransactionStatus, 5000);
    
    // Initialize any filters from URL
    if (window.location.search) {
        const params = new URLSearchParams(window.location.search);
        if (params.get('status')) {
            document.getElementById('statusFilter').value = params.get('status');
            applyFilters();
        }
    }
});

// Export modal
exportBtn.addEventListener('click', () => {
    exportModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

// Close modals
modalClose.forEach(btn => {
    btn.addEventListener('click', () => {
        exportModal.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close modal when clicking outside
exportModal.addEventListener('click', (e) => {
    if (e.target === exportModal) {
        exportModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Show/hide custom date range based on selection
exportRange.addEventListener('change', (e) => {
    customDateRange.style.display = e.target.value === 'custom' ? 'block' : 'none';
});

// Apply filters
applyFiltersBtn.addEventListener('click', applyFilters);

function applyFilters() {
    const timeFilter = document.getElementById('timeFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    
    console.log(`Applying filters - Time: ${timeFilter}, Status: ${statusFilter}, Type: ${typeFilter}`);
    
    // In a real app, this would filter the transactions table
    // For now, we'll just simulate it by highlighting matching rows
    
    const rows = document.querySelectorAll('.transactions-table tbody tr');
    rows.forEach(row => {
        const status = row.querySelector('.status-badge').classList[1];
        const type = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
        
        const timeMatch = true; // In a real app, we'd check the date
        const statusMatch = statusFilter === 'all' || status === statusFilter;
        const typeMatch = typeFilter === 'all' || 
                         (type.includes('escrow') && typeFilter === 'escrow') ||
                         (type.includes('direct') && typeFilter === 'direct') ||
                         (type.includes('recurring') && typeFilter === 'recurring') ||
                         (type.includes('crypto') && typeFilter === 'crypto');
        
        if (timeMatch && statusMatch && typeMatch) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
    
    // Update table summary
    const visibleRows = document.querySelectorAll('.transactions-table tbody tr:not([style*="display: none"])').length;
    document.querySelector('.table-summary').textContent = `Showing 1-${visibleRows} of ${visibleRows} transactions`;
}

// Simulate real-time status updates
function updateTransactionStatus() {
    const pendingBadges = document.querySelectorAll('.status-badge.pending');
    
    pendingBadges.forEach(badge => {
        // 20% chance to update status
        if (Math.random() < 0.2) {
            badge.innerHTML = '<i class="fas fa-check-circle"></i> Completed';
            badge.classList.remove('pending');
            badge.classList.add('completed');
            
            // Update the amount color if it was negative (payment)
            const row = badge.closest('tr');
            const amountCell = row.querySelector('.amount');
            if (amountCell.classList.contains('negative')) {
                amountCell.classList.remove('negative');
                amountCell.classList.add('positive');
            }
            
            // Update blockchain link (simulate)
            const blockchainLink = row.querySelector('.blockchain-link');
            if (blockchainLink.classList.contains('inactive')) {
                blockchainLink.innerHTML = '<i class="fas fa-link"></i> 0x' + Math.random().toString(16).substr(2, 8) + '...';
                blockchainLink.href = 'https://etherscan.io/tx/0x' + Math.random().toString(16).substr(2, 8);
                blockchainLink.classList.remove('inactive');
            }
        }
    });
    
    // Update status update time
    document.querySelector('.status-update').innerHTML = `<i class="fas fa-sync-alt"></i> Updated just now`;
}

// Transaction form submission
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
            
            // In a real app, we would add the new transaction to the table
        }, 1500);
    });
}

// Export form submission
if (exportForm) {
    exportForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const format = document.getElementById('exportFormat').value;
        const range = document.getElementById('exportRange').value;
        
        // Simulate export
        const submitBtn = exportForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Exporting...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            // Show success message
            alert(`Exported transactions as ${format.toUpperCase()} (${range})`);
            
            // Reset form
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Close modal
            exportModal.classList.remove('active');
            document.body.style.overflow = '';
        }, 2000);
    });
}

// Table row click handler
document.querySelectorAll('.transactions-table tbody tr').forEach(row => {
    row.addEventListener('click', (e) => {
        // Don't trigger if clicking on a button or link
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('button') || e.target.closest('a')) {
            return;
        }
        
        // In a real app, this would show transaction details
        const txnId = row.querySelector('td:first-child').textContent;
        console.log(`Viewing details for transaction ${txnId}`);
    });
});

// View details button handlers
document.querySelectorAll('.table-actions .btn-icon:first-child').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const txnId = btn.closest('tr').querySelector('td:first-child').textContent;
        alert(`Viewing details for transaction ${txnId}`);
    });
});

// Other action button handlers
document.querySelectorAll('.table-actions .btn-icon:not(:first-child)').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.querySelector('i').className.replace('fas fa-', '');
        const txnId = btn.closest('tr').querySelector('td:first-child').textContent;
        
        switch (action) {
            case 'times':
                alert(`Cancel transaction ${txnId}`);
                break;
            case 'exclamation-triangle':
                alert(`Open dispute for transaction ${txnId}`);
                break;
            case 'receipt':
                alert(`Download receipt for transaction ${txnId}`);
                break;
            case 'redo':
                alert(`Retry failed transaction ${txnId}`);
                break;
        }
    });
});

// Pagination handlers
document.querySelector('.table-pagination .btn-icon:last-child').addEventListener('click', () => {
    alert('Loading next page of transactions');
});