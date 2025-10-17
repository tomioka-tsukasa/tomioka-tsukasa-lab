# シェーダーライブラリ

GLSLの汎用関数を管理するためのライブラリです。

## 使用方法

### 基本的な使い方（#include）

GLSLファイルを直接インクルードして使用します：

```glsl
#include "./random.glsl"

varying vec2 vUv;

void main() {
  float r = random(vUv.x);
  gl_FragColor = vec4(vec3(r), 1.0);
}
```

### 手動コピー方式

環境が#includeに対応していない場合は、必要な関数をコピーして使用します：

```glsl
// random.glslから基本関数をコピー
float random(float x) {
    return fract(sin(x * 12.9898) * 43758.5453);
}

varying vec2 vUv;

void main() {
  float r = random(vUv.x);
  gl_FragColor = vec4(vec3(r), 1.0);
}
```

### 利用可能なランダム関数

#### 基本関数
- `random(float x)` - 基本的な1Dランダム
- `random2d(vec2 st)` - 基本的な2Dランダム

#### 改良版関数
- `randomImproved(float x)` - より良い分布の1Dランダム
- `random2dImproved(vec2 st)` - より良い分布の2Dランダム
- `random2dHQ(vec2 st)` - 高品質2Dランダム

#### 範囲指定関数
- `randomSigned(float x)` - -1から1の範囲
- `random2dSigned(vec2 st)` - -1から1の範囲（2D）
- `randomRange(float x, float min, float max)` - 任意範囲
- `random2dRange(vec2 st, float min, float max)` - 任意範囲（2D）

## 実際の使用例

### 1. 垂直ストライプ
```glsl
#include "./random.glsl"

void main() {
  float r = random(vUv.x);
  gl_FragColor = vec4(vec3(r), 1.0);
}
```

### 2. グリッドパターン
```glsl
#include "./random.glsl"

void main() {
  vec2 grid = floor(vUv * 10.0);
  float r = random2d(grid);
  gl_FragColor = vec4(vec3(r), 1.0);
}
```

### 3. カラフルなランダム
```glsl
#include "./random.glsl"

void main() {
  vec2 grid = floor(vUv * 8.0);
  float r = random2d(grid);
  float g = random2d(grid + 100.0);
  float b = random2d(grid + 200.0);
  gl_FragColor = vec4(r, g, b, 1.0);
}
```

## 今後の拡張

- `math.glsl` - 数学関数ライブラリ
- `noise.glsl` - ノイズ関数ライブラリ
- `color.glsl` - カラー操作関数ライブラリ
- `sdf.glsl` - 距離関数ライブラリ