# 第5章: アニメーションとランダム

参考記事：[The Book of Shaders - Random](https://thebookofshaders.com/10/?lan=jp)

## 時間を使ったランダムアニメーション

**時間（u_time）**をランダム関数に組み込むことで、ランダムパターンを動的に変化させることができます。

## 基本的な時間ベースランダム

### 1. 時間を直接使う
```glsl
float timeRandom = random(u_time);
```
- 時間とともに値が変化
- 画面全体が同じ値で変化

### 2. 位置と時間を組み合わせる
```glsl
float animatedRandom = random(vUv.x + u_time);
```
- 各ピクセルで異なる値
- 時間とともに横方向にパターンが流れる

### 3. 2D座標と時間の組み合わせ
```glsl
float timeNoise = random2d(vUv + u_time * 0.1);
```
- 2D空間でのランダムパターン
- ゆっくりとした時間変化（0.1倍速）

## 時間制御のテクニック

### 速度調整
```glsl
// ゆっくり変化
float slow = random2d(vUv + u_time * 0.01);

// 普通の速度
float normal = random2d(vUv + u_time * 0.1);

// 高速変化
float fast = random2d(vUv + u_time * 1.0);
```

### 離散的な時間変化
```glsl
// 1秒ごとに変化
float stepped = random2d(vUv + floor(u_time));

// 0.5秒ごとに変化
float halfStepped = random2d(vUv + floor(u_time * 2.0));
```

### 周期的な変化
```glsl
// sin波による周期的変化
float periodic = random2d(vUv + sin(u_time));

// より複雑な周期
float complex = random2d(vUv + sin(u_time * 0.5) * 2.0);
```

## 実践的なアニメーションパターン

### 1. フリッカー効果
```glsl
void main() {
    vec2 grid = floor(vUv * 10.0);
    float flicker = random2d(grid + floor(u_time * 10.0));

    vec3 color = vec3(flicker);
    gl_FragColor = vec4(color, 1.0);
}
```

**詳細解説:**
- `vUv * 10.0` → UV座標を10倍に拡大（0〜1が0〜10になる）
- `floor()` → 小数点以下を切り捨て、10x10のグリッドを作成
- `u_time * 10.0` → 時間を10倍速に加速
- `floor(u_time * 10.0)` → 0.1秒ごとに値が変わる階段状の時間
- `grid + floor(u_time * 10.0)` → グリッド座標に時間を加算、各セルが時間で変化
- **結果**: 10x10のセルが0.1秒ごとにランダムに明滅

### 2. 流れるノイズ
```glsl
void main() {
    vec2 flowingUV = vUv + vec2(u_time * 0.1, 0.0);
    float noise = random2d(floor(flowingUV * 20.0));

    vec3 color = vec3(noise);
    gl_FragColor = vec4(color, 1.0);
}
```

**詳細解説:**
- `vec2(u_time * 0.1, 0.0)` → X軸にゆっくり移動するベクトル
- `vUv + vec2(...)` → UV座標を右方向にスライド
- `flowingUV * 20.0` → 流れるUV座標を20倍拡大
- `floor()` → 20x20のグリッドを作成
- **結果**: ノイズパターンが右方向にゆっくり流れる
- **応用**: Y軸も加えると斜め方向、負の値で逆流

### 3. パルス効果
```glsl
void main() {
    float pulse = sin(u_time * 5.0) * 0.5 + 0.5;
    float noise = random2d(floor(vUv * mix(5.0, 50.0, pulse)));

    vec3 color = vec3(noise);
    gl_FragColor = vec4(color, 1.0);
}
```

**詳細解説:**
- `sin(u_time * 5.0)` → -1〜1で5Hz振動
- `* 0.5 + 0.5` → 0〜1の範囲に正規化
- `mix(5.0, 50.0, pulse)` → pulseに応じて5.0〜50.0を補間
- `vUv * mix(...)` → グリッドサイズが5x5〜50x50で変化
- **結果**: グリッドサイズが周期的に変化し、ノイズの密度が脈動
- **視覚効果**: 粗いノイズ→細かいノイズを繰り返す

### 4. レイヤー重ね
```glsl
void main() {
    // 異なる速度の複数レイヤー
    float layer1 = random2d(floor(vUv * 10.0) + u_time * 0.1);
    float layer2 = random2d(floor(vUv * 5.0) + u_time * 0.05);
    float layer3 = random2d(floor(vUv * 20.0) + u_time * 0.2);

    float combined = (layer1 + layer2 + layer3) / 3.0;

    vec3 color = vec3(combined);
    gl_FragColor = vec4(color, 1.0);
}
```

**詳細解説:**
- **layer1**: 10x10グリッド、普通の速度（0.1）
- **layer2**: 5x5グリッド、遅い速度（0.05）
- **layer3**: 20x20グリッド、速い速度（0.2）
- `(layer1 + layer2 + layer3) / 3.0` → 3つの平均値
- **結果**: 異なるスケールと速度のノイズが重なった複雑なパターン
- **特徴**: 自然でオーガニックな質感

## テクスチャアニメーション応用

### UV座標の時間変化
```glsl
void main() {
    vec3 textureColor = texture2D(u_texture, vUv).rgb;

    // 時間で変化するグリッド
    vec2 animatedGrid = floor(vUv * 20.0 + u_time * 0.1);
    float noise = random2d(animatedGrid);

    // テクスチャにアニメーションノイズを適用
    vec3 finalColor = textureColor * (0.3 + noise * 0.7);

    gl_FragColor = vec4(finalColor, 1.0);
}
```

**詳細解説:**
- `vUv * 20.0 + u_time * 0.1` → グリッド座標が時間で移動
- `floor()` → 移動するグリッドを作成
- `textureColor * (0.3 + noise * 0.7)` → テクスチャに30%〜100%の明度変調
- **結果**: 画像の上をノイズパターンが流れながら明暗変化
- **用途**: TV雑音、古いフィルム効果

### UV歪みのアニメーション（現在実装中）
```glsl
void main() {
    // 時間で変化する歪み
    vec2 grid = floor(vUv * 30.0);
    float noiseX = random2d(grid + u_time * 0.1);
    float noiseY = random2d(grid + u_time * 0.1 + vec2(1.0, 1.0));

    // UV座標を時間とともに歪ませる
    vec2 distortedUV = vUv + vec2(noiseX - 0.5, noiseY - 0.5) * 0.01;

    vec3 textureColor = texture2D(u_texture, distortedUV).rgb;
    gl_FragColor = vec4(textureColor, 1.0);
}
```

**詳細解説:**
- `grid + u_time * 0.1` → 時間で変化するグリッド座標
- `grid + ... + vec2(1.0, 1.0)` → X用とY用で異なるランダム値
- `noiseX - 0.5, noiseY - 0.5` → -0.5〜0.5の範囲に変換
- `* 0.01` → 歪みの強度調整（1%の歪み）
- `vUv + vec2(...)` → 元のUV座標にオフセット追加
- **結果**: 画像が細かく時間変化する歪みでゆらゆら揺れる
- **効果**: 水面の揺らぎ、熱気のゆらめき

## パフォーマンス考慮事項

### 最適化のコツ
1. **時間の精度を調整**: `floor(u_time)` で不要な高頻度更新を避ける
2. **計算の共有**: 同じグリッド座標を複数回使用
3. **適切な更新頻度**: 人間の目には30fps程度で十分

### 効率的な実装例
```glsl
void main() {
    // 共通の計算を一度だけ
    vec2 grid = floor(vUv * 10.0);
    float timeStep = floor(u_time * 5.0); // 5fps更新

    // 複数の用途に同じベース値を使用
    float baseNoise = random2d(grid + timeStep);

    float red = random(baseNoise);
    float green = random(baseNoise + 0.1);
    float blue = random(baseNoise + 0.2);

    gl_FragColor = vec4(red, green, blue, 1.0);
}
```

## パラメータ調整のコツ

### 時間速度の調整
- `u_time * 0.01` → 非常にゆっくり
- `u_time * 0.1` → 適度な速度
- `u_time * 1.0` → 速い変化
- `u_time * 10.0` → 非常に速い（フリッカー効果）

### グリッドサイズの意味
- `5.0` → 5x5 = 粗いセル
- `20.0` → 20x20 = 中程度
- `100.0` → 100x100 = 非常に細かい

### 強度の調整
- `* 0.01` → 1%の効果（微妙）
- `* 0.1` → 10%の効果（適度）
- `* 0.5` → 50%の効果（強い）

## まとめ

### アニメーションランダムの重要ポイント
1. **u_time**: 時間を使ってランダムパターンを動的に変化
2. **速度制御**: 乗数でアニメーション速度を調整
3. **離散化**: `floor()`で段階的な変化を作成
4. **レイヤー重ね**: 複数の異なる速度のパターンを組み合わせ
5. **パフォーマンス**: 適切な更新頻度と計算の最適化

時間を加えることで、静的なランダムパターンが生き生きとしたアニメーションに変わります。ゲームエフェクト、UI要素、アート作品など様々な場面で活用できる強力な技術です。