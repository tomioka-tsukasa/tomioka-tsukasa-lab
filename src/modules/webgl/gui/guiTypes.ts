/**
 * GUIの設定テンプレート型
 */
export type GUITemplate = {
  type: 'number' | 'boolean' | 'color' | 'select';
  label: string;
  min?: number;
  max?: number;
  step?: number;
  options?: string[] | number[];
};

/**
 * GUI設定の型
 */
export type GUISettings = {
  [key: string]: number | string | boolean | { [key: string]: number };
};

/**
 * SpotLightのパラメータ型
 */
export type SpotLightParameterKey = 'intensity' | 'distance' | 'angle' | 'decay' | 'penumbra' | 'power' | 'color';
