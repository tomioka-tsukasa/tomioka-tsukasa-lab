# 第6章: 周期分割グリッチエフェクト

## 概要

時間を直接分割してフェーズを管理し、90%静寂・10%グリッチの周期的切り替えエフェクトを実現する手法を学習します。

## 周期分割の基本概念

### 従来の問題点
```glsl
float transition = (1.0 - cos(u_time * 2.0)) * 0.5; // 0→1→0のサイクル
```

**問題**: `transition`が0.9以下の時、「画像1」か「画像2」かを区別できない

### 解決策: 周期分割方式

時間を直接分割して明確な状態を作る：

```glsl
float cycle = mod(u_time * 1.0, 6.0); // 0〜6秒の周期
```

## フェーズ設計

### 6秒周期の設計例

| 時間範囲 | フェーズ | 状態 | 割合 |
|----------|----------|------|------|
| 0.0〜2.7秒 | Phase 1 | 画像1表示 | 45% |
| 2.7〜3.0秒 | Glitch 1 | 切り替えグリッチ | 5% |
| 3.0〜5.7秒 | Phase 2 | 画像2表示 | 45% |
| 5.7〜6.0秒 | Glitch 2 | 切り替えグリッチ | 5% |

### フェーズ判定の実装

```glsl
void main() {
    // 周期計算
    float cycle = mod(u_time * 1.0, 6.0); // 0〜6秒周期

    // 各フェーズの判定
    float isPhase1 = step(cycle, 2.7);                    // 0〜2.7で1.0
    float isGlitch1 = step(2.7, cycle) * step(cycle, 3.0); // 2.7〜3.0で1.0
    float isPhase2 = step(3.0, cycle) * step(cycle, 5.7);  // 3.0〜5.7で1.0
    float isGlitch2 = step(5.7, cycle);                    // 5.7〜6.0で1.0

    // デバッグ用：現在のフェーズを色で表示
    vec3 phaseColor = vec3(isPhase1, isGlitch1 + isGlitch2, isPhase2);
    gl_FragColor = vec4(phaseColor, 1.0);
}
```

## グリッチエフェクトの実装

### グリッチ強度の計算

```glsl
// グリッチ1の進行度（2.7〜3.0を0〜1にマップ）
float glitchProgress1 = clamp((cycle - 2.7) / 0.3, 0.0, 1.0);

// グリッチ2の進行度（5.7〜6.0を0〜1にマップ）
float glitchProgress2 = clamp((cycle - 5.7) / 0.3, 0.0, 1.0);

// 現在のグリッチ強度
float currentGlitchStrength = glitchProgress1 + glitchProgress2;
```

### ランダムマスクの適用

```glsl
void main() {
    vec3 texture1 = texture2D(u_texture_01, vUv).rgb;
    vec3 texture2 = texture2D(u_texture_02, vUv).rgb;

    float cycle = mod(u_time * 1.0, 6.0);

    // フェーズ判定
    float isPhase1 = step(cycle, 2.7);
    float isGlitch1 = step(2.7, cycle) * step(cycle, 3.0);
    float isPhase2 = step(3.0, cycle) * step(cycle, 5.7);
    float isGlitch2 = step(5.7, cycle);

    // グリッチ強度
    float glitchProgress1 = clamp((cycle - 2.7) / 0.3, 0.0, 1.0);
    float glitchProgress2 = clamp((cycle - 5.7) / 0.3, 0.0, 1.0);
    float glitchStrength = glitchProgress1 + glitchProgress2;

    // ランダムマスク
    float randomNoise = random(vUv.y * 100.0);
    float glitchMask = step(randomNoise, glitchStrength);

    // 最終出力
    vec3 result = texture1 * isPhase1 +                           // Phase1: 画像1
                  mix(texture1, texture2, glitchMask) * (isGlitch1 + isGlitch2) + // Glitch: 切り替え
                  texture2 * isPhase2;                            // Phase2: 画像2

    gl_FragColor = vec4(result, 1.0);
}
```

## 応用パターン

### 1. 非対称グリッチ
```glsl
// 画像1→2のグリッチを長く、2→1のグリッチを短く
float isGlitch1 = step(2.5, cycle) * step(cycle, 3.0); // 0.5秒
float isGlitch2 = step(5.8, cycle);                    // 0.2秒
```

### 2. ランダムなグリッチタイミング
```glsl
float randomTrigger = random(floor(u_time));
float shouldGlitch = step(randomTrigger, 0.1); // 10%の確率

// グリッチが発生する時のみエフェクト実行
float glitchMask = shouldGlitch * step(randomNoise, 0.5);
```

### 3. 複数のグリッチパターン
```glsl
// 垂直ストライプ
float stripeNoise = random(vUv.y * 50.0);
float stripeMask = step(stripeNoise, glitchStrength);

// ピクセルノイズ
float pixelNoise = random2d(vUv * 200.0);
float pixelMask = step(pixelNoise, glitchStrength * 0.3);

// 組み合わせ
float combinedMask = max(stripeMask, pixelMask);
```

### 4. グリッチの方向制御
```glsl
// グリッチ1: 画像1→画像2
vec3 glitch1Result = mix(texture1, texture2, glitchMask);

// グリッチ2: 画像2→画像1
vec3 glitch2Result = mix(texture2, texture1, glitchMask);

vec3 result = texture1 * isPhase1 +
              glitch1Result * isGlitch1 +
              texture2 * isPhase2 +
              glitch2Result * isGlitch2;
```

## デバッグとビジュアライゼーション

### フェーズの可視化
```glsl
// 各フェーズを色で表現
vec3 debugColor = vec3(0.0);
debugColor.r = isPhase1;           // 赤: Phase1
debugColor.g = isGlitch1 + isGlitch2; // 緑: Glitch
debugColor.b = isPhase2;           // 青: Phase2

gl_FragColor = vec4(debugColor, 1.0);
```

### タイムライン表示
```glsl
// 画面上部にタイムライン表示
float timelineY = step(0.9, vUv.y);
float normalizedCycle = cycle / 6.0; // 0〜1に正規化
float timelineProgress = step(vUv.x, normalizedCycle);

vec3 timelineColor = vec3(timelineProgress) * timelineY;
```

## パフォーマンス最適化

### 1. 条件分岐の最小化
```glsl
// if文を避けてstep関数で制御
float finalMask = isGlitch1 * glitchMask1 + isGlitch2 * glitchMask2;
```

### 2. 計算の共有
```glsl
// 共通のランダム値を使い回し
float baseRandom = random(vUv.y * 100.0);
float mask1 = step(baseRandom, glitchStrength);
float mask2 = step(baseRandom * 0.5, glitchStrength);
```

### 3. 適切な更新頻度
```glsl
// 高頻度更新が不要な場合は時間を間引く
float steppedTime = floor(u_time * 30.0) / 30.0; // 30FPS更新
```

## まとめ

### 周期分割方式の利点
1. **明確な状態管理**: どのフェーズにいるかが明確
2. **柔軟な時間配分**: 各フェーズの長さを自由に調整
3. **複雑なパターン対応**: 非対称や不規則なパターンも実現可能
4. **デバッグしやすい**: 各フェーズを個別に確認可能

### 実用的な応用例
- **ゲームUI**: ダメージ時のグリッチエフェクト
- **映像表現**: レトロなTVノイズ、故障演出
- **Webデザイン**: ホバーエフェクト、トランジション
- **アート作品**: 時間ベースのビジュアルアート

周期分割方式により、複雑で制御可能なグリッチエフェクトを実現できます。