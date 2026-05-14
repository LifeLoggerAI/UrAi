'use client';

import { useEffect, useRef } from 'react';

const STAR_COUNT = 220;
const FLOATS_PER_STAR = 7;
const VERTEX_SHADER = `
attribute vec3 a_position;
attribute float a_size;
attribute vec3 a_color;
uniform float u_time;
uniform vec2 u_resolution;
varying vec3 v_color;
varying float v_alpha;

void main() {
  float drift = sin(u_time * 0.00012 + a_position.z * 0.008) * 0.035;
  vec3 position = a_position;
  position.x += drift;
  position.y += cos(u_time * 0.00010 + a_position.x * 2.0) * 0.025;

  float depth = 1.0 / (1.85 - position.z);
  vec2 projected = position.xy * depth;
  gl_Position = vec4(projected, position.z * 0.34, 1.0);
  gl_PointSize = a_size * depth * min(u_resolution.x, u_resolution.y) * 0.010;
  v_color = a_color;
  v_alpha = clamp(depth * 0.22, 0.04, 0.36);
}
`;

const FRAGMENT_SHADER = `
precision mediump float;
varying vec3 v_color;
varying float v_alpha;

void main() {
  vec2 uv = gl_PointCoord - vec2(0.5);
  float d = length(uv);
  float core = smoothstep(0.12, 0.0, d);
  float halo = smoothstep(0.44, 0.10, d) * 0.16;
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

function createStarData() {
  const data = new Float32Array(STAR_COUNT * FLOATS_PER_STAR);

  for (let i = 0; i < STAR_COUNT; i += 1) {
    const offset = i * FLOATS_PER_STAR;
    const ring = i / STAR_COUNT;
    const angle = i * 2.399963229728653;
    const radius = 0.12 + Math.sqrt(ring) * 0.96;
    const wobble = (Math.random() - 0.5) * 0.16;
    const colorShift = Math.random();

    data[offset] = Math.cos(angle) * radius + wobble;
    data[offset + 1] = Math.sin(angle) * radius * 0.58 + (Math.random() - 0.5) * 0.16;
    data[offset + 2] = -1.0 + Math.random() * 1.72;
    data[offset + 3] = 2.0 + Math.random() * 3.2;
    data[offset + 4] = 0.42 + colorShift * 0.22;
    data[offset + 5] = 0.62 + colorShift * 0.18;
    data[offset + 6] = 0.95;
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
