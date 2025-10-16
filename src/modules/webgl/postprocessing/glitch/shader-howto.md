# Fragment Shader 詳細解説 (glitch.frag)

## Uniform変数

フラグメントシェーダーは以下のuniform変数を受け取ります：

```glsl
uniform sampler2D tDiffuse;    // 入力テクスチャ（前のパスの結果）
uniform float uTime;           // 経過時間（アニメーション用）
uniform float uStrength;       // グリッチ歪みの強度
uniform float uSpeed;          // アニメーション速度
uniform float uRgbOffset;      // RGB色収差のオフセット量
uniform float uScanlines;      // スキャンライン密度
uniform vec2 uResolution;      // 画面解像度
```

## Varying変数

```glsl
varying vec2 vUv;              // テクスチャ座標（0.0-1.0）
```

## 関数解説

### random関数

```glsl
float random(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}
```

**目的**: 2D座標から疑似ランダム値を生成

**仕組み**:
1. `dot(co.xy, vec2(12.9898, 78.233))`: 入力座標とマジックナンバーの内積
2. `sin()`: サイン関数で値を-1から1の範囲に変換
3. `* 43758.5453`: 大きな数値を掛けて周期性を高める
4. `fract()`: 小数部分のみを取得（0.0-1.0の範囲）

**用途**: ノイズ生成、グリッチパターンの決定

## メイン処理の段階別解説

### 1. グリッチライン生成

```glsl
float glitchLine = floor(uv.y * uScanlines);
float glitchNoise = random(vec2(glitchLine, floor(uTime * uSpeed))) * 2.0 - 1.0;
```

**処理内容**:
- `uv.y * uScanlines`: Y座標をスキャンライン数で分割
- `floor()`: 整数化して水平ラインを作成
- `random()`: 各ラインごとにランダム値を生成
- `* 2.0 - 1.0`: 範囲を0.0-1.0から-1.0-1.0に変換

**効果**: 時間と共に変化する水平グリッチライン

### 2. UV歪み処理

```glsl
float glitchAmount = glitchNoise * uStrength;
if (abs(glitchNoise) > 0.8) {
  uv.x += glitchAmount;
}
```

**処理内容**:
- `glitchNoise * uStrength`: ノイズに強度を適用
- `abs(glitchNoise) > 0.8`: 閾値判定（80%以上の強いノイズのみ）
- `uv.x += glitchAmount`: X方向（水平）にUV座標を歪める

**効果**: 断続的な水平方向のピクセルずれ

### 3. RGB色収差エフェクト

```glsl
float r = texture2D(tDiffuse, uv + vec2(uRgbOffset, 0.0)).r;
float g = texture2D(tDiffuse, uv).g;
float b = texture2D(tDiffuse, uv - vec2(uRgbOffset, 0.0)).b;
```

**処理内容**:
- **赤チャンネル**: 右にオフセット (`+uRgbOffset`)
- **緑チャンネル**: オフセットなし（基準位置）
- **青チャンネル**: 左にオフセット (`-uRgbOffset`)

**効果**: 古いアナログTV風の色ズレ

### 4. ランダムノイズ追加

```glsl
float noise = random(uv + uTime) * 0.1;
```

**処理内容**:
- `uv + uTime`: 座標に時間を加算してアニメーション
- `* 0.1`: ノイズ強度を10%に制限

**効果**: 全体的な粒状ノイズ

### 5. スキャンライン効果

```glsl
float scanline = sin(uv.y * uScanlines * 2.0) * 0.05;
```

**処理内容**:
- `uv.y * uScanlines * 2.0`: Y座標でサイン波の周期を決定
- `sin()`: 波形生成
- `* 0.05`: 効果の強度を5%に制限

**効果**: CRTモニター風の走査線

### 6. 最終合成

```glsl
vec3 color = vec3(r, g, b);
color += noise + scanline;
gl_FragColor = vec4(color, 1.0);
```

**処理内容**:
- RGB値を組み合わせて基本色を作成
- ノイズとスキャンラインを加算
- アルファ値1.0で完全不透明として出力

## パラメータ調整ガイド

### strength (グリッチ強度)
- **範囲**: 0.0 - 1.0
- **効果**: UV歪みの強さ
- **推奨値**: 0.05 - 0.2

### speed (アニメーション速度)
- **範囲**: 0.1 - 5.0
- **効果**: グリッチの変化速度
- **推奨値**: 0.5 - 2.0

### rgbOffset (色収差)
- **範囲**: 0.0 - 0.02
- **効果**: RGB分離の距離
- **推奨値**: 0.002 - 0.01

### scanlines (スキャンライン密度)
- **範囲**: 50 - 500
- **効果**: 横線とグリッチラインの数
- **推奨値**: 100 - 200

## 技術的特徴

### 最適化ポイント

1. **条件分岐の最小化**: グリッチ適用は閾値判定のみ
2. **テクスチャサンプリング**: RGB各チャンネルで計3回のみ
3. **計算効率**: 複雑な数学関数を避けてシンプルな演算を使用

### リアルタイム性能

- **フレームレート**: 60fps維持可能
- **GPU負荷**: 軽量（モバイルデバイスでも動作）
- **メモリ使用量**: 最小限（追加テクスチャ不要）

## カスタマイズ例

### より激しいグリッチ

```glsl
// 閾値を下げてグリッチ頻度を上げる
if (abs(glitchNoise) > 0.5) {  // 0.8 → 0.5
  uv.x += glitchAmount * 2.0;  // 強度を2倍
}
```

### 縦方向グリッチ

```glsl
// Y方向にも歪みを追加
uv.y += glitchAmount * 0.5;
```

### カラフルノイズ

```glsl
// RGB各チャンネルに異なるノイズ
color.r += random(uv + uTime) * 0.1;
color.g += random(uv + uTime + 0.1) * 0.1;
color.b += random(uv + uTime + 0.2) * 0.1;
```

## 参考資料

### GLSL関数リファレンス
- `floor()`: 床関数（小数点以下切り捨て）
- `fract()`: 小数部分取得
- `sin()`: サイン関数
- `dot()`: ベクトル内積
- `abs()`: 絶対値
- `texture2D()`: テクスチャサンプリング

### グリッチアート理論
- **データベンディング**: デジタルデータの意図的な破損
- **色収差**: レンズの色分散現象
- **走査線**: CRT表示装置の表示方式
- **ビデオノイズ**: アナログ信号の劣化現象