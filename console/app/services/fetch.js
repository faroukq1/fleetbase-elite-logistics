import FetchService from '@fleetbase/ember-core/services/fetch';
import { inject as service } from '@ember/service';

/**
 * Elite Logistics: adds an `X-Locale` header to every API request, carrying
 * the console's active in-app locale (e.g. `ar-ae`) — independent of the
 * browser's own `Accept-Language` header, which reflects OS/browser
 * settings rather than the language toggle in this app. The backend reads
 * it (see api/app/Http/Middleware/SetLocaleFromHeader.php) to return
 * server-generated content — currently spreadsheet export column
 * headings — in the same language the console is set to.
 */
export default class ElitFetchService extends FetchService {
    @service intl;

    getHeaders() {
        const headers = super.getHeaders();

        if (this.intl?.primaryLocale) {
            headers['X-Locale'] = this.intl.primaryLocale;
        }

        return headers;
    }
}
