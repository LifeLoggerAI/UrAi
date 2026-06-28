'use client';

import { useEffect, useRef } from 'react';

const STAR_COUNT = 96;
const FLOATS_PER_STAR = 7;
const VERTEX_SHADER = `
attribute vec3 a_position;
attribute float a_size;
attribute vec3 a_color;
uniform float u_time;
uniform vec2 u_resolution;
varying vec3 v_color;
varying float v_alpha;
varying float v_depth;

void main() {
  float drift = sin(u_time * 0.000075 + a_position.z * 0.01) * 0.018;
  vec3 position = a_position;
  position.x += drift;
  position.y += cos(u_time * 0.000055 + a_position.x * 2.0) * 0.012;

  float depth = 1.0 / (2.05 - position.z);
  vec2 projected = position.xy * depth;
  gl_Position = vec4(projected, position.z * 0.26, 1.0);
  gl_PointSize = a_size * depth * min(u_resolution.x, u_resolution.y) * 0.0065;
  v_color = a_color;
  v_depth = depth;
  v_alpha = clamp(depth * 0.12, 0.015, 0.18);
}
`;

const FRAGMENT_SHADER = `
precision mediump float;
varying vec3 v_color;
varying float v_alpha;
varying float v_depth;

void main() {
  vec2 uv = gl_PointCoord - vec2(0.5);
  float d = length(uv);
  float core = smoothstep(0.10, 0.0, d);
  float halo = smoothstep(0.48, 0.12, d) * 0.24;
  float alpha = (core + halo) * v_alpha;
  if (alpha < 0.01) discard;
  vec3 color = mix(v_color, vec3(1.0, 0.96, 0.82), core * 0.45);
  gl_FragColor = vec4(color, alpha);
}
`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  if (!vertexShader || !fragmentShader) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

function seededNoise(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function createStarData() {
  const data = new Float32Array(STAR_COUNT * FLOATS_PER_STAR);

  for (let i = 0; i < STAR_COUNT; i += 1) {
    const offset = i * FLOATS_PER_STAR;
    const ring = i / STAR_COUNT;
    const angle = i * 2.399963229728653;
    const radiusNoise = seededNoise(i + 17);
    const wobbleNoise = seededNoise(i + 31) - 0.5;
    const yNoise = seededNoise(i + 43) - 0.5;
    const depthNoise = seededNoise(i + 59);
    const sizeNoise = seededNoise(i + 73);
    const colorShift = seededNoise(i + 97);
    const spiralArm = i % 3;
    const armAngle = angle + spiralArm * 0.34;
    const radius = 0.18 + Math.sqrt(ring) * (0.78 + radiusNoise * 0.08);

    data[offset] = Math.cos(armAngle) * radius + wobbleNoise * 0.07;
    data[offset + 1] = Math.sin(armAngle) * radius * 0.34 + yNoise * 0.055;
    data[offset + 2] = -1.08 + depthNoise * 1.54;
    data[offset + 3] = 2.0 + sizeNoise * 2.1;
    data[offset + 4] = 0.50 + colorShift * 0.18;
    data[offset + 5] = 0.68 + colorShift * 0.13;
    data[offset + 6] = 0.92;
  }

  return data;
}

export default function WebGLLifeMapField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === 'undefined') return undefined;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      depth: false,
      powerPreference: 'high-performance',
    });

    if (!gl) return undefined;

    const program = createProgram(gl);
    if (!program) return undefined;

    const buffer = gl.createBuffer();
    if (!buffer) return undefined;

    const data = createStarData();
    const stride = FLOATS_PER_STAR * Float32Array.BYTES_PER_ELEMENT;
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const sizeLocation = gl.getAttribLocation(program, 'a_size');
    const colorLocation = gl.getAttribLocation(program, 'a_color');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrame = 0;
    let disposed = false;

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.useProgram(program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.disable(gl.DEPTH_TEST);

    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, stride, 0);

    gl.enableVertexAttribArray(sizeLocation);
    gl.vertexAttribPointer(sizeLocation, 1, gl.FLOAT, false, stride, 3 * Float32Array.BYTES_PER_ELEMENT);

    gl.enableVertexAttribArray(colorLocation);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, stride, 4 * Float32Array.BYTES_PER_ELEMENT);

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * ratio));
      canvas.height = Math.max(1, Math.floor(rect.height * ratio));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const render = (time: number) => {
      if (disposed) return;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.uniform1f(timeLocation, reduceMotion ? 0 : time);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.drawArrays(gl.POINTS, 0, STAR_COUNT);
      animationFrame = window.requestAnimationFrame(render);
    };

    resize();
    window.addEventListener('resize', resize);
    animationFrame = window.requestAnimationFrame(render);

    return () => {
      disposed = true;
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(animationFrame);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, []);

  return <canvas ref={canvasRef} className="webgl-life-map-field" aria-hidden />;
}
