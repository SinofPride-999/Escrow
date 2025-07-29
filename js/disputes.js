// DOM Elements
const newDisputeBtn = document.getElementById('newDisputeBtn');
const disputeModal = document.getElementById('disputeModal');
const modalClose = document.querySelectorAll('.modal-close');
const addEvidenceBtn = document.getElementById('addEvidenceBtn');
const evidenceModal = document.getElementById('evidenceModal');
const disputeFilter = document.getElementById('disputeFilter');
const disputeItems = document.querySelectorAll('.dispute-item');

// Initialize disputes
document.addEventListener('DOMContentLoaded', () => {
    // Check for hash in URL to show specific dispute
    if (window.location.hash) {
        const disputeId = window.location.hash.substring(1);
        if (disputeId) {
            // In a real app, we would fetch the dispute details
            console.log(`Loading dispute ${disputeId}`);
        }
    }
});

// New dispute modal
newDisputeBtn.addEventListener('click', () => {
    disputeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

// Add evidence modal
addEvidenceBtn.addEventListener('click', () => {
    evidenceModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

// Close modals
modalClose.forEach(btn => {
    btn.addEventListener('click', () => {
        disputeModal.classList.remove('active');
        evidenceModal.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close modals when clicking outside
[disputeModal, evidenceModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Dispute filter
if (disputeFilter) {
    disputeFilter.addEventListener('change', (e) => {
        const filterValue = e.target.value;
        console.log(`Filtering disputes by: ${filterValue}`);
        // In a real app, we would filter the disputes list
    });
}

// Dispute item click
disputeItems.forEach(item => {
    item.addEventListener('click', () => {
        // In a real app, this would load the dispute details
        console.log('Loading dispute details');
    });
});

// File upload preview
function setupFileUpload(inputId, previewId) {
    const fileInput = document.getElementById(inputId);
    const filePreview = document.querySelector(previewId);
    
    if (fileInput && filePreview) {
        fileInput.addEventListener('change', (e) => {
            filePreview.innerHTML = '';
            
            Array.from(e.target.files).forEach(file => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-preview-item';
                
                const fileIcon = document.createElement('i');
                fileIcon.className = 'fas fa-file-alt';
                
                const fileName = document.createElement('span');
                fileName.textContent = file.name;
                
                const removeBtn = document.createElement('button');
                removeBtn.innerHTML = '<i class="fas fa-times"></i>';
                removeBtn.addEventListener('click', () => {
                    fileItem.remove();
                    // In a real app, we would also remove the file from the FileList
                });
                
                fileItem.appendChild(fileIcon);
                fileItem.appendChild(fileName);
                fileItem.appendChild(removeBtn);
                filePreview.appendChild(fileItem);
            });
        });
    }
}

// Initialize file uploads
setupFileUpload('disputeEvidence', '.dispute-form .file-preview');
setupFileUpload('evidenceFiles', '.evidence-form .file-preview');

// Form submissions
const disputeForm = document.querySelector('.dispute-form');
if (disputeForm) {
    disputeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simulate processing
        const submitBtn = disputeForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            // Show success message
            alert('Dispute submitted successfully! Our team will review your case shortly.');
            
            // Reset form
            disputeForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Close modal
            disputeModal.classList.remove('active');
            document.body.style.overflow = '';
        }, 1500);
    });
}

const evidenceForm = document.querySelector('.evidence-form');
if (evidenceForm) {
    evidenceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simulate processing
        const submitBtn = evidenceForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            // Show success message
            alert('Evidence uploaded successfully!');
            
            // Reset form
            evidenceForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Close modal
            evidenceModal.classList.remove('active');
            document.body.style.overflow = '';
        }, 1500);
    });
}

// Message submission
const messageForm = document.querySelector('.message-composer');
if (messageForm) {
    const textarea = messageForm.querySelector('textarea');
    const sendBtn = messageForm.querySelector('.btn-primary');
    
    sendBtn.addEventListener('click', () => {
        if (textarea.value.trim() === '') return;
        
        // Simulate sending message
        const messageList = document.querySelector('.message-list');
        const newMessage = document.createElement('div');
        newMessage.className = 'message-item sent';
        newMessage.innerHTML = `
            <div class="message-avatar">
                <img src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg" alt="You">
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-sender">You</span>
                    <span class="message-time">Just now</span>
                </div>
                <div class="message-text">
                    <p>${textarea.value}</p>
                </div>
            </div>
        `;
        
        messageList.appendChild(newMessage);
        textarea.value = '';
        
        // Scroll to bottom
        messageList.scrollTop = messageList.scrollHeight;
        
        // Simulate reply after 1-3 seconds
        setTimeout(() => {
            const replies = [
                "We'll look into this matter and get back to you shortly.",
                "Can you provide more details about the issue?",
                "Thank you for your message. We're reviewing your case.",
                "We apologize for the inconvenience. Let us check this."
            ];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            
            const replyMessage = document.createElement('div');
            replyMessage.className = 'message-item received';
            replyMessage.innerHTML = `
                <div class="message-avatar">
                    <img src="https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg" alt="Other Party">
                </div>
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-sender">WebDev Pros</span>
                        <span class="message-time">Just now</span>
                    </div>
                    <div class="message-text">
                        <p>${randomReply}</p>
                    </div>
                </div>
            `;
            
            messageList.appendChild(replyMessage);
            messageList.scrollTop = messageList.scrollHeight;
        }, 1000 + Math.random() * 2000);
    });
    
    // Allow sending message with Enter key (but allow Shift+Enter for new lines)
    textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendBtn.click();
        }
    });
}