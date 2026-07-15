import BaseLanguageService from '@fleetbase/ember-core/services/language';
import { inject as service } from '@ember/service';

/**
 * Locales offered in the language selector.
 *
 * The selector is built from `intl.locales`, which is the union of every locale registered by the
 * app *and* by each engine (fleetops, storefront, iam, ...). Deleting files from
 * `console/translations` therefore does not remove a language from the menu, since the engines
 * register their own locales at build time. Filtering the locale map is the only place that
 * reliably controls the list.
 */
const SUPPORTED_LOCALES = ['en-us', 'ar-ae'];

/**
 * Locales written right-to-left.
 */
const RTL_LOCALES = ['ar-ae'];

export default class LanguageService extends BaseLanguageService {
    @service intl;

    constructor() {
        super(...arguments);

        // Apply on boot, so a user whose saved locale is Arabic gets RTL on first paint
        // rather than a flash of left-to-right layout.
        this.applyDocumentDirection(this.intl.primaryLocale);

        this.intl.onLocaleChanged(() => {
            this.applyDocumentDirection(this.intl.primaryLocale);
        });
    }

    /**
     * Sync <html lang> and <html dir> with the active locale.
     *
     * `dir` is load-bearing, not cosmetic: postcss-rtlcss compiles direction-sensitive CSS into
     * [dir="ltr"] / [dir="rtl"] scoped rules, so the attribute must always be present and correct
     * for either direction to render.
     */
    applyDocumentDirection(locale) {
        if (!locale || typeof document === 'undefined') {
            return;
        }

        const normalized = String(locale).toLowerCase();
        const isRtl = RTL_LOCALES.includes(normalized);
        const root = document.documentElement;

        root.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
        root.setAttribute('lang', normalized.split('-')[0]);
    }

    _createAvailableLocaleMap() {
        const localeMap = super._createAvailableLocaleMap();

        return Object.keys(localeMap)
            .filter((locale) => SUPPORTED_LOCALES.includes(locale.toLowerCase()))
            .reduce((supported, locale) => {
                supported[locale] = localeMap[locale];
                return supported;
            }, {});
    }
}
