# TestorPanel

演出効果検証用の汎用UIパネルシステム

## 概要

TestorPanelは、WebGLエフェクトやアニメーション演出を検証するための統一されたUIインターフェースです。現在はグリッチエフェクトに対応しており、今後様々なエフェクトの研究・開発用テンプレートとして拡張していきます。

## ディレクトリ構造

```
/src/components/TestorPanel/
├── common/                        # 共通UIコンポーネント
│   ├── Button/
│   │   ├── Button.tsx            # 基本ボタンコンポーネント
│   │   └── Button.css.ts         # Vanilla Extractスタイル
│   ├── NumberInput/
│   │   ├── NumberInput.tsx       # 数値入力コンポーネント
│   │   └── NumberInput.css.ts    # Vanilla Extractスタイル
│   ├── FilePathInput/
│   │   ├── FilePathInput.tsx     # ファイルパス入力コンポーネント
│   │   └── FilePathInput.css.ts  # Vanilla Extractスタイル
│   ├── Select/
│   │   ├── Select.tsx            # セレクター（選択）コンポーネント
│   │   └── Select.css.ts         # Vanilla Extractスタイル
│   ├── Toggle/
│   │   ├── Toggle.tsx            # トグルスイッチコンポーネント
│   │   └── Toggle.css.ts         # Vanilla Extractスタイル
│   ├── Panel/
│   │   ├── Panel.tsx             # パネルコンテナコンポーネント
│   │   └── Panel.css.ts          # Vanilla Extractスタイル
│   └── index.ts                   # 共通コンポーネントの export
├── context/                       # React Context
│   └── WebGLContext.tsx          # WebGL制御用Context
├── hooks/                         # カスタムフック
│   └── useGlitchControl.ts       # グリッチエフェクト制御フック
├── TestorPanel.tsx               # メインパネルコンポーネント
├── TestorPanel.css.ts            # Vanilla Extractスタイル
├── GlitchPanel.tsx               # グリッチ専用設定パネル
├── GlitchPanel.css.ts            # Vanilla Extractスタイル
├── types.ts                      # 型定義
├── index.ts                      # 主要コンポーネントの export
└── README.md                     # このファイル
```

## 使用方法

### 基本的な使用例

```tsx
import { TestorPanel, WebGLProvider } from '@/components/TestorPanel'

export default function EffectTestPage() {
  const handleGlitchTrigger = (settings: GlitchSettings) => {
    console.log('Glitch triggered with settings:', settings)
  }

  return (
    <WebGLProvider>
      <TestorPanel
        effectType="glitch"
        onGlitchTrigger={handleGlitchTrigger}
      />
    </WebGLProvider>
  )
}
```

### WebGL初期化時の連携

```tsx
import { createWebGL } from '@/app/effect/glitch/modules/webgl/webgl'
import { useWebGL } from '@/components/TestorPanel'

// WebGLコンポーネント内で
const { setImageChangerNoiseCtrl } = useWebGL()

createWebGL(
  () => console.log('WebGL loaded'),
  (imageChangerNoiseCtrl) => {
    // React Contextに登録
    setImageChangerNoiseCtrl(imageChangerNoiseCtrl)
  }
)
```

### グリッチエフェクトの検証

1. **演出開始**: 「演出開始」ボタンを押すことで、WebGLのグリッチエフェクトが発動します
2. **パラメータ調整**:
   - `planeHeight`: プレーンジオメトリの高さ (1-50)
   - `ampliHeight`: 振幅の高さ (0.1-5.0)
   - `glitchIntensity`: グリッチの強度 (0.1-20.0)
   - `duration`: エフェクトの持続時間 (0.1-5.0秒)
3. **テクスチャ設定**: 使用する画像のパスを指定可能

## 技術仕様

### 依存関係

- React 18+
- TypeScript
- Three.js (WebGL部分)
- Vanilla Extract (スタイリング)

### WebGL連携

TestorPanelは以下の方法でWebGLエフェクトと連携します：

1. **React Context**: `WebGLProvider`でWebGL制御オブジェクトを管理
2. **型安全な連携**: TypeScriptの型定義により安全にWebGLと連携
3. **useGlitchControl フック**: React Contextを通じてWebGLのグリッチメッシュを制御
4. **リアルタイム連携**: UIの変更が即座にWebGLエフェクトに反映

### コンポーネント設計原則

#### 1. 再利用性
すべての基本UIコンポーネントは`common/`フォルダに配置し、どのエフェクト検証でも共通して使用できるよう設計されています。

#### 2. 拡張性
新しいエフェクトタイプは以下の手順で追加できます：

```tsx
// types.ts に新しいエフェクトタイプを追加
export type EffectType = 'glitch' | 'wave' | 'distortion' | 'newEffect'

// 新しいパネルコンポーネントを作成
export const NewEffectPanel = ({ onTrigger }: NewEffectPanelProps) => {
  // パネル実装
}

// TestorPanel.tsx で新しいエフェクトを処理
const renderEffectPanel = () => {
  switch (selectedEffect) {
    case 'newEffect':
      return <NewEffectPanel onTrigger={handleNewEffectTrigger} />
    // ...
  }
}
```

#### 3. 一貫性
すべてのUIコンポーネントは統一されたデザインシステムに従い、Tailwind CSSクラスを使用してスタイリングされています。

## 実装指針

### 新しいエフェクトの追加

1. **型定義の追加**: `types.ts`で新しいエフェクトの設定型を定義
2. **パネルコンポーネント作成**: エフェクト専用の設定パネルを実装
3. **フック作成**: `hooks/`フォルダに制御用のカスタムフックを作成
4. **メインパネル更新**: `TestorPanel.tsx`で新しいエフェクトの処理を追加

### WebGL連携の実装

1. **WebGL初期化時**: `webglCtrl`にエフェクト制御オブジェクトを追加
2. **グローバル公開**: `window.webglCtrl`として公開
3. **フック実装**: UIからWebGLエフェクトを制御するカスタムフックを作成

### スタイルガイドライン

- **Vanilla Extract**: すべてのスタイリングにVanilla Extractを使用
- **レスポンシブ**: `rvw`ユーティリティを使用してモバイルとデスクトップの両方に対応
- **型安全**: TypeScriptの型チェックによりスタイルエラーを防止
- **パフォーマンス**: 静的CSSの生成によりランタイムオーバーヘッドなし
- **アクセシビリティ**: フォーカス管理とキーボードナビゲーションを考慮

## API リファレンス

### TestorPanel Props

```tsx
interface TestorPanelProps {
  effectType: EffectType          // 表示するエフェクトタイプ
  onGlitchTrigger?: (settings: GlitchSettings) => void  // グリッチトリガーコールバック
}
```

### GlitchSettings

```tsx
interface GlitchSettings {
  planeHeight: number      // プレーンジオメトリの高さ
  ampliHeight: number      // 振幅の高さ
  glitchIntensity: number  // グリッチの強度
  duration: number         // エフェクトの持続時間
  texture1Path: string     // 1枚目のテクスチャパス
  texture2Path: string     // 2枚目のテクスチャパス
}
```

## 今後の拡張予定

- [ ] 波形エフェクト対応
- [ ] ディストーションエフェクト対応
- [ ] リアルタイムシェーダーパラメータ更新
- [ ] プリセット機能
- [ ] エフェクト録画・出力機能
- [ ] パフォーマンス監視パネル

## トラブルシューティング

### よくある問題

1. **WebGLエフェクトが動作しない**
   - WebGLが正しく初期化されているか確認
   - ブラウザの開発者ツールでエラーを確認
   - `window.webglCtrl`がグローバルに設定されているか確認

2. **パラメータ変更が反映されない**
   - 現在、シェーダーパラメータの動的更新は未実装
   - 将来のアップデートで対応予定

3. **テクスチャが読み込まれない**
   - ファイルパスが正しいか確認
   - ブラウザの開発者ツールでネットワークエラーを確認

## ライセンス

このプロジェクトの一部として、同じライセンス条件で提供されます。