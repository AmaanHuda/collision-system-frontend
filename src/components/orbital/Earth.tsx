import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragment = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  uniform float uTime;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
  float noise(vec2 p){
    vec2 i = floor(p); vec2 f = fract(p);
    vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(hash(i), hash(i+vec2(1.0,0.0)), u.x),
               mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0; float a = 0.5;
    for(int i=0;i<5;i++){ v += a*noise(p); p *= 2.05; a *= 0.5; }
    return v;
  }

  void main() {
    vec3 ocean = vec3(0.023, 0.055, 0.115);
    vec3 land   = vec3(0.043, 0.145, 0.170);

    vec2 p = vec2(vUv.x * 7.0, vUv.y * 3.5);
    float m = fbm(p * 1.6) + 0.35 * fbm(p * 4.1);
    float landMask = smoothstep(0.82, 0.95, m);
    vec3 base = mix(ocean, land, landMask);

    // coastline glow
    float coast = smoothstep(0.80, 0.84, m) * (1.0 - smoothstep(0.90, 0.96, m));
    base += vec3(0.05, 0.42, 0.52) * coast * 0.45;

    // graticule
    float lon = abs(fract(vUv.x * 24.0) - 0.5) * 2.0;
    float lat = abs(fract(vUv.y * 12.0) - 0.5) * 2.0;
    float grid = max(smoothstep(0.985, 1.0, lon), smoothstep(0.985, 1.0, lat));
    base += vec3(0.06, 0.30, 0.38) * grid * 0.45;

    // terminator lighting
    vec3 lightDir = normalize(vec3(0.75, 0.35, 0.55));
    float diff = clamp(dot(normalize(vNormal), lightDir), 0.0, 1.0);
    float night = 1.0 - diff;
    base *= 0.30 + 0.95 * diff;

    // city lights on the night side
    float cities = smoothstep(0.86, 0.99, fbm(p * 9.0)) * landMask * night;
    base += vec3(0.55, 0.42, 0.18) * cities * 0.55;

    // fresnel atmosphere
    float fres = pow(1.0 - clamp(dot(normalize(vNormal), normalize(vViewDir)), 0.0, 1.0), 2.6);
    base += vec3(0.15, 0.62, 0.85) * fres * 0.85;

    // slow scan sweep
    float sweep = smoothstep(0.995, 1.0, sin(vUv.x * 6.2831 - uTime * 0.25) * 0.5 + 0.5);
    base += vec3(0.12, 0.55, 0.7) * sweep * 0.25;

    gl_FragColor = vec4(base, 1.0);
  }
`;

const atmoVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const atmoFragment = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    float fres = pow(1.0 - clamp(dot(normalize(vNormal), normalize(vViewDir)), 0.0, 1.0), 3.0);
    gl_FragColor = vec4(vec3(0.20, 0.68, 0.95), fres * 0.55);
  }
`;

export function Earth({ radius = 1 }: { radius?: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const globe = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const u = mat.current?.uniforms["uTime"];
    if (u) u.value = state.clock.elapsedTime;
    if (globe.current) globe.current.rotation.y += delta * 0.018;
  });

  return (
    <group>
      <mesh ref={globe}>
        <sphereGeometry args={[radius, 96, 96]} />
        <shaderMaterial
          ref={mat}
          vertexShader={vertex}
          fragmentShader={fragment}
          uniforms={{ uTime: { value: 0 } }}
        />
      </mesh>
      <mesh scale={1.055}>
        <sphereGeometry args={[radius, 64, 64]} />
        <shaderMaterial
          vertexShader={atmoVertex}
          fragmentShader={atmoFragment}
          transparent
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* equatorial reference ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 1.28, radius * 1.283, 128]} />
        <meshBasicMaterial
          color="#38d9f5"
          transparent
          opacity={0.18}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
