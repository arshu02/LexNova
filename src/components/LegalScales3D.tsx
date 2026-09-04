'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function LegalScales3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 520;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 5, 140);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Master group
    const scalesGroup = new THREE.Group();
    scene.add(scalesGroup);

    // Palette
    const cyanColor = 0x38bdf8;
    const blueColor = 0x2563eb;
    const glowBlue = 0x60a5fa;

    // Materials
    const metallicLineMat = new THREE.LineBasicMaterial({
      color: cyanColor,
      transparent: true,
      opacity: 0.65,
    });

    const wireframeMat = new THREE.MeshBasicMaterial({
      color: blueColor,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });

    const glowPointMat = new THREE.PointsMaterial({
      size: 2.2,
      color: glowBlue,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    // 1. Base Pedestal (Layered geometric discs)
    const baseGeo = new THREE.CylinderGeometry(24, 28, 4, 32);
    const baseMesh = new THREE.Mesh(baseGeo, wireframeMat);
    baseMesh.position.y = -35;
    scalesGroup.add(baseMesh);

    const baseRingGeo = new THREE.RingGeometry(25, 27, 32);
    const baseRing = new THREE.Mesh(baseRingGeo, new THREE.MeshBasicMaterial({ color: cyanColor, side: THREE.DoubleSide, transparent: true, opacity: 0.4 }));
    baseRing.rotation.x = Math.PI / 2;
    baseRing.position.y = -33;
    scalesGroup.add(baseRing);

    // 2. Central Pillar
    const pillarGeo = new THREE.CylinderGeometry(1.8, 2.8, 65, 16);
    const pillarMesh = new THREE.Mesh(pillarGeo, wireframeMat);
    pillarMesh.position.y = -2;
    scalesGroup.add(pillarMesh);

    // 3. Central Apex Diamond / Law Prism (Octahedron)
    const apexGeo = new THREE.OctahedronGeometry(5, 0);
    const apexMesh = new THREE.Mesh(
      apexGeo,
      new THREE.MeshBasicMaterial({
        color: cyanColor,
        wireframe: true,
        transparent: true,
        opacity: 0.8,
      })
    );
    apexMesh.position.y = 31;
    scalesGroup.add(apexMesh);

    // Beam Group (will tilt dynamically)
    const beamGroup = new THREE.Group();
    beamGroup.position.y = 30;
    scalesGroup.add(beamGroup);

    // 4. Horizontal Balance Beam
    const beamGeo = new THREE.CylinderGeometry(1.2, 1.2, 70, 16);
    const beamMesh = new THREE.Mesh(beamGeo, wireframeMat);
    beamMesh.rotation.z = Math.PI / 2;
    beamGroup.add(beamMesh);

    // Beam decorative end rings
    [-35, 35].forEach((xPos) => {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(1.8, 2.5, 16),
        new THREE.MeshBasicMaterial({ color: cyanColor, side: THREE.DoubleSide, transparent: true, opacity: 0.7 })
      );
      ring.position.x = xPos;
      beamGroup.add(ring);
    });

    // 5. Left Scale Assembly (Pan + Chains)
    const leftPanGroup = new THREE.Group();
    leftPanGroup.position.set(-35, 0, 0);
    beamGroup.add(leftPanGroup);

    // Chains (lines from hook down to pan)
    const chainLength = 26;
    const chainPoints1 = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(-8, -chainLength, 0)];
    const chainPoints2 = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(8, -chainLength, 0)];
    const chainPoints3 = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -chainLength, 8)];

    leftPanGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(chainPoints1), metallicLineMat));
    leftPanGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(chainPoints2), metallicLineMat));
    leftPanGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(chainPoints3), metallicLineMat));

    // Left Pan Dish
    const panGeo = new THREE.CylinderGeometry(11, 2, 2.5, 24, 1, true);
    const leftPanDish = new THREE.Mesh(panGeo, wireframeMat);
    leftPanDish.position.y = -chainLength;
    leftPanGroup.add(leftPanDish);

    // 6. Right Scale Assembly (Pan + Chains)
    const rightPanGroup = new THREE.Group();
    rightPanGroup.position.set(35, 0, 0);
    beamGroup.add(rightPanGroup);

    rightPanGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(chainPoints1), metallicLineMat));
    rightPanGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(chainPoints2), metallicLineMat));
    rightPanGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(chainPoints3), metallicLineMat));

    const rightPanDish = new THREE.Mesh(panGeo, wireframeMat);
    rightPanDish.position.y = -chainLength;
    rightPanGroup.add(rightPanDish);

    // 7. Ambient Floating Law Nodes (subtle particles around the scales)
    const nodeCount = 120;
    const nodePositions = new Float32Array(nodeCount * 3);
    for (let i = 0; i < nodeCount; i++) {
      nodePositions[i * 3] = (Math.random() - 0.5) * 160;
      nodePositions[i * 3 + 1] = (Math.random() - 0.5) * 110 + 5;
      nodePositions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
    const nodes = new THREE.Points(nodeGeo, glowPointMat);
    scalesGroup.add(nodes);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetTiltZ = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      mouseX = (x / rect.width) * 0.8;
      mouseY = (y / rect.height) * 0.8;
      // Tilting the beam dynamically based on mouse X position
      targetTiltZ = -mouseX * 0.22;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    let animationFrameId: number;
    let clock = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      clock += 0.02;

      // Subtle resting oscillation of beam
      const naturalOscillation = Math.sin(clock * 0.8) * 0.04;
      beamGroup.rotation.z += (targetTiltZ + naturalOscillation - beamGroup.rotation.z) * 0.08;

      // Counter-rotate the pans so they stay hanging vertically downward
      leftPanGroup.rotation.z = -beamGroup.rotation.z;
      rightPanGroup.rotation.z = -beamGroup.rotation.z;

      // Slow gentle rotation of the whole scales assembly with mouse follow
      scalesGroup.rotation.y += (mouseX * 0.4 - scalesGroup.rotation.y) * 0.05;
      scalesGroup.rotation.x += (mouseY * 0.2 - scalesGroup.rotation.x) * 0.05;

      // Spin the central apex crystal
      apexMesh.rotation.y = clock * 0.5;
      apexMesh.rotation.x = clock * 0.25;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden flex items-center justify-center opacity-65"
    />
  );
}

export default LegalScales3D;
