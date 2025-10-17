# 内積と外積の基本

参考記事：[内積外積まとめ【シェーダーで使う】](https://qiita.com/gaziya5/items/52ec06b5a7dd3b345d9e)

## 内積と外積とは？

**内積（dot product）**と**外積（cross product）**は、ベクトル演算の基本的な操作です。シェーダーでは空間計算やグラフィック処理の基礎として頻繁に使用されます。

## 内積（Dot Product）

### 基本的な定義

```glsl
float dot(vec2 a, vec2 b)  // 2Dベクトルの内積
float dot(vec3 a, vec3 b)  // 3Dベクトルの内積
```

### 数学的な意味

```
A⋅B = |A| × |B| × cos(θ)
```

- **|A|, |B|**: ベクトルの長さ
- **θ**: ベクトル間の角度
- **結果**: スカラー値（1つの数値）

### 計算方法

```glsl
// 2D内積
vec2 a = vec2(3.0, 4.0);
vec2 b = vec2(2.0, 1.0);
float result = dot(a, b);
// = a.x * b.x + a.y * b.y
// = 3.0 * 2.0 + 4.0 * 1.0 = 10.0

// 3D内積
vec3 a = vec3(1.0, 2.0, 3.0);
vec3 b = vec3(4.0, 5.0, 6.0);
float result = dot(a, b);
// = 1.0*4.0 + 2.0*5.0 + 3.0*6.0 = 32.0
```

### 内積の特性

#### 1. 角度の判定
```glsl
vec2 a = normalize(vec2(1.0, 0.0));
vec2 b = normalize(vec2(1.0, 1.0));

float dotValue = dot(a, b);
// dotValue > 0  → 鋭角（0° < θ < 90°）
// dotValue = 0  → 直角（θ = 90°）
// dotValue < 0  → 鈍角（90° < θ < 180°）
```

#### 2. 長さの計算
```glsl
vec2 v = vec2(3.0, 4.0);
float length = sqrt(dot(v, v));
// = sqrt(3.0*3.0 + 4.0*4.0) = sqrt(25.0) = 5.0
```

#### 3. 投影の計算
```glsl
vec2 vector = vec2(3.0, 4.0);
vec2 direction = normalize(vec2(1.0, 0.0));
float projection = dot(vector, direction);
// vectorのdirection方向への投影長
```

## 外積（Cross Product）

### 基本的な定義

```glsl
vec3 cross(vec3 a, vec3 b)  // 3Dベクトルの外積
// 注意: 2Dベクトルの外積はGLSLに標準では存在しない
```

### 数学的な意味

```
A×B = |A| × |B| × sin(θ) × n
```

- **|A|, |B|**: ベクトルの長さ
- **θ**: ベクトル間の角度
- **n**: 垂直方向の単位ベクトル
- **結果**: ベクトル（3D）

### 計算方法

```glsl
vec3 a = vec3(1.0, 0.0, 0.0);
vec3 b = vec3(0.0, 1.0, 0.0);
vec3 result = cross(a, b);
// = vec3(0.0, 0.0, 1.0)  // Z軸方向のベクトル
```

### 外積の特性

#### 1. 垂直ベクトルの生成
```glsl
vec3 a = vec3(1.0, 0.0, 0.0);  // X軸
vec3 b = vec3(0.0, 1.0, 0.0);  // Y軸
vec3 perpendicular = cross(a, b);  // Z軸方向
```

#### 2. 面積の計算
```glsl
vec3 a = vec3(3.0, 0.0, 0.0);
vec3 b = vec3(0.0, 4.0, 0.0);
vec3 crossProduct = cross(a, b);
float area = length(crossProduct) / 2.0;  // 三角形の面積
```

#### 3. 法線ベクトルの計算
```glsl
// 3つの点から法線を計算
vec3 p1 = vec3(0.0, 0.0, 0.0);
vec3 p2 = vec3(1.0, 0.0, 0.0);
vec3 p3 = vec3(0.0, 1.0, 0.0);

vec3 edge1 = p2 - p1;
vec3 edge2 = p3 - p1;
vec3 normal = normalize(cross(edge1, edge2));
```

## 2D外積（疑似外積）

GLSLには2D外積がないので、自作する必要があります：

```glsl
float cross2D(vec2 a, vec2 b) {
    return a.x * b.y - a.y * b.x;
}
```

### 2D外積の活用
```glsl
vec2 a = vec2(1.0, 0.0);
vec2 b = vec2(0.0, 1.0);
float result = cross2D(a, b);
// result > 0  → bはaの左側
// result = 0  → bはaと平行
// result < 0  → bはaの右側
```

## シェーダーでの実践的な活用例

### 1. ライティング計算
```glsl
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vec3 lightDir = normalize(lightPosition - vPosition);
    float intensity = max(dot(vNormal, lightDir), 0.0);

    gl_FragColor = vec4(vec3(intensity), 1.0);
}
```

### 2. 反射ベクトルの計算
```glsl
vec3 reflect(vec3 incident, vec3 normal) {
    return incident - 2.0 * dot(incident, normal) * normal;
}
```

### 3. 座標変換（回転）
```glsl
vec2 rotate(vec2 point, float angle) {
    float c = cos(angle);
    float s = sin(angle);
    mat2 rotMatrix = mat2(c, -s, s, c);
    return rotMatrix * point;
}
```

### 4. 距離計算
```glsl
// 点から直線までの距離
float distanceToLine(vec2 point, vec2 lineStart, vec2 lineEnd) {
    vec2 lineDir = lineEnd - lineStart;
    vec2 pointDir = point - lineStart;
    return abs(cross2D(normalize(lineDir), pointDir));
}
```

### 5. ベクトルの正規化確認
```glsl
vec3 v = vec3(3.0, 4.0, 0.0);
float lengthSquared = dot(v, v);  // 25.0
float length = sqrt(lengthSquared);  // 5.0
vec3 normalized = v / length;  // (0.6, 0.8, 0.0)
```

## 実際の使用例：グリッドパターンでの活用

### 内積を使ったパターン生成
```glsl
varying vec2 vUv;

void main() {
    vec2 center = vec2(0.5, 0.5);
    vec2 direction = normalize(vec2(1.0, 1.0));
    vec2 toPixel = vUv - center;

    float projection = dot(toPixel, direction);
    float intensity = sin(projection * 10.0) * 0.5 + 0.5;

    gl_FragColor = vec4(vec3(intensity), 1.0);
}
```

### 外積を使った回転パターン
```glsl
varying vec2 vUv;

float cross2D(vec2 a, vec2 b) {
    return a.x * b.y - a.y * b.x;
}

void main() {
    vec2 center = vec2(0.5, 0.5);
    vec2 reference = vec2(1.0, 0.0);
    vec2 toPixel = normalize(vUv - center);

    float rotationValue = cross2D(reference, toPixel);
    float intensity = rotationValue * 0.5 + 0.5;

    gl_FragColor = vec4(vec3(intensity), 1.0);
}
```

## まとめ

### 内積の特徴
- **結果**: スカラー値
- **用途**: 角度計算、投影、長さ計算
- **頻度**: 非常に高い（ライティング、物理演算）

### 外積の特徴
- **結果**: ベクトル値
- **用途**: 垂直ベクトル生成、法線計算、面積計算
- **頻度**: 高い（3D計算、幾何演算）

### 覚えておくべきポイント
1. **内積は角度**、**外積は垂直**
2. **内積は投影**、**外積は回転**
3. **どちらもベクトル演算の基本**
4. **シェーダーでは必須のツール**

これらの知識があると、より高度なシェーダー効果を実装できるようになります！