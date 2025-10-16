# dat.gui SSRエラー調査レポート

## 問題の概要

Next.jsでdat.guiを使用する際に発生する`ReferenceError: window is not defined`エラーの解決策について調査。

## エラー詳細

```
ReferenceError: window is not defined
    at 8828 (/Users/tomiokatsukasa/env/tomioka-tsukasa-lab/.next/server/chunks/665.js:341:127455)
```

Next.jsのSSR（サーバーサイドレンダリング）環境でdat.guiがwindowオブジェクトにアクセスしようとして発生。

## 調査した記事・リソース

### 1. Zenn記事: Next.jsで window is not defined エラーの解決法

**URL**: https://zenn.dev/hironorioka28/articles/8247133329d64e

**要点**:
- Three.jsライブラリ内でwindowオブジェクトを使用することが原因
- 従来の解決法（useEffect、window存在チェック）はdat.GUIでは効果がない
- インポート時点でエラーが発生するため

**推奨解決策**: Dynamic Import
```javascript
const Canvas = dynamic(() => import('@components/.../Canvas'), {
  ssr: false, // サーバーサイドレンダリングを無効化
})
```

**メリット**:
- windowオブジェクトを制約なく使用可能
- useEffectを軽量に保つことができる
- window関連のロジックを外部に移動

### 2. GitHub Issue: dat.gui #271

**URL**: https://github.com/dataarts/dat.gui/issues/271

**問題**: Next.js + Three.js環境でのwindowエラー

**提案された解決策**:

a) **Async Dynamic Import**
```javascript
const init = async () => {
  const dat = await import('dat.gui')
  const gui = new dat.GUI()
  // ... 残りのthree.jsコード
}
```

b) **Client-Side Initialization**
- useEffect内でGUIを初期化
- windowの存在を確認してから実行

**追加推奨事項**:
- 非同期インポートでdat.guiを読み込み
- GUI既存チェックで重複作成を防止
- クライアントサイド実行を保証

### 3. Three.js Forum: React統合の問題

**URL**: https://discourse.threejs.org/t/problem-with-initializing-dat-gui-with-react/17118

**議論内容**:
- Reactコンポーネントでのdat.GUI初期化の困難さ
- React固有の解決策の推奨

**提案された解決策**:
- **Dynamic Import**: 初期化問題の解決
- **代替ライブラリ**:
  - `leva`: "much better option" for React
  - React-Three-Fiber: より統合的なアプローチ

**drcmdaの推奨**:
React-Three-Fiberが優位な理由:
- React → Three.js直接レンダリング
- エコシステム統合の向上
- React state、context、routingとの相互作用

## 解決策の比較

### 1. Dynamic Import（最推奨）

**実装方法**:
```typescript
const Canvas = dynamic(() => import('@/components/Canvas/Canvas'), {
  ssr: false,
  loading: () => <p>Loading...</p>
})
```

**メリット**:
- 最小限の変更で実装可能
- 型安全性を保持
- 既存のコード構造を維持
- 確実にSSRを回避

**デメリット**:
- 初期ロード時にCanvasコンポーネントが遅延表示
- SEOに若干の影響（Canvasは通常SEO対象外なので問題なし）

### 2. Async Import + Client Check

**実装方法**:
```typescript
export const getGUIInstance = async (): Promise<dat.GUI | null> => {
  if (typeof window === 'undefined') return null

  const { GUI } = await import('dat.gui')
  return new GUI()
}
```

**メリット**:
- より細かい制御が可能
- 必要な部分のみ遅延読み込み
- 型安全性を保持可能

**デメリット**:
- 複数ファイルの修正が必要
- 非同期対応で複雑性が増加
- 既存コードの大幅な変更が必要

### 3. 代替ライブラリ（leva）

**実装方法**:
```typescript
import { useControls } from 'leva'

const MyComponent = () => {
  const { positionX, positionY } = useControls({
    positionX: { value: 0, min: -100, max: 100 },
    positionY: { value: 0, min: -100, max: 100 }
  })
}
```

**メリット**:
- React完全対応
- SSR問題なし
- 現代的なReact Hook API
- より良いReact統合

**デメリット**:
- 既存のdat.guiコードの全面書き換え
- 学習コストの発生
- チームの合意が必要

## 推奨解決策

**当プロジェクトにおいては「Dynamic Import」を強く推奨**

### 理由:
1. **最小変更**: 既存のCanvas.tsxは`'use client'`を使用済み
2. **独立性**: Canvasコンポーネントが既に独立している
3. **型安全性**: TypeScriptの型を維持可能
4. **確実性**: SSRエラーを確実に回避
5. **実装容易性**: 1〜2ファイルの変更で完了

### 実装箇所:
Canvas.tsxを呼び出している親コンポーネントでdynamic importを使用。

## 次のステップ

1. Dynamic Importによる実装
2. ビルドテストでエラー解消確認
3. 動作確認
4. 必要に応じて他の解決策を検討

## 参考情報

- Next.js Dynamic Imports: https://nextjs.org/docs/advanced-features/dynamic-import
- dat.gui GitHub: https://github.com/dataarts/dat.gui
- leva (React GUI): https://github.com/pmndrs/leva
- React-Three-Fiber: https://docs.pmnd.rs/react-three-fiber/getting-started/introduction