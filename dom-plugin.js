(function (root, factory) {
    if (typeof define === 'function' && define.amd && require) {
        require(['lodash', 'khoaijs', 'khoaijs-app', 'jquery'], function (_, Khoai, App, jQuery) {
            factory(_, Khoai, App, jQuery)
        });
    } else {
        var app = root.Khoai && root.Khoai.App || root.App || {};


        factory(
            root._,
            root.Khoai,
            app,
            root.jQuery || root.$
        );

        if (root.Khoai) {
            root.Khoai.App = app;
        }

        root.App = app;
    }
}(this, function (_, Khoai, App, jQuery) {
    var _dom_plugins = {};

    /*
     |--------------------------------------------------------------------------
     | DOM Plugin
     |--------------------------------------------------------------------------
     */

    /**
     * Check if a DOM plugin is registered
     * @param {string} name
     * @return {boolean}
     */
    App.hasDOMPlugin = function (name) {
        return _dom_plugins.hasOwnProperty(name);
    };

    /**
     * Add jQuery Plugin callback
     * @param {string} name plugin name, default is unique id
     * @param {function} callback Callback, call arguments are: dom, options
     * @param {object} options Default options
     */
    App.addDOMPlugin = function (name, callback, options) {
        _dom_plugins[name] = {
            callback: callback,
            options: _.isObject(options) ? options : {}
        };
    };

    /**
     * Remove plugin
     * @param {string} [name]
     * @returns {boolean}
     */
    App.removeDOMPlugin = function (name) {
        name = _.flatten(Array.prototype.slice.call(arguments));

        _.each(name, function (tmp_name) {
            _dom_plugins[tmp_name] = null;
            delete _dom_plugins[tmp_name];
        });
    };

    /**
     * Apply plugin on dom
     * @param {string|Element} [selector_or_dom = body] selector or DOM or jQuery DOM
     * @param {Array} [plugins] Name of plugins
     * @param {object} [options]
     */
    App.applyDOMPlugin = function (selector_or_dom, plugins, options) {
        var parameters = Khoai.util.optionalArgs(_.toArray(arguments), ['selector', 'plugins', 'options'], {
            selector: function (arg) {
                return _.isString(arg) || arg instanceof jQuery;
            },
            plugins: 'Array',
            options: 'Object'
        });

        selector_or_dom = jQuery(parameters.selector || 'body');
        plugins = parameters.plugins || Object.keys(_dom_plugins);
        options = parameters.options || {};

        var not_found = _.difference(plugins, Object.keys(_dom_plugins));
        if (!_.isEmpty(not_found)) {
            throw new Error('Apply not found DOM plugin: ' + not_found.join(', '));
        }

        _.each(plugins, function (plugin) {
            var _options = _.has(options, plugin) ? options[plugin] : {};
            _dom_plugins[plugin].callback(selector_or_dom, _.extend({}, _dom_plugins[plugin].options, _options));
        });
    };
}));