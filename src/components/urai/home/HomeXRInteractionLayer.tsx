"use client";

import { Text } from "@react-three/drei";
import { ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { HomeTargetId, HomeXRTarget, homeXRTargets } from "./HomeXRTargets";

function TargetButton({
  target,
  hovered,
  selected,
  onHover,
  onSelect,
  register,
}: {
  target: HomeXRTarget;
  hovered: boolean;
  selected: boolean;
  onHover: (id: HomeTargetId | null) => void;
  onSelect: (target: HomeXRTarget) => void;
  register: (id: HomeTargetId, mesh: THREE.Mesh | null) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    register(target.id, meshRef.current);
    return () => register(target.id, null);
  }, [register, target.id]);

  const handlePointerOver = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();
      onHover(target.id);
    },
    [onHover, target.id],
  );

  const handlePointerOut = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();
      onHover(null);
    },
    [onHover],
  );

  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();
      onSelect(target);
    },
    [onSelect, target],
  );

  return (
    <group position={target.position}>
      <mesh
        ref={meshRef}
        name={`home-xr-target-${target.id}`}
        userData={{ homeXRTargetId: target.id }}
        scale={target.scale}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={selected ? "#ffffff" : hovered ? "#e0f2fe" : target.color}
          emissive={selected ? "#ffffff" : hovered ? target.color : "#000000"}
          emissiveIntensity={selected ? 0.62 : hovered ? 0.34 : 0.08}
          transparent
          opacity={selected ? 0.92 : hovered ? 0.82 : 0.58}
          roughness={0.25}
          metalness={0.05}
        />
      </mesh>
      <Text
        position={[0, 0.02, 0.07]}
        fontSize={0.115}
        anchorX="center"
        anchorY="middle"
        maxWidth={1.1}
        color="#020617"
        outlineWidth={0.003}
        outlineColor="#ffffff"
      >
        {target.label}
      </Text>
    </group>
  );
}

function InfoPanel({ selectedTarget }: { selectedTarget: HomeXRTarget | null }) {
  return (
    <group position={[0, 3.55, -3.35]}>
      <mesh scale={[2.5, 0.72, 0.06]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#020617" emissive="#082f49" emissiveIntensity={0.18} transparent opacity={0.84} />
      </mesh>
      <Text position={[0, 0.16, 0.06]} fontSize={0.105} anchorX="center" anchorY="middle" maxWidth={2.15} color="#cffafe">
        Point + trigger to select. Grip/back to close.
      </Text>
      <Text position={[0, -0.12, 0.06]} fontSize={0.075} anchorX="center" anchorY="middle" maxWidth={2.15} color="#e2e8f0">
        {selectedTarget ? `${selectedTarget.label}: ${selectedTarget.helper}` : "Aim at a Home target or floating menu button."}
      </Text>
    </group>
  );
}

function ControllerFallbackPanel({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <group position={[0, 0.08, -1.55]}>
      <mesh scale={[2.2, 0.56, 0.06]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#451a03" emissive="#92400e" emissiveIntensity={0.25} transparent opacity={0.9} />
      </mesh>
      <Text position={[0, 0.08, 0.06]} fontSize={0.08} anchorX="center" anchorY="middle" maxWidth={1.9} color="#fef3c7">
        VR session is active, but no XR controllers are connected yet.
      </Text>
      <Text position={[0, -0.12, 0.06]} fontSize={0.058} anchorX="center" anchorY="middle" maxWidth={1.9} color="#fde68a">
        Wake controllers. Desktop and touch interaction remain available.
      </Text>
    </group>
  );
}

function addControllerRay(controller: THREE.Group, color: number) {
  if (controller.getObjectByName("home-xr-controller-ray")) return;

  const geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, -5),
  ]);
  const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.86 });
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

  const selectTarget = useCallback(
    (target: HomeXRTarget) => {
      setSelectedId(target.id);
      router.push(target.href);
    },
    [router],
  );

  const register = useCallback(
    (id: HomeTargetId, mesh: THREE.Mesh | null) => {
      const target = targetsById.get(id);
      if (!target) return;

      for (const [registeredMesh, registeredTarget] of targetsByMesh.current.entries()) {
        if (registeredTarget.id === id) targetsByMesh.current.delete(registeredMesh);
      }

      if (mesh) targetsByMesh.current.set(mesh, target);
    },
    [targetsById],
  );

  useEffect(() => {
    const renderer = gl as THREE.WebGLRenderer;
    const nextControllers = [renderer.xr.getController(0), renderer.xr.getController(1)];
    controllers.current = nextControllers;

    function updateConnectedCount() {
      setConnectedControllerCount(nextControllers.filter((controller) => controller.userData.homeXRConnected).length);
    }

    function handleConnected(this: THREE.Group, event: THREE.Event & { data?: { handedness?: string } }) {
      this.userData.homeXRConnected = true;
      addControllerRay(this, event.data?.handedness === "left" ? 0x67e8f9 : 0xf0abfc);
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
        if (target) {
          nextHovered = target.id;
          break;
        }
      }
    }

    if (nextHovered !== hoveredRef.current) setHovered(nextHovered);
  });

  const selectedTarget = selectedId ? targetsById.get(selectedId) ?? null : null;

  return (
    <group name="home-xr-interaction-layer">
      <InfoPanel selectedTarget={selectedTarget} />
      <ControllerFallbackPanel visible={isPresenting && connectedControllerCount === 0} />
      <group name="home-xr-floating-navigation">
        {homeXRTargets.map((target) => (
          <TargetButton
            key={target.id}
            target={target}
            hovered={hoveredId === target.id}
            selected={selectedId === target.id}
            onHover={setHovered}
            onSelect={selectTarget}
            register={register}
          />
        ))}
      </group>
      <mesh position={[0, 1.42, -2.18]}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial color="#bae6fd" emissive="#22d3ee" emissiveIntensity={0.55} transparent opacity={0.72} />
      </mesh>
    </group>
  );
}
