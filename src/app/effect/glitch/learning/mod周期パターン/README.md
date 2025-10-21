# 第7章: mod関数の完全理解

## mod関数とは？

`mod(x, y)`は剰余（あまり）を計算する関数で、`x`を`y`で割った**余り**を返します。

```glsl
float result = mod(x, y); // x ÷ y の余り
```

## 基本的な計算例

### 整数での例
```glsl
mod(7.0, 3.0) = 1.0  // 7 ÷ 3 = 2 余り 1
mod(8.0, 3.0) = 2.0  // 8 ÷ 3 = 2 余り 2
mod(9.0, 3.0) = 0.0  // 9 ÷ 3 = 3 余り 0
mod(10.0, 3.0) = 1.0 // 10 ÷ 3 = 3 余り 1
```

### 小数での例
```glsl
mod(2.5, 1.0) = 0.5  // 2.5 ÷ 1.0 = 2 余り 0.5
mod(3.7, 2.0) = 1.7  // 3.7 ÷ 2.0 = 1 余り 1.7
mod(5.2, 1.5) = 0.7  // 5.2 ÷ 1.5 = 3 余り 0.7
```

## 周期的パターンの生成

### 0〜1の繰り返し
```glsl
float cycle = mod(u_time, 1.0);
```

| 時間 | mod(時間, 1.0) | 説明 |
|------|----------------|------|
| 0.0 | 0.0 | 周期の開始 |
| 0.5 | 0.5 | 周期の中間 |
| 1.0 | 0.0 | 次の周期へリセット |
| 1.5 | 0.5 | 2回目の周期中間 |
| 2.0 | 0.0 | 3回目の周期開始 |

### 0〜3の繰り返し
```glsl
float cycle = mod(u_time, 3.0);
```

| 時間 | mod(時間, 3.0) | フェーズ |
|------|----------------|----------|
| 0.0 | 0.0 | フェーズ1開始 |
| 1.0 | 1.0 | フェーズ1継続 |
| 2.0 | 2.0 | フェーズ1継続 |
| 3.0 | 0.0 | フェーズ2開始（リセット） |
| 4.0 | 1.0 | フェーズ2継続 |
| 6.0 | 0.0 | フェーズ3開始（リセット） |

## 実践的な使用例

### 1. フェーズ分割
```glsl
void main() {
    float cycle = mod(u_time, 6.0); // 0〜6秒の周期

    // フェーズ判定
    if (cycle < 2.0) {
        // フェーズ1: 0〜2秒
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // 赤
    } else if (cycle < 4.0) {
        // フェーズ2: 2〜4秒
        gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0); // 緑
    } else {
        // フェーズ3: 4〜6秒
        gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0); // 青
    }
}
```

### 2. アニメーション速度制御
```glsl
// 遅いアニメーション（10秒周期）
float slowCycle = mod(u_time * 0.1, 1.0);

// 普通のアニメーション（1秒周期）
float normalCycle = mod(u_time, 1.0);

// 速いアニメーション（0.5秒周期）
float fastCycle = mod(u_time * 2.0, 1.0);
```

### 3. グリッドパターン
```glsl
void main() {
    // UV座標を3x3のグリッドに分割
    vec2 gridUV = mod(vUv * 3.0, 1.0);

    // 各グリッドセル内で0〜1の座標
    float checker = step(0.5, gridUV.x) + step(0.5, gridUV.y);
    checker = mod(checker, 2.0); // 0 or 1

    gl_FragColor = vec4(vec3(checker), 1.0);
}
```

## mod関数の数学的理解

### 数式での表現
```
mod(x, y) = x - y * floor(x / y)
```

### 計算過程の例
```glsl
// mod(7.3, 2.0) の計算
x = 7.3, y = 2.0

1. x / y = 7.3 / 2.0 = 3.65
2. floor(3.65) = 3.0
3. y * floor(x/y) = 2.0 * 3.0 = 6.0
4. x - 6.0 = 7.3 - 6.0 = 1.3

結果: mod(7.3, 2.0) = 1.3
```

## 周期的関数との組み合わせ

### 1. サイン波の周期制御
```glsl
void main() {
    // 3秒周期のサイン波
    float cycle = mod(u_time, 3.0);           // 0〜3
    float normalizedCycle = cycle / 3.0;       // 0〜1に正規化
    float wave = sin(normalizedCycle * 2.0 * 3.14159); // サイン波

    gl_FragColor = vec4(vec3(wave * 0.5 + 0.5), 1.0);
}
```

### 2. 複数の周期の組み合わせ
```glsl
void main() {
    float cycle1 = mod(u_time, 2.0);      // 2秒周期
    float cycle2 = mod(u_time, 3.0);      // 3秒周期
    float cycle3 = mod(u_time, 5.0);      // 5秒周期

    // 複合パターン
    float pattern = cycle1 * cycle2 * cycle3;

    gl_FragColor = vec4(vec3(pattern / 30.0), 1.0);
}
```

## よくある使用パターン

### 1. 時間のループ
```glsl
// 無限ループのアニメーション
float loopTime = mod(u_time, animationDuration);
float progress = loopTime / animationDuration; // 0〜1
```

### 2. 座標の繰り返し
```glsl
// テクスチャの繰り返し（タイリング）
vec2 repeatedUV = mod(vUv * tileCount, 1.0);
vec3 color = texture2D(u_texture, repeatedUV).rgb;
```

### 3. インデックスの循環
```glsl
// 配列インデックスの循環
float index = mod(floor(u_time), arrayLength);
```

### 4. 色相の循環
```glsl
// HSVの色相を循環（0〜360度）
float hue = mod(u_time * 60.0, 360.0); // 6秒で一周
```

## デバッグとビジュアライゼーション

### mod関数の出力を可視化
```glsl
void main() {
    float cycle = mod(u_time, 5.0);

    // 時間軸の可視化
    float normalizedCycle = cycle / 5.0; // 0〜1に正規化

    // グラデーション表示
    gl_FragColor = vec4(normalizedCycle, 0.0, 1.0 - normalizedCycle, 1.0);
}
```

### 周期の境界を可視化
```glsl
void main() {
    float cycle = mod(u_time, 3.0);

    // 周期の境界で点滅
    float boundary = step(cycle, 0.1); // 0〜0.1秒で1.0

    gl_FragColor = vec4(vec3(boundary), 1.0);
}
```

## 実際のエフェクトでの応用

### 1. 点滅エフェクト
```glsl
void main() {
    vec3 texture1 = texture2D(u_texture_01, vUv).rgb;

    // 0.5秒周期で点滅
    float cycle = mod(u_time, 0.5);
    float blink = step(cycle, 0.25); // 前半で1.0、後半で0.0

    vec3 result = texture1 * blink;
    gl_FragColor = vec4(result, 1.0);
}
```

### 2. ストロボエフェクト
```glsl
void main() {
    vec3 texture1 = texture2D(u_texture_01, vUv).rgb;

    // 不規則なストロボ
    float fastCycle = mod(u_time * 10.0, 1.0);
    float slowCycle = mod(u_time, 2.0);

    float strobe = step(fastCycle, 0.1) * step(slowCycle, 1.0);

    vec3 result = texture1 * (0.3 + strobe * 0.7);
    gl_FragColor = vec4(result, 1.0);
}
```

### 3. シーケンシャルエフェクト
```glsl
void main() {
    vec3 texture1 = texture2D(u_texture_01, vUv).rgb;
    vec3 texture2 = texture2D(u_texture_02, vUv).rgb;

    // 4つのステップを順番に実行
    float cycle = mod(u_time, 4.0);

    vec3 result = texture1;

    if (cycle >= 1.0 && cycle < 2.0) {
        // ステップ1: フェード
        float fadeProgress = cycle - 1.0;
        result = mix(texture1, texture2, fadeProgress);
    } else if (cycle >= 2.0 && cycle < 3.0) {
        // ステップ2: 表示
        result = texture2;
    } else if (cycle >= 3.0) {
        // ステップ3: フェードアウト
        float fadeOutProgress = cycle - 3.0;
        result = mix(texture2, texture1, fadeOutProgress);
    }

    gl_FragColor = vec4(result, 1.0);
}
```

## パフォーマンスの考慮

### 1. 計算の最適化
```glsl
// 重い計算
float cycle = mod(u_time * complexFunction(), period);

// 軽い計算
float cycle = mod(u_time, period);
float scaledCycle = cycle * complexFunction();
```

### 2. 精度の問題
```glsl
// 長時間での精度低下を避ける
float cycle = mod(u_time, 60.0); // 1分ごとにリセット

// 超高精度が必要な場合
double preciseTime = double(u_time);
float cycle = float(mod(preciseTime, 60.0));
```

## まとめ

### mod関数の重要なポイント
1. **周期的パターン**: 任意の周期で値を0からリセット
2. **時間制御**: アニメーションの時間管理に最適
3. **空間分割**: UV座標やグリッドの繰り返しに使用
4. **状態管理**: フェーズやステップの切り替えに活用

### 実用的な応用場面
- **アニメーションループ**: 無限に繰り返すエフェクト
- **テクスチャタイリング**: シームレスな繰り返しパターン
- **状態遷移**: 複数フェーズの切り替え制御
- **リズムエフェクト**: 音楽に同期したビジュアル

mod関数は時間ベースのエフェクトにおいて最も重要な関数の一つです。マスターすることで複雑で美しいアニメーションを制御できるようになります。