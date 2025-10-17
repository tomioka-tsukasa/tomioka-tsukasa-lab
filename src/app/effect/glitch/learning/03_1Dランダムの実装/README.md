# 第3章 1Dランダムの実装とパターン

ジェネラティブデザイン - https://thebookofshaders.com/10/?lan=jp

## 1Dランダムとは？

**1Dランダム**とは、1つの数値（float値）を入力として受け取り、ランダムな値を出力する関数です。

```glsl
float randomValue = random(0.5);  // 入力: 0.5 → 出力: 約0.374
```

### 特徴
- **入力**: 1つの数値（X座標、時間など）
- **出力**: 0〜1の範囲のランダム値
- **決定性**: 同じ入力なら必ず同じ出力

## 基本的な1Dランダム関数

```glsl
#include "../../../../../../lib/shader/random.glsl"

// または手動でコピー
float random(float x) {
    return fract(sin(x * 12.9898) * 43758.5453);
}
```

## 1Dランダムで作れるパターン

### パターン1: 垂直ストライプ（X座標ランダム）

```glsl
varying vec2 vUv;

void main() {
    float randomValue = random(vUv.x);
    gl_FragColor = vec4(vec3(randomValue), 1.0);
}
```

**仕組み:**
- 画面の**左端**（X=0）→ 同じランダム値 → 縦一列が同じ色
- 画面の**中央**（X=0.5）→ 別のランダム値 → 別の色の縦線
- 画面の**右端**（X=1）→ また別のランダム値 → また別の色の縦線

**結果:** 垂直方向のストライプパターン

### パターン2: 水平ストライプ（Y座標ランダム）

```glsl
varying vec2 vUv;

void main() {
    float randomValue = random(vUv.y);
    gl_FragColor = vec4(vec3(randomValue), 1.0);
}
```

**仕組み:**
- 画面の**上端**（Y=1）→ 同じランダム値 → 横一列が同じ色
- 画面の**中央**（Y=0.5）→ 別のランダム値 → 別の色の横線
- 画面の**下端**（Y=0）→ また別のランダム値 → また別の色の横線

**結果:** 水平方向のストライプパターン

### パターン3: 時間変化するストライプ

```glsl
uniform float u_time;
varying vec2 vUv;

void main() {
    float randomValue = random(vUv.x + u_time * 0.1);
    gl_FragColor = vec4(vec3(randomValue), 1.0);
}
```

**仕組み:**
- `vUv.x + u_time * 0.1` → 時間と共に入力値が変化
- 同じX座標でも時間が経つと異なるランダム値になる
- 垂直ストライプが時間と共に変化する

**結果:** アニメーションする垂直ストライプ

### パターン4: 粗いグリッド（座標の離散化）

```glsl
varying vec2 vUv;

void main() {
    float gridSize = 10.0;
    float discreteX = floor(vUv.x * gridSize) / gridSize;
    float randomValue = random(discreteX);
    gl_FragColor = vec4(vec3(randomValue), 1.0);
}
```

**仕組み:**
- `floor(vUv.x * gridSize)` → X座標を整数に丸める
- `/gridSize` → 0〜1の範囲に正規化
- 隣接するピクセルが同じ離散化された値を持つ
- ブロック状のパターンが生成される

**結果:** 太い垂直ストライプ（ブロック状）

## 1Dランダムの応用例

### 1. カラフルなストライプ

```glsl
varying vec2 vUv;

void main() {
    float r = random(vUv.x);
    float g = random(vUv.x + 0.1);
    float b = random(vUv.x + 0.2);
    gl_FragColor = vec4(r, g, b, 1.0);
}
```

### 2. 明度の調整

```glsl
varying vec2 vUv;

void main() {
    float randomValue = random(vUv.x);
    // 明度を50%〜100%の範囲に制限
    float brightness = mix(0.5, 1.0, randomValue);
    gl_FragColor = vec4(vec3(brightness), 1.0);
}
```

### 3. しきい値による二値化

```glsl
varying vec2 vUv;

void main() {
    float randomValue = random(vUv.x);
    float binary = step(0.5, randomValue);  // 0.5以上なら1、未満なら0
    gl_FragColor = vec4(vec3(binary), 1.0);
}
```

## 1Dランダムの限界

### 問題点
1. **連続性の欠如**: 隣接する値が全く無関係
2. **方向性の制限**: 一方向にしかランダムネスがない
3. **自然さの不足**: 現実の現象とは異なる

### 例：問題のあるパターン
```glsl
// これは良くない例
float randomValue = random(vUv.x + vUv.y);
```
- X+Yだと斜め方向のストライプになってしまう
- 真の2Dランダムではない

### 解決策
次の章で学ぶ**2Dランダム**を使用することで、これらの問題を解決できます。

## まとめ

1Dランダムは：
- **シンプル**で理解しやすい
- **ストライプパターン**の生成に適している
- **アニメーション**との相性が良い
- **限界**もあるため、用途を選んで使用する

次の章では、より自然なパターンを作れる**2Dランダム**について学びます。