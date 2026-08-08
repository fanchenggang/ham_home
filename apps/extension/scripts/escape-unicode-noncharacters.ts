/**
 * Vite 插件：转义构建产物中的 Unicode 非字符（non-characters）
 *
 * 背景：Chrome 安装扩展时会用 `base::IsStringUTF8()` 校验内容脚本（以及 CSS）文件。
 * 该校验比标准 UTF-8 更严格，会拒绝 Unicode 非字符（U+FDD0–U+FDEF、每个平面的 U+xFFFE / U+xFFFF）
 * 和落单的代理项（surrogate）。只要产物里出现一个这样的字符，整个扩展就会加载失败：
 *   "无法为内容脚本加载 xxx.js 文件。该文件采用的不是 UTF-8 编码。"
 *
 * 这类字符通常来自第三方库的正则字面量（例如数学公式解析用 U+FFFF 作为区间上界），
 * 打包器会把它们按原样写进产物。把它们改写成 `\uXXXX` 转义序列，
 * 在字符串 / 正则 / 模板字面量中语义完全等价，但产物变成纯 ASCII 可安全通过校验。
 */
/**
 * 这里用结构化类型描述插件，避免 apps/extension 直接依赖 vite 的类型
 * （vite 由 wxt 间接提供，不在本包 dependencies 中）
 */
interface OutputChunkLike {
  type: "chunk";
  code: string;
}

interface OutputAssetLike {
  type: "asset";
  source: string | Uint8Array;
}

type OutputBundleLike = Record<string, OutputChunkLike | OutputAssetLike>;

interface PluginContextLike {
  error(message: string): never;
}

interface EscapeNonCharactersPlugin {
  name: string;
  enforce: "post";
  generateBundle(
    this: PluginContextLike,
    options: unknown,
    bundle: OutputBundleLike,
  ): void;
}

/** BMP 内的非字符与代理项区间 */
const RISKY_CODE_UNIT = /[\uD800-\uDFFF﷐-﷯￾￿]/;

/** 校验文本类产物的扩展名 */
const TEXT_ASSET_PATTERN = /\.(js|css|json|html)$/;

function toEscape(codeUnit: number): string {
  return `\\u${codeUnit.toString(16).toUpperCase().padStart(4, "0")}`;
}

/** 判断一个码点是否为 Unicode 非字符 */
function isNonCharacter(codePoint: number): boolean {
  if (codePoint >= 0xfdd0 && codePoint <= 0xfdef) return true;
  return (codePoint & 0xfffe) === 0xfffe;
}

/**
 * 找出文本中所有 Chrome 会拒绝的位置（非字符 + 落单代理项）
 * 返回需要转义的 UTF-16 code unit 下标
 */
function findRiskyIndexes(text: string): number[] {
  const indexes: number[] = [];

  for (let i = 0; i < text.length; i++) {
    const unit = text.charCodeAt(i);

    // 高代理项：与后面的低代理项组成完整码点后再判断是否为非字符
    if (unit >= 0xd800 && unit <= 0xdbff) {
      const next = text.charCodeAt(i + 1);
      const isPair = next >= 0xdc00 && next <= 0xdfff;
      if (!isPair) {
        indexes.push(i); // 落单高代理项
        continue;
      }
      const codePoint = (unit - 0xd800) * 0x400 + (next - 0xdc00) + 0x10000;
      if (isNonCharacter(codePoint)) {
        indexes.push(i, i + 1);
      }
      i += 1;
      continue;
    }

    // 落单低代理项
    if (unit >= 0xdc00 && unit <= 0xdfff) {
      indexes.push(i);
      continue;
    }

    if (isNonCharacter(unit)) {
      indexes.push(i);
    }
  }

  return indexes;
}

function escapeRisky(text: string): { code: string; count: number } {
  const indexes = findRiskyIndexes(text);
  if (indexes.length === 0) return { code: text, count: 0 };

  const targets = new Set(indexes);
  let result = "";
  for (let i = 0; i < text.length; i++) {
    result += targets.has(i) ? toEscape(text.charCodeAt(i)) : text[i];
  }
  return { code: result, count: indexes.length };
}

export function escapeUnicodeNonCharacters(): EscapeNonCharactersPlugin {
  return {
    name: "hamhome:escape-unicode-non-characters",
    // 必须晚于压缩：minifier 会把 renderChunk 阶段写入的转义还原成原字符，
    // 所以统一放在 generateBundle（Rollup 写盘前的最后一个钩子）里处理
    enforce: "post",

    generateBundle(_options: unknown, bundle: OutputBundleLike) {
      for (const [fileName, output] of Object.entries(bundle)) {
        if (output.type === "chunk") {
          if (!RISKY_CODE_UNIT.test(output.code)) continue;

          const { code, count } = escapeRisky(output.code);
          if (count > 0) {
            output.code = code;
          }
          continue;
        }

        // JS 之外的文本产物（CSS/JSON/HTML）无法用转义修复，只能报错提示
        if (!TEXT_ASSET_PATTERN.test(fileName)) continue;

        const source =
          typeof output.source === "string"
            ? output.source
            : new TextDecoder().decode(output.source);

        if (findRiskyIndexes(source).length > 0) {
          this.error(
            `[escape-unicode-non-characters] ${fileName} 含有 Unicode 非字符，` +
              `Chrome 会拒绝加载整个扩展，请检查该资源的来源。`,
          );
        }
      }
    },
  };
}
