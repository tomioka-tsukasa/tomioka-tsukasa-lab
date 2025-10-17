# WebGL Shader グリッチエフェクト調査

## 概要

WebGL Shaderにおけるグリッチエフェクトとノイズエフェクトの違い、実装方法、サンプルコードについて調査した結果をまとめています。

## グリッチエフェクトとは

グリッチ（Glitch）とは、電波の悪い時にアナログテレビで見られたノイズや、デジタル機器の故障を模倣した視覚効果のことを指します。デジタルアートやWebデザインにおいては、意図的にカオスや不規則性を作り出す表現手法として使用されています。

### グリッチエフェクトの特徴

- **デジタル的な故障感**: アナログ/デジタル機器の不具合を模倣
- **断続的な変化**: 時間軸での突発的な歪み
- **方向性のある歪み**: 主に水平方向の線状の変形
- **色収差効果**: RGBチャンネルのオフセット
- **UV座標の意図的な破綻**: テクスチャ座標の故意な操作

## ノイズエフェクトとは

ノイズ（Noise）は、より自然で連続的なランダム性を表現するエフェクトです。

### ノイズエフェクトの特徴

- **連続的な変化**: 滑らかで自然な変動
- **均一な分散**: 砂嵐のような一様な粗さ
- **テクスチャの追加**: 表面の質感やざらつきの表現

### ノイズの種類

1. **パーリンノイズ**: 入力値に対して徐々に変化する滑らかな乱数
2. **ホワイトノイズ**: 完全にランダムな値の生成
3. **フラクタルノイズ**: 複数の周波数を組み合わせた複雑なノイズ

## WebGL Shader実装方法

### 基本的なグリッチエフェクト

```glsl
#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
uniform sampler2D uTexture;
uniform float uTime;

void main() {
    vec2 uv = vUv;

    // UV座標の歪み
    float distortion = sin(uv.y * 10.0 + uTime * 5.0) * 0.01;
    uv.x += distortion;

    vec4 color = texture2D(uTexture, uv);
    gl_FragColor = color;
}
```

### RGB色収差エフェクト

```glsl
uniform sampler2D uTexture;
varying vec2 vUv;

void main() {
    vec2 uv = vUv;

    // 各色チャンネルを異なるオフセットで取得
    float red = texture2D(uTexture, vec2(uv.x + 0.01, uv.y)).r;
    float green = texture2D(uTexture, uv).g;
    float blue = texture2D(uTexture, vec2(uv.x - 0.01, uv.y)).b;

    gl_FragColor = vec4(red, green, blue, 1.0);
}
```

### バルジ歪みエフェクト

```glsl
vec2 bulge(vec2 uv, vec2 center) {
    const float radius = 0.6;
    const float strength = 1.1;

    uv -= center;
    float dist = length(uv) / radius;
    float distPow = pow(dist, 2.0);
    float strengthAmount = strength / (1.0 + distPow);
    uv *= strengthAmount;
    uv += center;
    return uv;
}

void main() {
    vec2 uv = vUv;
    uv = bulge(uv, vec2(0.5, 0.5));

    vec4 color = texture2D(uTexture, uv);
    gl_FragColor = color;
}
```

### ノイズベースのグリッチ

```glsl
uniform sampler2D uTexture;
uniform float uTime;
varying vec2 vUv;

float random(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    vec2 uv = vUv;

    // ランダムノイズの生成
    vec2 noisePos = uv * sin(uTime);
    float noise = random(noisePos);

    // テクスチャ色の取得
    vec3 color = texture2D(uTexture, uv).rgb;

    // ノイズの適用
    float noiseIntensity = 0.5;
    color = mix(color, vec3(noise), noiseIntensity);

    gl_FragColor = vec4(color, 1.0);
}
```

## 実装のキーポイント

### UV座標の操作

グリッチエフェクトの基本は、テクスチャサンプリング時に使用するUV座標を意図的に歪めることです。

```glsl
// 基本的なUV歪み
vec2 distortedUV = originalUV + distortionVector;
vec4 color = texture2D(uTexture, distortedUV);
```

### 時間ベースのアニメーション

```glsl
// 時間を使った動的な効果
float animatedValue = sin(uTime * frequency) * amplitude;
```

### ライン状の歪み

```glsl
// 水平ラインのグリッチ効果
if (mod(floor(uv.y * resolution.y), lineSpacing) < lineWidth) {
    uv.x += glitchOffset;
}
```

## ツールとライブラリ

### 開発環境

- **Shadertoy**: オンラインシェーダー開発環境
- **Twigl**: 軽量なシェーダー実行環境
- **NEORT**: シェーダー作品の共有プラットフォーム

### フレームワーク

- **Three.js**: WebGL開発のための汎用ライブラリ
- **VFX-JS**: WebGLエフェクト作成を簡素化するライブラリ
- **OGL**: 軽量なWebGLライブラリ

## 学習リソース

### 日本語リソース

- [そろそろShaderをやるパート38 グリッチ表現](https://zenn.dev/kento_o/articles/08ec03e29ed636)
- [Unityシェーダー超入門⑩ グリッチアニメーション](https://zenn.dev/umeyan/articles/e312dd0bd8a61f)
- [フラグメントシェーダーでグリッチをやりたいけど上手くいかない](https://nogson2.hatenablog.com/entry/2017/12/12/192100)

### 英語リソース

- [VFX-JS: WebGL Effects Made Easy | Codrops](https://tympanus.net/codrops/2025/01/20/vfx-js-webgl-effects-made-easy/)
- [Creating a Bulge Distortion Effect with WebGL | Codrops](https://tympanus.net/codrops/2023/06/28/creating-a-bulge-distortion-effect-with-webgl/)
- [Awwwards WebGL Shaders Collection](https://www.awwwards.com/awwwards/collections/webgl-shaders-code/)

### GitHubリポジトリ

- [ykob/glsl-glitch](https://github.com/ykob/glsl-glitch) - WebGLフラグメントシェーダーでのグリッチテスト
- [Dmitry-Sm/Distortion-effect](https://github.com/Dmitry-Sm/Distortion-effect) - Three.js、WebGL、GLSLシェーダーの歪みエフェクト

## まとめ

グリッチエフェクトとノイズエフェクトは、どちらもWebGL Shaderで表現可能な視覚効果ですが、以下の点で大きく異なります：

**グリッチエフェクト**
- デジタル機器の故障を模倣
- 断続的で方向性のある歪み
- UV座標の意図的な破綻が特徴

**ノイズエフェクト**
- 自然で連続的なランダム性
- 均一な分散による質感の追加
- パーリンノイズなどの数学的手法を使用

これらの技術を組み合わせることで、より豊かな視覚表現が可能になります。実装時は、エフェクトの目的と表現したい感情に応じて適切な手法を選択することが重要です。
