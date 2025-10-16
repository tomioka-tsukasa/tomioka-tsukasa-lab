export const cameraWork = {
  default: {
    position: {
      x: 10,
      y: 30,
      z: 30,
      mobile: {
        x: 0,
        y: 60,
        z: 0,
      },
    },
    target: {
      x: 0,
      y: 0,
      z: 0,
      mobile: {
        x: 0,
        y: 0,
        z: 0,
      },
    },
    rotation: {
      x: 0,
      y: 0,
      z: 0,
      mobile: {
        x: 0,
        y: 0,
        z: 0,
      },
    },
  },
}

export type CameraWorkMember = {
  position: {
    x: number
    y: number
    z: number
    mobile: {
      x: number
      y: number
      z: number
    },
  },
  target: {
    x: number
    y: number
    z: number
    mobile: {
      x: number
      y: number
      z: number
    },
  },
  rotation: {
    x: number
    y: number
    z: number
    mobile: {
      x: number
      y: number
      z: number
    },
  },
}
