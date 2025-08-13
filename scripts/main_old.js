/* MineStyle - Enhanced JavaScript with Modern Features */

// Unicode small caps mapping
const smallCapsMap = {
    'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ꜰ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ',
    'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ', 'q': 'Q', 'r': 'ʀ',
    's': 'ꜱ', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ'
};

// Minecraft color mapping
const minecraftColors = {
    '§0': '#000000', '§1': '#0000AA', '§2': '#00AA00', '§3': '#00AAAA',
    '§4': '#AA0000', '§5': '#AA00AA', '§6': '#FFAA00', '§7': '#AAAAAA',
    '§8': '#555555', '§9': '#5555FF', '§a': '#55FF55', '§b': '#55FFFF',
    '§c': '#FF5555', '§d': '#FF55FF', '§e': '#FFFF55', '§f': '#FFFFFF'
};

// Enhanced theme system
let currentTheme = localStorage.getItem('minestyle-theme') || 'light';

// History system for text conversion
let textHistory = JSON.parse(localStorage.getItem('minestyle-history') || '[]');
const MAX_HISTORY_ITEMS = 20;

// Custom hex colors storage
let customHexColors = {};

// DOM element references
const inputText = document.getElementById('inputText');
const cssOutput = document.getElementById('cssOutput');
const unicodeOutput = document.getElementById('unicodeOutput');
const minecraftText = document.getElementById('minecraftText');
const minecraftPreview = document.getElementById('minecraftPreview');
const minecraftCode = document.getElementById('minecraftCode');
const hexInput = document.getElementById('hexInput');
const colorPicker = document.getElementById('colorPicker');
const hexPreview = document.getElementById('hexPreview');

// Hex tool specific elements
const hexMinecraftText = document.getElementById('hexMinecraftText');
const hexMinecraftPreview = document.getElementById('hexMinecraftPreview');
const hexMinecraftCode = document.getElementById('hexMinecraftCode');

// Gradient elements
const gradientText = document.getElementById('gradientText');
const gradientStartColor = document.getElementById('gradientStartColor');
const gradientEndColor = document.getElementById('gradientEndColor');
const gradientPreview = document.getElementById('gradientPreview');
const gradientCode = document.getElementById('gradientCode');

// Preset templates with enhanced options
const presetTemplates = {
    welcome: '§eWelcome to §bOur Server§e! §aEnjoy your stay!',
    error: '§c§l[ERROR]§r §cSomething went wrong! Please try again.',
    success: '§a§l[SUCCESS]§r §aAction completed successfully!',
    warning: '§6§l[WARNING]§r §6Please be careful with this action.',
    info: '§b§l[INFO]§r §bHere is some important information.',
    rainbow: '§cR§6a§ei§an§bb§9o§dw §cT§6e§ex§at',
    announcement: '§6§l[ANNOUNCEMENT]§r §6Important server news!',
    maintenance: '§c§l[MAINTENANCE]§r §eServer will restart in 5 minutes',
    event: '§d§l[EVENT]§r §dSpecial event starting now!',
    staff: '§2§l[STAFF]§r §2Staff message from administrators'
};

/**
 * Theme Management
 */
function initializeTheme() {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(currentTheme + '-theme');
    updateThemeIcon();
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('minestyle-theme', currentTheme);
    initializeTheme();
    
    // Add smooth transition effect
    document.body.style.transition = 'all 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
    
    showNotification(`Switched to ${currentTheme} theme`, 'success');
}

function updateThemeIcon() {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = currentTheme === 'light' ? '🌙' : '☀️';
    }
}

/**
 * Enhanced Navigation Functions
 */
function showSection(sectionName) {
    // Hide all sections with fade effect
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Remove active class from all nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));

    // Show selected section and mark nav link as active
    setTimeout(() => {
        document.getElementById(sectionName).classList.add('active');
        if (event && event.target) {
            event.target.classList.add('active');
        } else {
            // Fallback for programmatic calls
            const targetLink = document.querySelector(`[onclick="showSection('${sectionName}')"]`);
            if (targetLink) targetLink.classList.add('active');
        }
    }, 100);

    // Close mobile menu if open
    const navLinks = document.getElementById('navLinks');
    if (navLinks) navLinks.classList.remove('active');
    
    // Analytics - track section views
    trackSectionView(sectionName);
}

function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
}

function trackSectionView(sectionName) {
    // Simple analytics tracking
    const analytics = JSON.parse(localStorage.getItem('minestyle-analytics') || '{}');
    analytics[sectionName] = (analytics[sectionName] || 0) + 1;
    localStorage.setItem('minestyle-analytics', JSON.stringify(analytics));
}

/**
 * Text History Management
 */
function addToHistory(text, type, result) {
    const historyItem = {
        id: Date.now(),
        text: text,
        type: type,
        result: result,
        timestamp: new Date().toISOString()
    };
    
    textHistory.unshift(historyItem);
    textHistory = textHistory.slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem('minestyle-history', JSON.stringify(textHistory));
    updateHistoryUI();
}

function updateHistoryUI() {
    // This will be implemented when we add the history UI component
    console.log('History updated:', textHistory.length, 'items');
}

function clearHistory() {
    textHistory = [];
    localStorage.setItem('minestyle-history', JSON.stringify(textHistory));
    updateHistoryUI();
    showNotification('History cleared successfully', 'success');
}

/**
 * Enhanced Small Caps Functions
 */
function convertToUnicodeSmallCaps(text) {
    return text.split('').map(char => {
        const lower = char.toLowerCase();
        return smallCapsMap[lower] || char;
    }).join('');
}

function updateOutputs() {
    const text = inputText.value;
    
    if (text.trim() === '') {
        cssOutput.innerHTML = '<button class="copy-btn" onclick="copyText(\'cssOutput\')">Copy</button><span class="example-text">CSS styled small caps will appear here...</span>';
        unicodeOutput.innerHTML = '<button class="copy-btn" onclick="copyText(\'unicodeOutput\')">Copy</button><span class="example-text">Unicode small caps will appear here...</span>';
        return;
    }
    
    // CSS Small Caps (just display the original text, CSS handles the styling)
    cssOutput.innerHTML = `<button class="copy-btn" onclick="copyText('cssOutput')">Copy</button>${escapeHtml(text)}`;
    
    // Unicode Small Caps
    const unicodeText = convertToUnicodeSmallCaps(text);
    unicodeOutput.innerHTML = `<button class="copy-btn" onclick="copyText('unicodeOutput')">Copy</button>${escapeHtml(unicodeText)}`;
    
    // Add to history
    if (text.trim()) {
        addToHistory(text, 'small-caps', { css: text, unicode: unicodeText });
    }
}

/**
 * Enhanced Utility Functions
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${escapeHtml(message)}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: inherit; cursor: pointer; margin-left: 10px;">✕</button>
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        background: type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--error)' : 'var(--info)',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        zIndex: '10000',
        display: 'flex',
        alignItems: 'center',
        maxWidth: '400px',
        backdropFilter: 'blur(10px)',
        animation: 'slideInRight 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

/**
 * Enhanced Export Functions
 */
function exportAsText(content, filename) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'minestyle-export.txt';
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Text exported successfully!', 'success');
}

function exportAsJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'minestyle-export.json';
    a.click();
    URL.revokeObjectURL(url);
    showNotification('JSON exported successfully!', 'success');
}

/**
 * Enhanced Color Utility Functions
 */
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c/2;
    let r = 0, g = 0, b = 0;
    
    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }
    
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    
    return rgbToHex(r, g, b);
}

function interpolateColor(color1, color2, factor) {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return color1;
    
    const r = Math.round(rgb1.r + factor * (rgb2.r - rgb1.r));
    const g = Math.round(rgb1.g + factor * (rgb2.g - rgb1.g));
    const b = Math.round(rgb1.b + factor * (rgb2.b - rgb1.b));
    
    return rgbToHex(r, g, b);
}

/**
 * Gradient text generation
 */
function generateGradient() {
    const text = gradientText.value.trim();
    const startColor = gradientStartColor.value;
    const endColor = gradientEndColor.value;
    
    if (!text) {
        gradientPreview.innerHTML = 'Enter text to generate gradient...';
        gradientCode.innerHTML = '';
        return;
    }
    
    if (text.length > 50) {
        alert('Text too long! Maximum 50 characters for gradient effect.');
        return;
    }
    
    let gradientCode = '';
    let previewHtml = '';
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === ' ') {
            gradientCode += ' ';
            previewHtml += '&nbsp;';
            continue;
        }
        
        const factor = text.length === 1 ? 0 : i / (text.length - 1);
        const interpolatedColor = interpolateColor(startColor, endColor, factor);
        const hexCode = '§#' + interpolatedColor.substring(1).toUpperCase();
        
        // Store the custom color
        customHexColors[hexCode] = interpolatedColor;
        
        gradientCode += hexCode + char;
        previewHtml += `<span style="color: ${interpolatedColor};">${char}</span>`;
    }
    
    gradientPreview.innerHTML = previewHtml;
    
    // Get format preference and convert the output
    const formatSelect = document.getElementById('gradientCodeFormat');
    const selectedFormat = formatSelect ? formatSelect.value : '&';
    const formattedGradientCode = convertColorFormat(gradientCode, selectedFormat);
    
    document.getElementById('gradientCode').innerHTML = 
        `<button class="copy-btn" onclick="copyText('gradientCode')">Copy</button>${escapeHtml(formattedGradientCode)}`;
}

function copyGradientCode() {
    const text = gradientText.value.trim();
    const startColor = gradientStartColor.value;
    const endColor = gradientEndColor.value;
    
    if (!text) return;
    
    let gradientCode = '';
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === ' ') {
            gradientCode += ' ';
            continue;
        }
        
        const factor = text.length === 1 ? 0 : i / (text.length - 1);
        const interpolatedColor = interpolateColor(startColor, endColor, factor);
        const hexCode = '§#' + interpolatedColor.substring(1).toUpperCase();
        
        gradientCode += hexCode + char;
    }
    
    navigator.clipboard.writeText(gradientCode).then(() => {
        const button = document.querySelector('.gradient-code .copy-btn');
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy gradient code: ', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = gradientCode;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        const button = document.querySelector('.gradient-code .copy-btn');
        button.textContent = 'Copied!';
        button.classList.add('copied');
        setTimeout(() => {
            button.textContent = 'Copy Gradient Code';
            button.classList.remove('copied');
        }, 2000);
    });
}

/**
 * Preset functions
 */
function applyPreset(presetName) {
    const template = presetTemplates[presetName];
    if (!template) return;
    
    // Determine which textarea to use based on the active minecraft tool
    let textarea = minecraftText; // default
    let updateFunction = updateMinecraftPreview; // default
    
    // Check if hex tool is active
    const hexTool = document.getElementById('minecraft-hex');
    if (hexTool && hexTool.classList.contains('active') && hexMinecraftText) {
        textarea = hexMinecraftText;
        updateFunction = updateHexMinecraftPreview;
    }
    
    if (!textarea) return;
    
    if (presetName === 'rainbow') {
        // Generate dynamic rainbow text
        const baseText = 'Rainbow Text';
        const rainbowColors = ['§c', '§6', '§e', '§a', '§b', '§9', '§d'];
        let rainbowCode = '';
        
        for (let i = 0; i < baseText.length; i++) {
            const char = baseText[i];
            if (char === ' ') {
                rainbowCode += ' ';
            } else {
                const colorIndex = i % rainbowColors.length;
                rainbowCode += rainbowColors[colorIndex] + char;
            }
        }
        
        textarea.value = rainbowCode;
    } else {
        textarea.value = template;
    }
    
    updateFunction();
    textarea.focus();
}

/**
 * Minecraft color functions
 */
function insertCode(code) {
    // Determine which textarea to use based on the active minecraft tool
    let textarea = minecraftText; // default
    let updateFunction = updateMinecraftPreview; // default
    
    // Check if hex tool is active
    const hexTool = document.getElementById('minecraft-hex');
    if (hexTool && hexTool.classList.contains('active') && hexMinecraftText) {
        textarea = hexMinecraftText;
        updateFunction = updateHexMinecraftPreview;
    }
    
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    textarea.value = text.substring(0, start) + code + text.substring(end);
    textarea.focus();
    textarea.setSelectionRange(start + code.length, start + code.length);
    
    updateFunction();
}

function applyHexColor() {
    let hex = hexInput.value.trim();
    
    // Validate and format hex color
    if (hex.startsWith('#')) {
        hex = hex.substring(1);
    }
    
    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
        alert('Please enter a valid hex color (e.g., #FF5555 or FF5555)');
        return;
    }
    
    hex = hex.toUpperCase();
    const fullHex = '#' + hex;
    
    // Update color picker
    colorPicker.value = fullHex;
    
    // Generate a unique code for this hex color
    const hexCode = '§#' + hex;
    customHexColors[hexCode] = fullHex;
    
    // Insert the hex code
    insertCode(hexCode);
    
    // Update preview
    hexPreview.innerHTML = `<span style="color: ${fullHex};">Sample text with color ${fullHex}</span>`;
}

function parseMinecraftText(text) {
    let html = '';
    let currentColor = '#FFFFFF';
    let isBold = false;
    let isItalic = false;
    let isUnderlined = false;
    let isStrikethrough = false;
    let isObfuscated = false;

    let i = 0;
    while (i < text.length) {
        if (text[i] === '§' && i + 1 < text.length) {
            // Check for hex color code (§#RRGGBB format)
            if (text[i + 1] === '#' && i + 7 < text.length) {
                const hexCode = text.substring(i, i + 8); // §#RRGGBB
                if (customHexColors[hexCode]) {
                    currentColor = customHexColors[hexCode];
                    // Reset formatting when color changes
                    isBold = false;
                    isItalic = false;
                    isUnderlined = false;
                    isStrikethrough = false;
                    isObfuscated = false;
                    i += 8;
                    continue;
                }
            }
            
            const code = '§' + text[i + 1];
            
            if (minecraftColors[code]) {
                currentColor = minecraftColors[code];
                // Reset formatting when color changes
                isBold = false;
                isItalic = false;
                isUnderlined = false;
                isStrikethrough = false;
                isObfuscated = false;
            } else {
                switch (text[i + 1]) {
                    case 'l': isBold = true; break;
                    case 'o': isItalic = true; break;
                    case 'n': isUnderlined = true; break;
                    case 'm': isStrikethrough = true; break;
                    case 'k': isObfuscated = true; break;
                    case 'r':
                        currentColor = '#FFFFFF';
                        isBold = false;
                        isItalic = false;
                        isUnderlined = false;
                        isStrikethrough = false;
                        isObfuscated = false;
                        break;
                }
            }
            i += 2;
        } else {
            let styles = `color: ${currentColor};`;
            if (isBold) styles += ' font-weight: bold;';
            if (isItalic) styles += ' font-style: italic;';
            if (isUnderlined) styles += ' text-decoration: underline;';
            if (isStrikethrough) styles += ' text-decoration: line-through;';
            if (isUnderlined && isStrikethrough) styles += ' text-decoration: underline line-through;';
            
            let char = text[i];
            if (isObfuscated) {
                // Simple obfuscation effect
                const obfuscatedChars = 'abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
                char = obfuscatedChars[Math.floor(Math.random() * obfuscatedChars.length)];
            }
            
            html += `<span style="${styles}">${char === ' ' ? '&nbsp;' : char}</span>`;
            i++;
        }
    }
    
    return html;
}

function updateMinecraftPreview() {
    const text = minecraftText.value;
    
    if (text.trim() === '') {
        minecraftPreview.innerHTML = 'Start typing to see your colorful Minecraft text here...';
        minecraftCode.innerHTML = '<button class="copy-btn" onclick="copyText(\'minecraftCode\')">Copy</button><span class="example-text">Minecraft color codes will appear here...</span>';
        return;
    }
    
    // Update preview
    const parsedHtml = parseMinecraftText(text);
    minecraftPreview.innerHTML = parsedHtml;
    
    // Get format preference and convert the output
    const formatSelect = document.getElementById('minecraftCodeFormat');
    const selectedFormat = formatSelect ? formatSelect.value : '&';
    const formattedText = convertColorFormat(text, selectedFormat);
    
    // Update code output - escape HTML to show actual characters
    minecraftCode.innerHTML = `<button class="copy-btn" onclick="copyText('minecraftCode')">Copy</button>${escapeHtml(formattedText)}`;
}

function updateHexPreview() {
    let hex = hexInput.value.trim();
    
    if (hex.startsWith('#')) {
        hex = hex.substring(1);
    }
    
    if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
        const fullHex = '#' + hex;
        hexPreview.innerHTML = `<span style="color: ${fullHex};">Sample text with color ${fullHex}</span>`;
        colorPicker.value = fullHex;
    } else if (hex === '') {
        hexPreview.innerHTML = 'Custom colored text will appear here...';
    } else {
        hexPreview.innerHTML = '<span style="color: #ff0000;">Invalid hex color format</span>';
    }
}

function updateHexMinecraftPreview() {
    const text = hexMinecraftText ? hexMinecraftText.value : '';
    
    if (text.trim() === '') {
        if (hexMinecraftPreview) hexMinecraftPreview.innerHTML = 'Start typing to see your colorful Minecraft text here...';
        if (hexMinecraftCode) hexMinecraftCode.innerHTML = '<button class="copy-btn" onclick="copyText(\'hexMinecraftCode\')">Copy</button><span class="example-text">Minecraft hex color codes will appear here...</span>';
        return;
    }
    
    // Update preview
    const parsedHtml = parseMinecraftText(text);
    if (hexMinecraftPreview) hexMinecraftPreview.innerHTML = parsedHtml;
    
    // Get format preference and convert the output
    const formatSelect = document.getElementById('hexCodeFormat');
    const selectedFormat = formatSelect ? formatSelect.value : '&';
    const formattedText = convertColorFormat(text, selectedFormat);
    
    // Update code output - escape HTML to show actual characters
    if (hexMinecraftCode) hexMinecraftCode.innerHTML = `<button class="copy-btn" onclick="copyText('hexMinecraftCode')">Copy</button>${escapeHtml(formattedText)}`;
}

/**
 * Utility functions
 */
function copyText(outputId) {
    const element = document.getElementById(outputId);
    const button = element.querySelector('.copy-btn');
    
    // Get text content excluding the button
    let textContent;
    if (outputId === 'minecraftCode' || outputId === 'hexMinecraftCode' || outputId === 'gradientCode') {
        // For code outputs, get the actual text from the corresponding input
        if (outputId === 'minecraftCode') {
            const formatSelect = document.getElementById('minecraftCodeFormat');
            const selectedFormat = formatSelect ? formatSelect.value : '&';
            textContent = convertColorFormat(minecraftText.value, selectedFormat);
        } else if (outputId === 'hexMinecraftCode') {
            const formatSelect = document.getElementById('hexCodeFormat');
            const selectedFormat = formatSelect ? formatSelect.value : '&';
            textContent = convertColorFormat(hexMinecraftText.value, selectedFormat);
        } else if (outputId === 'gradientCode') {
            const text = gradientText.value.trim();
            const startColor = gradientStartColor.value;
            const endColor = gradientEndColor.value;
            
            if (!text) return;
            
            let gradientCode = '';
            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                if (char === ' ') {
                    gradientCode += ' ';
                    continue;
                }
                
                const factor = text.length === 1 ? 0 : i / (text.length - 1);
                const interpolatedColor = interpolateColor(startColor, endColor, factor);
                const hexCode = '§#' + interpolatedColor.substring(1).toUpperCase();
                
                gradientCode += hexCode + char;
            }
            
            const formatSelect = document.getElementById('gradientCodeFormat');
            const selectedFormat = formatSelect ? formatSelect.value : '&';
            textContent = convertColorFormat(gradientCode, selectedFormat);
        }
    } else {
        textContent = element.childNodes[1].textContent || element.textContent.replace('Copy', '').trim();
    }
    
    navigator.clipboard.writeText(textContent).then(() => {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = textContent;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        button.textContent = 'Copied!';
        button.classList.add('copied');
        setTimeout(() => {
            button.textContent = 'Copy';
            button.classList.remove('copied');
        }, 2000);
    });
}

// Function to make output text areas clickable to copy
function makeOutputClickable(outputId) {
    const element = document.getElementById(outputId);
    if (element) {
        element.addEventListener('click', function(e) {
            // Don't trigger if clicking the copy button
            if (e.target.classList.contains('copy-btn')) {
                return;
            }
            
            // Only copy if there's actual content (not placeholder)
            const hasContent = !element.querySelector('.example-text');
            if (hasContent) {
                copyText(outputId);
            }
        });
    }
}

function clearAll() {
    inputText.value = '';
    updateOutputs();
    inputText.focus();
}

function clearMinecraft() {
    minecraftText.value = '';
    updateMinecraftPreview();
    minecraftText.focus();
}

/**
 * Initialize application
 */
document.addEventListener('DOMContentLoaded', function() {
    // Add obfuscation animation
    setInterval(() => {
        if (minecraftText && minecraftText.value.includes('§k')) {
            updateMinecraftPreview();
        }
    }, 50);

    // Event listeners
    if (inputText) inputText.addEventListener('input', updateOutputs);
    if (minecraftText) minecraftText.addEventListener('input', updateMinecraftPreview);
    if (hexInput) hexInput.addEventListener('input', updateHexPreview);
    
    // Hex tool event listeners
    if (hexMinecraftText) hexMinecraftText.addEventListener('input', updateHexMinecraftPreview);
    
    // Gradient event listeners
    if (gradientText) gradientText.addEventListener('input', generateGradient);
    if (gradientStartColor) gradientStartColor.addEventListener('change', generateGradient);
    if (gradientEndColor) gradientEndColor.addEventListener('change', generateGradient);
    
    // Make output text areas clickable to copy
    makeOutputClickable('cssOutput');
    makeOutputClickable('unicodeOutput');
    makeOutputClickable('minecraftCode');
    makeOutputClickable('hexMinecraftCode');
    makeOutputClickable('gradientCode');
    
    // Sync color picker with hex input
    if (colorPicker) {
        colorPicker.addEventListener('input', function() {
            hexInput.value = this.value;
            updateHexPreview();
        });
    }

    // Handle Enter key in hex input
    if (hexInput) {
        hexInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyHexColor();
            }
        });
    }

    // Handle Enter key in gradient text input
    if (gradientText) {
        gradientText.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                generateGradient();
            }
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const navbar = document.querySelector('.navbar');
        const navLinks = document.getElementById('navLinks');
        
        if (navbar && navLinks && !navbar.contains(e.target) && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
        
        // Close minecraft dropdown when clicking outside
        const minecraftDropdown = document.querySelector('.minecraft-nav-dropdown');
        const minecraftMenu = document.getElementById('minecraftNavMenu');
        
        if (minecraftDropdown && minecraftMenu && !minecraftDropdown.contains(e.target) && minecraftMenu.classList.contains('open')) {
            minecraftMenu.classList.remove('open');
            document.querySelector('.minecraft-nav-button').classList.remove('active');
        }
    });
});

/**
 * Minecraft Navigation Functions
 */

// Toggle minecraft dropdown menu
function toggleMinecraftDropdown() {
    const menu = document.getElementById('minecraftNavMenu');
    const button = document.querySelector('.minecraft-nav-button');
    
    if (menu && button) {
        menu.classList.toggle('open');
        button.classList.toggle('active');
    }
}

// Show specific minecraft tool
function showMinecraftTool(toolName) {
    // Hide all minecraft tools
    document.querySelectorAll('.minecraft-tool').forEach(tool => {
        tool.classList.remove('active');
    });
    
    // Remove active class from all nav items
    document.querySelectorAll('.minecraft-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected tool
    const selectedTool = document.getElementById(`minecraft-${toolName}`);
    if (selectedTool) {
        selectedTool.classList.add('active');
    }
    
    // Mark nav item as active
    const selectedNavItem = document.querySelector(`[onclick="showMinecraftTool('${toolName}')"]`);
    if (selectedNavItem) {
        selectedNavItem.classList.add('active');
    }
    
    // Update dropdown button text
    const currentToolSpan = document.getElementById('currentMinecraftTool');
    if (currentToolSpan && selectedNavItem) {
        currentToolSpan.textContent = selectedNavItem.textContent;
    }
    
    // Close dropdown
    const menu = document.getElementById('minecraftNavMenu');
    const button = document.querySelector('.minecraft-nav-button');
    if (menu && button) {
        menu.classList.remove('open');
        button.classList.remove('active');
    }
}

// Clear functions for each tool
function clearHexMinecraft() {
    const hexText = document.getElementById('hexMinecraftText');
    const hexPreview = document.getElementById('hexMinecraftPreview');
    const hexCode = document.getElementById('hexMinecraftCode');
    
    if (hexText) hexText.value = '';
    if (hexPreview) hexPreview.textContent = 'Start typing to see your colorful Minecraft text here...';
    if (hexCode) hexCode.innerHTML = '<button class="copy-btn" onclick="copyText(\'hexMinecraftCode\')">Copy</button><span class="example-text">Minecraft hex color codes will appear here...</span>';
}

function clearGradient() {
    const gradientTextInput = document.getElementById('gradientText');
    const gradientPreviewEl = document.getElementById('gradientPreview');
    const gradientCodeEl = document.getElementById('gradientCode');
    
    if (gradientTextInput) gradientTextInput.value = '';
    if (gradientPreviewEl) gradientPreviewEl.textContent = 'Gradient preview will appear here...';
    if (gradientCodeEl) gradientCodeEl.innerHTML = '<button class="copy-btn" onclick="copyText(\'gradientCode\')">Copy</button><span class="example-text">Gradient color codes will appear here...</span>';
}

// Format switching functions
function convertColorFormat(text, targetFormat) {
    if (targetFormat === '&') {
        // Convert § to &
        return text.replace(/§/g, '&');
    } else {
        // Convert & to §
        return text.replace(/&/g, '§');
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function updateHexOutput() {
    updateHexMinecraftPreview();
}

function updateMinecraftOutput() {
    updateMinecraftPreview();
}

function updateGradientOutput() {
    const text = gradientText ? gradientText.value : '';
    if (text.trim() !== '') {
        generateGradient();
    }
}

/**
 * Enhanced Gradient Text Generation
 */
function generateGradient() {
    const text = gradientText ? gradientText.value.trim() : '';
    const startColor = gradientStartColor ? gradientStartColor.value : '#FF5555';
    const endColor = gradientEndColor ? gradientEndColor.value : '#5555FF';
    
    if (!text) {
        if (gradientPreview) {
            gradientPreview.innerHTML = 'Enter text to generate gradient...';
        }
        if (gradientCode) {
            gradientCode.innerHTML = '<button class="copy-btn" onclick="copyText(\'gradientCode\')">Copy</button><span class="example-text">Gradient color codes will appear here...</span>';
        }
        return;
    }
    
    if (text.length > 50) {
        showNotification('Text too long! Maximum 50 characters for gradient effect.', 'warning');
        return;
    }
    
    let gradientCodeText = '';
    let previewHtml = '';
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === ' ') {
            gradientCodeText += ' ';
            previewHtml += '&nbsp;';
            continue;
        }
        
        const factor = text.length === 1 ? 0 : i / (text.length - 1);
        const interpolatedColor = interpolateColor(startColor, endColor, factor);
        const hexCode = '§#' + interpolatedColor.substring(1).toUpperCase();
        
        // Store the custom color
        customHexColors[hexCode] = interpolatedColor;
        
        gradientCodeText += hexCode + char;
        previewHtml += `<span style="color: ${interpolatedColor};">${escapeHtml(char)}</span>`;
    }
    
    if (gradientPreview) {
        gradientPreview.innerHTML = previewHtml;
    }
    
    // Get format preference and convert the output
    const formatSelect = document.getElementById('gradientCodeFormat');
    const selectedFormat = formatSelect ? formatSelect.value : '&';
    const formattedGradientCode = convertColorFormat(gradientCodeText, selectedFormat);
    
    if (gradientCode) {
        gradientCode.innerHTML = `<button class="copy-btn" onclick="copyText('gradientCode')">Copy</button>${escapeHtml(formattedGradientCode)}`;
    }
    
    // Add to history
    if (text.trim()) {
        addToHistory(text, 'gradient', { 
            start: startColor, 
            end: endColor, 
            result: formattedGradientCode 
        });
    }
}

/**
 * Enhanced Navigation and Minecraft Tool Functions
 */
function showMinecraftTool(toolName) {
    // Hide all minecraft tools
    const tools = document.querySelectorAll('.minecraft-tool');
    tools.forEach(tool => tool.classList.remove('active'));
    
    // Remove active class from nav items
    const navItems = document.querySelectorAll('.minecraft-nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    // Show selected tool
    const selectedTool = document.getElementById(`minecraft-${toolName}`);
    if (selectedTool) {
        selectedTool.classList.add('active');
    }
    
    // Update nav button text and mark nav item as active
    const toolNames = {
        'hex': 'Custom Hex Color',
        'colors': 'Minecraft Colors',
        'gradient': 'Gradient Generator'
    };
    
    const currentToolElement = document.getElementById('currentMinecraftTool');
    if (currentToolElement) {
        currentToolElement.textContent = toolNames[toolName] || 'Unknown Tool';
    }
    
    // Mark nav item as active
    const activeNavItem = document.querySelector(`[onclick="showMinecraftTool('${toolName}')"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
    
    // Close dropdown
    const menu = document.getElementById('minecraftNavMenu');
    if (menu) {
        menu.classList.remove('show');
    }
    
    trackSectionView(`minecraft-${toolName}`);
}

function toggleMinecraftDropdown() {
    const menu = document.getElementById('minecraftNavMenu');
    if (menu) {
        menu.classList.toggle('show');
    }
}

/**
 * Enhanced Copy Functions
 */
function copyText(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
        showNotification('Element not found for copying', 'error');
        return;
    }
    
    // Get text content, excluding the copy button
    const copyBtn = element.querySelector('.copy-btn');
    const textToCopy = copyBtn ? 
        element.textContent.replace(copyBtn.textContent, '').trim() :
        element.textContent.trim();
    
    if (!textToCopy || textToCopy === 'Copy') {
        showNotification('No text to copy', 'warning');
        return;
    }
    
    // Use modern clipboard API if available
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            showNotification('Copied to clipboard!', 'success');
        }).catch(() => {
            fallbackCopyText(textToCopy);
        });
    } else {
        fallbackCopyText(textToCopy);
    }
}

function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('Copied to clipboard!', 'success');
    } catch (err) {
        showNotification('Failed to copy text', 'error');
    } finally {
        document.body.removeChild(textArea);
    }
}

/**
 * Enhanced Clear Functions
 */
function clearAll() {
    if (inputText) {
        inputText.value = '';
        updateOutputs();
    }
    showNotification('Text cleared', 'success');
}

function clearMinecraft() {
    if (minecraftText) {
        minecraftText.value = '';
        updateMinecraftOutput();
    }
    showNotification('Minecraft text cleared', 'success');
}

function clearHexMinecraft() {
    if (hexMinecraftText) {
        hexMinecraftText.value = '';
        updateHexOutput();
    }
    showNotification('Hex text cleared', 'success');
}

function clearGradient() {
    if (gradientText) {
        gradientText.value = '';
        generateGradient();
    }
    showNotification('Gradient text cleared', 'success');
}

/**
 * Hex Color Functions
 */
function applyHexColor() {
    let hex = hexInput ? hexInput.value.trim() : '';
    
    if (!hex) return;
    
    // Clean up hex input
    if (!hex.startsWith('#')) {
        hex = '#' + hex;
    }
    
    // Validate hex color
    if (!/^#[A-Fa-f0-9]{6}$/.test(hex)) {
        showNotification('Invalid hex color format. Use #RRGGBB format.', 'error');
        return;
    }
    
    if (colorPicker) {
        colorPicker.value = hex;
    }
    
    if (hexPreview) {
        hexPreview.innerHTML = `<span style="color: ${hex};">Custom colored text will appear here...</span>`;
        hexPreview.style.color = hex;
    }
    
    showNotification('Hex color applied successfully!', 'success');
}

/**
 * Event Listeners and Initialization
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initializeTheme();
    
    // Set up input event listeners
    if (inputText) {
        inputText.addEventListener('input', updateOutputs);
    }
    
    if (minecraftText) {
        minecraftText.addEventListener('input', updateMinecraftOutput);
    }
    
    if (hexMinecraftText) {
        hexMinecraftText.addEventListener('input', updateHexOutput);
    }
    
    if (gradientText) {
        gradientText.addEventListener('input', generateGradient);
    }
    
    if (gradientStartColor) {
        gradientStartColor.addEventListener('change', generateGradient);
    }
    
    if (gradientEndColor) {
        gradientEndColor.addEventListener('change', generateGradient);
    }
    
    // Set up hex color picker synchronization
    if (hexInput && colorPicker) {
        hexInput.addEventListener('input', function() {
            let hex = this.value.trim();
            if (!hex.startsWith('#') && hex.length === 6) {
                hex = '#' + hex;
            }
            if (/^#[A-Fa-f0-9]{6}$/.test(hex)) {
                colorPicker.value = hex;
            }
        });
        
        colorPicker.addEventListener('change', function() {
            hexInput.value = this.value;
        });
    }
    
    // Set up format selector listeners
    const formatSelectors = document.querySelectorAll('.format-selector');
    formatSelectors.forEach(selector => {
        selector.addEventListener('change', function() {
            const toolId = this.id;
            if (toolId.includes('minecraft')) {
                updateMinecraftOutput();
            } else if (toolId.includes('hex')) {
                updateHexOutput();
            } else if (toolId.includes('gradient')) {
                generateGradient();
            }
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        const dropdown = document.getElementById('minecraftNavMenu');
        const button = document.querySelector('.minecraft-nav-button');
        
        if (dropdown && !dropdown.contains(event.target) && (!button || !button.contains(event.target))) {
            dropdown.classList.remove('show');
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        // Ctrl/Cmd + K for theme toggle
        if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
            event.preventDefault();
            toggleTheme();
        }
        
        // Ctrl/Cmd + H for history clear
        if ((event.ctrlKey || event.metaKey) && event.key === 'h') {
            event.preventDefault();
            clearHistory();
        }
    });
    
    console.log('MineStyle initialized successfully!');
    showNotification('Welcome to MineStyle! Press Ctrl+K to toggle theme.', 'info');
});

// Add CSS for notifications and animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    .obfuscated {
        animation: obfuscate 0.1s infinite;
    }
    
    @keyframes obfuscate {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
    }
`;
document.head.appendChild(style);