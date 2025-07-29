// DOM Elements
const conversationList = document.querySelector('.conversations');
const messagesContainer = document.querySelector('.messages-container');
const messageInput = document.querySelector('.message-input');
const sendBtn = document.querySelector('.send-btn');
const messageInputContainer = document.querySelector('.message-input-container');
const emptyState = document.querySelector('.empty-state');
const newMessageBtn = document.getElementById('newMessageBtn');
const emptyNewMessageBtn = document.getElementById('emptyNewMessageBtn');
const newMessageModal = document.getElementById('newMessageModal');
const recipientSearch = document.getElementById('recipientSearch');
const searchResults = document.querySelector('.search-results');
const initialMessage = document.getElementById('initialMessage');
const startConversationBtn = document.getElementById('startConversationBtn');
const emojiPickerBtn = document.getElementById('emojiPickerBtn');
const emojiPickerContainer = document.querySelector('.emoji-picker-container');
const emojiGrid = document.querySelector('.emoji-grid');
const attachmentBtns = document.querySelectorAll('.attachment-btn');
const editMessageModal = document.querySelector('.edit-message-modal');
const editMessageInput = document.querySelector('.edit-message-input');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const saveEditBtn = document.getElementById('saveEditBtn');

// State
let currentConversation = null;
let conversations = [];
let users = [];
let editingMessageId = null;

// Emoji categories and data
const emojiCategories = [
    { name: 'Smileys & People', icon: 'fa-smile' },
    { name: 'Animals & Nature', icon: 'fa-dog' },
    { name: 'Food & Drink', icon: 'fa-utensils' },
    { name: 'Travel & Places', icon: 'fa-plane' },
    { name: 'Activities', icon: 'fa-futbol' },
    { name: 'Objects', icon: 'fa-lightbulb' },
    { name: 'Symbols', icon: 'fa-heart' },
    { name: 'Flags', icon: 'fa-flag' }
];

// Sample emojis (in a real app, you'd use a complete emoji library)
const emojis = {
    'Smileys & People': ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇'],
    'Animals & Nature': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🦁', '🐮'],
    'Food & Drink': ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒'],
    'Travel & Places': ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎', '🚓', '🚑', '🚒', '🚐'],
    'Activities': ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸'],
    'Objects': ['⌚', '📱', '💻', '⌨️', '🖥', '🖨', '🖱', '🖲', '💽', '💾'],
    'Symbols': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔'],
    'Flags': ['🏳️', '🏴', '🏁', '🚩', '🏳️‍🌈', '🏴‍☠️', '🇺🇳', '🇦🇫', '🇦🇽', '🇦🇱']
};

// Initialize messaging
function initMessaging() {
    // Load sample data (in a real app, this would come from an API)
    loadSampleData();
    renderConversationList();
    setupEventListeners();
    initEmojiPicker();
    
    // Check if we have a conversation ID in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const conversationId = urlParams.get('conversation');
    
    if (conversationId) {
        const conversation = conversations.find(c => c.id === conversationId);
        if (conversation) {
            openConversation(conversation);
        }
    }
}

// Load sample data
function loadSampleData() {
    // Sample users
    users = [
        { id: 'user1', name: 'Alice Johnson', email: 'alice@example.com', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', online: true },
        { id: 'user2', name: 'Bob Smith', email: 'bob@example.com', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', online: false },
        { id: 'user3', name: 'Charlie Brown', email: 'charlie@example.com', avatar: 'https://randomuser.me/api/portraits/men/67.jpg', online: true },
        { id: 'user4', name: 'Diana Prince', email: 'diana@example.com', avatar: 'https://randomuser.me/api/portraits/women/63.jpg', online: false }
    ];
    
    // Sample conversations
    conversations = [
        {
            id: 'conv1',
            participants: ['user1', 'user2'],
            lastMessage: 'Thanks for the secure transaction!',
            lastMessageTime: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
            unread: 0,
            messages: [
                {
                    id: 'msg1',
                    sender: 'user1',
                    text: 'Hi Bob, I\'ve sent the payment via escrow',
                    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
                    attachments: [],
                    status: 'delivered'
                },
                {
                    id: 'msg2',
                    sender: 'user2',
                    text: 'Received! I\'ll ship the item tomorrow morning',
                    timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
                    attachments: [],
                    status: 'delivered'
                },
                {
                    id: 'msg3',
                    sender: 'user1',
                    text: 'Great, I\'ll release the funds once I receive it',
                    timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
                    attachments: [],
                    status: 'delivered'
                },
                {
                    id: 'msg4',
                    sender: 'user2',
                    text: 'Thanks for the secure transaction!',
                    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
                    attachments: [],
                    status: 'read'
                }
            ]
        },
        {
            id: 'conv2',
            participants: ['user1', 'user3'],
            lastMessage: 'The documents are attached',
            lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            unread: 3,
            messages: [
                {
                    id: 'msg5',
                    sender: 'user3',
                    text: 'Hi Alice, I need those contract documents',
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
                    attachments: [],
                    status: 'delivered'
                },
                {
                    id: 'msg6',
                    sender: 'user1',
                    text: 'Sure, I\'ll send them over',
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5), // 2.5 hours ago
                    attachments: [],
                    status: 'delivered'
                },
                {
                    id: 'msg7',
                    sender: 'user1',
                    text: '',
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
                    attachments: [
                        { type: 'document', name: 'contract.pdf', size: '2.4 MB', url: '#' }
                    ],
                    status: 'delivered'
                }
            ]
        },
        {
            id: 'conv3',
            participants: ['user1', 'user4'],
            lastMessage: 'The product looks good',
            lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
            unread: 0,
            messages: [
                {
                    id: 'msg8',
                    sender: 'user4',
                    text: 'Hi Alice, here are the product photos',
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26), // 26 hours ago
                    attachments: [
                        { type: 'image', name: 'product1.jpg', size: '1.2 MB', url: '#' },
                        { type: 'image', name: 'product2.jpg', size: '1.5 MB', url: '#' }
                    ],
                    status: 'delivered'
                },
                {
                    id: 'msg9',
                    sender: 'user1',
                    text: 'The product looks good',
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 24 hours ago
                    attachments: [],
                    status: 'read'
                }
            ]
        }
    ];
}

// Render conversation list
function renderConversationList() {
    conversationList.innerHTML = '';
    
    if (conversations.length === 0) {
        conversationList.innerHTML = `
            <div class="empty-conversations">
                <i class="fas fa-comment-slash"></i>
                <p>No conversations yet</p>
                <button class="btn btn-primary btn-sm" id="startFirstConversationBtn">
                    Start your first conversation
                </button>
            </div>
        `;
        
        document.getElementById('startFirstConversationBtn')?.addEventListener('click', () => {
            newMessageModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        return;
    }
    
    conversations.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
    
    conversations.forEach(conversation => {
        const otherParticipantId = conversation.participants.find(id => id !== 'user1'); // Assuming current user is user1
        const user = users.find(u => u.id === otherParticipantId);
        
        if (!user) return;
        
        const conversationEl = document.createElement('div');
        conversationEl.className = `conversation-item ${currentConversation?.id === conversation.id ? 'active' : ''}`;
        conversationEl.innerHTML = `
            <img src="${user.avatar}" alt="${user.name}" class="conversation-avatar">
            <div class="conversation-info">
                <div class="conversation-name">
                    <span>${user.name}</span>
                    <span class="conversation-time">${formatTime(conversation.lastMessageTime)}</span>
                </div>
                <div class="conversation-preview">
                    ${conversation.lastMessage}
                    ${conversation.unread > 0 ? `<span class="conversation-unread">${conversation.unread}</span>` : ''}
                </div>
            </div>
        `;
        
        conversationEl.addEventListener('click', () => openConversation(conversation));
        conversationList.appendChild(conversationEl);
    });
}

// Format time for display
function formatTime(date) {
    const now = new Date();
    const diff = now - date;
    
    if (diff < 1000 * 60 * 60) { // Less than 1 hour
        const mins = Math.floor(diff / (1000 * 60));
        return `${mins}m ago`;
    } else if (diff < 1000 * 60 * 60 * 24) { // Less than 1 day
        const hours = Math.floor(diff / (1000 * 60 * 60));
        return `${hours}h ago`;
    } else if (diff < 1000 * 60 * 60 * 24 * 7) { // Less than 1 week
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        return `${days}d ago`;
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}

// Open a conversation
function openConversation(conversation) {
    currentConversation = conversation;
    updateURL(conversation.id);
    
    // Update conversation list UI
    document.querySelectorAll('.conversation-item').forEach(item => {
        item.classList.remove('active');
        if (item.querySelector('.conversation-name span').textContent === getUserName(conversation.participants.find(id => id !== 'user1'))) {
            item.classList.add('active');
        }
    });
    
    // Update chat header
    const otherParticipantId = conversation.participants.find(id => id !== 'user1');
    const user = users.find(u => u.id === otherParticipantId);
    
    const chatHeader = document.querySelector('.chat-header');
    chatHeader.innerHTML = `
        <img src="${user.avatar}" alt="${user.name}" class="chat-avatar">
        <div class="chat-user-info">
            <h3 class="chat-user-name">${user.name}</h3>
            <div class="chat-user-status">${user.online ? '<div class="chat-status"><span class="online"></span> Online</div>' : 'Last seen ' + formatTime(user.lastSeen)}</div>
        </div>
        <div class="chat-actions">
            <button class="chat-action-btn" title="User details">
                <i class="fas fa-info-circle"></i>
            </button>
            <button class="chat-action-btn" title="Security details">
                <i class="fas fa-shield-alt"></i>
            </button>
        </div>
    `;
    
    // Show message input
    messageInputContainer.style.display = 'block';
    emptyState.style.display = 'none';
    
    // Render messages
    renderMessages(conversation.messages);
    
    // Mark messages as read
    if (conversation.unread > 0) {
        markMessagesAsRead(conversation.id);
    }
    
    // Scroll to bottom
    scrollToBottom();
}

// Update URL with conversation ID
function updateURL(conversationId) {
    const url = new URL(window.location);
    url.searchParams.set('conversation', conversationId);
    window.history.pushState({}, '', url);
}

// Render messages
function renderMessages(messages) {
    messagesContainer.innerHTML = '';
    
    if (messages.length === 0) {
        messagesContainer.innerHTML = `
            <div class="empty-messages">
                <i class="fas fa-comment-alt"></i>
                <p>No messages yet</p>
                <p>Start the conversation with ${getUserName(currentConversation.participants.find(id => id !== 'user1'))}</p>
            </div>
        `;
        return;
    }
    
    let currentDate = null;
    
    messages.forEach(message => {
        const messageDate = new Date(message.timestamp).toDateString();
        
        // Add date separator if needed
        if (messageDate !== currentDate) {
            currentDate = messageDate;
            const dateEl = document.createElement('div');
            dateEl.className = 'message-date';
            dateEl.innerHTML = `<span>${formatDate(message.timestamp)}</span>`;
            messagesContainer.appendChild(dateEl);
        }
        
        const messageEl = document.createElement('div');
        messageEl.className = `message-item ${message.sender === 'user1' ? 'sent' : 'received'}`;
        
        // Check if message can be edited/deleted (within 5 minutes)
        const canEditDelete = (new Date() - new Date(message.timestamp)) < 1000 * 60 * 5;
        
        messageEl.innerHTML = `
            <div class="message-bubble">
                ${message.text ? `<div class="message-text">${message.text}</div>` : ''}
                
                ${message.attachments?.length > 0 ? `
                    <div class="message-attachments">
                        ${message.attachments.map(attachment => `
                            <div class="attachment-item">
                                <div class="attachment-preview">
                                    ${attachment.type === 'image' ? 
                                        `<img src="${attachment.url}" alt="${attachment.name}">` : 
                                        `<i class="fas fa-file-alt file-icon"></i>`}
                                    <button class="attachment-download" title="Download">
                                        <i class="fas fa-download"></i>
                                    </button>
                                </div>
                                <div class="attachment-info">
                                    <div class="attachment-name">${attachment.name}</div>
                                    <div class="attachment-size">${attachment.size}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                <div class="message-meta">
                    <span class="message-time">${formatMessageTime(message.timestamp)}</span>
                    ${message.sender === 'user1' ? `<span class="message-status"><i class="fas fa-${message.status === 'read' ? 'check-double' : 'check'}"></i></span>` : ''}
                </div>
            </div>
            
            ${canEditDelete && message.sender === 'user1' ? `
                <div class="message-actions">
                    <button class="message-action-btn" data-action="edit" data-message-id="${message.id}" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="message-action-btn" data-action="delete" data-message-id="${message.id}" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            ` : ''}
        `;
        
        messagesContainer.appendChild(messageEl);
    });
}

// Format date for display
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Format message time for display
function formatMessageTime(date) {
    return new Date(date).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit' 
    });
}

// Get user name by ID
function getUserName(userId) {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
}

// Mark messages as read
function markMessagesAsRead(conversationId) {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;
    
    // Update unread count
    conversation.unread = 0;
    
    // Update message statuses
    conversation.messages.forEach(message => {
        if (message.sender !== 'user1' && message.status !== 'read') {
            message.status = 'read';
        }
    });
    
    // Update UI
    renderConversationList();
}

// Send a new message
function sendMessage() {
    const text = messageInput.value.trim();
    if (!text && !currentAttachments.length) return;
    
    const newMessage = {
        id: `msg${Date.now()}`,
        sender: 'user1',
        text: text,
        timestamp: new Date(),
        attachments: [...currentAttachments],
        status: 'sent'
    };
    
    // Add to current conversation
    currentConversation.messages.push(newMessage);
    currentConversation.lastMessage = text || `${currentAttachments.length} attachment${currentAttachments.length !== 1 ? 's' : ''}`;
    currentConversation.lastMessageTime = new Date();
    
    // Clear input and attachments
    messageInput.value = '';
    currentAttachments = [];
    
    // Update UI
    renderMessages(currentConversation.messages);
    renderConversationList();
    scrollToBottom();
    
    // Simulate message delivery and read status
    setTimeout(() => {
        newMessage.status = 'delivered';
        updateMessageStatus(newMessage.id, 'delivered');
        
        setTimeout(() => {
            newMessage.status = 'read';
            updateMessageStatus(newMessage.id, 'read');
        }, 1000);
    }, 500);
}

// Update message status in UI
function updateMessageStatus(messageId, status) {
    const messageEl = document.querySelector(`.message-item.sent [data-message-id="${messageId}"]`);
    if (messageEl) {
        const statusIcon = messageEl.querySelector('.message-status i');
        if (statusIcon) {
            statusIcon.className = `fas fa-${status === 'read' ? 'check-double' : 'check'}`;
        }
    }
}

// Scroll to bottom of messages
function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Initialize emoji picker
function initEmojiPicker() {
    // Add categories
    const categoriesEl = document.querySelector('.emoji-categories');
    emojiCategories.forEach((category, index) => {
        const categoryEl = document.createElement('button');
        categoryEl.className = `emoji-category ${index === 0 ? 'active' : ''}`;
        categoryEl.innerHTML = `<i class="fas ${category.icon}"></i>`;
        categoryEl.title = category.name;
        categoryEl.addEventListener('click', () => showEmojiCategory(category.name));
        categoriesEl.appendChild(categoryEl);
    });
    
    // Show first category by default
    showEmojiCategory(emojiCategories[0].name);
}

// Show emojis for a specific category
function showEmojiCategory(categoryName) {
    emojiGrid.innerHTML = '';
    
    // Update active category
    document.querySelectorAll('.emoji-category').forEach(el => {
        el.classList.remove('active');
        if (el.title === categoryName) {
            el.classList.add('active');
        }
    });
    
    // Add emojis
    emojis[categoryName].forEach(emoji => {
        const emojiEl = document.createElement('button');
        emojiEl.className = 'emoji';
        emojiEl.textContent = emoji;
        emojiEl.addEventListener('click', () => insertEmoji(emoji));
        emojiGrid.appendChild(emojiEl);
    });
}

// Insert emoji into message input
function insertEmoji(emoji) {
    messageInput.value += emoji;
    messageInput.focus();
    emojiPickerContainer.classList.remove('visible');
}

// Setup event listeners
function setupEventListeners() {
    // Send message on button click
    sendBtn.addEventListener('click', sendMessage);
    
    // Send message on Enter (but allow Shift+Enter for new lines)
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Enable/disable send button based on input
    messageInput.addEventListener('input', () => {
        sendBtn.disabled = messageInput.value.trim().length === 0 && currentAttachments.length === 0;
    });
    
    // New message buttons
    newMessageBtn.addEventListener('click', () => {
        newMessageModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    emptyNewMessageBtn.addEventListener('click', () => {
        newMessageModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Search for recipients
    recipientSearch.addEventListener('input', () => {
        const query = recipientSearch.value.trim().toLowerCase();
        
        if (query.length === 0) {
            searchResults.innerHTML = '';
            return;
        }
        
        const results = users.filter(user => 
            user.id !== 'user1' && // Don't show current user
            (user.name.toLowerCase().includes(query) || 
            user.email.toLowerCase().includes(query)
        );
        
        renderSearchResults(results);
    });
    
    // Start new conversation
    startConversationBtn.addEventListener('click', () => {
        const selectedUser = document.querySelector('.user-result.selected');
        if (!selectedUser) return;
        
        const userId = selectedUser.dataset.userId;
        const message = initialMessage.value.trim();
        
        // Create new conversation
        const newConversation = {
            id: `conv${Date.now()}`,
            participants: ['user1', userId],
            lastMessage: message || 'New conversation started',
            lastMessageTime: new Date(),
            unread: 0,
            messages: message ? [{
                id: `msg${Date.now()}`,
                sender: 'user1',
                text: message,
                timestamp: new Date(),
                attachments: [],
                status: 'sent'
            }] : []
        };
        
        conversations.unshift(newConversation);
        
        // Close modal and open new conversation
        newMessageModal.classList.remove('active');
        document.body.style.overflow = '';
        openConversation(newConversation);
        renderConversationList();
        
        // Clear inputs
        recipientSearch.value = '';
        initialMessage.value = '';
        searchResults.innerHTML = '';
    });
    
    // Emoji picker
    emojiPickerBtn.addEventListener('click', () => {
        emojiPickerContainer.classList.toggle('visible');
    });
    
    // Close emoji picker when clicking outside
    document.addEventListener('click', (e) => {
        if (!emojiPickerBtn.contains(e.target) && !emojiPickerContainer.contains(e.target)) {
            emojiPickerContainer.classList.remove('visible');
        }
    });
    
    // Handle message actions (edit/delete)
    messagesContainer.addEventListener('click', (e) => {
        const actionBtn = e.target.closest('.message-action-btn');
        if (!actionBtn) return;
        
        const action = actionBtn.dataset.action;
        const messageId = actionBtn.dataset.messageId;
        
        if (action === 'edit') {
            editMessage(messageId);
        } else if (action === 'delete') {
            deleteMessage(messageId);
        }
    });
    
    // Edit message modal
    cancelEditBtn.addEventListener('click', () => {
        editMessageModal.classList.remove('active');
    });
    
    saveEditBtn.addEventListener('click', () => {
        saveEditedMessage();
    });
    
    // Handle attachment buttons
    let currentAttachments = [];
    
    attachmentBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.type;
            
            if (type === 'image' || type === 'document') {
                // In a real app, this would open a file picker
                // For demo purposes, we'll simulate adding an attachment
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = type === 'image' ? 'image/*' : '.pdf,.doc,.docx,.txt';
                
                fileInput.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    
                    const attachment = {
                        type: type,
                        name: file.name,
                        size: formatFileSize(file.size),
                        url: URL.createObjectURL(file)
                    };
                    
                    currentAttachments.push(attachment);
                    sendBtn.disabled = false;
                    
                    // Show attachment preview (simplified for demo)
                    console.log('Attachment added:', attachment);
                });
                
                fileInput.click();
            }
        });
    });
}

// Format file size
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
}

// Render search results
function renderSearchResults(results) {
    searchResults.innerHTML = '';
    
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="no-results">No users found</div>';
        return;
    }
    
    results.forEach(user => {
        const userEl = document.createElement('div');
        userEl.className = 'user-result';
        userEl.dataset.userId = user.id;
        userEl.innerHTML = `
            <img src="${user.avatar}" alt="${user.name}" class="user-avatar">
            <div class="user-info">
                <div class="user-name">${user.name}</div>
                <div class="user-email">${user.email}</div>
            </div>
        `;
        
        userEl.addEventListener('click', () => {
            document.querySelectorAll('.user-result').forEach(el => el.classList.remove('selected'));
            userEl.classList.add('selected');
        });
        
        searchResults.appendChild(userEl);
    });
}

// Edit a message
function editMessage(messageId) {
    const message = currentConversation.messages.find(m => m.id === messageId);
    if (!message) return;
    
    editingMessageId = messageId;
    editMessageInput.value = message.text;
    editMessageModal.classList.add('active');
}

// Save edited message
function saveEditedMessage() {
    if (!editingMessageId) return;
    
    const newText = editMessageInput.value.trim();
    if (!newText) return;
    
    const message = currentConversation.messages.find(m => m.id === editingMessageId);
    if (!message) return;
    
    message.text = newText;
    message.timestamp = new Date(); // Update timestamp to show edited status
    
    // Update UI
    renderMessages(currentConversation.messages);
    editMessageModal.classList.remove('active');
}

// Delete a message
function deleteMessage(messageId) {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    const messageIndex = currentConversation.messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;
    
    currentConversation.messages.splice(messageIndex, 1);
    
    // Update last message if needed
    if (currentConversation.messages.length > 0) {
        const lastMessage = currentConversation.messages[currentConversation.messages.length - 1];
        currentConversation.lastMessage = lastMessage.text || `${lastMessage.attachments.length} attachment${lastMessage.attachments.length !== 1 ? 's' : ''}`;
        currentConversation.lastMessageTime = lastMessage.timestamp;
    } else {
        currentConversation.lastMessage = 'No messages';
        currentConversation.lastMessageTime = new Date();
    }
    
    // Update UI
    renderMessages(currentConversation.messages);
    renderConversationList();
}

// Initialize messaging when DOM is loaded
document.addEventListener('DOMContentLoaded', initMessaging);