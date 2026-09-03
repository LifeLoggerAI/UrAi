"use client";

import { Text } from "@react-three/drei";
import { type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { AnimatedRuntimeGLB, URAI_SPATIAL_AUTHORITY } from "@/components/urai/real3d/RuntimeGLB";
import { type HomeTargetId, type HomeXRTarget, homeXRTargets } from "./HomeXRTargets";

const PORTAL_TARGETS = new Set<HomeTargetId>(["life-map", "ground", "replay", "mirror", "xr-preview"]);

function InteractionVolume({
  target,
  onHover,
  onSelect,
  register,
}: {
  target: HomeXRTarget;
  onHover: (id: HomeTargetId | null) => void;
  onSelect: (target: HomeXRTarget) => void;
  register: (id: HomeTargetId, mesh: THREE.Mesh | null) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    register(target.id, meshRef.current);
    return () => register(target.id, null);
  }, [register, target.id]);

  const handlePointerOver = useCallback((event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    onHover(target.id);
  }, [onHover, target.id]);

  const handlePointerOut = useCallback((event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    onHover(null);
  }, [onHover]);

  const handleClick = useCallback((event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(target);
  }, [onSelect, target]);

  return (
    <mesh
      ref={meshRef}
      name={`home-xr-hit-volume-${target.id}`}
      userData={{ homeXRTargetId: target.id, presentation: "invisible-physical-hit-volume" }}
      position={target.position}
      scale={target.scale}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
    </mesh>
  );
}

function WorldGateway({ target, hovered, selected }: { target: HomeXRTarget; hovered: boolean; selected: boolean }) {
  if (!PORTAL_TARGETS.has(target.id)) return null;
  const clip = selected ? "Portal_Opening" : hovered ? "Portal_Attention" : "Portal_Available";
  return (
    <AnimatedRuntimeGLB
      src={URAI_SPATIAL_AUTHORITY.portal}
      name={`home-world-gateway-${target.id}`}
      position={target.position}
      scale={0.34}
      clip={clip}
      loop={!selected}
      fadeSeconds={0.18}
    />
  );
}

function OrbPresence({ target, hovered }: { target: HomeXRTarget; hovered: boolean }) {
  return (
    <AnimatedRuntimeGLB
      src={URAI_SPATIAL_AUTHORITY.orb}
      name="home-promoted-orb-avatar"
      position={target.position}
      scale={0.46}
      clip={hovered ? "Orb_Attention" : "Orb_Idle"}
      loop
      fadeSeconds={0.22}
    />
  );
}

function ControllerFallbackPanel({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <group position={[0, 1.25, -2.0]}>
      <mesh scale={[1.8, 0.42, 0.04]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#241a12" transparent opacity={0.82} roughness={0.9} />
      </mesh>
      <Text position={[0, 0, 0.045]} fontSize={0.065} anchorX="center" anchorY="middle" maxWidth={1.55} color="#f6e7c8">
        No XR controllers are connected. Reconnect a controller, or exit immersive mode to continue with desktop or touch controls.
      </Text>
    </group>
  );
}

function addControllerRay(controller: THREE.Group, color: number) {
  if (controller.getObjectByName("home-xr-controller-ray")) return;
  const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -5)]);
  const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.7 });
  const line = new THREE.Line(geometry, material);
  line.name = "home-xr-controller-ray";
  controller.add(line);
}

export function HomeXRInteractionLayer() {
  const router = useRouter();
  const { gl, scene } = useThree();
  const targetsByMesh = useRef(new Map<THREE.Mesh, HomeXRTarget>());
  const targetsById = useMemo(() => new Map(homeXRTargets.map((target) => [target.id, target])), []);
  const controllers = useRef<THREE.Group[]>([]);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const controllerMatrix = useMemo(() => new THREE.Matrix4(), []);
  const hoveredRef = useRef<HomeTargetId | null>(null);
  const [hoveredId, setHoveredId] = useState<HomeTargetId | null>(null);
  const [selectedId, setSelectedId] = useState<HomeTargetId | null>(null);
  const [isPresenting, setIsPresenting] = useState(false);
  const [connectedControllerCount, setConnectedControllerCount] = useState(0);

  const setHovered = useCallback((id: HomeTargetId | null) => {
    hoveredRef.current = id;
    setHoveredId(id);
  }, []);

  const selectTarget = useCallback((target: HomeXRTarget) => {
    setSelectedId(target.id);
    router.push(target.href);
  }, [router]);

  const register = useCallback((id: HomeTargetId, mesh: THREE.Mesh | null) => {
    const target = targetsById.get(id);
    if (!target) return;
    for (const [registeredMesh, registeredTarget] of targetsByMesh.current.entries()) {
      if (registeredTarget.id === id) targetsByMesh.current.delete(registeredMesh);
    }
    if (mesh) targetsByMesh.current.set(mesh, target);
  }, [targetsById]);

  useEffect(() => {
    const renderer = gl as THREE.WebGLRenderer;
    const nextControllers = [renderer.xr.getController(0), renderer.xr.getController(1)];
    controllers.current = nextControllers;

    function updateConnectedCount() {
      setConnectedControllerCount(nextControllers.filter((controller) => controller.userData.homeXRConnected).length);
    }
    function handleConnected(this: THREE.Group, event: THREE.Event & { data?: { handedness?: string } }) {
      this.userData.homeXRConnected = true;
      addControllerRay(this, event.data?.handedness === "left" ? 0x9ee7e8 : 0xd8bd9d);
      updateConnectedCount();
    }
    function handleDisconnected(this: THREE.Group) {
      this.userData.homeXRConnected = false;
      updateConnectedCount();
    }
    function handleSelectStart() {
      const target = hoveredRef.current ? targetsById.get(hoveredRef.current) : null;
      if (target) selectTarget(target);
    }
    function handleSqueezeStart() {
      setSelectedId(null);
      setHovered(null);
    }

    nextControllers.forEach((controller) => {
      controller.addEventListener("connected", handleConnected as never);
      controller.addEventListener("disconnected", handleDisconnected as never);
      controller.addEventListener("selectstart", handleSelectStart as never);
      controller.addEventListener("squeezestart", handleSqueezeStart as never);
      scene.add(controller);
    });
    return () => {
      nextControllers.forEach((controller) => {
        controller.removeEventListener("connected", handleConnected as never);
        controller.removeEventListener("disconnected", handleDisconnected as never);
        controller.removeEventListener("selectstart", handleSelectStart as never);
        controller.removeEventListener("squeezestart", handleSqueezeStart as never);
        scene.remove(controller);
      });
    };
  }, [gl, scene, selectTarget, setHovered, targetsById]);

  useFrame(() => {
    const renderer = gl as THREE.WebGLRenderer;
    const presenting = renderer.xr.isPresenting;
    if (presenting !== isPresenting) setIsPresenting(presenting);
    const targetMeshes = Array.from(targetsByMesh.current.keys());
    if (!presenting || targetMeshes.length === 0) return;

    let nextHovered: HomeTargetId | null = null;
    for (const controller of controllers.current) {
      if (!controller.userData.homeXRConnected) continue;
      controllerMatrix.identity().extractRotation(controller.matrixWorld);
      raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
      raycaster.ray.direction.set(0, 0, -1).applyMatrix4(controllerMatrix);
      const [hit] = raycaster.intersectObjects(targetMeshes, false);
      if (hit?.object instanceof THREE.Mesh) {
        const target = targetsByMesh.current.get(hit.object);
        if (target) { nextHovered = target.id; break; }
      }
    }
    if (nextHovered !== hoveredRef.current) setHovered(nextHovered);
  });

  const orbTarget = targetsById.get("orb-chat");

  return (
    <group name="home-xr-interaction-layer" userData={{ visualLanguage: "physical-world-not-dashboard" }}>
      <ControllerFallbackPanel visible={isPresenting && connectedControllerCount === 0} />

      {homeXRTargets.map((target) => (
        <group key={target.id}>
          <InteractionVolume target={target} onHover={setHovered} onSelect={selectTarget} register={register} />
          <WorldGateway target={target} hovered={hoveredId === target.id} selected={selectedId === target.id} />
        </group>
      ))}

      {orbTarget ? <OrbPresence target={orbTarget} hovered={hoveredId === "orb-chat"} /> : null}
    </group>
  );
}
