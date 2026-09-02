/**
 * Shadow Root Style Guard
 *
 * `createShadowRootUi` cannot keep every rule inside the shadow tree: `@property`
 * and `@font-face` are ignored there, so WXT extracts them into a
 * `<style wxt-shadow-root-document-styles="...">` element appended to
 * `document.head`.
 *
 * Pages that diff and rewrite `<head>` during soft navigation delete that style
 * because it is absent from the freshly fetched document. Material for MkDocs
 * "instant loading" does exactly this (see the `@property` teardown reported in
 * https://github.com/bingoYB/ham_home/issues/13): every `--tw-*` custom property
 * becomes unregistered, so declarations like
 * `translate: var(--tw-translate-x) var(--tw-translate-y)` turn invalid at
 * computed-value time and fall back to `none`. The collapsed sidebar then stops
 * being translated off-screen and sits flush against the viewport edge, visible
 * but still `pointer-events: none` and without its backdrop.
 *
 * Re-append the style whenever the page drops it.
 */
import type { ContentScriptContext } from "wxt/utils/content-script-context";

const DOCUMENT_STYLE_SELECTOR = "style[wxt-shadow-root-document-styles]";

/**
 * Keep WXT's document-level shadow root styles attached to `<head>`.
 * Call after `ui.mount()`, once the style element exists.
 */
export function keepShadowRootDocumentStyles(ctx: ContentScriptContext): void {
  const styles = Array.from(
    document.querySelectorAll<HTMLStyleElement>(DOCUMENT_STYLE_SELECTOR),
  );

  if (styles.length === 0) return;

  let headObserver: MutationObserver | null = null;

  const restore = () => {
    if (!ctx.isValid) return;

    const parent = document.head ?? document.documentElement;
    for (const style of styles) {
      if (!style.isConnected) parent.append(style);
    }
  };

  // `<head>` itself can be replaced wholesale, so re-bind the child observer
  // whenever the documentElement's children change.
  const observeHead = () => {
    headObserver?.disconnect();
    headObserver = null;

    if (!document.head) return;

    headObserver = new MutationObserver(restore);
    headObserver.observe(document.head, { childList: true });
  };

  const rootObserver = new MutationObserver(() => {
    observeHead();
    restore();
  });

  rootObserver.observe(document.documentElement, { childList: true });
  observeHead();

  ctx.onInvalidated(() => {
    rootObserver.disconnect();
    headObserver?.disconnect();
    headObserver = null;
  });
}
