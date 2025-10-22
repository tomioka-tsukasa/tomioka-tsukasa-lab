# 第6章: RGB収差の基礎知識と実装

## RGB収差（色収差/Chromatic Aberration）とは？

RGB収差は、光学現象や映像表現で使われるエフェクトで、赤・緑・青の色チャンネルが微細にずれて表示される現象です。

## 現実の光学現象

### 物理的な原理
- **レンズの屈折特性**: 異なる波長（色）の光が異なる角度で屈折
- **プリズム効果**: 光が分散されて虹色に分かれる現象
- **光の波長差**: 青い光（短波長）と赤い光（長波長）の屈折率の違い

### 実際の発生場面
- **カメラレンズ**: 特に広角レンズや安価なレンズ
- **古いCRTモニター**: 電子ビームの色ずれ
- **映画・テレビ**: 機材による意図しない色ずれ
- **眼鏡やルーペ**: 光学機器の収差

## 視覚的特徴

### 基本的な見た目
- **エッジ部分での色分離**: 物体の輪郭で赤・青の縁取り
- **中心から外側への影響**: 画面端ほど強い収差
- **対称的な分散**: 画面中心を軸とした放射状の効果

### 色の分離パターン
- **赤成分**: 外側に向かって拡散
- **緑成分**: 基準位置（変化なし、または最小）
- **青成分**: 内側に向かって収束

## シェーダーでの基本実装

### 原理
```glsl
// 各色チャンネルを異なるUV座標で取得
float r = texture2D(u_texture, vUv + redOffset).r;
float g = texture2D(u_texture, vUv + greenOffset).g;
float b = texture2D(u_texture, vUv + blueOffset).b;

vec3 result = vec3(r, g, b);
```

### シンプルな水平収差
```glsl
void main() {
    float aberration = 0.01; // 収差の強度

    float r = texture2D(u_texture, vUv + vec2(aberration, 0.0)).r;
    float g = texture2D(u_texture, vUv).g;
    float b = texture2D(u_texture, vUv - vec2(aberration, 0.0)).b;

    gl_FragColor = vec4(r, g, b, 1.0);
}
```

## 放射状収差（最も一般的）

### 実装例
```glsl
void main() {
    // 画面中心からの距離と方向を計算
    vec2 center = vec2(0.5, 0.5);
    vec2 direction = vUv - center;
    float distance = length(direction);
    vec2 normalizedDirection = normalize(direction);

    // 距離に応じて収差を強く
    float aberrationStrength = distance * 0.02;

    // 各色チャンネルに異なるオフセット
    vec2 redOffset = normalizedDirection * aberrationStrength * 1.2;
    vec2 greenOffset = normalizedDirection * aberrationStrength * 1.0;
    vec2 blueOffset = normalizedDirection * aberrationStrength * 0.8;

    // 色チャンネルを個別に取得
    float r = texture2D(u_texture, vUv + redOffset).r;
    float g = texture2D(u_texture, vUv + greenOffset).g;
    float b = texture2D(u_texture, vUv + blueOffset).b;

    gl_FragColor = vec4(r, g, b, 1.0);
}
```

### パラメータの意味
- **aberrationStrength**: 収差の全体的な強度
- **1.2, 1.0, 0.8**: 各色の相対的な拡散率
- **distance**: 中心からの距離（0〜約0.7）

## 応用パターン

### 1. 方向性収差（水平）
```glsl
uniform sampler2D u_texture;
uniform float u_time;
varying vec2 vUv;

void main() {
    float aberration = 0.01; // 収差の強度

    // 水平方向のみの収差
    vec2 redOffset = vec2(aberration, 0.0);
    vec2 blueOffset = vec2(-aberration, 0.0);

    float r = texture2D(u_texture, vUv + redOffset).r;
    float g = texture2D(u_texture, vUv).g;
    float b = texture2D(u_texture, vUv + blueOffset).b;

    gl_FragColor = vec4(r, g, b, 1.0);
}
```

### 2. 時間変化する収差
```glsl
uniform sampler2D u_texture;
uniform float u_time;
varying vec2 vUv;

void main() {
    // 時間とともに収差の強度が変化
    float aberration = sin(u_time) * 0.01 + 0.005;

    // 収差の方向が回転
    float angle = u_time * 0.5;
    vec2 direction = vec2(cos(angle), sin(angle));
    vec2 redOffset = direction * aberration;
    vec2 blueOffset = -direction * aberration;

    float r = texture2D(u_texture, vUv + redOffset).r;
    float g = texture2D(u_texture, vUv).g;
    float b = texture2D(u_texture, vUv + blueOffset).b;

    gl_FragColor = vec4(r, g, b, 1.0);
}
```

### 3. ノイズベース収差
```glsl
uniform sampler2D u_texture;
uniform float u_time;
varying vec2 vUv;

float random(float x) {
    return fract(sin(x * 12.9898) * 43758.5453);
}

void main() {
    // ランダムな収差
    float noiseX = random(vUv.x + u_time) - 0.5;
    float noiseY = random(vUv.y + u_time) - 0.5;
    vec2 randomOffset = vec2(noiseX, noiseY) * 0.05;

    vec2 redOffset = randomOffset;
    vec2 blueOffset = -randomOffset;
    vec2 greenOffset = vec2(0.0, 0.0);

    float r = texture2D(u_texture, vUv + redOffset).r;
    float g = texture2D(u_texture, vUv + greenOffset).g;
    float b = texture2D(u_texture, vUv + blueOffset).b;

    gl_FragColor = vec4(r, g, b, 1.0);
}
```

## 強度の調整指針

### 自然な光学効果
- **強度**: 0.001〜0.005
- **用途**: リアルなカメラシミュレーション
- **特徴**: 微細で気づきにくい程度

### 明確なエフェクト
- **強度**: 0.01〜0.02
- **用途**: アーティスティックな表現
- **特徴**: はっきり見える収差

### 強烈なグリッチ風
- **強度**: 0.05以上
- **用途**: 電子ノイズ、故障表現
- **特徴**: 非現実的で劇的な効果

## 実用的な応用場面

### ゲーム開発
- **レトロゲーム**: CRTモニターの再現
- **サイバーパンク**: 未来的なUI表現
- **ホラーゲーム**: 不安感を演出する歪み

### 映像制作
- **映画的表現**: フィルムカメラの特性再現
- **ミュージックビデオ**: アーティスティックなエフェクト
- **アニメーション**: 迫力ある演出

### Web・UI
- **ホバーエフェクト**: インタラクティブな装飾
- **ローディング画面**: 技術的な雰囲気演出
- **グリッチアート**: 前衛的なデザイン

## パフォーマンス考慮

### 最適化のコツ
```glsl
// 効率的な実装：テクスチャサンプリングを最小限に
vec3 original = texture2D(u_texture, vUv).rgb;
float r = texture2D(u_texture, vUv + redOffset).r;
float b = texture2D(u_texture, vUv + blueOffset).b;

vec3 result = vec3(r, original.g, b);
```

### 条件付き適用
```glsl
// 画面端でのみ適用（パフォーマンス向上）
float distance = length(vUv - 0.5);
if (distance > 0.3) {
    // RGB収差処理
} else {
    // 通常処理
}
```

## 他のエフェクトとの組み合わせ

### グリッチエフェクト
```glsl
// グリッチ時に収差を強化
float aberration = u_glitch_progress * 0.02;
```

### ビネット効果
```glsl
// 画面端の暗化と収差を同時適用
float vignette = 1.0 - distance;
vec3 result = rgbAberration * vignette;
```

### ノイズフィルター
```glsl
// ノイズと収差の複合エフェクト
vec3 aberratedColor = rgbAberration;
float noise = random2d(vUv);
vec3 result = mix(aberratedColor, vec3(noise), 0.1);
```

## まとめ

### RGB収差の重要ポイント
1. **光学現象の模倣**: 現実のレンズ特性を再現
2. **色チャンネル分離**: R・G・Bを個別に位置ずらし
3. **距離ベース制御**: 画面中心からの距離で強度調整
4. **アーティスティック表現**: 技術的制約を逆手に取った演出

### 実装の基本ステップ
1. **中心座標の定義** (`vec2(0.5, 0.5)`)
2. **距離・方向の計算** (`length()`, `normalize()`)
3. **オフセット量の決定** (距離×強度×色係数)
4. **個別テクスチャサンプリング** (各色チャンネル)
5. **最終色の合成** (`vec3(r, g, b)`)

RGB収差は、微細な調整で大きく印象が変わる繊細なエフェクトです。目的に応じて適切な強度と方向を選択することが重要です。