import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.module.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
scene.fog = new THREE.FogExp2(0x000000, 0.025);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1200);
camera.position.set(0, 0, 18);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
scene.add(ambientLight);

const starGeometry = new THREE.BufferGeometry();
const starColors = [];
const starPositions = [];
for (let i = 0; i < 12000; i++) {
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = (Math.random() - 0.5) * 2000;

  starPositions.push(x, y, z);

  const color = new THREE.Color();
  const tint = 0.6 + Math.random() * 0.7;
  color.setHSL(0.58 + Math.random() * 0.15, 0.5, tint);
  starColors.push(color.r, color.g, color.b);
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));

const starMaterial = new THREE.PointsMaterial({
  size: 0.9,
  vertexColors: true,
  transparent: true,
  opacity: 0.95,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

const cameraOrbit = {
  radius: 18,
  tilt: 0.3,
  angle: 0,
};

function createCloudNebula({ colors, count, spread, scale, position, rotationSpeed = 0.08 }) {
  const positions = [];
  const rawColors = [];

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const radius = Math.pow(Math.random(), 0.9) * spread;

    const x = Math.sin(phi) * Math.cos(theta) * radius * scale;
    const y = Math.sin(phi) * Math.sin(theta) * radius * scale;
    const z = Math.cos(phi) * radius * scale;

    positions.push(x, y, z);

    const color = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
    color.offsetHSL((Math.random() - 0.5) * 0.2, 0.1, (Math.random() - 0.5) * 0.15);
    rawColors.push(color.r, color.g, color.b);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(rawColors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.14,
    vertexColors: true,
    transparent: true,
    opacity: 0.92,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const cloud = new THREE.Points(geometry, material);
  cloud.position.set(position.x, position.y, position.z);
  cloud.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
  cloud.userData.rotationSpeed = rotationSpeed;
  scene.add(cloud);
  return cloud;
}

function createRingNebula({ position, colors }) {
  const group = new THREE.Group();
  group.position.set(position.x, position.y, position.z);

  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.65, 32, 32),
    new THREE.MeshBasicMaterial({
      color: 0xffd0d0,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    })
  );
  group.add(core);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.8, 0.65, 24, 120),
    new THREE.MeshBasicMaterial({
      color: new THREE.Color(colors[0]),
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    })
  );
  ring.rotation.x = Math.PI / 2.8;
  group.add(ring);

  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(2.9, 32, 32),
    new THREE.MeshBasicMaterial({
      color: new THREE.Color(colors[1]),
      transparent: true,
      opacity: 0.13,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    })
  );
  group.add(halo);

  group.userData.rotationSpeed = 0.1;
  scene.add(group);
  return group;
}

function createDarkNebula({ position, colors, radius = 1.7 }) {
  const group = new THREE.Group();
  group.position.set(position.x, position.y, position.z);

  const darkCloud = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 32, 32),
    new THREE.MeshBasicMaterial({
      color: 0x111111,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
    })
  );
  group.add(darkCloud);

  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(radius * 1.35, 32, 32),
    new THREE.MeshBasicMaterial({
      color: new THREE.Color(colors[0]),
      transparent: true,
      opacity: 0.17,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    })
  );
  group.add(glow);

  group.userData.rotationSpeed = 0.03;
  scene.add(group);
  return group;
}

const nebulae = [
  createCloudNebula({
    colors: [0xff7d7d, 0xffb58a, 0xffd4d4, 0xff5f6d],
    count: 3600,
    spread: 3.2,
    scale: 1.0,
    position: new THREE.Vector3(-8.3, 2.0, -2.0),
    rotationSpeed: 0.04,
  }),
  createCloudNebula({
    colors: [0xcfe8ff, 0x9fc2ff, 0x6aa9ff, 0xbfe3ff],
    count: 3000,
    spread: 3.1,
    scale: 0.9,
    position: new THREE.Vector3(-2.5, 2.2, -1.0),
    rotationSpeed: 0.06,
  }),
  createRingNebula({
    position: new THREE.Vector3(3.5, 2.6, -1.2),
    colors: [0xff6c6c, 0xffd4d4],
  }),
  createCloudNebula({
    colors: [0x93f4ff, 0x84ffd9, 0xff9d6e, 0xf8d676],
    count: 3400,
    spread: 3.4,
    scale: 1.0,
    position: new THREE.Vector3(-2.7, -3.2, -1.7),
    rotationSpeed: 0.08,
  }),
  createDarkNebula({
    position: new THREE.Vector3(4.2, -3.0, -0.8),
    colors: [0xf57a7a],
    radius: 1.9,
  }),
];

const clock = new THREE.Clock();

function animateCamera() {
  const elapsed = clock.getElapsedTime();
  const orbitRadius = 17 + Math.sin(elapsed * 0.3) * 2.5;
  const orbitAngle = elapsed * 0.32;
  const wobble = Math.sin(elapsed * 1.1) * 2.5;

  cameraOrbit.angle = orbitAngle;
  camera.position.x = Math.cos(cameraOrbit.angle) * orbitRadius;
  camera.position.y = Math.sin(cameraOrbit.angle * 1.7) * 3 + wobble * 0.4;
  camera.position.z = Math.sin(cameraOrbit.angle) * orbitRadius + 2;
  camera.lookAt(0, 0.5, 0);
}

function animate() {
  requestAnimationFrame(animate);

  const time = clock.getElapsedTime();

  stars.rotation.x += 0.00012;
  stars.rotation.y += 0.00015;

  nebulae.forEach((nebula, index) => {
    nebula.rotation.x += 0.0008 + index * 0.0001;
    nebula.rotation.y += nebula.userData.rotationSpeed;
    nebula.rotation.z += 0.0004 + index * 0.00015;
  });

  animateCamera();

  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const title = document.getElementById('info');
if (title) {
  title.textContent = 'Nebula in Astronomy';
}

const clickSparkle = (event) => {
  const glow = document.createElement('div');
  glow.style.position = 'absolute';
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
  glow.style.width = '8px';
  glow.style.height = '8px';
  glow.style.borderRadius = '50%';
  glow.style.background = 'rgba(255,255,255,0.8)';
  glow.style.boxShadow = '0 0 18px rgba(255,255,255,0.8)';
  glow.style.pointerEvents = 'none';
  document.body.appendChild(glow);

  setTimeout(() => glow.remove(), 500);
};

document.addEventListener('click', clickSparkle);
