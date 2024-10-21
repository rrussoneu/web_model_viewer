# simple-model-viewer

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![npm version](https://img.shields.io/npm/v/simple-model-viewer.svg)

A **simple** and **lightweight** 3D model viewer for quickly embedding interactive models into your websites. An easy method for showcasing portfolios, adding some flair to landing pages, or displaying product models without the hassle of extensive coding. [Example](https://example-modeler-portfolio-88f6a66485a4.herokuapp.com/)

## 📚 Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Installation](#installation)
   - [Using npm](#using-npm)
   - [Using CDN](#using-cdn)
4. [Quick Start](#quick-start)
   - [With npm and a Bundler](#with-npm-and-a-bundler)
   - [With CDN](#with-cdn)
5. [Examples](#Examples)
6. [License](#license)

---

## 🌟 Introduction

**simple-model-viewer** is designed for developers and creatives who want to effortlessly integrate 3D models into their websites. Whether you're building a portfolio to showcase your modeling work or enhancing your site's aesthetics with engaging and fun visuals, this library provides a straightforward solution without the complexity.

---

## 🚀 Features

- **Ease of Use:** Minimal setup and configuration required.
- **Lightweight:** Optimized for quick loading without compromising performance.
- **Interactive Controls:** Rotate/ zoom your models using mouse controls.
- **GUI Integration:** Optional graphical user interface.
- **Multiple Model Support:** Display one or multiple models.

---

## Installation

You can integrate **simple-model-viewer** into your project using **npm** for module bundler environments or via a **CDN** for direct inclusion in HTML files.

### Using npm

This method is ideal if you're using bundlers like **Webpack**, **Vite**, or **Parcel** in your project.

1. **Initialize Your Project**

   If you haven't already set up a project, start by creating a new directory and initializing it with npm:

   ```bash
   mkdir my-3d-project
   cd my-3d-project
   npm init -y
   ```

2. **Install Dependencies**

   ```
   npm install three lil-gui simple-model-viewer
   ```

### 🌐 Using CDN

This method is perfect for quick setups or integrating into static websites without a build process.

#### Include the Necessary Scripts

Add the following `<script>` tags to your HTML file:

```html
<!-- Include Three.js via CDN -->
<script src="https://unpkg.com/three@0.153.0/build/three.min.js"></script>

<!-- Include lil-gui via CDN -->
<script src="https://unpkg.com/lil-gui@0.17.0/dist/lil-gui.min.js"></script>

<!-- Include simple-model-viewer UMD build via CDN -->
<script src="https://unpkg.com/simple-model-viewer@1.0.1/dist/browser/model-viewer.browser.umd.js"></script>
```

_Note:_ Ensure that these scripts are included in the order shown to handle dependencies correctly.

🔧 **Quick Start**

Choose the method that best fits your project setup.

### With npm and a Bundler

#### Project Structure

```
my-3d-project/
├── models/
│   ├── model1.glb
│   └── model2.glb
├── index.html
├── package.json
└── vite.config.js (if using Vite)
```

#### Create `index.html`

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Model Viewer Example</title>
    <style>
      #my-model-viewer {
        width: 600px;
        height: 600px;
      }
    </style>
  </head>
  <body>
    <div id="my-model-viewer"></div>

    <script type="module">
      import ModelViewer from "simple-model-viewer";

      const viewer = new ModelViewer({
        containerId: "my-model-viewer",
        modelsDirectory: "/models/",
        models: ["sheep.glb", "chalice.glb", "ore.glb"],
      });
    </script>
  </body>
</html>
```

#### Configure Your Bundler (Optional)

If you're using Vite, create a `vite.config.js`:

```javascript
// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    open: true,
  },
  build: {
    outDir: "dist",
  },
});
```

#### Run Your Project

##### Using Vite:

```bash
npm install vite --save-dev
npx vite
```

##### Using a Bundler of Your Choice:

Follow the specific instructions for your bundler to serve or build your project.

#### View in Browser

Navigate to `http://localhost:3000` (or the port your bundler specifies) to see the `simple-model-viewer` in action.

### With CDN

#### Create Your HTML File

```html
<!-- cdn-example.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Simple Model Viewer CDN Example</title>
    <style>
      body {
        margin: 0;
        overflow: hidden;
      }
      #my-model-viewer {
        width: 100vw;
        height: 100vh;
      }
    </style>
  </head>
  <body>
    <div id="my-model-viewer"></div>

    <!-- Include Three.js via CDN -->
    <script src="https://unpkg.com/three@0.153.0/build/three.min.js"></script>

    <!-- Include lil-gui via CDN -->
    <script src="https://unpkg.com/lil-gui@0.17.0/dist/lil-gui.min.js"></script>

    <!-- Include simple-model-viewer UMD build via CDN -->
    <script src="https://unpkg.com/simple-model-viewer@1.0.1/dist/browser/model-viewer.browser.umd.js"></script>

    <script>
      // Initialize the ModelViewer
      const viewer = new ModelViewer({
        containerId: "my-model-viewer",
        modelsDirectory: "/models/",
        models: ["model1.glb", "model2.glb"],
        showGui: true,
      });
    </script>
  </body>
</html>
```

#### Serve Your Models

Ensure that the `/models/` directory is accessible from your server and contains the `.glb` or `.gltf` files you want to display.

#### Open in Browser

Serve your HTML file using a simple HTTP server to bypass CORS restrictions (many browsers block local file imports).

##### Using `http-server`:

```bash
npm install -g http-server
http-server .
```

##### Using Python's SimpleHTTPServer:

```bash
# For Python 3.x
python -m http.server
```

Navigate to `http://localhost:8080/cdn-example.html` (or the port specified by your server) to view the example.

🛠️ **Configuration Options**

When initializing the `ModelViewer`, you can customize its behavior using various options:

- **containerId** (`string`, required): The ID of the HTML element where the viewer will be rendered.
- **modelsDirectory** (`string`, required): The relative path to the directory containing your model files.
- **models** (`array of strings`, required): An array of model filenames (e.g., `['model1.glb', 'model2.glb']`).
- **showGui** (`boolean`, optional): Whether to display the GUI for tweaking settings. Default is `true`.
- **backgroundColor** (`number` or `string`, optional): The background color of the scene. Default is `0xffffff` (white).
- **enableControls** (`boolean`, optional): Enable or disable user controls (orbiting, zooming). Default is `true`.
- **lighting** (`object`, optional): Customize lighting settings.
  - **ambientIntensity** (`number`, optional): Intensity of ambient light. Default is `0.5`.
- **onModelLoad** (`function`, optional): Callback function triggered when a model is successfully loaded.

**Example:**

```javascript
const viewer = new ModelViewer({
  containerId: "my-model-viewer",
  modelsDirectory: "./models/",
  models: ["model1.glb", "model2.glb"],
  showGui: true,
  backgroundColor: 0x000000, // Black background
  enableControls: true,
  lighting: {
    ambientIntensity: 0.7,
  },
  onModelLoad: (gltf) => {
    console.log("Model loaded:", gltf);
  },
});
```

### Examples

Two example set ups are provided in the `examples` directory. You can see live examples for a portfolio [here](https://example-modeler-portfolio-88f6a66485a4.herokuapp.com/) and for a landing page [here](https://example-modeler-ab455159928b.herokuapp.com/)

### License

This project is licensed under the MIT License.
