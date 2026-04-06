/**
 * ============================================================================
 * TELEGRAM WEB CLIENT - APP.JS
 * ============================================================================
 * 
 * Frontend-only Telegram Bot client dengan fitur lengkap:
 * - Auto load chats dari getUpdates
 * - Realtime update setiap 5 detik
 * - Kirim pesan, media, lokasi
 * - Spam mode
 * - MikroTik monitoring
 * 
 * ⚠️ PERINGATAN: Token disimpan di frontend (tidak aman untuk production!)
 * ============================================================================
 */

// ============================================
// GLOBAL STATE
// ============================================
const AppState = {
  // Data chats
  chats: new Map(),           // Map<chat_id, chatData>
  messages: new Map(),        // Map<chat_id, Array<messages>>
  currentChatId: null,
  
  // Update mechanism
  lastUpdateId: 0,
  updateInterval: null,
  refreshInterval: CONFIG?.SETTINGS?.REFRESH_INTERVAL || 5000,
  
  // Spam control
  spamActive: false,
  spamAbortController: null,
  
  // Bot info
  botInfo: null,
  
  // Media upload state
  pendingMediaType: null,
  pendingMediaFile: null,
  
  // Unread counts
  unreadCounts: new Map()
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format timestamp ke format yang readable
 */
function formatTime(timestamp) {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  
  if (isToday) {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
  
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Kemarin';
  }
  
  return date.toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'short' 
  });
}

/**
 * Format full date untuk date divider
 */
function formatFullDate(timestamp) {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  
  if (isToday) return 'Hari Ini';
  
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Kemarin';
  }
  
  return date.toLocaleDateString('id-ID', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}

/**
 * Escape HTML untuk mencegah XSS
 */
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Show toast notification
 */
function showToast(message, type = 'success', duration = 3000) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const iconMap = {
    success: 'fa-check-circle',
    error: 'fa-times-circle',
    warning: 'fa-exclamation-triangle'
  };
  
  toast.innerHTML = `
    <i class="fas ${iconMap[type]}"></i>
    <span class="toast-message">${escapeHtml(message)}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/**
 * Play notification sound
 */
function playNotificationSound() {
  if (!CONFIG?.SETTINGS?.SOUND_NOTIFICATION) return;
  
  const audio = document.getElementById('notification-sound');
  if (audio) {
    audio.currentTime = 0;
    audio.play().catch(() => {
      // Ignore autoplay errors
    });
  }
}

// ============================================
// TELEGRAM API FUNCTIONS
// ============================================

/**
 * Fetch dengan error handling
 */
async function telegramFetch(endpoint, options = {}) {
  const url = `${CONFIG.BASE_URL}/${endpoint}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.ok) {
      throw new Error(data.description || 'Unknown Telegram API error');
    }
    
    return data;
  } catch (error) {
    console.error('Telegram API Error:', error);
    throw error;
  }
}

/**
 * Get bot info
 */
async function getBotInfo() {
  try {
    const data = await telegramFetch('getMe');
    AppState.botInfo = data.result;
    return data.result;
  } catch (error) {
    showToast('Gagal memuat info bot: ' + error.message, 'error');
    return null;
  }
}

/**
 * Get updates dari Telegram
 */
async function getUpdates() {
  try {
    const params = new URLSearchParams();
    if (AppState.lastUpdateId > 0) {
      params.append('offset', AppState.lastUpdateId + 1);
    }
    params.append('limit', '100');
    
    const data = await telegramFetch(`getUpdates?${params.toString()}`);
    
    if (data.result && data.result.length > 0) {
      // Update lastUpdateId
      const maxUpdateId = Math.max(...data.result.map(u => u.update_id));
      AppState.lastUpdateId = maxUpdateId;
      
      // Process updates
      processUpdates(data.result);
      
      // Play sound jika ada pesan baru
      const hasNewMessages = data.result.some(u => u.message);
      if (hasNewMessages && AppState.currentChatId) {
        playNotificationSound();
      }
    }
    
    return data.result;
  } catch (error) {
    console.error('Get updates error:', error);
    return [];
  }
}

/**
 * Process updates dan kelompokkan berdasarkan chat_id
 */
function processUpdates(updates) {
  let hasNewData = false;
  
  updates.forEach(update => {
    if (update.message) {
      const message = update.message;
      const chatId = message.chat.id;
      
      // Simpan/update chat info
      if (!AppState.chats.has(chatId)) {
        AppState.chats.set(chatId, {
          id: chatId,
          type: message.chat.type,
          title: message.chat.title || message.chat.username || `User ${chatId}`,
          username: message.chat.username,
          first_name: message.chat.first_name,
          last_name: message.chat.last_name,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(message.chat.first_name || 'U')}&background=random`
        });
      }
      
      // Simpan message
      if (!AppState.messages.has(chatId)) {
        AppState.messages.set(chatId, []);
      }
      
      const chatMessages = AppState.messages.get(chatId);
      const existingIndex = chatMessages.findIndex(m => m.message_id === message.message_id);
      
      if (existingIndex === -1) {
        chatMessages.push(message);
        hasNewData = true;
        
        // Increment unread jika bukan chat yang sedang aktif
        if (AppState.currentChatId !== chatId) {
          const currentUnread = AppState.unreadCounts.get(chatId) || 0;
          AppState.unreadCounts.set(chatId, currentUnread + 1);
        }
      }
    }
  });
  
  if (hasNewData) {
    renderSidebar();
    if (AppState.currentChatId) {
      renderMessages(AppState.currentChatId);
    }
  }
}

/**
 * Send message ke chat
 */
async function sendTelegramMessage(chatId, text, replyToMessageId = null) {
  try {
    const body = {
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML'
    };
    
    if (replyToMessageId) {
      body.reply_to_message_id = replyToMessageId;
    }
    
    const data = await telegramFetch('sendMessage', {
      body: JSON.stringify(body)
    });
    
    // Add sent message ke local state
    if (!AppState.messages.has(chatId)) {
      AppState.messages.set(chatId, []);
    }
    AppState.messages.get(chatId).push(data.result);
    
    renderMessages(chatId);
    renderSidebar();
    
    showToast('Pesan terkirim!', 'success');
    return data.result;
  } catch (error) {
    showToast('Gagal mengirim pesan: ' + error.message, 'error');
    throw error;
  }
}

/**
 * Send photo
 */
async function sendTelegramPhoto(chatId, photoFile, caption = '') {
  try {
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('photo', photoFile);
    if (caption) formData.append('caption', caption);
    
    const response = await fetch(`${CONFIG.BASE_URL}/sendPhoto`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (!data.ok) {
      throw new Error(data.description);
    }
    
    if (!AppState.messages.has(chatId)) {
      AppState.messages.set(chatId, []);
    }
    AppState.messages.get(chatId).push(data.result);
    
    renderMessages(chatId);
    showToast('Foto terkirim!', 'success');
    return data.result;
  } catch (error) {
    showToast('Gagal mengirim foto: ' + error.message, 'error');
    throw error;
  }
}

/**
 * Send video
 */
async function sendTelegramVideo(chatId, videoFile, caption = '') {
  try {
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('video', videoFile);
    if (caption) formData.append('caption', caption);
    
    const response = await fetch(`${CONFIG.BASE_URL}/sendVideo`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (!data.ok) {
      throw new Error(data.description);
    }
    
    if (!AppState.messages.has(chatId)) {
      AppState.messages.set(chatId, []);
    }
    AppState.messages.get(chatId).push(data.result);
    
    renderMessages(chatId);
    showToast('Video terkirim!', 'success');
    return data.result;
  } catch (error) {
    showToast('Gagal mengirim video: ' + error.message, 'error');
    throw error;
  }
}

/**
 * Send audio
 */
async function sendTelegramAudio(chatId, audioFile, caption = '') {
  try {
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('audio', audioFile);
    if (caption) formData.append('caption', caption);
    
    const response = await fetch(`${CONFIG.BASE_URL}/sendAudio`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (!data.ok) {
      throw new Error(data.description);
    }
    
    if (!AppState.messages.has(chatId)) {
      AppState.messages.set(chatId, []);
    }
    AppState.messages.get(chatId).push(data.result);
    
    renderMessages(chatId);
    showToast('Audio terkirim!', 'success');
    return data.result;
  } catch (error) {
    showToast('Gagal mengirim audio: ' + error.message, 'error');
    throw error;
  }
}

/**
 * Send document
 */
async function sendTelegramDocument(chatId, documentFile, caption = '') {
  try {
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('document', documentFile);
    if (caption) formData.append('caption', caption);
    
    const response = await fetch(`${CONFIG.BASE_URL}/sendDocument`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (!data.ok) {
      throw new Error(data.description);
    }
    
    if (!AppState.messages.has(chatId)) {
      AppState.messages.set(chatId, []);
    }
    AppState.messages.get(chatId).push(data.result);
    
    renderMessages(chatId);
    showToast('Dokumen terkirim!', 'success');
    return data.result;
  } catch (error) {
    showToast('Gagal mengirim dokumen: ' + error.message, 'error');
    throw error;
  }
}

/**
 * Send location
 */
async function sendTelegramLocation(chatId, latitude, longitude) {
  try {
    const data = await telegramFetch('sendLocation', {
      body: JSON.stringify({
        chat_id: chatId,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      })
    });
    
    if (!AppState.messages.has(chatId)) {
      AppState.messages.set(chatId, []);
    }
    AppState.messages.get(chatId).push(data.result);
    
    renderMessages(chatId);
    showToast('Lokasi terkirim!', 'success');
    return data.result;
  } catch (error) {
    showToast('Gagal mengirim lokasi: ' + error.message, 'error');
    throw error;
  }
}

// ============================================
// UI RENDER FUNCTIONS
// ============================================

/**
 * Render sidebar dengan list chat
 */
function renderSidebar() {
  const chatList = document.getElementById('chat-list');
  
  if (AppState.chats.size === 0) {
    chatList.innerHTML = `
      <div class="loading-chats">
        <i class="fas fa-comments"></i>
        <span>Belum ada chat</span>
        <p style="font-size: 12px; margin-top: 8px;">Chat akan muncul saat ada pesan masuk</p>
      </div>
    `;
    return;
  }
  
  // Sort chats by last message time
  const sortedChats = Array.from(AppState.chats.values()).sort((a, b) => {
    const messagesA = AppState.messages.get(a.id) || [];
    const messagesB = AppState.messages.get(b.id) || [];
    const lastA = messagesA[messagesA.length - 1]?.date || 0;
    const lastB = messagesB[messagesB.length - 1]?.date || 0;
    return lastB - lastA;
  });
  
  chatList.innerHTML = sortedChats.map(chat => {
    const messages = AppState.messages.get(chat.id) || [];
    const lastMessage = messages[messages.length - 1];
    const unreadCount = AppState.unreadCounts.get(chat.id) || 0;
    
    let lastMessageText = 'Tidak ada pesan';
    if (lastMessage) {
      if (lastMessage.text) {
        lastMessageText = lastMessage.text.substring(0, 50);
      } else if (lastMessage.photo) {
        lastMessageText = '📷 Foto';
      } else if (lastMessage.video) {
        lastMessageText = '🎥 Video';
      } else if (lastMessage.audio || lastMessage.voice) {
        lastMessageText = '🎵 Audio';
      } else if (lastMessage.document) {
        lastMessageText = '📄 Dokumen';
      } else if (lastMessage.location) {
        lastMessageText = '📍 Lokasi';
      }
    }
    
    const isActive = AppState.currentChatId === chat.id;
    const isUnread = unreadCount > 0;
    
    return `
      <div class="chat-item ${isActive ? 'active' : ''} ${isUnread ? 'unread' : ''}" 
           data-chat-id="${chat.id}" 
           onclick="openChat(${chat.id})">
        <div class="chat-avatar">
          <img src="${chat.avatar}" alt="${escapeHtml(chat.title)}">
        </div>
        <div class="chat-details">
          <div class="chat-header-row">
            <span class="chat-name">${escapeHtml(chat.title)}</span>
            <span class="chat-time">${lastMessage ? formatTime(lastMessage.date) : ''}</span>
          </div>
          <div class="chat-footer-row">
            <span class="chat-last-message">${escapeHtml(lastMessageText)}</span>
            ${unreadCount > 0 ? `<span class="unread-badge">${unreadCount}</span>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Open chat dan render messages
 */
function openChat(chatId) {
  AppState.currentChatId = chatId;
  
  // Reset unread count
  AppState.unreadCounts.set(chatId, 0);
  
  // Update UI
  document.getElementById('empty-state').style.display = 'none';
  document.getElementById('active-chat').style.display = 'flex';
  
  // Update chat header
  const chat = AppState.chats.get(chatId);
  if (chat) {
    document.getElementById('current-chat-name').textContent = chat.title;
    document.getElementById('current-chat-avatar').src = chat.avatar;
    document.getElementById('current-chat-status').textContent = 
      chat.type === 'private' ? 'online' : chat.type;
  }
  
  // Render messages
  renderMessages(chatId);
  
  // Update sidebar (remove unread badge)
  renderSidebar();
  
  // Scroll to bottom
  scrollToBottom();
}

/**
 * Render messages untuk chat tertentu
 */
function renderMessages(chatId) {
  const container = document.getElementById('messages-container');
  const messages = AppState.messages.get(chatId) || [];
  
  if (messages.length === 0) {
    container.innerHTML = `
      <div class="date-divider">Belum ada pesan</div>
    `;
    return;
  }
  
  // Sort messages by date
  const sortedMessages = [...messages].sort((a, b) => a.date - b.date);
  
  let lastDate = null;
  
  container.innerHTML = sortedMessages.map(message => {
    const isOutgoing = message.from?.is_bot || 
                       message.from?.id === AppState.botInfo?.id;
    
    const messageDate = new Date(message.date * 1000).toDateString();
    let dateDivider = '';
    
    if (messageDate !== lastDate) {
      dateDivider = `<div class="date-divider">${formatFullDate(message.date)}</div>`;
      lastDate = messageDate;
    }
    
    let messageContent = '';
    
    // Render berdasarkan tipe message
    if (message.text) {
      messageContent = `<div class="message-text">${escapeHtml(message.text)}</div>`;
    } else if (message.photo) {
      const photo = message.photo[message.photo.length - 1]; // Get largest
      messageContent = `
        <div class="message-media">
          <img src="https://api.telegram.org/file/bot${CONFIG.TELEGRAM_BOT_TOKEN}/${photo.file_id}" 
               alt="Photo" loading="lazy"
               onerror="this.src='https://via.placeholder.com/300x200?text=Photo'">
        </div>
        ${message.caption ? `<div class="message-text">${escapeHtml(message.caption)}</div>` : ''}
      `;
    } else if (message.video) {
      messageContent = `
        <div class="message-media">
          <video controls width="300">
            <source src="https://api.telegram.org/file/bot${CONFIG.TELEGRAM_BOT_TOKEN}/${message.video.file_id}" type="video/mp4">
          </video>
        </div>
        ${message.caption ? `<div class="message-text">${escapeHtml(message.caption)}</div>` : ''}
      `;
    } else if (message.audio || message.voice) {
      const audio = message.audio || message.voice;
      messageContent = `
        <div class="message-media">
          <audio controls>
            <source src="https://api.telegram.org/file/bot${CONFIG.TELEGRAM_BOT_TOKEN}/${audio.file_id}" type="audio/mpeg">
          </audio>
        </div>
        ${message.caption ? `<div class="message-text">${escapeHtml(message.caption)}</div>` : ''}
      `;
    } else if (message.document) {
      messageContent = `
        <div class="message-media" style="padding: 12px; background: var(--wa-hover); border-radius: 8px;">
          <i class="fas fa-file" style="font-size: 32px; color: var(--wa-teal);"></i>
          <p style="margin-top: 8px; font-size: 13px;">${escapeHtml(message.document.file_name || 'Dokumen')}</p>
          <p style="font-size: 11px; color: var(--wa-text-secondary);">
            ${(message.document.file_size / 1024).toFixed(1)} KB
          </p>
        </div>
        ${message.caption ? `<div class="message-text">${escapeHtml(message.caption)}</div>` : ''}
      `;
    } else if (message.location) {
      messageContent = `
        <div class="message-location">
          <i class="fas fa-map-marker-alt"></i>
          <p>📍 Lokasi</p>
          <p style="font-size: 11px; margin-top: 4px;">
            ${message.location.latitude}, ${message.location.longitude}
          </p>
        </div>
      `;
    } else {
      messageContent = `<div class="message-text"><i>Pesan tidak didukung</i></div>`;
    }
    
    const senderName = message.from?.first_name || 'Unknown';
    
    return `
      ${dateDivider}
      <div class="message ${isOutgoing ? 'outgoing' : 'incoming'}" data-message-id="${message.message_id}">
        ${!isOutgoing ? `<div class="message-sender">${escapeHtml(senderName)}</div>` : ''}
        ${messageContent}
        <div class="message-footer">
          <span class="message-time">${formatTime(message.date)}</span>
          ${isOutgoing ? '<span class="message-status"><i class="fas fa-check-double"></i></span>' : ''}
        </div>
      </div>
    `;
  }).join('');
  
  scrollToBottom();
}

/**
 * Scroll messages ke bottom
 */
function scrollToBottom() {
  const container = document.getElementById('messages-container');
  container.scrollTop = container.scrollHeight;
}

// ============================================
// SPAM FUNCTIONS
// ============================================

/**
 * Toggle spam panel
 */
function toggleSpamPanel() {
  const panel = document.getElementById('spam-panel');
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

/**
 * Start spamming messages
 */
async function startSpam() {
  if (AppState.spamActive) return;
  
  const chatId = AppState.currentChatId;
  if (!chatId) {
    showToast('Pilih chat terlebih dahulu!', 'warning');
    return;
  }
  
  const count = parseInt(document.getElementById('spam-count').value) || 10;
  const delay = parseInt(document.getElementById('spam-delay').value) || 1000;
  const message = document.getElementById('spam-message').value || 'Spam message';
  
  if (count > 100) {
    showToast('Maksimal 100 pesan!', 'warning');
    return;
  }
  
  AppState.spamActive = true;
  AppState.spamAbortController = new AbortController();
  
  document.getElementById('btn-spam-start').style.display = 'none';
  document.getElementById('btn-spam-stop').style.display = 'flex';
  
  showToast(`Memulai spam ${count} pesan...`, 'success');
  
  for (let i = 0; i < count; i++) {
    if (!AppState.spamActive || AppState.spamAbortController.signal.aborted) {
      break;
    }
    
    try {
      await sendTelegramMessage(chatId, `${message} (${i + 1}/${count})`);
      await sleep(delay);
    } catch (error) {
      showToast(`Error pada pesan ${i + 1}: ${error.message}`, 'error');
      break;
    }
  }
  
  stopSpam();
  showToast('Spam selesai!', 'success');
}

/**
 * Stop spamming
 */
function stopSpam() {
  AppState.spamActive = false;
  if (AppState.spamAbortController) {
    AppState.spamAbortController.abort();
  }
  
  document.getElementById('btn-spam-start').style.display = 'flex';
  document.getElementById('btn-spam-stop').style.display = 'none';
}

/**
 * Sleep helper
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================
// MIKROTIK FUNCTIONS
// ============================================

/**
 * Get MikroTik data (simulasi - butuh backend/proxy untuk CORS)
 */
async function getMikrotikData() {
  const infoContainer = document.getElementById('mikrotik-info');
  
  infoContainer.innerHTML = `
    <div class="loading-data">
      <i class="fas fa-spinner fa-spin"></i>
      <span>Menghubungkan ke MikroTik...</span>
    </div>
  `;
  
  // ⚠️ MIKROTIK API butuh backend proxy karena CORS
  // Ini adalah simulasi untuk demo
  
  setTimeout(() => {
    infoContainer.innerHTML = `
      <div class="mikrotik-stats">
        <div class="stat-card">
          <h4>Router Identity</h4>
          <p>${CONFIG.MIKROTIK.host}</p>
        </div>
        <div class="stat-card">
          <h4>Uptime</h4>
          <p>5d 12h 30m</p>
        </div>
        <div class="stat-card">
          <h4>CPU Load</h4>
          <p>15%</p>
        </div>
        <div class="stat-card">
          <h4>Memory Usage</h4>
          <p>45%</p>
        </div>
        <div class="stat-card">
          <h4>Active Users</h4>
          <p>12</p>
        </div>
        <div class="stat-card">
          <h4>Bandwidth</h4>
          <p>↓ 45 Mbps ↑ 12 Mbps</p>
        </div>
      </div>
      <div style="margin-top: 20px; padding: 16px; background: #FFF3CD; border-radius: 8px;">
        <p style="font-size: 13px; color: #856404;">
          <i class="fas fa-info-circle"></i>
          <strong>Catatan:</strong> MikroTik API membutuhkan backend proxy karena CORS policy.
          Untuk implementasi full, gunakan backend Node.js/PHP sebagai proxy.
        </p>
      </div>
    `;
  }, 1500);
}

// ============================================
// EVENT HANDLERS
// ============================================

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Refresh button
  document.getElementById('btn-refresh').addEventListener('click', () => {
    showToast('Memperbarui chat...', 'success');
    getUpdates();
  });
  
  // New chat button
  document.getElementById('btn-new-chat').addEventListener('click', () => {
    document.getElementById('new-chat-modal').style.display = 'flex';
  });
  
  // Close new chat modal
  document.getElementById('close-new-chat').addEventListener('click', closeNewChatModal);
  document.getElementById('btn-cancel-new-chat').addEventListener('click', closeNewChatModal);
  
  // Start new chat
  document.getElementById('btn-start-new-chat').addEventListener('click', async () => {
    const chatId = document.getElementById('new-chat-id').value.trim();
    const message = document.getElementById('new-chat-message').value.trim();
    
    if (!chatId) {
      showToast('Masukkan Chat ID!', 'warning');
      return;
    }
    
    // Add chat to list
    AppState.chats.set(chatId, {
      id: chatId,
      type: 'private',
      title: `Chat ${chatId}`,
      avatar: `https://ui-avatars.com/api/?name=C&background=random`
    });
    
    AppState.messages.set(chatId, []);
    
    if (message) {
      try {
        await sendTelegramMessage(chatId, message);
      } catch (error) {
        console.error('Failed to send initial message:', error);
      }
    }
    
    renderSidebar();
    openChat(chatId);
    closeNewChatModal();
    showToast('Chat baru dibuat!', 'success');
  });
  
  // Send message
  document.getElementById('btn-send').addEventListener('click', handleSendMessage);
  document.getElementById('message-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSendMessage();
  });
  
  // Spam toggle
  document.getElementById('btn-spam-toggle').addEventListener('click', toggleSpamPanel);
  
  // Spam start/stop
  document.getElementById('btn-spam-start').addEventListener('click', startSpam);
  document.getElementById('btn-spam-stop').addEventListener('click', stopSpam);
  
  // Attachment menu
  document.getElementById('btn-attach-input').addEventListener('click', () => {
    const menu = document.getElementById('attachment-menu');
    menu.style.display = menu.style.display === 'none' ? 'flex' : 'none';
  });
  
  // Attachment items
  document.querySelectorAll('.attachment-item').forEach(item => {
    item.addEventListener('click', () => {
      const type = item.dataset.type;
      handleAttachment(type);
    });
  });
  
  // Close media modal
  document.getElementById('close-media-modal').addEventListener('click', closeMediaModal);
  document.getElementById('btn-cancel-media').addEventListener('click', closeMediaModal);
  
  // Send media
  document.getElementById('btn-send-media').addEventListener('click', handleSendMedia);
  
  // Close location modal
  document.getElementById('close-location-modal').addEventListener('click', closeLocationModal);
  document.getElementById('btn-cancel-location').addEventListener('click', closeLocationModal);
  
  // Get current location
  document.getElementById('btn-get-current-location').addEventListener('click', () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          document.getElementById('location-lat').value = position.coords.latitude;
          document.getElementById('location-lng').value = position.coords.longitude;
        },
        () => {
          showToast('Gagal mendapatkan lokasi', 'error');
        }
      );
    } else {
      showToast('Browser tidak mendukung geolocation', 'error');
    }
  });
  
  // Send location
  document.getElementById('btn-send-location').addEventListener('click', async () => {
    const lat = document.getElementById('location-lat').value;
    const lng = document.getElementById('location-lng').value;
    
    if (!lat || !lng) {
      showToast('Masukkan latitude dan longitude!', 'warning');
      return;
    }
    
    try {
      await sendTelegramLocation(AppState.currentChatId, lat, lng);
      closeLocationModal();
    } catch (error) {
      console.error('Send location error:', error);
    }
  });
  
  // MikroTik modal
  document.getElementById('btn-menu').addEventListener('click', () => {
    document.getElementById('mikrotik-modal').style.display = 'flex';
    getMikrotikData();
  });
  
  document.getElementById('close-mikrotik-modal').addEventListener('click', closeMikrotikModal);
  document.getElementById('btn-close-mikrotik').addEventListener('click', closeMikrotikModal);
  document.getElementById('btn-refresh-mikrotik').addEventListener('click', getMikrotikData);
  
  // Mobile back button
  document.getElementById('btn-back').addEventListener('click', () => {
    AppState.currentChatId = null;
    document.getElementById('empty-state').style.display = 'flex';
    document.getElementById('active-chat').style.display = 'none';
    renderSidebar();
  });
  
  // Close modals on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', () => {
      closeAllModals();
    });
  });
  
  // Search
  document.getElementById('search-input').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    filterChats(query);
  });
}

/**
 * Handle send message
 */
async function handleSendMessage() {
  const input = document.getElementById('message-input');
  const text = input.value.trim();
  
  if (!text) return;
  if (!AppState.currentChatId) {
    showToast('Pilih chat terlebih dahulu!', 'warning');
    return;
  }
  
  input.value = '';
  
  try {
    await sendTelegramMessage(AppState.currentChatId, text);
  } catch (error) {
    console.error('Send message error:', error);
  }
}

/**
 * Handle attachment selection
 */
function handleAttachment(type) {
  document.getElementById('attachment-menu').style.display = 'none';
  
  if (type === 'location') {
    document.getElementById('location-modal').style.display = 'flex';
    return;
  }
  
  AppState.pendingMediaType = type;
  
  const acceptMap = {
    photo: 'image/*',
    video: 'video/*',
    audio: 'audio/*',
    document: '*/*'
  };
  
  const titleMap = {
    photo: 'Kirim Foto',
    video: 'Kirim Video',
    audio: 'Kirim Audio',
    document: 'Kirim Dokumen'
  };
  
  document.getElementById('media-modal-title').textContent = titleMap[type];
  document.getElementById('media-file').accept = acceptMap[type];
  document.getElementById('media-modal').style.display = 'flex';
}

/**
 * Handle send media
 */
async function handleSendMedia() {
  const fileInput = document.getElementById('media-file');
  const caption = document.getElementById('media-caption').value;
  
  if (!fileInput.files[0]) {
    showToast('Pilih file terlebih dahulu!', 'warning');
    return;
  }
  
  if (!AppState.currentChatId) {
    showToast('Pilih chat terlebih dahulu!', 'warning');
    return;
  }
  
  const file = fileInput.files[0];
  const type = AppState.pendingMediaType;
  
  try {
    switch (type) {
      case 'photo':
        await sendTelegramPhoto(AppState.currentChatId, file, caption);
        break;
      case 'video':
        await sendTelegramVideo(AppState.currentChatId, file, caption);
        break;
      case 'audio':
        await sendTelegramAudio(AppState.currentChatId, file, caption);
        break;
      case 'document':
        await sendTelegramDocument(AppState.currentChatId, file, caption);
        break;
    }
    
    closeMediaModal();
  } catch (error) {
    console.error('Send media error:', error);
  }
}

/**
 * Filter chats berdasarkan search query
 */
function filterChats(query) {
  const chatItems = document.querySelectorAll('.chat-item');
  
  chatItems.forEach(item => {
    const chatName = item.querySelector('.chat-name').textContent.toLowerCase();
    const lastMessage = item.querySelector('.chat-last-message').textContent.toLowerCase();
    
    if (chatName.includes(query) || lastMessage.includes(query)) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

// ============================================
// MODAL FUNCTIONS
// ============================================

function closeNewChatModal() {
  document.getElementById('new-chat-modal').style.display = 'none';
  document.getElementById('new-chat-id').value = '';
  document.getElementById('new-chat-message').value = '';
}

function closeMediaModal() {
  document.getElementById('media-modal').style.display = 'none';
  document.getElementById('media-file').value = '';
  document.getElementById('media-caption').value = '';
  AppState.pendingMediaType = null;
}

function closeLocationModal() {
  document.getElementById('location-modal').style.display = 'none';
  document.getElementById('location-lat').value = '';
  document.getElementById('location-lng').value = '';
}

function closeMikrotikModal() {
  document.getElementById('mikrotik-modal').style.display = 'none';
}

function closeAllModals() {
  closeNewChatModal();
  closeMediaModal();
  closeLocationModal();
  closeMikrotikModal();
}

// ============================================
// AUTO UPDATE
// ============================================

/**
 * Start auto update interval
 */
function startAutoUpdate() {
  // Clear existing interval
  if (AppState.updateInterval) {
    clearInterval(AppState.updateInterval);
  }
  
  // Initial load
  getUpdates();
  
  // Set interval
  AppState.updateInterval = setInterval(() => {
    getUpdates();
  }, AppState.refreshInterval);
}

/**
 * Stop auto update
 */
function stopAutoUpdate() {
  if (AppState.updateInterval) {
    clearInterval(AppState.updateInterval);
    AppState.updateInterval = null;
  }
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize app
 */
async function initApp() {
  console.log('🚀 Telegram Web Client initializing...');
  
  // Check config
  if (!CONFIG || CONFIG.TELEGRAM_BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') {
    document.getElementById('chat-list').innerHTML = `
      <div class="loading-chats" style="padding: 40px; text-align: center;">
        <i class="fas fa-exclamation-triangle" style="color: #FF9800; font-size: 32px;"></i>
        <span style="margin-top: 12px; display: block;">Konfigurasi Diperlukan</span>
        <p style="font-size: 12px; margin-top: 8px; color: var(--wa-text-secondary);">
          Edit file <code>config.js</code> dan masukkan TELEGRAM_BOT_TOKEN Anda
        </p>
      </div>
    `;
    showToast('Silakan konfigurasi token di config.js', 'warning', 5000);
    return;
  }
  
  // Setup event listeners
  setupEventListeners();
  
  // Get bot info
  await getBotInfo();
  
  if (AppState.botInfo) {
    document.getElementById('bot-name').textContent = AppState.botInfo.first_name;
    document.getElementById('bot-avatar').src = 
      `https://ui-avatars.com/api/?name=${encodeURIComponent(AppState.botInfo.first_name)}&background=128C7E&color=fff`;
    
    showToast(`Bot ${AppState.botInfo.first_name} siap!`, 'success');
  }
  
  // Start auto update
  startAutoUpdate();
  
  console.log('✅ App initialized successfully');
}

// Start app when DOM ready
document.addEventListener('DOMContentLoaded', initApp);

// Expose functions ke global scope untuk onclick handlers
window.openChat = openChat;
