webpackJsonpCoveo__temporary([59],{

/***/ 103:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var _ = __webpack_require__(0);
__webpack_require__(405);
var GlobalExports_1 = __webpack_require__(3);
/**
 * A simple `fieldset` HTMLElement containing multiple form widgets.
 */
var FormGroup = /** @class */ (function () {
    /**
     * Creates a new `FormGroup`.
     * @param contents The form widgets to include in the form group.
     * @param label The label to display for the form group.
     */
    function FormGroup(contents, label) {
        var _this = this;
        this.labelElement = Dom_1.$$('span', { className: 'coveo-form-group-label' });
        this.labelElement.text(label);
        this.element = Dom_1.$$('fieldset', { className: 'coveo-form-group' }, this.labelElement);
        _.each(contents, function (content) {
            _this.element.append(content.build());
        });
    }
    FormGroup.doExport = function () {
        GlobalExports_1.exportGlobally({
            FormGroup: FormGroup
        });
    };
    /**
     * Gets the element on which the form group is bound.
     * @returns {HTMLElement} The form group element.
     */
    FormGroup.prototype.build = function () {
        return this.element.el;
    };
    return FormGroup;
}());
exports.FormGroup = FormGroup;


/***/ }),

/***/ 405:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=FormGroup__5d8084491af1464dbdb6.js.map