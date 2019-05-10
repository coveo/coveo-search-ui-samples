webpackJsonpCoveo__temporary([72],{

/***/ 205:
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
var Dom_1 = __webpack_require__(1);
var Initialization_1 = __webpack_require__(2);
var _ = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
/**
 * A PipelineContext is used to add custom context information to a query (see [Adding Custom Context Information to Queries](https://docs.coveo.com/en/399)).
 *
 * This component is meant to be initialized with a script tag, possibly configuring it with JSON content.
 *
 * The values can be either string or string array.
 *
 * ```
 * <script class='CoveoPipelineContext' type='text/context'>
 *   {
 *      "foo" : "bar",
 *      "foobar" : ["foo", "bar"]
 *   }
 * </script>
 * ```
 *
 * Configuring the component within a script tag implies you will be able to leverage the interface editor.
 *
 * Once the component is created, you can also use JavaScript code to set/overwrite context values, using the {@link setContext} and {@link setContextValue} methods.
 *
 * Whether you configure the component within a script tag or using JavaScript code, the data is added to the [Query.Context]{@link IQuery.context} parameter.
 *
 * **Note:**
 *
 * This component also ensures that the framework properly determines the context in all corner cases, including when a standalone search box ([initSearchbox]{@link initSearchbox}) is displaying query suggestions.
 *
 * In most cases, if you do not use this component, the context will not be resolved and leveraged properly in the query pipeline (see [What Is a Query Pipeline?](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=252)).
 *
 */
var PipelineContext = /** @class */ (function (_super) {
    __extends(PipelineContext, _super);
    function PipelineContext(element, options, bindings) {
        var _this = _super.call(this, element, PipelineContext.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.contextContent = {};
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, PipelineContext, options);
        _this.setContext(Dom_1.$$(_this.element)
            .text()
            .trim());
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.buildingQuery, function (args) { return _this.handleBuildingQuery(args); });
        return _this;
    }
    /**
     * **Available since the [December 2017 Release](https://docs.coveo.com/en/373).**
     *
     * Sets a new context, replacing the previous context if applicable.
     *
     * @param newContext The new context to set, which can be directly passed as a JSON, or as a stringified JSON.
     */
    PipelineContext.prototype.setContext = function (newContext) {
        if (_.isString(newContext)) {
            var contextParsed = this.tryParseContextFromString(newContext);
            this.contextContent = contextParsed;
        }
        else {
            this.contextContent = newContext;
        }
    };
    /**
     * Returns the current context
     */
    PipelineContext.prototype.getContext = function () {
        var _this = this;
        var keys = this.getContextKeys();
        return _.object(keys, _.map(keys, function (key) { return _this.getContextValue(key); }));
    };
    /**
     * **Available since the [December 2017 Release](https://docs.coveo.com/en/373).**
     *
     * Sets a value for a context key, replacing the previous value if applicable.
     * @param contextKey
     * @param contextValue
     */
    PipelineContext.prototype.setContextValue = function (contextKey, contextValue) {
        this.contextContent[contextKey] = contextValue;
    };
    /**
     * Return all the context keys configured for context.
     * @returns {string[]}
     */
    PipelineContext.prototype.getContextKeys = function () {
        return _.keys(this.contextContent);
    };
    /**
     * Get the context value associated to the given key.
     *
     * If the global variable Coveo.context contains the requested key, this method will return the value contained in Coveo.context instead of the one contained internally.
     *
     * This is especially useful in a Coveo for Salesforce context, where context values can be extracted from a backend service.
     * @param key
     * @returns {string}
     */
    PipelineContext.prototype.getContextValue = function (key) {
        var _this = this;
        var contextValue = this.contextContent[key];
        if (_.isArray(contextValue)) {
            var contextValues_1 = [];
            _.each(this.contextContent[key], function (value) {
                contextValues_1.push(_this.getModifiedData(value));
            });
            return contextValues_1;
        }
        else if (_.isString(contextValue)) {
            return this.getModifiedData(contextValue);
        }
        return '';
    };
    PipelineContext.prototype.handleBuildingQuery = function (args) {
        var _this = this;
        var keys = this.getContextKeys();
        _.each(keys, function (key) {
            args.queryBuilder.addContextValue(key, _this.getContextValue(key));
        });
    };
    PipelineContext.prototype.tryParseContextFromString = function (contextAsString) {
        if (_.isEmpty(contextAsString)) {
            return {};
        }
        try {
            // Context could be HTML encoded (eg: Coveo for Salesforce)
            return JSON.parse(Utils_1.Utils.decodeHTMLEntities(contextAsString));
        }
        catch (e) {
            try {
                return JSON.parse(contextAsString);
            }
            catch (e) {
                this.logger.error("Error while trying to parse context from the PipelineContext component", e);
                return null;
            }
        }
    };
    PipelineContext.prototype.getModifiedData = function (value) {
        /* We need to modify the data to escape special salesforce characters. eg: {! }
         If we find the matching value in the global Coveo.context variable, we return that one instead of the one present locally.
         So, concretely, the component could contain :
         {
           "productName" : "{! productValueFromSalesforce }"
         }
    
         This means that in those case, we would try to access Coveo.context.productValueFromSalesforce (which would in theory be a "real" product value from salesforce, and not a placeholder/variable)
        */
        return value.replace(/\{\!([^\}]+)\}/g, function (all, contextKey) {
            var trimmedKey = contextKey.trim();
            if (Coveo.context && trimmedKey in Coveo.context) {
                return Coveo.context[trimmedKey];
            }
            else if (trimmedKey == PipelineContext.CURRENT_URL) {
                return window.location.href;
            }
            return '';
        });
    };
    PipelineContext.ID = 'PipelineContext';
    PipelineContext.CURRENT_URL = 'CurrentUrl';
    PipelineContext.doExport = function () {
        GlobalExports_1.exportGlobally({
            PipelineContext: PipelineContext
        });
    };
    return PipelineContext;
}(Component_1.Component));
exports.PipelineContext = PipelineContext;
Initialization_1.Initialization.registerAutoCreateComponent(PipelineContext);


/***/ })

});
//# sourceMappingURL=PipelineContext__5d8084491af1464dbdb6.js.map