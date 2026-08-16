// chatbot.js – Include this file on every page

(function() {
    'use strict';

    // ── 1. Inject the chatbot HTML ──
    var chatbotHTML = `
    <!-- CHATBOT WIDGET (Tailwind CSS) -->
    <div class="fixed bottom-6 right-6 z-[9999] font-sans" id="brChatbot">
      <!-- Toggle Button -->
      <button class="w-16 h-16 rounded-full bg-gradient-to-br from-[#470082] to-[#7a3fbb] text-white shadow-2xl hover:shadow-[0_12px_40px_rgba(71,0,130,0.55)] hover:scale-105 transition-all duration-300 flex items-center justify-center text-3xl relative" id="brChatToggle" aria-label="Toggle Chat">
        <span class="br-icon-open">
          <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <path d="M8 10h.01" />
            <path d="M12 10h.01" />
            <path d="M16 10h.01" />
          </svg>
        </span>
        <span class="br-icon-close hidden">
          <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </span>
        <span class="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white br-pulse-dot"></span>
      </button>

      <!-- Chat Window -->
      <div class="br-chat-window absolute bottom-20 right-0 w-[380px] max-w-[calc(100vw-3rem)] h-[520px] max-h-[calc(100vh-10rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden" id="brChatWindow">
        <!-- Header -->
        <div class="bg-gradient-to-r from-[#470082] to-[#6121a1] text-white px-5 py-4 flex items-center justify-between flex-shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-base border-2 border-white/30">BR</div>
            <div>
              <div class="font-bold text-sm">Brand Republic</div>
              <div class="text-xs opacity-75">✦ Online • Ready to help</div>
            </div>
          </div>
          <button class="text-white/70 hover:text-white hover:bg-white/15 rounded-lg p-1 transition" id="brChatCloseBtn" aria-label="Close chat">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <!-- Messages -->
        <div class="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-2 br-chat-messages" id="brChatMessages">
          <div class="br-message self-start bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-2.5 text-sm text-gray-800 shadow-sm max-w-[85%]">
            👋 Hi there! I'm the Brand Republic assistant.<br />
            Ask me about our media, locations, or how we can help your brand stand out.
            <span class="block text-[10px] text-gray-400 mt-1">Just now</span>
          </div>
        </div>

        <!-- Input -->
        <div class="flex items-center gap-2 px-4 py-3 bg-white border-t border-gray-200 flex-shrink-0">
          <input type="text" id="brChatInput" placeholder="Type your message..." autocomplete="off" class="flex-1 border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-[#470082] bg-gray-50 focus:bg-white transition" />
          <button class="w-11 h-11 rounded-full bg-gradient-to-br from-[#470082] to-[#6121a1] text-white flex items-center justify-center hover:scale-105 transition disabled:opacity-50 disabled:scale-100" id="brChatSendBtn" aria-label="Send message">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        <div class="text-center text-[10px] text-gray-400 py-1.5 bg-white border-t border-gray-100">We reply in seconds • Powered by Brand Republic</div>
      </div>
    </div>
    `;

    // ── 2. Inject the required custom CSS (Tailwind can't handle these) ──
    var chatbotCSS = `
    /* Pulse glow for notification dot */
    @keyframes br-pulse-glow {
      0%, 100% { box-shadow: 0 0 0 0 rgba(71,0,130,0.4); }
      50% { box-shadow: 0 0 0 12px rgba(71,0,130,0); }
    }
    .br-pulse-dot { animation: br-pulse-glow 1.5s ease-in-out infinite; }

    /* Message slide-in animation */
    @keyframes br-msg-in {
      0% { opacity: 0; transform: translateY(10px) scale(0.97); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    .br-message { animation: br-msg-in 0.35s cubic-bezier(0.22,1,0.36,1) forwards; opacity: 0; }

    /* Typing indicator dots */
    @keyframes br-typing-bounce {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
      30% { transform: translateY(-6px); opacity: 1; }
    }
    .br-typing-dot { animation: br-typing-bounce 1.4s ease-in-out infinite; }
    .br-typing-dot:nth-child(1) { animation-delay: 0s; }
    .br-typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .br-typing-dot:nth-child(3) { animation-delay: 0.4s; }

    /* Chat window open/close transition */
    .br-chat-window {
      transform-origin: bottom right;
      transform: scale(0.85) translateY(20px);
      opacity: 0;
      pointer-events: none;
      transition: all 0.35s cubic-bezier(0.22,1,0.36,1);
    }
    .br-chat-window.open {
      transform: scale(1) translateY(0);
      opacity: 1;
      pointer-events: auto;
    }

    /* Scrollbar styling */
    .br-chat-messages::-webkit-scrollbar { width: 4px; }
    .br-chat-messages::-webkit-scrollbar-track { background: transparent; }
    .br-chat-messages::-webkit-scrollbar-thumb { background: #cec3d4; border-radius: 10px; }

    /* Quick reply hover */
    .br-quick-reply-btn:hover {
      background: #470082;
      color: #fff;
      border-color: #470082;
      transform: scale(1.04);
    }
    `;

    // ── 3. Append HTML and CSS to the page ──
    var styleTag = document.createElement('style');
    styleTag.textContent = chatbotCSS;
    document.head.appendChild(styleTag);

    var container = document.createElement('div');
    container.innerHTML = chatbotHTML;
    document.body.appendChild(container.firstElementChild);

    // ── 4. Initialize the chatbot logic ──
    // Wait a tick for DOM to be ready
    setTimeout(function() {
        // DOM refs
        var toggle = document.getElementById('brChatToggle');
        var windowEl = document.getElementById('brChatWindow');
        var closeBtn = document.getElementById('brChatCloseBtn');
        var messages = document.getElementById('brChatMessages');
        var input = document.getElementById('brChatInput');
        var sendBtn = document.getElementById('brChatSendBtn');
        var dot = document.querySelector('.br-pulse-dot');

        if (!toggle || !windowEl) return; // safety

        var isOpen = false;
        var isProcessing = false;

        // ── Knowledge base ──
        var responses = {
            'hello': 'Hello! 👋 How can I help you today?',
            'hi': 'Hi there! 👋 What can I assist you with?',
            'hey': 'Hey! 👋 How can I make your brand shine today?',
            'help': 'I can help you with:\n• 📍 Media locations & inventory\n• 📊 Campaign costs & ROI\n• 🎯 Brand solutions\n• 📞 Contact details\n• 🏢 About Brand Republic\n\nJust ask away!',
            'media': 'We offer a wide range of outdoor media:\n• Billboards (static & digital)\n• Street furniture\n• Transit media (buses, taxis)\n• Landmark branding\n• Digital OOH screens\n\nWhich one interests you?',
            'location': 'We have prime locations across Uganda:\n• Kampala (City Centre, Jinja Road, Entebbe Road)\n• Entebbe\n• Jinja\n• Gulu\n\nOur interactive map shows real-time availability.',
            'cost': 'Our pricing depends on:\n• Location & traffic\n• Media type & size\n• Campaign duration\n• Production complexity\n\n📩 Request a quotation for a custom quote!',
            'billboard': 'Billboards in Uganda range from USD 500–5,000+ per month depending on:\n• Location (prime vs secondary)\n• Size (48-sheet, 96-sheet, etc.)\n• Digital vs static\n• Duration\n\nWe can help you find the perfect spot!',
            'contact': '📞 Call us: +256 700 123 456\n📧 Email: hello@brandrepublic.ug\n📍 Visit: Kampala, Uganda\n\nOr fill out our contact form on the website!',
            'about': 'Brand Republic is Uganda\'s premier outdoor advertising and brand experience company. We combine strategic locations, bold creativity, and reliable execution to make brands impossible to ignore. 🚀',
            'services': 'Our services include:\n• Outdoor Media (Billboards, DOOH, Transit)\n• Brand Solutions (Environmental, Retail, Corporate)\n• Innovation (3D, Digital Experiences, Activations)\n• Media Planning & Strategy\n\nWe handle everything from concept to execution!',
            'thank': 'You\'re welcome! 😊 Is there anything else I can help you with?',
            'thanks': 'You\'re welcome! 😊 Let me know if you need anything else.',
            'bye': 'Goodbye! 👋 Feel free to come back anytime. Have a great day!',
            'goodbye': 'Goodbye! 👋 Wishing you success with your brand!',
        };

        var fallbacks = [
            "That's a great question! 😊 Could you please rephrase or pick one of the quick replies below?",
            "I'm not entirely sure I understand. Would you like to know about our media, locations, or pricing?",
            "Hmm, I don't have an answer for that yet. Try asking about 'media', 'location', 'cost', or 'contact'!",
            "I'm still learning! 🤖 For now, ask me about our media, locations, or how to get a quote.",
        ];

        var quickReplies = [
            { label: '📍 Media', value: 'media' },
            { label: '📊 Cost', value: 'cost' },
            { label: '📍 Locations', value: 'location' },
            { label: '📞 Contact', value: 'contact' },
            { label: '🏢 About', value: 'about' },
            { label: '🎯 Services', value: 'services' },
        ];

        // ── Helpers ──
        function getResponse(input) {
            var lower = input.toLowerCase().trim();
            for (var key in responses) {
                if (responses.hasOwnProperty(key)) {
                    if (lower.includes(key) || key.includes(lower)) {
                        return responses[key];
                    }
                }
            }
            var keywords = {
                'billboard': 'billboard',
                'price': 'cost',
                'pricing': 'cost',
                'rate': 'cost',
                'where': 'location',
                'address': 'contact',
                'phone': 'contact',
                'email': 'contact',
                'who': 'about',
                'what': 'services',
                'offer': 'services',
                'do': 'services',
            };
            for (var word in keywords) {
                if (keywords.hasOwnProperty(word) && lower.includes(word)) {
                    return responses[keywords[word]] || fallbacks[Math.floor(Math.random() * fallbacks.length)];
                }
            }
            return fallbacks[Math.floor(Math.random() * fallbacks.length)];
        }

        function renderQuickReplies() {
            var wrap = document.createElement('div');
            wrap.className = 'flex flex-wrap gap-2 mt-2';
            quickReplies.forEach(function(q) {
                var btn = document.createElement('button');
                btn.className =
                    'br-quick-reply-btn bg-gray-100 border border-gray-300 rounded-full px-3.5 py-1 text-xs font-semibold text-[#470082] transition-all duration-200 cursor-pointer';
                btn.textContent = q.label;
                btn.addEventListener('click', function() {
                    input.value = q.value;
                    sendMessage();
                });
                wrap.appendChild(btn);
            });
            return wrap;
        }

        function addMessage(text, sender, quickRepliesHtml) {
            var div = document.createElement('div');
            div.className = 'br-message ' + (sender === 'bot' ?
                'self-start bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-2.5 text-sm text-gray-800 shadow-sm max-w-[85%]' :
                'self-end bg-gradient-to-r from-[#470082] to-[#6121a1] text-white rounded-2xl rounded-br-none px-4 py-2.5 text-sm shadow-sm max-w-[85%]');

            var lines = text.split('\n');
            lines.forEach(function(line, index) {
                if (index > 0) {
                    div.appendChild(document.createElement('br'));
                }
                var span = document.createElement('span');
                span.textContent = line;
                div.appendChild(span);
            });

            var time = document.createElement('span');
            time.className = 'block text-[10px] mt-1 ' + (sender === 'bot' ? 'text-gray-400' : 'text-white/60');
            var now = new Date();
            time.textContent = now.getHours().toString().padStart(2, '0') + ':' +
                now.getMinutes().toString().padStart(2, '0');
            div.appendChild(time);

            if (quickRepliesHtml) {
                div.appendChild(quickRepliesHtml);
            }

            messages.appendChild(div);
            messages.scrollTop = messages.scrollHeight;
        }

        function showTyping() {
            var div = document.createElement('div');
            div.className = 'self-start bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1 shadow-sm';
            div.id = 'brTypingIndicator';
            for (var i = 0; i < 3; i++) {
                var dotEl = document.createElement('span');
                dotEl.className = 'br-typing-dot w-2 h-2 bg-gray-400 rounded-full inline-block';
                div.appendChild(dotEl);
            }
            messages.appendChild(div);
            messages.scrollTop = messages.scrollHeight;
        }

        function hideTyping() {
            var el = document.getElementById('brTypingIndicator');
            if (el) el.remove();
        }

        function sendMessage() {
            var text = input.value.trim();
            if (!text || isProcessing) return;

            addMessage(text, 'user');
            input.value = '';
            input.disabled = true;
            sendBtn.disabled = true;
            isProcessing = true;

            showTyping();

            var delay = 400 + Math.random() * 500;
            setTimeout(function() {
                hideTyping();
                var reply = getResponse(text);
                var qr = (text.toLowerCase().includes('help') || text.toLowerCase().includes('hi') ||
                    text.toLowerCase().includes('hello')) ? renderQuickReplies() : null;
                addMessage(reply, 'bot', qr);
                input.disabled = false;
                sendBtn.disabled = false;
                isProcessing = false;
                input.focus();
            }, delay);
        }

        function openChat() {
            isOpen = true;
            windowEl.classList.add('open');
            toggle.classList.add('active');
            toggle.querySelector('.br-icon-open').classList.add('hidden');
            toggle.querySelector('.br-icon-close').classList.remove('hidden');
            if (dot) dot.style.display = 'none';
            setTimeout(function() { input.focus(); }, 400);
            var firstMsg = messages.querySelector('.br-message.bot');
            if (firstMsg && !firstMsg.querySelector('.flex.flex-wrap')) {
                var qr = renderQuickReplies();
                firstMsg.appendChild(qr);
            }
        }

        function closeChat() {
            isOpen = false;
            windowEl.classList.remove('open');
            toggle.classList.remove('active');
            toggle.querySelector('.br-icon-open').classList.remove('hidden');
            toggle.querySelector('.br-icon-close').classList.add('hidden');
        }

        function toggleChat() {
            if (isOpen) { closeChat(); } else { openChat(); }
        }

        // ── Event listeners ──
        toggle.addEventListener('click', toggleChat);
        closeBtn.addEventListener('click', closeChat);
        sendBtn.addEventListener('click', sendMessage);
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isOpen) {
                closeChat();
            }
        });

        // ── Add quick replies to welcome message after a moment ──
        setTimeout(function() {
            var firstMsg = messages.querySelector('.br-message.bot');
            if (firstMsg && !firstMsg.querySelector('.flex.flex-wrap')) {
                var qr = renderQuickReplies();
                firstMsg.appendChild(qr);
            }
        }, 800);

        // ── Hide dot on first click ──
        toggle.addEventListener('click', function() {
            if (dot) dot.style.display = 'none';
        });

        console.log('🤖 Brand Republic Chatbot (Tailwind) loaded!');
    }, 0);
})();