import{i as n,h as l}from"./index-CqrC0tq-.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=n("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=n("Folder",[["path",{d:"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",key:"1kt360"}]]);class u{static async fetchBlogsData(){return Promise.resolve(l)}static async fetchNestedBlogIndex(e){const t=await fetch(e);if(!t.ok)throw new Error(`Failed to fetch blog index: ${e}`);return t.json()}static async fetchBlogContent(e){const t=await fetch(e.startsWith("/")?e:`/${e}`);if(!t.ok)throw new Error(`Failed to fetch blog content: ${e}`);return t.text()}static findBlogItemByPath(e,t){if(t.length===0)return null;const o=decodeURIComponent(t[0]),r=e.find(a=>{const s=a.id===o,c=a.title.toLowerCase().replace(/[^\w\s]/g,"").replace(/\s+/g,"-")===o.toLowerCase();return s||c});return r?t.length===1?r:r.type==="directory"&&r.children?this.findBlogItemByPath(r.children,t.slice(1)):null:null}static generateBlogPath(e){return e.title.toLowerCase().replace(/[^\w\s]/g,"").replace(/\s+/g,"-")}}export{u as B,f as F,d as a};
