# tomioka-tsukasa-lab

## 開発環境

### GLSL #include機能

このプロジェクトでは、WebGL/GLSLでのシェーダー開発を効率化するため、`#include`ディレクティブをサポートしています。

#### 仕組み

- **カスタムwebpackローダー**: `src/lib/glsl/glsl-include-loader.js`
- **設定**: `next.config.ts`でローダーを追加
- **処理**: ビルド時に`#include`ディレクティブを展開

##### カスタムローダーの動作

```javascript
// src/lib/glsl/glsl-include-loader.js
module.exports = function(source) {
  // 1. GLSLファイルの内容(source)を受け取る
  // 2. #include "path/to/file.glsl" を正規表現で検索
  // 3. 指定されたファイルを読み込み
  // 4. #includeディレクティブを実際のファイル内容で置換
  // 5. 結合されたGLSLコードを返す
}
```

**処理例:**
```glsl
// Input: fragmentWithIncludes.glsl
#include "../../shaders/functions/noise.glsl"
void main() { stripe_noise(...); }

// Output: 結合された完全なGLSLコード
float random(float x) { ... }
vec3 stripe_noise(...) { ... }
void main() { stripe_noise(...); }
```

**循環参照対策:**
- 処理済みファイルをSetで管理
- 無限ループを防止
- エラーハンドリングで安全性を確保

#### 使用方法

```glsl
// fragment.glsl
#include "../../shaders/functions/noise.glsl"
#include "../../shaders/functions/aberration.glsl"

void main() {
  vec3 result = stripe_noise(vUv, 420.0, 2.4, 10.0);
  gl_FragColor = vec4(result, 1.0);
}
```

#### ライブラリ構成

```
src/app/effect/glitch/modules/webgl/shaders/
├── functions/
│   ├── noise.glsl          # ノイズ関数ライブラリ
│   └── aberration.glsl     # 色収差エフェクトライブラリ
└── utils/
    └── shaderLoader.ts     # シェーダー結合ユーティリティ
```

#### メリット

- **再利用性**: 関数を複数のシェーダーで共有
- **保守性**: 関数ライブラリを一元管理
- **可読性**: シェーダーファイルの簡潔化
- **Unity互換**: Unity ShaderLabと同じ`#include`記法

#### 依存関係管理

シェーダーライブラリには依存関係があるため、正しい順序で#includeしてください：

```glsl
// ✅ 正しい順序
#include "@/lib/shader/random/random.glsl"        // 基本関数（依存なし）
#include "@/lib/shader/glitch/scan-line-noise.glsl"  // random2d()が必要
#include "@/lib/shader/aberration/rgb-aberration.glsl"  // 依存なし

// ❌ 間違った順序（コンパイルエラー）
#include "@/lib/shader/glitch/scan-line-noise.glsl"  // random2d()が未定義でエラー
#include "@/lib/shader/random/random.glsl"
```

各ライブラリファイルのDoxygenコメントに`@dependencies`セクションで依存関係を明記しています。
