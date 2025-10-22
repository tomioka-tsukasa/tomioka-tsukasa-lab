# 第8章: 頂点変形エフェクト（電波ノイズ）

## 電波ノイズ風頂点変形とは？

頂点シェーダーを使用して、画像や3Dオブジェクトを電波受信不良のように「グニャグニャ」と歪ませるエフェクトです。主にX軸方向に大きく波打ち、Y軸にも微細な揺らぎを加えることで、アナログテレビの受信障害のような視覚効果を実現します。

## 基本概念

### 頂点シェーダーの役割
頂点シェーダーは、3Dオブジェクトの各頂点の位置を決定するプログラムです：

```glsl
// 基本的な頂点シェーダーの構造
attribute vec3 position;  // 元の頂点位置
uniform float u_time;     // 時間
uniform float u_glitch_progress; // グリッチの進行度

void main() {
    vec3 newPosition = position;

    // ここで頂点位置を変形
    newPosition.x += sin(position.y + u_time) * amplitude;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
```

### ジオメトリの分割の重要性

**分割数と表現力の関係**：
- **1x1分割**: 4頂点 → 変形不可
- **10x10分割**: 121頂点 → 粗い変形
- **100x100分割**: 10,201頂点 → 滑らかな変形
- **300x300分割**: 90,301頂点 → 非常に滑らかな変形

```javascript
// Three.jsでの分割設定
const geometry = new THREE.PlaneGeometry(
    20,    // 幅
    20,    // 高さ
    300,   // 幅の分割数
    300    // 高さの分割数
);
```

## 数学的実装

### 1. 基本的なX軸波打ち
```glsl
uniform float u_time;
attribute vec3 position;

void main() {
    vec3 newPosition = position;

    // Y座標に基づいてX方向に波打つ
    float frequency = 0.5;  // 波の密度
    float amplitude = 2.0;  // 波の振幅
    float speed = 2.0;      // 波の速度

    float wave = sin(position.y * frequency + u_time * speed) * amplitude;
    newPosition.x += wave;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
```

### 2. 複数周波数の合成による複雑な歪み
```glsl
float createComplexWave(float pos, float time) {
    // 低周波の大きな波
    float wave1 = sin(pos * 0.3 + time * 1.5) * 3.0;

    // 中周波の中くらいの波
    float wave2 = sin(pos * 0.8 + time * 2.2) * 1.5;

    // 高周波の細かい波
    float wave3 = sin(pos * 2.1 + time * 3.8) * 0.8;

    return wave1 + wave2 + wave3;
}

void main() {
    vec3 newPosition = position;

    float distortionX = createComplexWave(position.y, u_time);
    newPosition.x += distortionX;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
```

### 3. ランダムノイズの追加
```glsl
float random(float x) {
    return fract(sin(x * 12.9898) * 43758.5453);
}

void main() {
    vec3 newPosition = position;

    // 基本的な波
    float wave = createComplexWave(position.y, u_time);

    // ランダムノイズを追加
    float noise = (random(position.y * 0.1 + u_time) - 0.5) * 1.0;

    newPosition.x += wave + noise;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
```

### 4. Y軸の微細な揺らぎ
```glsl
void main() {
    vec3 newPosition = position;

    // X軸の大きな歪み
    float distortionX = createComplexWave(position.y, u_time);
    distortionX += (random(position.y * 0.1 + u_time) - 0.5) * 1.0;

    // Y軸の微細な揺らぎ
    float distortionY = sin(position.x * 2.0 + u_time * 3.0) * 0.3;
    distortionY += (random(position.x * 0.05 + u_time * 0.7) - 0.5) * 0.2;

    newPosition.x += distortionX;
    newPosition.y += distortionY;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
```

### 5. グリッチ進行度による制御
```glsl
uniform float u_glitch_progress; // 0.0 〜 1.0

void main() {
    vec3 newPosition = position;

    // グリッチの強度を計算
    float intensity = u_glitch_progress * 3.0; // 最大強度3.0

    // 各種歪みを計算
    float distortionX = createComplexWave(position.y, u_time);
    distortionX += (random(position.y * 0.1 + u_time) - 0.5) * 1.0;

    float distortionY = sin(position.x * 2.0 + u_time * 3.0) * 0.3;
    distortionY += (random(position.x * 0.05 + u_time * 0.7) - 0.5) * 0.2;

    // 強度を適用
    newPosition.x += distortionX * intensity;
    newPosition.y += distortionY * intensity;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
```

## 完全な実装例

### 頂点シェーダー（vertex.glsl）
```glsl
uniform float u_time;
uniform float u_glitch_progress;
uniform float u_phase;
varying vec2 vUv;

float random(float x) {
    return fract(sin(x * 12.9898) * 43758.5453);
}

float createComplexWave(float pos, float time) {
    float wave1 = sin(pos * 0.3 + time * 1.5) * 3.0;
    float wave2 = sin(pos * 0.8 + time * 2.2) * 1.5;
    float wave3 = sin(pos * 2.1 + time * 3.8) * 0.8;
    return wave1 + wave2 + wave3;
}

void main() {
    vec3 newPosition = position;

    // グリッチが有効な場合のみ変形を適用
    if (u_phase == 1.0) {
        // グリッチの強度
        float intensity = u_glitch_progress * 2.5;

        // X軸の大きな歪み
        float distortionX = createComplexWave(position.y, u_time);
        distortionX += (random(position.y * 0.1 + u_time) - 0.5) * 1.2;

        // Y軸の微細な揺らぎ
        float distortionY = sin(position.x * 2.0 + u_time * 3.0) * 0.3;
        distortionY += (random(position.x * 0.05 + u_time * 0.7) - 0.5) * 0.2;

        // 強度を適用
        newPosition.x += distortionX * intensity;
        newPosition.y += distortionY * intensity;
    }

    // UV座標を渡す
    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
```

### Three.jsでの統合
```javascript
// ジオメトリの作成（高分割）
const geometry = new THREE.PlaneGeometry(20, 20, 300, 300);

// シェーダーマテリアルの作成
const material = new THREE.ShaderMaterial({
    vertexShader: vertexShaderCode,
    fragmentShader: fragmentShaderCode,
    uniforms: {
        u_time: { value: 0 },
        u_glitch_progress: { value: 0.0 },
        u_phase: { value: 0.0 },
        u_texture_01: { value: texture1 },
        u_texture_02: { value: texture2 }
    }
});

// アニメーションループで更新
function animate() {
    material.uniforms.u_time.value += 0.01;

    // グリッチ状態の制御
    if (isGlitching) {
        material.uniforms.u_phase.value = 1.0;
        material.uniforms.u_glitch_progress.value = glitchProgress; // 0.0 〜 1.0
    } else {
        material.uniforms.u_phase.value = 0.0;
        material.uniforms.u_glitch_progress.value = 0.0;
    }
}
```

## パフォーマンス最適化

### 1. 条件分岐の最適化
```glsl
// 条件分岐を避けてパフォーマンス向上
float isActive = step(0.5, u_phase); // u_phase >= 1.0 なら 1.0、そうでなければ 0.0
float intensity = u_glitch_progress * isActive * 2.5;

newPosition.x += distortionX * intensity;
newPosition.y += distortionY * intensity;
```

### 2. 計算の最適化
```glsl
// 重い計算を事前計算
float timeOffset = u_time * 1.5;
float positionFactor = position.y * 0.3;

// 一度だけ計算
float wave1 = sin(positionFactor + timeOffset) * 3.0;
```

### 3. LOD（Level of Detail）の活用
```javascript
// カメラからの距離に応じて分割数を変更
const distance = camera.position.distanceTo(mesh.position);
const subdivisions = distance < 50 ? 300 : distance < 100 ? 150 : 50;

const geometry = new THREE.PlaneGeometry(20, 20, subdivisions, subdivisions);
```

## 応用パターン

### 1. ランダムなグリッチ方向
```glsl
void main() {
    vec3 newPosition = position;

    if (u_phase == 1.0) {
        float intensity = u_glitch_progress * 2.5;

        // ランダムな方向の歪み
        float angle = random(floor(u_time * 2.0)) * 6.28318; // 0 〜 2π
        vec2 direction = vec2(cos(angle), sin(angle));

        float distortion = createComplexWave(position.y, u_time);

        newPosition.x += distortion * direction.x * intensity;
        newPosition.y += distortion * direction.y * intensity * 0.3;
    }

    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
```

### 2. 部分的なグリッチ
```glsl
void main() {
    vec3 newPosition = position;

    if (u_phase == 1.0) {
        // Y座標の特定範囲でのみグリッチを適用
        float yRange = smoothstep(-5.0, -3.0, position.y) *
                       (1.0 - smoothstep(3.0, 5.0, position.y));

        float intensity = u_glitch_progress * yRange * 3.0;

        float distortionX = createComplexWave(position.y, u_time);
        newPosition.x += distortionX * intensity;
    }

    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
```

### 3. 時間遅延効果
```glsl
void main() {
    vec3 newPosition = position;

    if (u_phase == 1.0) {
        // Y座標に基づいて時間遅延を作成
        float delay = position.y * 0.1;
        float delayedTime = u_time - delay;

        float intensity = u_glitch_progress * 2.5;
        float distortionX = createComplexWave(position.y, delayedTime);

        newPosition.x += distortionX * intensity;
    }

    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
```

## デバッグとトラブルシューティング

### 1. 頂点変形の可視化
```glsl
// デバッグ用：変形量を色で表示
varying float vDistortion;

void main() {
    // ... 変形計算 ...

    vDistortion = abs(distortionX) / 5.0; // 正規化

    // ... 位置設定 ...
}
```

```glsl
// フラグメントシェーダーで色表示
varying float vDistortion;

void main() {
    vec3 debugColor = vec3(vDistortion, 0.0, 1.0 - vDistortion);
    gl_FragColor = vec4(debugColor, 1.0);
}
```

### 2. パフォーマンス監視
```javascript
// 頂点数の監視
console.log(`頂点数: ${geometry.attributes.position.count}`);

// フレームレート監視
const stats = new Stats();
document.body.appendChild(stats.dom);

function animate() {
    stats.begin();

    // レンダリング処理

    stats.end();
}
```

### 3. よくある問題と解決方法

**問題**: 変形が見えない
- **原因**: ジオメトリの分割数が少ない
- **解決**: 分割数を増やす（100x100以上推奨）

**問題**: パフォーマンスが悪い
- **原因**: 分割数が多すぎる、計算が重い
- **解決**: LODを使用、計算を最適化

**問題**: ちらつきが発生
- **原因**: ランダム関数の精度不足
- **解決**: より良いランダム関数を使用

## まとめ

### 頂点変形エフェクトの重要ポイント
1. **分割数**: 滑らかな変形には十分な頂点が必要
2. **数学関数**: sin波とランダムの組み合わせで自然な歪み
3. **強度制御**: グリッチ進行度による動的な制御
4. **パフォーマンス**: 適切な最適化でリアルタイム処理

### 実装の基本ステップ
1. **高分割ジオメトリの作成** (300x300推奨)
2. **複合波形関数の実装** (複数周波数の合成)
3. **ランダム要素の追加** (電波ノイズ感の演出)
4. **グリッチ制御の統合** (既存システムとの連動)
5. **パフォーマンス最適化** (条件分岐の削減、LOD対応)

頂点変形エフェクトは、フラグメントシェーダーだけでは表現できない立体的な歪みを可能にし、よりリアルで印象的なグリッチエフェクトを実現する重要な技術です。