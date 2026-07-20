import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

/**
 * Header Theme Toggle Button
 *
 * Elite Logistics: the dark/light toggle used to live buried in the user
 * dropdown menu (`Layout::Header::DarkModeToggle`, still used there — see
 * the ember-ui patch that drops it from the menu items list). This is the
 * replacement: a standalone icon button in the top navbar tray, next to the
 * language selector, so it's reachable from every page in one click.
 *
 * Persistence is unchanged — `theme.toggleTheme()` is the same service
 * method the old menu toggle called, which saves the preference on
 * `currentUser` via `applyTheme({ persist: true })`.
 */
export default class LayoutHeaderThemeToggleButtonComponent extends Component {
    @service theme;
    @service intl;

    get isDark() {
        return this.theme.currentTheme === 'dark';
    }

    get label() {
        return this.intl.t(this.isDark ? 'theme-toggle.switch-to-light' : 'theme-toggle.switch-to-dark');
    }

    @action toggle() {
        this.theme.toggleTheme();
    }
}
