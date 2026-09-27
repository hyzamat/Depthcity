/**
 * Custom instanced shaders for the scroll-built city.
 * Buildings get a procedural window grid that turns warm at night (like the game's
 * BuildingNightGlow); roads get glowing curb lines (the game's StreetLampNight look).
 * All colour maths is in linear space; three's tonemapping + colorspace chunks finish it.
 */

const fogChunk = /* glsl */ `
  float fogF = smoothstep(uFogNear, uFogFar, vFogDepth);
  col = mix(col, uFogColor, fogF);
`;

/* -------------------------------- buildings -------------------------------- */
export const buildingVert = /* glsl */ `
  attribute vec3 aColor;
  attribute float aSeed;
  attribute vec3 aSize;      // w, h, d (world units)
  attribute float aBuild;    // 0..1+ animated build amount (overshoots with the bounce)
  attribute float aTaper;    // 1 for landmark spires

  varying vec3 vNormal;
  varying vec3 vLocal;
  varying vec3 vColor;
  varying float vSeed;
  varying vec3 vSize;
  varying float vFogDepth;
  varying float vTaper;

  void main() {
    vColor = aColor;
    vSeed = aSeed;
    vSize = aSize;
    vTaper = aTaper;
    // unit box: x,z in [-0.5,0.5], y in [0,1]
    vec3 p = position;
    // spires narrow toward the crown
    float narrow = mix(1.0, mix(1.0, 0.28, smoothstep(0.45, 1.0, p.y)), aTaper);
    vLocal = vec3(p.x * aSize.x * narrow, p.y * aSize.y, p.z * aSize.z * narrow);
    float vis = step(0.001, aBuild);
    vec3 scaled = vec3(vLocal.x * vis, vLocal.y * aBuild, vLocal.z * vis);
    vec4 world = instanceMatrix * vec4(scaled, 1.0);
    vNormal = normalize(mat3(instanceMatrix) * normal);
    vec4 mv = modelViewMatrix * world;
    vFogDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

export const buildingFrag = /* glsl */ `
  precision highp float;
  uniform float uNight;
  uniform vec3 uSunDir;
  uniform vec3 uSunColor;
  uniform vec3 uAmbient;
  uniform vec3 uWindowLit;
  uniform vec3 uFogColor;
  uniform float uFogNear;
  uniform float uFogFar;

  varying vec3 vNormal;
  varying vec3 vLocal;
  varying vec3 vColor;
  varying float vSeed;
  varying vec3 vSize;
  varying float vFogDepth;
  varying float vTaper;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7)) + vSeed * 7.31) * 43758.5453); }

  void main() {
    vec3 n = normalize(vNormal);
    float top = step(0.85, n.y);
    float side = 1.0 - top;

    // Face-space UV for the window grid (units: world)
    bool xFace = abs(n.x) > 0.5;
    vec2 uv = xFace ? vec2(vLocal.z, vLocal.y) : vec2(vLocal.x, vLocal.y);
    float faceId = xFace ? (n.x > 0.0 ? 1.0 : 2.0) : (n.z > 0.0 ? 3.0 : 4.0);

    vec2 cell = vec2(0.21, 0.24);
    vec2 g = uv / cell;
    vec2 id = floor(g);
    vec2 f = fract(g);
    float win = step(0.28, f.x) * step(f.x, 0.72) * step(0.22, f.y) * step(f.y, 0.70);
    // keep a margin at the bottom and top of the wall
    win *= step(0.16, vLocal.y) * step(vLocal.y, vSize.y - 0.14);
    // keep windows off the edges of the face
    float halfFace = xFace ? vSize.z * 0.5 : vSize.x * 0.5;
    float narrow = mix(1.0, mix(1.0, 0.28, smoothstep(0.45, 1.0, vLocal.y / vSize.y)), vTaper);
    float edge = abs(xFace ? vLocal.z : vLocal.x) / (halfFace * narrow);
    win *= step(edge, 0.82);

    float rnd = hash(id + faceId * 17.0);
    float litNight = step(0.4, rnd);                  // ~60% of windows glow at night
    float flicker = 0.8 + 0.2 * hash(id * 3.1 + faceId);

    // At night walls lose saturation and brightness so the lit windows carry the colour.
    float lum = dot(vColor, vec3(0.2126, 0.7152, 0.0722));
    vec3 base = mix(vColor, vec3(lum) * vec3(0.75, 0.82, 1.0), 0.6 * uNight) * mix(1.0, 0.55, uNight);

    // Roof: a slightly darker inset with a parapet rim.
    vec2 ruv = abs(vLocal.xz) / (vec2(vSize.x, vSize.z) * 0.5 * narrow);
    float parapet = step(0.82, max(ruv.x, ruv.y));
    vec3 roof = base * mix(0.86, 1.08, parapet);

    vec3 wall = mix(base * 0.8, roof, top);
    vec3 winDay = mix(vec3(0.62, 0.78, 0.92), vec3(1.0, 0.96, 0.86), step(0.55, rnd)); // sky reflections vs sunlit blinds
    vec3 winNightDark = base * 0.3;
    vec3 winNight = mix(winNightDark, uWindowLit * flicker, litNight);
    vec3 winCol = mix(winDay, winNight, uNight);
    vec3 albedo = mix(wall, winCol, win * side);

    float diff = max(dot(n, uSunDir), 0.0);
    // ground occlusion + a gentle lift toward the top of tall towers
    float ao = mix(0.5, 1.0, smoothstep(0.0, 1.1, vLocal.y));
    float lift = mix(0.94, 1.08, clamp(vLocal.y / 9.0, 0.0, 1.0));
    float rim = pow(1.0 - max(dot(n, vec3(0.0, 1.0, 0.0)), 0.0), 2.0) * 0.05 * (1.0 - uNight);
    vec3 col = albedo * (uAmbient + uSunColor * (0.32 + 0.68 * diff)) * ao * lift + rim;
    // emissive windows at night
    col += win * side * litNight * uNight * uWindowLit * 1.1 * flicker;
    // landmark crowns glow after dark
    col += vTaper * uNight * smoothstep(0.82, 1.0, vLocal.y / vSize.y) * vec3(0.55, 0.75, 1.0) * 1.4;

    ${fogChunk}
    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

/* ---------------------------------- roads ---------------------------------- */
export const roadVert = /* glsl */ `
  attribute float aBuild;
  varying vec2 vUv2;
  varying vec3 vWorld;
  varying float vFogDepth;
  void main() {
    vUv2 = position.xz;              // [-0.5, 0.5]
    vec3 p = vec3(position.x * aBuild, position.y * step(0.001, aBuild), position.z * step(0.001, aBuild));
    vec4 world = instanceMatrix * vec4(p, 1.0);
    vWorld = world.xyz;
    vec4 mv = modelViewMatrix * world;
    vFogDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

export const roadFrag = /* glsl */ `
  precision highp float;
  uniform float uNight;
  uniform vec3 uAmbient;
  uniform vec3 uSunColor;
  uniform vec3 uFogColor;
  uniform float uFogNear;
  uniform float uFogFar;
  varying vec2 vUv2;
  varying vec3 vWorld;
  varying float vFogDepth;
  void main() {
    float across = abs(vUv2.y);                         // 0 centre → 0.5 edge of the strip
    float curb = smoothstep(0.40, 0.42, across) - smoothstep(0.47, 0.49, across);
    // dashed centre line
    float along = vUv2.x * 26.0 * 2.2;
    float dash = (1.0 - smoothstep(0.02, 0.035, across)) * step(0.5, fract(along));
    vec3 asphalt = vec3(0.075, 0.08, 0.1);
    vec3 curbDay = vec3(0.72, 0.72, 0.7);
    vec3 curbNight = vec3(1.0, 0.8, 0.28);
    vec3 col = mix(asphalt, mix(curbDay, curbNight * 0.4, uNight), curb);
    col = mix(col, vec3(0.9, 0.85, 0.6), dash * 0.7 * (1.0 - uNight));
    col *= (uAmbient + uSunColor * 0.75);
    // lamp-lit curbs and warm pools of light on the asphalt at night
    col += curb * uNight * curbNight * 1.9;
    // road centres sit at -0.5 + 4k, so this peaks at every intersection
    float pools = pow(0.5 + 0.5 * cos((vWorld.x + 0.5) * 1.5708) * cos((vWorld.z + 0.5) * 1.5708), 6.0);
    col += uNight * pools * vec3(1.0, 0.72, 0.35) * 0.18;
    ${fogChunk}
    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

/* ------------------------ island ground (with blueprint) ------------------------ */
export const groundVert = /* glsl */ `
  varying vec3 vWorld;
  varying vec3 vNormal;
  varying float vFogDepth;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vec4 mv = viewMatrix * world;
    vFogDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

export const groundFrag = /* glsl */ `
  precision highp float;
  uniform float uNight;
  uniform float uPlan;       // 1 = blueprint grid fully drawn, 0 = gone
  uniform vec3 uSunDir;
  uniform vec3 uSunColor;
  uniform vec3 uAmbient;
  uniform vec3 uFogColor;
  uniform float uFogNear;
  uniform float uFogFar;
  uniform vec3 uGrassA;
  uniform vec3 uGrassB;
  varying vec3 vWorld;
  varying vec3 vNormal;
  varying float vFogDepth;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

  void main() {
    vec3 n = normalize(vNormal);
    float top = step(0.85, n.y);
    vec2 p = vWorld.xz;
    // per-tile colour variation, like mown lots
    float h = hash(floor(p * 2.0));
    vec3 grass = mix(uGrassA, uGrassB, h * 0.8 + 0.2 * sin(p.x * 0.35) * sin(p.y * 0.3));
    grass = mix(grass * 0.55, grass, top);
    float diff = max(dot(n, uSunDir), 0.0);
    vec3 col = grass * (uAmbient + uSunColor * (0.35 + 0.65 * diff));

    // Blueprint: tile grid everywhere, road corridors (every 4th tile) filled in.
    float inside = step(max(abs(p.x), abs(p.y)), 13.0) * top;
    vec2 f = abs(fract(p) - 0.5);
    float line = smoothstep(0.455, 0.5, max(f.x, f.y));
    vec2 ti = mod(floor(p + 13.0), 4.0);
    float corridor = max(1.0 - step(0.5, ti.x), 1.0 - step(0.5, ti.y));
    vec3 ink = vec3(0.55, 0.85, 1.0);
    col = mix(col, col * 0.45 + ink * 0.22, corridor * 0.75 * uPlan * inside);
    col += ink * line * 0.55 * uPlan * inside;
    float border = smoothstep(12.9, 13.0, max(abs(p.x), abs(p.y))) * (1.0 - smoothstep(13.0, 13.1, max(abs(p.x), abs(p.y))));
    col += ink * border * uPlan * top * 1.2;

    ${fogChunk}
    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

/* ----------------------------------- sea ----------------------------------- */
export const seaVert = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

export const seaFrag = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uNight;
  uniform vec3 uSunDir;
  uniform vec3 uSunColor;
  uniform vec3 uFogColor;
  uniform float uFogNear;
  uniform float uFogFar;
  uniform float uFadeStart;
  uniform float uFadeEnd;
  uniform vec3 uBoats[3];
  varying vec3 vWorld;

  float sdBox(vec2 p, vec2 b) { vec2 d = abs(p) - b; return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0); }

  void main() {
    vec2 p = vWorld.xz;
    float t = uTime;
    float shore = sdBox(p, vec2(15.25)) - 0.35;   // >0 in open water

    float camDist = distance(cameraPosition, vWorld);
    vec3 V = normalize(cameraPosition - vWorld);

    // Layered swell → a perturbed normal. Detail fades out with distance (and at grazing
    // angles) before it can alias into moiré bands.
    float detail = 1.0 - smoothstep(uFogNear * 0.45, uFogNear * 1.05, camDist);
    float a1 = p.x * 0.42 + p.y * 0.19 + t * 0.8;
    float a2 = p.x * -0.23 + p.y * 0.51 + t * 1.05;
    float a3 = p.x * 1.31 + p.y * 0.87 - t * 1.6;
    float a4 = p.x * -0.93 + p.y * 1.57 + t * 1.3;
    vec2 slope = vec2(cos(a1) * 0.42 - cos(a2) * 0.23, cos(a1) * 0.19 + cos(a2) * 0.51) * 0.06;
    slope += vec2(cos(a3) * 1.31 - cos(a4) * 0.93, cos(a3) * 0.87 + cos(a4) * 1.57) * 0.025 * detail;
    slope *= mix(0.35, 1.0, detail);
    vec3 n = normalize(vec3(-slope.x, 1.0, -slope.y));

    vec3 shallowDay = vec3(0.03, 0.4, 0.46);
    vec3 deepDay = vec3(0.01, 0.1, 0.3);
    vec3 shallowNight = vec3(0.008, 0.03, 0.07);
    vec3 deepNight = vec3(0.002, 0.008, 0.03);
    float depth = smoothstep(0.0, 3.2, shore);
    vec3 water = mix(mix(shallowDay, deepDay, depth), mix(shallowNight, deepNight, depth), uNight);

    // sky reflection at grazing angles
    float fres = pow(1.0 - max(dot(n, V), 0.0), 5.0);
    water = mix(water, uFogColor, clamp(fres * 0.7, 0.0, 0.55));

    // sun / moon glint
    vec3 H = normalize(normalize(uSunDir) + V);
    float spec = pow(max(dot(n, H), 0.0), mix(260.0, 360.0, uNight));
    water += uSunColor * spec * mix(1.8, 1.4, uNight) * mix(0.4, 1.0, detail);

    // foam at the beach
    float surf = 0.35 + 0.18 * sin(t * 1.4 + (p.x - p.y) * 0.6);
    float foam = 1.0 - smoothstep(0.0, surf, shore);
    foam *= step(-0.2, shore);
    water = mix(water, vec3(mix(0.92, 0.2, uNight)), foam * mix(0.85, 0.6, uNight));

    // boat wakes: a soft bright trail around each boat position
    for (int i = 0; i < 3; i++) {
      float d = length(p - uBoats[i].xy);
      water += vec3(0.6) * exp(-d * d * 1.8) * uBoats[i].z * (1.0 - 0.6 * uNight);
    }

    // warm city light spilling onto the water at night, broken up by the swell
    float spill = exp(-max(shore, 0.0) * 0.45) * uNight;
    float shimmer = 0.6 + 0.4 * clamp(slope.x * 9.0 + slope.y * 7.0, -1.0, 1.0);
    water += vec3(1.0, 0.6, 0.26) * spill * shimmer * 0.16;

    // horizon haze, then fade out so the CSS sky reads as the horizon
    float haze = smoothstep(uFogNear, uFogFar, camDist);
    water = mix(water, uFogColor, haze);
    float alpha = 1.0 - smoothstep(uFadeStart, uFadeEnd, camDist);

    vec3 col = water;
    gl_FragColor = vec4(col, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

/* ------------------------------ soft shadows ------------------------------ */
export const shadowVert = /* glsl */ `
  attribute vec3 aSize;
  attribute float aBuild;
  uniform vec3 uSunDir;
  varying vec2 vUv2;
  varying float vVis;
  void main() {
    vec2 dir = -normalize(uSunDir.xz + vec2(1e-4));
    float elev = max(uSunDir.y, 0.18);
    float h = aSize.y * clamp(aBuild, 0.0, 1.0);
    float len = min(h * 0.32 / elev, 4.5);
    float s = max(aSize.x, aSize.z) + 0.3;
    vec2 perp = vec2(-dir.y, dir.x);
    float u = position.x + 0.5;         // 0..1 along the shadow
    float v = position.z;               // -0.5..0.5 across
    vec2 off = dir * (u * (s + len) - s * 0.5) + perp * (v * s);
    vec4 world = instanceMatrix * vec4(off.x, 0.0, off.y, 1.0);
    vUv2 = vec2(u, v + 0.5);
    vVis = step(0.001, aBuild);
    gl_Position = projectionMatrix * modelViewMatrix * world;
  }
`;

export const shadowFrag = /* glsl */ `
  precision highp float;
  uniform float uOpacity;
  varying vec2 vUv2;
  varying float vVis;
  void main() {
    float ex = smoothstep(0.0, 0.18, vUv2.x) * (1.0 - smoothstep(0.35, 1.0, vUv2.x));
    float ey = smoothstep(0.0, 0.28, vUv2.y) * (1.0 - smoothstep(0.72, 1.0, vUv2.y));
    gl_FragColor = vec4(0.0, 0.015, 0.05, ex * ey * uOpacity * vVis);
  }
`;

/* ------------------------------- cars & boats ------------------------------- */
export const vehicleVert = /* glsl */ `
  attribute vec3 aColor;
  varying vec3 vColor;
  varying vec3 vN;
  varying vec3 vLocalN;
  varying float vFogDepth;
  void main() {
    vColor = aColor;
    vLocalN = normal;
    vN = normalize(mat3(instanceMatrix) * normal);
    vec4 mv = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
    vFogDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

export const vehicleFrag = /* glsl */ `
  precision highp float;
  uniform float uNight;
  uniform vec3 uSunDir;
  uniform vec3 uSunColor;
  uniform vec3 uAmbient;
  uniform vec3 uFogColor;
  uniform float uFogNear;
  uniform float uFogFar;
  varying vec3 vColor;
  varying vec3 vN;
  varying vec3 vLocalN;
  varying float vFogDepth;
  void main() {
    vec3 n = normalize(vN);
    float diff = max(dot(n, uSunDir), 0.0);
    vec3 col = vColor * (uAmbient + uSunColor * (0.4 + 0.6 * diff));
    col = mix(col, col * 0.3, uNight);
    float front = step(0.5, vLocalN.x);
    float back = step(0.5, -vLocalN.x);
    col += (front * vec3(1.0, 0.9, 0.65) * 3.0 + back * vec3(1.0, 0.06, 0.04) * 2.2) * uNight;
    col += step(0.5, vLocalN.y) * vec3(1.0, 0.85, 0.6) * 0.25 * uNight;
    ${fogChunk}
    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;
