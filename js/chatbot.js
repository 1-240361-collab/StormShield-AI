// js/chatbot.js
import { RESPONSES, FALLBACK_RESPONSE } from './chatbot-responses.js';

const toggleBtn = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const closeBtn = document.getElementById('chat-close');
const sendBtn = document.getElementById('chat-send');
const input = document.getElementById('chat-input');
const messages = document.getElementById('chat-messages');

// --- Toggle chat window ---
toggleBtn.addEventListener('click', () => {
    chatWindow.classList.toggle('hidden');
    if (!chatWindow.classList.contains('hidden')) {
        input.focus();
    }
});

// --- Close chat window ---
closeBtn.addEventListener('click', () => {
    chatWindow.classList.add('hidden');
});

// --- Send on Enter key ---
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
});

sendBtn.addEventListener('click', handleSend);

// --- Core send handler ---
function handleSend() {
    const text = input.value.trim();
    if (!text) return;

    // Show user message
    addMessage(text, 'user');
    input.value = '';
    sendBtn.disabled = true;

    // Show "typing" indicator
    const typingId = addMessage('StormShield AI is typing...', 'bot', true);

    // Simulate AI thinking (800ms) then respond
    setTimeout(() => {
        removeMessage(typingId);
        const response = findResponse(text);
        addMessage(response, 'bot');
        sendBtn.disabled = false;
        input.focus();
    }, 800);
}

// --- Add message to chat ---
function addMessage(text, sender, isTyping = false) {
    const el = document.createElement('div');
    el.className = `chat-message ${sender}${isTyping ? ' typing' : ''}`;
    el.textContent = text;
    if (isTyping) el.dataset.typing = 'true';
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
    return el;
}

// --- Remove a message (for typing indicator) ---
function removeMessage(el) {
    if (el && el.parentNode) el.parentNode.removeChild(el);
}

// --- Find best response by keyword matching ---
function findResponse(userText) {
    const lower = userText.toLowerCase();
    const words = lower.split(/\s+/);

    let bestMatch = null;
    let bestScore = 0;

    for (const entry of RESPONSES) {
        let score = 0;
        for (const keyword of entry.keywords) {
            // Check if keyword (or part of it) is in the text
            if (lower.includes(keyword.toLowerCase())) {
                score += keyword.length; // Longer keywords weigh more
            }
            // Bonus: exact word match
            if (words.includes(keyword.toLowerCase())) {
                score += 5;
            }
        }
        if (score > bestScore) {
            bestScore = score;
            bestMatch = entry;
        }
    }

    // If no meaningful match, use fallback
    if (bestScore < 3 || !bestMatch) {
        return FALLBACK_RESPONSE;
    }

    return bestMatch.answer;
}