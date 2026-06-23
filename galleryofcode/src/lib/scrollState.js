// Mutable singleton read by the Three.js scene every frame and written by
// ScrollTrigger. Deliberately NOT React state: scroll updates at 60+fps must
// not cause React renders.
export const scrollState = {
  corridor: 0, // 0..1 progress through the projects section
  corridorActive: false, // is the projects section currently pinned/visible
};
