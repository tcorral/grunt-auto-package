!function(t,e,n){"use strict";var o;o=function(t){this.originalEvent=t||null,this.altKey=t?t.altKey:!1,this.button=t?t.button:-1,this.clientX=t?t.clientX:0,this.clientY=t?t.clientY:0,this.ctrlKey=t?t.ctrlKey:!1,this.screenX=t?t.screenX:0,this.screenY=t?t.screenY:0,this.shiftKey=t?t.shiftKey:!1,this.type=t?t.type:"",this.target=t?t.target:null,this.relatedTarget=t?t.relatedTarget:null,this.pageX=t?t.pageX:0,this.pageY=t?t.pageY:0,this.which=t?t.which:0,this.metaKey=t?t.metaKey:!1,t&&(o.buttonMouseDown=o.setButtonMouseDown(),this.normalize(t))},n.ButtonMouseDown=function(){this.left=0,this.central=null,this.right=2},o.setButtonMouseDown=function(){return new n.ButtonMouseDown},o.buttonMouseDown=null,o.prototype.preventDefault=function(){this.isDefaultPrevented=function(){return!0};var t=this.originalEvent;if(t)return t.preventDefault?(t.preventDefault(),this):(t.returnValue=!1,this)},o.prototype.stopPropagation=function(){this.isPropagationStopped=function(){return!0};var t=this.originalEvent;if(t)return t.stopPropagation?(t.stopPropagation(),this):(t.cancelBubble=!0,this)},o.prototype.stopImmediatePropagation=function(){this.isImmediatePropagationStopped=function(){return!0},this.stopPropagation()},o.prototype.sisDefaultPrevented=function(){return!1},o.prototype.sisPropagationStopped=function(){return!1},o.prototype.sisImmediatePropagationStopped=function(){return!1},o.prototype.normalize=function(t){var n,o;t.target||(this.target=t.srcElement||e),3===this.target.nodeType&&(this.target=t.target.parentNode),!t.relatedTarget&&t.fromElement&&(this.relatedTarget=t.fromElement===t.target?t.toElement:t.fromElement),null===t.pageX&&null!==t.clientX&&(n=e.documentElement,o=e.body,this.pageX=t.clientX+(n&&n.scrollLeft||o&&o.scrollLeft||0)-(n&&n.clientLeft||o&&o.clientLeft||0),this.pageY=t.clientY+(n&&n.scrollTop||o&&o.scrollTop||0)-(n&&n.clientTop||o&&o.clientTop||0)),!t.which&&(t.charCode||0===t.charCode?t.charCode:t.keyCode)&&(this.which=t.charCode||t.keyCode),!t.metaKey&&t.ctrlKey&&(this.metaKey=t.ctrlKey),t.which||void 0===t.button||(this.which=t.button?1:t.button?3:t.button?2:0)},o.instance=function(t){return new o(t)},n.Event=o}(window,document,Namespace),function(t,e,n,o,i){"use strict";var r=function(){};r.hasVerticalScroll=function(t,e){t&&(t.scrollTop=1,1===t.scrollTop&&(t.scrollTop=0,e.call(t)))},r.DOMLoad=function(){var n=!1,o=[],i={},r=function(){t.console.error.apply(t.console,arguments)},s=function(){for(var t=0,e=o.length;e>t;t++)try{o[t]()}catch(n){r&&"function"==typeof r&&r(n)}o=[]},a=function(){n||(n=!0,s())};return e.addEventListener("DOMContentLoaded",a,!1),{DOMReady:function(){for(var t,e=0,r=arguments.length;r>e;e++)t=arguments[e],t.DOMReady||i[t]||(t.DOMReady=!0,o.push(t));n&&s()},setErrorHandling:function(t){r=t}}}(),r.DOMReady=r.DOMLoad.DOMReady,r.aEvents=[],r.systemEvents={blur:"blur",focus:"focus",focusin:"focusin",focusout:"focusout",load:"load",resize:"resize",scroll:"scroll",unload:"unload",click:"click",dblclick:"dblclick",mousedown:"mousedown",mouseup:"mouseup",mousemove:"mousemove",mouseover:"mouseover",mouseout:"mouseout",mouseenter:"mouseenter",mouseleave:"mouseleave",contextmenu:"contextmenu",change:"change",select:"select",submit:"submit",keydown:"keydown",keypress:"keypress",keyup:"keyup",error:"error",webkitTransitionEnd:"webkitTransitionEnd"},t.onhashchange!==i&&(r.systemEvents.hashchange="hashchange"),t.oninvalid!==i&&(r.systemEvents.invalid="invalid"),r.addEvent=function(t,e,n,s,a){var u,l=[],c=e,p=n,h=s,d=a;return t?(o.Utilities.isArray(e)||(c=[],p=e,h=n,d=s),l.push(c),u=function(e){var n=o.Event.instance(e);l.unshift(n),h.apply(t,l)===!1&&(n.originalEvent.preventDefault(),n.originalEvent.stopPropagation())},r.systemEvents[p]!==i?(t.addEventListener(p,u,a===i?!0:a),u):r.bind(t,p,h)):!1},r.removeEvent=function(t,e,n,o){r.systemEvents[e]!==i?n&&t.removeEventListener(e,n,o===i?!0:o):r.unbind(t,e,n)},r.fireEvent=function(t,n,o,s,a){var u;r.systemEvents[n]!==i?(a!==i?u=a:(u=e.createEvent("HTMLEvents"),u.initEvent(n,!0,!0)),t.dispatchEvent(u)):r.trigger(t,n,o,s)},r._now=function(){return(new t.Date).getTime()},r._removeDuplicateElement=function(t){var e=[],n=0,o=t.length,i=0;t:for(;o>n;n++){for(i=0;i<e.length;i++)if(e[i]===t[n])continue t;e[e.length]=t[n]}return e},r._fixTypesArray=function(t){return r._removeDuplicateElement(t.split(","))},r._add=function(e,n,o,s,a){r.aEvents[e]===i&&(r.aEvents[e]=[]),r.aEvents[e][n]===i&&(r.aEvents[e][n]=[]),a!==i&&a.nId===i&&(a.nId=t.Math.random()*+new t.Date),a!==i&&r.aEvents[e][n][a.nId]===i&&(r.aEvents[e][n][a.nId]=[]),a!==i?r.aEvents[e][n][a.nId][o]=s:r.aEvents[e][n][o]=s},r.bind=function(t,e,n,o){for(var i=r._fixTypesArray(e),s=0,a=i.length,u=r._now();a>s;s++)r._add(t,i[s],u,n,o);return i=null,u},r._remove=function(t,e,n){r.aEvents[t]!==i&&r.aEvents[t][e]!==i&&(n!==i?delete r.aEvents[t][e][n]:r.aEvents[t][e]=[])},r.unbind=function(t,e,n){for(var o=r._fixTypesArray(e),i=0,s=o.length;s>i;i++)r._remove(t,o[i],n)},r.triggerWindowEvent=function(e,n,o){r.trigger(t,e,n,o)},r.trigger=function(t,e,n,o){var s=[],a=-1,u=o!==i;if(r.aEvents[t]!==i&&r.aEvents[t][e]!==i){n===i&&(n=[]),u?r.aEvents[t][e][o.nId]!==i&&(s=r.aEvents[t][e][o.nId]):s=r.aEvents[t][e];for(a in s)s.hasOwnProperty(a)&&(-1!==a.indexOf(".")?s[a][o.nId]&&s[a][o.nId].apply(t,n):s[a].apply(t,n))}},o.EventHandler=r}(window,document,navigator,Namespace);