/**
 * Sidebar Collapse Tooltips Instance Initializer
 *
 * When the primary sidebar is collapsed to its icon-only rail
 * (`.next-sidebar.sidebar-minimized`), nav item labels are hidden by CSS.
 * This restores discoverability by setting the native `title` attribute
 * (a real hover/focus tooltip) from the item's own label text the moment
 * a pointer or keyboard focus reaches it — no vendor template changes
 * needed, since it reads whatever text is already rendered inside the item.
 *
 * Covers both sidebar item flavors used across the console:
 *  - `.next-nav-item` (classic accordion sidebar, e.g. Settings)
 *  - `.next-sidebar-navigator-item` (search + drill-down navigator)
 *
 * @export
 * @param {ApplicationInstance} appInstance
 */
export function initialize() {
    if (window.__eliteSidebarCollapseTooltipsInit) {
        return;
    }
    window.__eliteSidebarCollapseTooltipsInit = true;

    const ITEM_SELECTOR = '.next-sidebar.sidebar-minimized .next-nav-item, .next-sidebar.sidebar-minimized .next-sidebar-navigator-item';

    const labelFor = (item) => {
        const label = item.querySelector('.next-sidebar-navigator-item-label, .truncate');
        const text = label?.textContent?.trim();

        return text || null;
    };

    const applyTitle = (event) => {
        const item = event.target.closest?.(ITEM_SELECTOR);

        if (!item) {
            return;
        }

        const label = labelFor(item);

        if (label) {
            item.title = label;
        }
    };

    document.addEventListener('mouseover', applyTitle, { passive: true, capture: true });
    document.addEventListener('focusin', applyTitle, { passive: true, capture: true });
}

export default {
    initialize,
};
