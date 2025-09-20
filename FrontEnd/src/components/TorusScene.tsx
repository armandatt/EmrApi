"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export function TorusScene() {
  const ref = useRef<THREE.Points>(null!)

  const { positions, colors } = useMemo(() => {
    // ⬇️ reduced segments → less dense, airy feel
    const knot = new THREE.TorusKnotGeometry(0.8, 0.25, 300, 40)

    const pos = knot.attributes.position.array as Float32Array
    const colorArray = new Float32Array(pos.length)
    const color = new THREE.Color()

    for (let i = 0; i < pos.length; i += 3) {
      const t = i / pos.length
      color.setHSL(t, 0.8, 0.5) // softer rainbow glow
      color.toArray(colorArray, i)
    }

    return { positions: pos, colors: colorArray }
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ref.current) {
      ref.current.rotation.y = t * 0.15
      ref.current.rotation.x = Math.sin(t * 0.08) * 0.12
    }
  })

  return (
    <points ref={ref} scale={0.8}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        size={0.015} // ⬇️ smaller point size
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.7} // ⬇️ softer glow
      />
    </points>
  )
}
