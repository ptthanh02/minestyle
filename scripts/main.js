/* MineStyle - Main JavaScript */

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

// New gradient elements
const gradientText = document.getElementById('gradientText');
const gradientStartColor = document.getElementById('gradientStartColor');
const gradientEndColor = document.getElementById('gradientEndColor');
const gradientPreview = document.getElementById('gradientPreview');
const gradientCode = document.getElementById('gradientCode');

// Preset templates
const presetTemplates = {
    welcome: '§eWelcome to §bOur Server§e! §aEnjoy your stay!',
    error: '§c§l[ERROR]§r §cSomething went wrong! Please try again.',
    success: '§a§l[SUCCESS]§r §aAction completed successfully!',
    warning: '§6§l[WARNING]§r §6Please be careful with this action.',
    info: '§b§l[INFO]§r §bHere is some important information.',
    rainbow: '§cR§6a§ei§an§bb§9o§dw §cT§6e§ex§at'
};

/**
 * Navigation functions
 */
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => section.classList.remove('active'));

    // Remove active class from all nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));

    // Show selected section and mark nav link as active
    document.getElementById(sectionName).classList.add('active');
    event.target.classList.add('active');

    // Close mobile menu if open
    document.getElementById('navLinks').classList.remove('active');
}

function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

/**
 * Small caps conversion functions
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
    cssOutput.innerHTML = `<button class="copy-btn" onclick="copyText('cssOutput')">Copy</button>${text}`;
    
    // Unicode Small Caps
    const unicodeText = convertToUnicodeSmallCaps(text);
    unicodeOutput.innerHTML = `<button class="copy-btn" onclick="copyText('unicodeOutput')">Copy</button>${unicodeText}`;
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
    document.getElementById('gradientCode').innerHTML = 
        `<strong>Gradient Code:</strong><br>${gradientCode}<br><br>` +
        `<button class="copy-btn" style="position: static; opacity: 1; margin-top: 8px;" onclick="copyGradientCode()">Copy Gradient Code</button>`;
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
        
        minecraftText.value = rainbowCode;
    } else {
        minecraftText.value = template;
    }
    
    updateMinecraftPreview();
    minecraftText.focus();
}

/**
 * Minecraft color functions
 */
function insertCode(code) {
    const textarea = minecraftText;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    textarea.value = text.substring(0, start) + code + text.substring(end);
    textarea.focus();
    textarea.setSelectionRange(start + code.length, start + code.length);
    
    updateMinecraftPreview();
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
    
    // Update code output
    minecraftCode.innerHTML = `<button class="copy-btn" onclick="copyText('minecraftCode')">Copy</button>${text}`;
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

/**
 * Utility functions
 */
function copyText(outputId) {
    const element = document.getElementById(outputId);
    const button = element.querySelector('.copy-btn');
    
    // Get text content excluding the button
    let textContent;
    if (outputId === 'minecraftCode') {
        textContent = minecraftText.value;
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
    
    // Gradient event listeners
    if (gradientText) gradientText.addEventListener('input', generateGradient);
    if (gradientStartColor) gradientStartColor.addEventListener('change', generateGradient);
    if (gradientEndColor) gradientEndColor.addEventListener('change', generateGradient);
    
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
    });
});