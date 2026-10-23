# Virtual Sky

A browser-based Three.js deep-space experience with a cinematic star field and multiple glowing nebulae inspired by astronomical imagery.

## Overview

This project renders a dark space scene with:
- animated star fields
- several luminous nebula formations
- smooth camera orbit motion
- scroll-to-zoom interaction
- fullscreen immersive presentation

The current version follows a space-observatory aesthetic while emphasizing nebula visuals similar to the reference concept.

## Features

- Procedural nebula generation using Three.js points
- Multiple nebula styles: emission, reflection, ring, remnant, and dark nebula
- Slow cinematic fly-through camera motion
- Mouse wheel zoom controls
- Responsive full-window rendering
- Lightweight setup using a CDN-hosted Three.js module

## Running the Project

1. Clone the repository:
   ```bash
   git clone https://github.com/ehsanidev/virtual-sky.git
   cd virtual-sky
   ```

2. Open `index.html` directly in a browser, or serve the project locally:
   ```bash
   python3 -m http.server 8000
   ```

3. Visit:
   ```bash
   http://localhost:8000
   ```

## Project Structure

- `index.html` — main HTML entry point
- `css/style.css` — fullscreen styling and UI layer
- `js/scripts.js` — Three.js scene, camera, nebula generation, animation, and zoom behavior

## Controls

- Scroll: zoom in and out
- Click: adds a brief sparkle effect in the scene

## Notes

This project is intentionally lightweight and does not require a build step. It uses the Three.js module directly from jsDelivr.

## License

This project is available under the MIT license.
