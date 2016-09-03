"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var forms_2 = require('@angular/forms');
var browser_adapter_1 = require('@angular/platform-browser/src/browser/browser_adapter');
var platform_browser_1 = require('@angular/platform-browser');
var Polymer = window.Polymer;
var PolymerDomAdapter = (function (_super) {
    __extends(PolymerDomAdapter, _super);
    function PolymerDomAdapter() {
        _super.apply(this, arguments);
    }
    PolymerDomAdapter.prototype.createStyleElement = function (css, doc) {
        if (doc === void 0) { doc = document; }
        var style = doc.createElement.call(doc, 'style', 'custom-style');
        this.appendChild(style, this.createTextNode(css));
        return style;
    };
    return PolymerDomAdapter;
}(browser_adapter_1.BrowserDomAdapter));
var PolymerShadyDomAdapter = (function (_super) {
    __extends(PolymerShadyDomAdapter, _super);
    function PolymerShadyDomAdapter() {
        _super.apply(this, arguments);
    }
    PolymerShadyDomAdapter.prototype.parentElement = function (el) { return Polymer.dom(el).parentNode; };
    PolymerShadyDomAdapter.prototype.appendChild = function (el, node) { Polymer.dom(el).appendChild(node); };
    PolymerShadyDomAdapter.prototype.insertBefore = function (el, node) { Polymer.dom(this.parentElement(el)).insertBefore(node, el); };
    PolymerShadyDomAdapter.prototype.insertAllBefore = function (el, nodes) { var elParentDom = Polymer.dom(this.parentElement(el)); nodes.forEach(function (n) { return elParentDom.insertBefore(n, el); }); };
    PolymerShadyDomAdapter.prototype.insertAfter = function (el, node) { this.insertBefore(this.nextSibling(el), node); };
    PolymerShadyDomAdapter.prototype.removeChild = function (el, node) { Polymer.dom(el).removeChild(node); };
    PolymerShadyDomAdapter.prototype.childNodes = function (el) { return Polymer.dom(el).childNodes; };
    PolymerShadyDomAdapter.prototype.remove = function (node) { if (this.parentElement(node)) {
        this.removeChild(this.parentElement(node), node);
    } return node; };
    PolymerShadyDomAdapter.prototype.clearNodes = function (el) { while (Polymer.dom(el).firstChild) {
        Polymer.dom(el).removeChild(Polymer.dom(el).firstChild);
    } };
    PolymerShadyDomAdapter.prototype.firstChild = function (el) { return Polymer.dom(el).firstChild; };
    PolymerShadyDomAdapter.prototype.lastChild = function (el) { return Polymer.dom(el).lastChild; };
    PolymerShadyDomAdapter.prototype.previousSibling = function (el) { return Polymer.dom(el).previousSibling; };
    PolymerShadyDomAdapter.prototype.nextSibling = function (el) { return Polymer.dom(el).nextSibling; };
    PolymerShadyDomAdapter.prototype.getInnerHTML = function (el) { return Polymer.dom(el).innerHTML; };
    PolymerShadyDomAdapter.prototype.setInnerHTML = function (el, value) { Polymer.dom(el).innerHTML = value; };
    PolymerShadyDomAdapter.prototype.querySelector = function (el, selector) { return Polymer.dom(el).querySelector(selector); };
    PolymerShadyDomAdapter.prototype.querySelectorAll = function (el, selector) { return Polymer.dom(el).querySelectorAll(selector); };
    PolymerShadyDomAdapter.prototype.getDistributedNodes = function (el) { return Polymer.dom(el).getDistributedNodes(); };
    PolymerShadyDomAdapter.prototype.classList = function (el) { return Polymer.dom(el).classList; };
    PolymerShadyDomAdapter.prototype.addClass = function (el, className) { this.classList(el).add(className); };
    PolymerShadyDomAdapter.prototype.removeClass = function (el, className) { this.classList(el).remove(className); };
    PolymerShadyDomAdapter.prototype.hasClass = function (el, className) { return this.classList(el).contains(className); };
    PolymerShadyDomAdapter.prototype.setAttribute = function (el, name, value) { Polymer.dom(el).setAttribute(name, value); };
    PolymerShadyDomAdapter.prototype.removeAttribute = function (el, name) { Polymer.dom(el).removeAttribute(name); };
    return PolymerShadyDomAdapter;
}(PolymerDomAdapter));
if (Polymer.Settings.useShadow) {
    platform_browser_1.__platform_browser_private__.setRootDomAdapter(new PolymerDomAdapter());
}
else {
    platform_browser_1.__platform_browser_private__.setRootDomAdapter(new PolymerShadyDomAdapter());
}
function PolymerElement(name) {
    var propertiesWithNotify = [];
    var arrayAndObjectProperties = [];
    var proto = Object.getPrototypeOf(document.createElement(name));
    if (proto.is !== name) {
        throw new Error("The Polymer element \"" + name + "\" has not been registered. Please check that the element is imported correctly.");
    }
    var isFormElement = Polymer && Polymer.IronFormElementBehavior && proto.behaviors.indexOf(Polymer.IronFormElementBehavior) > -1;
    var isCheckedElement = Polymer && Polymer.IronCheckedElementBehaviorImpl && proto.behaviors.indexOf(Polymer.IronCheckedElementBehaviorImpl) > -1;
    proto.behaviors.forEach(function (behavior) { return configureProperties(behavior.properties); });
    configureProperties(proto.properties);
    function configureProperties(properties) {
        if (properties) {
            Object.getOwnPropertyNames(properties)
                .filter(function (name) { return name.indexOf('_') !== 0; })
                .forEach(function (name) { return configureProperty(name, properties); });
        }
    }
    function configureProperty(name, properties) {
        var info = properties[name];
        if (typeof info === 'function') {
            info = {
                type: info
            };
        }
        if (info.type && !info.readOnly && (info.type === Object || info.type === Array)) {
            arrayAndObjectProperties.push(name);
        }
        if (info && info.notify) {
            propertiesWithNotify.push(name);
        }
    }
    var eventNameForProperty = function (property) { return (property + "Change"); };
    var changeEventsAdapterDirective = core_1.Directive({
        selector: name,
        outputs: propertiesWithNotify.map(eventNameForProperty),
        host: propertiesWithNotify.reduce(function (hostBindings, property) {
            hostBindings[("(" + Polymer.CaseMap.camelToDashCase(property) + "-changed)")] = "_emitChangeEvent('" + property + "', $event);";
            return hostBindings;
        }, {})
    }).Class({
        constructor: function () {
            var _this = this;
            propertiesWithNotify
                .forEach(function (property) { return _this[eventNameForProperty(property)] = new core_1.EventEmitter(false); });
        },
        _emitChangeEvent: function (property, event) {
            // Event is a notification for a sub-property when `path` exists and the
            // event.detail.value holds a value for a sub-property.
            // For sub-property changes we don't need to explicitly emit events,
            // since all interested parties are bound to the same object and Angular
            // takes care of updating sub-property bindings on changes.
            if (!event.detail.path) {
                this[eventNameForProperty(property)].emit(event.detail.value);
            }
        }
    });
    var validationDirective = core_1.Directive({
        selector: name
    }).Class({
        constructor: [core_1.ElementRef, core_1.Injector, function (el, injector) {
                this._element = el.nativeElement;
                this._injector = injector;
            }],
        ngDoCheck: function () {
            var oldControl = this._injector.get(forms_1.NgControl, null);
            var control = this._injector.get(forms_2.FormControlName, null);
            if (oldControl && oldControl.pristine !== null && oldControl.valid !== null) {
                this._element.invalid = !oldControl.pristine && !oldControl.valid;
            }
            if (control) {
                this._element.invalid = !control.pristine && !control.valid;
            }
        }
    });
    var formElementDirective = core_1.Directive({
        selector: name,
        providers: [{
                provide: forms_1.NG_VALUE_ACCESSOR,
                useExisting: core_1.forwardRef(function () { return formElementDirective; }),
                multi: true
            }, {
                provide: forms_2.NG_VALUE_ACCESSOR,
                useExisting: core_1.forwardRef(function () { return formElementDirective; }),
                multi: true
            }
        ],
        host: (isCheckedElement ? { '(checkedChange)': 'onValueChanged($event)' } : { '(valueChange)': 'onValueChanged($event)' })
    }).Class({
        constructor: [core_1.Renderer, core_1.ElementRef, function (renderer, el) {
                var _this = this;
                this._renderer = renderer;
                this._element = el.nativeElement;
                this._element.addEventListener('blur', function () { return _this.onTouched(); }, true);
            }],
        onChange: function (_) { },
        onTouched: function () { },
        writeValue: function (value) {
            this._renderer.setElementProperty(this._element, (isCheckedElement ? 'checked' : 'value'), value);
        },
        registerOnChange: function (fn) { this.onChange = fn; },
        registerOnTouched: function (fn) { this.onTouched = fn; },
        onValueChanged: function (value) {
            this.onChange(value);
        }
    });
    var notifyForDiffersDirective = core_1.Directive({
        selector: name,
        inputs: arrayAndObjectProperties,
        host: arrayAndObjectProperties.reduce(function (hostBindings, property) {
            hostBindings[("(" + Polymer.CaseMap.camelToDashCase(property) + "-changed)")] = "_setValueFromElement('" + property + "', $event);";
            return hostBindings;
        }, {})
    }).Class({
        constructor: [core_1.ElementRef, core_1.IterableDiffers, core_1.KeyValueDiffers, function (el, iterableDiffers, keyValueDiffers) {
                this._element = el.nativeElement;
                this._iterableDiffers = iterableDiffers;
                this._keyValueDiffers = keyValueDiffers;
                this._differs = {};
                this._arrayDiffs = {};
            }],
        ngOnInit: function () {
            var _this = this;
            var elm = this._element;
            // In case the element has a default value and the directive doesn't have any value set for a property,
            // we need to make sure the element value is set to the directive.
            arrayAndObjectProperties.filter(function (property) { return elm[property] && !_this[property]; })
                .forEach(function (property) {
                _this[property] = elm[property];
            });
        },
        _setValueFromElement: function (property, event) {
            // Properties in this directive need to be kept synced manually with the element properties.
            // Don't use event.detail.value here because it might contain changes for a sub-property.
            var target = event.target;
            if (this[property] !== target[property]) {
                this[property] = target[property];
                this._differs[property] = this._createDiffer(this[property]);
            }
        },
        _createDiffer: function (value) {
            var differ = Array.isArray(value) ? this._iterableDiffers.find(value).create(null) : this._keyValueDiffers.find(value || {}).create(null);
            // initial diff with the current value to make sure the differ is synced
            // and doesn't report any outdated changes on the next ngDoCheck call.
            differ.diff(value);
            return differ;
        },
        _handleArrayDiffs: function (property, diff) {
            var _this = this;
            if (diff) {
                diff.forEachRemovedItem(function (item) { return _this._notifyArray(property, item.previousIndex); });
                diff.forEachAddedItem(function (item) { return _this._notifyArray(property, item.currentIndex); });
                diff.forEachMovedItem(function (item) { return _this._notifyArray(property, item.currentIndex); });
            }
        },
        _handleObjectDiffs: function (property, diff) {
            var _this = this;
            if (diff) {
                var notify = function (item) { return _this._notifyPath(property + '.' + item.key, item.currentValue); };
                diff.forEachRemovedItem(notify);
                diff.forEachAddedItem(notify);
                diff.forEachChangedItem(notify);
            }
        },
        _notifyArray: function (property, index) {
            this._notifyPath(property + '.' + index, this[property][index]);
        },
        _notifyPath: function (path, value) {
            this._element.notifyPath(path, value);
        },
        ngDoCheck: function () {
            var _this = this;
            arrayAndObjectProperties.forEach(function (property) {
                var elm = _this._element;
                var _differs = _this._differs;
                if (elm[property] !== _this[property]) {
                    elm[property] = _this[property];
                    _differs[property] = _this._createDiffer(_this[property]);
                }
                else if (_differs[property]) {
                    // TODO: these differs won't pickup any changes in need properties like items[0].foo
                    var diff = _differs[property].diff(_this[property]);
                    if (diff instanceof core_1.DefaultIterableDiffer) {
                        _this._handleArrayDiffs(property, diff);
                    }
                    else {
                        _this._handleObjectDiffs(property, diff);
                    }
                }
            });
        }
    });
    var reloadConfigurationDirective = core_1.Directive({
        selector: name
    }).Class({
        constructor: [core_1.ElementRef, core_1.NgZone, function (el, zone) {
                if (!Polymer.Settings.useShadow) {
                    el.nativeElement.async(function () {
                        if (el.nativeElement.isInitialized()) {
                            // Reload outside of Angular to prevent unnecessary ngDoCheck calls
                            zone.runOutsideAngular(function () {
                                el.nativeElement.reloadConfiguration();
                            });
                        }
                    });
                }
            }],
    });
    var directives = [changeEventsAdapterDirective, notifyForDiffersDirective];
    if (isFormElement) {
        directives.push(formElementDirective);
        directives.push(validationDirective);
    }
    // If the element has isInitialized and reloadConfiguration methods (e.g., Charts)
    if (typeof proto.isInitialized === 'function' &&
        typeof proto.reloadConfiguration === 'function') {
        directives.push(reloadConfigurationDirective);
    }
    return directives;
}
exports.PolymerElement = PolymerElement;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seW1lci1lbGVtZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicG9seW1lci1lbGVtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHFCQVlPLGVBQWUsQ0FBQyxDQUFBO0FBQ3ZCLHNCQUFzRixnQkFBZ0IsQ0FBQyxDQUFBO0FBQ3ZHLHNCQUFtRCxnQkFBZ0IsQ0FBQyxDQUFBO0FBRXBFLGdDQUFrQyx1REFBdUQsQ0FBQyxDQUFBO0FBQzFGLGlDQUE2QywyQkFBMkIsQ0FBQyxDQUFBO0FBRXpFLElBQU0sT0FBTyxHQUFhLE1BQU8sQ0FBQyxPQUFPLENBQUM7QUFFMUM7SUFBZ0MscUNBQWlCO0lBQWpEO1FBQWdDLDhCQUFpQjtJQU1qRCxDQUFDO0lBTEMsOENBQWtCLEdBQWxCLFVBQW1CLEdBQU8sRUFBRSxHQUF1QjtRQUF2QixtQkFBdUIsR0FBdkIsY0FBdUI7UUFDakQsSUFBSSxLQUFLLEdBQU8sR0FBRyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQztRQUNyRSxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDbEQsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNmLENBQUM7SUFDSCx3QkFBQztBQUFELENBQUMsQUFORCxDQUFnQyxtQ0FBaUIsR0FNaEQ7QUFFRDtJQUFxQywwQ0FBaUI7SUFBdEQ7UUFBcUMsOEJBQWlCO0lBZ0N0RCxDQUFDO0lBL0JDLDhDQUFhLEdBQWIsVUFBYyxFQUFFLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUV4RCw0Q0FBVyxHQUFYLFVBQVksRUFBRSxFQUFFLElBQUksSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJ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