precision mediump float;
uniform vec2 RESOLUTION;
uniform sampler2D DATA;
uniform vec2 OFFSET;
uniform float FRAME;

// Modified from http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/
highp float rand(vec2 co) {
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(vec2(co.x - FRAME, co.y + FRAME) ,vec2(a,b));
    highp float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}

vec4 encode(int val) {
  float r = float(val + 1);
  return vec4(r, val == 0 ? 1.0 : 0.0, val == 1 ? 1.0 : 0.0, 1.0);
}

int at(float x, float y) {
  return int(texture2D(DATA, vec2(x, RESOLUTION.y - y) / RESOLUTION).r) - 1;
}

void main() {
  if (FRAME == 1.0) {
    gl_FragColor = encode(0);
    return;
  }
  float x = gl_FragCoord.x;
  float y = RESOLUTION.y - gl_FragCoord.y;
  gl_FragColor = encode(at(x, y));
  // Walls
  if (y == RESOLUTION.y - 0.5 || x == RESOLUTION.x - 0.5 || x == 0.5) {
    gl_FragColor = encode(-1);
    return;
  }
  // Sand source
  if (y == 1.5 && rand(vec2(x, y)) > .995) {
    gl_FragColor = encode(1);
  }
  // Intermediate walls
  if (y == 40.5 && mod(x + 3.0, 23.0) <= 20.5) {
    gl_FragColor = encode(-1);
  }
  if (y == 65.5 && mod(x + 19.0, 32.0) <= 23.5) {
    gl_FragColor = encode(-1);
  }
  if (y == 90.5 && mod(x + 7.0, 62.0) <= 53.5) {
    gl_FragColor = encode(-1);
  }
  vec2 ul;
  ul.x = x - mod(x + OFFSET.x, 2.0) + 0.5;
  ul.y = y - mod(y + OFFSET.y, 2.0) + 0.5;
  
  if (at(ul.x, ul.y) == 1 && at(ul.x, ul.y + 1.0) == 0) {
    if (x == ul.x && y == ul.y) {
      gl_FragColor = encode(0);
    } else if (x == ul.x && y == ul.y + 1.0) {
      gl_FragColor = encode(1);
    }
    return;
  }

  if (at(ul.x + 1.0, ul.y) == 1 && at(ul.x + 1.0, ul.y + 1.0) == 0) {
    if (x == ul.x + 1.0 && y == ul.y) {
      gl_FragColor = encode(0);
    } else if (x == ul.x + 1.0 && y == ul.y + 1.0) {
      gl_FragColor = encode(1);
    }
    return;
  }

  if (at(ul.x, ul.y) == 1 && at(ul.x + 1.0, ul.y) == 0 && at(ul.x, ul.y + 1.0) == 1 && at(ul.x + 1.0, ul.y + 1.0) == 0) {
    if (x == ul.x && y == ul.y) {
      gl_FragColor = encode(0);
    } else if (x == ul.x + 1.0 && y == ul.y) {
      gl_FragColor = encode(0);
    } else if (x == ul.x && y == ul.y + 1.0) {
      gl_FragColor = encode(1);
    } else if (x == ul.x + 1.0 && y == ul.y + 1.0) {
      gl_FragColor = encode(1);
    }
    return;
  }

  if (at(ul.x, ul.y) == 0 && at(ul.x + 1.0, ul.y) == 1 && at(ul.x, ul.y + 1.0) == 0 && at(ul.x + 1.0, ul.y + 1.0) == 1) {
    if (x == ul.x && y == ul.y) {
      gl_FragColor = encode(0);
    } else if (x == ul.x + 1.0 && y == ul.y) {
      gl_FragColor = encode(0);
    } else if (x == ul.x && y == ul.y + 1.0) {
      gl_FragColor = encode(1);
    } else if (x == ul.x + 1.0 && y == ul.y + 1.0) {
      gl_FragColor = encode(1);
    }
    return;
  }
}