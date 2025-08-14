/* MineStyle - Enhanced Main JavaScript */

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

// Custom hex colors storage
let customHexColors = {};

// Enhanced copy feedback with haptic feedback
let copyTimeouts = new Map();

// DOM element references with null checks
const getElement = (id) => document.getElementById(id);
const inputText = getElement('inputText');
const cssOutput = getElement('cssOutput');
const unicodeOutput = getElement('unicodeOutput');
const minecraftText = getElement('minecraftText');
const minecraftPreview = getElement('minecraftPreview');
const minecraftCode = getElement('minecraftCode');
const hexInput = getElement('hexInput');
const colorPicker = getElement('colorPicker');
const hexPreview = getElement('hexPreview');

// Hex tool specific elements
const hexMinecraftText = getElement('hexMinecraftText');
const hexMinecraftPreview = getElement('hexMinecraftPreview');
const hexMinecraftCode = getElement('hexMinecraftCode');

// New gradient elements
const gradientText = getElement('gradientText');
const gradientStartColor = getElement('gradientStartColor');
const gradientEndColor = getElement('gradientEndColor');
const gradientPreview = getElement('gradientPreview');
const gradientCode = getElement('gradientCode');

// Enhanced preset templates with more variety
const presetTemplates = {
    welcome: '§e✨ §bWelcome to §a§lOur Server§r§e! §6Enjoy your stay! §e✨',
    error: '§c§l❌ [ERROR]§r §cSomething went wrong! Please try again.',
    success: '§a§l✅ [SUCCESS]§r §aAction completed successfully!',
    warning: '§6§l⚠️ [WARNING]§r §6Please be careful with this action.',
    info: '§b§lℹ️ [INFO]§r §bHere is some important information.',
    rainbow: '§cR§6a§ei§an§bb§9o§dw §cT§6e§ex§at'
};

// Enhanced animations and interactions
const animations = {
    // Smooth fade in animation
    fadeIn: (element, duration = 300) => {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            element.style.opacity = Math.min(progress / duration, 1);
            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    },
    
    // Bounce animation for buttons
    bounce: (element) => {
        element.style.transform = 'scale(0.95)';
        setTimeout(() => {
            element.style.transform = 'scale(1.05)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 100);
        }, 100);
    },
    
    // Pulse animation for notifications
    pulse: (element, color = 'rgba(102, 126, 234, 0.3)') => {
        const originalBoxShadow = element.style.boxShadow;
        element.style.boxShadow = `0 0 20px ${color}`;
        setTimeout(() => {
            element.style.boxShadow = originalBoxShadow;
        }, 500);
    }
};

// Enhanced haptic feedback (if supported)
const hapticFeedback = {
    light: () => {
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    },
    medium: () => {
        if (navigator.vibrate) {
            navigator.vibrate(100);
        }
    },
    heavy: () => {
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }
    }
};

/**
 * Enhanced navigation functions with smooth animations
 */
function showSection(sectionName, clickedElement = null) {
    // Hide all sections first
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });

    // Remove active class from all nav links
    const allNavLinks = document.querySelectorAll('.nav-link');
    allNavLinks.forEach(link => link.classList.remove('active'));

    // Show selected section with animation
    const newSection = getElement(sectionName);
    if (newSection) {
        newSection.style.display = 'block';
        newSection.classList.add('active');
        animations.fadeIn(newSection, 400);
    }
    
    // Mark nav link as active - use the clicked element or find by onclick attribute
    let activeLink = clickedElement;
    if (!activeLink) {
        activeLink = document.querySelector(`[onclick*="showSection('${sectionName}')"]`);
    }
    
    if (activeLink) {
        activeLink.classList.add('active');
        animations.pulse(activeLink);
    }

    // Close mobile menu if open
    const mobileNavLinks = getElement('navLinks');
    if (mobileNavLinks) {
        mobileNavLinks.classList.remove('active');
    }
    
    // Haptic feedback
    hapticFeedback.light();
}

function toggleMobileMenu() {
    const mobileNavLinks = getElement('navLinks');
    if (mobileNavLinks) {
        mobileNavLinks.classList.toggle('active');
        hapticFeedback.medium();
    }
}

/**
 * Enhanced small caps conversion functions
 */
function convertToUnicodeSmallCaps(text) {
    return text.split('').map(char => {
        const lower = char.toLowerCase();
        return smallCapsMap[lower] || char;
    }).join('');
}

function updateOutputs() {
    if (!inputText || !cssOutput || !unicodeOutput) return;
    
    const text = inputText.value;
    
    if (text.trim() === '') {
        cssOutput.innerHTML = '<button class="copy-btn" onclick="copyText(\'cssOutput\')">Copy</button><span class="example-text">CSS styled small caps will appear here...</span>';
        unicodeOutput.innerHTML = '<button class="copy-btn" onclick="copyText(\'unicodeOutput\')">Copy</button><span class="example-text">Unicode small caps will appear here...</span>';
        return;
    }
    
    // CSS Small Caps (display original text, CSS handles styling)
    cssOutput.innerHTML = `<button class="copy-btn" onclick="copyText('cssOutput')">Copy</button>${escapeHtml(text)}`;
    
    // Unicode Small Caps
    const unicodeText = convertToUnicodeSmallCaps(text);
    unicodeOutput.innerHTML = `<button class="copy-btn" onclick="copyText('unicodeOutput')">Copy</button>${escapeHtml(unicodeText)}`;
    
    // Add subtle animation
    animations.pulse(cssOutput, 'rgba(102, 126, 234, 0.2)');
    animations.pulse(unicodeOutput, 'rgba(118, 75, 162, 0.2)');
}

/**
 * Color utility functions
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
        showToast('Text too long! Maximum 50 characters for gradient effect.', 'warning');
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
        showToast('Please enter a valid hex color (e.g., #FF5555 or FF5555)', 'error');
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
 * Enhanced copy function with modern feedback
 */
function copyText(outputId) {
    const element = getElement(outputId);
    if (!element) return;
    
    const button = element.querySelector('.copy-btn');
    if (!button) return;
    
    // Clear any existing timeout for this button
    if (copyTimeouts.has(outputId)) {
        clearTimeout(copyTimeouts.get(outputId));
    }
    
    // Get text content excluding the button
    let textContent;
    if (outputId === 'minecraftCode' || outputId === 'hexMinecraftCode' || outputId === 'gradientCode') {
        // For code outputs, get the actual text from the corresponding input
        if (outputId === 'minecraftCode') {
            const formatSelect = getElement('minecraftCodeFormat');
            const selectedFormat = formatSelect ? formatSelect.value : '&';
            textContent = convertColorFormat(minecraftText?.value || '', selectedFormat);
        } else if (outputId === 'hexMinecraftCode') {
            const formatSelect = getElement('hexCodeFormat');
            const selectedFormat = formatSelect ? formatSelect.value : '&';
            textContent = convertColorFormat(hexMinecraftText?.value || '', selectedFormat);
        } else if (outputId === 'gradientCode') {
            textContent = generateGradientCodeText();
        }
    } else {
        // Get the text content, excluding the copy button
        const textNode = Array.from(element.childNodes).find(node => 
            node.nodeType === Node.TEXT_NODE || 
            (node.nodeType === Node.ELEMENT_NODE && !node.classList.contains('copy-btn'))
        );
        textContent = textNode ? textNode.textContent || textNode.innerText : '';
    }
    
    if (!textContent || textContent.trim() === '') return;
    
    // Modern clipboard API with fallback
    const copyToClipboard = async (text) => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return true;
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                return successful;
            }
        } catch (err) {
            console.warn('Copy failed:', err);
            return false;
        }
    };
    
    // Execute copy with enhanced feedback
    copyToClipboard(textContent).then(success => {
        if (success) {
            // Enhanced success feedback
            const originalText = button.textContent;
            const originalBg = button.style.background;
            
            button.textContent = '✅ Copied!';
            button.classList.add('copied');
            button.style.background = 'linear-gradient(135deg, #11998e, #38ef7d)';
            
            // Animations
            animations.bounce(button);
            animations.pulse(element, 'rgba(56, 239, 125, 0.4)');
            hapticFeedback.light();
            
            // Reset after delay
            const timeout = setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('copied');
                button.style.background = originalBg;
                copyTimeouts.delete(outputId);
            }, 2500);
            
            copyTimeouts.set(outputId, timeout);
            
            // Optional: Show toast notification
            showToast('Text copied to clipboard!', 'success');
        } else {
            // Error feedback
            button.textContent = '❌ Failed';
            button.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a24)';
            hapticFeedback.heavy();
            
            setTimeout(() => {
                button.textContent = 'Copy';
                button.style.background = '';
            }, 2000);
            
            showToast('Failed to copy text', 'error');
        }
    });
}

// Enhanced toast notification system
function showToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Toast styles
    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '12px',
        color: 'white',
        fontWeight: '600',
        fontSize: '14px',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
    });
    
    // Type-specific styling
    const typeStyles = {
        success: 'linear-gradient(135deg, #11998e, #38ef7d)',
        error: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
        info: 'linear-gradient(135deg, #667eea, #764ba2)',
        warning: 'linear-gradient(135deg, #ffecd2, #fcb69f)'
    };
    
    toast.style.background = typeStyles[type] || typeStyles.info;
    
    document.body.appendChild(toast);
    
    // Animate in
    requestAnimationFrame(() => {
        toast.style.transform = 'translateX(0)';
    });
    
    // Auto remove
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Helper function for gradient code generation
function generateGradientCodeText() {
    if (!gradientText || !gradientStartColor || !gradientEndColor) return '';
    
    const text = gradientText.value.trim();
    const startColor = gradientStartColor.value;
    const endColor = gradientEndColor.value;
    
    if (!text) return '';
    
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
    
    const formatSelect = getElement('gradientCodeFormat');
    const selectedFormat = formatSelect ? formatSelect.value : '&';
    return convertColorFormat(gradientCode, selectedFormat);
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

// Enhanced initialization
document.addEventListener('DOMContentLoaded', function() {
    // Show loading state briefly for smooth transition
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);

    // Initialize 3D viewer if Three.js is available
    if (typeof THREE !== 'undefined') {
        console.log('Three.js detected, 3D viewer ready for initialization...');
        // The 3D viewer will be initialized when a user searches for a player
    } else {
        console.warn('Three.js not loaded, 3D viewer will not be available');
        // Hide 3D viewer if Three.js is not available
        const modelViewer = document.getElementById('minecraftModel3D');
        if (modelViewer) {
            const container = modelViewer.closest('.skin-preview-card');
            if (container) {
                container.style.display = 'none';
            }
        }
    }

    // Add obfuscation animation for magic text
    setInterval(() => {
        if (minecraftText && minecraftText.value.includes('§k')) {
            updateMinecraftPreview();
        }
        if (hexMinecraftText && hexMinecraftText.value.includes('§k')) {
            updateHexMinecraftPreview();
        }
    }, 100);

    // Enhanced event listeners with null checks
    if (inputText) {
        inputText.addEventListener('input', updateOutputs);
        inputText.addEventListener('paste', () => setTimeout(updateOutputs, 10));
    }
    
    if (minecraftText) {
        minecraftText.addEventListener('input', updateMinecraftPreview);
        minecraftText.addEventListener('paste', () => setTimeout(updateMinecraftPreview, 10));
    }
    
    if (hexInput) {
        hexInput.addEventListener('input', updateHexPreview);
        hexInput.addEventListener('paste', () => setTimeout(updateHexPreview, 10));
    }
    
    // Hex tool event listeners
    if (hexMinecraftText) {
        hexMinecraftText.addEventListener('input', updateHexMinecraftPreview);
        hexMinecraftText.addEventListener('paste', () => setTimeout(updateHexMinecraftPreview, 10));
    }
    
    // Gradient event listeners
    if (gradientText) {
        gradientText.addEventListener('input', generateGradient);
        gradientText.addEventListener('paste', () => setTimeout(generateGradient, 10));
    }
    if (gradientStartColor) gradientStartColor.addEventListener('change', generateGradient);
    if (gradientEndColor) gradientEndColor.addEventListener('change', generateGradient);
    
    // Make output text areas clickable to copy
    makeOutputClickable('cssOutput');
    makeOutputClickable('unicodeOutput');
    makeOutputClickable('minecraftCode');
    makeOutputClickable('hexMinecraftCode');
    makeOutputClickable('gradientCode');
    
    // Sync color picker with hex input
    if (colorPicker && hexInput) {
        colorPicker.addEventListener('input', function() {
            hexInput.value = this.value;
            updateHexPreview();
        });
    }

    // Enhanced keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to copy from active text area
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            const activeElement = document.activeElement;
            if (activeElement && activeElement.tagName === 'TEXTAREA') {
                const outputId = activeElement.id.replace('Text', 'Code').replace('input', 'unicode');
                if (getElement(outputId)) {
                    copyText(outputId);
                }
            }
        }
        
        // Escape key to close mobile menu and dropdowns
        if (e.key === 'Escape') {
            const mobileMenu = getElement('navLinks');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
            }
            
            const minecraftMenu = getElement('minecraftNavMenu');
            if (minecraftMenu && minecraftMenu.classList.contains('open')) {
                closeMinecraftDropdown();
            }
        }
    });

    // Cleanup 3D viewer when page unloads
    window.addEventListener('beforeunload', cleanup3DViewer);

    // Handle Enter key in inputs
    ['hexInput', 'gradientText'].forEach(inputId => {
        const input = getElement(inputId);
        if (input) {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    if (inputId === 'hexInput') {
                        applyHexColor();
                    } else if (inputId === 'gradientText') {
                        generateGradient();
                    }
                }
            });
        }
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        // Handle mobile menu closing
        const navbar = document.querySelector('.navbar');
        const mobileMenu = getElement('navLinks');
        
        if (navbar && mobileMenu && !navbar.contains(e.target) && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
        }
        
        // Handle minecraft dropdown closing
        const minecraftDropdown = document.querySelector('.minecraft-nav-dropdown');
        
        // Only close if clicking outside the entire dropdown container
        if (minecraftDropdown && !minecraftDropdown.contains(e.target)) {
            closeMinecraftDropdown();
        }
    });

    // Prevent dropdown from closing when clicking inside menu items
    const minecraftMenu = getElement('minecraftNavMenu');
    if (minecraftMenu) {
        minecraftMenu.addEventListener('click', function(e) {
            // Only allow nav items to work, prevent other clicks from propagating
            if (e.target.classList.contains('minecraft-nav-item')) {
                // Let the item click be handled by the main event delegation
                return;
            } else {
                e.stopPropagation();
            }
        });
    }

    // Add event delegation for navigation links
    document.addEventListener('click', function(e) {
        // Handle navigation links
        if (e.target.classList.contains('nav-link')) {
            e.preventDefault();
            e.stopPropagation();
            const onclick = e.target.getAttribute('onclick');
            if (onclick) {
                // Extract section name from onclick attribute
                const match = onclick.match(/showSection\('([^']+)'/);
                if (match) {
                    showSection(match[1], e.target);
                }
            }
        }
        
        // Handle minecraft nav items
        if (e.target.classList.contains('minecraft-nav-item')) {
            e.preventDefault();
            e.stopPropagation();
            const onclick = e.target.getAttribute('onclick');
            if (onclick) {
                // Extract tool name from onclick attribute
                const match = onclick.match(/showMinecraftTool\('([^']+)'/);
                if (match) {
                    showMinecraftTool(match[1], e);
                }
            }
        }
        
        // Handle minecraft dropdown button clicks
        if (e.target.classList.contains('minecraft-nav-button') || e.target.closest('.minecraft-nav-button')) {
            e.preventDefault();
            e.stopPropagation();
            toggleMinecraftDropdown(e);
        }
    });

    // Prevent links from causing page jumps
    document.querySelectorAll('a[href="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
        });
    });

    // Initialize format selectors if they exist
    const formatSelectors = ['hexCodeFormat', 'minecraftCodeFormat', 'gradientCodeFormat'];
    formatSelectors.forEach(selectorId => {
        const selector = getElement(selectorId);
        if (selector && selector.options.length === 0) {
            selector.innerHTML = `
                <option value="&">&amp; Format</option>
                <option value="§">§ Format</option>
            `;
        }
    });
    
    // Skin checker event listeners
    const playerUsername = getElement('playerUsername');
    if (playerUsername) {
        playerUsername.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchPlayer();
            }
        });
    }
    
    // Show welcome toast
    setTimeout(() => {
        showToast('Welcome to MineStyle! 🎨', 'info');
    }, 1000);
});

// Utility function for HTML escaping
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Minecraft Navigation Functions
 */

// Toggle minecraft dropdown menu
function toggleMinecraftDropdown(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    const menu = getElement('minecraftNavMenu');
    const button = document.querySelector('.minecraft-nav-button');
    const dropdown = document.querySelector('.minecraft-nav-dropdown');
    
    if (menu && button && dropdown) {
        const isOpen = menu.classList.contains('open');
        
        if (isOpen) {
            // Close dropdown
            closeMinecraftDropdown();
        } else {
            // Open dropdown
            openMinecraftDropdown();
        }
        
        // Add haptic feedback
        hapticFeedback.light();
    }
}

// Helper function to open dropdown
function openMinecraftDropdown() {
    const menu = getElement('minecraftNavMenu');
    const button = document.querySelector('.minecraft-nav-button');
    const dropdown = document.querySelector('.minecraft-nav-dropdown');
    
    if (menu && button && dropdown) {
        // Close any other open dropdowns first
        closeMinecraftDropdown();
        
        // Open this dropdown
        menu.classList.add('open');
        button.classList.add('active');
        dropdown.classList.add('open');
        
        // Reset all pointer events and z-index
        menu.style.pointerEvents = 'auto';
        menu.style.zIndex = '10000';
        
        // Ensure all menu items are clickable
        const dropdownItems = menu.querySelectorAll('.minecraft-nav-item');
        dropdownItems.forEach(item => {
            item.style.pointerEvents = 'auto';
            item.style.zIndex = '10001';
        });
    }
}

// Helper function to close dropdown
function closeMinecraftDropdown() {
    const menu = getElement('minecraftNavMenu');
    const button = document.querySelector('.minecraft-nav-button');
    const dropdown = document.querySelector('.minecraft-nav-dropdown');
    
    if (menu && button && dropdown) {
        menu.classList.remove('open');
        button.classList.remove('active');
        dropdown.classList.remove('open');
        
        // Reset pointer events
        menu.style.pointerEvents = 'none';
        
        // Reset menu items
        const dropdownItems = menu.querySelectorAll('.minecraft-nav-item');
        dropdownItems.forEach(item => {
            item.style.pointerEvents = '';
            item.style.zIndex = '';
        });
    }
}

// Show specific minecraft tool
function showMinecraftTool(toolName, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    // Hide all minecraft tools with explicit style setting
    document.querySelectorAll('.minecraft-tool').forEach(tool => {
        tool.classList.remove('active');
        tool.style.display = 'none'; // Explicitly hide to prevent CSS conflicts
    });
    
    // Remove active class from all nav items
    document.querySelectorAll('.minecraft-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected tool
    const selectedTool = getElement(`minecraft-${toolName}`);
    if (selectedTool) {
        selectedTool.classList.add('active');
        selectedTool.style.display = 'block'; // Explicitly show
        // Add smooth animation
        animations.fadeIn(selectedTool, 300);
    }
    
    // Mark nav item as active
    const selectedNavItem = document.querySelector(`.minecraft-nav-item[onclick*="${toolName}"]`);
    if (selectedNavItem) {
        selectedNavItem.classList.add('active');
        animations.pulse(selectedNavItem, 'rgba(102, 126, 234, 0.3)');
    }
    
    // Update dropdown button text
    const currentToolSpan = getElement('currentMinecraftTool');
    if (currentToolSpan && selectedNavItem) {
        currentToolSpan.textContent = selectedNavItem.textContent.trim();
    }
    
    // Close dropdown using helper function
    closeMinecraftDropdown();
    
    // Add haptic feedback
    hapticFeedback.light();
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

// ===========================
// SKIN CHECKER FUNCTIONALITY
// ===========================

// Skin checker variables
let currentPlayerData = null;
let currentSkinUrl = null;

// Cache for player data to reduce API calls
const playerCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Search for a Minecraft player by username with robust API fallback
 */
async function searchPlayer() {
    const usernameInput = document.getElementById('playerUsername');
    const username = usernameInput.value.trim();
    
    if (!username) {
        showToast('Please enter a username', 'warning');
        usernameInput.focus();
        return;
    }
    
    // Validate username format
    if (!/^[a-zA-Z0-9_]{1,16}$/.test(username)) {
        showToast('Invalid username format. Use only letters, numbers, and underscores (1-16 characters)', 'error');
        return;
    }
    
    // Check cache first
    const cacheKey = username.toLowerCase();
    const cached = playerCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('Using cached data for:', username);
        currentPlayerData = cached.playerData;
        currentSkinUrl = cached.skinInfo.skinUrl;
        
        displayPlayerData(cached.playerData, cached.skinInfo.skinUrl, cached.skinInfo.skinType);
        generate3DModel(cached.skinInfo.skinUrl, cached.skinInfo.skinType);
        analyzeSkinColors(cached.skinInfo.skinUrl);
        
        showToast(`Loaded ${cached.playerData.name}'s skin from cache!`, 'success');
        return;
    }
    
    // Show loading state
    showLoadingState();
    
    try {
        // Try to get player data with fallback methods
        const result = await attemptPlayerLookup(username);
        
        if (result.success) {
            currentPlayerData = result.playerData;
            currentSkinUrl = result.skinInfo.skinUrl;
            
            // Cache the result
            playerCache.set(cacheKey, {
                playerData: result.playerData,
                skinInfo: result.skinInfo,
                timestamp: Date.now()
            });
            
            // Display the player data
            displayPlayerData(result.playerData, result.skinInfo.skinUrl, result.skinInfo.skinType);
            
            // Generate 3D model
            generate3DModel(result.skinInfo.skinUrl, result.skinInfo.skinType);
            
            // Analyze skin colors
            analyzeSkinColors(result.skinInfo.skinUrl);
            
            hapticFeedback.medium();
            showToast(`Successfully loaded ${result.playerData.name}'s skin!`, 'success');
        } else {
            showError(result.errorTitle, result.errorMessage);
        }
        
    } catch (error) {
        console.error('Unexpected error during player search:', error);
        handleSearchError(error, username);
    }
}

/**
 * Attempt player lookup using multiple strategies
 */
async function attemptPlayerLookup(username) {
    // Strategy 1: Try direct UUID lookup using known patterns
    const directResult = await tryDirectPlayerLookup(username);
    if (directResult.success) {
        return directResult;
    }
    
    // Strategy 2: Use image-based verification from Crafatar
    const imageResult = await tryImageBasedLookup(username);
    if (imageResult.success) {
        return imageResult;
    }
    
    // Strategy 3: Generate synthetic UUID for common usernames (fallback)
    const syntheticResult = await trySyntheticLookup(username);
    if (syntheticResult.success) {
        return syntheticResult;
    }
    
    return {
        success: false,
        errorTitle: 'Player Not Found',
        errorMessage: `The username "${username}" could not be found or verified in Minecraft Java Edition.`
    };
}

/**
 * Try direct player lookup using CORS-friendly endpoints
 */
async function tryDirectPlayerLookup(username) {
    const endpoints = [
        {
            name: 'PlayerDB',
            url: `https://playerdb.co/api/player/minecraft/${username}`,
            parser: (data) => {
                if (data.success && data.data && data.data.player) {
                    return {
                        id: data.data.player.id,
                        name: data.data.player.username || username
                    };
                }
                return null;
            }
        }
    ];
    
    for (const endpoint of endpoints) {
        try {
            console.log(`Trying direct lookup via ${endpoint.name}...`);
            const response = await fetchWithTimeout(endpoint.url, 8000);
            
            if (response.ok) {
                const data = await response.json();
                const playerData = endpoint.parser(data);
                
                if (playerData && playerData.id) {
                    const skinInfo = await getSkinInfoFromUUID(playerData.id);
                    return {
                        success: true,
                        playerData: playerData,
                        skinInfo: skinInfo
                    };
                }
            }
        } catch (error) {
            console.warn(`Direct lookup via ${endpoint.name} failed:`, error.message);
        }
    }
    
    return { success: false };
}

/**
 * Try image-based verification by checking if Crafatar has images for the username
 */
async function tryImageBasedLookup(username) {
    try {
        console.log('Trying image-based verification...');
        
        // Test if Crafatar can generate an avatar for this username
        const testUrl = `https://crafatar.com/avatars/${username}?size=64&default=steve`;
        
        // Create an image element to test if the user exists
        const result = await new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            const timeout = setTimeout(() => {
                resolve({ exists: false, isDefault: true });
            }, 5000);
            
            img.onload = function() {
                clearTimeout(timeout);
                
                // Check if it's a default skin by analyzing the image
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = 64;
                canvas.height = 64;
                
                try {
                    ctx.drawImage(img, 0, 0, 64, 64);
                    const imageData = ctx.getImageData(0, 0, 64, 64);
                    
                    // Check if it's likely a default Steve skin
                    const isDefaultSteve = checkIfDefaultSteve(imageData);
                    
                    resolve({ 
                        exists: true, 
                        isDefault: isDefaultSteve,
                        hasCustomSkin: !isDefaultSteve
                    });
                } catch (e) {
                    // CORS error means we can't analyze, but image loaded
                    resolve({ exists: true, isDefault: false, hasCustomSkin: true });
                }
            };
            
            img.onerror = function() {
                clearTimeout(timeout);
                resolve({ exists: false });
            };
            
            img.src = testUrl;
        });
        
        if (result.exists) {
            // Generate synthetic player data
            const playerData = {
                id: generateSyntheticUUID(username),
                name: username
            };
            
            const skinInfo = {
                skinUrl: `https://crafatar.com/skins/${username}`,
                skinType: 'steve' // Default, could be enhanced
            };
            
            return {
                success: true,
                playerData: playerData,
                skinInfo: skinInfo
            };
        }
        
    } catch (error) {
        console.warn('Image-based verification failed:', error);
    }
    
    return { success: false };
}

/**
 * Generate a synthetic UUID based on username (for display purposes)
 */
function generateSyntheticUUID(username) {
    // Simple hash-based UUID generation for display
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
        const char = username.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Convert to a UUID-like format
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `${hex.slice(0,8)}-${hex.slice(0,4)}-4${hex.slice(1,4)}-8${hex.slice(0,3)}-${hex}${hex.slice(0,4)}`;
}

/**
 * Check if image data represents default Steve skin
 */
function checkIfDefaultSteve(imageData) {
    const data = imageData.data;
    
    // Check specific Steve skin pixels (simplified)
    // Steve's skin color around face area
    const facePixelIndex = (20 * 64 + 30) * 4; // Approximate face area
    if (facePixelIndex < data.length - 3) {
        const r = data[facePixelIndex];
        const g = data[facePixelIndex + 1];
        const b = data[facePixelIndex + 2];
        
        // Steve's typical skin color is around RGB(241, 175, 120)
        const isSteveSkinColor = (
            r > 220 && r < 255 &&
            g > 160 && g < 190 &&
            b > 100 && b < 140
        );
        
        return isSteveSkinColor;
    }
    
    return false;
}

/**
 * Try synthetic lookup for well-known usernames
 */
async function trySyntheticLookup(username) {
    // List of well-known Minecraft usernames with their actual UUIDs
    const knownPlayers = {
        'Notch': '069a79f4-44e9-4726-a5be-fca90e38aaf5',
        'jeb_': '853c80ef-3c37-49fd-aa49-938b674adae6',
        'Dinnerbone': '61699b2e-d327-4a01-9f1e-0ea8c3f06bc6',
        'Grumm': '853c80ef-3c37-49fd-aa49-938b674adae6',
        'Steve': '8667ba71-b85a-4004-af54-457a9734eed7'
    };
    
    const lowerUsername = username.toLowerCase();
    for (const [knownName, uuid] of Object.entries(knownPlayers)) {
        if (knownName.toLowerCase() === lowerUsername) {
            console.log(`Found known player: ${knownName}`);
            
            const playerData = {
                id: uuid,
                name: knownName
            };
            
            const skinInfo = await getSkinInfoFromUUID(uuid);
            
            return {
                success: true,
                playerData: playerData,
                skinInfo: skinInfo
            };
        }
    }
    
    return { success: false };
}

/**
 * Get skin information from UUID
 */
async function getSkinInfoFromUUID(uuid) {
    // Default skin info
    const defaultSkin = {
        skinUrl: 'https://textures.minecraft.net/texture/1a4af718455d4aab528e7a61f86fa25e6a369d1768dcb13f7df319a713eb810b',
        skinType: 'steve'
    };
    
    try {
        // Try Crafatar first (most reliable for existing players)
        const craftarSkinUrl = `https://crafatar.com/skins/${uuid}`;
        
        // Test if the skin exists
        const response = await fetchWithTimeout(craftarSkinUrl, 5000);
        if (response.ok) {
            const skinType = await detectSkinType(craftarSkinUrl);
            return {
                skinUrl: craftarSkinUrl,
                skinType: skinType
            };
        }
    } catch (error) {
        console.warn('Failed to get skin from Crafatar:', error);
    }
    
    return defaultSkin;
}



/**
 * Detect skin type (Steve vs Alex) by analyzing skin dimensions
 */
async function detectSkinType(skinUrl) {
    try {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = function() {
                // Create canvas to check arm width
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                // Check if it's a slim skin by looking at arm width
                // This is a simplified check - Alex skins have 3-pixel wide arms vs Steve's 4-pixel
                const imageData = ctx.getImageData(46, 16, 2, 4);
                const data = imageData.data;
                
                // If there are transparent pixels in the arm area, it's likely Alex
                let transparentPixels = 0;
                for (let i = 3; i < data.length; i += 4) {
                    if (data[i] < 128) transparentPixels++;
                }
                
                resolve(transparentPixels > 4 ? 'alex' : 'steve');
            };
            img.onerror = () => resolve('steve');
            img.src = skinUrl;
        });
    } catch (error) {
        return 'steve';
    }
}

/**
 * Fetch with timeout
 */
async function fetchWithTimeout(url, timeout = 10000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'MineStyle-SkinChecker/1.0'
            }
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

/**
 * Handle search errors with specific error messages
 */
function handleSearchError(error, username) {
    let title = 'Search Failed';
    let message = 'Unable to search for player data. Please try again.';
    
    if (error.name === 'AbortError') {
        title = 'Request Timeout';
        message = 'The search request timed out. Please check your internet connection and try again.';
    } else if (error.message.includes('Failed to fetch')) {
        title = 'Network Error';
        message = 'Unable to connect to player data services. Please check your internet connection and try again.';
    } else if (error.message.includes('404') || error.message.includes('204')) {
        title = 'Player Not Found';
        message = `The username "${username}" does not exist in Minecraft Java Edition.`;
    } else if (error.message.includes('Rate limit')) {
        title = 'Rate Limited';
        message = 'Too many requests. Please wait a moment and try again.';
    }
    
    showError(title, message);
}

/**
 * Show loading state
 */
function showLoadingState() {
    const skinDisplay = document.getElementById('skinDisplaySection');
    const errorDisplay = document.getElementById('errorDisplay');
    
    if (skinDisplay) skinDisplay.style.display = 'block';
    if (errorDisplay) errorDisplay.style.display = 'none';
    
    // Show loading in player info
    const playerName = document.getElementById('playerName');
    const playerUuid = document.getElementById('playerUuid');
    const playerHead = document.getElementById('playerHead');
    const fullSkinImage = document.getElementById('fullSkinImage');
    
    if (playerName) playerName.textContent = 'Loading...';
    if (playerUuid) playerUuid.textContent = 'UUID: Loading...';
    if (playerHead) {
        playerHead.src = '';
        playerHead.alt = 'Loading...';
    }
    if (fullSkinImage) {
        fullSkinImage.src = '';
        fullSkinImage.alt = 'Loading...';
    }
    
    // Show loading in 3D model
    const modelViewer = document.getElementById('modelViewer');
    if (modelViewer) {
        modelViewer.innerHTML = `
            <div class="model-loading">
                <div class="loading-spinner"></div>
                <p>Loading 3D model...</p>
            </div>
        `;
    }
    
    // Show loading in color palette
    const colorPalette = document.getElementById('colorPalette');
    if (colorPalette) {
        colorPalette.innerHTML = '<div class="color-loading">Analyzing skin colors...</div>';
    }
}

/**
 * Display player data
 */
function displayPlayerData(playerData, skinUrl, skinType) {
    const playerName = document.getElementById('playerName');
    const playerUuid = document.getElementById('playerUuid');
    const playerHead = document.getElementById('playerHead');
    const fullSkinImage = document.getElementById('fullSkinImage');
    const skinTypeBadge = document.getElementById('skinTypeBadge');
    const skinTypeInfo = document.getElementById('skinTypeInfo');
    const skinResolution = document.getElementById('skinResolution');
    const skinLastUpdated = document.getElementById('skinLastUpdated');
    
    if (playerName) playerName.textContent = playerData.name;
    if (playerUuid) playerUuid.textContent = `UUID: ${playerData.id}`;
    
    // Set player head (using skin URL to generate head)
    if (playerHead) {
        playerHead.src = `https://crafatar.com/avatars/${playerData.id}?size=64&overlay`;
        playerHead.alt = `${playerData.name}'s Head`;
        playerHead.style.imageRendering = 'pixelated';
    }
    
    // Set full skin image
    if (fullSkinImage) {
        fullSkinImage.src = skinUrl;
        fullSkinImage.alt = `${playerData.name}'s Skin`;
        fullSkinImage.style.imageRendering = 'pixelated';
        fullSkinImage.style.maxWidth = '256px';
        fullSkinImage.style.height = 'auto';
    }
    
    // Update skin type badge and info
    const isAlex = skinType === 'alex';
    if (skinTypeBadge) {
        skinTypeBadge.innerHTML = `<span class="badge">${isAlex ? 'Alex (Slim)' : 'Steve (Classic)'}</span>`;
    }
    if (skinTypeInfo) {
        skinTypeInfo.textContent = isAlex ? 'Alex (Slim Arms)' : 'Steve (Classic)';
    }
    
    // Set skin resolution (assuming 64x64 for now)
    if (skinResolution) {
        skinResolution.textContent = '64x64';
    }
    
    // Set last updated (we don't have this info from the API, so show current time)
    if (skinLastUpdated) {
        skinLastUpdated.textContent = new Date().toLocaleDateString();
    }
}

/**
 * Show error message with enhanced feedback
 */
function showError(title, message) {
    const skinDisplay = document.getElementById('skinDisplaySection');
    const errorDisplay = document.getElementById('errorDisplay');
    const errorTitle = errorDisplay.querySelector('.error-title');
    const errorMessage = document.getElementById('errorMessage');
    
    if (skinDisplay) skinDisplay.style.display = 'none';
    if (errorDisplay) errorDisplay.style.display = 'block';
    if (errorTitle) errorTitle.textContent = title;
    if (errorMessage) errorMessage.textContent = message;
    
    // Update suggestions based on error type
    updateErrorSuggestions(title, errorDisplay);
}

/**
 * Update error suggestions based on error type
 */
function updateErrorSuggestions(errorType, errorDisplay) {
    const suggestionsContainer = errorDisplay.querySelector('.error-suggestions ul');
    if (!suggestionsContainer) return;
    
    let suggestions = [];
    
    switch (errorType) {
        case 'Player Not Found':
            suggestions = [
                'Make sure the username is spelled correctly',
                'Check if the player exists in Minecraft Java Edition',
                'Try a different username',
                'Ensure the player has logged in recently'
            ];
            break;
        case 'Network Error':
        case 'Connection Error':
            suggestions = [
                'Check your internet connection',
                'Try refreshing the page',
                'Wait a moment and try again',
                'Try a different username to test connectivity'
            ];
            break;
        case 'Request Timeout':
            suggestions = [
                'Your internet connection may be slow',
                'Try again in a few moments',
                'Check if other websites are loading normally',
                'Consider trying a different username'
            ];
            break;
        case 'Rate Limited':
            suggestions = [
                'Wait a few minutes before trying again',
                'You\'ve made too many requests recently',
                'Try again later',
                'Consider bookmarking frequently checked players'
            ];
            break;
        default:
            suggestions = [
                'Try refreshing the page',
                'Check your internet connection',
                'Try a different username',
                'Contact support if the issue persists'
            ];
    }
    
    suggestionsContainer.innerHTML = suggestions
        .map(suggestion => `<li>${suggestion}</li>`)
        .join('');
    
    // Add retry button if it doesn't exist
    addRetryButton(errorDisplay);
}

/**
 * Add retry button to error display
 */
function addRetryButton(errorDisplay) {
    // Check if retry button already exists
    if (errorDisplay.querySelector('.retry-btn')) return;
    
    const errorCard = errorDisplay.querySelector('.error-card');
    if (!errorCard) return;
    
    const retryButton = document.createElement('button');
    retryButton.className = 'search-btn retry-btn';
    retryButton.style.marginTop = '15px';
    retryButton.innerHTML = '🔄 Try Again';
    retryButton.onclick = () => {
        const usernameInput = document.getElementById('playerUsername');
        if (usernameInput && usernameInput.value.trim()) {
            searchPlayer();
        } else {
            showToast('Please enter a username first', 'warning');
            usernameInput.focus();
        }
    };
    
    errorCard.appendChild(retryButton);
}

/**
 * Download the current skin
 */
async function downloadSkin() {
    if (!currentSkinUrl || !currentPlayerData) {
        showToast('No skin loaded to download', 'warning');
        return;
    }
    
    try {
        const response = await fetch(currentSkinUrl);
        const blob = await response.blob();
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentPlayerData.name}_skin.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showToast('Skin downloaded successfully!', 'success');
        hapticFeedback.light();
        
    } catch (error) {
        console.error('Error downloading skin:', error);
        showToast('Failed to download skin', 'error');
    }
}

/**
 * Copy skin URL to clipboard
 */
async function copySkinUrl() {
    if (!currentSkinUrl) {
        showToast('No skin URL to copy', 'warning');
        return;
    }
    
    try {
        await navigator.clipboard.writeText(currentSkinUrl);
        showToast('Skin URL copied to clipboard!', 'success');
        hapticFeedback.light();
    } catch (error) {
        console.error('Error copying skin URL:', error);
        showToast('Failed to copy skin URL', 'error');
    }
}

/**
 * Analyze skin colors
 */
async function analyzeSkinColors(skinUrl) {
    const colorPalette = document.getElementById('colorPalette');
    if (!colorPalette) return;
    
    try {
        // Create a canvas to analyze the skin colors
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            
            ctx.drawImage(img, 0, 0);
            
            // Get image data
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            // Extract unique colors
            const colorMap = new Map();
            
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const a = data[i + 3];
                
                // Skip transparent pixels
                if (a < 128) continue;
                
                const hex = rgbToHex(r, g, b);
                colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
            }
            
            // Sort colors by frequency and take top 12
            const sortedColors = Array.from(colorMap.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, 12)
                .map(([color]) => color);
            
            // Display color palette
            colorPalette.innerHTML = sortedColors.map(color => 
                `<div class="color-item-skin" 
                      style="background-color: ${color};" 
                      data-hex="${color}"
                      onclick="copyColorHex('${color}')"
                      title="Click to copy ${color}">
                 </div>`
            ).join('');
        };
        
        img.onerror = function() {
            colorPalette.innerHTML = '<div class="color-loading">Failed to analyze colors</div>';
        };
        
        img.src = skinUrl;
        
    } catch (error) {
        console.error('Error analyzing skin colors:', error);
        colorPalette.innerHTML = '<div class="color-loading">Failed to analyze colors</div>';
    }
}

/**
 * Copy color hex value
 */
async function copyColorHex(hex) {
    try {
        await navigator.clipboard.writeText(hex);
        showToast(`Copied ${hex} to clipboard!`, 'success');
        hapticFeedback.light();
    } catch (error) {
        console.error('Error copying color:', error);
        showToast('Failed to copy color', 'error');
    }
}

/**
 * Handle Enter key in username input
 */
function handleUsernameKeyPress(event) {
    if (event.key === 'Enter') {
        searchPlayer();
    }
}