webpackJsonpCoveo__temporary([14],{14:function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=o(0),i=function(){function e(){}return e.addClassToSVGInContainer=function(t,o){var n=t.querySelector("svg");n.setAttribute("class",""+e.getClass(n)+o)},e.removeClassFromSVGInContainer=function(t,o){var n=t.querySelector("svg");n.setAttribute("class",e.getClass(n).replace(o,""))},e.addStyleToSVGInContainer=function(e,t){var o=e.querySelector("svg");n.each(t,function(e,t){o.style[t]=e})},e.getClass=function(e){var t=e.getAttribute("class");return t?t+" ":""},e}();t.SVGDom=i},140:function(e,t,o){"use strict";var n=this&&this.__extends||function(){var e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var o in t)t.hasOwnProperty(o)&&(e[o]=t[o])};return function(t,o){function n(){this.constructor=t}e(t,o),t.prototype=null===o?Object.create(o):(n.prototype=o.prototype,new n)}}();Object.defineProperty(t,"__esModule",{value:!0});var i=o(447),s=o(6),a=o(7),r=o(16),l=o(10),p=o(15),d=o(12),c=o(9),h=o(42),u=o(1),v=o(4),m=o(5),f=o(2),b=o(20),C=o(0),w=o(3);o(449);var y=function(e){function t(o,n,s){var c=e.call(this,o,t.ID,s)||this;c.element=o,c.options=n,c.options=a.ComponentOptions.initComponentOptions(o,t,n),c.bind.onRootElement(l.QueryEvents.buildingQuery,function(e){return c.handleBuildingQuery(e)}),c.bind.onRootElement(p.InitializationEvents.afterInitialization,function(){return c.handleAfterInitialization()}),c.bind.onQueryState(r.MODEL_EVENTS.CHANGE_ONE,d.QUERY_STATE_ATTRIBUTES.T,function(e){return c.handleQueryStateChanged(e)});var h=function(){return c.handleClick()};return c.bind.on(o,"click",h),c.bind.on(o,"keyup",b.KeyboardUtils.keypressAction(b.KEYBOARD.ENTER,h)),c.render(),i.ResponsiveTabs.init(c.root,c,c.options),c}return n(t,e),t.prototype.select=function(){if(!this.disabled){var e={t:this.options.id,sort:this.options.sort||d.QueryStateModel.defaultAttributes.sort};this.options.layout&&(e.layout=this.options.layout),this.queryStateModel.setMultiple(e),this.usageAnalytics.logSearchEvent(c.analyticsActionCauseList.interfaceChange,{interfaceChangeTo:this.options.id}),this.queryController.executeQuery()}},t.prototype.isElementIncludedInTab=function(e){m.Assert.exists(e);var t=this.splitListOfTabs(e.getAttribute("data-tab")),o=this.splitListOfTabs(e.getAttribute("data-tab-not"));return m.Assert.check(!(0!=t.length&&0!=o.length),"You cannot both explicitly include and exclude an element from tabs."),0!=t.length&&-1!=C.indexOf(t,this.options.id)||0!=o.length&&-1==C.indexOf(o,this.options.id)||0==t.length&&0==o.length},t.prototype.handleClick=function(){this.select()},t.prototype.render=function(){var e=this.options.icon;if(v.Utils.isNonEmptyString(e)){var t=f.$$("span").el;f.$$(t).addClass(["coveo-icon",e]),this.element.insertBefore(t,this.element.firstChild)}var o=this.options.caption;if(v.Utils.isNonEmptyString(o)){var n=document.createElement("p");f.$$(n).text(o),this.element.appendChild(n)}this.element.setAttribute("tabindex","0")},t.prototype.handleBuildingQuery=function(e){m.Assert.exists(e),!this.disabled&&this.isSelected()&&(e.queryBuilder.tab=this.options.id,v.Utils.isNonEmptyString(this.options.expression)&&(this.options.constant?e.queryBuilder.constantExpression.add(this.options.expression):e.queryBuilder.advancedExpression.add(this.options.expression)),this.options.enableDuplicateFiltering&&(e.queryBuilder.enableDuplicateFiltering=!0),null!=this.options.pipeline&&(e.queryBuilder.pipeline=this.options.pipeline),null!=this.options.maximumAge&&(e.queryBuilder.maximumAge=this.options.maximumAge))},t.prototype.handleQueryStateChanged=function(e){m.Assert.exists(e),!this.disabled&&this.isSelected()?(f.$$(this.element).addClass("coveo-selected"),this.queryController.setEndpoint(this.options.endpoint),this.showAndHideAppropriateElements()):f.$$(this.element).removeClass("coveo-selected")},t.prototype.handleAfterInitialization=function(){this.isSelected()&&this.options.layout&&this.queryStateModel.set(d.QUERY_STATE_ATTRIBUTES.LAYOUT,this.options.layout)},t.prototype.isSelected=function(){return this.queryStateModel.get(d.QueryStateModel.attributesEnum.t)==this.options.id},t.prototype.showAndHideAppropriateElements=function(){var e=this,t=[],o=[];C.each(f.$$(this.root).findAll("[data-tab],[data-tab-not]"),function(n){e.isElementIncludedInTab(n)?(e.toggleAllComponentsUnder(n,!0),t.push(n)):(e.toggleAllComponentsUnder(n,!1),o.push(n))}),f.$$(this.root).one(l.QueryEvents.querySuccess,function(){C.each(t,function(e){return f.$$(e).removeClass("coveo-tab-disabled")}),C.each(o,function(e){return f.$$(e).addClass("coveo-tab-disabled")})})},t.prototype.splitListOfTabs=function(e){return v.Utils.exists(e)?C.map(e.split(","),function(e){return v.Utils.trim(e)}):[]},t.prototype.toggleAllComponentsUnder=function(e,t){m.Assert.exists(e);var o=function(e){var o=s.Component.get(e,void 0,!0);o&&(t?o.enable():o.disable())};o(e),C.each(f.$$(e).findAll("*"),function(e){o(e)})},t.prototype.enable=function(){e.prototype.enable.call(this),this.element.style.display=""},t.prototype.disable=function(){e.prototype.disable.call(this),this.element.style.display="none"},t.ID="Tab",t.doExport=function(){w.exportGlobally({Tab:t})},t.options={id:a.ComponentOptions.buildStringOption({required:!0,section:"Common Options"}),caption:a.ComponentOptions.buildLocalizedStringOption({required:!0,section:"Common Options"}),icon:a.ComponentOptions.buildStringOption(),expression:a.ComponentOptions.buildStringOption({section:"Filtering"}),endpoint:a.ComponentOptions.buildCustomOption(function(e){return null!=e?h.SearchEndpoint.endpoints[e]:null}),sort:a.ComponentOptions.buildStringOption(),layout:a.ComponentOptions.buildStringOption(),constant:a.ComponentOptions.buildBooleanOption({defaultValue:!0,section:"Filtering"}),enableDuplicateFiltering:a.ComponentOptions.buildBooleanOption({defaultValue:!1}),pipeline:a.ComponentOptions.buildStringOption(),maximumAge:a.ComponentOptions.buildNumberOption(),enableResponsiveMode:a.ComponentOptions.buildBooleanOption({defaultValue:!0,section:"ResponsiveOptions"}),dropdownHeaderLabel:a.ComponentOptions.buildLocalizedStringOption({section:"ResponsiveOptions"})},t}(s.Component);t.Tab=y,u.Initialization.registerAutoCreateComponent(y)},148:function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=o(2),i=o(49),s=o(77),a=function(){function e(e,t,o,n,i){this.element=t,this.cssClassName="coveo-"+e+"-dropdown-content",this.coveoRoot=o,this.widthRatio=i,this.minWidth=n}return e.isTargetInsideOpenedDropdown=function(t){var o=t.parent(e.DEFAULT_CSS_CLASS_NAME);return!!o&&"none"!=o.style.display},e.prototype.positionDropdown=function(){this.element.addClass(this.cssClassName),this.element.addClass(e.DEFAULT_CSS_CLASS_NAME),this.element.el.style.display="";var t=this.widthRatio*this.coveoRoot.width();t<=this.minWidth&&(t=this.minWidth),this.element.el.style.width=t.toString()+"px",i.PopupUtils.positionPopup(this.element.el,n.$$(this.coveoRoot.find("."+s.ResponsiveComponentsManager.DROPDOWN_HEADER_WRAPPER_CSS_CLASS)).el,this.coveoRoot.el,{horizontal:i.PopupHorizontalAlignment.INNERRIGHT,vertical:i.PopupVerticalAlignment.BOTTOM,verticalOffset:15},this.coveoRoot.el)},e.prototype.hideDropdown=function(){this.element.el.style.display="none",this.element.removeClass(this.cssClassName),this.element.removeClass(e.DEFAULT_CSS_CLASS_NAME)},e.prototype.cleanUp=function(){this.element.el.removeAttribute("style")},e.DEFAULT_CSS_CLASS_NAME="coveo-dropdown-content",e}();t.ResponsiveDropdownContent=a},149:function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=o(0),i=function(){function e(){}return e.addPrefixedEvent=function(e,t,o){n.each(this.prefixes,function(n){""==n&&(t=t.toLowerCase()),e.addEventListener(n+t,o,!1)})},e.removePrefixedEvent=function(e,t,o){n.each(this.prefixes,function(n){""==n&&(t=t.toLowerCase()),e.removeEventListener(n+t,o,!1)})},e.prefixes=["webkit","moz","MS","o",""],e}();t.EventsUtils=i},447:function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=o(2),i=o(15),s=o(49),a=o(149),r=o(4),l=o(11),p=o(6),d=o(17),c=o(140),h=o(77),u=o(89),v=o(8),m=o(41),f=o(0);o(448);var b=o(13),C=o(14),w=function(){function e(e,t){this.coveoRoot=e,this.ID=t,this.dropdownHeaderLabel=this.getDropdownHeaderLabel(),this.searchInterface=p.Component.get(this.coveoRoot.el,d.SearchInterface,!1),this.dropdownContent=this.buildDropdownContent(),this.dropdownHeader=this.buildDropdownHeader(),this.bindDropdownContentEvents(),this.bindDropdownHeaderEvents(),this.tabSection=n.$$(this.coveoRoot.find(".coveo-tab-section")),this.manageTabSwapping(),this.bindNukeEvents()}return e.init=function(t,o,i){if(this.logger=new l.Logger("ResponsiveTabs"),!n.$$(t).find(".coveo-tab-section"))return void this.logger.info("No element with class coveo-tab-section. Responsive tabs cannot be enabled.");h.ResponsiveComponentsManager.register(e,n.$$(t),c.Tab.ID,o,i)},e.prototype.handleResizeEvent=function(){this.needSmallMode()&&!u.ResponsiveComponentsUtils.isSmallTabsActivated(this.coveoRoot)?this.changeToSmallMode():!this.needSmallMode()&&u.ResponsiveComponentsUtils.isSmallTabsActivated(this.coveoRoot)&&this.changeToLargeMode();var e=this.getTabsInTabSection();this.shouldAddTabsToDropdown()?this.addTabsToDropdown(e):this.shouldRemoveTabsFromDropdown()&&this.removeTabsFromDropdown(e),this.dropdownHeader.hasClass("coveo-dropdown-header-active")&&this.positionPopup()},e.prototype.needSmallMode=function(){var e=this.searchInterface?this.searchInterface.responsiveComponents.getMediumScreenWidth():(new m.ResponsiveComponents).getMediumScreenWidth();return this.coveoRoot.width()<=e||(u.ResponsiveComponentsUtils.isSmallTabsActivated(this.coveoRoot)?this.isLargeFormatOverflowing():this.isOverflowing(this.tabSection.el))},e.prototype.changeToSmallMode=function(){u.ResponsiveComponentsUtils.activateSmallTabs(this.coveoRoot)},e.prototype.changeToLargeMode=function(){this.emptyDropdown(),this.cleanUpDropdown(),u.ResponsiveComponentsUtils.deactivateSmallTabs(this.coveoRoot)},e.prototype.shouldAddTabsToDropdown=function(){return this.isOverflowing(this.tabSection.el)&&u.ResponsiveComponentsUtils.isSmallTabsActivated(this.coveoRoot)},e.prototype.addTabsToDropdown=function(e){var t;if(!this.tabSection.find(".coveo-tab-dropdown-header")){var o=this.tabSection.find(".coveo-facet-dropdown-header");o?this.dropdownHeader.insertBefore(o):this.tabSection.el.appendChild(this.dropdownHeader.el)}for(var i=e.length-1;i>=0&&(t=e[i],n.$$(t).hasClass("coveo-selected")&&i>0&&(t=e[--i]),this.addToDropdown(t),this.isOverflowing(this.tabSection.el));i--);},e.prototype.shouldRemoveTabsFromDropdown=function(){return!this.isOverflowing(this.tabSection.el)&&u.ResponsiveComponentsUtils.isSmallTabsActivated(this.coveoRoot)&&!this.isDropdownEmpty()},e.prototype.removeTabsFromDropdown=function(e){var t,o,i=this.dropdownContent.findAll(".coveo-tab-dropdown");for(e&&(t=e.pop());!this.isOverflowing(this.tabSection.el)&&!this.isDropdownEmpty();)o=i.shift(),this.removeFromDropdown(o),this.fromDropdownToTabSection(n.$$(o),t),t=f.clone(o);if(this.isOverflowing(this.tabSection.el)){var s=this.getTabsInTabSection();this.addToDropdown(s.pop())}this.isDropdownEmpty()&&this.cleanUpDropdown()},e.prototype.emptyDropdown=function(){if(!this.isDropdownEmpty()){var e=this.dropdownContent.findAll(".coveo-tab-dropdown"),t=this.getTabsInTabSection(),o=void 0;for(t&&(o=t.pop());!this.isDropdownEmpty();){var i=e.shift();this.removeFromDropdown(i),n.$$(i).insertBefore(this.dropdownHeader.el),this.fromDropdownToTabSection(n.$$(i),o),o=f.clone(i)}}},e.prototype.isLargeFormatOverflowing=function(){var e=n.$$(this.tabSection.el.cloneNode(!0)),t=e.find(".coveo-tab-dropdown-header");t&&e.el.removeChild(t),e.el.style.position="absolute",e.el.style.visibility="hidden",this.isDropdownEmpty()||f.each(this.dropdownContent.findAll(".CoveoTab"),function(t){e.el.appendChild(t.cloneNode(!0))}),e.insertBefore(this.tabSection.el),u.ResponsiveComponentsUtils.deactivateSmallTabs(this.coveoRoot);var o=this.isOverflowing(this.tabSection.el)||this.isOverflowing(e.el);return u.ResponsiveComponentsUtils.activateSmallTabs(this.coveoRoot),e.detach(),o},e.prototype.isOverflowing=function(e){return e.clientWidth<e.scrollWidth},e.prototype.buildDropdownHeader=function(){var e=n.$$("a",{className:"coveo-dropdown-header coveo-tab-dropdown-header"}),t=n.$$("p");t.text(this.dropdownHeaderLabel);var o=n.$$("span",{className:"coveo-more-tabs"},b.SVGIcons.icons.arrowDown);return C.SVGDom.addClassToSVGInContainer(o.el,"coveo-more-tabs-svg"),t.el.appendChild(o.el),e.el.appendChild(t.el),e},e.prototype.bindDropdownHeaderEvents=function(){var e=this;this.dropdownHeader.on("click",function(){e.dropdownHeader.hasClass("coveo-dropdown-header-active")?e.closeDropdown():(e.positionPopup(),e.dropdownHeader.addClass("coveo-dropdown-header-active"))})},e.prototype.buildDropdownContent=function(){var e=n.$$("div",{className:"coveo-tab-list-container "+d.SearchInterface.SMALL_INTERFACE_CLASS_NAME}),t=n.$$("ol",{className:"coveo-tab-list"});return e.el.appendChild(t.el),e},e.prototype.bindDropdownContentEvents=function(){var e=this;this.documentClickListener=function(t){if(r.Utils.isHtmlElement(t.target)){var o=n.$$(t.target);o.closest("coveo-tab-list-container")||o.closest("coveo-tab-dropdown-header")||o.closest("coveo-tab-dropdown")||e.closeDropdown()}},n.$$(document.documentElement).on("click",this.documentClickListener)},e.prototype.closeDropdown=function(){this.dropdownContent.detach(),this.dropdownHeader.removeClass("coveo-dropdown-header-active")},e.prototype.addToDropdown=function(e){if(this.dropdownContent){n.$$(e).addClass("coveo-tab-dropdown");var t=this.dropdownContent.find("ol"),o=n.$$("li");o.el.appendChild(e),n.$$(t).prepend(o.el)}},e.prototype.removeFromDropdown=function(e){this.dropdownContent&&(n.$$(e).removeClass("coveo-tab-dropdown"),n.$$(e.parentElement).detach())},e.prototype.cleanUpDropdown=function(){this.dropdownHeader.removeClass("coveo-dropdown-header-active"),this.dropdownHeader.detach(),this.dropdownContent.detach()},e.prototype.isDropdownEmpty=function(){if(this.dropdownContent){return 0==this.dropdownContent.findAll(".CoveoTab").length}return!1},e.prototype.manageTabSwapping=function(){var e=this;f.each(this.coveoRoot.findAll("."+p.Component.computeCssClassNameForType(this.ID)),function(t){var o=n.$$(t),i=function(t){var s=e.getTabsInTabSection(),r=s.pop(),l=r.previousSibling;"opacity"==t.propertyName&&("0"==o.el.style.opacity?(n.$$(r).addClass("coveo-tab-dropdown"),o.replaceWith(r),o.removeClass("coveo-tab-dropdown"),e.fromDropdownToTabSection(o,l),window.getComputedStyle(o.el).opacity,window.getComputedStyle(r).opacity,o.el.style.opacity=r.style.opacity="1"):"1"==o.el.style.opacity&&(e.closeDropdown(),a.EventsUtils.removePrefixedEvent(o.el,"TransitionEnd",i),e.handleResizeEvent()))};o.on("click",function(){if(o.hasClass("coveo-tab-dropdown")){var t=e.getTabsInTabSection(),n=t.pop();n&&(a.EventsUtils.addPrefixedEvent(o.el,"TransitionEnd",i),o.el.style.opacity=n.style.opacity="0")}})})},e.prototype.bindNukeEvents=function(){var e=this;n.$$(this.coveoRoot).on(i.InitializationEvents.nuke,function(){n.$$(document.documentElement).off("click",e.documentClickListener)})},e.prototype.positionPopup=function(){s.PopupUtils.positionPopup(this.dropdownContent.el,this.dropdownHeader.el,this.coveoRoot.el,{horizontal:s.PopupHorizontalAlignment.INNERRIGHT,vertical:s.PopupVerticalAlignment.BOTTOM},this.coveoRoot.el)},e.prototype.getTabsInTabSection=function(){var e=this,t=[];return f.each(this.tabSection.el.children,function(o){if(r.Utils.isHtmlElement(o)){var i=n.$$(o);!i.hasClass("coveo-tab-dropdown")&&i.hasClass(p.Component.computeCssClassNameForType(e.ID))&&t.push(i.el)}}),t},e.prototype.fromDropdownToTabSection=function(e,t){t?e.insertAfter(t):this.tabSection.prepend(e.el)},e.prototype.getDropdownHeaderLabel=function(){var t;return f.each(n.$$(this.coveoRoot.find(".coveo-tab-section")).findAll("."+p.Component.computeCssClassName(c.Tab)),function(e){var o=p.Component.get(e,c.Tab);!t&&o.options.dropdownHeaderLabel&&(t=o.options.dropdownHeaderLabel)}),t||(t=v.l(e.DROPDOWN_HEADER_LABEL_DEFAULT_VALUE)),t},e.DROPDOWN_HEADER_LABEL_DEFAULT_VALUE="More",e}();t.ResponsiveTabs=w},448:function(e,t){},449:function(e,t){},77:function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=o(2),i=o(15),s=o(6),a=o(17),r=o(4),l=o(0),p=o(10),d=o(11),c=o(21),h=function(){function e(t){var o=this;this.disabledComponents=[],this.responsiveComponents=[],this.coveoRoot=t,this.searchInterface=s.Component.get(this.coveoRoot.el,a.SearchInterface,!1),this.dropdownHeadersWrapper=n.$$("div",{className:e.DROPDOWN_HEADER_WRAPPER_CSS_CLASS}),this.searchBoxElement=this.getSearchBoxElement(),this.logger=new d.Logger(this),this.resizeListener=function(){0!=o.coveoRoot.width()?(o.addDropdownHeaderWrapperIfNeeded(),o.shouldSwitchToSmallMode()?o.coveoRoot.addClass("coveo-small-interface"):o.shouldSwitchToSmallMode()||o.coveoRoot.removeClass("coveo-small-interface"),l.each(o.responsiveComponents,function(e){e.handleResizeEvent()})):o.logger.warn("The width of the search interface is 0, cannot dispatch resize events to responsive components. This means that the tabs will not\n        automatically fit in the tab section. Also, the facet and recommendation component will not hide in a menu. Could the search\n        interface display property be none? Could its visibility property be set to hidden? Also, if either of these scenarios happen during\n        loading, it could be the cause of this issue.")},c.DeviceUtils.isMobileDevice()||window.addEventListener("resize",this.resizeListener),this.bindNukeEvents()}return e.register=function(t,o,n,s,a){var c=this;(a.initializationEventRoot||o).on(i.InitializationEvents.afterInitialization,function(){if(c.shouldEnableResponsiveMode(o)){var i=l.find(c.componentManagers,function(e){return o.el==e.coveoRoot.el});if(i||(i=new e(o),c.componentManagers.push(i)),!r.Utils.isNullOrUndefined(a.enableResponsiveMode)&&!a.enableResponsiveMode)return void i.disableComponent(n);c.componentInitializations.push({responsiveComponentsManager:i,arguments:[t,o,n,s,a]})}if(0==--c.remainingComponentInitializations)if(c.instantiateResponsiveComponents(),0==o.width()){var h=new d.Logger("ResponsiveComponentsManager");h.info("Search interface width is 0, cannot dispatch resize events to responsive components. Will try again after first\n          query success."),o.one(p.QueryEvents.querySuccess,function(){c.resizeAllComponentsManager()})}else c.resizeAllComponentsManager()}),this.remainingComponentInitializations++},e.shouldEnableResponsiveMode=function(e){var t=s.Component.get(e.el,a.SearchInterface,!0);return t instanceof a.SearchInterface&&t.options.enableAutomaticResponsiveMode},e.instantiateResponsiveComponents=function(){l.each(this.componentInitializations,function(e){var t=e.responsiveComponentsManager;t.register.apply(t,e.arguments)})},e.resizeAllComponentsManager=function(){l.each(this.componentManagers,function(e){e.resizeListener()})},e.prototype.register=function(e,t,o,n,i){if(!this.isDisabled(o)){if(!this.isActivated(o)){var s=new e(t,o,i);this.isTabs(o)?this.responsiveComponents.push(s):this.responsiveComponents.unshift(s)}l.each(this.responsiveComponents,function(e){null!=e.registerComponent&&e.registerComponent(n)})}},e.prototype.disableComponent=function(e){this.disabledComponents.push(e)},e.prototype.isDisabled=function(e){return-1!=l.indexOf(this.disabledComponents,e)},e.prototype.shouldSwitchToSmallMode=function(){var e=this.needDropdownWrapper(),t=this.coveoRoot.width()<=this.searchInterface.responsiveComponents.getMediumScreenWidth();return e||t},e.prototype.needDropdownWrapper=function(){for(var e=0;e<this.responsiveComponents.length;e++){var t=this.responsiveComponents[e];if(t.needDropdownWrapper&&t.needDropdownWrapper())return!0}return!1},e.prototype.addDropdownHeaderWrapperIfNeeded=function(){if(this.needDropdownWrapper()){var e=n.$$(this.coveoRoot).find(".coveo-tab-section");this.searchBoxElement?this.dropdownHeadersWrapper.insertAfter(this.searchBoxElement):e?this.dropdownHeadersWrapper.insertAfter(e):this.coveoRoot.prepend(this.dropdownHeadersWrapper.el)}},e.prototype.isTabs=function(e){return"Tab"==e},e.prototype.isActivated=function(e){return void 0!=l.find(this.responsiveComponents,function(t){return t.ID==e})},e.prototype.getSearchBoxElement=function(){var e=this.coveoRoot.find(".coveo-search-section");return e||this.coveoRoot.find(".CoveoSearchbox")},e.prototype.bindNukeEvents=function(){var t=this;n.$$(this.coveoRoot).on(i.InitializationEvents.nuke,function(){window.removeEventListener("resize",t.resizeListener),e.componentManagers=l.filter(e.componentManagers,function(e){return e.coveoRoot.el!=t.coveoRoot.el})})},e.DROPDOWN_HEADER_WRAPPER_CSS_CLASS="coveo-dropdown-header-wrapper",e.componentManagers=[],e.remainingComponentInitializations=0,e.componentInitializations=[],e}();t.ResponsiveComponentsManager=h},89:function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=o(148),i=function(){function e(){}return e.shouldDrawFacetSlider=function(e,t){return n.ResponsiveDropdownContent.isTargetInsideOpenedDropdown(t)||!this.isSmallFacetActivated(e)},e.isSmallTabsActivated=function(e){return e.hasClass(this.smallTabsClassName)},e.isSmallFacetActivated=function(e){return e.hasClass(this.smallFacetClassName)},e.isSmallRecommendationActivated=function(e){return e.hasClass(this.smallRecommendationClassName)},e.activateSmallTabs=function(e){e.addClass(this.smallTabsClassName)},e.deactivateSmallTabs=function(e){e.removeClass(this.smallTabsClassName)},e.activateSmallFacet=function(e){e.addClass(this.smallFacetClassName)},e.deactivateSmallFacet=function(e){e.removeClass(this.smallFacetClassName)},e.activateSmallRecommendation=function(e){e.addClass(this.smallRecommendationClassName)},e.deactivateSmallRecommendation=function(e){e.removeClass(this.smallRecommendationClassName)},e.smallTabsClassName="coveo-small-tabs",e.smallFacetClassName="coveo-small-facets",e.smallRecommendationClassName="coveo-small-recommendation",e}();t.ResponsiveComponentsUtils=i}});