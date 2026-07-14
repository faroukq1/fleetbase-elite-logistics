import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class AuthForgotPasswordRoute extends Route {
    @service store;

    queryParams = {
        email: {
            refreshModel: false,
        },
    };

    async setupController(controller) {
        super.setupController(...arguments);
        controller.brand = await this.store.findRecord('brand', 1);
    }
}
