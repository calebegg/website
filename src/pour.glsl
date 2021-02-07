precision highp float;
uniform vec2 RESOLUTION;
uniform sampler2D DATA;
uniform vec2 OFFSET;
uniform float FRAME;

// Modified from http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/
highp float rand(vec2 co) {
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt = dot(vec2(co.x - FRAME, co.y + FRAME) ,vec2(a,b));
    highp float sn = mod(dt,3.14);
    return fract(sin(sn) * c);
}

vec4 encode(int val) {
  float r = float(val + 1);
  return vec4(r, val == 0 ? 1.0 : 0.0, val == 1 ? 1.0 : 0.0, 1.0);
}

int old_at(float x, float y) {
  return int(texture2D(DATA, vec2(x, RESOLUTION.y - y) / RESOLUTION).r) - 1;
}

vec4 at(float x, float y) {
  return texture2D(DATA, vec2(x, RESOLUTION.y - y) / RESOLUTION);
}

vec4 water(float amount) {
  return vec4(1.0, 1.0 - amount, amount, 1.0);
}

vec4 WALL = vec4(0.0, 0.0, 0.0, 1.0);
float SPEED = .5;

void main() {
  float x = gl_FragCoord.x;
  float y = RESOLUTION.y - gl_FragCoord.y;
  if (FRAME == 1.0) {
    gl_FragColor = water(0.0);
    return;
  }
  if (y == 1.5 && rand(vec2(x, y)) < .005) {
    gl_FragColor = water(1.0);
    return;
  }
  gl_FragColor = at(x, y);
  // Walls
  if (y == RESOLUTION.y - 0.5) {
    gl_FragColor = WALL;
    return;
  }
  if (x == RESOLUTION.x - 0.5) {
    gl_FragColor = WALL;
    return;
  }
  if (x == 0.5) {
    gl_FragColor = WALL;
    return;
  }
  if (y == 40.5 && mod(x + 3.0, 23.0) <= 20.5) {
    gl_FragColor = WALL;
    return;
  }
  if (y == 65.5 && mod(x + 19.0, 32.0) <= 23.5) {
    gl_FragColor = WALL;
    return;
  }
  if (y < 65.5 && y > 60.5 && (mod(x + 19.0, 32.0) == 23.5 || mod(x + 19.0, 32.0) == 0.5)) {
    gl_FragColor = WALL;
    return;
  }
  if (y == 90.5 && mod(x + 7.0, 62.0) <= 53.5) {
    gl_FragColor = WALL;
    return;
  }
  if (y < 90.5 && y > 85.5 && (mod(x + 7.0, 62.0) == 53.5 || mod(x + 7.0, 62.0) == 0.5)) {
    gl_FragColor = WALL;
    return;
  }
  float amount = at(x, y).b;
  float startAmount = amount;
  vec4 above = at(x, y - 1.0);
  vec4 below = at(x, y + 1.0);
  vec4 left = at(x - 1.0, y);
  vec4 right = at(x + 1.0, y);
  // Am I flowing out?
  if (amount > 0.0) {
    if (below != WALL && below.b <= .999) {
      amount -= min(SPEED, 1.0 - below.b);
    } else {
      if (left != WALL && left.b < startAmount * 0.75) {
        amount -= startAmount / 4.0;
      }
      if (right != WALL && right.b < startAmount * 0.75) {
        amount -= startAmount / 4.0;
      }
    }
  }
  if (startAmount < .999) {
    // Is the cell above flowing into us?
    if (above.b > 0.0) {
      amount += min(SPEED, 1.0 - amount);
    }
    // Is the cell to the left flowing right?
    if (left.b * 0.75 > startAmount &&
        (at(x - 1.0, y + 1.0) == WALL || at(x - 1.0, y + 1.0).b > .999)) {
      amount += left.b / 4.0;
    }
    // Is the cell to the right flowing left?
    if (right.b * 0.75 > startAmount &&
        (at(x + 1.0, y + 1.0) == WALL || at(x + 1.0, y + 1.0).b > .999)) {
      amount += right.b / 4.0;
    }
  }

  gl_FragColor = water(min(amount, 1.0));
}