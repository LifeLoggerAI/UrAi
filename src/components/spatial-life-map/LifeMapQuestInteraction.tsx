"use client";

import { Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import * as THREE from "three";
import type { LifeMapStar } from "@/lib/spatial-life-map/lifeMap.types";

type LifeMapXRTarget =
  | { kind: "star"; star: LifeMapStar }
  | { kind: "route"; href: string; label: string }
  | { kind: "close" };

type XRControllerEvents = {
  addEventListener: (type: string, listener: (event: Event) => void) => void;
  removeEventListener: (type: string, listener: (event: Event) => void) => void;
};

const MENU_ROUTES = [
  { label: "Home", href: "/home" },
  { label: "Life Map", href: "/life-map" },
  { label: "Replay", href: "/replay" },
  { label: "Mirror", href: "/cognitive-mirror" },
  { label: "Narrator", href: "/narrator" },
  { label: "XR Preview", href: "/xr" },
];

const tempMatrix = new THREE.Matrix4();
const tempPosition = new THREE.Vector3();

type LifeMapQuestInteractionLayerProps = {
  stars: LifeMapStar[];
  selectedStar: LifeMapStar | null;
  activePath?: string;
  onHoverStar: (starId: string | null) => void;
  onSelectStar: (star: LifeMapStar) => void;
  onClosePanel: () => void;
  onNavigate: (href: string) => void;
};

function getTargetFromObject(object: THREE.Object3D, starsById: Map<string, LifeMapStar>): LifeMapXRTarget | null {
  const starId = typeof object.userData.lifeMapStarId === "string" ? object.userData.lifeMapStarId : null;
  if (starId) {
    const star = starsById.get(starId);
    return star ? { kind: "star", star } : null;
  }

  const href = typeof object.userData.lifeMapRoute === "string" ? object.userData.lifeMapRoute : null;
  if (href) {
    return {
      kind: "route",
      href,
      label: typeof object.userData.lifeMapRouteLabel === "string" ? object.userData.lifeMapRouteLabel : href,
    };
  }

  if (object.userData.lifeMapAction === "close") {
    return { kind: "close" };
  }

  return null;
}

function useXRPresenting() {
  const { gl } = useThree();
  const [presenting, setPresenting] = useState(false);
  const presentingRef = useRef(false);

  useFrame(() => {
    const nextPresenting = Boolean(gl.xr.enabled && gl.xr.isPresenting);
    if (presentingRef.current !== nextPresenting) {
      presentingRef.current = nextPresenting;
      setPresenting(nextPresenting);
    }
  });

  return presenting;
}

function CameraLockedGroup({ children, visible, position = [0, 0, -2.2] }: { children: ReactNode; visible: boolean; position?: [number, number, number] }) {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const offset = useMemo(() => new THREE.Vector3(position[0], position[1], position[2]), [position]);

  useFrame(() => {
    if (!groupRef.current || !visible) return;
    tempPosition.copy(offset);
    camera.localToWorld(tempPosition);
    groupRef.current.position.copy(tempPosition);
    groupRef.current.quaternion.copy(camera.quaternion);
  });

  return (
    <group ref={groupRef} visible={visible}>
      {children}
    </group>
  );
}

function FloatingInstructionPanel({ status }: { status: string }) {
  const presenting = useXRPresenting();

  return (
    <CameraLockedGroup visible={presenting} position={[0, 0.82, -2.35]}>
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[2.25, 0.42]} />
        <meshBasicMaterial color="#03111d" transparent opacity={0.78} side={THREE.DoubleSide} />
      </mesh>
      <Text position={[0, 0.08, 0]} fontSize={0.07} maxWidth={1.95} textAlign="center" anchorX="center" anchorY="middle" color="#dffaff" outlineWidth={0.002} outlineColor="#001018">
        Point + trigger to select. Grip/back to close.
      </Text>
      <Text position={[0, -0.1, 0]} fontSize={0.045} maxWidth={1.95} textAlign="center" anchorX="center" anchorY="middle" color="#9be7ff">
        {status}
      </Text>
    </CameraLockedGroup>
  );
}

function StarDetailsPanel({ selectedStar, onClosePanel }: { selectedStar: LifeMapStar | null; onClosePanel: () => void }) {
  const presenting = useXRPresenting();
  const title = selectedStar?.title ?? "Choose a Life Map star";
  const body = selectedStar?.narratorReflection ?? "Point either Quest controller at a glowing star and press trigger to select it. Your selected memory opens here inside VR.";
  const detail = selectedStar ? `${selectedStar.emotionalTone} - ${selectedStar.archetype} - ${selectedStar.date}` : "No selected node yet";

  return (
    <CameraLockedGroup visible={presenting} position={[0.78, 0.12, -2.35]}>
      <mesh position={[0, 0, -0.03]}>
        <planeGeometry args={[1.15, 0.86]} />
        <meshBasicMaterial color="#020914" transparent opacity={0.84} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.39, -0.02]}>
        <planeGeometry args={[1.15, 0.06]} />
        <meshBasicMaterial color={selectedStar?.auraColor ?? "#7dd3fc"} transparent opacity={0.55} side={THREE.DoubleSide} />
      </mesh>
      <Text position={[-0.48, 0.28, 0]} fontSize={0.055} maxWidth={0.95} anchorX="left" anchorY="middle" color="#e8fbff" outlineWidth={0.0015} outlineColor="#001018">
        {title}
      </Text>
      <Text position={[-0.48, 0.16, 0]} fontSize={0.034} maxWidth={0.95} anchorX="left" anchorY="middle" color="#9be7ff">
        {detail}
      </Text>
      <Text position={[-0.48, -0.06, 0]} fontSize={0.038} maxWidth={0.95} lineHeight={1.18} anchorX="left" anchorY="middle" color="#d7f9ff">
        {body}
      </Text>
      <group position={[0, -0.34, 0]}>
        <mesh
          userData={{ lifeMapAction: "close" }}
          onClick={(event) => {
            event.stopPropagation();
            onClosePanel();
          }}
        >
          <planeGeometry args={[0.48, 0.14]} />
          <meshBasicMaterial color="#12364a" transparent opacity={0.9} side={THREE.DoubleSide} />
        </mesh>
        <Text position={[0, 0, 0.01]} fontSize={0.04} anchorX="center" anchorY="middle" color="#f5fdff">
          Close panel
        </Text>
      </group>
    </CameraLockedGroup>
  );
}

function VRMenuButton({ label, href, active, position, onNavigate }: { label: string; href: string; active: boolean; position: [number, number, number]; onNavigate: (href: string) => void }) {
  return (
    <group position={position}>
      <mesh
        userData={{ lifeMapRoute: href, lifeMapRouteLabel: label }}
        onClick={(event) => {
          event.stopPropagation();
          onNavigate(href);
        }}
      >
        <planeGeometry args={[0.54, 0.16]} />
        <meshBasicMaterial color={active ? "#155e75" : "#07111f"} transparent opacity={active ? 0.92 : 0.78} side={THREE.DoubleSide} />
      </mesh>
      <Text position={[0, 0, 0.012]} fontSize={0.039} anchorX="center" anchorY="middle" color={active ? "#ffffff" : "#c7f7ff"}>
        {label}
      </Text>
    </group>
  );
}

function VRFloatingMenu({ activePath = "/life-map", onNavigate }: { activePath?: string; onNavigate: (href: string) => void }) {
  const presenting = useXRPresenting();

  return (
    <CameraLockedGroup visible={presenting} position={[0, -0.72, -2.45]}>
      <mesh position={[0, 0.02, -0.025]}>
        <planeGeometry args={[1.85, 0.48]} />
        <meshBasicMaterial color="#020914" transparent opacity={0.78} side={THREE.DoubleSide} />
      </mesh>
      <Text position={[0, 0.19, 0]} fontSize={0.041} anchorX="center" anchorY="middle" color="#9be7ff">
        Life Map VR menu
      </Text>
      {MENU_ROUTES.map((route, index) => {
        const x = (index % 3 - 1) * 0.6;
        const y = index < 3 ? 0.04 : -0.16;
        return (
          <VRMenuButton
            key={route.href}
            label={route.label}
            href={route.href}
            active={activePath === route.href}
            position={[x, y, 0]}
            onNavigate={onNavigate}
          />
        );
      })}
    </CameraLockedGroup>
  );
}

function QuestControllerRaycaster({ stars, onHoverStar, onSelectStar, onClosePanel, onNavigate, onStatusChange }: LifeMapQuestInteractionLayerProps & { onStatusChange: (status: string) => void }) {
  const { gl, scene } = useThree();
  const raycasterRef = useRef(new THREE.Raycaster());
  const targetsRef = useRef<Array<LifeMapXRTarget | null>>([null, null]);
  const hoveredStarRef = useRef<string | null>(null);
  const statusRef = useRef("");
  const starsById = useMemo(() => new Map(stars.map((star) => [star.id, star])), [stars]);
  const controllers = useMemo(() => [gl.xr.getController(0), gl.xr.getController(1)], [gl]);

  const setStatus = useCallback((status: string) => {
    if (statusRef.current === status) return;
    statusRef.current = status;
    onStatusChange(status);
  }, [onStatusChange]);

  const activateTarget = useCallback((target: LifeMapXRTarget | null) => {
    if (!target) return;
    if (target.kind === "star") onSelectStar(target.star);
    if (target.kind === "route") onNavigate(target.href);
    if (target.kind === "close") onClosePanel();
  }, [onClosePanel, onNavigate, onSelectStar]);

  useEffect(() => {
    const lines: THREE.Line[] = [];
    const selectHandlers: Array<(event: Event) => void> = [];
    const closeHandlers: Array<(event: Event) => void> = [];

    controllers.forEach((controller, index) => {
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -7.5)]);
      const lineMaterial = new THREE.LineBasicMaterial({ color: "#7dd3fc", transparent: true, opacity: 0.82 });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      line.name = `life-map-quest-controller-ray-${index}`;
      line.userData.lifeMapControllerRay = true;
      controller.add(line);
      lines.push(line);

      const handleSelectStart = () => activateTarget(targetsRef.current[index]);
      const handleCloseStart = () => onClosePanel();
      selectHandlers.push(handleSelectStart);
      closeHandlers.push(handleCloseStart);

      const controllerEvents = controller as unknown as XRControllerEvents;
      controllerEvents.addEventListener("selectstart", handleSelectStart);
      controllerEvents.addEventListener("squeezestart", handleCloseStart);
    });

    return () => {
      controllers.forEach((controller, index) => {
        const controllerEvents = controller as unknown as XRControllerEvents;
        controllerEvents.removeEventListener("selectstart", selectHandlers[index]);
        controllerEvents.removeEventListener("squeezestart", closeHandlers[index]);
      });
      lines.forEach((line) => {
        line.removeFromParent();
        line.geometry.dispose();
        const material = line.material;
        if (Array.isArray(material)) material.forEach((entry) => entry.dispose());
        else material.dispose();
      });
    };
  }, [activateTarget, controllers, onClosePanel]);

  useFrame(() => {
    if (!gl.xr.enabled || !gl.xr.isPresenting) {
      targetsRef.current = [null, null];
      setStatus("Desktop and touch controls stay active outside VR.");
      return;
    }

    const interactiveObjects: THREE.Object3D[] = [];
    scene.traverse((object) => {
      if (object.userData.lifeMapStarId || object.userData.lifeMapRoute || object.userData.lifeMapAction) {
        interactiveObjects.push(object);
      }
    });

    if (interactiveObjects.length === 0) {
      setStatus("No VR-selectable Life Map targets are available yet.");
      return;
    }

    let firstHoveredStar: string | null = null;
    let sawController = false;

    controllers.forEach((controller, index) => {
      const line = controller.children.find((child) => child.userData.lifeMapControllerRay) as THREE.Line | undefined;
      if (!controller.visible) {
        targetsRef.current[index] = null;
        if (line) line.visible = false;
        return;
      }

      sawController = true;
      if (line) line.visible = true;

      tempMatrix.identity().extractRotation(controller.matrixWorld);
      const raycaster = raycasterRef.current;
      raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
      raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix).normalize();
      raycaster.near = 0;
      raycaster.far = 8;

      const hit = raycaster.intersectObjects(interactiveObjects, false)[0];
      const target = hit ? getTargetFromObject(hit.object, starsById) : null;
      targetsRef.current[index] = target;

      if (line) {
        const material = line.material as THREE.LineBasicMaterial;
        material.color.set(target ? "#fef9c3" : "#7dd3fc");
        material.opacity = target ? 1 : 0.72;
        line.scale.z = hit ? Math.max(0.08, hit.distance / 7.5) : 1;
      }

      if (!firstHoveredStar && target?.kind === "star") {
        firstHoveredStar = target.star.id;
      }
    });

    if (!sawController) {
      targetsRef.current = [null, null];
      setStatus("Quest controllers not detected yet. Move or wake them, then point at a star.");
    } else {
      setStatus("Controller ray active. Aim at a star or VR menu button.");
    }

    if (hoveredStarRef.current !== firstHoveredStar) {
      hoveredStarRef.current = firstHoveredStar;
      onHoverStar(firstHoveredStar);
    }
  });

  return (
    <>
      {controllers.map((controller, index) => (
        <primitive key={index} object={controller} />
      ))}
    </>
  );
}

export default function LifeMapQuestInteractionLayer({ stars, selectedStar, activePath = "/life-map", onHoverStar, onSelectStar, onClosePanel, onNavigate }: LifeMapQuestInteractionLayerProps) {
  const [controllerStatus, setControllerStatus] = useState("Desktop and touch controls stay active outside VR.");

  return (
    <>
      <QuestControllerRaycaster
        stars={stars}
        selectedStar={selectedStar}
        activePath={activePath}
        onHoverStar={onHoverStar}
        onSelectStar={onSelectStar}
        onClosePanel={onClosePanel}
        onNavigate={onNavigate}
        onStatusChange={setControllerStatus}
      />
      <FloatingInstructionPanel status={controllerStatus} />
      <StarDetailsPanel selectedStar={selectedStar} onClosePanel={onClosePanel} />
      <VRFloatingMenu activePath={activePath} onNavigate={onNavigate} />
    </>
  );
}
