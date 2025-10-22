export const cameraWork = {
  default: {
    position: {
      x: 0,
      y: 10,
      z: 14.2,
      mobile: {
        x: 0,
        y: 10,
        z: 14.2,
      },
    },
    target: {
      x: 0,
      y: 10,
      z: 0,
      mobile: {
        x: 0,
        y: 10,
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
