import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Stars } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

type Location = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
  color: string;
  stat: string;
};

const LOCATIONS: Location[] = [
  {
    id: "sf",
    name: "San Francisco",
    lat: 37.7749,
    lng: -122.4194,
    description: "Global HQ — Engineering & Product",
    color: "#3B82F6",
    stat: "450 engineers",
  },
  {
    id: "london",
    name: "London",
    lat: 51.5074,
    lng: -0.1278,
    description: "EMEA Hub — Sales & Partnerships",
    color: "#8B5CF6",
    stat: "120 team members",
  },
  {
    id: "tokyo",
    name: "Tokyo",
    lat: 35.6762,
    lng: 139.6503,
    description: "APAC Center — Localization & Growth",
    color: "#EC4899",
    stat: "85 team members",
  },
  {
    id: "sao-paulo",
    name: "São Paulo",
    lat: -23.5505,
    lng: -46.6333,
    description: "LATAM Operations — Emerging Markets",
    color: "#10B981",
    stat: "60 team members",
  },
  {
    id: "sydney",
    name: "Sydney",
    lat: -33.8688,
    lng: 151.2093,
    description: "ANZ Region — Infrastructure & Support",
    color: "#F59E0B",
    stat: "40 team members",
  },
  {
    id: "berlin",
    name: "Berlin",
    lat: 52.52,
    lng: 13.405,
    description: "EU Engineering — Privacy & Compliance",
    color: "#EF4444",
    stat: "95 team members",
  },
];

function latLngToVector3(
  lat: number,
  lng: number,
  radius: number,
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function Globe({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const globeRef = useRef<THREE.Mesh>(null);

  useFrame((_state, delta) => {
    if (globeRef.current && !selectedId) {
      globeRef.current.rotation.y += delta * 0.1;
    }
  });

  const wireframeMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#1e3a5f",
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      }),
    [],
  );

  const solidMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0a1929",
        roughness: 0.8,
        metalness: 0.2,
      }),
    [],
  );

  return (
    <group>
      <mesh ref={globeRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <primitive object={solidMaterial} attach="material" />
      </mesh>

      <mesh rotation={globeRef.current?.rotation ?? new THREE.Euler()}>
        <sphereGeometry args={[2.01, 32, 32]} />
        <primitive object={wireframeMaterial} attach="material" />
      </mesh>

      {LOCATIONS.map((loc) => {
        const pos = latLngToVector3(loc.lat, loc.lng, 2.05);
        const isSelected = selectedId === loc.id;

        return (
          <group key={loc.id} position={pos}>
            <mesh onClick={() => onSelect(loc.id)}>
              <sphereGeometry args={[isSelected ? 0.08 : 0.05, 16, 16]} />
              <meshBasicMaterial color={loc.color} />
            </mesh>

            {isSelected && (
              <Html distanceFactor={6} style={{ pointerEvents: "none" }}>
                <div className="bg-zinc-900/90 backdrop-blur border border-white/10 rounded-xl px-4 py-3 min-w-[200px] text-white">
                  <h4
                    className="font-bold text-sm"
                    style={{ color: loc.color }}
                  >
                    {loc.name}
                  </h4>
                  <p className="text-xs text-white/60 mt-1">
                    {loc.description}
                  </p>
                  <p
                    className="text-xs font-mono mt-1"
                    style={{ color: loc.color }}
                  >
                    {loc.stat}
                  </p>
                </div>
              </Html>
            )}

            <mesh position={[0, 0, 0]}>
              <ringGeometry
                args={[isSelected ? 0.12 : 0.08, isSelected ? 0.15 : 0.1, 32]}
              />
              <meshBasicMaterial
                color={loc.color}
                transparent
                opacity={0.3}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function Scene({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />
      <Stars radius={100} depth={50} count={2000} factor={4} fade speed={1} />
      <Globe selectedId={selectedId} onSelect={onSelect} />
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={8}
        autoRotate={!selectedId}
        autoRotateSpeed={0.5}
      />
    </>
  );
}

export function GlobeExplorer() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
      const idx = parseInt(e.key);
      if (idx >= 1 && idx <= LOCATIONS.length) {
        handleSelect(LOCATIONS[idx - 1].id);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleSelect]);

  const selectedLocation = LOCATIONS.find((l) => l.id === selectedId);

  return (
    <div className="w-full h-screen bg-[#030712] text-white flex">
      <div className="flex-1 relative">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <Scene selectedId={selectedId} onSelect={handleSelect} />
        </Canvas>

        <div className="absolute top-6 left-6">
          <h1 className="text-3xl font-black tracking-tight">
            Global Presence
          </h1>
          <p className="text-white/40 font-mono text-sm mt-1">
            Click a point or press 1-6 to explore
          </p>
        </div>
      </div>

      <div className="w-80 border-l border-white/10 bg-zinc-950 p-6 overflow-y-auto">
        <h3 className="font-mono text-xs text-white/40 uppercase tracking-wider mb-4">
          Locations
        </h3>
        <div className="space-y-2">
          {LOCATIONS.map((loc, i) => (
            <button
              key={loc.id}
              onClick={() => handleSelect(loc.id)}
              className={`w-full text-left p-3 rounded-xl transition-all border ${
                selectedId === loc.id
                  ? "bg-white/10 border-white/20"
                  : "bg-white/5 border-transparent hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: loc.color }}
                />
                <div>
                  <span className="font-mono text-xs text-white/30 mr-2">
                    [{i + 1}]
                  </span>
                  <span className="font-medium text-sm">{loc.name}</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <AnimatePresence>
          {selectedLocation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl"
            >
              <h4
                className="font-bold mb-2"
                style={{ color: selectedLocation.color }}
              >
                {selectedLocation.name}
              </h4>
              <p className="text-sm text-white/60 mb-3">
                {selectedLocation.description}
              </p>
              <div
                className="font-mono text-sm"
                style={{ color: selectedLocation.color }}
              >
                {selectedLocation.stat}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 text-xs text-white/20 font-mono">
          <p>Esc — Deselect</p>
          <p>Drag — Rotate globe</p>
          <p>Scroll — Zoom</p>
        </div>
      </div>
    </div>
  );
}
