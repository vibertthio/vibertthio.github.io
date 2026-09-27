import React, { useEffect, useRef } from "react";
import {
  DoubleSide,
  DynamicDrawUsage,
  Float32BufferAttribute,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  RawShaderMaterial,
  Raycaster,
  Scene,
  Vector2,
  WebGLRenderer,
} from "three";
import planeVert from "./shaders/plane.vert?raw";
import planeFrag from "./shaders/plane.frag?raw";

const RESOLUTION = 128;

export default function FlowerBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    let renderer;
    try {
      renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch {
      // Leave the existing backdrop in place if WebGL is unavailable.
      return;
    }

    // Restore the original flower's geometry, shaders, and camera movement.
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight);
    camera.position.z = -1.3;

    const geometry = new PlaneGeometry(0.5, 0.5, RESOLUTION, RESOLUTION);
    const extent = new Float32BufferAttribute(new Float32Array((RESOLUTION + 1) ** 2), 1);
    extent.setUsage(DynamicDrawUsage);
    geometry.setAttribute("extent", extent);

    const material = new RawShaderMaterial({
      vertexShader: planeVert,
      fragmentShader: planeFrag,
      transparent: true,
      side: DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uNoiseScale: { value: 2 },
        uOffsetScale: { value: 0.1 },
        uValue1: { value: 0.01 },
        uValue2: { value: 1 },
      },
    });
    const flower = new Mesh(geometry, material);
    // The vertex shader deforms the plane beyond its original bounds.
    flower.frustumCulled = false;
    scene.add(flower);

    const raycaster = new Raycaster();
    const pointer = new Vector2();
    let mouseX = 0;
    let mouseY = 0;
    let frame;
    let previousTime = null;

    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const move = (event) => {
      mouseX = (event.clientX - window.innerWidth / 2) * 0.0025;
      mouseY = (event.clientY - window.innerHeight / 2) * 0.0025;
      pointer.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObject(flower)[0];
      if (hit?.face) {
        for (const vertex of [hit.face.a, hit.face.b, hit.face.c]) {
          extent.array[vertex] = 1;
        }
        extent.needsUpdate = true;
      }
    };

    const tick = (time) => {
      const dt = previousTime === null ? 0 : Math.min((time - previousTime) / 1000, 0.1);
      previousTime = time;
      material.uniforms.uTime.value += dt;

      for (let i = 0; i < extent.array.length; i++) {
        extent.array[i] = Math.max(0, extent.array[i] - 0.3 * dt);
      }
      extent.needsUpdate = true;

      camera.position.x += (mouseX - camera.position.x) * (1 - 0.7 ** (dt * 60));
      camera.position.y += (-mouseY - camera.position.y) * (1 - 0.5 ** (dt * 60));
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    };

    const onVisibilityChange = () => {
      cancelAnimationFrame(frame);
      previousTime = null;
      if (!document.hidden) frame = requestAnimationFrame(tick);
    };

    resize();
    onVisibilityChange();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, []);

  return <canvas ref={canvasRef} className="flower-canvas" aria-hidden="true" />;
}
