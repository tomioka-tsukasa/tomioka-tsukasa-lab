# 内積と外積の基本

参考記事：[内積外積まとめ【シェーダーで使う】](https://qiita.com/gaziya5/items/52ec06b5a7dd3b345d9e)

## 内積と外積とは？

**内積（dot product）**と**外積（cross product）**は、ベクトル演算の基本的な操作です。

## 正しい計算方法

### 内積（Dot Product）
```
内積 = v1.x × v2.x + v1.y × v2.y
```

**例:**
```
v1 = (3, 2)
v2 = (1, 4)
内積 = 3×1 + 2×4 = 3 + 8 = 11
```

### 外積（Cross Product - 2D疑似外積）
```
外積 = v1.x × v2.y - v1.y × v2.x
```

**例:**
```
v1 = (3, 2)
v2 = (1, 4)
外積 = 3×4 - 2×1 = 12 - 2 = 10
```

## GLSLでの実装

### 内積
```glsl
vec2 a = vec2(3.0, 2.0);
vec2 b = vec2(1.0, 4.0);
float dotResult = dot(a, b);  // 11.0
```

### 外積（2D）
```glsl
float cross2D(vec2 a, vec2 b) {
    return a.x * b.y - a.y * b.x;
}

vec2 a = vec2(3.0, 2.0);
vec2 b = vec2(1.0, 4.0);
float crossResult = cross2D(a, b);  // 10.0
```

## 内積の使用場面

### 1. 角度の判定
```glsl
内積 > 0  → 鋭角（同じ方向寄り）
内積 = 0  → 直角
内積 < 0  → 鈍角（逆方向寄り）
```

### 2. ライティング計算
```glsl
float brightness = dot(normal, lightDirection);
```
光の当たり具合を計算

### 3. プレイヤーの視界判定
```
敵がプレイヤーの前にいるか？
dot(プレイヤーの前方向, プレイヤー→敵の方向) > 0
```

## 外積の使用場面

### 1. 回転方向の判定
```
外積 > 0 → 反時計回り
外積 < 0 → 時計回り
```

### 2. 左右の判定
```
敵がプレイヤーの左右どちらにいるか？
cross(プレイヤーの前方向, プレイヤー→敵の方向)
```

### 3. 面積の計算
```
三角形の面積 = |外積| / 2
```

### 4. 当たり判定
```
点が線分の左右どちら側にあるか判定
→ UI要素の配置やゲームロジックで使用
```

## ゲームでの実践例

### 敵AIの実装
```javascript
// プレイヤーが敵の視界にいるか？
const toPlayer = player.position - enemy.position
const dot = enemy.forward.dot(toPlayer)
if (dot > 0.5) {
  // プレイヤー発見！
}

// プレイヤーが左右どちらにいるか？
const cross = enemy.forward.cross(toPlayer)
if (cross > 0) {
  // 左に回転
} else {
  // 右に回転
}
```

### マウス操作での視点制御
```javascript
// マウスがキャラクターのどちら側にあるか
const mouseDirection = mousePos - characterPos
const forwardDirection = character.forward

const dot = forwardDirection.dot(mouseDirection)
const cross = forwardDirection.cross(mouseDirection)

if (dot > 0) {
  // マウスが前方にある
  if (cross > 0) {
    // 左前方
  } else {
    // 右前方
  }
}
```

### 射撃ゲームでの命中判定
```javascript
// 弾が敵の近くを通ったか？
const bulletDirection = bullet.velocity
const toEnemy = enemy.position - bullet.position

const distance = Math.abs(bulletDirection.cross(toEnemy))
if (distance < hitThreshold) {
  // 命中！
}
```

## まとめ

### 内積（Dot Product）
- **計算**: `v1.x × v2.x + v1.y × v2.y`
- **結果**: 1つの数値（スカラー）
- **意味**: 2つのベクトルの「似ている度合い」
- **用途**: 角度判定、ライティング、視界判定

### 外積（Cross Product）
- **計算**: `v1.x × v2.y - v1.y × v2.x`
- **結果**: 1つの数値（2Dの場合）
- **意味**: 2つのベクトルの「垂直度・回転方向」
- **用途**: 左右判定、回転方向、面積計算

### 簡単な覚え方
- **内積は「角度」** → 前後の判定
- **外積は「回転」** → 左右の判定

これらはゲーム開発、3Dグラフィックス、物理演算で頻繁に使われる基本的な計算です。