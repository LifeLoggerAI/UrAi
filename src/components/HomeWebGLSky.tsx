'use client';

import { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 280;
const FLOATS_PER_PARTICLE = 7;

const VERTEX_SHADER = `
attribute vec3 a_position;
attribute float a_size;
attribute vec3 a_color;
uniform float u_time;
uniform vec2 u_resolution;
varying vec3 v_color;
varying float v_alpha;

void main() {
  float lift = mod(a_position.y + u_time * 0.000026, 2.4) - 1.2;
  float sway = sin(u_time * 0.00012 + a_position.z * 8.0 + a_position.x * 2.0) * 0.038;
  vec3 position = vec3(a_position.x + sway, lift, a_position.z);
  float depth = 1.0 / (1.7 - position.z);
  vec2 projected = position.xy * depth;
  gl_Position = vec4(projected, position.z * 0.3, 1.0);
  gl_PointSize = a_size * depth * min(u_resolution.x, u_resolution.y) * 0.014;
  v_color = a_color;
  v_alpha = clamp(depth * 0.24, 0.035, 0.34);
}
`;

const FRAGMENT_SHADER = `
precision mediump float;
varying vec3 v_color;
varying float v_alpha;

void main() {
  vec2 uv = gl_PointCoord - vec2(0.5);
  float d = length(uv);
  float core = smoothstep(0.14, 0.0, d);
  float halo = smoothstep(0.48, 0.12, d) * 0.16;
  float alpha = (core + halo) * v_alpha;
  if (alpha < 0.012) discard;
  gl_FragColor = vec4(v_color, alpha);
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

function createParticleData() {
  const data = new Float32Array(PARTICLE_COUNT * FLOATS_PER_PARTICLE);

  for (let i = 0; i < PARTICLE_COUNT; i += 1) {
    const offset = i * FLOATS_PER_PARTICLE;
    const ring = i / PARTICLE_COUNT;
    const angle = i * 2.399963229728653;
    const radius = 0.22 + Math.sqrt(ring) * 1.12;
    const colorShift = Math.random();

    data[offset] = Math.cos(angle) * radius + (Math.random() - 0.5) * 0.16;
    data[offset + 1] = Math.sin(angle) * radius * 0.74 + (Math.random() - 0.5) * 0.22;
    data[offset + 2] = -1.0 + Math.random() * 1.76;
    data[offset + 3] = 2.0 + Math.random() * 3.6;
    data[offset + 4] = 0.46 + colorShift * 0.3;
    data[offset + 5] = 0.62 + colorShift * 0.2;
    data[offset + 6] = 0.95;
  }

  return data;
}

export default function HomeWebGLSky() {
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
    const buffer = gl.createBuffer();
    if (!program || !buffer) return undefined;

    const data = createParticleData();
    const stride = FLOATS_PER_PARTICLE * Float32Array.BYTES_PER_ELEMENT;
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
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.disable(gl.DEPTH_TEST);

    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, stride, 0);

    gl.enableVertexAttribArray(sizeLocation);
    gl.vertexAttribPointer(sizeLocation, 1, gl.FLOAT, false, stride, 3 * Float32Array.BYTES_PER_ELEMENT);

    gl.enableVertexAttribArray(colorLocation);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, stride, 4 * Float32Array.BYTES_PER_ELEMENT);

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
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
      gl.drawArrays(gl.POINTS, 0, PARTICLE_COUNT);
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

  return <canvas ref={canvasRef} className="home-webgl-sky" aria-hidden />;
}
