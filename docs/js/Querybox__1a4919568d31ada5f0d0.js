webpackJsonpCoveo__temporary([44],{

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
//# sourceMappingURL=Querybox__1a4919568d31ada5f0d0.js.map