/**
 * Next.js用のGLSL #includeローダー
 * @eslint-disable @typescript-eslint/no-require-imports
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path')

// ログ出力済みファイルをキャッシュ
const loggedFiles = new Set()

module.exports = function(source) {
  // #includeを処理
  const processedSource = processIncludes(source, this.resourcePath)

  return processedSource
}

function processIncludes(source, filePath, processedFiles = new Set()) {
  const includeRegex = /#include\s+["<]([^">]+)[">]/g
  const matches = Array.from(source.matchAll(includeRegex))

  // プロジェクトルートからの相対パス取得
  const relativePath = path.relative(process.cwd(), filePath)

  // #includeが記述されているファイルをログ出力（初回のみ）
  const fileKey = `${relativePath}-${matches.length}`
  if (matches.length > 0 && !loggedFiles.has(fileKey)) {
    console.log(`📁 GLSL #include: ${relativePath} (${matches.length} includes)`)
    loggedFiles.add(fileKey)
  }

  let successCount = 0

  const result = source.replace(includeRegex, (match, includePath) => {
    const fullPath = path.resolve(path.dirname(filePath), includePath)

    // 循環参照をチェック
    if (processedFiles.has(fullPath)) {
      console.warn(`🔄 Circular include detected: ${fullPath}`)

      return '// Circular include removed'
    }

    try {
      processedFiles.add(fullPath)
      const includeContent = fs.readFileSync(fullPath, 'utf-8')

      // 再帰的に処理
      const processedContent = processIncludes(includeContent, fullPath, processedFiles)

      successCount++

      return `\n// === BEGIN INCLUDE: ${includePath} ===\n${processedContent}\n// === END INCLUDE: ${includePath} ===\n`
    } catch (error) {
      console.error(`❌ Failed to include: "${includePath}" in ${relativePath}`)
      console.error(error)

      return `// Failed to include: ${includePath}`
    } finally {
      processedFiles.delete(fullPath)
    }
  })

  // 成功した場合のサマリー（初回のみ）
  if (matches.length > 0 && !loggedFiles.has(fileKey + '-summary')) {
    console.log(`✅ Successfully included ${successCount}/${matches.length} files in ${relativePath}`)
    loggedFiles.add(fileKey + '-summary')
  }

  return result
}
