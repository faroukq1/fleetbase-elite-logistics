'use strict';

/** eslint-disable node/no-unpublished-require */
const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const Funnel = require('broccoli-funnel');
const writeFile = require('broccoli-file-creator');
const mergeTrees = require('broccoli-merge-trees');
const toBoolean = require('./config/utils/to-boolean');
const postcssRTLCSS = require('postcss-rtlcss');

module.exports = function (defaults) {
    const app = new EmberApp(defaults, {
        storeConfigInMeta: false,

        fingerprint: {
            exclude: ['leaflet/', 'leaflet-images/', 'socketcluster-client.min.js', 'fleetbase.config.json', 'extensions.json'],
        },

        liveReload: {
            options: {
                ignore: ['app/router.js'],
            },
        },

        intl: {
            silent: true,
        },

        'ember-simple-auth': {
            useSessionSetupMethod: true,
        },

        babel: {
            plugins: [require.resolve('ember-auto-import/babel-plugin')],
        },
    });

    // RTL support (Arabic).
    //
    // The PostCSS/Tailwind chain is owned by @fleetbase/ember-ui, whose `included()` hook
    // assigns `app.options.postcssOptions` outright. That hook runs inside the EmberApp
    // constructor above, so the chain only exists — and can only be extended — after `app`
    // is constructed. Setting postcssOptions in the EmberApp options would be overwritten.
    //
    // postcss-rtlcss rewrites every direction-sensitive declaration (margin-left, padding-right,
    // left/right, text-align, float, ...) into `[dir="ltr"]` / `[dir="rtl"]` scoped pairs. This
    // covers Tailwind's physical utilities (ml-*, pr-*, text-left, ...) which are used throughout
    // the app and engine templates and do not flip on their own.
    //
    // Because rules become `[dir]`-scoped, the <html> element MUST always carry a dir attribute.
    // app/index.html ships dir="ltr" and services/language.js updates it on locale change.
    const postcssPlugins = app.options?.postcssOptions?.compile?.plugins;
    if (!Array.isArray(postcssPlugins)) {
        throw new Error('[rtl] Expected @fleetbase/ember-ui to define postcssOptions.compile.plugins; RTL styles would be silently dropped.');
    }
    // Insert before autoprefixer (the last plugin) so flipped declarations still get prefixed.
    postcssPlugins.splice(postcssPlugins.length - 1, 0, postcssRTLCSS({ processUrls: false }));

    let runtimeConfigTree;
    if (toBoolean(process.env.DISABLE_RUNTIME_CONFIG)) {
        runtimeConfigTree = writeFile('fleetbase.config.json', '{}');
    } else {
        runtimeConfigTree = new Funnel('.', {
            files: ['fleetbase.config.json'],
            destDir: '/',
        });
    }

    return app.toTree([runtimeConfigTree].filter(Boolean));
};
