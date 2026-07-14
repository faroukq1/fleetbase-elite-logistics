import Component from '@glimmer/component';

export default class LogoIconComponent extends Component {
    get src() {
        if (this.args.brand?.icon_url) {
            return this.args.brand.icon_url;
        }
        return '/images/icon.png';
    }

    get size() {
        return this.args.size || '8';
    }
}
