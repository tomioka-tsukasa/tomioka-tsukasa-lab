import * as THREE from 'three'

/**
 * SpotLight
 */
export type GetSpotLight = (settings?: {
  parameters?: Partial<SpotLightSettings['parameters']>
  position?: Partial<SpotLightSettings['position']>
  target?: Partial<SpotLightSettings['target']>
  shadow?: Partial<SpotLightSettings['shadow']>
}) => THREE.SpotLight

export type SpotLightSettings = {
  position: { x: number; y: number; z: number };
  target: { x: number; y: number; z: number };
  parameters: {
    intensity: number;
    distance: number;
    angle: number;
    decay: number;
    penumbra: number;
    power: number;
    color: string;
  };
  shadow: SpotLightShadowSettings;
};

export type SpotLightShadowMapSize = {
  width: number;
  height: number;
};

export type SpotLightShadowCamera = {
  near: number;
  far: number;
};

export type SpotLightShadowSettings = {
  mapSize: SpotLightShadowMapSize;
  camera: SpotLightShadowCamera;
  focus: number;
};
