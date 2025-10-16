# GlitchPass - カスタムポストプロセッシングエフェクト

## 概要

GlitchPassは、Three.jsのポストプロセッシングパイプラインで使用するカスタムエフェクトです。デジタル機器の故障やVHSノイズを模倣したリアルタイムグリッチエフェクトを実現します。

## ファイル構成

```
glitch/
├── GlitchPass.ts       # メインクラス（Pass継承）
├── glitch.vert        # バーテックスシェーダー
├── glitch.frag        # フラグメントシェーダー
├── shader-howto.md     # シェーダー詳細解説
└── README.md          # このファイル
```

## 基本的な使用方法

```typescript
import { GlitchPass } from '@/modules/webgl/postprocessing/glitch/GlitchPass'

// エフェクトコンポーザーの設定
const composer = new EffectComposer(renderer)
composer.addPass(new RenderPass(scene, camera))

// グリッチパスの追加
const glitchPass = new GlitchPass({
  strength: 0.1,    // グリッチの強さ
  speed: 1.0,       // アニメーション速度
  rgbOffset: 0.005, // RGB色収差の強さ
  scanlines: 100    // スキャンライン密度
})
composer.addPass(glitchPass)
```

## パラメータ調整

| パラメータ | 型 | 説明 | デフォルト値 |
|-----------|----|----|-------------|
| `strength` | number | グリッチ歪みの強度 | 0.1 |
| `speed` | number | アニメーション速度 | 1.0 |
| `rgbOffset` | number | RGB色収差のオフセット量 | 0.005 |
| `scanlines` | number | スキャンライン密度 | 100 |

### リアルタイムパラメータ調整

```typescript
// 実行時にパラメータを変更
glitchPass.setStrength(0.2)
glitchPass.setSpeed(2.0)
glitchPass.setRgbOffset(0.01)
glitchPass.setScanlines(150)
```

## ユースケース

1. **デジタルアート**: グリッチアートやサイバーパンク風の表現
2. **VRゲーム**: エラー状態やダメージ表現
3. **映像制作**: レトロフューチャーな演出
4. **ウェブサイト**: インパクトのあるビジュアル効果
5. **インタラクティブ作品**: ユーザー操作に連動したエフェクト

## 実装例

プロジェクトでは `/effect/glitch` ページでGlitchPassを確認できます：

```typescript
// setupMember.ts での設定
postprocess: {
  active: true,
  glitchPass: {
    active: true,
    strength: 0.1,
    speed: 1.0,
    rgbOffset: 0.005,
    scanlines: 100,
  },
}
```

## 技術実装

### GlitchPass.ts 解説

GlitchPassは Three.js の `Pass` クラスを継承したカスタムクラスです：

```typescript
export class GlitchPass extends Pass {
  private fsQuad: FullScreenQuad
  private uniforms: { [key: string]: THREE.IUniform }

  constructor(options: Partial<GlitchPassOptions> = {}) {
    super()
    // シェーダーマテリアルの設定
    // ユニフォーム変数の初期化
  }

  render(renderer, writeBuffer, readBuffer) {
    // フレームごとの描画処理
    // 時間更新とテクスチャサンプリング
  }
}
```

### 特徴

- **エフェクトの特徴**:
  - UV歪み: ランダムな水平グリッチライン
  - RGB色収差: 各色チャンネルのオフセット
  - スキャンライン: CRT モニター風のライン効果
  - ランダムノイズ: デジタルノイズの追加

- **技術的特徴**:
  - 60fps維持: リアルタイム性能
  - 軽量: モバイルデバイス対応
  - 最小メモリ: 追加テクスチャ不要

### 最適化ポイント

1. **条件分岐の最小化**: グリッチ適用は閾値判定のみ
2. **テクスチャサンプリング**: RGB各チャンネルで計3回のみ
3. **計算効率**: 複雑な数学関数を避けてシンプルな演算を使用

## ドキュメント

詳細なフラグメントシェーダー解説については [shader-howto.md](./shader-howto.md) を参照してください。