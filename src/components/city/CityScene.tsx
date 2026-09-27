/* eslint-disable react-hooks/refs, react-hooks/immutability -- imperative three.js scene: objects are created once and mutated per frame in useFrame */
"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { generateCity } from "./layout";
import * as S from "./shaders";
import { DUSK_AT, SKY, nightAmount, smooth } from "./timeline";

export type ProgressRef = { current: number };
type PointerRef = { current: { x: number; y: number } };

/* ----------------------------- math helpers ----------------------------- */
const lerp = THREE.MathUtils.lerp;
const deg = THREE.MathUtils.degToRad;
const easeOutBack = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
const build = (p: number, order: number, win = 0.075) => {
  const t = Math.min(1, Math.max(0, (p - order) / win));
  return t <= 0 ? 0 : easeOutBack(t);
};
const UP = new THREE.Vector3(0, 1, 0);

/** THREE.Color converts the sRGB hex to linear, matching the CSS sky after output encoding. */
const lin = (hex: string, mul = 1) => new THREE.Color(hex).multiplyScalar(mul);
const KEYS = {
  sun: [lin(SKY.sun[0], 1.35), lin(SKY.sun[1], 1.25), lin(SKY.sun[2], 0.8)],
  ambient: [lin(SKY.ambient[0], 0.62), lin(SKY.ambient[1], 0.7), lin(SKY.ambient[2], 0.72)],
  fog: SKY.horizon.map((h) => lin(h)),
  sunDir: [
    new THREE.Vector3(0.55, 0.9, 0.35).normalize(),
    new THREE.Vector3(0.95, 0.2, -0.25).normalize(),
    new THREE.Vector3(-0.45, 0.75, -0.5).normalize(),
  ],
};
/** Three-key ramp (day → dusk → night) at night amount t. */
const keySpan = (t: number): [number, number] => (t < DUSK_AT ? [0, t / DUSK_AT] : [1, (t - DUSK_AT) / (1 - DUSK_AT)]);
function keyColor(out: THREE.Color, keys: THREE.Color[], t: number) {
  const [i, u] = keySpan(t);
  return out.copy(keys[i]).lerp(keys[i + 1], u);
}
function keyVector(out: THREE.Vector3, keys: THREE.Vector3[], t: number) {
  const [i, u] = keySpan(t);
  return out.copy(keys[i]).lerp(keys[i + 1], u).normalize();
}

function useOnce<T>(create: () => T): T {
  const ref = useRef<T | null>(null);
  if (ref.current === null) ref.current = create();
  return ref.current;
}

/* -------------------------------- scene -------------------------------- */
function City({ progress, pointer, lite }: { progress: ProgressRef; pointer: PointerRef; lite: boolean }) {
  const L = useOnce(() => generateCity(7, lite ? 48 : 96));

  // Uniforms shared by every custom material (same {value} objects, so one write updates all).
  const U = useOnce(() => ({
    uNight: { value: 0 },
    uTime: { value: 0 },
    uSunDir: { value: KEYS.sunDir[0].clone() },
    uSunColor: { value: KEYS.sun[0].clone() },
    uAmbient: { value: KEYS.ambient[0].clone() },
    uFogColor: { value: KEYS.fog[0].clone() },
    uFogNear: { value: 80 },
    uFogFar: { value: 240 },
  }));

  // ---------- buildings (+ their soft shadows) ----------
  const bld = useOnce(() => {
    const n = L.buildings.length;
    const color = new Float32Array(n * 3);
    const size = new Float32Array(n * 3);
    const seed = new Float32Array(n);
    const taper = new Float32Array(n);
    const built = new Float32Array(n);
    L.buildings.forEach((b, i) => {
      color.set(b.color, i * 3);
      size.set([b.w, b.h, b.d], i * 3);
      seed[i] = b.seed;
      taper[i] = b.spire ? 1 : 0;
    });
    const geo = new THREE.BoxGeometry(1, 1, 1);
    geo.translate(0, 0.5, 0);
    const builtAttr = new THREE.InstancedBufferAttribute(built, 1);
    geo.setAttribute("aColor", new THREE.InstancedBufferAttribute(color, 3));
    geo.setAttribute("aSize", new THREE.InstancedBufferAttribute(size, 3));
    geo.setAttribute("aSeed", new THREE.InstancedBufferAttribute(seed, 1));
    geo.setAttribute("aTaper", new THREE.InstancedBufferAttribute(taper, 1));
    geo.setAttribute("aBuild", builtAttr);
    const mat = new THREE.ShaderMaterial({
      vertexShader: S.buildingVert,
      fragmentShader: S.buildingFrag,
      uniforms: { ...U, uWindowLit: { value: lin("#ffc26e", 1.45) } },
    });

    const sGeo = new THREE.PlaneGeometry(1, 1);
    sGeo.rotateX(-Math.PI / 2);
    const sBuiltAttr = new THREE.InstancedBufferAttribute(built, 1);
    sGeo.setAttribute("aSize", new THREE.InstancedBufferAttribute(size, 3));
    sGeo.setAttribute("aBuild", sBuiltAttr);
    const sMat = new THREE.ShaderMaterial({
      vertexShader: S.shadowVert,
      fragmentShader: S.shadowFrag,
      uniforms: { uSunDir: U.uSunDir, uOpacity: { value: 0.34 } },
      transparent: true,
      depthWrite: false,
    });
    return { geo, mat, built, builtAttr, sGeo, sMat, sBuiltAttr };
  });

  // ---------- roads ----------
  const road = useOnce(() => {
    const built = new Float32Array(L.roadLines.length);
    const attr = new THREE.InstancedBufferAttribute(built, 1);
    const geo = new THREE.BoxGeometry(1, 0.05, 1);
    geo.translate(0, 0.025, 0);
    geo.setAttribute("aBuild", attr);
    const mat = new THREE.ShaderMaterial({ vertexShader: S.roadVert, fragmentShader: S.roadFrag, uniforms: U });
    return { geo, mat, built, attr };
  });

  // ---------- ground & sea ----------
  const ground = useOnce(() => ({
    mat: new THREE.ShaderMaterial({
      vertexShader: S.groundVert,
      fragmentShader: S.groundFrag,
      uniforms: { ...U, uPlan: { value: 1 }, uGrassA: { value: lin("#3f8f3a") }, uGrassB: { value: lin("#68b84e") } },
    }),
  }));
  const sea = useOnce(() => ({
    mat: new THREE.ShaderMaterial({
      vertexShader: S.seaVert,
      fragmentShader: S.seaFrag,
      uniforms: {
        ...U,
        uFadeStart: { value: 90 },
        uFadeEnd: { value: 150 },
        uBoats: { value: [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()] },
      },
      transparent: true,
      depthWrite: false,
    }),
  }));

  // ---------- trees (two-tier pines) ----------
  const treeGeo = useOnce(() => {
    const low = new THREE.ConeGeometry(0.3, 0.62, 7);
    low.translate(0, 0.42, 0);
    const high = new THREE.ConeGeometry(0.21, 0.5, 7);
    high.translate(0, 0.78, 0);
    return mergeGeometries([low, high])!;
  });

  // ---------- vehicles ----------
  const veh = useOnce(() => {
    const mk = (colors: [number, number, number][]) => {
      const g = new THREE.BoxGeometry(1, 1, 1);
      g.translate(0, 0.5, 0);
      const arr = new Float32Array(colors.length * 3);
      colors.forEach((c, i) => arr.set(c, i * 3));
      g.setAttribute("aColor", new THREE.InstancedBufferAttribute(arr, 3));
      return g;
    };
    const mat = new THREE.ShaderMaterial({ vertexShader: S.vehicleVert, fragmentShader: S.vehicleFrag, uniforms: U });
    return {
      carGeo: mk(L.cars.map((c) => c.color)),
      hullGeo: mk(L.boats.map((b) => b.color)),
      cabinGeo: mk(L.boats.map(() => [0.9, 0.92, 0.95] as [number, number, number])),
      mat,
    };
  });
  const beaconGeo = useOnce(() => new THREE.SphereGeometry(0.085, 8, 6));

  const bMesh = useRef<THREE.InstancedMesh>(null);
  const sMesh = useRef<THREE.InstancedMesh>(null);
  const rMesh = useRef<THREE.InstancedMesh>(null);
  const tMesh = useRef<THREE.InstancedMesh>(null);
  const cMesh = useRef<THREE.InstancedMesh>(null);
  const hullMesh = useRef<THREE.InstancedMesh>(null);
  const cabinMesh = useRef<THREE.InstancedMesh>(null);
  const beaconMesh = useRef<THREE.InstancedMesh>(null);
  const sunLight = useRef<THREE.DirectionalLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);

  // one-time static instance transforms
  useEffect(() => {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const v = new THREE.Vector3();
    const s = new THREE.Vector3();
    const all = [bMesh, sMesh, rMesh, tMesh, cMesh, hullMesh, cabinMesh, beaconMesh];
    L.buildings.forEach((b, i) => {
      bMesh.current!.setMatrixAt(i, m.makeTranslation(b.x, 0, b.z));
      sMesh.current!.setMatrixAt(i, m.makeTranslation(b.x, 0.056, b.z));
    });
    L.roadLines.forEach((r, i) => {
      q.setFromAxisAngle(UP, r.rot);
      m.compose(v.set(r.x, r.rot === 0 ? 0 : 0.004, r.z), q, s.set(r.len, 1, 1));
      rMesh.current!.setMatrixAt(i, m);
    });
    const c = new THREE.Color();
    L.trees.forEach((t, i) => {
      tMesh.current!.setMatrixAt(i, m.compose(v.set(t.x, 0, t.z), q.identity(), s.set(0, 0, 0)));
      tMesh.current!.setColorAt(i, c.setRGB(t.color[0] * 3.2, t.color[1] * 3.4, t.color[2] * 3.0));
    });
    for (const r of all) {
      const mesh = r.current!;
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      mesh.frustumCulled = false;
    }
    [cMesh, hullMesh, cabinMesh, beaconMesh].forEach((r) => r.current!.instanceMatrix.setUsage(THREE.DynamicDrawUsage));
  }, [L]);

  // scratch objects — nothing is allocated per frame
  const tmp = useOnce(() => ({
    m: new THREE.Matrix4(),
    q: new THREE.Quaternion(),
    s: new THREE.Vector3(),
    pos: new THREE.Vector3(),
    dir: new THREE.Vector3(),
    fwd: new THREE.Vector3(),
    right: new THREE.Vector3(),
    up: new THREE.Vector3(),
    look: new THREE.Vector3(),
    pointer: { x: 0, y: 0 },
    lastP: -1,
  }));

  useFrame((state, dt) => {
    const p = progress.current;
    const night = nightAmount(p);
    const t = state.clock.elapsedTime;
    const cam = state.camera as THREE.PerspectiveCamera;
    const { width, height } = state.size;
    const aspect = width / height;

    /* ---- camera: slow orbit + push-in, framed to leave the captions clear ---- */
    const px = tmp.pointer;
    px.x += (pointer.current.x - px.x) * Math.min(1, dt * 3);
    px.y += (pointer.current.y - px.y) * Math.min(1, dt * 3);
    const desktop = aspect >= 1.15;
    const vfov = aspect < 0.8 ? 40 : desktop ? 30 : 36;
    if (cam.fov !== vfov) {
      cam.fov = vfov;
      cam.updateProjectionMatrix();
    }
    const tanH = Math.tan(deg(vfov / 2));
    const yaw = deg(lerp(24, 68, smooth(0, 1, p)) + px.x * 2.5);
    const pitch = deg(lerp(lerp(34, 27, smooth(0, 0.6, p)), 22, smooth(0.6, 1, p)) + px.y * 1.5);
    const sx = desktop ? 0.655 : 0.5; // where the island centre sits across the screen
    const sy = desktop ? 0.53 : 0.4; // …and down it
    const fw = desktop ? 0.62 : 1.12; // share of the width the island may use
    const fh = desktop ? 0.86 : 0.6;
    const extentH = 44 * Math.sin(pitch) + 12 * Math.cos(pitch);
    let D = Math.max(44 / (fw * 2 * tanH * aspect), extentH / (fh * 2 * tanH));
    D *= lerp(1, 0.86, smooth(0.12, 0.62, p)) * lerp(1, 1.05, smooth(0.72, 1, p));
    tmp.dir.set(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch));
    tmp.fwd.copy(tmp.dir).negate();
    tmp.right.crossVectors(tmp.fwd, UP).normalize();
    tmp.up.crossVectors(tmp.right, tmp.fwd);
    // Pan instead of an off-centre projection, so nothing is stretched.
    const panR = -(sx - 0.5) * 2 * D * tanH * aspect;
    const panU = -(0.5 - sy) * 2 * D * tanH;
    tmp.look.set(0, lerp(0.6, 2.4, smooth(0.2, 1, p)), 0).addScaledVector(tmp.right, panR).addScaledVector(tmp.up, panU);
    cam.position.copy(tmp.look).addScaledVector(tmp.dir, D);
    cam.lookAt(tmp.look);

    /* ---- light & atmosphere ---- */
    U.uTime.value = t;
    U.uNight.value = night;
    keyColor(U.uSunColor.value, KEYS.sun, night);
    keyColor(U.uAmbient.value, KEYS.ambient, night);
    keyColor(U.uFogColor.value, KEYS.fog, night);
    keyVector(U.uSunDir.value, KEYS.sunDir, night);
    U.uFogNear.value = D * 0.95;
    U.uFogFar.value = D * 2.9;
    sea.mat.uniforms.uFadeStart.value = D * 1.05;
    sea.mat.uniforms.uFadeEnd.value = D * 1.8;
    bld.sMat.uniforms.uOpacity.value = lerp(0.34, 0.12, night);
    ground.mat.uniforms.uPlan.value = 1 - smooth(0.02, 0.3, p);
    if (sunLight.current) {
      sunLight.current.color.copy(U.uSunColor.value);
      sunLight.current.intensity = lerp(1.15, 0.7, night);
      sunLight.current.position.copy(U.uSunDir.value).multiplyScalar(40);
    }
    if (hemi.current) {
      hemi.current.color.copy(U.uFogColor.value).multiplyScalar(lerp(0.9, 0.6, night));
      hemi.current.groundColor.copy(U.uAmbient.value).multiplyScalar(0.6);
      hemi.current.intensity = lerp(0.9, 0.6, night);
    }
    const fog = state.scene.fog as THREE.Fog | null;
    if (fog) {
      fog.color.copy(U.uFogColor.value);
      fog.near = U.uFogNear.value;
      fog.far = U.uFogFar.value;
    }

    /* ---- construction (only when the scroll position moved) ---- */
    if (Math.abs(p - tmp.lastP) > 1e-4) {
      tmp.lastP = p;
      L.buildings.forEach((b, i) => {
        bld.built[i] = build(p, b.order, b.spire ? 0.12 : 0.075);
      });
      bld.builtAttr.needsUpdate = true;
      bld.sBuiltAttr.needsUpdate = true;
      L.roadLines.forEach((r, i) => {
        road.built[i] = smooth(r.order, r.order + 0.12, p);
      });
      road.attr.needsUpdate = true;
      const tm = tMesh.current!;
      L.trees.forEach((tr, i) => {
        const a = build(p, tr.order, 0.06) * tr.s;
        tm.setMatrixAt(i, tmp.m.compose(tmp.pos.set(tr.x, 0, tr.z), tmp.q.identity(), tmp.s.set(a, a, a)));
      });
      tm.instanceMatrix.needsUpdate = true;
    }

    /* ---- life: traffic, boats, aviation lights (every frame) ---- */
    const carsOn = smooth(0.46, 0.56, p);
    const cm = cMesh.current!;
    L.cars.forEach((c, i) => {
      const line = L.roadLines[c.line];
      const half = line.len / 2;
      let along = ((((c.phase + t * c.speed) % line.len) + line.len) % line.len) - half;
      if (c.lane < 0) along = -along;
      const edge = smooth(half, half - 0.9, Math.abs(along)); // shrink away at the island's edge
      const k = carsOn * edge * (road.built[c.line] > 0.99 ? 1 : 0);
      const alongX = line.rot === 0;
      if (alongX) {
        tmp.pos.set(along, 0.05, line.z + c.lane * 0.2);
        tmp.q.setFromAxisAngle(UP, c.lane > 0 ? 0 : Math.PI);
      } else {
        tmp.pos.set(line.x - c.lane * 0.2, 0.05, along);
        tmp.q.setFromAxisAngle(UP, c.lane > 0 ? -Math.PI / 2 : Math.PI / 2);
      }
      cm.setMatrixAt(i, tmp.m.compose(tmp.pos, tmp.q, tmp.s.set(0.34 * k, 0.13 * k, 0.19 * k)));
    });
    cm.instanceMatrix.needsUpdate = true;

    const boatsOn = smooth(0.5, 0.6, p);
    const hm = hullMesh.current!;
    const cb = cabinMesh.current!;
    const wakes = sea.mat.uniforms.uBoats.value as THREE.Vector3[];
    L.boats.forEach((b, i) => {
      const a = b.phase + t * b.speed;
      const hx = -Math.sin(a) * Math.sign(b.speed);
      const hz = Math.cos(a) * Math.sign(b.speed);
      const heading = Math.atan2(-hz, hx);
      const x = Math.cos(a) * b.radius;
      const z = Math.sin(a) * b.radius;
      tmp.q.setFromAxisAngle(UP, heading);
      hm.setMatrixAt(i, tmp.m.compose(tmp.pos.set(x, -0.36, z), tmp.q, tmp.s.set(1.05 * boatsOn, 0.32 * boatsOn, 0.42 * boatsOn)));
      cb.setMatrixAt(
        i,
        tmp.m.compose(tmp.pos.set(x - hx * 0.12, -0.05, z - hz * 0.12), tmp.q, tmp.s.set(0.42 * boatsOn, 0.22 * boatsOn, 0.3 * boatsOn)),
      );
      wakes[i].set(x - hx * 0.9, z - hz * 0.9, boatsOn);
    });
    hm.instanceMatrix.needsUpdate = true;
    cb.instanceMatrix.needsUpdate = true;

    const bm = beaconMesh.current!;
    const lightsOn = smooth(0.35, 0.75, night);
    L.beacons.forEach((bi, i) => {
      const b = L.buildings[bi];
      const blink = Math.sin(t * 2.4 + i * 1.7) > 0.35 ? 1 : 0.3;
      const k = lightsOn * blink * Math.min(1, bld.built[bi]);
      bm.setMatrixAt(i, tmp.m.compose(tmp.pos.set(b.x, b.h * Math.min(1, bld.built[bi]) + 0.1, b.z), tmp.q.identity(), tmp.s.set(k, k, k)));
    });
    bm.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <directionalLight ref={sunLight} position={[20, 30, 10]} intensity={1.2} />
      <hemisphereLight ref={hemi} intensity={0.9} />

      {/* island: grass plate on a sand beach */}
      <mesh position={[0, -0.15, 0]} material={ground.mat}>
        <boxGeometry args={[26.4, 0.3, 26.4]} />
      </mesh>
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[30.5, 0.34, 30.5]} />
        <meshStandardMaterial color="#f3e4ba" roughness={1} />
      </mesh>
      <mesh position={[0, -1.3, 0]}>
        <boxGeometry args={[30.1, 2, 30.1]} />
        <meshStandardMaterial color="#d2bd8e" roughness={1} />
      </mesh>
      <mesh position={[0, -0.32, 0]} rotation={[-Math.PI / 2, 0, 0]} material={sea.mat} renderOrder={-1}>
        <planeGeometry args={[900, 900]} />
      </mesh>

      <instancedMesh ref={rMesh} args={[road.geo, road.mat, L.roadLines.length]} />
      <instancedMesh ref={sMesh} args={[bld.sGeo, bld.sMat, L.buildings.length]} renderOrder={1} />
      <instancedMesh ref={bMesh} args={[bld.geo, bld.mat, L.buildings.length]} />
      <instancedMesh ref={tMesh} args={[treeGeo, undefined, L.trees.length]}>
        <meshStandardMaterial roughness={1} flatShading />
      </instancedMesh>
      <instancedMesh ref={cMesh} args={[veh.carGeo, veh.mat, L.cars.length]} />
      <instancedMesh ref={hullMesh} args={[veh.hullGeo, veh.mat, L.boats.length]} />
      <instancedMesh ref={cabinMesh} args={[veh.cabinGeo, veh.mat, L.boats.length]} />
      <instancedMesh ref={beaconMesh} args={[beaconGeo, undefined, L.beacons.length]}>
        <meshBasicMaterial color={lin("#ff2d2d", 4)} toneMapped={false} />
      </instancedMesh>
    </>
  );
}

/**
 * Phones render the city at 30 fps instead of every display frame: half the GPU work and a main
 * thread with room for the scroll-linked animations, on a section where scroll drives everything.
 */
function FrameCap({ enabled, fps }: { enabled: boolean; fps: number }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    let last = 0;
    const step = 1000 / fps;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (t - last >= step - 1) {
        last = t;
        invalidate();
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [enabled, fps, invalidate]);
  return null;
}

/* -------------------------------- canvas -------------------------------- */
export default function CityScene({ progress, active }: { progress: ProgressRef; active: boolean }) {
  const pointer = useRef({ x: 0, y: 0 });
  // Phones and low-core machines get half the traffic, no MSAA and a lower pixel-ratio cap.
  const lite = useOnce(
    () => typeof window !== "undefined" && (window.matchMedia("(max-width: 768px)").matches || (navigator.hardwareConcurrency ?? 8) <= 4),
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <Canvas
      frameloop={active ? (lite ? "demand" : "always") : "never"}
      dpr={lite ? [1, 1.25] : [1, 1.5]}
      gl={{
        antialias: !lite,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      camera={{ fov: 30, near: 0.5, far: 1200, position: [60, 50, 80] }}
      onCreated={({ scene, gl }) => {
        scene.fog = new THREE.Fog(SKY.horizon[0], 80, 240);
        gl.setClearColor(0x000000, 0);
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <FrameCap enabled={active && lite} fps={30} />
      <City progress={progress} pointer={pointer} lite={lite} />
    </Canvas>
  );
}
