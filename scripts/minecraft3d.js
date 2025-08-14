/**
 * Enhanced Minecraft 3D Skin Viewer
 * This file contains the complete 3D viewer implementation using Three.js
 */

class Minecraft3DViewer {
    constructor(canvasId) {
        this.canvasId = canvasId;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.playerModel = null;
        this.animationId = null;
        this.isAnimating = false;
        this.isWireframe = false;
        
        this.init();
    }
    
    init() {
        const canvas = document.getElementById(this.canvasId);
        if (!canvas) {
            console.error('Canvas not found:', this.canvasId);
            return;
        }
        
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75, 
            canvas.clientWidth / canvas.clientHeight, 
            0.1, 
            1000
        );
        this.camera.position.set(0, 0, 3);
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas, 
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Lighting
        this.setupLighting();
        
        // Controls
        this.setupControls();
        
        // Event listeners
        this.setupEventListeners();
        
        // Start render loop
        this.animate();
        
        console.log('Minecraft 3D Viewer initialized successfully');
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        this.scene.add(directionalLight);
        
        // Fill light
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-5, -5, -5);
        this.scene.add(fillLight);
    }
    
    setupControls() {
        // Basic mouse controls without external dependencies
        const canvas = this.renderer.domElement;
        let isMouseDown = false;
        let mouseX = 0;
        let mouseY = 0;
        let targetRotationX = 0;
        let targetRotationY = 0;
        let currentRotationX = 0;
        let currentRotationY = 0;
        
        canvas.addEventListener('mousedown', (event) => {
            isMouseDown = true;
            mouseX = event.clientX;
            mouseY = event.clientY;
            canvas.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mouseup', () => {
            isMouseDown = false;
            canvas.style.cursor = 'grab';
        });
        
        document.addEventListener('mousemove', (event) => {
            if (!isMouseDown) return;
            
            const deltaX = event.clientX - mouseX;
            const deltaY = event.clientY - mouseY;
            
            targetRotationY += deltaX * 0.01;
            targetRotationX += deltaY * 0.01;
            
            // Limit vertical rotation
            targetRotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRotationX));
            
            mouseX = event.clientX;
            mouseY = event.clientY;
        });
        
        // Zoom with mouse wheel
        canvas.addEventListener('wheel', (event) => {
            event.preventDefault();
            const zoomSpeed = 0.1;
            const zoomDelta = event.deltaY > 0 ? zoomSpeed : -zoomSpeed;
            
            this.camera.position.z = Math.max(1, Math.min(10, this.camera.position.z + zoomDelta));
        });
        
        // Smooth rotation animation
        const updateRotation = () => {
            if (this.playerModel) {
                currentRotationX += (targetRotationX - currentRotationX) * 0.1;
                currentRotationY += (targetRotationY - currentRotationY) * 0.1;
                
                this.playerModel.rotation.x = currentRotationX;
                this.playerModel.rotation.y = currentRotationY;
            }
            requestAnimationFrame(updateRotation);
        };
        updateRotation();
        
        canvas.style.cursor = 'grab';
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    createMinecraftModel(skinTexture) {
        // Remove existing model
        if (this.playerModel) {
            this.scene.remove(this.playerModel);
            this.disposeModel(this.playerModel);
        }
        
        this.playerModel = new THREE.Group();
        
        // Minecraft player proportions (scaled)
        const scale = 0.08;
        
        // Create material
        const material = new THREE.MeshLambertMaterial({ 
            map: skinTexture,
            transparent: false
        });
        
        // Head (8x8x8)
        const headGeometry = new THREE.BoxGeometry(8 * scale, 8 * scale, 8 * scale);
        const head = new THREE.Mesh(headGeometry, material);
        head.position.set(0, 1.4 * scale, 0);
        head.castShadow = true;
        head.receiveShadow = true;
        this.playerModel.add(head);
        
        // Body (8x12x4)
        const bodyGeometry = new THREE.BoxGeometry(8 * scale, 12 * scale, 4 * scale);
        const body = new THREE.Mesh(bodyGeometry, material);
        body.position.set(0, 0, 0);
        body.castShadow = true;
        body.receiveShadow = true;
        this.playerModel.add(body);
        
        // Arms
        const armGeometry = new THREE.BoxGeometry(4 * scale, 12 * scale, 4 * scale);
        
        const rightArm = new THREE.Mesh(armGeometry, material);
        rightArm.position.set(-6 * scale, 0, 0);
        rightArm.castShadow = true;
        rightArm.receiveShadow = true;
        this.playerModel.add(rightArm);
        
        const leftArm = new THREE.Mesh(armGeometry, material);
        leftArm.position.set(6 * scale, 0, 0);
        leftArm.castShadow = true;
        leftArm.receiveShadow = true;
        this.playerModel.add(leftArm);
        
        // Legs
        const legGeometry = new THREE.BoxGeometry(4 * scale, 12 * scale, 4 * scale);
        
        const rightLeg = new THREE.Mesh(legGeometry, material);
        rightLeg.position.set(-2 * scale, -1.2 * scale, 0);
        rightLeg.castShadow = true;
        rightLeg.receiveShadow = true;
        this.playerModel.add(rightLeg);
        
        const leftLeg = new THREE.Mesh(legGeometry, material);
        leftLeg.position.set(2 * scale, -1.2 * scale, 0);
        leftLeg.castShadow = true;
        leftLeg.receiveShadow = true;
        this.playerModel.add(leftLeg);
        
        // Add to scene
        this.scene.add(this.playerModel);
        
        // Center the model
        const box = new THREE.Box3().setFromObject(this.playerModel);
        const center = box.getCenter(new THREE.Vector3());
        this.playerModel.position.sub(center);
        
        return this.playerModel;
    }
    
    createDefaultModel() {
        // Remove existing model
        if (this.playerModel) {
            this.scene.remove(this.playerModel);
            this.disposeModel(this.playerModel);
        }
        
        this.playerModel = new THREE.Group();
        const scale = 0.08;
        
        // Default colors
        const skinColor = new THREE.MeshLambertMaterial({ color: 0xfdbcb4 });
        const shirtColor = new THREE.MeshLambertMaterial({ color: 0x0066cc });
        const pantsColor = new THREE.MeshLambertMaterial({ color: 0x003366 });
        
        // Head
        const headGeometry = new THREE.BoxGeometry(8 * scale, 8 * scale, 8 * scale);
        const head = new THREE.Mesh(headGeometry, skinColor);
        head.position.set(0, 1.4 * scale, 0);
        this.playerModel.add(head);
        
        // Body
        const bodyGeometry = new THREE.BoxGeometry(8 * scale, 12 * scale, 4 * scale);
        const body = new THREE.Mesh(bodyGeometry, shirtColor);
        body.position.set(0, 0, 0);
        this.playerModel.add(body);
        
        // Arms
        const armGeometry = new THREE.BoxGeometry(4 * scale, 12 * scale, 4 * scale);
        const rightArm = new THREE.Mesh(armGeometry, skinColor);
        rightArm.position.set(-6 * scale, 0, 0);
        this.playerModel.add(rightArm);
        
        const leftArm = new THREE.Mesh(armGeometry, skinColor);
        leftArm.position.set(6 * scale, 0, 0);
        this.playerModel.add(leftArm);
        
        // Legs
        const legGeometry = new THREE.BoxGeometry(4 * scale, 12 * scale, 4 * scale);
        const rightLeg = new THREE.Mesh(legGeometry, pantsColor);
        rightLeg.position.set(-2 * scale, -1.2 * scale, 0);
        this.playerModel.add(rightLeg);
        
        const leftLeg = new THREE.Mesh(legGeometry, pantsColor);
        leftLeg.position.set(2 * scale, -1.2 * scale, 0);
        this.playerModel.add(leftLeg);
        
        this.scene.add(this.playerModel);
        
        // Center the model
        const box = new THREE.Box3().setFromObject(this.playerModel);
        const center = box.getCenter(new THREE.Vector3());
        this.playerModel.position.sub(center);
    }
    
    loadSkin(skinUrl) {
        const loadingElement = document.getElementById('modelLoading');
        if (loadingElement) {
            loadingElement.style.display = 'block';
        }
        
        const textureLoader = new THREE.TextureLoader();
        textureLoader.crossOrigin = 'anonymous';
        
        return new Promise((resolve, reject) => {
            textureLoader.load(
                skinUrl,
                (texture) => {
                    // Configure texture for pixelated look
                    texture.magFilter = THREE.NearestFilter;
                    texture.minFilter = THREE.NearestFilter;
                    texture.flipY = false;
                    
                    // Create the model
                    this.createMinecraftModel(texture);
                    
                    // Hide loading
                    if (loadingElement) {
                        loadingElement.style.display = 'none';
                    }
                    
                    resolve(texture);
                },
                (progress) => {
                    console.log('Loading progress:', progress);
                },
                (error) => {
                    console.error('Error loading skin texture:', error);
                    
                    // Hide loading
                    if (loadingElement) {
                        loadingElement.style.display = 'none';
                    }
                    
                    // Create default model
                    this.createDefaultModel();
                    reject(error);
                }
            );
        });
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        // Auto-rotation if enabled
        if (this.isAnimating && this.playerModel) {
            this.playerModel.rotation.y += 0.01;
        }
        
        // Render
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    onWindowResize() {
        const canvas = document.getElementById(this.canvasId);
        if (!canvas || !this.camera || !this.renderer) return;
        
        this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    }
    
    resetView() {
        if (!this.camera) return;
        
        this.camera.position.set(0, 0, 3);
        this.camera.lookAt(0, 0, 0);
        
        if (this.playerModel) {
            this.playerModel.rotation.set(0, 0, 0);
        }
        
        this.isAnimating = false;
    }
    
    toggleAnimation() {
        this.isAnimating = !this.isAnimating;
        return this.isAnimating;
    }
    
    toggleWireframe() {
        if (!this.playerModel) return false;
        
        this.isWireframe = !this.isWireframe;
        
        this.playerModel.traverse((child) => {
            if (child.isMesh && child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(mat => mat.wireframe = this.isWireframe);
                } else {
                    child.material.wireframe = this.isWireframe;
                }
            }
        });
        
        return this.isWireframe;
    }
    
    disposeModel(model) {
        if (!model) return;
        
        model.traverse((child) => {
            if (child.geometry) {
                child.geometry.dispose();
            }
            
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(material => {
                        if (material.map) material.map.dispose();
                        material.dispose();
                    });
                } else {
                    if (child.material.map) child.material.map.dispose();
                    child.material.dispose();
                }
            }
        });
    }
    
    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.playerModel) {
            this.scene.remove(this.playerModel);
            this.disposeModel(this.playerModel);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        // Remove all objects from scene
        if (this.scene) {
            while (this.scene.children.length > 0) {
                const child = this.scene.children[0];
                this.scene.remove(child);
                if (child.dispose) child.dispose();
            }
        }
    }
}

// Global viewer instance
let minecraftViewer = null;

// Initialize the viewer when Three.js is ready
function initMinecraft3DViewer() {
    if (typeof THREE === 'undefined') {
        console.error('Three.js not loaded');
        return false;
    }
    
    try {
        minecraftViewer = new Minecraft3DViewer('minecraftModel3D');
        return true;
    } catch (error) {
        console.error('Failed to initialize Minecraft 3D Viewer:', error);
        return false;
    }
}

// Public functions for the main script
function generate3DModel(skinUrl, skinType) {
    if (!minecraftViewer) {
        if (!initMinecraft3DViewer()) {
            console.error('Failed to initialize 3D viewer');
            return;
        }
    }
    
    minecraftViewer.loadSkin(skinUrl)
        .then(() => {
            if (typeof showToast === 'function') {
                showToast('3D model loaded successfully!', 'success');
            }
        })
        .catch((error) => {
            console.error('Failed to load skin:', error);
            if (typeof showToast === 'function') {
                showToast('Using default model - skin texture failed to load', 'warning');
            }
        });
}

function resetModelView() {
    if (minecraftViewer) {
        minecraftViewer.resetView();
        if (typeof showToast === 'function') {
            showToast('View reset', 'success');
        }
    }
}

function cleanup3DViewer() {
    if (minecraftViewer) {
        minecraftViewer.dispose();
        minecraftViewer = null;
    }
}

// Legacy function support
function rotateModel(direction) {
    if (minecraftViewer && minecraftViewer.playerModel) {
        const rotationAmount = direction === 'left' ? -Math.PI / 4 : Math.PI / 4;
        minecraftViewer.playerModel.rotation.y += rotationAmount;
        if (typeof showToast === 'function') {
            showToast(`Rotated model ${direction}`, 'success');
        }
    }
}

function resetModel() {
    resetModelView();
}
