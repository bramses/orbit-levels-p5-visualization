# Visualize your Orbit levels

A visual and intuitive way to display your data from [Orbit](https://orbit.love/), a tool for managing and growing communities. Check out the [Orbit Model](https://github.com/orbit-love/orbit-model) repository on GitHub to learn more about the orbit levels and how they can help you visualize and measure your community.

Live Demo: https://orbit-visualization-demo.netlify.app/

# Local Installation

1. Download or clone this folder into your local directory
2. Check if you have Python installed by running `python --version`
3. If you see Python 2.x:
   1. Run `python -m SimpleHTTPServer 8000`
4. If you see Python 3.x:
   1. Run `python3 -m http.server 8000`
5. Navigate to http://localhost:8000 in your browser

# Getting Started

When you run the code, you'll see a GUI in the top left corner of the visual. In the GUI you can modify the color palette, the speed and scale of the planets, and the member counts in each orbit level.

If you prefer to hardcode settings you can edit them in `script.js`.

Try modifying:
- COLOR_PALETTES
- MAX_PARTICLES_DRAWN
- PlanetSpeed() constructor
- PlanetScale() constructor
