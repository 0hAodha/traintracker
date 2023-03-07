import{s as _,n as Ye}from"./navbar-764b96b5.js";import{_ as je,i as B,r as p,o as y,c as N,a as m,b as u,w as H,T as Ke,F as ce,t as w,d as ze,e as We,j as Ve,p as Xe,f as $e}from"./index-c8c418b0.js";const Je={radians:6370997/(2*Math.PI),degrees:2*Math.PI*6370997/360,ft:.3048,m:1,"us-ft":1200/3937};class Ze{constructor(e){this.code_=e.code,this.units_=e.units,this.extent_=e.extent!==void 0?e.extent:null,this.worldExtent_=e.worldExtent!==void 0?e.worldExtent:null,this.axisOrientation_=e.axisOrientation!==void 0?e.axisOrientation:"enu",this.global_=e.global!==void 0?e.global:!1,this.canWrapX_=!!(this.global_&&this.extent_),this.getPointResolutionFunc_=e.getPointResolution,this.defaultTileGrid_=null,this.metersPerUnit_=e.metersPerUnit}canWrapX(){return this.canWrapX_}getCode(){return this.code_}getExtent(){return this.extent_}getUnits(){return this.units_}getMetersPerUnit(){return this.metersPerUnit_||Je[this.units_]}getWorldExtent(){return this.worldExtent_}getAxisOrientation(){return this.axisOrientation_}isGlobal(){return this.global_}setGlobal(e){this.global_=e,this.canWrapX_=!!(e&&this.extent_)}getDefaultTileGrid(){return this.defaultTileGrid_}setDefaultTileGrid(e){this.defaultTileGrid_=e}setExtent(e){this.extent_=e,this.canWrapX_=!!(this.global_&&e)}setWorldExtent(e){this.worldExtent_=e}setGetPointResolution(e){this.getPointResolutionFunc_=e}getPointResolutionFunc(){return this.getPointResolutionFunc_}}const Te=Ze,x=6378137,S=Math.PI*x,qe=[-S,-S,S,S],et=[-180,-85,180,85],U=x*Math.log(Math.tan(Math.PI/2));class v extends Te{constructor(e){super({code:e,units:"m",extent:qe,global:!0,worldExtent:et,getPointResolution:function(n,i){return n/Math.cosh(i[1]/x)}})}}const le=[new v("EPSG:3857"),new v("EPSG:102100"),new v("EPSG:102113"),new v("EPSG:900913"),new v("http://www.opengis.net/def/crs/EPSG/0/3857"),new v("http://www.opengis.net/gml/srs/epsg.xml#3857")];function tt(t,e,n){const i=t.length;n=n>1?n:2,e===void 0&&(n>2?e=t.slice():e=new Array(i));for(let r=0;r<i;r+=n){e[r]=S*t[r]/180;let s=x*Math.log(Math.tan(Math.PI*(+t[r+1]+90)/360));s>U?s=U:s<-U&&(s=-U),e[r+1]=s}return e}function nt(t,e,n){const i=t.length;n=n>1?n:2,e===void 0&&(n>2?e=t.slice():e=new Array(i));for(let r=0;r<i;r+=n)e[r]=180*t[r]/S,e[r+1]=360*Math.atan(Math.exp(t[r+1]/x))/Math.PI-90;return e}const rt=6378137,he=[-180,-90,180,90],it=Math.PI*rt/180;class b extends Te{constructor(e,n){super({code:e,units:"degrees",extent:he,axisOrientation:n,global:!0,metersPerUnit:it,worldExtent:he})}}const de=[new b("CRS:84"),new b("EPSG:4326","neu"),new b("urn:ogc:def:crs:OGC:1.3:CRS84"),new b("urn:ogc:def:crs:OGC:2:84"),new b("http://www.opengis.net/def/crs/OGC/1.3/CRS84"),new b("http://www.opengis.net/gml/srs/epsg.xml#4326","neu"),new b("http://www.opengis.net/def/crs/EPSG/0/4326","neu")];let X={};function st(t){return X[t]||X[t.replace(/urn:(x-)?ogc:def:crs:EPSG:(.*:)?(\w+)$/,"EPSG:$3")]||null}function ot(t,e){X[t]=e}let T={};function k(t,e,n){const i=t.getCode(),r=e.getCode();i in T||(T[i]={}),T[i][r]=n}function At(t,e){let n;return t in T&&e in T[t]&&(n=T[t][e]),n}function Me(t,e){if(e!==void 0){for(let n=0,i=t.length;n<i;++n)e[n]=t[n];e=e}else e=t.slice();return e}function at(t,e){if(e!==void 0&&t!==e){for(let n=0,i=t.length;n<i;++n)e[n]=t[n];t=e}return t}function ct(t){ot(t.getCode(),t),k(t,t,Me)}function lt(t){t.forEach(ct)}function ge(t){return typeof t=="string"?st(t):t||null}function ue(t){lt(t),t.forEach(function(e){t.forEach(function(n){e!==n&&k(e,n,Me)})})}function ht(t,e,n,i){t.forEach(function(r){e.forEach(function(s){k(r,s,n),k(s,r,i)})})}function fe(t,e){return ut(t,"EPSG:4326",e!==void 0?e:"EPSG:3857")}function dt(t,e){const n=t.getCode(),i=e.getCode();let r=At(n,i);return r||(r=at),r}function gt(t,e){const n=ge(t),i=ge(e);return dt(n,i)}function ut(t,e,n){return gt(e,n)(t,void 0,t.length)}function ft(){ue(le),ue(de),ht(de,le,tt,nt)}ft();/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pe=function(t){const e=[];let n=0;for(let i=0;i<t.length;i++){let r=t.charCodeAt(i);r<128?e[n++]=r:r<2048?(e[n++]=r>>6|192,e[n++]=r&63|128):(r&64512)===55296&&i+1<t.length&&(t.charCodeAt(i+1)&64512)===56320?(r=65536+((r&1023)<<10)+(t.charCodeAt(++i)&1023),e[n++]=r>>18|240,e[n++]=r>>12&63|128,e[n++]=r>>6&63|128,e[n++]=r&63|128):(e[n++]=r>>12|224,e[n++]=r>>6&63|128,e[n++]=r&63|128)}return e},Et=function(t){const e=[];let n=0,i=0;for(;n<t.length;){const r=t[n++];if(r<128)e[i++]=String.fromCharCode(r);else if(r>191&&r<224){const s=t[n++];e[i++]=String.fromCharCode((r&31)<<6|s&63)}else if(r>239&&r<365){const s=t[n++],o=t[n++],A=t[n++],a=((r&7)<<18|(s&63)<<12|(o&63)<<6|A&63)-65536;e[i++]=String.fromCharCode(55296+(a>>10)),e[i++]=String.fromCharCode(56320+(a&1023))}else{const s=t[n++],o=t[n++];e[i++]=String.fromCharCode((r&15)<<12|(s&63)<<6|o&63)}}return e.join("")},Oe={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,i=[];for(let r=0;r<t.length;r+=3){const s=t[r],o=r+1<t.length,A=o?t[r+1]:0,a=r+2<t.length,l=a?t[r+2]:0,f=s>>2,d=(s&3)<<4|A>>4;let h=(A&15)<<2|l>>6,g=l&63;a||(g=64,o||(h=64)),i.push(n[f],n[d],n[h],n[g])}return i.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(Pe(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):Et(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,i=[];for(let r=0;r<t.length;){const s=n[t.charAt(r++)],A=r<t.length?n[t.charAt(r)]:0;++r;const l=r<t.length?n[t.charAt(r)]:64;++r;const d=r<t.length?n[t.charAt(r)]:64;if(++r,s==null||A==null||l==null||d==null)throw Error();const h=s<<2|A>>4;if(i.push(h),l!==64){const g=A<<4&240|l>>2;if(i.push(g),d!==64){const E=l<<6&192|d;i.push(E)}}}return i},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}},Bt=function(t){const e=Pe(t);return Oe.encodeByteArray(e,!0)},Le=function(t){return Bt(t).replace(/\./g,"")},It=function(t){try{return Oe.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ct(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pt=()=>Ct().__FIREBASE_DEFAULTS__,mt=()=>{if(typeof process>"u"||typeof process.env>"u")return;const t={}.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},wt=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&It(t[1]);return e&&JSON.parse(e)},Ne=()=>{try{return pt()||mt()||wt()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},bt=t=>{var e,n;return(n=(e=Ne())===null||e===void 0?void 0:e.emulatorHosts)===null||n===void 0?void 0:n[t]},Dt=t=>{const e=bt(t);if(!e)return;const n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const i=parseInt(e.substring(n+1),10);return e[0]==="["?[e.substring(1,n-1),i]:[e.substring(0,n),i]},Qt=()=>{var t;return(t=Ne())===null||t===void 0?void 0:t.config};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _t{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,i)=>{n?this.reject(n):this.resolve(i),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,i))}}}function yt(){try{return typeof indexedDB=="object"}catch{return!1}}function vt(){return new Promise((t,e)=>{try{let n=!0;const i="validate-browser-context-for-indexeddb-analytics-module",r=self.indexedDB.open(i);r.onsuccess=()=>{r.result.close(),n||self.indexedDB.deleteDatabase(i),t(!0)},r.onupgradeneeded=()=>{n=!1},r.onerror=()=>{var s;e(((s=r.error)===null||s===void 0?void 0:s.message)||"")}}catch(n){e(n)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const St="FirebaseError";class O extends Error{constructor(e,n,i){super(n),this.code=e,this.customData=i,this.name=St,Object.setPrototypeOf(this,O.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Re.prototype.create)}}class Re{constructor(e,n,i){this.service=e,this.serviceName=n,this.errors=i}create(e,...n){const i=n[0]||{},r=`${this.service}/${e}`,s=this.errors[e],o=s?Tt(s,i):"Error",A=`${this.serviceName}: ${o} (${r}).`;return new O(r,A,i)}}function Tt(t,e){return t.replace(Mt,(n,i)=>{const r=e[i];return r!=null?String(r):`<${i}?>`})}const Mt=/\{\$([^}]+)}/g;function $(t,e){if(t===e)return!0;const n=Object.keys(t),i=Object.keys(e);for(const r of n){if(!i.includes(r))return!1;const s=t[r],o=e[r];if(Ee(s)&&Ee(o)){if(!$(s,o))return!1}else if(s!==o)return!1}for(const r of i)if(!n.includes(r))return!1;return!0}function Ee(t){return t!==null&&typeof t=="object"}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function se(t){return t&&t._delegate?t._delegate:t}class R{constructor(e,n,i){this.name=e,this.instanceFactory=n,this.type=i,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const D="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pt{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const i=new _t;if(this.instancesDeferred.set(n,i),this.isInitialized(n)||this.shouldAutoInitialize())try{const r=this.getOrInitializeService({instanceIdentifier:n});r&&i.resolve(r)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){var n;const i=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(n=e==null?void 0:e.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(i)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:i})}catch(s){if(r)return null;throw s}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Lt(e))try{this.getOrInitializeService({instanceIdentifier:D})}catch{}for(const[n,i]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(n);try{const s=this.getOrInitializeService({instanceIdentifier:r});i.resolve(s)}catch{}}}}clearInstance(e=D){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=D){return this.instances.has(e)}getOptions(e=D){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,i=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(i))throw Error(`${this.name}(${i}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:i,options:n});for(const[s,o]of this.instancesDeferred.entries()){const A=this.normalizeInstanceIdentifier(s);i===A&&o.resolve(r)}return r}onInit(e,n){var i;const r=this.normalizeInstanceIdentifier(n),s=(i=this.onInitCallbacks.get(r))!==null&&i!==void 0?i:new Set;s.add(e),this.onInitCallbacks.set(r,s);const o=this.instances.get(r);return o&&e(o,r),()=>{s.delete(e)}}invokeOnInitCallbacks(e,n){const i=this.onInitCallbacks.get(n);if(i)for(const r of i)try{r(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let i=this.instances.get(e);if(!i&&this.component&&(i=this.component.instanceFactory(this.container,{instanceIdentifier:Ot(e),options:n}),this.instances.set(e,i),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(i,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,i)}catch{}return i||null}normalizeInstanceIdentifier(e=D){return this.component?this.component.multipleInstances?e:D:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Ot(t){return t===D?void 0:t}function Lt(t){return t.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nt{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new Pt(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var c;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(c||(c={}));const Rt={debug:c.DEBUG,verbose:c.VERBOSE,info:c.INFO,warn:c.WARN,error:c.ERROR,silent:c.SILENT},Ft=c.INFO,xt={[c.DEBUG]:"log",[c.VERBOSE]:"log",[c.INFO]:"info",[c.WARN]:"warn",[c.ERROR]:"error"},Ht=(t,e,...n)=>{if(e<t.logLevel)return;const i=new Date().toISOString(),r=xt[e];if(r)console[r](`[${i}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Ut{constructor(e){this.name=e,this._logLevel=Ft,this._logHandler=Ht,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in c))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Rt[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,c.DEBUG,...e),this._logHandler(this,c.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,c.VERBOSE,...e),this._logHandler(this,c.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,c.INFO,...e),this._logHandler(this,c.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,c.WARN,...e),this._logHandler(this,c.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,c.ERROR,...e),this._logHandler(this,c.ERROR,...e)}}const kt=(t,e)=>e.some(n=>t instanceof n);let Be,Ie;function Gt(){return Be||(Be=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Yt(){return Ie||(Ie=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Fe=new WeakMap,J=new WeakMap,xe=new WeakMap,K=new WeakMap,oe=new WeakMap;function jt(t){const e=new Promise((n,i)=>{const r=()=>{t.removeEventListener("success",s),t.removeEventListener("error",o)},s=()=>{n(I(t.result)),r()},o=()=>{i(t.error),r()};t.addEventListener("success",s),t.addEventListener("error",o)});return e.then(n=>{n instanceof IDBCursor&&Fe.set(n,t)}).catch(()=>{}),oe.set(e,t),e}function Kt(t){if(J.has(t))return;const e=new Promise((n,i)=>{const r=()=>{t.removeEventListener("complete",s),t.removeEventListener("error",o),t.removeEventListener("abort",o)},s=()=>{n(),r()},o=()=>{i(t.error||new DOMException("AbortError","AbortError")),r()};t.addEventListener("complete",s),t.addEventListener("error",o),t.addEventListener("abort",o)});J.set(t,e)}let Z={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return J.get(t);if(e==="objectStoreNames")return t.objectStoreNames||xe.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return I(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function zt(t){Z=t(Z)}function Wt(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const i=t.call(z(this),e,...n);return xe.set(i,e.sort?e.sort():[e]),I(i)}:Yt().includes(t)?function(...e){return t.apply(z(this),e),I(Fe.get(this))}:function(...e){return I(t.apply(z(this),e))}}function Vt(t){return typeof t=="function"?Wt(t):(t instanceof IDBTransaction&&Kt(t),kt(t,Gt())?new Proxy(t,Z):t)}function I(t){if(t instanceof IDBRequest)return jt(t);if(K.has(t))return K.get(t);const e=Vt(t);return e!==t&&(K.set(t,e),oe.set(e,t)),e}const z=t=>oe.get(t);function Xt(t,e,{blocked:n,upgrade:i,blocking:r,terminated:s}={}){const o=indexedDB.open(t,e),A=I(o);return i&&o.addEventListener("upgradeneeded",a=>{i(I(o.result),a.oldVersion,a.newVersion,I(o.transaction))}),n&&o.addEventListener("blocked",()=>n()),A.then(a=>{s&&a.addEventListener("close",()=>s()),r&&a.addEventListener("versionchange",()=>r())}).catch(()=>{}),A}const $t=["get","getKey","getAll","getAllKeys","count"],Jt=["put","add","delete","clear"],W=new Map;function Ce(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(W.get(e))return W.get(e);const n=e.replace(/FromIndex$/,""),i=e!==n,r=Jt.includes(n);if(!(n in(i?IDBIndex:IDBObjectStore).prototype)||!(r||$t.includes(n)))return;const s=async function(o,...A){const a=this.transaction(o,r?"readwrite":"readonly");let l=a.store;return i&&(l=l.index(A.shift())),(await Promise.all([l[n](...A),r&&a.done]))[0]};return W.set(e,s),s}zt(t=>({...t,get:(e,n,i)=>Ce(e,n)||t.get(e,n,i),has:(e,n)=>!!Ce(e,n)||t.has(e,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zt{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(qt(n)){const i=n.getImmediate();return`${i.library}/${i.version}`}else return null}).filter(n=>n).join(" ")}}function qt(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const q="@firebase/app",pe="0.9.3";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Q=new Ut("@firebase/app"),en="@firebase/app-compat",tn="@firebase/analytics-compat",nn="@firebase/analytics",rn="@firebase/app-check-compat",sn="@firebase/app-check",on="@firebase/auth",An="@firebase/auth-compat",an="@firebase/database",cn="@firebase/database-compat",ln="@firebase/functions",hn="@firebase/functions-compat",dn="@firebase/installations",gn="@firebase/installations-compat",un="@firebase/messaging",fn="@firebase/messaging-compat",En="@firebase/performance",Bn="@firebase/performance-compat",In="@firebase/remote-config",Cn="@firebase/remote-config-compat",pn="@firebase/storage",mn="@firebase/storage-compat",wn="@firebase/firestore",bn="@firebase/firestore-compat",Dn="firebase";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ee="[DEFAULT]",Qn={[q]:"fire-core",[en]:"fire-core-compat",[nn]:"fire-analytics",[tn]:"fire-analytics-compat",[sn]:"fire-app-check",[rn]:"fire-app-check-compat",[on]:"fire-auth",[An]:"fire-auth-compat",[an]:"fire-rtdb",[cn]:"fire-rtdb-compat",[ln]:"fire-fn",[hn]:"fire-fn-compat",[dn]:"fire-iid",[gn]:"fire-iid-compat",[un]:"fire-fcm",[fn]:"fire-fcm-compat",[En]:"fire-perf",[Bn]:"fire-perf-compat",[In]:"fire-rc",[Cn]:"fire-rc-compat",[pn]:"fire-gcs",[mn]:"fire-gcs-compat",[wn]:"fire-fst",[bn]:"fire-fst-compat","fire-js":"fire-js",[Dn]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const G=new Map,te=new Map;function _n(t,e){try{t.container.addComponent(e)}catch(n){Q.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function Y(t){const e=t.name;if(te.has(e))return Q.debug(`There were multiple attempts to register component ${e}.`),!1;te.set(e,t);for(const n of G.values())_n(n,t);return!0}function yn(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vn={["no-app"]:"No Firebase App '{$appName}' has been created - call Firebase App.initializeApp()",["bad-app-name"]:"Illegal App name: '{$appName}",["duplicate-app"]:"Firebase App named '{$appName}' already exists with different options or config",["app-deleted"]:"Firebase App named '{$appName}' already deleted",["no-options"]:"Need to provide options, when not being deployed to hosting via source.",["invalid-app-argument"]:"firebase.{$appName}() takes either no argument or a Firebase App instance.",["invalid-log-argument"]:"First argument to `onLog` must be null or a function.",["idb-open"]:"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.",["idb-get"]:"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.",["idb-set"]:"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.",["idb-delete"]:"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}."},C=new Re("app","Firebase",vn);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sn{constructor(e,n,i){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=i,this.container.addComponent(new R("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw C.create("app-deleted",{appName:this._name})}}function He(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const i=Object.assign({name:ee,automaticDataCollectionEnabled:!1},e),r=i.name;if(typeof r!="string"||!r)throw C.create("bad-app-name",{appName:String(r)});if(n||(n=Qt()),!n)throw C.create("no-options");const s=G.get(r);if(s){if($(n,s.options)&&$(i,s.config))return s;throw C.create("duplicate-app",{appName:r})}const o=new Nt(r);for(const a of te.values())o.addComponent(a);const A=new Sn(n,i,o);return G.set(r,A),A}function Tn(t=ee){const e=G.get(t);if(!e&&t===ee)return He();if(!e)throw C.create("no-app",{appName:t});return e}function M(t,e,n){var i;let r=(i=Qn[t])!==null&&i!==void 0?i:t;n&&(r+=`-${n}`);const s=r.match(/\s|\//),o=e.match(/\s|\//);if(s||o){const A=[`Unable to register library "${r}" with version "${e}":`];s&&A.push(`library name "${r}" contains illegal characters (whitespace or "/")`),s&&o&&A.push("and"),o&&A.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Q.warn(A.join(" "));return}Y(new R(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mn="firebase-heartbeat-database",Pn=1,F="firebase-heartbeat-store";let V=null;function Ue(){return V||(V=Xt(Mn,Pn,{upgrade:(t,e)=>{switch(e){case 0:t.createObjectStore(F)}}}).catch(t=>{throw C.create("idb-open",{originalErrorMessage:t.message})})),V}async function On(t){try{return(await Ue()).transaction(F).objectStore(F).get(ke(t))}catch(e){if(e instanceof O)Q.warn(e.message);else{const n=C.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Q.warn(n.message)}}}async function me(t,e){try{const i=(await Ue()).transaction(F,"readwrite");return await i.objectStore(F).put(e,ke(t)),i.done}catch(n){if(n instanceof O)Q.warn(n.message);else{const i=C.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});Q.warn(i.message)}}}function ke(t){return`${t.name}!${t.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ln=1024,Nn=30*24*60*60*1e3;class Rn{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new xn(n),this._heartbeatsCachePromise=this._storage.read().then(i=>(this._heartbeatsCache=i,i))}async triggerHeartbeat(){const n=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=we();if(this._heartbeatsCache===null&&(this._heartbeatsCache=await this._heartbeatsCachePromise),!(this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(r=>r.date===i)))return this._heartbeatsCache.heartbeats.push({date:i,agent:n}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(r=>{const s=new Date(r.date).valueOf();return Date.now()-s<=Nn}),this._storage.overwrite(this._heartbeatsCache)}async getHeartbeatsHeader(){if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,this._heartbeatsCache===null||this._heartbeatsCache.heartbeats.length===0)return"";const e=we(),{heartbeatsToSend:n,unsentEntries:i}=Fn(this._heartbeatsCache.heartbeats),r=Le(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=e,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),r}}function we(){return new Date().toISOString().substring(0,10)}function Fn(t,e=Ln){const n=[];let i=t.slice();for(const r of t){const s=n.find(o=>o.agent===r.agent);if(s){if(s.dates.push(r.date),be(n)>e){s.dates.pop();break}}else if(n.push({agent:r.agent,dates:[r.date]}),be(n)>e){n.pop();break}i=i.slice(1)}return{heartbeatsToSend:n,unsentEntries:i}}class xn{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return yt()?vt().then(()=>!0).catch(()=>!1):!1}async read(){return await this._canUseIndexedDBPromise?await On(this.app)||{heartbeats:[]}:{heartbeats:[]}}async overwrite(e){var n;if(await this._canUseIndexedDBPromise){const r=await this.read();return me(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var n;if(await this._canUseIndexedDBPromise){const r=await this.read();return me(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function be(t){return Le(JSON.stringify({version:2,heartbeats:t})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hn(t){Y(new R("platform-logger",e=>new Zt(e),"PRIVATE")),Y(new R("heartbeat",e=>new Rn(e),"PRIVATE")),M(q,pe,t),M(q,pe,"esm2017"),M("fire-js","")}Hn("");var Un="firebase",kn="9.17.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */M(Un,kn,"app");const Gn={apiKey:"AIzaSyBsP9SNH1FuRBpbhcvo9flXbAQWydpctd4",authDomain:"irishrailtracker.firebaseapp.com",projectId:"irishrailtracker",storageBucket:"irishrailtracker.appspot.com",messagingSenderId:"753565032771",appId:"1:753565032771:web:092121cc9d3e254084cff6"},De=He(Gn);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yn="type.googleapis.com/google.protobuf.Int64Value",jn="type.googleapis.com/google.protobuf.UInt64Value";function Ge(t,e){const n={};for(const i in t)t.hasOwnProperty(i)&&(n[i]=e(t[i]));return n}function ne(t){if(t==null)return null;if(t instanceof Number&&(t=t.valueOf()),typeof t=="number"&&isFinite(t)||t===!0||t===!1||Object.prototype.toString.call(t)==="[object String]")return t;if(t instanceof Date)return t.toISOString();if(Array.isArray(t))return t.map(e=>ne(e));if(typeof t=="function"||typeof t=="object")return Ge(t,e=>ne(e));throw new Error("Data cannot be encoded in JSON: "+t)}function j(t){if(t==null)return t;if(t["@type"])switch(t["@type"]){case Yn:case jn:{const e=Number(t.value);if(isNaN(e))throw new Error("Data cannot be decoded from JSON: "+t);return e}default:throw new Error("Data cannot be decoded from JSON: "+t)}return Array.isArray(t)?t.map(e=>j(e)):typeof t=="function"||typeof t=="object"?Ge(t,e=>j(e)):t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ae="functions";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qe={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class P extends O{constructor(e,n,i){super(`${Ae}/${e}`,n||""),this.details=i}}function Kn(t){if(t>=200&&t<300)return"ok";switch(t){case 0:return"internal";case 400:return"invalid-argument";case 401:return"unauthenticated";case 403:return"permission-denied";case 404:return"not-found";case 409:return"aborted";case 429:return"resource-exhausted";case 499:return"cancelled";case 500:return"internal";case 501:return"unimplemented";case 503:return"unavailable";case 504:return"deadline-exceeded"}return"unknown"}function zn(t,e){let n=Kn(t),i=n,r;try{const s=e&&e.error;if(s){const o=s.status;if(typeof o=="string"){if(!Qe[o])return new P("internal","internal");n=Qe[o],i=o}const A=s.message;typeof A=="string"&&(i=A),r=s.details,r!==void 0&&(r=j(r))}}catch{}return n==="ok"?null:new P(n,i,r)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wn{constructor(e,n,i){this.auth=null,this.messaging=null,this.appCheck=null,this.auth=e.getImmediate({optional:!0}),this.messaging=n.getImmediate({optional:!0}),this.auth||e.get().then(r=>this.auth=r,()=>{}),this.messaging||n.get().then(r=>this.messaging=r,()=>{}),this.appCheck||i.get().then(r=>this.appCheck=r,()=>{})}async getAuthToken(){if(this.auth)try{const e=await this.auth.getToken();return e==null?void 0:e.accessToken}catch{return}}async getMessagingToken(){if(!(!this.messaging||!("Notification"in self)||Notification.permission!=="granted"))try{return await this.messaging.getToken()}catch{return}}async getAppCheckToken(){if(this.appCheck){const e=await this.appCheck.getToken();return e.error?null:e.token}return null}async getContext(){const e=await this.getAuthToken(),n=await this.getMessagingToken(),i=await this.getAppCheckToken();return{authToken:e,messagingToken:n,appCheckToken:i}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const re="us-central1";function Vn(t){let e=null;return{promise:new Promise((n,i)=>{e=setTimeout(()=>{i(new P("deadline-exceeded","deadline-exceeded"))},t)}),cancel:()=>{e&&clearTimeout(e)}}}class Xn{constructor(e,n,i,r,s=re,o){this.app=e,this.fetchImpl=o,this.emulatorOrigin=null,this.contextProvider=new Wn(n,i,r),this.cancelAllRequests=new Promise(A=>{this.deleteService=()=>Promise.resolve(A())});try{const A=new URL(s);this.customDomain=A.origin,this.region=re}catch{this.customDomain=null,this.region=s}}_delete(){return this.deleteService()}_url(e){const n=this.app.options.projectId;return this.emulatorOrigin!==null?`${this.emulatorOrigin}/${n}/${this.region}/${e}`:this.customDomain!==null?`${this.customDomain}/${e}`:`https://${this.region}-${n}.cloudfunctions.net/${e}`}}function $n(t,e,n){t.emulatorOrigin=`http://${e}:${n}`}function Jn(t,e,n){return i=>qn(t,e,i,n||{})}async function Zn(t,e,n,i){n["Content-Type"]="application/json";let r;try{r=await i(t,{method:"POST",body:JSON.stringify(e),headers:n})}catch{return{status:0,json:null}}let s=null;try{s=await r.json()}catch{}return{status:r.status,json:s}}function qn(t,e,n,i){const r=t._url(e);return er(t,r,n,i)}async function er(t,e,n,i){n=ne(n);const r={data:n},s={},o=await t.contextProvider.getContext();o.authToken&&(s.Authorization="Bearer "+o.authToken),o.messagingToken&&(s["Firebase-Instance-ID-Token"]=o.messagingToken),o.appCheckToken!==null&&(s["X-Firebase-AppCheck"]=o.appCheckToken);const A=i.timeout||7e4,a=Vn(A),l=await Promise.race([Zn(e,r,s,t.fetchImpl),a.promise,t.cancelAllRequests]);if(a.cancel(),!l)throw new P("cancelled","Firebase Functions instance was deleted.");const f=zn(l.status,l.json);if(f)throw f;if(!l.json)throw new P("internal","Response is not valid JSON object.");let d=l.json.data;if(typeof d>"u"&&(d=l.json.result),typeof d>"u")throw new P("internal","Response is missing data field.");return{data:j(d)}}const _e="@firebase/functions",ye="0.9.3";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tr="auth-internal",nr="app-check-internal",rr="messaging-internal";function ir(t,e){const n=(i,{instanceIdentifier:r})=>{const s=i.getProvider("app").getImmediate(),o=i.getProvider(tr),A=i.getProvider(rr),a=i.getProvider(nr);return new Xn(s,o,A,a,r,t)};Y(new R(Ae,n,"PUBLIC").setMultipleInstances(!0)),M(_e,ye,e),M(_e,ye,"esm2017")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ve(t=Tn(),e=re){const i=yn(se(t),Ae).getImmediate({identifier:e}),r=Dt("functions");return r&&ie(i,...r),i}function ie(t,e,n){$n(se(t),e,n)}function Se(t,e,n){return Jn(se(t),e,n)}ir(fetch.bind(self));const sr="/assets/train-solid-e7249eb7.svg",or="data:image/png;base64,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",Ar="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAcAAAAIACAYAAAAVJbxaAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TRZGKoB1EHDJUF62DijjWKhShQqgVWnUwufQLmjQkKS6OgmvBwY/FqoOLs64OroIg+AHi6uKk6CIl/i8ptIjx4Lgf7+497t4BQr3MNKsjBmi6baYScTGTXRW7XhGEgH5MYExmljEnSUn4jq97BPh6F+VZ/uf+HL1qzmJAQCSOMcO0iTeIZzZtg/M+cZgVZZX4nHjcpAsSP3Jd8fiNc8FlgWeGzXRqnjhMLBbaWGljVjQ14mniiKrplC9kPFY5b3HWylXWvCd/YSinryxzneYwEljEEiSIUFBFCWXYiNKqk2IhRftxH/+Q65fIpZCrBEaOBVSgQXb94H/wu1srPzXpJYXiQOeL43yMAF27QKPmON/HjtM4AYLPwJXe8lfqwOwn6bWWFjkC+raBi+uWpuwBlzvA4JMhm7IrBWkK+TzwfkbflAUGboGeNa+35j5OH4A0dZW8AQ4OgdECZa/7vLu7vbd/zzT7+wGynHLAamjR0gAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAN1wAADdcBQiibeAAAAAd0SU1FB+cDAhI2AlKMtIYAAAtWSURBVHja7dzbcdvMEkZRjIqhMBomwBiZAKNhLvSDy65SybBEYoC5fGu9//YxjO6tpqxTFqq4PK5PTwE4wv18K57Cdh6i0AHCKIAIHiCIAih4AIIogKIHIIYCKHoAYiiAwgcghAIoegBiKIDCByCEAih8AEIogMIHIIQCKHwAQiiAwgcghAIofgAiKIDCByCEsQEUPwARjAqg8AEIYVwAxQ9ABKMCKHwAQhgXQPEDEMG4AIofgAhGBVD4AIQwLoDiByCCcQEUPwARjAug+AGIYFwAxQ+AlhFs8puKHwCtI3j4byh+APQQwUN/M/EDoJcIHvYbiR8APUXwkN9E/ADoLYK7/wbiB0CPEdz1Fxc/AHqN4G6/sPgB0HMEd/lFxQ+A3iP44bECkKh6UV1/AIxwBVb9xcQPgFEiWO0XEj8ARoqg7wECEKlKRV1/AIx2BW7+BcQPgBEj6CNQACJtqqfrD4BRr8C3/0PxA2DkCPoIFIBIb1XT9QfA6Ffgy/+B+AEwQwR9BApApJdq6foDYJYr0AUIgAvQ9QdAyhXoAgTABej6AyDlCnQBAuACdP0BkHIFugABcAG6/gBIuQJdgABEEkAAIq2ehj7+BGAGax+DugABcAG6/gBIuQJdgABEOnkE/X1VAmTwaVtbxV+IwAHimLiPXYCiBwywRwSxPgEUPmCg/SKE9fgKQ/iAAdnX2/e1C1D4ABdhJD8GIX6AXRTJBehlA1yDkf4ucw9O/IDx2eU/3+U+AhU/wK6KJIBeKMDOEkC8SIDdlcI3Tr1AwMTs9/X97gIEIJIAuv4Au0wA8cIAdpoAAoAA+koJwG6bLID+hRAAaS6P69MF6CskwI7LvAA9AgAE0FdGAHadAAKAAAKAAAKAAE7AZ+KAnSeAACCAACCAACCAACCAACCAACCAA/DPgQG7TwABQAABQAABQAABQAABQAABQAABQAABQAABQAABQAABQAABQAABQAABQAABQAABQAABQAABQAABEECPAAABBAABBAABBAABBAABBAABBAABBAABBAABBAABBAABBAABBAABBAABBAABBAABBAABBAABBAABBEAAAUAAAUAAAUAAAUAAAUAAAUAAAUAAAUAAAUAAAUAAAUAAAUAAAUAAAUAAAUAAAUAAAUAAAUAAAUAAARBAABBAABBAABBAABBAABBAABBAABBAABBAABBAABBAABBAABBAABBAABBAABBAABBAABBAABBAABBAAAQQAAQQAAQQAAQQAAQQAAQQAAQQAAQQAAQQAAQQAAQQAAQQAAQQAAQQAAQQAAQQAATw5y6P69NrANh9AggAAggAAggAAggAAggAAggAAjgI/xwYsPMEEAAEEAAEEAAEcD4+EwfsOgEEAAH0lRGAHSeAACCAvkICsNsEEAAE0FdKAHaaAHphAOwyAQQAAfSVE4AdJoBeIAC7SwC9SAB2lgB6oQDsKgH0YgHYUVUUD+w99/OteAqA8LkAvXAAdpEL0DUIIHwCKIQAwieAQgggfAIoiACCJ4DiCIgcAggAO/NjEAAIIAAIIAAIIAAIIAAIIAAIIAAIIAAIIAAIIAAIIAAIIAAIIAAIIAAIIAAIIAAIIAAIIAAIIAAIIAACCAACCAACCAACCAACCAACCAACCAACCAACCAACCAACCAACCAACCAACCAACCAACCAACCAACCAACCAACCIAAAoAAAoAAAoAAAoAAAoAAAoAAAoAAAoAAAoAAAoAA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";const ar={name:"MapPage",data(){const t=B(fe([-7.5029786,53.4494762])),e=B("EPSG:3857"),n=B(7),i=B(0),r=B(10),s=B(1),o=B("black"),A=B("red");return{center:t,projection:e,zoom:n,rotation:i,radius:r,strokeWidth:s,strokeColor:o,fillColor:A,coordinates:[],dbLiveTrainData:[],allDataMap:{},selectedDataMap:{},display:!1,store:_}},components:{navbar:Ye},created(){let t=window.location.hostname;t==="127.0.0.1"||t==="localhost"?this.postLiveTrainData():this.getLiveTrainData()},methods:{getSelectedTrain(t){this.display=!0,this.selectedDataMap=this.allDataMap[t]},isTrainLate(t){if(this.allDataMap[t].TrainStatus[0]=="R"){let e=this.allDataMap[t].PublicMessage[0],n=e.indexOf("(");if(e[n+1]!="-"&&e[n+1]!="0")return!0}return!1},getLiveTrainData(){const t=ve(De);let e=window.location.hostname;(e==="127.0.0.1"||e=="localhost")&&ie(t,e,5001);const n=Se(t,"getLiveTrainData");let i=this.$loading.show({loader:"dots",container:this.$refs.container,canCancel:!1});n().then(r=>{try{if(this.dbLiveTrainData=r.data,!this.dbLiveTrainData)throw new Error("Error fetching live train data from the database");for(var s={numRunningTrains:0,numLateRunningTrains:0,numMainland:0,numSuburban:0,numDart:0},o=[],A=null,a=null,l=null,f=null,d=0;d<this.dbLiveTrainData.length;d++){let h=this.dbLiveTrainData[d];if(this.coordinates[d]=B(fe([h.TrainLongitude[0],h.TrainLatitude[0]])),this.allDataMap[d]=h,h.TrainType[0]=="M"?s.numMainland+=1:h.TrainType[0]=="S"?s.numSuburban+=1:h.TrainType[0]=="D"&&(s.numDart+=1),this.dbLiveTrainData[d].TrainStatus[0]=="R"){s.numRunningTrains+=1;let g=h.PublicMessage[0],E=g.indexOf("("),ae=g.indexOf(" ",E+1),L=parseInt(g.substring(E+1,ae));o.push({time:L,jsonIndex:d}),g[E+1]!="-"&&g[E+1]!="0"?(s.numLateRunningTrains+=1,A||(A=h),L>l&&(A=h,l=L)):(a||(a=h),L<f&&(a=h,f=L))}}s.percentageLate=(s.numLateRunningTrains/s.numRunningTrains*100).toFixed(2),s.percentageNotLate=(100-s.percentageLate).toFixed(2),s.totalNumTrains=Object.keys(this.allDataMap).length,s.latestTime=l,s.earliestTime=f,_.setInsights(s),_.setEarliestTrain(a),_.setLatestTrain(A),_.setRawData(this.dbLiveTrainData),_.setOrderedTrains(o),i.hide()}catch(h){console.log(h),i.hide()}})},postLiveTrainData(){const t=ve(De);let e=window.location.hostname;(e==="127.0.0.1"||e==="localhost")&&ie(t,e,5001),Se(t,"postLiveTrainData")().then(i=>{this.getLiveTrainData()})}}},cr=t=>(Xe("data-v-0c5ec56d"),t=t(),$e(),t),lr={key:0,id:"sidebarDiv"},hr={id:"sidebarHeader"},dr=cr(()=>u("img",{id:"headerImage",src:sr,alt:"Train Icon"},null,-1)),gr={id:"sidebarDiv"},ur={id:"dateP"},fr={id:"dateP"},Er={id:"dateP"},Br={id:"directionP"},Ir={id:"messageP"},Cr=["onClick"],pr={key:0,src:or,class:"trainMapIcon",alt:"Train Icon"},mr={key:1,src:Ar,class:"trainMapIcon",alt:"Train Icon"};function wr(t,e,n,i,r,s){const o=p("navbar"),A=p("SidebarPanel"),a=p("ol-view"),l=p("ol-source-osm"),f=p("ol-tile-layer"),d=p("ol-overlay"),h=p("ol-map");return y(),N(ce,null,[m(o),u("button",{id:"hoverButton",onClick:e[0]||(e[0]=(...g)=>s.postLiveTrainData&&s.postLiveTrainData(...g))},"Populate Database"),u("div",null,[m(A)]),m(Ke,{id:"sidebar",name:"slideLeft"},{default:H(()=>[this.display?(y(),N("div",lr,[u("div",hr,[dr,u("div",{onClick:e[1]||(e[1]=g=>this.display=!1),id:"xButton"},"X")]),u("div",gr,[u("h2",null,"Train Code: "+w(r.selectedDataMap.TrainCode),1),u("p",ur,"Date: "+w(r.selectedDataMap.TrainDate),1),u("p",fr,"Status: "+w(r.selectedDataMap.TrainStatus),1),u("p",Er,"Train Position - Long: "+w(r.selectedDataMap.TrainLongitude)+" Lat: "+w(r.selectedDataMap.TrainLatitude),1),u("p",Br,"Direction: "+w(r.selectedDataMap.Direction),1),u("p",Ir,"Public Message: "+w(r.selectedDataMap.PublicMessage),1)])])):ze("",!0)]),_:1}),m(h,{loadTilesWhileAnimating:!0,loadTilesWhileInteracting:!0,style:{position:"absolute",height:"90.7vh",width:"100%"}},{default:H(()=>[m(a,{ref:"view",center:r.center,rotation:r.rotation,zoom:r.zoom,projection:r.projection},null,8,["center","rotation","zoom","projection"]),m(f,null,{default:H(()=>[m(l)]),_:1}),(y(!0),N(ce,null,We(r.coordinates,(g,E)=>(y(),Ve(d,{position:g,positioning:r.center-r.center,offset:[-14,-16]},{default:H(()=>[u("div",{class:"overlay-content",onClick:ae=>s.getSelectedTrain(E)},[s.isTrainLate(E)?(y(),N("img",pr)):(y(),N("img",mr))],8,Cr)]),_:2},1032,["position","positioning"]))),256))]),_:1})],64)}const Qr=je(ar,[["render",wr],["__scopeId","data-v-0c5ec56d"]]);export{Qr as default};
