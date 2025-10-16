import * as THREE from 'three'

/**
 * PerspectiveCamera
 */
export type GetCamera = (settings?: {
  parameters?: Partial<CameraSettings['parameters']>
  position?: Partial<CameraSettings['position']>
  target?: Partial<CameraSettings['target']>
}) => THREE.PerspectiveCamera

export type CameraSettings = {
  parameters?: {
    fov?: number;
    aspect?: number;
    near?: number;
    far?: number;
  };
  position?: { x?: number; y?: number; z?: number };
  target?: { x?: number; y?: number; z?: number };
}
