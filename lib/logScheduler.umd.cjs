(function(u,o){typeof exports=="object"&&typeof module<"u"?module.exports=o():typeof define=="function"&&define.amd?define(o):(u=typeof globalThis<"u"?globalThis:u||self,u.logScheduler=o())})(this,function(){"use strict";var I=Object.defineProperty;var P=(u,o,l)=>o in u?I(u,o,{enumerable:!0,configurable:!0,writable:!0,value:l}):u[o]=l;var n=(u,o,l)=>(P(u,typeof o!="symbol"?o+"":o,l),l);const u=Image;let o=!1;function l(r){o||(o=!0,window.Image=function(e,t){const s=new u(e,t);return new Proxy(s,{get(c,h,g){return Reflect.get(c,h,g)},set(c,h,g,d){return h=="src"&&r(g,"image")?(c[h]="",!0):Reflect.set(c,h,g,d)}})})}class f{constructor(){n(this,"list",[])}add(e){this.list.push(e)}delete(e){const t=this.list.findIndex(s=>s==e);t!=-1&&this.list.splice(t,1)}getLength(){return this.list.length}includes(e){return this.list.includes(e)}clear(){for(;this.list.length;)this.list.pop()}}function q(r){let e=document.querySelector("body")||document.createElement("div"),t={childList:!0,attributes:!0,subtree:!0};new MutationObserver(r).observe(e,t)}class m extends f{constructor(){super(),q(this.getCurrentImageResquest.bind(this))}async getLengthAsync(){return new Promise(e=>{setTimeout(()=>{e(this.getLength())},0)})}getCurrentImageResquest(){Array.from(document.querySelectorAll("img[src]")).filter(t=>!t.complete).forEach(t=>{this.add(t.currentSrc)})}}class R extends f{constructor(t){super();n(this,"options");n(this,"getCurrentRequestFn");this.options=t}async add(t){this.list.push(t),await this.getCurrentRequestFn()<=this.options.trigger&&this.requestLog()}getCurrentRequestImpl(t){this.getCurrentRequestFn=t}isLogger(t){const s=this.options.log.map(i=>new RegExp(i));return typeof t!="string"?!1:!!s.some(i=>i.test(t))}async requestLog(){this.list.map(t=>{switch(this.delete(t),t.type){case"xhr":{w(t);break}case"image":{y(t.url);break}}})}}function w(r){return new Promise(e=>{try{const t=r.instance;t.addEventListener("load",function(){t.readyState==4&&t.status==200&&e(r.url)}),t.addEventListener("error",function(){e(r.url)}),r.instance.send(r.data)}catch{}})}function y(r){return new Promise(e=>{const t=new u;t.src=r,t.onload=function(){e(r)},t.onerror=function(){e(r)}})}function x(){return new m}function A(r){return new R(r)}function L(r,e,t,s){return{url:r.toString(),type:e,instance:t,data:s}}class v{constructor(e,t){n(this,"requestList");n(this,"logList");this.requestList=e,this.logList=t,this.logList.getCurrentRequestImpl(this.getCurrentRequest.bind(this))}getCurrentRequest(){return this.requestList.getLengthAsync()}createRequestInterceptor(){const e=this;return function(t,s){const i=L(t,s);return e.logList.isLogger(t)?(e.logList.add(i),!0):(e.requestList.add(t.toString()),!1)}}createResponseInterceptor(e){const t=this;return async function(s){if(!t.logList.isLogger(s))t.requestList.delete(s.toString());else return!1;return await t.requestList.getLengthAsync()<=e.trigger&&t.logList.requestLog(),!0}}}class O{constructor(e,t){n(this,"interceptor");n(this,"requestAbleList");this.interceptor=e,this.requestAbleList=t,this.setRequestHandler(),this.setResponseHandler()}setRequestHandler(){const{open:e,send:t}=XMLHttpRequest.prototype,s=this;XMLHttpRequest.prototype.open=function(i,c,h,g,d){s.interceptor.request(c,"xhr"),e.call(this,i,c,h,g,d)},XMLHttpRequest.prototype.send=function(i){if(s.requestAbleList.include(this.responseURL)){s.requestAbleList.add(this.responseURL,this,i);return}t.call(this,i)}}setResponseHandler(){const e=this;new PerformanceObserver(function(s){s.getEntries().forEach(i=>{["img","xmlhttprequest"].includes(i.initiatorType)&&e.interceptor.response(i.name)})}).observe({entryTypes:["resource"]})}}class b{constructor(e){n(this,"requestAbleList");n(this,"logList");this.logList=e}include(e){return this.logList.list.find(t=>t.url===e)}add(e,t,s){this.logList.add(L(e,"xhr",t,s))}}function a(r,e){return Object.prototype.toString.call(e)===`[object ${r}]`}function p(r,e=new WeakMap){if(typeof r!="object"||r===null)return r;if(a("Symbol",r))return r.constructor(r.description);if(e.has(r))return e.get(r);let t,s;if((a("Date",r)||a("RegExp",r))&&(s=r),t=new r.constructor(s),(a("Array",r)||a("Object",r))&&Object.keys(r).forEach(i=>{r.hasOwnProperty(i)&&(t[i]=p(r[i],e))}),a("Set",r))for(let i of r)t.add(p(i,e));if(a("Map",r))for(let[i,c]of r)t.set(p(i,e),p(c,e));return e.set(r,t),t}const C={max:5,trigger:3,log:[]};function S(r){const e=p(C);return Object.keys(e).forEach(t=>{Array.isArray(e[t])?Array.isArray(r[t])?e[t]=e[t].concat(r[t]):r[t]&&e[t].push(r[t]):e[t]=r[t]?r[t]:e[t]}),e.log=e.log.filter(t=>t),e}function T(r,e,t){Array.isArray(r[e])?r[e].push(t):typeof r[e]=="object"||r[e]!==null?r[e]={...r[e],...t}:r[e]=t}class E{constructor(e){n(this,"options");n(this,"requestList");n(this,"logList");n(this,"interceptorIOCTool");n(this,"interceptor",{request:()=>!0,response:()=>new Promise(e=>{e(!0)})});this.options=S(e),this.initRequestQueue(),this.initInterceptor(),this.initObserver()}initObserver(){l(this.interceptor.request),new O(this.interceptor,new b(this.logList))}initRequestQueue(){this.requestList=x(),this.logList=A(this.options)}initInterceptor(){this.interceptorIOCTool=new v(this.requestList,this.logList),this.interceptor.request=this.interceptorIOCTool.createRequestInterceptor(),this.interceptor.response=this.interceptorIOCTool.createResponseInterceptor(this.options)}prefetch(e){T(this.options,"log",e)}}return E});
//# sourceMappingURL=logScheduler.umd.cjs.map
