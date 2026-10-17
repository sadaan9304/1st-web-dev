/**
 * COLLEGE YATRI - 3D THREE.JS INTERACTIVE HERO ENGINE
 * High-performance WebGL scene featuring glowing geometric artifacts,
 * orbiting satellites, particle constellation, and mouse parallax interaction.
 */

(function () {
  'use strict';

  // Check WebGL availability
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas || !window.THREE) return;

  const THREE = window.THREE;

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 6;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const mainPointLight = new THREE.PointLight(0x38bdf8, 3, 50);
  mainPointLight.position.set(5, 5, 5);
  scene.add(mainPointLight);

  const secondaryPointLight = new THREE.PointLight(0x818cf8, 2.5, 50);
  secondaryPointLight.position.set(-5, -3, 3);
  scene.add(secondaryPointLight);

  // Core Group
  const worldGroup = new THREE.Group();
  scene.add(worldGroup);

  // 1. Central Hero Artifact: Dual Wireframe + Inner Core
  const coreGeometry = new THREE.IcosahedronGeometry(1.6, 2);
  const coreMaterial = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.2,
    metalness: 0.8,
    wireframe: true,
    transparent: true,
    opacity: 0.85
  });
  const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
  worldGroup.add(coreMesh);

  // Inner Glowing Core
  const innerGeometry = new THREE.TorusKnotGeometry(0.8, 0.22, 120, 16);
  const innerMaterial = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.6,
    roughness: 0.3,
    metalness: 0.9,
    wireframe: false
  });
  const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
  worldGroup.add(innerMesh);

  // 2. Orbiting Satellites (Geometric shapes representing tech stack pillars)
  const satellites = [];
  const satelliteConfigs = [
    { geom: new THREE.BoxGeometry(0.4, 0.4, 0.4), color: 0x38bdf8, radius: 3.2, speed: 0.8, yOffset: 0.5 },
    { geom: new THREE.OctahedronGeometry(0.35), color: 0xa855f7, radius: 2.8, speed: -0.6, yOffset: -0.8 },
    { geom: new THREE.TetrahedronGeometry(0.35), color: 0x10b981, radius: 3.6, speed: 0.5, yOffset: 1.2 },
    { geom: new THREE.DodecahedronGeometry(0.3), color: 0xec4899, radius: 3.0, speed: -0.9, yOffset: -0.4 }
  ];

  satelliteConfigs.forEach((cfg) => {
    const mat = new THREE.MeshStandardMaterial({
      color: cfg.color,
      roughness: 0.4,
      metalness: 0.7,
      wireframe: true
    });
    const mesh = new THREE.Mesh(cfg.geom, mat);
    satellites.push({
      mesh: mesh,
      radius: cfg.radius,
      speed: cfg.speed,
      angle: Math.random() * Math.PI * 2,
      yOffset: cfg.yOffset
    });
    worldGroup.add(mesh);
  });

  // 3. Stardust Particle Galaxy
  const particleCount = window.innerWidth < 768 ? 600 : 1200;
  const particleGeometry = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleScales = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    particlePositions[i3] = (Math.random() - 0.5) * 18;
    particlePositions[i3 + 1] = (Math.random() - 0.5) * 14;
    particlePositions[i3 + 2] = (Math.random() - 0.5) * 12 - 2;
    particleScales[i] = Math.random();
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.04,
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particleSystem);

  // Mouse Interaction Variables
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  function onPointerMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.001;
    mouseY = (event.clientY - windowHalfY) * 0.001;
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true });

  // Handle Resize
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Responsive position shift on mobile
    if (window.innerWidth < 768) {
      worldGroup.position.set(0, 0.4, 0);
      worldGroup.scale.set(0.7, 0.7, 0.7);
    } else {
      worldGroup.position.set(1.8, 0, 0);
      worldGroup.scale.set(1, 1, 1);
    }
  }

  window.addEventListener('resize', onWindowResize);
  onWindowResize();

  // Color Theme Synchronizer
  window.update3DTheme = function (theme) {
    if (theme === 'cyber') {
      mainPointLight.color.setHex(0x10b981);
      secondaryPointLight.color.setHex(0x34d399);
      innerMaterial.color.setHex(0x10b981);
      innerMaterial.emissive.setHex(0x047857);
      particleMaterial.color.setHex(0x34d399);
    } else if (theme === 'light') {
      mainPointLight.color.setHex(0x2563eb);
      secondaryPointLight.color.setHex(0x7c3aed);
      innerMaterial.color.setHex(0x2563eb);
      innerMaterial.emissive.setHex(0x1d4ed8);
      particleMaterial.color.setHex(0x3b82f6);
    } else {
      // Dark / Cosmic default
      mainPointLight.color.setHex(0x38bdf8);
      secondaryPointLight.color.setHex(0x818cf8);
      innerMaterial.color.setHex(0x38bdf8);
      innerMaterial.emissive.setHex(0x0284c7);
      particleMaterial.color.setHex(0x38bdf8);
    }
  };

  // Animation Loop with Clock
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Smooth Lerp for Mouse Parallax
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    // Rotate Central Core
    coreMesh.rotation.x = elapsedTime * 0.15 + targetY;
    coreMesh.rotation.y = elapsedTime * 0.2 + targetX;

    innerMesh.rotation.x = -elapsedTime * 0.25 + targetY * 0.8;
    innerMesh.rotation.y = -elapsedTime * 0.35 + targetX * 0.8;

    // Orbit Satellites
    satellites.forEach((sat) => {
      sat.angle += sat.speed * 0.015;
      sat.mesh.position.x = Math.cos(sat.angle) * sat.radius;
      sat.mesh.position.z = Math.sin(sat.angle) * sat.radius;
      sat.mesh.position.y = sat.yOffset + Math.sin(elapsedTime * 2 + sat.radius) * 0.25;

      sat.mesh.rotation.x += 0.02;
      sat.mesh.rotation.y += 0.03;
    });

    // Particle subtle drift
    particleSystem.rotation.y = elapsedTime * 0.02;
    particleSystem.rotation.x = -elapsedTime * 0.01;

    // Subtle Camera Tilt
    camera.position.x += (targetX * 0.8 - camera.position.x) * 0.05;
    camera.position.y += (-targetY * 0.8 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  animate();
})();

