uniform float u_time;
varying vec2 vUv;
varying vec2 vPosition;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vUv = uv;
  vPosition = vec2(position.x, position.y);
}
