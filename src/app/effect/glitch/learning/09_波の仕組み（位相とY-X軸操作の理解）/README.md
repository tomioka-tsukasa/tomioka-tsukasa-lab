# 第9章: 波の仕組み（位相とY-X軸操作の理解）

## 位相（Phase）とは？

位相とは、**波のどの部分にいるかを表す数値**です。sin波における「現在地」のようなものです。

### 基本的なsin波の位相

```
sin(0)     = 0     ← 位相0: 波の開始点
sin(π/2)   = 1     ← 位相π/2: 波の頂点
sin(π)     = 0     ← 位相π: 波の中間点
sin(3π/2)  = -1    ← 位相3π/2: 波の底
sin(2π)    = 0     ← 位相2π: 1周期完了
```

### 位相をずらすとどうなる？

```glsl
sin(x)       ← 基本の波
sin(x + 1)   ← 位相を1ずらした波
sin(x + 2)   ← 位相を2ずらした波
```

**視覚的表現：**
```
sin(x):     ～～～～～～～
sin(x+1):    ～～～～～～～  ← 少し左にズレる
sin(x+2):     ～～～～～～～ ← さらに左にズレる
```

## 頂点シェーダーでの位相活用

### 基本的な実装

```glsl
void main() {
    vec3 newPosition = position;

    // Y座標を位相として使用
    float phase = newPosition.y * 3.5 + u_time * 3.0;
    float wave = sin(phase);

    // X軸方向に変形
    newPosition.x += wave * intensity;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
```

### 各水平ラインの位相計算

**時刻 u_time = 0 の場合：**

```
Y=10の水平ライン: sin(10 × 3.5 + 0) = sin(35)   ← 位相35
Y=8の水平ライン:  sin(8 × 3.5 + 0)  = sin(28)   ← 位相28
Y=6の水平ライン:  sin(6 × 3.5 + 0)  = sin(21)   ← 位相21
Y=4の水平ライン:  sin(4 × 3.5 + 0)  = sin(14)   ← 位相14
Y=2の水平ライン:  sin(2 × 3.5 + 0)  = sin(7)    ← 位相7
Y=0の水平ライン:  sin(0 × 3.5 + 0)  = sin(0)    ← 位相0
Y=-2の水平ライン: sin(-2 × 3.5 + 0) = sin(-7)   ← 位相-7
```

**重要**: 各水平ライン（同じY座標）は**同じ位相値**を持つ

### 時間による位相変化

**時刻 u_time = 1 の場合：**

```
Y=10: sin(35 + 3) = sin(38)  ← 位相が35→38に変化
Y=8:  sin(28 + 3) = sin(31)  ← 位相が28→31に変化
Y=6:  sin(21 + 3) = sin(24)  ← 位相が21→24に変化

すべてのラインの位相が+3される = 波全体が動く！
```

### 係数の意味

```glsl
newPosition.y * 3.5  // 3.5 = 波の密度を決める係数
```

**係数による波の違い：**

```
係数が小さい (0.5):
Y=0 → 位相0
Y=10 → 位相5     ← ゆるやかな波（低密度）

係数が大きい (3.5):
Y=0 → 位相0
Y=10 → 位相35    ← 密な波（高密度）
```

## なぜY軸の計算をX軸に適用するのか？

### 1. 電波ノイズの特徴を再現

**実際のテレビの電波ノイズ：**
```
正常:     ||||||||||||||||||||
ノイズ:   ||||~~~~~|||||||||||  ← 特定の水平ライン(Y位置)が左右にズレる
         ||||||||~~~~~~~|||||  ← 別の水平ライン(Y位置)が左右にズレる
         ||~~~|||||||||||||||  ← また別の水平ライン(Y位置)が左右にズレる
```

**重要**: 電波ノイズは**水平方向（X軸）の歪み**で表現される

### 2. 座標軸の役割分担

```glsl
sin(newPosition.y * 3.5)  // Y座標を入力として使用
newPosition.x += result;  // X座標を出力として変更
```

**役割分担：**
- **Y座標**: どの水平ライン（行）か？
- **X座標**: その行をどのくらい左右にズラすか？

### 3. 具体例：画面を本の行として考える

**元の状態：**
```
1行目 (Y=10): "これは1行目の文章です"
2行目 (Y=8):  "これは2行目の文章です"
3行目 (Y=6):  "これは3行目の文章です"
4行目 (Y=4):  "これは4行目の文章です"
5行目 (Y=2):  "これは5行目の文章です"
```

**電波ノイズ適用後：**
```
1行目 (Y=10): "これは1行目の文章です"      ← 変化なし
2行目 (Y=8):     "これは2行目の文章です"   ← 右にズレる
3行目 (Y=6): "これは3行目の文章です"       ← 左にズレる
4行目 (Y=4):        "これは4行目の文章です" ← 大きく右にズレる
5行目 (Y=2): "これは5行目の文章です"       ← 少し左にズレる
```

### 4. PlaneGeometryでの実際の動作

**500x500の格子状頂点：**
```
Y=10  ●---●---●---●---●  ← 上端の水平ライン
Y=8   ●---●---●---●---●
Y=6   ●---●---●---●---●
Y=4   ●---●---●---●---●
Y=2   ●---●---●---●---●
Y=0   ●---●---●---●---●  ← 中央の水平ライン
Y=-2  ●---●---●---●---●
Y=-4  ●---●---●---●---●
Y=-6  ●---●---●---●---●
Y=-8  ●---●---●---●---●
Y=-10 ●---●---●---●---●  ← 下端の水平ライン
```

**各水平ラインごとの変形計算：**
```
Y=10の水平ライン: sin(35) = 約-0.4 → X座標に-0.4を加算 → 左にズレる
Y=8の水平ライン:  sin(28) = 約0.3  → X座標に+0.3を加算 → 右にズレる
Y=6の水平ライン:  sin(21) = 約0.8  → X座標に+0.8を加算 → 大きく右にズレる
Y=0の水平ライン:  sin(0)  = 0      → X座標に0を加算   → 変化なし
```

**結果として生まれる波打ち：**
```
変形前 (まっすぐ):          変形後 (波打つ):
|||||||||||||||||           ~~~~~~~~~~~~~~~~~
|||||||||||||||||           ~~~~~~~~~~~~~~~~~
|||||||||||||||||    →      ~~~~~~~~~~~~~~~~~
|||||||||||||||||           ~~~~~~~~~~~~~~~~~
|||||||||||||||||           ~~~~~~~~~~~~~~~~~
```

## 逆パターンとの比較

### X座標でY座標を変更した場合

```glsl
float shiftAmount = sin(newPosition.x * 3.5);  // X座標を入力
newPosition.y += shiftAmount;                  // Y座標を変更
```

**結果：**
```
||||||||  ← 垂直方向の歪み（縦のうねり）
 ||||||||
  ||||||||
   ||||||||
    ||||||||
```

これは**縦の波**になって、電波ノイズっぽくない！

## 実装パターン

### 1. 基本的な水平歪み

```glsl
void main() {
    vec3 newPosition = position;

    float intensity = u_glitch_progress * 1.0;
    float wave = sin(newPosition.y * 8.5 + u_time);

    newPosition.x += wave * intensity;

    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
```

### 2. 複数波形の合成

```glsl
void main() {
    vec3 newPosition = position;

    float intensity = u_glitch_progress * 1.0;

    // 複数の波を重ね合わせ
    float wave1 = sin(newPosition.y * 8.5 + u_time);           // 基本波
    float wave2 = sin(newPosition.y * -2.1 + u_time * -4.0);   // 逆方向波
    float wave3 = sin(newPosition.y * 1.5 + u_time * 2.5);     // 高周波波

    float totalWave = wave1 + wave2 * 0.8 + wave3 * 0.4;

    newPosition.x += totalWave * intensity;

    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
```

### 3. ランダムノイズとの組み合わせ

```glsl
float random(float x) {
    return fract(sin(x * 12.9898) * 43758.5453);
}

void main() {
    vec3 newPosition = position;

    float intensity = u_glitch_progress * 1.0;

    // 波形
    float wave = sin(newPosition.y * 8.5 + u_time);

    // ランダムノイズ
    float randomNoise = (random(newPosition.y * 0.1 + u_time * 0.5) - 0.5) * 0.5;

    // 低周波のうねり
    float bigWave = sin(newPosition.y * 0.1 + u_time * 1.0) * 2.0;

    float totalDistortion = wave + randomNoise + bigWave;

    newPosition.x += totalDistortion * intensity;

    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
```

## パラメータの調整指針

### 周波数調整

```glsl
// 密度の調整
newPosition.y * 0.5   // ゆるやかな波（低密度）
newPosition.y * 2.0   // 普通の密度
newPosition.y * 8.5   // 細かい波（高密度）
```

### 時間速度調整

```glsl
// 動きの速度調整
u_time * 0.5   // ゆっくり
u_time * 1.0   // 普通
u_time * 3.0   // 速い
```

### 振幅調整

```glsl
// 歪みの強さ調整
wave * 0.1     // 微細な歪み
wave * 1.0     // 普通の歪み
wave * 3.0     // 強い歪み
```

## デバッグのコツ

### 1. 位相を可視化

```glsl
// フラグメントシェーダーで位相を色として表示
void main() {
    float phase = vPosition.y * 3.5;
    float normalizedPhase = mod(phase, 6.28318) / 6.28318; // 0-1に正規化

    gl_FragColor = vec4(normalizedPhase, 0.0, 1.0 - normalizedPhase, 1.0);
}
```

### 2. 変形量を可視化

```glsl
// 変形量を色として表示
varying float vWaveAmount;

// 頂点シェーダー
void main() {
    float wave = sin(position.y * 8.5 + u_time);
    vWaveAmount = wave * 0.5 + 0.5; // 0-1範囲に変換
    // ...
}

// フラグメントシェーダー
void main() {
    gl_FragColor = vec4(vWaveAmount, 0.0, 1.0 - vWaveAmount, 1.0);
}
```

## まとめ

### 位相の重要ポイント

1. **位相 = 波のどの部分にいるかを表す数値**
2. **Y座標×係数 = 各水平ラインに異なる位相を与える**
3. **+u_time = 全体の位相を時間で動かす**
4. **sin(位相) = 各ラインの変位量を計算**

### Y-X軸操作の重要ポイント

1. **Y座標を入力**: どの水平ライン（行）かを識別
2. **X座標を出力**: その行をどのくらい左右にズラすか
3. **電波ノイズの再現**: 水平方向の歪みが自然に見える
4. **効率的な制御**: 縦の位置で横の歪みを制御

### 実装の基本ステップ

1. **位相計算**: `position.y * 周波数 + u_time * 速度`
2. **波形生成**: `sin(位相)`で変位量を計算
3. **X軸変形**: `newPosition.x += 波形 * 強度`
4. **時間アニメーション**: `u_time`で連続的な動きを実現

この理解により、電波ノイズ風の自然な頂点変形エフェクトを自在に制御できるようになります。位相の概念とY-X軸操作の組み合わせは、多くの波動系エフェクトの基礎となる重要な技術です。