import { gsap } from 'gsap';
import { exp } from 'three/tsl';

export function moveCameraAcrossLine(camera, lineWidth, y, z = camera.position.z, duration = 2) {
  camera.position.set(-lineWidth / 2, y, z);
  camera.lookAt(0, y, 0);

  gsap.to(camera.position, {
    x: lineWidth / 2,
    duration: duration,
    ease: "power2.inOut",
    onUpdate: () => camera.lookAt(0, y, -800)
  });
}

export function moveCameraToNextLine(camera, x,y, z = camera.position.z, duration = 2) {
  gsap.to(camera.position, {
    x: x,
    y: y,
    z: z,
    duration: duration,
    ease: "power2.inOut",
    onUpdate: () => camera.lookAt(0,  camera.position.y, -800)
  });
}