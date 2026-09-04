'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function CyberGlobe3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 550;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 240;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Group to hold all globe elements
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 1. Central Core Sphere with subtle wireframe
    const coreGeometry = new THREE.SphereGeometry(65, 36, 36);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x051329,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const coreSphere = new THREE.Mesh(coreGeometry, coreMaterial);
    globeGroup.add(coreSphere);

    // 2. Glowing Point Cloud Globe Surface (Earth nodes)
    const particleCount = 1600;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const colorCyan = new THREE.Color(0x00f0ff);
    const colorBlue = new THREE.Color(0x2563eb);
    const colorPurple = new THREE.Color(0x8b5cf6);

    for (let i = 0; i < particleCount; i++) {
      // Fibonacci sphere distribution for uniform surface coverage
      const phi = Math.acos(1 - 2 * (i + 0.5) / particleCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const radius = 66 + (Math.random() - 0.5) * 1.5;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;

      // Color variation across nodes
      const mixedColor = Math.random() > 0.6 ? colorCyan : Math.random() > 0.3 ? colorBlue : colorPurple;
      particleColors[i * 3] = mixedColor.r;
      particleColors[i * 3 + 1] = mixedColor.g;
      particleColors[i * 3 + 2] = mixedColor.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    globeGroup.add(particleSystem);

    // 3. Orbital Telemetry Rings (SpaceX style orbital paths)
    const ringMaterial = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
    });

    const createOrbitRing = (radius: number, tiltX: number, tiltY: number) => {
      const ringGeo = new THREE.BufferGeometry();
      const points: THREE.Vector3[] = [];
      const segments = 90;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0));
      }
      ringGeo.setFromPoints(points);
      const ring = new THREE.Line(ringGeo, ringMaterial);
      ring.rotation.x = tiltX;
      ring.rotation.y = tiltY;
      return ring;
    };

    const ring1 = createOrbitRing(85, Math.PI / 3, Math.PI / 6);
    const ring2 = createOrbitRing(98, -Math.PI / 4, Math.PI / 3);
    globeGroup.add(ring1);
    globeGroup.add(ring2);

    // 4. Orbiting Satellites (glowing pulsing nodes)
    const satelliteGeo = new THREE.SphereGeometry(2.5, 12, 12);
    const satelliteMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const sat1 = new THREE.Mesh(satelliteGeo, satelliteMat);
    const sat2 = new THREE.Mesh(satelliteGeo, new THREE.MeshBasicMaterial({ color: 0x10b981 }));
    globeGroup.add(sat1);
    globeGroup.add(sat2);

    // 5. Starfield / Space Dust background
    const starCount = 400;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 600;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 400;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 300 - 50;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x94a3b8,
      size: 1.2,
      transparent: true,
      opacity: 0.5,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // Mouse Interaction (Parallax Tilt)
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      mouseX = (x / rect.width) * 0.8;
      mouseY = (y / rect.height) * 0.8;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      clock += 0.015;

      // Base rotation
      globeGroup.rotation.y += 0.003;

      // Smooth mouse parallax lerp
      targetRotationY = mouseX * 0.6;
      targetRotationX = mouseY * 0.4;
      globeGroup.rotation.y += (targetRotationY - globeGroup.rotation.y) * 0.05;
      globeGroup.rotation.x += (targetRotationX - globeGroup.rotation.x) * 0.05;

      // Rotate individual orbital rings
      ring1.rotation.z = clock * 0.3;
      ring2.rotation.z = -clock * 0.2;

      // Move satellites along their orbits
      sat1.position.x = Math.cos(clock * 0.8) * 85;
      sat1.position.y = Math.sin(clock * 0.8) * 85 * Math.cos(Math.PI / 3);
      sat1.position.z = Math.sin(clock * 0.8) * 85 * Math.sin(Math.PI / 3);

      sat2.position.x = Math.cos(-clock * 0.6) * 98;
      sat2.position.y = Math.sin(-clock * 0.6) * 98 * Math.cos(-Math.PI / 4);
      sat2.position.z = Math.sin(-clock * 0.6) * 98 * Math.sin(Math.PI / 3);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
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
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden flex items-center justify-center opacity-70"
      style={{ perspective: 1000 }}
    />
  );
}

export default CyberGlobe3D;
