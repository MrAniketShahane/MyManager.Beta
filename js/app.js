﻿/*!
  * Bootstrap v5.3.3 (https://getbootstrap.com/)
  * Copyright 2011-2024 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@popperjs/core')) :
        typeof define === 'function' && define.amd ? define(['@popperjs/core'], factory) :
            (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.bootstrap = factory(global.Popper));
})(this, (function (Popper) {
    'use strict';

    function _interopNamespaceDefault(e) {
        const n = Object.create(null, { [Symbol.toStringTag]: { value: 'Module' } });
        if (e) {
            for (const k in e) {
                if (k !== 'default') {
                    const d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: () => e[k]
                    });
                }
            }
        }
        n.default = e;
        return Object.freeze(n);
    }

    const Popper__namespace = /*#__PURE__*/_interopNamespaceDefault(Popper);

    /**
     * --------------------------------------------------------------------------
     * Bootstrap dom/data.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */

    /**
     * Constants
     */

    const elementMap = new Map();
    const Data = {
        set(element, key, instance) {
            if (!elementMap.has(element)) {
                elementMap.set(element, new Map());
            }
            const instanceMap = elementMap.get(element);

            // make it clear we only want one instance per element
            // can be removed later when multiple key/instances are fine to be used
            if (!instanceMap.has(key) && instanceMap.size !== 0) {
                // eslint-disable-next-line no-console
                console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`);
                return;
            }
            instanceMap.set(key, instance);
        },
        get(element, key) {
            if (elementMap.has(element)) {
                return elementMap.get(element).get(key) || null;
            }
            return null;
        },
        remove(element, key) {
            if (!elementMap.has(element)) {
                return;
            }
            const instanceMap = elementMap.get(element);
            instanceMap.delete(key);

            // free up element references if there are no instances left for an element
            if (instanceMap.size === 0) {
                elementMap.delete(element);
            }
        }
    };

    /**
     * --------------------------------------------------------------------------
     * Bootstrap util/index.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */

    const MAX_UID = 1000000;
    const MILLISECONDS_MULTIPLIER = 1000;
    const TRANSITION_END = 'transitionend';

    /**
     * Properly escape IDs selectors to handle weird IDs
     * @param {string} selector
     * @returns {string}
     */
    const parseSelector = selector => {
        if (selector && window.CSS && window.CSS.escape) {
            // document.querySelector needs escaping to handle IDs (html5+) containing for instance /
            selector = selector.replace(/#([^\s"#']+)/g, (match, id) => `#${CSS.escape(id)}`);
        }
        return selector;
    };

    // Shout-out Angus Croll (https://goo.gl/pxwQGp)
    const toType = object => {
        if (object === null || object === undefined) {
            return `${object}`;
        }
        return Object.prototype.toString.call(object).match(/\s([a-z]+)/i)[1].toLowerCase();
    };

    /**
     * Public Util API
     */

    const getUID = prefix => {
        do {
            prefix += Math.floor(Math.random() * MAX_UID);
        } while (document.getElementById(prefix));
        return prefix;
    };
    const getTransitionDurationFromElement = element => {
        if (!element) {
            return 0;
        }

        // Get transition-duration of the element
        let {
            transitionDuration,
            transitionDelay
        } = window.getComputedStyle(element);
        const floatTransitionDuration = Number.parseFloat(transitionDuration);
        const floatTransitionDelay = Number.parseFloat(transitionDelay);

        // Return 0 if element or transition duration is not found
        if (!floatTransitionDuration && !floatTransitionDelay) {
            return 0;
        }

        // If multiple durations are defined, take the first
        transitionDuration = transitionDuration.split(',')[0];
        transitionDelay = transitionDelay.split(',')[0];
        return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
    };
    const triggerTransitionEnd = element => {
        element.dispatchEvent(new Event(TRANSITION_END));
    };
    const isElement = object => {
        if (!object || typeof object !== 'object') {
            return false;
        }
        if (typeof object.jquery !== 'undefined') {
            object = object[0];
        }
        return typeof object.nodeType !== 'undefined';
    };
    const getElement = object => {
        // it's a jQuery object or a node element
        if (isElement(object)) {
            return object.jquery ? object[0] : object;
        }
        if (typeof object === 'string' && object.length > 0) {
            return document.querySelector(parseSelector(object));
        }
        return null;
    };
    const isVisible = element => {
        if (!isElement(element) || element.getClientRects().length === 0) {
            return false;
        }
        const elementIsVisible = getComputedStyle(element).getPropertyValue('visibility') === 'visible';
        // Handle `details` element as its content may falsie appear visible when it is closed
        const closedDetails = element.closest('details:not([open])');
        if (!closedDetails) {
            return elementIsVisible;
        }
        if (closedDetails !== element) {
            const summary = element.closest('summary');
            if (summary && summary.parentNode !== closedDetails) {
                return false;
            }
            if (summary === null) {
                return false;
            }
        }
        return elementIsVisible;
    };
    const isDisabled = element => {
        if (!element || element.nodeType !== Node.ELEMENT_NODE) {
            return true;
        }
        if (element.classList.contains('disabled')) {
            return true;
        }
        if (typeof element.disabled !== 'undefined') {
            return element.disabled;
        }
        return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
    };
    const findShadowRoot = element => {
        if (!document.documentElement.attachShadow) {
            return null;
        }

        // Can find the shadow root otherwise it'll return the document
        if (typeof element.getRootNode === 'function') {
            const root = element.getRootNode();
            return root instanceof ShadowRoot ? root : null;
        }
        if (element instanceof ShadowRoot) {
            return element;
        }

        // when we don't find a shadow root
        if (!element.parentNode) {
            return null;
        }
        return findShadowRoot(element.parentNode);
    };
    const noop = () => { };

    /**
     * Trick to restart an element's animation
     *
     * @param {HTMLElement} element
     * @return void
     *
     * @see https://www.charistheo.io/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
     */
    const reflow = element => {
        element.offsetHeight; // eslint-disable-line no-unused-expressions
    };
    const getjQuery = () => {
        if (window.jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
            return window.jQuery;
        }
        return null;
    };
    const DOMContentLoadedCallbacks = [];
    const onDOMContentLoaded = callback => {
        if (document.readyState === 'loading') {
            // add listener on the first call when the document is in loading state
            if (!DOMContentLoadedCallbacks.length) {
                document.addEventListener('DOMContentLoaded', () => {
                    for (const callback of DOMContentLoadedCallbacks) {
                        callback();
                    }
                });
            }
            DOMContentLoadedCallbacks.push(callback);
        } else {
            callback();
        }
    };
    const isRTL = () => document.documentElement.dir === 'rtl';

    const defineJQueryPlugin = plugin => {
        onDOMContentLoaded(() => {
            const $ = getjQuery();
            /* istanbul ignore if */
            if ($) {
                const name = plugin.NAME;
                const JQUERY_NO_CONFLICT = $.fn[name];
                $.fn[name] = plugin.jQueryInterface;
                $.fn[name].Constructor = plugin;
                $.fn[name].noConflict = () => {
                    $.fn[name] = JQUERY_NO_CONFLICT;
                    return plugin.jQueryInterface;
                };
            }
        });
    };
    const execute = (possibleCallback, args = [], defaultValue = possibleCallback) => {
        return typeof possibleCallback === 'function' ? possibleCallback(...args) : defaultValue;
    };
    const executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
        if (!waitForTransition) {
            execute(callback);
            return;
        }
        const durationPadding = 5;
        const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;
        let called = false;
        const handler = ({
            target
        }) => {
            if (target !== transitionElement) {
                return;
            }
            called = true;
            transitionElement.removeEventListener(TRANSITION_END, handler);
            execute(callback);
        };
        transitionElement.addEventListener(TRANSITION_END, handler);
        setTimeout(() => {
            if (!called) {
                triggerTransitionEnd(transitionElement);
            }
        }, emulatedDuration);
    };


    /**
     * --------------------------------------------------------------------------
     * Bootstrap dom/event-handler.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */


    /**
     * Constants
     */

    const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
    const stripNameRegex = /\..*/;
    const stripUidRegex = /::\d+$/;
    const eventRegistry = {}; // Events storage
    let uidEvent = 1;
    const customEvents = {
        mouseenter: 'mouseover',
        mouseleave: 'mouseout'
    };
    const nativeEvents = new Set(['click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu', 'mousewheel', 'DOMMouseScroll', 'mouseover', 'mouseout', 'mousemove', 'selectstart', 'selectend', 'keydown', 'keypress', 'keyup', 'orientationchange', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'pointerdown', 'pointermove', 'pointerup', 'pointerleave', 'pointercancel', 'gesturestart', 'gesturechange', 'gestureend', 'focus', 'blur', 'change', 'reset', 'select', 'submit', 'focusin', 'focusout', 'load', 'unload', 'beforeunload', 'resize', 'move', 'DOMContentLoaded', 'readystatechange', 'error', 'abort', 'scroll']);

    /**
     * Private methods
     */

    function makeEventUid(element, uid) {
        return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
    }
    function getElementEvents(element) {
        const uid = makeEventUid(element);
        element.uidEvent = uid;
        eventRegistry[uid] = eventRegistry[uid] || {};
        return eventRegistry[uid];
    }
    function bootstrapHandler(element, fn) {
        return function handler(event) {
            hydrateObj(event, {
                delegateTarget: element
            });
            if (handler.oneOff) {
                EventHandler.off(element, event.type, fn);
            }
            return fn.apply(element, [event]);
        };
    }
    function bootstrapDelegationHandler(element, selector, fn) {
        return function handler(event) {
            const domElements = element.querySelectorAll(selector);
            for (let {
                target
            } = event; target && target !== this; target = target.parentNode) {
                for (const domElement of domElements) {
                    if (domElement !== target) {
                        continue;
                    }
                    hydrateObj(event, {
                        delegateTarget: target
                    });
                    if (handler.oneOff) {
                        EventHandler.off(element, event.type, selector, fn);
                    }
                    return fn.apply(target, [event]);
                }
            }
        };
    }
    function findHandler(events, callable, delegationSelector = null) {
        return Object.values(events).find(event => event.callable === callable && event.delegationSelector === delegationSelector);
    }
    function normalizeParameters(originalTypeEvent, handler, delegationFunction) {
        const isDelegated = typeof handler === 'string';
        // TODO: tooltip passes `false` instead of selector, so we need to check
        const callable = isDelegated ? delegationFunction : handler || delegationFunction;
        let typeEvent = getTypeEvent(originalTypeEvent);
        if (!nativeEvents.has(typeEvent)) {
            typeEvent = originalTypeEvent;
        }
        return [isDelegated, callable, typeEvent];
    }
    function addHandler(element, originalTypeEvent, handler, delegationFunction, oneOff) {
        if (typeof originalTypeEvent !== 'string' || !element) {
            return;
        }
        let [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);

        // in case of mouseenter or mouseleave wrap the handler within a function that checks for its DOM position
        // this prevents the handler from being dispatched the same way as mouseover or mouseout does
        if (originalTypeEvent in customEvents) {
            const wrapFunction = fn => {
                return function (event) {
                    if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) {
                        return fn.call(this, event);
                    }
                };
            };
            callable = wrapFunction(callable);
        }
        const events = getElementEvents(element);
        const handlers = events[typeEvent] || (events[typeEvent] = {});
        const previousFunction = findHandler(handlers, callable, isDelegated ? handler : null);
        if (previousFunction) {
            previousFunction.oneOff = previousFunction.oneOff && oneOff;
            return;
        }
        const uid = makeEventUid(callable, originalTypeEvent.replace(namespaceRegex, ''));
        const fn = isDelegated ? bootstrapDelegationHandler(element, handler, callable) : bootstrapHandler(element, callable);
        fn.delegationSelector = isDelegated ? handler : null;
        fn.callable = callable;
        fn.oneOff = oneOff;
        fn.uidEvent = uid;
        handlers[uid] = fn;
        element.addEventListener(typeEvent, fn, isDelegated);
    }
    function removeHandler(element, events, typeEvent, handler, delegationSelector) {
        const fn = findHandler(events[typeEvent], handler, delegationSelector);
        if (!fn) {
            return;
        }
        element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
        delete events[typeEvent][fn.uidEvent];
    }
    function removeNamespacedHandlers(element, events, typeEvent, namespace) {
        const storeElementEvent = events[typeEvent] || {};
        for (const [handlerKey, event] of Object.entries(storeElementEvent)) {
            if (handlerKey.includes(namespace)) {
                removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
            }
        }
    }
    function getTypeEvent(event) {
        // allow to get the native events from namespaced events ('click.bs.button' --> 'click')
        event = event.replace(stripNameRegex, '');
        return customEvents[event] || event;
    }
    const EventHandler = {
        on(element, event, handler, delegationFunction) {
            addHandler(element, event, handler, delegationFunction, false);
        },
        one(element, event, handler, delegationFunction) {
            addHandler(element, event, handler, delegationFunction, true);
        },
        off(element, originalTypeEvent, handler, delegationFunction) {
            if (typeof originalTypeEvent !== 'string' || !element) {
                return;
            }
            const [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);
            const inNamespace = typeEvent !== originalTypeEvent;
            const events = getElementEvents(element);
            const storeElementEvent = events[typeEvent] || {};
            const isNamespace = originalTypeEvent.startsWith('.');
            if (typeof callable !== 'undefined') {
                // Simplest case: handler is passed, remove that listener ONLY.
                if (!Object.keys(storeElementEvent).length) {
                    return;
                }
                removeHandler(element, events, typeEvent, callable, isDelegated ? handler : null);
                return;
            }
            if (isNamespace) {
                for (const elementEvent of Object.keys(events)) {
                    removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
                }
            }
            for (const [keyHandlers, event] of Object.entries(storeElementEvent)) {
                const handlerKey = keyHandlers.replace(stripUidRegex, '');
                if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
                    removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
                }
            }
        },
        trigger(element, event, args) {
            if (typeof event !== 'string' || !element) {
                return null;
            }
            const $ = getjQuery();
            const typeEvent = getTypeEvent(event);
            const inNamespace = event !== typeEvent;
            let jQueryEvent = null;
            let bubbles = true;
            let nativeDispatch = true;
            let defaultPrevented = false;
            if (inNamespace && $) {
                jQueryEvent = $.Event(event, args);
                $(element).trigger(jQueryEvent);
                bubbles = !jQueryEvent.isPropagationStopped();
                nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
                defaultPrevented = jQueryEvent.isDefaultPrevented();
            }
            const evt = hydrateObj(new Event(event, {
                bubbles,
                cancelable: true
            }), args);
            if (defaultPrevented) {
                evt.preventDefault();
            }
            if (nativeDispatch) {
                element.dispatchEvent(evt);
            }
            if (evt.defaultPrevented && jQueryEvent) {
                jQueryEvent.preventDefault();
            }
            return evt;
        }
    };
    function hydrateObj(obj, meta = {}) {
        for (const [key, value] of Object.entries(meta)) {
            try {
                obj[key] = value;
            } catch (_unused) {
                Object.defineProperty(obj, key, {
                    configurable: true,
                    get() {
                        return value;
                    }
                });
            }
        }
        return obj;
    }


    /**
    * --------------------------------------------------------------------------
    * Bootstrap util/component-functions.js
    * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
    * --------------------------------------------------------------------------
    */

    const enableDismissTrigger = (component, method = 'hide') => {
        const clickEvent = `click.dismiss${component.EVENT_KEY}`;
        const name = component.NAME;
        EventHandler.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function (event) {
            if (['A', 'AREA'].includes(this.tagName)) {
                event.preventDefault();
            }
            if (isDisabled(this)) {
                return;
            }
            const target = SelectorEngine.getElementFromSelector(this) || this.closest(`.${name}`);
            const instance = component.getOrCreateInstance(target);

            // Method argument is left, for Alert and only, as it doesn't implement the 'hide' method
            instance[method]();
        });
    };

    /**
    * --------------------------------------------------------------------------
    * Bootstrap dom/manipulator.js
    * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
    * --------------------------------------------------------------------------
    */

    function normalizeData(value) {
        if (value === 'true') {
            return true;
        }
        if (value === 'false') {
            return false;
        }
        if (value === Number(value).toString()) {
            return Number(value);
        }
        if (value === '' || value === 'null') {
            return null;
        }
        if (typeof value !== 'string') {
            return value;
        }
        try {
            return JSON.parse(decodeURIComponent(value));
        } catch (_unused) {
            return value;
        }
    }
    function normalizeDataKey(key) {
        return key.replace(/[A-Z]/g, chr => `-${chr.toLowerCase()}`);
    }
    const Manipulator = {
        setDataAttribute(element, key, value) {
            element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
        },
        removeDataAttribute(element, key) {
            element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
        },
        getDataAttributes(element) {
            if (!element) {
                return {};
            }
            const attributes = {};
            const bsKeys = Object.keys(element.dataset).filter(key => key.startsWith('bs') && !key.startsWith('bsConfig'));
            for (const key of bsKeys) {
                let pureKey = key.replace(/^bs/, '');
                pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length);
                attributes[pureKey] = normalizeData(element.dataset[key]);
            }
            return attributes;
        },
        getDataAttribute(element, key) {
            return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`));
        }
    };

    /**
     * --------------------------------------------------------------------------
     * Bootstrap dom/selector-engine.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */

    const getSelector = element => {
        let selector = element.getAttribute('data-bs-target');
        if (!selector || selector === '#') {
            let hrefAttribute = element.getAttribute('href');

            // The only valid content that could double as a selector are IDs or classes,
            // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
            // `document.querySelector` will rightfully complain it is invalid.
            // See https://github.com/twbs/bootstrap/issues/32273
            if (!hrefAttribute || !hrefAttribute.includes('#') && !hrefAttribute.startsWith('.')) {
                return null;
            }

            // Just in case some CMS puts out a full URL with the anchor appended
            if (hrefAttribute.includes('#') && !hrefAttribute.startsWith('#')) {
                hrefAttribute = `#${hrefAttribute.split('#')[1]}`;
            }
            selector = hrefAttribute && hrefAttribute !== '#' ? hrefAttribute.trim() : null;
        }
        return selector ? selector.split(',').map(sel => parseSelector(sel)).join(',') : null;
    };
    const SelectorEngine = {
        find(selector, element = document.documentElement) {
            return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
        },
        findOne(selector, element = document.documentElement) {
            return Element.prototype.querySelector.call(element, selector);
        },
        children(element, selector) {
            return [].concat(...element.children).filter(child => child.matches(selector));
        },
        parents(element, selector) {
            const parents = [];
            let ancestor = element.parentNode.closest(selector);
            while (ancestor) {
                parents.push(ancestor);
                ancestor = ancestor.parentNode.closest(selector);
            }
            return parents;
        },
        prev(element, selector) {
            let previous = element.previousElementSibling;
            while (previous) {
                if (previous.matches(selector)) {
                    return [previous];
                }
                previous = previous.previousElementSibling;
            }
            return [];
        },
        // TODO: this is now unused; remove later along with prev()
        next(element, selector) {
            let next = element.nextElementSibling;
            while (next) {
                if (next.matches(selector)) {
                    return [next];
                }
                next = next.nextElementSibling;
            }
            return [];
        },
        focusableChildren(element) {
            const focusables = ['a', 'button', 'input', 'textarea', 'select', 'details', '[tabindex]', '[contenteditable="true"]'].map(selector => `${selector}:not([tabindex^="-"])`).join(',');
            return this.find(focusables, element).filter(el => !isDisabled(el) && isVisible(el));
        },
        getSelectorFromElement(element) {
            const selector = getSelector(element);
            if (selector) {
                return SelectorEngine.findOne(selector) ? selector : null;
            }
            return null;
        },
        getElementFromSelector(element) {
            const selector = getSelector(element);
            return selector ? SelectorEngine.findOne(selector) : null;
        },
        getMultipleElementsFromSelector(element) {
            const selector = getSelector(element);
            return selector ? SelectorEngine.find(selector) : [];
        }
    };


    /**
     * --------------------------------------------------------------------------
     * Bootstrap util/config.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */


    /**
     * Class definition
     */

    class Config {
        // Getters
        static get Default() {
            return {};
        }
        static get DefaultType() {
            return {};
        }
        static get NAME() {
            throw new Error('You have to implement the static method "NAME", for each component!');
        }
        _getConfig(config) {
            config = this._mergeConfigObj(config);
            config = this._configAfterMerge(config);
            this._typeCheckConfig(config);
            return config;
        }
        _configAfterMerge(config) {
            return config;
        }
        _mergeConfigObj(config, element) {
            const jsonConfig = isElement(element) ? Manipulator.getDataAttribute(element, 'config') : {}; // try to parse

            return {
                ...this.constructor.Default,
                ...(typeof jsonConfig === 'object' ? jsonConfig : {}),
                ...(isElement(element) ? Manipulator.getDataAttributes(element) : {}),
                ...(typeof config === 'object' ? config : {})
            };
        }
        _typeCheckConfig(config, configTypes = this.constructor.DefaultType) {
            for (const [property, expectedTypes] of Object.entries(configTypes)) {
                const value = config[property];
                const valueType = isElement(value) ? 'element' : toType(value);
                if (!new RegExp(expectedTypes).test(valueType)) {
                    throw new TypeError(`${this.constructor.NAME.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
                }
            }
        }
    }

    /**
     * --------------------------------------------------------------------------
     * Bootstrap base-component.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */


    /**
     * Constants
     */

    const VERSION = '5.3.3';

    /**
     * Class definition
     */

    class BaseComponent extends Config {
        constructor(element, config) {
            super();
            element = getElement(element);
            if (!element) {
                return;
            }
            this._element = element;
            this._config = this._getConfig(config);
            Data.set(this._element, this.constructor.DATA_KEY, this);
        }

        // Public
        dispose() {
            Data.remove(this._element, this.constructor.DATA_KEY);
            EventHandler.off(this._element, this.constructor.EVENT_KEY);
            for (const propertyName of Object.getOwnPropertyNames(this)) {
                this[propertyName] = null;
            }
        }
        _queueCallback(callback, element, isAnimated = true) {
            executeAfterTransition(callback, element, isAnimated);
        }
        _getConfig(config) {
            config = this._mergeConfigObj(config, this._element);
            config = this._configAfterMerge(config);
            this._typeCheckConfig(config);
            return config;
        }

        // Static
        static getInstance(element) {
            return Data.get(getElement(element), this.DATA_KEY);
        }
        static getOrCreateInstance(element, config = {}) {
            return this.getInstance(element) || new this(element, typeof config === 'object' ? config : null);
        }
        static get VERSION() {
            return VERSION;
        }
        static get DATA_KEY() {
            return `bs.${this.NAME}`;
        }
        static get EVENT_KEY() {
            return `.${this.DATA_KEY}`;
        }
        static eventName(name) {
            return `${name}${this.EVENT_KEY}`;
        }
    }

    

    const NAME$f = 'alert';
    const DATA_KEY$a = 'bs.alert';
    const EVENT_KEY$b = `.${DATA_KEY$a}`;
    const EVENT_CLOSE = `close${EVENT_KEY$b}`;
    const EVENT_CLOSED = `closed${EVENT_KEY$b}`;
    const CLASS_NAME_FADE$5 = 'fade';
    const CLASS_NAME_SHOW$8 = 'show';

    /**
     * Class definition
     */

    class Alert extends BaseComponent {
        // Getters
        static get NAME() {
            return NAME$f;
        }

        // Public
        close() {
            const closeEvent = EventHandler.trigger(this._element, EVENT_CLOSE);
            if (closeEvent.defaultPrevented) {
                return;
            }
            this._element.classList.remove(CLASS_NAME_SHOW$8);
            const isAnimated = this._element.classList.contains(CLASS_NAME_FADE$5);
            this._queueCallback(() => this._destroyElement(), this._element, isAnimated);
        }

        // Private
        _destroyElement() {
            this._element.remove();
            EventHandler.trigger(this._element, EVENT_CLOSED);
            this.dispose();
        }

        // Static
        static jQueryInterface(config) {
            return this.each(function () {
                const data = Alert.getOrCreateInstance(this);
                if (typeof config !== 'string') {
                    return;
                }
                if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
                    throw new TypeError(`No method named "${config}"`);
                }
                data[config](this);
            });
        }
    }

    /**
     * Data API implementation
     */

    enableDismissTrigger(Alert, 'close');

    /**
     * jQuery
     */

    defineJQueryPlugin(Alert);

   

    /**
     * --------------------------------------------------------------------------
     * Bootstrap dropdown.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */


    /**
     * Constants
     */

    const NAME$a = 'dropdown';
    const DATA_KEY$6 = 'bs.dropdown';
    const EVENT_KEY$6 = `.${DATA_KEY$6}`;
    const DATA_API_KEY$3 = '.data-api';
    const ESCAPE_KEY$2 = 'Escape';
    const TAB_KEY$1 = 'Tab';
    const ARROW_UP_KEY$1 = 'ArrowUp';
    const ARROW_DOWN_KEY$1 = 'ArrowDown';
    const RIGHT_MOUSE_BUTTON = 2; // MouseEvent.button value for the secondary button, usually the right button

    const EVENT_HIDE$5 = `hide${EVENT_KEY$6}`;
    const EVENT_HIDDEN$5 = `hidden${EVENT_KEY$6}`;
    const EVENT_SHOW$5 = `show${EVENT_KEY$6}`;
    const EVENT_SHOWN$5 = `shown${EVENT_KEY$6}`;
    const EVENT_CLICK_DATA_API$3 = `click${EVENT_KEY$6}${DATA_API_KEY$3}`;
    const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY$6}${DATA_API_KEY$3}`;
    const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY$6}${DATA_API_KEY$3}`;
    const CLASS_NAME_SHOW$6 = 'show';
    const CLASS_NAME_DROPUP = 'dropup';
    const CLASS_NAME_DROPEND = 'dropend';
    const CLASS_NAME_DROPSTART = 'dropstart';
    const CLASS_NAME_DROPUP_CENTER = 'dropup-center';
    const CLASS_NAME_DROPDOWN_CENTER = 'dropdown-center';
    const SELECTOR_DATA_TOGGLE$3 = '[data-bs-toggle="dropdown"]:not(.disabled):not(:disabled)';
    const SELECTOR_DATA_TOGGLE_SHOWN = `${SELECTOR_DATA_TOGGLE$3}.${CLASS_NAME_SHOW$6}`;
    const SELECTOR_MENU = '.dropdown-menu';
    const SELECTOR_NAVBAR = '.navbar';
    const SELECTOR_NAVBAR_NAV = '.navbar-nav';
    const SELECTOR_VISIBLE_ITEMS = '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)';
    const PLACEMENT_TOP = isRTL() ? 'top-end' : 'top-start';
    const PLACEMENT_TOPEND = isRTL() ? 'top-start' : 'top-end';
    const PLACEMENT_BOTTOM = isRTL() ? 'bottom-end' : 'bottom-start';
    const PLACEMENT_BOTTOMEND = isRTL() ? 'bottom-start' : 'bottom-end';
    const PLACEMENT_RIGHT = isRTL() ? 'left-start' : 'right-start';
    const PLACEMENT_LEFT = isRTL() ? 'right-start' : 'left-start';
    const PLACEMENT_TOPCENTER = 'top';
    const PLACEMENT_BOTTOMCENTER = 'bottom';
    const Default$9 = {
        autoClose: true,
        boundary: 'clippingParents',
        display: 'dynamic',
        offset: [0, 2],
        popperConfig: null,
        reference: 'toggle'
    };
    const DefaultType$9 = {
        autoClose: '(boolean|string)',
        boundary: '(string|element)',
        display: 'string',
        offset: '(array|string|function)',
        popperConfig: '(null|object|function)',
        reference: '(string|element|object)'
    };

    /**
     * Class definition
     */

    class Dropdown extends BaseComponent {
        constructor(element, config) {
            super(element, config);
            this._popper = null;
            this._parent = this._element.parentNode; // dropdown wrapper
            // TODO: v6 revert #37011 & change markup https://getbootstrap.com/docs/5.3/forms/input-group/
            this._menu = SelectorEngine.next(this._element, SELECTOR_MENU)[0] || SelectorEngine.prev(this._element, SELECTOR_MENU)[0] || SelectorEngine.findOne(SELECTOR_MENU, this._parent);
            this._inNavbar = this._detectNavbar();
        }

        // Getters
        static get Default() {
            return Default$9;
        }
        static get DefaultType() {
            return DefaultType$9;
        }
        static get NAME() {
            return NAME$a;
        }

        // Public
        toggle() {
            return this._isShown() ? this.hide() : this.show();
        }
        show() {
            if (isDisabled(this._element) || this._isShown()) {
                return;
            }
            const relatedTarget = {
                relatedTarget: this._element
            };
            const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$5, relatedTarget);
            if (showEvent.defaultPrevented) {
                return;
            }
            this._createPopper();

            // If this is a touch-enabled device we add extra
            // empty mouseover listeners to the body's immediate children;
            // only needed because of broken event delegation on iOS
            // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
            if ('ontouchstart' in document.documentElement && !this._parent.closest(SELECTOR_NAVBAR_NAV)) {
                for (const element of [].concat(...document.body.children)) {
                    EventHandler.on(element, 'mouseover', noop);
                }
            }
            this._element.focus();
            this._element.setAttribute('aria-expanded', true);
            this._menu.classList.add(CLASS_NAME_SHOW$6);
            this._element.classList.add(CLASS_NAME_SHOW$6);
            EventHandler.trigger(this._element, EVENT_SHOWN$5, relatedTarget);
        }
        hide() {
            if (isDisabled(this._element) || !this._isShown()) {
                return;
            }
            const relatedTarget = {
                relatedTarget: this._element
            };
            this._completeHide(relatedTarget);
        }
        dispose() {
            if (this._popper) {
                this._popper.destroy();
            }
            super.dispose();
        }
        update() {
            this._inNavbar = this._detectNavbar();
            if (this._popper) {
                this._popper.update();
            }
        }

        // Private
        _completeHide(relatedTarget) {
            const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$5, relatedTarget);
            if (hideEvent.defaultPrevented) {
                return;
            }

            // If this is a touch-enabled device we remove the extra
            // empty mouseover listeners we added for iOS support
            if ('ontouchstart' in document.documentElement) {
                for (const element of [].concat(...document.body.children)) {
                    EventHandler.off(element, 'mouseover', noop);
                }
            }
            if (this._popper) {
                this._popper.destroy();
            }
            this._menu.classList.remove(CLASS_NAME_SHOW$6);
            this._element.classList.remove(CLASS_NAME_SHOW$6);
            this._element.setAttribute('aria-expanded', 'false');
            Manipulator.removeDataAttribute(this._menu, 'popper');
            EventHandler.trigger(this._element, EVENT_HIDDEN$5, relatedTarget);
        }
        _getConfig(config) {
            config = super._getConfig(config);
            if (typeof config.reference === 'object' && !isElement(config.reference) && typeof config.reference.getBoundingClientRect !== 'function') {
                // Popper virtual elements require a getBoundingClientRect method
                throw new TypeError(`${NAME$a.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
            }
            return config;
        }
        _createPopper() {
            if (typeof Popper__namespace === 'undefined') {
                throw new TypeError('Bootstrap\'s dropdowns require Popper (https://popper.js.org)');
            }
            let referenceElement = this._element;
            if (this._config.reference === 'parent') {
                referenceElement = this._parent;
            } else if (isElement(this._config.reference)) {
                referenceElement = getElement(this._config.reference);
            } else if (typeof this._config.reference === 'object') {
                referenceElement = this._config.reference;
            }
            const popperConfig = this._getPopperConfig();
            //this._popper = Popper__namespace.createPopper(referenceElement, this._menu, popperConfig);
        }
        _isShown() {
            return this._menu.classList.contains(CLASS_NAME_SHOW$6);
        }
        _getPlacement() {
            const parentDropdown = this._parent;
            if (parentDropdown.classList.contains(CLASS_NAME_DROPEND)) {
                return PLACEMENT_RIGHT;
            }
            if (parentDropdown.classList.contains(CLASS_NAME_DROPSTART)) {
                return PLACEMENT_LEFT;
            }
            if (parentDropdown.classList.contains(CLASS_NAME_DROPUP_CENTER)) {
                return PLACEMENT_TOPCENTER;
            }
            if (parentDropdown.classList.contains(CLASS_NAME_DROPDOWN_CENTER)) {
                return PLACEMENT_BOTTOMCENTER;
            }

            // We need to trim the value because custom properties can also include spaces
            const isEnd = getComputedStyle(this._menu).getPropertyValue('--bs-position').trim() === 'end';
            if (parentDropdown.classList.contains(CLASS_NAME_DROPUP)) {
                return isEnd ? PLACEMENT_TOPEND : PLACEMENT_TOP;
            }
            return isEnd ? PLACEMENT_BOTTOMEND : PLACEMENT_BOTTOM;
        }
        _detectNavbar() {
            return this._element.closest(SELECTOR_NAVBAR) !== null;
        }
        _getOffset() {
            const {
                offset
            } = this._config;
            if (typeof offset === 'string') {
                return offset.split(',').map(value => Number.parseInt(value, 10));
            }
            if (typeof offset === 'function') {
                return popperData => offset(popperData, this._element);
            }
            return offset;
        }
        _getPopperConfig() {
            const defaultBsPopperConfig = {
                placement: this._getPlacement(),
                modifiers: [{
                    name: 'preventOverflow',
                    options: {
                        boundary: this._config.boundary
                    }
                }, {
                    name: 'offset',
                    options: {
                        offset: this._getOffset()
                    }
                }]
            };

            // Disable Popper if we have a static display or Dropdown is in Navbar
            if (this._inNavbar || this._config.display === 'static') {
                Manipulator.setDataAttribute(this._menu, 'popper', 'static'); // TODO: v6 remove
                defaultBsPopperConfig.modifiers = [{
                    name: 'applyStyles',
                    enabled: false
                }];
            }
            return {
                ...defaultBsPopperConfig,
                ...execute(this._config.popperConfig, [defaultBsPopperConfig])
            };
        }
        _selectMenuItem({
            key,
            target
        }) {
            const items = SelectorEngine.find(SELECTOR_VISIBLE_ITEMS, this._menu).filter(element => isVisible(element));
            if (!items.length) {
                return;
            }

            // if target isn't included in items (e.g. when expanding the dropdown)
            // allow cycling to get the last item in case key equals ARROW_UP_KEY
            getNextActiveElement(items, target, key === ARROW_DOWN_KEY$1, !items.includes(target)).focus();
        }

        // Static
        static jQueryInterface(config) {
            return this.each(function () {
                const data = Dropdown.getOrCreateInstance(this, config);
                if (typeof config !== 'string') {
                    return;
                }
                if (typeof data[config] === 'undefined') {
                    throw new TypeError(`No method named "${config}"`);
                }
                data[config]();
            });
        }
        static clearMenus(event) {
            if (event.button === RIGHT_MOUSE_BUTTON || event.type === 'keyup' && event.key !== TAB_KEY$1) {
                return;
            }
            const openToggles = SelectorEngine.find(SELECTOR_DATA_TOGGLE_SHOWN);
            for (const toggle of openToggles) {
                const context = Dropdown.getInstance(toggle);
                if (!context || context._config.autoClose === false) {
                    continue;
                }
                const composedPath = event.composedPath();
                const isMenuTarget = composedPath.includes(context._menu);
                if (composedPath.includes(context._element) || context._config.autoClose === 'inside' && !isMenuTarget || context._config.autoClose === 'outside' && isMenuTarget) {
                    continue;
                }

                // Tab navigation through the dropdown menu or events from contained inputs shouldn't close the menu
                if (context._menu.contains(event.target) && (event.type === 'keyup' && event.key === TAB_KEY$1 || /input|select|option|textarea|form/i.test(event.target.tagName))) {
                    continue;
                }
                const relatedTarget = {
                    relatedTarget: context._element
                };
                if (event.type === 'click') {
                    relatedTarget.clickEvent = event;
                }
                context._completeHide(relatedTarget);
            }
        }
        static dataApiKeydownHandler(event) {
            // If not an UP | DOWN | ESCAPE key => not a dropdown command
            // If input/textarea && if key is other than ESCAPE => not a dropdown command

            const isInput = /input|textarea/i.test(event.target.tagName);
            const isEscapeEvent = event.key === ESCAPE_KEY$2;
            const isUpOrDownEvent = [ARROW_UP_KEY$1, ARROW_DOWN_KEY$1].includes(event.key);
            if (!isUpOrDownEvent && !isEscapeEvent) {
                return;
            }
            if (isInput && !isEscapeEvent) {
                return;
            }
            event.preventDefault();

            // TODO: v6 revert #37011 & change markup https://getbootstrap.com/docs/5.3/forms/input-group/
            const getToggleButton = this.matches(SELECTOR_DATA_TOGGLE$3) ? this : SelectorEngine.prev(this, SELECTOR_DATA_TOGGLE$3)[0] || SelectorEngine.next(this, SELECTOR_DATA_TOGGLE$3)[0] || SelectorEngine.findOne(SELECTOR_DATA_TOGGLE$3, event.delegateTarget.parentNode);
            const instance = Dropdown.getOrCreateInstance(getToggleButton);
            if (isUpOrDownEvent) {
                event.stopPropagation();
                instance.show();
                instance._selectMenuItem(event);
                return;
            }
            if (instance._isShown()) {
                // else is escape and we check if it is shown
                event.stopPropagation();
                instance.hide();
                getToggleButton.focus();
            }
        }
    }

    /**
     * Data API implementation
     */

    EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE$3, Dropdown.dataApiKeydownHandler);
    EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown.dataApiKeydownHandler);
    EventHandler.on(document, EVENT_CLICK_DATA_API$3, Dropdown.clearMenus);
    EventHandler.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus);
    EventHandler.on(document, EVENT_CLICK_DATA_API$3, SELECTOR_DATA_TOGGLE$3, function (event) {
        event.preventDefault();
        Dropdown.getOrCreateInstance(this).toggle();
    });

    /**
     * jQuery
     */

    defineJQueryPlugin(Dropdown);

    

}));
//# sourceMappingURL=bootstrap.js.map
