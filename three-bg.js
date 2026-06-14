/* ============================================================
   ULTRA PREMIUM THREE.JS 3D BACKGROUND
   — Galaxy Particles + DNA Helix + Energy Orbs + Tunnels
   ============================================================ */

(function () {
  const container = document.getElementById('three-bg');
  if (!container || typeof THREE === 'undefined') return;

  // ── SCENE SETUP ────────────────────────────────────────────
  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.set(0, 0, 60);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x00000, 0);
  container.appendChild(renderer.domElement);

  // ── MOUSE TRACKING ─────────────────────────────────────────
  const mouse   = { x: 0, y: 0 };
  const target  = { x: 0, y: 0 };
  document.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── COLOUR PALETTE ─────────────────────────────────────────
  const C = {
    violet : new THREE.Color(0x7c6cf0),
    teal   : new THREE.Color(0x00e0d0),
    pink   : new THREE.Color(0xff6b9d),
    blue   : new THREE.Color(0x4a00e0),
    white  : new THREE.Color(0xffffff),
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 1. GALAXY STAR-FIELD  (8 000 particles in spiral arms)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  function createGalaxy() {
    const N        = 8000;
    const arms     = 3;
    const spread   = 0.45;
    const radius   = 120;
    const positions= new Float32Array(N * 3);
    const colors   = new Float32Array(N * 3);
    const sizes    = new Float32Array(N);
    const palette  = [C.violet, C.teal, C.pink, C.blue, C.white];

    for (let i = 0; i < N; i++) {
      const r     = Math.pow(Math.random(), 2) * radius;
      const arm   = (i % arms) * ((Math.PI * 2) / arms);
      const spin  = r * 0.008;
      const theta = arm + spin + (Math.random() - 0.5) * spread;
      const y     = (Math.random() - 0.5) * r * 0.25;

      positions[i*3  ] = Math.cos(theta) * r;
      positions[i*3+1] = y;
      positions[i*3+2] = Math.sin(theta) * r;

      const col = palette[Math.floor(Math.random() * palette.length)];
      const mix = Math.random();
      colors[i*3  ] = col.r * mix + C.white.r * (1 - mix) * 0.3;
      colors[i*3+1] = col.g * mix + C.white.g * (1 - mix) * 0.3;
      colors[i*3+2] = col.b * mix + C.white.b * (1 - mix) * 0.3;

      sizes[i] = Math.random() * 1.5 + 0.2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.PointsMaterial({
      size: 0.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.3,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const galaxy = new THREE.Points(geo, mat);
    galaxy.rotation.x = Math.PI * 0.15;
    scene.add(galaxy);
    return galaxy;
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 2. NEBULA CLOUD  (large soft glowing spheres)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  function createNebulaClouds() {
    const defs = [
      { color: 0x7c6cf0, x: -40, y: 20,  z: -60, s: 55 },
      { color: 0x00e0d0, x:  50, y: -30, z: -80, s: 65 },
      { color: 0xff6b9d, x:  10, y: 30,  z:-100, s: 50 },
      { color: 0x4a00e0, x: -60, y: -10, z: -90, s: 70 },
    ];
    defs.forEach(d => {
      const geo = new THREE.SphereGeometry(d.s, 8, 8);
      const mat = new THREE.MeshBasicMaterial({
        color: d.color,
        transparent: true,
        opacity: 0.035,
        wireframe: false,
        side: THREE.BackSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(d.x, d.y, d.z);
      scene.add(mesh);
    });
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 3a. DARK HOLOGRAPHIC GLOBE — premium tech centerpiece
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  function createHolographicGlobe() {
    const group = new THREE.Group();
    const R = 12;

    // Dark base sphere (very subtle fill)
    const baseSphere = new THREE.Mesh(
      new THREE.SphereGeometry(R, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0x0a0a1a, transparent: true, opacity: 0.55,
        depthWrite: false,
      })
    );
    group.add(baseSphere);

    // Latitude lines
    const latCount = 9;
    for (let i = 1; i < latCount; i++) {
      const phi   = (i / latCount) * Math.PI;
      const rLat  = R * Math.sin(phi);
      const yLat  = R * Math.cos(phi);
      const pts   = [];
      for (let j = 0; j <= 64; j++) {
        const a = (j / 64) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * rLat, yLat, Math.sin(a) * rLat));
      }
      const opacity = (i === Math.floor(latCount / 2)) ? 0.35 : 0.12;
      const color   = (i % 3 === 0) ? 0x7c6cf0 : 0x00e0d0;
      const lineMat = new THREE.LineBasicMaterial({
        color, transparent: true, opacity,
        blending: THREE.AdditiveBlending,
      });
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat));
    }

    // Longitude lines
    const lonCount = 12;
    for (let i = 0; i < lonCount; i++) {
      const theta = (i / lonCount) * Math.PI * 2;
      const pts   = [];
      for (let j = 0; j <= 48; j++) {
        const phi = (j / 48) * Math.PI;
        pts.push(new THREE.Vector3(
          R * Math.sin(phi) * Math.cos(theta),
          R * Math.cos(phi),
          R * Math.sin(phi) * Math.sin(theta)
        ));
      }
      const opacity = (i % 4 === 0) ? 0.3 : 0.08;
      const color   = (i % 4 === 0) ? 0x7c6cf0 : 0x00e0d0;
      group.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending })
      ));
    }

    // Outer soft glow aura
    group.add(new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.15, 16, 16),
      new THREE.MeshBasicMaterial({
        color: 0x7c6cf0, transparent: true, opacity: 0.04,
        side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
      })
    ));

    // Saturn-like tilted rings
    const ringDefs = [
      { inner: R * 1.3, outer: R * 1.55, color: 0x7c6cf0, opacity: 0.15, rotX: 1.2 },
      { inner: R * 1.65, outer: R * 1.75, color: 0x00e0d0, opacity: 0.1,  rotX: 1.0 },
    ];
    ringDefs.forEach(rd => {
      const ringGeo = new THREE.RingGeometry(rd.inner, rd.outer, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: rd.color, transparent: true, opacity: rd.opacity,
        side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = rd.rotX;
      group.add(ring);
    });

    // Orbiting particle ring
    const orbCount = 80;
    const orbPositions = new Float32Array(orbCount * 3);
    for (let i = 0; i < orbCount; i++) {
      const a = (i / orbCount) * Math.PI * 2;
      orbPositions[i*3  ] = Math.cos(a) * (R * 1.45);
      orbPositions[i*3+1] = (Math.random() - 0.5) * 2;
      orbPositions[i*3+2] = Math.sin(a) * (R * 1.45);
    }
    const orbGeo = new THREE.BufferGeometry();
    orbGeo.setAttribute('position', new THREE.BufferAttribute(orbPositions, 3));
    const orbMat = new THREE.PointsMaterial({
      color: 0x00e0d0, size: 0.45, transparent: true, opacity: 0.7,
      sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    group.add(new THREE.Points(orbGeo, orbMat));

    group.position.set(30, 2, -8);
    scene.add(group);
    return group;
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 3b. NEURAL NETWORK — pulsing connected nodes
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  function createNeuralNetwork() {
    const group    = new THREE.Group();
    const nodeCount= 30;
    const nodePositions = [];
    const nodeMeshes    = [];
    const cols = [0x7c6cf0, 0x00e0d0, 0xff6b9d, 0xffffff];

    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 70,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 40
      );
      nodePositions.push(pos);

      // Node sphere
      const col  = cols[i % cols.length];
      const core = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 8, 8),
        new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending })
      );
      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(1.2, 8, 8),
        new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending, side: THREE.BackSide })
      );
      core.add(halo);
      core.position.copy(pos);
      core.userData = { phase: Math.random() * Math.PI * 2, col };
      group.add(core);
      nodeMeshes.push(core);
    }

    // Create edges between nearby nodes
    const edges = [];
    const maxDist = 30;
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (nodePositions[i].distanceTo(nodePositions[j]) < maxDist) {
          const edgeGeo = new THREE.BufferGeometry().setFromPoints([
            nodePositions[i], nodePositions[j]
          ]);
          const edgeMat = new THREE.LineBasicMaterial({
            color: 0x7c6cf0, transparent: true, opacity: 0.12,
            blending: THREE.AdditiveBlending,
          });
          const line = new THREE.Line(edgeGeo, edgeMat);
          group.add(line);
          edges.push({ line, mat: edgeMat, phase: Math.random() * Math.PI * 2 });
        }
      }
    }

    group.position.set(-30, 0, -5);
    scene.add(group);
    return { group, nodeMeshes, edges };
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 4. ENERGY ORBS  (floating glowing spheres)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  function createEnergyOrbs() {
    const orbs = [];
    const defs = [
      { color: 0x7c6cf0, r: 4, x: 25,  y: 10,  z: -10, spd: 0.003 },
      { color: 0x00e0d0, r: 3, x: -30, y: -8,  z: -5,  spd: 0.002 },
      { color: 0xff6b9d, r: 2.5,x: 10, y: -15, z:  5,  spd: 0.004 },
      { color: 0x4a00e0, r: 5, x: -15, y: 20,  z: -15, spd: 0.0015},
      { color: 0x00e0d0, r: 2, x: 35,  y: -20, z:  0,  spd: 0.005 },
    ];

    defs.forEach(d => {
      const core = new THREE.Mesh(
        new THREE.SphereGeometry(d.r, 16, 16),
        new THREE.MeshBasicMaterial({
          color: d.color, transparent: true, opacity: 0.15,
          blending: THREE.AdditiveBlending, depthWrite: false,
        })
      );
      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(d.r * 2.5, 16, 16),
        new THREE.MeshBasicMaterial({
          color: d.color, transparent: true, opacity: 0.05,
          blending: THREE.AdditiveBlending, depthWrite: false,
          side: THREE.BackSide,
        })
      );
      core.add(glow);
      core.position.set(d.x, d.y, d.z);
      scene.add(core);
      orbs.push({ mesh: core, spd: d.spd, ox: d.x, oy: d.y, phase: Math.random() * Math.PI * 2 });
    });
    return orbs;
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 5. WIREFRAME ICOSAHEDRON NETWORK
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  function createWireNetwork() {
    const group = new THREE.Group();
    const shapes = [
      { geo: new THREE.IcosahedronGeometry(8, 0),  x: 30,  y: -5, z: -5, spd: 0.002 },
      { geo: new THREE.OctahedronGeometry(5),       x: -35, y: 10, z:-10, spd: 0.003 },
      { geo: new THREE.TetrahedronGeometry(6),      x: 15,  y: 20, z:-20, spd: 0.004 },
    ];

    shapes.forEach(s => {
      const mat = new THREE.MeshBasicMaterial({
        color: 0x7c6cf0, wireframe: true,
        transparent: true, opacity: 0.18,
        blending: THREE.AdditiveBlending,
      });
      const mesh = new THREE.Mesh(s.geo, mat);
      mesh.position.set(s.x, s.y, s.z);
      mesh.userData.spd = s.spd;
      group.add(mesh);
    });
    scene.add(group);
    return group;
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 6. NEON GRID FLOOR (infinite 3D perspective)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  function createNeonGrid() {
    const group = new THREE.Group();
    const size  = 200;
    const divs  = 30;
    const step  = size / divs;

    for (let i = 0; i <= divs; i++) {
      const x = -size/2 + i * step;
      const matX = new THREE.LineBasicMaterial({
        color: i % 5 === 0 ? 0x7c6cf0 : 0x00e0d0,
        transparent: true,
        opacity: i % 5 === 0 ? 0.25 : 0.08,
        blending: THREE.AdditiveBlending,
      });
      const matZ = matX.clone();

      const ptX = [new THREE.Vector3(x, 0, -size/2), new THREE.Vector3(x, 0, size/2)];
      const ptZ = [new THREE.Vector3(-size/2, 0, x), new THREE.Vector3(size/2, 0, x)];

      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(ptX), matX));
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(ptZ), matZ));
    }
    group.position.y = -35;
    group.rotation.x = Math.PI * 0.04;
    scene.add(group);
    return group;
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 7. FLOATING CODE PARTICLES  (small tetrahedra)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  function createFloatingShards() {
    const group = new THREE.Group();
    const cols  = [0x7c6cf0, 0x00e0d0, 0xff6b9d, 0x4a00e0];
    for (let i = 0; i < 60; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: cols[i % cols.length],
        wireframe: true, transparent: true, opacity: 0.25,
        blending: THREE.AdditiveBlending,
      });
      const mesh = new THREE.Mesh(new THREE.TetrahedronGeometry(Math.random()*0.8+0.2), mat);
      mesh.position.set(
        (Math.random()-0.5)*120,
        (Math.random()-0.5)*80,
        (Math.random()-0.5)*80
      );
      mesh.userData = { spd: Math.random()*0.008+0.002, amp: Math.random()*3+1, phase: Math.random()*Math.PI*2 };
      group.add(mesh);
    }
    scene.add(group);
    return group;
  }

  // ── BUILD SCENE ────────────────────────────────────────────
  const galaxy   = createGalaxy();
  createNebulaClouds();
  const torusKnot  = createHolographicGlobe();
  const neural     = createNeuralNetwork();
  const orbs     = createEnergyOrbs();
  const wires    = createWireNetwork();
  const grid     = createNeonGrid();
  const shards   = createFloatingShards();

  // ── CLOCK ──────────────────────────────────────────────────
  const clock = new THREE.Clock();

  // ── ANIMATION LOOP ─────────────────────────────────────────
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Smooth camera drift towards mouse
    target.x += (mouse.x * 8  - target.x) * 0.04;
    target.y += (-mouse.y * 5 - target.y) * 0.04;
    camera.position.x = target.x;
    camera.position.y = target.y;
    camera.lookAt(scene.position);

    // Galaxy slow rotation
    galaxy.rotation.y = t * 0.04;

    // Holographic Globe rotation
    torusKnot.rotation.y = t * 0.12;
    torusKnot.children.forEach((child, i) => {
      if (i === 0) return; // skip base sphere
      // Very subtle breathing scale
    });
    const globePulse = 1 + Math.sin(t * 0.8) * 0.02;
    torusKnot.scale.setScalar(globePulse);

    // Neural network pulse
    neural.nodeMeshes.forEach((node, i) => {
      const pulse = 0.7 + Math.sin(t * 1.8 + node.userData.phase) * 0.3;
      node.scale.setScalar(pulse);
    });
    neural.edges.forEach(e => {
      e.mat.opacity = 0.05 + Math.abs(Math.sin(t * 1.2 + e.phase)) * 0.25;
    });
    // Slowly rotate the whole neural network
    neural.group.rotation.y = t * 0.08;
    neural.group.rotation.x = Math.sin(t * 0.05) * 0.15;

    // Energy orbs floating
    orbs.forEach((o, i) => {
      o.mesh.position.y = o.oy + Math.sin(t * o.spd * 60 + o.phase) * 5;
      o.mesh.rotation.y = t * 0.5;
      const pulse = 0.8 + Math.sin(t * 2 + o.phase) * 0.2;
      o.mesh.scale.setScalar(pulse);
    });

    // Wireframe shapes
    wires.children.forEach((m, i) => {
      m.rotation.x = t * m.userData.spd;
      m.rotation.z = t * m.userData.spd * 0.7;
    });

    // Grid gentle wave
    grid.position.z = (t * 3) % (200 / 30);

    // Floating shards
    shards.children.forEach(s => {
      s.rotation.x += s.userData.spd;
      s.rotation.y += s.userData.spd * 0.7;
      s.position.y += Math.sin(t * s.userData.spd * 20 + s.userData.phase) * 0.01;
    });

    renderer.render(scene, camera);
  }

  // ── RESIZE ─────────────────────────────────────────────────
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  animate();
})();
