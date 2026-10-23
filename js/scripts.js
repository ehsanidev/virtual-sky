import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.module.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
scene.fog = new THREE.FogExp2(0x000000, 0.02);

const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 0, 18);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambient = new THREE.AmbientLight(0xffffff, 0.35);
scene.add(ambient);

const starGeometry = new THREE.BufferGeometry();
const starPositions = [];
const starColors = [];

for (let i = 0; i < 12000; i++) {
  const x = (Math.random() - 0.5) * 2200;
  const y = (Math.random() - 0.5) * 2200;
  const z = (Math.random() - 0.5) * 2200;
  starPositions.push(x, y, z);

  const color = new THREE.Color().setHSL(0.62 + Math.random() * 0.18, 0.6, 0.75 + Math.random() * 0.2);
  starColors.push(color.r, color.g, color.b);
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));

const starMaterial = new THREE.PointsMaterial({
  size: 0.8,
  vertexColors: true,
  transparent: true,
  opacity: 0.95,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

const cameraState = {
  distance: 17,
  minDistance: 7,
  maxDistance: 32,
};

window.addEventListener('wheel', (event) => {
  const delta = event.deltaY * 0.0035;
  cameraState.distance = THREE.MathUtils.clamp(cameraState.distance + delta, cameraState.minDistance, cameraState.maxDistance);
}, { passive: true });

function createNebulaCloud({ colors, count, spread, scale, position, size = 0.16, rotationSpeed = 0.08 }) {
  const positions = [];
  const colorsList = [];

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const radius = Math.pow(Math.random(), 0.78) * spread;

    const x = Math.sin(phi) * Math.cos(theta) * radius * scale;
    const y = Math.sin(phi) * Math.sin(theta) * radius * scale;
    const z = Math.cos(phi) * radius * scale;

    positions.push(x, y, z);

    const color = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
    color.offsetHSL((Math.random() - 0.5) * 0.16, 0.1, (Math.random() - 0.5) * 0.13);
    colorsList.push(color.r, color.g, color.b);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colorsList, 3));

  const material = new THREE.PointsMaterial({
    size,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const cloud = new THREE.Points(geometry, material);
  cloud.position.set(position.x, position.y, position.z);
  cloud.userData.rotationSpeed = rotationSpeed;
  scene.add(cloud);
  return cloud;
}

function createRingNebula({ position, colors }) {
  const group = new THREE.Group();
  group.position.copy(position);

  const core = new THREE.Mesh(
    new THREE.SphereGeometry(1.2, 32, 32),
    new THREE.MeshBasicMaterial({
      color: 0xffd7d7,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    })
  );
  group.add(core);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.6, 0.9, 28, 180),
    new THREE.MeshBasicMaterial({
      color: new THREE.Color(colors[0]),
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    })
  );
  ring.rotation.x = Math.PI / 2.9;
  group.add(ring);

  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(4.3, 32, 32),
    new THREE.MeshBasicMaterial({
      color: new THREE.Color(colors[1]),
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    })
  );
  group.add(halo);

  group.userData.rotationSpeed = 0.12;
  scene.add(group);
  return group;
}

function createDarkNebula({ position, colors, radius = 3.1 }) {
  const group = new THREE.Group();
  group.position.copy(position);

  const dark = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 32, 32),
    new THREE.MeshBasicMaterial({
      color: 0x0b0b0b,
      transparent: true,
      opacity: 0.92,
      side: THREE.DoubleSide,
    })
  );
  group.add(dark);

  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(radius * 1.45, 32, 32),
    new THREE.MeshBasicMaterial({
      color: new THREE.Color(colors[0]),
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    })
  );
  group.add(glow);

  group.userData.rotationSpeed = 0.035;
  scene.add(group);
  return group;
}

const nebulae = [
  createNebulaCloud({
    colors: [0xff7a7a, 0xffb989, 0xffd2d2, 0xff5867],
    count: 4200,
    spread: 8.2,
    scale: 1.2,
    position: new THREE.Vector3(-9.5, 2.3, -4.5),
    size: 0.18,
    rotationSpeed: 0.045,
  }),
  createNebulaCloud({
    colors: [0xcfe8ff, 0x9fbbff, 0x6ea8ff, 0xc2ecff],
    count: 4000,
    spread: 8.6,
    scale: 1.15,
    position: new THREE.Vector3(-2.8, 2.6, -2.0),
    size: 0.16,
    rotationSpeed: 0.06,
  }),
  createRingNebula({
    position: new THREE.Vector3(4.4, 2.9, -1.0),
    colors: [0xff7272, 0xffd0d0],
  }),
  createNebulaCloud({
    colors: [0x9ff3ff, 0x86fdd7, 0xffa16e, 0xf8e07d],
    count: 4400,
    spread: 8.8,
    scale: 1.25,
    position: new THREE.Vector3(-2.8, -4.0, -5.0),
    size: 0.17,
    rotationSpeed: 0.075,
  }),
  createDarkNebula({
    position: new THREE.Vector3(5.0, -3.8, -2.5),
    colors: [0xf17878],
    radius: 3.4,
  }),
];

function animate() {
  requestAnimationFrame(animate);

  const t = performance.now() * 0.0002;

  stars.rotation.x += 0.00018;
  stars.rotation.y += 0.00021;

  nebulae.forEach((nebula, index) => {
    nebula.rotation.x += 0.0011 + index * 0.00012;
    nebula.rotation.y += nebula.userData.rotationSpeed;
    nebula.rotation.z += 0.0009 + index * 0.00018;
  });

  const x = Math.cos(t * 1.2) * cameraState.distance;
  const z = Math.sin(t * 1.2) * cameraState.distance;
  const y = Math.sin(t * 0.9) * 2.4;
  camera.position.set(x, y, z);
  camera.lookAt(0, 0.5, 0);

  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const info = document.getElementById('info');
if (info) {
  info.textContent = 'Nebula in Astronomy';
}

const sparkle = (event) => {
  const dot = document.createElement('div');
  dot.style.position = 'absolute';
  dot.style.left = `${event.clientX}px`;
  dot.style.top = `${event.clientY}px`;
  dot.style.width = '8px';
  dot.style.height = '8px';
  dot.style.borderRadius = '50%';
  dot.style.background = 'rgba(255,255,255,0.8)';
  dot.style.boxShadow = '0 0 24px rgba(255,255,255,0.9)';
  dot.style.pointerEvents = 'none';
  document.body.appendChild(dot);

  setTimeout(() => dot.remove(), 500);
};

document.addEventListener('click', sparkle);
