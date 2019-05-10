webpackJsonpCoveo__temporary([2,1],{

/***/ 128:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/// <reference path="Facet.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var Utils_1 = __webpack_require__(4);
var FacetUtils_1 = __webpack_require__(47);
var QueryBuilder_1 = __webpack_require__(36);
var Dom_1 = __webpack_require__(1);
var _ = __webpack_require__(0);
var AllowedValuesPatternType_1 = __webpack_require__(325);
var FacetSearchParameters = /** @class */ (function () {
    function FacetSearchParameters(facet) {
        this.facet = facet;
        this.valueToSearch = '';
        this.alwaysInclude = [];
        this.alwaysExclude = [];
        this.sortCriteria = 'occurrences';
        this.fetchMore = false;
        this.completeFacetWithStandardValues = true;
        this.nbResults = facet.options.numberOfValuesInFacetSearch;
        this.ignoreAccents = facet.options.facetSearchIgnoreAccents;
    }
    FacetSearchParameters.prototype.setValueToSearch = function (value) {
        this.valueToSearch = value;
        if (Utils_1.Utils.isNonEmptyString(value)) {
            this.valueToSearch = this.valueToSearch.trim();
            this.alwaysInclude = this.alwaysInclude.concat(FacetUtils_1.FacetUtils.getValuesToUseForSearchInFacet(this.valueToSearch, this.facet));
        }
        return this;
    };
    FacetSearchParameters.prototype.excludeCurrentlyDisplayedValuesInSearch = function (searchResults) {
        var _this = this;
        _.each(this.getCurrentlyShowedValueInSearch(searchResults), function (v) {
            var expandedValues = FacetUtils_1.FacetUtils.getValuesToUseForSearchInFacet(v, _this.facet);
            _.each(expandedValues, function (expanded) {
                _this.alwaysExclude.push(expanded);
            });
        });
        _.each(this.facet.getDisplayedFacetValues(), function (v) {
            _this.alwaysExclude.push(v.value);
        });
    };
    FacetSearchParameters.prototype.getGroupByRequest = function () {
        this.lowerCaseAll();
        var nbResults = this.nbResults;
        nbResults += this.alwaysExclude.length;
        var typedByUser = [];
        if (this.valueToSearch) {
            typedByUser = ['*' + this.valueToSearch + '*'];
        }
        var allowedValues;
        if (this.valueToSearch) {
            allowedValues = typedByUser.concat(this.alwaysInclude).concat(this.alwaysExclude);
        }
        else {
            allowedValues = _.compact(typedByUser.concat(this.alwaysInclude).concat(this.facet.options.allowedValues));
        }
        var completeFacetWithStandardValues = this.completeFacetWithStandardValues;
        if (this.facet.options.lookupField != null) {
            completeFacetWithStandardValues = false;
        }
        var request = {
            allowedValues: allowedValues,
            allowedValuesPatternType: this.facet.options.useWildcardsInFacetSearch
                ? AllowedValuesPatternType_1.AllowedValuesPatternType.Wildcards
                : AllowedValuesPatternType_1.AllowedValuesPatternType.Legacy,
            maximumNumberOfValues: nbResults,
            completeFacetWithStandardValues: completeFacetWithStandardValues,
            field: this.facet.options.field,
            sortCriteria: this.facet.options.sortCriteria || this.sortCriteria,
            injectionDepth: this.facet.options.injectionDepth
        };
        if (this.facet.options.lookupField) {
            request.lookupField = this.facet.options.lookupField;
        }
        if (this.facet.options.computedField) {
            request.computedFields = [
                {
                    field: this.facet.options.computedField,
                    operation: this.facet.options.computedFieldOperation
                }
            ];
        }
        return request;
    };
    FacetSearchParameters.prototype.getQuery = function () {
        var lastQuery = _.clone(this.facet.queryController.getLastQuery());
        if (!lastQuery) {
            // There should normally always be a last query available
            // If not, just create an empty one.
            lastQuery = new QueryBuilder_1.QueryBuilder().build();
        }
        // We want to always force query syntax to true for a facet search,
        // but arrange for the basic expression to adapt itself with no syntax block
        if (lastQuery.enableQuerySyntax) {
            lastQuery.q = this.facet.facetQueryController.basicExpressionToUseForFacetSearch;
        }
        else if (Utils_1.Utils.isNonEmptyString(this.facet.facetQueryController.basicExpressionToUseForFacetSearch)) {
            lastQuery.q = "<@- " + this.facet.facetQueryController.basicExpressionToUseForFacetSearch + " -@>";
        }
        else {
            lastQuery.q = '';
        }
        lastQuery.enableQuerySyntax = true;
        lastQuery.cq = this.facet.facetQueryController.constantExpressionToUseForFacetSearch;
        lastQuery.aq = this.facet.facetQueryController.advancedExpressionToUseForFacetSearch;
        lastQuery.enableDidYouMean = false;
        lastQuery.firstResult = 0;
        lastQuery.numberOfResults = 0;
        lastQuery.fieldsToInclude = [];
        lastQuery.groupBy = [this.getGroupByRequest()];
        return lastQuery;
    };
    FacetSearchParameters.prototype.getCurrentlyShowedValueInSearch = function (searchResults) {
        return _.map(Dom_1.$$(searchResults).findAll('.coveo-facet-value-caption'), function (val) {
            return Dom_1.$$(val).getAttribute('data-original-value') || Dom_1.$$(val).text();
        });
    };
    FacetSearchParameters.prototype.lowerCaseAll = function () {
        this.alwaysExclude = _.chain(this.alwaysExclude)
            .map(function (v) {
            return v.toLowerCase();
        })
            .uniq()
            .value();
        this.alwaysInclude = _.chain(this.alwaysInclude)
            .map(function (v) {
            return v.toLowerCase();
        })
            .uniq()
            .value();
    };
    return FacetSearchParameters;
}());
exports.FacetSearchParameters = FacetSearchParameters;


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

/***/ 156:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var popper_js_1 = __webpack_require__(92);
var ResponsiveComponentsManager_1 = __webpack_require__(80);
var ResponsiveDropdownContent = /** @class */ (function () {
    function ResponsiveDropdownContent(componentName, element, coveoRoot, minWidth, widthRatio) {
        this.element = element;
        this.cssClassName = "coveo-" + componentName + "-dropdown-content";
        this.coveoRoot = coveoRoot;
        this.widthRatio = widthRatio;
        this.minWidth = minWidth;
    }
    ResponsiveDropdownContent.isTargetInsideOpenedDropdown = function (target) {
        var targetParentDropdown = target.parent(ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME);
        if (targetParentDropdown) {
            return targetParentDropdown.style.display != 'none';
        }
        return false;
    };
    ResponsiveDropdownContent.prototype.positionDropdown = function () {
        this.element.addClass(this.cssClassName);
        this.element.addClass(ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME);
        this.element.el.style.display = '';
        var width = this.widthRatio * this.coveoRoot.width();
        if (width <= this.minWidth) {
            width = this.minWidth;
        }
        this.element.el.style.width = width.toString() + 'px';
        var referenceElement = this.coveoRoot.find("." + ResponsiveComponentsManager_1.ResponsiveComponentsManager.DROPDOWN_HEADER_WRAPPER_CSS_CLASS);
        this.popperReference = new popper_js_1.default(referenceElement, this.element.el, {
            placement: 'bottom-end',
            positionFixed: true,
            modifiers: {
                preventOverflow: {
                    boundariesElement: this.coveoRoot.el
                }
            }
        });
    };
    ResponsiveDropdownContent.prototype.hideDropdown = function () {
        if (this.popperReference) {
            this.popperReference.destroy();
        }
        this.element.el.style.display = 'none';
        this.element.removeClass(this.cssClassName);
        this.element.removeClass(ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME);
    };
    ResponsiveDropdownContent.prototype.cleanUp = function () {
        this.element.el.removeAttribute('style');
    };
    ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME = 'coveo-dropdown-content';
    return ResponsiveDropdownContent;
}());
exports.ResponsiveDropdownContent = ResponsiveDropdownContent;


/***/ }),

/***/ 157:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _ = __webpack_require__(0);
var EventsUtils = /** @class */ (function () {
    function EventsUtils() {
    }
    // eventName must be in PascalCase
    EventsUtils.addPrefixedEvent = function (element, pascalCaseEventName, callback) {
        _.each(this.prefixes, function (prefix) {
            if (prefix == '') {
                pascalCaseEventName = pascalCaseEventName.toLowerCase();
            }
            element.addEventListener(prefix + pascalCaseEventName, callback, false);
        });
    };
    // eventName must be in PascalCase
    EventsUtils.removePrefixedEvent = function (element, pascalCaseEventName, callback) {
        _.each(this.prefixes, function (prefix) {
            if (prefix == '') {
                pascalCaseEventName = pascalCaseEventName.toLowerCase();
            }
            element.removeEventListener(prefix + pascalCaseEventName, callback, false);
        });
    };
    EventsUtils.prefixes = ['webkit', 'moz', 'MS', 'o', ''];
    return EventsUtils;
}());
exports.EventsUtils = EventsUtils;


/***/ }),

/***/ 158:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var StringUtils_1 = __webpack_require__(19);
var _ = __webpack_require__(0);
var FacetValuesOrder = /** @class */ (function () {
    function FacetValuesOrder(facet, facetSort) {
        this.facet = facet;
        this.facetSort = facetSort;
    }
    FacetValuesOrder.prototype.reorderValues = function (facetValues) {
        if (this.facetSort && this.facetSort.activeSort) {
            if (this.facetSort.activeSort.name == 'custom' && this.facet.options.customSort != undefined) {
                return this.reorderValuesWithCustomOrder(facetValues);
            }
            else if (this.facetSort.activeSort.name.indexOf('alpha') != -1) {
                return this.reorderValuesWithCustomCaption(facetValues);
            }
        }
        return facetValues;
    };
    FacetValuesOrder.prototype.reorderValuesWithCustomOrder = function (facetValues) {
        var customSortsLowercase = _.map(this.facet.options.customSort, function (customSort) { return customSort.toLowerCase(); });
        var valueIndexPair = _.map(facetValues, function (facetValue, i) {
            // Get the index of the current value in the custom sort array.
            // If it's not found, put it's index to it's original value + the length of customSort so that's always after the specified custom sort order.
            var index = _.findIndex(customSortsLowercase, function (customSort) {
                return (StringUtils_1.StringUtils.equalsCaseInsensitive(customSort, facetValue.value) ||
                    (facetValue.lookupValue != null && StringUtils_1.StringUtils.equalsCaseInsensitive(customSort, facetValue.lookupValue)));
            });
            if (index == -1) {
                index = i + customSortsLowercase.length;
            }
            return { facetValue: facetValue, index: index };
        });
        var sorted = _.sortBy(valueIndexPair, 'index');
        sorted = this.facetSort.customSortDirection == 'ascending' ? sorted : sorted.reverse();
        return _.pluck(sorted, 'facetValue');
    };
    FacetValuesOrder.prototype.reorderValuesWithCustomCaption = function (facetValues) {
        var _this = this;
        var sorted = facetValues.sort(function (firstValue, secondValue) {
            return _this.facet.getValueCaption(firstValue).localeCompare(_this.facet.getValueCaption(secondValue), String['locale'], {
                sensitivity: 'base'
            });
        });
        if (this.facetSort.activeSort.name.indexOf('descending') != -1) {
            sorted = sorted.reverse();
        }
        return sorted;
    };
    return FacetValuesOrder;
}());
exports.FacetValuesOrder = FacetValuesOrder;


/***/ }),

/***/ 160:
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
var ResponsiveFacetColumn_1 = __webpack_require__(335);
var Facet_1 = __webpack_require__(51);
var ResponsiveFacets = /** @class */ (function (_super) {
    __extends(ResponsiveFacets, _super);
    function ResponsiveFacets() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ResponsiveFacets.init = function (root, component, options) {
        ResponsiveFacetColumn_1.ResponsiveFacetColumn.init(ResponsiveFacets, root, component, options, Facet_1.Facet.ID);
    };
    return ResponsiveFacets;
}(ResponsiveFacetColumn_1.ResponsiveFacetColumn));
exports.ResponsiveFacets = ResponsiveFacets;


/***/ }),

/***/ 161:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var EventsUtils_1 = __webpack_require__(157);
var _ = __webpack_require__(0);
var AccessibleButton_1 = __webpack_require__(17);
var KeyboardUtils_1 = __webpack_require__(30);
var InitializationEvents_1 = __webpack_require__(15);
var ResponsiveDropdownEvent;
(function (ResponsiveDropdownEvent) {
    ResponsiveDropdownEvent["OPEN"] = "responsiveDropdownOpen";
    ResponsiveDropdownEvent["CLOSE"] = "responsiveDropdownClose";
})(ResponsiveDropdownEvent = exports.ResponsiveDropdownEvent || (exports.ResponsiveDropdownEvent = {}));
var ResponsiveDropdown = /** @class */ (function () {
    function ResponsiveDropdown(dropdownContent, dropdownHeader, coveoRoot) {
        var _this = this;
        this.dropdownContent = dropdownContent;
        this.dropdownHeader = dropdownHeader;
        this.coveoRoot = coveoRoot;
        this.isOpened = false;
        this.onOpenHandlers = [];
        this.onCloseHandlers = [];
        this.popupBackgroundIsEnabled = true;
        this.closeIfOpened = function () {
            _this.isOpened && _this.close();
        };
        this.popupBackground = this.buildPopupBackground();
        this.bindOnClickDropdownHeaderEvent();
        this.saveContentPosition();
        this.bindOnKeyboardEscapeEvent();
        this.bindNukeEvents();
    }
    ResponsiveDropdown.prototype.registerOnOpenHandler = function (handler, context) {
        this.onOpenHandlers.push({ handler: handler, context: context });
    };
    ResponsiveDropdown.prototype.registerOnCloseHandler = function (handler, context) {
        this.onCloseHandlers.push({ handler: handler, context: context });
    };
    ResponsiveDropdown.prototype.cleanUp = function () {
        this.close();
        this.dropdownHeader.cleanUp();
        this.dropdownContent.cleanUp();
        this.restoreContentPosition();
    };
    ResponsiveDropdown.prototype.open = function () {
        this.isOpened = true;
        this.dropdownHeader.open();
        this.dropdownContent.positionDropdown();
        _.each(this.onOpenHandlers, function (handlerCall) {
            handlerCall.handler.apply(handlerCall.context);
        });
        this.showPopupBackground();
        Dom_1.$$(this.dropdownHeader.element).trigger(ResponsiveDropdownEvent.OPEN);
    };
    ResponsiveDropdown.prototype.close = function () {
        this.isOpened = false;
        _.each(this.onCloseHandlers, function (handlerCall) {
            handlerCall.handler.apply(handlerCall.context);
        });
        this.dropdownHeader.close();
        this.dropdownContent.hideDropdown();
        this.hidePopupBackground();
        Dom_1.$$(this.dropdownHeader.element).trigger(ResponsiveDropdownEvent.CLOSE);
    };
    ResponsiveDropdown.prototype.disablePopupBackground = function () {
        this.popupBackgroundIsEnabled = false;
    };
    ResponsiveDropdown.prototype.bindOnClickDropdownHeaderEvent = function () {
        var _this = this;
        new AccessibleButton_1.AccessibleButton()
            .withElement(this.dropdownHeader.element)
            .withSelectAction(function () { return (_this.isOpened ? _this.close() : _this.open()); })
            .withLabel('Filters')
            .build();
    };
    ResponsiveDropdown.prototype.bindOnKeyboardEscapeEvent = function () {
        Dom_1.$$(document.documentElement).on('keyup', KeyboardUtils_1.KeyboardUtils.keypressAction(KeyboardUtils_1.KEYBOARD.ESCAPE, this.closeIfOpened));
    };
    ResponsiveDropdown.prototype.unbindOnKeyboardEscapeEvent = function () {
        Dom_1.$$(document.documentElement).off('keyup', KeyboardUtils_1.KeyboardUtils.keypressAction(KeyboardUtils_1.KEYBOARD.ESCAPE, this.closeIfOpened));
    };
    ResponsiveDropdown.prototype.bindNukeEvents = function () {
        var _this = this;
        Dom_1.$$(this.coveoRoot).on(InitializationEvents_1.InitializationEvents.nuke, function () {
            _this.unbindOnKeyboardEscapeEvent();
        });
    };
    ResponsiveDropdown.prototype.showPopupBackground = function () {
        if (this.popupBackgroundIsEnabled) {
            this.coveoRoot.el.appendChild(this.popupBackground.el);
            window.getComputedStyle(this.popupBackground.el).opacity;
            this.popupBackground.el.style.opacity = ResponsiveDropdown.TRANSPARENT_BACKGROUND_OPACITY;
            this.popupBackground.addClass('coveo-dropdown-background-active');
        }
    };
    ResponsiveDropdown.prototype.hidePopupBackground = function () {
        if (this.popupBackgroundIsEnabled) {
            // forces the browser to reflow the element, so that the transition is applied.
            window.getComputedStyle(this.popupBackground.el).opacity;
            this.popupBackground.el.style.opacity = '0';
            this.popupBackground.removeClass('coveo-dropdown-background-active');
        }
    };
    ResponsiveDropdown.prototype.buildPopupBackground = function () {
        var _this = this;
        var popupBackground = Dom_1.$$('div', { className: ResponsiveDropdown.DROPDOWN_BACKGROUND_CSS_CLASS_NAME });
        EventsUtils_1.EventsUtils.addPrefixedEvent(popupBackground.el, 'TransitionEnd', function () {
            if (popupBackground.el.style.opacity == '0') {
                popupBackground.detach();
            }
        });
        popupBackground.on('click', function () { return _this.close(); });
        return popupBackground;
    };
    ResponsiveDropdown.prototype.saveContentPosition = function () {
        var dropdownContentPreviousSibling = this.dropdownContent.element.el.previousSibling;
        var dropdownContentParent = this.dropdownContent.element.el.parentElement;
        this.previousSibling = dropdownContentPreviousSibling ? Dom_1.$$(dropdownContentPreviousSibling) : null;
        this.parent = Dom_1.$$(dropdownContentParent);
    };
    ResponsiveDropdown.prototype.restoreContentPosition = function () {
        if (this.previousSibling) {
            this.dropdownContent.element.insertAfter(this.previousSibling.el);
        }
        else {
            this.parent.prepend(this.dropdownContent.element.el);
        }
    };
    ResponsiveDropdown.TRANSPARENT_BACKGROUND_OPACITY = '0.9';
    ResponsiveDropdown.DROPDOWN_BACKGROUND_CSS_CLASS_NAME = 'coveo-dropdown-background';
    return ResponsiveDropdown;
}());
exports.ResponsiveDropdown = ResponsiveDropdown;


/***/ }),

/***/ 165:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/// <reference path='../ui/Facet/Facet.ts' />
Object.defineProperty(exports, "__esModule", { value: true });
var ExpressionBuilder_1 = __webpack_require__(58);
var Utils_1 = __webpack_require__(4);
var FacetSearchParameters_1 = __webpack_require__(128);
var Assert_1 = __webpack_require__(5);
var FacetUtils_1 = __webpack_require__(47);
var _ = __webpack_require__(0);
var QueryBuilderExpression_1 = __webpack_require__(134);
var FacetQueryController = /** @class */ (function () {
    function FacetQueryController(facet) {
        this.facet = facet;
    }
    /**
     * Reset the expression for the facet search, used when a new query is triggered
     */
    FacetQueryController.prototype.prepareForNewQuery = function () {
        this.lastGroupByRequestIndex = undefined;
        this.expressionToUseForFacetSearch = undefined;
        this.constantExpressionToUseForFacetSearch = undefined;
    };
    /**
     * Compute the filter expression that the facet needs to output for the query
     * @returns {string}
     */
    FacetQueryController.prototype.computeOurFilterExpression = function () {
        var _this = this;
        var builder = new ExpressionBuilder_1.ExpressionBuilder();
        var selected = this.facet.values.getSelected();
        if (selected.length > 0) {
            if (this.facet.options.useAnd) {
                _.each(selected, function (value) {
                    builder.addFieldExpression(_this.facet.options.field, '==', [value.value]);
                });
            }
            else {
                builder.addFieldExpression(this.facet.options.field, '==', _.map(selected, function (value) { return value.value; }));
            }
        }
        var excluded = this.facet.values.getExcluded();
        if (excluded.length > 0) {
            builder.addFieldNotEqualExpression(this.facet.options.field, _.map(excluded, function (value) { return value.value; }));
        }
        if (Utils_1.Utils.isNonEmptyString(this.facet.options.additionalFilter)) {
            builder.add(this.facet.options.additionalFilter);
        }
        return builder.build();
    };
    /**
     * Build the group by request for the facet, and insert it in the query builder
     * @param queryBuilder
     */
    FacetQueryController.prototype.putGroupByIntoQueryBuilder = function (queryBuilder) {
        Assert_1.Assert.exists(queryBuilder);
        var allowedValues = this.createGroupByAllowedValues();
        var groupByRequest = this.createBasicGroupByRequest(allowedValues);
        var queryOverrideObject = this.createGroupByQueryOverride(queryBuilder);
        if (!Utils_1.Utils.isNullOrUndefined(queryOverrideObject) || !QueryBuilderExpression_1.QueryBuilderExpression.isEmpty(queryOverrideObject)) {
            groupByRequest.queryOverride = queryOverrideObject.basic;
            groupByRequest.advancedQueryOverride = queryOverrideObject.advanced;
            groupByRequest.constantQueryOverride = queryOverrideObject.constant;
            this.expressionToUseForFacetSearch = queryOverrideObject.withoutConstant;
            this.basicExpressionToUseForFacetSearch = queryOverrideObject.basic;
            this.advancedExpressionToUseForFacetSearch = queryOverrideObject.advanced;
            this.constantExpressionToUseForFacetSearch = queryOverrideObject.constant;
        }
        else {
            var parts = queryBuilder.computeCompleteExpressionParts();
            this.expressionToUseForFacetSearch = parts.withoutConstant == null ? '' : parts.withoutConstant;
            this.basicExpressionToUseForFacetSearch = parts.basic == null ? '' : parts.basic;
            this.advancedExpressionToUseForFacetSearch = parts.advanced;
            this.constantExpressionToUseForFacetSearch = parts.constant;
        }
        this.lastGroupByRequestIndex = queryBuilder.groupByRequests.length;
        this.lastGroupByRequest = groupByRequest;
        queryBuilder.groupByRequests.push(groupByRequest);
    };
    /**
     * Search inside the facet, using a group by request
     * @param params
     * @param oldLength Optional params, used by the search method to call itself recursively to fetch all required values
     * @returns {Promise|Promise<T>}
     */
    FacetQueryController.prototype.search = function (params, oldLength) {
        var _this = this;
        if (oldLength === void 0) { oldLength = params.nbResults; }
        // For search, we want to retrieve the exact values we requested, and not additional ones
        params.completeFacetWithStandardValues = false;
        return new Promise(function (resolve, reject) {
            var onResult = function (fieldValues) {
                var newLength = fieldValues.length;
                fieldValues = _this.checkForFacetSearchValuesToRemove(fieldValues, params.valueToSearch);
                if (FacetUtils_1.FacetUtils.needAnotherFacetSearch(fieldValues.length, newLength, oldLength, 5)) {
                    // This means that we removed enough values from the returned one that we need to perform a new search with more values requested.
                    params.nbResults += 5;
                    return _this.search(params, fieldValues.length);
                }
                else {
                    resolve(fieldValues);
                }
            };
            var searchPromise = _this.facet.getEndpoint().search(params.getQuery());
            _this.currentSearchPromise = searchPromise;
            searchPromise
                .then(function (queryResults) {
                if (_this.currentSearchPromise == searchPromise) {
                    // params.getQuery() will generate a query for all excluded values + some new values
                    // there is no clean way to do a group by and remove some values
                    // so instead we request more values than we need, and crop all the one we don't want
                    var valuesCropped_1 = [];
                    if (queryResults.groupByResults && queryResults.groupByResults[0]) {
                        _.each(queryResults.groupByResults[0].values, function (v) {
                            if (v.lookupValue) {
                                if (!_.contains(params.alwaysExclude, v.lookupValue.toLowerCase())) {
                                    valuesCropped_1.push(v);
                                }
                            }
                            else {
                                if (!_.contains(params.alwaysExclude, v.value.toLowerCase())) {
                                    valuesCropped_1.push(v);
                                }
                            }
                        });
                    }
                    onResult(_.first(valuesCropped_1, params.nbResults));
                }
                else {
                    reject();
                }
            })
                .catch(function (error) {
                reject(error);
            });
        });
    };
    FacetQueryController.prototype.fetchMore = function (numberOfValuesToFetch) {
        var _this = this;
        var params = new FacetSearchParameters_1.FacetSearchParameters(this.facet);
        params.alwaysInclude = this.facet.options.allowedValues || _.pluck(this.facet.values.getAll(), 'value');
        params.nbResults = numberOfValuesToFetch;
        return this.facet
            .getEndpoint()
            .search(params.getQuery())
            .then(function (results) {
            if (_this.facet.options.allowedValues && results && results.groupByResults && results.groupByResults[0]) {
                results.groupByResults[0].values = _this.filterByAllowedValueOption(results.groupByResults[0].values);
            }
            return results;
        });
    };
    FacetQueryController.prototype.searchInFacetToUpdateDelta = function (facetValues) {
        var params = new FacetSearchParameters_1.FacetSearchParameters(this.facet);
        var query = params.getQuery();
        query.aq = (query.aq ? query.aq : '') + " " + this.computeOurFilterExpression();
        _.each(facetValues, function (facetValue) {
            facetValue.waitingForDelta = true;
        });
        query.groupBy = [this.createBasicGroupByRequest(_.map(facetValues, function (facetValue) { return facetValue.value; }))];
        query.groupBy[0].completeFacetWithStandardValues = false;
        return this.facet.getEndpoint().search(query);
    };
    FacetQueryController.prototype.createGroupByAllowedValues = function () {
        // if you want to keep displayed values next time, take all current values as allowed values
        // otherwise take only the selected value
        if (this.facet.options.allowedValues != undefined) {
            return this.facet.options.allowedValues;
        }
        else if (this.facet.options.customSort != undefined) {
            // If there is a custom sort, we still need to add selectedValues to the group by
            // Filter out duplicates with a lower case comparison on the value
            return this.getUnionWithCustomSortLowercase(this.facet.options.customSort, this.getAllowedValuesFromSelected());
        }
        else {
            return _.map(this.getAllowedValuesFromSelected(), function (facetValue) { return facetValue.value; });
        }
    };
    FacetQueryController.prototype.createBasicGroupByRequest = function (allowedValues, addComputedField) {
        if (addComputedField === void 0) { addComputedField = true; }
        var nbOfRequestedValues = this.facet.numberOfValues;
        if (this.facet.options.customSort != null) {
            // If we have a custom sort, we need to make sure that we always request at least enough values to always receive them
            var usedValues = this.getUnionWithCustomSortLowercase(this.facet.options.customSort, this.facet.values.getSelected().concat(this.facet.values.getExcluded()));
            nbOfRequestedValues = Math.max(nbOfRequestedValues, usedValues.length);
        }
        var groupByRequest = {
            field: this.facet.options.field,
            maximumNumberOfValues: nbOfRequestedValues + (this.facet.options.enableMoreLess ? 1 : 0),
            sortCriteria: this.facet.options.sortCriteria,
            injectionDepth: this.facet.options.injectionDepth,
            completeFacetWithStandardValues: this.facet.options.allowedValues == undefined ? true : false
        };
        if (this.facet.options.lookupField) {
            groupByRequest.lookupField = this.facet.options.lookupField;
        }
        if (allowedValues != null) {
            groupByRequest.allowedValues = allowedValues;
        }
        if (addComputedField && Utils_1.Utils.isNonEmptyString(this.facet.options.computedField)) {
            groupByRequest.computedFields = [
                {
                    field: this.facet.options.computedField,
                    operation: this.facet.options.computedFieldOperation
                }
            ];
        }
        return groupByRequest;
    };
    FacetQueryController.prototype.getAllowedValuesFromSelected = function () {
        var facetValues = [];
        if (this.facet.options.useAnd || !this.facet.keepDisplayedValuesNextTime) {
            var selected = this.facet.values.getSelected();
            if (selected.length == 0) {
                return undefined;
            }
            facetValues = this.facet.values.getSelected();
        }
        else {
            facetValues = this.facet.values.getAll();
        }
        return facetValues;
    };
    Object.defineProperty(FacetQueryController.prototype, "additionalFilter", {
        get: function () {
            return this.facet.options.additionalFilter ? this.facet.options.additionalFilter : '';
        },
        enumerable: true,
        configurable: true
    });
    FacetQueryController.prototype.getUnionWithCustomSortLowercase = function (customSort, facetValues) {
        // This will take the custom sort, compare it against the passed in facetValues
        // The comparison is lowercase.
        // The union of the 2 arrays with duplicated filtered out is returned.
        var toCompare = _.map(customSort, function (val) {
            return val.toLowerCase();
        });
        var filtered = _.chain(facetValues)
            .filter(function (facetValue) {
            return !_.contains(toCompare, facetValue.value.toLowerCase());
        })
            .map(function (facetValue) {
            return facetValue.value;
        })
            .value();
        return _.compact(customSort.concat(filtered));
    };
    FacetQueryController.prototype.createGroupByQueryOverride = function (queryBuilder) {
        var queryBuilderExpression = queryBuilder.computeCompleteExpressionParts();
        if (this.queryOverrideIsNeededForMultiSelection()) {
            queryBuilderExpression = this.processQueryOverrideForMultiSelection(queryBuilder, queryBuilderExpression);
        }
        else {
            queryBuilderExpression.reset();
        }
        if (this.queryOverrideIsNeededForAdditionalFilter()) {
            queryBuilderExpression = this.processQueryOverrideForAdditionalFilter(queryBuilder, queryBuilderExpression);
        }
        queryBuilderExpression = this.processQueryOverrideForEmptyValues(queryBuilder, queryBuilderExpression);
        if (QueryBuilderExpression_1.QueryBuilderExpression.isEmpty(queryBuilderExpression)) {
            return null;
        }
        return queryBuilderExpression;
    };
    FacetQueryController.prototype.queryOverrideIsNeededForMultiSelection = function () {
        if (this.facet.options.useAnd) {
            return false;
        }
        if (this.facet.values.hasSelectedOrExcludedValues()) {
            return true;
        }
        return false;
    };
    FacetQueryController.prototype.queryOverrideIsNeededForAdditionalFilter = function () {
        return Utils_1.Utils.isNonEmptyString(this.additionalFilter);
    };
    FacetQueryController.prototype.processQueryOverrideForMultiSelection = function (queryBuilder, mergeWith) {
        if (this.facet.values.hasSelectedOrExcludedValues()) {
            mergeWith = queryBuilder.computeCompleteExpressionPartsExcept(this.computeOurFilterExpression());
            if (QueryBuilderExpression_1.QueryBuilderExpression.isEmpty(mergeWith)) {
                mergeWith.advanced = '@uri';
            }
        }
        return mergeWith;
    };
    FacetQueryController.prototype.processQueryOverrideForAdditionalFilter = function (queryBuilder, mergeWith) {
        if (Utils_1.Utils.isEmptyString(mergeWith.basic)) {
            mergeWith.basic = queryBuilder.expression.build();
        }
        if (Utils_1.Utils.isEmptyString(mergeWith.constant)) {
            var addExistingConstantExpressionIfNotEmpty = queryBuilder.constantExpression.isEmpty()
                ? ''
                : queryBuilder.constantExpression.build() + ' ';
            mergeWith.constant = "" + addExistingConstantExpressionIfNotEmpty + this.additionalFilter;
        }
        else {
            mergeWith.constant = mergeWith.constant + " " + this.additionalFilter;
        }
        if (!mergeWith.advanced) {
            mergeWith.advanced = queryBuilder.advancedExpression.build();
        }
        return mergeWith;
    };
    FacetQueryController.prototype.processQueryOverrideForEmptyValues = function (queryBuilder, mergeWith) {
        var withoutEmptyValues = _.chain(mergeWith)
            .keys()
            .each(function (key) {
            if (Utils_1.Utils.isEmptyString(mergeWith[key]) || Utils_1.Utils.isNullOrUndefined(mergeWith[key])) {
                delete mergeWith[key];
            }
        })
            .value();
        if (_.keys(withoutEmptyValues).length == 0) {
            mergeWith = undefined;
        }
        return mergeWith;
    };
    FacetQueryController.prototype.checkForFacetSearchValuesToRemove = function (fieldValues, valueToCheckAgainst) {
        var _this = this;
        var regex = FacetUtils_1.FacetUtils.getRegexToUseForFacetSearch(valueToCheckAgainst, this.facet.options.facetSearchIgnoreAccents);
        return _.filter(fieldValues, function (fieldValue) {
            var isAllowed = _.isEmpty(_this.facet.options.allowedValues) || _this.isValueAllowedByAllowedValueOption(fieldValue.value);
            var value = _this.facet.getValueCaption(fieldValue);
            return isAllowed && regex.test(value);
        });
    };
    FacetQueryController.prototype.filterByAllowedValueOption = function (values) {
        var _this = this;
        return _.filter(values, function (value) { return _this.isValueAllowedByAllowedValueOption(value.value); });
    };
    FacetQueryController.prototype.isValueAllowedByAllowedValueOption = function (value) {
        // Allowed value option on the facet should support * (wildcard searches)
        // We need to filter values client side the index will completeWithStandardValues
        // Replace the wildcard (*) for a regex match (.*)
        // Also replace the (?) with "any character once" since it is also supported by the index
        return _.some(this.facet.options.allowedValues, function (allowedValue) {
            var regex = new RegExp("^" + allowedValue.replace(/\*/g, '.*').replace(/\?/g, '.') + "$", 'gi');
            return regex.test(value);
        });
    };
    return FacetQueryController;
}());
exports.FacetQueryController = FacetQueryController;


/***/ }),

/***/ 17:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1 = __webpack_require__(11);
var KeyboardUtils_1 = __webpack_require__(30);
var Dom_1 = __webpack_require__(1);
__webpack_require__(371);
var AccessibleButton = /** @class */ (function () {
    function AccessibleButton() {
        this.logger = new Logger_1.Logger(this);
    }
    AccessibleButton.prototype.withOwner = function (owner) {
        this.eventOwner = owner;
        return this;
    };
    AccessibleButton.prototype.withElement = function (element) {
        if (element instanceof HTMLElement) {
            this.element = Dom_1.$$(element);
        }
        else {
            this.element = element;
        }
        return this;
    };
    AccessibleButton.prototype.withLabel = function (label) {
        this.label = label;
        return this;
    };
    AccessibleButton.prototype.withTitle = function (title) {
        this.title = title;
        return this;
    };
    AccessibleButton.prototype.withSelectAction = function (action) {
        this.clickAction = action;
        this.enterKeyboardAction = action;
        return this;
    };
    AccessibleButton.prototype.withClickAction = function (clickAction) {
        this.clickAction = clickAction;
        return this;
    };
    AccessibleButton.prototype.withEnterKeyboardAction = function (enterAction) {
        this.enterKeyboardAction = enterAction;
        return this;
    };
    AccessibleButton.prototype.withFocusAndMouseEnterAction = function (action) {
        this.focusAction = action;
        this.mouseenterAction = action;
        return this;
    };
    AccessibleButton.prototype.withFocusAction = function (action) {
        this.focusAction = action;
        return this;
    };
    AccessibleButton.prototype.withMouseEnterAction = function (action) {
        this.mouseenterAction = action;
        return this;
    };
    AccessibleButton.prototype.withBlurAndMouseLeaveAction = function (action) {
        this.mouseleaveAction = action;
        this.blurAction = action;
        return this;
    };
    AccessibleButton.prototype.withMouseLeaveAction = function (action) {
        this.mouseleaveAction = action;
        return this;
    };
    AccessibleButton.prototype.withBlurAction = function (action) {
        this.blurAction = action;
        return this;
    };
    AccessibleButton.prototype.build = function () {
        if (!this.element) {
            this.element = Dom_1.$$('div');
        }
        this.ensureCorrectRole();
        this.ensureCorrectLabel();
        this.ensureTitle();
        this.ensureSelectAction();
        this.ensureUnselectAction();
        this.ensureMouseenterAndFocusAction();
        this.ensureMouseleaveAndBlurAction();
        this.ensureDifferentiationBetweenKeyboardAndMouseFocus();
        return this;
    };
    AccessibleButton.prototype.ensureDifferentiationBetweenKeyboardAndMouseFocus = function () {
        var _this = this;
        var classOnPress = 'coveo-accessible-button-pressed';
        var classOnFocus = 'coveo-accessible-button-focused';
        Dom_1.$$(this.element).addClass('coveo-accessible-button');
        Dom_1.$$(this.element).on('mousedown', function () {
            Dom_1.$$(_this.element).addClass(classOnPress);
            Dom_1.$$(_this.element).removeClass(classOnFocus);
        });
        Dom_1.$$(this.element).on('mouseup', function () { return Dom_1.$$(_this.element).removeClass(classOnPress); });
        Dom_1.$$(this.element).on('focus', function () {
            if (!Dom_1.$$(_this.element).hasClass(classOnPress)) {
                Dom_1.$$(_this.element).addClass(classOnFocus);
            }
        });
        Dom_1.$$(this.element).on('blur', function () { return Dom_1.$$(_this.element).removeClass(classOnFocus); });
    };
    AccessibleButton.prototype.ensureCorrectRole = function () {
        if (!this.element.getAttribute('role')) {
            this.element.setAttribute('role', 'button');
        }
    };
    AccessibleButton.prototype.ensureCorrectLabel = function () {
        if (!this.label) {
            this.logger.error("Missing label to create an accessible button !");
            return;
        }
        this.element.setAttribute('aria-label', this.label);
    };
    AccessibleButton.prototype.ensureTitle = function () {
        this.title && this.element.setAttribute('title', this.title);
    };
    AccessibleButton.prototype.ensureTabIndex = function () {
        this.element.setAttribute('tabindex', '0');
    };
    AccessibleButton.prototype.ensureSelectAction = function () {
        var _this = this;
        if (this.enterKeyboardAction) {
            this.ensureTabIndex();
            this.bindEvent('keyup', KeyboardUtils_1.KeyboardUtils.keypressAction(KeyboardUtils_1.KEYBOARD.ENTER, function (e) { return _this.enterKeyboardAction(e); }));
        }
        if (this.clickAction) {
            this.bindEvent('click', this.clickAction);
        }
    };
    AccessibleButton.prototype.ensureUnselectAction = function () {
        if (this.blurAction) {
            this.bindEvent('blur', this.blurAction);
        }
        if (this.mouseleaveAction) {
            this.bindEvent('mouseleave', this.mouseleaveAction);
        }
    };
    AccessibleButton.prototype.ensureMouseenterAndFocusAction = function () {
        if (this.mouseenterAction) {
            this.bindEvent('mouseenter', this.mouseenterAction);
        }
        if (this.focusAction) {
            this.bindEvent('focus', this.focusAction);
        }
    };
    AccessibleButton.prototype.ensureMouseleaveAndBlurAction = function () {
        if (this.mouseleaveAction) {
            this.bindEvent('mouseleave', this.mouseleaveAction);
        }
        if (this.blurAction) {
            this.bindEvent('blur', this.blurAction);
        }
    };
    AccessibleButton.prototype.bindEvent = function (event, action) {
        if (this.eventOwner) {
            this.eventOwner.on(this.element, event, action);
        }
        else {
            Dom_1.$$(this.element).on(event, action);
        }
    };
    return AccessibleButton;
}());
exports.AccessibleButton = AccessibleButton;


/***/ }),

/***/ 200:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/// <reference path="../../controllers/HierarchicalFacetQueryController.ts" />
/// <reference path="HierarchicalFacetValuesList.ts" />
/// <reference path="HierarchicalFacetSearch.ts" />
/// <reference path="HierarchicalBreadcrumbValuesList.ts" />
/// <reference path="HierarchicalFacetValueElement.ts" />
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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var FacetValues_1 = __webpack_require__(94);
var Facet_1 = __webpack_require__(51);
var ComponentOptions_1 = __webpack_require__(8);
var HierarchicalFacetValuesList_1 = __webpack_require__(447);
var HierarchicalFacetQueryController_1 = __webpack_require__(448);
var Utils_1 = __webpack_require__(4);
var Dom_1 = __webpack_require__(1);
var Defer_1 = __webpack_require__(28);
var HierarchicalFacetSearchValuesList_1 = __webpack_require__(449);
var HierarchicalFacetSearch_1 = __webpack_require__(451);
var HierarchicalBreadcrumbValuesList_1 = __webpack_require__(452);
var Assert_1 = __webpack_require__(5);
var OmniboxHierarchicalValuesList_1 = __webpack_require__(454);
var HierarchicalFacetValueElement_1 = __webpack_require__(456);
var Initialization_1 = __webpack_require__(2);
var _ = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
__webpack_require__(457);
var SVGIcons_1 = __webpack_require__(13);
var SVGDom_1 = __webpack_require__(14);
var ResponsiveFacetOptions_1 = __webpack_require__(81);
/**
 * @deprecated This component is exposed for legacy reasons. Instead, use the {@link CategoryFacet} component, which is more performant and easier to use.
 *
 * The `HierarchicalFacet` component inherits all of its options and behaviors from the [`Facet`]{@link Facet}
 * component, but is meant to be used to render hierarchical values.
 *
 * **Note:**
 * > The `HierarchicalFacet` component does not support the [`customSort`]{@link Facet.options.customSort}
 * > `Facet` option.
 *
 * The `HierarchicalFacet` component can be used to display files in a file system, or categories for items in a
 * hierarchy.
 *
 * This facet requires a group by field with a special format to work correctly.
 *
 * **Example:**
 *
 * You have the following files indexed on a file system:
 * ```
 * c:\
 *   folder1\
 *     text1.txt
 *   folder2\
 *     folder3\
 *       text2.txt
 * ```
 * The `text1.txt` item would have a field with the following format:
 * `c; c|folder1;`
 *
 * The `text2.txt` item would have a field with the following format:
 * `c; c|folder2; c|folder2|folder3;`
 *
 * By default, the `|` character determines the hierarchy (`folder3` inside `folder2` inside `c`).
 *
 * Since both items contain the `c` value, selecting it value in the facet would return both items.
 *
 * Selecting the `folder3` value in the facet would only return the `text2.txt` item.
 *
 * @notSupportedIn salesforcefree
 */
var HierarchicalFacet = /** @class */ (function (_super) {
    __extends(HierarchicalFacet, _super);
    /**
     * Creates a new `HierarchicalFacet` component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the `HierarchicalFacet` component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function HierarchicalFacet(element, options, bindings) {
        var _this = _super.call(this, element, options, bindings, HierarchicalFacet.ID) || this;
        _this.element = element;
        _this.bindings = bindings;
        _this.shouldReshuffleFacetValuesClientSide = false;
        _this.correctLevels = [];
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, HierarchicalFacet, _this.options);
        _this.numberOfValuesToShow = _this.originalNumberOfValuesToShow = _this.options.numberOfValues || 5;
        _this.numberOfValues = Math.max(_this.options.numberOfValues, 10000);
        _this.options.injectionDepth = Math.max(_this.options.injectionDepth, 10000);
        _this.logger.info('Hierarchy facet: Set number of values very high in order to build hierarchy', _this.numberOfValues, _this);
        _this.logger.info('Hierarchy facet: Set injection depth very high in order to build hierarchy', _this.options.injectionDepth);
        return _this;
    }
    /**
     * Selects a single value.
     * @param value The value to select.
     * @param selectChildren Specifies whether to also select all child values (if any). Default value is the opposite of
     * the [`useAnd`]{@link Facet.options.useAnd} option value set for this `HierarchicalFacet`.
     */
    HierarchicalFacet.prototype.selectValue = function (value, selectChildren) {
        if (selectChildren === void 0) { selectChildren = !this.options.useAnd; }
        this.ensureDom();
        this.ensureValueHierarchyExists([value]);
        var valueHierarchy = this.getValueFromHierarchy(value);
        if (selectChildren) {
            this.selectChilds(valueHierarchy, valueHierarchy.childs);
        }
        this.flagParentForSelection(valueHierarchy);
        _super.prototype.selectValue.call(this, value);
    };
    /**
     * Selects multiple values
     * @param values The array of values to select.
     * @param selectChildren Specifies whether to also select all child values (if any). Default value is the opposite of
     * the [`useAnd`]{@link Facet.options.useAnd} option value set for this `HierarchicalFacet`.
     */
    HierarchicalFacet.prototype.selectMultipleValues = function (values, selectChildren) {
        var _this = this;
        if (selectChildren === void 0) { selectChildren = !this.options.useAnd; }
        this.ensureDom();
        this.ensureValueHierarchyExists(values);
        _.each(values, function (value) {
            var valueHierarchy = _this.getValueFromHierarchy(value);
            _this.flagParentForSelection(valueHierarchy);
            if (selectChildren) {
                _.each(valueHierarchy.childs, function (child) {
                    _this.selectValue(child.facetValue);
                });
            }
        });
        _super.prototype.selectMultipleValues.call(this, values);
    };
    /**
     * Deselects a single value
     * @param value The value to deselect.
     * @param deselectChildren Specifies whether to also deselect all child values (if any). Default value is `true`.
     */
    HierarchicalFacet.prototype.deselectValue = function (value, deselectChildren) {
        var _this = this;
        if (deselectChildren === void 0) { deselectChildren = true; }
        this.ensureDom();
        this.ensureValueHierarchyExists([value]);
        var valueHierarchy = this.getValueFromHierarchy(value);
        if (deselectChildren) {
            var hasChilds = valueHierarchy.childs != undefined;
            if (hasChilds) {
                var activeChilds = _.filter(valueHierarchy.childs, function (child) {
                    var valueToCompare = _this.getFacetValueFromHierarchy(child.facetValue);
                    return valueToCompare.selected || valueToCompare.excluded;
                });
                valueHierarchy.hasChildSelected = false;
                if (activeChilds.length == valueHierarchy.childs.length) {
                    this.deselectChilds(valueHierarchy, valueHierarchy.childs);
                }
            }
        }
        this.deselectParent(valueHierarchy.parent);
        this.unflagParentForSelection(valueHierarchy);
        _super.prototype.deselectValue.call(this, value);
    };
    /**
     * Excludes a single value.
     * @param value The value to exclude.
     * @param excludeChildren Specifies whether to also exclude all child values (if any). Default value is the opposite
     * of the [`useAnd`]{@link Facet.options.useAnd} option value set for this `HierarchicalFacet`.
     */
    HierarchicalFacet.prototype.excludeValue = function (value, excludeChildren) {
        if (excludeChildren === void 0) { excludeChildren = !this.options.useAnd; }
        this.ensureDom();
        this.ensureValueHierarchyExists([value]);
        var valueHierarchy = this.getValueFromHierarchy(value);
        if (excludeChildren) {
            this.excludeChilds(valueHierarchy.childs);
        }
        else {
            this.deselectChilds(valueHierarchy, valueHierarchy.childs);
            this.close(valueHierarchy);
        }
        this.flagParentForSelection(valueHierarchy);
        _super.prototype.excludeValue.call(this, value);
    };
    /**
     * Un-excludes a single value.
     * @param value The value to un-exclude.
     * @param unexludeChildren Specifies whether to also un-exclude all child values (if any). Default value is the
     * opposite of the [`useAnd`]{@link Facet.options.useAnd} option value set for this `HierarchicalFacet`.
     */
    HierarchicalFacet.prototype.unexcludeValue = function (value, unexludeChildren) {
        if (unexludeChildren === void 0) { unexludeChildren = !this.options.useAnd; }
        this.ensureDom();
        this.ensureValueHierarchyExists([value]);
        var valueHierarchy = this.getValueFromHierarchy(value);
        if (unexludeChildren) {
            this.unexcludeChilds(valueHierarchy.childs);
        }
        this.unflagParentForSelection(valueHierarchy);
        _super.prototype.unexcludeValue.call(this, value);
    };
    /**
     * Deselects multiple values.
     * @param values The array of values to deselect.
     * @param deselectChildren Specifies whether to also deselect all child values (if any). Default value is the opposite
     * of the [`useAnd`]{@link Facet.options.useAnd} option value set for this `HierarchicalFacet`.
     */
    HierarchicalFacet.prototype.deselectMultipleValues = function (values, deselectChildren) {
        var _this = this;
        if (deselectChildren === void 0) { deselectChildren = !this.options.useAnd; }
        this.ensureDom();
        this.ensureValueHierarchyExists(values);
        _.each(values, function (value) {
            var valueHierarchy = _this.getValueFromHierarchy(value);
            valueHierarchy.hasChildSelected = false;
            _this.unflagParentForSelection(valueHierarchy);
            if (deselectChildren) {
                _.each(valueHierarchy.childs, function (child) {
                    var childInHierarchy = _this.getValueFromHierarchy(child.facetValue);
                    childInHierarchy.hasChildSelected = false;
                    _this.deselectValue(child.facetValue);
                });
            }
        });
        _super.prototype.deselectMultipleValues.call(this, values);
    };
    /**
     * Toggles the selection of a single value (selects value if not selected; deselects value if selected).
     * @param value The value to select or deselect.
     */
    HierarchicalFacet.prototype.toggleSelectValue = function (value) {
        this.ensureDom();
        this.ensureValueHierarchyExists([value]);
        if (this.getFacetValueFromHierarchy(value).selected == false) {
            this.selectValue(value);
        }
        else {
            this.deselectValue(value);
        }
    };
    /**
     * Toggles the exclusion of a single value (excludes value if not excluded; un-excludes value if excluded).
     * @param value The value to exclude or un-exclude.
     */
    HierarchicalFacet.prototype.toggleExcludeValue = function (value) {
        this.ensureDom();
        this.ensureValueHierarchyExists([value]);
        if (this.getFacetValueFromHierarchy(value).excluded == false) {
            this.excludeValue(value);
        }
        else {
            this.unexcludeValue(value);
        }
    };
    /**
     * Gets the caption of a single value.
     * @param facetValue The value whose caption the method should return.
     * @returns {string} The caption of the value.
     */
    HierarchicalFacet.prototype.getValueCaption = function (facetValue) {
        var stringValue = this.getSelf(facetValue);
        var ret = stringValue;
        if (Utils_1.Utils.exists(this.options.valueCaption)) {
            if (typeof this.options.valueCaption == 'object') {
                ret = this.options.valueCaption[stringValue] || ret;
            }
            if (typeof this.options.valueCaption == 'function') {
                ret = this.options.valueCaption.call(this, facetValue);
            }
        }
        return ret;
    };
    /**
     * Gets the values that the `HierarchicalFacet` is currently displaying.
     * @returns {any[]} An array containing all the values that the `HierarchicalFacet` is currently displaying.
     */
    HierarchicalFacet.prototype.getDisplayedValues = function () {
        var _this = this;
        var displayed = _.filter(this.values.getAll(), function (v) {
            var valFromHierarchy = _this.getValueFromHierarchy(v);
            if (valFromHierarchy) {
                var elem = _this.getElementFromFacetValueList(v);
                return !Dom_1.$$(elem).hasClass('coveo-inactive');
            }
            return false;
        });
        return _.pluck(displayed, 'value');
    };
    /**
     * Updates the sort criteria for the `HierarchicalFacet`.
     *
     * See the [`sortCriteria`]{@link IGroupByRequest.sortCriteria} property of the [`IGroupByRequest`] interface for the
     * list and description of possible values.
     *
     * @param criteria The new sort criteria.
     */
    HierarchicalFacet.prototype.updateSort = function (criteria) {
        _super.prototype.updateSort.call(this, criteria);
    };
    /**
     * Opens (expands) a single value and shows all its children.
     * @param value The value to open.
     */
    HierarchicalFacet.prototype.open = function (value) {
        var getter;
        if (_.isString(value)) {
            getter = this.getValueHierarchy(value);
        }
        else if (value instanceof FacetValues_1.FacetValue) {
            getter = this.getValueHierarchy(value.value);
        }
        else {
            getter = value;
        }
        if (getter != undefined) {
            Dom_1.$$(this.getElementFromFacetValueList(getter.facetValue.value)).addClass('coveo-open');
            this.showChilds(getter.childs);
            if (getter.parent != undefined) {
                this.open(this.getValueHierarchy(getter.facetValue.value).parent);
            }
            this.getValueHierarchy(getter.facetValue.value).keepOpened = true;
        }
    };
    /**
     * Closes (collapses) a single value and hides all its children.
     * @param value The value to close.
     */
    HierarchicalFacet.prototype.close = function (value) {
        var _this = this;
        var getter;
        if (_.isString(value)) {
            getter = this.getValueHierarchy(value);
        }
        else if (value instanceof FacetValues_1.FacetValue) {
            getter = this.getValueHierarchy(value.value);
        }
        else {
            getter = value;
        }
        if (getter != undefined) {
            Dom_1.$$(this.getElementFromFacetValueList(getter.facetValue)).removeClass('coveo-open');
            this.hideChilds(getter.childs);
            _.each(getter.childs, function (child) {
                _this.close(_this.getValueHierarchy(child.facetValue.value));
            });
            this.getValueHierarchy(getter.facetValue.value).keepOpened = false;
        }
    };
    /**
     * Resets the `HierarchicalFacet` state.
     */
    HierarchicalFacet.prototype.reset = function () {
        var _this = this;
        _.each(this.getAllValueHierarchy(), function (valueHierarchy) {
            valueHierarchy.hasChildSelected = false;
            valueHierarchy.allChildShouldBeSelected = false;
        });
        // Need to close all values, otherwise we might end up with orphan(s)
        // if a parent value, after reset, is no longer visible.
        _.each(this.getAllValueHierarchy(), function (valueHierarchy) {
            _this.close(valueHierarchy);
        });
        _super.prototype.reset.call(this);
    };
    HierarchicalFacet.prototype.processFacetSearchAllResultsSelected = function (facetValues) {
        this.selectMultipleValues(facetValues);
        this.triggerNewQuery();
    };
    HierarchicalFacet.prototype.triggerUpdateDeltaQuery = function (facetValues) {
        this.shouldReshuffleFacetValuesClientSide = this.keepDisplayedValuesNextTime;
        _super.prototype.triggerUpdateDeltaQuery.call(this, facetValues);
    };
    HierarchicalFacet.prototype.updateSearchElement = function (moreValuesAvailable) {
        if (moreValuesAvailable === void 0) { moreValuesAvailable = true; }
        // We always want to show search for hierarchical facet :
        // It's useful since child values are folded under their parent most of the time
        _super.prototype.updateSearchElement.call(this, true);
    };
    HierarchicalFacet.prototype.facetValueHasChanged = function () {
        var _this = this;
        this.updateQueryStateModel();
        Defer_1.Defer.defer(function () {
            _this.updateAppearanceDependingOnState();
        });
    };
    HierarchicalFacet.prototype.initFacetQueryController = function () {
        this.facetQueryController = new HierarchicalFacetQueryController_1.HierarchicalFacetQueryController(this);
    };
    HierarchicalFacet.prototype.initFacetSearch = function () {
        this.facetSearch = new HierarchicalFacetSearch_1.HierarchicalFacetSearch(this, HierarchicalFacetSearchValuesList_1.HierarchicalFacetSearchValuesList, this.root);
        this.element.appendChild(this.facetSearch.build());
    };
    HierarchicalFacet.prototype.handleDeferredQuerySuccess = function (data) {
        this.updateAppearanceDependingOnState();
        _super.prototype.handleDeferredQuerySuccess.call(this, data);
    };
    HierarchicalFacet.prototype.handlePopulateSearchAlerts = function (args) {
        if (this.values.hasSelectedOrExcludedValues()) {
            args.text.push(new HierarchicalBreadcrumbValuesList_1.HierarchicalBreadcrumbValuesList(this, this.values.getSelected().concat(this.values.getExcluded()), this.getAllValueHierarchy()).buildAsString());
        }
    };
    HierarchicalFacet.prototype.handlePopulateBreadcrumb = function (args) {
        Assert_1.Assert.exists(args);
        if (this.values.hasSelectedOrExcludedValues()) {
            var element = new HierarchicalBreadcrumbValuesList_1.HierarchicalBreadcrumbValuesList(this, this.values.getSelected().concat(this.values.getExcluded()), this.getAllValueHierarchy()).build();
            args.breadcrumbs.push({
                element: element
            });
        }
    };
    HierarchicalFacet.prototype.handleOmniboxWithStaticValue = function (eventArg) {
        var _this = this;
        var regex = eventArg.completeQueryExpression.regex;
        var match = _.first(_.filter(this.getAllValueHierarchy(), function (existingValue) {
            return regex.test(_this.getValueCaption(existingValue.facetValue));
        }), this.options.numberOfValuesInOmnibox);
        var facetValues = _.compact(_.map(match, function (gotAMatch) {
            var fromList = _this.getFromFacetValueList(gotAMatch.facetValue);
            return fromList ? fromList.facetValue : undefined;
        }));
        var element = new OmniboxHierarchicalValuesList_1.OmniboxHierarchicalValuesList(this, facetValues, eventArg).build();
        eventArg.rows.push({
            element: element,
            zIndex: this.omniboxZIndex
        });
    };
    HierarchicalFacet.prototype.rebuildValueElements = function () {
        this.shouldReshuffleFacetValuesClientSide = this.shouldReshuffleFacetValuesClientSide || this.keepDisplayedValuesNextTime;
        this.numberOfValues = Math.max(this.numberOfValues, 10000);
        this.processHierarchy();
        this.setValueListContent();
        _super.prototype.rebuildValueElements.call(this);
        this.buildParentChildRelationship();
        this.checkForOrphans();
        this.checkForNewUnselectedChild();
        this.crop();
        this.shouldReshuffleFacetValuesClientSide = false;
    };
    HierarchicalFacet.prototype.initFacetValuesList = function () {
        this.facetValuesList = new HierarchicalFacetValuesList_1.HierarchicalFacetValuesList(this, HierarchicalFacetValueElement_1.HierarchicalFacetValueElement);
        this.element.appendChild(this.facetValuesList.build());
    };
    HierarchicalFacet.prototype.updateMoreLess = function () {
        var moreValuesAvailable = this.numberOfValuesToShow < this.topLevelHierarchy.length;
        var lessIsShown = this.numberOfValuesToShow > this.originalNumberOfValuesToShow;
        _super.prototype.updateMoreLess.call(this, lessIsShown, moreValuesAvailable);
    };
    HierarchicalFacet.prototype.handleClickMore = function () {
        this.numberOfValuesToShow += this.originalNumberOfValuesToShow;
        this.numberOfValuesToShow = Math.min(this.numberOfValuesToShow, this.values.size());
        this.crop();
        this.updateMoreLess();
    };
    HierarchicalFacet.prototype.handleClickLess = function () {
        this.numberOfValuesToShow = this.originalNumberOfValuesToShow;
        this.crop();
        this.updateMoreLess();
    };
    HierarchicalFacet.prototype.updateNumberOfValues = function () {
        this.numberOfValues = Math.max(this.numberOfValues, 10000);
    };
    HierarchicalFacet.prototype.ensureValueHierarchyExists = function (facetValues) {
        var _this = this;
        if (facetValues[0] && typeof facetValues[0] == 'string') {
            facetValues = _.map(facetValues, function (value) {
                return FacetValues_1.FacetValue.createFromValue(value);
            });
        }
        var atLeastOneDoesNotExists = false;
        _.each(facetValues, function (facetValue) {
            if (_this.getValueHierarchy(facetValue.value) == undefined) {
                atLeastOneDoesNotExists = true;
            }
        });
        if (atLeastOneDoesNotExists) {
            this.processHierarchy(facetValues);
        }
    };
    HierarchicalFacet.prototype.crop = function () {
        var _this = this;
        // Partition the top level or the facet to only operate on the values that are not selected or excluded
        var partition = _.partition(this.topLevelHierarchy, function (hierarchy) {
            return hierarchy.facetValue.selected || hierarchy.facetValue.excluded || hierarchy.hasChildSelected;
        });
        // Hide and show the partitionned top level values, depending on the numberOfValuesToShow
        var numberOfValuesLeft = this.numberOfValuesToShow - partition[0].length;
        _.each(_.last(partition[1], partition[1].length - numberOfValuesLeft), function (toHide) {
            _this.hideFacetValue(toHide);
            _this.hideChilds(toHide.childs);
        });
        _.each(_.first(partition[1], numberOfValuesLeft), function (toShow) {
            _this.showFacetValue(toShow);
        });
    };
    HierarchicalFacet.prototype.placeChildsUnderTheirParent = function (hierarchy, hierarchyElement) {
        var _this = this;
        var toIterateOver = hierarchy.childs;
        if (toIterateOver) {
            var toIterateOverSorted = this.facetValuesList.sortFacetValues(_.pluck(toIterateOver, 'facetValue')).reverse();
            _.each(toIterateOverSorted, function (child) {
                var childFromHierarchy = _this.getValueFromHierarchy(child);
                if (childFromHierarchy) {
                    var childElement = _this.getElementFromFacetValueList(child);
                    Dom_1.$$(childElement).insertAfter(hierarchyElement);
                    if (childFromHierarchy.childs && childFromHierarchy.childs.length != 0) {
                        _this.placeChildsUnderTheirParent(childFromHierarchy, childElement);
                    }
                }
            });
        }
        if (hierarchy.keepOpened) {
            this.open(hierarchy);
            this.showChilds(hierarchy.childs);
        }
        else {
            this.hideChilds(hierarchy.childs);
        }
    };
    HierarchicalFacet.prototype.addCssClassToParentAndChilds = function (hierarchy, hierarchyElement) {
        var _this = this;
        Dom_1.$$(hierarchyElement).addClass('coveo-has-childs');
        if (hierarchy.hasChildSelected) {
            Dom_1.$$(hierarchyElement).addClass('coveo-has-childs-selected');
        }
        var expandChilds = Dom_1.$$('span', { className: 'coveo-hierarchical-facet-expand' }, SVGIcons_1.SVGIcons.icons.facetExpand);
        var collapseChilds = Dom_1.$$('span', { className: 'coveo-hierarchical-facet-collapse' }, SVGIcons_1.SVGIcons.icons.facetCollapse);
        SVGDom_1.SVGDom.addClassToSVGInContainer(expandChilds.el, 'coveo-hierarchical-facet-expand-svg');
        SVGDom_1.SVGDom.addClassToSVGInContainer(collapseChilds.el, 'coveo-hierarchical-facet-collapse-svg');
        var openAndCloseChilds = Dom_1.$$('div', {
            className: 'coveo-has-childs-toggle'
        }, expandChilds.el, collapseChilds.el).el;
        Dom_1.$$(openAndCloseChilds).on('click', function () {
            Dom_1.$$(hierarchyElement).hasClass('coveo-open') ? _this.close(hierarchy) : _this.open(hierarchy);
        });
        Dom_1.$$(hierarchyElement).prepend(openAndCloseChilds);
    };
    HierarchicalFacet.prototype.buildParentChildRelationship = function () {
        var _this = this;
        var fragment = document.createDocumentFragment();
        fragment.appendChild(this.facetValuesList.valueContainer);
        var sorted = _.map(this.facetValuesList.sortFacetValues(), function (facetValue) {
            return _this.getValueFromHierarchy(facetValue);
        });
        _.each(sorted, function (hierarchy) {
            var hierarchyElement = _this.getElementFromFacetValueList(hierarchy.facetValue);
            if (Utils_1.Utils.isNonEmptyArray(hierarchy.childs)) {
                _this.placeChildsUnderTheirParent(hierarchy, hierarchyElement);
                _this.addCssClassToParentAndChilds(hierarchy, hierarchyElement);
            }
            else {
                Dom_1.$$(hierarchyElement).addClass('coveo-no-childs');
            }
            hierarchyElement.style.marginLeft = _this.options.marginByLevel * (hierarchy.level - _this.options.levelStart) + 'px';
        });
        Dom_1.$$(fragment).insertAfter(this.headerElement);
    };
    HierarchicalFacet.prototype.setValueListContent = function () {
        var _this = this;
        this.facetValuesList.hierarchyFacetValues = _.map(this.correctLevels, function (hierarchy) {
            if (!_this.values.contains(hierarchy.facetValue.value)) {
                hierarchy.facetValue.occurrences = 0;
                _this.values.add(hierarchy.facetValue);
            }
            return hierarchy.facetValue;
        });
    };
    HierarchicalFacet.prototype.createHierarchy = function (valuesToBuildWith) {
        var _this = this;
        var flatHierarchy = _.map(valuesToBuildWith, function (value) {
            var parent = _this.getParent(value);
            var self = value.lookupValue || value.value;
            return {
                facetValue: value,
                level: _this.getLevel(value),
                parent: parent,
                self: self
            };
        });
        this.setInHierarchy(flatHierarchy);
        _.each(this.getAllValueHierarchy(), function (valueHierarchy) {
            if (valueHierarchy.facetValue.selected) {
                _this.flagParentForSelection(valueHierarchy);
            }
        });
        return flatHierarchy;
    };
    HierarchicalFacet.prototype.processHierarchy = function (facetValues) {
        var _this = this;
        if (facetValues === void 0) { facetValues = this.values.getAll(); }
        _.each(this.getAllValueHierarchy(), function (hierarchy) {
            if (_this.values.get(hierarchy.facetValue.value) == undefined) {
                _this.deleteValueHierarchy(_this.getLookupOrValue(hierarchy.facetValue));
            }
        });
        this.createHierarchy(facetValues);
    };
    HierarchicalFacet.prototype.setInHierarchy = function (flatHierarchy) {
        var _this = this;
        this.correctLevels = _.filter(flatHierarchy, function (hierarchy) {
            var isCorrectMinimumLevel = _this.options.levelStart == undefined || hierarchy.level >= _this.options.levelStart;
            var isCorrectMaximumLevel = _this.options.levelEnd == undefined || hierarchy.level < _this.options.levelEnd;
            return isCorrectMinimumLevel && isCorrectMaximumLevel;
        });
        _.each(this.correctLevels, function (hierarchy) {
            var childs = _.map(_.filter(_this.correctLevels, function (possibleChild) {
                return possibleChild.parent != null && possibleChild.parent.toLowerCase() == hierarchy.self.toLowerCase();
            }), function (child) {
                return {
                    facetValue: child.facetValue,
                    level: child.level,
                    keepOpened: false,
                    hasChildSelected: false,
                    allChildShouldBeSelected: false
                };
            });
            var parent = hierarchy.parent != null
                ? _.find(_this.correctLevels, function (possibleParent) {
                    return possibleParent.self.toLowerCase() == hierarchy.parent.toLowerCase();
                })
                : null;
            var hierarchyThatAlreadyExists = _this.getValueHierarchy(hierarchy.facetValue.value);
            if (hierarchyThatAlreadyExists && hierarchyThatAlreadyExists.childs.length != childs.length) {
                hierarchyThatAlreadyExists.childs = childs;
            }
            var hierarchyThatAlreadyExistsAtParent;
            if (parent) {
                hierarchyThatAlreadyExistsAtParent = _this.getValueHierarchy(parent.facetValue.value);
            }
            _this.setValueHierarchy(hierarchy.facetValue.value, {
                childs: childs,
                parent: parent == undefined
                    ? undefined
                    : {
                        facetValue: parent.facetValue,
                        level: parent.level,
                        keepOpened: hierarchyThatAlreadyExistsAtParent ? hierarchyThatAlreadyExistsAtParent.keepOpened : false,
                        hasChildSelected: hierarchyThatAlreadyExistsAtParent ? hierarchyThatAlreadyExistsAtParent.hasChildSelected : false,
                        originalPosition: hierarchyThatAlreadyExistsAtParent ? hierarchyThatAlreadyExistsAtParent.originalPosition : undefined,
                        allChildShouldBeSelected: hierarchyThatAlreadyExistsAtParent
                            ? hierarchyThatAlreadyExistsAtParent.allChildShouldBeSelected
                            : false
                    },
                facetValue: hierarchy.facetValue,
                level: hierarchy.level,
                keepOpened: hierarchyThatAlreadyExists ? hierarchyThatAlreadyExists.keepOpened : false,
                hasChildSelected: hierarchyThatAlreadyExists ? hierarchyThatAlreadyExists.hasChildSelected : false,
                originalPosition: hierarchyThatAlreadyExists ? hierarchyThatAlreadyExists.originalPosition : undefined,
                allChildShouldBeSelected: hierarchyThatAlreadyExists ? hierarchyThatAlreadyExists.allChildShouldBeSelected : false
            });
        });
        this.topLevelHierarchy = _.chain(this.values.getAll())
            .filter(function (value) {
            var fromHierarchy = _this.getValueFromHierarchy(value);
            if (fromHierarchy) {
                return fromHierarchy.level == (_this.options.levelStart || 0);
            }
            else {
                return false;
            }
        })
            .map(function (value) {
            return _this.getValueFromHierarchy(value);
        })
            .value();
    };
    HierarchicalFacet.prototype.getParent = function (value) {
        var lastIndexOfDelimiting = this.getLookupOrValue(value).lastIndexOf(this.options.delimitingCharacter);
        if (lastIndexOfDelimiting != -1) {
            return this.getLookupOrValue(value).substring(0, lastIndexOfDelimiting);
        }
        return undefined;
    };
    HierarchicalFacet.prototype.getSelf = function (value) {
        var parent = this.getParent(value);
        if (parent == undefined) {
            return this.getLookupOrValue(value);
        }
        else {
            var indexOfParent = this.getLookupOrValue(value).indexOf(parent);
            return this.getLookupOrValue(value).substring(indexOfParent + parent.length + 1);
        }
    };
    HierarchicalFacet.prototype.showFacetValue = function (value) {
        Dom_1.$$(this.getElementFromFacetValueList(value.facetValue.value)).removeClass('coveo-inactive');
    };
    HierarchicalFacet.prototype.hideFacetValue = function (value) {
        Dom_1.$$(this.getElementFromFacetValueList(value.facetValue.value)).addClass('coveo-inactive');
    };
    HierarchicalFacet.prototype.hideChilds = function (children) {
        var _this = this;
        _.each(children, function (child) {
            _this.hideFacetValue(child);
        });
    };
    HierarchicalFacet.prototype.showChilds = function (children) {
        var _this = this;
        _.each(children, function (child) {
            _this.showFacetValue(child);
        });
    };
    HierarchicalFacet.prototype.selectChilds = function (parent, children) {
        this.flagParentForSelection(parent);
        parent.allChildShouldBeSelected = true;
        this.selectMultipleValues(_.map(children, function (child) {
            return child.facetValue;
        }));
    };
    HierarchicalFacet.prototype.deselectChilds = function (parent, children) {
        parent.hasChildSelected = false;
        parent.allChildShouldBeSelected = false;
        this.deselectMultipleValues(_.map(children, function (child) {
            return child.facetValue;
        }));
    };
    HierarchicalFacet.prototype.excludeChilds = function (children) {
        this.excludeMultipleValues(_.map(children, function (child) {
            return child.facetValue;
        }));
    };
    HierarchicalFacet.prototype.unexcludeChilds = function (children) {
        this.unexcludeMultipleValues(_.map(children, function (child) {
            return child.facetValue;
        }));
    };
    HierarchicalFacet.prototype.deselectParent = function (parent) {
        if (parent != undefined) {
            this.deselectValue(parent.facetValue, false);
        }
    };
    HierarchicalFacet.prototype.flagParentForSelection = function (valueHierarchy) {
        var parent = valueHierarchy.parent;
        var current = valueHierarchy;
        while (parent) {
            var parentInHierarchy = this.getValueHierarchy(parent.facetValue.value);
            parentInHierarchy.hasChildSelected = true;
            var found = _.find(parentInHierarchy.childs, function (child) {
                return child.facetValue.value.toLowerCase() == current.facetValue.value.toLowerCase();
            });
            if (found) {
                if (this.getValueHierarchy(found.facetValue.value).hasChildSelected) {
                    found.hasChildSelected = true;
                }
            }
            parent = parentInHierarchy.parent;
            current = parentInHierarchy;
        }
    };
    HierarchicalFacet.prototype.unflagParentForSelection = function (valueHierarchy) {
        var _this = this;
        var parent = valueHierarchy.parent;
        while (parent) {
            var parentInHierarchy = this.getValueHierarchy(parent.facetValue.value);
            var otherSelectedChilds = _.filter(parentInHierarchy.childs, function (child) {
                var childInHierarchy = _this.getValueHierarchy(child.facetValue.value);
                if (childInHierarchy != undefined) {
                    return (childInHierarchy.facetValue.value != valueHierarchy.facetValue.value &&
                        (childInHierarchy.facetValue.selected || childInHierarchy.facetValue.excluded || childInHierarchy.hasChildSelected));
                }
            });
            if (otherSelectedChilds.length == 0) {
                parentInHierarchy.hasChildSelected = false;
            }
            parentInHierarchy.allChildShouldBeSelected = false;
            parent = parentInHierarchy.parent;
        }
    };
    HierarchicalFacet.prototype.getValueFromHierarchy = function (value) {
        var getter = value instanceof FacetValues_1.FacetValue ? value.value : value;
        return this.getValueHierarchy(getter);
    };
    HierarchicalFacet.prototype.getFacetValueFromHierarchy = function (value) {
        return this.getValueFromHierarchy(value).facetValue;
    };
    HierarchicalFacet.prototype.getLookupOrValue = function (value) {
        return value.lookupValue || value.value;
    };
    HierarchicalFacet.prototype.getElementFromFacetValueList = function (value) {
        var ret = this.getFromFacetValueList(value);
        if (ret) {
            return ret.renderer.listItem;
        }
        else {
            return Dom_1.$$('div').el;
        }
    };
    HierarchicalFacet.prototype.getFromFacetValueList = function (value) {
        var fromHierarchy = this.getValueFromHierarchy(value);
        if (fromHierarchy != undefined) {
            return this.facetValuesList.get(value);
        }
        else {
            return undefined;
        }
    };
    HierarchicalFacet.prototype.getLevel = function (value) {
        return value.value.split(this.options.delimitingCharacter).length - 1;
    };
    HierarchicalFacet.prototype.getAllValueHierarchy = function () {
        if (this.valueHierarchy == null) {
            this.valueHierarchy = {};
        }
        return this.valueHierarchy;
    };
    HierarchicalFacet.prototype.deleteValueHierarchy = function (key) {
        if (this.valueHierarchy != null) {
            delete this.valueHierarchy[key.toLowerCase()];
        }
    };
    HierarchicalFacet.prototype.getValueHierarchy = function (key) {
        if (this.valueHierarchy == null) {
            return undefined;
        }
        return this.valueHierarchy[key.toLowerCase()];
    };
    HierarchicalFacet.prototype.setValueHierarchy = function (key, value) {
        if (this.valueHierarchy == null) {
            this.valueHierarchy = {};
        }
        this.valueHierarchy[key.toLowerCase()] = value;
    };
    HierarchicalFacet.prototype.checkForOrphans = function () {
        var _this = this;
        _.each(this.valueHierarchy, function (v) {
            if (_this.getLevel(v.facetValue) != _this.options.levelStart) {
                if (_this.getValueHierarchy(_this.getParent(v.facetValue)) == undefined) {
                    _this.logger.error("Orphan value found in HierarchicalFacet : " + v.facetValue.value, "Needed : " + _this.getParent(v.facetValue) + " but not found");
                    _this.logger.warn("Removing incoherent facet value : " + v.facetValue.value);
                    _this.hideFacetValue(v);
                }
            }
        });
    };
    HierarchicalFacet.prototype.checkForNewUnselectedChild = function () {
        var _this = this;
        // It's possible that after checking a facet value, the index returns new facet values (because of injection depth);
        _.each(this.valueHierarchy, function (v) {
            if (v.allChildShouldBeSelected) {
                var notAlreadySelected = _.find(v.childs, function (child) {
                    return child.facetValue.selected != true;
                });
                if (notAlreadySelected) {
                    _this.selectValue(v.facetValue, true);
                    _this.logger.info('Re-executing query with new facet values returned by index');
                    _this.queryController.deferExecuteQuery();
                }
            }
        });
    };
    HierarchicalFacet.ID = 'HierarchicalFacet';
    HierarchicalFacet.doExport = function () {
        GlobalExports_1.exportGlobally({
            HierarchicalFacet: HierarchicalFacet
        });
    };
    /**
     * The options for the component
     * @componentOptions
     */
    HierarchicalFacet.options = __assign({ 
        /**
         * The character that allows to specify the hierarchical dependency.
         *
         * **Example:**
         *
         * If your field has the following values:
         *
         * `@field: c; c>folder2; c>folder2>folder3;`
         *
         * The delimiting character is `>`.
         *
         * Default value is `|`.
         */
        delimitingCharacter: ComponentOptions_1.ComponentOptions.buildStringOption({ defaultValue: '|' }), 
        /**
         * Specifies at which level (0-based index) of the hierarchy the `HierarchicalFacet` should start displaying its
         * values.
         *
         * **Example:**
         *
         * If you have the following files indexed on a file system:
         * ```
         * c:\
         *    folder1\
         *        text1.txt
         *    folder2\
         *      folder3\
         *        text2.txt
         * ```
         * Setting `levelStart` to `1` displays `folder1` and `folder2` in the `HierarchicalFacet`, but omits `c:`.
         *
         * Default (and minimum) value is `0`.
         */
        levelStart: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 0, min: 0 }), 
        /**
         * Specifies at which level (0-based index) of the hierarchy the `HierarchicalFacet` should stop displaying its
         * values.
         *
         * Default value is `undefined`, which means the `HierarchicalFacet` component renders all hierarchical levels.
         * Minimum value is `0`.
         */
        levelEnd: ComponentOptions_1.ComponentOptions.buildNumberOption({ min: 0 }), 
        /**
         * Specifies the margin (in pixels) to display between each hierarchical level when expanding.
         *
         * Default value is `10`.
         */
        marginByLevel: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 10, min: 0 }) }, ResponsiveFacetOptions_1.ResponsiveFacetOptions);
    HierarchicalFacet.parent = Facet_1.Facet;
    return HierarchicalFacet;
}(Facet_1.Facet));
exports.HierarchicalFacet = HierarchicalFacet;
Initialization_1.Initialization.registerAutoCreateComponent(HierarchicalFacet);


/***/ }),

/***/ 325:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The possible values for the [allowedValuesPatternType]{@link IGroupByRequest.allowedValuesPatternType} property of the `IGroupByRequest` interface.
 */
var AllowedValuesPatternType;
(function (AllowedValuesPatternType) {
    /**
     * Only supports trailing wildcards in the pattern.
     */
    AllowedValuesPatternType["Legacy"] = "legacy";
    /**
     * Fully supports wildcards.
     */
    AllowedValuesPatternType["Wildcards"] = "wildcards";
    /**
     * Supports regular expression as the pattern.
     */
    AllowedValuesPatternType["Regex"] = "regex";
    /**
     *Applies the Edit Distance algorithm to match values that are close to the specified pattern.
     */
    AllowedValuesPatternType["EditDistance"] = "editdistance";
    /**
     *Applies a phonetic algorithm to match values that are phonetically similar to the specified pattern.
     */
    AllowedValuesPatternType["Phonetic"] = "phonetic";
})(AllowedValuesPatternType = exports.AllowedValuesPatternType || (exports.AllowedValuesPatternType = {}));


/***/ }),

/***/ 326:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var ResponsiveDropdownHeader = /** @class */ (function () {
    function ResponsiveDropdownHeader(componentName, element) {
        this.element = element;
        this.element.addClass("coveo-" + componentName + "-dropdown-header");
        this.element.addClass(ResponsiveDropdownHeader.DEFAULT_CSS_CLASS_NAME);
    }
    ResponsiveDropdownHeader.prototype.open = function () {
        this.element.addClass(ResponsiveDropdownHeader.ACTIVE_HEADER_CSS_CLASS_NAME);
    };
    ResponsiveDropdownHeader.prototype.close = function () {
        this.element.removeClass(ResponsiveDropdownHeader.ACTIVE_HEADER_CSS_CLASS_NAME);
    };
    ResponsiveDropdownHeader.prototype.cleanUp = function () {
        this.element.detach();
    };
    ResponsiveDropdownHeader.prototype.hide = function () {
        Dom_1.$$(this.element).addClass('coveo-hidden');
    };
    ResponsiveDropdownHeader.prototype.show = function () {
        Dom_1.$$(this.element).removeClass('coveo-hidden');
    };
    ResponsiveDropdownHeader.DEFAULT_CSS_CLASS_NAME = 'coveo-dropdown-header';
    ResponsiveDropdownHeader.ACTIVE_HEADER_CSS_CLASS_NAME = 'coveo-dropdown-header-active';
    return ResponsiveDropdownHeader;
}());
exports.ResponsiveDropdownHeader = ResponsiveDropdownHeader;


/***/ }),

/***/ 327:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ValueElementRenderer_1 = __webpack_require__(328);
var Utils_1 = __webpack_require__(4);
var AnalyticsActionListMeta_1 = __webpack_require__(9);
var Dom_1 = __webpack_require__(1);
var KeyboardUtils_1 = __webpack_require__(30);
var ValueElement = /** @class */ (function () {
    function ValueElement(facet, facetValue, onSelect, onExclude) {
        this.facet = facet;
        this.facetValue = facetValue;
        this.onSelect = onSelect;
        this.onExclude = onExclude;
    }
    ValueElement.prototype.build = function () {
        this.renderer = new ValueElementRenderer_1.ValueElementRenderer(this.facet, this.facetValue).build();
        this.bindEvent({ displayNextTime: true, pinFacet: this.facet.options.preservePosition });
        return this;
    };
    ValueElement.prototype.bindEvent = function (eventBindings) {
        if (!Utils_1.Utils.isNullOrUndefined(eventBindings.omniboxObject)) {
            this.isOmnibox = true;
        }
        else {
            this.isOmnibox = false;
        }
        this.handleEventForCheckboxChange(eventBindings);
        if (this.facetValue.excluded) {
            this.handleEventForExcludedValueElement(eventBindings);
        }
        else {
            this.handleEventForValueElement(eventBindings);
        }
    };
    ValueElement.prototype.select = function () {
        this.facetValue.selected = true;
        this.facetValue.excluded = false;
        this.renderer.setCssClassOnListValueElement();
    };
    ValueElement.prototype.unselect = function () {
        this.facetValue.selected = false;
        this.facetValue.excluded = false;
        this.renderer.setCssClassOnListValueElement();
    };
    ValueElement.prototype.exclude = function () {
        this.facetValue.selected = false;
        this.facetValue.excluded = true;
        this.renderer.setCssClassOnListValueElement();
    };
    ValueElement.prototype.unexclude = function () {
        this.facetValue.selected = false;
        this.facetValue.excluded = false;
        this.renderer.setCssClassOnListValueElement();
    };
    ValueElement.prototype.toggleExcludeWithUA = function () {
        var _this = this;
        var actionCause;
        if (this.facetValue.excluded) {
            actionCause = this.isOmnibox ? AnalyticsActionListMeta_1.analyticsActionCauseList.omniboxFacetUnexclude : AnalyticsActionListMeta_1.analyticsActionCauseList.facetUnexclude;
        }
        else {
            actionCause = this.isOmnibox ? AnalyticsActionListMeta_1.analyticsActionCauseList.omniboxFacetExclude : AnalyticsActionListMeta_1.analyticsActionCauseList.facetExclude;
        }
        this.facet.toggleExcludeValue(this.facetValue);
        if (this.onExclude) {
            this.facet.triggerNewQuery(function () { return _this.onExclude(_this, actionCause); });
        }
        else {
            this.facet.triggerNewQuery(function () {
                return _this.facet.usageAnalytics.logSearchEvent(actionCause, _this.getAnalyticsFacetMeta());
            });
        }
    };
    ValueElement.prototype.handleSelectValue = function (eventBindings) {
        var _this = this;
        this.facet.keepDisplayedValuesNextTime = eventBindings.displayNextTime && !this.facet.options.useAnd;
        var actionCause;
        if (this.facetValue.excluded) {
            actionCause = this.isOmnibox ? AnalyticsActionListMeta_1.analyticsActionCauseList.omniboxFacetUnexclude : AnalyticsActionListMeta_1.analyticsActionCauseList.facetUnexclude;
            this.facet.unexcludeValue(this.facetValue);
        }
        else {
            if (this.facetValue.selected) {
                actionCause = this.isOmnibox ? AnalyticsActionListMeta_1.analyticsActionCauseList.omniboxFacetDeselect : AnalyticsActionListMeta_1.analyticsActionCauseList.facetDeselect;
            }
            else {
                actionCause = this.isOmnibox ? AnalyticsActionListMeta_1.analyticsActionCauseList.omniboxFacetSelect : AnalyticsActionListMeta_1.analyticsActionCauseList.facetSelect;
            }
            this.facet.toggleSelectValue(this.facetValue);
        }
        if (this.onSelect) {
            this.facet.triggerNewQuery(function () { return _this.onSelect(_this, actionCause); });
        }
        else {
            this.facet.triggerNewQuery(function () {
                return _this.facet.usageAnalytics.logSearchEvent(actionCause, _this.getAnalyticsFacetMeta());
            });
        }
    };
    ValueElement.prototype.handleExcludeClick = function (eventBindings) {
        this.facet.keepDisplayedValuesNextTime = eventBindings.displayNextTime && !this.facet.options.useAnd;
        this.toggleExcludeWithUA();
    };
    ValueElement.prototype.handleEventForExcludedValueElement = function (eventBindings) {
        var _this = this;
        var clickEvent = function (event) {
            if (eventBindings.pinFacet) {
                _this.facet.pinFacetPosition();
            }
            if (eventBindings.omniboxObject) {
                _this.omniboxCloseEvent(eventBindings.omniboxObject);
            }
            _this.handleSelectValue(eventBindings);
            return false;
        };
        Dom_1.$$(this.renderer.label).on('click', function (e) {
            e.stopPropagation();
            clickEvent(e);
        });
        Dom_1.$$(this.renderer.stylishCheckbox).on('keydown', KeyboardUtils_1.KeyboardUtils.keypressAction([KeyboardUtils_1.KEYBOARD.SPACEBAR, KeyboardUtils_1.KEYBOARD.ENTER], clickEvent));
    };
    ValueElement.prototype.handleEventForValueElement = function (eventBindings) {
        var _this = this;
        var excludeAction = function (event) {
            if (eventBindings.omniboxObject) {
                _this.omniboxCloseEvent(eventBindings.omniboxObject);
            }
            _this.handleExcludeClick(eventBindings);
            if (_this.facet && _this.facet.facetSearch && _this.facet.facetSearch.dismissSearchResults) {
                _this.facet.facetSearch.dismissSearchResults();
            }
            event.stopPropagation();
            event.preventDefault();
        };
        Dom_1.$$(this.renderer.excludeIcon).on('click', excludeAction);
        Dom_1.$$(this.renderer.excludeIcon).on('keydown', KeyboardUtils_1.KeyboardUtils.keypressAction([KeyboardUtils_1.KEYBOARD.SPACEBAR, KeyboardUtils_1.KEYBOARD.ENTER], excludeAction));
        var selectAction = function (event) {
            if (eventBindings.pinFacet) {
                _this.facet.pinFacetPosition();
            }
            Dom_1.$$(_this.renderer.checkbox).trigger('change');
            event.preventDefault();
        };
        Dom_1.$$(this.renderer.label).on('click', selectAction);
        Dom_1.$$(this.renderer.stylishCheckbox).on('keydown', KeyboardUtils_1.KeyboardUtils.keypressAction([KeyboardUtils_1.KEYBOARD.SPACEBAR, KeyboardUtils_1.KEYBOARD.ENTER], selectAction));
    };
    ValueElement.prototype.handleEventForCheckboxChange = function (eventBindings) {
        var _this = this;
        Dom_1.$$(this.renderer.checkbox).on('change', function () {
            if (eventBindings.omniboxObject) {
                _this.omniboxCloseEvent(eventBindings.omniboxObject);
            }
            _this.handleSelectValue(eventBindings);
        });
    };
    ValueElement.prototype.omniboxCloseEvent = function (eventArg) {
        eventArg.closeOmnibox();
        eventArg.clear();
    };
    ValueElement.prototype.getAnalyticsFacetMeta = function () {
        return {
            facetId: this.facet.options.id,
            facetField: this.facet.options.field.toString(),
            facetValue: this.facetValue.value,
            facetTitle: this.facet.options.title
        };
    };
    return ValueElement;
}());
exports.ValueElement = ValueElement;


/***/ }),

/***/ 328:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var Utils_1 = __webpack_require__(4);
var Strings_1 = __webpack_require__(7);
var Component_1 = __webpack_require__(6);
var _ = __webpack_require__(0);
var SVGIcons_1 = __webpack_require__(13);
var SVGDom_1 = __webpack_require__(14);
var ValueElementRenderer = /** @class */ (function () {
    function ValueElementRenderer(facet, facetValue) {
        this.facet = facet;
        this.facetValue = facetValue;
    }
    ValueElementRenderer.prototype.withNo = function (element) {
        if (_.isArray(element)) {
            _.each(element, function (e) {
                if (e) {
                    Dom_1.$$(e).detach();
                }
            });
        }
        else {
            if (element) {
                Dom_1.$$(element).detach();
            }
        }
        return this;
    };
    ValueElementRenderer.prototype.build = function () {
        this.buildListItem();
        this.initAndAppendLabel();
        this.initAndAppendExcludeIcon();
        this.setCssClassOnListValueElement();
        this.addAccessibilityAttributesToTargetElement();
        return this;
    };
    ValueElementRenderer.prototype.setCssClassOnListValueElement = function () {
        Dom_1.$$(this.listItem).toggleClass('coveo-selected', this.facetValue.selected);
        Dom_1.$$(this.listItem).toggleClass('coveo-excluded', this.facetValue.excluded);
    };
    Object.defineProperty(ValueElementRenderer.prototype, "accessibleElement", {
        get: function () {
            return this.stylishCheckbox;
        },
        enumerable: true,
        configurable: true
    });
    ValueElementRenderer.prototype.buildExcludeIcon = function () {
        var excludeIcon = Dom_1.$$('div', {
            title: Strings_1.l('Exclude', this.facet.getValueCaption(this.facetValue)),
            className: 'coveo-facet-value-exclude',
            tabindex: 0
        }).el;
        this.addFocusAndBlurEventListeners(excludeIcon);
        excludeIcon.innerHTML = SVGIcons_1.SVGIcons.icons.checkboxHookExclusionMore;
        SVGDom_1.SVGDom.addClassToSVGInContainer(excludeIcon, 'coveo-facet-value-exclude-svg');
        return excludeIcon;
    };
    ValueElementRenderer.prototype.buildValueComputedField = function () {
        var computedField = this.facetValue.getFormattedComputedField(this.facet.options.computedFieldFormat);
        if (Utils_1.Utils.isNonEmptyString(computedField)) {
            var elem = Dom_1.$$('span', {
                className: 'coveo-facet-value-computed-field'
            }).el;
            Dom_1.$$(elem).text(computedField);
            return elem;
        }
        else {
            return undefined;
        }
    };
    ValueElementRenderer.prototype.buildValueCheckbox = function () {
        var checkbox = Dom_1.$$('input', {
            type: 'checkbox'
        }).el;
        if (this.facetValue.selected) {
            checkbox.setAttribute('checked', 'checked');
        }
        else {
            checkbox.removeAttribute('checked');
        }
        if (this.facetValue.excluded) {
            checkbox.setAttribute('disabled', 'disabled');
        }
        else {
            checkbox.removeAttribute('disabled');
        }
        Component_1.Component.pointElementsToDummyForm(checkbox);
        return checkbox;
    };
    ValueElementRenderer.prototype.buildValueStylishCheckbox = function () {
        var checkbox = Dom_1.$$('div', {
            className: 'coveo-facet-value-checkbox',
            tabindex: 0
        }).el;
        checkbox.innerHTML = SVGIcons_1.SVGIcons.icons.checkboxHookExclusionMore;
        SVGDom_1.SVGDom.addClassToSVGInContainer(checkbox, 'coveo-facet-value-checkbox-svg');
        this.addFocusAndBlurEventListeners(checkbox);
        return checkbox;
    };
    ValueElementRenderer.prototype.buildValueIcon = function () {
        var icon = this.getValueIcon();
        if (Utils_1.Utils.exists(icon)) {
            return Dom_1.$$('img', {
                className: 'coveo-facet-value-icon coveo-icon',
                src: this.getValueIcon()
            }).el;
        }
        else {
            return this.buildValueIconFromSprite();
        }
    };
    ValueElementRenderer.prototype.getValueIcon = function () {
        if (Utils_1.Utils.exists(this.facet.options.valueIcon)) {
            return this.facet.options.valueIcon(this.facetValue);
        }
        else {
            return undefined;
        }
    };
    ValueElementRenderer.prototype.buildValueIconFromSprite = function () {
        return Dom_1.$$('div', {
            className: 'coveo-facet-value-icon coveo-icon ' + this.facet.options.field.substr(1) + ' ' + this.facetValue.value
        }).el;
    };
    ValueElementRenderer.prototype.buildValueCaption = function () {
        var valueCaption = Dom_1.$$('span', {
            className: 'coveo-facet-value-caption',
            title: this.caption,
            'data-original-value': this.facetValue.value
        }).el;
        Dom_1.$$(valueCaption).text(this.caption);
        return valueCaption;
    };
    ValueElementRenderer.prototype.buildValueCount = function () {
        if (Utils_1.Utils.isNonEmptyString(this.count)) {
            var countElement = Dom_1.$$('span', {
                className: 'coveo-facet-value-count'
            }).el;
            Dom_1.$$(countElement).text(this.count);
            return countElement;
        }
        else {
            return undefined;
        }
    };
    Object.defineProperty(ValueElementRenderer.prototype, "caption", {
        get: function () {
            return this.facet.getValueCaption(this.facetValue);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValueElementRenderer.prototype, "count", {
        get: function () {
            return this.facetValue.getFormattedCount();
        },
        enumerable: true,
        configurable: true
    });
    ValueElementRenderer.prototype.addFocusAndBlurEventListeners = function (elem) {
        var _this = this;
        Dom_1.$$(elem).on('focus', function () { return Dom_1.$$(_this.listItem).addClass('coveo-focused'); });
        Dom_1.$$(elem).on('blur', function () { return Dom_1.$$(_this.listItem).removeClass('coveo-focused'); });
    };
    ValueElementRenderer.prototype.buildListItem = function () {
        this.listItem = Dom_1.$$('li', { className: 'coveo-facet-value coveo-facet-selectable' }).el;
        this.listItem.setAttribute('data-value', this.facetValue.value);
    };
    ValueElementRenderer.prototype.initAndAppendLabel = function () {
        this.label = Dom_1.$$('label', { className: 'coveo-facet-value-label' }).el;
        this.tryToInitAndAppendComputedField();
        this.initAndAppendFacetValueLabelWrapper();
        this.listItem.appendChild(this.label);
    };
    ValueElementRenderer.prototype.initAndAppendExcludeIcon = function () {
        this.excludeIcon = this.buildExcludeIcon();
        this.attachExcludeIconEventHandlers();
        this.listItem.appendChild(this.excludeIcon);
    };
    ValueElementRenderer.prototype.attachExcludeIconEventHandlers = function () {
        var _this = this;
        Dom_1.$$(this.excludeIcon).on('mouseover', function () {
            Dom_1.$$(_this.listItem).addClass('coveo-facet-value-will-exclude');
        });
        Dom_1.$$(this.excludeIcon).on('mouseout', function () {
            Dom_1.$$(_this.listItem).removeClass('coveo-facet-value-will-exclude');
        });
    };
    ValueElementRenderer.prototype.tryToInitAndAppendComputedField = function () {
        if (!Utils_1.Utils.exists(this.facetValue.computedField)) {
            return;
        }
        this.computedField = this.buildValueComputedField();
        if (!this.computedField) {
            return;
        }
        this.label.appendChild(this.computedField);
        Dom_1.$$(this.label).addClass('coveo-with-computed-field');
    };
    ValueElementRenderer.prototype.initAndAppendFacetValueLabelWrapper = function () {
        this.facetValueLabelWrapper = Dom_1.$$('div', { className: 'coveo-facet-value-label-wrapper' }).el;
        this.initAndAppendCheckbox();
        this.initAndAppendStylishCheckbox();
        this.initAndAppendValueCount();
        this.initAndAppendValueCaption();
        this.label.appendChild(this.facetValueLabelWrapper);
    };
    ValueElementRenderer.prototype.initAndAppendCheckbox = function () {
        this.checkbox = this.buildValueCheckbox();
        this.facetValueLabelWrapper.appendChild(this.checkbox);
    };
    ValueElementRenderer.prototype.initAndAppendStylishCheckbox = function () {
        this.stylishCheckbox = this.buildValueStylishCheckbox();
        this.facetValueLabelWrapper.appendChild(this.stylishCheckbox);
    };
    ValueElementRenderer.prototype.initAndAppendValueCount = function () {
        this.valueCount = this.buildValueCount();
        if (!this.valueCount) {
            return;
        }
        this.facetValueLabelWrapper.appendChild(this.valueCount);
    };
    ValueElementRenderer.prototype.initAndAppendValueCaption = function () {
        this.valueCaption = this.buildValueCaption();
        this.facetValueLabelWrapper.appendChild(this.valueCaption);
    };
    ValueElementRenderer.prototype.addAccessibilityAttributesToTargetElement = function () {
        var el = this.accessibleElement;
        el.setAttribute('aria-label', this.ariaLabel);
        el.setAttribute('role', 'heading');
        el.setAttribute('aria-level', '3');
    };
    Object.defineProperty(ValueElementRenderer.prototype, "ariaLabel", {
        get: function () {
            var selectOrUnselect = !this.facetValue.selected ? 'SelectValueWithResultCount' : 'UnselectValueWithResultCount';
            var resultCount = Strings_1.l('ResultCount', this.count);
            return "" + Strings_1.l(selectOrUnselect, this.caption, resultCount);
        },
        enumerable: true,
        configurable: true
    });
    return ValueElementRenderer;
}());
exports.ValueElementRenderer = ValueElementRenderer;


/***/ }),

/***/ 329:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var SVGIcons_1 = __webpack_require__(13);
var SVGDom_1 = __webpack_require__(14);
var Component_1 = __webpack_require__(6);
var Strings_1 = __webpack_require__(7);
var EventsUtils_1 = __webpack_require__(157);
var PopupUtils_1 = __webpack_require__(98);
var FacetSearchUserInputHandler_1 = __webpack_require__(379);
var underscore_1 = __webpack_require__(0);
var SearchDropdownNavigatorFactory_1 = __webpack_require__(380);
var FacetSearchElement = /** @class */ (function () {
    function FacetSearchElement(facetSearch) {
        this.facetSearch = facetSearch;
        this.searchBarIsAnimating = false;
        this.triggeredScroll = false;
        this.facetSearchId = underscore_1.uniqueId('coveo-facet-search-results');
        this.facetSearchUserInputHandler = new FacetSearchUserInputHandler_1.FacetSearchUserInputHandler(this.facetSearch);
        this.initSearchResults();
    }
    FacetSearchElement.prototype.build = function (handleFacetSearchClear) {
        var _this = this;
        this.search = document.createElement('div');
        Dom_1.$$(this.search).addClass('coveo-facet-search');
        this.magnifier = this.buildMagnifierIcon();
        this.search.appendChild(this.magnifier);
        this.wait = this.buildWaitIcon();
        this.search.appendChild(this.wait);
        this.hideFacetSearchWaitingAnimation();
        this.clear = Dom_1.$$('div', { className: 'coveo-facet-search-clear', title: Strings_1.l('Clear', Strings_1.l('Search')) }, SVGIcons_1.SVGIcons.icons.checkboxHookExclusionMore).el;
        SVGDom_1.SVGDom.addClassToSVGInContainer(this.clear, 'coveo-facet-search-clear-svg');
        this.clear.style.display = 'none';
        this.search.appendChild(this.clear);
        this.combobox = this.buildCombobox();
        this.search.appendChild(this.combobox);
        this.input = this.buildInputElement();
        Component_1.Component.pointElementsToDummyForm(this.input);
        this.combobox.appendChild(this.input);
        Dom_1.$$(this.input).on('keyup', function (e) {
            _this.facetSearchUserInputHandler.handleKeyboardEvent(e);
        });
        Dom_1.$$(this.clear).on('click', function (e) {
            handleFacetSearchClear && handleFacetSearchClear();
        });
        Dom_1.$$(this.input).on('focus', function (e) {
            _this.handleFacetSearchFocus();
        });
        this.detectSearchBarAnimation();
        this.initSearchDropdownNavigator();
        return this.search;
    };
    FacetSearchElement.prototype.initSearchResults = function () {
        var _this = this;
        this.searchResults = Dom_1.$$('ul', { id: this.facetSearchId, className: 'coveo-facet-search-results', role: 'listbox' }).el;
        Dom_1.$$(this.searchResults).on('scroll', function () { return _this.handleScrollEvent(); });
        Dom_1.$$(this.searchResults).hide();
    };
    FacetSearchElement.prototype.initSearchDropdownNavigator = function () {
        var _this = this;
        var config = {
            input: this.input,
            searchResults: this.searchResults,
            setScrollTrigger: function (val) { return (_this.triggeredScroll = val); }
        };
        this.searchDropdownNavigator = SearchDropdownNavigatorFactory_1.SearchDropdownNavigatorFactory(this.facetSearch, config);
    };
    FacetSearchElement.prototype.buildCombobox = function () {
        return Dom_1.$$('div', {
            className: 'coveo-facet-search-middle',
            ariaHaspopup: 'listbox',
            ariaExpanded: 'true'
        }).el;
    };
    FacetSearchElement.prototype.showFacetSearchWaitingAnimation = function () {
        this.magnifier && Dom_1.$$(this.magnifier).hide();
        Dom_1.$$(this.wait).show();
    };
    FacetSearchElement.prototype.getValueInInputForFacetSearch = function () {
        return this.input.value.trim();
    };
    FacetSearchElement.prototype.hideFacetSearchWaitingAnimation = function () {
        Dom_1.$$(this.magnifier).show();
        Dom_1.$$(this.wait).hide();
    };
    FacetSearchElement.prototype.detectSearchBarAnimation = function () {
        var _this = this;
        EventsUtils_1.EventsUtils.addPrefixedEvent(this.search, 'AnimationStart', function (event) {
            if (event.animationName == 'grow') {
                _this.searchBarIsAnimating = true;
            }
        });
        EventsUtils_1.EventsUtils.addPrefixedEvent(this.search, 'AnimationEnd', function (event) {
            if (event.animationName == 'grow') {
                _this.searchBarIsAnimating = false;
            }
        });
    };
    FacetSearchElement.prototype.positionSearchResults = function (root, facetWidth, nextTo) {
        var _this = this;
        if (this.searchResults != null) {
            root.appendChild(this.searchResults);
            Dom_1.$$(this.searchResults).show();
            this.searchResults.style.width = facetWidth - FacetSearchElement.FACET_SEARCH_PADDING + 'px';
            if (Dom_1.$$(this.searchResults).css('display') == 'none') {
                this.searchResults.style.display = '';
            }
            var searchBar = Dom_1.$$(this.search);
            if (searchBar.css('display') == 'none' || this.searchBarIsAnimating) {
                if (Dom_1.$$(this.searchResults).css('display') == 'none') {
                    this.searchResults.style.display = '';
                }
                EventsUtils_1.EventsUtils.addPrefixedEvent(this.search, 'AnimationEnd', function () {
                    _this.positionPopUp(nextTo, root);
                    EventsUtils_1.EventsUtils.removePrefixedEvent(_this.search, 'AnimationEnd', _this);
                });
            }
            else {
                this.positionPopUp(nextTo, root);
            }
        }
    };
    FacetSearchElement.prototype.setAsCurrentResult = function (toSet) {
        this.searchDropdownNavigator.setAsCurrentResult(toSet);
    };
    Object.defineProperty(FacetSearchElement.prototype, "currentResult", {
        get: function () {
            return this.searchDropdownNavigator.currentResult;
        },
        enumerable: true,
        configurable: true
    });
    FacetSearchElement.prototype.moveCurrentResultDown = function () {
        this.searchDropdownNavigator.focusNextElement();
    };
    FacetSearchElement.prototype.moveCurrentResultUp = function () {
        this.searchDropdownNavigator.focusPreviousElement();
    };
    FacetSearchElement.prototype.highlightCurrentQueryInSearchResults = function (regex) {
        var captions = this.facetSearch.getCaptions();
        captions.forEach(function (caption) {
            caption.innerHTML = Dom_1.$$(caption)
                .text()
                .replace(regex, '<span class="coveo-highlight">$1</span>');
        });
    };
    FacetSearchElement.prototype.appendToSearchResults = function (el) {
        this.searchResults.appendChild(el);
        this.setupFacetSearchResultsEvents(el);
    };
    FacetSearchElement.prototype.focus = function () {
        this.input.focus();
        this.handleFacetSearchFocus();
    };
    FacetSearchElement.prototype.handleFacetSearchFocus = function () {
        if (this.facetSearch.currentlyDisplayedResults == null) {
            this.facetSearch.displayNewValues();
            this.addAriaAttributes();
        }
    };
    FacetSearchElement.prototype.setupFacetSearchResultsEvents = function (el) {
        var _this = this;
        Dom_1.$$(el).on('mousemove', function () {
            _this.setAsCurrentResult(Dom_1.$$(el));
        });
        // Prevent closing the search results on the end of a touch drag
        var touchDragging = false;
        var mouseDragging = false;
        Dom_1.$$(el).on('mousedown', function () { return (mouseDragging = false); });
        Dom_1.$$(el).on('mousemove', function () { return (mouseDragging = true); });
        Dom_1.$$(el).on('touchmove', function () { return (touchDragging = true); });
        Dom_1.$$(el).on('mouseup touchend', function () {
            if (!touchDragging && !mouseDragging) {
                setTimeout(function () {
                    _this.facetSearch.dismissSearchResults();
                }, 0); // setTimeout is to give time to trigger the click event before hiding the search menu.
            }
            touchDragging = false;
            mouseDragging = false;
        });
    };
    FacetSearchElement.prototype.hideSearchResultsElement = function () {
        this.removeAriaAttributes();
        Dom_1.$$(this.searchResults).hide();
        Dom_1.$$(this.searchResults).remove();
    };
    FacetSearchElement.prototype.clearSearchInput = function () {
        if (this.input) {
            this.input.value = '';
        }
    };
    FacetSearchElement.prototype.buildMagnifierIcon = function () {
        var magnifier = document.createElement('div');
        magnifier.innerHTML = SVGIcons_1.SVGIcons.icons.search;
        Dom_1.$$(magnifier).addClass('coveo-facet-search-magnifier');
        SVGDom_1.SVGDom.addClassToSVGInContainer(magnifier, 'coveo-facet-search-magnifier-svg');
        this.search.appendChild(magnifier);
        return magnifier;
    };
    FacetSearchElement.prototype.buildWaitIcon = function () {
        var wait = document.createElement('div');
        wait.innerHTML = SVGIcons_1.SVGIcons.icons.loading;
        Dom_1.$$(wait).addClass('coveo-facet-search-wait-animation');
        SVGDom_1.SVGDom.addClassToSVGInContainer(wait, 'coveo-facet-search-wait-animation-svg');
        return wait;
    };
    FacetSearchElement.prototype.buildInputElement = function () {
        return Dom_1.$$('input', {
            className: 'coveo-facet-search-input',
            type: 'text',
            autocapitalize: 'off',
            autocorrect: 'off',
            ariaLabel: Strings_1.l('Search'),
            ariaHaspopup: 'true',
            ariaAutocomplete: 'list'
        }).el;
    };
    FacetSearchElement.prototype.positionPopUp = function (nextTo, root) {
        PopupUtils_1.PopupUtils.positionPopup(this.searchResults, nextTo, root, {
            horizontal: PopupUtils_1.PopupHorizontalAlignment.CENTER,
            vertical: PopupUtils_1.PopupVerticalAlignment.BOTTOM
        });
    };
    FacetSearchElement.prototype.handleScrollEvent = function () {
        if (this.triggeredScroll) {
            this.triggeredScroll = false;
        }
        else {
            this.facetSearchUserInputHandler.handleFacetSearchResultsScroll();
        }
    };
    FacetSearchElement.prototype.addAriaAttributes = function () {
        if (!this.input || !this.combobox) {
            return;
        }
        this.combobox.setAttribute('role', 'combobox');
        this.combobox.setAttribute('aria-owns', this.facetSearchId);
        this.input.setAttribute('aria-controls', this.facetSearchId);
    };
    FacetSearchElement.prototype.removeAriaAttributes = function () {
        if (!this.input || !this.combobox) {
            return;
        }
        this.combobox.removeAttribute('role');
        this.combobox.removeAttribute('aria-owns');
        this.input.removeAttribute('aria-controls');
        this.input.removeAttribute('aria-activedescendant');
    };
    FacetSearchElement.FACET_SEARCH_PADDING = 40;
    return FacetSearchElement;
}());
exports.FacetSearchElement = FacetSearchElement;


/***/ }),

/***/ 330:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var underscore_1 = __webpack_require__(0);
var Dom_1 = __webpack_require__(1);
var DefaultSearchDropdownNavigator = /** @class */ (function () {
    function DefaultSearchDropdownNavigator(config) {
        this.config = config;
    }
    DefaultSearchDropdownNavigator.prototype.setAsCurrentResult = function (toSet) {
        this.currentResult && this.currentResult.removeClass('coveo-facet-search-current-result');
        this.currentResult = toSet;
        toSet.addClass('coveo-facet-search-current-result');
        this.updateSelectedOption(toSet);
    };
    DefaultSearchDropdownNavigator.prototype.focusNextElement = function () {
        this.moveCurrentResultDown();
    };
    DefaultSearchDropdownNavigator.prototype.focusPreviousElement = function () {
        this.moveCurrentResultUp();
    };
    DefaultSearchDropdownNavigator.prototype.moveCurrentResultDown = function () {
        var nextResult = this.currentResult.el.nextElementSibling;
        if (!nextResult) {
            nextResult = underscore_1.first(this.searchResults.children);
        }
        this.setAsCurrentResult(Dom_1.$$(nextResult));
        this.highlightAndShowCurrentResultWithKeyboard();
    };
    DefaultSearchDropdownNavigator.prototype.moveCurrentResultUp = function () {
        var previousResult = this.currentResult.el.previousElementSibling;
        if (!previousResult) {
            previousResult = underscore_1.last(this.searchResults.children);
        }
        this.setAsCurrentResult(Dom_1.$$(previousResult));
        this.highlightAndShowCurrentResultWithKeyboard();
    };
    DefaultSearchDropdownNavigator.prototype.highlightAndShowCurrentResultWithKeyboard = function () {
        this.currentResult.addClass('coveo-facet-search-current-result');
        this.config.setScrollTrigger(true);
        this.searchResults.scrollTop = this.currentResult.el.offsetTop;
    };
    Object.defineProperty(DefaultSearchDropdownNavigator.prototype, "searchResults", {
        get: function () {
            return this.config.searchResults;
        },
        enumerable: true,
        configurable: true
    });
    DefaultSearchDropdownNavigator.prototype.updateSelectedOption = function (option) {
        this.config.input.setAttribute('aria-activedescendant', option.getAttribute('id'));
        var previouslySelectedOption = Dom_1.$$(this.searchResults).find('[aria-selected^="true"]');
        previouslySelectedOption && previouslySelectedOption.setAttribute('aria-selected', 'false');
        option.setAttribute('aria-selected', 'true');
    };
    return DefaultSearchDropdownNavigator;
}());
exports.DefaultSearchDropdownNavigator = DefaultSearchDropdownNavigator;


/***/ }),

/***/ 331:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CategoryValue_1 = __webpack_require__(384);
var underscore_1 = __webpack_require__(0);
var CategoryChildrenValueRenderer = /** @class */ (function () {
    function CategoryChildrenValueRenderer(element, categoryFacetTemplates, categoryValue, categoryFacet) {
        this.element = element;
        this.categoryFacetTemplates = categoryFacetTemplates;
        this.categoryValue = categoryValue;
        this.categoryFacet = categoryFacet;
        this.children = [];
    }
    CategoryChildrenValueRenderer.prototype.clearChildren = function () {
        this.element.removeClass('coveo-active-category-facet-parent');
        this.children.forEach(function (child) {
            child.clear();
        });
        this.children = [];
    };
    CategoryChildrenValueRenderer.prototype.renderChildren = function (values) {
        var _this = this;
        underscore_1.each(values, function (value) {
            _this.renderValue(value, true).makeSelectable();
        });
    };
    CategoryChildrenValueRenderer.prototype.renderAsParent = function (value) {
        var categoryValue = this.renderValue(value, false);
        return categoryValue;
    };
    CategoryChildrenValueRenderer.prototype.renderValue = function (value, isChild) {
        var path = this.categoryValue.path.concat([value.value]);
        var categoryValueDescriptor = {
            value: value.value,
            count: value.numberOfResults,
            path: path
        };
        var categoryValue = new CategoryValue_1.CategoryValue(this.categoryValue.listRoot, categoryValueDescriptor, this.categoryFacetTemplates, this.categoryFacet);
        categoryValue.render(isChild);
        this.children.push(categoryValue);
        return categoryValue;
    };
    return CategoryChildrenValueRenderer;
}());
exports.CategoryChildrenValueRenderer = CategoryChildrenValueRenderer;


/***/ }),

/***/ 332:
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
__webpack_require__(392);
var underscore_1 = __webpack_require__(0);
var InitializationEvents_1 = __webpack_require__(15);
var QueryStateModel_1 = __webpack_require__(12);
var Strings_1 = __webpack_require__(7);
var AccessibleButton_1 = __webpack_require__(17);
var Dom_1 = __webpack_require__(1);
var LocalStorageUtils_1 = __webpack_require__(38);
var SVGDom_1 = __webpack_require__(14);
var SVGIcons_1 = __webpack_require__(13);
var Utils_1 = __webpack_require__(4);
var AnalyticsActionListMeta_1 = __webpack_require__(9);
var FacetSort_1 = __webpack_require__(333);
var popper_js_1 = __webpack_require__(92);
/**
 * Handle the rendering of the {@link Facet} settings menu (typically the ... in the facet header).
 */
var FacetSettings = /** @class */ (function (_super) {
    __extends(FacetSettings, _super);
    function FacetSettings(sorts, facet) {
        var _this = _super.call(this, sorts, facet) || this;
        _this.sorts = sorts;
        _this.facet = facet;
        _this.customSortDirectionChange = false;
        _this.onDocumentClick = function () { return _this.close(); };
        _this.enabledSortsIgnoreRenderBecauseOfPairs = [];
        _this.filterDuplicateForRendering();
        return _this;
    }
    /**
     * Build the menu, hook click events.
     * @returns {HTMLElement}
     */
    FacetSettings.prototype.build = function () {
        var _this = this;
        this.buildSettingsButton();
        this.buildSettingsPopup();
        if (Utils_1.Utils.isNonEmptyArray(this.enabledSorts)) {
            this.sortSection = this.buildSortSection();
            if (this.enabledSortsAllowDirection()) {
                this.directionSection = this.buildDirectionSection();
            }
        }
        if (this.facet.options.enableSettingsFacetState) {
            this.saveStateSection = this.buildSaveStateSection();
            this.clearStateSection = this.buildClearStateSection();
        }
        if (this.facet.options.enableCollapse) {
            this.hideSection = this.buildHideSection();
            this.showSection = this.buildShowSection();
        }
        var appendCommon = function () {
            _this.appendIfNotUndefined(_this.saveStateSection);
            _this.appendIfNotUndefined(_this.clearStateSection);
            _this.appendIfNotUndefined(_this.hideSection);
            _this.appendIfNotUndefined(_this.showSection);
        };
        this.addOnDocumentClickHandler();
        this.addOnNukeHandler();
        if (Utils_1.Utils.isNonEmptyArray(this.enabledSorts)) {
            this.settingsPopup.appendChild(this.sortSection.element);
            underscore_1.each(this.directionSection, function (d) {
                _this.appendIfNotUndefined(d);
            });
            appendCommon();
        }
        else {
            appendCommon();
        }
        return this.settingsButton;
    };
    /**
     * Restore the facet state from local storage, and apply it in the query state model.
     */
    FacetSettings.prototype.loadSavedState = function () {
        if (this.facetStateLocalStorage) {
            // set the state from the settings only if there is nothing
            // in the query state model for the current facet
            var state = this.facetStateLocalStorage.load();
            var currentStateIncluded = this.facet.queryStateModel.get(this.includedStateAttribute);
            var currentStateExcluded = this.facet.queryStateModel.get(this.excludedStateAttribute);
            var currentStateOperator = this.facet.queryStateModel.get(this.operatorStateAttribute);
            if (!Utils_1.Utils.isNullOrUndefined(state) &&
                Utils_1.Utils.isEmptyArray(currentStateIncluded) &&
                Utils_1.Utils.isEmptyArray(currentStateExcluded) &&
                !Utils_1.Utils.isNonEmptyString(currentStateOperator)) {
                var toSet = {};
                toSet[this.includedStateAttribute] = state.included;
                toSet[this.excludedStateAttribute] = state.excluded;
                toSet[this.operatorStateAttribute] = state.operator;
                this.facet.queryStateModel.setMultiple(toSet);
                this.loadedFromSettings = toSet;
            }
        }
        else {
            this.facet.logger.info('Facet state local storage not enabled : See Facet.options.enableSettingsFacetState');
        }
    };
    /**
     * Take the current state of the facet and save it in the local storage.
     */
    FacetSettings.prototype.saveState = function () {
        if (this.facetStateLocalStorage) {
            this.facetStateLocalStorage.save({
                included: this.facet.queryStateModel.get(this.includedStateAttribute),
                excluded: this.facet.queryStateModel.get(this.excludedStateAttribute),
                operator: this.facet.queryStateModel.get(this.operatorStateAttribute)
            });
        }
        else {
            this.facet.logger.info('Facet state local storage not enabled : See Facet.options.enableSettingsFacetState');
        }
    };
    /**
     * Close the settings menu
     */
    FacetSettings.prototype.close = function () {
        Dom_1.$$(this.settingsPopup).detach();
    };
    /**
     * Open the settings menu
     */
    FacetSettings.prototype.open = function () {
        var _this = this;
        Dom_1.$$(this.settingsPopup).insertAfter(this.settingsButton);
        new popper_js_1.default(this.settingsButton, this.settingsPopup, {
            modifiers: {
                preventOverflow: {
                    boundariesElement: this.facet.root
                }
            }
        });
        if (this.hideSection && this.showSection) {
            Dom_1.$$(this.hideSection).toggle(!Dom_1.$$(this.facet.element).hasClass('coveo-facet-collapsed'));
            Dom_1.$$(this.showSection).toggle(Dom_1.$$(this.facet.element).hasClass('coveo-facet-collapsed'));
        }
        if (this.facet.options.enableSettingsFacetState) {
            Dom_1.$$(this.clearStateSection).toggle(!Utils_1.Utils.isNullOrUndefined(this.facetStateLocalStorage.load()));
        }
        underscore_1.each(this.enabledSorts, function (criteria, i) {
            if (_this.activeSort.name == criteria.name.toLowerCase()) {
                _this.selectItem(_this.getSortItem(criteria.name));
            }
            else {
                _this.unselectItem(_this.getSortItem(criteria.name));
            }
        });
    };
    FacetSettings.prototype.getSortItem = function (sortName) {
        return underscore_1.find(this.sortSection.sortItems, function (sortItem) {
            return (Dom_1.$$(sortItem)
                .getAttribute('data-sort-name')
                .toLowerCase() == sortName.replace('ascending|descending', '').toLowerCase());
        });
    };
    Object.defineProperty(FacetSettings.prototype, "button", {
        get: function () {
            return this.settingsButton;
        },
        enumerable: true,
        configurable: true
    });
    FacetSettings.prototype.buildSettingsButton = function () {
        var _this = this;
        this.settingsButton = Dom_1.$$('div', { className: 'coveo-facet-header-settings' }).el;
        this.settingsButton.innerHTML = SVGIcons_1.SVGIcons.icons.more;
        SVGDom_1.SVGDom.addClassToSVGInContainer(this.settingsButton, 'coveo-facet-settings-more-svg');
        this.hideElementOnMouseEnterLeave(this.settingsButton);
        new AccessibleButton_1.AccessibleButton()
            .withElement(this.settingsButton)
            .withLabel(Strings_1.l('Settings'))
            .withClickAction(function (e) { return _this.handleSettingsButtonClick(e); })
            .withEnterKeyboardAction(function (e) { return _this.handleSettingsButtonClick(e); })
            .build();
    };
    FacetSettings.prototype.hideElementOnMouseEnterLeave = function (el) {
        var _this = this;
        var mouseLeave = function () { return (_this.closeTimeout = window.setTimeout(function () { return _this.close(); }, 300)); };
        var mouseEnter = function () { return clearTimeout(_this.closeTimeout); };
        Dom_1.$$(el).on('mouseleave', mouseLeave);
        Dom_1.$$(el).on('mouseenter', mouseEnter);
    };
    FacetSettings.prototype.buildSettingsPopup = function () {
        this.settingsPopup = Dom_1.$$('div', { className: 'coveo-facet-settings-popup' }).el;
        this.hideElementOnMouseEnterLeave(this.settingsPopup);
    };
    FacetSettings.prototype.buildSortSection = function () {
        var sortSection = this.buildSection('coveo-facet-settings-section-sort');
        var sortSectionIcon = this.buildIcon('coveo-facet-settings-section-sort-svg', SVGIcons_1.SVGIcons.icons.sort);
        var sortSectionItems = this.buildItems();
        var sortTitle = document.createElement('div');
        Dom_1.$$(sortTitle).addClass('coveo-facet-settings-section-sort-title');
        Dom_1.$$(sortTitle).text(Strings_1.l('SortBy') + ' :');
        sortSectionItems.appendChild(sortTitle);
        var sortItems = this.buildSortSectionItems();
        underscore_1.each(sortItems, function (s) {
            sortSectionItems.appendChild(s);
        });
        sortSection.appendChild(sortSectionIcon);
        sortSection.appendChild(sortSectionItems);
        return { element: sortSection, sortItems: sortItems };
    };
    FacetSettings.prototype.buildSortSectionItems = function () {
        var _this = this;
        var elems = underscore_1.map(this.enabledSorts, function (enabledSort) {
            if (underscore_1.contains(_this.enabledSortsIgnoreRenderBecauseOfPairs, enabledSort)) {
                return undefined;
            }
            else {
                var elem = _this.buildItem(Strings_1.l(enabledSort.label), enabledSort.description);
                Dom_1.$$(elem).setAttribute('data-sort-name', enabledSort.name.toLowerCase().replace('ascending|descending', ''));
                new AccessibleButton_1.AccessibleButton()
                    .withElement(elem)
                    .withSelectAction(function (e) { return _this.handleClickSortButton(e, enabledSort); })
                    .withLabel(enabledSort.label)
                    .build();
                return elem;
            }
        });
        elems = underscore_1.compact(elems);
        return elems;
    };
    FacetSettings.prototype.closePopupAndUpdateSort = function () {
        this.close();
        if (this.activeSort.name != 'custom') {
            this.facet.updateSort(this.activeSort.name);
        }
        else {
            this.facet.updateSort('nosort');
            if (this.customSortDirectionChange) {
                this.customSortDirectionChange = false;
                this.facet.queryController.executeQuery();
            }
        }
    };
    FacetSettings.prototype.enabledSortsAllowDirection = function () {
        var _this = this;
        var allEnabledSortsWithPossibleDirectionToggle = underscore_1.filter(this.enabledSorts, function (facetSortDescription) {
            return facetSortDescription.directionToggle;
        });
        var allowToggle = underscore_1.filter(allEnabledSortsWithPossibleDirectionToggle, function (possibleDirectionToggle) {
            return underscore_1.findWhere(_this.enabledSorts, { name: possibleDirectionToggle.relatedSort }) != undefined;
        });
        return allowToggle.length > 0;
    };
    FacetSettings.prototype.buildDirectionSection = function () {
        var _this = this;
        var directionAscendingSection = this.buildAscendingOrDescendingSection('Ascending');
        var iconAscending = this.buildIcon('coveo-facet-settings-section-direction-ascending-svg', SVGIcons_1.SVGIcons.icons.ascending);
        var iconDescending = this.buildIcon('coveo-facet-settings-section-direction-descending-svg', SVGIcons_1.SVGIcons.icons.descending);
        var directionItemsAscending = this.buildItems();
        var ascending = this.buildAscendingOrDescending('Ascending');
        directionItemsAscending.appendChild(ascending);
        directionAscendingSection.appendChild(iconAscending);
        directionAscendingSection.appendChild(directionItemsAscending);
        new AccessibleButton_1.AccessibleButton()
            .withElement(directionAscendingSection)
            .withLabel(Strings_1.l('Ascending'))
            .withSelectAction(function (e) { return _this.handleDirectionClick(e, 'ascending'); })
            .build();
        var directionDescendingSection = this.buildAscendingOrDescendingSection('Descending');
        var directionItemsDescending = this.buildItems();
        var descending = this.buildAscendingOrDescending('Descending');
        directionItemsDescending.appendChild(descending);
        directionDescendingSection.appendChild(iconDescending);
        directionDescendingSection.appendChild(directionItemsDescending);
        new AccessibleButton_1.AccessibleButton()
            .withElement(directionDescendingSection)
            .withLabel(Strings_1.l('Descending'))
            .withSelectAction(function (e) { return _this.handleDirectionClick(e, 'descending'); })
            .build();
        if (!this.activeSort.directionToggle) {
            Dom_1.$$(directionAscendingSection).addClass('coveo-facet-settings-disabled');
            Dom_1.$$(directionDescendingSection).addClass('coveo-facet-settings-disabled');
        }
        else {
            this.selectItem(this.getItems(directionAscendingSection)[0]);
        }
        return [directionAscendingSection, directionDescendingSection];
    };
    FacetSettings.prototype.buildSaveStateSection = function () {
        var _this = this;
        var saveStateSection = this.buildSection('coveo-facet-settings-section-save-state');
        var icon = this.buildIcon('coveo-facet-settings-section-save-state-svg', SVGIcons_1.SVGIcons.icons.dropdownMore);
        var saveStateItems = this.buildItems();
        this.facetStateLocalStorage = new LocalStorageUtils_1.LocalStorageUtils('facet-state-' + this.facet.options.id);
        this.includedStateAttribute = QueryStateModel_1.QueryStateModel.getFacetId(this.facet.options.id);
        this.excludedStateAttribute = QueryStateModel_1.QueryStateModel.getFacetId(this.facet.options.id, false);
        this.operatorStateAttribute = QueryStateModel_1.QueryStateModel.getFacetOperator(this.facet.options.id);
        var saveStateItem = document.createElement('div');
        Dom_1.$$(saveStateItem).addClass('coveo-facet-settings-item');
        saveStateItem.setAttribute('title', Strings_1.l('SaveFacetState'));
        Dom_1.$$(saveStateItem).text(Strings_1.l('SaveFacetState'));
        saveStateItems.appendChild(saveStateItem);
        saveStateSection.appendChild(icon);
        saveStateSection.appendChild(saveStateItems);
        new AccessibleButton_1.AccessibleButton()
            .withElement(saveStateSection)
            .withSelectAction(function () { return _this.handleSaveStateClick(); })
            .withLabel(Strings_1.l('SaveFacetState'))
            .build();
        return saveStateSection;
    };
    FacetSettings.prototype.buildClearStateSection = function () {
        var _this = this;
        var clearStateSection = this.buildSection('coveo-facet-settings-section-clear-state');
        var icon = this.buildIcon('coveo-facet-settings-section-clear-state-svg', SVGIcons_1.SVGIcons.icons.dropdownLess);
        var clearStateItems = this.buildItems();
        var clearStateItem = this.buildItem(Strings_1.l('ClearFacetState'));
        clearStateItems.appendChild(clearStateItem);
        clearStateSection.appendChild(icon);
        clearStateSection.appendChild(clearStateItems);
        new AccessibleButton_1.AccessibleButton()
            .withElement(clearStateSection)
            .withSelectAction(function () { return _this.handleClearStateClick(); })
            .withLabel(Strings_1.l('ClearFacetState'))
            .build();
        return clearStateSection;
    };
    FacetSettings.prototype.buildHideSection = function () {
        var _this = this;
        var hideSection = this.buildSection('coveo-facet-settings-section-hide');
        var icon = this.buildIcon('coveo-facet-settings-section-hide-svg', SVGIcons_1.SVGIcons.icons.facetCollapse);
        var hideItems = this.buildItems();
        var hideItem = this.buildItem(Strings_1.l('Collapse'));
        hideItems.appendChild(hideItem);
        hideSection.appendChild(icon);
        hideSection.appendChild(hideItems);
        new AccessibleButton_1.AccessibleButton()
            .withElement(hideSection)
            .withSelectAction(function () {
            _this.facet.facetHeader.collapseFacet();
            _this.close();
        })
            .withLabel(Strings_1.l('Collapse'))
            .build();
        return hideSection;
    };
    FacetSettings.prototype.buildShowSection = function () {
        var _this = this;
        var showSection = this.buildSection('coveo-facet-settings-section-show');
        var icon = this.buildIcon('coveo-facet-settings-section-show-svg', SVGIcons_1.SVGIcons.icons.facetExpand);
        var showItems = this.buildItems();
        var showItem = this.buildItem(Strings_1.l('Expand'));
        showItems.appendChild(showItem);
        showSection.appendChild(icon);
        showSection.appendChild(showItems);
        new AccessibleButton_1.AccessibleButton()
            .withElement(showSection)
            .withSelectAction(function () {
            _this.facet.facetHeader.expandFacet();
            _this.close();
        })
            .withLabel(Strings_1.l('Expand'))
            .build();
        return showSection;
    };
    FacetSettings.prototype.buildIcon = function (iconClass, svgIcon) {
        if (iconClass && svgIcon) {
            var icon = Dom_1.$$('div', { className: 'coveo-icon-container' }, svgIcon);
            SVGDom_1.SVGDom.addClassToSVGInContainer(icon.el, iconClass);
            return icon.el;
        }
        else {
            return Dom_1.$$('div', { className: 'coveo-icon' }).el;
        }
    };
    FacetSettings.prototype.buildAscendingOrDescending = function (direction) {
        var elem = this.buildItem(Strings_1.l(direction));
        elem.setAttribute('aria-disabled', 'true');
        elem.setAttribute('data-direction', direction.toLowerCase());
        return elem;
    };
    FacetSettings.prototype.buildAscendingOrDescendingSection = function (direction) {
        return this.buildSection('coveo-facet-settings-section-direction-' + direction.toLowerCase());
    };
    FacetSettings.prototype.buildItem = function (label, title) {
        if (title === void 0) { title = label; }
        return Dom_1.$$('div', {
            className: 'coveo-facet-settings-item',
            title: title
        }, underscore_1.escape(label)).el;
    };
    FacetSettings.prototype.buildItems = function () {
        var elem = document.createElement('div');
        Dom_1.$$(elem).addClass('coveo-facet-settings-items');
        return elem;
    };
    FacetSettings.prototype.buildSection = function (className) {
        var section = document.createElement('div');
        Dom_1.$$(section).addClass(['coveo-facet-settings-section', className]);
        return section;
    };
    FacetSettings.prototype.handleSettingsButtonClick = function (event) {
        event.stopPropagation();
        var settingsPopupIsOpen = !Utils_1.Utils.isNullOrUndefined(this.settingsPopup.parentElement);
        settingsPopupIsOpen ? this.close() : this.open();
    };
    FacetSettings.prototype.handleClickSortButton = function (e, enabledSort) {
        if (this.activeSort != enabledSort && this.activeSort.relatedSort != enabledSort.name) {
            this.activeSort = enabledSort;
            if (enabledSort.directionToggle && underscore_1.contains(this.enabledSorts, FacetSettings.availableSorts[this.activeSort.relatedSort])) {
                this.activateDirectionSection();
            }
            else {
                this.disableDirectionSection();
            }
            this.selectItem(e.target);
            this.closePopupAndUpdateSort();
        }
    };
    FacetSettings.prototype.handleDirectionClick = function (e, direction) {
        var _this = this;
        if (!Dom_1.$$(e.target.parentElement.parentElement).hasClass('coveo-facet-settings-disabled') &&
            this.activeSort.name.indexOf(direction) == -1) {
            this.activeSort = FacetSettings.availableSorts[this.activeSort.relatedSort];
            underscore_1.each(this.directionSection, function (d) {
                _this.unselectSection(d);
            });
            this.selectItem(e.target);
            if (this.activeSort.name == 'custom' && this.customSortDirection != direction) {
                this.customSortDirection = direction;
                this.customSortDirectionChange = true;
            }
            this.closePopupAndUpdateSort();
        }
    };
    FacetSettings.prototype.handleSaveStateClick = function () {
        this.saveState();
        this.close();
    };
    FacetSettings.prototype.handleClearStateClick = function () {
        var _this = this;
        this.facetStateLocalStorage.remove();
        this.facet.reset();
        this.close();
        this.facet.triggerNewQuery(function () {
            return _this.facet.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.facetClearAll, {
                facetId: _this.facet.options.id,
                facetField: _this.facet.options.field.toString(),
                facetTitle: _this.facet.options.title
            });
        });
    };
    FacetSettings.prototype.addOnNukeHandler = function () {
        var _this = this;
        Dom_1.$$(this.facet.root).on(InitializationEvents_1.InitializationEvents.nuke, function () { return _this.handleNuke(); });
    };
    FacetSettings.prototype.addOnDocumentClickHandler = function () {
        var _this = this;
        document.addEventListener('click', function () { return _this.onDocumentClick(); });
    };
    FacetSettings.prototype.getCurrentDirectionItem = function (directionSection) {
        var _this = this;
        if (directionSection === void 0) { directionSection = this.directionSection; }
        var found;
        underscore_1.each(directionSection, function (direction) {
            if (!found) {
                found = underscore_1.find(_this.getItems(direction), function (direction) {
                    return _this.activeSort.name.indexOf(direction.getAttribute('data-direction')) != -1;
                });
            }
        });
        if (!found) {
            found = directionSection[0];
        }
        return found;
    };
    FacetSettings.prototype.activateDirectionSection = function () {
        var _this = this;
        underscore_1.each(this.directionSection, function (direction) {
            Dom_1.$$(direction).removeClass('coveo-facet-settings-disabled');
            Dom_1.$$(direction)
                .find('.coveo-facet-settings-item')
                .removeAttribute('aria-disabled');
            _this.unselectSection(direction);
        });
        this.selectItem(this.getCurrentDirectionItem());
    };
    FacetSettings.prototype.disableDirectionSection = function () {
        var _this = this;
        underscore_1.each(this.directionSection, function (direction) {
            Dom_1.$$(direction).addClass('coveo-facet-settings-disabled');
            Dom_1.$$(direction)
                .find('.coveo-facet-settings-item')
                .setAttribute('aria-disabled', 'true');
            _this.unselectSection(direction);
        });
    };
    FacetSettings.prototype.getItems = function (section) {
        return Dom_1.$$(section).findAll('.coveo-facet-settings-item');
    };
    FacetSettings.prototype.unselectSection = function (section) {
        underscore_1.each(this.getItems(section), function (i) {
            Dom_1.$$(i).removeClass('coveo-selected');
        });
    };
    FacetSettings.prototype.selectItem = function (item) {
        if (item) {
            Dom_1.$$(item).addClass('coveo-selected');
        }
    };
    FacetSettings.prototype.unselectItem = function (item) {
        if (item) {
            Dom_1.$$(item).removeClass('coveo-selected');
        }
    };
    FacetSettings.prototype.filterDuplicateForRendering = function () {
        var _this = this;
        underscore_1.each(this.enabledSorts, function (enabledSort, i) {
            if (enabledSort.relatedSort != null) {
                for (var j = i + 1; j < _this.enabledSorts.length; j++) {
                    if (_this.enabledSorts[j].name == enabledSort.relatedSort) {
                        _this.enabledSortsIgnoreRenderBecauseOfPairs.push(_this.enabledSorts[j]);
                        break;
                    }
                }
            }
        });
    };
    FacetSettings.prototype.appendIfNotUndefined = function (toAppend) {
        if (!Utils_1.Utils.isNullOrUndefined(toAppend)) {
            this.settingsPopup.appendChild(toAppend);
        }
    };
    FacetSettings.prototype.handleNuke = function () {
        document.removeEventListener('click', this.onDocumentClick);
    };
    return FacetSettings;
}(FacetSort_1.FacetSort));
exports.FacetSettings = FacetSettings;


/***/ }),

/***/ 333:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Strings_1 = __webpack_require__(7);
var FacetSettings_1 = __webpack_require__(332);
var Utils_1 = __webpack_require__(4);
var _ = __webpack_require__(0);
var FacetSort = /** @class */ (function () {
    function FacetSort(sorts, facet) {
        var _this = this;
        this.facet = facet;
        this.enabledSorts = [];
        this.customSortDirection = 'ascending';
        _.each(sorts, function (sortToActivate) {
            var newSortToEnable = FacetSettings_1.FacetSettings.availableSorts[sortToActivate.toLowerCase()];
            if (newSortToEnable != undefined) {
                _this.enabledSorts.push(newSortToEnable);
            }
        });
        this.removeEnabledSortsBasedOnFacetType();
        if (Utils_1.Utils.isNonEmptyArray(this.enabledSorts)) {
            if (this.facet.options.sortCriteria != undefined) {
                this.activeSort = _.find(this.enabledSorts, function (enabledSort) {
                    return enabledSort.name == _this.facet.options.sortCriteria;
                });
            }
            if (!this.activeSort) {
                this.activeSort = this.enabledSorts[0];
            }
        }
    }
    FacetSort.prototype.removeEnabledSortsBasedOnFacetType = function () {
        if (Coveo.FacetRange && this.facet instanceof Coveo.FacetRange) {
            var facetRange = this.facet;
            if (facetRange.options['slider']) {
                this.enabledSorts = [];
            }
        }
    };
    FacetSort.availableSorts = {
        score: {
            label: Strings_1.l('Score'),
            directionToggle: false,
            description: Strings_1.l('ScoreDescription'),
            name: 'score'
        },
        occurrences: {
            label: Strings_1.l('Occurrences'),
            directionToggle: false,
            description: Strings_1.l('OccurrencesDescription'),
            name: 'occurrences'
        },
        alphaascending: {
            label: Strings_1.l('Label'),
            directionToggle: true,
            description: Strings_1.l('LabelDescription'),
            name: 'alphaascending',
            relatedSort: 'alphadescending'
        },
        alphadescending: {
            label: Strings_1.l('Label'),
            directionToggle: true,
            description: Strings_1.l('LabelDescription'),
            name: 'alphadescending',
            relatedSort: 'alphaascending'
        },
        computedfieldascending: {
            label: Strings_1.l('Value'),
            directionToggle: true,
            description: Strings_1.l('ValueDescription'),
            name: 'computedfieldascending',
            relatedSort: 'computedfielddescending'
        },
        computedfielddescending: {
            label: Strings_1.l('Value'),
            directionToggle: true,
            description: Strings_1.l('ValueDescription'),
            name: 'computedfielddescending',
            relatedSort: 'computedfieldascending'
        },
        chisquare: {
            label: Strings_1.l('RelativeFrequency'),
            directionToggle: false,
            description: Strings_1.l('RelativeFrequencyDescription'),
            name: 'chisquare'
        },
        nosort: {
            label: Strings_1.l('Nosort'),
            directionToggle: false,
            description: Strings_1.l('NosortDescription'),
            name: 'nosort'
        },
        custom: {
            label: Strings_1.l('Custom'),
            directionToggle: true,
            description: Strings_1.l('CustomDescription'),
            name: 'custom',
            relatedSort: 'custom'
        }
    };
    return FacetSort;
}());
exports.FacetSort = FacetSort;


/***/ }),

/***/ 335:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(373);
var QueryEvents_1 = __webpack_require__(10);
var Logger_1 = __webpack_require__(11);
var Strings_1 = __webpack_require__(7);
var Dom_1 = __webpack_require__(1);
var Utils_1 = __webpack_require__(4);
var Component_1 = __webpack_require__(6);
var SearchInterface_1 = __webpack_require__(18);
var ResponsiveComponents_1 = __webpack_require__(43);
var ResponsiveComponentsManager_1 = __webpack_require__(80);
var ResponsiveComponentsUtils_1 = __webpack_require__(93);
var ResponsiveDropdown_1 = __webpack_require__(161);
var ResponsiveDropdownContent_1 = __webpack_require__(156);
var ResponsiveDropdownHeader_1 = __webpack_require__(326);
var underscore_1 = __webpack_require__(0);
var ComponentsTypes_1 = __webpack_require__(131);
var ResponsiveFacetColumn = /** @class */ (function () {
    function ResponsiveFacetColumn(coveoRoot, ID, options, responsiveDropdown) {
        this.coveoRoot = coveoRoot;
        this.ID = ID;
        this.componentsInFacetColumn = [];
        this.preservePositionOriginalValues = [];
        this.dropdownHeaderLabel = this.getDropdownHeaderLabel();
        this.dropdown = this.buildDropdown(responsiveDropdown);
        this.searchInterface = Component_1.Component.get(this.coveoRoot.el, SearchInterface_1.SearchInterface, false);
        this.bindDropdownContentEvents();
        this.registerOnCloseHandler();
        this.registerQueryEvents();
        this.breakpoint = options.responsiveBreakpoint;
    }
    ResponsiveFacetColumn.init = function (responsiveComponentConstructor, root, component, options, ID) {
        var column = this.findColumn(root);
        if (!column) {
            return;
        }
        ResponsiveComponentsManager_1.ResponsiveComponentsManager.register(ResponsiveFacetColumn, Dom_1.$$(root), 'ResponsiveFacetColumn', component, options);
        ResponsiveComponentsManager_1.ResponsiveComponentsManager.register(responsiveComponentConstructor, Dom_1.$$(root), ID, component, options);
    };
    ResponsiveFacetColumn.findColumn = function (root) {
        var column = Dom_1.$$(root).find('.coveo-facet-column');
        if (!column) {
            var logger = new Logger_1.Logger('ResponsiveFacets');
            logger.info('No element with class coveo-facet-column. Responsive facets cannot be enabled');
        }
        return column;
    };
    ResponsiveFacetColumn.prototype.registerComponent = function (accept) {
        this.componentsInFacetColumn.push(accept);
        this.preservePositionOriginalValues.push(accept.options.preservePosition);
        return true;
    };
    ResponsiveFacetColumn.prototype.needDropdownWrapper = function () {
        return this.needSmallMode();
    };
    ResponsiveFacetColumn.prototype.handleResizeEvent = function () {
        if (this.needSmallMode() && !ResponsiveComponentsUtils_1.ResponsiveComponentsUtils.isSmallFacetActivated(this.coveoRoot)) {
            this.changeToSmallMode();
        }
        else if (!this.needSmallMode() && ResponsiveComponentsUtils_1.ResponsiveComponentsUtils.isSmallFacetActivated(this.coveoRoot)) {
            this.changeToLargeMode();
        }
        if (this.dropdown.isOpened) {
            this.dropdown.dropdownContent.positionDropdown();
        }
    };
    ResponsiveFacetColumn.prototype.dismissFacetSearches = function () {
        underscore_1.each(this.componentsInFacetColumn, function (component) {
            if (component.facetSearch && component.facetSearch.currentlyDisplayedResults) {
                component.facetSearch.dismissSearchResults();
            }
        });
    };
    ResponsiveFacetColumn.prototype.needSmallMode = function () {
        if (!this.searchInterface) {
            return (this.coveoRoot.width() <=
                (Utils_1.Utils.isNullOrUndefined(this.breakpoint) ? new ResponsiveComponents_1.ResponsiveComponents().getMediumScreenWidth() : this.breakpoint));
        }
        switch (this.searchInterface.responsiveComponents.getResponsiveMode()) {
            case 'small':
            case 'medium':
                return true;
            case 'auto':
                return (this.coveoRoot.width() <=
                    (Utils_1.Utils.isNullOrUndefined(this.breakpoint) ? this.searchInterface.responsiveComponents.getMediumScreenWidth() : this.breakpoint));
            default:
                return false;
        }
    };
    ResponsiveFacetColumn.prototype.changeToSmallMode = function () {
        this.dropdown.close();
        this.disableFacetPreservePosition();
        Dom_1.$$(this.coveoRoot.find("." + ResponsiveComponentsManager_1.ResponsiveComponentsManager.DROPDOWN_HEADER_WRAPPER_CSS_CLASS)).append(this.dropdown.dropdownHeader.element.el);
        ResponsiveComponentsUtils_1.ResponsiveComponentsUtils.activateSmallFacet(this.coveoRoot);
    };
    ResponsiveFacetColumn.prototype.changeToLargeMode = function () {
        this.restoreFacetPreservePositionValue();
        this.dropdown.cleanUp();
        ResponsiveComponentsUtils_1.ResponsiveComponentsUtils.deactivateSmallFacet(this.coveoRoot);
    };
    ResponsiveFacetColumn.prototype.buildDropdown = function (responsiveDropdown) {
        var dropdownContent = this.buildDropdownContent();
        var dropdownHeader = this.buildDropdownHeader();
        var dropdown = responsiveDropdown ? responsiveDropdown : new ResponsiveDropdown_1.ResponsiveDropdown(dropdownContent, dropdownHeader, this.coveoRoot);
        return dropdown;
    };
    ResponsiveFacetColumn.prototype.buildDropdownContent = function () {
        var dropdownContentElement = Dom_1.$$(this.coveoRoot.find('.coveo-facet-column'));
        var filterByContainer = Dom_1.$$('div', { className: 'coveo-facet-header-filter-by-container', style: 'display: none' });
        var filterBy = Dom_1.$$('div', { className: 'coveo-facet-header-filter-by' });
        filterBy.text(Strings_1.l('Filter by:'));
        filterByContainer.append(filterBy.el);
        dropdownContentElement.prepend(filterByContainer.el);
        var dropdownContent = new ResponsiveDropdownContent_1.ResponsiveDropdownContent('facet', dropdownContentElement, this.coveoRoot, ResponsiveFacetColumn.DROPDOWN_MIN_WIDTH, ResponsiveFacetColumn.DROPDOWN_WIDTH_RATIO);
        return dropdownContent;
    };
    ResponsiveFacetColumn.prototype.buildDropdownHeader = function () {
        var dropdownHeaderElement = Dom_1.$$('a');
        var content = Dom_1.$$('p');
        content.text(this.dropdownHeaderLabel);
        dropdownHeaderElement.el.appendChild(content.el);
        var dropdownHeader = new ResponsiveDropdownHeader_1.ResponsiveDropdownHeader('facet', dropdownHeaderElement);
        return dropdownHeader;
    };
    ResponsiveFacetColumn.prototype.registerOnCloseHandler = function () {
        this.dropdown.registerOnCloseHandler(this.dismissFacetSearches, this);
    };
    ResponsiveFacetColumn.prototype.registerQueryEvents = function () {
        var _this = this;
        this.coveoRoot.on(QueryEvents_1.QueryEvents.noResults, function () { return _this.handleNoResults(); });
        this.coveoRoot.on(QueryEvents_1.QueryEvents.querySuccess, function (e, data) { return _this.handleQuerySuccess(data); });
        this.coveoRoot.on(QueryEvents_1.QueryEvents.queryError, function () { return _this.handleQueryError(); });
    };
    ResponsiveFacetColumn.prototype.bindDropdownContentEvents = function () {
        var _this = this;
        this.dropdown.dropdownContent.element.on('scroll', underscore_1.debounce(function () {
            underscore_1.each(_this.componentsInFacetColumn, function (component) {
                var facetSearch = component.facetSearch;
                if (facetSearch && facetSearch.currentlyDisplayedResults && !_this.isFacetSearchScrolledIntoView(facetSearch.search)) {
                    component.facetSearch.positionSearchResults(_this.dropdown.dropdownContent.element.el);
                }
                else if (facetSearch && component.facetSearch.currentlyDisplayedResults) {
                    component.facetSearch.positionSearchResults();
                }
            });
        }, ResponsiveFacetColumn.DEBOUNCE_SCROLL_WAIT));
    };
    ResponsiveFacetColumn.prototype.restoreFacetPreservePositionValue = function () {
        var _this = this;
        underscore_1.each(this.componentsInFacetColumn, function (component, index) {
            if (component.options) {
                component.options.preservePosition = _this.preservePositionOriginalValues[index];
            }
        });
    };
    ResponsiveFacetColumn.prototype.disableFacetPreservePosition = function () {
        underscore_1.each(this.componentsInFacetColumn, function (component) {
            if (component.options) {
                component.options.preservePosition = false;
            }
        });
    };
    ResponsiveFacetColumn.prototype.isFacetSearchScrolledIntoView = function (facetSearchElement) {
        var facetTop = facetSearchElement.getBoundingClientRect().top;
        var facetBottom = facetSearchElement.getBoundingClientRect().bottom;
        var dropdownTop = this.dropdown.dropdownContent.element.el.getBoundingClientRect().top;
        var dropdownBottom = this.dropdown.dropdownContent.element.el.getBoundingClientRect().bottom;
        dropdownTop = dropdownTop >= 0 ? dropdownTop : 0;
        return facetTop >= dropdownTop && facetBottom <= dropdownBottom;
    };
    ResponsiveFacetColumn.prototype.getDropdownHeaderLabel = function () {
        var dropdownHeaderLabel;
        ComponentsTypes_1.ComponentsTypes.getAllFacetsInstance(this.coveoRoot.find('.coveo-facet-column')).forEach(function (facet) {
            var options = facet.options;
            if (!dropdownHeaderLabel && options.dropdownHeaderLabel) {
                dropdownHeaderLabel = options.dropdownHeaderLabel;
            }
        });
        if (!dropdownHeaderLabel) {
            dropdownHeaderLabel = Strings_1.l(ResponsiveFacetColumn.DROPDOWN_HEADER_LABEL_DEFAULT_VALUE);
        }
        return dropdownHeaderLabel;
    };
    ResponsiveFacetColumn.prototype.handleNoResults = function () {
        this.dropdown.dropdownHeader.hide();
    };
    ResponsiveFacetColumn.prototype.handleQueryError = function () {
        this.dropdown.dropdownHeader.hide();
    };
    ResponsiveFacetColumn.prototype.handleQuerySuccess = function (data) {
        if (data.results.totalCount === 0) {
            this.dropdown.dropdownHeader.hide();
        }
        else {
            this.dropdown.dropdownHeader.show();
        }
    };
    ResponsiveFacetColumn.DEBOUNCE_SCROLL_WAIT = 250;
    ResponsiveFacetColumn.DROPDOWN_MIN_WIDTH = 280;
    ResponsiveFacetColumn.DROPDOWN_WIDTH_RATIO = 0.35; // Used to set the width relative to the coveo root.
    ResponsiveFacetColumn.DROPDOWN_HEADER_LABEL_DEFAULT_VALUE = 'Filters';
    return ResponsiveFacetColumn;
}());
exports.ResponsiveFacetColumn = ResponsiveFacetColumn;


/***/ }),

/***/ 336:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var Strings_1 = __webpack_require__(7);
var AnalyticsActionListMeta_1 = __webpack_require__(9);
__webpack_require__(374);
var SVGIcons_1 = __webpack_require__(13);
var SVGDom_1 = __webpack_require__(14);
var AccessibleButton_1 = __webpack_require__(17);
var FacetHeader = /** @class */ (function () {
    function FacetHeader(options) {
        this.options = options;
        this.element = document.createElement('div');
        Dom_1.$$(this.element).addClass('coveo-facet-header');
    }
    FacetHeader.prototype.build = function () {
        var titleSection = Dom_1.$$('div', {
            className: 'coveo-facet-header-title-section'
        });
        if (this.options.icon != undefined) {
            this.iconElement = this.buildIcon();
            titleSection.append(this.iconElement);
        }
        titleSection.append(this.buildTitle());
        this.waitElement = this.buildWaitAnimation();
        titleSection.append(this.waitElement);
        this.element.appendChild(titleSection.el);
        var settingsSection = Dom_1.$$('div', {
            className: 'coveo-facet-header-settings-section'
        });
        this.eraserElement = this.buildEraser();
        settingsSection.append(this.eraserElement);
        if (this.options.facet) {
            this.operatorElement = this.buildOperatorToggle();
            settingsSection.append(this.operatorElement);
            Dom_1.$$(this.operatorElement).toggle(this.options.facet.options.enableTogglingOperator);
        }
        if (this.options.settingsKlass) {
            this.sort = this.settings = new this.options.settingsKlass(this.options.availableSorts, this.options.facet);
            settingsSection.append(this.settings.build());
        }
        else if (this.options.sortKlass) {
            this.sort = new this.options.sortKlass(this.options.availableSorts, this.options.facet);
        }
        this.element.appendChild(settingsSection.el);
        return this.element;
    };
    FacetHeader.prototype.switchToAnd = function () {
        if (this.options.facet) {
            this.options.facet.options.useAnd = true;
            this.rebuildOperatorToggle();
            this.updateOperatorQueryStateModel();
        }
    };
    FacetHeader.prototype.switchToOr = function () {
        if (this.options.facet) {
            this.options.facet.options.useAnd = false;
            this.rebuildOperatorToggle();
            this.updateOperatorQueryStateModel();
        }
    };
    FacetHeader.prototype.collapseFacet = function () {
        if (this.collapseElement && this.expandElement) {
            Dom_1.$$(this.collapseElement).hide();
            Dom_1.$$(this.expandElement).show();
        }
        Dom_1.$$(this.options.facetElement).addClass('coveo-facet-collapsed');
    };
    FacetHeader.prototype.expandFacet = function () {
        if (this.collapseElement && this.expandElement) {
            Dom_1.$$(this.expandElement).hide();
            Dom_1.$$(this.collapseElement).show();
        }
        Dom_1.$$(this.options.facetElement).removeClass('coveo-facet-collapsed');
    };
    FacetHeader.prototype.updateOperatorQueryStateModel = function () {
        if (this.options.facet && this.options.facet.options.enableTogglingOperator) {
            var valueToSet = '';
            if (this.options.facet.getSelectedValues().length != 0 || this.options.facet.getExcludedValues().length != 0) {
                valueToSet = this.options.facet.options.useAnd ? 'and' : 'or';
            }
            this.options.facet.queryStateModel.set(this.options.facet.operatorAttributeId, valueToSet);
        }
    };
    FacetHeader.prototype.rebuildOperatorToggle = function () {
        var newElement = this.buildOperatorToggle();
        if (this.operatorElement) {
            Dom_1.$$(this.operatorElement).replaceWith(newElement);
        }
        this.operatorElement = newElement;
    };
    FacetHeader.prototype.buildIcon = function () {
        var cssClassForIcon;
        if (this.options.icon) {
            cssClassForIcon = 'coveo-icon-custom ' + this.options.icon;
        }
        else {
            cssClassForIcon = 'coveo-icon ' + this.options.field.substr(1);
        }
        this.iconElement = document.createElement('div');
        Dom_1.$$(this.iconElement).addClass(cssClassForIcon);
        return this.iconElement;
    };
    FacetHeader.prototype.buildWaitAnimation = function () {
        this.waitElement = Dom_1.$$('div', { className: 'coveo-facet-header-wait-animation' }, SVGIcons_1.SVGIcons.icons.loading).el;
        SVGDom_1.SVGDom.addClassToSVGInContainer(this.waitElement, 'coveo-facet-header-wait-animation-svg');
        this.waitElement.style.visibility = 'hidden';
        return this.waitElement;
    };
    FacetHeader.prototype.buildOperatorToggle = function () {
        var _this = this;
        var label = Strings_1.l('SwitchTo', this.options.facet.options.useAnd ? Strings_1.l('Or') : Strings_1.l('And'));
        var icon = Dom_1.$$('span', { className: 'coveo-' + (this.options.facet.options.useAnd ? 'and' : 'or') }, SVGIcons_1.SVGIcons.icons.orAnd);
        SVGDom_1.SVGDom.addClassToSVGInContainer(icon.el, 'coveo-or-and-svg');
        var toggle = Dom_1.$$('div', {
            className: 'coveo-facet-header-operator',
            title: label
        });
        toggle.append(icon.el);
        new AccessibleButton_1.AccessibleButton()
            .withElement(toggle)
            .withLabel(label)
            .withSelectAction(function () { return _this.handleOperatorClick(); })
            .build();
        return toggle.el;
    };
    FacetHeader.prototype.handleOperatorClick = function () {
        var _this = this;
        if (this.options.facet.options.useAnd) {
            this.options.facet.switchToOr();
        }
        else {
            this.options.facet.switchToAnd();
        }
        if (this.options.facet.getSelectedValues().length != 0) {
            var operatorNow_1 = this.options.facet.options.useAnd ? 'AND' : 'OR';
            var operatorBefore_1 = this.options.facet.options.useAnd ? 'OR' : 'AND';
            this.options.facet.triggerNewQuery(function () {
                return _this.options.facet.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.facetToggle, {
                    facetId: _this.options.facet.options.id,
                    facetField: _this.options.field.toString(),
                    facetOperatorBefore: operatorBefore_1,
                    facetOperatorAfter: operatorNow_1,
                    facetTitle: _this.options.title
                });
            });
        }
    };
    FacetHeader.prototype.buildTitle = function () {
        var title = Dom_1.$$('div', { className: 'coveo-facet-header-title' });
        title.text(this.options.title);
        title.setAttribute('role', 'heading');
        title.setAttribute('aria-level', '2');
        title.setAttribute('aria-label', Strings_1.l('FacetTitle', this.options.title) + ".");
        return title.el;
    };
    FacetHeader.prototype.buildEraser = function () {
        var _this = this;
        var eraser = Dom_1.$$('div', { className: 'coveo-facet-header-eraser' }, SVGIcons_1.SVGIcons.icons.mainClear);
        SVGDom_1.SVGDom.addClassToSVGInContainer(eraser.el, 'coveo-facet-header-eraser-svg');
        new AccessibleButton_1.AccessibleButton()
            .withElement(eraser.el)
            .withLabel(Strings_1.l('Clear', this.options.title))
            .withClickAction(function () { return _this.onEraserClick(); })
            .withEnterKeyboardAction(function () { return _this.onEraserClick(); })
            .build();
        return eraser.el;
    };
    FacetHeader.prototype.onEraserClick = function () {
        var cmp = this.options.facet || this.options.facetSlider;
        cmp.reset();
        cmp.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.facetClearAll, {
            facetId: cmp.options.id,
            facetField: cmp.options.field.toString(),
            facetTitle: cmp.options.title
        });
        cmp.queryController.executeQuery();
    };
    return FacetHeader;
}());
exports.FacetHeader = FacetHeader;


/***/ }),

/***/ 338:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/// <reference path="Facet.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(377);
var underscore_1 = __webpack_require__(0);
var Assert_1 = __webpack_require__(5);
var AccessibleButton_1 = __webpack_require__(17);
var Dom_1 = __webpack_require__(1);
var SVGDom_1 = __webpack_require__(14);
var SVGIcons_1 = __webpack_require__(13);
var AnalyticsActionListMeta_1 = __webpack_require__(9);
var Strings_1 = __webpack_require__(7);
var BreadcrumbValueElement = /** @class */ (function () {
    function BreadcrumbValueElement(facet, facetValue) {
        this.facet = facet;
        this.facetValue = facetValue;
    }
    BreadcrumbValueElement.prototype.build = function () {
        Assert_1.Assert.exists(this.facetValue);
        var _a = this.buildElements(), container = _a.container, caption = _a.caption, clear = _a.clear;
        container.append(caption.el);
        container.append(clear.el);
        return container;
    };
    BreadcrumbValueElement.prototype.getBreadcrumbTooltip = function () {
        var tooltipParts = [
            this.facet.getValueCaption(this.facetValue),
            this.facetValue.getFormattedCount(),
            this.facetValue.getFormattedComputedField(this.facet.options.computedFieldFormat)
        ];
        return underscore_1.compact(tooltipParts).join(' ');
    };
    BreadcrumbValueElement.prototype.buildElements = function () {
        return {
            container: this.buildContainer(),
            clear: this.buildClear(),
            caption: this.buildCaption()
        };
    };
    BreadcrumbValueElement.prototype.buildContainer = function () {
        var _this = this;
        var container = Dom_1.$$('div', {
            className: 'coveo-facet-breadcrumb-value'
        });
        container.toggleClass('coveo-selected', this.facetValue.selected);
        container.toggleClass('coveo-excluded', this.facetValue.excluded);
        var labelString = this.facetValue.excluded ? 'Unexclude' : 'RemoveFilterOn';
        var label = Strings_1.l(labelString, this.facet.getValueCaption(this.facetValue));
        new AccessibleButton_1.AccessibleButton()
            .withElement(container)
            .withLabel(label)
            .withSelectAction(function () { return _this.selectAction(); })
            .build();
        return container;
    };
    BreadcrumbValueElement.prototype.buildClear = function () {
        var clear = Dom_1.$$('span', {
            className: 'coveo-facet-breadcrumb-clear'
        }, SVGIcons_1.SVGIcons.icons.checkboxHookExclusionMore);
        SVGDom_1.SVGDom.addClassToSVGInContainer(clear.el, 'coveo-facet-breadcrumb-clear-svg');
        return clear;
    };
    BreadcrumbValueElement.prototype.buildCaption = function () {
        var caption = Dom_1.$$('span', {
            className: 'coveo-facet-breadcrumb-caption'
        });
        caption.text(this.facet.getValueCaption(this.facetValue));
        return caption;
    };
    BreadcrumbValueElement.prototype.selectAction = function () {
        var _this = this;
        if (this.facetValue.excluded) {
            this.facet.unexcludeValue(this.facetValue.value);
        }
        else {
            this.facet.deselectValue(this.facetValue.value);
        }
        this.facet.triggerNewQuery(function () {
            return _this.facet.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.breadcrumbFacet, {
                facetId: _this.facet.options.id,
                facetField: _this.facet.options.field.toString(),
                facetValue: _this.facetValue.value,
                facetTitle: _this.facet.options.title
            });
        });
    };
    return BreadcrumbValueElement;
}());
exports.BreadcrumbValueElement = BreadcrumbValueElement;


/***/ }),

/***/ 339:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Globalize = __webpack_require__(23);
var underscore_1 = __webpack_require__(0);
var Assert_1 = __webpack_require__(5);
var Strings_1 = __webpack_require__(7);
var Dom_1 = __webpack_require__(1);
var BreadcrumbValueList = /** @class */ (function () {
    function BreadcrumbValueList(facet, facetValues, breadcrumbValueElementKlass) {
        this.facet = facet;
        this.facetValues = facetValues;
        this.breadcrumbValueElementKlass = breadcrumbValueElementKlass;
        this.setExpandedAndCollapsed();
        this.elem = Dom_1.$$('div', {
            className: 'coveo-facet-breadcrumb'
        }).el;
        var title = Dom_1.$$('span');
        title.addClass('coveo-facet-breadcrumb-title');
        title.text(this.facet.options.title + ':');
        this.elem.appendChild(title.el);
        this.valueContainer = Dom_1.$$('span', {
            className: 'coveo-facet-breadcrumb-values'
        }).el;
        this.elem.appendChild(this.valueContainer);
    }
    BreadcrumbValueList.prototype.build = function () {
        this.buildExpanded();
        if (this.collapsed.length != 0) {
            this.buildCollapsed();
        }
        return this.elem;
    };
    BreadcrumbValueList.prototype.buildAsString = function () {
        this.build();
        if (this.elem) {
            return (this.facet.options.title + ": " +
                underscore_1.map(Dom_1.$$(this.elem).findAll('.coveo-facet-breadcrumb-value'), function (value) {
                    return Dom_1.$$(value).text();
                }).join(', '));
        }
        return '';
    };
    BreadcrumbValueList.prototype.buildExpanded = function () {
        var _this = this;
        underscore_1.each(this.expanded, function (value, index) {
            var elementBreadcrumb = new _this.breadcrumbValueElementKlass(_this.facet, value).build();
            _this.valueContainer.appendChild(elementBreadcrumb.el);
        });
    };
    BreadcrumbValueList.prototype.buildCollapsed = function () {
        var _this = this;
        var numberOfSelected = underscore_1.filter(this.collapsed, function (value) { return value.selected; }).length;
        var numberOfExcluded = underscore_1.filter(this.collapsed, function (value) { return value.excluded; }).length;
        Assert_1.Assert.check(numberOfSelected + numberOfExcluded == this.collapsed.length);
        var elem = Dom_1.$$('div', {
            className: 'coveo-facet-breadcrumb-value'
        });
        var multiCount = Dom_1.$$('span', {
            className: 'coveo-facet-breadcrumb-multi-count'
        });
        multiCount.text(Strings_1.l('NMore', Globalize.format(numberOfSelected + numberOfExcluded, 'n0')));
        elem.append(multiCount.el);
        var valueElements = underscore_1.map(this.collapsed, function (facetValue) {
            return new _this.breadcrumbValueElementKlass(_this.facet, facetValue);
        });
        var toolTips = underscore_1.map(valueElements, function (valueElement) {
            return valueElement.getBreadcrumbTooltip();
        });
        elem.el.setAttribute('title', toolTips.join('\n'));
        elem.on('click', function () {
            var elements = [];
            underscore_1.each(valueElements, function (valueElement) {
                elements.push(valueElement.build().el);
            });
            underscore_1.each(elements, function (el) {
                Dom_1.$$(el).insertBefore(elem.el);
            });
            elem.detach();
        });
        this.valueContainer.appendChild(elem.el);
    };
    BreadcrumbValueList.prototype.setExpandedAndCollapsed = function () {
        if (this.facetValues.length > this.facet.options.numberOfValuesInBreadcrumb) {
            this.collapsed = underscore_1.rest(this.facetValues, this.facet.options.numberOfValuesInBreadcrumb);
            this.expanded = underscore_1.first(this.facetValues, this.facet.options.numberOfValuesInBreadcrumb);
        }
        else {
            this.collapsed = [];
            this.expanded = this.facetValues;
        }
    };
    return BreadcrumbValueList;
}());
exports.BreadcrumbValueList = BreadcrumbValueList;


/***/ }),

/***/ 340:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/// <reference path="Facet.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var Facet_1 = __webpack_require__(51);
var Dom_1 = __webpack_require__(1);
var Utils_1 = __webpack_require__(4);
var InitializationEvents_1 = __webpack_require__(15);
var FacetSearchParameters_1 = __webpack_require__(128);
var AnalyticsActionListMeta_1 = __webpack_require__(9);
var Strings_1 = __webpack_require__(7);
var Assert_1 = __webpack_require__(5);
var FacetValues_1 = __webpack_require__(94);
var StringUtils_1 = __webpack_require__(19);
var FacetValueElement_1 = __webpack_require__(95);
var ExternalModulesShim_1 = __webpack_require__(24);
var SearchInterface_1 = __webpack_require__(18);
var ResponsiveComponentsUtils_1 = __webpack_require__(93);
var FacetValuesOrder_1 = __webpack_require__(158);
__webpack_require__(378);
var underscore_1 = __webpack_require__(0);
var FacetSearchElement_1 = __webpack_require__(329);
/**
 * Used by the {@link Facet} component to render and handle the facet search part of each facet.
 */
var FacetSearch = /** @class */ (function () {
    function FacetSearch(facet, facetSearchValuesListKlass, root) {
        var _this = this;
        this.facet = facet;
        this.facetSearchValuesListKlass = facetSearchValuesListKlass;
        this.root = root;
        this.moreValuesToFetch = true;
        this.lastSearchWasEmpty = true;
        this.facetSearchElement = new FacetSearchElement_1.FacetSearchElement(this);
        this.onResize = underscore_1.debounce(function () {
            // Mitigate issues in UT where the window in phantom js might get resized in the scope of another test.
            // These would point to random instance of a test karma object, and not a real search interface.
            if (_this.facet instanceof Facet_1.Facet && _this.facet.searchInterface instanceof SearchInterface_1.SearchInterface) {
                if (_this.shouldPositionSearchResults()) {
                    _this.positionSearchResults();
                }
            }
        }, 250);
        this.onDocumentClick = function (e) {
            _this.handleClickElsewhere(e);
        };
        window.addEventListener('resize', this.onResize);
        document.addEventListener('click', function (e) { return _this.onDocumentClick(e); });
        Dom_1.$$(facet.root).on(InitializationEvents_1.InitializationEvents.nuke, function () { return _this.handleNuke(); });
    }
    Object.defineProperty(FacetSearch.prototype, "facetType", {
        get: function () {
            return Facet_1.Facet.ID;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Build the search component and return an `HTMLElement` which can be appended to the {@link Facet}.
     * @returns {HTMLElement}
     */
    FacetSearch.prototype.build = function () {
        return this.buildBaseSearch();
    };
    /**
     * Position the search results at the footer of the facet.
     */
    FacetSearch.prototype.positionSearchResults = function (nextTo) {
        if (nextTo === void 0) { nextTo = this.search; }
        this.facetSearchElement.positionSearchResults(this.root, this.facet.element.clientWidth, nextTo);
    };
    FacetSearch.prototype.fetchMoreValues = function () {
        this.triggerNewFacetSearch(this.buildParamsForFetchingMore());
    };
    /**
     * Dismiss the search results
     */
    FacetSearch.prototype.dismissSearchResults = function () {
        this.cancelAnyPendingSearchOperation();
        this.facet.unfadeInactiveValuesInMainList();
        Dom_1.$$(this.searchResults).empty();
        this.moreValuesToFetch = true;
        Dom_1.$$(this.search).removeClass('coveo-facet-search-no-results');
        Dom_1.$$(this.facet.element).removeClass('coveo-facet-searching');
        this.facetSearchElement.hideSearchResultsElement();
        this.input.value = '';
        Dom_1.$$(this.clear).hide();
        this.currentlyDisplayedResults = undefined;
    };
    /**
     * Trigger a new facet search, and display the results.
     * @param params
     */
    FacetSearch.prototype.triggerNewFacetSearch = function (params) {
        var _this = this;
        this.cancelAnyPendingSearchOperation();
        this.facetSearchElement.showFacetSearchWaitingAnimation();
        this.facet.logger.info('Triggering new facet search');
        this.facetSearchPromise = this.facet.facetQueryController.search(params);
        if (this.facetSearchPromise) {
            this.facetSearchPromise
                .then(function (fieldValues) {
                _this.facet.usageAnalytics.logCustomEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.facetSearch, {
                    facetId: _this.facet.options.id,
                    facetField: _this.facet.options.field.toString(),
                    facetTitle: _this.facet.options.title
                }, _this.facet.root);
                _this.facet.logger.debug('Received field values', fieldValues);
                _this.processNewFacetSearchResults(fieldValues, params);
                _this.facetSearchElement.hideFacetSearchWaitingAnimation();
                _this.facetSearchPromise = undefined;
            })
                .catch(function (error) {
                // The request might be normally cancelled if another search is triggered.
                // In this case we do not hide the animation to prevent flicking.
                if (Utils_1.Utils.exists(error)) {
                    _this.facet.logger.error('Error while retrieving facet values', error);
                    _this.facetSearchElement.hideFacetSearchWaitingAnimation();
                }
                _this.facetSearchPromise = undefined;
                return null;
            });
        }
    };
    /**
     * Trigger the event associated with the focus of the search input.
     */
    FacetSearch.prototype.focus = function () {
        this.facetSearchElement.focus();
    };
    Object.defineProperty(FacetSearch.prototype, "searchResults", {
        get: function () {
            return this.facetSearchElement.searchResults;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FacetSearch.prototype, "searchBarIsAnimating", {
        get: function () {
            return this.facetSearchElement.searchBarIsAnimating;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FacetSearch.prototype, "search", {
        get: function () {
            return this.facetSearchElement.search;
        },
        enumerable: true,
        configurable: true
    });
    FacetSearch.prototype.keyboardEventDefaultHandler = function () {
        this.moreValuesToFetch = true;
        this.highlightCurrentQueryWithinSearchResults();
        if (!this.inputIsEmpty()) {
            this.lastSearchWasEmpty = false;
            this.displayNewValues(this.buildParamsForNormalSearch());
        }
        else if (!this.lastSearchWasEmpty) {
            // This normally happen if a user delete the search box content to go back to "empty" state.
            this.currentlyDisplayedResults = undefined;
            Dom_1.$$(this.searchResults).empty();
            this.lastSearchWasEmpty = true;
            this.displayNewValues(this.buildParamsForFetchingMore());
        }
    };
    FacetSearch.prototype.keyboardNavigationEnterPressed = function (event) {
        if (event.shiftKey) {
            this.triggerNewFacetSearch(this.buildParamsForNormalSearch());
        }
        else {
            if (this.searchResults.style.display != 'none') {
                this.performActionOnCurrentSearchResult();
                this.dismissSearchResults();
            }
            else if (Dom_1.$$(this.search).is('.coveo-facet-search-no-results')) {
                this.selectAllValuesMatchingSearch();
            }
        }
    };
    FacetSearch.prototype.keyboardNavigationDeletePressed = function (event) {
        if (event.shiftKey) {
            this.performExcludeActionOnCurrentSearchResult();
            this.dismissSearchResults();
            this.input.value = '';
        }
    };
    FacetSearch.prototype.displayNewValues = function (params) {
        var _this = this;
        if (params === void 0) { params = this.buildParamsForExcludingCurrentlyDisplayedValues(); }
        this.cancelAnyPendingSearchOperation();
        this.facetSearchTimeout = window.setTimeout(function () {
            _this.triggerNewFacetSearch(params);
        }, this.facet.options.facetSearchDelay);
    };
    FacetSearch.prototype.getCaptions = function () {
        return Dom_1.$$(this.searchResults).findAll('.coveo-facet-value-caption');
    };
    FacetSearch.prototype.getValueInInputForFacetSearch = function () {
        return this.facetSearchElement.getValueInInputForFacetSearch();
    };
    FacetSearch.prototype.updateAriaLive = function (text) {
        this.facet.searchInterface.ariaLive.updateText(text);
    };
    Object.defineProperty(FacetSearch.prototype, "input", {
        get: function () {
            return this.facetSearchElement.input;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FacetSearch.prototype, "clear", {
        get: function () {
            return this.facetSearchElement.clear;
        },
        enumerable: true,
        configurable: true
    });
    FacetSearch.prototype.shouldPositionSearchResults = function () {
        return !ResponsiveComponentsUtils_1.ResponsiveComponentsUtils.isSmallFacetActivated(Dom_1.$$(this.root)) && Dom_1.$$(this.facet.element).hasClass('coveo-facet-searching');
    };
    FacetSearch.prototype.buildBaseSearch = function () {
        var _this = this;
        this.facetSearchElement.build(function () { return _this.handleFacetSearchClear(); });
        Dom_1.$$(this.facetSearchElement.input).on('keyup', function () { return _this.showOrHideClearElement(); });
        return this.search;
    };
    FacetSearch.prototype.handleNuke = function () {
        window.removeEventListener('resize', this.onResize);
        document.removeEventListener('click', this.onDocumentClick);
    };
    FacetSearch.prototype.handleClickElsewhere = function (event) {
        if (this.currentlyDisplayedResults && this.search != event.target && this.searchResults != event.target && this.input != event.target) {
            this.dismissSearchResults();
        }
    };
    FacetSearch.prototype.handleFacetSearchClear = function () {
        this.input.value = '';
        Dom_1.$$(this.clear).hide();
        this.dismissSearchResults();
    };
    FacetSearch.prototype.showOrHideClearElement = function () {
        if (!this.inputIsEmpty()) {
            Dom_1.$$(this.clear).show();
        }
        else {
            Dom_1.$$(this.clear).hide();
            Dom_1.$$(this.search).removeClass('coveo-facet-search-no-results');
        }
    };
    FacetSearch.prototype.cancelAnyPendingSearchOperation = function () {
        if (Utils_1.Utils.exists(this.facetSearchTimeout)) {
            clearTimeout(this.facetSearchTimeout);
            this.facetSearchTimeout = undefined;
        }
        if (Utils_1.Utils.exists(this.facetSearchPromise)) {
            Promise.reject(this.facetSearchPromise).catch(function () { });
            this.facetSearchPromise = undefined;
        }
        this.facetSearchElement.hideFacetSearchWaitingAnimation();
    };
    FacetSearch.prototype.inputIsEmpty = function () {
        return this.input.value.trim() == '';
    };
    FacetSearch.prototype.processNewFacetSearchResults = function (fieldValues, facetSearchParameters) {
        Assert_1.Assert.exists(fieldValues);
        fieldValues = new FacetValuesOrder_1.FacetValuesOrder(this.facet, this.facet.facetSort).reorderValues(fieldValues);
        if (fieldValues.length > 0) {
            Dom_1.$$(this.search).removeClass('coveo-facet-search-no-results');
            this.facet.fadeInactiveValuesInMainList(this.facet.options.facetSearchDelay);
            this.rebuildSearchResults(fieldValues, facetSearchParameters);
            if (!facetSearchParameters.fetchMore) {
                this.showSearchResultsElement();
            }
            this.highlightCurrentQueryWithinSearchResults();
            this.makeFirstSearchResultTheCurrentOne();
        }
        else {
            if (facetSearchParameters.fetchMore) {
                this.moreValuesToFetch = false;
            }
            else {
                this.facetSearchElement.hideSearchResultsElement();
                Dom_1.$$(this.search).addClass('coveo-facet-search-no-results');
            }
        }
    };
    FacetSearch.prototype.rebuildSearchResults = function (fieldValues, facetSearchParameters) {
        var _this = this;
        Assert_1.Assert.exists(fieldValues);
        if (!facetSearchParameters.fetchMore) {
            Dom_1.$$(this.searchResults).empty();
        }
        var facetSearchHasQuery = Utils_1.Utils.isNonEmptyString(facetSearchParameters.valueToSearch);
        if (facetSearchHasQuery) {
            this.appendSelectAllResultsButton();
        }
        var facetValues = underscore_1.map(fieldValues, function (fieldValue) {
            return FacetValues_1.FacetValue.create(fieldValue);
        });
        underscore_1.each(new this.facetSearchValuesListKlass(this.facet, FacetValueElement_1.FacetValueElement).build(facetValues), function (listElement) {
            _this.facetSearchElement.appendToSearchResults(listElement);
        });
        if (this.currentlyDisplayedResults) {
            this.currentlyDisplayedResults = this.currentlyDisplayedResults.concat(underscore_1.pluck(facetValues, 'value'));
        }
        else {
            this.currentlyDisplayedResults = underscore_1.pluck(facetValues, 'value');
        }
        underscore_1.each(Dom_1.$$(this.searchResults).findAll('.coveo-facet-selectable'), function (elem, index) {
            Dom_1.$$(elem).setAttribute('id', "coveo-facet-search-" + _this.facet.options.id + "-suggestion-" + index);
            Dom_1.$$(elem).setAttribute('role', 'option');
            Dom_1.$$(elem).setAttribute('aria-selected', 'false');
            Dom_1.$$(elem).addClass('coveo-facet-search-selectable');
        });
    };
    FacetSearch.prototype.appendSelectAllResultsButton = function () {
        var _this = this;
        var selectAll = document.createElement('li');
        Dom_1.$$(selectAll).addClass(['coveo-facet-selectable', 'coveo-facet-search-selectable', 'coveo-facet-search-select-all']);
        Dom_1.$$(selectAll).text(Strings_1.l('SelectAll'));
        Dom_1.$$(selectAll).setAttribute('aria-hidden', 'true');
        Dom_1.$$(selectAll).on('click', function () { return _this.selectAllValuesMatchingSearch(); });
        this.facetSearchElement.appendToSearchResults(selectAll);
    };
    FacetSearch.prototype.buildParamsForNormalSearch = function () {
        var params = new FacetSearchParameters_1.FacetSearchParameters(this.facet);
        params.setValueToSearch(this.getValueInInputForFacetSearch());
        params.fetchMore = false;
        return params;
    };
    FacetSearch.prototype.buildParamsForFetchingMore = function () {
        var params = this.buildParamsForExcludingCurrentlyDisplayedValues();
        params.fetchMore = true;
        return params;
    };
    FacetSearch.prototype.buildParamsForExcludingCurrentlyDisplayedValues = function () {
        var params = new FacetSearchParameters_1.FacetSearchParameters(this.facet);
        params.excludeCurrentlyDisplayedValuesInSearch(this.searchResults);
        params.setValueToSearch(this.getValueInInputForFacetSearch());
        return params;
    };
    FacetSearch.prototype.showSearchResultsElement = function () {
        this.positionSearchResults();
    };
    FacetSearch.prototype.highlightCurrentQueryWithinSearchResults = function () {
        var search = this.getValueInInputForFacetSearch();
        var regex = new RegExp('(' + StringUtils_1.StringUtils.wildcardsToRegex(search, this.facet.options.facetSearchIgnoreAccents) + ')', 'ig');
        this.facetSearchElement.highlightCurrentQueryInSearchResults(regex);
    };
    FacetSearch.prototype.makeFirstSearchResultTheCurrentOne = function () {
        this.facetSearchElement.setAsCurrentResult(Dom_1.$$(this.getSelectables()[0]));
    };
    FacetSearch.prototype.getSelectables = function (target) {
        if (target === void 0) { target = this.searchResults; }
        return Dom_1.$$(target).findAll('.coveo-facet-selectable');
    };
    FacetSearch.prototype.performActionOnCurrentSearchResult = function () {
        var current = Dom_1.$$(this.searchResults).find('.coveo-facet-search-current-result');
        Assert_1.Assert.check(current != undefined);
        var shouldExclude = Dom_1.$$(current).hasClass('coveo-facet-value-will-exclude');
        if (shouldExclude) {
            var excludeIcon = Dom_1.$$(current).find('.coveo-facet-value-exclude');
            excludeIcon.click();
            return;
        }
        var checkbox = Dom_1.$$(current).find('input[type="checkbox"]');
        if (checkbox) {
            checkbox.checked = true;
            Dom_1.$$(checkbox).trigger('change');
        }
        else {
            current.click();
        }
    };
    FacetSearch.prototype.performExcludeActionOnCurrentSearchResult = function () {
        var current = Dom_1.$$(this.searchResults).find('.coveo-facet-search-current-result');
        Assert_1.Assert.check(current != null);
        var valueCaption = Dom_1.$$(current).find('.coveo-facet-value-caption');
        var valueElement = this.facet.facetValuesList.get(Dom_1.$$(valueCaption).text());
        valueElement.toggleExcludeWithUA();
    };
    FacetSearch.prototype.selectAllValuesMatchingSearch = function () {
        var _this = this;
        this.facet.showWaitingAnimation();
        var searchParameters = new FacetSearchParameters_1.FacetSearchParameters(this.facet);
        searchParameters.nbResults = 1000;
        searchParameters.setValueToSearch(this.getValueInInputForFacetSearch());
        this.facet.facetQueryController.search(searchParameters).then(function (fieldValues) {
            _this.dismissSearchResults();
            ExternalModulesShim_1.ModalBox.close(true);
            var facetValues = underscore_1.map(fieldValues, function (fieldValue) {
                var facetValue = _this.facet.values.get(fieldValue.value);
                if (!Utils_1.Utils.exists(facetValue)) {
                    facetValue = FacetValues_1.FacetValue.create(fieldValue);
                }
                facetValue.selected = true;
                facetValue.excluded = false;
                return facetValue;
            });
            _this.facet.processFacetSearchAllResultsSelected(facetValues);
        });
        this.dismissSearchResults();
    };
    return FacetSearch;
}());
exports.FacetSearch = FacetSearch;


/***/ }),

/***/ 341:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _ = __webpack_require__(0);
var FacetSearchValuesList = /** @class */ (function () {
    function FacetSearchValuesList(facet, facetValueElementKlass) {
        this.facet = facet;
        this.facetValueElementKlass = facetValueElementKlass;
    }
    FacetSearchValuesList.prototype.build = function (facetValues) {
        var _this = this;
        var valuesToBuildWith = _.map(facetValues, function (facetValue) {
            return (_.find(_this.facet.values.getAll(), function (valueAlreadyInFacet) {
                return valueAlreadyInFacet.value == facetValue.value;
            }) || facetValue);
        });
        return _.map(valuesToBuildWith, function (facetValue) {
            var valueElement = new _this.facetValueElementKlass(_this.facet, facetValue, _this.facet.keepDisplayedValuesNextTime).build();
            valueElement.renderer.excludeIcon.setAttribute('aria-hidden', 'true');
            valueElement.renderer.label.setAttribute('aria-hidden', 'true');
            return valueElement.renderer.listItem;
        });
    };
    return FacetSearchValuesList;
}());
exports.FacetSearchValuesList = FacetSearchValuesList;


/***/ }),

/***/ 342:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/// <reference path="Facet.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var FacetValueElement_1 = __webpack_require__(95);
var Dom_1 = __webpack_require__(1);
var FacetValues_1 = __webpack_require__(94);
var Utils_1 = __webpack_require__(4);
var FacetUtils_1 = __webpack_require__(47);
var FacetValuesOrder_1 = __webpack_require__(158);
var _ = __webpack_require__(0);
var FacetValuesList = /** @class */ (function () {
    function FacetValuesList(facet, facetValueElementKlass) {
        this.facet = facet;
        this.facetValueElementKlass = facetValueElementKlass;
        // Dictionary of values. The key is always in lowercase.
        this.valueList = {};
        this.currentlyDisplayed = [];
    }
    FacetValuesList.prototype.build = function () {
        this.valueContainer = document.createElement('ul');
        Dom_1.$$(this.valueContainer).addClass('coveo-facet-values');
        return this.valueContainer;
    };
    FacetValuesList.prototype.getAllCurrentlyDisplayed = function () {
        return this.currentlyDisplayed;
    };
    FacetValuesList.prototype.getAll = function () {
        return _.toArray(this.valueList);
    };
    FacetValuesList.prototype.getAllFacetValue = function () {
        return _.map(this.getAll(), function (v) {
            return v.facetValue;
        });
    };
    FacetValuesList.prototype.get = function (value) {
        var getter;
        if (value instanceof FacetValues_1.FacetValue) {
            getter = value.value;
        }
        else {
            value = Utils_1.Utils.anyTypeToString(value);
            getter = value;
        }
        this.ensureFacetValueIsInList(value);
        return this.valueList[getter.toLowerCase()];
    };
    FacetValuesList.prototype.select = function (value) {
        var valueElement = this.get(value);
        valueElement.select();
        return valueElement;
    };
    FacetValuesList.prototype.unselect = function (value) {
        var valueElement = this.get(value);
        valueElement.unselect();
        return valueElement;
    };
    FacetValuesList.prototype.exclude = function (value) {
        var valueElement = this.get(value);
        valueElement.exclude();
        return valueElement;
    };
    FacetValuesList.prototype.unExclude = function (value) {
        var valueElement = this.get(value);
        valueElement.unexclude();
        return valueElement;
    };
    FacetValuesList.prototype.toggleSelect = function (value) {
        var valueElement = this.get(value);
        if (valueElement.facetValue.selected) {
            valueElement.unselect();
        }
        else {
            valueElement.select();
        }
        return valueElement;
    };
    FacetValuesList.prototype.toggleExclude = function (value) {
        var valueElement = this.get(value);
        if (valueElement.facetValue.excluded) {
            valueElement.unexclude();
        }
        else {
            valueElement.exclude();
        }
        return valueElement;
    };
    FacetValuesList.prototype.rebuild = function (numberOfValues) {
        var _this = this;
        Dom_1.$$(this.valueContainer).empty();
        this.currentlyDisplayed = [];
        var allValues = this.getValuesToBuildWith();
        var toCompare = numberOfValues;
        var docFragment = document.createDocumentFragment();
        _.each(allValues, function (facetValue, index, list) {
            if (_this.facetValueShouldBeRemoved(facetValue)) {
                _this.facet.values.remove(facetValue.value);
                toCompare += 1;
            }
            else if (index < toCompare) {
                var valueElement = new _this.facetValueElementKlass(_this.facet, facetValue, true);
                _this.valueList[facetValue.value.toLowerCase()] = valueElement;
                var valueListElement = valueElement.build().renderer.listItem;
                docFragment.appendChild(valueListElement);
                _this.currentlyDisplayed.push(valueElement);
            }
        });
        this.valueContainer.appendChild(docFragment);
        FacetUtils_1.FacetUtils.addNoStateCssClassToFacetValues(this.facet, this.valueContainer);
    };
    FacetValuesList.prototype.getValuesToBuildWith = function () {
        if (this.facet.facetSort) {
            return new FacetValuesOrder_1.FacetValuesOrder(this.facet, this.facet.facetSort).reorderValues(this.facet.values.getAll());
        }
        else {
            return this.facet.values.getAll();
        }
    };
    FacetValuesList.prototype.facetValueShouldBeRemoved = function (facetValue) {
        return (facetValue.occurrences == 0 &&
            (facetValue.delta == 0 || facetValue.delta == undefined) &&
            !facetValue.selected &&
            !facetValue.excluded &&
            !this.facet.keepDisplayedValuesNextTime);
    };
    FacetValuesList.prototype.ensureFacetValueIsInList = function (value) {
        var facetValue;
        if (value instanceof FacetValues_1.FacetValue) {
            facetValue = this.facet.values.get(value.value);
            if (facetValue == null) {
                this.facet.values.add(value);
                facetValue = value;
            }
        }
        else {
            facetValue = this.facet.values.get(value);
            if (facetValue == null) {
                facetValue = FacetValues_1.FacetValue.createFromValue(value);
                this.facet.values.add(facetValue);
            }
        }
        var key = facetValue.value.toLowerCase();
        var found = this.valueList[key];
        if (found == undefined) {
            found = this.valueList[key] = new FacetValueElement_1.FacetValueElement(this.facet, facetValue, true);
            found.build();
        }
        else {
            found.facetValue = facetValue;
        }
    };
    return FacetValuesList;
}());
exports.FacetValuesList = FacetValuesList;


/***/ }),

/***/ 343:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/// <reference path="Facet.ts" />
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
var ValueElement_1 = __webpack_require__(327);
var OmniboxValueElement = /** @class */ (function (_super) {
    __extends(OmniboxValueElement, _super);
    function OmniboxValueElement(facet, facetValue, eventArg, onSelect, onExclude) {
        var _this = _super.call(this, facet, facetValue, onSelect, onExclude) || this;
        _this.facet = facet;
        _this.facetValue = facetValue;
        _this.eventArg = eventArg;
        return _this;
    }
    OmniboxValueElement.prototype.bindEvent = function () {
        _super.prototype.bindEvent.call(this, { displayNextTime: false, pinFacet: false, omniboxObject: this.eventArg });
    };
    return OmniboxValueElement;
}(ValueElement_1.ValueElement));
exports.OmniboxValueElement = OmniboxValueElement;


/***/ }),

/***/ 344:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="Facet.ts" />
var underscore_1 = __webpack_require__(0);
var Dom_1 = __webpack_require__(1);
var Utils_1 = __webpack_require__(4);
var FacetUtils_1 = __webpack_require__(47);
var OmniboxValuesList = /** @class */ (function () {
    function OmniboxValuesList(facet, facetValues, omniboxObject, omniboxValueElementKlass) {
        this.facet = facet;
        this.facetValues = facetValues;
        this.omniboxObject = omniboxObject;
        this.omniboxValueElementKlass = omniboxValueElementKlass;
    }
    OmniboxValuesList.prototype.build = function () {
        var _this = this;
        var rows = [];
        underscore_1.each(this.facetValues, function (facetValue) {
            rows.push(_this.buildOmniboxForOneRow(facetValue, _this.omniboxObject));
        });
        return this.buildFinalOmniboxElement(rows);
    };
    OmniboxValuesList.prototype.buildOmniboxForOneRow = function (facetValue, omniboxObject) {
        var _this = this;
        var selectCallback = function (elem, cause) { return _this.logAnalyticsEvent(elem, cause); };
        var excludeCallback = function (elem, cause) { return _this.logAnalyticsEvent(elem, cause); };
        var omniboxValueElement = new this.omniboxValueElementKlass(this.facet, facetValue, omniboxObject, selectCallback, excludeCallback);
        var omniboxRowContent = omniboxValueElement.build().renderer.listItem;
        var regex = omniboxObject.completeQueryExpression.regex;
        var valueToSearch = omniboxObject.completeQueryExpression.word;
        var caption = Dom_1.$$(omniboxRowContent).find('.coveo-facet-value-caption');
        caption.innerHTML = this.highlightOmniboxMatch(this.facet.getValueCaption(facetValue), regex, valueToSearch);
        var omniboxRow = Dom_1.$$('ul', {
            className: 'coveo-omnibox-selectable coveo-facet-value coveo-omnibox-facet-value'
        }).el;
        omniboxRow.appendChild(omniboxRowContent);
        Dom_1.$$(omniboxRow).on('keyboardSelect', function () {
            var input = Dom_1.$$(omniboxRowContent).find('input[type=checkbox]');
            Dom_1.$$(input).trigger('change');
        });
        omniboxRow['no-text-suggestion'] = true;
        return omniboxRow;
    };
    OmniboxValuesList.prototype.buildFinalOmniboxElement = function (rows) {
        var header = this.buildOmniboxHeader();
        if (Utils_1.Utils.isEmptyArray(rows)) {
            return undefined;
        }
        else {
            var ret_1 = Dom_1.$$('div', {
                className: 'coveo-omnibox-facet-value'
            }).el;
            ret_1.appendChild(header);
            underscore_1.each(rows, function (r) {
                ret_1.appendChild(r);
            });
            FacetUtils_1.FacetUtils.addNoStateCssClassToFacetValues(this.facet, ret_1);
            return ret_1;
        }
    };
    OmniboxValuesList.prototype.buildOmniboxHeader = function () {
        var title = this.facet.options.title;
        var header = Dom_1.$$('div', {
            className: 'coveo-omnibox-facet-header'
        }).el;
        Dom_1.$$(header).text(title);
        return header;
    };
    OmniboxValuesList.prototype.highlightOmniboxMatch = function (orignalStr, regex, valueToSearch) {
        var firstChar = orignalStr.search(regex);
        var lastChar = firstChar + valueToSearch.length;
        return (orignalStr.slice(0, firstChar) +
            '<span class="coveo-highlight">' +
            orignalStr.slice(firstChar, lastChar) +
            '</span>' +
            orignalStr.slice(lastChar));
    };
    OmniboxValuesList.prototype.logAnalyticsEvent = function (elem, cause) {
        var strippedFacetValues = underscore_1.pluck(this.facetValues, 'value');
        elem.facet.usageAnalytics.logSearchEvent(cause, {
            query: this.omniboxObject.completeQueryExpression.word,
            facetId: elem.facet.options.id,
            facetField: elem.facet.options.field.toString(),
            facetTitle: elem.facet.options.title,
            facetValue: elem.facetValue.value,
            suggestions: strippedFacetValues.join(';'),
            suggestionRanking: underscore_1.indexOf(strippedFacetValues, elem.facetValue.value)
        });
    };
    return OmniboxValuesList;
}());
exports.OmniboxValuesList = OmniboxValuesList;


/***/ }),

/***/ 371:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 373:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 374:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 375:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 376:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 377:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 378:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 379:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var KeyboardUtils_1 = __webpack_require__(30);
var FacetSearchUserInputHandler = /** @class */ (function () {
    function FacetSearchUserInputHandler(facetSearch) {
        this.facetSearch = facetSearch;
    }
    FacetSearchUserInputHandler.prototype.handleKeyboardEvent = function (event) {
        switch (event.which) {
            case KeyboardUtils_1.KEYBOARD.ENTER:
                this.facetSearch.keyboardNavigationEnterPressed(event);
                break;
            case KeyboardUtils_1.KEYBOARD.DELETE:
                this.facetSearch.keyboardNavigationDeletePressed && this.facetSearch.keyboardNavigationDeletePressed(event);
                break;
            case KeyboardUtils_1.KEYBOARD.ESCAPE:
                this.facetSearch.dismissSearchResults();
                break;
            case KeyboardUtils_1.KEYBOARD.DOWN_ARROW:
                this.facetSearch.facetSearchElement.moveCurrentResultDown();
                break;
            case KeyboardUtils_1.KEYBOARD.UP_ARROW:
                this.facetSearch.facetSearchElement.moveCurrentResultUp();
                break;
            default:
                this.facetSearch.keyboardEventDefaultHandler();
        }
    };
    FacetSearchUserInputHandler.prototype.handleFacetSearchResultsScroll = function () {
        if (this.facetSearch.facetSearchPromise ||
            this.facetSearch.facetSearchElement.getValueInInputForFacetSearch() != '' ||
            !this.facetSearch.moreValuesToFetch) {
            return;
        }
        var elementHeight = this.facetSearch.facetSearchElement.searchResults.clientHeight;
        var scrollHeight = this.facetSearch.facetSearchElement.searchResults.scrollHeight;
        var bottomPosition = this.facetSearch.facetSearchElement.searchResults.scrollTop + elementHeight;
        if (scrollHeight - bottomPosition < elementHeight / 2) {
            this.facetSearch.fetchMoreValues();
        }
    };
    return FacetSearchUserInputHandler;
}());
exports.FacetSearchUserInputHandler = FacetSearchUserInputHandler;


/***/ }),

/***/ 380:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var DefaultSearchDropdownNavigator_1 = __webpack_require__(330);
var FacetSearchDropdownNavigator_1 = __webpack_require__(381);
var CategoryFacet_1 = __webpack_require__(70);
var Facet_1 = __webpack_require__(51);
function SearchDropdownNavigatorFactory(facetSearch, config) {
    switch (facetSearch.facetType) {
        case Facet_1.Facet.ID:
            return new FacetSearchDropdownNavigator_1.FacetSearchDropdownNavigator(__assign({}, config, { facetSearch: facetSearch }));
        case CategoryFacet_1.CategoryFacet.ID:
        default:
            return new DefaultSearchDropdownNavigator_1.DefaultSearchDropdownNavigator(config);
    }
}
exports.SearchDropdownNavigatorFactory = SearchDropdownNavigatorFactory;


/***/ }),

/***/ 381:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DefaultSearchDropdownNavigator_1 = __webpack_require__(330);
var Dom_1 = __webpack_require__(1);
var underscore_1 = __webpack_require__(0);
var FacetSearchDropdownNavigator = /** @class */ (function () {
    function FacetSearchDropdownNavigator(config) {
        var _this = this;
        this.config = config;
        this.debounceAnnounceCurrentResultAction = underscore_1.debounce(function () { return _this.announceCurrentResultAction(); }, 500);
        this.defaultDropdownNavigator = new DefaultSearchDropdownNavigator_1.DefaultSearchDropdownNavigator(config);
    }
    FacetSearchDropdownNavigator.prototype.setAsCurrentResult = function (dom) {
        this.defaultDropdownNavigator.setAsCurrentResult(dom);
        this.debounceAnnounceCurrentResultAction();
    };
    Object.defineProperty(FacetSearchDropdownNavigator.prototype, "currentResult", {
        get: function () {
            return this.defaultDropdownNavigator.currentResult;
        },
        enumerable: true,
        configurable: true
    });
    FacetSearchDropdownNavigator.prototype.focusNextElement = function () {
        if (this.isCurrentResultSelectAllButton) {
            this.moveResultDownAndAnnounce();
        }
        else if (this.canExcludeCurrentResult) {
            this.toggleCanExcludeCurrentResult();
            this.moveResultDownAndAnnounce();
        }
        else {
            this.toggleCanExcludeCurrentResult();
            this.announceCurrentResultCanBeExcluded();
        }
    };
    FacetSearchDropdownNavigator.prototype.focusPreviousElement = function () {
        if (!this.canExcludeCurrentResult) {
            this.moveResultUpAndAnnounce();
        }
        else {
            this.toggleCanExcludeCurrentResult();
            this.announceCurrentResultCanBeSelected();
        }
    };
    FacetSearchDropdownNavigator.prototype.moveResultDownAndAnnounce = function () {
        this.defaultDropdownNavigator.moveCurrentResultDown();
        this.announceCurrentResultCanBeSelected();
    };
    FacetSearchDropdownNavigator.prototype.moveResultUpAndAnnounce = function () {
        this.defaultDropdownNavigator.moveCurrentResultUp();
        if (this.isCurrentResultSelectAllButton) {
            this.announceCurrentResultCanBeSelected();
        }
        else {
            this.toggleCanExcludeCurrentResult();
            this.announceCurrentResultCanBeExcluded();
        }
    };
    Object.defineProperty(FacetSearchDropdownNavigator.prototype, "isCurrentResultSelectAllButton", {
        get: function () {
            return this.currentResult.hasClass('coveo-facet-search-select-all');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FacetSearchDropdownNavigator.prototype, "canExcludeCurrentResult", {
        get: function () {
            return this.currentResult.hasClass('coveo-facet-value-will-exclude');
        },
        enumerable: true,
        configurable: true
    });
    FacetSearchDropdownNavigator.prototype.toggleCanExcludeCurrentResult = function () {
        this.currentResult.toggleClass('coveo-facet-value-will-exclude', !this.canExcludeCurrentResult);
    };
    FacetSearchDropdownNavigator.prototype.announceCurrentResultAction = function () {
        this.canExcludeCurrentResult ? this.announceCurrentResultCanBeExcluded() : this.announceCurrentResultCanBeSelected();
    };
    FacetSearchDropdownNavigator.prototype.announceCurrentResultCanBeExcluded = function () {
        var excludeIconTitle = Dom_1.$$(this.currentResult).find('.coveo-facet-value-exclude').title;
        this.config.facetSearch.updateAriaLive(excludeIconTitle);
    };
    FacetSearchDropdownNavigator.prototype.announceCurrentResultCanBeSelected = function () {
        var message = this.currentResultSelectMessage;
        this.config.facetSearch.updateAriaLive(message);
    };
    Object.defineProperty(FacetSearchDropdownNavigator.prototype, "currentResultSelectMessage", {
        get: function () {
            if (this.isCurrentResultSelectAllButton) {
                return this.currentResult.text();
            }
            var checkbox = this.currentResult.find('.coveo-facet-value-checkbox');
            return checkbox.getAttribute('aria-label');
        },
        enumerable: true,
        configurable: true
    });
    return FacetSearchDropdownNavigator;
}());
exports.FacetSearchDropdownNavigator = FacetSearchDropdownNavigator;


/***/ }),

/***/ 382:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var SVGIcons_1 = __webpack_require__(13);
var SVGDom_1 = __webpack_require__(14);
var underscore_1 = __webpack_require__(0);
var Strings_1 = __webpack_require__(7);
var CategoryFacetTemplates = /** @class */ (function () {
    function CategoryFacetTemplates() {
        this.listRoot = Dom_1.$$('ul', { className: 'coveo-category-facet-values' });
        this.collapseArrow = Dom_1.$$('span', { className: 'coveo-category-facet-collapse-children' }, SVGIcons_1.SVGIcons.icons.arrowDown);
        SVGDom_1.SVGDom.addClassToSVGInContainer(this.collapseArrow.el, 'coveo-category-facet-collapse-children-svg');
    }
    CategoryFacetTemplates.prototype.buildListRoot = function () {
        return this.listRoot.clone(true);
    };
    CategoryFacetTemplates.prototype.buildListElement = function (data) {
        var div = Dom_1.$$('div', {}, this.createListElement(data));
        return Dom_1.$$(div.el.firstChild);
    };
    CategoryFacetTemplates.prototype.buildAllCategoriesButton = function () {
        var allCategoriesCaption = Dom_1.$$('span', { className: 'coveo-category-facet-all-categories-caption', tabindex: 0 }, Strings_1.l('AllCategories'));
        var allCategories = Dom_1.$$('li', { className: 'coveo-category-facet-value coveo-category-facet-all-categories' }, this.buildCollapseArrow(), allCategoriesCaption);
        return allCategories;
    };
    CategoryFacetTemplates.prototype.buildEllipsis = function () {
        var ellipsisCaption = Dom_1.$$('span', { className: 'coveo-category-facet-ellipsis-caption' }, '[ ... ]');
        var ellipsis = Dom_1.$$('li', { className: 'coveo-category-facet-ellipsis' }, ellipsisCaption);
        return ellipsis;
    };
    CategoryFacetTemplates.prototype.buildCollapseArrow = function () {
        return this.collapseArrow.clone(true);
    };
    CategoryFacetTemplates.prototype.createListElement = function (data) {
        return "<li class=\"coveo-category-facet-value\">\n        <label class=\"coveo-category-facet-value-label\">\n          <span title=\"" + underscore_1.escape(data.value) + "\" class=\"coveo-category-facet-value-caption\">" + underscore_1.escape(data.value) + "</span>\n          <span class=\"coveo-category-facet-value-count\">" + data.count + "</span>\n        </label>\n      </li>";
    };
    return CategoryFacetTemplates;
}());
exports.CategoryFacetTemplates = CategoryFacetTemplates;


/***/ }),

/***/ 383:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CategoryValueChildrenRenderer_1 = __webpack_require__(331);
var CategoryValueRoot = /** @class */ (function () {
    function CategoryValueRoot(element, categoryFacetTemplates, categoryFacet) {
        this.element = element;
        this.path = [];
        this.categoryChildrenValueRenderer = new CategoryValueChildrenRenderer_1.CategoryChildrenValueRenderer(element, categoryFacetTemplates, this, categoryFacet);
        this.listRoot = categoryFacetTemplates.buildListRoot();
        this.appendListRoot();
    }
    CategoryValueRoot.prototype.renderChildren = function (values) {
        this.appendListRoot();
        this.categoryChildrenValueRenderer.renderChildren(values);
    };
    CategoryValueRoot.prototype.renderAsParent = function (value) {
        this.appendListRoot();
        return this.categoryChildrenValueRenderer.renderAsParent(value);
    };
    Object.defineProperty(CategoryValueRoot.prototype, "children", {
        get: function () {
            return this.categoryChildrenValueRenderer.children;
        },
        enumerable: true,
        configurable: true
    });
    CategoryValueRoot.prototype.clear = function () {
        this.listRoot.detach();
        this.listRoot.empty();
        this.categoryChildrenValueRenderer.clearChildren();
    };
    CategoryValueRoot.prototype.appendListRoot = function () {
        this.element.append(this.listRoot.el);
    };
    return CategoryValueRoot;
}());
exports.CategoryValueRoot = CategoryValueRoot;


/***/ }),

/***/ 384:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var CategoryValueChildrenRenderer_1 = __webpack_require__(331);
var AnalyticsActionListMeta_1 = __webpack_require__(9);
var AccessibleButton_1 = __webpack_require__(17);
var Strings_1 = __webpack_require__(7);
var CategoryValue = /** @class */ (function () {
    function CategoryValue(listRoot, categoryValueDescriptor, categoryFacetTemplates, categoryFacet) {
        this.listRoot = listRoot;
        this.categoryValueDescriptor = categoryValueDescriptor;
        this.categoryFacetTemplates = categoryFacetTemplates;
        this.categoryFacet = categoryFacet;
        this.isActive = false;
        this.element = this.categoryFacetTemplates.buildListElement({
            value: this.captionedValueDescriptorValue,
            count: this.categoryValueDescriptor.count
        });
        this.collapseArrow = this.categoryFacetTemplates.buildCollapseArrow();
        this.categoryChildrenValueRenderer = new CategoryValueChildrenRenderer_1.CategoryChildrenValueRenderer(this.element, categoryFacetTemplates, this, this.categoryFacet);
        this.path = this.categoryValueDescriptor.path;
    }
    CategoryValue.prototype.render = function (isChild) {
        if (this.pastMaximumDepth()) {
            this.element.addClass('coveo-category-facet-last-value');
        }
        if (isChild) {
            this.element.addClass('coveo-category-facet-child-value');
        }
        else {
            this.element.addClass('coveo-category-facet-parent-value');
        }
        this.listRoot.append(this.element.el);
    };
    CategoryValue.prototype.getDescriptor = function () {
        return {
            value: this.categoryValueDescriptor.value,
            count: this.categoryValueDescriptor.count,
            path: this.path
        };
    };
    CategoryValue.prototype.clear = function () {
        this.element.detach();
        this.categoryChildrenValueRenderer.clearChildren();
    };
    CategoryValue.prototype.renderChildren = function (values) {
        this.isActive = true;
        this.element.addClass('coveo-active-category-facet-parent');
        this.categoryChildrenValueRenderer.renderChildren(values);
    };
    CategoryValue.prototype.renderAsParent = function (value) {
        return this.categoryChildrenValueRenderer.renderAsParent(value);
    };
    Object.defineProperty(CategoryValue.prototype, "children", {
        get: function () {
            return this.categoryChildrenValueRenderer.children;
        },
        enumerable: true,
        configurable: true
    });
    CategoryValue.prototype.makeSelectable = function () {
        var _this = this;
        var element = Dom_1.$$(this.element.find('.coveo-category-facet-value-label'));
        element.addClass('coveo-selectable');
        var countLabel = Strings_1.l('ResultCount', this.categoryValueDescriptor.count.toString());
        var label = Strings_1.l('SelectValueWithResultCount', this.captionedValueDescriptorValue, countLabel);
        new AccessibleButton_1.AccessibleButton()
            .withElement(element)
            .withSelectAction(function () { return _this.onSelect(); })
            .withLabel(label)
            .build();
        return this;
    };
    CategoryValue.prototype.showCollapseArrow = function () {
        if (!this.collapseArrow.el.parentElement) {
            var label = this.element.find('label');
            Dom_1.$$(label).prepend(this.collapseArrow.el);
        }
        return this;
    };
    Object.defineProperty(CategoryValue.prototype, "captionedValueDescriptorValue", {
        get: function () {
            var value = this.categoryValueDescriptor.value;
            return this.categoryFacet.getCaption(value);
        },
        enumerable: true,
        configurable: true
    });
    CategoryValue.prototype.onSelect = function () {
        if (!this.pastMaximumDepth()) {
            this.categoryFacet.logAnalyticsEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.categoryFacetSelect, this.path);
            this.categoryFacet.changeActivePath(this.path);
            this.categoryFacet.executeQuery();
        }
    };
    CategoryValue.prototype.pastMaximumDepth = function () {
        return this.path.length - this.categoryFacet.options.basePath.length >= this.categoryFacet.options.maximumDepth;
    };
    return CategoryValue;
}());
exports.CategoryValue = CategoryValue;


/***/ }),

/***/ 385:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var AllowedValuesPatternType_1 = __webpack_require__(325);
var Utils_1 = __webpack_require__(4);
var CategoryFacetQueryController = /** @class */ (function () {
    function CategoryFacetQueryController(categoryFacet) {
        this.categoryFacet = categoryFacet;
    }
    CategoryFacetQueryController.prototype.putCategoryFacetInQueryBuilder = function (queryBuilder, path, maximumNumberOfValues) {
        var positionInQuery = queryBuilder.categoryFacets.length;
        this.addQueryFilter(queryBuilder, path);
        this.addCategoryFacetRequest(queryBuilder, path, maximumNumberOfValues);
        return positionInQuery;
    };
    CategoryFacetQueryController.prototype.searchFacetValues = function (value, numberOfValues) {
        return __awaiter(this, void 0, void 0, function () {
            var lastQuery, groupByRequest, results, sortByNumberOfResultsThenPathLength;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        lastQuery = __assign({}, this.categoryFacet.queryController.getLastQuery());
                        groupByRequest = {
                            allowedValues: [this.getAllowedValuesPattern(value)],
                            allowedValuesPatternType: AllowedValuesPatternType_1.AllowedValuesPatternType.Wildcards,
                            maximumNumberOfValues: numberOfValues,
                            field: this.categoryFacet.options.field,
                            sortCriteria: 'occurrences',
                            injectionDepth: this.categoryFacet.options.injectionDepth
                        };
                        lastQuery.groupBy = [groupByRequest];
                        lastQuery.categoryFacets.splice(this.categoryFacet.positionInQuery, 1);
                        return [4 /*yield*/, this.categoryFacet.queryController.getEndpoint().search(lastQuery)];
                    case 1:
                        results = _a.sent();
                        sortByNumberOfResultsThenPathLength = function (firstGroupByValue, secondGroupByValue) {
                            if (firstGroupByValue.numberOfResults == secondGroupByValue.numberOfResults) {
                                return firstGroupByValue.value.length - secondGroupByValue.value.length;
                            }
                            return secondGroupByValue.numberOfResults - firstGroupByValue.numberOfResults;
                        };
                        return [2 /*return*/, results.groupByResults[0].values.sort(sortByNumberOfResultsThenPathLength)];
                }
            });
        });
    };
    CategoryFacetQueryController.prototype.addDebugGroupBy = function (queryBuilder, value) {
        queryBuilder.groupByRequests.push({
            field: this.categoryFacet.options.field,
            allowedValues: [".*" + Utils_1.Utils.escapeRegexCharacter(value) + ".*"],
            allowedValuesPatternType: AllowedValuesPatternType_1.AllowedValuesPatternType.Regex
        });
    };
    CategoryFacetQueryController.prototype.shouldAddFilterToQuery = function (path) {
        return path.length != 0 && !Utils_1.Utils.arrayEqual(path, this.categoryFacet.options.basePath);
    };
    CategoryFacetQueryController.prototype.addQueryFilter = function (queryBuilder, path) {
        if (this.shouldAddFilterToQuery(path)) {
            queryBuilder.advancedExpression.addFieldExpression(this.categoryFacet.options.field, '==', [
                path.join(this.categoryFacet.options.delimitingCharacter)
            ]);
        }
    };
    CategoryFacetQueryController.prototype.addCategoryFacetRequest = function (queryBuilder, path, maximumNumberOfValues) {
        var categoryFacetsRequest = {
            field: this.categoryFacet.options.field,
            path: path,
            injectionDepth: this.categoryFacet.options.injectionDepth,
            maximumNumberOfValues: maximumNumberOfValues,
            delimitingCharacter: this.categoryFacet.options.delimitingCharacter
        };
        queryBuilder.categoryFacets.push(categoryFacetsRequest);
    };
    CategoryFacetQueryController.prototype.getAllowedValuesPattern = function (value) {
        var basePath = this.categoryFacet.options.basePath;
        var delimiter = this.categoryFacet.options.delimitingCharacter;
        if (Utils_1.Utils.isNonEmptyArray(basePath)) {
            return "" + basePath.join(delimiter) + delimiter + "*" + value + "*";
        }
        return "*" + value + "*";
    };
    return CategoryFacetQueryController;
}());
exports.CategoryFacetQueryController = CategoryFacetQueryController;


/***/ }),

/***/ 386:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 387:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var CategoryFacet_1 = __webpack_require__(70);
var FacetSearchElement_1 = __webpack_require__(329);
var underscore_1 = __webpack_require__(0);
var Dom_1 = __webpack_require__(1);
var SVGDom_1 = __webpack_require__(14);
var SVGIcons_1 = __webpack_require__(13);
var Strings_1 = __webpack_require__(7);
__webpack_require__(388);
var StringUtils_1 = __webpack_require__(19);
var AnalyticsActionListMeta_1 = __webpack_require__(9);
var AccessibleButton_1 = __webpack_require__(17);
var CategoryFacetSearch = /** @class */ (function () {
    function CategoryFacetSearch(categoryFacet) {
        var _this = this;
        this.categoryFacet = categoryFacet;
        this.moreValuesToFetch = true;
        this.facetSearchElement = new FacetSearchElement_1.FacetSearchElement(this);
        this.displayNewValues = underscore_1.debounce(this.getDisplayNewValuesFunction(), this.categoryFacet.options.facetSearchDelay);
        this.categoryFacet.root.addEventListener('click', function (e) { return _this.handleClickElsewhere(e); });
        this.numberOfValuesToFetch = this.categoryFacet.options.numberOfResultsInFacetSearch;
    }
    Object.defineProperty(CategoryFacetSearch.prototype, "facetType", {
        get: function () {
            return CategoryFacet_1.CategoryFacet.ID;
        },
        enumerable: true,
        configurable: true
    });
    CategoryFacetSearch.prototype.build = function () {
        var _this = this;
        this.container = Dom_1.$$('div', {
            className: 'coveo-category-facet-search-container',
            role: 'heading',
            'aria-level': 3
        });
        new AccessibleButton_1.AccessibleButton()
            .withElement(this.container)
            .withSelectAction(function () {
            Dom_1.$$(_this.categoryFacet.element).addClass('coveo-category-facet-searching');
            _this.focus();
        })
            .withLabel(Strings_1.l('Search'))
            .build();
        var search = this.facetSearchElement.build();
        var searchPlaceholder = this.buildfacetSearchPlaceholder();
        this.container.append(search);
        this.container.append(searchPlaceholder.el);
        return this.container;
    };
    CategoryFacetSearch.prototype.focus = function () {
        this.facetSearchElement.focus();
    };
    CategoryFacetSearch.prototype.clear = function () {
        this.dismissSearchResults();
        this.container && this.container.detach();
    };
    CategoryFacetSearch.prototype.dismissSearchResults = function () {
        this.removeNoResultsCssClasses();
        Dom_1.$$(this.categoryFacet.element).removeClass('coveo-category-facet-searching');
        Dom_1.$$(this.facetSearchElement.searchResults).empty();
        this.facetSearchElement.clearSearchInput();
        this.facetSearchElement.hideSearchResultsElement();
        this.currentlyDisplayedResults = null;
        this.numberOfValuesToFetch = this.categoryFacet.options.numberOfResultsInFacetSearch;
        this.moreValuesToFetch = true;
    };
    CategoryFacetSearch.prototype.keyboardEventDefaultHandler = function () {
        this.moreValuesToFetch = true;
        this.displayNewValues();
    };
    CategoryFacetSearch.prototype.keyboardNavigationEnterPressed = function () {
        this.selectCurrentResult();
    };
    CategoryFacetSearch.prototype.fetchMoreValues = function () {
        this.numberOfValuesToFetch += this.categoryFacet.options.numberOfResultsInFacetSearch;
        this.displayNewValues();
    };
    CategoryFacetSearch.prototype.getCaptions = function () {
        var searchResults = Dom_1.$$(this.facetSearchElement.searchResults);
        var captions = searchResults
            .findAll('.coveo-category-facet-search-value-caption')
            .concat(searchResults.findAll('.coveo-category-facet-search-path-parents'))
            .concat(searchResults.findAll('.coveo-category-facet-search-path-last-value'));
        return captions;
    };
    CategoryFacetSearch.prototype.updateAriaLive = function (text) {
        this.categoryFacet.searchInterface.ariaLive.updateText(text);
    };
    CategoryFacetSearch.prototype.selectCurrentResult = function () {
        if (this.facetSearchElement.currentResult) {
            var currentResultPathData = this.facetSearchElement.currentResult.el.dataset.path;
            var delimiter = this.categoryFacet.options.delimitingCharacter;
            var path = currentResultPathData.split(delimiter);
            this.categoryFacet.changeActivePath(path);
            this.categoryFacet.logAnalyticsEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.categoryFacetSelect, path);
            this.categoryFacet.executeQuery();
        }
    };
    CategoryFacetSearch.prototype.handleClickElsewhere = function (e) {
        var closestContainer = Dom_1.$$(e.target).closest('.coveo-category-facet-search-container');
        if (!closestContainer || closestContainer != this.container.el) {
            this.dismissSearchResults();
        }
    };
    CategoryFacetSearch.prototype.buildfacetSearchPlaceholder = function () {
        var placeholder = Dom_1.$$('div', { className: 'coveo-category-facet-search-placeholder' });
        var icon = Dom_1.$$('div', { className: 'coveo-category-facet-search-icon' }, SVGIcons_1.SVGIcons.icons.checkboxHookExclusionMore);
        SVGDom_1.SVGDom.addClassToSVGInContainer(icon.el, 'coveo-category-facet-search-icon-svg');
        var label = Dom_1.$$('span', { className: 'coveo-category-facet-search-label' }, Strings_1.l('Search'));
        placeholder.append(icon.el);
        placeholder.append(label.el);
        return placeholder;
    };
    CategoryFacetSearch.prototype.getDisplayNewValuesFunction = function () {
        var _this = this;
        return function () { return __awaiter(_this, void 0, void 0, function () {
            var categoryFacetValues;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.facetSearchElement.showFacetSearchWaitingAnimation();
                        this.categoryFacet.logger.info('Triggering new Category Facet search');
                        return [4 /*yield*/, this.categoryFacet.categoryFacetQueryController.searchFacetValues(this.facetSearchElement.input.value, this.numberOfValuesToFetch)];
                    case 1:
                        categoryFacetValues = _a.sent();
                        this.logAnalyticsEvent();
                        if (categoryFacetValues.length < this.numberOfValuesToFetch) {
                            this.moreValuesToFetch = false;
                        }
                        if (categoryFacetValues.length == 0) {
                            this.noFacetSearchResults();
                            return [2 /*return*/];
                        }
                        this.removeNoResultsCssClasses();
                        this.setFacetSearchResults(categoryFacetValues);
                        if (this.shouldPositionSearchResults) {
                            this.facetSearchElement.positionSearchResults(this.categoryFacet.root, this.categoryFacet.element.clientWidth, this.facetSearchElement.search);
                        }
                        this.facetSearchElement.hideFacetSearchWaitingAnimation();
                        return [2 /*return*/];
                }
            });
        }); };
    };
    CategoryFacetSearch.prototype.setFacetSearchResults = function (categoryFacetValues) {
        Dom_1.$$(this.facetSearchElement.searchResults).empty();
        this.currentlyDisplayedResults = underscore_1.pluck(categoryFacetValues, 'value');
        for (var i = 0; i < categoryFacetValues.length; i++) {
            var searchResult = this.buildFacetSearchValue(categoryFacetValues[i], i);
            if (i == 0) {
                this.facetSearchElement.setAsCurrentResult(searchResult);
            }
            this.facetSearchElement.appendToSearchResults(searchResult.el);
        }
        this.highlightCurrentQueryWithinSearchResults();
    };
    CategoryFacetSearch.prototype.buildFacetSearchValue = function (categoryFacetValue, index) {
        var _this = this;
        var path = categoryFacetValue.value.split(this.categoryFacet.options.delimitingCharacter);
        var pathParents = path.slice(0, -1).length != 0 ? path.slice(0, -1).join('/') + "/" : '';
        var value = Dom_1.$$('span', { className: 'coveo-category-facet-search-value-caption' }, underscore_1.last(path));
        var number = Dom_1.$$('span', { className: 'coveo-category-facet-search-value-number' }, categoryFacetValue.numberOfResults.toString(10));
        var pathParentsCaption = Dom_1.$$('span', { className: 'coveo-category-facet-search-path-parents' }, pathParents);
        var pathToValueCaption = Dom_1.$$('span', { className: 'coveo-category-facet-search-path' }, pathParentsCaption);
        var firstRow = Dom_1.$$('div', { className: 'coveo-category-facet-search-first-row' }, value, number);
        var secondRow = Dom_1.$$('div', { className: 'coveo-category-facet-search-second-row' }, pathToValueCaption);
        var item = Dom_1.$$('li', {
            id: "coveo-category-facet-search-suggestion-" + index,
            role: 'option',
            ariaSelected: 'false',
            className: 'coveo-category-facet-search-value',
            title: path
        }, firstRow, secondRow);
        item.el.dataset.path = categoryFacetValue.value;
        var countLabel = Strings_1.l('ResultCount', categoryFacetValue.numberOfResults.toString());
        var label = Strings_1.l('SelectValueWithResultCount', underscore_1.last(path), countLabel);
        new AccessibleButton_1.AccessibleButton()
            .withElement(item)
            .withSelectAction(function () {
            _this.categoryFacet.changeActivePath(path);
            _this.categoryFacet.logAnalyticsEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.categoryFacetSelect, path);
            _this.categoryFacet.executeQuery();
        })
            .withLabel(label)
            .build();
        return item;
    };
    CategoryFacetSearch.prototype.noFacetSearchResults = function () {
        this.facetSearchElement.hideFacetSearchWaitingAnimation();
        this.facetSearchElement.hideSearchResultsElement();
        Dom_1.$$(this.facetSearchElement.search).addClass('coveo-facet-search-no-results');
        Dom_1.$$(this.categoryFacet.element).addClass('coveo-no-results');
    };
    CategoryFacetSearch.prototype.removeNoResultsCssClasses = function () {
        this.facetSearchElement.search && Dom_1.$$(this.facetSearchElement.search).removeClass('coveo-facet-search-no-results');
        Dom_1.$$(this.categoryFacet.element).removeClass('coveo-no-results');
    };
    CategoryFacetSearch.prototype.highlightCurrentQueryWithinSearchResults = function () {
        var regex = new RegExp("(" + StringUtils_1.StringUtils.stringToRegex(this.facetSearchElement.input.value, true) + ")", 'ig');
        this.facetSearchElement.highlightCurrentQueryInSearchResults(regex);
    };
    CategoryFacetSearch.prototype.logAnalyticsEvent = function () {
        this.categoryFacet.usageAnalytics.logCustomEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.categoryFacetSearch, {
            categoryFacetId: this.categoryFacet.options.id,
            categoryFacetField: this.categoryFacet.options.field.toString(),
            categoryFacetTitle: this.categoryFacet.options.title
        }, this.categoryFacet.root);
    };
    Object.defineProperty(CategoryFacetSearch.prototype, "shouldPositionSearchResults", {
        get: function () {
            var searchResults = this.facetSearchElement.searchResults;
            return searchResults && !searchResults.parentElement;
        },
        enumerable: true,
        configurable: true
    });
    return CategoryFacetSearch;
}());
exports.CategoryFacetSearch = CategoryFacetSearch;


/***/ }),

/***/ 388:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 389:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var SVGDom_1 = __webpack_require__(14);
var SVGIcons_1 = __webpack_require__(13);
var AccessibleButton_1 = __webpack_require__(17);
var Strings_1 = __webpack_require__(7);
var underscore_1 = __webpack_require__(0);
var CategoryFacetBreadcrumb = /** @class */ (function () {
    function CategoryFacetBreadcrumb(categoryFacet, onClickHandler, categoryValueDescriptor) {
        this.categoryFacet = categoryFacet;
        this.onClickHandler = onClickHandler;
        this.categoryValueDescriptor = categoryValueDescriptor;
    }
    CategoryFacetBreadcrumb.prototype.build = function () {
        var _this = this;
        var clear = Dom_1.$$('span', {
            className: 'coveo-facet-breadcrumb-clear'
        }, SVGIcons_1.SVGIcons.icons.checkboxHookExclusionMore);
        SVGDom_1.SVGDom.addClassToSVGInContainer(clear.el, 'coveo-facet-breadcrumb-clear-svg');
        var pathToRender = underscore_1.without.apply(void 0, [this.categoryValueDescriptor.path].concat(this.categoryFacet.options.basePath));
        var captionLabel = pathToRender.map(function (pathPart) { return _this.categoryFacet.getCaption(pathPart); }).join('/');
        var breadcrumbTitle = Dom_1.$$('span', { className: 'coveo-category-facet-breadcrumb-title' }, this.categoryFacet.options.title + ": ");
        var valuesContainer = Dom_1.$$('span', { className: 'coveo-category-facet-breadcrumb-values' }, captionLabel, clear);
        new AccessibleButton_1.AccessibleButton()
            .withElement(valuesContainer)
            .withLabel(Strings_1.l('RemoveFilterOn', captionLabel))
            .withSelectAction(this.onClickHandler)
            .build();
        var breadcrumb = Dom_1.$$('span', { className: 'coveo-category-facet-breadcrumb' }, breadcrumbTitle, valuesContainer);
        return breadcrumb.el;
    };
    return CategoryFacetBreadcrumb;
}());
exports.CategoryFacetBreadcrumb = CategoryFacetBreadcrumb;


/***/ }),

/***/ 390:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CategoryFacet_1 = __webpack_require__(70);
var QueryEvents_1 = __webpack_require__(10);
var underscore_1 = __webpack_require__(0);
var Logger_1 = __webpack_require__(11);
var PathMap = /** @class */ (function () {
    function PathMap() {
    }
    return PathMap;
}());
var CategoryFacetDebug = /** @class */ (function () {
    function CategoryFacetDebug(categoryFacet) {
        var _this = this;
        this.categoryFacet = categoryFacet;
        this.categoryFacet.bind.onRootElement(QueryEvents_1.QueryEvents.buildingQuery, function (args) { return _this.handleBuildingQuery(args); });
        this.categoryFacet.bind.onRootElement(QueryEvents_1.QueryEvents.querySuccess, function (args) {
            _this.handleQuerySuccess(args);
        });
    }
    CategoryFacetDebug.prototype.handleBuildingQuery = function (args) {
        var firstPositionInQuery = args.queryBuilder.groupByRequests.length;
        if (this.categoryFacet.activePath.length == 0) {
            this.positionInQuery = { start: firstPositionInQuery, end: firstPositionInQuery + 1 };
            this.addGroupByForEmptyPath(args.queryBuilder);
        }
        else {
            var path = this.categoryFacet.activePath;
            this.positionInQuery = { start: firstPositionInQuery, end: firstPositionInQuery + path.length };
            this.addGroupByForEachPathElement(args.queryBuilder, path);
        }
    };
    CategoryFacetDebug.prototype.handleQuerySuccess = function (args) {
        var _this = this;
        args.results.groupByResults
            .slice(this.positionInQuery.start, this.positionInQuery.end)
            .forEach(function (groupByResult) { return CategoryFacetDebug.analyzeResults(groupByResult, _this.categoryFacet.options.delimitingCharacter); });
    };
    CategoryFacetDebug.prototype.addGroupByForEmptyPath = function (queryBuilder) {
        queryBuilder.groupByRequests.push({
            field: this.categoryFacet.options.field,
            injectionDepth: this.categoryFacet.options.injectionDepth
        });
    };
    CategoryFacetDebug.prototype.addGroupByForEachPathElement = function (queryBuilder, path) {
        var _this = this;
        path.forEach(function (pathElement) {
            _this.categoryFacet.categoryFacetQueryController.addDebugGroupBy(queryBuilder, pathElement);
        });
    };
    CategoryFacetDebug.analyzeResults = function (groupByResults, delimiter) {
        var _this = this;
        var treeRoot = new Map();
        var orphans = [];
        var paths = this.buildPathsFromGroupByValues(groupByResults.values, delimiter);
        paths = underscore_1.sortBy(paths, function (value) { return value.length; });
        paths.forEach(function (path) {
            if (path.length == 1) {
                _this.addFirstNodeToTree(treeRoot, path);
            }
            else {
                var pathIsValid = true;
                var parentsOnly = path.slice(0, -1);
                var currentNode = treeRoot;
                for (var _i = 0, parentsOnly_1 = parentsOnly; _i < parentsOnly_1.length; _i++) {
                    var parent_1 = parentsOnly_1[_i];
                    currentNode = currentNode.get(parent_1);
                    if (!currentNode) {
                        _this.processOrphan(orphans, path, delimiter);
                        pathIsValid = false;
                        break;
                    }
                }
                if (pathIsValid) {
                    _this.addValidNodeToTree(currentNode, path);
                }
            }
        });
        return orphans;
    };
    CategoryFacetDebug.buildPathsFromGroupByValues = function (values, delimiter) {
        return underscore_1.chain(values)
            .pluck('value')
            .map(function (value) { return value.split(delimiter); })
            .sortBy(function (value) { return value.length; })
            .value();
    };
    CategoryFacetDebug.addFirstNodeToTree = function (treeRoot, path) {
        treeRoot.set(path[0], new Map());
    };
    CategoryFacetDebug.addValidNodeToTree = function (node, path) {
        node.set(path.slice(-1)[0], new Map());
    };
    CategoryFacetDebug.processOrphan = function (orphans, path, delimiter) {
        var formattedOrphan = path.join(delimiter);
        orphans.push(formattedOrphan);
        this.logger.error("Value " + formattedOrphan + " has no parent.");
    };
    CategoryFacetDebug.logger = new Logger_1.Logger(CategoryFacet_1.CategoryFacet);
    return CategoryFacetDebug;
}());
exports.CategoryFacetDebug = CategoryFacetDebug;


/***/ }),

/***/ 391:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CategoryFacet_1 = __webpack_require__(70);
var Dom_1 = __webpack_require__(1);
var Strings_1 = __webpack_require__(7);
var SVGIcons_1 = __webpack_require__(13);
var SVGDom_1 = __webpack_require__(14);
var AccessibleButton_1 = __webpack_require__(17);
var CategoryFacetHeader = /** @class */ (function () {
    function CategoryFacetHeader(options) {
        this.options = options;
        this.element = document.createElement('div');
        Dom_1.$$(this.element).addClass('coveo-facet-header');
    }
    CategoryFacetHeader.prototype.build = function () {
        var waitElement = this.buildWaitAnimation();
        var titleSection = Dom_1.$$('div', {
            className: 'coveo-category-facet-title',
            role: 'heading',
            'aria-level': '2',
            'aria-label': Strings_1.l('FacetTitle', this.options.title) + "."
        }, this.options.title);
        this.element = Dom_1.$$('div', { className: 'coveo-category-facet-header' }, titleSection).el;
        Dom_1.$$(this.element).append(waitElement);
        var eraserElement = this.buildEraser();
        Dom_1.$$(this.element).append(eraserElement);
        return this.element;
    };
    CategoryFacetHeader.prototype.buildWaitAnimation = function () {
        var waitElement = Dom_1.$$('div', { className: CategoryFacet_1.CategoryFacet.WAIT_ELEMENT_CLASS }, SVGIcons_1.SVGIcons.icons.loading).el;
        SVGDom_1.SVGDom.addClassToSVGInContainer(waitElement, 'coveo-category-facet-header-wait-animation-svg');
        waitElement.style.visibility = 'hidden';
        return waitElement;
    };
    CategoryFacetHeader.prototype.buildEraser = function () {
        var _this = this;
        var eraserElement = Dom_1.$$('div', { className: 'coveo-category-facet-header-eraser coveo-facet-header-eraser' }, SVGIcons_1.SVGIcons.icons.mainClear)
            .el;
        SVGDom_1.SVGDom.addClassToSVGInContainer(eraserElement, 'coveo-facet-header-eraser-svg');
        var onClearClick = function () {
            _this.options.categoryFacet.reset();
        };
        new AccessibleButton_1.AccessibleButton()
            .withElement(eraserElement)
            .withLabel(Strings_1.l('Clear', this.options.title))
            .withClickAction(onClearClick)
            .withEnterKeyboardAction(onClearClick)
            .build();
        return eraserElement;
    };
    return CategoryFacetHeader;
}());
exports.CategoryFacetHeader = CategoryFacetHeader;


/***/ }),

/***/ 392:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 393:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Utils_1 = __webpack_require__(4);
var Model_1 = __webpack_require__(16);
var QueryStateModel_1 = __webpack_require__(12);
var Dom_1 = __webpack_require__(1);
var DependentFacetManager = /** @class */ (function () {
    function DependentFacetManager(facet) {
        this.facet = facet;
    }
    DependentFacetManager.prototype.listenToParentIfDependentFacet = function () {
        var _this = this;
        if (!this.isDependentFacet) {
            return;
        }
        this.facet.bind.onQueryState(Model_1.MODEL_EVENTS.CHANGE, undefined, function () { return _this.resetIfParentFacetHasNoSelectedValues(); });
    };
    DependentFacetManager.prototype.updateVisibilityBasedOnDependsOn = function () {
        if (this.isDependentFacet) {
            Dom_1.$$(this.facet.element).toggleClass('coveo-facet-dependent', !this.parentFacetHasSelectedValues);
        }
    };
    Object.defineProperty(DependentFacetManager.prototype, "isDependentFacet", {
        get: function () {
            return Utils_1.Utils.isNonEmptyString(this.facetDependsOnField);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DependentFacetManager.prototype, "facetDependsOnField", {
        get: function () {
            return this.facet.options.dependsOn;
        },
        enumerable: true,
        configurable: true
    });
    DependentFacetManager.prototype.resetIfParentFacetHasNoSelectedValues = function () {
        if (this.parentFacetHasSelectedValues) {
            return;
        }
        this.facet.reset();
    };
    Object.defineProperty(DependentFacetManager.prototype, "parentFacetHasSelectedValues", {
        get: function () {
            var parentSelectedValuesId = QueryStateModel_1.QueryStateModel.getFacetId(this.facetDependsOnField);
            return this.valuesExistForFacetWithId(parentSelectedValuesId);
        },
        enumerable: true,
        configurable: true
    });
    DependentFacetManager.prototype.valuesExistForFacetWithId = function (id) {
        var values = this.facet.queryStateModel.get(id);
        return values != null && values.length != 0;
    };
    return DependentFacetManager;
}());
exports.DependentFacetManager = DependentFacetManager;


/***/ }),

/***/ 447:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/// <reference path="HierarchicalFacet.ts" />
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
var FacetValuesList_1 = __webpack_require__(342);
var _ = __webpack_require__(0);
var HierarchicalFacetValuesList = /** @class */ (function (_super) {
    __extends(HierarchicalFacetValuesList, _super);
    function HierarchicalFacetValuesList(facet, facetValueElementKlass) {
        var _this = _super.call(this, facet, facetValueElementKlass) || this;
        _this.facet = facet;
        _this.facetValueElementKlass = facetValueElementKlass;
        return _this;
    }
    HierarchicalFacetValuesList.prototype.sortFacetValues = function (hierarchyFacetValues) {
        var _this = this;
        if (hierarchyFacetValues === void 0) { hierarchyFacetValues = this.hierarchyFacetValues; }
        if (!this.facet.shouldReshuffleFacetValuesClientSide) {
            var sortArray = _.map(hierarchyFacetValues, function (hierarchy, idx) {
                return {
                    hierarchy: hierarchy,
                    idx: idx
                };
            });
            // If we exclude the top level, the alpha order is not respected (since it is done by the index, and the first level is omitted by client side code).
            // Do the ordering client side, in the precise case where its alpha ordering and the starting level is not 0;
            if (this.facet.options.levelStart != 0 &&
                this.facet.options.sortCriteria &&
                this.facet.options.sortCriteria.toLowerCase().indexOf('alpha') != -1) {
                var reversed_1 = this.facet.options.sortCriteria.toLowerCase().indexOf('descending') != -1;
                sortArray = sortArray.sort(function (first, second) {
                    var firstInTopLevel = _.find(_this.facet.topLevelHierarchy, function (hierarchy) {
                        return hierarchy.facetValue.value.toLowerCase() == first.hierarchy.value.toLowerCase();
                    }) != null;
                    var secondInTopLevel = _.find(_this.facet.topLevelHierarchy, function (hierarchy) {
                        return hierarchy.facetValue.value.toLowerCase() == first.hierarchy.value.toLowerCase();
                    }) != null;
                    if (firstInTopLevel && secondInTopLevel) {
                        var firstValue = _this.facet.getValueCaption(first.hierarchy);
                        var secondValue = _this.facet.getValueCaption(second.hierarchy);
                        var compared = firstValue.localeCompare(secondValue);
                        return reversed_1 ? -1 * compared : compared;
                    }
                    return first.idx - second.idx;
                });
            }
            // Normally facet values are sorted by selected first, then inactive, then excluded values.
            // For hierarchical, we want selected first, then those that have childs selected, then normal sorting.
            sortArray = sortArray.sort(function (first, second) {
                if (first.hierarchy.selected === second.hierarchy.selected) {
                    var firstFromHierarchy = _this.facet.getValueFromHierarchy(first.hierarchy);
                    var secondFromHierarchy = _this.facet.getValueFromHierarchy(second.hierarchy);
                    if (firstFromHierarchy.hasChildSelected === secondFromHierarchy.hasChildSelected) {
                        return first.idx - second.idx;
                    }
                    else {
                        return firstFromHierarchy.hasChildSelected ? -1 : 1;
                    }
                }
                else {
                    return first.hierarchy.selected ? -1 : 1;
                }
            });
            return _.pluck(sortArray, 'hierarchy');
        }
        return hierarchyFacetValues;
    };
    HierarchicalFacetValuesList.prototype.getValuesToBuildWith = function () {
        if (this.facet.shouldReshuffleFacetValuesClientSide) {
            return this.hierarchyFacetValues;
        }
        else {
            return this.sortFacetValues();
        }
    };
    return HierarchicalFacetValuesList;
}(FacetValuesList_1.FacetValuesList));
exports.HierarchicalFacetValuesList = HierarchicalFacetValuesList;


/***/ }),

/***/ 448:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/// <reference path="../ui/HierarchicalFacet/HierarchicalFacet.ts" />
/// <reference path="./FacetQueryController.ts" />
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
var FacetQueryController_1 = __webpack_require__(165);
var FacetUtils_1 = __webpack_require__(47);
var _ = __webpack_require__(0);
var HierarchicalFacetQueryController = /** @class */ (function (_super) {
    __extends(HierarchicalFacetQueryController, _super);
    function HierarchicalFacetQueryController(facet) {
        var _this = _super.call(this, facet) || this;
        _this.facet = facet;
        return _this;
    }
    HierarchicalFacetQueryController.prototype.search = function (params, oldLength) {
        var _this = this;
        if (oldLength === void 0) { oldLength = params.nbResults; }
        // Do a client side search, since HierarchicalFacet should normally have all value client side
        var regex = FacetUtils_1.FacetUtils.getRegexToUseForFacetSearch(this.facet.facetSearch.getValueInInputForFacetSearch(), this.facet.options.facetSearchIgnoreAccents);
        return new Promise(function (resolve) {
            var match = _.chain(_this.facet.getAllValueHierarchy())
                .toArray()
                .filter(function (v) {
                return (_this.facet.getValueCaption(v.facetValue).match(regex) != null &&
                    !_.contains(_.map(params.alwaysExclude, function (toExclude) { return toExclude.toLowerCase(); }), v.facetValue.value.toLowerCase()));
            })
                .first(_this.facet.options.numberOfValuesInFacetSearch)
                .value();
            var facetValues = _.map(match, function (v) {
                return v.facetValue;
            });
            resolve(facetValues);
        });
    };
    HierarchicalFacetQueryController.prototype.getAllowedValuesFromSelected = function () {
        return [];
    };
    return HierarchicalFacetQueryController;
}(FacetQueryController_1.FacetQueryController));
exports.HierarchicalFacetQueryController = HierarchicalFacetQueryController;


/***/ }),

/***/ 449:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/// <reference path="../Facet/Facet.ts" />
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
var FacetSearchValuesList_1 = __webpack_require__(341);
var HierarchicalFacetSearchValueElement_1 = __webpack_require__(450);
var HierarchicalFacetSearchValuesList = /** @class */ (function (_super) {
    __extends(HierarchicalFacetSearchValuesList, _super);
    function HierarchicalFacetSearchValuesList(facet) {
        var _this = _super.call(this, facet, HierarchicalFacetSearchValueElement_1.HierarchicalFacetSearchValueElement) || this;
        _this.facet = facet;
        return _this;
    }
    return HierarchicalFacetSearchValuesList;
}(FacetSearchValuesList_1.FacetSearchValuesList));
exports.HierarchicalFacetSearchValuesList = HierarchicalFacetSearchValuesList;


/***/ }),

/***/ 450:
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
var FacetValueElement_1 = __webpack_require__(95);
var HierarchicalFacetSearchValueElement = /** @class */ (function (_super) {
    __extends(HierarchicalFacetSearchValueElement, _super);
    function HierarchicalFacetSearchValueElement(facet, facetValue, keepDisplayedValueNextTime) {
        var _this = _super.call(this, facet, facetValue, keepDisplayedValueNextTime) || this;
        _this.facet = facet;
        _this.facetValue = facetValue;
        _this.keepDisplayedValueNextTime = keepDisplayedValueNextTime;
        return _this;
    }
    HierarchicalFacetSearchValueElement.prototype._handleSelectValue = function (eventBindings) {
        this.facet.open(this.facetValue);
        _super.prototype.handleSelectValue.call(this, eventBindings);
    };
    HierarchicalFacetSearchValueElement.prototype._handleExcludeClick = function (eventBindings) {
        this.facet.open(this.facetValue);
        _super.prototype.handleExcludeClick.call(this, eventBindings);
    };
    return HierarchicalFacetSearchValueElement;
}(FacetValueElement_1.FacetValueElement));
exports.HierarchicalFacetSearchValueElement = HierarchicalFacetSearchValueElement;


/***/ }),

/***/ 451:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/// <reference path="HierarchicalFacet.ts" />
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
var FacetSearch_1 = __webpack_require__(340);
var FacetSearchParameters_1 = __webpack_require__(128);
var FacetValues_1 = __webpack_require__(94);
var Utils_1 = __webpack_require__(4);
var ExternalModulesShim_1 = __webpack_require__(24);
var _ = __webpack_require__(0);
var HierarchicalFacetSearch = /** @class */ (function (_super) {
    __extends(HierarchicalFacetSearch, _super);
    function HierarchicalFacetSearch(facet, facetSearchValuesListKlass, root) {
        var _this = _super.call(this, facet, facetSearchValuesListKlass, root) || this;
        _this.facet = facet;
        _this.facetSearchValuesListKlass = facetSearchValuesListKlass;
        return _this;
    }
    HierarchicalFacetSearch.prototype.buildParamsForExcludingCurrentlyDisplayedValues = function () {
        var params = _super.prototype.buildParamsForExcludingCurrentlyDisplayedValues.call(this);
        params.alwaysExclude = this.facet.getDisplayedValues();
        if (this.facet.facetSearch.currentlyDisplayedResults) {
            params.alwaysExclude = params.alwaysExclude.concat(this.facet.facetSearch.currentlyDisplayedResults);
        }
        return params;
    };
    HierarchicalFacetSearch.prototype.selectAllValuesMatchingSearch = function () {
        var _this = this;
        this.facet.showWaitingAnimation();
        var searchParameters = new FacetSearchParameters_1.FacetSearchParameters(this.facet);
        searchParameters.nbResults = this.facet.numberOfValues;
        searchParameters.alwaysInclude = this.facet.getDisplayedValues();
        searchParameters.setValueToSearch(this.getValueInInputForFacetSearch());
        this.facet.facetQueryController.search(searchParameters).then(function (fieldValues) {
            _this.dismissSearchResults();
            ExternalModulesShim_1.ModalBox.close(true);
            var facetValues = _this.getFacetValues(fieldValues);
            _this.facet.processFacetSearchAllResultsSelected(facetValues);
        });
        this.dismissSearchResults();
    };
    HierarchicalFacetSearch.prototype.getFacetValues = function (fieldValues) {
        var _this = this;
        var values = [];
        _.each(fieldValues, function (fieldValue) {
            var hierarchy = _this.facet.getValueFromHierarchy(fieldValue.value);
            values.push(_this.createFacetValuesFromHierarchy(hierarchy));
        });
        return _.flatten(values);
    };
    HierarchicalFacetSearch.prototype.createFacetValuesFromHierarchy = function (hierarchy) {
        var _this = this;
        var values = [];
        var fieldValue = hierarchy.facetValue.value;
        var facetValue = this.facet.values.get(fieldValue);
        if (!Utils_1.Utils.exists(facetValue)) {
            facetValue = FacetValues_1.FacetValue.create(fieldValue);
        }
        facetValue.selected = true;
        facetValue.excluded = false;
        values.push(facetValue);
        var childs = hierarchy.childs;
        _.each(childs, function (child) {
            var childHierarchy = _this.facet.getValueFromHierarchy(child.facetValue.value);
            values.push(_this.createFacetValuesFromHierarchy(childHierarchy));
        });
        return values;
    };
    return HierarchicalFacetSearch;
}(FacetSearch_1.FacetSearch));
exports.HierarchicalFacetSearch = HierarchicalFacetSearch;


/***/ }),

/***/ 452:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/// <reference path="HierarchicalFacet.ts" />
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
var BreadcrumbValuesList_1 = __webpack_require__(339);
var HierarchicalBreadcrumbValueElement_1 = __webpack_require__(453);
var Dom_1 = __webpack_require__(1);
var _ = __webpack_require__(0);
var HierarchicalBreadcrumbValuesList = /** @class */ (function (_super) {
    __extends(HierarchicalBreadcrumbValuesList, _super);
    function HierarchicalBreadcrumbValuesList(facet, facetValues, valueHierarchy) {
        var _this = _super.call(this, facet, facetValues, HierarchicalBreadcrumbValueElement_1.HierarchicalBreadcrumbValueElement) || this;
        _this.facet = facet;
        _this.facetValues = facetValues;
        _this.valueHierarchy = valueHierarchy;
        return _this;
    }
    HierarchicalBreadcrumbValuesList.prototype.buildAsString = function () {
        this.build();
        if (this.elem) {
            var joined = this.facet.options.title + ": " +
                _.map(Dom_1.$$(this.elem).findAll('.coveo-facet-breadcrumb-value'), function (value) {
                    _.each(Dom_1.$$(value).findAll('.coveo-hierarchical-breadcrumb-separator'), function (separator) {
                        // small right black triangle
                        Dom_1.$$(separator).text('\u25B8');
                    });
                    return Dom_1.$$(value).text();
                }).join(', ');
            return joined;
        }
        return '';
    };
    return HierarchicalBreadcrumbValuesList;
}(BreadcrumbValuesList_1.BreadcrumbValueList));
exports.HierarchicalBreadcrumbValuesList = HierarchicalBreadcrumbValuesList;


/***/ }),

/***/ 453:
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
var BreadcrumbValueElement_1 = __webpack_require__(338);
var _ = __webpack_require__(0);
var HierarchicalBreadcrumbValueElement = /** @class */ (function (_super) {
    __extends(HierarchicalBreadcrumbValueElement, _super);
    function HierarchicalBreadcrumbValueElement(facet, facetValue) {
        var _this = _super.call(this, facet, facetValue) || this;
        _this.facet = facet;
        _this.facetValue = facetValue;
        return _this;
    }
    HierarchicalBreadcrumbValueElement.prototype.build = function () {
        var build = _super.prototype.build.call(this);
        build.addClass('coveo-hierarchical-facet-value');
        var caption = build.find('.coveo-facet-breadcrumb-caption');
        var values = this.facetValue.value.split(this.facet.options.delimitingCharacter);
        values = _.map(values, function (v) {
            return _.escape(v);
        });
        caption.innerHTML = values.join("<span class='coveo-hierarchical-breadcrumb-separator'></span>");
        return build;
    };
    return HierarchicalBreadcrumbValueElement;
}(BreadcrumbValueElement_1.BreadcrumbValueElement));
exports.HierarchicalBreadcrumbValueElement = HierarchicalBreadcrumbValueElement;


/***/ }),

/***/ 454:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/// <reference path="../HierarchicalFacet/HierarchicalFacet.ts" />
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
var OmniboxValuesList_1 = __webpack_require__(344);
var OmniboxHierarchicalValueElement_1 = __webpack_require__(455);
var OmniboxHierarchicalValuesList = /** @class */ (function (_super) {
    __extends(OmniboxHierarchicalValuesList, _super);
    function OmniboxHierarchicalValuesList(facet, facetValues, omniboxObject) {
        var _this = _super.call(this, facet, facetValues, omniboxObject, OmniboxHierarchicalValueElement_1.OmniboxHierarchicalValueElement) || this;
        _this.facet = facet;
        _this.facetValues = facetValues;
        _this.omniboxObject = omniboxObject;
        return _this;
    }
    return OmniboxHierarchicalValuesList;
}(OmniboxValuesList_1.OmniboxValuesList));
exports.OmniboxHierarchicalValuesList = OmniboxHierarchicalValuesList;


/***/ }),

/***/ 455:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/// <reference path="HierarchicalFacet.ts" />
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
var OmniboxValueElement_1 = __webpack_require__(343);
var OmniboxHierarchicalValueElement = /** @class */ (function (_super) {
    __extends(OmniboxHierarchicalValueElement, _super);
    function OmniboxHierarchicalValueElement(facet, facetValue, eventArg) {
        var _this = _super.call(this, facet, facetValue, eventArg) || this;
        _this.facet = facet;
        _this.facetValue = facetValue;
        _this.eventArg = eventArg;
        return _this;
    }
    OmniboxHierarchicalValueElement.prototype._handleSelectValue = function (eventBindings) {
        this.facet.open(this.facetValue);
        _super.prototype.handleSelectValue.call(this, eventBindings);
    };
    OmniboxHierarchicalValueElement.prototype._handleExcludeClick = function (eventBindings) {
        this.facet.open(this.facetValue);
        _super.prototype.handleExcludeClick.call(this, eventBindings);
    };
    return OmniboxHierarchicalValueElement;
}(OmniboxValueElement_1.OmniboxValueElement));
exports.OmniboxHierarchicalValueElement = OmniboxHierarchicalValueElement;


/***/ }),

/***/ 456:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/// <reference path="HierarchicalFacet.ts" />
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
var FacetValueElement_1 = __webpack_require__(95);
var HierarchicalFacetValueElement = /** @class */ (function (_super) {
    __extends(HierarchicalFacetValueElement, _super);
    function HierarchicalFacetValueElement(facet, facetValue, keepDisplayedValueNextTime) {
        var _this = _super.call(this, facet, facetValue, keepDisplayedValueNextTime) || this;
        _this.facet = facet;
        _this.facetValue = facetValue;
        _this.keepDisplayedValueNextTime = keepDisplayedValueNextTime;
        return _this;
    }
    return HierarchicalFacetValueElement;
}(FacetValueElement_1.FacetValueElement));
exports.HierarchicalFacetValueElement = HierarchicalFacetValueElement;


/***/ }),

/***/ 457:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 47:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path='Facet.ts' />
var StringUtils_1 = __webpack_require__(19);
var QueryUtils_1 = __webpack_require__(20);
var FileTypes_1 = __webpack_require__(97);
var DateUtils_1 = __webpack_require__(31);
var Utils_1 = __webpack_require__(4);
var Dom_1 = __webpack_require__(1);
var _ = __webpack_require__(0);
var Strings_1 = __webpack_require__(7);
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
        else if (FacetUtils.isMonthFieldValue(field, value)) {
            var month = parseInt(value, 10);
            found = DateUtils_1.DateUtils.monthToString(month - 1);
        }
        else {
            found = Strings_1.l(value);
        }
        return found != undefined && Utils_1.Utils.isNonEmptyString(found) ? found : value;
    };
    FacetUtils.isMonthFieldValue = function (field, value) {
        if (!QueryUtils_1.QueryUtils.isStratusAgnosticField(field.toLowerCase(), '@month')) {
            return false;
        }
        var asInt = parseInt(value, 10);
        if (isNaN(asInt)) {
            return false;
        }
        if (asInt < 1 || asInt > 12) {
            return false;
        }
        return true;
    };
    return FacetUtils;
}());
exports.FacetUtils = FacetUtils;


/***/ }),

/***/ 51:
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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(375);
__webpack_require__(376);
var _ = __webpack_require__(0);
var FacetQueryController_1 = __webpack_require__(165);
var BreadcrumbEvents_1 = __webpack_require__(37);
var OmniboxEvents_1 = __webpack_require__(32);
var QueryEvents_1 = __webpack_require__(10);
var SearchAlertEvents_1 = __webpack_require__(66);
var GlobalExports_1 = __webpack_require__(3);
var Assert_1 = __webpack_require__(5);
var Defer_1 = __webpack_require__(28);
var Model_1 = __webpack_require__(16);
var QueryStateModel_1 = __webpack_require__(12);
var Strings_1 = __webpack_require__(7);
var DeviceUtils_1 = __webpack_require__(26);
var Dom_1 = __webpack_require__(1);
var SVGDom_1 = __webpack_require__(14);
var SVGIcons_1 = __webpack_require__(13);
var Utils_1 = __webpack_require__(4);
var AnalyticsActionListMeta_1 = __webpack_require__(9);
var Component_1 = __webpack_require__(6);
var ComponentOptions_1 = __webpack_require__(8);
var Initialization_1 = __webpack_require__(2);
var ResponsiveFacets_1 = __webpack_require__(160);
var BreadcrumbValueElement_1 = __webpack_require__(338);
var BreadcrumbValuesList_1 = __webpack_require__(339);
var FacetHeader_1 = __webpack_require__(336);
var FacetSearch_1 = __webpack_require__(340);
var FacetSearchParameters_1 = __webpack_require__(128);
var FacetSearchValuesList_1 = __webpack_require__(341);
var FacetSettings_1 = __webpack_require__(332);
var FacetSort_1 = __webpack_require__(333);
var FacetUtils_1 = __webpack_require__(47);
var FacetValueElement_1 = __webpack_require__(95);
var FacetValues_1 = __webpack_require__(94);
var FacetValuesList_1 = __webpack_require__(342);
var FacetValuesOrder_1 = __webpack_require__(158);
var OmniboxValueElement_1 = __webpack_require__(343);
var OmniboxValuesList_1 = __webpack_require__(344);
var ValueElementRenderer_1 = __webpack_require__(328);
var DependentFacetManager_1 = __webpack_require__(393);
var AccessibleButton_1 = __webpack_require__(17);
var ResponsiveFacetOptions_1 = __webpack_require__(81);
/**
 * The `Facet` component displays a *facet* of the results for the current query. A facet is a list of values for a
 * certain field occurring in the results, ordered using a configurable criteria (e.g., number of occurrences).
 *
 * The list of values is obtained using a [`GroupByRequest`]{@link IGroupByRequest} operation performed at the same time
 * as the main query.
 *
 * The `Facet` component allows the end user to drill down inside a result set by restricting the result to certain
 * field values. It also allows filtering out values from the facet itself, and can provide a search box to look for
 * specific values inside larger sets.
 *
 * This is probably the most complex component in the Coveo JavaScript Search Framework and as such, it allows for many
 * configuration options.
 *
 * See also the [`FacetRange`]{@link FacetRange} and [`TimespanFacet`]{@link TimespanFacet} components (which
 * extend this component), and the [`FacetSlider`]{@link FacetSlider} and [`CategoryFacet`]{@link CategoryFacet} components (which do not extend this
 * component, but are very similar).
 */
var Facet = /** @class */ (function (_super) {
    __extends(Facet, _super);
    /**
     * Creates a new `Facet` component. Binds multiple query events as well.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the `Facet` component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     * @param facetClassId The ID to use for this facet (as `Facet` inherited from by other component
     * (e.g., [`FacetRange`]{@link FacetRange}). Default value is `Facet`.
     */
    function Facet(element, options, bindings, facetClassId) {
        if (facetClassId === void 0) { facetClassId = Facet.ID; }
        var _this = _super.call(this, element, facetClassId, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.keepDisplayedValuesNextTime = false;
        _this.values = new FacetValues_1.FacetValues();
        _this.currentPage = 0;
        _this.firstQuery = true;
        _this.canFetchMore = true;
        _this.showingWaitAnimation = false;
        _this.listenToQueryStateChange = true;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, Facet, options);
        if (_this.options.valueCaption != null) {
            _this.options.availableSorts = _.filter(_this.options.availableSorts, function (sort) { return !/^alpha.*$/.test(sort); });
            _this.logger.warn("Because the " + _this.options.field + " facet is using value captions, alphabetical sorts are disabled.");
        }
        ResponsiveFacets_1.ResponsiveFacets.init(_this.root, _this, _this.options);
        // Serves as a way to render facet in the omnibox in the order in which they are instantiated
        _this.omniboxZIndex = Facet.omniboxIndex;
        Facet.omniboxIndex--;
        _this.checkForComputedFieldAndSort();
        _this.checkForValueCaptionType();
        _this.checkForCustomSort();
        _this.initDependentFacetManager();
        _this.initFacetQueryController();
        _this.initQueryEvents();
        _this.initQueryStateEvents();
        _this.initComponentStateEvents();
        _this.initOmniboxEvents();
        _this.initBreadCrumbEvents();
        _this.initSearchAlertEvents();
        _this.updateNumberOfValues();
        _this.bind.oneRootElement(QueryEvents_1.QueryEvents.querySuccess, function () {
            _this.firstQuery = false;
        });
        return _this;
    }
    Facet.prototype.isCurrentlyDisplayed = function () {
        if (!Dom_1.$$(this.element).isVisible()) {
            return false;
        }
        if (Dom_1.$$(this.element).hasClass('coveo-active')) {
            return true;
        }
        if (Dom_1.$$(this.element).hasClass('coveo-facet-empty')) {
            return false;
        }
        return true;
    };
    Facet.prototype.createDom = function () {
        var _this = this;
        this.initBottomAndTopSpacer();
        this.buildFacetContent();
        this.updateAppearanceDependingOnState();
        // After the facet has been created (and before the first query is applied)
        // Try to load a state from the setting, if it's available
        // Execute only _.once (only the first query, or the first time the user switch to a tab that contains a newly set of active facet)
        if (this.facetSettings && this.options.enableSettingsFacetState) {
            var loadOnce = _.once(function () {
                _this.facetSettings.loadSavedState.apply(_this.facetSettings);
            });
            this.bind.onRootElement(QueryEvents_1.QueryEvents.newQuery, loadOnce);
        }
    };
    /**
     * Selects a single value.
     *
     * Does not trigger a query automatically.
     *
     * @param value Can be a [`FacetValue`]{@link FacetValue} or a string (e.g., `selectValue('foobar')` or
     * `selectValue(new FacetValue('foobar'))`).
     */
    Facet.prototype.selectValue = function (value) {
        Assert_1.Assert.exists(value);
        this.ensureDom();
        this.logger.info('Selecting facet value', this.facetValuesList.select(value));
        this.facetValueHasChanged();
    };
    /**
     * Selects multiple values.
     *
     * Does not trigger a query automatically.
     *
     * @param values Can be an array of [`FacetValue`]{@link FacetValue} or an array of strings.
     */
    Facet.prototype.selectMultipleValues = function (values) {
        var _this = this;
        Assert_1.Assert.exists(values);
        this.ensureDom();
        _.each(values, function (value) {
            _this.logger.info('Selecting facet value', _this.facetValuesList.select(value));
        });
        this.facetValueHasChanged();
    };
    /**
     * Deselects a single value.
     *
     * Does not trigger a query automatically.
     *
     * @param value Can be a [`FacetValue`]{@link FacetValue} or a string (e.g., `deselectValue('foobar')` or
     * `deselectValue(new FacetValue('foobar'))`).
     */
    Facet.prototype.deselectValue = function (value) {
        Assert_1.Assert.exists(value);
        this.ensureDom();
        this.logger.info('Deselecting facet value', this.facetValuesList.unselect(value));
        this.facetValueHasChanged();
    };
    /**
     * Deselects multiple values.
     *
     * Does not trigger a query automatically.
     *
     * @param values Can be an array of [`FacetValue`]{@link FacetValue} or an array of strings.
     */
    Facet.prototype.deselectMultipleValues = function (values) {
        var _this = this;
        Assert_1.Assert.exists(values);
        this.ensureDom();
        _.each(values, function (value) {
            _this.logger.info('Deselecting facet value', _this.facetValuesList.unselect(value));
        });
        this.facetValueHasChanged();
    };
    /**
     * Excludes a single value.
     *
     * Does not trigger a query automatically.
     *
     * @param value Can be a [`FacetValue`]{@link FacetValue} or a string (e.g., `excludeValue('foobar')` or
     * `excludeValue(new FacetValue('foobar'))`).
     */
    Facet.prototype.excludeValue = function (value) {
        Assert_1.Assert.exists(value);
        this.ensureDom();
        this.logger.info('Excluding facet value', this.facetValuesList.exclude(value));
        this.facetValueHasChanged();
    };
    /**
     * Excludes multiple values.
     *
     * Does not trigger a query automatically.
     *
     * @param values Can be an array of [`FacetValue`]{@link FacetValue} or an array of strings.
     */
    Facet.prototype.excludeMultipleValues = function (values) {
        var _this = this;
        Assert_1.Assert.exists(values);
        this.ensureDom();
        _.each(values, function (value) {
            _this.logger.info('Excluding facet value', _this.facetValuesList.exclude(value));
        });
        this.facetValueHasChanged();
    };
    /**
     * Unexcludes a single value.
     *
     * Does not trigger a query automatically.
     *
     * @param value Can be a [`FacetValue`]{@link FacetValue} or a string.
     */
    Facet.prototype.unexcludeValue = function (value) {
        Assert_1.Assert.exists(value);
        this.ensureDom();
        this.logger.info('Unexcluding facet value', this.facetValuesList.unExclude(value));
        this.facetValueHasChanged();
    };
    /**
     * Unexcludes multiple values.
     *
     * Does not trigger a query automatically.
     *
     * @param values Can be an array of [`FacetValue`]{@link FacetValue} or an array of strings.
     */
    Facet.prototype.unexcludeMultipleValues = function (values) {
        var _this = this;
        Assert_1.Assert.exists(values);
        this.ensureDom();
        _.each(values, function (value) {
            _this.logger.info('Unexcluding facet value', _this.facetValuesList.unExclude(value));
        });
        this.facetValueHasChanged();
    };
    /**
     * Toggles the selection state of a single value (selects the value if it is not already selected; un-selects the
     * value if it is already selected).
     *
     * Does not trigger a query automatically.
     * @param value Can be a [`FacetValue`]{@link FacetValue} or a string.
     */
    Facet.prototype.toggleSelectValue = function (value) {
        Assert_1.Assert.exists(value);
        this.ensureDom();
        this.logger.info('Toggle select facet value', this.facetValuesList.toggleSelect(value));
        this.facetValueHasChanged();
    };
    /**
     * Toggles the exclusion state of a single value (excludes the value if it is not already excluded; un-excludes the
     * value if it is already excluded).
     *
     * Does not trigger a query automatically.
     *
     * @param value Can be a [`FacetValue`]{@link FacetValue} or a string.
     */
    Facet.prototype.toggleExcludeValue = function (value) {
        Assert_1.Assert.exists(value);
        this.ensureDom();
        this.logger.info('Toggle exclude facet value', this.facetValuesList.toggleExclude(value));
        this.facetValueHasChanged();
    };
    /**
     * Returns the currently displayed values as an array of strings.
     *
     * @returns {any[]} The currently displayed values.
     */
    Facet.prototype.getDisplayedValues = function () {
        return _.pluck(this.getDisplayedFacetValues(), 'value');
    };
    /**
     * Returns the currently displayed values as an array of [`FacetValue`]{@link FacetValue}.
     *
     * @returns {T[]} The currently displayed values.
     */
    Facet.prototype.getDisplayedFacetValues = function () {
        this.ensureDom();
        var displayed = this.facetValuesList.getAllCurrentlyDisplayed();
        return _.map(displayed, function (value) {
            return value.facetValue;
        });
    };
    /**
     * Returns the currently selected values as an array of strings.
     * @returns {string[]} The currently selected values.
     */
    Facet.prototype.getSelectedValues = function () {
        this.ensureDom();
        return _.map(this.values.getSelected(), function (value) { return value.value; });
    };
    /**
     * Returns the currently excluded values as an array of strings.
     * @returns {string[]} The currently excluded values.
     */
    Facet.prototype.getExcludedValues = function () {
        this.ensureDom();
        return _.map(this.values.getExcluded(), function (value) { return value.value; });
    };
    /**
     * Resets the facet by un-selecting all values, un-excluding all values, and redrawing the facet.
     */
    Facet.prototype.reset = function () {
        this.ensureDom();
        this.values.reset();
        this.rebuildValueElements();
        this.updateAppearanceDependingOnState();
        this.updateQueryStateModel();
    };
    /**
     * Switches the facet to `AND` mode.
     *
     * See the [`useAnd`]{@link Facet.options.useAnd}, and
     * [`enableTogglingOperator`]{@link Facet.options.enableTogglingOperator} options.
     */
    Facet.prototype.switchToAnd = function () {
        this.ensureDom();
        this.logger.info('Switching to AND');
        this.facetHeader.switchToAnd();
    };
    /**
     * Switches the facet to `OR` mode.
     *
     * See the [`useAnd`]{@link Facet.options.useAnd}, and
     * [`enableTogglingOperator`]{@link Facet.options.enableTogglingOperator} options.
     */
    Facet.prototype.switchToOr = function () {
        this.ensureDom();
        this.logger.info('Switching to OR');
        this.facetHeader.switchToOr();
    };
    /**
     * Returns the endpoint for the facet.
     * @returns {ISearchEndpoint} The endpoint for the Ffcet.
     */
    Facet.prototype.getEndpoint = function () {
        return this.queryController.getEndpoint();
    };
    /**
     * Changes the sort parameter for the facet.
     *
     * See {@link Facet.options.availableSorts} for the list of possible values.
     *
     * Also triggers a new query.
     *
     * @param criteria The new sort parameter for the facet.
     */
    Facet.prototype.updateSort = function (criteria) {
        this.ensureDom();
        if (this.options.sortCriteria != criteria) {
            this.options.sortCriteria = criteria;
            this.usageAnalytics.logCustomEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.facetUpdateSort, {
                criteria: criteria,
                facetId: this.options.id,
                facetField: this.options.field.toString(),
                facetTitle: this.options.title
            }, this.element);
            this.triggerNewQuery();
        }
    };
    Facet.prototype.unfadeInactiveValuesInMainList = function () {
        Dom_1.$$(this.element).removeClass('coveo-facet-fade');
    };
    Facet.prototype.fadeInactiveValuesInMainList = function (delay) {
        Dom_1.$$(this.element).addClass('coveo-facet-fade');
    };
    /**
     * Shows a waiting animation in the facet header (a spinner).
     */
    Facet.prototype.showWaitingAnimation = function () {
        this.ensureDom();
        if (!this.showingWaitAnimation) {
            Dom_1.$$(this.headerElement).find('.coveo-facet-header-wait-animation').style.visibility = 'visible';
            this.showingWaitAnimation = true;
        }
    };
    /**
     * Hides the waiting animation in the facet header.
     */
    Facet.prototype.hideWaitingAnimation = function () {
        this.ensureDom();
        if (this.showingWaitAnimation) {
            Dom_1.$$(this.headerElement).find('.coveo-facet-header-wait-animation').style.visibility = 'hidden';
            this.showingWaitAnimation = false;
        }
    };
    Facet.prototype.processFacetSearchAllResultsSelected = function (facetValues) {
        var _this = this;
        var valuesForAnalytics = [];
        _.each(facetValues, function (facetValue) {
            _this.ensureFacetValueIsInList(facetValue);
            valuesForAnalytics.push(facetValue.value);
        });
        // Calculate the correct number of values from the current selected/excluded values (those will stay no matter what next rendering)
        // add the new one that will be selected (and are not already selected in the facet)
        // The minimum number of values is the number of values set in the option
        var valuesThatStays = this.values.getSelected().concat(this.values.getExcluded());
        this.numberOfValues = valuesThatStays.length + _.difference(valuesThatStays, facetValues).length;
        this.numberOfValues = Math.max(this.numberOfValues, this.options.numberOfValues);
        // Then, we set current page as the last "full" page (math.floor)
        // This is so there is no additional values displayed requested to fill the current page
        // Also, when the user hit more, it will request the current page and fill it with more values
        this.currentPage = Math.floor((this.numberOfValues - this.options.numberOfValues) / this.options.pageSize);
        this.updateQueryStateModel();
        this.triggerNewQuery(function () {
            return _this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.facetSelectAll, {
                facetId: _this.options.id,
                facetField: _this.options.field.toString(),
                facetTitle: _this.options.title
            });
        });
    };
    Facet.prototype.pinFacetPosition = function () {
        if (this.options.preservePosition) {
            this.pinnedViewportPosition = this.element.getBoundingClientRect().top;
        }
    };
    /**
     * Returns the configured caption for the given [`FacetValue`]{@link FacetValue}.
     *
     * @param facetValue The `FacetValue` whose caption the method should return.
     */
    Facet.prototype.getValueCaption = function (facetValue) {
        Assert_1.Assert.exists(facetValue);
        var lookupValue = facetValue.lookupValue || facetValue.value;
        var ret = lookupValue;
        ret = FacetUtils_1.FacetUtils.tryToGetTranslatedCaption(this.options.field, lookupValue);
        if (Utils_1.Utils.exists(this.options.valueCaption)) {
            if (typeof this.options.valueCaption == 'object') {
                ret = this.options.valueCaption[lookupValue] || ret;
            }
            if (typeof this.options.valueCaption == 'function') {
                this.values.get(lookupValue);
                ret = this.options.valueCaption.call(this, this.facetValuesList.get(lookupValue).facetValue);
            }
        }
        return ret;
    };
    /**
     * Shows the next page of results in the facet.
     *
     * See the [`enableMoreLess`]{@link Facet.options.enableMoreLess}, and [`pageSize`]{@link Facet.options.pageSize}
     * options.
     *
     * Triggers a query if needed, or displays the already available values.
     */
    Facet.prototype.showMore = function () {
        this.currentPage++;
        this.updateNumberOfValues();
        if (this.nbAvailableValues >= this.numberOfValues || !this.canFetchMore) {
            this.rebuildValueElements();
        }
        else {
            this.triggerMoreQuery();
        }
    };
    /**
     * Shows less elements in the Facet (up to the original number of values).
     *
     * See the [`enableMoreLess`]{@link Facet.options.enableMoreLess}, and
     * [`numberOfValues`]{@link Facet.options.numberOfValues} options.
     */
    Facet.prototype.showLess = function () {
        Dom_1.$$(this.lessElement).removeClass('coveo-active');
        this.currentPage = 0;
        this.updateNumberOfValues();
        Dom_1.$$(this.moreElement).addClass('coveo-active');
        this.values.sortValuesDependingOnStatus(this.numberOfValues);
        this.rebuildValueElements();
    };
    /**
     * Collapses the facet.
     */
    Facet.prototype.collapse = function () {
        this.ensureDom();
        if (this.facetHeader) {
            this.facetHeader.collapseFacet();
        }
    };
    /**
     * Expands the facet.
     */
    Facet.prototype.expand = function () {
        this.ensureDom();
        if (this.facetHeader) {
            this.facetHeader.expandFacet();
        }
    };
    Facet.prototype.triggerNewQuery = function (beforeExecuteQuery) {
        if (!beforeExecuteQuery) {
            this.queryController.executeQuery({ ignoreWarningSearchEvent: true });
        }
        else {
            this.queryController.executeQuery({ beforeExecuteQuery: beforeExecuteQuery });
        }
        this.showWaitingAnimation();
    };
    Facet.prototype.handleDeferredQuerySuccess = function (data) {
        Assert_1.Assert.exists(data);
        this.unfadeInactiveValuesInMainList();
        this.hideWaitingAnimation();
        this.dependentFacetManager.updateVisibilityBasedOnDependsOn();
        var groupByResult = data.results.groupByResults[this.facetQueryController.lastGroupByRequestIndex];
        this.facetQueryController.lastGroupByResult = groupByResult;
        // Two corner case to handle regarding the "sticky" aspect of facets :
        // 1) The group by is empty (so there is nothing to "sticky")
        // 2) There is only one value displayed currently, so there is nothing to "sticky" either
        if (!groupByResult) {
            this.keepDisplayedValuesNextTime = false;
        }
        if (this.values.getAll().length == 1) {
            this.keepDisplayedValuesNextTime = false;
        }
        this.processNewGroupByResults(groupByResult);
    };
    Facet.prototype.handleQueryError = function () {
        this.updateValues(new FacetValues_1.FacetValues());
        this.updateAppearanceDependingOnState();
        this.hideWaitingAnimation();
    };
    Facet.prototype.handlePopulateBreadcrumb = function (args) {
        Assert_1.Assert.exists(args);
        if (this.values.hasSelectedOrExcludedValues()) {
            var element = new BreadcrumbValuesList_1.BreadcrumbValueList(this, this.values.getSelected().concat(this.values.getExcluded()), BreadcrumbValueElement_1.BreadcrumbValueElement).build();
            args.breadcrumbs.push({ element: element });
        }
    };
    Facet.prototype.handlePopulateSearchAlerts = function (args) {
        if (this.values.hasSelectedOrExcludedValues()) {
            var excludedValues = this.values.getExcluded();
            var selectedValues = this.values.getSelected();
            if (!_.isEmpty(excludedValues)) {
                args.text.push({
                    value: new BreadcrumbValuesList_1.BreadcrumbValueList(this, excludedValues, BreadcrumbValueElement_1.BreadcrumbValueElement).buildAsString(),
                    lineThrough: true
                });
            }
            if (!_.isEmpty(selectedValues)) {
                args.text.push({
                    value: new BreadcrumbValuesList_1.BreadcrumbValueList(this, selectedValues, BreadcrumbValueElement_1.BreadcrumbValueElement).buildAsString(),
                    lineThrough: false
                });
            }
        }
    };
    Facet.prototype.initFacetQueryController = function () {
        this.facetQueryController = new FacetQueryController_1.FacetQueryController(this);
    };
    Facet.prototype.initFacetValuesList = function () {
        this.facetValuesList = new FacetValuesList_1.FacetValuesList(this, FacetValueElement_1.FacetValueElement);
        this.element.appendChild(this.facetValuesList.build());
    };
    Facet.prototype.initFacetSearch = function () {
        this.facetSearch = new FacetSearch_1.FacetSearch(this, FacetSearchValuesList_1.FacetSearchValuesList, this.root);
        this.element.appendChild(this.facetSearch.build());
    };
    Facet.prototype.facetValueHasChanged = function () {
        var _this = this;
        this.updateQueryStateModel();
        this.rebuildValueElements();
        Defer_1.Defer.defer(function () {
            _this.updateAppearanceDependingOnState();
        });
    };
    Facet.prototype.updateAppearanceDependingOnState = function () {
        Dom_1.$$(this.element).toggleClass('coveo-active', this.values.hasSelectedOrExcludedValues());
        Dom_1.$$(this.element).toggleClass('coveo-facet-empty', !this.isAnyValueCurrentlyDisplayed());
        Dom_1.$$(this.facetHeader.eraserElement).toggleClass('coveo-facet-header-eraser-visible', this.values.hasSelectedOrExcludedValues());
    };
    Facet.prototype.initQueryEvents = function () {
        var _this = this;
        this.bind.onRootElement(QueryEvents_1.QueryEvents.duringQuery, function () { return _this.handleDuringQuery(); });
        this.bind.onRootElement(QueryEvents_1.QueryEvents.buildingQuery, function (args) { return _this.handleBuildingQuery(args); });
        this.bind.onRootElement(QueryEvents_1.QueryEvents.doneBuildingQuery, function (args) { return _this.handleDoneBuildingQuery(args); });
        this.bind.onRootElement(QueryEvents_1.QueryEvents.deferredQuerySuccess, function (args) { return _this.handleDeferredQuerySuccess(args); });
        this.bind.onRootElement(QueryEvents_1.QueryEvents.queryError, function () { return _this.handleQueryError(); });
    };
    Facet.prototype.initQueryStateEvents = function () {
        var _this = this;
        this.includedAttributeId = QueryStateModel_1.QueryStateModel.getFacetId(this.options.id);
        this.excludedAttributeId = QueryStateModel_1.QueryStateModel.getFacetId(this.options.id, false);
        this.operatorAttributeId = QueryStateModel_1.QueryStateModel.getFacetOperator(this.options.id);
        this.lookupValueAttributeId = QueryStateModel_1.QueryStateModel.getFacetLookupValue(this.options.id);
        this.queryStateModel.registerNewAttribute(this.includedAttributeId, []);
        this.queryStateModel.registerNewAttribute(this.excludedAttributeId, []);
        this.queryStateModel.registerNewAttribute(this.operatorAttributeId, '');
        this.queryStateModel.registerNewAttribute(this.lookupValueAttributeId, {});
        this.bind.onQueryState(Model_1.MODEL_EVENTS.CHANGE, undefined, function (args) { return _this.handleQueryStateChanged(args); });
        this.dependentFacetManager.listenToParentIfDependentFacet();
    };
    Facet.prototype.initComponentStateEvents = function () {
        this.componentStateId = QueryStateModel_1.QueryStateModel.getFacetId(this.options.id);
        this.componentStateModel.registerComponent(this.componentStateId, this);
    };
    Facet.prototype.initOmniboxEvents = function () {
        var _this = this;
        if (this.options.includeInOmnibox) {
            this.bind.onRootElement(OmniboxEvents_1.OmniboxEvents.populateOmnibox, function (args) { return _this.handlePopulateOmnibox(args); });
        }
    };
    Facet.prototype.initBreadCrumbEvents = function () {
        var _this = this;
        if (this.options.includeInBreadcrumb) {
            this.bind.onRootElement(BreadcrumbEvents_1.BreadcrumbEvents.populateBreadcrumb, function (args) {
                return _this.handlePopulateBreadcrumb(args);
            });
            this.bind.onRootElement(BreadcrumbEvents_1.BreadcrumbEvents.clearBreadcrumb, function (args) { return _this.handleClearBreadcrumb(); });
        }
    };
    Facet.prototype.initSearchAlertEvents = function () {
        var _this = this;
        this.bind.onRootElement(SearchAlertEvents_1.SearchAlertsEvents.searchAlertsPopulateMessage, function (args) {
            return _this.handlePopulateSearchAlerts(args);
        });
    };
    Facet.prototype.handleOmniboxWithStaticValue = function (eventArg) {
        var _this = this;
        var regex = new RegExp('^' + eventArg.completeQueryExpression.regex.source, 'i');
        var match = _.first(_.filter(this.getDisplayedValues(), function (displayedValue) {
            var value = _this.getValueCaption(_this.facetValuesList.get(displayedValue).facetValue);
            return regex.test(value);
        }), this.options.numberOfValuesInOmnibox);
        var facetValues = _.map(match, function (gotAMatch) {
            return _this.facetValuesList.get(gotAMatch).facetValue;
        });
        var element = new OmniboxValuesList_1.OmniboxValuesList(this, facetValues, eventArg, OmniboxValueElement_1.OmniboxValueElement).build();
        eventArg.rows.push({ element: element, zIndex: this.omniboxZIndex });
    };
    Facet.prototype.processNewGroupByResults = function (groupByResult) {
        this.logger.trace('Displaying group by results', groupByResult);
        if (groupByResult != undefined && groupByResult.values != undefined) {
            this.nbAvailableValues = groupByResult.values.length;
        }
        var newFacetValues = new FacetValues_1.FacetValues(groupByResult);
        this.updateValues(newFacetValues);
        this.canFetchMore = this.numberOfValues < this.nbAvailableValues;
        if (this.values.hasSelectedOrExcludedValues() && !this.options.useAnd && this.options.isMultiValueField) {
            this.triggerUpdateDeltaQuery(_.filter(this.values.getAll(), function (facetValue) {
                return !facetValue.selected && !facetValue.excluded;
            }));
        }
        else if (this.values.getSelected().length > 0 && !this.options.useAnd) {
            this.values.updateDeltaWithFilteredFacetValues(new FacetValues_1.FacetValues(), this.options.isMultiValueField);
        }
        if (!this.values.hasSelectedOrExcludedValues() || this.options.useAnd || !this.options.isMultiValueField) {
            this.rebuildValueElements();
            this.updateAppearanceDependingOnState();
            this.ensurePinnedFacetHasntMoved();
        }
        this.keepDisplayedValuesNextTime = false;
    };
    Facet.prototype.updateQueryStateModel = function () {
        this.listenToQueryStateChange = false;
        this.updateExcludedQueryStateModel();
        this.updateIncludedQueryStateModel();
        this.facetHeader.updateOperatorQueryStateModel();
        this.updateLookupValueQueryStateModel();
        this.listenToQueryStateChange = true;
    };
    Facet.prototype.rebuildValueElements = function () {
        this.updateNumberOfValues();
        this.facetValuesList.rebuild(this.numberOfValues);
        if (this.shouldRenderMoreLess()) {
            this.updateMoreLess();
            if (this.shouldRenderFacetSearch()) {
                this.updateSearchElement(this.nbAvailableValues > this.numberOfValues);
            }
        }
        else if (this.shouldRenderFacetSearch()) {
            this.updateSearchElement();
        }
    };
    Facet.prototype.updateSearchElement = function (moreValuesAvailable) {
        var _this = this;
        if (moreValuesAvailable === void 0) { moreValuesAvailable = true; }
        if (!moreValuesAvailable) {
            return;
        }
        var renderer = new ValueElementRenderer_1.ValueElementRenderer(this, FacetValues_1.FacetValue.create(Strings_1.l('Search')));
        this.searchContainer = renderer.build().withNo([renderer.excludeIcon, renderer.icon]);
        Dom_1.$$(this.searchContainer.listItem).addClass('coveo-facet-search-button');
        new AccessibleButton_1.AccessibleButton()
            .withElement(this.searchContainer.accessibleElement)
            .withLabel(Strings_1.l('Search'))
            .withEnterKeyboardAction(function (e) { return _this.toggleSearchMenu(e); })
            .build();
        // Mobile do not like label. Use click event
        if (DeviceUtils_1.DeviceUtils.isMobileDevice()) {
            Dom_1.$$(this.searchContainer.label).on('click', function (e) { return _this.toggleSearchMenu(e); });
        }
        Dom_1.$$(this.searchContainer.checkbox).on('change', function () {
            Dom_1.$$(_this.element).addClass('coveo-facet-searching');
            _this.facetSearch.focus();
        });
        this.facetValuesList.valueContainer.appendChild(this.searchContainer.listItem);
    };
    Facet.prototype.updateMoreLess = function (lessElementIsShown, moreValuesAvailable) {
        if (lessElementIsShown === void 0) { lessElementIsShown = this.getMinimumNumberOfValuesToDisplay() < this.numberOfValues; }
        if (moreValuesAvailable === void 0) { moreValuesAvailable = this.nbAvailableValues > this.numberOfValues; }
        if (lessElementIsShown) {
            Dom_1.$$(this.lessElement).addClass('coveo-active');
        }
        else {
            Dom_1.$$(this.lessElement).removeClass('coveo-active');
        }
        if (moreValuesAvailable) {
            Dom_1.$$(this.moreElement).addClass('coveo-active');
        }
        else {
            Dom_1.$$(this.moreElement).removeClass('coveo-active');
        }
        if (lessElementIsShown || moreValuesAvailable) {
            Dom_1.$$(this.footerElement).removeClass('coveo-facet-empty');
        }
        else {
            Dom_1.$$(this.footerElement).addClass('coveo-facet-empty');
        }
    };
    Facet.prototype.handleClickMore = function () {
        this.showMore();
    };
    Facet.prototype.handleClickLess = function () {
        this.showLess();
    };
    Facet.prototype.toggleSearchMenu = function (e) {
        var searchButton = this.searchContainer;
        if (searchButton.checkbox.getAttribute('checked')) {
            searchButton.checkbox.removeAttribute('checked');
        }
        else {
            searchButton.checkbox.setAttribute('checked', 'checked');
        }
        Dom_1.$$(searchButton.checkbox).trigger('change');
        e.stopPropagation();
        e.preventDefault();
    };
    Facet.prototype.checkForComputedFieldAndSort = function () {
        if (this.options.sortCriteria.toLowerCase().indexOf('computedfield') != -1 && Utils_1.Utils.isNullOrUndefined(this.options.computedField)) {
            this.logger.warn('Sort criteria is specified as ComputedField, but the facet uses no computed field. Facet will always be empty !', this);
        }
    };
    Facet.prototype.checkForValueCaptionType = function () {
        if (this.options.valueCaption && typeof this.options.valueCaption == 'function') {
            this.options.enableFacetSearch = false;
            this.options.includeInOmnibox = false;
            this.logger.warn('Using a function as valueCaption is now deprecated. Use a json key value pair instead. Facet search and omnibox has been disabled for this facet', this);
        }
    };
    Facet.prototype.checkForCustomSort = function () {
        if (this.options.customSort != undefined && !_.contains(this.options.availableSorts, 'custom')) {
            this.options.availableSorts.unshift('custom');
        }
        if (this.options.availableSorts[0] == 'custom') {
            this.options.sortCriteria = 'nosort';
        }
    };
    Facet.prototype.initDependentFacetManager = function () {
        this.dependentFacetManager = new DependentFacetManager_1.DependentFacetManager(this);
    };
    Facet.prototype.initBottomAndTopSpacer = function () {
        var _this = this;
        var bottomSpace = Dom_1.$$(this.options.paddingContainer).find('.coveo-bottomSpace');
        var topSpace = Dom_1.$$(this.options.paddingContainer).find('.coveo-topSpace');
        if (this.options.preservePosition) {
            Dom_1.$$(this.options.paddingContainer).on('mouseleave', function () { return _this.unpinFacetPosition(); });
            this.pinnedTopSpace = topSpace;
            this.pinnedBottomSpace = bottomSpace;
            if (!this.pinnedTopSpace) {
                this.pinnedTopSpace = document.createElement('div');
                Dom_1.$$(this.pinnedTopSpace).addClass('coveo-topSpace');
                Dom_1.$$(this.pinnedTopSpace).insertBefore(this.options.paddingContainer.firstChild);
            }
            if (!this.pinnedBottomSpace) {
                this.pinnedBottomSpace = document.createElement('div');
                Dom_1.$$(this.pinnedBottomSpace).addClass('coveo-bottomSpace');
                this.options.paddingContainer.appendChild(this.pinnedBottomSpace);
            }
        }
    };
    Facet.prototype.updateIncludedQueryStateModel = function () {
        var selectedValues = { included: this.getSelectedValues(), title: this.includedAttributeId };
        this.queryStateModel.set(this.includedAttributeId, selectedValues.included);
    };
    Facet.prototype.updateExcludedQueryStateModel = function () {
        var excludedValues = { title: this.excludedAttributeId, excluded: this.getExcludedValues() };
        this.queryStateModel.set(this.excludedAttributeId, excludedValues.excluded);
    };
    Facet.prototype.updateLookupValueQueryStateModel = function () {
        if (this.options.lookupField) {
            var valueToSet_1 = {};
            _.each(this.values.getSelected().concat(this.values.getExcluded()), function (value) {
                valueToSet_1[value.value] = value.lookupValue;
            });
            this.queryStateModel.set(this.lookupValueAttributeId, valueToSet_1);
        }
    };
    Facet.prototype.handleQueryStateChangedOperator = function (operator) {
        if (operator == 'and') {
            this.switchToAnd();
        }
        else if (operator == 'or') {
            this.switchToOr();
        }
    };
    Facet.prototype.handleQueryStateChangedIncluded = function (includedChanged) {
        var toUnSelect = _.difference(this.getSelectedValues(), includedChanged);
        if (Utils_1.Utils.isNonEmptyArray(toUnSelect)) {
            this.deselectMultipleValues(toUnSelect);
        }
        if (!Utils_1.Utils.arrayEqual(this.getSelectedValues(), includedChanged, false)) {
            this.selectMultipleValues(includedChanged);
        }
    };
    Facet.prototype.handleQueryStateChangedExcluded = function (excludedChanged) {
        var toUnExclude = _.difference(this.getExcludedValues(), excludedChanged);
        if (Utils_1.Utils.isNonEmptyArray(toUnExclude)) {
            this.unexcludeMultipleValues(toUnExclude);
        }
        if (!Utils_1.Utils.arrayEqual(this.getExcludedValues(), excludedChanged, false)) {
            this.excludeMultipleValues(excludedChanged);
        }
    };
    Facet.prototype.handleLookupvalueChanged = function (lookupFieldChanged) {
        var _this = this;
        _.each(lookupFieldChanged, function (lookupvalue, value) {
            _this.facetValuesList.get(decodeURIComponent(value)).facetValue.lookupValue = decodeURIComponent(lookupvalue);
        });
    };
    Facet.prototype.handleQueryStateChanged = function (data) {
        Assert_1.Assert.exists(data);
        this.ensureDom();
        var trimValuesFromModel = function (values) {
            if (values) {
                values = _.map(values, function (value) { return value.trim(); });
            }
            return values;
        };
        var queryStateAttributes = data.attributes;
        var includedChanged = trimValuesFromModel(queryStateAttributes[this.includedAttributeId]);
        var excludedChanged = trimValuesFromModel(queryStateAttributes[this.excludedAttributeId]);
        var operator = queryStateAttributes[this.operatorAttributeId];
        var lookupValueChanged = queryStateAttributes[this.lookupValueAttributeId];
        if (this.listenToQueryStateChange) {
            if (!Utils_1.Utils.isNullOrEmptyString(operator)) {
                this.handleQueryStateChangedOperator(operator);
            }
            if (!Utils_1.Utils.isNullOrUndefined(includedChanged)) {
                this.handleQueryStateChangedIncluded(includedChanged);
            }
            if (!Utils_1.Utils.isNullOrUndefined(excludedChanged)) {
                this.handleQueryStateChangedExcluded(excludedChanged);
            }
            if (!Utils_1.Utils.isNullOrUndefined(lookupValueChanged)) {
                this.handleLookupvalueChanged(lookupValueChanged);
            }
        }
    };
    Facet.prototype.handlePopulateOmnibox = function (data) {
        Assert_1.Assert.exists(data);
        Assert_1.Assert.exists(data.completeQueryExpression);
        // The omnibox calls can come in before a first query was executed (atypical, but
        // if no query is auto-triggered on initialization). To ensure that we've got the
        // proper filters, we ensure that at least a dumbshow query builder run occured
        // before proceeding.
        this.queryController.ensureCreatedQueryBuilder();
        if (this.canFetchMore) {
            this.handleOmniboxWithSearchInFacet(data);
        }
        else {
            this.handleOmniboxWithStaticValue(data);
        }
    };
    Facet.prototype.handleOmniboxWithSearchInFacet = function (eventArg) {
        var _this = this;
        var regex = new RegExp('^' + eventArg.completeQueryExpression.regex.source, 'i');
        var promise = new Promise(function (resolve, reject) {
            var searchParameters = new FacetSearchParameters_1.FacetSearchParameters(_this);
            searchParameters.setValueToSearch(eventArg.completeQueryExpression.word);
            searchParameters.nbResults = _this.options.numberOfValuesInOmnibox;
            _this.facetQueryController
                .search(searchParameters)
                .then(function (fieldValues) {
                var facetValues = _.map(_.filter(fieldValues, function (fieldValue) {
                    return regex.test(fieldValue.lookupValue);
                }), function (fieldValue) {
                    return _this.values.get(fieldValue.lookupValue) || FacetValues_1.FacetValue.create(fieldValue);
                });
                var element = new OmniboxValuesList_1.OmniboxValuesList(_this, facetValues, eventArg, OmniboxValueElement_1.OmniboxValueElement).build();
                resolve({ element: element, zIndex: _this.omniboxZIndex });
            })
                .catch(function () {
                resolve({ element: undefined });
            });
        });
        eventArg.rows.push({ deferred: promise });
    };
    Facet.prototype.handleDuringQuery = function () {
        this.ensureDom();
        if (!this.keepDisplayedValuesNextTime) {
            this.fadeInactiveValuesInMainList(this.options.facetSearchDelay);
        }
    };
    Facet.prototype.handleBuildingQuery = function (data) {
        Assert_1.Assert.exists(data);
        Assert_1.Assert.exists(data.queryBuilder);
        this.facetQueryController.prepareForNewQuery();
        if (this.values.hasSelectedOrExcludedValues()) {
            var expression = this.facetQueryController.computeOurFilterExpression();
            this.logger.trace('Putting filter in query', expression);
            data.queryBuilder.advancedExpression.add(expression);
        }
    };
    Facet.prototype.handleDoneBuildingQuery = function (data) {
        Assert_1.Assert.exists(data);
        Assert_1.Assert.exists(data.queryBuilder);
        var queryBuilder = data.queryBuilder;
        this.facetQueryController.putGroupByIntoQueryBuilder(queryBuilder);
    };
    Facet.prototype.handleClearBreadcrumb = function () {
        this.reset();
    };
    Facet.prototype.updateValues = function (facetValues) {
        Assert_1.Assert.exists(facetValues);
        if (this.keepDisplayedValuesNextTime) {
            this.values.updateCountsFromNewValues(facetValues);
        }
        else {
            facetValues.importActiveValuesFromOtherList(this.values);
            facetValues.sortValuesDependingOnStatus(this.numberOfValues);
            this.values = facetValues;
        }
        this.updateNumberOfValues();
    };
    Facet.prototype.ensureFacetValueIsInList = function (facetValue) {
        Assert_1.Assert.exists(facetValue);
        if (!this.values.contains(facetValue.value)) {
            this.values.add(facetValue);
        }
    };
    Facet.prototype.isAnyValueCurrentlyDisplayed = function () {
        return !this.values.isEmpty();
    };
    Facet.prototype.buildFacetContent = function () {
        this.headerElement = this.buildHeader();
        this.element.appendChild(this.headerElement);
        this.initFacetValuesList();
        if (this.shouldRenderFacetSearch()) {
            this.initFacetSearch();
        }
        if (this.shouldRenderMoreLess()) {
            this.moreElement = this.buildMore();
            this.lessElement = this.buildLess();
        }
        this.footerElement = this.buildFooter();
        this.element.appendChild(this.footerElement);
        if (this.lessElement && this.moreElement) {
            this.footerElement.appendChild(this.lessElement);
            this.footerElement.appendChild(this.moreElement);
        }
    };
    Facet.prototype.buildHeader = function () {
        var icon = this.options.headerIcon;
        if (this.options.headerIcon == this.options.field) {
            icon = undefined;
        }
        this.facetHeader = new FacetHeader_1.FacetHeader({
            facetElement: this.element,
            title: this.options.title,
            icon: icon,
            field: this.options.field,
            enableClearElement: true,
            enableCollapseElement: this.options.enableCollapse,
            facet: this,
            settingsKlass: this.options.enableSettings ? FacetSettings_1.FacetSettings : undefined,
            sortKlass: FacetSort_1.FacetSort,
            availableSorts: this.options.availableSorts
        });
        var built = this.facetHeader.build();
        this.facetSettings = this.facetHeader.settings;
        this.facetSort = this.facetHeader.sort;
        return built;
    };
    Facet.prototype.unpinFacetPosition = function () {
        if (this.shouldFacetUnpin() && this.options.preservePosition) {
            Dom_1.$$(this.pinnedTopSpace).addClass('coveo-with-animation');
            Dom_1.$$(this.pinnedBottomSpace).addClass('coveo-with-animation');
            this.pinnedTopSpace.style.height = '0px';
            this.pinnedBottomSpace.style.height = '0px';
        }
        this.unpinnedViewportPosition = undefined;
        this.pinnedViewportPosition = undefined;
    };
    Facet.prototype.isFacetPinned = function () {
        return Utils_1.Utils.exists(this.pinnedViewportPosition);
    };
    Facet.prototype.shouldFacetUnpin = function () {
        return Utils_1.Utils.exists(this.unpinnedViewportPosition);
    };
    Facet.prototype.ensurePinnedFacetHasntMoved = function () {
        if (this.isFacetPinned()) {
            Assert_1.Assert.exists(this.pinnedViewportPosition);
            Dom_1.$$(this.pinnedTopSpace).removeClass('coveo-with-animation');
            Dom_1.$$(this.pinnedBottomSpace).removeClass('coveo-with-animation');
            this.pinnedTopSpace.style.height = '0px';
            this.pinnedBottomSpace.style.height = '0px';
            // Under firefox scrolling the body doesn't work, but window does
            // on all browser, so we substitute those here when needed.
            var elementToScroll_1 = this.options.scrollContainer == document.body ? window : this.options.scrollContainer;
            var currentViewportPosition = this.element.getBoundingClientRect().top;
            var offset_1 = currentViewportPosition - this.pinnedViewportPosition;
            var scrollToOffset = function () {
                if (elementToScroll_1 instanceof Window) {
                    window.scrollTo(0, new Dom_1.Win(elementToScroll_1).scrollY() + offset_1);
                }
                else {
                    elementToScroll_1.scrollTop = elementToScroll_1.scrollTop + offset_1;
                }
            };
            // First try to adjust position by scrolling the page
            scrollToOffset();
            currentViewportPosition = this.element.getBoundingClientRect().top;
            offset_1 = currentViewportPosition - this.pinnedViewportPosition;
            // If scrolling has worked (offset == 0), we're good to go, nothing to do anymore.
            if (offset_1 < 0) {
                // This means the facet element is scrolled up in the viewport,
                // scroll it down by adding space in the top container
                this.pinnedTopSpace.style.height = offset_1 * -1 + 'px';
            }
            this.unpinnedViewportPosition = this.pinnedViewportPosition;
            this.pinnedViewportPosition = null;
        }
    };
    Facet.prototype.buildFooter = function () {
        return Dom_1.$$('div', { className: 'coveo-facet-footer' }).el;
    };
    Facet.prototype.buildMore = function () {
        var _this = this;
        var svgContainer = Dom_1.$$('span', { className: 'coveo-facet-more-icon' }, SVGIcons_1.SVGIcons.icons.arrowDown).el;
        SVGDom_1.SVGDom.addClassToSVGInContainer(svgContainer, 'coveo-facet-more-icon-svg');
        var more = Dom_1.$$('div', { className: 'coveo-facet-more', tabindex: 0 }, svgContainer).el;
        new AccessibleButton_1.AccessibleButton()
            .withElement(more)
            .withLabel(Strings_1.l('ExpandFacet', this.options.title))
            .withSelectAction(function () { return _this.handleClickMore(); })
            .build();
        return more;
    };
    Facet.prototype.buildLess = function () {
        var _this = this;
        var svgContainer = Dom_1.$$('span', { className: 'coveo-facet-less-icon' }, SVGIcons_1.SVGIcons.icons.arrowUp).el;
        SVGDom_1.SVGDom.addClassToSVGInContainer(svgContainer, 'coveo-facet-less-icon-svg');
        var less = Dom_1.$$('div', { className: 'coveo-facet-less', tabindex: 0 }, svgContainer).el;
        new AccessibleButton_1.AccessibleButton()
            .withElement(less)
            .withLabel(Strings_1.l('CollapseFacet', this.options.title))
            .withSelectAction(function () { return _this.handleClickLess(); })
            .build();
        return less;
    };
    Facet.prototype.triggerMoreQuery = function () {
        var _this = this;
        this.logger.info('Triggering new facet more query');
        this.showWaitingAnimation();
        // fetch 1 more value than we need, so we can see if there is more value to fetch still or if we have reached
        // the end of the availables values
        this.facetQueryController
            .fetchMore(this.numberOfValues + 1)
            .then(function (queryResults) {
            var facetValues = new FacetValues_1.FacetValues(queryResults.groupByResults[0]);
            facetValues.importActiveValuesFromOtherList(_this.values);
            facetValues.sortValuesDependingOnStatus(_this.numberOfValues);
            _this.values = facetValues;
            _this.nbAvailableValues = _this.values.size();
            _this.updateNumberOfValues();
            _this.canFetchMore = _this.numberOfValues < _this.nbAvailableValues;
            if (_this.values.hasSelectedOrExcludedValues() && !_this.options.useAnd && _this.options.isMultiValueField) {
                _this.triggerUpdateDeltaQuery(_.filter(_this.values.getAll(), function (facetValue) { return !facetValue.selected && !facetValue.excluded; }));
            }
            else if (_this.values.hasSelectedOrExcludedValues() && !_this.options.useAnd) {
                _this.values.updateDeltaWithFilteredFacetValues(new FacetValues_1.FacetValues(), _this.options.isMultiValueField);
                _this.hideWaitingAnimation();
            }
            else {
                _this.hideWaitingAnimation();
            }
            _this.rebuildValueElements();
        })
            .catch(function () { return _this.hideWaitingAnimation(); });
    };
    Facet.prototype.triggerUpdateDeltaQuery = function (facetValues) {
        var _this = this;
        this.showWaitingAnimation();
        this.facetQueryController.searchInFacetToUpdateDelta(facetValues).then(function (queryResults) {
            var values = new FacetValues_1.FacetValues();
            _.each(queryResults.groupByResults, function (groupByResult) {
                _.each(groupByResult.values, function (groupByValue) {
                    if (!values.contains(groupByValue.value)) {
                        values.add(FacetValues_1.FacetValue.createFromGroupByValue(groupByValue));
                    }
                });
            });
            _this.values.updateDeltaWithFilteredFacetValues(values, _this.options.isMultiValueField);
            _this.cleanupDeltaValuesForMultiValueField();
            _this.rebuildValueElements();
            _this.hideWaitingAnimation();
        });
    };
    Facet.prototype.updateNumberOfValues = function () {
        if (this.currentPage <= 0) {
            // We're on the first page, let's reset the number of values to a minimum.
            this.currentPage = 0;
            this.numberOfValues = 0;
        }
        else {
            // Calculate the number of value with the current page.
            this.numberOfValues = this.options.numberOfValues + this.currentPage * this.options.pageSize;
        }
        // Make sure we have at least the absolute minimum of value to display.
        this.numberOfValues = Math.max(this.numberOfValues, this.getMinimumNumberOfValuesToDisplay());
    };
    Facet.prototype.getMinimumNumberOfValuesToDisplay = function () {
        // The min value is the number of used values.
        var minValue = this.values.getExcluded().length + this.values.getSelected().length;
        // When using a custom sort, we have to show all values between the selected ones.
        // Thus, we must find the last selected value after a reorder and use that value as the number of value.
        if (this.options.customSort != null && this.facetSort != null && this.options.customSort.length > 0) {
            var lastSelectedValueIndex_1 = -1;
            new FacetValuesOrder_1.FacetValuesOrder(this, this.facetSort).reorderValues(this.values.getAll()).forEach(function (facetValue, index) {
                if (facetValue.selected) {
                    lastSelectedValueIndex_1 = index;
                }
            });
            minValue = lastSelectedValueIndex_1 + 1;
        }
        return Math.max(minValue, this.options.numberOfValues);
    };
    Facet.prototype.cleanupDeltaValuesForMultiValueField = function () {
        var _this = this;
        // On a multi value field, it's possible to end up in a scenario where many of the current values are empty
        // Crop those out, and adjust the nbAvailable values for the "search" and "show more";
        if (this.options.isMultiValueField) {
            _.each(this.values.getAll(), function (v) {
                if (v.occurrences == 0 && !v.selected && !v.excluded) {
                    _this.values.remove(v.value);
                }
            });
            this.nbAvailableValues = this.values.getAll().length;
        }
    };
    Facet.prototype.shouldRenderFacetSearch = function () {
        return this.options.enableFacetSearch;
    };
    Facet.prototype.shouldRenderMoreLess = function () {
        return this.options.enableMoreLess;
    };
    Facet.prototype.debugInfo = function () {
        var info = {};
        info[this['constructor']['ID']] = {
            component: this,
            groupByRequest: this.facetQueryController.lastGroupByRequest,
            groupByResult: this.facetQueryController.lastGroupByResult
        };
        return info;
    };
    Facet.ID = 'Facet';
    Facet.omniboxIndex = 50;
    Facet.doExport = function () {
        GlobalExports_1.exportGlobally({
            Facet: Facet,
            FacetHeader: FacetHeader_1.FacetHeader,
            FacetSearchValuesList: FacetSearchValuesList_1.FacetSearchValuesList,
            FacetSettings: FacetSettings_1.FacetSettings,
            FacetSort: FacetSort_1.FacetSort,
            FacetUtils: FacetUtils_1.FacetUtils,
            FacetValueElement: FacetValueElement_1.FacetValueElement,
            FacetValue: FacetValues_1.FacetValue
        });
    };
    /**
     * The possible options for a facet
     * @componentOptions
     */
    Facet.options = __assign({ 
        /**
         * Specifies the title to display at the top of the facet.
         *
         * Default value is the localized string for `NoTitle`.
         */
        title: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption({
            defaultValue: Strings_1.l('NoTitle'),
            section: 'CommonOptions',
            priority: 10
        }), 
        /**
         * Specifies the index field whose values the facet should use.
         *
         * This requires the given field to be configured correctly in the index as a *Facet field* (see
         * [Adding Fields to a Source](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=137)).
         *
         * Specifying a value for this option is required for the `Facet` component to work.
         */
        field: ComponentOptions_1.ComponentOptions.buildFieldOption({ required: true, groupByField: true, section: 'CommonOptions' }), headerIcon: ComponentOptions_1.ComponentOptions.buildStringOption({
            deprecated: 'This option is exposed for legacy reasons, and the recommendation is to not use this option.'
        }), 
        /**
         * Specifies a unique identifier for the facet. Among other things, this identifier serves the purpose of saving
         * the facet state in the URL hash.
         *
         * If you have two facets with the same field on the same page, you should specify an `id` value for at least one of
         * those two facets. This `id` must be unique among the facets.
         *
         * Non-word characters except - @ $ _ . + ! * ' ( ) , , ( `^a-zA-Z0-9-@$_.+!*'(),,]+` ) are automatically removed from the `id` value.
         *
         * Default value is the [`field`]{@link Facet.options.field} option value.
         */
        id: ComponentOptions_1.ComponentOptions.buildStringOption({
            postProcessing: function (value, options) {
                if (value) {
                    // All non-word characters, except @ (the default character that specifies a field in the index)
                    // and characters that do no need to be encoded in the URL : - @ $ _ . + ! * ' ( ) , ,
                    var modified = value.replace(/[^a-zA-Z0-9-@$_.+!*'(),,]+/g, '');
                    if (Utils_1.Utils.isNullOrEmptyString(modified)) {
                        return options.field;
                    }
                    return modified;
                }
                return options.field;
            }
        }), 
        /**
         * Specifies whether the facet [`field`]{@link Facet.options.field} is configured in the index as a multi-value
         * field (semicolon separated values such as `abc;def;ghi`).
         *
         * Default value is `false`.
         */
        isMultiValueField: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'CommonOptions' }), 
        /**
         * Specifies the field whose values the Facet should display.
         *
         * @deprecated This option is exposed for legacy reasons. It is not recommended to use this option.
         */
        lookupField: ComponentOptions_1.ComponentOptions.buildFieldOption({
            deprecated: 'This option is exposed for legacy reasons. It is not recommended to use this option.'
        }), 
        /**
         * Specifies whether to display the facet **Settings** menu.
         *
         * See also the [`enableSettingsFacetState`]{@link Facet.options.enableSettingsFacetState},
         * [`availableSorts`]{@link Facet.options.availableSorts}, and
         * [`enableCollapse`]{@link Facet.options.enableCollapse} options.
         *
         * **Note:**
         * > The [`FacetRange`]{@link FacetRange} component does not support this option.
         *
         * Default value is `true`.
         */
        enableSettings: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true, section: 'Sorting', priority: 9 }), 
        /**
         * If the [`enableSettings`]{@link Facet.options.enableSettings} option is `true`, specifies whether the
         * **Save state** menu option is available in the facet **Settings** menu.
         *
         * **Note:**
         * > The [`FacetRange`]{@link FacetRange} component does not support this option.
         *
         * Default value is `false`.
         */
        enableSettingsFacetState: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false, depend: 'enableSettings' }), 
        /**
         * If the [`enableSettings`]{@link Facet.options.enableSettings} option is `true`, specifies the sort criteria
         * options to display in the facet **Settings** menu.
         *
         * Possible values are:
         * - `"occurrences"`
         * - `"score"`
         * - `"alphaascending"`
         * - `"alphadescending"`
         * - `"computedfieldascending"`
         * - `"computedfielddescending"`
         * - `"custom"`
         *
         * See {@link IGroupByRequest.sortCriteria} for a description of each possible value.
         *
         * **Notes:**
         * > * The [`FacetRange`]{@link FacetRange} component does not support this option.
         *
         * > * Using value captions will disable alphabetical sorts (see the [valueCaption]{@link Facet.options.valueCaption} option).
         *
         * Default value is `occurrences,score,alphaascending,alphadescending`.
         */
        availableSorts: ComponentOptions_1.ComponentOptions.buildListOption({
            defaultValue: ['occurrences', 'score', 'alphaascending', 'alphadescending'],
            section: 'Sorting',
            depend: 'enableSettings',
            values: [
                'Occurrences',
                'Score',
                'AlphaAscending',
                'AlphaDescending',
                'ComputedFieldAscending',
                'ComputedFieldDescending',
                'ChiSquare',
                'NoSort'
            ]
        }), 
        /**
         * Specifies the criteria to use to sort the facet values.
         *
         * See {@link IGroupByRequest.sortCriteria} for the list and description of possible values.
         *
         * Default value is the first sort criteria specified in the [`availableSorts`]{@link Facet.options.availableSorts}
         * option, or `occurrences` if no sort criteria is specified.
         */
        sortCriteria: ComponentOptions_1.ComponentOptions.buildStringOption({
            postProcessing: function (value, options) {
                return value || (options.availableSorts.length > 0 ? options.availableSorts[0] : 'occurrences');
            },
            section: 'Sorting'
        }), 
        /**
         * Specifies a custom order by which to sort the facet values.
         *
         * **Example:**
         *
         * You could use this option to specify a logical order for support tickets, such as:
         * ```html
         * <div class="CoveoFacet" data-field="@ticketstatus" data-title="Ticket Status" data-tab="All" data-custom-sort="New,Opened,Feedback,Resolved"></div>
         * ```
         *
         * **Note:**
         * > The [`FacetRange`]{@link FacetRange} component does not support this option.
         */
        customSort: ComponentOptions_1.ComponentOptions.buildListOption({ section: 'Sorting' }), 
        /**
         * Specifies the maximum number of field values to display by default in the facet before the user
         * clicks the arrow to show more.
         *
         * See also the [`enableMoreLess`]{@link Facet.options.enableMoreLess} option.
         */
        numberOfValues: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 5, min: 0, section: 'CommonOptions' }), 
        /**
         * Specifies the *injection depth* to use for the [`GroupByRequest`]{@link IGroupByRequest} operation.
         *
         * The injection depth determines how many results to scan in the index to ensure that the facet lists all potential
         * facet values. Increasing this value enhances the accuracy of the listed values at the cost of performance.
         *
         * Default value is `1000`. Minimum value is `0`.
         * @notSupportedIn salesforcefree
         */
        injectionDepth: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 1000, min: 0 }), showIcon: ComponentOptions_1.ComponentOptions.buildBooleanOption({
            defaultValue: false,
            deprecated: 'This option is exposed for legacy reasons. It is not recommended to use this option.'
        }), 
        /**
         * Specifies whether to use the `AND` operator in the resulting filter when multiple values are selected in the
         * facet.
         *
         * Setting this option to `true` means that items must have all of the selected values to match the resulting
         * query.
         *
         * Default value is `false`, which means that the filter uses the `OR` operator. Thus, by default, items must
         * have at least one of the selected values to match the query.
         */
        useAnd: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'Filtering' }), 
        /**
         * Specifies whether to allow the user to toggle between the `OR` and `AND` modes in the facet.
         *
         * Setting this option to `true` displays an icon in the top right corner of the facet. The user can click this icon
         * to toggle between between the two modes.
         *
         * Default value is `false`.
         */
        enableTogglingOperator: ComponentOptions_1.ComponentOptions.buildBooleanOption({
            defaultValue: false,
            alias: 'allowTogglingOperator'
        }), 
        /**
         * Specifies whether to display a search box at the bottom of the facet for searching among the available facet
         * [`field`]{@link Facet.options.field} values.
         *
         * See also the [`facetSearchDelay`]{@link Facet.options.facetSearchDelay},
         * [`facetSearchIgnoreAccents`]{@link Facet.options.facetSearchIgnoreAccents}, and
         * [`numberOfValuesInFacetSearch`]{@link Facet.options.numberOfValuesInFacetSearch} options.
         *
         * **Note:**
         * > The [`FacetRange`]{@link FacetRange} component does not support this option.
         *
         * Default value is `true`.
         */
        enableFacetSearch: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true, section: 'FacetSearch', priority: 8 }), 
        /**
         * If the [`enableFacetSearch`]{@link Facet.options.enableFacetSearch} option is `true`, specifies the delay (in
         * milliseconds) before sending a search request to the server when the user starts typing in the facet search box.
         *
         * Specifying a smaller value makes results appear faster. However, chances of having to cancel many requests
         * sent to the server increase as the user keeps on typing new characters.
         *
         * **Note:**
         * > The [`FacetRange`]{@link FacetRange} component does not support this option.
         *
         * Default value is `100`. Minimum value is `0`.
         */
        facetSearchDelay: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 100, min: 0, depend: 'enableFacetSearch' }), 
        /**
         * If the [`enableFacetSearch`]{@link Facet.options.enableFacetSearch} option is `true`, specifies whether to ignore
         * accents in the facet search box.
         *
         * **Note:**
         * > The [`FacetRange`]{@link FacetRange} component does not support this option.
         *
         * Default value is `false`.
         */
        facetSearchIgnoreAccents: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false, depend: 'enableFacetSearch' }), 
        /**
         * If the [`enableFacetSearch`]{@link Facet.options.enableFacetSearch} option is `true`, specifies the number of v
         * alues to display in the facet search results popup.
         *
         * **Note:**
         * > The [`FacetRange`]{@link FacetRange} component does not support this option.
         *
         * Default value is `15`. Minimum value is `1`.
         */
        numberOfValuesInFacetSearch: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 15, min: 1, section: 'FacetSearch' }), 
        /**
         * Specifies whether [wildcards]{@link AllowedValuesPatternType.wildcards} are used as the [allowedValuesPatternType]{@link IGroupByRequest.allowedValuesPatternType}
         * in the [groupBy]{@link IGroupByRequest} for the facet search.
         *
         * Enabling this option returns results that end with the entered value. For example, searching for `veo` would match with `Coveo`.
         *
         * **Note:**
         * > If you are experiencing slow facet search and/or timeouts when this option is set to `true`, consider enabling the **Use cache for nested queries**
         * > option on your facet [field]{@link Facet.options.field} in the Coveo Cloud Admninistration Console (see [Add/Edit a Field]{@link https://onlinehelp.coveo.com/en/cloud/add_edit_fields.htm}).
         */
        useWildcardsInFacetSearch: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'FacetSearch' }), 
        /**
         * Specifies whether the facet should push data to the [`Breadcrumb`]{@link Breadcrumb} component.
         *
         * See also the [`numberOfValuesInBreadcrumb`]{@link Facet.options.numberOfValuesInBreadcrumb} option.
         *
         * Default value is `true`.
         */
        includeInBreadcrumb: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }), 
        /**
         * If the [`includeInBreadcrumb`]{@link Facet.options.includeInBreadcrumb} option is `true`, specifies the maximum
         * number of values that the facet should display in the [`Breadcrumb`]{@link Breadcrumb} before outputting a
         * **more...** button.
         *
         * Default value is `5` on a desktop computer and `3` on a mobile device. Minimum value is `0`.
         */
        numberOfValuesInBreadcrumb: ComponentOptions_1.ComponentOptions.buildNumberOption({
            defaultFunction: function () { return (DeviceUtils_1.DeviceUtils.isMobileDevice() ? 3 : 5); },
            min: 0,
            depend: 'includeInBreadcrumb'
        }), 
        /**
         * Specifies whether the Facet should push data to the {@link Omnibox} component.
         *
         * See also {@link Facet.options.numberOfValuesInOmnibox}.
         *
         * Default value is `false`.
         *
         * @deprecated This option is exposed for legacy reasons. It is not recommended to use this option.
         */
        includeInOmnibox: ComponentOptions_1.ComponentOptions.buildBooleanOption({
            defaultValue: false,
            deprecated: 'This option is exposed for legacy reasons. It is not recommended to use this option.'
        }), 
        /**
         * When {@link Facet.options.includeInOmnibox} is `true`, specifies the number of values to populate the
         * {@link Breadcrumb} with.
         *
         * Default value is `5` on desktop computer and `3` on a mobile device. Minimum value is `0`.
         *
         * @deprecated This option is exposed for legacy reasons. It is not recommended to use this option.
         */
        numberOfValuesInOmnibox: ComponentOptions_1.ComponentOptions.buildNumberOption({
            defaultFunction: function () { return (DeviceUtils_1.DeviceUtils.isMobileDevice() ? 3 : 5); },
            min: 0,
            depend: 'includeInOmnibox',
            deprecated: 'This option is exposed for legacy reasons. It is not recommended to use this option.'
        }), 
        /**
         * Specifies the name of a field on which to execute an aggregate operation for all distinct values of the facet
         * [`field`]{@link Facet.options.field}.
         *
         * The facet displays the result of the operation along with the number of occurrences for each value.
         *
         * You can use this option to compute the sum of a field (like a money amount) for each listed facet value.
         *
         * Works in conjunction with the [`computedFieldOperation`]{@link Facet.options.computedFieldOperation},
         * [`computedFieldFormat`]{@link Facet.options.computedFieldFormat}, and
         * [`computedFieldCaption`]{@link Facet.options.computedFieldCaption} options.
         * @notSupportedIn salesforcefree
         */
        computedField: ComponentOptions_1.ComponentOptions.buildFieldOption({ priority: 7 }), 
        /**
         * Specifies the type of aggregate operation to perform on the [`computedField`]{@link Facet.options.computedField}.
         *
         * The possible values are:
         * - `sum` - Computes the sum of the computed field values.
         * - `average` - Computes the average of the computed field values.
         * - `minimum` - Finds the minimum value of the computed field values.
         * - `maximum` - Finds the maximum value of the computed field values.
         *
         * Default value is `sum`.
         * @notSupportedIn salesforcefree
         */
        computedFieldOperation: ComponentOptions_1.ComponentOptions.buildStringOption({ defaultValue: 'sum', section: 'ComputedField' }), 
        /**
         * Specifies how to format the values resulting from a
         * [`computedFieldOperation`]{@link Facet.options.computedFieldOperation}.
         *
         * The Globalize library defines all available formats (see
         * [Globalize](https://github.com/klaaspieter/jquery-global#globalizeformat-value-format-culture-)).
         *
         * The most commonly used formats are:
         * - `c0` - Formats the value as a currency.
         * - `n0` - Formats the value as an integer.
         * - `n2` - Formats the value as a floating point with 2 decimal digits.
         *
         * Default value is `"c0"`.
         * @notSupportedIn salesforcefree
         */
        computedFieldFormat: ComponentOptions_1.ComponentOptions.buildStringOption({ defaultValue: 'c0', section: 'ComputedField' }), 
        /**
         * Specifies what the caption of the [`computedField`]{@link Facet.options.computedField} should be in the facet
         * **Settings** menu for sorting.
         *
         * For example, setting this option to `"Money"` will display `"Money Ascending"` for computed field ascending.
         *
         * **Note:**
         * > The [`FacetRange`]{@link FacetRange} component does not support this option.
         *
         * Default value is the localized string for `ComputedField`.
         * @notSupportedIn salesforcefree
         */
        computedFieldCaption: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption({
            defaultValue: Strings_1.l('ComputedField'),
            section: 'ComputedField'
        }), 
        /**
         * Specifies whether the facet should remain stable in its current position in the viewport while the mouse cursor
         * is over it.
         *
         * Whenever the value selection changes in a facet, the search interface automatically performs a query. This new
         * query might cause other elements in the page to resize themselves (typically, other facets above or below the
         * one the user is interacting with).
         *
         * This option is responsible for adding the `<div class='coveo-topSpace'>` and
         * `<div class='coveo-bottomSpace'>` around the Facet container. The Facet adjusts the scroll amount of the page to
         * ensure that it does not move relatively to the mouse when the results are updated.
         *
         * In some cases, the facet also adds margins to the `scrollContainer`, if scrolling alone is not enough to
         * preserve position.
         *
         * See also the [`paddingContainer`]{@link Facet.options.paddingContainer}, and
         * [`scrollContainer`]{@link Facet.options.scrollContainer} options.
         *
         * Default value is `true`.
         */
        preservePosition: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }), 
        /**
         * Specifies the parent container of the facets.
         *
         * Used by the [`preservePosition`]{@link Facet.options.preservePosition} option.
         *
         * Default value is `element.parentElement`.
         */
        paddingContainer: ComponentOptions_1.ComponentOptions.buildSelectorOption({
            defaultFunction: function (element) {
                var standardColumn = Dom_1.$$(element).parent('coveo-facet-column');
                if (standardColumn != null) {
                    return standardColumn;
                }
                return element.parentElement;
            }
        }), 
        /**
         * Specifies the HTML element (through a CSS selector) whose scroll amount the facet should adjust to preserve its
         * position when results are updated.
         *
         * Used by the [`preservePosition`]{@link Facet.options.preservePosition} option.
         *
         * Default value is `document.body`.
         */
        scrollContainer: ComponentOptions_1.ComponentOptions.buildSelectorOption({ defaultFunction: function (element) { return document.body; } }), 
        /**
         * Specifies whether to enable the **More** and **Less** buttons in the Facet.
         *
         * See also the [`pageSize`]{@link Facet.options.pageSize} option.
         *
         * **Note:**
         * > The [`FacetRange`]{@link FacetRange} component does not support this option.
         *
         * Default value is `true`.
         */
        enableMoreLess: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }), 
        /**
         * If the [`enableMoreLess`]{@link Facet.options.enableMoreLess} option is `true`, specifies the number of
         * additional results to fetch when clicking the **More** button.
         *
         * **Note:**
         * > The [`FacetRange`]{@link FacetRange} component does not support this option.
         *
         * Default value is `10`. Minimum value is `1`.
         */
        pageSize: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 10, min: 1, depend: 'enableMoreLess' }), 
        /**
         * If the [`enableSettings`]{@link Facet.options.enableSettings} option is `true`, specifies whether the
         * **Collapse \ Expand** menu option is available in the facet **Settings** menu.
         *
         * **Note:**
         * > The [`FacetRange`]{@link FacetRange} component does not support this option.
         *
         * Default value is `true`.
         */
        enableCollapse: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true, depend: 'enableSettings' }), 
        /**
         * Specifies an explicit list of [`allowedValues`]{@link IGroupByRequest.allowedValues} in the
         * [`GroupByRequest`]{@link IGroupByRequest}.
         *
         * If you specify a list of values for this option, the facet uses only these values (if they are available in
         * the current result set).
         *
         * **Example:**
         *
         * The following facet only uses the `Contact`, `Account`, and `File` values of the `@objecttype` field. Even if the
         * current result set contains other `@objecttype` values, such as `Message`, or `Product`, the facet does not use
         * those other values.
         *
         * ```html
         *
         * <div class="CoveoFacet" data-field="@objecttype" data-title="Object Type" data-tab="All" data-allowed-values="Contact,Account,File"></div>
         * ```
         *
         * Default value is `undefined`, and the facet uses all available values for its
         * [`field`]{@link Facet.options.field} in the current result set.
         */
        allowedValues: ComponentOptions_1.ComponentOptions.buildListOption(), 
        /**
         * Specifies an additional query expression (query override) to add to each
         * [`GroupByRequest`]{@link IGroupByRequest} that this facet performs.
         *
         * Example: `@date>=2014/01/01`
         * @notSupportedIn salesforcefree
         */
        additionalFilter: ComponentOptions_1.ComponentOptions.buildQueryExpressionOption(), 
        /**
         * Specifies whether this facet only appears when a value is selected in its "parent" facet.
         *
         * To specify the parent facet, use its [`id`]{@link Facet.options.id}.
         *
         * Remember that by default, a facet `id` value is the same as its [`field`]{@link Facet.options.field} option
         * value.
         *
         * **Examples:**
         *
         * First case: the "parent" facet has no custom `id`:
         * ```html
         * <!-- "Parent" Facet: -->
         * <div class='CoveoFacet' data-field='@myfield' data-title='My Parent Facet'></div>
         *
         * <!-- The "dependent" Facet must refer to the default `id` of its "parent" Facet, which is the name of its field. -->
         * <div class='CoveoFacet' data-field='@myotherfield' data-title='My Dependent Facet' data-depends-on='@myfield'></div>
         * ```
         *
         * Second case: the "parent" facet has a custom `id`:
         * ```html
         * <!-- "Parent" Facet: -->
         * <div class='CoveoFacet' data-field='@myfield' data-title='My Parent Facet' data-id='myParentCustomId'></div>
         *
         * <!-- The "dependent" Facet must refer to the custom `id` of its "parent" Facet, which is 'myParentCustomId'. -->
         * <div class='CoveoFacet' data-field='@myotherfield' data-title='My Dependent Facet' data-depends-on='myParentCustomId'></div>
         * ```
         *
         * Default value is `undefined`
         */
        dependsOn: ComponentOptions_1.ComponentOptions.buildStringOption(), 
        /**
         * Specifies a JSON object describing a mapping of facet values to their desired captions. See
         * [Normalizing Facet Value Captions](https://developers.coveo.com/x/jBsvAg).
         *
         * **Examples:**
         *
         * You can set the option in the ['init']{@link init} call:
         * ```javascript
         * var myValueCaptions = {
         *   "txt" : "Text files",
         *   "html" : "Web page",
         *   [ ... ]
         * };
         *
         * Coveo.init(document.querySelector("#search"), {
         *   Facet : {
         *     valueCaption : myValueCaptions
         *   }
         * });
         * ```
         *
         * Or before the `init` call, using the ['options']{@link options} top-level function:
         * ```javascript
         * Coveo.options(document.querySelector("#search"), {
         *   Facet : {
         *     valueCaption : myValueCaptions
         *   }
         * });
         * ```
         *
         * Or directly in the markup:
         * ```html
         * <!-- Ensure that the double quotes are properly handled in data-value-caption. -->
         * <div class='CoveoFacet' data-field='@myotherfield' data-value-caption='{"txt":"Text files","html":"Web page"}'></div>
         * ```
         *
         * **Note:**
         * > Using value captions will disable alphabetical sorts (see the [availableSorts]{@link Facet.options.availableSorts} option).
         */
        valueCaption: ComponentOptions_1.ComponentOptions.buildJsonOption() }, ResponsiveFacetOptions_1.ResponsiveFacetOptions);
    return Facet;
}(Component_1.Component));
exports.Facet = Facet;
Initialization_1.Initialization.registerAutoCreateComponent(Facet);
Facet.doExport();


/***/ }),

/***/ 70:
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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Component_1 = __webpack_require__(6);
var Strings_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var Dom_1 = __webpack_require__(1);
var Initialization_1 = __webpack_require__(2);
var GlobalExports_1 = __webpack_require__(3);
var CategoryFacetTemplates_1 = __webpack_require__(382);
var CategoryValueRoot_1 = __webpack_require__(383);
var CategoryFacetQueryController_1 = __webpack_require__(385);
var SVGDom_1 = __webpack_require__(14);
var SVGIcons_1 = __webpack_require__(13);
var QueryStateModel_1 = __webpack_require__(12);
__webpack_require__(386);
var Model_1 = __webpack_require__(16);
var Utils_1 = __webpack_require__(4);
var underscore_1 = __webpack_require__(0);
var Assert_1 = __webpack_require__(5);
var QueryEvents_1 = __webpack_require__(10);
var CategoryFacetSearch_1 = __webpack_require__(387);
var BreadcrumbEvents_1 = __webpack_require__(37);
var CategoryFacetBreadcrumb_1 = __webpack_require__(389);
var AnalyticsActionListMeta_1 = __webpack_require__(9);
var CategoryFacetDebug_1 = __webpack_require__(390);
var QueryBuilder_1 = __webpack_require__(36);
var ResponsiveFacets_1 = __webpack_require__(160);
var ResponsiveFacetOptions_1 = __webpack_require__(81);
var CategoryFacetHeader_1 = __webpack_require__(391);
var AccessibleButton_1 = __webpack_require__(17);
/**
 * The `CategoryFacet` component is a facet that renders values in a hierarchical fashion. It determines the filter to apply depending on the
 * current selected path of values.
 *
 * The path is a sequence of values that leads to a specific value in the hierarchy.
 * It is an array listing all the parents of a file (e.g., `['c', 'folder1']` for the `c:\folder1\text1.txt` file).
 *
 * This facet requires a [`field`]{@link CategoryFacet.options.field} with a special format to work correctly (see [Using the Category Facet Component](https://docs.coveo.com/en/2667)).
 */
var CategoryFacet = /** @class */ (function (_super) {
    __extends(CategoryFacet, _super);
    function CategoryFacet(element, options, bindings) {
        var _this = _super.call(this, element, 'CategoryFacet', bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.listenToQueryStateChange = true;
        _this.moreValuesToFetch = true;
        _this.showingWaitAnimation = false;
        _this.numberOfChildValuesCurrentlyDisplayed = 0;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, CategoryFacet, options);
        _this.categoryFacetQueryController = new CategoryFacetQueryController_1.CategoryFacetQueryController(_this);
        _this.categoryFacetTemplates = new CategoryFacetTemplates_1.CategoryFacetTemplates();
        _this.categoryValueRoot = new CategoryValueRoot_1.CategoryValueRoot(Dom_1.$$(_this.element), _this.categoryFacetTemplates, _this);
        _this.categoryValueRoot.path = _this.activePath;
        _this.currentPage = 0;
        _this.numberOfValues = _this.options.numberOfValues;
        _this.tryToInitFacetSearch();
        if (_this.options.debug) {
            new CategoryFacetDebug_1.CategoryFacetDebug(_this);
        }
        ResponsiveFacets_1.ResponsiveFacets.init(_this.root, _this, _this.options);
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.buildingQuery, function (args) { return _this.handleBuildingQuery(args); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.querySuccess, function (args) { return _this.handleQuerySuccess(args); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.duringQuery, function () { return _this.addFading(); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.deferredQuerySuccess, function () { return _this.removeFading(); });
        _this.bind.onRootElement(BreadcrumbEvents_1.BreadcrumbEvents.populateBreadcrumb, function (args) { return _this.handlePopulateBreadCrumb(args); });
        _this.bind.onRootElement(BreadcrumbEvents_1.BreadcrumbEvents.clearBreadcrumb, function () { return _this.handleClearBreadcrumb(); });
        _this.buildFacetHeader();
        _this.initQueryStateEvents();
        return _this;
    }
    CategoryFacet.prototype.isCurrentlyDisplayed = function () {
        return this.isPristine() ? this.hasValues : true;
    };
    Object.defineProperty(CategoryFacet.prototype, "activePath", {
        get: function () {
            return this.queryStateModel.get(this.queryStateAttribute) || this.options.basePath;
        },
        set: function (newPath) {
            this.listenToQueryStateChange = false;
            this.queryStateModel.set(this.queryStateAttribute, newPath);
            this.listenToQueryStateChange = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CategoryFacet.prototype, "queryStateAttribute", {
        get: function () {
            return QueryStateModel_1.QueryStateModel.getFacetId(this.options.id);
        },
        enumerable: true,
        configurable: true
    });
    CategoryFacet.prototype.handleBuildingQuery = function (args) {
        this.positionInQuery = this.categoryFacetQueryController.putCategoryFacetInQueryBuilder(args.queryBuilder, this.activePath, this.numberOfValues + 1);
    };
    CategoryFacet.prototype.tryToInitFacetSearch = function () {
        if (!this.isFacetSearchAvailable) {
            return this.logDisabledFacetSearchWarning();
        }
        this.categoryFacetSearch = new CategoryFacetSearch_1.CategoryFacetSearch(this);
    };
    CategoryFacet.prototype.logDisabledFacetSearchWarning = function () {
        if (this.isEnableFacetSearchFalsy) {
            return;
        }
        var valueCaptionAttributeName = this.getOptionAttributeName('valueCaption');
        var enableFacetSearchAttributeName = this.getOptionAttributeName('enableFacetSearch');
        var field = this.options.field;
        this.logger.warn("The search box is disabled on the " + field + " CategoryFacet. To hide this warning,\n    either remove the " + valueCaptionAttributeName + " option or set the " + enableFacetSearchAttributeName + " option to \"false\".");
    };
    CategoryFacet.prototype.getOptionAttributeName = function (optionName) {
        return ComponentOptions_1.ComponentOptions.attrNameFromName(optionName);
    };
    Object.defineProperty(CategoryFacet.prototype, "isFacetSearchAvailable", {
        get: function () {
            if (this.areValueCaptionsSpecified) {
                return false;
            }
            if (this.isEnableFacetSearchFalsy) {
                return false;
            }
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CategoryFacet.prototype, "areValueCaptionsSpecified", {
        get: function () {
            var valueCaptions = this.options.valueCaption;
            return underscore_1.keys(valueCaptions).length !== 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CategoryFacet.prototype, "isEnableFacetSearchFalsy", {
        get: function () {
            return !this.options.enableFacetSearch;
        },
        enumerable: true,
        configurable: true
    });
    CategoryFacet.prototype.handleNoResults = function () {
        if (this.isPristine()) {
            this.hide();
            return;
        }
        if (this.hasValues) {
            this.show();
            return;
        }
        this.activePath = this.options.basePath;
        this.hide();
    };
    CategoryFacet.prototype.handleQuerySuccess = function (args) {
        if (Utils_1.Utils.isNullOrUndefined(args.results.categoryFacets)) {
            this.notImplementedError();
            return;
        }
        if (Utils_1.Utils.isNullOrUndefined(args.results.categoryFacets[this.positionInQuery])) {
            this.handleNoResults();
            return;
        }
        var numberOfRequestedValues = args.query.categoryFacets[this.positionInQuery].maximumNumberOfValues;
        var categoryFacetResult = args.results.categoryFacets[this.positionInQuery];
        this.moreValuesToFetch = numberOfRequestedValues == categoryFacetResult.values.length;
        this.clear();
        if (categoryFacetResult.notImplemented) {
            this.notImplementedError();
            return;
        }
        if (categoryFacetResult.values.length == 0 && categoryFacetResult.parentValues.length == 0) {
            this.handleNoResults();
            return;
        }
        this.renderValues(categoryFacetResult, numberOfRequestedValues);
        if (this.isFacetSearchAvailable) {
            var facetSearch = this.categoryFacetSearch.build();
            Dom_1.$$(facetSearch).insertAfter(this.categoryValueRoot.listRoot.el);
        }
        this.moreLessContainer = Dom_1.$$('div', { className: 'coveo-category-facet-more-less-container' });
        Dom_1.$$(this.element).append(this.moreLessContainer.el);
        if (this.options.enableMoreLess) {
            this.renderMoreLess();
        }
        if (!this.isPristine()) {
            Dom_1.$$(this.element).addClass('coveo-category-facet-non-empty-path');
        }
    };
    /**
     * Changes the active path.
     *
     */
    CategoryFacet.prototype.changeActivePath = function (path) {
        this.activePath = path;
    };
    CategoryFacet.prototype.executeQuery = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.showWaitingAnimation();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 3, 4]);
                        return [4 /*yield*/, this.queryController.executeQuery()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        this.hideWaitingAnimation();
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Reloads the facet with the same path.
     */
    CategoryFacet.prototype.reload = function () {
        this.changeActivePath(this.activePath);
        this.logAnalyticsEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.categoryFacetReload);
        this.executeQuery();
    };
    /**
     * Returns all the visible parent values.
     * @returns simple object with three fields: `value`, `count` and `path`.
     */
    CategoryFacet.prototype.getVisibleParentValues = function () {
        return this.getVisibleParentCategoryValues().map(function (categoryValue) { return categoryValue.getDescriptor(); });
    };
    CategoryFacet.prototype.getVisibleParentCategoryValues = function () {
        if (this.categoryValueRoot.children.length == 0 || this.categoryValueRoot.children[0].children.length == 0) {
            return [];
        }
        var currentParentvalue = this.categoryValueRoot.children[0];
        var parentValues = [currentParentvalue];
        while (currentParentvalue.children.length != 0 && !Utils_1.Utils.arrayEqual(currentParentvalue.path, this.activePath)) {
            currentParentvalue = currentParentvalue.children[0];
            parentValues.push(currentParentvalue);
        }
        return parentValues;
    };
    /**
     * Shows more values according to {@link CategoryFacet.options.pageSize}.
     *
     * See the [`enableMoreLess`]{@link CategoryFacet.options.enableMoreLess}, and
     * [`numberOfValues`]{@link CategoryFacet.options.numberOfValues} options.
     */
    CategoryFacet.prototype.showMore = function () {
        if (this.moreValuesToFetch) {
            this.currentPage++;
            this.numberOfValues = this.options.numberOfValues + this.currentPage * this.options.pageSize;
            this.reload();
        }
    };
    /**
     * Shows less values, up to the original number of values.
     *
     * See the [`enableMoreLess`]{@link CategoryFacet.options.enableMoreLess}, and
     * [`numberOfValues`]{@link CategoryFacet.options.numberOfValues} options.
     */
    CategoryFacet.prototype.showLess = function () {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.numberOfValues = this.options.numberOfValues + this.currentPage * this.options.pageSize;
            this.reload();
        }
    };
    /**
     * Returns the values at the bottom of the hierarchy. These are the values that are not yet applied to the query.
     * @returns simple object with three fields: `value`, `count` and `path`.
     */
    CategoryFacet.prototype.getAvailableValues = function () {
        if (!this.activeCategoryValue) {
            return [];
        }
        return this.activeCategoryValue.children.map(function (categoryValue) {
            return {
                value: categoryValue.categoryValueDescriptor.value,
                count: categoryValue.categoryValueDescriptor.count,
                path: categoryValue.path
            };
        });
    };
    /**
     * Selects a value from the currently available values.
     * If the given value to select is not in the available values, it will throw an error.
     */
    CategoryFacet.prototype.selectValue = function (value) {
        Assert_1.Assert.check(underscore_1.contains(underscore_1.pluck(this.getAvailableValues(), 'value'), value), 'Failed while trying to select a value that is not available.');
        var newPath = this.activePath.slice(0);
        newPath.push(value);
        this.changeActivePath(newPath);
        this.logAnalyticsEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.categoryFacetSelect);
        this.executeQuery();
    };
    /**
     * Deselects the last value in the hierarchy that is applied to the query. When at the top of the hierarchy, this method does nothing.
     */
    CategoryFacet.prototype.deselectCurrentValue = function () {
        if (this.activePath.length == 0) {
            return;
        }
        var newPath = this.activePath.slice(0);
        newPath.pop();
        this.changeActivePath(newPath);
        this.logAnalyticsEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.categoryFacetSelect);
        this.executeQuery();
    };
    /**
     * Resets the facet to its initial state.
     */
    CategoryFacet.prototype.reset = function () {
        this.changeActivePath(this.options.basePath);
        this.logAnalyticsEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.categoryFacetClear);
        this.executeQuery();
    };
    CategoryFacet.prototype.disable = function () {
        _super.prototype.disable.call(this);
        this.hide();
    };
    /**
     * Hides the component.
     */
    CategoryFacet.prototype.hide = function () {
        Dom_1.$$(this.element).addClass('coveo-hidden');
    };
    /**
     * Shows the component.
     */
    CategoryFacet.prototype.show = function () {
        Dom_1.$$(this.element).removeClass('coveo-hidden');
    };
    /**
     * Goes through any value that contains the value parameter, and verifies whether there are missing parents.
     * Issues are then logged in the console.
     * If you do not want to specify a value, you can simply enable {@link CategoryFacet.options.debug} and do an empty query.
     */
    CategoryFacet.prototype.debugValue = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            var queryBuilder, queryResults;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryBuilder = new QueryBuilder_1.QueryBuilder();
                        this.categoryFacetQueryController.addDebugGroupBy(queryBuilder, value);
                        return [4 /*yield*/, this.queryController.getEndpoint().search(queryBuilder.build())];
                    case 1:
                        queryResults = _a.sent();
                        CategoryFacetDebug_1.CategoryFacetDebug.analyzeResults(queryResults.groupByResults[0], this.options.delimitingCharacter);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * @param value The string to find a caption for.
     * Returns the caption for a value or the value itself if no caption is available.
     */
    CategoryFacet.prototype.getCaption = function (value) {
        var valueCaptions = this.options.valueCaption;
        var caption = valueCaptions[value];
        return caption ? caption : value;
    };
    CategoryFacet.prototype.showWaitingAnimation = function () {
        this.ensureDom();
        if (!this.showingWaitAnimation) {
            Dom_1.$$(this.headerElement).find('.coveo-category-facet-header-wait-animation').style.visibility = 'visible';
            this.showingWaitAnimation = true;
        }
    };
    CategoryFacet.prototype.hideWaitingAnimation = function () {
        this.ensureDom();
        if (this.showingWaitAnimation) {
            Dom_1.$$(this.headerElement).find('.coveo-category-facet-header-wait-animation').style.visibility = 'hidden';
            this.showingWaitAnimation = false;
        }
    };
    CategoryFacet.prototype.logAnalyticsEvent = function (eventName, path) {
        if (path === void 0) { path = this.activePath; }
        this.usageAnalytics.logSearchEvent(eventName, {
            categoryFacetId: this.options.id,
            categoryFacetField: this.options.field.toString(),
            categoryFacetPath: path,
            categoryFacetTitle: this.options.title
        });
    };
    CategoryFacet.prototype.getEndpoint = function () {
        return this.queryController.getEndpoint();
    };
    Object.defineProperty(CategoryFacet.prototype, "children", {
        get: function () {
            return this.categoryValueRoot.children;
        },
        enumerable: true,
        configurable: true
    });
    CategoryFacet.prototype.renderValues = function (categoryFacetResult, numberOfRequestedValues) {
        this.show();
        var sortedParentValues = this.sortParentValues(categoryFacetResult.parentValues);
        var currentParentValue = this.categoryValueRoot;
        var needToTruncate = false;
        var pathOfLastTruncatedParentValue;
        var numberOfItemsInFirstSlice = Math.floor(CategoryFacet.NUMBER_OF_VALUES_TO_KEEP_AFTER_TRUNCATING / 2);
        var numberOfItemsInSecondSlice = Math.ceil(CategoryFacet.NUMBER_OF_VALUES_TO_KEEP_AFTER_TRUNCATING / 2);
        sortedParentValues = this.hideBasePathInParentValues(sortedParentValues);
        if (this.shouldTruncate(sortedParentValues)) {
            pathOfLastTruncatedParentValue = this.findPathOfLastTruncatedParentValue(sortedParentValues, numberOfItemsInSecondSlice);
            needToTruncate = true;
            sortedParentValues = underscore_1.first(sortedParentValues, numberOfItemsInFirstSlice).concat(underscore_1.last(sortedParentValues, numberOfItemsInSecondSlice));
        }
        if (!this.isPristine()) {
            this.addAllCategoriesButton();
        }
        for (var i = 0; i < sortedParentValues.length; i++) {
            currentParentValue = currentParentValue.renderAsParent(sortedParentValues[i]);
            // We do not want to make the "last" parent selectable, as clicking it would be a noop (re-selecting the same filter)
            var isLastParent = i == sortedParentValues.length - 1;
            if (!isLastParent) {
                currentParentValue.makeSelectable().showCollapseArrow();
            }
            if (needToTruncate) {
                if (i == numberOfItemsInFirstSlice - 1) {
                    this.addEllipsis();
                }
                if (i == numberOfItemsInFirstSlice) {
                    currentParentValue.path = pathOfLastTruncatedParentValue.concat([sortedParentValues[i].value]);
                }
            }
        }
        var childrenValuesToRender = this.moreValuesToFetch
            ? categoryFacetResult.values.slice(0, numberOfRequestedValues - 1)
            : categoryFacetResult.values.slice(0, numberOfRequestedValues);
        this.numberOfChildValuesCurrentlyDisplayed = childrenValuesToRender.length;
        currentParentValue.renderChildren(childrenValuesToRender);
        this.activeCategoryValue = currentParentValue;
    };
    CategoryFacet.prototype.hideBasePathInParentValues = function (parentValues) {
        if (Utils_1.Utils.arrayEqual(underscore_1.first(this.activePath, this.options.basePath.length), this.options.basePath)) {
            parentValues = underscore_1.last(parentValues, parentValues.length - this.options.basePath.length);
        }
        return parentValues;
    };
    CategoryFacet.prototype.shouldTruncate = function (parentValues) {
        return parentValues.length > CategoryFacet.MAXIMUM_NUMBER_OF_VALUES_BEFORE_TRUNCATING;
    };
    CategoryFacet.prototype.addEllipsis = function () {
        this.categoryValueRoot.listRoot.append(this.categoryFacetTemplates.buildEllipsis().el);
    };
    CategoryFacet.prototype.findPathOfLastTruncatedParentValue = function (sortedParentValues, numberOfItemsInSecondSlice) {
        var indexOfLastTruncatedParentValue = sortedParentValues.length - numberOfItemsInSecondSlice - 1;
        return underscore_1.reduce(underscore_1.first(sortedParentValues, indexOfLastTruncatedParentValue + 1), function (path, parentValue) { return path.concat([parentValue.value]); }, []);
    };
    CategoryFacet.prototype.addAllCategoriesButton = function () {
        var _this = this;
        var allCategories = this.categoryFacetTemplates.buildAllCategoriesButton();
        allCategories.on('click', function () { return _this.reset(); });
        this.categoryValueRoot.listRoot.append(allCategories.el);
    };
    CategoryFacet.prototype.isPristine = function () {
        return Utils_1.Utils.arrayEqual(this.activePath, this.options.basePath);
    };
    CategoryFacet.prototype.buildFacetHeader = function () {
        var facetHeader = new CategoryFacetHeader_1.CategoryFacetHeader({ categoryFacet: this, title: this.options.title });
        this.headerElement = facetHeader.build();
        Dom_1.$$(this.element).prepend(this.headerElement);
    };
    CategoryFacet.prototype.handleQueryStateChanged = function (data) {
        if (this.listenToQueryStateChange) {
            var path = data.attributes[this.queryStateAttribute];
            if (!Utils_1.Utils.isNullOrUndefined(path) && underscore_1.isArray(path) && path.length != 0) {
                this.activePath = path;
            }
        }
    };
    CategoryFacet.prototype.initQueryStateEvents = function () {
        var _this = this;
        this.queryStateModel.registerNewAttribute(this.queryStateAttribute, this.options.basePath);
        this.bind.onQueryState(Model_1.MODEL_EVENTS.CHANGE, undefined, function (data) { return _this.handleQueryStateChanged(data); });
    };
    CategoryFacet.prototype.addFading = function () {
        Dom_1.$$(this.element).addClass('coveo-category-facet-values-fade');
    };
    CategoryFacet.prototype.removeFading = function () {
        Dom_1.$$(this.element).removeClass('coveo-category-facet-values-fade');
    };
    CategoryFacet.prototype.notImplementedError = function () {
        var errorMessage = 'Category Facets are not supported by your current search endpoint. Disabling this component.';
        this.logger.error(errorMessage);
        this.disable();
    };
    CategoryFacet.prototype.sortParentValues = function (parentValues) {
        if (this.activePath.length != parentValues.length) {
            this.logger.warn('Inconsistent CategoryFacet results: Number of parent values results does not equal length of active path');
            return parentValues;
        }
        var sortedParentvalues = [];
        var _loop_1 = function (pathElement) {
            var currentParentValue = underscore_1.find(parentValues, function (parentValue) { return parentValue.value.toLowerCase() == pathElement.toLowerCase(); });
            if (!currentParentValue) {
                this_1.logger.warn('Inconsistent CategoryFacet results: path not consistent with parent values results');
                return { value: parentValues };
            }
            sortedParentvalues.push(currentParentValue);
        };
        var this_1 = this;
        for (var _i = 0, _a = this.activePath; _i < _a.length; _i++) {
            var pathElement = _a[_i];
            var state_1 = _loop_1(pathElement);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        return sortedParentvalues;
    };
    CategoryFacet.prototype.renderMoreLess = function () {
        if (this.numberOfChildValuesCurrentlyDisplayed > this.options.numberOfValues) {
            this.moreLessContainer.append(this.buildLessButton());
        }
        if (this.moreValuesToFetch) {
            this.moreLessContainer.append(this.buildMoreButton());
        }
    };
    CategoryFacet.prototype.clear = function () {
        this.categoryValueRoot.clear();
        if (this.isFacetSearchAvailable) {
            this.categoryFacetSearch.clear();
        }
        this.moreLessContainer && this.moreLessContainer.detach();
        Dom_1.$$(this.element).removeClass('coveo-category-facet-non-empty-path');
    };
    CategoryFacet.prototype.buildMoreButton = function () {
        var _this = this;
        var svgContainer = Dom_1.$$('span', { className: 'coveo-facet-more-icon' }, SVGIcons_1.SVGIcons.icons.arrowDown).el;
        SVGDom_1.SVGDom.addClassToSVGInContainer(svgContainer, 'coveo-facet-more-icon-svg');
        var more = Dom_1.$$('div', { className: 'coveo-category-facet-more' }, svgContainer);
        new AccessibleButton_1.AccessibleButton()
            .withElement(more)
            .withSelectAction(function () { return _this.showMore(); })
            .withLabel(Strings_1.l('ExpandFacet', this.options.title))
            .build();
        return more.el;
    };
    CategoryFacet.prototype.buildLessButton = function () {
        var _this = this;
        var svgContainer = Dom_1.$$('span', { className: 'coveo-facet-less-icon' }, SVGIcons_1.SVGIcons.icons.arrowUp).el;
        SVGDom_1.SVGDom.addClassToSVGInContainer(svgContainer, 'coveo-facet-less-icon-svg');
        var less = Dom_1.$$('div', { className: 'coveo-category-facet-less' }, svgContainer);
        new AccessibleButton_1.AccessibleButton()
            .withElement(less)
            .withSelectAction(function () { return _this.showLess(); })
            .withLabel(Strings_1.l('CollapseFacet', this.options.title))
            .build();
        return less.el;
    };
    CategoryFacet.prototype.handlePopulateBreadCrumb = function (args) {
        var _this = this;
        if (this.isPristine()) {
            return;
        }
        var lastParentValue = this.getVisibleParentValues().pop();
        if (!lastParentValue) {
            // This means we're in a special corner case where the current base path is configured
            // to one level before the last values in the tree.
            // In that case, there's simply no parent, so we must tweak things a bit so it plays nicely with the breadcrumb.
            // We can simulate the "last parent value" as being the current active path itself.
            lastParentValue = this.activeCategoryValue.getDescriptor();
        }
        var resetFacet = function () {
            _this.logAnalyticsEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.breadcrumbFacet);
            _this.reset();
        };
        var categoryFacetBreadcrumbBuilder = new CategoryFacetBreadcrumb_1.CategoryFacetBreadcrumb(this, resetFacet, lastParentValue);
        args.breadcrumbs.push({ element: categoryFacetBreadcrumbBuilder.build() });
    };
    CategoryFacet.prototype.handleClearBreadcrumb = function () {
        this.changeActivePath(this.options.basePath);
    };
    Object.defineProperty(CategoryFacet.prototype, "hasValues", {
        get: function () {
            return this.getAvailableValues().length > 0;
        },
        enumerable: true,
        configurable: true
    });
    CategoryFacet.doExport = function () {
        GlobalExports_1.exportGlobally({
            CategoryFacet: CategoryFacet
        });
    };
    CategoryFacet.ID = 'CategoryFacet';
    /**
     * The options for the component
     * @componentOptions
     */
    CategoryFacet.options = __assign({ 
        /**
         * The index field whose values the facet should use. The field values should have the form:
         * `the; the|path; the|path|to; the|path|to|given; the|path|to|given|item;`
         * where the delimiting character is `|`. This default delimiting character can be changed using the [delimitingCharacter]{@link CategoryFacet.options.delimitingCharacter} option.
         *
         * To help you verify whether your fields are setup correctly, see the {@link CategoryFacet.options.debug} option
         * and the {@link CategoryFacet.debugValue} method.
         *
         * See [Using the Category Facet Component](https://docs.coveo.com/en/2667).
         */
        field: ComponentOptions_1.ComponentOptions.buildFieldOption({ required: true }), 
        /**
         * The title to display at the top of the facet.
         *
         * Default value is the localized string for `NoTitle`.
         */
        title: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption({
            defaultValue: Strings_1.l('NoTitle')
        }), 
        /**
         * The maximum number of field values to display by default in the facet before the user
         * clicks the arrow to show more.
         *
         * See also the [`enableMoreLess`]{@link CategoryFacet.options.enableMoreLess} option.
         */
        numberOfValues: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 5, min: 0, section: 'CommonOptions' }), 
        /**
         * Whether to display a search box at the bottom of the facet for searching among the available facet
         * [`field`]{@link CategoryFacet.options.field} values.
         *
         * See also the [`facetSearchDelay`]{@link CategoryFacet.options.facetSearchDelay}, and
         * [`numberOfResultsInFacetSearch`]{@link CategoryFacet.options.numberOfResultsInFacetSearch} options.
         *
         *
         * Default value is `true`.
         */
        enableFacetSearch: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }), 
        /**
         * A unique identifier for the facet. Among other things, this identifier serves the purpose of saving
         * the facet state in the URL hash.
         *
         * If you have two facets with the same field on the same page, you should specify an `id` value for at least one of
         * those two facets. This `id` must be unique among the facets.
         *
         * Default value is the [`field`]{@link CategoryFacet.options.field} option value.
         */
        id: ComponentOptions_1.ComponentOptions.buildStringOption({
            postProcessing: function (value, options) { return value || options.field; }
        }), 
        /**
         * The *injection depth* to use.
         *
         * The injection depth determines how many results to scan in the index to ensure that the category facet lists all potential
         * facet values. Increasing this value enhances the accuracy of the listed values at the cost of performance.
         *
         * Default value is `1000`. Minimum value is `0`.
         * @notSupportedIn salesforcefree
         */
        injectionDepth: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 1000, min: 0 }), 
        /**
         * If the [`enableFacetSearch`]{@link CategoryFacet.options.enableFacetSearch} option is `true`, specifies the number of
         * values to display in the facet search results popup.
         *
         * Default value is `15`. Minimum value is `1`.
         */
        numberOfResultsInFacetSearch: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 15, min: 1 }), 
        /**
         * If the [`enableFacetSearch`]{@link CategoryFacet.options.enableFacetSearch} option is `true`, specifies the delay (in
         * milliseconds) before sending a search request to the server when the user starts typing in the category facet search box.
         *
         * Specifying a smaller value makes results appear faster. However, chances of having to cancel many requests
         * sent to the server increase as the user keeps on typing new characters.
         *
         * Default value is `100`. Minimum value is `0`.
         */
        facetSearchDelay: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 100, min: 0 }), 
        /**
         * Whether to enable the **More** and **Less** buttons in the Facet.
         *
         * See also the [`pageSize`]{@link CategoryFacet.options.pageSize} option.
         *
         * Default value is `true`.
         */
        enableMoreLess: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }), 
        /**
         * If the [`enableMoreLess`]{@link CategoryFacet.options.enableMoreLess} option is `true`, specifies the number of
         * additional results to fetch when clicking the **More** button.
         *
         * Default value is `10`. Minimum value is `1`.
         */
        pageSize: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 10, min: 1, depend: 'enableMoreLess' }), 
        /**
         * The character that specifies the hierarchical dependency.
         *
         * **Example:**
         *
         * If your field has the following values:
         *
         * `@field: c; c>folder2; c>folder2>folder3;`
         *
         * The delimiting character is `>`.
         *
         * Default value is `|`.
         */
        delimitingCharacter: ComponentOptions_1.ComponentOptions.buildStringOption({ defaultValue: '|' }), 
        /**
         * The path to use as the path prefix for every query.
         *
         * **Example:**
         *
         * You have the following files indexed on a file system:
         * ```
         * c:\
         *    folder1\
         *      text1.txt
         *    folder2\
         *      folder3\
         *        text2.txt
         * ```
         * Setting the `basePath` to `c` would display `folder1` and `folder2` in the `CategoryFacet`, but omit `c`.
         *
         * This options accepts an array of values. To specify a "deeper" starting path in your tree, you need to use comma-separated values.
         *
         * For example, setting `data-base-path="c,folder1"` on the component markup would display `folder3` in the `CategoryFacet`, but omit `c` and `folder1`.
         *
         */
        basePath: ComponentOptions_1.ComponentOptions.buildListOption({ defaultValue: [] }), 
        /**
         * The maximum number of levels to traverse in the hierarchy.
         * This option does not count the length of the base path. The depth depends on what is shown in the interface.
         *
         * Default value is `Number.MAX_VALUE`.
         */
        maximumDepth: ComponentOptions_1.ComponentOptions.buildNumberOption({ min: 1, defaultValue: Number.MAX_VALUE }), 
        /**
         * Whether to activate field format debugging.
         * This options logs messages in the console for any potential encountered issues.
         * This option can have negative effects on performance, and should only be activated when debugging.
         */
        debug: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }), 
        /**
         * Specifies a JSON object describing a mapping of facet values to their desired captions. See
         * [Normalizing Facet Value Captions](https://developers.coveo.com/x/jBsvAg).
         *
         * If this option is specified, the facet search box will be unavailable.
         *
         * **Examples:**
         *
         * You can set the option in the ['init']{@link init} call:
         * ```javascript
         * var myValueCaptions = {
         *   "txt" : "Text files",
         *   "html" : "Web page",
         *   [ ... ]
         * };
         *
         * Coveo.init(document.querySelector("#search"), {
         *   Facet : {
         *     valueCaption : myValueCaptions
         *   }
         * });
         * ```
         *
         * Or before the `init` call, using the ['options']{@link options} top-level function:
         * ```javascript
         * Coveo.options(document.querySelector("#search"), {
         *   Facet : {
         *     valueCaption : myValueCaptions
         *   }
         * });
         * ```
         *
         * Or directly in the markup:
         * ```html
         * <!-- Ensure that the double quotes are properly handled in data-value-caption. -->
         * <div class='CoveoCategoryFacet' data-field='@myotherfield' data-value-caption='{"txt":"Text files","html":"Web page"}'></div>
         * ```
         *
         * **Note:**
         * > Using value captions will disable alphabetical sorts (see the [availableSorts]{@link Facet.options.availableSorts} option).
         */
        valueCaption: ComponentOptions_1.ComponentOptions.buildJsonOption({ defaultValue: {} }) }, ResponsiveFacetOptions_1.ResponsiveFacetOptions);
    CategoryFacet.MAXIMUM_NUMBER_OF_VALUES_BEFORE_TRUNCATING = 15;
    CategoryFacet.NUMBER_OF_VALUES_TO_KEEP_AFTER_TRUNCATING = 10;
    CategoryFacet.WAIT_ELEMENT_CLASS = 'coveo-category-facet-header-wait-animation';
    return CategoryFacet;
}(Component_1.Component));
exports.CategoryFacet = CategoryFacet;
Initialization_1.Initialization.registerAutoCreateComponent(CategoryFacet);
CategoryFacet.doExport();


/***/ }),

/***/ 80:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var InitializationEvents_1 = __webpack_require__(15);
var Component_1 = __webpack_require__(6);
var SearchInterface_1 = __webpack_require__(18);
var Utils_1 = __webpack_require__(4);
var _ = __webpack_require__(0);
var QueryEvents_1 = __webpack_require__(10);
var Logger_1 = __webpack_require__(11);
var DeviceUtils_1 = __webpack_require__(26);
var underscore_1 = __webpack_require__(0);
var ResponsiveComponentsManager = /** @class */ (function () {
    function ResponsiveComponentsManager(root) {
        var _this = this;
        this.disabledComponents = [];
        this.responsiveComponents = [];
        this.coveoRoot = root;
        this.searchInterface = Component_1.Component.get(this.coveoRoot.el, SearchInterface_1.SearchInterface, false);
        this.dropdownHeadersWrapper = Dom_1.$$('div', {
            className: ResponsiveComponentsManager.DROPDOWN_HEADER_WRAPPER_CSS_CLASS
        });
        this.searchBoxElement = this.getSearchBoxElement();
        this.logger = new Logger_1.Logger(this);
        this.resizeListener = underscore_1.debounce(function () {
            if (_this.isAbleToDetermineMode()) {
                _this.addDropdownHeaderWrapperIfNeeded();
                if (_this.shouldSwitchToSmallMode()) {
                    _this.coveoRoot.addClass('coveo-small-interface');
                }
                else if (!_this.shouldSwitchToSmallMode()) {
                    _this.coveoRoot.removeClass('coveo-small-interface');
                }
                _.each(_this.responsiveComponents, function (responsiveComponent) {
                    responsiveComponent.handleResizeEvent();
                });
            }
            else {
                _this.logger
                    .warn("The width of the search interface is 0, cannot dispatch resize events to responsive components. This means that the tabs will not\n        automatically fit in the tab section. Also, the facet and recommendation component will not hide in a menu. Could the search\n        interface display property be none? Could its visibility property be set to hidden? Also, if either of these scenarios happen during\n        loading, it could be the cause of this issue.");
            }
        }, 250);
        // On many android devices, focusing on an input (eg: facet search input) causes the device to "zoom in"
        // and this triggers the window resize event. Since this class modify HTML nodes, Android has the quirks of removing the focus on the input.
        // As a net result, users focus on the text input, the keyboard appears for a few milliseconds, then dissapears instantly when the DOM is modified.
        // Since on a mobile device resizing the page is not something that should really happen, we disable it here.
        if (!DeviceUtils_1.DeviceUtils.isMobileDevice()) {
            window.addEventListener('resize', this.resizeListener);
        }
        this.bindNukeEvents();
    }
    // Register takes a class and will instantiate it after framework initialization has completed.
    ResponsiveComponentsManager.register = function (responsiveComponentConstructor, root, ID, component, options) {
        var _this = this;
        // options.initializationEventRoot can be set in some instance (like recommendation) where the root of the interface triggering the init event
        // is different from the one that will be used for calculation size.
        var initEventRoot = options.initializationEventRoot || root;
        initEventRoot.on(InitializationEvents_1.InitializationEvents.afterInitialization, function () {
            if (_this.shouldEnableResponsiveMode(root)) {
                var responsiveComponentsManager = _.find(_this.componentManagers, function (componentManager) { return root.el == componentManager.coveoRoot.el; });
                if (!responsiveComponentsManager) {
                    responsiveComponentsManager = new ResponsiveComponentsManager(root);
                    _this.componentManagers.push(responsiveComponentsManager);
                }
                if (!Utils_1.Utils.isNullOrUndefined(options.enableResponsiveMode) && !options.enableResponsiveMode) {
                    responsiveComponentsManager.disableComponent(ID);
                    return;
                }
                _this.componentInitializations.push({
                    responsiveComponentsManager: responsiveComponentsManager,
                    arguments: [responsiveComponentConstructor, root, ID, component, options]
                });
            }
            _this.remainingComponentInitializations--;
            if (_this.remainingComponentInitializations == 0) {
                _this.instantiateResponsiveComponents(); // necessary to verify if all components are disabled before they are initialized.
                if (root.width() == 0) {
                    var logger = new Logger_1.Logger('ResponsiveComponentsManager');
                    logger.info("Search interface width is 0, cannot dispatch resize events to responsive components. Will try again after first\n          query success.");
                    root.one(QueryEvents_1.QueryEvents.querySuccess, function () {
                        _this.resizeAllComponentsManager();
                    });
                }
                else {
                    _this.resizeAllComponentsManager();
                }
            }
        });
        this.remainingComponentInitializations++;
    };
    ResponsiveComponentsManager.shouldEnableResponsiveMode = function (root) {
        var searchInterface = Component_1.Component.get(root.el, SearchInterface_1.SearchInterface, true);
        return searchInterface instanceof SearchInterface_1.SearchInterface && searchInterface.options.enableAutomaticResponsiveMode;
    };
    ResponsiveComponentsManager.instantiateResponsiveComponents = function () {
        _.each(this.componentInitializations, function (componentInitialization) {
            var responsiveComponentsManager = componentInitialization.responsiveComponentsManager;
            responsiveComponentsManager.register.apply(responsiveComponentsManager, componentInitialization.arguments);
        });
    };
    ResponsiveComponentsManager.resizeAllComponentsManager = function () {
        _.each(this.componentManagers, function (componentManager) {
            componentManager.resizeListener();
        });
    };
    ResponsiveComponentsManager.prototype.register = function (responsiveComponentConstructor, root, ID, component, options) {
        if (this.isDisabled(ID)) {
            return;
        }
        if (!this.isActivated(ID)) {
            var responsiveComponent = new responsiveComponentConstructor(root, ID, options);
            if (this.isTabs(ID)) {
                this.responsiveComponents.push(responsiveComponent);
            }
            else {
                // Tabs need to be rendered last, so any dropdown header(eg: facet) is already there when the responsive tabs check for overflow.
                this.responsiveComponents.unshift(responsiveComponent);
            }
        }
        _.each(this.responsiveComponents, function (responsiveComponent) {
            if (responsiveComponent.registerComponent != null) {
                responsiveComponent.registerComponent(component);
            }
        });
    };
    ResponsiveComponentsManager.prototype.disableComponent = function (ID) {
        this.disabledComponents.push(ID);
    };
    ResponsiveComponentsManager.prototype.isDisabled = function (ID) {
        return _.indexOf(this.disabledComponents, ID) != -1;
    };
    ResponsiveComponentsManager.prototype.shouldSwitchToSmallMode = function () {
        var aComponentNeedsTabSection = this.needDropdownWrapper();
        var reachedBreakpoint = this.coveoRoot.width() <= this.searchInterface.responsiveComponents.getMediumScreenWidth();
        return aComponentNeedsTabSection || reachedBreakpoint;
    };
    ResponsiveComponentsManager.prototype.needDropdownWrapper = function () {
        for (var i = 0; i < this.responsiveComponents.length; i++) {
            var responsiveComponent = this.responsiveComponents[i];
            if (responsiveComponent.needDropdownWrapper && responsiveComponent.needDropdownWrapper()) {
                return true;
            }
        }
        return false;
    };
    ResponsiveComponentsManager.prototype.addDropdownHeaderWrapperIfNeeded = function () {
        if (this.needDropdownWrapper()) {
            var tabSection = Dom_1.$$(this.coveoRoot).find('.coveo-tab-section');
            if (this.searchBoxElement) {
                this.dropdownHeadersWrapper.insertAfter(this.searchBoxElement);
            }
            else if (tabSection) {
                this.dropdownHeadersWrapper.insertAfter(tabSection);
            }
            else {
                this.coveoRoot.prepend(this.dropdownHeadersWrapper.el);
            }
        }
    };
    ResponsiveComponentsManager.prototype.isTabs = function (ID) {
        return ID == 'Tab';
    };
    ResponsiveComponentsManager.prototype.isActivated = function (ID) {
        return _.find(this.responsiveComponents, function (current) { return current.ID == ID; }) != undefined;
    };
    ResponsiveComponentsManager.prototype.getSearchBoxElement = function () {
        var searchBoxElement = this.coveoRoot.find('.coveo-search-section');
        if (searchBoxElement) {
            return searchBoxElement;
        }
        else {
            return this.coveoRoot.find('.CoveoSearchbox');
        }
    };
    ResponsiveComponentsManager.prototype.bindNukeEvents = function () {
        var _this = this;
        Dom_1.$$(this.coveoRoot).on(InitializationEvents_1.InitializationEvents.nuke, function () {
            window.removeEventListener('resize', _this.resizeListener);
            // If the interface gets nuked, we need to remove all reference to componentManagers stored which match the current search interface
            ResponsiveComponentsManager.componentManagers = _.filter(ResponsiveComponentsManager.componentManagers, function (manager) { return manager.coveoRoot.el != _this.coveoRoot.el; });
        });
    };
    ResponsiveComponentsManager.prototype.isAbleToDetermineMode = function () {
        return this.coveoRoot.width() != 0 || this.searchInterface.options.responsiveMode !== 'auto';
    };
    ResponsiveComponentsManager.DROPDOWN_HEADER_WRAPPER_CSS_CLASS = 'coveo-dropdown-header-wrapper';
    ResponsiveComponentsManager.componentManagers = [];
    ResponsiveComponentsManager.remainingComponentInitializations = 0;
    ResponsiveComponentsManager.componentInitializations = [];
    return ResponsiveComponentsManager;
}());
exports.ResponsiveComponentsManager = ResponsiveComponentsManager;


/***/ }),

/***/ 81:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ComponentOptions_1 = __webpack_require__(8);
/**
 * ResponsiveFacets options
 */
exports.ResponsiveFacetOptions = {
    /**
     * Specifies whether to enable *responsive mode* for facets. Setting this options to `false` on any `Facet`, or
     * [`FacetSlider`]{@link FacetSlider} component in a search interface disables responsive mode for all other facets
     * in the search interface.
     *
     * Responsive mode displays all facets under a single dropdown button whenever the width of the HTML element which
     * the search interface is bound to reaches or falls behind a certain threshold (see
     * {@link SearchInterface.responsiveComponents}).
     *
     * See also the [`dropdownHeaderLabel`]{@link Facet.options.dropdownHeaderLabel} option.
     *
     * Default value is `true`.
     */
    enableResponsiveMode: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true, section: 'ResponsiveOptions' }),
    responsiveBreakpoint: ComponentOptions_1.ComponentOptions.buildNumberOption({
        deprecated: 'This option is exposed for legacy reasons. It is not recommended to use this option. Instead, use `SearchInterface.options.responsiveMediumBreakpoint` options exposed on the `SearchInterface`.'
    }),
    /**
     * If the [`enableResponsiveMode`]{@link Facet.options.enableResponsiveMode} option is `true` for all facets and
     * {@link FacetSlider.options.enableResponsiveMode} is also `true` for all sliders, specifies the label of the
     * dropdown button that allows to display the facets when in responsive mode.
     *
     * If more than one `Facet` or {@link FacetSlider} component in the search interface specifies a value for this
     * option, the framework uses the first occurrence of the option.
     *
     * Default value is `Filters`.
     */
    dropdownHeaderLabel: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption({ section: 'ResponsiveOptions' })
};


/***/ }),

/***/ 92:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(global) {/**!
 * @fileOverview Kickass library to create and place poppers near their reference elements.
 * @version 1.14.3
 * @license
 * Copyright (c) 2016 Federico Zivolo and contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

var longerTimeoutBrowsers = ['Edge', 'Trident', 'Firefox'];
var timeoutDuration = 0;
for (var i = 0; i < longerTimeoutBrowsers.length; i += 1) {
  if (isBrowser && navigator.userAgent.indexOf(longerTimeoutBrowsers[i]) >= 0) {
    timeoutDuration = 1;
    break;
  }
}

function microtaskDebounce(fn) {
  var called = false;
  return function () {
    if (called) {
      return;
    }
    called = true;
    window.Promise.resolve().then(function () {
      called = false;
      fn();
    });
  };
}

function taskDebounce(fn) {
  var scheduled = false;
  return function () {
    if (!scheduled) {
      scheduled = true;
      setTimeout(function () {
        scheduled = false;
        fn();
      }, timeoutDuration);
    }
  };
}

var supportsMicroTasks = isBrowser && window.Promise;

/**
* Create a debounced version of a method, that's asynchronously deferred
* but called in the minimum time possible.
*
* @method
* @memberof Popper.Utils
* @argument {Function} fn
* @returns {Function}
*/
var debounce = supportsMicroTasks ? microtaskDebounce : taskDebounce;

/**
 * Check if the given variable is a function
 * @method
 * @memberof Popper.Utils
 * @argument {Any} functionToCheck - variable to check
 * @returns {Boolean} answer to: is a function?
 */
function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

/**
 * Get CSS computed property of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Eement} element
 * @argument {String} property
 */
function getStyleComputedProperty(element, property) {
  if (element.nodeType !== 1) {
    return [];
  }
  // NOTE: 1 DOM access here
  var css = getComputedStyle(element, null);
  return property ? css[property] : css;
}

/**
 * Returns the parentNode or the host of the element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} parent
 */
function getParentNode(element) {
  if (element.nodeName === 'HTML') {
    return element;
  }
  return element.parentNode || element.host;
}

/**
 * Returns the scrolling parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} scroll parent
 */
function getScrollParent(element) {
  // Return body, `getScroll` will take care to get the correct `scrollTop` from it
  if (!element) {
    return document.body;
  }

  switch (element.nodeName) {
    case 'HTML':
    case 'BODY':
      return element.ownerDocument.body;
    case '#document':
      return element.body;
  }

  // Firefox want us to check `-x` and `-y` variations as well

  var _getStyleComputedProp = getStyleComputedProperty(element),
      overflow = _getStyleComputedProp.overflow,
      overflowX = _getStyleComputedProp.overflowX,
      overflowY = _getStyleComputedProp.overflowY;

  if (/(auto|scroll|overlay)/.test(overflow + overflowY + overflowX)) {
    return element;
  }

  return getScrollParent(getParentNode(element));
}

var isIE11 = isBrowser && !!(window.MSInputMethodContext && document.documentMode);
var isIE10 = isBrowser && /MSIE 10/.test(navigator.userAgent);

/**
 * Determines if the browser is Internet Explorer
 * @method
 * @memberof Popper.Utils
 * @param {Number} version to check
 * @returns {Boolean} isIE
 */
function isIE(version) {
  if (version === 11) {
    return isIE11;
  }
  if (version === 10) {
    return isIE10;
  }
  return isIE11 || isIE10;
}

/**
 * Returns the offset parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} offset parent
 */
function getOffsetParent(element) {
  if (!element) {
    return document.documentElement;
  }

  var noOffsetParent = isIE(10) ? document.body : null;

  // NOTE: 1 DOM access here
  var offsetParent = element.offsetParent;
  // Skip hidden elements which don't have an offsetParent
  while (offsetParent === noOffsetParent && element.nextElementSibling) {
    offsetParent = (element = element.nextElementSibling).offsetParent;
  }

  var nodeName = offsetParent && offsetParent.nodeName;

  if (!nodeName || nodeName === 'BODY' || nodeName === 'HTML') {
    return element ? element.ownerDocument.documentElement : document.documentElement;
  }

  // .offsetParent will return the closest TD or TABLE in case
  // no offsetParent is present, I hate this job...
  if (['TD', 'TABLE'].indexOf(offsetParent.nodeName) !== -1 && getStyleComputedProperty(offsetParent, 'position') === 'static') {
    return getOffsetParent(offsetParent);
  }

  return offsetParent;
}

function isOffsetContainer(element) {
  var nodeName = element.nodeName;

  if (nodeName === 'BODY') {
    return false;
  }
  return nodeName === 'HTML' || getOffsetParent(element.firstElementChild) === element;
}

/**
 * Finds the root node (document, shadowDOM root) of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} node
 * @returns {Element} root node
 */
function getRoot(node) {
  if (node.parentNode !== null) {
    return getRoot(node.parentNode);
  }

  return node;
}

/**
 * Finds the offset parent common to the two provided nodes
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element1
 * @argument {Element} element2
 * @returns {Element} common offset parent
 */
function findCommonOffsetParent(element1, element2) {
  // This check is needed to avoid errors in case one of the elements isn't defined for any reason
  if (!element1 || !element1.nodeType || !element2 || !element2.nodeType) {
    return document.documentElement;
  }

  // Here we make sure to give as "start" the element that comes first in the DOM
  var order = element1.compareDocumentPosition(element2) & Node.DOCUMENT_POSITION_FOLLOWING;
  var start = order ? element1 : element2;
  var end = order ? element2 : element1;

  // Get common ancestor container
  var range = document.createRange();
  range.setStart(start, 0);
  range.setEnd(end, 0);
  var commonAncestorContainer = range.commonAncestorContainer;

  // Both nodes are inside #document

  if (element1 !== commonAncestorContainer && element2 !== commonAncestorContainer || start.contains(end)) {
    if (isOffsetContainer(commonAncestorContainer)) {
      return commonAncestorContainer;
    }

    return getOffsetParent(commonAncestorContainer);
  }

  // one of the nodes is inside shadowDOM, find which one
  var element1root = getRoot(element1);
  if (element1root.host) {
    return findCommonOffsetParent(element1root.host, element2);
  } else {
    return findCommonOffsetParent(element1, getRoot(element2).host);
  }
}

/**
 * Gets the scroll value of the given element in the given side (top and left)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {String} side `top` or `left`
 * @returns {number} amount of scrolled pixels
 */
function getScroll(element) {
  var side = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'top';

  var upperSide = side === 'top' ? 'scrollTop' : 'scrollLeft';
  var nodeName = element.nodeName;

  if (nodeName === 'BODY' || nodeName === 'HTML') {
    var html = element.ownerDocument.documentElement;
    var scrollingElement = element.ownerDocument.scrollingElement || html;
    return scrollingElement[upperSide];
  }

  return element[upperSide];
}

/*
 * Sum or subtract the element scroll values (left and top) from a given rect object
 * @method
 * @memberof Popper.Utils
 * @param {Object} rect - Rect object you want to change
 * @param {HTMLElement} element - The element from the function reads the scroll values
 * @param {Boolean} subtract - set to true if you want to subtract the scroll values
 * @return {Object} rect - The modifier rect object
 */
function includeScroll(rect, element) {
  var subtract = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var scrollTop = getScroll(element, 'top');
  var scrollLeft = getScroll(element, 'left');
  var modifier = subtract ? -1 : 1;
  rect.top += scrollTop * modifier;
  rect.bottom += scrollTop * modifier;
  rect.left += scrollLeft * modifier;
  rect.right += scrollLeft * modifier;
  return rect;
}

/*
 * Helper to detect borders of a given element
 * @method
 * @memberof Popper.Utils
 * @param {CSSStyleDeclaration} styles
 * Result of `getStyleComputedProperty` on the given element
 * @param {String} axis - `x` or `y`
 * @return {number} borders - The borders size of the given axis
 */

function getBordersSize(styles, axis) {
  var sideA = axis === 'x' ? 'Left' : 'Top';
  var sideB = sideA === 'Left' ? 'Right' : 'Bottom';

  return parseFloat(styles['border' + sideA + 'Width'], 10) + parseFloat(styles['border' + sideB + 'Width'], 10);
}

function getSize(axis, body, html, computedStyle) {
  return Math.max(body['offset' + axis], body['scroll' + axis], html['client' + axis], html['offset' + axis], html['scroll' + axis], isIE(10) ? html['offset' + axis] + computedStyle['margin' + (axis === 'Height' ? 'Top' : 'Left')] + computedStyle['margin' + (axis === 'Height' ? 'Bottom' : 'Right')] : 0);
}

function getWindowSizes() {
  var body = document.body;
  var html = document.documentElement;
  var computedStyle = isIE(10) && getComputedStyle(html);

  return {
    height: getSize('Height', body, html, computedStyle),
    width: getSize('Width', body, html, computedStyle)
  };
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/**
 * Given element offsets, generate an output similar to getBoundingClientRect
 * @method
 * @memberof Popper.Utils
 * @argument {Object} offsets
 * @returns {Object} ClientRect like output
 */
function getClientRect(offsets) {
  return _extends({}, offsets, {
    right: offsets.left + offsets.width,
    bottom: offsets.top + offsets.height
  });
}

/**
 * Get bounding client rect of given element
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} element
 * @return {Object} client rect
 */
function getBoundingClientRect(element) {
  var rect = {};

  // IE10 10 FIX: Please, don't ask, the element isn't
  // considered in DOM in some circumstances...
  // This isn't reproducible in IE10 compatibility mode of IE11
  try {
    if (isIE(10)) {
      rect = element.getBoundingClientRect();
      var scrollTop = getScroll(element, 'top');
      var scrollLeft = getScroll(element, 'left');
      rect.top += scrollTop;
      rect.left += scrollLeft;
      rect.bottom += scrollTop;
      rect.right += scrollLeft;
    } else {
      rect = element.getBoundingClientRect();
    }
  } catch (e) {}

  var result = {
    left: rect.left,
    top: rect.top,
    width: rect.right - rect.left,
    height: rect.bottom - rect.top
  };

  // subtract scrollbar size from sizes
  var sizes = element.nodeName === 'HTML' ? getWindowSizes() : {};
  var width = sizes.width || element.clientWidth || result.right - result.left;
  var height = sizes.height || element.clientHeight || result.bottom - result.top;

  var horizScrollbar = element.offsetWidth - width;
  var vertScrollbar = element.offsetHeight - height;

  // if an hypothetical scrollbar is detected, we must be sure it's not a `border`
  // we make this check conditional for performance reasons
  if (horizScrollbar || vertScrollbar) {
    var styles = getStyleComputedProperty(element);
    horizScrollbar -= getBordersSize(styles, 'x');
    vertScrollbar -= getBordersSize(styles, 'y');

    result.width -= horizScrollbar;
    result.height -= vertScrollbar;
  }

  return getClientRect(result);
}

function getOffsetRectRelativeToArbitraryNode(children, parent) {
  var fixedPosition = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var isIE10 = isIE(10);
  var isHTML = parent.nodeName === 'HTML';
  var childrenRect = getBoundingClientRect(children);
  var parentRect = getBoundingClientRect(parent);
  var scrollParent = getScrollParent(children);

  var styles = getStyleComputedProperty(parent);
  var borderTopWidth = parseFloat(styles.borderTopWidth, 10);
  var borderLeftWidth = parseFloat(styles.borderLeftWidth, 10);

  // In cases where the parent is fixed, we must ignore negative scroll in offset calc
  if (fixedPosition && parent.nodeName === 'HTML') {
    parentRect.top = Math.max(parentRect.top, 0);
    parentRect.left = Math.max(parentRect.left, 0);
  }
  var offsets = getClientRect({
    top: childrenRect.top - parentRect.top - borderTopWidth,
    left: childrenRect.left - parentRect.left - borderLeftWidth,
    width: childrenRect.width,
    height: childrenRect.height
  });
  offsets.marginTop = 0;
  offsets.marginLeft = 0;

  // Subtract margins of documentElement in case it's being used as parent
  // we do this only on HTML because it's the only element that behaves
  // differently when margins are applied to it. The margins are included in
  // the box of the documentElement, in the other cases not.
  if (!isIE10 && isHTML) {
    var marginTop = parseFloat(styles.marginTop, 10);
    var marginLeft = parseFloat(styles.marginLeft, 10);

    offsets.top -= borderTopWidth - marginTop;
    offsets.bottom -= borderTopWidth - marginTop;
    offsets.left -= borderLeftWidth - marginLeft;
    offsets.right -= borderLeftWidth - marginLeft;

    // Attach marginTop and marginLeft because in some circumstances we may need them
    offsets.marginTop = marginTop;
    offsets.marginLeft = marginLeft;
  }

  if (isIE10 && !fixedPosition ? parent.contains(scrollParent) : parent === scrollParent && scrollParent.nodeName !== 'BODY') {
    offsets = includeScroll(offsets, parent);
  }

  return offsets;
}

function getViewportOffsetRectRelativeToArtbitraryNode(element) {
  var excludeScroll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var html = element.ownerDocument.documentElement;
  var relativeOffset = getOffsetRectRelativeToArbitraryNode(element, html);
  var width = Math.max(html.clientWidth, window.innerWidth || 0);
  var height = Math.max(html.clientHeight, window.innerHeight || 0);

  var scrollTop = !excludeScroll ? getScroll(html) : 0;
  var scrollLeft = !excludeScroll ? getScroll(html, 'left') : 0;

  var offset = {
    top: scrollTop - relativeOffset.top + relativeOffset.marginTop,
    left: scrollLeft - relativeOffset.left + relativeOffset.marginLeft,
    width: width,
    height: height
  };

  return getClientRect(offset);
}

/**
 * Check if the given element is fixed or is inside a fixed parent
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {Element} customContainer
 * @returns {Boolean} answer to "isFixed?"
 */
function isFixed(element) {
  var nodeName = element.nodeName;
  if (nodeName === 'BODY' || nodeName === 'HTML') {
    return false;
  }
  if (getStyleComputedProperty(element, 'position') === 'fixed') {
    return true;
  }
  return isFixed(getParentNode(element));
}

/**
 * Finds the first parent of an element that has a transformed property defined
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} first transformed parent or documentElement
 */

function getFixedPositionOffsetParent(element) {
  // This check is needed to avoid errors in case one of the elements isn't defined for any reason
  if (!element || !element.parentElement || isIE()) {
    return document.documentElement;
  }
  var el = element.parentElement;
  while (el && getStyleComputedProperty(el, 'transform') === 'none') {
    el = el.parentElement;
  }
  return el || document.documentElement;
}

/**
 * Computed the boundaries limits and return them
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} popper
 * @param {HTMLElement} reference
 * @param {number} padding
 * @param {HTMLElement} boundariesElement - Element used to define the boundaries
 * @param {Boolean} fixedPosition - Is in fixed position mode
 * @returns {Object} Coordinates of the boundaries
 */
function getBoundaries(popper, reference, padding, boundariesElement) {
  var fixedPosition = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

  // NOTE: 1 DOM access here

  var boundaries = { top: 0, left: 0 };
  var offsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, reference);

  // Handle viewport case
  if (boundariesElement === 'viewport') {
    boundaries = getViewportOffsetRectRelativeToArtbitraryNode(offsetParent, fixedPosition);
  } else {
    // Handle other cases based on DOM element used as boundaries
    var boundariesNode = void 0;
    if (boundariesElement === 'scrollParent') {
      boundariesNode = getScrollParent(getParentNode(reference));
      if (boundariesNode.nodeName === 'BODY') {
        boundariesNode = popper.ownerDocument.documentElement;
      }
    } else if (boundariesElement === 'window') {
      boundariesNode = popper.ownerDocument.documentElement;
    } else {
      boundariesNode = boundariesElement;
    }

    var offsets = getOffsetRectRelativeToArbitraryNode(boundariesNode, offsetParent, fixedPosition);

    // In case of HTML, we need a different computation
    if (boundariesNode.nodeName === 'HTML' && !isFixed(offsetParent)) {
      var _getWindowSizes = getWindowSizes(),
          height = _getWindowSizes.height,
          width = _getWindowSizes.width;

      boundaries.top += offsets.top - offsets.marginTop;
      boundaries.bottom = height + offsets.top;
      boundaries.left += offsets.left - offsets.marginLeft;
      boundaries.right = width + offsets.left;
    } else {
      // for all the other DOM elements, this one is good
      boundaries = offsets;
    }
  }

  // Add paddings
  boundaries.left += padding;
  boundaries.top += padding;
  boundaries.right -= padding;
  boundaries.bottom -= padding;

  return boundaries;
}

function getArea(_ref) {
  var width = _ref.width,
      height = _ref.height;

  return width * height;
}

/**
 * Utility used to transform the `auto` placement to the placement with more
 * available space.
 * @method
 * @memberof Popper.Utils
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function computeAutoPlacement(placement, refRect, popper, reference, boundariesElement) {
  var padding = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

  if (placement.indexOf('auto') === -1) {
    return placement;
  }

  var boundaries = getBoundaries(popper, reference, padding, boundariesElement);

  var rects = {
    top: {
      width: boundaries.width,
      height: refRect.top - boundaries.top
    },
    right: {
      width: boundaries.right - refRect.right,
      height: boundaries.height
    },
    bottom: {
      width: boundaries.width,
      height: boundaries.bottom - refRect.bottom
    },
    left: {
      width: refRect.left - boundaries.left,
      height: boundaries.height
    }
  };

  var sortedAreas = Object.keys(rects).map(function (key) {
    return _extends({
      key: key
    }, rects[key], {
      area: getArea(rects[key])
    });
  }).sort(function (a, b) {
    return b.area - a.area;
  });

  var filteredAreas = sortedAreas.filter(function (_ref2) {
    var width = _ref2.width,
        height = _ref2.height;
    return width >= popper.clientWidth && height >= popper.clientHeight;
  });

  var computedPlacement = filteredAreas.length > 0 ? filteredAreas[0].key : sortedAreas[0].key;

  var variation = placement.split('-')[1];

  return computedPlacement + (variation ? '-' + variation : '');
}

/**
 * Get offsets to the reference element
 * @method
 * @memberof Popper.Utils
 * @param {Object} state
 * @param {Element} popper - the popper element
 * @param {Element} reference - the reference element (the popper will be relative to this)
 * @param {Element} fixedPosition - is in fixed position mode
 * @returns {Object} An object containing the offsets which will be applied to the popper
 */
function getReferenceOffsets(state, popper, reference) {
  var fixedPosition = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  var commonOffsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, reference);
  return getOffsetRectRelativeToArbitraryNode(reference, commonOffsetParent, fixedPosition);
}

/**
 * Get the outer sizes of the given element (offset size + margins)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Object} object containing width and height properties
 */
function getOuterSizes(element) {
  var styles = getComputedStyle(element);
  var x = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
  var y = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);
  var result = {
    width: element.offsetWidth + y,
    height: element.offsetHeight + x
  };
  return result;
}

/**
 * Get the opposite placement of the given one
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement
 * @returns {String} flipped placement
 */
function getOppositePlacement(placement) {
  var hash = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash[matched];
  });
}

/**
 * Get offsets to the popper
 * @method
 * @memberof Popper.Utils
 * @param {Object} position - CSS position the Popper will get applied
 * @param {HTMLElement} popper - the popper element
 * @param {Object} referenceOffsets - the reference offsets (the popper will be relative to this)
 * @param {String} placement - one of the valid placement options
 * @returns {Object} popperOffsets - An object containing the offsets which will be applied to the popper
 */
function getPopperOffsets(popper, referenceOffsets, placement) {
  placement = placement.split('-')[0];

  // Get popper node sizes
  var popperRect = getOuterSizes(popper);

  // Add position, width and height to our offsets object
  var popperOffsets = {
    width: popperRect.width,
    height: popperRect.height
  };

  // depending by the popper placement we have to compute its offsets slightly differently
  var isHoriz = ['right', 'left'].indexOf(placement) !== -1;
  var mainSide = isHoriz ? 'top' : 'left';
  var secondarySide = isHoriz ? 'left' : 'top';
  var measurement = isHoriz ? 'height' : 'width';
  var secondaryMeasurement = !isHoriz ? 'height' : 'width';

  popperOffsets[mainSide] = referenceOffsets[mainSide] + referenceOffsets[measurement] / 2 - popperRect[measurement] / 2;
  if (placement === secondarySide) {
    popperOffsets[secondarySide] = referenceOffsets[secondarySide] - popperRect[secondaryMeasurement];
  } else {
    popperOffsets[secondarySide] = referenceOffsets[getOppositePlacement(secondarySide)];
  }

  return popperOffsets;
}

/**
 * Mimics the `find` method of Array
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */
function find(arr, check) {
  // use native find if supported
  if (Array.prototype.find) {
    return arr.find(check);
  }

  // use `filter` to obtain the same behavior of `find`
  return arr.filter(check)[0];
}

/**
 * Return the index of the matching object
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */
function findIndex(arr, prop, value) {
  // use native findIndex if supported
  if (Array.prototype.findIndex) {
    return arr.findIndex(function (cur) {
      return cur[prop] === value;
    });
  }

  // use `find` + `indexOf` if `findIndex` isn't supported
  var match = find(arr, function (obj) {
    return obj[prop] === value;
  });
  return arr.indexOf(match);
}

/**
 * Loop trough the list of modifiers and run them in order,
 * each of them will then edit the data object.
 * @method
 * @memberof Popper.Utils
 * @param {dataObject} data
 * @param {Array} modifiers
 * @param {String} ends - Optional modifier name used as stopper
 * @returns {dataObject}
 */
function runModifiers(modifiers, data, ends) {
  var modifiersToRun = ends === undefined ? modifiers : modifiers.slice(0, findIndex(modifiers, 'name', ends));

  modifiersToRun.forEach(function (modifier) {
    if (modifier['function']) {
      // eslint-disable-line dot-notation
      console.warn('`modifier.function` is deprecated, use `modifier.fn`!');
    }
    var fn = modifier['function'] || modifier.fn; // eslint-disable-line dot-notation
    if (modifier.enabled && isFunction(fn)) {
      // Add properties to offsets to make them a complete clientRect object
      // we do this before each modifier to make sure the previous one doesn't
      // mess with these values
      data.offsets.popper = getClientRect(data.offsets.popper);
      data.offsets.reference = getClientRect(data.offsets.reference);

      data = fn(data, modifier);
    }
  });

  return data;
}

/**
 * Updates the position of the popper, computing the new offsets and applying
 * the new style.<br />
 * Prefer `scheduleUpdate` over `update` because of performance reasons.
 * @method
 * @memberof Popper
 */
function update() {
  // if popper is destroyed, don't perform any further update
  if (this.state.isDestroyed) {
    return;
  }

  var data = {
    instance: this,
    styles: {},
    arrowStyles: {},
    attributes: {},
    flipped: false,
    offsets: {}
  };

  // compute reference element offsets
  data.offsets.reference = getReferenceOffsets(this.state, this.popper, this.reference, this.options.positionFixed);

  // compute auto placement, store placement inside the data object,
  // modifiers will be able to edit `placement` if needed
  // and refer to originalPlacement to know the original value
  data.placement = computeAutoPlacement(this.options.placement, data.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding);

  // store the computed placement inside `originalPlacement`
  data.originalPlacement = data.placement;

  data.positionFixed = this.options.positionFixed;

  // compute the popper offsets
  data.offsets.popper = getPopperOffsets(this.popper, data.offsets.reference, data.placement);

  data.offsets.popper.position = this.options.positionFixed ? 'fixed' : 'absolute';

  // run the modifiers
  data = runModifiers(this.modifiers, data);

  // the first `update` will call `onCreate` callback
  // the other ones will call `onUpdate` callback
  if (!this.state.isCreated) {
    this.state.isCreated = true;
    this.options.onCreate(data);
  } else {
    this.options.onUpdate(data);
  }
}

/**
 * Helper used to know if the given modifier is enabled.
 * @method
 * @memberof Popper.Utils
 * @returns {Boolean}
 */
function isModifierEnabled(modifiers, modifierName) {
  return modifiers.some(function (_ref) {
    var name = _ref.name,
        enabled = _ref.enabled;
    return enabled && name === modifierName;
  });
}

/**
 * Get the prefixed supported property name
 * @method
 * @memberof Popper.Utils
 * @argument {String} property (camelCase)
 * @returns {String} prefixed property (camelCase or PascalCase, depending on the vendor prefix)
 */
function getSupportedPropertyName(property) {
  var prefixes = [false, 'ms', 'Webkit', 'Moz', 'O'];
  var upperProp = property.charAt(0).toUpperCase() + property.slice(1);

  for (var i = 0; i < prefixes.length; i++) {
    var prefix = prefixes[i];
    var toCheck = prefix ? '' + prefix + upperProp : property;
    if (typeof document.body.style[toCheck] !== 'undefined') {
      return toCheck;
    }
  }
  return null;
}

/**
 * Destroy the popper
 * @method
 * @memberof Popper
 */
function destroy() {
  this.state.isDestroyed = true;

  // touch DOM only if `applyStyle` modifier is enabled
  if (isModifierEnabled(this.modifiers, 'applyStyle')) {
    this.popper.removeAttribute('x-placement');
    this.popper.style.position = '';
    this.popper.style.top = '';
    this.popper.style.left = '';
    this.popper.style.right = '';
    this.popper.style.bottom = '';
    this.popper.style.willChange = '';
    this.popper.style[getSupportedPropertyName('transform')] = '';
  }

  this.disableEventListeners();

  // remove the popper if user explicity asked for the deletion on destroy
  // do not use `remove` because IE11 doesn't support it
  if (this.options.removeOnDestroy) {
    this.popper.parentNode.removeChild(this.popper);
  }
  return this;
}

/**
 * Get the window associated with the element
 * @argument {Element} element
 * @returns {Window}
 */
function getWindow(element) {
  var ownerDocument = element.ownerDocument;
  return ownerDocument ? ownerDocument.defaultView : window;
}

function attachToScrollParents(scrollParent, event, callback, scrollParents) {
  var isBody = scrollParent.nodeName === 'BODY';
  var target = isBody ? scrollParent.ownerDocument.defaultView : scrollParent;
  target.addEventListener(event, callback, { passive: true });

  if (!isBody) {
    attachToScrollParents(getScrollParent(target.parentNode), event, callback, scrollParents);
  }
  scrollParents.push(target);
}

/**
 * Setup needed event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */
function setupEventListeners(reference, options, state, updateBound) {
  // Resize event listener on window
  state.updateBound = updateBound;
  getWindow(reference).addEventListener('resize', state.updateBound, { passive: true });

  // Scroll event listener on scroll parents
  var scrollElement = getScrollParent(reference);
  attachToScrollParents(scrollElement, 'scroll', state.updateBound, state.scrollParents);
  state.scrollElement = scrollElement;
  state.eventsEnabled = true;

  return state;
}

/**
 * It will add resize/scroll events and start recalculating
 * position of the popper element when they are triggered.
 * @method
 * @memberof Popper
 */
function enableEventListeners() {
  if (!this.state.eventsEnabled) {
    this.state = setupEventListeners(this.reference, this.options, this.state, this.scheduleUpdate);
  }
}

/**
 * Remove event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */
function removeEventListeners(reference, state) {
  // Remove resize event listener on window
  getWindow(reference).removeEventListener('resize', state.updateBound);

  // Remove scroll event listener on scroll parents
  state.scrollParents.forEach(function (target) {
    target.removeEventListener('scroll', state.updateBound);
  });

  // Reset state
  state.updateBound = null;
  state.scrollParents = [];
  state.scrollElement = null;
  state.eventsEnabled = false;
  return state;
}

/**
 * It will remove resize/scroll events and won't recalculate popper position
 * when they are triggered. It also won't trigger onUpdate callback anymore,
 * unless you call `update` method manually.
 * @method
 * @memberof Popper
 */
function disableEventListeners() {
  if (this.state.eventsEnabled) {
    cancelAnimationFrame(this.scheduleUpdate);
    this.state = removeEventListeners(this.reference, this.state);
  }
}

/**
 * Tells if a given input is a number
 * @method
 * @memberof Popper.Utils
 * @param {*} input to check
 * @return {Boolean}
 */
function isNumeric(n) {
  return n !== '' && !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * Set the style to the given popper
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element - Element to apply the style to
 * @argument {Object} styles
 * Object with a list of properties and values which will be applied to the element
 */
function setStyles(element, styles) {
  Object.keys(styles).forEach(function (prop) {
    var unit = '';
    // add unit if the value is numeric and is one of the following
    if (['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(prop) !== -1 && isNumeric(styles[prop])) {
      unit = 'px';
    }
    element.style[prop] = styles[prop] + unit;
  });
}

/**
 * Set the attributes to the given popper
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element - Element to apply the attributes to
 * @argument {Object} styles
 * Object with a list of properties and values which will be applied to the element
 */
function setAttributes(element, attributes) {
  Object.keys(attributes).forEach(function (prop) {
    var value = attributes[prop];
    if (value !== false) {
      element.setAttribute(prop, attributes[prop]);
    } else {
      element.removeAttribute(prop);
    }
  });
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} data.styles - List of style properties - values to apply to popper element
 * @argument {Object} data.attributes - List of attribute properties - values to apply to popper element
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The same data object
 */
function applyStyle(data) {
  // any property present in `data.styles` will be applied to the popper,
  // in this way we can make the 3rd party modifiers add custom styles to it
  // Be aware, modifiers could override the properties defined in the previous
  // lines of this modifier!
  setStyles(data.instance.popper, data.styles);

  // any property present in `data.attributes` will be applied to the popper,
  // they will be set as HTML attributes of the element
  setAttributes(data.instance.popper, data.attributes);

  // if arrowElement is defined and arrowStyles has some properties
  if (data.arrowElement && Object.keys(data.arrowStyles).length) {
    setStyles(data.arrowElement, data.arrowStyles);
  }

  return data;
}

/**
 * Set the x-placement attribute before everything else because it could be used
 * to add margins to the popper margins needs to be calculated to get the
 * correct popper offsets.
 * @method
 * @memberof Popper.modifiers
 * @param {HTMLElement} reference - The reference element used to position the popper
 * @param {HTMLElement} popper - The HTML element used as popper
 * @param {Object} options - Popper.js options
 */
function applyStyleOnLoad(reference, popper, options, modifierOptions, state) {
  // compute reference element offsets
  var referenceOffsets = getReferenceOffsets(state, popper, reference, options.positionFixed);

  // compute auto placement, store placement inside the data object,
  // modifiers will be able to edit `placement` if needed
  // and refer to originalPlacement to know the original value
  var placement = computeAutoPlacement(options.placement, referenceOffsets, popper, reference, options.modifiers.flip.boundariesElement, options.modifiers.flip.padding);

  popper.setAttribute('x-placement', placement);

  // Apply `position` to popper before anything else because
  // without the position applied we can't guarantee correct computations
  setStyles(popper, { position: options.positionFixed ? 'fixed' : 'absolute' });

  return options;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function computeStyle(data, options) {
  var x = options.x,
      y = options.y;
  var popper = data.offsets.popper;

  // Remove this legacy support in Popper.js v2

  var legacyGpuAccelerationOption = find(data.instance.modifiers, function (modifier) {
    return modifier.name === 'applyStyle';
  }).gpuAcceleration;
  if (legacyGpuAccelerationOption !== undefined) {
    console.warn('WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!');
  }
  var gpuAcceleration = legacyGpuAccelerationOption !== undefined ? legacyGpuAccelerationOption : options.gpuAcceleration;

  var offsetParent = getOffsetParent(data.instance.popper);
  var offsetParentRect = getBoundingClientRect(offsetParent);

  // Styles
  var styles = {
    position: popper.position
  };

  // Avoid blurry text by using full pixel integers.
  // For pixel-perfect positioning, top/bottom prefers rounded
  // values, while left/right prefers floored values.
  var offsets = {
    left: Math.floor(popper.left),
    top: Math.round(popper.top),
    bottom: Math.round(popper.bottom),
    right: Math.floor(popper.right)
  };

  var sideA = x === 'bottom' ? 'top' : 'bottom';
  var sideB = y === 'right' ? 'left' : 'right';

  // if gpuAcceleration is set to `true` and transform is supported,
  //  we use `translate3d` to apply the position to the popper we
  // automatically use the supported prefixed version if needed
  var prefixedProperty = getSupportedPropertyName('transform');

  // now, let's make a step back and look at this code closely (wtf?)
  // If the content of the popper grows once it's been positioned, it
  // may happen that the popper gets misplaced because of the new content
  // overflowing its reference element
  // To avoid this problem, we provide two options (x and y), which allow
  // the consumer to define the offset origin.
  // If we position a popper on top of a reference element, we can set
  // `x` to `top` to make the popper grow towards its top instead of
  // its bottom.
  var left = void 0,
      top = void 0;
  if (sideA === 'bottom') {
    top = -offsetParentRect.height + offsets.bottom;
  } else {
    top = offsets.top;
  }
  if (sideB === 'right') {
    left = -offsetParentRect.width + offsets.right;
  } else {
    left = offsets.left;
  }
  if (gpuAcceleration && prefixedProperty) {
    styles[prefixedProperty] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
    styles[sideA] = 0;
    styles[sideB] = 0;
    styles.willChange = 'transform';
  } else {
    // othwerise, we use the standard `top`, `left`, `bottom` and `right` properties
    var invertTop = sideA === 'bottom' ? -1 : 1;
    var invertLeft = sideB === 'right' ? -1 : 1;
    styles[sideA] = top * invertTop;
    styles[sideB] = left * invertLeft;
    styles.willChange = sideA + ', ' + sideB;
  }

  // Attributes
  var attributes = {
    'x-placement': data.placement
  };

  // Update `data` attributes, styles and arrowStyles
  data.attributes = _extends({}, attributes, data.attributes);
  data.styles = _extends({}, styles, data.styles);
  data.arrowStyles = _extends({}, data.offsets.arrow, data.arrowStyles);

  return data;
}

/**
 * Helper used to know if the given modifier depends from another one.<br />
 * It checks if the needed modifier is listed and enabled.
 * @method
 * @memberof Popper.Utils
 * @param {Array} modifiers - list of modifiers
 * @param {String} requestingName - name of requesting modifier
 * @param {String} requestedName - name of requested modifier
 * @returns {Boolean}
 */
function isModifierRequired(modifiers, requestingName, requestedName) {
  var requesting = find(modifiers, function (_ref) {
    var name = _ref.name;
    return name === requestingName;
  });

  var isRequired = !!requesting && modifiers.some(function (modifier) {
    return modifier.name === requestedName && modifier.enabled && modifier.order < requesting.order;
  });

  if (!isRequired) {
    var _requesting = '`' + requestingName + '`';
    var requested = '`' + requestedName + '`';
    console.warn(requested + ' modifier is required by ' + _requesting + ' modifier in order to work, be sure to include it before ' + _requesting + '!');
  }
  return isRequired;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function arrow(data, options) {
  var _data$offsets$arrow;

  // arrow depends on keepTogether in order to work
  if (!isModifierRequired(data.instance.modifiers, 'arrow', 'keepTogether')) {
    return data;
  }

  var arrowElement = options.element;

  // if arrowElement is a string, suppose it's a CSS selector
  if (typeof arrowElement === 'string') {
    arrowElement = data.instance.popper.querySelector(arrowElement);

    // if arrowElement is not found, don't run the modifier
    if (!arrowElement) {
      return data;
    }
  } else {
    // if the arrowElement isn't a query selector we must check that the
    // provided DOM node is child of its popper node
    if (!data.instance.popper.contains(arrowElement)) {
      console.warn('WARNING: `arrow.element` must be child of its popper element!');
      return data;
    }
  }

  var placement = data.placement.split('-')[0];
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var isVertical = ['left', 'right'].indexOf(placement) !== -1;

  var len = isVertical ? 'height' : 'width';
  var sideCapitalized = isVertical ? 'Top' : 'Left';
  var side = sideCapitalized.toLowerCase();
  var altSide = isVertical ? 'left' : 'top';
  var opSide = isVertical ? 'bottom' : 'right';
  var arrowElementSize = getOuterSizes(arrowElement)[len];

  //
  // extends keepTogether behavior making sure the popper and its
  // reference have enough pixels in conjuction
  //

  // top/left side
  if (reference[opSide] - arrowElementSize < popper[side]) {
    data.offsets.popper[side] -= popper[side] - (reference[opSide] - arrowElementSize);
  }
  // bottom/right side
  if (reference[side] + arrowElementSize > popper[opSide]) {
    data.offsets.popper[side] += reference[side] + arrowElementSize - popper[opSide];
  }
  data.offsets.popper = getClientRect(data.offsets.popper);

  // compute center of the popper
  var center = reference[side] + reference[len] / 2 - arrowElementSize / 2;

  // Compute the sideValue using the updated popper offsets
  // take popper margin in account because we don't have this info available
  var css = getStyleComputedProperty(data.instance.popper);
  var popperMarginSide = parseFloat(css['margin' + sideCapitalized], 10);
  var popperBorderSide = parseFloat(css['border' + sideCapitalized + 'Width'], 10);
  var sideValue = center - data.offsets.popper[side] - popperMarginSide - popperBorderSide;

  // prevent arrowElement from being placed not contiguously to its popper
  sideValue = Math.max(Math.min(popper[len] - arrowElementSize, sideValue), 0);

  data.arrowElement = arrowElement;
  data.offsets.arrow = (_data$offsets$arrow = {}, defineProperty(_data$offsets$arrow, side, Math.round(sideValue)), defineProperty(_data$offsets$arrow, altSide, ''), _data$offsets$arrow);

  return data;
}

/**
 * Get the opposite placement variation of the given one
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement variation
 * @returns {String} flipped placement variation
 */
function getOppositeVariation(variation) {
  if (variation === 'end') {
    return 'start';
  } else if (variation === 'start') {
    return 'end';
  }
  return variation;
}

/**
 * List of accepted placements to use as values of the `placement` option.<br />
 * Valid placements are:
 * - `auto`
 * - `top`
 * - `right`
 * - `bottom`
 * - `left`
 *
 * Each placement can have a variation from this list:
 * - `-start`
 * - `-end`
 *
 * Variations are interpreted easily if you think of them as the left to right
 * written languages. Horizontally (`top` and `bottom`), `start` is left and `end`
 * is right.<br />
 * Vertically (`left` and `right`), `start` is top and `end` is bottom.
 *
 * Some valid examples are:
 * - `top-end` (on top of reference, right aligned)
 * - `right-start` (on right of reference, top aligned)
 * - `bottom` (on bottom, centered)
 * - `auto-right` (on the side with more space available, alignment depends by placement)
 *
 * @static
 * @type {Array}
 * @enum {String}
 * @readonly
 * @method placements
 * @memberof Popper
 */
var placements = ['auto-start', 'auto', 'auto-end', 'top-start', 'top', 'top-end', 'right-start', 'right', 'right-end', 'bottom-end', 'bottom', 'bottom-start', 'left-end', 'left', 'left-start'];

// Get rid of `auto` `auto-start` and `auto-end`
var validPlacements = placements.slice(3);

/**
 * Given an initial placement, returns all the subsequent placements
 * clockwise (or counter-clockwise).
 *
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement - A valid placement (it accepts variations)
 * @argument {Boolean} counter - Set to true to walk the placements counterclockwise
 * @returns {Array} placements including their variations
 */
function clockwise(placement) {
  var counter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var index = validPlacements.indexOf(placement);
  var arr = validPlacements.slice(index + 1).concat(validPlacements.slice(0, index));
  return counter ? arr.reverse() : arr;
}

var BEHAVIORS = {
  FLIP: 'flip',
  CLOCKWISE: 'clockwise',
  COUNTERCLOCKWISE: 'counterclockwise'
};

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function flip(data, options) {
  // if `inner` modifier is enabled, we can't use the `flip` modifier
  if (isModifierEnabled(data.instance.modifiers, 'inner')) {
    return data;
  }

  if (data.flipped && data.placement === data.originalPlacement) {
    // seems like flip is trying to loop, probably there's not enough space on any of the flippable sides
    return data;
  }

  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, options.boundariesElement, data.positionFixed);

  var placement = data.placement.split('-')[0];
  var placementOpposite = getOppositePlacement(placement);
  var variation = data.placement.split('-')[1] || '';

  var flipOrder = [];

  switch (options.behavior) {
    case BEHAVIORS.FLIP:
      flipOrder = [placement, placementOpposite];
      break;
    case BEHAVIORS.CLOCKWISE:
      flipOrder = clockwise(placement);
      break;
    case BEHAVIORS.COUNTERCLOCKWISE:
      flipOrder = clockwise(placement, true);
      break;
    default:
      flipOrder = options.behavior;
  }

  flipOrder.forEach(function (step, index) {
    if (placement !== step || flipOrder.length === index + 1) {
      return data;
    }

    placement = data.placement.split('-')[0];
    placementOpposite = getOppositePlacement(placement);

    var popperOffsets = data.offsets.popper;
    var refOffsets = data.offsets.reference;

    // using floor because the reference offsets may contain decimals we are not going to consider here
    var floor = Math.floor;
    var overlapsRef = placement === 'left' && floor(popperOffsets.right) > floor(refOffsets.left) || placement === 'right' && floor(popperOffsets.left) < floor(refOffsets.right) || placement === 'top' && floor(popperOffsets.bottom) > floor(refOffsets.top) || placement === 'bottom' && floor(popperOffsets.top) < floor(refOffsets.bottom);

    var overflowsLeft = floor(popperOffsets.left) < floor(boundaries.left);
    var overflowsRight = floor(popperOffsets.right) > floor(boundaries.right);
    var overflowsTop = floor(popperOffsets.top) < floor(boundaries.top);
    var overflowsBottom = floor(popperOffsets.bottom) > floor(boundaries.bottom);

    var overflowsBoundaries = placement === 'left' && overflowsLeft || placement === 'right' && overflowsRight || placement === 'top' && overflowsTop || placement === 'bottom' && overflowsBottom;

    // flip the variation if required
    var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
    var flippedVariation = !!options.flipVariations && (isVertical && variation === 'start' && overflowsLeft || isVertical && variation === 'end' && overflowsRight || !isVertical && variation === 'start' && overflowsTop || !isVertical && variation === 'end' && overflowsBottom);

    if (overlapsRef || overflowsBoundaries || flippedVariation) {
      // this boolean to detect any flip loop
      data.flipped = true;

      if (overlapsRef || overflowsBoundaries) {
        placement = flipOrder[index + 1];
      }

      if (flippedVariation) {
        variation = getOppositeVariation(variation);
      }

      data.placement = placement + (variation ? '-' + variation : '');

      // this object contains `position`, we want to preserve it along with
      // any additional property we may add in the future
      data.offsets.popper = _extends({}, data.offsets.popper, getPopperOffsets(data.instance.popper, data.offsets.reference, data.placement));

      data = runModifiers(data.instance.modifiers, data, 'flip');
    }
  });
  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function keepTogether(data) {
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var placement = data.placement.split('-')[0];
  var floor = Math.floor;
  var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
  var side = isVertical ? 'right' : 'bottom';
  var opSide = isVertical ? 'left' : 'top';
  var measurement = isVertical ? 'width' : 'height';

  if (popper[side] < floor(reference[opSide])) {
    data.offsets.popper[opSide] = floor(reference[opSide]) - popper[measurement];
  }
  if (popper[opSide] > floor(reference[side])) {
    data.offsets.popper[opSide] = floor(reference[side]);
  }

  return data;
}

/**
 * Converts a string containing value + unit into a px value number
 * @function
 * @memberof {modifiers~offset}
 * @private
 * @argument {String} str - Value + unit string
 * @argument {String} measurement - `height` or `width`
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @returns {Number|String}
 * Value in pixels, or original string if no values were extracted
 */
function toValue(str, measurement, popperOffsets, referenceOffsets) {
  // separate value from unit
  var split = str.match(/((?:\-|\+)?\d*\.?\d*)(.*)/);
  var value = +split[1];
  var unit = split[2];

  // If it's not a number it's an operator, I guess
  if (!value) {
    return str;
  }

  if (unit.indexOf('%') === 0) {
    var element = void 0;
    switch (unit) {
      case '%p':
        element = popperOffsets;
        break;
      case '%':
      case '%r':
      default:
        element = referenceOffsets;
    }

    var rect = getClientRect(element);
    return rect[measurement] / 100 * value;
  } else if (unit === 'vh' || unit === 'vw') {
    // if is a vh or vw, we calculate the size based on the viewport
    var size = void 0;
    if (unit === 'vh') {
      size = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    } else {
      size = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }
    return size / 100 * value;
  } else {
    // if is an explicit pixel unit, we get rid of the unit and keep the value
    // if is an implicit unit, it's px, and we return just the value
    return value;
  }
}

/**
 * Parse an `offset` string to extrapolate `x` and `y` numeric offsets.
 * @function
 * @memberof {modifiers~offset}
 * @private
 * @argument {String} offset
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @argument {String} basePlacement
 * @returns {Array} a two cells array with x and y offsets in numbers
 */
function parseOffset(offset, popperOffsets, referenceOffsets, basePlacement) {
  var offsets = [0, 0];

  // Use height if placement is left or right and index is 0 otherwise use width
  // in this way the first offset will use an axis and the second one
  // will use the other one
  var useHeight = ['right', 'left'].indexOf(basePlacement) !== -1;

  // Split the offset string to obtain a list of values and operands
  // The regex addresses values with the plus or minus sign in front (+10, -20, etc)
  var fragments = offset.split(/(\+|\-)/).map(function (frag) {
    return frag.trim();
  });

  // Detect if the offset string contains a pair of values or a single one
  // they could be separated by comma or space
  var divider = fragments.indexOf(find(fragments, function (frag) {
    return frag.search(/,|\s/) !== -1;
  }));

  if (fragments[divider] && fragments[divider].indexOf(',') === -1) {
    console.warn('Offsets separated by white space(s) are deprecated, use a comma (,) instead.');
  }

  // If divider is found, we divide the list of values and operands to divide
  // them by ofset X and Y.
  var splitRegex = /\s*,\s*|\s+/;
  var ops = divider !== -1 ? [fragments.slice(0, divider).concat([fragments[divider].split(splitRegex)[0]]), [fragments[divider].split(splitRegex)[1]].concat(fragments.slice(divider + 1))] : [fragments];

  // Convert the values with units to absolute pixels to allow our computations
  ops = ops.map(function (op, index) {
    // Most of the units rely on the orientation of the popper
    var measurement = (index === 1 ? !useHeight : useHeight) ? 'height' : 'width';
    var mergeWithPrevious = false;
    return op
    // This aggregates any `+` or `-` sign that aren't considered operators
    // e.g.: 10 + +5 => [10, +, +5]
    .reduce(function (a, b) {
      if (a[a.length - 1] === '' && ['+', '-'].indexOf(b) !== -1) {
        a[a.length - 1] = b;
        mergeWithPrevious = true;
        return a;
      } else if (mergeWithPrevious) {
        a[a.length - 1] += b;
        mergeWithPrevious = false;
        return a;
      } else {
        return a.concat(b);
      }
    }, [])
    // Here we convert the string values into number values (in px)
    .map(function (str) {
      return toValue(str, measurement, popperOffsets, referenceOffsets);
    });
  });

  // Loop trough the offsets arrays and execute the operations
  ops.forEach(function (op, index) {
    op.forEach(function (frag, index2) {
      if (isNumeric(frag)) {
        offsets[index] += frag * (op[index2 - 1] === '-' ? -1 : 1);
      }
    });
  });
  return offsets;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @argument {Number|String} options.offset=0
 * The offset value as described in the modifier description
 * @returns {Object} The data object, properly modified
 */
function offset(data, _ref) {
  var offset = _ref.offset;
  var placement = data.placement,
      _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var basePlacement = placement.split('-')[0];

  var offsets = void 0;
  if (isNumeric(+offset)) {
    offsets = [+offset, 0];
  } else {
    offsets = parseOffset(offset, popper, reference, basePlacement);
  }

  if (basePlacement === 'left') {
    popper.top += offsets[0];
    popper.left -= offsets[1];
  } else if (basePlacement === 'right') {
    popper.top += offsets[0];
    popper.left += offsets[1];
  } else if (basePlacement === 'top') {
    popper.left += offsets[0];
    popper.top -= offsets[1];
  } else if (basePlacement === 'bottom') {
    popper.left += offsets[0];
    popper.top += offsets[1];
  }

  data.popper = popper;
  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function preventOverflow(data, options) {
  var boundariesElement = options.boundariesElement || getOffsetParent(data.instance.popper);

  // If offsetParent is the reference element, we really want to
  // go one step up and use the next offsetParent as reference to
  // avoid to make this modifier completely useless and look like broken
  if (data.instance.reference === boundariesElement) {
    boundariesElement = getOffsetParent(boundariesElement);
  }

  // NOTE: DOM access here
  // resets the popper's position so that the document size can be calculated excluding
  // the size of the popper element itself
  var transformProp = getSupportedPropertyName('transform');
  var popperStyles = data.instance.popper.style; // assignment to help minification
  var top = popperStyles.top,
      left = popperStyles.left,
      transform = popperStyles[transformProp];

  popperStyles.top = '';
  popperStyles.left = '';
  popperStyles[transformProp] = '';

  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, boundariesElement, data.positionFixed);

  // NOTE: DOM access here
  // restores the original style properties after the offsets have been computed
  popperStyles.top = top;
  popperStyles.left = left;
  popperStyles[transformProp] = transform;

  options.boundaries = boundaries;

  var order = options.priority;
  var popper = data.offsets.popper;

  var check = {
    primary: function primary(placement) {
      var value = popper[placement];
      if (popper[placement] < boundaries[placement] && !options.escapeWithReference) {
        value = Math.max(popper[placement], boundaries[placement]);
      }
      return defineProperty({}, placement, value);
    },
    secondary: function secondary(placement) {
      var mainSide = placement === 'right' ? 'left' : 'top';
      var value = popper[mainSide];
      if (popper[placement] > boundaries[placement] && !options.escapeWithReference) {
        value = Math.min(popper[mainSide], boundaries[placement] - (placement === 'right' ? popper.width : popper.height));
      }
      return defineProperty({}, mainSide, value);
    }
  };

  order.forEach(function (placement) {
    var side = ['left', 'top'].indexOf(placement) !== -1 ? 'primary' : 'secondary';
    popper = _extends({}, popper, check[side](placement));
  });

  data.offsets.popper = popper;

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function shift(data) {
  var placement = data.placement;
  var basePlacement = placement.split('-')[0];
  var shiftvariation = placement.split('-')[1];

  // if shift shiftvariation is specified, run the modifier
  if (shiftvariation) {
    var _data$offsets = data.offsets,
        reference = _data$offsets.reference,
        popper = _data$offsets.popper;

    var isVertical = ['bottom', 'top'].indexOf(basePlacement) !== -1;
    var side = isVertical ? 'left' : 'top';
    var measurement = isVertical ? 'width' : 'height';

    var shiftOffsets = {
      start: defineProperty({}, side, reference[side]),
      end: defineProperty({}, side, reference[side] + reference[measurement] - popper[measurement])
    };

    data.offsets.popper = _extends({}, popper, shiftOffsets[shiftvariation]);
  }

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function hide(data) {
  if (!isModifierRequired(data.instance.modifiers, 'hide', 'preventOverflow')) {
    return data;
  }

  var refRect = data.offsets.reference;
  var bound = find(data.instance.modifiers, function (modifier) {
    return modifier.name === 'preventOverflow';
  }).boundaries;

  if (refRect.bottom < bound.top || refRect.left > bound.right || refRect.top > bound.bottom || refRect.right < bound.left) {
    // Avoid unnecessary DOM access if visibility hasn't changed
    if (data.hide === true) {
      return data;
    }

    data.hide = true;
    data.attributes['x-out-of-boundaries'] = '';
  } else {
    // Avoid unnecessary DOM access if visibility hasn't changed
    if (data.hide === false) {
      return data;
    }

    data.hide = false;
    data.attributes['x-out-of-boundaries'] = false;
  }

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function inner(data) {
  var placement = data.placement;
  var basePlacement = placement.split('-')[0];
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var isHoriz = ['left', 'right'].indexOf(basePlacement) !== -1;

  var subtractLength = ['top', 'left'].indexOf(basePlacement) === -1;

  popper[isHoriz ? 'left' : 'top'] = reference[basePlacement] - (subtractLength ? popper[isHoriz ? 'width' : 'height'] : 0);

  data.placement = getOppositePlacement(placement);
  data.offsets.popper = getClientRect(popper);

  return data;
}

/**
 * Modifier function, each modifier can have a function of this type assigned
 * to its `fn` property.<br />
 * These functions will be called on each update, this means that you must
 * make sure they are performant enough to avoid performance bottlenecks.
 *
 * @function ModifierFn
 * @argument {dataObject} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {dataObject} The data object, properly modified
 */

/**
 * Modifiers are plugins used to alter the behavior of your poppers.<br />
 * Popper.js uses a set of 9 modifiers to provide all the basic functionalities
 * needed by the library.
 *
 * Usually you don't want to override the `order`, `fn` and `onLoad` props.
 * All the other properties are configurations that could be tweaked.
 * @namespace modifiers
 */
var modifiers = {
  /**
   * Modifier used to shift the popper on the start or end of its reference
   * element.<br />
   * It will read the variation of the `placement` property.<br />
   * It can be one either `-end` or `-start`.
   * @memberof modifiers
   * @inner
   */
  shift: {
    /** @prop {number} order=100 - Index used to define the order of execution */
    order: 100,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: shift
  },

  /**
   * The `offset` modifier can shift your popper on both its axis.
   *
   * It accepts the following units:
   * - `px` or unitless, interpreted as pixels
   * - `%` or `%r`, percentage relative to the length of the reference element
   * - `%p`, percentage relative to the length of the popper element
   * - `vw`, CSS viewport width unit
   * - `vh`, CSS viewport height unit
   *
   * For length is intended the main axis relative to the placement of the popper.<br />
   * This means that if the placement is `top` or `bottom`, the length will be the
   * `width`. In case of `left` or `right`, it will be the height.
   *
   * You can provide a single value (as `Number` or `String`), or a pair of values
   * as `String` divided by a comma or one (or more) white spaces.<br />
   * The latter is a deprecated method because it leads to confusion and will be
   * removed in v2.<br />
   * Additionally, it accepts additions and subtractions between different units.
   * Note that multiplications and divisions aren't supported.
   *
   * Valid examples are:
   * ```
   * 10
   * '10%'
   * '10, 10'
   * '10%, 10'
   * '10 + 10%'
   * '10 - 5vh + 3%'
   * '-10px + 5vh, 5px - 6%'
   * ```
   * > **NB**: If you desire to apply offsets to your poppers in a way that may make them overlap
   * > with their reference element, unfortunately, you will have to disable the `flip` modifier.
   * > More on this [reading this issue](https://github.com/FezVrasta/popper.js/issues/373)
   *
   * @memberof modifiers
   * @inner
   */
  offset: {
    /** @prop {number} order=200 - Index used to define the order of execution */
    order: 200,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: offset,
    /** @prop {Number|String} offset=0
     * The offset value as described in the modifier description
     */
    offset: 0
  },

  /**
   * Modifier used to prevent the popper from being positioned outside the boundary.
   *
   * An scenario exists where the reference itself is not within the boundaries.<br />
   * We can say it has "escaped the boundaries" — or just "escaped".<br />
   * In this case we need to decide whether the popper should either:
   *
   * - detach from the reference and remain "trapped" in the boundaries, or
   * - if it should ignore the boundary and "escape with its reference"
   *
   * When `escapeWithReference` is set to`true` and reference is completely
   * outside its boundaries, the popper will overflow (or completely leave)
   * the boundaries in order to remain attached to the edge of the reference.
   *
   * @memberof modifiers
   * @inner
   */
  preventOverflow: {
    /** @prop {number} order=300 - Index used to define the order of execution */
    order: 300,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: preventOverflow,
    /**
     * @prop {Array} [priority=['left','right','top','bottom']]
     * Popper will try to prevent overflow following these priorities by default,
     * then, it could overflow on the left and on top of the `boundariesElement`
     */
    priority: ['left', 'right', 'top', 'bottom'],
    /**
     * @prop {number} padding=5
     * Amount of pixel used to define a minimum distance between the boundaries
     * and the popper this makes sure the popper has always a little padding
     * between the edges of its container
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='scrollParent'
     * Boundaries used by the modifier, can be `scrollParent`, `window`,
     * `viewport` or any DOM element.
     */
    boundariesElement: 'scrollParent'
  },

  /**
   * Modifier used to make sure the reference and its popper stay near eachothers
   * without leaving any gap between the two. Expecially useful when the arrow is
   * enabled and you want to assure it to point to its reference element.
   * It cares only about the first axis, you can still have poppers with margin
   * between the popper and its reference element.
   * @memberof modifiers
   * @inner
   */
  keepTogether: {
    /** @prop {number} order=400 - Index used to define the order of execution */
    order: 400,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: keepTogether
  },

  /**
   * This modifier is used to move the `arrowElement` of the popper to make
   * sure it is positioned between the reference element and its popper element.
   * It will read the outer size of the `arrowElement` node to detect how many
   * pixels of conjuction are needed.
   *
   * It has no effect if no `arrowElement` is provided.
   * @memberof modifiers
   * @inner
   */
  arrow: {
    /** @prop {number} order=500 - Index used to define the order of execution */
    order: 500,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: arrow,
    /** @prop {String|HTMLElement} element='[x-arrow]' - Selector or node used as arrow */
    element: '[x-arrow]'
  },

  /**
   * Modifier used to flip the popper's placement when it starts to overlap its
   * reference element.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   *
   * **NOTE:** this modifier will interrupt the current update cycle and will
   * restart it if it detects the need to flip the placement.
   * @memberof modifiers
   * @inner
   */
  flip: {
    /** @prop {number} order=600 - Index used to define the order of execution */
    order: 600,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: flip,
    /**
     * @prop {String|Array} behavior='flip'
     * The behavior used to change the popper's placement. It can be one of
     * `flip`, `clockwise`, `counterclockwise` or an array with a list of valid
     * placements (with optional variations).
     */
    behavior: 'flip',
    /**
     * @prop {number} padding=5
     * The popper will flip if it hits the edges of the `boundariesElement`
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='viewport'
     * The element which will define the boundaries of the popper position,
     * the popper will never be placed outside of the defined boundaries
     * (except if keepTogether is enabled)
     */
    boundariesElement: 'viewport'
  },

  /**
   * Modifier used to make the popper flow toward the inner of the reference element.
   * By default, when this modifier is disabled, the popper will be placed outside
   * the reference element.
   * @memberof modifiers
   * @inner
   */
  inner: {
    /** @prop {number} order=700 - Index used to define the order of execution */
    order: 700,
    /** @prop {Boolean} enabled=false - Whether the modifier is enabled or not */
    enabled: false,
    /** @prop {ModifierFn} */
    fn: inner
  },

  /**
   * Modifier used to hide the popper when its reference element is outside of the
   * popper boundaries. It will set a `x-out-of-boundaries` attribute which can
   * be used to hide with a CSS selector the popper when its reference is
   * out of boundaries.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   * @memberof modifiers
   * @inner
   */
  hide: {
    /** @prop {number} order=800 - Index used to define the order of execution */
    order: 800,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: hide
  },

  /**
   * Computes the style that will be applied to the popper element to gets
   * properly positioned.
   *
   * Note that this modifier will not touch the DOM, it just prepares the styles
   * so that `applyStyle` modifier can apply it. This separation is useful
   * in case you need to replace `applyStyle` with a custom implementation.
   *
   * This modifier has `850` as `order` value to maintain backward compatibility
   * with previous versions of Popper.js. Expect the modifiers ordering method
   * to change in future major versions of the library.
   *
   * @memberof modifiers
   * @inner
   */
  computeStyle: {
    /** @prop {number} order=850 - Index used to define the order of execution */
    order: 850,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: computeStyle,
    /**
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3d transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties.
     */
    gpuAcceleration: true,
    /**
     * @prop {string} [x='bottom']
     * Where to anchor the X axis (`bottom` or `top`). AKA X offset origin.
     * Change this if your popper should grow in a direction different from `bottom`
     */
    x: 'bottom',
    /**
     * @prop {string} [x='left']
     * Where to anchor the Y axis (`left` or `right`). AKA Y offset origin.
     * Change this if your popper should grow in a direction different from `right`
     */
    y: 'right'
  },

  /**
   * Applies the computed styles to the popper element.
   *
   * All the DOM manipulations are limited to this modifier. This is useful in case
   * you want to integrate Popper.js inside a framework or view library and you
   * want to delegate all the DOM manipulations to it.
   *
   * Note that if you disable this modifier, you must make sure the popper element
   * has its position set to `absolute` before Popper.js can do its work!
   *
   * Just disable this modifier and define you own to achieve the desired effect.
   *
   * @memberof modifiers
   * @inner
   */
  applyStyle: {
    /** @prop {number} order=900 - Index used to define the order of execution */
    order: 900,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: applyStyle,
    /** @prop {Function} */
    onLoad: applyStyleOnLoad,
    /**
     * @deprecated since version 1.10.0, the property moved to `computeStyle` modifier
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3d transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties.
     */
    gpuAcceleration: undefined
  }
};

/**
 * The `dataObject` is an object containing all the informations used by Popper.js
 * this object get passed to modifiers and to the `onCreate` and `onUpdate` callbacks.
 * @name dataObject
 * @property {Object} data.instance The Popper.js instance
 * @property {String} data.placement Placement applied to popper
 * @property {String} data.originalPlacement Placement originally defined on init
 * @property {Boolean} data.flipped True if popper has been flipped by flip modifier
 * @property {Boolean} data.hide True if the reference element is out of boundaries, useful to know when to hide the popper.
 * @property {HTMLElement} data.arrowElement Node used as arrow by arrow modifier
 * @property {Object} data.styles Any CSS property defined here will be applied to the popper, it expects the JavaScript nomenclature (eg. `marginBottom`)
 * @property {Object} data.arrowStyles Any CSS property defined here will be applied to the popper arrow, it expects the JavaScript nomenclature (eg. `marginBottom`)
 * @property {Object} data.boundaries Offsets of the popper boundaries
 * @property {Object} data.offsets The measurements of popper, reference and arrow elements.
 * @property {Object} data.offsets.popper `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.reference `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.arrow] `top` and `left` offsets, only one of them will be different from 0
 */

/**
 * Default options provided to Popper.js constructor.<br />
 * These can be overriden using the `options` argument of Popper.js.<br />
 * To override an option, simply pass as 3rd argument an object with the same
 * structure of this object, example:
 * ```
 * new Popper(ref, pop, {
 *   modifiers: {
 *     preventOverflow: { enabled: false }
 *   }
 * })
 * ```
 * @type {Object}
 * @static
 * @memberof Popper
 */
var Defaults = {
  /**
   * Popper's placement
   * @prop {Popper.placements} placement='bottom'
   */
  placement: 'bottom',

  /**
   * Set this to true if you want popper to position it self in 'fixed' mode
   * @prop {Boolean} positionFixed=false
   */
  positionFixed: false,

  /**
   * Whether events (resize, scroll) are initially enabled
   * @prop {Boolean} eventsEnabled=true
   */
  eventsEnabled: true,

  /**
   * Set to true if you want to automatically remove the popper when
   * you call the `destroy` method.
   * @prop {Boolean} removeOnDestroy=false
   */
  removeOnDestroy: false,

  /**
   * Callback called when the popper is created.<br />
   * By default, is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onCreate}
   */
  onCreate: function onCreate() {},

  /**
   * Callback called when the popper is updated, this callback is not called
   * on the initialization/creation of the popper, but only on subsequent
   * updates.<br />
   * By default, is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onUpdate}
   */
  onUpdate: function onUpdate() {},

  /**
   * List of modifiers used to modify the offsets before they are applied to the popper.
   * They provide most of the functionalities of Popper.js
   * @prop {modifiers}
   */
  modifiers: modifiers
};

/**
 * @callback onCreate
 * @param {dataObject} data
 */

/**
 * @callback onUpdate
 * @param {dataObject} data
 */

// Utils
// Methods
var Popper = function () {
  /**
   * Create a new Popper.js instance
   * @class Popper
   * @param {HTMLElement|referenceObject} reference - The reference element used to position the popper
   * @param {HTMLElement} popper - The HTML element used as popper.
   * @param {Object} options - Your custom options to override the ones defined in [Defaults](#defaults)
   * @return {Object} instance - The generated Popper.js instance
   */
  function Popper(reference, popper) {
    var _this = this;

    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    classCallCheck(this, Popper);

    this.scheduleUpdate = function () {
      return requestAnimationFrame(_this.update);
    };

    // make update() debounced, so that it only runs at most once-per-tick
    this.update = debounce(this.update.bind(this));

    // with {} we create a new object with the options inside it
    this.options = _extends({}, Popper.Defaults, options);

    // init state
    this.state = {
      isDestroyed: false,
      isCreated: false,
      scrollParents: []
    };

    // get reference and popper elements (allow jQuery wrappers)
    this.reference = reference && reference.jquery ? reference[0] : reference;
    this.popper = popper && popper.jquery ? popper[0] : popper;

    // Deep merge modifiers options
    this.options.modifiers = {};
    Object.keys(_extends({}, Popper.Defaults.modifiers, options.modifiers)).forEach(function (name) {
      _this.options.modifiers[name] = _extends({}, Popper.Defaults.modifiers[name] || {}, options.modifiers ? options.modifiers[name] : {});
    });

    // Refactoring modifiers' list (Object => Array)
    this.modifiers = Object.keys(this.options.modifiers).map(function (name) {
      return _extends({
        name: name
      }, _this.options.modifiers[name]);
    })
    // sort the modifiers by order
    .sort(function (a, b) {
      return a.order - b.order;
    });

    // modifiers have the ability to execute arbitrary code when Popper.js get inited
    // such code is executed in the same order of its modifier
    // they could add new properties to their options configuration
    // BE AWARE: don't add options to `options.modifiers.name` but to `modifierOptions`!
    this.modifiers.forEach(function (modifierOptions) {
      if (modifierOptions.enabled && isFunction(modifierOptions.onLoad)) {
        modifierOptions.onLoad(_this.reference, _this.popper, _this.options, modifierOptions, _this.state);
      }
    });

    // fire the first update to position the popper in the right place
    this.update();

    var eventsEnabled = this.options.eventsEnabled;
    if (eventsEnabled) {
      // setup event listeners, they will take care of update the position in specific situations
      this.enableEventListeners();
    }

    this.state.eventsEnabled = eventsEnabled;
  }

  // We can't use class properties because they don't get listed in the
  // class prototype and break stuff like Sinon stubs


  createClass(Popper, [{
    key: 'update',
    value: function update$$1() {
      return update.call(this);
    }
  }, {
    key: 'destroy',
    value: function destroy$$1() {
      return destroy.call(this);
    }
  }, {
    key: 'enableEventListeners',
    value: function enableEventListeners$$1() {
      return enableEventListeners.call(this);
    }
  }, {
    key: 'disableEventListeners',
    value: function disableEventListeners$$1() {
      return disableEventListeners.call(this);
    }

    /**
     * Schedule an update, it will run on the next UI update available
     * @method scheduleUpdate
     * @memberof Popper
     */


    /**
     * Collection of utilities useful when writing custom modifiers.
     * Starting from version 1.7, this method is available only if you
     * include `popper-utils.js` before `popper.js`.
     *
     * **DEPRECATION**: This way to access PopperUtils is deprecated
     * and will be removed in v2! Use the PopperUtils module directly instead.
     * Due to the high instability of the methods contained in Utils, we can't
     * guarantee them to follow semver. Use them at your own risk!
     * @static
     * @private
     * @type {Object}
     * @deprecated since version 1.8
     * @member Utils
     * @memberof Popper
     */

  }]);
  return Popper;
}();

/**
 * The `referenceObject` is an object that provides an interface compatible with Popper.js
 * and lets you use it as replacement of a real DOM node.<br />
 * You can use this method to position a popper relatively to a set of coordinates
 * in case you don't have a DOM node to use as reference.
 *
 * ```
 * new Popper(referenceObject, popperNode);
 * ```
 *
 * NB: This feature isn't supported in Internet Explorer 10
 * @name referenceObject
 * @property {Function} data.getBoundingClientRect
 * A function that returns a set of coordinates compatible with the native `getBoundingClientRect` method.
 * @property {number} data.clientWidth
 * An ES6 getter that will return the width of the virtual reference element.
 * @property {number} data.clientHeight
 * An ES6 getter that will return the height of the virtual reference element.
 */


Popper.Utils = (typeof window !== 'undefined' ? window : global).PopperUtils;
Popper.placements = placements;
Popper.Defaults = Defaults;

/* harmony default export */ __webpack_exports__["default"] = (Popper);
//# sourceMappingURL=popper.js.map

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(65)))

/***/ }),

/***/ 93:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ResponsiveDropdownContent_1 = __webpack_require__(156);
var ResponsiveComponentsUtils = /** @class */ (function () {
    function ResponsiveComponentsUtils() {
    }
    ResponsiveComponentsUtils.shouldDrawFacetSlider = function (root, facetSliderElement) {
        return ResponsiveDropdownContent_1.ResponsiveDropdownContent.isTargetInsideOpenedDropdown(facetSliderElement) || !this.isSmallFacetActivated(root);
    };
    ResponsiveComponentsUtils.isSmallTabsActivated = function (root) {
        return root.hasClass(this.smallTabsClassName);
    };
    ResponsiveComponentsUtils.isSmallFacetActivated = function (root) {
        return root.hasClass(this.smallFacetClassName);
    };
    ResponsiveComponentsUtils.isSmallRecommendationActivated = function (root) {
        return root.hasClass(this.smallRecommendationClassName);
    };
    ResponsiveComponentsUtils.activateSmallTabs = function (root) {
        root.addClass(this.smallTabsClassName);
    };
    ResponsiveComponentsUtils.deactivateSmallTabs = function (root) {
        root.removeClass(this.smallTabsClassName);
    };
    ResponsiveComponentsUtils.activateSmallFacet = function (root) {
        root.addClass(this.smallFacetClassName);
    };
    ResponsiveComponentsUtils.deactivateSmallFacet = function (root) {
        root.removeClass(this.smallFacetClassName);
    };
    ResponsiveComponentsUtils.activateSmallRecommendation = function (root) {
        root.addClass(this.smallRecommendationClassName);
    };
    ResponsiveComponentsUtils.deactivateSmallRecommendation = function (root) {
        root.removeClass(this.smallRecommendationClassName);
    };
    ResponsiveComponentsUtils.smallTabsClassName = 'coveo-small-tabs';
    ResponsiveComponentsUtils.smallFacetClassName = 'coveo-small-facets';
    ResponsiveComponentsUtils.smallRecommendationClassName = 'coveo-small-recommendation';
    return ResponsiveComponentsUtils;
}());
exports.ResponsiveComponentsUtils = ResponsiveComponentsUtils;


/***/ }),

/***/ 94:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Assert_1 = __webpack_require__(5);
var Utils_1 = __webpack_require__(4);
var Globalize = __webpack_require__(23);
var _ = __webpack_require__(0);
/**
 * A class which holds information and operation available on a single facet value returned by a {@link IGroupByRequest}.<br/>
 * This class is used extensively in the {@link Facet} component.
 */
var FacetValue = /** @class */ (function () {
    function FacetValue() {
        this.selected = false;
        this.excluded = false;
        this.waitingForDelta = false;
    }
    FacetValue.prototype.reset = function () {
        this.selected = false;
        this.excluded = false;
    };
    FacetValue.prototype.updateCountsFromNewValue = function (newValue) {
        Assert_1.Assert.exists(newValue);
        this.occurrences = newValue.occurrences;
        this.delta = newValue.delta;
        this.computedField = newValue.computedField;
    };
    FacetValue.prototype.clone = function () {
        this.computedField = undefined;
        this.delta = undefined;
        return this;
    };
    FacetValue.prototype.cloneWithZeroOccurrences = function () {
        this.occurrences = 0;
        return this.clone();
    };
    FacetValue.prototype.cloneWithDelta = function (count, delta) {
        Assert_1.Assert.isLargerOrEqualsThan(0, count);
        var clone = this.cloneWithZeroOccurrences();
        clone.delta = delta;
        clone.occurrences = count;
        return clone;
    };
    FacetValue.prototype.getFormattedCount = function () {
        var count = undefined;
        if (Utils_1.Utils.exists(this.delta) && this.delta > 0) {
            count = '+' + Globalize.format(this.delta, 'n0');
        }
        else {
            if (this.occurrences > 0) {
                count = Globalize.format(this.occurrences, 'n0');
            }
        }
        return count;
    };
    FacetValue.prototype.getFormattedComputedField = function (format) {
        if (this.computedField != 0) {
            return Globalize.format(this.computedField, format);
        }
        else {
            return undefined;
        }
    };
    FacetValue.create = function (value) {
        if (_.isString(value)) {
            return FacetValue.createFromValue(value);
        }
        else if (_.isObject(value)) {
            if ('computedFieldResults' in value) {
                return FacetValue.createFromGroupByValue(value);
            }
            else {
                return FacetValue.createFromFieldValue(value);
            }
        }
        else {
            throw new Error("Can't create value from " + value);
        }
    };
    FacetValue.createFromValue = function (value) {
        Assert_1.Assert.isNonEmptyString(value);
        var facetValue = new FacetValue();
        facetValue.value = value;
        facetValue.lookupValue = value;
        return facetValue;
    };
    FacetValue.createFromGroupByValue = function (groupByValue) {
        Assert_1.Assert.exists(groupByValue);
        Assert_1.Assert.exists(groupByValue);
        var facetValue = new FacetValue();
        facetValue.value = groupByValue.value;
        facetValue.lookupValue = Utils_1.Utils.exists(groupByValue.lookupValue) ? groupByValue.lookupValue : groupByValue.value;
        facetValue.occurrences = groupByValue.numberOfResults;
        facetValue.computedField = Utils_1.Utils.isNonEmptyArray(groupByValue.computedFieldResults) ? groupByValue.computedFieldResults[0] : undefined;
        facetValue.score = groupByValue.score;
        return facetValue;
    };
    FacetValue.createFromFieldValue = function (fieldValue) {
        Assert_1.Assert.exists(fieldValue);
        var facetValue = new FacetValue();
        facetValue.value = fieldValue.value;
        facetValue.lookupValue = fieldValue.lookupValue;
        facetValue.occurrences = fieldValue.numberOfResults;
        return facetValue;
    };
    return FacetValue;
}());
exports.FacetValue = FacetValue;
var FacetValues = /** @class */ (function () {
    function FacetValues(groupByResult) {
        if (Utils_1.Utils.exists(groupByResult)) {
            this.values = _.map(groupByResult.values, function (groupByValue) { return FacetValue.createFromGroupByValue(groupByValue); });
        }
        else {
            this.values = [];
        }
    }
    FacetValues.prototype.add = function (facetValue) {
        Assert_1.Assert.exists(facetValue);
        Assert_1.Assert.check(!this.contains(facetValue.value));
        this.values.push(facetValue);
    };
    FacetValues.prototype.remove = function (value) {
        Assert_1.Assert.isNonEmptyString(value);
        value = value;
        this.values = _.filter(this.values, function (elem) { return elem.value != value; });
    };
    FacetValues.prototype.size = function () {
        return this.values.length;
    };
    FacetValues.prototype.isEmpty = function () {
        return this.values.length == 0;
    };
    FacetValues.prototype.at = function (index) {
        Assert_1.Assert.isLargerOrEqualsThan(0, index);
        Assert_1.Assert.isSmallerThan(this.values.length, index);
        return this.values[index];
    };
    FacetValues.prototype.get = function (value) {
        return _.find(this.values, function (elem) { return elem.value.toLowerCase() == value.toLowerCase(); });
    };
    FacetValues.prototype.contains = function (value) {
        return Utils_1.Utils.exists(this.get(value));
    };
    FacetValues.prototype.getAll = function () {
        return this.values;
    };
    FacetValues.prototype.getSelected = function () {
        return _.filter(this.values, function (value) { return value.selected; });
    };
    FacetValues.prototype.getExcluded = function () {
        return _.filter(this.values, function (value) { return value.excluded; });
    };
    FacetValues.prototype.hasSelectedOrExcludedValues = function () {
        return this.getSelected().length != 0 || this.getExcluded().length != 0;
    };
    FacetValues.prototype.hasSelectedAndExcludedValues = function () {
        return this.getSelected().length != 0 && this.getExcluded().length != 0;
    };
    FacetValues.prototype.hasOnlyExcludedValues = function () {
        return this.getSelected().length == 0 && this.getExcluded().length != 0;
    };
    FacetValues.prototype.hasOnlySelectedValues = function () {
        return this.getSelected().length != 0 && this.getExcluded().length == 0;
    };
    FacetValues.prototype.reset = function () {
        _.each(this.values, function (elem) { return elem.reset(); });
    };
    FacetValues.prototype.importActiveValuesFromOtherList = function (other) {
        var _this = this;
        Assert_1.Assert.exists(other);
        _.each(other.getSelected(), function (otherValue) {
            var myValue = _this.get(otherValue.value);
            if (Utils_1.Utils.exists(myValue)) {
                myValue.selected = true;
            }
            else {
                _this.values.push(otherValue.cloneWithZeroOccurrences());
            }
        });
        _.each(other.getExcluded(), function (otherValue) {
            var myValue = _this.get(otherValue.value);
            if (Utils_1.Utils.exists(myValue)) {
                myValue.excluded = true;
            }
            else if (otherValue.occurrences != 0) {
                var occurrences = otherValue.occurrences;
                var clone = otherValue.cloneWithZeroOccurrences();
                clone.occurrences = occurrences;
                _this.values.push(clone);
            }
            else {
                _this.values.push(otherValue.cloneWithZeroOccurrences());
            }
        });
    };
    FacetValues.prototype.updateCountsFromNewValues = function (newValues) {
        Assert_1.Assert.exists(newValues);
        this.values = _.map(this.values, function (myValue) {
            var newValue = newValues.get(myValue.value);
            if (Utils_1.Utils.exists(newValue)) {
                myValue.updateCountsFromNewValue(newValue);
                return myValue;
            }
            else if (myValue.occurrences == null) {
                return myValue.cloneWithZeroOccurrences();
            }
            return myValue;
        });
    };
    FacetValues.prototype.updateDeltaWithFilteredFacetValues = function (filtered, isMultiValueField) {
        var _this = this;
        Assert_1.Assert.exists(filtered);
        _.each(this.values, function (unfilteredValue) {
            var filteredValue = filtered.get(unfilteredValue.value);
            unfilteredValue.waitingForDelta = false;
            if (Utils_1.Utils.exists(filteredValue)) {
                if (unfilteredValue.occurrences - filteredValue.occurrences > 0) {
                    // When there are only exclusion in the facet, there should be no "delta"
                    // The number of value for each facet will be what is selected, no addition.
                    if (_this.hasOnlyExcludedValues()) {
                        unfilteredValue.delta = null;
                        unfilteredValue.occurrences = filteredValue.occurrences;
                    }
                    else {
                        unfilteredValue.delta = unfilteredValue.occurrences - filteredValue.occurrences;
                    }
                }
                else {
                    unfilteredValue.delta = null;
                }
            }
            else if (!unfilteredValue.selected && !unfilteredValue.excluded) {
                if (isMultiValueField && filtered.values.length == 0) {
                    unfilteredValue.delta = null;
                    unfilteredValue.occurrences = 0;
                }
                else {
                    unfilteredValue.delta = unfilteredValue.occurrences;
                }
            }
        });
    };
    FacetValues.prototype.mergeWithUnfilteredFacetValues = function (unfiltered) {
        var _this = this;
        Assert_1.Assert.exists(unfiltered);
        var values = [];
        _.each(unfiltered.values, function (unfilteredValue) {
            var filteredValue = _this.get(unfilteredValue.value);
            if (Utils_1.Utils.exists(filteredValue)) {
                if (filteredValue.occurrences == unfilteredValue.occurrences) {
                    values.push(filteredValue);
                }
                else {
                    values.push(unfilteredValue.cloneWithDelta(unfilteredValue.occurrences, unfilteredValue.occurrences - filteredValue.occurrences));
                }
            }
            else {
                values.push(unfilteredValue.cloneWithDelta(unfilteredValue.occurrences, unfilteredValue.occurrences));
            }
        });
        var index = 0;
        _.each(this.values, function (value) {
            var unfilteredValue = unfiltered.get(value.value);
            if (!Utils_1.Utils.exists(unfilteredValue)) {
                if (value.selected || value.excluded) {
                    values.splice(index, 0, value);
                    index++;
                }
            }
            else {
                for (var i = 0; i < values.length; i++) {
                    if (values[i].value == value.value) {
                        index = i + 1;
                        break;
                    }
                }
            }
        });
        this.values = values;
    };
    FacetValues.prototype.sortValuesDependingOnStatus = function (excludeLastIndex) {
        this.values = _.sortBy(this.values, function (value) {
            if (value.selected) {
                return 1;
            }
            else if (value.excluded) {
                return 3;
            }
            else {
                return 2;
            }
        });
        if (excludeLastIndex != null && excludeLastIndex < this.values.length) {
            var nbExclude = this.getExcluded().length;
            var excludes = this.values.splice(this.values.length - nbExclude, nbExclude);
            Array.prototype.splice.apply(this.values, [excludeLastIndex - nbExclude, 0].concat(excludes));
        }
    };
    return FacetValues;
}());
exports.FacetValues = FacetValues;


/***/ }),

/***/ 95:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/// <reference path="Facet.ts" />
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
var ValueElement_1 = __webpack_require__(327);
var FacetValueElement = /** @class */ (function (_super) {
    __extends(FacetValueElement, _super);
    function FacetValueElement(facet, facetValue, keepDisplayedValueNextTime) {
        var _this = _super.call(this, facet, facetValue) || this;
        _this.facet = facet;
        _this.facetValue = facetValue;
        _this.keepDisplayedValueNextTime = keepDisplayedValueNextTime;
        return _this;
    }
    FacetValueElement.prototype.bindEvent = function () {
        _super.prototype.bindEvent.call(this, {
            displayNextTime: this.keepDisplayedValueNextTime,
            pinFacet: this.facet.options.preservePosition
        });
    };
    return FacetValueElement;
}(ValueElement_1.ValueElement));
exports.FacetValueElement = FacetValueElement;


/***/ })

});
//# sourceMappingURL=HierarchicalFacet__5d8084491af1464dbdb6.js.map