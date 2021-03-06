webpackJsonpCoveo__temporary([19],{

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

/***/ 215:
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
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
__webpack_require__(334);
var Dom_1 = __webpack_require__(2);
var QueryEvents_1 = __webpack_require__(10);
var ComponentOptions_1 = __webpack_require__(7);
var Strings_1 = __webpack_require__(8);
var Assert_1 = __webpack_require__(5);
var _ = __webpack_require__(0);
var Checkbox_1 = __webpack_require__(57);
var BreadcrumbEvents_1 = __webpack_require__(35);
var SVGIcons_1 = __webpack_require__(13);
var SVGDom_1 = __webpack_require__(14);
var SimpleFilterValues_1 = __webpack_require__(452);
var FacetUtils_1 = __webpack_require__(45);
var KeyboardUtils_1 = __webpack_require__(20);
var AnalyticsActionListMeta_1 = __webpack_require__(9);
/**
 * The `SimpleFilter` component displays a dropdown menu containing field values which the end user can select to filter
 * the query results.
 *
 * The list of available field values in the dropdown menu can either be static (defined through the
 * [`values`]{@link SimpleFilter.options.values} option), or dynamic (automatically obtained through a
 * [`GroupByRequest`]{@link IGroupByRequest} operation performed at the same time as the main query).
 */
var SimpleFilter = /** @class */ (function (_super) {
    __extends(SimpleFilter, _super);
    /**
     * Creates a new `SimpleFilter` component. Binds multiple query events as well.
     * @param element the HTMLElement on which to instantiate the component.
     * @param options The options for the `SimpleFilter` component.
     * @param bindings The bindings that the component requires to function normally.
     */
    function SimpleFilter(element, options, bindings) {
        var _this = _super.call(this, element, SimpleFilter.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.previouslySelected = [];
        _this.groupByRequestValues = [];
        _this.isSticky = false;
        _this.shouldTriggerQuery = true;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, SimpleFilter, options);
        _this.element.title = _this.options.title;
        _this.buildContent();
        Dom_1.$$(_this.element).on('click', function (e) { return _this.handleClick(e); });
        Dom_1.$$(_this.element).setAttribute('tabindex', '0');
        _this.bindKeyboardEvents();
        _this.bind.onRootElement(BreadcrumbEvents_1.BreadcrumbEvents.populateBreadcrumb, function (args) {
            return _this.handlePopulateBreadcrumb(args);
        });
        _this.bind.onRootElement(BreadcrumbEvents_1.BreadcrumbEvents.clearBreadcrumb, function () { return _this.handleClearBreadcrumb(); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.buildingQuery, function (args) { return _this.handleBuildingQuery(args); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.doneBuildingQuery, function (args) { return _this.handleDoneBuildingQuery(args); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.querySuccess, function (args) { return _this.handleQuerySuccess(args); });
        return _this;
    }
    /**
     * Gets the `SimpleFilter` `valueContainer`.
     * @returns {Dom} The `SimpleFilter` valueContainer.
     */
    SimpleFilter.prototype.getValueContainer = function () {
        return this.valueContainer;
    };
    /**
     * Gets the caption of a specific field value.
     * @param value The field value whose caption the method should attempt to get.
     * @returns {any} The value caption, if available; the original value otherwise.
     */
    SimpleFilter.prototype.getValueCaption = function (value) {
        var ret = value;
        if (_.contains(_.keys(this.options.valueCaption), value)) {
            ret = this.options.valueCaption[ret] || ret;
            return Strings_1.l(ret);
        }
        else {
            return FacetUtils_1.FacetUtils.tryToGetTranslatedCaption(this.options.field.toString(), ret);
        }
    };
    /**
     * Gets the captions of the currently selected field values in the `SimpleFilter`.
     * @returns {string[]} An array containing the selected captions.
     */
    SimpleFilter.prototype.getSelectedCaptions = function () {
        var _this = this;
        return _.map(this.getSelectedValues(), function (selectedValue) { return _this.getValueCaption(selectedValue); });
    };
    /**
     * Opens or closes the `SimpleFilter` `valueContainer`, depending on its current state.
     */
    SimpleFilter.prototype.toggleContainer = function () {
        Dom_1.$$(this.valueContainer).hasClass('coveo-simplefilter-value-container-expanded') ? this.closeContainer() : this.openContainer();
    };
    /**
     * Selects the specified value. Also triggers a query, by default.
     * @param value The value to select.
     * @param triggerQuery `true` by default. If set to `false`, the method triggers no query.
     */
    SimpleFilter.prototype.selectValue = function (value, triggerQuery) {
        var _this = this;
        if (triggerQuery === void 0) { triggerQuery = true; }
        _.each(this.checkboxes, function (labeledCheckbox) {
            var translated = _this.getValueCaption(labeledCheckbox.label);
            if (labeledCheckbox.label == value || translated == value) {
                labeledCheckbox.checkbox.select(triggerQuery);
            }
        });
    };
    /**
     * Un-selects the specified value.
     * @param value The value whose state the method should reset.
     */
    SimpleFilter.prototype.deselectValue = function (value) {
        var _this = this;
        _.each(this.checkboxes, function (labeledCheckbox) {
            var translated = _this.getValueCaption(labeledCheckbox.label);
            if (labeledCheckbox.label == value || translated == value) {
                labeledCheckbox.checkbox.reset();
            }
        });
    };
    /**
     * Selects or un-selects the specified value, depending on its current state.
     * @param value The value whose state the method should toggle.
     */
    SimpleFilter.prototype.toggleValue = function (value) {
        var _this = this;
        _.each(this.checkboxes, function (labeledCheckbox) {
            var translated = _this.getValueCaption(labeledCheckbox.label);
            if (labeledCheckbox.label == value || translated == value) {
                labeledCheckbox.checkbox.toggle();
            }
        });
    };
    /**
     * Resets the component to its original state.
     */
    SimpleFilter.prototype.resetSimpleFilter = function () {
        var _this = this;
        _.each(this.checkboxes, function (labeledCheckbox) {
            if (labeledCheckbox.checkbox.isSelected()) {
                _this.deselectValue(labeledCheckbox.label);
            }
        });
    };
    /**
     * Opens the `SimpleFilter` `valueContainer`.
     */
    SimpleFilter.prototype.openContainer = function () {
        Dom_1.$$(this.element).addClass('coveo-simplefilter-value-container-expanded');
        this.valueContainer.addClass('coveo-simplefilter-value-container-expanded');
        this.refreshValueContainer();
        this.isSticky = true;
        if (!this.backdrop.hasClass('coveo-dropdown-background-active')) {
            this.showBackdrop();
        }
    };
    /**
     * Closes the `SimpleFilter` `valueContainer`.
     */
    SimpleFilter.prototype.closeContainer = function () {
        Dom_1.$$(this.element).removeClass('coveo-simplefilter-value-container-expanded');
        this.valueContainer.removeClass('coveo-simplefilter-value-container-expanded');
        if (this.backdrop.hasClass('coveo-dropdown-background-active')) {
            this.hideBackdrop();
        }
        if (this.getSelectedLabeledCheckboxes().length == 0) {
            this.isSticky = false;
        }
    };
    SimpleFilter.prototype.getSelectedValues = function () {
        return _.map(this.getSelectedLabeledCheckboxes(), function (labeledCheckbox) { return labeledCheckbox.label; });
    };
    SimpleFilter.prototype.bindKeyboardEvents = function () {
        var _this = this;
        // On "ENTER" keypress, we can either toggle the container if that is the top level element (this.element)
        // Or toggle a filter selection, using the text of the label.
        Dom_1.$$(this.element).on('keyup', KeyboardUtils_1.KeyboardUtils.keypressAction(KeyboardUtils_1.KEYBOARD.ENTER, function (e) {
            if (e.target == _this.element) {
                _this.toggleContainer();
            }
            else {
                _this.toggleValue(Dom_1.$$(e.target).text());
            }
        }));
        // When navigating with "TAB" keypress, close the container if we are navigating out of the top level element.
        // Navigating "inside" the SimpleFilter (relatedTarget.parent) should not close the container, but will simply navigate to the next filter selection
        Dom_1.$$(this.element).on('blur', function (e) {
            var relatedTarget = e.relatedTarget;
            if (relatedTarget && !Dom_1.$$(relatedTarget).parent(Component_1.Component.computeCssClassName(SimpleFilter))) {
                _this.closeContainer();
            }
        });
    };
    SimpleFilter.prototype.handleClick = function (e) {
        e.stopPropagation();
        if (e.target == this.element) {
            this.toggleContainer();
        }
    };
    SimpleFilter.prototype.handleValueToggle = function (checkbox) {
        var selectedValues = this.getSelectedValues();
        this.circleElement.text(selectedValues.length.toString());
        this.circleElement.removeClass('coveo-simplefilter-circle-hidden');
        if (selectedValues.length == 1) {
            this.setDisplayedTitle(this.getValueCaption(selectedValues[0]));
            this.element.title = this.getValueCaption(selectedValues[0]);
        }
        else {
            this.setDisplayedTitle(this.options.title);
            this.element.title = this.options.title;
            if (selectedValues.length < 1) {
                this.circleElement.addClass('coveo-simplefilter-circle-hidden');
            }
        }
        var action = checkbox.isSelected()
            ? AnalyticsActionListMeta_1.analyticsActionCauseList.simpleFilterSelectValue
            : AnalyticsActionListMeta_1.analyticsActionCauseList.simpleFilterDeselectValue;
        this.usageAnalytics.logSearchEvent(action, {
            simpleFilterTitle: this.options.title,
            simpleFilterSelectedValue: checkbox.label,
            simpleFilterField: this.options.field
        });
        if (this.shouldTriggerQuery) {
            this.queryController.executeQuery();
        }
    };
    SimpleFilter.prototype.createCheckbox = function (label) {
        var _this = this;
        var checkbox = new Checkbox_1.Checkbox(function () {
            _this.handleValueToggle(checkbox);
        }, this.getValueCaption(label));
        checkbox.getElement().title = Strings_1.l(label);
        Dom_1.$$(checkbox.getElement()).setAttribute('tabindex', '0');
        return { checkbox: checkbox, label: label };
    };
    SimpleFilter.prototype.createCheckboxes = function () {
        var _this = this;
        if (this.previouslySelected.length > 0) {
            this.checkboxes = _.map(this.previouslySelected, function (caption) { return _this.createCheckbox(caption); });
            _.each(this.checkboxes, function (checkbox) {
                if (_this.previouslySelected.indexOf(checkbox.label) >= 0) {
                    _this.selectValue(checkbox.label, false);
                }
            });
        }
        else if (this.options.values != undefined) {
            this.checkboxes = _.map(this.options.values, function (caption) { return _this.createCheckbox(caption); });
        }
        else if (this.groupByRequestValues != undefined) {
            this.checkboxes = _.map(this.groupByRequestValues, function (caption) { return _this.createCheckbox(caption); });
        }
        _.each(this.checkboxes, function (result) {
            _this.valueContainer.append(result.checkbox.getElement());
        });
        if (this.checkboxes.length > 0) {
            Dom_1.$$(Dom_1.$$(this.checkboxes[this.checkboxes.length - 1].checkbox.getElement()).find('.coveo-checkbox-button')).on('blur', function () {
                _this.closeContainer();
            });
        }
    };
    SimpleFilter.prototype.createValueContainer = function () {
        this.valueContainer = Dom_1.$$('div', { className: 'coveo-simplefilter-value-container' });
    };
    SimpleFilter.prototype.buildContent = function () {
        this.createValueContainer();
        this.element.appendChild(this.buildSelect());
        this.element.appendChild(this.valueContainer.el);
        this.findOrCreateWrapper().append(this.element);
        this.createBackdrop();
    };
    SimpleFilter.prototype.buildSelect = function () {
        var select = Dom_1.$$('span', { className: 'coveo-simplefilter-select' });
        this.selectTitle = Dom_1.$$('span', { className: 'coveo-simplefilter-selecttext' }, this.getValueCaption(this.options.title));
        select.append(this.selectTitle.el);
        select.append(this.buildCircleElement());
        select.append(this.buildSvgToggleUpIcon());
        return select.el;
    };
    SimpleFilter.prototype.buildSvgToggleUpIcon = function () {
        var svgIcon = Dom_1.$$('span', { className: 'coveo-simplefilter-toggle-svg-container' }, SVGIcons_1.SVGIcons.icons.arrowDown).el;
        SVGDom_1.SVGDom.addClassToSVGInContainer(svgIcon, 'coveo-simplefilter-toggle-down-svg');
        return svgIcon;
    };
    SimpleFilter.prototype.buildCircleElement = function () {
        this.circleElement = Dom_1.$$('span', { className: 'coveo-simplefilter-circle coveo-simplefilter-circle-hidden' }, this.getSelectedLabeledCheckboxes().length.toString());
        return this.circleElement.el;
    };
    SimpleFilter.prototype.createBackdrop = function () {
        var _this = this;
        var backdrop = Dom_1.$$(this.root).find('.coveo-dropdown-background');
        if (backdrop == null) {
            this.backdrop = Dom_1.$$('div', { className: 'coveo-dropdown-background' });
            this.root.appendChild(this.backdrop.el);
        }
        else {
            this.backdrop = Dom_1.$$(backdrop);
        }
        this.backdrop.on('click', function () { return _this.closeContainer(); });
    };
    SimpleFilter.prototype.handlePopulateBreadcrumb = function (args) {
        var _this = this;
        if (this.getSelectedLabeledCheckboxes().length > 0) {
            var elem = Dom_1.$$('div', { className: 'coveo-simplefilter-breadcrumb' });
            var title = Dom_1.$$('span', { className: 'coveo-simplefilter-breadcrumb-title' }, this.options.title);
            elem.append(title.el);
            var values_1 = Dom_1.$$('span', { className: 'coveo-simplefilter-breadcrumb-values' });
            elem.append(values_1.el);
            _.each(this.getSelectedLabeledCheckboxes(), function (selectedlabeledCheckbox) {
                var value = Dom_1.$$('span', { className: 'coveo-simplefilter-breadcrumb-value' }, _this.getValueCaption(selectedlabeledCheckbox.label));
                values_1.append(value.el);
                var svgContainer = Dom_1.$$('span', { className: 'coveo-simplefilter-breadcrumb-clear' }, SVGIcons_1.SVGIcons.icons.checkboxHookExclusionMore);
                SVGDom_1.SVGDom.addClassToSVGInContainer(svgContainer.el, 'coveo-simplefilter-breadcrumb-clear-svg');
                value.append(svgContainer.el);
                value.el.title = _this.getValueCaption(selectedlabeledCheckbox.label);
                Dom_1.$$(value).on('click', function () { return _this.handleRemoveFromBreadcrumb(selectedlabeledCheckbox); });
            });
            args.breadcrumbs.push({
                element: elem.el
            });
        }
    };
    SimpleFilter.prototype.handleRemoveFromBreadcrumb = function (labeledCheckbox) {
        labeledCheckbox.checkbox.reset();
        this.refreshValueContainer();
    };
    SimpleFilter.prototype.handleClearBreadcrumb = function () {
        // Bit of a hack with that flag, but essentially we want "clear breadcrumb" to be a global, unique event.
        // Not something that will log a special event for SimpleFilter (or any component)
        this.shouldTriggerQuery = false;
        this.resetSimpleFilter();
        this.shouldTriggerQuery = true;
    };
    SimpleFilter.prototype.handleQuerySuccess = function (data) {
        if (data.results.results.length > 0) {
            this.findOrCreateWrapper().removeClass('coveo-no-results');
        }
        else {
            this.findOrCreateWrapper().addClass('coveo-no-results');
        }
        if (this.options.values == undefined) {
            this.groupByBuilder.groupBy(data);
            this.groupByRequestValues = this.groupByBuilder.getValuesFromGroupBy();
            this.refreshValueContainer();
            if (!Dom_1.$$(this.element).hasClass('coveo-simplefilter-value-container-expanded')) {
                this.isSticky = false;
            }
        }
    };
    SimpleFilter.prototype.handleBuildingQuery = function (args) {
        Assert_1.Assert.exists(args);
        Assert_1.Assert.exists(args.queryBuilder);
        var selectedValues = this.getSelectedValues();
        if (selectedValues.length > 0) {
            args.queryBuilder.advancedExpression.addFieldExpression(this.options.field.toString(), '==', selectedValues);
        }
    };
    SimpleFilter.prototype.handleDoneBuildingQuery = function (data) {
        if (this.options.values == undefined) {
            Assert_1.Assert.exists(data);
            Assert_1.Assert.exists(data.queryBuilder);
            this.previouslySelected = this.getSelectedValues();
            this.groupByBuilder = new SimpleFilterValues_1.SimpleFilterValues(this, this.options);
            this.groupByBuilder.handleDoneBuildingQuery(data);
        }
    };
    SimpleFilter.prototype.getSelectedLabeledCheckboxes = function () {
        return _.filter(this.checkboxes, function (labeledCheckbox) { return labeledCheckbox.checkbox.isSelected(); });
    };
    SimpleFilter.prototype.setDisplayedTitle = function (title) {
        this.selectTitle.text(this.getValueCaption(title));
    };
    SimpleFilter.prototype.showBackdrop = function () {
        this.backdrop.addClass('coveo-dropdown-background-active');
    };
    SimpleFilter.prototype.hideBackdrop = function () {
        this.backdrop.removeClass('coveo-dropdown-background-active');
    };
    SimpleFilter.prototype.findOrCreateWrapper = function () {
        if (Dom_1.$$(this.root).find('.coveo-simplefilter-header-wrapper') == null) {
            var wrapper = Dom_1.$$('div', { className: 'coveo-simplefilter-header-wrapper' });
            wrapper.insertBefore(this.element);
            return wrapper;
        }
        else {
            var wrapper = Dom_1.$$(this.root).find('.coveo-simplefilter-header-wrapper');
            return Dom_1.$$(wrapper);
        }
    };
    SimpleFilter.prototype.refreshValueContainer = function () {
        if (!this.isSticky) {
            this.valueContainer.empty();
            this.createCheckboxes();
        }
        if (this.checkboxes.length == 0 && !this.isSticky) {
            Dom_1.$$(this.element).addClass('coveo-simplefilter-empty');
        }
        else {
            Dom_1.$$(this.element).removeClass('coveo-simplefilter-empty');
        }
        Dom_1.$$(this.circleElement).text(this.getSelectedLabeledCheckboxes().length.toString());
    };
    SimpleFilter.ID = 'SimpleFilter';
    SimpleFilter.doExport = function () {
        GlobalExports_1.exportGlobally({
            SimpleFilter: SimpleFilter
        });
    };
    /**
     * The possible options for the SimpleFilter.
     * @componentOptions
     */
    SimpleFilter.options = {
        /**
         * Specifies the maximum number of field values to display in the `SimpleFilter` dropdown menu.
         *
         * Default value is `5`. Minimum value is `0`.
         */
        maximumNumberOfValues: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 5, min: 0 }),
        /**
         * Specifies a static list of field values to display in the `SimpleFilter` dropdown menu.
         *
         * This option is undefined by default, which means that the component generates a dynamic list of field values
         * by performing a [`GroupByRequest`]{@link IGroupByRequest} operation at the same time as the main query.
         */
        values: ComponentOptions_1.ComponentOptions.buildListOption(),
        /**
         * Specifies the field whose values the `SimpleFilter` should output result filters from.
         *
         * Specifying a value for this option is required for the `SimpleFilter` component to work.
         */
        field: ComponentOptions_1.ComponentOptions.buildFieldOption({ required: true }),
        /**
         * Specifies the title to display for the `SimpleFilter`.
         *
         * Default value is the localized string for `NoTitle`.
         */
        title: ComponentOptions_1.ComponentOptions.buildStringOption({ defaultValue: Strings_1.l('NoTitle') }),
        /**
         * Specifies a JSON object describing a mapping of `SimpleFilter` values to their desired captions.
         *
         * **Examples:**
         *
         * * You can set the option in the ['init']{@link init} call:
         * ```javascript
         * var myValueCaptions = {
         *   "txt" : "Text files",
         *   "html" : "Web page",
         *   [ ... ]
         * };
         *
         * Coveo.init(document.querySelector("#search"), {
         *   SimpleFilter : {
         *     valueCaption : myValueCaptions
         *   }
         * });
         * ```
         *
         * * Or before the `init` call, using the ['options']{@link options} top-level function:
         * ```javascript
         * Coveo.options(document.querySelector("#search"), {
         *   SimpleFilter : {
         *     valueCaption : myValueCaptions
         *   }
         * });
         * ```
         *
         * * Or directly in the markup:
         * ```html
         * <!-- Ensure that the double quotes are properly handled in `data-value-caption`. -->
         * <div class='CoveoSimpleFilter' data-field='@myotherfield' data-value-caption='{"txt":"Text files","html":"Web page"}'></div>
         * ```
         */
        valueCaption: ComponentOptions_1.ComponentOptions.buildJsonOption()
    };
    return SimpleFilter;
}(Component_1.Component));
exports.SimpleFilter = SimpleFilter;
Initialization_1.Initialization.registerAutoCreateComponent(SimpleFilter);


/***/ }),

/***/ 334:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 45:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path='Facet.ts' />
var StringUtils_1 = __webpack_require__(18);
var QueryUtils_1 = __webpack_require__(19);
var FileTypes_1 = __webpack_require__(92);
var DateUtils_1 = __webpack_require__(29);
var Utils_1 = __webpack_require__(4);
var Dom_1 = __webpack_require__(2);
var _ = __webpack_require__(0);
var Strings_1 = __webpack_require__(8);
var FacetUtils = /** @class */ (function () {
    function FacetUtils() {
    }
    FacetUtils.getRegexToUseForFacetSearch = function (value, ignoreAccent) {
        return new RegExp(StringUtils_1.StringUtils.stringToRegex(value, ignoreAccent), 'i');
    };
    FacetUtils.getValuesToUseForSearchInFacet = function (original, facet) {
        var ret = [original];
        var regex = this.getRegexToUseForFacetSearch(original, facet.options.facetSearchIgnoreAccents);
        if (facet.options.valueCaption) {
            _.chain(facet.options.valueCaption)
                .pairs()
                .filter(function (pair) {
                return regex.test(pair[1]);
            })
                .each(function (match) {
                ret.push(match[0]);
            });
            if (QueryUtils_1.QueryUtils.isStratusAgnosticField(facet.options.field, '@objecttype') ||
                QueryUtils_1.QueryUtils.isStratusAgnosticField(facet.options.field, '@filetype')) {
                _.each(FileTypes_1.FileTypes.getFileTypeCaptions(), function (value, key) {
                    if (!(key in facet.options.valueCaption) && regex.test(value)) {
                        ret.push(key);
                    }
                });
            }
        }
        else if (QueryUtils_1.QueryUtils.isStratusAgnosticField(facet.options.field, '@objecttype') ||
            QueryUtils_1.QueryUtils.isStratusAgnosticField(facet.options.field, '@filetype')) {
            _.each(_.filter(_.pairs(FileTypes_1.FileTypes.getFileTypeCaptions()), function (pair) {
                return regex.test(pair[1]);
            }), function (match) {
                ret.push(match[0]);
            });
        }
        else if (QueryUtils_1.QueryUtils.isStratusAgnosticField(facet.options.field, '@month')) {
            _.each(_.range(1, 13), function (month) {
                if (regex.test(DateUtils_1.DateUtils.monthToString(month - 1))) {
                    ret.push(('0' + month.toString()).substr(-2));
                }
            });
        }
        return ret;
    };
    FacetUtils.buildFacetSearchPattern = function (values) {
        values = _.map(values, function (value) {
            return Utils_1.Utils.escapeRegexCharacter(value);
        });
        values[0] = '.*' + values[0] + '.*';
        return values.join('|');
    };
    FacetUtils.needAnotherFacetSearch = function (currentSearchLength, newSearchLength, oldSearchLength, desiredSearchLength) {
        // Something was removed (currentSearch < newSearch)
        // && we might want to display more facet search result(currentSearch < desiredSearch)
        // && the new query returned more stuff than the old one so there's still more results(currentSearchLength > oldLength)
        return currentSearchLength < newSearchLength && currentSearchLength < desiredSearchLength && currentSearchLength > oldSearchLength;
    };
    FacetUtils.addNoStateCssClassToFacetValues = function (facet, container) {
        // This takes care of adding the correct css class on each facet value checkbox (empty white box) if at least one value is selected in that facet
        if (facet.values.getSelected().length != 0) {
            var noStates = Dom_1.$$(container).findAll('li:not(.coveo-selected)');
            _.each(noStates, function (noState) {
                Dom_1.$$(noState).addClass('coveo-no-state');
            });
        }
    };
    FacetUtils.tryToGetTranslatedCaption = function (field, value) {
        var found;
        if (QueryUtils_1.QueryUtils.isStratusAgnosticField(field.toLowerCase(), '@filetype')) {
            found = FileTypes_1.FileTypes.getFileType(value).caption;
        }
        else if (QueryUtils_1.QueryUtils.isStratusAgnosticField(field.toLowerCase(), '@objecttype')) {
            found = FileTypes_1.FileTypes.getObjectType(value).caption;
        }
        else if (QueryUtils_1.QueryUtils.isStratusAgnosticField(field.toLowerCase(), '@month') && value != 'Search') {
            try {
                var month = parseInt(value);
                found = DateUtils_1.DateUtils.monthToString(month - 1);
            }
            catch (ex) {
                // Do nothing
            }
        }
        else {
            found = Strings_1.l(value);
        }
        return found != undefined && Utils_1.Utils.isNonEmptyString(found) ? found : value;
    };
    return FacetUtils;
}());
exports.FacetUtils = FacetUtils;


/***/ }),

/***/ 452:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(334);
var _ = __webpack_require__(0);
var SimpleFilterValues = /** @class */ (function () {
    function SimpleFilterValues(simpleFilter, options) {
        this.simpleFilter = simpleFilter;
        this.options = options;
        this.groupByRequestValues = [];
    }
    SimpleFilterValues.prototype.getValuesFromGroupBy = function () {
        return this.groupByRequestValues;
    };
    SimpleFilterValues.prototype.groupBy = function (data) {
        var _this = this;
        this.groupByRequestValues = [];
        var groupByResult = data.results.groupByResults;
        if (groupByResult.length > 0 && this.position != undefined) {
            _.each(groupByResult[this.position].values, function (value) {
                if (_this.groupByRequestValues.indexOf(value.lookupValue) < 0) {
                    _this.groupByRequestValues.push(value.lookupValue);
                }
            });
        }
    };
    SimpleFilterValues.prototype.handleDoneBuildingQuery = function (data) {
        var queryBuilder = data.queryBuilder;
        this.putGroupByIntoQueryBuilder(queryBuilder);
    };
    SimpleFilterValues.prototype.putGroupByIntoQueryBuilder = function (queryBuilder) {
        var groupByRequest = this.createBasicGroupByRequest();
        queryBuilder.groupByRequests.push(groupByRequest);
        this.position = queryBuilder.groupByRequests.length - 1;
    };
    SimpleFilterValues.prototype.createBasicGroupByRequest = function () {
        var groupByRequest = {
            field: this.options.field,
            maximumNumberOfValues: this.options.maximumNumberOfValues,
            injectionDepth: 1000
        };
        return groupByRequest;
    };
    return SimpleFilterValues;
}());
exports.SimpleFilterValues = SimpleFilterValues;


/***/ })

});
//# sourceMappingURL=SimpleFilter__1a4919568d31ada5f0d0.js.map