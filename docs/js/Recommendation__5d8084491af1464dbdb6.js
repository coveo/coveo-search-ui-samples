webpackJsonpCoveo__temporary([12],{

/***/ 146:
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
var SearchInterface_1 = __webpack_require__(18);
var ComponentOptions_1 = __webpack_require__(8);
var QueryEvents_1 = __webpack_require__(10);
var OmniboxEvents_1 = __webpack_require__(32);
var ResultListEvents_1 = __webpack_require__(29);
var SettingsEvents_1 = __webpack_require__(42);
var PreferencesPanelEvents_1 = __webpack_require__(73);
var AnalyticsEvents_1 = __webpack_require__(69);
var AnalyticsActionListMeta_1 = __webpack_require__(9);
var BreadcrumbEvents_1 = __webpack_require__(37);
var QuickviewEvents_1 = __webpack_require__(169);
var QueryStateModel_1 = __webpack_require__(12);
var Model_1 = __webpack_require__(16);
var Utils_1 = __webpack_require__(4);
var Dom_1 = __webpack_require__(1);
var ResponsiveRecommendation_1 = __webpack_require__(476);
var coveo_analytics_1 = __webpack_require__(74);
var RegisteredNamedMethods_1 = __webpack_require__(22);
var InitializationEvents_1 = __webpack_require__(15);
var _ = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
var DefaultRecommendationTemplate_1 = __webpack_require__(337);
var RecommendationQuery_1 = __webpack_require__(479);
var RecommendationAnalyticsClient_1 = __webpack_require__(152);
__webpack_require__(480);
/**
 * The Recommendation component is a {@link SearchInterface} that displays recommendations typically based on user
 * history.
 *
 * This component usually listens to the main SearchInterface. When the main SearchInterface generates a query, the
 * Recommendation component generates another query to get the recommendations at the same time.
 *
 * To get history-based recommendations, you will likely want to include the `pageview` script in your page (see
 * [coveo.analytics.js](https://github.com/coveo/coveo.analytics.js)). However, including this script is not mandatory.
 * For instance, you could use the Recommendation component without the Coveo Machine Learning service to create a
 * simple "recommended people" interface.
 *
 * It is possible to include this component inside another SearchInterface, but it is also possible to instantiate it as
 * a "standalone" search interface, without even instantiating a main SearchInterface component. In any case, a
 * Recommendation component always acts as a full-fledged search interface. Therefore, you can include any component
 * inside the Recommendation component (Searchbox, Facet, Sort, etc.), just as you would inside the main SearchInterface
 * component.
 */
var Recommendation = /** @class */ (function (_super) {
    __extends(Recommendation, _super);
    /**
     * Creates a new Recommendation component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the Recommendation component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time)
     * @param _window
     */
    function Recommendation(element, options, analyticsOptions, _window) {
        if (options === void 0) { options = {}; }
        if (analyticsOptions === void 0) { analyticsOptions = {}; }
        if (_window === void 0) { _window = window; }
        var _this = _super.call(this, element, ComponentOptions_1.ComponentOptions.initComponentOptions(element, Recommendation, options), analyticsOptions, _window) || this;
        _this.element = element;
        _this.options = options;
        _this.analyticsOptions = analyticsOptions;
        _this.element.style.display = '';
        if (!_this.options.id) {
            _this.generateDefaultId();
        }
        // This is done to allow the component to be included in another search interface without triggering the parent events.
        _this.preventEventPropagation();
        if (_this.options.mainSearchInterface) {
            _this.bindToMainSearchInterface();
        }
        Dom_1.$$(_this.element).on(QueryEvents_1.QueryEvents.buildingQuery, function (e, args) {
            return _this.handleRecommendationBuildingQuery(args);
        });
        Dom_1.$$(_this.element).on(QueryEvents_1.QueryEvents.querySuccess, function (e, args) { return _this.handleRecommendationQuerySuccess(args); });
        Dom_1.$$(_this.element).on(QueryEvents_1.QueryEvents.noResults, function (e, args) { return _this.handleRecommendationNoResults(); });
        Dom_1.$$(_this.element).on(QueryEvents_1.QueryEvents.queryError, function (e, args) { return _this.handleRecommendationQueryError(); });
        _this.historyStore = new coveo_analytics_1.history.HistoryStore();
        if (!_this.options.mainSearchInterface) {
            // When the recommendation component is "standalone", we add additional safeguard against bad config.
            _this.ensureCurrentPageViewExistsInStore();
        }
        ResponsiveRecommendation_1.ResponsiveRecommendation.init(_this.root, _this, options);
        return _this;
    }
    Recommendation.prototype.getId = function () {
        return this.options.id;
    };
    Recommendation.prototype.enable = function () {
        _super.prototype.enable.call(this);
        this.show();
    };
    Recommendation.prototype.disable = function () {
        _super.prototype.disable.call(this);
        this.hide();
    };
    Recommendation.prototype.hide = function () {
        Dom_1.$$(this.element).addClass('coveo-hidden');
    };
    Recommendation.prototype.show = function () {
        Dom_1.$$(this.element).removeClass('coveo-hidden');
    };
    Recommendation.prototype.ensureCurrentPageViewExistsInStore = function () {
        // It's not 100% sure that the element will actually be added in the store.
        // It's possible that an external script configured by the end user to log the page view already did that.
        // So we *could* end up with duplicate values in the store :
        // We rely on the fact that the coveo.analytics lib has defensive code against consecutive page view that are identical.
        // This is mainly done if the recommendation component is being initialized before the page view could be logged correctly by the coveo.analytics externa lib.
        var historyElement = {
            name: 'PageView',
            value: document.location.toString(),
            time: JSON.stringify(new Date()),
            title: _.escape(document.title)
        };
        this.historyStore.addElement(historyElement);
    };
    Recommendation.prototype.bindToMainSearchInterface = function () {
        this.bindComponentOptionsModelToMainSearchInterface();
        this.bindQueryEventsToMainSearchInterface();
    };
    Recommendation.prototype.bindComponentOptionsModelToMainSearchInterface = function () {
        var _this = this;
        // Try to fetch the componentOptions from the main search interface.
        // Since we do not know which interface is init first (recommendation or full search interface)
        // add a mechanism that waits for the full search interface to be correctly initialized
        // then, set the needed values on the component options model.
        var searchInterfaceComponent = RegisteredNamedMethods_1.get(this.options.mainSearchInterface, SearchInterface_1.SearchInterface);
        var alreadyInitialized = searchInterfaceComponent != null;
        var onceInitialized = function () {
            var mainSearchInterfaceOptionsModel = searchInterfaceComponent.getBindings().componentOptionsModel;
            _this.componentOptionsModel.setMultiple(mainSearchInterfaceOptionsModel.getAttributes());
            Dom_1.$$(_this.options.mainSearchInterface).on(_this.componentOptionsModel.getEventName(Model_1.MODEL_EVENTS.ALL), function () {
                _this.componentOptionsModel.setMultiple(mainSearchInterfaceOptionsModel.getAttributes());
            });
        };
        if (alreadyInitialized) {
            onceInitialized();
        }
        else {
            Dom_1.$$(this.options.mainSearchInterface).on(InitializationEvents_1.InitializationEvents.afterComponentsInitialization, function () {
                searchInterfaceComponent = RegisteredNamedMethods_1.get(_this.options.mainSearchInterface, SearchInterface_1.SearchInterface);
                onceInitialized();
            });
        }
    };
    Recommendation.prototype.bindQueryEventsToMainSearchInterface = function () {
        var _this = this;
        // Whenever a query sucessfully returns on the full search interface, refresh the recommendation component.
        Dom_1.$$(this.options.mainSearchInterface).on(QueryEvents_1.QueryEvents.querySuccess, function (e, args) {
            _this.mainInterfaceQuery = args;
            _this.mainQuerySearchUID = args.results.searchUid;
            _this.mainQueryPipeline = args.results.pipeline;
            if (args.results.results.length != 0) {
                _this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.recommendation, {});
                _this.queryController.executeQuery({
                    closeModalBox: false
                });
            }
        });
        Dom_1.$$(this.options.mainSearchInterface).on(QueryEvents_1.QueryEvents.queryError, function () { return _this.hide(); });
        Dom_1.$$(this.options.mainSearchInterface).on(QueryEvents_1.QueryEvents.noResults, function () { return _this.hide(); });
    };
    Recommendation.prototype.handleRecommendationBuildingQuery = function (data) {
        if (!this.disabled) {
            this.modifyQueryForRecommendation(data);
            this.addRecommendationInfoInQuery(data);
        }
    };
    Recommendation.prototype.handleRecommendationQuerySuccess = function (data) {
        if (!this.disabled) {
            if (this.options.hideIfNoResults) {
                if (data.results.totalCount === 0) {
                    this.hide();
                }
                else {
                    this.show();
                }
            }
        }
    };
    Recommendation.prototype.handleRecommendationNoResults = function () {
        if (!this.disabled) {
            if (this.options.hideIfNoResults) {
                this.hide();
            }
        }
    };
    Recommendation.prototype.handleRecommendationQueryError = function () {
        if (!this.disabled) {
            this.hide();
        }
    };
    Recommendation.prototype.modifyQueryForRecommendation = function (data) {
        if (this.mainInterfaceQuery) {
            Utils_1.Utils.copyObjectAttributes(data.queryBuilder, this.mainInterfaceQuery.queryBuilder, this.options.optionsToUse);
        }
    };
    Recommendation.prototype.addRecommendationInfoInQuery = function (data) {
        if (!_.isEmpty(this.options.userContext)) {
            data.queryBuilder.addContext(this.options.userContext);
        }
        data.queryBuilder.recommendation = this.options.id;
    };
    Recommendation.prototype.preventEventPropagation = function () {
        this.preventEventPropagationOn(QueryEvents_1.QueryEvents);
        this.preventEventPropagationOn(OmniboxEvents_1.OmniboxEvents);
        this.preventEventPropagationOn(ResultListEvents_1.ResultListEvents);
        this.preventEventPropagationOn(SettingsEvents_1.SettingsEvents);
        this.preventEventPropagationOn(PreferencesPanelEvents_1.PreferencesPanelEvents);
        this.preventEventPropagationOn(AnalyticsEvents_1.AnalyticsEvents);
        this.preventEventPropagationOn(BreadcrumbEvents_1.BreadcrumbEvents);
        this.preventEventPropagationOn(QuickviewEvents_1.QuickviewEvents);
        this.preventEventPropagationOn(InitializationEvents_1.InitializationEvents);
        this.preventEventPropagationOn(this.getAllModelEvents());
    };
    Recommendation.prototype.preventEventPropagationOn = function (eventType, eventName) {
        if (eventName === void 0) { eventName = function (event) {
            return event;
        }; }
        for (var event_1 in eventType) {
            Dom_1.$$(this.root).on(eventName(event_1), function (e) { return e.stopPropagation(); });
        }
    };
    Recommendation.prototype.getAllModelEvents = function () {
        var _this = this;
        var events = {};
        var queryStateModel = this.getBindings().queryStateModel;
        _.each(_.values(Model_1.Model.eventTypes), function (event) {
            var eventName = queryStateModel.getEventName(event);
            events[eventName] = eventName;
            _.each(_.values(QueryStateModel_1.QUERY_STATE_ATTRIBUTES), function (attribute) {
                var eventName = _this.queryStateModel.getEventName(event + attribute);
                events[eventName] = eventName;
            });
        });
        return events;
    };
    Recommendation.prototype.generateDefaultId = function () {
        var id = 'Recommendation';
        if (Recommendation.NEXT_ID !== 1) {
            this.logger.warn('Generating another recommendation default id', 'Consider configuring a human friendly / meaningful id for this interface');
            id = id + '_' + Recommendation.NEXT_ID;
        }
        Recommendation.NEXT_ID++;
        this.options.id = id;
    };
    Recommendation.ID = 'Recommendation';
    Recommendation.NEXT_ID = 1;
    Recommendation.doExport = function () {
        GlobalExports_1.exportGlobally({
            Recommendation: Recommendation,
            DefaultRecommendationTemplate: DefaultRecommendationTemplate_1.DefaultRecommendationTemplate,
            RecommendationQuery: RecommendationQuery_1.RecommendationQuery,
            RecommendationAnalyticsClient: RecommendationAnalyticsClient_1.RecommendationAnalyticsClient
        });
    };
    /**
     * The options for the recommendation component
     * @componentOptions
     */
    Recommendation.options = {
        /**
         * Specifies the main {@link SearchInterface} to listen to.
         */
        mainSearchInterface: ComponentOptions_1.ComponentOptions.buildSelectorOption(),
        /**
         * Specifies the user context to send to Coveo usage analytics.
         * The component sends this information with the query alongside the user history to get the recommendations.
         */
        userContext: ComponentOptions_1.ComponentOptions.buildJsonOption(),
        /**
         * Specifies the ID of the interface.
         * The usage analytics use the interface ID to know which recommendation interface was selected.
         *
         * Default value is `Recommendation` for the first one and `Recommendation_{number}`, where {number} depends on the
         * number of Recommendation interfaces with default IDs in the page for the others.
         */
        id: ComponentOptions_1.ComponentOptions.buildStringOption(),
        /**
         * Specifies which options from the main {@link QueryBuilder} to use in the triggered query.
         *
         * Possible values are:
         * - `expression`
         * - `advancedExpression`
         * - `constantExpression`
         * - `disjunctionExpression`
         *
         * **Example:**
         *
         * Adding the expression (`q`) and the advanced expression (`aq`) parts of the main query in the triggered query:
         *
         * `data-options-to-use="expression,advancedExpression"`
         *
         * Default value is `expression`.
         */
        optionsToUse: ComponentOptions_1.ComponentOptions.buildListOption({
            defaultValue: ['expression']
        }),
        /**
         * Specifies whether to send the actions history along with the triggered query.
         *
         * Setting this option to `false` makes it impossible for this component to get Coveo Machine Learning
         * recommendations.
         *
         * However, setting this option to `false` can be useful to display side results in a search page.
         *
         * Default value is `true`.
         *
         * @deprecated This option is now deprecated. The correct way to control this behavior is to configure an appropriate machine learning model in the administration interface (Recommendation, Relevance tuning, Query suggestions).
         */
        sendActionsHistory: ComponentOptions_1.ComponentOptions.buildBooleanOption({
            defaultValue: true,
            deprecated: 'This option is now deprecated. The correct way to control this behaviour is to configure an appropriate machine learning model in the administration interface (Recommendation, Relevance tuning, Query suggestions)'
        }),
        /**
         * Specifies whether to hide the Recommendations component if no result or recommendation is available.
         *
         * Default value is `true`.
         */
        hideIfNoResults: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        autoTriggerQuery: ComponentOptions_1.ComponentOptions.buildBooleanOption({
            postProcessing: function (value, options) {
                if (options.mainSearchInterface) {
                    return false;
                }
                return value;
            }
        }),
        /**
         * Specifies whether to enable *responsive mode* for Recommendation components. Setting this options to `false` on
         * any Recommendation component in a search interface disables responsive mode for all other Recommendation
         * components in the search interface.
         *
         * Responsive mode displays all Recommendation components under a single dropdown button whenever the width of the
         * HTML element which the search interface is bound to reaches or falls behind a certain threshold (see
         * {@link Recommendation.options.responsiveBreakpoint}).
         *
         * See also {@link Recommendation.options.dropdownHeaderLabel}.
         *
         * Default value is `true`.
         */
        enableResponsiveMode: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        /**
         * If {@link Recommendation.options.enableResponsiveMode} is `true` for all Recommendation components, specifies the
         * width threshold (in pixels) of the search interface at which Recommendation components go in responsive mode.
         *
         * Recommendation components go in responsive mode when the width of the search interface is equal to or lower than
         * this value.
         *
         * The `search interface` corresponds to the HTML element with the class `CoveoSearchInterface`.
         *
         * If more than one Recommendation component in the search interface specifies a value for this option, then the
         * framework uses the last occurrence of the option.
         *
         * Default value is `1000`.
         */
        responsiveBreakpoint: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 1000 }),
        /**
         * If {@link Recommendation.options.enableResponsiveMode} is `true` for all Recommendation components, specifies the
         * label of the dropdown button that allows to display the Recommendation components when in responsive mode.
         *
         * If more than one Recommendation component in the search interface specifies a value for this option, then the
         * framework uses the first occurrence of the option.
         *
         * Default value is `Recommendations`.
         */
        dropdownHeaderLabel: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption({ defaultValue: 'Recommendations' })
    };
    return Recommendation;
}(SearchInterface_1.SearchInterface));
exports.Recommendation = Recommendation;
// We do not register the Recommendation component since it is done with .coveo('initRecommendation')


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

/***/ 169:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The `QuickviewEvents` static class contains the string definitions of all events that strongly relate to the
 * [`Quickview`]{@link Quickview} component.
 */
var QuickviewEvents = /** @class */ (function () {
    function QuickviewEvents() {
    }
    /**
     * Triggered by the [`QuickviewDocument`]{@link QuickviewDocument} component when the content to display in the
     * quickview modal window has just finished downloading.
     *
     * The [`Quickview`]{@link Quickview} component listens to this event to know when to remove its loading animation.
     *
     * All `quickviewLoaded` event handlers receive a [`QuickviewLoadedEventArgs`]{@link IQuickviewLoadedEventArgs} object
     * as an argument.
     *
     * @type {string} The string value is `quickviewLoaded`.
     */
    QuickviewEvents.quickviewLoaded = 'quickviewLoaded';
    /**
     * Triggered by the [`QuickviewDocument`]{@link QuickviewDocument} component when the end user has just clicked the
     * **Quickview** button/link to open the quickview modal window.
     *
     * This event allows external code to modify the terms to highlight before the content of the quickview modal window
     * is rendered.
     *
     * All `openQuickview` event handlers receive an
     * [`OpenQuickviewEventArgs`]{@link ResultListEvents.IOpenQuickviewEventArgs} object as an argument.
     *
     * @type {string} The string value is `openQuickview`.
     */
    QuickviewEvents.openQuickview = 'openQuickview';
    return QuickviewEvents;
}());
exports.QuickviewEvents = QuickviewEvents;


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

/***/ 337:
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
var Template_1 = __webpack_require__(21);
var DefaultRecommendationTemplate = /** @class */ (function (_super) {
    __extends(DefaultRecommendationTemplate, _super);
    function DefaultRecommendationTemplate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DefaultRecommendationTemplate.prototype.instantiateToString = function (object) {
        var template = "<div class=\"coveo-result-frame\">\n        <div class=\"coveo-result-row\">\n          <div class=\"coveo-result-cell\" style=\"width:40px;text-align:center;vertical-align:middle;\">\n            <span class=\"CoveoIcon\" data-small=\"true\" data-with-label=\"false\">\n            </span>\n          </div>\n          <div class=\"coveo-result-cell\" style=\"padding:0 0 3px 5px;vertical-align:middle\">\n            <div class=\"coveo-result-row\">\n              <div class=\"coveo-result-cell\" style=\"font-size:10pt;\">\n                <a class=\"CoveoResultLink\" style=\"display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis\">\n                </a>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>";
        return template;
    };
    DefaultRecommendationTemplate.prototype.instantiateToElement = function (object) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var div = document.createElement('div');
            div.innerHTML = _this.instantiateToString(object);
            resolve(div);
        });
    };
    return DefaultRecommendationTemplate;
}(Template_1.Template));
exports.DefaultRecommendationTemplate = DefaultRecommendationTemplate;


/***/ }),

/***/ 371:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 476:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ResponsiveComponentsManager_1 = __webpack_require__(80);
var ResponsiveComponentsUtils_1 = __webpack_require__(93);
var SearchInterface_1 = __webpack_require__(18);
var Utils_1 = __webpack_require__(4);
var Dom_1 = __webpack_require__(1);
var Logger_1 = __webpack_require__(11);
var Recommendation_1 = __webpack_require__(146);
var RecommendationDropdownContent_1 = __webpack_require__(477);
var ResponsiveDropdownHeader_1 = __webpack_require__(326);
var ResponsiveDropdown_1 = __webpack_require__(161);
var Strings_1 = __webpack_require__(7);
var Component_1 = __webpack_require__(6);
var RegisteredNamedMethods_1 = __webpack_require__(22);
var QueryEvents_1 = __webpack_require__(10);
var _ = __webpack_require__(0);
__webpack_require__(478);
var MiscModules_1 = __webpack_require__(56);
var ResponsiveRecommendation = /** @class */ (function () {
    function ResponsiveRecommendation(coveoRoot, ID, options, responsiveDropdown) {
        this.coveoRoot = coveoRoot;
        this.ID = ID;
        this.responsiveDropdown = responsiveDropdown;
        this.recommendationRoot = this.getRecommendationRoot();
        this.dropdownHeaderLabel = options.dropdownHeaderLabel;
        this.breakpoint = this.defineResponsiveBreakpoint(options);
        this.searchInterface = Component_1.Component.get(this.coveoRoot.el, SearchInterface_1.SearchInterface, false);
        this.dropdown = this.buildDropdown(responsiveDropdown);
        this.facets = this.getFacets();
        this.facetSliders = this.getFacetSliders();
        this.registerOnOpenHandler();
        this.registerOnCloseHandler();
        this.registerQueryEvents();
        this.handleResizeEvent();
    }
    ResponsiveRecommendation.init = function (root, component, options) {
        var logger = new Logger_1.Logger('ResponsiveRecommendation');
        var coveoRoot = this.findParentRootOfRecommendationComponent(root);
        if (!coveoRoot) {
            logger.info('Recommendation component has no parent interface. Disabling responsive mode for this component.');
            return;
        }
        if (!Dom_1.$$(coveoRoot).find('.coveo-results-column')) {
            logger.info('Cannot find element with class coveo-results-column. Disabling responsive mode for this component.');
            return;
        }
        ResponsiveComponentsManager_1.ResponsiveComponentsManager.register(ResponsiveRecommendation, Dom_1.$$(coveoRoot), Recommendation_1.Recommendation.ID, component, _.extend({}, options, { initializationEventRoot: Dom_1.$$(root) }));
    };
    ResponsiveRecommendation.findParentRootOfRecommendationComponent = function (root) {
        var coveoRoot = Dom_1.$$(root).parents(Component_1.Component.computeCssClassName(SearchInterface_1.SearchInterface));
        if (coveoRoot[0]) {
            return Dom_1.$$(coveoRoot[0]);
        }
        return null;
    };
    ResponsiveRecommendation.prototype.handleResizeEvent = function () {
        if (this.needSmallMode() && !ResponsiveComponentsUtils_1.ResponsiveComponentsUtils.isSmallRecommendationActivated(this.coveoRoot)) {
            this.changeToSmallMode();
        }
        else if (!this.needSmallMode() && ResponsiveComponentsUtils_1.ResponsiveComponentsUtils.isSmallRecommendationActivated(this.coveoRoot)) {
            this.changeToLargeMode();
        }
        if (this.dropdown.isOpened) {
            this.dropdown.dropdownContent.positionDropdown();
        }
    };
    ResponsiveRecommendation.prototype.needDropdownWrapper = function () {
        return this.needSmallMode();
    };
    ResponsiveRecommendation.prototype.needSmallMode = function () {
        var isWidthSmallerThanBreakpoint = this.coveoRoot.width() <= this.breakpoint;
        if (!this.searchInterface) {
            return isWidthSmallerThanBreakpoint;
        }
        switch (this.searchInterface.responsiveComponents.getResponsiveMode()) {
            case 'small':
                return true;
            case 'auto':
                return isWidthSmallerThanBreakpoint;
            default:
                return false;
        }
    };
    ResponsiveRecommendation.prototype.changeToSmallMode = function () {
        var _this = this;
        this.dropdown.close();
        var header = this.coveoRoot.find("." + ResponsiveComponentsManager_1.ResponsiveComponentsManager.DROPDOWN_HEADER_WRAPPER_CSS_CLASS);
        if (!header) {
            // It's possible that recommendation gets initialized before the main interface is completed.
            // We defer the resize event execution in that case.
            MiscModules_1.Defer.defer(function () { return _this.handleResizeEvent(); });
        }
        else {
            Dom_1.$$(header).append(this.dropdown.dropdownHeader.element.el);
            this.disableFacetPreservePosition();
            ResponsiveComponentsUtils_1.ResponsiveComponentsUtils.activateSmallRecommendation(this.coveoRoot);
            ResponsiveComponentsUtils_1.ResponsiveComponentsUtils.activateSmallRecommendation(this.recommendationRoot);
        }
    };
    ResponsiveRecommendation.prototype.changeToLargeMode = function () {
        this.enableFacetPreservePosition();
        this.dropdown.cleanUp();
        ResponsiveComponentsUtils_1.ResponsiveComponentsUtils.deactivateSmallRecommendation(this.coveoRoot);
        ResponsiveComponentsUtils_1.ResponsiveComponentsUtils.deactivateSmallRecommendation(this.recommendationRoot);
    };
    ResponsiveRecommendation.prototype.buildDropdown = function (responsiveDropdown) {
        var dropdownContent = this.buildDropdownContent();
        var dropdownHeader = this.buildDropdownHeader();
        var dropdown = responsiveDropdown ? responsiveDropdown : new ResponsiveDropdown_1.ResponsiveDropdown(dropdownContent, dropdownHeader, this.coveoRoot);
        dropdown.disablePopupBackground();
        return dropdown;
    };
    ResponsiveRecommendation.prototype.buildDropdownHeader = function () {
        var dropdownHeaderElement = Dom_1.$$('a');
        var content = Dom_1.$$('p');
        content.text(Strings_1.l(this.dropdownHeaderLabel));
        dropdownHeaderElement.el.appendChild(content.el);
        var dropdownHeader = new ResponsiveDropdownHeader_1.ResponsiveDropdownHeader('recommendation', dropdownHeaderElement);
        return dropdownHeader;
    };
    ResponsiveRecommendation.prototype.buildDropdownContent = function () {
        var dropdownContentElement;
        var recommendationColumn = this.coveoRoot.find('.coveo-recommendation-column');
        if (recommendationColumn) {
            dropdownContentElement = Dom_1.$$(recommendationColumn);
        }
        else {
            dropdownContentElement = Dom_1.$$(this.coveoRoot.find('.' + Component_1.Component.computeCssClassName(Recommendation_1.Recommendation)));
        }
        var dropdownContent = new RecommendationDropdownContent_1.RecommendationDropdownContent('recommendation', dropdownContentElement, this.coveoRoot);
        return dropdownContent;
    };
    ResponsiveRecommendation.prototype.defineResponsiveBreakpoint = function (options) {
        var breakpoint;
        if (Utils_1.Utils.isNullOrUndefined(options.responsiveBreakpoint)) {
            breakpoint = ResponsiveRecommendation.RESPONSIVE_BREAKPOINT;
        }
        else {
            breakpoint = options.responsiveBreakpoint;
        }
        return breakpoint;
    };
    ResponsiveRecommendation.prototype.getFacetSliders = function () {
        var facetSliders = [];
        _.each(this.coveoRoot.findAll('.' + Component_1.Component.computeCssClassNameForType("FacetSlider")), function (facetSliderElement) {
            var facetSlider = Component_1.Component.get(facetSliderElement);
            facetSliders.push(facetSlider);
        });
        return facetSliders;
    };
    ResponsiveRecommendation.prototype.getFacets = function () {
        var facets = [];
        _.each(this.coveoRoot.findAll('.' + Component_1.Component.computeCssClassNameForType('Facet')), function (facetElement) {
            var facet = Component_1.Component.get(facetElement);
            facets.push(facet);
        });
        return facets;
    };
    ResponsiveRecommendation.prototype.dismissFacetSearches = function () {
        _.each(this.facets, function (facet) {
            if (facet.facetSearch && facet.facetSearch.currentlyDisplayedResults) {
                facet.facetSearch.completelyDismissSearch();
            }
        });
    };
    ResponsiveRecommendation.prototype.enableFacetPreservePosition = function () {
        _.each(this.facets, function (facet) { return (facet.options.preservePosition = true); });
    };
    ResponsiveRecommendation.prototype.disableFacetPreservePosition = function () {
        _.each(this.facets, function (facet) { return (facet.options.preservePosition = false); });
    };
    ResponsiveRecommendation.prototype.drawFacetSliderGraphs = function () {
        _.each(this.facetSliders, function (facetSlider) { return facetSlider.drawDelayedGraphData(); });
    };
    ResponsiveRecommendation.prototype.registerOnOpenHandler = function () {
        this.dropdown.registerOnOpenHandler(this.drawFacetSliderGraphs, this);
    };
    ResponsiveRecommendation.prototype.registerOnCloseHandler = function () {
        this.dropdown.registerOnCloseHandler(this.dismissFacetSearches, this);
    };
    ResponsiveRecommendation.prototype.getRecommendationRoot = function () {
        return Dom_1.$$(this.coveoRoot.find('.' + Component_1.Component.computeCssClassName(Recommendation_1.Recommendation)));
    };
    ResponsiveRecommendation.prototype.registerQueryEvents = function () {
        var _this = this;
        var recommendationInstance = RegisteredNamedMethods_1.get(this.recommendationRoot.el, SearchInterface_1.SearchInterface);
        if (recommendationInstance && recommendationInstance.options.hideIfNoResults) {
            this.coveoRoot.on(QueryEvents_1.QueryEvents.querySuccess, function (e, data) { return _this.handleRecommnendationQuerySucess(data); });
            this.coveoRoot.on(QueryEvents_1.QueryEvents.noResults, function (e, data) { return _this.handleRecommendationNoResults(); });
        }
        this.coveoRoot.on(QueryEvents_1.QueryEvents.queryError, function () { return _this.handleRecommendationQueryError(); });
    };
    ResponsiveRecommendation.prototype.handleRecommnendationQuerySucess = function (data) {
        if (data.results.totalCount === 0) {
            this.dropdown.close();
            this.dropdown.dropdownHeader.hide();
        }
        else {
            this.dropdown.dropdownHeader.show();
        }
    };
    ResponsiveRecommendation.prototype.handleRecommendationNoResults = function () {
        this.dropdown.close();
        this.dropdown.dropdownHeader.hide();
    };
    ResponsiveRecommendation.prototype.handleRecommendationQueryError = function () {
        this.dropdown.close();
        this.dropdown.dropdownHeader.hide();
    };
    ResponsiveRecommendation.DROPDOWN_CONTAINER_CSS_CLASS_NAME = 'coveo-recommendation-dropdown-container';
    ResponsiveRecommendation.RESPONSIVE_BREAKPOINT = 1000;
    return ResponsiveRecommendation;
}());
exports.ResponsiveRecommendation = ResponsiveRecommendation;


/***/ }),

/***/ 477:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ResponsiveDropdownContent_1 = __webpack_require__(156);
var Dom_1 = __webpack_require__(1);
var RecommendationDropdownContent = /** @class */ (function () {
    function RecommendationDropdownContent(componentName, element, coveoRoot) {
        this.element = element;
        this.coveoRoot = coveoRoot;
        this.cssClassName = "coveo-" + componentName + "-dropdown-content";
        this.element.addClass(this.cssClassName);
        this.element.addClass(ResponsiveDropdownContent_1.ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME);
    }
    RecommendationDropdownContent.prototype.positionDropdown = function () {
        this.element.el.style.display = '';
        var dropdownContentWrapper = this.coveoRoot.find('.coveo-results-column');
        Dom_1.$$(dropdownContentWrapper).prepend(this.element.el);
        this.element.addClass(ResponsiveDropdownContent_1.ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME);
        this.element.addClass(this.cssClassName);
        // forces the browser to reflow the element, so that the transition is applied.
        window.getComputedStyle(this.element.el).maxHeight;
        this.element.addClass(RecommendationDropdownContent.OPENED_DROPDOWN_CSS_CLASS_NAME);
    };
    RecommendationDropdownContent.prototype.hideDropdown = function () {
        this.element.addClass(ResponsiveDropdownContent_1.ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME);
        this.element.addClass(this.cssClassName);
        this.element.removeClass(RecommendationDropdownContent.OPENED_DROPDOWN_CSS_CLASS_NAME);
    };
    RecommendationDropdownContent.prototype.cleanUp = function () {
        this.element.removeClass(this.cssClassName);
        this.element.removeClass(ResponsiveDropdownContent_1.ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME);
    };
    RecommendationDropdownContent.OPENED_DROPDOWN_CSS_CLASS_NAME = 'coveo-open-dropdown-content';
    return RecommendationDropdownContent;
}());
exports.RecommendationDropdownContent = RecommendationDropdownContent;


/***/ }),

/***/ 478:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 479:
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
var ComponentOptions_1 = __webpack_require__(8);
var Utils_1 = __webpack_require__(4);
var QueryEvents_1 = __webpack_require__(10);
var Initialization_1 = __webpack_require__(2);
var Dom_1 = __webpack_require__(1);
var _ = __webpack_require__(0);
var RecommendationQuery = /** @class */ (function (_super) {
    __extends(RecommendationQuery, _super);
    function RecommendationQuery(element, options, bindings) {
        var _this = _super.call(this, element, RecommendationQuery.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, RecommendationQuery, options);
        if (_this.element.tagName.toLowerCase() === 'script') {
            try {
                _this.content = Utils_1.Utils.decodeHTMLEntities(Dom_1.$$(_this.element).text());
            }
            catch (e) {
                return _this;
            }
            if (!_.isUndefined(_this.content) && _this.content != '') {
                _this.bind.onRootElement(QueryEvents_1.QueryEvents.buildingQuery, _this.handleBuildingQuery);
            }
        }
        return _this;
    }
    RecommendationQuery.prototype.handleBuildingQuery = function (data) {
        data.queryBuilder.advancedExpression.add(this.content);
    };
    RecommendationQuery.ID = 'RecommendationQuery';
    /**
     * The options for the RecommendationQuery component
     * @componentOptions
     */
    RecommendationQuery.options = {};
    return RecommendationQuery;
}(Component_1.Component));
exports.RecommendationQuery = RecommendationQuery;
Initialization_1.Initialization.registerAutoCreateComponent(RecommendationQuery);


/***/ }),

/***/ 480:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

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


/***/ })

});
//# sourceMappingURL=Recommendation__5d8084491af1464dbdb6.js.map