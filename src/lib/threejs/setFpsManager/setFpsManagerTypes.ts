export type SetFpsManager = (
  targetFps: number,
  options?: {
    log?: boolean,
  }
) => {
  status: FpsStatus,
  rendering: FpsRendering,
}

export type FpsStatus = {
  fps: number,
  fixedFps: number,
}

export type FpsRendering = (
  timestamp: number,
  process: () => void,
) => void

export type FpsCounter = {
  rawFrameCount: number,
  adjustedFrameCount: number,
  lastTimestamp: number,
  lastRenderTime: number,
  targetInterval: number,
}
