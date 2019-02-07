webpackJsonpCoveo__temporary([36],{

/***/ 14:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _ = __webpack_require__(0);
var SVGDom = /** @class */ (function () {
    function SVGDom() {
    }
    SVGDom.addClassToSVGInContainer = function (svgContainer, classToAdd) {
        var svgElement = svgContainer.querySelector('svg');
        svgElement.setAttribute('class', "" + SVGDom.getClass(svgElement) + classToAdd);
    };
    SVGDom.removeClassFromSVGInContainer = function (svgContainer, classToRemove) {
        var svgElement = svgContainer.querySelector('svg');
        svgElement.setAttribute('class', SVGDom.getClass(svgElement).replace(classToRemove, ''));
    };
    SVGDom.addStyleToSVGInContainer = function (svgContainer, styleToAdd) {
        var svgElement = svgContainer.querySelector('svg');
        _.each(styleToAdd, function (styleValue, styleKey) {
            svgElement.style[styleKey] = styleValue;
        });
    };
    SVGDom.getClass = function (svgElement) {
        var className = svgElement.getAttribute('class');
        return className ? className + ' ' : '';
    };
    return SVGDom;
}());
exports.SVGDom = SVGDom;


/***/ }),

/***/ 200:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Component_1 = __webpack_require__(6);
var ComponentOptions_1 = __webpack_require__(7);
var Dom_1 = __webpack_require__(2);
var Initialization_1 = __webpack_require__(1);
var Utils_1 = __webpack_require__(4);
var GlobalExports_1 = __webpack_require__(3);
var SVGIcons_1 = __webpack_require__(13);
var SVGDom_1 = __webpack_require__(14);
__webpack_require__(437);
var RatingValues;
(function (RatingValues) {
    RatingValues[RatingValues["Undefined"] = 0] = "Undefined";
    RatingValues[RatingValues["Lowest"] = 1] = "Lowest";
    RatingValues[RatingValues["Low"] = 2] = "Low";
    RatingValues[RatingValues["Average"] = 3] = "Average";
    RatingValues[RatingValues["Good"] = 4] = "Good";
    RatingValues[RatingValues["Best"] = 5] = "Best";
})(RatingValues = exports.RatingValues || (exports.RatingValues = {}));
/**
 * The `ResultRating` component renders a 5-star rating widget. Interactive rating is possible if
 * the [`enableCollaborativeRating`]{@link SearchInterface.options.enableCollaborativeRating} option of your
 * search interface is `true`, and if collaborative rating is enabled on your Coveo index.
 *
 * This component is a result template component (see [Result Templates](https://developers.coveo.com/x/aIGfAQ)).
 *
 * @notSupportedIn salesforcefree
 */
var ResultRating = /** @class */ (function (_super) {
    __extends(ResultRating, _super);
    /**
     * Creates a new `ResultRating` component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the `ResultRating` component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     * @param result The result to associate the component with.
     */
    function ResultRating(element, options, bindings, result) {
        var _this = _super.call(this, element, ResultRating.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.result = result;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, ResultRating, options);
        if (!Utils_1.Utils.isNullOrUndefined(result.rating)) {
            _this.renderComponent(element, result.rating);
        }
        return _this;
    }
    ResultRating.prototype.renderComponent = function (element, rating) {
        for (var starNumber = 1; starNumber <= 5; starNumber++) {
            this.renderStar(element, starNumber <= rating, starNumber);
        }
    };
    ResultRating.prototype.renderStar = function (element, isChecked, value) {
        var _this = this;
        var star;
        var starElement = Dom_1.$$(element).find('a[rating-value="' + value + '"]');
        if (starElement == null) {
            star = Dom_1.$$('a', { className: 'coveo-result-rating-star' }, SVGIcons_1.SVGIcons.icons.star);
            SVGDom_1.SVGDom.addClassToSVGInContainer(star.el, 'coveo-result-rating-star-svg');
            element.appendChild(star.el);
            if (this.bindings.searchInterface.options.enableCollaborativeRating) {
                star.on('click', function (e) {
                    var targetElement = e.currentTarget;
                    _this.rateDocument(parseInt(targetElement.getAttribute('rating-value')));
                });
                star.on('mouseover', function (e) {
                    var targetElement = e.currentTarget;
                    _this.renderComponent(element, parseInt(targetElement.getAttribute('rating-value')));
                });
                star.on('mouseout', function () {
                    _this.renderComponent(element, _this.result.rating);
                });
            }
            star.el.setAttribute('rating-value', value.toString());
        }
        else {
            star = Dom_1.$$(starElement);
        }
        star.toggleClass('coveo-result-rating-star-active', isChecked);
    };
    /**
     * Rates an item using the the specified `rating` value.
     * @param rating The rating to assign to the item.
     *
     * The possible values are:
     *
     * - `0`: renders no star.
     * - `1`: renders 1 star.
     * - `2`: renders 2 stars.
     * - `3`: renders 3 stars.
     * - `4`: renders 4 stars.
     * - `5`: renders 5 stars.
     */
    ResultRating.prototype.rateDocument = function (rating) {
        var _this = this;
        var request = {
            rating: RatingValues[rating],
            uniqueId: this.result.uniqueId
        };
        this.queryController
            .getEndpoint()
            .rateDocument(request)
            .then(function () {
            _this.result.rating = rating;
            _this.renderComponent(_this.element, rating);
        })
            .catch(function () {
            _this.logger.error('An error occurred while rating the item');
        });
    };
    ResultRating.ID = 'ResultRating';
    ResultRating.doExport = function () {
        GlobalExports_1.exportGlobally({
            ResultRating: ResultRating
        });
    };
    return ResultRating;
}(Component_1.Component));
exports.ResultRating = ResultRating;
Initialization_1.Initialization.registerAutoCreateComponent(ResultRating);


/***/ }),

/***/ 437:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=ResultRating__1a4919568d31ada5f0d0.js.map