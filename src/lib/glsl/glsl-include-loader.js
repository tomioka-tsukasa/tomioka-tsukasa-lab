/**
 * Next.js用のGLSL #includeローダー
 * @eslint-disable @typescript-eslint/no-require-imports
 */

// 設定
const CONFIG = {
  // エイリアス設定
  alias: [
    { path: '/src', name: '@' }
  ],
  // ログ出力設定
  logging: {
    enabled: true,           // ログ出力ON/OFF
    showSuccess: true,       // 成功ログ表示
    showErrors: true,        // エラーログ表示
    showCircular: true,      // 循環参照警告表示
  }
}

// 後方互換性のためのエイリアス
const ALIAS = CONFIG.alias

// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path')

// ログ出力済みファイルをキャッシュ
const loggedFiles = new Set()

// プロジェクトルート取得
const PROJECT_ROOT = process.cwd()

/**
 * パス解決（エイリアス + ルート相対パス対応）
 */
function resolvePath(includePath, currentFilePath) {
  // エイリアス変換
  for (const alias of ALIAS) {
    if (includePath.startsWith(alias.name + '/')) {
      const aliasResolved = includePath.replace(alias.name + '/', alias.path + '/')

      return path.join(PROJECT_ROOT, aliasResolved)
    }
  }

  // ルート相対パス（/から始まる）
  if (includePath.startsWith('/')) {
    return path.join(PROJECT_ROOT, includePath)
  }

  // 通常の相対パス
  return path.resolve(path.dirname(currentFilePath), includePath)
}

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
  if (CONFIG.logging.enabled && matches.length > 0 && !loggedFiles.has(fileKey)) {
    console.log('\nGLSL #include log. ===============')
    console.log(`📁 GLSL #include: ${relativePath} (${matches.length} includes)`)
    loggedFiles.add(fileKey)
  }

  let successCount = 0

  const result = source.replace(includeRegex, (match, includePath) => {
    const fullPath = resolvePath(includePath, filePath)

    // 循環参照をチェック
    if (processedFiles.has(fullPath)) {
      if (CONFIG.logging.enabled && CONFIG.logging.showCircular) {
        console.warn(`🔄 Circular include detected: ${fullPath}`)
      }

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
      if (CONFIG.logging.enabled && CONFIG.logging.showErrors) {
        console.error(`❌ Failed to include: "${includePath}" in ${relativePath}`)
        console.error(error)
      }

      return `// Failed to include: ${includePath}`
    } finally {
      processedFiles.delete(fullPath)
    }
  })

  // サマリー（初回のみ）
  if (CONFIG.logging.enabled && CONFIG.logging.showSuccess && matches.length > 0 && !loggedFiles.has(fileKey + '-summary')) {
    console.log(`✅ Successfully included ${successCount}/${matches.length} files in ${relativePath}`)
    console.log('==================================\n')
    loggedFiles.add(fileKey + '-summary')
  }

  return result
}
