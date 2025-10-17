# カオスを制御する

ジェネラティブデザイン - https://thebookofshaders.com/10/?lan=jp

## 「カオスを制御する」とは？

**カオス（chaos）**は「混沌」「無秩序」を意味しますが、ここでは**「擬似ランダムの不完全性を理解し、改善する」**という意味です。

### 核心概念
- **完璧なランダムは存在しない**（コンピューターでは）
- **擬似ランダムには偏りがある**
- **偏りを理解して制御する**ことで、より良い結果を得る

## 基本的なランダム関数の問題点

### 標準的な関数
```glsl
float random(float x) {
    return fract(sin(x * 12.9898) * 43758.5453);
}
```

### 問題1: 分布の偏り

**中央集中傾向:**
```glsl
// 0〜1の範囲で値をプロット
for(float i = 0.0; i < 1.0; i += 0.01) {
    float r = random(i);
    // rの分布を調べると...
    // 0.3〜0.7 の範囲に集中している
}
```

**結果**: 真っ黒や真っ白のピクセルが少なく、中間色が多くなる

### 問題2: 波の端での不均一性

**特定の値での問題:**
```glsl
random(-1.5707) // π/2付近で問題
random(1.5707)  // -π/2付近で問題
```

**原因**: サイン関数の特性により、これらの値付近で「裂け目」が生じる

### 問題3: 予測可能性

```glsl
random(1.0) // 常に同じ値（例: 0.4132）
random(2.0) // 常に同じ値（例: 0.8543）
```

**決定性**: 同じ入力なら必ず同じ出力（これは利点でもある）

## カオスを制御する手法

### 手法1: 関数の改良

#### より良い分布の関数
```glsl
float randomImproved(float x) {
    return fract(sin(x * 127.1) * 43758.5453);
}
```

#### 高品質な2Dランダム
```glsl
float random2dHQ(vec2 st) {
    vec3 a = fract(st.xyx * vec3(443.897, 441.423, 437.195));
    a += dot(a, a.yzx + 19.19);
    return fract((a.x + a.y) * a.z);
}
```

### 手法2: 分布の調整

#### 線形変換による制御
```glsl
float randomRange(float x, float min_val, float max_val) {
    return mix(min_val, max_val, random(x));
}

// 使用例: 0.3〜0.8の範囲に制限
float controlled = randomRange(vUv.x, 0.3, 0.8);
```

#### 指数関数による分布変更
```glsl
float randomExponential(float x) {
    float r = random(x);
    return pow(r, 2.0); // 分布を右に寄せる
}
```

#### 二次関数による分布変更
```glsl
float randomQuadratic(float x) {
    float r = random(x);
    return r * r * (3.0 - 2.0 * r); // S字カーブ
}
```

### 手法3: 多重サンプリング

#### 複数の関数を組み合わせ
```glsl
float randomBlended(float x) {
    float r1 = random(x);
    float r2 = random(x + 0.1);
    float r3 = random(x + 0.2);
    return (r1 + r2 + r3) / 3.0; // 平均を取る
}
```

#### 異なる周波数の合成
```glsl
float randomLayered(float x) {
    float r1 = random(x) * 0.5;        // 大きなパターン
    float r2 = random(x * 2.0) * 0.3;  // 中程度のパターン
    float r3 = random(x * 4.0) * 0.2;  // 細かいパターン
    return r1 + r2 + r3;
}
```

## 実際の制御例

### 例1: コントラストの制御

```glsl
varying vec2 vUv;

void main() {
    float r = random(vUv.x);

    // 低コントラスト（0.3〜0.7）
    float lowContrast = mix(0.3, 0.7, r);

    // 高コントラスト（0.0〜1.0だが両端に集中）
    float highContrast = step(0.5, r);

    // コントラストをアニメーション
    float contrast = sin(u_time) * 0.5 + 0.5;
    float final = mix(lowContrast, highContrast, contrast);

    gl_FragColor = vec4(vec3(final), 1.0);
}
```

### 例2: 分布の可視化

```glsl
varying vec2 vUv;

void main() {
    float x = vUv.x;
    float r = random(x);

    // ヒストグラム的な表示
    float bin = floor(r * 10.0) / 10.0; // 10段階に分割
    float show = step(bin, vUv.y) - step(bin + 0.1, vUv.y);

    gl_FragColor = vec4(vec3(show), 1.0);
}
```

### 例3: エントロピーの調整

```glsl
varying vec2 vUv;

void main() {
    float entropy = 0.5; // 0=完全に規則的, 1=完全にランダム

    float pattern = sin(vUv.x * 20.0) * 0.5 + 0.5; // 規則的パターン
    float noise = random(vUv.x); // ランダムパターン

    float controlled = mix(pattern, noise, entropy);

    gl_FragColor = vec4(vec3(controlled), 1.0);
}
```

## 制御の指針

### 1. 目的に応じた調整
- **テクスチャ**: 自然な分布が重要
- **データ可視化**: 均等分布が重要
- **アート**: 意図的な偏りも有効

### 2. パフォーマンスとのバランス
- **高品質関数**: 計算コストが高い
- **基本関数**: 高速だが品質に制限
- **用途に応じて選択**

### 3. 視覚的テスト
- **分布をプロット**して確認
- **異なるスケール**でテスト
- **アニメーション**での動作確認

## まとめ

「カオスを制御する」とは：
- **擬似ランダムの限界**を理解する
- **分布の偏り**を把握し調整する
- **目的に応じて**最適化する
- **視覚的品質**と**パフォーマンス**のバランスを取る

完璧なランダムは存在しないからこそ、その不完全性を理解し、**意図的に制御**することで、より良い視覚効果を生み出せます。