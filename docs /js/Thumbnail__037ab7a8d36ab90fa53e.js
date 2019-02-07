webpackJsonpCoveo__temporary([27,41,74],{

/***/ 141:
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
var Assert_1 = __webpack_require__(5);
var QueryUtils_1 = __webpack_require__(20);
var Initialization_1 = __webpack_require__(2);
var Utils_1 = __webpack_require__(4);
var FileTypes_1 = __webpack_require__(96);
var Dom_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
/**
 * The Icon component outputs the corresponding icon for a given file type. The component searches for a suitable icon
 * from those available in the Coveo JavaScript Search Framework. If the component finds no suitable icon, it instead
 * outputs a generic icon.
 *
 * This component is a result template component (see [Result Templates](https://developers.coveo.com/x/aIGfAQ)).
 */
var Icon = /** @class */ (function (_super) {
    __extends(Icon, _super);
    /**
     * Creates a new Icon component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the Icon component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     * @param result The result to associate the component with.
     */
    function Icon(element, options, bindings, result) {
        var _this = _super.call(this, element, Icon.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.result = result;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, Icon, options);
        _this.result = _this.result || _this.resolveResult();
        Assert_1.Assert.exists(_this.result);
        var possibleInternalQuickview = Dom_1.$$(_this.element).find('.' + Component_1.Component.computeCssClassNameForType('Quickview'));
        if (!Utils_1.Utils.isNullOrUndefined(possibleInternalQuickview) && QueryUtils_1.QueryUtils.hasHTMLVersion(_this.result)) {
            Dom_1.$$(_this.element).addClass('coveo-with-quickview');
            Dom_1.$$(_this.element).on('click', function () {
                var qv = Component_1.Component.get(possibleInternalQuickview);
                qv.open();
            });
        }
        Icon.createIcon(_this.result, _this.options, element, bindings);
        return _this;
    }
    Icon.createIcon = function (result, options, element, bindings) {
        if (options === void 0) { options = {}; }
        if (element === void 0) { element = Dom_1.$$('div').el; }
        var info = FileTypes_1.FileTypes.get(result);
        if (!bindings && result.searchInterface) {
            // try to resolve results bindings automatically
            bindings = result.searchInterface.getBindings();
        }
        info = Icon.preprocessIconInfo(options, info);
        Dom_1.$$(element).toggleClass('coveo-small', options.small === true);
        if (options.value != undefined) {
            if (options.small === true) {
                if (options.value.indexOf('-small') == -1) {
                    info.icon += '-small';
                }
            }
            if (options.small === false) {
                if (options.value.indexOf('-small') != -1) {
                    info.icon = info.icon.replace('-small', '');
                }
            }
        }
        Dom_1.$$(element).addClass(info.icon);
        element.setAttribute('title', info.caption);
        if (Icon.shouldDisplayLabel(options, bindings)) {
            element.appendChild(Dom_1.$$('span', {
                className: 'coveo-icon-caption-overlay'
            }, info.caption).el);
            Dom_1.$$(element).addClass('coveo-icon-with-caption-overlay');
            Dom_1.$$(element).setAttribute('data-with-label', 'true');
        }
        return element;
    };
    Icon.shouldDisplayLabel = function (options, bindings) {
        // If withLabel is explicitely set to false, the label will never display
        // If withLabel is explicitely set to true, the label will always display
        // If withLabel is set to default value (not a hard true or false), the label will display based on ./core/filetypes/**.json
        // with the property shouldDisplayLabel set on each file type/ objecttype
        // In this case, the generated css will take care of outputting the correct css to display : block
        return options.withLabel !== false;
    };
    Icon.preprocessIconInfo = function (options, info) {
        if (options.labelValue != null) {
            info.caption = options.labelValue;
        }
        if (options.value != null) {
            info.icon = 'coveo-icon ' + options.value;
        }
        if (info.caption == null) {
            info.caption = '';
        }
        if (info.icon == null) {
            info.icon = 'coveo-icon coveo-sprites-custom';
        }
        return info;
    };
    Icon.ID = 'Icon';
    Icon.doExport = function () {
        GlobalExports_1.exportGlobally({
            Icon: Icon
        });
    };
    /**
     * The options for the Icon
     * @componentOptions
     */
    Icon.options = {
        /**
         * Specifies the value that the Icon component should output as its CSS class instead of the auto-selected value.
         *
         * Default value is `undefined`, which means that the Coveo JavaScript Search Framework outputs a suitable icon
         * depending on the result file type.
         */
        value: ComponentOptions_1.ComponentOptions.buildStringOption(),
        /**
         * Specifies whether the Icon component should output the smaller version of the icon instead of the regular one.
         *
         * Default value is `undefined`.
         */
        small: ComponentOptions_1.ComponentOptions.buildBooleanOption(),
        /**
         * Specifies whether the Icon component should force the output icon to display its caption/label.
         *
         * **Note:**
         *
         * > Due to limited screen real estate, setting this option to `true` has no effect on icons used inside Coveo for
         * > Salesforce Insight Panels.
         *
         * Default value is `undefined`, which means that the Coveo JavaScript Search Framework determines whether the icon
         * needs to display a caption/label depending on the result file type.
         */
        withLabel: ComponentOptions_1.ComponentOptions.buildBooleanOption(),
        /**
         * Specifies what text to display as the icon caption/label.
         *
         * Default value is `undefined`, which means that the Coveo JavaScript Search Framework determines what text the icon
         * needs to display depending on the result file type.
         */
        labelValue: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption()
    };
    return Icon;
}(Component_1.Component));
exports.Icon = Icon;
Initialization_1.Initialization.registerAutoCreateComponent(Icon);


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

/***/ 227:
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
var ResultLink_1 = __webpack_require__(82);
var QueryUtils_1 = __webpack_require__(20);
var Initialization_1 = __webpack_require__(2);
var Dom_1 = __webpack_require__(1);
var RegisteredNamedMethods_1 = __webpack_require__(22);
var Icon_1 = __webpack_require__(141);
var _ = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
/**
 * The Thumbnail component automatically fetches the thumbnail of the result object and outputs an HTML `img` tag with
 * it.
 * @notSupportedIn salesforcefree
 */
var Thumbnail = /** @class */ (function (_super) {
    __extends(Thumbnail, _super);
    /**
     * Creates a new Thumbnail component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the Thumbnail component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     * @param result The result to associate the component with.
     */
    function Thumbnail(element, options, bindings, result) {
        var _this = _super.call(this, element, Thumbnail.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.result = result;
        _this.options = ComponentOptions_1.ComponentOptions.initOptions(element, Thumbnail.options, options);
        if (_this.element.tagName.toLowerCase() != 'img') {
            _this.img = Dom_1.$$('img').el;
            _this.element.appendChild(_this.img);
        }
        else {
            _this.img = _this.element;
        }
        if (_this.options.clickable) {
            if (_this.element.tagName.toLowerCase() != 'img') {
                new ResultLink_1.ResultLink(_this.element, _this.options, _this.bindings, _this.result);
            }
            else {
                var href = Dom_1.$$('a');
                Dom_1.$$(_this.element).replaceWith(href.el);
                Dom_1.$$(href).append(_this.element);
                new ResultLink_1.ResultLink(href.el, _this.options, _this.bindings, _this.result);
            }
        }
        // We need to set src to a blank image right away to avoid the image from
        // changing size once it's loaded. Also, doing this prevents a border from
        // appearing on some browsers when there is no thumbnail. I've found no other
        // way to get rid of it...
        _this.img.setAttribute('src', 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
        if (QueryUtils_1.QueryUtils.hasThumbnail(result)) {
            _this.buildThumbnailImage();
        }
        else {
            _this.logger.info('Result has no thumbnail. Cannot build thumbnail image, instanciating an Icon component instead.');
            var icn = new Icon_1.Icon(Dom_1.$$('div').el, { small: true }, bindings, result);
            Dom_1.$$(_this.element).replaceWith(icn.element);
        }
        return _this;
    }
    Thumbnail.prototype.buildThumbnailImage = function () {
        var endpoint = this.bindings.queryController.getEndpoint();
        if (endpoint.isJsonp()) {
            // For jsonp we can't GET/POST for binary data. We are limited
            // to only setting the src attribute directly on the img.
            this.buildImageWithDirectSrcAttribute(endpoint);
        }
        else {
            // Base 64 img allows us to GET/POST the image as raw binary, so that we can also
            // pass the credential of the user. Useful for phonegap among others.
            this.buildImageWithBase64SrcAttribute(endpoint);
        }
    };
    Thumbnail.prototype.buildImageWithDirectSrcAttribute = function (endpoint) {
        var dataStreamUri = endpoint.getViewAsDatastreamUri(this.result.uniqueId, '$Thumbnail$', {
            contentType: 'image/png'
        });
        this.img.setAttribute('src', dataStreamUri);
        this.resizeContainingFieldTable();
    };
    Thumbnail.prototype.buildImageWithBase64SrcAttribute = function (endpoint) {
        var _this = this;
        endpoint
            .getRawDataStream(this.result.uniqueId, '$Thumbnail$')
            .then(function (response) {
            var rawBinary = String.fromCharCode.apply(null, new Uint8Array(response));
            _this.img.setAttribute('src', 'data:image/png;base64, ' + btoa(rawBinary));
            _this.resizeContainingFieldTable();
        })
            .catch(function () {
            _this.setEmptyThumbnailClass();
        });
    };
    Thumbnail.prototype.resizeContainingFieldTable = function () {
        var closestFieldTableElement = Dom_1.$$(this.element).closest(Component_1.Component.computeCssClassNameForType('FieldTable'));
        if (closestFieldTableElement != null) {
            var fieldTable = RegisteredNamedMethods_1.get(closestFieldTableElement);
            fieldTable.updateToggleHeight();
        }
    };
    Thumbnail.prototype.setEmptyThumbnailClass = function () {
        Dom_1.$$(this.img).addClass(this.options.noThumbnailClass);
    };
    Thumbnail.ID = 'Thumbnail';
    Thumbnail.doExport = function () {
        GlobalExports_1.exportGlobally({
            Thumbnail: Thumbnail
        });
    };
    /**
     * Options for the Thumbnail
     * @componentOptions
     */
    Thumbnail.options = {
        /**
         * Specifies the CSS class to use on the `img` tag that the Thumbnail component outputs when a result has no
         * thumbnail in the index.
         *
         * Default value is `coveo-no-thumbnail`.
         */
        noThumbnailClass: ComponentOptions_1.ComponentOptions.buildStringOption({ defaultValue: 'coveo-no-thumbnail' }),
        /**
         * Specifies whether to create a clickable {@link ResultLink} around the Thumbnail.
         *
         * Default value is `false`.
         *
         * If set to true, you can use the options specified on {@link ResultLink.options}
         */
        clickable: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false })
    };
    Thumbnail.parent = ResultLink_1.ResultLink;
    return Thumbnail;
}(Component_1.Component));
exports.Thumbnail = Thumbnail;
Thumbnail.options = _.extend({}, ResultLink_1.ResultLink.options, Thumbnail.options);
Initialization_1.Initialization.registerAutoCreateComponent(Thumbnail);


/***/ }),

/***/ 371:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 372:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 82:
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
var ComponentOptionsModel_1 = __webpack_require__(25);
var AnalyticsActionListMeta_1 = __webpack_require__(9);
var ResultListEvents_1 = __webpack_require__(29);
var HighlightUtils_1 = __webpack_require__(51);
var DeviceUtils_1 = __webpack_require__(26);
var OSUtils_1 = __webpack_require__(131);
var Initialization_1 = __webpack_require__(2);
var QueryUtils_1 = __webpack_require__(20);
var Assert_1 = __webpack_require__(5);
var Utils_1 = __webpack_require__(4);
var Defer_1 = __webpack_require__(28);
var Dom_1 = __webpack_require__(1);
var StreamHighlightUtils_1 = __webpack_require__(81);
var _ = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
__webpack_require__(372);
var AccessibleButton_1 = __webpack_require__(17);
/**
 * The `ResultLink` component automatically transform a search result title into a clickable link pointing to the
 * original item.
 *
 * This component is a result template component (see [Result Templates](https://docs.coveo.com/en/413/)).
 */
var ResultLink = /** @class */ (function (_super) {
    __extends(ResultLink, _super);
    /**
     * Creates a new `ResultLink` component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the `ResultLink` component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     * @param result The result to associate the component with.
     * @param os
     */
    function ResultLink(element, options, bindings, result, os) {
        var _this = _super.call(this, element, ResultLink.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.result = result;
        _this.os = os;
        _this.logOpenDocument = _.debounce(function () {
            _this.queryController.saveLastQuery();
            var documentURL = Dom_1.$$(_this.element).getAttribute('href');
            if (documentURL == undefined || documentURL == '') {
                documentURL = _this.result.clickUri;
            }
            _this.usageAnalytics.logClickEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.documentOpen, {
                documentURL: documentURL,
                documentTitle: _this.result.title,
                author: Utils_1.Utils.getFieldValue(_this.result, 'author')
            }, _this.result, _this.root);
            Defer_1.Defer.flush();
        }, 1500, true);
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, ResultLink, options);
        _this.options = _.extend({}, _this.options, _this.componentOptionsModel.get(ComponentOptionsModel_1.ComponentOptionsModel.attributesEnum.resultLink));
        _this.result = result || _this.resolveResult();
        if (_this.options.openQuickview == null) {
            _this.options.openQuickview = result.raw['connectortype'] == 'ExchangeCrawler' && DeviceUtils_1.DeviceUtils.isMobileDevice();
        }
        _this.element.setAttribute('tabindex', '0');
        _this.addHeadingRoleIfFirstResultLink();
        Assert_1.Assert.exists(_this.componentOptionsModel);
        Assert_1.Assert.exists(_this.result);
        if (!_this.quickviewShouldBeOpened()) {
            // Bind on multiple "click" or "mouse" events.
            // Create a function that will be executed only once, so as not to log multiple events
            // Once a result link has been opened, and that we log at least one analytics event,
            // it should not matter if the end user open the same link multiple times with different methods.
            // It's still only one "click" event as far as UA is concerned.
            // Also need to handle "longpress" on mobile (the contextual menu), which we assume to be 1 s long.
            var executeOnlyOnce_1 = _.once(function () { return _this.logOpenDocument(); });
            Dom_1.$$(element).on(['contextmenu', 'click', 'mousedown', 'mouseup'], executeOnlyOnce_1);
            var longPressTimer_1;
            Dom_1.$$(element).on('touchstart', function () {
                longPressTimer_1 = window.setTimeout(executeOnlyOnce_1, 1000);
            });
            Dom_1.$$(element).on('touchend', function () {
                if (longPressTimer_1) {
                    clearTimeout(longPressTimer_1);
                }
            });
        }
        _this.renderUri(element, result);
        _this.bindEventToOpen();
        return _this;
    }
    ResultLink.prototype.renderUri = function (element, result) {
        if (/^\s*$/.test(this.element.innerHTML)) {
            if (!this.options.titleTemplate) {
                this.element.innerHTML = this.result.title
                    ? HighlightUtils_1.HighlightUtils.highlightString(this.result.title, this.result.titleHighlights, null, 'coveo-highlight')
                    : this.result.clickUri;
            }
            else {
                var newTitle = this.parseStringTemplate(this.options.titleTemplate);
                this.element.innerHTML = newTitle
                    ? StreamHighlightUtils_1.StreamHighlightUtils.highlightStreamText(newTitle, this.result.termsToHighlight, this.result.phrasesToHighlight)
                    : this.result.clickUri;
            }
        }
    };
    /**
     * Opens the result in the same window, no matter how the actual component is configured for the end user.
     * @param logAnalytics Specifies whether the method should log an analytics event.
     */
    ResultLink.prototype.openLink = function (logAnalytics) {
        if (logAnalytics === void 0) { logAnalytics = true; }
        if (logAnalytics) {
            this.logOpenDocument();
        }
        window.location.href = this.getResultUri();
    };
    /**
     * Opens the result in a new window, no matter how the actual component is configured for the end user.
     * @param logAnalytics Specifies whether the method should log an analytics event.
     */
    ResultLink.prototype.openLinkInNewWindow = function (logAnalytics) {
        if (logAnalytics === void 0) { logAnalytics = true; }
        if (logAnalytics) {
            this.logOpenDocument();
        }
        window.open(this.getResultUri(), '_blank');
    };
    /**
     * Tries to open the result in Microsoft Outlook if the result has an `outlookformacuri` or `outlookuri` field.
     *
     * Normally, this implies the result should be a link to an email.
     *
     * If the needed fields are not present, this method does nothing.
     * @param logAnalytics Specifies whether the method should log an analytics event.
     */
    ResultLink.prototype.openLinkInOutlook = function (logAnalytics) {
        if (logAnalytics === void 0) { logAnalytics = true; }
        if (this.hasOutlookField()) {
            if (logAnalytics) {
                this.logOpenDocument();
            }
            this.openLink();
        }
    };
    /**
     * Opens the link in the same manner the end user would.
     *
     * This essentially simulates a click on the result link.
     *
     * @param logAnalytics Specifies whether the method should log an analytics event.
     */
    ResultLink.prototype.openLinkAsConfigured = function (logAnalytics) {
        if (logAnalytics === void 0) { logAnalytics = true; }
        if (this.toExecuteOnOpen) {
            if (logAnalytics) {
                this.logOpenDocument();
            }
            this.toExecuteOnOpen();
        }
    };
    ResultLink.prototype.bindEventToOpen = function () {
        return (this.bindOnClickIfNotUndefined() ||
            this.bindOpenQuickviewIfNotUndefined() ||
            this.setHrefIfNotAlready() ||
            this.openLinkThatIsNotAnAnchor());
    };
    ResultLink.prototype.addHeadingRoleIfFirstResultLink = function () {
        if (!this.isFirstResultLink) {
            return;
        }
        this.element.setAttribute('role', 'heading');
        this.element.setAttribute('aria-level', '2');
    };
    Object.defineProperty(ResultLink.prototype, "isFirstResultLink", {
        get: function () {
            var resultRoot = Dom_1.$$(this.element).closest('CoveoResult');
            if (!resultRoot) {
                return false;
            }
            var resultLinkSelector = "." + Component_1.Component.computeCssClassNameForType(ResultLink.ID);
            var firstResultLink = Dom_1.$$(resultRoot).find(resultLinkSelector);
            return firstResultLink === this.element;
        },
        enumerable: true,
        configurable: true
    });
    ResultLink.prototype.bindOnClickIfNotUndefined = function () {
        var _this = this;
        if (this.options.onClick != undefined) {
            this.toExecuteOnOpen = function (e) {
                _this.options.onClick.call(_this, e, _this.result);
            };
            new AccessibleButton_1.AccessibleButton()
                .withElement(this.element)
                .withLabel(this.result.title)
                .withSelectAction(function (e) { return _this.toExecuteOnOpen(e); })
                .build();
            return true;
        }
        else {
            return false;
        }
    };
    ResultLink.prototype.bindOpenQuickviewIfNotUndefined = function () {
        var _this = this;
        if (this.quickviewShouldBeOpened()) {
            this.toExecuteOnOpen = function () {
                Dom_1.$$(_this.bindings.resultElement).trigger(ResultListEvents_1.ResultListEvents.openQuickview);
            };
            Dom_1.$$(this.element).on('click', function (e) {
                e.preventDefault();
                _this.toExecuteOnOpen();
            });
            return true;
        }
        else {
            return false;
        }
    };
    ResultLink.prototype.openLinkThatIsNotAnAnchor = function () {
        var _this = this;
        if (!this.elementIsAnAnchor()) {
            this.toExecuteOnOpen = function () {
                if (_this.options.alwaysOpenInNewWindow) {
                    if (_this.options.openInOutlook) {
                        _this.openLinkInOutlook();
                    }
                    else {
                        _this.openLinkInNewWindow();
                    }
                }
                else {
                    _this.openLink();
                }
            };
            Dom_1.$$(this.element).on('click', function () {
                _this.toExecuteOnOpen();
            });
            return true;
        }
        return false;
    };
    ResultLink.prototype.setHrefIfNotAlready = function () {
        // Do not erase any value put in href by the template, etc. Allows
        // using custom click urls while still keeping analytics recording
        // and other behavior brought by the component.
        if (this.elementIsAnAnchor() && !Utils_1.Utils.isNonEmptyString(Dom_1.$$(this.element).getAttribute('href'))) {
            Dom_1.$$(this.element).setAttribute('href', this.getResultUri());
            if (this.options.alwaysOpenInNewWindow && !(this.options.openInOutlook && this.hasOutlookField())) {
                Dom_1.$$(this.element).setAttribute('target', '_blank');
            }
            return true;
        }
        else {
            return false;
        }
    };
    ResultLink.prototype.getResultUri = function () {
        if (this.options.hrefTemplate) {
            return this.parseStringTemplate(this.options.hrefTemplate);
        }
        if (this.options.field == undefined && this.options.openInOutlook) {
            this.setField();
        }
        if (this.options.field != undefined) {
            return Utils_1.Utils.getFieldValue(this.result, this.options.field);
        }
        else {
            return this.result.clickUri;
        }
    };
    ResultLink.prototype.elementIsAnAnchor = function () {
        return this.element.tagName == 'A';
    };
    ResultLink.prototype.setField = function () {
        var os = Utils_1.Utils.exists(this.os) ? this.os : OSUtils_1.OSUtils.get();
        if (os == OSUtils_1.OS_NAME.MACOSX && this.hasOutlookField()) {
            this.options.field = '@outlookformacuri';
        }
        else if (os == OSUtils_1.OS_NAME.WINDOWS && this.hasOutlookField()) {
            this.options.field = '@outlookuri';
        }
    };
    ResultLink.prototype.hasOutlookField = function () {
        var os = Utils_1.Utils.exists(this.os) ? this.os : OSUtils_1.OSUtils.get();
        if (os == OSUtils_1.OS_NAME.MACOSX && this.result.raw['outlookformacuri'] != undefined) {
            return true;
        }
        else if (os == OSUtils_1.OS_NAME.WINDOWS && this.result.raw['outlookuri'] != undefined) {
            return true;
        }
        return false;
    };
    ResultLink.prototype.isUriThatMustBeOpenedInQuickview = function () {
        return this.result.clickUri.toLowerCase().indexOf('ldap://') == 0;
    };
    ResultLink.prototype.quickviewShouldBeOpened = function () {
        return (this.options.openQuickview || this.isUriThatMustBeOpenedInQuickview()) && QueryUtils_1.QueryUtils.hasHTMLVersion(this.result);
    };
    ResultLink.prototype.parseStringTemplate = function (template) {
        var _this = this;
        if (!template) {
            return '';
        }
        return template.replace(/\$\{(.*?)\}/g, function (value) {
            var key = value.substring(2, value.length - 1);
            var newValue = _this.readFromObject(_this.result, key);
            if (!newValue) {
                newValue = _this.readFromObject(window, key);
            }
            if (!newValue) {
                _this.logger.warn(key + " used in the ResultLink template is undefined for this result: " + _this.result.title);
            }
            return newValue || value;
        });
    };
    ResultLink.prototype.readFromObject = function (object, key) {
        if (object && key.indexOf('.') !== -1) {
            var newKey = key.substring(key.indexOf('.') + 1);
            key = key.substring(0, key.indexOf('.'));
            return this.readFromObject(object[key], newKey);
        }
        return object ? object[key] : undefined;
    };
    ResultLink.ID = 'ResultLink';
    ResultLink.doExport = function () {
        GlobalExports_1.exportGlobally({
            ResultLink: ResultLink
        });
    };
    /**
     * The options for the ResultLink
     * @componentOptions
     */
    ResultLink.options = {
        /**
         * Specifies the field to use to output the component `href` attribute value.
         *
         * **Tip:**
         * > Instead of specifying a value for the `field` option, you can directly add an `href` attribute to the
         * > `ResultLink` HTML element. Then, you can use a custom script to generate the `href` value.
         *
         * **Examples:**
         * - With the following markup, the `ResultLink` outputs its `href` value using the `@uri` field (rather than the
         * default field):
         *
         * ```html
         * <a class="CoveoResultLink" data-field="@uri"></a>
         * ```
         *
         * - In the following result template, the custom `getMyKBUri()` function provides the `href` value:
         *
         * ```html
         * <script id="KnowledgeArticle" type="text/underscore" class="result-template">
         *   <div class='CoveoIcon>'></div>
         *   <a class="CoveoResultLink" href="<%= getMyKBUri(raw) %>"></a>
         *   <div class="CoveoExcerpt"></div>
         * </script>
         * ```
         *
         * See also [`hrefTemplate`]{@link ResultLink.options.hrefTemplate}, which can override this option.
         *
         * By default, the component uses the `@clickUri` field of the item to output the value of its `href` attribute.
         */
        field: ComponentOptions_1.ComponentOptions.buildFieldOption(),
        /**
         * Specifies whether the component should try to open its link in Microsoft Outlook.
         *
         * Setting this option to `true` is normally useful for `ResultLink` instances related to Microsoft Exchange emails.
         *
         * If this option is `true`, clicking the `ResultLink` calls the
         * [`openLinkInOutlook`]{@link ResultLink.openLinkInOutlook} method instead of the
         * [`openLink`]{@link ResultLink.openLink} method.
         *
         * Default value is `false`.
         */
        openInOutlook: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        /**
         * Specifies whether the component should open its link in the [`Quickview`]{@link Quickview} component rather than
         * loading through the original URL.
         *
         * Default value is `false`.
         */
        openQuickview: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        /**
         * Specifies whether the component should open its link in a new window instead of opening it in the current
         * context.
         *
         * If this option is `true`, clicking the `ResultLink` calls the
         * [`openLinkInNewWindow`]{@link ResultLink.openLinkInNewWindow} method instead of the
         * [`openLink`]{@link ResultLink.openLink} method.
         *
         * **Note:**
         * > If a search page contains a [`ResultPreferences`]{@link ResultsPreferences} component whose
         * > [`enableOpenInNewWindow`]{@link ResultsPreferences.options.enableOpenInNewWindow} option is `true`, and the end
         * > user checks the <b>Always open results in new window</b> box, `ResultLink` components in this page will always
         * > open their links in a new window when the end user clicks them, no matter what the value of their
         * > `alwaysOpenInNewWindow` option is.
         *
         * Default value is `false`.
         */
        alwaysOpenInNewWindow: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        /**
         * Specifies a template literal from which to generate the `ResultLink` `href` attribute value (see
         * [Template literals](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals)).
         *
         * This option overrides the [`field`]{@link ResultLink.options.field} option value.
         *
         * The template literal can reference any number of fields from the parent result. It can also reference global
         * scope properties.
         *
         * **Examples:**
         *
         * - The following markup generates an `href` value such as `http://uri.com?id=itemTitle`:
         *
         * ```html
         * <a class='CoveoResultLink' data-href-template='${clickUri}?id=${raw.title}'></a>
         * ```
         *
         * - The following markup generates an `href` value such as `localhost/fooBar`:
         *
         * ```html
         * <a class='CoveoResultLink' data-href-template='${window.location.hostname}/{Foo.Bar}'></a>
         * ```
         *
         * Default value is `undefined`.
         */
        hrefTemplate: ComponentOptions_1.ComponentOptions.buildStringOption(),
        /**
         * Specifies a template literal from which to generate the `ResultLink` display title (see
         * [Template literals](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals)).
         *
         * This option overrides the default `ResultLink` display title behavior.
         *
         * The template literal can reference any number of fields from the parent result. However, if the template literal
         * references a key whose value is undefined in the parent result fields, the `ResultLink` title displays the
         * name of this key instead.
         *
         * This option is ignored if the `ResultLink` innerHTML contains any value.
         *
         * **Examples:**
         *
         * - The following markup generates a `ResultLink` display title such as `Case number: 123456` if both the
         * `raw.objecttype` and `raw.objectnumber` keys are defined in the parent result fields:
         *
         * ```html
         * <a class="CoveoResultLink" data-title-template="${raw.objecttype} number: ${raw.objectnumber}"></a>
         * ```
         *
         * - The following markup generates `${myField}` as a `ResultLink` display title if the `myField` key is undefined
         * in the parent result fields:
         *
         * ```html
         * <a class="CoveoResultLink" data-title-template="${myField}"></a>
         * ```
         *
         * - The following markup generates `Foobar` as a `ResultLink` display title, because the `ResultLink` innterHTML is
         * not empty:
         *
         * ```html
         * <a class="CoveoResultLink" data-title-template="${will} ${be} ${ignored}">Foobar</a>
         * ```
         *
         * Default value is `undefined`.
         */
        titleTemplate: ComponentOptions_1.ComponentOptions.buildStringOption(),
        /**
         * Specifies an event handler function to execute when the user clicks the `ResultLink` component.
         *
         * The handler function takes a JavaScript [`Event`](https://developer.mozilla.org/en/docs/Web/API/Event) object and
         * an [`IQueryResult`]{@link IQueryResult} as its parameters.
         *
         * Overriding the default behavior of the `onClick` event can allow you to execute specific code instead.
         *
         * **Note:**
         * > You cannot set this option directly in the component markup as an HTML attribute. You must either set it in the
         * > [`init`]{@link init} call of your search interface (see
         * > [Components - Passing Component Options in the init Call](https://developers.coveo.com/x/PoGfAQ#Components-PassingComponentOptionsintheinitCall)),
         * > or before the `init` call, using the `options` top-level function (see
         * > [Components - Passing Component Options Before the init Call](https://developers.coveo.com/x/PoGfAQ#Components-PassingComponentOptionsBeforetheinitCall)).
         *
         * **Example:**
         * ```javascript
         * // You can set the option in the 'init' call:
         * Coveo.init(document.querySelector("#search"), {
         *   ResultLink : {
         *     onClick : function(e, result) {
         *       e.preventDefault();
         *       // Custom code to execute with the item URI and title.
         *       openUriInASpecialTab(result.clickUri, result.title);
         *     }
         *   }
         * });
         *
         * // Or before the 'init' call, using the 'options' top-level function:
         * // Coveo.options(document.querySelector('#search'), {
         * //   ResultLink : {
         * //     onClick : function(e, result) {
         * //       e.preventDefault();
         * //       // Custom code to execute with the item URI and title.
         * //       openUriInASpecialTab(result.clickUri, result.title);
         * //     }
         * //   }
         * // });
         * ```
         */
        onClick: ComponentOptions_1.ComponentOptions.buildCustomOption(function () {
            return null;
        })
    };
    return ResultLink;
}(Component_1.Component));
exports.ResultLink = ResultLink;
Initialization_1.Initialization.registerAutoCreateComponent(ResultLink);


/***/ })

});
//# sourceMappingURL=Thumbnail__037ab7a8d36ab90fa53e.js.map