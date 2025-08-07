import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { initFog } from '../environment/fog.js';
import { initLighting } from '../environment/lighting.js';
import { initGround } from '../environment/ground.js';
import { initSky } from '../environment/sky.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { moveCameraAcrossLine } from '../movements/cameraMovements.js';

const scene = new THREE.Scene();
initFog(scene);

let camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 10, 8000);
camera.position.set(0, 0, 500);
let gap=0;
let height=0;
let scale=1;
let totalHeight=0;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.domElement.id = "myCanvas";
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.minPolarAngle = 0+0.1;
controls.maxPolarAngle = Math.PI-0.1;
controls.minAzimuthAngle = -Math.PI / 2+0.1; // -45 degrees
controls.maxAzimuthAngle = Math.PI / 2-0.1;  // +45 degrees
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.target.set(0, 0, 0);

initLighting(scene);
// initGround(scene);
initSky(scene);

let textMeshes = [];

function createResponsiveText() {
  // Remove old text meshes
  textMeshes.forEach(mesh => scene.remove(mesh));
  textMeshes = [];

  const fontLoader = new FontLoader();
  fontLoader.load('https://unpkg.com/three@0.169.0/examples/fonts/gentilis_bold.typeface.json', function (font) {
    const words = ['HAPPY', 'BIRTHDAY', 'DADDY!'];

    // Calculate base font size and gap based on viewport height
    const minDimension = Math.min(window.innerWidth, window.innerHeight);
    let size = Math.max(12, minDimension / 15);
    height = size * 0.2;
    gap = size * 1.5;

    // 1. Find the widest word in world units
    let maxWidth = 0;
    const geometries = words.map(word => {
      const geo = new TextGeometry(word, {
        font: font,
        size: size,
        height: height,
        curveSegments: 16,
        bevelEnabled: true,
        bevelThickness: 2,
        bevelSize: 2,
        bevelOffset: 0,
        bevelSegments: 8,
      });
      geo.computeBoundingBox();
      const width = geo.boundingBox.max.x - geo.boundingBox.min.x;
      if (width > maxWidth) maxWidth = width;
      return geo;
    });

    // 2. Compute target width in world units (e.g., 80% of camera frustum width at z=0)
    const vFOV = THREE.MathUtils.degToRad(camera.fov); // vertical fov in radians
    const camDist = Math.abs(camera.position.z); // distance from camera to text
    const frustumHeight = 2 * Math.tan(vFOV / 2) * camDist;
    const frustumWidth = frustumHeight * camera.aspect;
    const targetWidth = frustumWidth * 0.8;

    // 3. Calculate scale factor to fit the widest word
    scale = maxWidth > targetWidth ? targetWidth / maxWidth : 1;

    // 4. Place and add text meshes
    totalHeight = (words.length - 1) * gap * scale;
    geometries.forEach((geo, i) => {
      geo.center();
      const material = new THREE.MeshPhongMaterial({
        color: 0xff1744,
        shininess: 150,
        specular: 0xffffff,
        emissive: 0x330000,
      });
      const mesh = new THREE.Mesh(geo, material);
      mesh.scale.set(scale, scale, scale);
      mesh.position.set(0, totalHeight / 2 - i * gap * scale, 0);
      mesh.castShadow = true;
      scene.add(mesh);
      textMeshes.push(mesh);
    });
  });
}

// Initial creation
createResponsiveText();
// moveCameraAcrossLine(camera, 20, 10,20,4);
// Responsive recreate on resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  createResponsiveText();
});

function animateCloud() {
  renderer.render(scene, camera);
  requestAnimationFrame(animateCloud);
}

animateCloud();