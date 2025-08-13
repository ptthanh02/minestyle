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
    const mobileNavLinks = document.getElementById('navLinks');
    if (mobileNavLinks) mobileNavLinks.classList.remove('active');
    
    // Analytics - track section views
    trackSectionView(sectionName);
}

function toggleMobileMenu() {
    const mobileNavLinks = document.getElementById('navLinks');
    if (mobileNavLinks) {
        mobileNavLinks.classList.toggle('active');
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
    const inputText = document.getElementById('inputText');
    const cssOutput = document.getElementById('cssOutput');
    const unicodeOutput = document.getElementById('unicodeOutput');
    
    if (!inputText || !cssOutput || !unicodeOutput) return;
    
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
    const url = URL.createObjectURL(url);
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
 * Enhanced Gradient Text Generation
 */
function generateGradient() {
    const gradientText = document.getElementById('gradientText');
    const gradientStartColor = document.getElementById('gradientStartColor');
    const gradientEndColor = document.getElementById('gradientEndColor');
    const gradientPreview = document.getElementById('gradientPreview');
    const gradientCode = document.getElementById('gradientCode');
    
    if (!gradientText || !gradientStartColor || !gradientEndColor || !gradientPreview || !gradientCode) return;
    
    const text = gradientText.value.trim();
    const startColor = gradientStartColor.value;
    const endColor = gradientEndColor.value;
    
    if (!text) {
        gradientPreview.innerHTML = 'Enter text to generate gradient...';
        gradientCode.innerHTML = '<button class="copy-btn" onclick="copyText(\'gradientCode\')">Copy</button><span class="example-text">Gradient color codes will appear here...</span>';
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
    
    gradientPreview.innerHTML = previewHtml;
    
    // Get format preference and convert the output
    const formatSelect = document.getElementById('gradientCodeFormat');
    const selectedFormat = formatSelect ? formatSelect.value : '&';
    const formattedGradientCode = convertColorFormat(gradientCodeText, selectedFormat);
    
    gradientCode.innerHTML = `<button class="copy-btn" onclick="copyText('gradientCode')">Copy</button>${escapeHtml(formattedGradientCode)}`;
    
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
 * Enhanced Minecraft Functions
 */
function insertCode(code) {
    const activeTextarea = document.activeElement;
    const minecraftText = document.getElementById('minecraftText');
    let targetTextarea = minecraftText;
    
    // Determine which textarea is active
    if (activeTextarea && activeTextarea.tagName === 'TEXTAREA') {
        targetTextarea = activeTextarea;
    }
    
    if (!targetTextarea) return;
    
    const cursorPos = targetTextarea.selectionStart;
    const textBefore = targetTextarea.value.substring(0, cursorPos);
    const textAfter = targetTextarea.value.substring(targetTextarea.selectionEnd);
    
    targetTextarea.value = textBefore + code + textAfter;
    targetTextarea.selectionStart = targetTextarea.selectionEnd = cursorPos + code.length;
    targetTextarea.focus();
    
    // Update the appropriate preview
    if (targetTextarea.id === 'minecraftText') {
        updateMinecraftOutput();
    } else if (targetTextarea.id === 'hexMinecraftText') {
        updateHexOutput();
    }
}

function applyPreset(presetName) {
    const presetText = presetTemplates[presetName];
    const minecraftText = document.getElementById('minecraftText');
    if (presetText && minecraftText) {
        minecraftText.value = presetText;
        updateMinecraftOutput();
        showNotification(`Applied ${presetName} preset`, 'success');
    }
}

function updateMinecraftOutput() {
    const minecraftText = document.getElementById('minecraftText');
    const minecraftPreview = document.getElementById('minecraftPreview');
    const minecraftCode = document.getElementById('minecraftCode');
    
    if (!minecraftText || !minecraftPreview || !minecraftCode) return;
    
    const text = minecraftText.value;
    
    if (text.trim() === '') {
        minecraftPreview.innerHTML = 'Start typing to see your colorful Minecraft text here...';
        minecraftCode.innerHTML = '<button class="copy-btn" onclick="copyText(\'minecraftCode\')">Copy</button><span class="example-text">Minecraft color codes will appear here...</span>';
        return;
    }
    
    // Update preview
    minecraftPreview.innerHTML = parseMinecraftText(text);
    
    // Update code output
    const formatSelect = document.getElementById('minecraftCodeFormat');
    const selectedFormat = formatSelect ? formatSelect.value : '&';
    const formattedCode = convertColorFormat(text, selectedFormat);
    
    minecraftCode.innerHTML = `<button class="copy-btn" onclick="copyText('minecraftCode')">Copy</button>${escapeHtml(formattedCode)}`;
    
    // Add to history
    if (text.trim()) {
        addToHistory(text, 'minecraft', { result: formattedCode });
    }
}

function parseMinecraftText(text) {
    let parsed = text;
    let isFormatted = false;
    
    // Replace color codes with colored spans
    Object.keys(minecraftColors).forEach(code => {
        const color = minecraftColors[code];
        const regex = new RegExp(escapeRegex(code), 'g');
        if (parsed.includes(code)) {
            parsed = parsed.replace(regex, `</span><span style="color: ${color};">`);
            isFormatted = true;
        }
    });
    
    // Handle custom hex colors
    const hexRegex = /§#([A-Fa-f0-9]{6})/g;
    parsed = parsed.replace(hexRegex, (match, hex) => {
        isFormatted = true;
        return `</span><span style="color: #${hex};">`;
    });
    
    // Handle formatting codes
    const formatCodes = {
        '§l': '<strong>',
        '§o': '<em>',
        '§n': '<u>',
        '§m': '<s>',
        '§k': '<span class="obfuscated">',
        '§r': '</span><span style="color: #ffffff;">'
    };
    
    Object.keys(formatCodes).forEach(code => {
        const replacement = formatCodes[code];
        const regex = new RegExp(escapeRegex(code), 'g');
        if (parsed.includes(code)) {
            parsed = parsed.replace(regex, replacement);
            isFormatted = true;
        }
    });
    
    // Wrap in initial span and clean up
    if (isFormatted) {
        parsed = '<span style="color: #ffffff;">' + parsed + '</span>';
        parsed = parsed.replace(/<\/span><span[^>]*><\/span>/g, '');
    } else {
        parsed = `<span style="color: #ffffff;">${escapeHtml(parsed)}</span>`;
    }
    
    return parsed;
}

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function convertColorFormat(text, targetFormat) {
    if (targetFormat === '&') {
        return text.replace(/§/g, '&');
    } else {
        return text.replace(/&/g, '§');
    }
}

/**
 * Hex Color Functions
 */
function applyHexColor() {
    const hexInput = document.getElementById('hexInput');
    const colorPicker = document.getElementById('colorPicker');
    const hexPreview = document.getElementById('hexPreview');
    
    if (!hexInput) return;
    
    let hex = hexInput.value.trim();
    
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

function updateHexOutput() {
    const hexMinecraftText = document.getElementById('hexMinecraftText');
    const hexMinecraftPreview = document.getElementById('hexMinecraftPreview');
    const hexMinecraftCode = document.getElementById('hexMinecraftCode');
    
    if (!hexMinecraftText || !hexMinecraftPreview || !hexMinecraftCode) return;
    
    const text = hexMinecraftText.value;
    
    if (text.trim() === '') {
        hexMinecraftPreview.innerHTML = 'Start typing to see your colorful Minecraft text here...';
        hexMinecraftCode.innerHTML = '<button class="copy-btn" onclick="copyText(\'hexMinecraftCode\')">Copy</button><span class="example-text">Minecraft hex color codes will appear here...</span>';
        return;
    }
    
    // Update preview
    hexMinecraftPreview.innerHTML = parseMinecraftText(text);
    
    // Update code output
    const formatSelect = document.getElementById('hexCodeFormat');
    const selectedFormat = formatSelect ? formatSelect.value : '&';
    const formattedCode = convertColorFormat(text, selectedFormat);
    
    hexMinecraftCode.innerHTML = `<button class="copy-btn" onclick="copyText('hexMinecraftCode')">Copy</button>${escapeHtml(formattedCode)}`;
    
    // Add to history
    if (text.trim()) {
        addToHistory(text, 'hex-minecraft', { result: formattedCode });
    }
}

function updateGradientOutput() {
    generateGradient();
}

/**
 * Minecraft Navigation Functions
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
 * Copy Functions
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
 * Clear Functions
 */
function clearAll() {
    const inputText = document.getElementById('inputText');
    if (inputText) {
        inputText.value = '';
        updateOutputs();
    }
    showNotification('Text cleared', 'success');
}

function clearMinecraft() {
    const minecraftText = document.getElementById('minecraftText');
    if (minecraftText) {
        minecraftText.value = '';
        updateMinecraftOutput();
    }
    showNotification('Minecraft text cleared', 'success');
}

function clearHexMinecraft() {
    const hexMinecraftText = document.getElementById('hexMinecraftText');
    if (hexMinecraftText) {
        hexMinecraftText.value = '';
        updateHexOutput();
    }
    showNotification('Hex text cleared', 'success');
}

function clearGradient() {
    const gradientText = document.getElementById('gradientText');
    if (gradientText) {
        gradientText.value = '';
        generateGradient();
    }
    showNotification('Gradient text cleared', 'success');
}

/**
 * Event Listeners and Initialization
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initializeTheme();
    
    // Set up input event listeners
    const inputText = document.getElementById('inputText');
    if (inputText) {
        inputText.addEventListener('input', updateOutputs);
    }
    
    const minecraftText = document.getElementById('minecraftText');
    if (minecraftText) {
        minecraftText.addEventListener('input', updateMinecraftOutput);
    }
    
    const hexMinecraftText = document.getElementById('hexMinecraftText');
    if (hexMinecraftText) {
        hexMinecraftText.addEventListener('input', updateHexOutput);
    }
    
    const gradientText = document.getElementById('gradientText');
    if (gradientText) {
        gradientText.addEventListener('input', generateGradient);
    }
    
    const gradientStartColor = document.getElementById('gradientStartColor');
    if (gradientStartColor) {
        gradientStartColor.addEventListener('change', generateGradient);
    }
    
    const gradientEndColor = document.getElementById('gradientEndColor');
    if (gradientEndColor) {
        gradientEndColor.addEventListener('change', generateGradient);
    }
    
    // Set up hex color picker synchronization
    const hexInput = document.getElementById('hexInput');
    const colorPicker = document.getElementById('colorPicker');
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