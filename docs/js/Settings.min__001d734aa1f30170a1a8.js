webpackJsonpCoveo__temporary([34],{14:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(0),i=function(){function e(){}return e.addClassToSVGInContainer=function(t,n){var o=t.querySelector("svg");o.setAttribute("class",""+e.getClass(o)+n)},e.removeClassFromSVGInContainer=function(t,n){var o=t.querySelector("svg");o.setAttribute("class",e.getClass(o).replace(n,""))},e.addStyleToSVGInContainer=function(e,t){var n=e.querySelector("svg");o.each(t,function(e,t){n.style[t]=e})},e.getClass=function(e){var t=e.getAttribute("class");return t?t+" ":""},e}();t.SVGDom=i},208:function(e,t,n){"use strict";var o=this&&this.__extends||function(){var e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])};return function(t,n){function o(){this.constructor=t}e(t,n),t.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}();Object.defineProperty(t,"__esModule",{value:!0});var i=n(6),s=n(7),u=n(15),r=n(2),a=n(49),l=n(40),c=n(1),p=n(0),m=n(3);n(444);var h=n(14),v=function(e){function t(n,o,i){var r=e.call(this,n,t.ID,i)||this;return r.element=n,r.options=o,r.isOpened=!1,r.options=s.ComponentOptions.initComponentOptions(n,t,o),r.bind.onRootElement(u.InitializationEvents.afterInitialization,function(){return r.init()}),r}return o(t,e),t.prototype.open=function(){var e=this;this.isOpened=!0,null!=this.menu&&r.$$(this.menu).detach(),this.menu=this.buildMenu(),r.$$(this.menu).on("mouseleave",function(){return e.mouseleave()}),r.$$(this.menu).on("mouseenter",function(){return e.mouseenter()}),a.PopupUtils.positionPopup(this.menu,this.element,this.root,this.getPopupPositioning(),this.root)},t.prototype.close=function(){this.isOpened=!1,null!=this.menu&&(r.$$(this.menu).detach(),this.menu=null)},t.prototype.init=function(){var e=this,t=r.$$("span",{className:"coveo-settings-square"}).el,n=r.$$("span",{className:"coveo-settings-squares"}).el;p.times(3,function(){return n.appendChild(t.cloneNode())}),this.element.appendChild(n),r.$$(this.element).on("click",function(){e.isOpened?e.close():e.open()}),r.$$(this.element).on("mouseleave",function(){return e.mouseleave()}),r.$$(this.element).on("mouseenter",function(){return e.mouseenter()})},t.prototype.buildMenu=function(){var e=this,t=r.$$("div",{className:"coveo-settings-advanced-menu"}).el,n={settings:this,menuData:[]};return r.$$(this.root).trigger(l.SettingsEvents.settingsPopulateMenu,n),p.each(n.menuData,function(o){var i=r.$$("div",{className:"coveo-settings-item "+o.className,title:p.escape(o.tooltip||""),role:"button"}).el,s=r.$$("div",{className:"coveo-icon"}).el;o.svgIcon&&(s.innerHTML=o.svgIcon,o.svgIconClassName&&h.SVGDom.addClassToSVGInContainer(s,o.svgIconClassName)),i.appendChild(s),i.appendChild(r.$$("div",{className:"coveo-settings-text"},p.escape(o.text)).el),r.$$(i).on("click",function(){e.close(),p.each(n.menuData,function(e){e.onClose&&e.onClose()}),o.onOpen()}),t.appendChild(i)}),t},t.prototype.mouseleave=function(){var e=this;clearTimeout(this.closeTimeout),this.closeTimeout=window.setTimeout(function(){e.close()},this.options.menuDelay)},t.prototype.mouseenter=function(){clearTimeout(this.closeTimeout)},t.prototype.getPopupPositioning=function(){return{horizontal:a.PopupHorizontalAlignment.INNERRIGHT,vertical:a.PopupVerticalAlignment.BOTTOM,verticalOffset:8}},t.ID="Settings",t.doExport=function(){m.exportGlobally({Settings:t})},t.options={menuDelay:s.ComponentOptions.buildNumberOption({defaultValue:300,min:0})},t}(i.Component);t.Settings=v,c.Initialization.registerAutoCreateComponent(v)},444:function(e,t){}});