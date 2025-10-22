# 第7章: ノイズストライプエフェクトの実装

## カオスを制御するストライプノイズとは？

The Book of Shadersの「カオスを制御する」で紹介される細かいノイズを、水平方向に交互にストライプ状に適用するエフェクトです。

## 基本的な仕組み

### 1. ストライプの生成
```glsl
// Y座標を使ってストライプパターンを作成
float stripe = mod(floor(vUv.y * stripeCount), 2.0);
// stripe = 0.0 or 1.0 (交互に切り替わる)
```

### 2. ノイズの生成
```glsl
// 細かい粒度のノイズ
float noise = random2d(vUv * noiseScale);
```

### 3. 組み合わせ
```glsl
// ストライプでノイズの適用を制御
float finalNoise = noise * stripe;
```

## 基本実装

### シンプルなノイズストライプ
```glsl
uniform sampler2D u_texture;
uniform float u_time;
varying vec2 vUv;

float random2d(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
    vec3 textureColor = texture2D(u_texture, vUv).rgb;

    // ストライプパターンの生成
    float stripeCount = 20.0; // ストライプの本数
    float stripe = mod(floor(vUv.y * stripeCount), 2.0);

    // 細かいノイズの生成
    float noiseScale = 100.0;
    float noise = random2d(vUv * noiseScale);

    // ストライプでノイズを制御
    float finalNoise = noise * stripe;

    // テクスチャとノイズを合成
    vec3 result = mix(textureColor, vec3(finalNoise), 0.5);

    gl_FragColor = vec4(result, 1.0);
}
```

## 応用パターン

### 1. アニメーションストライプ
```glsl
uniform sampler2D u_texture;
uniform float u_time;
varying vec2 vUv;

float random2d(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
    vec3 textureColor = texture2D(u_texture, vUv).rgb;

    // 時間で移動するストライプ
    float stripeCount = 15.0;
    float animatedY = vUv.y + u_time * 0.1;
    float stripe = mod(floor(animatedY * stripeCount), 2.0);

    // 時間変化するノイズ
    float noiseScale = 80.0;
    vec2 noiseCoord = vUv * noiseScale + vec2(0.0, u_time * 2.0);
    float noise = random2d(noiseCoord);

    // ストライプでノイズを制御
    float finalNoise = noise * stripe;

    vec3 result = mix(textureColor, vec3(finalNoise), 0.3);

    gl_FragColor = vec4(result, 1.0);
}
```

### 2. グリッチ風ノイズストライプ
```glsl
uniform sampler2D u_texture;
uniform float u_time;
varying vec2 vUv;

float random(float x) {
    return fract(sin(x * 12.9898) * 43758.5453);
}

float random2d(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
    vec3 textureColor = texture2D(u_texture, vUv).rgb;

    // 不規則なストライプサイズ
    float baseStripeCount = 25.0;
    float stripeVariation = random(floor(vUv.y * 10.0)) * 10.0;
    float stripeCount = baseStripeCount + stripeVariation;

    float stripe = mod(floor(vUv.y * stripeCount), 2.0);

    // 高密度ノイズ
    float noiseScale = 200.0;
    vec2 noiseCoord = vUv * noiseScale;
    noiseCoord.x += sin(u_time * 3.0) * 0.1; // 水平方向の揺れ

    float noise = random2d(noiseCoord);

    // ストライプでノイズを制御
    float finalNoise = noise * stripe;

    // より強いコントラスト
    finalNoise = step(0.5, finalNoise);

    vec3 result = mix(textureColor, vec3(finalNoise), 0.4);

    gl_FragColor = vec4(result, 1.0);
}
```

### 3. カラーノイズストライプ
```glsl
uniform sampler2D u_texture;
uniform float u_time;
varying vec2 vUv;

float random2d(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec3 colorNoise(vec2 st) {
    float r = random2d(st);
    float g = random2d(st + vec2(1.0, 0.0));
    float b = random2d(st + vec2(0.0, 1.0));
    return vec3(r, g, b);
}

void main() {
    vec3 textureColor = texture2D(u_texture, vUv).rgb;

    // ストライプパターン
    float stripeCount = 30.0;
    float stripe = mod(floor(vUv.y * stripeCount), 2.0);

    // カラーノイズの生成
    float noiseScale = 150.0;
    vec2 noiseCoord = vUv * noiseScale + vec2(u_time * 0.5, 0.0);
    vec3 noise = colorNoise(noiseCoord);

    // ストライプでノイズを制御
    vec3 finalNoise = noise * stripe;

    vec3 result = mix(textureColor, finalNoise, 0.6);

    gl_FragColor = vec4(result, 1.0);
}
```

## パラメータの意味と調整

### ストライプ関連
- **stripeCount**: ストライプの本数（大きいほど細かい）
- **mod(floor(y * count), 2.0)**: 0と1を交互に生成
- **animatedY**: 時間による移動量

### ノイズ関連
- **noiseScale**: ノイズの細かさ（大きいほど細かい）
- **時間オフセット**: ノイズの動きの速度
- **mix比率**: 元画像とノイズの混合比

## 数学的理解

### ストライプ生成の仕組み
```glsl
// ステップ1: Y座標をストライプ数で乗算
float scaledY = vUv.y * stripeCount; // 0〜stripeCount

// ステップ2: floor関数で整数化
float flooredY = floor(scaledY); // 0, 1, 2, 3, ...

// ステップ3: mod関数で2で割った余り
float stripe = mod(flooredY, 2.0); // 0, 1, 0, 1, ...
```

### 可視化例
```
stripeCount = 4.0の場合:
vUv.y     scaledY   floor    mod(,2)
0.0       0.0       0.0      0.0
0.1       0.4       0.0      0.0
0.25      1.0       1.0      1.0
0.4       1.6       1.0      1.0
0.5       2.0       2.0      0.0
0.75      3.0       3.0      1.0
1.0       4.0       4.0      0.0
```

## 実用的な応用

### 1. グリッチエフェクト
```glsl
// グリッチ時にノイズストライプを強化
float glitchStripe = stripe * u_glitch_intensity;
vec3 glitchNoise = finalNoise * glitchStripe;
```

### 2. VHSテープ風エフェクト
```glsl
// VHSのノイズライン再現
float vhsStripe = mod(floor((vUv.y + u_time * 0.01) * 480.0), 2.0);
float vhsNoise = random2d(vUv * 500.0 + u_time) * vhsStripe;
```

### 3. スキャンライン効果
```glsl
// CRTモニターのスキャンライン
float scanline = mod(floor(vUv.y * 240.0), 2.0);
vec3 result = textureColor * (0.8 + scanline * 0.2);
```

## パフォーマンス最適化

### 1. 計算の簡略化
```glsl
// 重い計算
float stripe = mod(floor(vUv.y * stripeCount), 2.0);

// 軽い計算（step関数使用）
float stripe = step(0.5, mod(floor(vUv.y * stripeCount), 2.0));
```

### 2. 条件分岐の削減
```glsl
// 条件分岐を使用（重い）
if (stripe > 0.5) {
    result = mix(textureColor, vec3(noise), 0.5);
} else {
    result = textureColor;
}

// mix関数で統一（軽い）
result = mix(textureColor, mix(textureColor, vec3(noise), 0.5), stripe);
```

## まとめ

### ノイズストライプの重要ポイント
1. **mod関数の活用**: 交互パターンの生成
2. **floor関数**: 段階的な値の作成
3. **ノイズの制御**: ストライプマスクによる適用範囲限定
4. **時間アニメーション**: 動的なエフェクト

### 実装の基本ステップ
1. **Y座標の分割** (`floor(vUv.y * count)`)
2. **交互パターン生成** (`mod(value, 2.0)`)
3. **ノイズ生成** (`random2d()`)
4. **マスク適用** (`noise * stripe`)
5. **最終合成** (`mix()`)

ノイズストライプは、レトロなテレビ効果やグリッチエフェクトに最適で、細かい制御により様々な表現が可能です。