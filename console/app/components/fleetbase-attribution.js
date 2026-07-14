import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import getWithDefault from '@fleetbase/ember-core/utils/get-with-default';
import config from '@fleetbase/console/config/environment';

export default class FleetbaseAttributionComponent extends Component {
    @service router;

    get isVisible() {
        const currentRoute = getWithDefault(this.router, 'currentRouteName', '');
        const disableAttribution = getWithDefault(config, 'APP.disableFleetbaseAttribution', false);

        return !disableAttribution || !currentRoute.startsWith('console');
    }
}
