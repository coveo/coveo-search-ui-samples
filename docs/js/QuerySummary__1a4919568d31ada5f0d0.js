webpackJsonpCoveo__temporary([38],{

/***/ 195:
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
var QueryEvents_1 = __webpack_require__(10);
var Dom_1 = __webpack_require__(2);
var Assert_1 = __webpack_require__(5);
var Strings_1 = __webpack_require__(8);
var AnalyticsActionListMeta_1 = __webpack_require__(9);
var Initialization_1 = __webpack_require__(1);
var QueryStateModel_1 = __webpack_require__(12);
var Globalize = __webpack_require__(25);
var QuerySummaryEvents_1 = __webpack_require__(329);
var GlobalExports_1 = __webpack_require__(3);
var underscore_1 = __webpack_require__(0);
var RegisteredNamedMethods_1 = __webpack_require__(26);
__webpack_require__(415);
/**
 * The QuerySummary component can display information about the currently displayed range of results (e.g., "Results
 * 1-10 of 123").
 *
 * If the query matches no item, the QuerySummary component can instead display tips to help the end user formulate
 * a better query.
 */
var QuerySummary = /** @class */ (function (_super) {
    __extends(QuerySummary, _super);
    /**
     * Creates a new QuerySummary component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the QuerySummary component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function QuerySummary(element, options, bindings) {
        var _this = _super.call(this, element, QuerySummary.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, QuerySummary, options);
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.querySuccess, function (data) { return _this.handleQuerySuccess(data); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.queryError, function () { return _this.hide(); });
        _this.hide();
        _this.textContainer = Dom_1.$$('span').el;
        _this.element.appendChild(_this.textContainer);
        return _this;
    }
    QuerySummary.prototype.hide = function () {
        Dom_1.$$(this.element).addClass('coveo-hidden');
    };
    QuerySummary.prototype.show = function () {
        Dom_1.$$(this.element).removeClass('coveo-hidden');
    };
    QuerySummary.prototype.render = function (queryPerformed, queryResults) {
        Dom_1.$$(this.textContainer).empty();
        this.show();
        if (!this.options.onlyDisplaySearchTips) {
            if (this.isInfiniteScrollingMode()) {
                this.renderSummaryInInfiniteScrollingMode(queryPerformed, queryResults);
            }
            else {
                this.renderSummaryInStandardMode(queryPerformed, queryResults);
            }
        }
        if (queryResults.exception != null && queryResults.exception.code != null) {
            var code = ('QueryException' + queryResults.exception.code).toLocaleString();
            this.textContainer.innerHTML = Strings_1.l('QueryException', code);
        }
        else if (queryResults.results.length == 0) {
            this.displayInfoOnNoResults();
        }
        else {
            this.lastKnownGoodState = this.queryStateModel.getAttributes();
        }
    };
    QuerySummary.prototype.handleQuerySuccess = function (data) {
        Assert_1.Assert.exists(data);
        this.render(data.query, data.results);
    };
    QuerySummary.prototype.isInfiniteScrollingMode = function () {
        var allResultsLists = Dom_1.$$(this.root).findAll("." + Component_1.Component.computeCssClassNameForType('ResultList'));
        var anyResultListIsUsingInfiniteScroll = underscore_1.any(allResultsLists, function (resultList) {
            return RegisteredNamedMethods_1.get(resultList).options.enableInfiniteScroll;
        });
        return anyResultListIsUsingInfiniteScroll;
    };
    QuerySummary.prototype.formatSummary = function (queryPerformed, queryResults) {
        var first = Globalize.format(queryPerformed.firstResult + 1, 'n0');
        var last = Globalize.format(queryPerformed.firstResult + queryResults.results.length, 'n0');
        var totalCount = Globalize.format(queryResults.totalCountFiltered, 'n0');
        var query = queryPerformed.q ? underscore_1.escape(queryPerformed.q.trim()) : '';
        var highlightFirst = Dom_1.$$('span', { className: 'coveo-highlight' }, first).el;
        var highlightLast = Dom_1.$$('span', { className: 'coveo-highlight' }, last).el;
        var highlightTotal = Dom_1.$$('span', { className: 'coveo-highlight' }, totalCount).el;
        var highlightQuery = Dom_1.$$('span', { className: 'coveo-highlight' }, query).el;
        return {
            first: first,
            last: last,
            totalCount: totalCount,
            query: query,
            highlightFirst: highlightFirst,
            highlightLast: highlightLast,
            highlightTotal: highlightTotal,
            highlightQuery: highlightQuery
        };
    };
    QuerySummary.prototype.renderSummaryInStandardMode = function (queryPerformed, queryResults) {
        if (queryResults.results.length > 0) {
            var _a = this.formatSummary(queryPerformed, queryResults), query = _a.query, highlightFirst = _a.highlightFirst, highlightLast = _a.highlightLast, highlightTotal = _a.highlightTotal, highlightQuery = _a.highlightQuery;
            if (query) {
                this.textContainer.innerHTML = Strings_1.l('ShowingResultsOfWithQuery', highlightFirst.outerHTML, highlightLast.outerHTML, highlightTotal.outerHTML, highlightQuery.outerHTML, queryResults.results.length);
            }
            else {
                this.textContainer.innerHTML = Strings_1.l('ShowingResultsOf', highlightFirst.outerHTML, highlightLast.outerHTML, highlightTotal.outerHTML, queryResults.results.length);
            }
        }
    };
    QuerySummary.prototype.renderSummaryInInfiniteScrollingMode = function (queryPerformed, queryResults) {
        if (queryResults.results.length > 0) {
            var _a = this.formatSummary(queryPerformed, queryResults), query = _a.query, highlightQuery = _a.highlightQuery, highlightTotal = _a.highlightTotal;
            if (query) {
                this.textContainer.innerHTML = Strings_1.l('ShowingResultsWithQuery', highlightTotal.outerHTML, highlightQuery.outerHTML, queryResults.results.length);
            }
            else {
                this.textContainer.innerHTML = Strings_1.l('ShowingResults', highlightTotal.outerHTML, queryResults.results.length);
            }
        }
    };
    QuerySummary.prototype.displayInfoOnNoResults = function () {
        var _this = this;
        var queryEscaped = underscore_1.escape(this.queryStateModel.get(QueryStateModel_1.QueryStateModel.attributesEnum.q));
        var noResultsForString;
        if (queryEscaped != '') {
            noResultsForString = Dom_1.$$('div', {
                className: 'coveo-query-summary-no-results-string'
            }, Strings_1.l('noResultFor', Dom_1.$$('span', { className: 'coveo-highlight' }, queryEscaped).el.outerHTML));
        }
        var cancelLastAction = Dom_1.$$('div', {
            className: 'coveo-query-summary-cancel-last'
        }, Strings_1.l('CancelLastAction'));
        cancelLastAction.on('click', function () {
            _this.usageAnalytics.logCustomEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.noResultsBack, {}, _this.root);
            _this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.noResultsBack, {});
            if (_this.lastKnownGoodState) {
                _this.queryStateModel.reset();
                _this.queryStateModel.setMultiple(_this.lastKnownGoodState);
                Dom_1.$$(_this.root).trigger(QuerySummaryEvents_1.QuerySummaryEvents.cancelLastAction);
                _this.queryController.executeQuery();
            }
            else {
                history.back();
            }
        });
        var searchTipsInfo = Dom_1.$$('div', {
            className: 'coveo-query-summary-search-tips-info'
        });
        searchTipsInfo.text(Strings_1.l('SearchTips'));
        var searchTips = Dom_1.$$('ul');
        var checkSpelling = Dom_1.$$('li');
        checkSpelling.text(Strings_1.l('CheckSpelling'));
        var fewerKeywords = Dom_1.$$('li');
        fewerKeywords.text(Strings_1.l('TryUsingFewerKeywords'));
        searchTips.el.appendChild(checkSpelling.el);
        searchTips.el.appendChild(fewerKeywords.el);
        if (this.queryStateModel.atLeastOneFacetIsActive()) {
            var fewerFilter = Dom_1.$$('li');
            fewerFilter.text(Strings_1.l('SelectFewerFilters'));
            searchTips.el.appendChild(fewerFilter.el);
        }
        if (this.options.enableSearchTips) {
            if (noResultsForString) {
                this.textContainer.appendChild(noResultsForString.el);
            }
            this.textContainer.appendChild(cancelLastAction.el);
            this.textContainer.appendChild(searchTipsInfo.el);
            this.textContainer.appendChild(searchTips.el);
        }
        else {
            if (noResultsForString) {
                this.textContainer.appendChild(noResultsForString.el);
            }
            this.textContainer.appendChild(cancelLastAction.el);
        }
    };
    QuerySummary.ID = 'QuerySummary';
    QuerySummary.doExport = function () {
        GlobalExports_1.exportGlobally({
            QuerySummary: QuerySummary
        });
    };
    /**
     * Options for the component
     * @componentOptions
     */
    QuerySummary.options = {
        /**
         * Specifies whether to display the search tips to the end user when there are no search results.
         *
         * Default value is `true`.
         */
        enableSearchTips: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        /**
         * Specifies whether to hide the information about the currently displayed range of results and only display the
         * search tips instead.
         *
         * Default value is `false`.
         */
        onlyDisplaySearchTips: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false })
    };
    return QuerySummary;
}(Component_1.Component));
exports.QuerySummary = QuerySummary;
Initialization_1.Initialization.registerAutoCreateComponent(QuerySummary);


/***/ }),

/***/ 329:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This static class is there to contains the different string definition for all the events related to the {@link AdvancedSearch} component.
 */
var QuerySummaryEvents = /** @class */ (function () {
    function QuerySummaryEvents() {
    }
    /**
     * Triggered when the last action is being cancelled by the query summary component
     *
     * Allows external code to revert their last action.
     * @type {string}
     */
    QuerySummaryEvents.cancelLastAction = 'cancelLastAction';
    return QuerySummaryEvents;
}());
exports.QuerySummaryEvents = QuerySummaryEvents;


/***/ }),

/***/ 415:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=QuerySummary__1a4919568d31ada5f0d0.js.map