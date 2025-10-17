# Glitch Effect Learning

ジェネラティブデザイン学習記録 - https://thebookofshaders.com/10/?lan=jp

## 学習構造

```
learning/
├── README.md                    # この概要ファイル
├── 01_ランダムの基本概念.md     # 理論編
├── 02_シェーダーでのランダム関数.md # 実装理論編
├── 03_1Dランダム実装.md         # 実践編
├── random-1d.frag              # 1Dランダムのシェーダーサンプル
├── random-2d.frag              # 2Dランダムのシェーダーサンプル
├── mesh.ts                     # サンプルメッシュのコレクション
└── ...
```

## 使い方

### 学習の流れ
1. 各章のマークダウンファイルで理論を学ぶ
2. 対応するシェーダーファイルでサンプルコードを確認
3. `mesh.ts`からサンプルメッシュをインポート
4. `/modules/webgl/webgl.ts`でscene.addして動作確認

### サンプルメッシュの使用例

```typescript
// mesh.tsからインポート
import { createRandomMesh1D } from './learning/mesh'

// webgl.tsで使用
const sampleMesh = createRandomMesh1D()
scene.add(sampleMesh)
```

## 章立て

- **第1章**: ランダムの基本概念
- **第2章**: シェーダーでのランダム関数
- **第3章**: 1Dランダムの実装とパターン  ← 次はここ
- **第4章**: 2Dランダムとグリッドパターン
- **第5章**: アニメーションするランダムパターン
- **第6章**: ランダムの応用とノイズへの発展