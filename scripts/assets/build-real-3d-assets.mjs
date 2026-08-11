import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

const OUTPUT_DIR = join(process.cwd(), 'public/assets/urai/real-3d');
const ASPECT = '5:4';

if (typeof globalThis.FileReader === 'undefined') {
  globalThis.FileReader = class NodeFileReader {
    result = null;
    onload = null;
    onloadend = null;
    onerror = null;
    async #complete(blob, dataUrl) {
      try {
        const arrayBuffer = await blob.arrayBuffer();
        this.result = dataUrl
          ? `data:${blob.type || 'application/octet-stream'};base64,${Buffer.from(arrayBuffer).toString('base64')}`
          : arrayBuffer;
        this.onload?.({ target: this });
        this.onloadend?.({ target: this });
      } catch (error) {
        this.onerror?.(error);
        throw error;
      }
    }
    readAsArrayBuffer(blob) { void this.#complete(blob, false); }
    readAsDataURL(blob) { void this.#complete(blob, true); }
  };
}

function material(name, color, roughness = 0.8, metalness = 0, options = {}) {
  const physical = options.transmission || options.opacity !== undefined;
  const Mat = physical ? THREE.MeshPhysicalMaterial : THREE.MeshStandardMaterial;
  const mat = new Mat({
    name,
    color,
    roughness,
    metalness,
    transparent: options.opacity !== undefined && options.opacity < 1,
    opacity: options.opacity ?? 1,
    transmission: options.transmission ?? 0,
    thickness: options.thickness ?? 0,
    ior: options.ior ?? 1.5,
    side: options.doubleSide ? THREE.DoubleSide : THREE.FrontSide,
  });
  return mat;
}

const M = {
  skin: material('skin', '#b8795e', 0.56),
  skinDark: material('skin-dark', '#704937', 0.56),
  skinLight: material('skin-light', '#d1a184', 0.56),
  hair: material('hair', '#241a15', 0.94),
  clothBlue: material('cloth-blue', '#2c3d50', 0.9),
  clothGray: material('cloth-gray', '#55595e', 0.9),
  clothWarm: material('cloth-warm', '#625548', 0.9),
  trouser: material('trouser', '#25292e', 0.92),
  shoe: material('shoe', '#171718', 0.72, 0.02),
  eyeWhite: material('eye-white', '#f0efe9', 0.32),
  eye: material('eye', '#293532', 0.25),
  lip: material('lip', '#7b4944', 0.68),
  grass: material('grass', '#4f6246', 0.98),
  grassLight: material('grass-light', '#6f7d5d', 1),
  bark: material('bark', '#513a2a', 0.98),
  leaf: material('leaf', '#365039', 0.97),
  rock: material('rock', '#716f68', 0.96),
  stone: material('stone', '#696762', 0.94, 0.01),
  stoneDark: material('stone-dark', '#343538', 0.94, 0.01),
  stoneWarm: material('stone-warm', '#80776b', 0.9, 0.01),
  wood: material('wood', '#4c3528', 0.82, 0.01),
  woodDark: material('wood-dark', '#34251c', 0.87, 0.01),
  metal: material('metal', '#44484a', 0.42, 0.55),
  bronze: material('bronze', '#775943', 0.42, 0.46),
  water: material('water', '#5c8290', 0.12, 0.02, { opacity: 0.72, transmission: 0.2, thickness: 0.08, ior: 1.33 }),
  glass: material('glass', '#8fa4b2', 0.08, 0.01, { opacity: 0.36, transmission: 0.62, thickness: 0.08, ior: 1.46, doubleSide: true }),
  mirror: material('mirror', '#9ca5ae', 0.04, 0.88),
  paper: material('paper', '#bcae93', 0.86),
  lamp: material('lamp-glass', '#e8cf9c', 0.35, 0.02, { opacity: 0.8, transmission: 0.15, thickness: 0.02 }),
};

function mesh(geometry, mat, name, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1]) {
  const node = new THREE.Mesh(geometry, mat);
  node.name = name;
  node.position.set(...position);
  node.rotation.set(...rotation);
  node.scale.set(...scale);
  node.castShadow = true;
  node.receiveShadow = true;
  return node;
}

function box(name, size, mat, position, rotation, scale) {
  return mesh(new THREE.BoxGeometry(...size), mat, name, position, rotation, scale);
}
function sphere(name, radius, mat, position, scale = [1, 1, 1], detail = 24) {
  return mesh(new THREE.SphereGeometry(radius, detail, Math.max(12, Math.floor(detail * 0.7))), mat, name, position, [0, 0, 0], scale);
}
function cylinder(name, radiusTop, radiusBottom, height, mat, position, rotation = [0, 0, 0], segments = 20) {
  return mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments), mat, name, position, rotation);
}
function limb(name, radius, length, mat, position, rotation = [0, 0, 0]) {
  const group = new THREE.Group();
  group.name = name;
  const body = cylinder(`${name}-body`, radius * 0.9, radius, length, mat, [0, 0, 0], [0, 0, 0], 16);
  const capA = sphere(`${name}-cap-a`, radius, mat, [0, length / 2, 0], [1, 0.9, 1], 16);
  const capB = sphere(`${name}-cap-b`, radius * 0.92, mat, [0, -length / 2, 0], [1, 0.9, 1], 16);
  group.add(body, capA, capB);
  group.position.set(...position);
  group.rotation.set(...rotation);
  return group;
}

function createHuman({ name = 'urai-human', skin = M.skin, shirt = M.clothBlue, hair = M.hair, heightScale = 1, pose = 0 } = {}) {
  const root = new THREE.Group();
  root.name = `${name}-root`;
  root.userData = {
    assetType: 'human',
    units: 'meters',
    upAxis: 'Y',
    nominalHeightMeters: 1.82 * heightScale,
    cameraAspect: ASPECT,
    status: 'runtime-human-base-v1',
    finalTarget: 'rigged-scan-grade-human-with-facial-blendshapes',
  };

  const hips = new THREE.Group(); hips.name = `${name}-hips`; hips.position.y = 0.93;
  root.add(hips);
  hips.add(sphere(`${name}-pelvis`, 1, M.trouser, [0, 0, 0], [0.19, 0.15, 0.13], 20));

  const chest = new THREE.Group(); chest.name = `${name}-chest`; chest.position.y = 0.26; hips.add(chest);
  chest.add(sphere(`${name}-torso`, 1, shirt, [0, 0.03, 0], [0.245, 0.32, 0.145], 28));
  chest.add(cylinder(`${name}-neck`, 0.055, 0.062, 0.13, skin, [0, 0.34, 0], [0, 0, 0], 18));

  const headRig = new THREE.Group(); headRig.name = `${name}-head-rig`; headRig.position.set(0, 0.49, 0); chest.add(headRig);
  headRig.add(sphere(`${name}-head`, 1, skin, [0, 0, 0], [0.112, 0.145, 0.105], 28));
  headRig.add(sphere(`${name}-ear-left`, 1, skin, [-0.113, 0, 0], [0.016, 0.032, 0.018], 14));
  headRig.add(sphere(`${name}-ear-right`, 1, skin, [0.113, 0, 0], [0.016, 0.032, 0.018], 14));
  headRig.add(mesh(new THREE.ConeGeometry(0.014, 0.043, 12), skin, `${name}-nose`, [0, -0.005, 0.105], [Math.PI / 2, 0, 0]));
  for (const [side, x] of [['left', -0.04], ['right', 0.04]]) {
    headRig.add(sphere(`${name}-eye-${side}`, 1, M.eyeWhite, [x, 0.025, 0.101], [0.019, 0.01, 0.006], 14));
    headRig.add(sphere(`${name}-iris-${side}`, 1, M.eye, [x, 0.025, 0.108], [0.006, 0.006, 0.004], 12));
  }
  headRig.add(sphere(`${name}-mouth`, 1, M.lip, [0, -0.055, 0.1], [0.034, 0.006, 0.006], 12));
  headRig.add(sphere(`${name}-hair-cap`, 1, hair, [0, 0.062, -0.027], [0.118, 0.105, 0.11], 22));
  headRig.add(sphere(`${name}-hair-left`, 1, hair, [-0.098, 0, -0.028], [0.027, 0.075, 0.035], 14));
  headRig.add(sphere(`${name}-hair-right`, 1, hair, [0.098, 0, -0.028], [0.027, 0.075, 0.035], 14));

  const shoulderAngle = 0.075 + pose * 0.025;
  chest.add(limb(`${name}-upperarm-left`, 0.052, 0.27, shirt, [-0.29, 0.03, 0], [0, 0, -shoulderAngle]));
  chest.add(limb(`${name}-upperarm-right`, 0.052, 0.27, shirt, [0.29, 0.03, 0], [0, 0, shoulderAngle]));
  chest.add(limb(`${name}-forearm-left`, 0.043, 0.245, skin, [-0.31, -0.22, 0.015], [0.02, 0, -0.02]));
  chest.add(limb(`${name}-forearm-right`, 0.043, 0.245, skin, [0.31, -0.22, 0.015], [0.02, 0, 0.02]));
  chest.add(sphere(`${name}-hand-left`, 1, skin, [-0.31, -0.405, 0.03], [0.05, 0.075, 0.035], 14));
  chest.add(sphere(`${name}-hand-right`, 1, skin, [0.31, -0.405, 0.03], [0.05, 0.075, 0.035], 14));

  hips.add(limb(`${name}-thigh-left`, 0.07, 0.38, M.trouser, [-0.09, -0.26, 0]));
  hips.add(limb(`${name}-thigh-right`, 0.07, 0.38, M.trouser, [0.09, -0.26, 0]));
  hips.add(limb(`${name}-calf-left`, 0.055, 0.33, M.trouser, [-0.085, -0.61, 0]));
  hips.add(limb(`${name}-calf-right`, 0.055, 0.33, M.trouser, [0.085, -0.61, 0]));
  hips.add(box(`${name}-shoe-left`, [0.11, 0.07, 0.24], M.shoe, [-0.09, -0.88, 0.06]));
  hips.add(box(`${name}-shoe-right`, [0.11, 0.07, 0.24], M.shoe, [0.09, -0.88, 0.06]));

  root.scale.setScalar(heightScale);
  root.updateMatrixWorld(true);
  const idle = new THREE.AnimationClip('idle-breath', 3, [
    new THREE.VectorKeyframeTrack(`${chest.name}.scale`, [0, 1.5, 3], [1, 1, 1, 1.006, 1.013, 1.006, 1, 1, 1]),
    new THREE.QuaternionKeyframeTrack(`${headRig.name}.quaternion`, [0, 1.5, 3], [0, 0, 0, 1, 0, 0.008, 0, 0.999968, 0, 0, 0, 1]),
  ]);
  root.animations = [idle];
  return root;
}

function createTerrain(size = 28, segments = 64) {
  const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
  const p = geometry.attributes.position;
  for (let i = 0; i < p.count; i += 1) {
    const x = p.getX(i); const y = p.getY(i);
    let z = Math.sin(x * 0.35) * 0.32 + Math.cos(y * 0.42) * 0.2 + Math.sin((x + y) * 0.8) * 0.1;
    z -= 0.65 * Math.exp(-(((x - 2.8) ** 2 + (y + 1.5) ** 2) / 12));
    z += 0.5 * Math.exp(-(((x + 6) ** 2 + (y - 5) ** 2) / 15));
    p.setZ(i, z);
  }
  p.needsUpdate = true; geometry.computeVertexNormals();
  return mesh(geometry, M.grass, 'home-terrain', [0, 0, 0], [-Math.PI / 2, 0, 0]);
}

function createHomeWorld() {
  const root = new THREE.Group(); root.name = 'urai-home-world';
  root.userData = { realm: 'Home/Ground', units: 'meters', cameraAspect: ASPECT, walkableRadiusMeters: 14, status: 'runtime-world-v1' };
  root.add(createTerrain());
  const pond = cylinder('home-pond', 3.0, 3.0, 0.025, M.water, [2.8, -0.22, -1.5], [Math.PI / 2, 0, 0], 64); root.add(pond);
  for (let i = 0; i < 17; i += 1) {
    const z = 7.5 - i * 0.7; const x = -1.4 + i * 0.09;
    root.add(box(`path-stone-${i}`, [0.56 + (i % 3) * 0.07, 0.07, 0.42], M.stoneWarm, [x, 0.14, z], [0, (i % 3 - 1) * 0.035, 0]));
  }
  const rocks = [[-8, -3, .5], [-6, 5, .38], [8, 3, .54], [5, -6, .45], [-2, -7, .42], [9, -5, .35]];
  rocks.forEach(([x, z, r], i) => root.add(sphere(`rock-${i}`, 1, M.rock, [x, r * .55, z], [r * 1.35, r * .75, r], 12)));
  const trees = [[-7,-2,1],[-10,5,1.2],[9,4,1.15],[7,-7,.95],[-4,-9,.9],[11,-3,.8]];
  trees.forEach(([x,z,s], i) => {
    root.add(cylinder(`tree-trunk-${i}`, .16*s, .23*s, 3.2*s, M.bark, [x, 1.6*s, z], [0,0,0], 14));
    root.add(sphere(`tree-crown-${i}`, 1, M.leaf, [x, 3.2*s, z], [1.15*s,.75*s,1.05*s], 14));
    root.add(sphere(`tree-crown-${i}-left`, 1, M.leaf, [x-.62*s, 3.0*s, z+.1*s], [.68*s,.55*s,.7*s], 12));
    root.add(sphere(`tree-crown-${i}-right`, 1, M.leaf, [x+.6*s, 3.05*s, z-.1*s], [.72*s,.58*s,.7*s], 12));
  });
  [[-8,8,3.2],[-6.5,8.5,2.4],[9,8,3.6]].forEach(([x,z,h],i)=>root.add(cylinder(`ruin-column-${i}`, .22,.26,h,M.stone,[x,h/2,z],[0,0,0],20)));
  return root;
}

function createCouncilChamber(withPeople = true) {
  const root = new THREE.Group(); root.name = 'urai-council-chamber';
  root.userData = { realm: 'Council', units: 'meters', cameraAspect: ASPECT, humanScale: true, status: 'runtime-world-v1' };
  root.add(cylinder('council-floor', 6.6, 6.6, .18, M.stoneWarm, [0,-.09,0], [0,0,0], 80));
  root.add(box('council-back-wall',[11.5,5,.32],M.stoneWarm,[0,2.5,-5.2]));
  root.add(box('council-wall-left',[.32,5,9.5],M.stone,[-5.5,2.5,-.5]));
  root.add(box('council-wall-right',[.32,5,9.5],M.stone,[5.5,2.5,-.5]));
  [-4.7,-2.35,0,2.35,4.7].forEach((x,i)=>root.add(cylinder(`council-column-${i}`, .22,.25,4.6,M.stoneDark,[x,2.3,-4.9],[0,0,0],20)));
  root.add(cylinder('council-table-top',1.55,1.55,.11,M.wood,[0,.76,-.6],[0,0,0],64));
  root.add(cylinder('council-table-base',.48,.55,.72,M.woodDark,[0,.36,-.6],[0,0,0],40));
  root.add(box('council-window',[3.8,2.5,.05],M.glass,[0,3,-5]));
  const seats=[[-2.8,-1],[-1.6,-2.7],[0,-3.35],[1.6,-2.7],[2.8,-1],[3.4,1]];
  seats.forEach(([x,z],i)=>{
    root.add(box(`chair-seat-${i}`,[.68,.16,.62],M.clothGray,[x,.42,z]));
    root.add(box(`chair-back-${i}`,[.66,.82,.15],M.clothGray,[x,.86,z+.25]));
  });
  if (withPeople) {
    const people=[
      ['guide',M.skin,M.clothBlue],['mirror',M.skinDark,M.clothGray],['guardian',M.skinDark,M.clothBlue],
      ['archivist',M.skinLight,M.clothWarm],['builder',M.skin,M.clothWarm],['trickster',M.skin,M.clothGray],
    ];
    people.forEach(([role,skin,shirt],i)=>{ const human=createHuman({name:`council-${role}`,skin,shirt,pose:i%3}); human.position.set(seats[i][0],0,seats[i][1]); human.rotation.y=Math.atan2(-seats[i][0],-.6-seats[i][1]); root.add(human); });
  }
  return root;
}

function createShadowWorld() {
  const root = new THREE.Group(); root.name = 'urai-shadow-world';
  root.userData = { realm: 'Shadow', units: 'meters', cameraAspect: ASPECT, status: 'runtime-world-v1', governance: 'visual-substrate-only' };
  root.add(box('shadow-floor',[10.5,.18,14],M.stoneDark,[0,-.09,-1.5]));
  root.add(box('shadow-wall-left',[.3,5,14],M.stoneDark,[-5.2,2.5,-1.5]));
  root.add(box('shadow-wall-right',[.3,5,14],M.stoneDark,[5.2,2.5,-1.5]));
  root.add(box('shadow-back',[10.5,5,.3],M.stone,[0,2.5,-8.4]));
  for(let i=0;i<18;i+=1) root.add(box(`shadow-path-${i}`,[1.05,.055,.48],M.stoneWarm,[0,.03,5.2-i*.65],[0,(i%3-1)*.025,0]));
  root.add(cylinder('shadow-basin',1.65,1.65,.22,M.stone,[0,.1,-5.2],[0,0,0],56));
  root.add(cylinder('shadow-basin-water',1.35,1.35,.025,M.water,[0,.23,-5.2],[0,0,0],56));
  [[-3.4,1.8],[3.4,.6],[-3.4,-1],[3.4,-2.3],[-3.4,-4]].forEach(([x,z],i)=>root.add(box(`shadow-glass-${i}`,[1.7,2.8,.045],M.glass,[x,1.75,z],[0,x<0?.16:-.16,0])));
  return root;
}

function createMirrorWorld() {
  const root = new THREE.Group(); root.name = 'urai-mirror-world';
  root.userData = { realm: 'Mirror', units: 'meters', cameraAspect: ASPECT, status: 'runtime-world-v1', reflectionPolicy: 'physical-space-under-governed-reflection-ui' };
  root.add(box('mirror-floor',[12,.18,15],M.stoneWarm,[0,-.09,-2]));
  root.add(box('mirror-back-wall',[12,5.2,.3],M.stone,[0,2.6,-9.3]));
  root.add(box('mirror-wall-left',[.3,5.2,15],M.stone,[-6,2.6,-2]));
  root.add(box('mirror-wall-right',[.3,5.2,15],M.stone,[6,2.6,-2]));
  root.add(box('mirror-frame-top',[4.25,.24,.28],M.bronze,[0,4.15,-8.95]));
  root.add(box('mirror-frame-bottom',[4.25,.24,.28],M.bronze,[0,.55,-8.95]));
  root.add(box('mirror-frame-left',[.24,3.85,.28],M.bronze,[-2.05,2.35,-8.95]));
  root.add(box('mirror-frame-right',[.24,3.85,.28],M.bronze,[2.05,2.35,-8.95]));
  root.add(box('mirror-surface',[3.8,3.45,.06],M.mirror,[0,2.35,-9.0]));
  for (const x of [-4.65,4.65]) {
    root.add(box(`mirror-side-panel-${x}`,[1.55,2.75,.08],M.glass,[x,1.9,-6.2],[0,x<0?.12:-.12,0]));
    root.add(box(`mirror-bench-${x}`,[1.8,.42,.72],M.wood,[x,.25,-3.8]));
  }
  for(let i=0;i<10;i+=1) root.add(box(`mirror-path-${i}`,[1.35,.05,.58],M.stoneWarm,[Math.sin(i*.8)*.08,.03,3.5-i*.9],[0,(i%3-1)*.02,0]));
  return root;
}

function createLegacyWorld() {
  const root = new THREE.Group(); root.name = 'urai-legacy-world';
  root.userData = { realm: 'Legacy', units: 'meters', cameraAspect: ASPECT, status: 'runtime-world-v1', governance: 'user-approved-memory-archive-only' };
  root.add(box('legacy-floor',[13,.18,17],M.stoneWarm,[0,-.09,-2.5]));
  root.add(box('legacy-back-wall',[13,5.2,.3],M.stoneWarm,[0,2.6,-10.8]));
  root.add(box('legacy-wall-left',[.3,5.2,17],M.stone,[-6.5,2.6,-2.5]));
  root.add(box('legacy-wall-right',[.3,5.2,17],M.stone,[6.5,2.6,-2.5]));
  for(const side of [-1,1]) {
    for(let row=0;row<4;row+=1) {
      const z=2-row*3.2; const x=side*5.45;
      root.add(box(`legacy-shelf-${side}-${row}`,[1.45,2.25,.48],M.woodDark,[x,1.25,z]));
      for(let shelf=0;shelf<4;shelf+=1) root.add(box(`legacy-shelf-board-${side}-${row}-${shelf}`,[1.55,.08,.58],M.wood,[x,.25+shelf*.62,z]));
      for(let book=0;book<7;book+=1) root.add(box(`legacy-book-${side}-${row}-${book}`,[.11,.36,.28],book%2?M.paper:M.clothWarm,[x+(book-3)*.17,.52,z-.33]));
    }
  }
  root.add(box('legacy-reading-table',[3.4,.14,1.25],M.wood,[0,.78,-1.8]));
  root.add(box('legacy-table-base',[.7,.75,.65],M.woodDark,[0,.38,-1.8]));
  for(let i=0;i<5;i+=1) {
    const x=-4+i*2;
    root.add(box(`legacy-frame-${i}`,[1.3,1.65,.08],M.bronze,[x,2.55,-10.55]));
    root.add(box(`legacy-memory-surface-${i}`,[1.1,1.4,.04],M.glass,[x,2.55,-10.49]));
  }
  for(const x of [-4.7,4.7]) root.add(cylinder(`legacy-lamp-${x}`, .12,.14,.42,M.lamp,[x,.22,-4.8],[0,0,0],16));
  return root;
}

async function exportGLB(filename, sceneRoot) {
  const scene = new THREE.Scene();
  scene.name = filename.replace(/\.glb$/, '');
  scene.userData = { ...sceneRoot.userData, generatedBy: 'scripts/assets/build-real-3d-assets.mjs', generatedAt: new Date().toISOString() };
  scene.add(sceneRoot);
  scene.updateMatrixWorld(true);
  const animations = [];
  scene.traverse((node) => { if (node.animations?.length) animations.push(...node.animations); });
  const exporter = new GLTFExporter();
  const result = await exporter.parseAsync(scene, { binary: true, onlyVisible: true, trs: true, animations });
  if (!(result instanceof ArrayBuffer)) throw new Error(`Expected binary GLB ArrayBuffer for ${filename}`);
  const bytes = Buffer.from(result);
  const path = join(OUTPUT_DIR, filename);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, bytes);
  return {
    file: filename,
    bytes: bytes.length,
    sha256: createHash('sha256').update(bytes).digest('hex'),
    scene: scene.name,
    cameraAspect: ASPECT,
    units: 'meters',
    animationClips: animations.map((clip) => clip.name),
  };
}

await mkdir(OUTPUT_DIR, { recursive: true });
const assets = [];
assets.push(await exportGLB('urai-human-base-v1.glb', createHuman()));
assets.push(await exportGLB('urai-home-world-v1.glb', createHomeWorld()));
assets.push(await exportGLB('urai-council-chamber-v1.glb', createCouncilChamber(false)));
assets.push(await exportGLB('urai-council-scene-v1.glb', createCouncilChamber(true)));
assets.push(await exportGLB('urai-shadow-world-v1.glb', createShadowWorld()));
assets.push(await exportGLB('urai-mirror-world-v1.glb', createMirrorWorld()));
assets.push(await exportGLB('urai-legacy-world-v1.glb', createLegacyWorld()));
await writeFile(join(OUTPUT_DIR, 'asset-manifest.json'), `${JSON.stringify({ generatedAt: new Date().toISOString(), cameraAspect: ASPECT, assets }, null, 2)}\n`);
console.log(`URAI real-3D asset build complete: ${assets.length} GLB assets -> ${OUTPUT_DIR}`);
for (const asset of assets) console.log(`- ${asset.file}: ${asset.bytes} bytes ${asset.sha256.slice(0, 12)}`);
