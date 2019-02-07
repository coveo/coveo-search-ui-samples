webpackJsonpCoveo__temporary([11,13,44,45],{

/***/ 133:
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
var Utils_1 = __webpack_require__(4);
var Dom_1 = __webpack_require__(2);
var Strings_1 = __webpack_require__(8);
var AnalyticsActionListMeta_1 = __webpack_require__(9);
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
var SVGIcons_1 = __webpack_require__(13);
var SVGDom_1 = __webpack_require__(14);
/**
 * The SearchButton component renders a search icon that the end user can click to trigger a new query.
 *
 * See also the {@link Searchbox} component, which can automatically instantiate a SearchButton component along with a
 * {@link Querybox} component or an {@link Omnibox} component.
 */
var SearchButton = /** @class */ (function (_super) {
    __extends(SearchButton, _super);
    /**
     * Creates a new SearchButton. Binds a `click` event on the element. Adds a search icon on the element.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the SearchButton component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function SearchButton(element, options, bindings) {
        var _this = _super.call(this, element, SearchButton.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        Dom_1.$$(element).setAttribute('aria-label', Strings_1.l('Search'));
        _this.bind.on(element, 'click', function () { return _this.handleClick(); });
        // Provide a magnifier icon if element contains nothing
        if (Utils_1.Utils.trim(Dom_1.$$(_this.element).text()) == '') {
            var svgMagnifierContainer = Dom_1.$$('span', { className: 'coveo-search-button' }, SVGIcons_1.SVGIcons.icons.search).el;
            SVGDom_1.SVGDom.addClassToSVGInContainer(svgMagnifierContainer, 'coveo-search-button-svg');
            var svgLoadingAnimationContainer = Dom_1.$$('span', { className: 'coveo-search-button-loading' }, SVGIcons_1.SVGIcons.icons.loading).el;
            SVGDom_1.SVGDom.addClassToSVGInContainer(svgLoadingAnimationContainer, 'coveo-search-button-loading-svg');
            element.appendChild(svgMagnifierContainer);
            element.appendChild(svgLoadingAnimationContainer);
        }
        return _this;
    }
    /**
     * Triggers the `click` event handler, which logs a `searchboxSubmit` event in the usage analytics and executes a
     * query.
     */
    SearchButton.prototype.click = function () {
        this.handleClick();
    };
    SearchButton.prototype.handleClick = function () {
        this.logger.debug('Performing query following button click');
        this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.searchboxSubmit, {});
        this.queryController.executeQuery();
    };
    SearchButton.ID = 'SearchButton';
    SearchButton.doExport = function () {
        GlobalExports_1.exportGlobally({
            SearchButton: SearchButton
        });
    };
    SearchButton.options = {};
    return SearchButton;
}(Component_1.Component));
exports.SearchButton = SearchButton;
Initialization_1.Initialization.registerAutoCreateComponent(SearchButton);


/***/ }),

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

/***/ 207:
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
var Omnibox_1 = __webpack_require__(81);
var ComponentOptions_1 = __webpack_require__(7);
var SearchButton_1 = __webpack_require__(133);
var Querybox_1 = __webpack_require__(94);
var Dom_1 = __webpack_require__(2);
var Initialization_1 = __webpack_require__(1);
var _ = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
__webpack_require__(443);
var SVGIcons_1 = __webpack_require__(13);
var SVGDom_1 = __webpack_require__(14);
/**
 * The `Searchbox` component allows you to conveniently instantiate two components which end users frequently use to
 * enter and submit queries.
 *
 * This component attaches itself to a `div` element and takes care of instantiating either a
 * [`Querybox`]{@link Querybox} or an [`Omnibox`]{@link Omnibox} component (see the
 * [`enableOmnibox`]{@link Searchbox.options.enableOmnibox} option). Optionally, the `Searchbox` can also instantiate a
 * [`SearchButton`]{@link SearchButton} component, and append it inside the same `div` (see the
 * [`addSearchButton`]{@link Searchbox.options.addSearchButton} option).
 */
var Searchbox = /** @class */ (function (_super) {
    __extends(Searchbox, _super);
    /**
     * Creates a new `Searchbox` component. Creates a new `Coveo.Magicbox` instance and wraps magic box methods (`onblur`,
     * `onsubmit`, etc.). Binds event on `buildingQuery` and on redirection (for standalone box).
     * @param element The HTMLElement on which to instantiate the component. This cannot be an HTMLInputElement for
     * technical reasons.
     * @param options The options for the `Searchbox component`. These will merge with the options from the component set
     * directly on the `HTMLElement`.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function Searchbox(element, options, bindings) {
        var _this = _super.call(this, element, Searchbox.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, Searchbox, options);
        if (_this.options.inline) {
            Dom_1.$$(element).addClass('coveo-inline');
        }
        if (_this.options.addSearchButton) {
            var anchor = document.createElement('a');
            _this.element.appendChild(anchor);
            _this.searchButton = new SearchButton_1.SearchButton(anchor, undefined, bindings);
        }
        var div = document.createElement('div');
        _this.element.appendChild(div);
        if (_this.options.enableOmnibox) {
            _this.searchbox = new Omnibox_1.Omnibox(div, _this.options, bindings);
        }
        else {
            _this.searchbox = new Querybox_1.Querybox(div, _this.options, bindings);
        }
        var magicBoxIcon = Dom_1.$$(_this.element).find('.magic-box-icon');
        magicBoxIcon.innerHTML = SVGIcons_1.SVGIcons.icons.mainClear;
        SVGDom_1.SVGDom.addClassToSVGInContainer(magicBoxIcon, 'magic-box-clear-svg');
        return _this;
    }
    Searchbox.ID = 'Searchbox';
    Searchbox.parent = Omnibox_1.Omnibox;
    Searchbox.doExport = function () {
        GlobalExports_1.exportGlobally({
            Searchbox: Searchbox,
            SearchButton: SearchButton_1.SearchButton,
            Omnibox: Omnibox_1.Omnibox,
            Querybox: Querybox_1.Querybox
        });
    };
    /**
     * Possible options for the {@link Searchbox}
     * @componentOptions
     */
    Searchbox.options = {
        /**
         * Specifies whether to instantiate a [`SearchButton`]{@link SearchButton} component.
         *
         * Default value is `true`.
         */
        addSearchButton: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        /**
         * Specifies whether to instantiate an [`Omnibox`]{@link Omnibox} component.
         *
         * When this option is `false`, the `Searchbox` instantiates a [`Querybox`]{@link Querybox} component instead.
         *
         * **Note:**
         * > You can use configuration options specific to the component you choose to instantiate with the `Searchbox`.
         *
         * **Examples:**
         *
         * In this first case, the `Searchbox` instantiates a `Querybox` component. You can configure this `Querybox`
         * instance using any of the `Querybox` component options, such as
         * [`triggerQueryOnClear`]{@link Querybox.options.triggerQueryOnClear}.
         * ```html
         * <div class='CoveoSearchbox' data-trigger-query-on-clear='true'></div>
         * ```
         *
         * In this second case, the `Searchbox` instantiates an `Omnibox` component. You can configure this `Omnibox`
         * instance using any of the `Omnibox` component options, such as
         * [`placeholder`]{@link Omnibox.options.placeholder}.
         * Moreover, since the `Omnibox` component inherits all of the `Querybox` component options, the
         * `data-trigger-query-on-clear` option from the previous example would also work on this `Omnibox` instance.
         * ```html
         * <div class='CoveoSearchbox' data-enable-omnibox='true' data-placeholder='Please enter a query'></div>
         * ```
         *
         * Default value is `true`.
         */
        enableOmnibox: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true })
    };
    return Searchbox;
}(Component_1.Component));
exports.Searchbox = Searchbox;
Searchbox.options = _.extend({}, Searchbox.options, Omnibox_1.Omnibox.options, Querybox_1.Querybox.options);
// Only parse omnibox option if omnibox is enabled
_.each(Searchbox.options, function (value, key) {
    if (key in Omnibox_1.Omnibox.options && !(key in Querybox_1.Querybox.options)) {
        Searchbox.options[key] = _.extend({ depend: 'enableOmnibox' }, value);
    }
});
Initialization_1.Initialization.registerAutoCreateComponent(Searchbox);


/***/ }),

/***/ 323:
/***/ (function(module, exports) {

var Coveo,__extends=this&&this.__extends||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);function s(){this.constructor=t}t.prototype=null===e?Object.create(e):(s.prototype=e.prototype,new s)};!function(t){var e,n;e=t.MagicBox||(t.MagicBox={}),n=function(){function i(t,e,n){var s=this;this.expression=e,this.input=n,_.isString(t)?this.value=t:_.isArray(t)&&(this.subResults=t,_.forEach(this.subResults,function(t){t.parent=s}))}return i.prototype.isSuccess=function(){return null!=this.value||null!=this.subResults&&_.all(this.subResults,function(t){return t.isSuccess()})},i.prototype.path=function(t){var e=null!=this.parent&&this.parent!=t?this.parent.path(t):[];return e.push(this),e},i.prototype.findParent=function(e){for(var t=this,n=_.isString(e)?function(t){return e==t.expression.id}:e;null!=t&&!n(t);)t=t.parent;return t},i.prototype.find=function(e){var t=_.isString(e)?function(t){return e==t.expression.id}:e;if(t(this))return this;if(this.subResults)for(var n=0;n<this.subResults.length;n++){var s=this.subResults[n].find(t);if(s)return s}return null},i.prototype.findAll=function(e){var t=[],n=_.isString(e)?function(t){return e==t.expression.id}:e;return n(this)&&t.push(this),this.subResults&&(t=_.reduce(this.subResults,function(t,e){return t.concat(e.findAll(n))},t)),t},i.prototype.resultAt=function(t,e){if(t<0||t>this.getLength())return[];if(null!=e){if(_.isString(e)){if(e==this.expression.id)return[this]}else if(e(this))return[this]}else if(null!=(null==this.value&&null==this.subResults?this.input:this.value))return[this];if(null!=this.subResults){for(var n=[],s=0;s<this.subResults.length;s++){var i=this.subResults[s];if(n=n.concat(i.resultAt(t,e)),(t-=i.getLength())<0)break}return n}return[]},i.prototype.getExpect=function(){return null==this.value&&null==this.subResults?[this]:null!=this.subResults?_.reduce(this.subResults,function(t,e){return t.concat(e.getExpect())},[]):[]},i.prototype.getBestExpect=function(){var t=this.getExpect(),e=(n=_.groupBy(t,function(t){return t.input}))[_.last(_.keys(n).sort(function(t,e){return e.length-t.length}))],n=_.groupBy(e,function(t){return t.expression.id});return _.map(n,function(t){return _.chain(t).map(function(t){return{path:t.path().length,result:t}}).sortBy("path").pluck("result").first().value()})},i.prototype.getHumanReadableExpect=function(){var t=this.getBestExpect(),e=0<t.length?_.last(t).input:"";return"Expected "+_.map(t,function(t){return t.getHumanReadable()}).join(" or ")+" but "+(0<e.length?JSON.stringify(e[0]):"end of input")+" found."},i.prototype.before=function(){if(null==this.parent)return"";var t=_.indexOf(this.parent.subResults,this);return this.parent.before()+_.chain(this.parent.subResults).first(t).map(function(t){return t.toString()}).join("").value()},i.prototype.after=function(){if(null==this.parent)return"";var t=_.indexOf(this.parent.subResults,this);return _.chain(this.parent.subResults).last(this.parent.subResults.length-t-1).map(function(t){return t.toString()}).join("").value()+this.parent.after()},i.prototype.getLength=function(){return null!=this.value?this.value.length:null!=this.subResults?_.reduce(this.subResults,function(t,e){return t+e.getLength()},0):this.input.length},i.prototype.toHtmlElement=function(){var e=document.createElement("span"),t=null!=this.expression?this.expression.id:null;return null!=t&&e.setAttribute("data-id",t),e.setAttribute("data-success",this.isSuccess().toString()),null!=this.value?(e.appendChild(document.createTextNode(this.value)),e.setAttribute("data-value",this.value)):null!=this.subResults?_.each(this.subResults,function(t){e.appendChild(t.toHtmlElement())}):(e.appendChild(document.createTextNode(this.input)),e.setAttribute("data-input",this.input),e.className="magic-box-error"+(0<this.input.length?"":" magic-box-error-empty")),e.result=this,e},i.prototype.clean=function(t){if(null!=t||!this.isSuccess()){t=t||_.last(this.getBestExpect()).path(this);var e=_.first(t);if(null!=e){var n=_.indexOf(this.subResults,e),s=-1==n?[]:_.map(_.first(this.subResults,n),function(t){return t.clean()});return s.push(e.clean(_.rest(t))),new i(s,this.expression,this.input)}return new i(null,this.expression,this.input)}return null!=this.value?new i(this.value,this.expression,this.input):null!=this.subResults?new i(_.map(this.subResults,function(t){return t.clean()}),this.expression,this.input):void 0},i.prototype.clone=function(){return null!=this.value?new i(this.value,this.expression,this.input):null!=this.subResults?new i(_.map(this.subResults,function(t){return t.clone()}),this.expression,this.input):new i(null,this.expression,this.input)},i.prototype.toString=function(){return null!=this.value?this.value:null!=this.subResults?_.map(this.subResults,function(t){return t.toString()}).join(""):this.input},i.prototype.getHumanReadable=function(){return this.expression instanceof e.ExpressionConstant?JSON.stringify(this.expression.value):this.expression.id},i}(),e.Result=n}(Coveo||(Coveo={})),function(t){var s,e;s=t.MagicBox||(t.MagicBox={}),e=function(n){function t(t){n.call(this,[t],s.ExpressionEndOfInput,t.input);var e=new s.Result(null,s.ExpressionEndOfInput,t.input.substr(t.getLength()));(e.parent=this).subResults.push(e)}return __extends(t,n),t}(s.Result),s.EndOfInputResult=e}(Coveo||(Coveo={})),function(t){var n,e;n=t.MagicBox||(t.MagicBox={}),e=function(o){function t(t,e,n,s){var i=this;o.call(this,null!=t?[t]:null,e,n),this.result=t,this.expression=e,this.input=n,this.failAttempt=s,_.forEach(this.failAttempt,function(t){t.parent=i})}return __extends(t,o),t.prototype.getExpect=function(){var e=this,t=[];return null!=this.result&&(t=this.result.getExpect()),0<(t=_.reduce(this.failAttempt,function(t,e){return t.concat(e.getExpect())},t)).length&&_.all(t,function(t){return t.input==e.input})?[this]:t},t.prototype.clean=function(t){if(null!=t||!this.isSuccess()){t=_.rest(t||_.last(this.getBestExpect()).path(this));var e=_.first(t);return null==e?new n.Result(null,this.expression,this.input):new n.Result([e.clean(_.rest(t))],this.expression,this.input)}return new n.Result(_.map(this.result.subResults,function(t){return t.clean()}),this.expression,this.input)},t}(n.Result),n.OptionResult=e}(Coveo||(Coveo={})),function(t){var o,e;o=t.MagicBox||(t.MagicBox={}),e=function(i){function t(t,e,n,s){i.call(this,t,e,n),this.results=t,this.expression=e,this.input=n,_.last(t)!=s&&(this.failAttempt=s,null!=this.failAttempt&&(this.failAttempt.parent=this))}return __extends(t,i),t.prototype.getExpect=function(){var t=i.prototype.getExpect.call(this);return null!=this.failAttempt?t.concat(this.failAttempt.getExpect()):t},t.prototype.clean=function(t){if(null!=this.failAttempt&&(null!=t||!this.isSuccess())){t=t||_.last(this.getBestExpect()).path(this);var e=_.first(t);if(null!=e&&e==this.failAttempt){var n=_.last(this.subResults),s=_.map(null!=n&&n.isSuccess()?this.subResults:_.initial(this.subResults),function(t){return t.clean()});return s.push(e.clean(_.rest(t))),new o.Result(s,this.expression,this.input)}}return i.prototype.clean.call(this,t)},t}(o.Result),o.RefResult=e}(Coveo||(Coveo={})),function(t){var i,e;i=t.MagicBox||(t.MagicBox={}),e=function(){function t(t,e){this.value=t,this.id=e}return t.prototype.parse=function(t,e){var n=0==t.indexOf(this.value),s=new i.Result(n?this.value:null,this,t);return n&&e&&t.length>this.value.length?new i.EndOfInputResult(s):s},t.prototype.toString=function(){return this.value},t}(),i.ExpressionConstant=e}(Coveo||(Coveo={})),function(t){(t.MagicBox||(t.MagicBox={})).ExpressionEndOfInput={id:"end of input",parse:null}}(Coveo||(Coveo={})),function(t){var e,n;e=t.MagicBox||(t.MagicBox={}),n=function(){function t(t,e,n){this.func=t,this.id=e,this.grammar=n}return t.prototype.parse=function(t,e){return this.func(t,e,this)},t.prototype.toString=function(){return this.id},t}(),e.ExpressionFunction=n}(Coveo||(Coveo={})),function(t){var r,e;r=t.MagicBox||(t.MagicBox={}),e=function(){function t(t,e){if(this.parts=t,this.id=e,0==t.length)throw JSON.stringify(e)+" should have at least 1 parts"}return t.prototype.parse=function(t,e){for(var n,s=[],i=t,o=0;o<this.parts.length;o++){if(n=this.parts[o].parse(i,e&&o==this.parts.length-1),s.push(n),!n.isSuccess())break;i=i.substr(n.getLength())}return new r.Result(s,this,t)},t.prototype.toString=function(){return this.id},t}(),r.ExpressionList=e}(Coveo||(Coveo={})),function(t){var o,e;o=t.MagicBox||(t.MagicBox={}),e=function(){function t(t,e){this.parts=t,this.id=e}return t.prototype.parse=function(t,e){for(var n=[],s=0;s<this.parts.length;s++){var i=this.parts[s].parse(t,e);if(i.isSuccess())return new o.OptionResult(i,this,t,n);n.push(i)}return new o.OptionResult(null,this,t,n)},t.prototype.toString=function(){return this.id},t}(),o.ExpressionOptions=e}(Coveo||(Coveo={})),function(t){var p,e;p=t.MagicBox||(t.MagicBox={}),e=function(){function t(t,e,n,s){this.ref=t,this.occurrence=e,this.id=n,this.grammar=s}return t.prototype.parse=function(t,e){var n=this.grammar.getExpression(this.ref);if(null==n)throw"Expression not found:"+this.ref;return"?"==this.occurrence||null==this.occurrence?this.parseOnce(t,e,n):this.parseMany(t,e,n)},t.prototype.parseOnce=function(t,e,n){var s=n.parse(t,e),i=s.isSuccess();return i||"?"!=this.occurrence?new p.RefResult([s],this,t,i?null:s):e?0==t.length?new p.RefResult([],this,t,s):_.all(s.getBestExpect(),function(t){return t.expression==p.ExpressionEndOfInput})?new p.RefResult([new p.Result(null,p.ExpressionEndOfInput,t)],this,t,s):s:new p.RefResult([],this,t,null)},t.prototype.parseMany=function(t,e,n){for(var s,i,o=[],r=t;(i=(s=n.parse(r,!1)).isSuccess())&&(o.push(s),r=r.substr(s.getLength())),i&&s.input!=r;);var u=_.isNumber(this.occurrence)?this.occurrence:"+"==this.occurrence?1:0;if(o.length<u)o.push(s);else if(e)if(0<o.length){var a=_.last(o);(s=n.parse(a.input,!0)).isSuccess()?o[o.length-1]=s:(o.push(new p.Result(null,p.ExpressionEndOfInput,a.input.substr(a.getLength()))),s=n.parse(a.input.substr(a.getLength()),!0))}else if(0!=t.length){var l=new p.Result(null,p.ExpressionEndOfInput,t);return new p.RefResult([l],this,t,s)}return new p.RefResult(o,this,t,s)},t.prototype.toString=function(){return this.id},t}(),p.ExpressionRef=e}(Coveo||(Coveo={})),function(t){var i,e;i=t.MagicBox||(t.MagicBox={}),e=function(){function t(t,e,n){this.value=t,this.id=e}return t.prototype.parse=function(t,e){var n=t.match(this.value);null!=n&&0!=n.index&&(n=null);var s=new i.Result(null!=n?n[0]:null,this,t);return s.isSuccess()&&e&&t.length>s.value.length?new i.EndOfInputResult(s):s},t.prototype.toString=function(){return this.id},t}(),i.ExpressionRegExp=e}(Coveo||(Coveo={})),function(t){var u,e;u=t.MagicBox||(t.MagicBox={}),e=function(){function r(t,e){void 0===e&&(e={}),this.expressions={},this.start=new u.ExpressionRef(t,null,"start",this),this.addExpressions(e)}return r.prototype.addExpressions=function(t){var n=this;_.each(t,function(t,e){n.addExpression(e,t)})},r.prototype.addExpression=function(t,e){if(t in this.expressions)throw"Grammar already contain the id:"+t;this.expressions[t]=r.buildExpression(e,t,this)},r.prototype.getExpression=function(t){return this.expressions[t]},r.prototype.parse=function(t){return this.start.parse(t,!0)},r.buildExpression=function(t,n,s){if("undefined"==typeof t)throw"Invalid Expression: "+t;if(_.isString(t))return this.buildStringExpression(t,n,s);if(_.isArray(t))return new u.ExpressionOptions(_.map(t,function(t,e){return new u.ExpressionRef(t,null,n+"_"+e,s)}),n);if(_.isRegExp(t))return new u.ExpressionRegExp(t,n,s);if(_.isFunction(t))return new u.ExpressionFunction(t,n,s);throw"Invalid Expression: "+t},r.buildStringExpression=function(t,i,o){var e=r.stringMatch(t,r.spliter),n=_.map(e,function(t,e){if(t[1]){var n=t[1],s=t[3]?Number(t[3]):t[2]||null;return new u.ExpressionRef(n,s,i+"_"+e,o)}return new u.ExpressionConstant(t[4],i+"_"+e)});if(1==n.length){var s=n[0];return s.id=i,s}return new u.ExpressionList(n,i)},r.stringMatch=function(t,e){for(var n,s=[],i=new RegExp(e.source,"g");null!==(n=i.exec(t));)s.push(n);return s},r.spliter=/\[(\w+)(\*|\+|\?|\{([1-9][0-9]*)\})?\]|(.[^\[]*)/,r}(),u.Grammar=e}(Coveo||(Coveo={})),function(t){var s,e;s=t.MagicBox||(t.MagicBox={}),e=function(){function t(t,e,n){this.element=t,this.onchange=e,this.magicBox=n,this.hasFocus=!1,this.underlay=document.createElement("div"),this.underlay.className="magic-box-underlay",this.highlightContainer=document.createElement("span"),this.highlightContainer.className="magic-box-highlight-container",this.underlay.appendChild(this.highlightContainer),this.ghostTextContainer=document.createElement("span"),this.ghostTextContainer.className="magic-box-ghost-text",this.underlay.appendChild(this.ghostTextContainer),this.input=s.$$(t).find("input"),this.input?t.insertBefore(this.underlay,this.input):(this.input=document.createElement("input"),t.appendChild(this.underlay),t.appendChild(this.input)),this.input.spellcheck=!1,this.input.setAttribute("form","coveo-dummy-form"),this.input.setAttribute("autocomplete","off"),this.setupHandler()}return t.prototype.updateInput=function(){this.input.value!=this.result.input&&(this.input.value=this.result.input,this.hasFocus&&this.setCursor(this.getValue().length))},t.prototype.updateHighlight=function(){s.$$(this.highlightContainer).empty(),this.highlightContainer.appendChild(this.result.toHtmlElement())},t.prototype.updateWordCompletion=function(){s.$$(this.ghostTextContainer).empty(),null!=this.wordCompletion&&this.ghostTextContainer.appendChild(document.createTextNode(this.wordCompletion.substr(this.result.input.length)))},t.prototype.updateScroll=function(t){var e=this;void 0===t&&(t=!0);var n=function(){e.underlay.clientWidth<e.underlay.scrollWidth&&(e.underlay.style.visibility="hidden",e.underlay.scrollLeft=e.input.scrollLeft,e.underlay.scrollTop=e.input.scrollTop,e.underlay.style.visibility="visible"),e.updateScrollDefer=null,e.hasFocus&&e.updateScroll()};t?null==this.updateScrollDefer&&(this.updateScrollDefer=s.requestAnimationFrame(n)):n()},t.prototype.setResult=function(t,e){this.result=t,this.updateInput(),this.updateHighlight(),_.isUndefined(e)&&null!=this.wordCompletion&&0==this.wordCompletion.indexOf(this.result.input)?this.updateWordCompletion():this.setWordCompletion(e),this.updateScroll()},t.prototype.setWordCompletion=function(t){null!=t&&0!=t.toLowerCase().indexOf(this.result.input.toLowerCase())&&(t=null),this.wordCompletion=t,this.updateWordCompletion(),this.updateScroll()},t.prototype.setCursor=function(t){if(this.input.focus(),this.input.createTextRange){var e=this.input.createTextRange();e.move("character",t),e.select()}else null!=this.input.selectionStart&&(this.input.focus(),this.input.setSelectionRange(t,t))},t.prototype.getCursor=function(){return this.input.selectionStart},t.prototype.setupHandler=function(){var e=this;this.input.onblur=function(){e.hasFocus=!1,setTimeout(function(){e.hasFocus||e.onblur&&e.onblur()},300),e.updateScroll()},this.input.onfocus=function(){e.hasFocus||(e.hasFocus=!0,e.updateScroll(),e.onfocus&&e.onfocus())},this.input.onkeydown=function(t){e.keydown(t)},this.input.onkeyup=function(t){e.keyup(t)},this.input.onclick=function(){e.onchangecursor()},this.input.oncut=function(){setTimeout(function(){e.onInputChange()})},this.input.onpaste=function(){setTimeout(function(){e.onInputChange()})}},t.prototype.focus=function(){var t=this;this.hasFocus=!0,setTimeout(function(){t.input.focus(),t.setCursor(t.getValue().length)})},t.prototype.blur=function(){this.hasFocus&&this.input.blur()},t.prototype.keydown=function(t){var e=this;switch(t.keyCode||t.which){case 9:this.tabPress(),this.magicBox.clearSuggestion();break;default:t.stopPropagation(),null==this.onkeydown||this.onkeydown(t.keyCode||t.which)?s.requestAnimationFrame(function(){e.onInputChange()}):t.preventDefault()}},t.prototype.keyup=function(t){switch(t.keyCode||t.which){case 37:case 39:this.onchangecursor();break;default:null==this.onkeydown||this.onkeyup(t.keyCode||t.which)?this.onInputChange():t.preventDefault()}},t.prototype.tabPress=function(){this.ontabpress&&this.ontabpress(),this.onblur&&this.onblur()},t.prototype.onInputChange=function(){this.result.input!=this.input.value&&this.onchange(this.input.value,!1)},t.prototype.getValue=function(){return this.input.value},t.prototype.getWordCompletion=function(){return this.wordCompletion},t}(),s.InputManager=e}(Coveo||(Coveo={})),function(t){var o,e;o=t.MagicBox||(t.MagicBox={}),e=function(){function t(t,e){var n=this;this.element=t,this.count=1,this.options=_.defaults(e,{selectableClass:"magic-box-suggestion",selectedClass:"magic-box-selected"}),null==this.options.timeout&&(this.options.timeout=500),this.hasSuggestions=!1,o.$$(this.element).on("mouseover",function(t){n.handleMouseOver(t)}),o.$$(this.element).on("mouseout",function(t){n.handleMouseOut(t)})}return t.prototype.handleMouseOver=function(t){var e=o.$$(t.target),n=e.parents(this.options.selectableClass);e.hasClass(this.options.selectableClass)?this.addSelectedClass(e.el):0<n.length&&this.element.contains(n[0])&&this.addSelectedClass(n[0])},t.prototype.handleMouseOut=function(t){var e=o.$$(t.target),n=e.parents(this.options.selectableClass);if(t.relatedTarget){var s=o.$$(t.relatedTarget).parents(this.options.selectableClass);e.hasClass(this.options.selectedClass)&&!o.$$(t.relatedTarget).hasClass(this.options.selectableClass)?e.removeClass(this.options.selectedClass):0==s.length&&0<n.length&&o.$$(n[0]).removeClass(this.options.selectedClass)}else e.hasClass(this.options.selectedClass)?e.removeClass(this.options.selectedClass):0<n.length&&o.$$(n[0]).removeClass(this.options.selectedClass)},t.prototype.moveDown=function(){var t=this.element.getElementsByClassName(this.options.selectedClass).item(0),e=this.element.getElementsByClassName(this.options.selectableClass),n=-1;if(null!=t){o.$$(t).removeClass(this.options.selectedClass);for(var s=0;s<e.length;s++)if(t==e.item(s)){n=s;break}n=-1==n?0:n+1}else n=0;return null!=(t=e.item(n))&&o.$$(t).addClass(this.options.selectedClass),this.returnMoved(t)},t.prototype.moveUp=function(){var t=this.element.getElementsByClassName(this.options.selectedClass).item(0),e=this.element.getElementsByClassName(this.options.selectableClass),n=-1;if(null!=t){o.$$(t).removeClass(this.options.selectedClass);for(var s=0;s<e.length;s++)if(t==e.item(s)){n=s;break}n=-1==n?e.length-1:n-1}else n=e.length-1;return null!=(t=e.item(n))&&o.$$(t).addClass(this.options.selectedClass),this.returnMoved(t)},t.prototype.select=function(){var t=this.element.getElementsByClassName(this.options.selectedClass).item(0);return null!=t&&o.$$(t).trigger("keyboardSelect"),t},t.prototype.mergeSuggestions=function(s,e){var i,o=this,r=[],u=!0;s=_.compact(s);var a=this.pendingSuggestion=new Promise(function(t,e){_.each(s,function(t){var e=!1;setTimeout(function(){u=!(e=!0)},o.options.timeout),t.then(function(t){!e&&t&&(r=r.concat(t))})});var n=function(){u&&(i&&clearTimeout(i),0==r.length?t([]):a==o.pendingSuggestion||null==o.pendingSuggestion?t(r.sort(function(t,e){return e.index-t.index})):e("new request queued")),u=!1};0==s.length&&n(),null==s&&n(),i=setTimeout(function(){n()},o.options.timeout),Promise.all(s).then(function(){return n()})});a.then(function(t){return e&&e(t),o.updateSuggestions(t),t}).catch(function(){return null})},t.prototype.updateSuggestions=function(t){var i=this;o.$$(this.element).empty(),this.element.className="magic-box-suggestions",_.each(t,function(t){var e=t.dom;if(e){o.$$(e).removeClass(i.options.selectedClass);var n=o.$$(e).find("."+i.options.selectableClass);o.$$(n).removeClass(i.options.selectedClass)}else{if((e=document.createElement("div")).className="magic-box-suggestion",null!=t.html)e.innerHTML=t.html;else if(null!=t.text)e.appendChild(document.createTextNode(t.text));else if(null!=t.separator){e.className="magic-box-suggestion-seperator";var s=document.createElement("div");s.className="magic-box-suggestion-seperator-label",s.appendChild(document.createTextNode(t.separator)),e.appendChild(s)}o.$$(e).on("click",function(){t.onSelect()}),o.$$(e).on("keyboardSelect",function(){t.onSelect()}),o.$$(e).addClass(i.options.selectableClass)}e.suggestion=t,i.element.appendChild(e)}),0<t.length?(o.$$(this.element).addClass("magic-box-hasSuggestion"),this.hasSuggestions=!0):(o.$$(this.element).removeClass("magic-box-hasSuggestion"),this.hasSuggestions=!1)},t.prototype.returnMoved=function(t){if(null!=t){if(t.suggestion)return t.suggestion;if(t["no-text-suggestion"])return null;if(t instanceof HTMLElement)return{text:o.$$(t).text()}}return null},t.prototype.addSelectedClass=function(t){for(var e=this.element.getElementsByClassName(this.options.selectedClass),n=0;n<e.length;n++){var s=e.item(n);o.$$(s).removeClass(this.options.selectedClass)}o.$$(t).addClass(this.options.selectedClass)},t}(),o.SuggestionsManager=e}(Coveo||(Coveo={})),function(t){var s;(function(t){t.highlightText=function(t,e,n,i,o){if(void 0===n&&(n=!1),void 0===i&&(i="magic-box-hightlight"),void 0===o&&(o=""),0==e.length)return t;var s=e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&"),r=new RegExp("("+s+")|(.*?(?="+s+")|.+)",n?"gi":"g");return t.replace(r,function(t,e,n){return s=t,'<span class="'+(null!=e?i:o)+'">'+_.escape(s)+"</span>";var s})};var e=function(){function r(t){this.el=t}return r.prototype.text=function(t){if(!t)return this.el.innerText||this.el.textContent;null!=this.el.innerText?this.el.innerText=t:null!=this.el.textContent&&(this.el.textContent=t)},r.prototype.nodeListToArray=function(t){for(var e=t.length,n=new Array(e);e--;)n[e]=t.item(e);return n},r.prototype.empty=function(){for(;this.el.firstChild;)this.el.removeChild(this.el.firstChild)},r.prototype.show=function(){this.el.style.display="visible"},r.prototype.hide=function(){this.el.style.display="none"},r.prototype.toggle=function(t){void 0===t?"visible"==this.el.style.display?this.hide():this.show():t?this.show():this.hide()},r.prototype.find=function(t){return this.el.querySelector(t)},r.prototype.is=function(t){return this.el.tagName.toLowerCase()==t.toLowerCase()||!("."!=t[0]||!this.hasClass(t.substr(1)))||"#"==t[0]&&this.el.getAttribute("id")==t.substr(1)},r.prototype.closest=function(t){for(var e=this.el,n=!1;!n&&(s.$$(e).hasClass(t)&&(n=!0),"body"!=e.tagName.toLowerCase())&&null!=e.parentElement;)n||(e=e.parentElement);if(n)return e},r.prototype.parent=function(t){if(null!=this.el.parentElement)return this.traverseAncestorForClass(this.el.parentElement,t)},r.prototype.parents=function(t){for(var e=[],n=this.parent(t);n;)e.push(n),n=new r(n).parent(t);return e},r.prototype.findAll=function(t){return this.nodeListToArray(this.el.querySelectorAll(t))},r.prototype.findClass=function(t){return"getElementsByClassName"in this.el?this.nodeListToArray(this.el.getElementsByClassName(t)):this.nodeListToArray(this.el.querySelectorAll("."+t))},r.prototype.findId=function(t){return document.getElementById(t)},r.prototype.addClass=function(t){this.hasClass(t)||(this.el.className?this.el.className+=" "+t:this.el.className=t)},r.prototype.removeClass=function(t){this.el.className=this.el.className.replace(new RegExp("(^|\\s)"+t+"(\\s|\\b)","g"),"$1")},r.prototype.toggleClass=function(t,e){e?this.addClass(t):this.removeClass(t)},r.prototype.getClass=function(){return this.el.className.match(r.CLASS_NAME_REGEX)||[]},r.prototype.hasClass=function(t){return _.contains(this.getClass(),t)},r.prototype.detach=function(){this.el.parentElement&&this.el.parentElement.removeChild(this.el)},r.prototype.on=function(t,e){var n=this;if(_.isArray(t))_.each(t,function(t){n.on(t,e)});else{var s=this.getJQuery();if(s)s(this.el).on(t,e);else if(this.el.addEventListener){var i=function(t){e(t,t.detail)};r.handlers.push({eventHandle:e,fn:i}),this.el.addEventListener(t,i,!1)}else this.el.on&&this.el.on("on"+t,e)}},r.prototype.one=function(e,n){var s=this;if(_.isArray(e))_.each(e,function(t){s.one(t,n)});else{var i=function(t){return s.off(e,i),n(t)};this.on(e,i)}},r.prototype.off=function(t,n){var e=this;if(_.isArray(t))_.each(t,function(t){e.off(t,n)});else{var s=this.getJQuery();if(s)s(this.el).off(t,n);else if(this.el.removeEventListener){var i=0,o=_.find(r.handlers,function(t,e){if(t.eventHandle==n)return i=e,!0});o&&(this.el.removeEventListener(t,o.fn,!1),r.handlers.splice(i,1))}else this.el.off&&this.el.off("on"+t,n)}},r.prototype.trigger=function(t,e){var n=this.getJQuery();if(n)n(this.el).trigger(t,e);else if(void 0!==CustomEvent){var s=new CustomEvent(t,{detail:e,bubbles:!0});this.el.dispatchEvent(s)}},r.prototype.isEmpty=function(){return r.ONLY_WHITE_SPACE_REGEX.test(this.el.innerHTML)},r.prototype.isDescendant=function(t){for(var e=this.el.parentNode;null!=e;){if(e==t)return!0;e=e.parentNode}return!1},r.prototype.traverseAncestorForClass=function(t,e){void 0===t&&(t=this.el),0==e.indexOf(".")&&(e=e.substr(1));for(var n=!1;!n&&(s.$$(t).hasClass(e)&&(n=!0),"body"!=t.tagName.toLowerCase())&&null!=t.parentElement;)n||(t=t.parentElement);if(n)return t},r.prototype.getJQuery=function(){return null!=window.jQuery&&window.jQuery},r.CLASS_NAME_REGEX=/-?[_a-zA-Z]+[_a-zA-Z0-9-]*/g,r.ONLY_WHITE_SPACE_REGEX=/^\s*$/,r.handlers=[],r}();t.Dom=e})((s=t.MagicBox||(t.MagicBox={})).Utils||(s.Utils={}))}(Coveo||(Coveo={})),function(t){var e;(e=t.MagicBox||(t.MagicBox={})).$$=function(t){return window.Coveo&&window.Coveo.$$?window.Coveo.$$(t):new e.Utils.Dom(t)}}(Coveo||(Coveo={})),function(t){var i;(function(t){function r(e,n,s,t){_.each(t.expressions,function(t){_.contains(e,t)||e.push(t)}),_.each(t.basicExpressions,function(t){_.contains(n,t)||n.push(t)}),_.each(t.grammars,function(t,e){if(e in s){if(!_.isArray(s[e])||!_.isArray(t))throw _.each(t,function(t){s[e].push(t)}),"Can not merge "+e+"("+new String(t)+" => "+new String(s[e])+")";_.each(t,function(t){s[e].push(t)})}else s[e]=t})}function s(){for(var e=[],t=0;t<arguments.length;t++)e[t-0]=arguments[t];for(var n=[],s=[],i={Start:["Expressions","Empty"],Expressions:"[OptionalSpaces][Expression][ExpressionsList*][OptionalSpaces]",ExpressionsList:"[Spaces][Expression]",Expression:n,BasicExpression:s,OptionalSpaces:/ */,Spaces:/ +/,Empty:/(?!.)/},o=0;o<e.length;o++)r(n,s,i,e[o]),_.each(e[o].include,function(t){_.contains(e,t)||e.push(t)});return n.push("BasicExpression"),{start:"Start",expressions:i}}t.Expressions=s,t.ExpressionsGrammar=function(){for(var t=[],e=0;e<arguments.length;e++)t[e-0]=arguments[e];var n=s.apply(this,t);return new i.Grammar(n.start,n.expressions)}})((i=t.MagicBox||(t.MagicBox={})).Grammars||(i.Grammars={}))}(Coveo||(Coveo={})),function(t){var r,u;r=t.MagicBox||(t.MagicBox={}),(u=r.Grammars||(r.Grammars={})).notWordStart=" ()[],$@'\"",u.notInWord=" ()[],:",u.Basic={basicExpressions:["Word","DoubleQuoted"],grammars:{DoubleQuoted:'"[NotDoubleQuote]"',NotDoubleQuote:/[^"]*/,SingleQuoted:"'[NotSingleQuote]'",NotSingleQuote:/[^']*/,Number:/-?(0|[1-9]\d*)(\.\d+)?/,Word:function(t,e,n){var s=new RegExp("[^"+u.notWordStart.replace(/(.)/g,"\\$1")+"][^"+u.notInWord.replace(/(.)/g,"\\$1")+"]*"),i=t.match(s);null!=i&&0!=i.index&&(i=null);var o=new r.Result(null!=i?i[0]:null,n,t);return o.isSuccess()&&e&&t.length>o.value.length?new r.EndOfInputResult(o):o}}}}(Coveo||(Coveo={})),function(t){var e;((e=t.MagicBox||(t.MagicBox={})).Grammars||(e.Grammars={})).SubExpression={basicExpressions:["SubExpression"],grammars:{SubExpression:"([Expressions])"}}}(Coveo||(Coveo={})),function(t){var e,n;e=t.MagicBox||(t.MagicBox={}),(n=e.Grammars||(e.Grammars={})).Date={grammars:{Date:"[DateYear]/[DateMonth]/[DateDay]",DateYear:/([0-9]{4})/,DateMonth:/(1[0-2]|0?[1-9])/,DateDay:/([1-2][0-9]|3[0-1]|0?[1-9])/,DateRange:"[Date][Spaces?]..[Spaces?][Date]",DateRelative:["DateRelativeNegative","DateRelativeTerm"],DateRelativeTerm:/now|today|yesterday/,DateRelativeNegative:"[DateRelativeTerm][DateRelativeNegativeRef]",DateRelativeNegativeRef:/([\-\+][0-9]+(s|m|h|d|mo|y))/},include:[n.Basic]}}(Coveo||(Coveo={})),function(t){var e,n;e=t.MagicBox||(t.MagicBox={}),(n=e.Grammars||(e.Grammars={})).Field={basicExpressions:["FieldSimpleQuery","FieldQuery","Field"],grammars:{FieldQuery:"[Field][OptionalSpaces][FieldQueryOperation]",FieldQueryOperation:["FieldQueryValue","FieldQueryNumeric"],FieldQueryValue:"[FieldOperator][OptionalSpaces][FieldValue]",FieldQueryNumeric:"[FieldOperatorNumeric][OptionalSpaces][FieldValueNumeric]",FieldSimpleQuery:"[FieldName]:[OptionalSpaces][FieldValue]",Field:"@[FieldName]",FieldName:/[a-zA-Z][a-zA-Z0-9\.\_]*/,FieldOperator:/==|=|<>/,FieldOperatorNumeric:/<=|>=|<|>/,FieldValue:["DateRange","NumberRange","DateRelative","Date","Number","FieldValueList","FieldValueString"],FieldValueNumeric:["DateRelative","Date","Number"],FieldValueString:["DoubleQuoted","FieldValueNotQuoted"],FieldValueList:"([FieldValueString][FieldValueStringList*])",FieldValueStringList:"[FieldValueSeparator][FieldValueString]",FieldValueSeparator:/ *, */,FieldValueNotQuoted:/[^ \(\),]+/,NumberRange:"[Number][Spaces?]..[Spaces?][Number]"},include:[n.Date,n.Basic]}}(Coveo||(Coveo={})),function(t){var e,n;e=t.MagicBox||(t.MagicBox={}),(n=e.Grammars||(e.Grammars={})).QueryExtension={basicExpressions:["QueryExtension"],grammars:{QueryExtension:"$[QueryExtensionName]([QueryExtensionArguments])",QueryExtensionName:/\w+/,QueryExtensionArguments:"[QueryExtensionArgumentList*][QueryExtensionArgument]",QueryExtensionArgumentList:"[QueryExtensionArgument][Spaces?],[Spaces?]",QueryExtensionArgument:"[QueryExtensionArgumentName]:[Spaces?][QueryExtensionArgumentValue]",QueryExtensionArgumentName:/\w+/,QueryExtensionArgumentValue:["SingleQuoted","Expressions"]},include:[n.Basic]}}(Coveo||(Coveo={})),function(t){var e,n;e=t.MagicBox||(t.MagicBox={}),(n=e.Grammars||(e.Grammars={})).NestedQuery={basicExpressions:["NestedQuery"],grammars:{NestedQuery:"[[NestedField][OptionalSpaces][Expressions]]",NestedField:"[[Field]]",FieldValue:["NestedQuery"]},include:[n.Field]}}(Coveo||(Coveo={})),function(t){var e,n;e=t.MagicBox||(t.MagicBox={}),(n=e.Grammars||(e.Grammars={})).Complete={include:[n.NestedQuery,n.QueryExtension,n.SubExpression,n.Field,n.Basic]}}(Coveo||(Coveo={})),function(t){var a,s;a=t.MagicBox||(t.MagicBox={}),s=function(){function t(t,e,n){var s=this;void 0===n&&(n={}),this.element=t,this.grammar=e,this.options=n,this.lastSuggestions=[],_.isUndefined(this.options.inline)&&(this.options.inline=!1),a.$$(t).addClass("magic-box"),this.options.inline&&a.$$(t).addClass("magic-box-inline"),this.result=this.grammar.parse(""),this.displayedResult=this.result.clean(),this.clearDom=document.createElement("div"),this.clearDom.className="magic-box-clear";var i=document.createElement("div");i.className="magic-box-icon",this.clearDom.appendChild(i);var o=a.$$(t).find(".magic-box-input");o?t.insertBefore(this.clearDom,o):((o=document.createElement("div")).className="magic-box-input",t.appendChild(this.clearDom),t.appendChild(o)),this.inputManager=new a.InputManager(o,function(t,e){e?(s.setText(t),s.onselect&&s.onselect(s.getFirstSuggestionText())):(s.setText(t),s.showSuggestion(),s.onchange&&s.onchange())},this),this.inputManager.ontabpress=function(){s.ontabpress&&s.ontabpress()};var r=this.inputManager.getValue();r&&(this.displayedResult.input=r),this.inputManager.setResult(this.displayedResult);var u=document.createElement("div");u.className="magic-box-suggestions",this.element.appendChild(u),this.suggestionsManager=new a.SuggestionsManager(u,{selectableClass:this.options.selectableSuggestionClass,selectedClass:this.options.selectedSuggestionClass,timeout:this.options.suggestionTimeout}),this.setupHandler()}return t.prototype.getResult=function(){return this.result},t.prototype.getDisplayedResult=function(){return this.displayedResult},t.prototype.setText=function(t){a.$$(this.element).toggleClass("magic-box-notEmpty",0<t.length),this.result=this.grammar.parse(t),this.displayedResult=this.result.clean(),this.inputManager.setResult(this.displayedResult)},t.prototype.setCursor=function(t){this.inputManager.setCursor(t)},t.prototype.getCursor=function(){return this.inputManager.getCursor()},t.prototype.resultAtCursor=function(t){return this.displayedResult.resultAt(this.getCursor(),t)},t.prototype.setupHandler=function(){var e=this;this.inputManager.onblur=function(){a.$$(e.element).removeClass("magic-box-hasFocus"),e.onblur&&e.onblur(),e.options.inline||e.clearSuggestion()},this.inputManager.onfocus=function(){a.$$(e.element).addClass("magic-box-hasFocus"),e.showSuggestion(),e.onfocus&&e.onfocus()},this.inputManager.onkeydown=function(t){return 38!=t&&40!=t&&(13==t?(null==e.suggestionsManager.select()&&e.onsubmit&&e.onsubmit(),!1):(27==t&&(e.clearSuggestion(),e.blur()),!0))},this.inputManager.onchangecursor=function(){e.showSuggestion()},this.inputManager.onkeyup=function(t){if(38==t)e.onmove&&e.onmove(),e.focusOnSuggestion(e.suggestionsManager.moveUp()),e.onchange&&e.onchange();else{if(40!=t)return!0;e.onmove&&e.onmove(),e.focusOnSuggestion(e.suggestionsManager.moveDown()),e.onchange&&e.onchange()}return!1},this.clearDom.onclick=function(){e.clear()}},t.prototype.showSuggestion=function(){var e=this;this.suggestionsManager.mergeSuggestions(null!=this.getSuggestions?this.getSuggestions():[],function(t){e.updateSuggestion(t)})},t.prototype.updateSuggestion=function(t){var e=this;this.lastSuggestions=t;var n=this.getFirstSuggestionText();this.inputManager.setWordCompletion(n&&n.text),this.onsuggestions&&this.onsuggestions(t),_.each(t,function(t){null==t.onSelect&&null!=t.text&&(t.onSelect=function(){e.setText(t.text),e.onselect&&e.onselect(t)})})},t.prototype.focus=function(){a.$$(this.element).addClass("magic-box-hasFocus"),this.inputManager.focus()},t.prototype.blur=function(){this.inputManager.blur()},t.prototype.clearSuggestion=function(){var e=this;this.suggestionsManager.mergeSuggestions([],function(t){e.updateSuggestion(t)}),this.inputManager.setWordCompletion(null)},t.prototype.focusOnSuggestion=function(t){null==t||null==t.text?(t=this.getFirstSuggestionText(),this.inputManager.setResult(this.displayedResult,t&&t.text)):this.inputManager.setResult(this.grammar.parse(t.text).clean(),t.text)},t.prototype.getFirstSuggestionText=function(){return _.find(this.lastSuggestions,function(t){return null!=t.text})},t.prototype.getText=function(){return this.inputManager.getValue()},t.prototype.getWordCompletion=function(){return this.inputManager.getWordCompletion()},t.prototype.clear=function(){this.setText(""),this.showSuggestion(),this.focus(),this.onclear&&this.onclear()},t.prototype.hasSuggestions=function(){return this.suggestionsManager.hasSuggestions},t}(),a.Instance=s,a.create=function(t,e,n){return new s(t,e,n)},a.requestAnimationFrame=function(t){return"requestAnimationFrame"in window?window.requestAnimationFrame(t):setTimeout(t)}}(Coveo||(Coveo={}));

/*** EXPORTS FROM exports-loader ***/
module.exports = Coveo.MagicBox;

/***/ }),

/***/ 324:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _ = __webpack_require__(0);
var MiscModules_1 = __webpack_require__(53);
var QueryboxQueryParameters = /** @class */ (function () {
    function QueryboxQueryParameters(options) {
        this.options = options;
    }
    QueryboxQueryParameters.queryIsBlocked = function () {
        // This code runs on some assumption :
        // Since all "buildingQuery" events would have to be run in the same call stack
        // We can add a static flag to block 2 or more query box/omnibox from trying to modify the query inside the same event.
        // If 2 query box are activated, we get duplicate terms in the query, or duplicate term correction with did you mean.
        // This means that only one query box/searchbox would be able to modify the query in a single search page.
        // This also means that if there is 2 search box enabled, the first one in the markup in the page would be able to do the job correctly as far as the query is concerned.
        // The second one is inactive as far as the query is concerned.
        // The flag gets reset in "defer" (setTimeout 0) so that it gets reset correctly when the query event has finished executing
        if (!QueryboxQueryParameters.queryIsCurrentlyBlocked) {
            QueryboxQueryParameters.queryIsCurrentlyBlocked = true;
            MiscModules_1.Defer.defer(function () { return QueryboxQueryParameters.allowDuplicateQuery(); });
            return false;
        }
        return true;
    };
    QueryboxQueryParameters.allowDuplicateQuery = function () {
        QueryboxQueryParameters.queryIsCurrentlyBlocked = false;
    };
    QueryboxQueryParameters.prototype.addParameters = function (queryBuilder, lastQuery) {
        if (!QueryboxQueryParameters.queryIsBlocked()) {
            if (this.options.enableWildcards) {
                queryBuilder.enableWildcards = true;
            }
            if (this.options.enableQuestionMarks) {
                queryBuilder.enableQuestionMarks = true;
            }
            if (this.options.enableLowercaseOperators) {
                queryBuilder.enableLowercaseOperators = true;
            }
            if (!_.isEmpty(lastQuery)) {
                queryBuilder.enableQuerySyntax = this.options.enableQuerySyntax;
                queryBuilder.expression.add(lastQuery);
                if (this.options.enablePartialMatch) {
                    queryBuilder.enablePartialMatch = this.options.enablePartialMatch;
                    if (this.options.partialMatchKeywords) {
                        queryBuilder.partialMatchKeywords = this.options.partialMatchKeywords;
                    }
                    if (this.options.partialMatchThreshold) {
                        queryBuilder.partialMatchThreshold = this.options.partialMatchThreshold;
                    }
                }
            }
        }
    };
    QueryboxQueryParameters.queryIsCurrentlyBlocked = false;
    return QueryboxQueryParameters;
}());
exports.QueryboxQueryParameters = QueryboxQueryParameters;


/***/ }),

/***/ 325:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SuggestionsCache = /** @class */ (function () {
    function SuggestionsCache() {
        this.cache = {};
    }
    SuggestionsCache.prototype.getSuggestions = function (hash, suggestionsFetcher) {
        var _this = this;
        if (this.cache[hash] != null) {
            return this.cache[hash];
        }
        var promise = suggestionsFetcher();
        this.cache[hash] = promise;
        promise.catch(function () { return _this.clearSuggestion(hash); });
        return this.cache[hash];
    };
    SuggestionsCache.prototype.clearSuggestion = function (hash) {
        if (!hash || hash.length === 0) {
            return null;
        }
        delete this.cache[hash];
    };
    return SuggestionsCache;
}());
exports.SuggestionsCache = SuggestionsCache;


/***/ }),

/***/ 350:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
///<reference path='Omnibox.ts'/>
var Omnibox_1 = __webpack_require__(81);
var OmniboxEvents_1 = __webpack_require__(30);
var _ = __webpack_require__(0);
var FieldAddon = /** @class */ (function () {
    function FieldAddon(omnibox) {
        var _this = this;
        this.omnibox = omnibox;
        this.cache = {};
        this.omnibox.bind.on(this.omnibox.element, OmniboxEvents_1.OmniboxEvents.populateOmniboxSuggestions, function (args) {
            args.suggestions.push(_this.getSuggestion());
        });
    }
    FieldAddon.prototype.getSuggestion = function () {
        var _this = this;
        var hash = this.getHash();
        if (hash == null) {
            return null;
        }
        var hashString = this.hashToString(hash);
        if (this.cache[hashString] != null) {
            return this.hashValueToSuggestion(hash, this.cache[hashString]);
        }
        var values;
        if (hash.type == 'FieldName') {
            values = this.fieldNames(hash.current);
        }
        if (hash.type == 'FieldValue') {
            values = this.fieldValues(hash.field, hash.current);
        }
        if (hash.type == 'SimpleFieldName') {
            values = this.simpleFieldNames(hash.current);
        }
        this.cache[hashString] = values;
        values.catch(function () {
            delete _this.cache[hashString];
        });
        return this.hashValueToSuggestion(hash, values);
    };
    FieldAddon.prototype.getHash = function () {
        var fieldName = _.last(this.omnibox.resultAtCursor('FieldName'));
        if (fieldName != null) {
            fieldName = fieldName.findParent('Field') || fieldName;
            var currentField = fieldName.toString();
            var before = fieldName.before();
            var after = fieldName.after();
            return { type: 'FieldName', current: currentField, before: before, after: after };
        }
        var fieldValue = _.last(this.omnibox.resultAtCursor('FieldValue'));
        if (fieldValue) {
            var fieldQuery = fieldValue.findParent('FieldQuery') || (this.omnibox.options.enableSimpleFieldAddon && fieldValue.findParent('FieldSimpleQuery'));
            if (fieldQuery) {
                var field = fieldQuery.find('FieldName').toString();
                if (this.omnibox.options.fieldAlias) {
                    if (field in this.omnibox.options.fieldAlias) {
                        field = this.omnibox.options.fieldAlias[field];
                    }
                }
                var value = fieldValue.toString();
                var before = fieldValue.before();
                var after = fieldValue.after();
                return { type: 'FieldValue', field: field, current: value, before: before, after: after };
            }
        }
        if (this.omnibox.options.enableSimpleFieldAddon) {
            var word = _.last(this.omnibox.resultAtCursor('Word'));
            if (word != null) {
                var current = word.toString();
                var before = word.before();
                var after = word.after();
                return { type: 'SimpleFieldName', current: current, before: before, after: after };
            }
        }
    };
    FieldAddon.prototype.hashToString = function (hash) {
        if (hash == null) {
            return null;
        }
        return hash.type + hash.current + (hash.field || '');
    };
    FieldAddon.prototype.hashValueToSuggestion = function (hash, promise) {
        return promise.then(function (values) {
            var suggestions = _.map(values, function (value, i) {
                var suggestion = {
                    text: hash.before +
                        (hash.current.toLowerCase().indexOf(value.toLowerCase()) == 0 ? hash.current + value.substr(hash.current.length) : value) +
                        hash.after,
                    html: Omnibox_1.MagicBox.Utils.highlightText(value, hash.current, true),
                    index: FieldAddon.INDEX - i / values.length
                };
                return suggestion;
            });
            return suggestions;
        });
    };
    FieldAddon.prototype.getFields = function () {
        var _this = this;
        if (this.fields == null) {
            this.fields = new Promise(function (resolve, reject) {
                if (_this.omnibox.options.listOfFields != null) {
                    resolve(_this.omnibox.options.listOfFields);
                }
                else {
                    var promise = _this.omnibox.queryController.getEndpoint().listFields();
                    promise
                        .then(function (fieldDescriptions) {
                        var fieldNames = _.chain(fieldDescriptions)
                            .filter(function (fieldDescription) { return fieldDescription.includeInQuery && fieldDescription.groupByField; })
                            .map(function (fieldDescription) { return fieldDescription.name.substr(1); })
                            .value();
                        resolve(fieldNames);
                    })
                        .catch(function () {
                        reject();
                    });
                }
            });
        }
        return this.fields;
    };
    FieldAddon.prototype.fieldNames = function (current) {
        var withAt = current.length > 0 && current[0] == '@';
        var fieldName = withAt ? current.substr(1) : current;
        var fieldNameLC = fieldName.toLowerCase();
        return this.getFields().then(function (fields) {
            var matchFields = _.chain(fields)
                .map(function (fieldName) {
                var fieldNameBeginsWithAt = fieldName.length > 0 && fieldName[0] == '@';
                return {
                    index: fieldName.toLowerCase().indexOf(fieldNameLC),
                    field: fieldNameBeginsWithAt ? fieldName : '@' + fieldName
                };
            })
                .filter(function (field) {
                return field.index != -1 && field.field.length > current.length;
            })
                .sortBy('index')
                .map(function (field) { return field.field; })
                .value();
            matchFields = _.first(matchFields, 5);
            return matchFields;
        });
    };
    FieldAddon.prototype.fieldValues = function (field, current) {
        return this.omnibox.queryController
            .getEndpoint()
            .listFieldValues({
            pattern: '.*' + current + '.*',
            patternType: 'RegularExpression',
            sortCriteria: 'occurrences',
            field: '@' + field,
            maximumNumberOfValues: 5
        })
            .then(function (values) {
            return _.chain(values)
                .map(function (value) {
                return {
                    index: value.value.toLowerCase().indexOf(current),
                    value: value.value
                };
            })
                .filter(function (value) {
                return value.value.length > current.length;
            })
                .sortBy('index')
                .map(function (value) {
                return value.value.replace(/ /g, '\u00A0');
            })
                .value();
        });
    };
    FieldAddon.prototype.simpleFieldNames = function (current) {
        var fieldName = current;
        var fieldNameLC = fieldName.toLowerCase();
        return this.getFields().then(function (fields) {
            var matchFields = _.chain(fields)
                .map(function (field) {
                return {
                    index: field.toLowerCase().indexOf(fieldNameLC),
                    field: field + ':'
                };
            })
                .filter(function (field) {
                return field.index != -1 && field.field.length > current.length;
            })
                .sortBy('index')
                .map(function (field) { return field.field; })
                .value();
            matchFields = _.first(matchFields, 5);
            return matchFields;
        });
    };
    FieldAddon.INDEX = 64;
    return FieldAddon;
}());
exports.FieldAddon = FieldAddon;


/***/ }),

/***/ 351:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
///<reference path='Omnibox.ts'/>
var OmniboxEvents_1 = __webpack_require__(30);
var Omnibox_1 = __webpack_require__(81);
var _ = __webpack_require__(0);
var QueryExtensionAddon = /** @class */ (function () {
    function QueryExtensionAddon(omnibox) {
        var _this = this;
        this.omnibox = omnibox;
        this.cache = {};
        this.omnibox.bind.on(this.omnibox.element, OmniboxEvents_1.OmniboxEvents.populateOmniboxSuggestions, function (args) {
            args.suggestions.push(_this.getSuggestion());
        });
    }
    QueryExtensionAddon.prototype.getSuggestion = function () {
        var _this = this;
        var hash = this.getHash(this.omnibox.magicBox);
        if (hash == null) {
            return null;
        }
        var hashString = this.hashToString(hash);
        if (this.cache[hashString] != null) {
            return this.hashValueToSuggestion(hash, this.cache[hashString]);
        }
        var values = hash.type == 'QueryExtensionName' ? this.names(hash.current) : this.attributeNames(hash.name, hash.current, hash.used);
        this.cache[hashString] = values;
        values.catch(function () {
            delete _this.cache[hashString];
        });
        return this.hashValueToSuggestion(hash, values);
    };
    QueryExtensionAddon.prototype.getHash = function (magicBox) {
        var queryExtension = _.last(magicBox.resultAtCursor('QueryExtension'));
        if (queryExtension != null) {
            var queryExtensionArgumentResults = queryExtension.findAll('QueryExtensionArgument');
            var current = _.last(magicBox.resultAtCursor('QueryExtensionName'));
            if (current != null) {
                return {
                    type: 'QueryExtensionName',
                    current: current.toString(),
                    before: current.before(),
                    after: current.after()
                };
            }
            current = _.last(magicBox.resultAtCursor('QueryExtensionArgumentName'));
            if (current != null) {
                var used = _.chain(queryExtensionArgumentResults)
                    .map(function (result) {
                    var name = result.find('QueryExtensionArgumentName');
                    return name && name.toString();
                })
                    .compact()
                    .value();
                var name = queryExtension.find('QueryExtensionName').toString();
                return {
                    type: 'QueryExtensionArgumentName',
                    current: current.toString(),
                    before: current.before(),
                    after: current.after(),
                    name: name,
                    used: used
                };
            }
        }
        return null;
    };
    QueryExtensionAddon.prototype.hashToString = function (hash) {
        if (hash == null) {
            return null;
        }
        return [hash.type, hash.current, hash.name || '', hash.used ? hash.used.join() : ''].join();
    };
    QueryExtensionAddon.prototype.hashValueToSuggestion = function (hash, promise) {
        return promise.then(function (values) {
            var suggestions = _.map(values, function (value, i) {
                return {
                    html: Omnibox_1.MagicBox.Utils.highlightText(value, hash.current, true),
                    text: hash.before + value + hash.after,
                    index: QueryExtensionAddon.INDEX - i / values.length
                };
            });
            return suggestions;
        });
    };
    QueryExtensionAddon.prototype.getExtensions = function () {
        if (this.extensions == null) {
            this.extensions = this.omnibox.queryController.getEndpoint().extensions();
        }
        return this.extensions;
    };
    QueryExtensionAddon.prototype.names = function (current) {
        var extensionName = current.toLowerCase();
        return this.getExtensions().then(function (extensions) {
            var matchExtensions = _.chain(extensions)
                .map(function (extension) {
                return {
                    index: extension.name.toLowerCase().indexOf(extensionName),
                    extension: extension.name
                };
            })
                .filter(function (extension) {
                return extension.index != -1 && extension.extension.length > extensionName.length;
            })
                .sortBy('index')
                .pluck('extension')
                .value();
            matchExtensions = _.first(matchExtensions, 5);
            return matchExtensions;
        });
    };
    QueryExtensionAddon.prototype.attributeNames = function (name, current, used) {
        return this.getExtensions().then(function (extensions) {
            var extension = _.find(extensions, function (extension) { return extension.name == name; });
            if (extension == null) {
                return [];
            }
            else {
                return _.filter(_.difference(extension.argumentNames, used), function (argumentName) { return argumentName.indexOf(current) == 0; });
            }
        });
    };
    QueryExtensionAddon.prototype.hash = function () {
        return;
    };
    QueryExtensionAddon.INDEX = 62;
    return QueryExtensionAddon;
}());
exports.QueryExtensionAddon = QueryExtensionAddon;


/***/ }),

/***/ 352:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(2);
var ComponentOptionsModel_1 = __webpack_require__(24);
var OmniboxEvents_1 = __webpack_require__(30);
var StringUtils_1 = __webpack_require__(18);
var SuggestionsCache_1 = __webpack_require__(325);
var _ = __webpack_require__(0);
var QuerySuggestAddon = /** @class */ (function () {
    function QuerySuggestAddon(omnibox) {
        var _this = this;
        this.omnibox = omnibox;
        this.cache = new SuggestionsCache_1.SuggestionsCache();
        Dom_1.$$(this.omnibox.element).on(OmniboxEvents_1.OmniboxEvents.populateOmniboxSuggestions, function (e, args) {
            args.suggestions.push(_this.getSuggestion());
        });
    }
    QuerySuggestAddon.suggestiontHtml = function (suggestion) {
        return suggestion.highlighted.replace(/\[(.*?)\]|\{(.*?)\}|\((.*?)\)/g, function (part, notMatched, matched, corrected) {
            var className = '';
            if (matched) {
                className = 'coveo-omnibox-hightlight';
            }
            if (corrected) {
                className = 'coveo-omnibox-hightlight2';
            }
            var ret;
            if (className) {
                ret = Dom_1.$$('span', {
                    className: className
                });
            }
            else {
                ret = Dom_1.$$('span');
            }
            ret.text(notMatched || matched || corrected);
            return ret.el.outerHTML;
        });
    };
    QuerySuggestAddon.isPartialMatch = function (suggestion) {
        // groups : 1=notMatched, 2=matched, 3=corrected
        var parts = StringUtils_1.StringUtils.match(suggestion.highlighted, /\[(.*?)\]|\{(.*?)\}|\((.*?)\)/g);
        var firstFail = _.find(parts, function (part) { return part[1] != null; });
        // if no fail found, this is a partial or a full match
        if (firstFail == null) {
            return true;
        }
        // if all right parts are notMatched, the right parts is autocomplete
        return _.every(_.last(parts, _.indexOf(parts, firstFail) - parts.length), function (part) { return part[1] != null; });
    };
    QuerySuggestAddon.prototype.getSuggestion = function () {
        var _this = this;
        var text = this.omnibox.magicBox.getText();
        return this.cache.getSuggestions(text, function () { return _this.getQuerySuggest(text); });
    };
    QuerySuggestAddon.prototype.getQuerySuggest = function (text) {
        var payload = { q: text };
        var locale = String['locale'];
        var searchHub = this.omnibox.getBindings().componentOptionsModel.get(ComponentOptionsModel_1.ComponentOptionsModel.attributesEnum.searchHub);
        var pipeline = this.omnibox.getBindings().searchInterface.options.pipeline;
        var enableWordCompletion = this.omnibox.options.enableSearchAsYouType;
        var context = this.omnibox.getBindings().searchInterface.getQueryContext();
        if (locale) {
            payload.locale = locale;
        }
        if (searchHub) {
            payload.searchHub = searchHub;
        }
        if (pipeline) {
            payload.pipeline = pipeline;
        }
        if (context) {
            payload.context = context;
        }
        payload.enableWordCompletion = enableWordCompletion;
        return this.omnibox.queryController
            .getEndpoint()
            .getQuerySuggest(payload)
            .then(function (result) {
            var completions = result.completions;
            var results = _.map(completions, function (completion, i) {
                return {
                    html: QuerySuggestAddon.suggestiontHtml(completion),
                    text: completion.expression,
                    index: QuerySuggestAddon.INDEX - i / completions.length,
                    partial: QuerySuggestAddon.isPartialMatch(completion),
                    executableConfidence: completion.executableConfidence
                };
            });
            return results;
        });
    };
    QuerySuggestAddon.INDEX = 60;
    return QuerySuggestAddon;
}());
exports.QuerySuggestAddon = QuerySuggestAddon;
var VoidQuerySuggestAddon = /** @class */ (function () {
    function VoidQuerySuggestAddon() {
    }
    VoidQuerySuggestAddon.prototype.getSuggestion = function () {
        return Promise.resolve([]);
    };
    return VoidQuerySuggestAddon;
}());
exports.VoidQuerySuggestAddon = VoidQuerySuggestAddon;


/***/ }),

/***/ 353:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var OmniboxEvents_1 = __webpack_require__(30);
var Dom_1 = __webpack_require__(2);
var Utils_1 = __webpack_require__(4);
var _ = __webpack_require__(0);
var OldOmniboxAddon = /** @class */ (function () {
    function OldOmniboxAddon(omnibox) {
        var _this = this;
        this.omnibox = omnibox;
        this.omnibox.bind.on(this.omnibox.element, OmniboxEvents_1.OmniboxEvents.populateOmniboxSuggestions, function (args) {
            _.each(_this.getSuggestion(), function (suggestion) {
                args.suggestions.push(suggestion);
            });
        });
    }
    OldOmniboxAddon.prototype.getSuggestion = function () {
        var text = this.omnibox.magicBox.getText();
        if (text.length == 0) {
            return null;
        }
        var eventArgs = this.buildPopulateOmniboxEventArgs();
        Dom_1.$$(this.omnibox.root).trigger(OmniboxEvents_1.OmniboxEvents.populateOmnibox, eventArgs);
        return this.rowsToSuggestions(eventArgs.rows);
    };
    OldOmniboxAddon.prototype.getCurrentQueryExpression = function () {
        var cursorPos = this.omnibox.getCursor();
        var value = this.omnibox.getText();
        var length = value.length;
        var start = cursorPos;
        var end = cursorPos;
        if (value[start] == ' ') {
            start--;
        }
        while (start > 0 && value[start] != ' ') {
            start--;
        }
        while (end < length && value[end] != ' ') {
            end++;
        }
        return value.substring(start, end);
    };
    OldOmniboxAddon.prototype.getRegexToSearch = function (strValue) {
        if (strValue == null) {
            strValue = this.omnibox.getText();
        }
        return new RegExp(Utils_1.Utils.escapeRegexCharacter(strValue), 'i');
    };
    OldOmniboxAddon.prototype.getQueryExpressionBreakDown = function () {
        var _this = this;
        var ret = [];
        var queryWords = this.omnibox.getText().split(' ');
        _.each(queryWords, function (word) {
            ret.push({
                word: word,
                regex: _this.getRegexToSearch(word)
            });
        });
        return ret;
    };
    OldOmniboxAddon.prototype.replace = function (searchValue, newValue) {
        this.omnibox.setText(this.omnibox.getText().replace(searchValue, newValue));
    };
    OldOmniboxAddon.prototype.clearCurrentExpression = function () {
        this.replace(this.getCurrentQueryExpression(), '');
    };
    OldOmniboxAddon.prototype.insertAt = function (at, toInsert) {
        var oldValue = this.omnibox.getText();
        var newValue = [oldValue.slice(0, at), toInsert, oldValue.slice(at)].join('');
        this.omnibox.setText(newValue);
    };
    OldOmniboxAddon.prototype.replaceCurrentExpression = function (newValue) {
        this.replace(this.getCurrentQueryExpression(), newValue);
    };
    OldOmniboxAddon.prototype.buildPopulateOmniboxEventArgs = function () {
        var _this = this;
        var currentQueryExpression = this.getCurrentQueryExpression();
        var ret = {
            rows: [],
            completeQueryExpression: {
                word: this.omnibox.getText(),
                regex: this.getRegexToSearch()
            },
            currentQueryExpression: {
                word: currentQueryExpression,
                regex: this.getRegexToSearch(currentQueryExpression)
            },
            allQueryExpressions: this.getQueryExpressionBreakDown(),
            cursorPosition: this.omnibox.getCursor(),
            clear: function () {
                _this.omnibox.clear();
            },
            clearCurrentExpression: function () {
                _this.clearCurrentExpression();
            },
            replace: function (searchValue, newValue) {
                _this.replace(searchValue, newValue);
            },
            replaceCurrentExpression: function (newValue) {
                _this.replaceCurrentExpression(newValue);
            },
            insertAt: function (at, toInsert) {
                _this.insertAt(at, toInsert);
            },
            closeOmnibox: function () {
                _this.omnibox.magicBox.blur();
            }
        };
        return ret;
    };
    OldOmniboxAddon.prototype.rowsToSuggestions = function (rows) {
        return _.map(rows, function (row) {
            if (!Utils_1.Utils.isNullOrUndefined(row.element)) {
                return new Promise(function (resolve) {
                    resolve([
                        {
                            dom: row.element,
                            index: row.zIndex
                        }
                    ]);
                });
            }
            else if (!Utils_1.Utils.isNullOrUndefined(row.deferred)) {
                return new Promise(function (resolve) {
                    row.deferred.then(function (row) {
                        if (row.element != null) {
                            resolve([
                                {
                                    dom: row.element,
                                    index: row.zIndex
                                }
                            ]);
                        }
                        else {
                            resolve(null);
                        }
                    });
                });
            }
            return null;
        });
    };
    return OldOmniboxAddon;
}());
exports.OldOmniboxAddon = OldOmniboxAddon;


/***/ }),

/***/ 354:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 443:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 81:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

///<reference path="FieldAddon.ts" />
///<reference path="QueryExtensionAddon.ts" />
///<reference path="QuerySuggestAddon.ts" />
///<reference path="OldOmniboxAddon.ts" />
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
var ComponentOptionsModel_1 = __webpack_require__(24);
exports.MagicBox = __webpack_require__(323);
var Component_1 = __webpack_require__(6);
var ComponentOptions_1 = __webpack_require__(7);
var QueryEvents_1 = __webpack_require__(10);
var StandaloneSearchInterfaceEvents_1 = __webpack_require__(68);
var Model_1 = __webpack_require__(16);
var QueryStateModel_1 = __webpack_require__(12);
var AnalyticsActionListMeta_1 = __webpack_require__(9);
var OmniboxEvents_1 = __webpack_require__(30);
var Dom_1 = __webpack_require__(2);
var Assert_1 = __webpack_require__(5);
var QueryStateModel_2 = __webpack_require__(12);
var Initialization_1 = __webpack_require__(1);
var Querybox_1 = __webpack_require__(94);
var FieldAddon_1 = __webpack_require__(350);
var QueryExtensionAddon_1 = __webpack_require__(351);
var QuerySuggestAddon_1 = __webpack_require__(352);
var OldOmniboxAddon_1 = __webpack_require__(353);
var QueryboxQueryParameters_1 = __webpack_require__(324);
var PendingSearchAsYouTypeSearchEvent_1 = __webpack_require__(87);
var Utils_1 = __webpack_require__(4);
var SearchInterface_1 = __webpack_require__(17);
var _ = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
__webpack_require__(354);
var SharedAnalyticsCalls_1 = __webpack_require__(84);
var MINIMUM_EXECUTABLE_CONFIDENCE = 0.8;
/**
 * The `Omnibox` component extends the [`Querybox`]{@link Querybox}, and thus provides the same basic options and
 * behaviors. Furthermore, the `Omnibox` adds a type-ahead capability to the search input.
 *
 * You can configure the type-ahead feature by enabling or disabling certain addons, which the Coveo JavaScript Search
 * Framework provides out-of-the-box (see the [`enableFieldAddon`]{@link Omnibox.options.enableFieldAddon},
 * [`enableQueryExtension`]{@link Omnibox.options.enableQueryExtensionAddon}, and
 * [`enableQuerySuggestAddon`]{@link Omnibox.options.enableQuerySuggestAddon} options).
 *
 * Custom components and external code can also extend or customize the type-ahead feature and the query completion
 * suggestions it provides by attaching their own handlers to the
 * [`populateOmniboxSuggestions`]{@link OmniboxEvents.populateOmniboxSuggestions`] event.
 *
 * See also the [`Searchbox`]{@link Searchbox} component, which can automatically instantiate an `Omnibox` along with an
 * optional {@link SearchButton}.
 */
var Omnibox = /** @class */ (function (_super) {
    __extends(Omnibox, _super);
    /**
     * Creates a new Omnibox component. Also enables necessary addons and binds events on various query events.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the Omnibox component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function Omnibox(element, options, bindings) {
        var _this = _super.call(this, element, Omnibox.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.partialQueries = [];
        _this.lastSuggestions = [];
        _this.movedOnce = false;
        _this.skipAutoSuggest = false;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, Omnibox, options);
        var originalValueForQuerySyntax = _this.options.enableQuerySyntax;
        _this.options = _.extend({}, _this.options, _this.componentOptionsModel.get(ComponentOptionsModel_1.ComponentOptionsModel.attributesEnum.searchBox));
        Dom_1.$$(_this.element).toggleClass('coveo-query-syntax-disabled', _this.options.enableQuerySyntax == false);
        _this.suggestionAddon = _this.options.enableQuerySuggestAddon ? new QuerySuggestAddon_1.QuerySuggestAddon(_this) : new QuerySuggestAddon_1.VoidQuerySuggestAddon();
        new OldOmniboxAddon_1.OldOmniboxAddon(_this);
        _this.createMagicBox();
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.buildingQuery, function (args) { return _this.handleBuildingQuery(args); });
        _this.bind.onRootElement(StandaloneSearchInterfaceEvents_1.StandaloneSearchInterfaceEvents.beforeRedirect, function () { return _this.handleBeforeRedirect(); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.querySuccess, function () { return _this.handleQuerySuccess(); });
        _this.bind.onQueryState(Model_1.MODEL_EVENTS.CHANGE_ONE, QueryStateModel_1.QUERY_STATE_ATTRIBUTES.Q, function (args) {
            return _this.handleQueryStateChanged(args);
        });
        if (_this.isAutoSuggestion()) {
            _this.bind.onRootElement(QueryEvents_1.QueryEvents.duringQuery, function (args) { return _this.handleDuringQuery(args); });
        }
        _this.bind.onComponentOptions(Model_1.MODEL_EVENTS.CHANGE_ONE, ComponentOptionsModel_1.COMPONENT_OPTIONS_ATTRIBUTES.SEARCH_BOX, function (args) {
            if (args.value.enableQuerySyntax != null) {
                _this.options.enableQuerySyntax = args.value.enableQuerySyntax;
            }
            else {
                _this.options.enableQuerySyntax = originalValueForQuerySyntax;
            }
            _this.updateGrammar();
        });
        return _this;
    }
    /**
     * Adds the current content of the input to the query and triggers a query if the current content of the input has
     * changed since last submit.
     *
     * Also logs a `searchboxSubmit` event in the usage analytics.
     */
    Omnibox.prototype.submit = function () {
        var _this = this;
        this.magicBox.clearSuggestion();
        this.updateQueryState();
        this.triggerNewQuery(false, function () {
            SharedAnalyticsCalls_1.logSearchBoxSubmitEvent(_this.usageAnalytics);
        });
        this.magicBox.blur();
    };
    /**
     * Gets the current content of the input.
     * @returns {string} The current content of the input.
     */
    Omnibox.prototype.getText = function () {
        return this.magicBox.getText();
    };
    /**
     * Sets the content of the input
     * @param text The string to set in the input.
     */
    Omnibox.prototype.setText = function (text) {
        this.magicBox.setText(text);
        this.updateQueryState();
    };
    /**
     * Clears the content of the input.
     */
    Omnibox.prototype.clear = function () {
        this.magicBox.clear();
    };
    /**
     * Gets the `HTMLInputElement` of the Omnibox.
     */
    Omnibox.prototype.getInput = function () {
        return this.magicBox.element.querySelector('input');
    };
    Omnibox.prototype.getResult = function () {
        return this.magicBox.getResult();
    };
    Omnibox.prototype.getDisplayedResult = function () {
        return this.magicBox.getDisplayedResult();
    };
    Omnibox.prototype.getCursor = function () {
        return this.magicBox.getCursor();
    };
    Omnibox.prototype.resultAtCursor = function (match) {
        return this.magicBox.resultAtCursor(match);
    };
    Omnibox.prototype.createGrammar = function () {
        var grammar = null;
        if (this.options.enableQuerySyntax) {
            grammar = exports.MagicBox.Grammars.Expressions(exports.MagicBox.Grammars.Complete);
            if (this.options.enableFieldAddon) {
                new FieldAddon_1.FieldAddon(this);
            }
            if (this.options.fieldAlias != null) {
                this.options.listOfFields = this.options.listOfFields || [];
                this.options.listOfFields = this.options.listOfFields.concat(_.keys(this.options.fieldAlias));
            }
            if (this.options.enableQueryExtensionAddon) {
                new QueryExtensionAddon_1.QueryExtensionAddon(this);
            }
        }
        else {
            grammar = { start: 'Any', expressions: { Any: /.*/ } };
        }
        if (this.options.grammar != null) {
            grammar = this.options.grammar(grammar);
        }
        return grammar;
    };
    Omnibox.prototype.updateGrammar = function () {
        var grammar = this.createGrammar();
        this.magicBox.grammar = new exports.MagicBox.Grammar(grammar.start, grammar.expressions);
        this.magicBox.setText(this.magicBox.getText());
    };
    Omnibox.prototype.createMagicBox = function () {
        var grammar = this.createGrammar();
        this.magicBox = exports.MagicBox.create(this.element, new exports.MagicBox.Grammar(grammar.start, grammar.expressions), {
            inline: this.options.inline,
            selectableSuggestionClass: 'coveo-omnibox-selectable',
            selectedSuggestionClass: 'coveo-omnibox-selected',
            suggestionTimeout: this.options.omniboxTimeout
        });
        this.setupMagicBox();
    };
    Omnibox.prototype.setupMagicBox = function () {
        var _this = this;
        this.magicBox.onmove = function () {
            // We assume that once the user has moved its selection, it becomes an explicit omnibox analytics event
            if (_this.isAutoSuggestion()) {
                _this.modifyEventTo = _this.getOmniboxAnalyticsEventCause();
            }
            _this.movedOnce = true;
        };
        this.magicBox.onfocus = function () {
            if (_this.isAutoSuggestion()) {
                // This flag is used to block the automatic query when the UI is loaded with a query (#q=foo)
                // and then the input is focused. We want to block that query, even if it match the suggestion
                // Only when there is an actual change in the input (user typing something) is when we want the automatic query to kick in
                _this.skipAutoSuggest = true;
            }
        };
        this.magicBox.onsuggestions = function (suggestions) {
            // If text is empty, this can mean that user selected text from the search box
            // and hit "delete" : Reset the partial queries in this case
            if (Utils_1.Utils.isEmptyString(_this.getText())) {
                _this.partialQueries = [];
            }
            _this.movedOnce = false;
            _this.lastSuggestions = suggestions;
            if (_this.isAutoSuggestion() && !_this.skipAutoSuggest) {
                _this.searchAsYouType();
            }
        };
        if (this.options.enableSearchAsYouType) {
            Dom_1.$$(this.element).addClass('coveo-magicbox-search-as-you-type');
        }
        this.magicBox.onchange = function () {
            _this.skipAutoSuggest = false;
            var text = _this.getText();
            if (text != undefined && text != '') {
                if (_this.isAutoSuggestion()) {
                    if (_this.movedOnce) {
                        _this.searchAsYouType(true);
                    }
                }
                else if (_this.options.enableSearchAsYouType) {
                    _this.searchAsYouType(true);
                }
            }
            else {
                _this.clear();
            }
        };
        if (this.options.placeholder) {
            this.magicBox.element.querySelector('input').placeholder = this.options.placeholder;
        }
        this.magicBox.onsubmit = function () { return _this.submit(); };
        this.magicBox.onselect = function (suggestion) {
            var index = _.indexOf(_this.lastSuggestions, suggestion);
            var suggestions = _.compact(_.map(_this.lastSuggestions, function (suggestion) { return suggestion.text; }));
            _this.magicBox.clearSuggestion();
            _this.updateQueryState();
            // A bit tricky here : When it's machine learning auto suggestions
            // the mouse selection and keyboard selection acts differently :
            // keyboard selection will automatically do the query (which will log a search as you type event -> further modified by this.modifyEventTo if needed)
            // mouse selection will not "auto" send the query.
            // the movedOnce variable detect the keyboard movement, and is used to differentiate mouse vs keyboard
            if (!_this.isAutoSuggestion()) {
                _this.usageAnalytics.cancelAllPendingEvents();
                _this.triggerNewQuery(false, function () {
                    _this.usageAnalytics.logSearchEvent(_this.getOmniboxAnalyticsEventCause(), _this.buildCustomDataForPartialQueries(index, suggestions));
                });
            }
            else if (_this.isAutoSuggestion() && _this.movedOnce) {
                _this.handleAutoSuggestionWithKeyboard(index, suggestions);
            }
            else if (_this.isAutoSuggestion() && !_this.movedOnce) {
                _this.handleAutoSuggestionsWithMouse(index, suggestions);
            }
            // Consider a selection like a reset of the partial queries (it's the end of a suggestion pattern)
            if (_this.isAutoSuggestion()) {
                _this.partialQueries = [];
            }
        };
        this.magicBox.onblur = function () {
            if (_this.isAutoSuggestion()) {
                _this.setText(_this.getQuery(true));
                _this.usageAnalytics.sendAllPendingEvents();
            }
        };
        this.magicBox.onclear = function () {
            _this.updateQueryState();
            if (_this.options.triggerQueryOnClear || _this.options.enableSearchAsYouType) {
                _this.triggerNewQuery(false, function () {
                    _this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.searchboxClear, {});
                });
            }
        };
        this.magicBox.ontabpress = function () {
            _this.handleTabPress();
        };
        this.magicBox.getSuggestions = function () { return _this.handleSuggestions(); };
    };
    Omnibox.prototype.handleAutoSuggestionWithKeyboard = function (index, suggestions) {
        var _this = this;
        if (this.searchAsYouTypeTimeout) {
            // Here, there is currently a search as you typed queued up :
            // Think : user typed very quickly, then very quickly selected a suggestion (without waiting for the search as you type)
            // Cancel the search as you type query, then immediately do the query with the selection (+analytics event with the selection)
            this.usageAnalytics.cancelAllPendingEvents();
            clearTimeout(this.searchAsYouTypeTimeout);
            this.searchAsYouTypeTimeout = undefined;
            this.triggerNewQuery(false, function () {
                _this.usageAnalytics.logSearchEvent(_this.getOmniboxAnalyticsEventCause(), _this.buildCustomDataForPartialQueries(index, suggestions));
            });
        }
        else {
            // Here, the search as you type query has returned, but the analytics event has not ye been sent.
            // Think : user typed slowly, the query returned, and then the user selected a suggestion.
            // Since the analytics event has not yet been sent (search as you type event have a 5 sec delay)
            // modify the pending event, then send the newly modified analytics event immediately.
            this.modifyEventTo = this.getOmniboxAnalyticsEventCause();
            this.modifyCustomDataOnPending(index, suggestions);
            this.modifyQueryContentOnPending();
            this.usageAnalytics.sendAllPendingEvents();
        }
    };
    Omnibox.prototype.handleAutoSuggestionsWithMouse = function (index, suggestions) {
        var _this = this;
        if (this.searchAsYouTypeTimeout || index != 0) {
            // Here : the user either very quickly chose the first suggestion, and the search as you type is still queued up.
            // OR
            // the user chose something different then the first suggestion.
            // Remove the search as you type if it's there, and do the query with the suggestion directly.
            this.clearSearchAsYouType();
            this.usageAnalytics.cancelAllPendingEvents();
            this.triggerNewQuery(false, function () {
                _this.usageAnalytics.logSearchEvent(_this.getOmniboxAnalyticsEventCause(), _this.buildCustomDataForPartialQueries(index, suggestions));
            });
        }
        else {
            // Here : the user either very slowly chose a suggestion, and there is no search as you typed queued up
            // AND
            // the user chose the first suggestion.
            // this means the query is already returned, but the analytics event is still queued up.
            // modify the analytics event, and send it.
            this.modifyEventTo = this.getOmniboxAnalyticsEventCause();
            this.modifyCustomDataOnPending(index, suggestions);
            this.modifyQueryContentOnPending();
            this.usageAnalytics.sendAllPendingEvents();
            // This should happen if :
            // users did a (short) query first, which does not match the first suggestion. (eg: typed "t", then search)
            // then, refocus the search box. The same suggestion(s) will re-appear.
            // By selecting the first one with the mouse, we need to retrigger a query because this means the search as you type could not
            // kick in and do the query automatically.
            if (this.lastQuery != this.getText()) {
                this.triggerNewQuery(false, function () {
                    _this.usageAnalytics.logSearchEvent(_this.getOmniboxAnalyticsEventCause(), _this.buildCustomDataForPartialQueries(index, suggestions));
                });
            }
        }
    };
    Omnibox.prototype.modifyCustomDataOnPending = function (index, suggestions) {
        var pendingEvt = this.usageAnalytics.getPendingSearchEvent();
        if (pendingEvt instanceof PendingSearchAsYouTypeSearchEvent_1.PendingSearchAsYouTypeSearchEvent) {
            var newCustomData_1 = this.buildCustomDataForPartialQueries(index, suggestions);
            _.each(_.keys(newCustomData_1), function (k) {
                pendingEvt.modifyCustomData(k, newCustomData_1[k]);
            });
        }
    };
    Omnibox.prototype.modifyQueryContentOnPending = function () {
        var pendingEvt = this.usageAnalytics.getPendingSearchEvent();
        if (pendingEvt instanceof PendingSearchAsYouTypeSearchEvent_1.PendingSearchAsYouTypeSearchEvent) {
            var queryContent = this.getQuery(this.options.enableSearchAsYouType);
            pendingEvt.modifyQueryContent(queryContent);
        }
    };
    Omnibox.prototype.buildCustomDataForPartialQueries = function (index, suggestions) {
        return {
            partialQueries: this.cleanCustomData(this.partialQueries),
            suggestionRanking: index,
            suggestions: this.cleanCustomData(suggestions),
            partialQuery: _.last(this.partialQueries)
        };
    };
    Omnibox.prototype.cleanCustomData = function (toClean, rejectLength) {
        if (rejectLength === void 0) { rejectLength = 256; }
        // Filter out only consecutive values that are the identical
        toClean = _.compact(_.filter(toClean, function (partial, pos, array) {
            return pos === 0 || partial !== array[pos - 1];
        }));
        // Custom dimensions cannot be an array in analytics service: Send a string joined by ; instead.
        // Need to replace ;
        toClean = _.map(toClean, function (partial) {
            return partial.replace(/;/g, '');
        });
        // Reduce right to get the last X words that adds to less then rejectLength
        var reducedToRejectLengthOrLess = [];
        _.reduceRight(toClean, function (memo, partial) {
            var totalSoFar = memo + partial.length;
            if (totalSoFar <= rejectLength) {
                reducedToRejectLengthOrLess.push(partial);
            }
            return totalSoFar;
        }, 0);
        toClean = reducedToRejectLengthOrLess.reverse();
        var ret = toClean.join(';');
        // analytics service can store max 256 char in a custom event
        // if we're over that, call cleanup again with an arbitrary 10 less char accepted
        if (ret.length >= 256) {
            return this.cleanCustomData(toClean, rejectLength - 10);
        }
        return toClean.join(';');
    };
    Omnibox.prototype.handleSuggestions = function () {
        var suggestionsEventArgs = {
            suggestions: [],
            omnibox: this
        };
        this.bind.trigger(this.element, OmniboxEvents_1.OmniboxEvents.populateOmniboxSuggestions, suggestionsEventArgs);
        var text = this.getText();
        if (!Utils_1.Utils.isNullOrEmptyString(text)) {
            this.partialQueries.push(text);
        }
        return _.compact(suggestionsEventArgs.suggestions);
    };
    Omnibox.prototype.handleBeforeRedirect = function () {
        this.updateQueryState();
    };
    Omnibox.prototype.handleBuildingQuery = function (data) {
        var _this = this;
        Assert_1.Assert.exists(data);
        Assert_1.Assert.exists(data.queryBuilder);
        this.updateQueryState();
        this.lastQuery = this.getQuery(data.searchAsYouType);
        var result = this.lastQuery == this.magicBox.getDisplayedResult().input
            ? this.magicBox.getDisplayedResult().clone()
            : this.magicBox.grammar.parse(this.lastQuery).clean();
        var preprocessResultForQueryArgs = {
            result: result
        };
        if (this.options.enableQuerySyntax) {
            var notQuotedValues = preprocessResultForQueryArgs.result.findAll('FieldValueNotQuoted');
            _.each(notQuotedValues, function (value) { return (value.value = '"' + value.value.replace(/"|\u00A0/g, ' ') + '"'); });
            if (this.options.fieldAlias) {
                var fieldNames = preprocessResultForQueryArgs.result.findAll(function (result) { return result.expression.id == 'FieldName' && result.isSuccess(); });
                _.each(fieldNames, function (result) {
                    var alias = _.find(_.keys(_this.options.fieldAlias), function (alias) { return alias.toLowerCase() == result.value.toLowerCase(); });
                    if (alias != null) {
                        result.value = _this.options.fieldAlias[alias];
                    }
                });
            }
        }
        this.bind.trigger(this.element, OmniboxEvents_1.OmniboxEvents.omniboxPreprocessResultForQuery, preprocessResultForQueryArgs);
        var query = preprocessResultForQueryArgs.result.toString();
        new QueryboxQueryParameters_1.QueryboxQueryParameters(this.options).addParameters(data.queryBuilder, query);
    };
    Omnibox.prototype.handleTabPress = function () {
        if (this.options.enableQuerySuggestAddon) {
            this.handleTabPressForSuggestions();
        }
        this.handleTabPressForOldOmniboxAddon();
    };
    Omnibox.prototype.handleTabPressForSuggestions = function () {
        if (!this.options.enableSearchAsYouType) {
            var suggestions = _.compact(_.map(this.lastSuggestions, function (suggestion) { return suggestion.text; }));
            this.usageAnalytics.logCustomEvent(this.getOmniboxAnalyticsEventCause(), this.buildCustomDataForPartialQueries(0, suggestions), this.element);
        }
        else {
            this.setText(this.getQuery(true));
        }
    };
    Omnibox.prototype.handleTabPressForOldOmniboxAddon = function () {
        var domSuggestions = this.lastSuggestions.filter(function (suggestions) { return suggestions.dom; }).map(function (suggestions) { return Dom_1.$$(suggestions.dom); });
        var selected = this.findAllElementsWithClass(domSuggestions, '.coveo-omnibox-selected');
        if (selected.length > 0) {
            Dom_1.$$(selected[0]).trigger('tabSelect');
        }
        else if (!this.options.enableQuerySuggestAddon) {
            var selectable = this.findAllElementsWithClass(domSuggestions, '.coveo-omnibox-selectable');
            if (selectable.length > 0) {
                Dom_1.$$(selectable[0]).trigger('tabSelect');
            }
        }
    };
    Omnibox.prototype.findAllElementsWithClass = function (elements, className) {
        return elements
            .map(function (element) { return element.find(className); })
            .filter(function (s) { return s; })
            .reduce(function (total, s) { return total.concat(s); }, []);
    };
    Omnibox.prototype.triggerNewQuery = function (searchAsYouType, analyticsEvent) {
        clearTimeout(this.searchAsYouTypeTimeout);
        var text = this.getQuery(searchAsYouType);
        if (this.shouldExecuteQuery(searchAsYouType)) {
            this.lastQuery = text;
            analyticsEvent();
            this.queryController.executeQuery({
                searchAsYouType: searchAsYouType,
                logInActionsHistory: true
            });
        }
    };
    Omnibox.prototype.getQuery = function (searchAsYouType) {
        if (this.lastQuery == this.magicBox.getText()) {
            return this.lastQuery;
        }
        if (!searchAsYouType) {
            return this.magicBox.getText();
        }
        var wordCompletion = this.magicBox.getWordCompletion();
        if (wordCompletion != null) {
            return wordCompletion;
        }
        return this.magicBox.getWordCompletion() || this.getFirstSuggestion() || this.lastQuery || this.magicBox.getText();
    };
    Omnibox.prototype.getFirstSuggestion = function () {
        if (this.lastSuggestions == null) {
            return '';
        }
        if (this.lastSuggestions.length <= 0) {
            return '';
        }
        var textSuggestion = _.find(this.lastSuggestions, function (suggestion) { return suggestion.text != null; });
        if (textSuggestion == null) {
            return '';
        }
        return textSuggestion.text;
    };
    Omnibox.prototype.updateQueryState = function () {
        this.queryStateModel.set(QueryStateModel_2.QueryStateModel.attributesEnum.q, this.magicBox.getText());
    };
    Omnibox.prototype.handleQueryStateChanged = function (args) {
        Assert_1.Assert.exists(args);
        var q = args.value;
        if (q != this.magicBox.getText()) {
            this.magicBox.setText(q);
        }
    };
    Omnibox.prototype.handleQuerySuccess = function () {
        if (!this.isAutoSuggestion()) {
            this.partialQueries = [];
        }
    };
    Omnibox.prototype.handleDuringQuery = function (args) {
        var _this = this;
        // When the query results returns ... (args.promise)
        args.promise.then(function () {
            // Get a handle on a pending search as you type (those events are delayed, not sent instantly)
            var pendingEvent = _this.usageAnalytics.getPendingSearchEvent();
            if (pendingEvent instanceof PendingSearchAsYouTypeSearchEvent_1.PendingSearchAsYouTypeSearchEvent) {
                pendingEvent.beforeResolve.then(function (evt) {
                    // Check if we need to modify the event type beforeResolving it
                    args.promise.then(function () {
                        if (_this.modifyEventTo) {
                            evt.modifyEventCause(_this.modifyEventTo);
                            _this.modifyEventTo = null;
                        }
                    });
                });
            }
        });
    };
    Omnibox.prototype.searchAsYouType = function (forceExecuteQuery) {
        var _this = this;
        if (forceExecuteQuery === void 0) { forceExecuteQuery = false; }
        this.clearSearchAsYouType();
        if (this.shouldExecuteQuery(true)) {
            this.searchAsYouTypeTimeout = window.setTimeout(function () {
                if (_this.suggestionShouldTriggerQuery() || forceExecuteQuery) {
                    var suggestions_1 = _.map(_this.lastSuggestions, function (suggestion) { return suggestion.text; });
                    var index_1 = _.indexOf(suggestions_1, _this.magicBox.getWordCompletion());
                    _this.triggerNewQuery(true, function () {
                        _this.usageAnalytics.logSearchAsYouType(AnalyticsActionListMeta_1.analyticsActionCauseList.searchboxAsYouType, _this.buildCustomDataForPartialQueries(index_1, suggestions_1));
                    });
                    _this.clearSearchAsYouType();
                }
            }, this.options.searchAsYouTypeDelay);
        }
    };
    Omnibox.prototype.isAutoSuggestion = function () {
        return this.options.enableSearchAsYouType && this.options.enableQuerySuggestAddon;
    };
    Omnibox.prototype.shouldExecuteQuery = function (searchAsYouType) {
        var text = this.getQuery(searchAsYouType);
        return this.lastQuery != text && text != null;
    };
    Omnibox.prototype.suggestionShouldTriggerQuery = function (suggestions) {
        if (suggestions === void 0) { suggestions = this.lastSuggestions; }
        if (this.shouldExecuteQuery(true)) {
            if (suggestions && suggestions[0]) {
                var suggestion = suggestions[0];
                // If we have access to a confidence level, return true if we are equal or above the minimum confidence level.
                if (suggestion && suggestion.executableConfidence != undefined) {
                    return suggestion.executableConfidence >= MINIMUM_EXECUTABLE_CONFIDENCE;
                }
                // If we don't have access to a confidence level, return true only if it "starts with" the content of the search box
                if (suggestion.text && suggestion.text.indexOf(this.magicBox.getText()) == 0) {
                    return true;
                }
            }
        }
        return false;
    };
    Omnibox.prototype.clearSearchAsYouType = function () {
        clearTimeout(this.searchAsYouTypeTimeout);
        this.searchAsYouTypeTimeout = undefined;
    };
    Omnibox.prototype.getOmniboxAnalyticsEventCause = function () {
        if (this.searchInterface instanceof SearchInterface_1.StandaloneSearchInterface) {
            return AnalyticsActionListMeta_1.analyticsActionCauseList.omniboxFromLink;
        }
        return AnalyticsActionListMeta_1.analyticsActionCauseList.omniboxAnalytics;
    };
    Omnibox.ID = 'Omnibox';
    Omnibox.doExport = function () {
        GlobalExports_1.exportGlobally({
            Omnibox: Omnibox,
            MagicBox: exports.MagicBox,
            QueryboxQueryParameters: QueryboxQueryParameters_1.QueryboxQueryParameters
        });
    };
    /**
     * The options for the omnibox
     * @componentOptions
     */
    Omnibox.options = {
        /**
         * Specifies whether query completion suggestions appearing in the `Omnibox` should push the result list and facets
         * down, rather than rendering themselves over them (and partially hiding them).
         *
         * Set this option as well as {@link Omnibox.options.enableSearchAsYouType} and
         * {@link Omnibox.options.enableQuerySuggestAddon} to `true` for a cool effect!
         *
         * Default value is `false`.
         */
        inline: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        /**
         * Whether to automatically trigger a new query whenever the end user types additional text in the search box input.
         *
         * See also the [`searchAsYouTypeDelay`]{@link Omnibox.options.searchAsYouTypeDelay} option.
         *
         * **Note:**
         * > If you set this option and the [`enableQuerySuggestAddon`]{@link Omnibox.options.enableQuerySuggestAddon}
         * > option to `true`, the query suggestion feature returns the auto-completion of the currently typed keyword as
         * > its first suggestion.
         *
         * Default value is `false`.
         */
        enableSearchAsYouType: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'SearchAsYouType' }),
        /**
         * If {@link Omnibox.options.enableSearchAsYouType} is `true`, specifies the delay (in milliseconds) before
         * triggering a new query when the end user types in the `Omnibox`.
         *
         * Default value is `2000`. Minimum value is `0`.
         */
        searchAsYouTypeDelay: ComponentOptions_1.ComponentOptions.buildNumberOption({
            defaultValue: 2000,
            min: 0,
            depend: 'enableSearchAsYouType',
            section: 'SearchAsYouType'
        }),
        /**
         * The `field` addon makes the `Omnibox` highlight and complete field syntax. Setting this option to `true` automatically sets
         * the [enableQuerySyntax]{@link Querybox.options.enableQuerySyntax} option to `true` as a side effect.
         *
         * **Example:**
         * > Suppose you want to search for PDF files. You start typing `@f` in the search box. The `Omnibox` provides
         * > you with several matching fields. You select the `@filetype` field. Then, you start typing `=p` in the input.
         * > This time, the `Omnibox` provides you with several matching values for the `@filetype` field. You select the
         * > `pdf` suggestion, and submit your search request. Since the `enableQuerySyntax` option is set to `true`, the
         * > Coveo Search API interprets the basic expression as query syntax and returns the items whose `@filetype` field
         * > matches the `pdf` value.
         *
         * Default value is `false`.
         */
        enableFieldAddon: ComponentOptions_1.ComponentOptions.buildBooleanOption({
            defaultValue: false,
            depend: 'enableQuerySyntax',
            postProcessing: function (value, options) {
                if (value) {
                    options.enableQuerySyntax = true;
                }
                return value;
            },
            section: 'QuerySyntax'
        }),
        enableSimpleFieldAddon: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false, depend: 'enableFieldAddon' }),
        listOfFields: ComponentOptions_1.ComponentOptions.buildFieldsOption({ depend: 'enableFieldAddon' }),
        /**
         * Whether to display Coveo Machine Learning (Coveo ML) query suggestions in the `Omnibox`.
         *
         * The corresponding Coveo ML model must be properly configured in your Coveo Cloud organization, otherwise this
         * option has no effect (see
         * [Managing Machine Learning Query Suggestions in a Query Pipeline](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=168)).
         *
         * **Note:**
         * > When you set this option and the [`enableSearchAsYouType`]{@link Omnibox.options.enableSearchAsYouType} option
         * > to `true`, the query suggestion feature returns the auto-completion of the currently typed keyword as its first
         * > query suggestion.
         *
         * Default value is `true`.
         */
        enableQuerySuggestAddon: ComponentOptions_1.ComponentOptions.buildBooleanOption({
            defaultValue: true,
            alias: ['enableTopQueryAddon', 'enableRevealQuerySuggestAddon']
        }),
        /**
         * If {@link Querybox.options.enableQuerySyntax} is `true`, specifies whether to enable the `query extension` addon.
         *
         * The `query extension` addon allows the Omnibox to complete the syntax for query extensions.
         *
         * Default value is `false`.
         */
        enableQueryExtensionAddon: ComponentOptions_1.ComponentOptions.buildBooleanOption({
            defaultValue: false,
            depend: 'enableQuerySyntax',
            postProcessing: function (value, options) {
                if (value) {
                    options.enableQuerySyntax = true;
                }
                return value;
            },
            section: 'QuerySyntax'
        }),
        /**
         * Specifies a placeholder for the input.
         */
        placeholder: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption(),
        /**
         * Specifies a timeout (in milliseconds) before rejecting suggestions in the Omnibox.
         *
         * Default value is `2000`. Minimum value is `0`.
         */
        omniboxTimeout: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 2000, min: 0 }),
        /**
         * Specifies whether the Coveo Platform should try to interpret special query syntax such as field references in the
         * query that the user enters in the Querybox (see
         * [Coveo Query Syntax Reference](http://www.coveo.com/go?dest=adminhelp70&lcid=9&context=10005)).
         *
         * Setting this option to `true` also causes the query syntax in the Querybox to highlight.
         *
         * Default value is `false`.
         */
        enableQuerySyntax: ComponentOptions_1.ComponentOptions.buildBooleanOption({
            defaultValue: false,
            section: 'QuerySyntax'
        })
    };
    return Omnibox;
}(Component_1.Component));
exports.Omnibox = Omnibox;
Omnibox.options = _.extend({}, Omnibox.options, Querybox_1.Querybox.options);
Initialization_1.Initialization.registerAutoCreateComponent(Omnibox);


/***/ }),

/***/ 94:
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
var ComponentOptionsModel_1 = __webpack_require__(24);
exports.MagicBox = __webpack_require__(323);
var Initialization_1 = __webpack_require__(1);
var Component_1 = __webpack_require__(6);
var ComponentOptions_1 = __webpack_require__(7);
var QueryEvents_1 = __webpack_require__(10);
var Model_1 = __webpack_require__(16);
var QueryStateModel_1 = __webpack_require__(12);
var StandaloneSearchInterfaceEvents_1 = __webpack_require__(68);
var AnalyticsActionListMeta_1 = __webpack_require__(9);
var Dom_1 = __webpack_require__(2);
var Assert_1 = __webpack_require__(5);
var QueryboxQueryParameters_1 = __webpack_require__(324);
var _ = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
/**
 * The `Querybox` component renders an input which the end user can interact with to enter and submit queries.
 *
 * When the end user submits a search request, the `Querybox` component triggers a query and logs the corresponding
 * usage analytics data.
 *
 * For technical reasons, it is necessary to instantiate this component on a `div` element rather than on an `input`
 * element.
 *
 * See also the [`Searchbox`]{@link Searchbox} component, which can automatically instantiate a `Querybox` along with an
 * optional [`SearchButton`]{@link SearchButton} component.
 */
var Querybox = /** @class */ (function (_super) {
    __extends(Querybox, _super);
    /**
     * Creates a new `Querybox component`. Creates a new `Coveo.Magicbox` instance and wraps the Magicbox methods
     * (`onblur`, `onsubmit` etc.). Binds event on `buildingQuery` and before redirection (for standalone box).
     * @param element The HTMLElement on which to instantiate the component. This cannot be an HTMLInputElement for
     * technical reasons.
     * @param options The options for the `Querybox` component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function Querybox(element, options, bindings) {
        var _this = _super.call(this, element, Querybox.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        if (element instanceof HTMLInputElement) {
            _this.logger.error('Querybox cannot be used on an HTMLInputElement');
        }
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, Querybox, options);
        _this.options = _.extend({}, _this.options, _this.componentOptionsModel.get(ComponentOptionsModel_1.ComponentOptionsModel.attributesEnum.searchBox));
        Dom_1.$$(_this.element).toggleClass('coveo-query-syntax-disabled', _this.options.enableQuerySyntax == false);
        _this.magicBox = exports.MagicBox.create(element, new exports.MagicBox.Grammar('Query', {
            Query: '[Term*][Spaces?]',
            Term: '[Spaces?][Word]',
            Spaces: / +/,
            Word: /[^ ]+/
        }), {
            inline: true
        });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.buildingQuery, function (args) { return _this.handleBuildingQuery(args); });
        _this.bind.onRootElement(StandaloneSearchInterfaceEvents_1.StandaloneSearchInterfaceEvents.beforeRedirect, function () { return _this.updateQueryState(); });
        _this.bind.onQueryState(Model_1.MODEL_EVENTS.CHANGE_ONE, QueryStateModel_1.QUERY_STATE_ATTRIBUTES.Q, function (args) {
            return _this.handleQueryStateChanged(args);
        });
        if (_this.options.enableSearchAsYouType) {
            Dom_1.$$(_this.element).addClass('coveo-search-as-you-type');
            _this.magicBox.onchange = function () {
                _this.searchAsYouType();
            };
        }
        _this.magicBox.onsubmit = function () {
            _this.submit();
        };
        _this.magicBox.onblur = function () {
            _this.updateQueryState();
        };
        _this.magicBox.onclear = function () {
            _this.updateQueryState();
            if (_this.options.triggerQueryOnClear) {
                _this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.searchboxClear, {});
                _this.triggerNewQuery(false);
            }
        };
        return _this;
    }
    /**
     * Adds the current content of the input to the query and triggers a query if the current content of the input has
     * changed since last submit.
     *
     * Also logs the `serachboxSubmit` event in the usage analytics.
     */
    Querybox.prototype.submit = function () {
        this.magicBox.clearSuggestion();
        this.updateQueryState();
        this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.searchboxSubmit, {});
        this.triggerNewQuery(false);
    };
    /**
     * Sets the content of the input.
     *
     * @param text The string to set in the input.
     */
    Querybox.prototype.setText = function (text) {
        this.magicBox.setText(text);
        this.updateQueryState();
    };
    /**
     * Clears the content of the input.
     *
     * See also the [`triggerQueryOnClear`]{@link Querybox.options.triggerQueryOnClear} option.
     */
    Querybox.prototype.clear = function () {
        this.magicBox.clear();
    };
    /**
     * Gets the content of the input.
     *
     * @returns {string} The content of the input.
     */
    Querybox.prototype.getText = function () {
        return this.magicBox.getText();
    };
    /**
     * Gets the result from the input.
     *
     * @returns {Result} The result.
     */
    Querybox.prototype.getResult = function () {
        return this.magicBox.getResult();
    };
    /**
     * Gets the displayed result from the input.
     *
     * @returns {Result} The displayed result.
     */
    Querybox.prototype.getDisplayedResult = function () {
        return this.magicBox.getDisplayedResult();
    };
    /**
     * Gets the current cursor position in the input.
     *
     * @returns {number} The cursor position (index starts at 0).
     */
    Querybox.prototype.getCursor = function () {
        return this.magicBox.getCursor();
    };
    /**
     * Gets the result at cursor position.
     *
     * @param match {string | { (result): boolean }} The match condition.
     *
     * @returns {Result[]} The result.
     */
    Querybox.prototype.resultAtCursor = function (match) {
        return this.magicBox.resultAtCursor(match);
    };
    Querybox.prototype.handleBuildingQuery = function (args) {
        Assert_1.Assert.exists(args);
        Assert_1.Assert.exists(args.queryBuilder);
        this.updateQueryState();
        this.lastQuery = this.magicBox.getText();
        new QueryboxQueryParameters_1.QueryboxQueryParameters(this.options).addParameters(args.queryBuilder, this.lastQuery);
    };
    Querybox.prototype.triggerNewQuery = function (searchAsYouType) {
        clearTimeout(this.searchAsYouTypeTimeout);
        var text = this.magicBox.getText();
        if (this.lastQuery != text && text != null) {
            this.lastQuery = text;
            this.queryController.executeQuery({
                searchAsYouType: searchAsYouType,
                logInActionsHistory: true
            });
        }
    };
    Querybox.prototype.updateQueryState = function () {
        this.queryStateModel.set(QueryStateModel_1.QueryStateModel.attributesEnum.q, this.magicBox.getText());
    };
    Querybox.prototype.handleQueryStateChanged = function (args) {
        Assert_1.Assert.exists(args);
        var q = args.value;
        if (q != this.magicBox.getText()) {
            this.magicBox.setText(q);
        }
    };
    Querybox.prototype.searchAsYouType = function () {
        var _this = this;
        clearTimeout(this.searchAsYouTypeTimeout);
        this.searchAsYouTypeTimeout = window.setTimeout(function () {
            _this.usageAnalytics.logSearchAsYouType(AnalyticsActionListMeta_1.analyticsActionCauseList.searchboxAsYouType, {});
            _this.triggerNewQuery(true);
        }, this.options.searchAsYouTypeDelay);
    };
    Querybox.ID = 'Querybox';
    Querybox.doExport = function () {
        GlobalExports_1.exportGlobally({
            Querybox: Querybox,
            MagicBox: exports.MagicBox,
            QueryboxQueryParameters: QueryboxQueryParameters_1.QueryboxQueryParameters
        });
    };
    /**
     * The options for the Querybox.
     * @componentOptions
     */
    Querybox.options = {
        /**
         * Specifies whether to enable the search-as-you-type feature.
         *
         * Default value is `false`.
         */
        enableSearchAsYouType: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'SearchAsYouType' }),
        /**
         * If the [`enableSearchAsYouType`]{@link Querybox.options.enableSearchAsYouType} option is `true`, specifies how
         * long to wait (in milliseconds) between each key press before triggering a new query.
         *
         * Default value is `50`. Minimum value is `0`
         */
        searchAsYouTypeDelay: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 50, min: 0, section: 'SearchAsYouType' }),
        /**
         * Specifies whether to interpret special query syntax (e.g., `@objecttype=message`) when the end user types
         * a query in the `Querybox` (see
         * [Coveo Query Syntax Reference](http://www.coveo.com/go?dest=adminhelp70&lcid=9&context=10005)). Setting this
         * option to `true` also causes the `Querybox` to highlight any query syntax.
         *
         * Regardless of the value of this option, the Coveo Cloud REST Search API always interprets expressions surrounded
         * by double quotes (`"`) as exact phrase match requests.
         *
         * See also [`enableLowercaseOperators`]{@link Querybox.options.enableLowercaseOperators}.
         *
         * **Notes:**
         * > * End user preferences can override the value you specify for this option.
         * >
         * > If the end user selects a value other than **Automatic** for the **Enable query syntax** setting (see
         * > the [`enableQuerySyntax`]{@link ResultsPreferences.options.enableQuerySyntax} option of the
         * > [`ResultsPreferences`]{@link ResultsPreferences} component), the end user preference takes precedence over this
         * > option.
         * >
         * > * On-premises versions of the Coveo Search API require this option to be set to `true` in order to interpret
         * > expressions surrounded by double quotes (`"`) as exact phrase match requests.
         *
         * Default value is `false`.
         */
        enableQuerySyntax: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'QuerySyntax' }),
        /**
         * Specifies whether to expand basic expression keywords containing wildcards characters (`*`) to the possible
         * matching keywords in order to broaden the query (see
         * [Using Wildcards in Queries](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=359)).
         *
         * See also [`enableQuestionMarks`]{@link Querybox.options.enableQuestionMarks}.
         *
         *  **Note:**
         * > If you are using an on-premises version of the Coveo Search API, you need to set the
         * > [`enableQuerySyntax`]{@link Querybox.options.enableQuerySyntax} option to `true` to be able to set
         * > `enableWildcards` to `true`.
         *
         * Default value is `false`.
         */
        enableWildcards: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'QuerySyntax' }),
        /**
         * If [`enableWildcards`]{@link Querybox.options.enableWildcards} is `true`, specifies whether to expand basic
         * expression keywords containing question mark characters (`?`) to the possible matching keywords in order to
         * broaden the query (see
         * [Using Wildcards in Queries](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=359)).
         *
         * **Note:**
         * > If you are using an on-premises version of the Coveo Search API, you also need to set the
         * > [`enableQuerySyntax`]{@link Querybox.options.enableQuerySyntax} option to `true` in order to be able to set
         * > `enableQuestionMarks` to `true`.
         *
         * Default value is `false`.
         */
        enableQuestionMarks: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false, depend: 'enableWildcards' }),
        /**
         * If the [`enableQuerySyntax`]{@link Querybox.options.enableQuerySyntax} option is `true`, specifies whether to
         * interpret the `AND`, `NOT`, `OR`, and `NEAR` keywords in the `Querybox` as query operators in the query, even if
         * the end user types those keywords in lowercase.
         *
         * This option applies to all query operators (see
         * [Coveo Query Syntax Reference](http://www.coveo.com/go?dest=adminhelp70&lcid=9&context=10005)).
         *
         * **Example:**
         * > If this option and the `enableQuerySyntax` option are both `true`, the Coveo Platform interprets the `near`
         * > keyword in a query such as `service center near me` as the `NEAR` query operator (not as a query term).
         *
         * > Otherwise, if the `enableQuerySyntax` option is `true` and this option is `false`, the end user has to type the
         * > `NEAR` keyword in uppercase for the Coveo Platform to interpret it as a query operator.
         *
         * Default value is `false`.
         */
        enableLowercaseOperators: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false, depend: 'enableQuerySyntax' }),
        /**
         * Whether to convert a basic expression containing at least a certain number of keywords (see the
         * [`partialMatchKeywords`]{@link Querybox.options.partialMatchKeywords} option) to a *partial match expression*, so
         * that items containing at least a certain number of those keywords (see the
         * [`partialMatchThreshold`]{@link Querybox.options.partialMatchThreshold} option) will match the expression.
         *
         * **Notes:**
         *
         * > - Only the basic expression of the query (see [`q`]{@link q}) can be converted to a partial match expression.
         * > - When the [`enableQuerySyntax`]{@link Querybox.options.enableQuerySyntax} option is set to `true`, this
         * > feature has no effect on a basic expression containing query syntax (field expressions, operators, etc.).
         *
         * **Example:**
         *
         * > With the following markup configuration, if a basic expression contains at least 4 keywords, items containing
         * > at least 75% of those keywords (round up) will match the query.
         * > ```html
         * > <div class='CoveoQuerybox' data-enable-partial-match='true' data-partial-match-keywords='4' data-partial-match-threshold='75%'></div>
         * > ```
         * > For instance, if the basic expression is `Coveo custom component configuration help`, items containing
         * > all 5 of those keywords, or 4 of them (75% of 5 rounded up) will match the query.
         *
         * Default value is `false`, which implies that an item must contain all of the basic expression keywords to match
         * the query.
         * @notSupportedIn salesforcefree
         */
        enablePartialMatch: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        /**
         * The minimum number of keywords that need to be present in a basic expression to convert it to a partial match
         * expression.
         *
         * See also the [`partialMatchThreshold`]{@link Querybox.options.partialMatchThreshold} option.
         *
         * **Notes:**
         * > - This option has no meaning unless the [`enablePartialMatch`]{@link Querybox.options.enablePartialMatch}
         * > option is set to `true`.
         * > - Repeated keywords in a basic expression count as a single keyword.
         * > - Thesaurus expansions in a basic expression count towards the `partialMatchKeywords` count.
         * > - Stemming expansions **do not** count towards the `partialMatchKeywords` count.
         *
         * **Example:**
         * > If the `partialMatchKeywords` value is `7`, the basic expression will have to contain at least 7 keywords
         * > to be converted to a partial match expression.
         *
         * Default value is `5`.
         * @notSupportedIn salesforcefree
         */
        partialMatchKeywords: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 5, min: 1, depend: 'enablePartialMatch' }),
        /**
         * An absolute or relative value indicating the minimum number (rounded up) of partial match expression keywords an
         * item must contain to match the expression.
         *
         * See also the [`partialMatchKeywords`]{@link Querybox.options.partialMatchKeywords} option.
         *
         * **Notes:**
         * > - This option has no meaning unless the [`enablePartialMatch`]{@link Querybox.options.enablePartialMatch}
         * > option is set to `true`.
         * > - A keyword and its stemming expansions count as a single keyword when evaluating whether an item meets the
         * > `partialMatchThreshold`.
         *
         * **Examples:**
         * > If the `partialMatchThreshold` value is `50%` and the partial match expression contains exactly 9 keywords,
         * > items will have to contain at least 5 of those keywords to match the query (50% of 9, rounded up).
         *
         * > With the same configuration, if the partial match expression contains exactly 12 keywords, items will have to
         * > contain at least 6 of those keywords to match the query (50% of 12).
         *
         * > If the `partialMatchThreshold` value is `2`, items will always have to contain at least 2 of the partial match
         * > expression keywords to match the query, no matter how many keywords the partial match expression actually
         * > contains.
         *
         * Default value is `50%`.
         * @notSupportedIn salesforcefree
         */
        partialMatchThreshold: ComponentOptions_1.ComponentOptions.buildStringOption({ defaultValue: '50%', depend: 'enablePartialMatch' }),
        /**
         * Specifies whether to trigger a query when clearing the `Querybox`.
         *
         * Default value is `false`.
         */
        triggerQueryOnClear: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false })
    };
    return Querybox;
}(Component_1.Component));
exports.Querybox = Querybox;
Initialization_1.Initialization.registerAutoCreateComponent(Querybox);


/***/ })

});
//# sourceMappingURL=Searchbox__1a4919568d31ada5f0d0.js.map