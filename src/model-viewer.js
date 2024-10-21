import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'lil-gui';

export default class ModelViewer {
  constructor(options = {}) {
    // Default options
    this.options = {
      showGui: typeof options.showGui !== 'undefined' ? options.showGui : true,
      containerId: typeof options.containerId !== 'undefined' ? options.containerId : 'my-model-viewer',
      modelsDirectory: typeof options.modelsDirectory !== 'undefined' ? options.modelsDirectory : '/models/',
      models: Array.isArray(options.models) ? options.models : [],
      backgroundColor: typeof options.backgroundColor !== 'undefined' ? options.backgroundColor : 0xffffff,
      enableControls: options.enableControls !== false,
      lighting: typeof options.lighting !== 'undefined' ? options.lighting : {},
      onModelLoad: typeof options.onModelLoad !== 'undefined' ? options.onModelLoad : null,
      width: typeof options.width !== 'undefined' ? options.width : null, // New option
      height: typeof options.height !== 'undefined' ? options.height : null, // New option
    };

    // Get the container element
    this.container = document.getElementById(this.options.containerId);
    if (!this.container) {
      throw new Error(`Container with ID '${this.options.containerId}' not found.`);
    }
    this.container.style.position = 'relative'; // Need positioning context

    // Initialize properties
    this.modelsDirectory = this.options.modelsDirectory;
    this.models = this.options.models;
    this.clock = new THREE.Clock();
    this.showGui = this.options.showGui;
    this.width = this.options.width || this.container.clientWidth;
    this.height = this.options.height || this.container.clientHeight;

    this.init();
  }

  async init() {
    // Scene
    this.scene = new THREE.Scene();
    if (this.options.backgroundColor !== undefined) {
      this.scene.background = new THREE.Color(this.options.backgroundColor);
    }

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.width / this.height,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 5); // Initial position

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.physicallyCorrectLights = true;
    this.container.appendChild(this.renderer.domElement);

    // Lights
    this.addLights();

    // Controls
    if (this.options.enableControls) {
      this.addControls();
    }

    // GUI
    if (this.showGui) {
      this.initGUI();
    }

    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize(), false);

    // Load the first model by default
    if (this.models.length > 0) {
      this.loadModel(this.models[0]);
    }

    // Start animation loop
    this.animate();
  }

  addLights() {
    // Ambient light
    const ambientIntensity = this.options.lighting.ambientIntensity || 0.5;
    const ambientLight = new THREE.AmbientLight(0xffffff, ambientIntensity);
    this.scene.add(ambientLight);

    // Point light
    this.pointLight = new THREE.PointLight(0xffffff, 2);
    this.pointLight.decay = 0;
    this.scene.add(this.pointLight);

    // Hemisphere Light
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.8);
    hemiLight.position.set(0, 200, 0);
    this.scene.add(hemiLight);

    // Directional Light
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(0, 200, 100);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 180;
    dirLight.shadow.camera.bottom = -100;
    dirLight.shadow.camera.left = -120;
    dirLight.shadow.camera.right = 120;
    this.scene.add(dirLight);
  }

  addControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 1;
    this.controls.maxDistance = 1000;
    this.controls.maxPolarAngle = Math.PI;
  }

  initGUI() {
    this.params = {
      selectedModel: this.models[0] || null,
      wireframe: false,
    };

    // Create GUI
    this.gui = new GUI({ autoPlace: false }); // Prevents automatic placement
    this.container.appendChild(this.gui.domElement); // Append GUI to container

    // Position the GUI
    this.gui.domElement.style.position = 'absolute';
    this.gui.domElement.style.top = '0px';
    this.gui.domElement.style.right = '0px';
    this.gui.domElement.style.zIndex = '1'; // Ensure GUI is on top

    // Add model selection control
    const modelController = this.gui.add(this.params, 'selectedModel', this.models);
    modelController.name('Select Model').onChange((value) => {
      this.loadModel(value);
    });

    // Add wireframe toggle
    this.gui.add(this.params, 'wireframe').name('Wireframe').onChange((value) => {
      this.toggleWireframe(value);
    });
  }

  loadModel(filename) {
    const loader = new GLTFLoader();
    loader.load(
      `${this.modelsDirectory}/${filename}`,
      (gltf) => {
        if (this.currentModel) {
          this.scene.remove(this.currentModel);
        }

        this.currentModel = gltf.scene;
        this.scene.add(this.currentModel);

        // Center the model
        const box = new THREE.Box3().setFromObject(this.currentModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Reposition the model to center at origin
        this.currentModel.position.x += (this.currentModel.position.x - center.x);
        this.currentModel.position.y += (this.currentModel.position.y - center.y);
        this.currentModel.position.z += (this.currentModel.position.z - center.z);

        // Adjust the camera to fit the model
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = this.camera.fov * (Math.PI / 180);
        let cameraZ = maxDim / (2 * Math.tan(fov / 2));

        cameraZ *= 2; // Add some extra space between camera and object

        this.camera.position.set(0, 0, cameraZ);

        // Set camera to look at the center of the model
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        // Update controls target
        if (this.controls) {
          this.controls.target.set(0, 0, 0);
          this.controls.update();
        }

        // Handle animations
        if (gltf.animations && gltf.animations.length > 0) {
          this.mixer = new THREE.AnimationMixer(this.currentModel);
          gltf.animations.forEach((clip) => {
            const action = this.mixer.clipAction(clip);
            action.play();
          });
        }

        // Apply wireframe setting
        this.toggleWireframe(this.params.wireframe);

        // Callback after model load
        if (typeof this.options.onModelLoad === 'function') {
          this.options.onModelLoad(gltf);
        }
      },
      undefined,
      (error) => {
        console.error('An error happened while loading the model:', error);
      }
    );
  }

  toggleWireframe(value) {
    if (this.currentModel) {
      this.currentModel.traverse((child) => {
        if (child.isMesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((material) => {
              material.wireframe = value;
              material.needsUpdate = true;
            });
          } else {
            child.material.wireframe = value;
            child.material.needsUpdate = true;
          }
        }
      });
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    if (this.mixer) this.mixer.update(delta);

    if (this.controls) this.controls.update();

    // Make the point light follow the camera
    this.pointLight.position.copy(this.camera.position);

    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    // If width and height are set no adjustment
    if (this.options.width && this.options.height) {
      return;
    }

    // Else adjust to container's size
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
  }

  setSize(newWidth, newHeight) {
    // Update internal width and height
    this.width = newWidth;
    this.height = newHeight;

    // Update renderer size
    this.renderer.setSize(this.width, this.height);

    // Update camera aspect ratio and projection matrix
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    // Optionally, adjust the container's size
    this.container.style.width = `${this.width}px`;
    this.container.style.height = `${this.height}px`;
  }
}
