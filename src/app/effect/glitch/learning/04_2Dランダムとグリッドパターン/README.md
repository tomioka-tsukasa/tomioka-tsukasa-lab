# 第4章 2Dランダムとグリッドパターン

ジェネラティブデザイン - https://thebookofshaders.com/10/?lan=jp

## 2Dランダムとは？

**2Dランダム**とは、2つの値（vec2）を入力として受け取り、ランダムな値を出力する関数です。

```glsl
float randomValue = random2d(vec2(0.5, 0.3));  // 入力: (0.5, 0.3) → 出力: ランダム値
```

### 1Dランダムとの違い

| 項目 | 1Dランダム | 2Dランダム |
|------|------------|------------|
| **入力** | 1つの数値 | 2つの数値（XとY） |
| **パターン** | ストライプ | グリッド・ブロック |
| **自然さ** | 人工的 | より自然 |
| **用途** | アニメーション | テクスチャ・ノイズ |

## 基本的な2Dランダム関数

```glsl
#include "../../../../../../lib/shader/random.glsl"

// または手動でコピー
float random2d(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}
```

### この関数の仕組み

#### ステップ1: ドット積で2Dを1Dに変換
```glsl
dot(st.xy, vec2(12.9898, 78.233))
```
- **ドット積**: `st.x * 12.9898 + st.y * 78.233`
- 2つの数値を1つにまとめる
- 異なる係数により、XとYの影響を変える

#### ステップ2: 1Dランダムと同じ処理
```glsl
fract(sin(...) * 43758.5453123)
```
- サイン関数 → 大きな数を掛ける → 小数点部分を取る
- 1Dランダムと同じ原理

## 2Dランダムで作れるパターン

### パターン1: 基本的な2Dノイズ

```glsl
varying vec2 vUv;

void main() {
    float randomValue = random2d(vUv);
    gl_FragColor = vec4(vec3(randomValue), 1.0);
}
```

**特徴:**
- 各ピクセルが独立したランダム値
- 非常に細かいノイズパターン
- テレビの砂嵐のような見た目

### パターン2: グリッドパターン（基本）

```glsl
varying vec2 vUv;

void main() {
    float gridSize = 10.0;
    vec2 grid = floor(vUv * gridSize);
    float randomValue = random2d(grid);
    gl_FragColor = vec4(vec3(randomValue), 1.0);
}
```

**仕組み:**
1. `vUv * gridSize` → 座標を10倍に拡大
2. `floor(...)` → 整数座標に丸める（グリッド化）
3. `random2d(grid)` → グリッド座標からランダム値を生成

**結果:** 10×10のブロック状パターン

### パターン3: 正規化されたグリッド

```glsl
varying vec2 vUv;

void main() {
    float gridSize = 8.0;
    vec2 grid = floor(vUv * gridSize) / gridSize;
    float randomValue = random2d(grid);
    gl_FragColor = vec4(vec3(randomValue), 1.0);
}
```

**1Dでやった処理と同じ:**
- `floor(vUv * gridSize) / gridSize` → 座標を段階的に量子化
- XとY両方向に適用
- より均等なグリッドパターン

### パターン4: アニメーションするグリッド

```glsl
uniform float u_time;
varying vec2 vUv;

void main() {
    float gridSize = 6.0;
    vec2 grid = floor(vUv * gridSize);

    // 時間を加えてアニメーション
    float randomValue = random2d(grid + u_time * 0.5);
    gl_FragColor = vec4(vec3(randomValue), 1.0);
}
```

**仕組み:**
- `grid + u_time * 0.5` → グリッド座標に時間を加算
- 同じグリッドでも時間と共に異なるランダム値
- ブロックがチカチカと変化する

## 2Dランダムの応用例

### 1. カラフルなグリッド

```glsl
varying vec2 vUv;

void main() {
    float gridSize = 8.0;
    vec2 grid = floor(vUv * gridSize);

    float r = random2d(grid);
    float g = random2d(grid + 100.0);  // オフセットを加えて異なる値
    float b = random2d(grid + 200.0);

    gl_FragColor = vec4(r, g, b, 1.0);
}
```

### 2. モザイクパターン

```glsl
varying vec2 vUv;

void main() {
    float gridSize = 20.0;
    vec2 grid = floor(vUv * gridSize) / gridSize;

    // グリッド内での相対位置
    vec2 localUV = fract(vUv * gridSize);

    float randomValue = random2d(grid);
    float intensity = smoothstep(0.1, 0.9, randomValue);

    gl_FragColor = vec4(vec3(intensity), 1.0);
}
```

### 3. チェッカーボード風ランダム

```glsl
varying vec2 vUv;

void main() {
    float gridSize = 8.0;
    vec2 grid = floor(vUv * gridSize);

    float randomValue = random2d(grid);
    float binary = step(0.5, randomValue);  // 0か1の二値化

    gl_FragColor = vec4(vec3(binary), 1.0);
}
```

## 1Dと2Dの組み合わせ

### ハイブリッドパターン

```glsl
varying vec2 vUv;

void main() {
    // 垂直ストライプ（1D）
    float stripe = random(vUv.x);

    // グリッドパターン（2D）
    vec2 grid = floor(vUv * 8.0);
    float gridRandom = random2d(grid);

    // 混合
    float mixed = mix(stripe, gridRandom, 0.5);
    gl_FragColor = vec4(vec3(mixed), 1.0);
}
```

## 2Dランダムの利点

1. **自然なパターン**: ストライプではなくブロック状
2. **柔軟性**: グリッドサイズを自由に調整
3. **応用性**: テクスチャ生成の基礎
4. **アニメーション**: 時間変化させやすい

## まとめ

2Dランダムは：
- **XとYの両方**を考慮したランダム生成
- **グリッドパターン**の作成に最適
- **1Dより自然**なテクスチャを作成可能
- **ノイズ生成**の基礎となる技術

次の章では、これらのランダムパターンをアニメーションさせる方法について学びます。