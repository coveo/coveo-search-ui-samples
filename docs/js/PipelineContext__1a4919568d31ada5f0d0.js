webpackJsonpCoveo__temporary([73],{

/***/ 191:
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
var Utils_1 = __webpack_require__(4);
var QueryEvents_1 = __webpack_require__(10);
var Dom_1 = __webpack_require__(2);
var Initialization_1 = __webpack_require__(1);
var _ = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
/**
 * A PipelineContext is used to add contextual information about the environment inside which the query is executed.
 *
 * It allows to pass arbitrary key values pairs ( think `JSON` ), which can then be leveraged by the [Query Pipeline](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=108),
 * or by Coveo Machine Learning.
 *
 * This can be any arbitrary information that you can use to contextualize the query and help Coveo improve relevance by returning results tailored to a specific context.
 *
 * This component is meant to be configured using a script tag, with a JSON content.
 *
 * The values can be either a `string` or an array of `string`.
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
 * You can also simply use JavaScript code to pass context values, using the {@link QueryBuilder.addContextValue} method.
 *
 * This means you do not necessarily need to use this component to pass context.
 * ```
 * Coveo.$$(root).on('buildingQuery', function(args) {
 *     args.queryBuilder.addContextValue('foo', 'bar');
 * })
 * ```
 *
 * Using this component as opposed to JavaScript code means you will be able to leverage the interface editor.
 *
 * Regardless of if you use this component or JavaScript to add context, both will add the needed data in the [Query.Context]{@link IQuery.context} parameter.
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
     * Set a new context, replacing any value previously set.
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
//# sourceMappingURL=PipelineContext__1a4919568d31ada5f0d0.js.map