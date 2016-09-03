"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var testing_1 = require('@angular/core/testing');
var polymer_element_1 = require('./polymer-element');
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var forms_1 = require('@angular/forms');
var platform_browser_1 = require('@angular/platform-browser');
var Polymer = window.Polymer;
describe('PolymerElement', function () {
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                forms_1.ReactiveFormsModule
            ],
            declarations: [
                TestComponent,
                TestComponentForm,
                TestComponentCheckboxForm,
                TestComponentDeprecatedForm,
                TestComponentLightDom,
                TestComponentDomApi,
                polymer_element_1.PolymerElement('test-element'),
                polymer_element_1.PolymerElement('paper-checkbox')
            ],
            schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA]
        });
        testing_1.TestBed.compileComponents();
    }));
    var testElement;
    var testComponent;
    var fixture;
    function createTestComponent(type) {
        fixture = testing_1.TestBed.createComponent(type);
        testElement = fixture.debugElement.query(function (el) { return el.name == 'test-element'; }).nativeElement;
        testComponent = fixture.componentInstance;
    }
    it('is defined', function () {
        expect(polymer_element_1.PolymerElement).toBeDefined();
    });
    it('is function', function () {
        expect(typeof polymer_element_1.PolymerElement).toBe('function');
    });
    describe('Developer experience', function () {
        it('should throw an error for non-registered elements', function () {
            try {
                polymer_element_1.PolymerElement('non-registered');
            }
            catch (error) {
                expect(error.message).toContain('element "non-registered" has not been registered');
            }
        });
    });
    describe('Two-way data binding', function () {
        beforeEach(function () { createTestComponent(TestComponent); });
        it('should have initial bound value', function () {
            fixture.detectChanges();
            expect(testElement.value).toEqual('foo');
        });
        it('should change value on bound value change', function () {
            testComponent.value = 'bar';
            fixture.detectChanges();
            expect(testElement.value).toEqual('bar');
        });
        it('should change bound value on value change', function () {
            testElement.value = 'bar';
            expect(testComponent.value).toEqual('bar');
        });
        it('should reflect change to a nested value (object)', function () {
            testComponent.nestedObject.value = 'foo';
            fixture.detectChanges();
            var nested = Polymer.dom(testElement.root).querySelector('#nested');
            expect(nested.getAttribute('nested-object-value')).toEqual('foo');
        });
        it('should reflect change to a nested value (array)', function () {
            testComponent.arrayObject.push('foo');
            fixture.detectChanges();
            var nested = Polymer.dom(testElement.root).querySelector('#nested');
            expect(nested.getAttribute('array-object-value')).toEqual('foo');
        });
    });
    describe('Form field', function () {
        var form;
        function formTests() {
            describe('Initial state', function () {
                it('should be initially pristine', function () {
                    expect(testElement.classList.contains('ng-pristine')).toEqual(true);
                });
                it('should be initially untouched', function () {
                    expect(testElement.classList.contains('ng-untouched')).toEqual(true);
                });
                it('should be invalid', function () {
                    expect(testElement.classList.contains('ng-invalid')).toEqual(true);
                });
                it('should be an invalid form', function () {
                    expect(form.valid).toEqual(false);
                });
                it('should not reflect invalid state to element initially', function () {
                    expect(testElement.invalid).toBeFalsy();
                });
            });
            describe('after value has changed', function () {
                beforeEach(function () {
                    testElement.value = 'qux';
                    fixture.detectChanges();
                });
                it('should be dirty on value change', function () {
                    expect(testElement.classList.contains('ng-dirty')).toEqual(true);
                });
                it('should be a valid form', function () {
                    expect(form.valid).toEqual(true);
                });
                it('should have correct value', function () {
                    expect(form.value.value).toEqual('qux');
                });
                it('should be valid', function () {
                    expect(testElement.classList.contains('ng-valid')).toEqual(true);
                });
                it('should reflect invalid state to testElement when value changed', function () {
                    testElement.value = '';
                    fixture.detectChanges();
                    expect(testElement.invalid).toEqual(true);
                });
            });
        }
        describe('Deprecated forms API', function () {
            beforeEach(function () {
                createTestComponent(TestComponentDeprecatedForm);
                form = new common_1.ControlGroup({ value: new common_1.Control() });
                fixture.debugElement.componentInstance.form = form;
                fixture.detectChanges();
            });
            formTests();
        });
        describe('New forms API', function () {
            beforeEach(function () {
                createTestComponent(TestComponentForm);
                form = new forms_1.FormGroup({ value: new forms_1.FormControl() });
                fixture.debugElement.componentInstance.form = form;
                fixture.detectChanges();
            });
            formTests();
        });
    });
    describe('Checked Element inside Form', function () {
        var form;
        var checkedElement;
        describe('initially false', function () {
            beforeEach(function () {
                createTestComponent(TestComponentCheckboxForm);
                form = new forms_1.FormGroup({ value: new forms_1.FormControl(false) });
                fixture.debugElement.componentInstance.form = form;
                fixture.detectChanges();
                checkedElement = fixture.debugElement.query(function (el) { return el.name == 'paper-checkbox'; }).nativeElement;
            });
            it('should set default value', function () {
                expect(checkedElement.checked).toEqual(false);
            });
            it('should set form value', function () {
                checkedElement.checked = true;
                expect(form.value.value).toEqual(true);
            });
        });
        describe('initially true', function () {
            beforeEach(function () {
                createTestComponent(TestComponentCheckboxForm);
                form = new forms_1.FormGroup({ value: new forms_1.FormControl(true) });
                fixture.debugElement.componentInstance.form = form;
                fixture.detectChanges();
                checkedElement = fixture.debugElement.query(function (el) { return el.name == 'paper-checkbox'; }).nativeElement;
            });
            it('should set default value', function () {
                expect(checkedElement.checked).toEqual(true);
            });
            it('should set form value', function () {
                checkedElement.checked = false;
                expect(form.value.value).toEqual(false);
            });
        });
    });
    describe('Light dom content', function () {
        beforeEach(function (done) {
            createTestComponent(TestComponentLightDom);
            setTimeout(done, 0);
        });
        function contentParentChildren(contentParentId) {
            var selected = testElement.$[contentParentId];
            return Polymer.dom(selected).getDistributedNodes();
        }
        function containsChild(contentParentId, childClassName) {
            var children = contentParentChildren(contentParentId);
            return Array.prototype.filter.call(children, function (node) {
                return node.classList && node.classList.contains(childClassName);
            }).length > 0;
        }
        it('should distribute correctly', function () {
            // Local dom
            expect(containsChild('selected', 'foo')).toEqual(false);
            expect(containsChild('all', 'foo')).toEqual(true);
            expect(containsChild('selected', 'bar')).toEqual(false);
            expect(containsChild('all', 'bar')).toEqual(false);
            expect(containsChild('selected', 'baz')).toEqual(true);
            var hasQux = Array.prototype.filter.call(contentParentChildren('all'), function (node) {
                return node.textContent.indexOf('Qux') !== -1;
            });
            expect(hasQux.length).toEqual(1);
            // Light dom
            expect(Polymer.dom(testElement).querySelector('.foo')).not.toEqual(null);
        });
        it('should support ngif', function (done) {
            testComponent.barVisible = true;
            fixture.detectChanges();
            // Distribution with polyfills is done with MutationObservers, so it is asynchronous
            setTimeout(function () {
                expect(containsChild('selected', 'bar')).toEqual(true);
                expect(containsChild('all', 'bar2')).toEqual(true);
                done();
            }, 0);
        });
    });
    describe('DOM API', function () {
        beforeEach(function () { createTestComponent(TestComponentDomApi); });
        it('should trigger one mutation after multiple operations', function (done) {
            var observerSpy = jasmine.createSpy('observerSpy');
            var domApi = Polymer.dom(testElement).observeNodes(observerSpy);
            testComponent.arrayObject = [1, 2, 3];
            fixture.detectChanges();
            testComponent.arrayObject.push(4);
            fixture.detectChanges();
            testComponent.arrayObject.pop();
            fixture.detectChanges();
            testComponent.arrayObject = [0, 1, 2];
            fixture.detectChanges();
            testComponent.barVisible = true;
            fixture.detectChanges();
            testComponent.barVisible = false;
            fixture.detectChanges();
            setTimeout(function () {
                expect(observerSpy).toHaveBeenCalledTimes(1);
                done();
            }, 0);
        });
        it('should have the correct adapter', function () {
            var functionName = function (fun) {
                var ret = fun.toString();
                ret = ret.substr('function '.length);
                ret = ret.substr(0, ret.indexOf('('));
                return ret;
            };
            var dom = platform_browser_1.__platform_browser_private__.getDOM();
            var adapterName = functionName(dom.constructor);
            if (Polymer.Settings.useShadow) {
                expect(adapterName).toEqual("PolymerDomAdapter");
            }
            else {
                expect(adapterName).toEqual("PolymerShadyDomAdapter");
            }
        });
    });
});
var TestComponent = (function () {
    function TestComponent() {
        this.value = 'foo';
        this.nestedObject = { value: undefined };
        this.arrayObject = [];
        this.barVisible = false;
    }
    TestComponent = __decorate([
        core_1.Component({
            template: "<test-element [(value)]=\"value\" [(nestedObject)]=\"nestedObject\" [(arrayObject)]=\"arrayObject\"></test-element>"
        }), 
        __metadata('design:paramtypes', [])
    ], TestComponent);
    return TestComponent;
}());
var TestComponentDeprecatedForm = (function () {
    function TestComponentDeprecatedForm() {
        this.value = 'foo';
    }
    TestComponentDeprecatedForm = __decorate([
        core_1.Component({
            directives: [common_1.FORM_DIRECTIVES],
            template: "\n    <form [ngFormModel]=\"form\">\n      <test-element ngControl=\"value\" required></test-element>\n    </form>"
        }), 
        __metadata('design:paramtypes', [])
    ], TestComponentDeprecatedForm);
    return TestComponentDeprecatedForm;
}());
var TestComponentForm = (function () {
    function TestComponentForm() {
        this.value = 'foo';
    }
    TestComponentForm = __decorate([
        core_1.Component({
            template: "\n    <form [formGroup]=\"form\">\n      <test-element formControlName=\"value\" required></test-element>\n    </form>"
        }), 
        __metadata('design:paramtypes', [])
    ], TestComponentForm);
    return TestComponentForm;
}());
var TestComponentCheckboxForm = (function () {
    function TestComponentCheckboxForm() {
    }
    TestComponentCheckboxForm = __decorate([
        core_1.Component({
            // test-element added to make the global test setup not crash.
            template: "\n    <form [formGroup]=\"form\">\n      <paper-checkbox formControlName=\"value\"></paper-checkbox>\n    </form>\n    <test-element></test-element>"
        }), 
        __metadata('design:paramtypes', [])
    ], TestComponentCheckboxForm);
    return TestComponentCheckboxForm;
}());
var TestComponentLightDom = (function () {
    function TestComponentLightDom() {
    }
    TestComponentLightDom = __decorate([
        core_1.Component({
            template: "\n    <test-element [(value)]=\"value\" class=\"hascontent\">\n      <div class=\"foo\">Foo</div>\n      <div class=\"bar selected\" *ngIf=\"barVisible\">Bar</div>\n      <div class=\"bar2\" *ngIf=\"barVisible\">Bar2</div>\n      <div class=\"baz selected\">Baz</div>\n      Qux\n    </test-element>"
        }), 
        __metadata('design:paramtypes', [])
    ], TestComponentLightDom);
    return TestComponentLightDom;
}());
var TestComponentDomApi = (function () {
    function TestComponentDomApi() {
    }
    TestComponentDomApi = __decorate([
        core_1.Component({
            template: "\n    <test-element [(value)]=\"value\" class=\"hascontent\">\n      <div class=\"foo\" *ngFor=\"let item of arrayObject\">Foo {{item}}</div>\n      <div class=\"bar selected\" *ngIf=\"barVisible\">Bar</div>\n      <div class=\"bar2\" *ngIf=\"barVisible\">Bar2</div>\n      <div class=\"baz selected\">Baz</div>\n    </test-element>"
        }), 
        __metadata('design:paramtypes', [])
    ], TestComponentDomApi);
    return TestComponentDomApi;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seW1lci1lbGVtZW50LnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwb2x5bWVyLWVsZW1lbnQuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsd0JBSU8sdUJBQXVCLENBQUMsQ0FBQTtBQUMvQixnQ0FBK0IsbUJBQW1CLENBQUMsQ0FBQTtBQUNuRCxxQkFBa0QsZUFBZSxDQUFDLENBQUE7QUFDbEUsdUJBQXVELGlCQUFpQixDQUFDLENBQUE7QUFDekUsc0JBQWtHLGdCQUFnQixDQUFDLENBQUE7QUFDbkgsaUNBQTZDLDJCQUEyQixDQUFDLENBQUE7QUFFekUsSUFBTSxPQUFPLEdBQWMsTUFBTyxDQUFDLE9BQU8sQ0FBQztBQUUzQyxRQUFRLENBQUMsZ0JBQWdCLEVBQUU7SUFFekIsVUFBVSxDQUFDLGVBQUssQ0FBQztRQUNmLGlCQUFPLENBQUMsc0JBQXNCLENBQUM7WUFDN0IsT0FBTyxFQUFFO2dCQUNQLDJCQUFtQjthQUNwQjtZQUNELFlBQVksRUFBRTtnQkFDWixhQUFhO2dCQUNiLGlCQUFpQjtnQkFDakIseUJBQXlCO2dCQUN6QiwyQkFBMkI7Z0JBQzNCLHFCQUFxQjtnQkFDckIsbUJBQW1CO2dCQUNuQixnQ0FBYyxDQUFDLGNBQWMsQ0FBQztnQkFDOUIsZ0NBQWMsQ0FBQyxnQkFBZ0IsQ0FBQzthQUNqQztZQUNELE9BQU8sRUFBRSxDQUFDLDZCQUFzQixDQUFDO1NBQ2xDLENBQUMsQ0FBQztRQUNILGlCQUFPLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUM5QixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRUosSUFBSSxXQUFnQixDQUFDO0lBQ3JCLElBQUksYUFBNEIsQ0FBQztJQUNqQyxJQUFJLE9BQThCLENBQUM7SUFFbkMsNkJBQTZCLElBQVM7UUFDcEMsT0FBTyxHQUFHLGlCQUFPLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hDLFdBQVcsR0FBRyxPQUFPLENBQUMsWUFBWSxD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