<div align="center">
  <h1>Buy Me A Coffee ☕</h1>
  <p>A visually-rich, fully-responsive, and interactive personal support page built with pure HTML, CSS, and JavaScript. Features a dynamic glassmorphic design and a sophisticated particle animation system.</p>
  
  <p>
    <img src="https://img.shields.io/badge/Project%20Status-Complete-green?style=for-the-badge" alt="Project Status: Complete">
    <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License: MIT">
    <img src="https://img.shields.io/badge/Maintained-Yes-green?style=for-the-badge" alt="Maintained: Yes">
  </p>
</div>

---

## 🚀 Live Demonstration

Experience the live, deployed version of the project. Interact with the animations, modals, and responsive design firsthand.

> ### [https://mr-muhammad-kashan.github.io/Buy-Me-A-Coffee-Website/](https://mr-muhammad-kashan.github.io/Buy-Me-A-Coffee-Website/)

<div align="center">
    <a href="https://mr-muhammad-kashan.github.io/Buy-Me-A-Coffee-Website/">
        <img src="https://raw.githubusercontent.com/mr-muhammad-kashan/Buy-Me-A-Coffee-Website/main/Assets/GIFs/1.gif" alt="Live Project Demo GIF" width="80%">
    </a>
</div>

---

## ✨ Key Features

This project is more than a static page; it's a showcase of modern frontend techniques.

-   **Interactive Particle Canvas:** A JavaScript-powered background of particles that dynamically react to mouse movement, covering the full scrollable height of the document.
-   **Premium Glassmorphic UI:** Extensive use of the `backdrop-filter` property to create a stunning "frosted glass" effect on all primary containers and modals.
-   **Fully Responsive Design:** The entire layout, from the main cards to the payment modals and even the site logo, is fluid and adapts perfectly to all screen sizes using modern CSS like `clamp()`.
-   **Multi-Option Payment Modals:** Separate, elegantly designed modals for both local (Pakistani) and global supporters, providing clear payment details.
-   **One-Click Clipboard Functionality:** "Copy" buttons next to every piece of payment information utilize the browser's Clipboard API for a seamless user experience.
-   **Dynamic Hover & Focus Effects:** Engaging micro-interactions on all interactive elements, including social links, payment cards, and buttons, to provide satisfying visual feedback.

---

## 🛠️ Technology Stack & Architectural Highlights

The project was built from the ground up using only core web technologies, with a focus on high-performance, object-oriented code and modern styling principles.

### Core Technologies
-   **HTML5:** Semantic markup for a well-structured and accessible content foundation.
-   **CSS3:** Advanced styling techniques including `clamp()` for fluid typography/sizing, `Flexbox`, `Grid`, custom properties, and pseudo-elements for intricate designs.
-   **JavaScript (ES6+):** Object-oriented programming (OOP) principles with classes (`CanvasManager`, `GridParticle`) to manage the complex animation engine and UI interactivity in a clean, modular, and performant way.

### Architectural Highlights
-   **Re-engineered Canvas Manager:** The background canvas is specifically engineered to use `document.body.scrollHeight` instead of `window.innerHeight`, solving the common problem of animated backgrounds not covering the entire page on scroll.
-   **Scroll-Aware Event Manager:** Mouse coordinates are calculated using `event.clientX + window.scrollX`, ensuring particle interactions are perfectly mapped regardless of the user's scroll position.
-   **Self-Contained Modules:** The JavaScript is organized into distinct, independent systems for the canvas, modals, and clipboard, which are initialized and linked at runtime for maximum code clarity and maintainability.

---

## 📂 Project Structure

The repository is organized logically, separating assets, styles, and scripts for clarity.
