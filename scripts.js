/**************************************************************************************************/
/* */
/* SYSTEM ARCHITECTURAL BLUEPRINT V2.2                                                           */
/* */
/**************************************************************************************************/
/* */
/* +------------------------------------------------------------------------------------+      */
/* |                                  DOM CONTENT LOADED                                  |      */
/* |                                (Primary Execution Trigger)                            |      */
/* +------------------------------------------------------------------------------------+      */
/* |                         |                                      |                         */
/* v                         v                                      v                         */
/* +------------------+    +------------------------------------+   +---------------------------+   */
/* |   MODAL SYSTEM   |    |         ANIMATION ENGINE (Main)      |   |    CLIPBOARD SYSTEM     |   */
/* | (Manages Popups) |    |   (Orchestrates Canvas Animation)    |   | (Manages "Copy" Buttons)  |   */
/* +------------------+    +------------------------------------+   +---------------------------+   */
/* |   ^                  |             ^                        |   (Unchanged)           */
/* |   | Passes resize command to Canvas Manager                  |                             */
/* |                     |                                    |                             */
/* v                     v                                    v                             */
/* +-----------------------------------------------------------------+               */
/* |                          EVENT MANAGER & STATE                    |               */
/* | (MODIFIED: `mousemove` now includes scroll offsets)             |               */
/* +-----------------------------------------------------------------+               */
/* |                                                               */
/* v                                                               */
/* +--------------------------+                                      */
/* |      CANVAS MANAGER      |                                      */
/* | (MODIFIED: Resizes to document scrollHeight)                   |                                      */
/* +--------------------------+                                      */
/* */
/* DESCRIPTION V2.2:                                                                          */
/* The system architecture has been decisively upgraded for robustness.                       */
/* 1. CANVAS MANAGER: Re-engineered to manage a canvas sized to the document's full           */
/* `scrollHeight`, not the viewport's `innerHeight`. This solves the full-page background issue.*/
/* 2. EVENT MANAGER: Mouse coordinate tracking now incorporates `scrollX` and `scrollY`         */
/* offsets, ensuring particle interactions are accurate regardless of scroll position.      */
/* 3. MODAL SYSTEM: Now actively commands the Canvas Manager to resize when modals are         */
/* opened or closed, ensuring the canvas dimensions are always in perfect sync with the     */
/* document's state.                                                                      */
/* */
/**************************************************************************************************/


// Strict mode enforces cleaner JavaScript, preventing common errors and ensuring more secure code.
"use strict";

// ==================================================================================
// |                   CORE ANIMATION ENGINE (RE-ENGINEERED)                      |
// ==================================================================================

// Encapsulates all logic related to the main canvas element.
class CanvasManager {
    // The constructor is called when a new instance of CanvasManager is created.
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId); // Retrieves the canvas DOM element by its unique ID.
        this.ctx = this.canvas.getContext('2d'); // Gets the 2D rendering context.
        this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 }; // Stores mouse coordinates.
        this.setCanvasDimensions(); // Sets the initial dimensions of the canvas.
        this.bindEventListeners(); // Binds event listeners.
    }

    // Sets the canvas width and height.
    setCanvasDimensions() {
        this.canvas.width = window.innerWidth; // The width should always match the viewport width.
        // MODIFICATION: The canvas height is now set to the full scrollable height of the body.
        // This is the core fix for making the background cover the entire page.
        this.canvas.height = document.body.scrollHeight;
    }

    // Attaches the necessary event listeners to the window.
    bindEventListeners() {
        window.addEventListener('resize', this.onResize.bind(this)); // Handles window resizing.
        window.addEventListener('mousemove', this.onMouseMove.bind(this)); // Handles mouse movement.
    }

    // Handles the window resize event.
    onResize() {
        // Updates the canvas dimensions to match the new window size and document height.
        this.setCanvasDimensions();
    }

    // Handles the mouse move event.
    onMouseMove(event) {
        // MODIFICATION: Mouse coordinates are now calculated relative to the document, not the viewport.
        // This ensures interactions are correct even when the page is scrolled.
        this.mouse.x = event.clientX + window.scrollX;
        this.mouse.y = event.clientY + window.scrollY;
    }

    // Clears the entire canvas for the next frame's drawing.
    clear() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'; // Semi-transparent white for a motion blur effect.
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height); // Fill the entire canvas.
    }
}

// Defines a single particle for the interactive background grid.
class GridParticle {
    // The constructor for a grid particle.
    constructor(x, y, ctx) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.originX = x;
        this.originY = y;
        this.size = 2;
        this.color = '#FFD700';
        this.distance = 0;
        this.force = 0;
        this.angle = 0;
        this.dx = 0;
        this.dy = 0;
        this.ease = 0.05;
    }

    // Updates the particle's state based on mouse position.
    update(mouse) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);
        const interactionRadius = 150;
        this.force = Math.max(0, interactionRadius - this.distance);
        this.angle = Math.atan2(dy, dx);
        this.dx = Math.cos(this.angle) * this.force;
        this.dy = Math.sin(this.angle) * this.force;
        this.x += (this.originX + this.dx - this.x) * this.ease;
        this.y += (this.originY + this.dy - this.y) * this.ease;
    }

    // Draws the particle on the canvas.
    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}

// Manages the collection of particles that form the interactive background grid.
class BackgroundSystem {
    // Constructor for the background system.
    constructor(canvasManager) {
        this.canvasManager = canvasManager;
        this.ctx = this.canvasManager.ctx;
        this.mouse = this.canvasManager.mouse;
        this.particles = [];
        this.gap = 35;
        this.init();
        // The resize event on the CanvasManager will now correctly trigger re-initialization.
        window.addEventListener('resize', () => {
            this.init();
        });
    }

    // Initializes or re-initializes the grid of particles.
    init() {
        this.particles = [];
        const width = this.canvasManager.canvas.width;
        const height = this.canvasManager.canvas.height; // Now correctly uses the full document height.
        for (let x = 0; x < width; x += this.gap) {
            for (let y = 0; y < height; y += this.gap) {
                this.particles.push(new GridParticle(x, y, this.ctx));
            }
        }
    }

    // Updates and draws all particles and the connecting lines.
    render() {
        this.particles.forEach(particle => {
            particle.update(this.mouse);
            particle.draw();
        });

        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const connectionRadius = this.gap * 1.5;

                if (distance < connectionRadius) {
                    this.ctx.beginPath();
                    this.ctx.lineWidth = 0.5;
                    this.ctx.strokeStyle = `rgba(255, 215, 0, ${1 - distance / connectionRadius})`;
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                    this.ctx.closePath();
                }
            }
        }
    }
}

// Defines a single particle for the mouse cursor trail effect.
class TrailParticle {
    // Constructor for a trail particle.
    constructor(x, y, ctx) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 1;
        this.vx = Math.random() * 2 - 1;
        this.vy = Math.random() * 2 - 1;
        this.life = 1;
        this.decay = 0.02;
    }

    // Updates the particle's state for the current frame.
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        if (this.size > 0.2) this.size -= 0.1;
    }

    // Draws the particle on the canvas.
    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 193, 7, ${this.life})`;
        this.ctx.fill();
    }
}

// Manages the collection of particles that form the cursor trail.
class ParticleTrailSystem {
    // Constructor for the trail system.
    constructor(canvasManager) {
        this.canvasManager = canvasManager;
        this.ctx = this.canvasManager.ctx;
        this.mouse = this.canvasManager.mouse;
        this.particles = [];
        this.frameCount = 0;
    }

    // Creates new particles at the cursor's position and updates/draws all existing ones.
    render() {
        this.frameCount++;
        if (this.frameCount % 2 === 0) {
            // Emits particles at the correct mouse position, including scroll offset.
            this.particles.push(new TrailParticle(this.mouse.x, this.mouse.y, this.ctx));
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.update();
            p.draw();
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
}

// The main execution class that orchestrates the entire animation system.
class Main {
    // The main class constructor.
    constructor() {
        this.canvasManager = new CanvasManager('interactive-background');
        this.backgroundSystem = new BackgroundSystem(this.canvasManager);
        this.particleTrailSystem = new ParticleTrailSystem(this.canvasManager);
        this.animate();
    }

    // The core animation loop, called on every frame.
    animate() {
        this.canvasManager.clear();
        this.backgroundSystem.render();
        this.particleTrailSystem.render();
        requestAnimationFrame(this.animate.bind(this));
    }
}

// ==================================================================================
// |                      UI INTERACTIVITY MODULES (MODIFIED)                     |
// ==================================================================================

/**
 * Initializes the modal system.
 * It now accepts the canvasManager instance to command canvas resizing on state changes.
 * @param {CanvasManager} canvasManager - The active instance of the CanvasManager.
 */
function initializeModalSystem(canvasManager) {
    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    const overlay = document.getElementById('modal-overlay');
    const closeButtons = document.querySelectorAll('.close-button');

    const openModal = (modal) => {
        if (modal) {
            modal.classList.add('active');
            overlay.classList.add('active');
            document.body.classList.add('modal-open');
            // MODIFICATION: Command the canvas to resize itself when a modal opens.
            // This ensures its height matches the new document state (e.g., scrollbar hidden).
            canvasManager.setCanvasDimensions();
        }
    };

    const closeModal = () => {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            activeModal.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('modal-open');
            // MODIFICATION: Command the canvas to resize itself when a modal closes.
            // This ensures its height matches the new document state (e.g., scrollbar reappears).
            canvasManager.setCanvasDimensions();
        }
    };

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modal = document.querySelector(trigger.dataset.modalTarget);
            openModal(modal);
        });
    });

    overlay.addEventListener('click', closeModal);
    closeButtons.forEach(button => button.addEventListener('click', closeModal));
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}


/**
 * Initializes the copy-to-clipboard functionality. (Unchanged from previous version)
 */
function initializeClipboard() {
    const copyButtons = document.querySelectorAll('.copy-btn');

    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetElement = document.querySelector(button.dataset.copyTarget);
            if (targetElement) {
                const textToCopy = targetElement.innerText;
                const originalHTML = button.innerHTML;

                navigator.clipboard.writeText(textToCopy).then(() => {
                    button.innerText = 'Copied!';
                    button.classList.add('copied');
                    setTimeout(() => {
                        button.innerHTML = originalHTML;
                        button.classList.remove('copied');
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                    button.innerText = 'Failed!';
                    setTimeout(() => {
                        button.innerHTML = originalHTML;
                    }, 2000);
                });
            }
        });
    });
}


// ==================================================================================
// |                         APPLICATION ENTRY POINT                              |
// ==================================================================================

window.addEventListener('DOMContentLoaded', () => {
    // Create an instance of the animation engine.
    const mainAnimation = new Main();
    // Pass the created canvasManager instance from the animation engine to the modal system.
    // This forges the critical link allowing the UI to command the background canvas.
    initializeModalSystem(mainAnimation.canvasManager);
    // Initialize the clipboard system.
    initializeClipboard();
});