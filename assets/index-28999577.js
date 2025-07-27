import{r as u,a as v,R as y}from"./vendor-b1791c80.js";(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))i(t);new MutationObserver(t=>{for(const r of t)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function s(t){const r={};return t.integrity&&(r.integrity=t.integrity),t.referrerPolicy&&(r.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?r.credentials="include":t.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(t){if(t.ep)return;t.ep=!0;const r=s(t);fetch(t.href,r)}})();var b={exports:{}},m={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var k=u,w=Symbol.for("react.element"),S=Symbol.for("react.fragment"),T=Object.prototype.hasOwnProperty,C=k.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,D={key:!0,ref:!0,__self:!0,__source:!0};function g(o,a,s){var i,t={},r=null,n=null;s!==void 0&&(r=""+s),a.key!==void 0&&(r=""+a.key),a.ref!==void 0&&(n=a.ref);for(i in a)T.call(a,i)&&!D.hasOwnProperty(i)&&(t[i]=a[i]);if(o&&o.defaultProps)for(i in a=o.defaultProps,a)t[i]===void 0&&(t[i]=a[i]);return{$$typeof:w,type:o,key:r,ref:n,props:t,_owner:C.current}}m.Fragment=S;m.jsx=g;m.jsxs=g;b.exports=m;var e=b.exports,j={},N=v;j.createRoot=N.createRoot,j.hydrateRoot=N.hydrateRoot;function I({fileToUpload:o,paymentIntentId:a,userId:s,onSuccess:i}){const[t,r]=u.useState("Ready to publish..."),[n,d]=u.useState(null),[h,c]=u.useState(null),l=async()=>{if(!o){c("No file was provided to notarize.");return}r("Processing and publishing to blockchain..."),c(null),d(null);const p=new FormData;p.append("document",o),p.append("paymentIntentId",a),s&&p.append("userId",s);try{const x=await fetch("/api/upload",{method:"POST",body:p}),f=await x.json();if(!x.ok)throw new Error(f.error||"An unknown server error occurred.");d(f),r("Success! Your document has been notarized."),i&&i(f)}catch(x){r("Failed"),c(x.message)}};return e.jsxs("div",{className:"upload-area",children:[e.jsx("button",{onClick:l,disabled:t.includes("Processing"),children:"Notarize and Publish"}),t&&e.jsxs("p",{className:"status-message",children:["Status: ",t]}),h&&e.jsxs("p",{className:"error-message",children:["Error: ",h]}),n&&e.jsxs("div",{className:"result-summary",children:[e.jsx("h4",{children:"Notarization Complete!"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Vechain Transaction ID:"})," ",n.txId]}),e.jsx("a",{href:`https://explore.vechain.org/transactions/${n.txId}`,target:"_blank",rel:"noopener noreferrer",children:"View on Vechain Explorer"})]})]})}function R({result:o,fileName:a}){const[s,i]=u.useState(!1);if(!o)return e.jsxs("div",{className:"certificate-container",children:[e.jsx("h2",{children:"Certificate Not Available"}),e.jsx("p",{children:"No notarization result found."})]});const t=new Date().toLocaleDateString(),r=new Date().toLocaleTimeString();return e.jsxs("div",{className:"certificate-container",children:[e.jsxs("div",{className:"certificate-header",children:[e.jsx("h1",{children:"🏛️ Document Notarization Certificate"}),e.jsx("div",{className:"certificate-seal",children:"OFFICIAL"})]}),e.jsxs("div",{className:"certificate-body",children:[e.jsxs("div",{className:"certificate-info",children:[e.jsx("h3",{children:"Certificate of Authenticity"}),e.jsxs("p",{className:"certificate-text",children:["This certifies that the document ",e.jsxs("strong",{children:['"',a,'"']})," has been officially notarized and recorded on the VeChain blockchain."]})]}),e.jsxs("div",{className:"certificate-details",children:[e.jsxs("div",{className:"detail-row",children:[e.jsx("span",{className:"label",children:"Document:"}),e.jsx("span",{className:"value",children:a})]}),e.jsxs("div",{className:"detail-row",children:[e.jsx("span",{className:"label",children:"Transaction ID:"}),e.jsx("span",{className:"value hash-display",children:o.txId})]}),e.jsxs("div",{className:"detail-row",children:[e.jsx("span",{className:"label",children:"File Hash:"}),e.jsx("span",{className:"value hash-display",children:o.fileHash})]}),e.jsxs("div",{className:"detail-row",children:[e.jsx("span",{className:"label",children:"Notarized On:"}),e.jsxs("span",{className:"value",children:[t," at ",r]})]}),e.jsxs("div",{className:"detail-row",children:[e.jsx("span",{className:"label",children:"Blockchain:"}),e.jsx("span",{className:"value",children:"VeChain Testnet"})]})]}),e.jsxs("div",{className:"certificate-actions",children:[e.jsx("a",{href:`https://explore.vechain.org/transactions/${o.txId}`,target:"_blank",rel:"noopener noreferrer",className:"verify-button",children:"🔍 Verify on Blockchain"}),e.jsxs("button",{onClick:()=>i(!s),className:"details-button",children:[s?"Hide":"Show"," Technical Details"]})]}),s&&e.jsxs("div",{className:"technical-details",children:[e.jsx("h4",{children:"Technical Information"}),e.jsxs("div",{className:"tech-info",children:[e.jsxs("p",{children:[e.jsx("strong",{children:"Blockchain Network:"})," VeChain Thor Testnet"]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Hash Algorithm:"})," SHA-256"]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Transaction Status:"})," Confirmed"]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Smart Contract:"})," Document Notarization Service"]})]})]})]}),e.jsx("div",{className:"certificate-footer",children:e.jsx("p",{className:"disclaimer",children:"This certificate serves as proof that your document has been timestamped and recorded on the blockchain. The original document remains unchanged."})})]})}function P(){const[o,a]=u.useState(""),[s,i]=u.useState(null),[t,r]=u.useState(!1),[n,d]=u.useState(null),h=async()=>{if(!o.trim()){d("Please enter a transaction ID");return}r(!0),d(null),i(null);try{const l=await fetch(`/api/lookup?txId=${encodeURIComponent(o)}`),p=await l.json();if(l.ok)i(p);else throw new Error(p.error||"Document not found in our records")}catch(l){d(l.message)}finally{r(!1)}},c=l=>{l.key==="Enter"&&h()};return e.jsxs("div",{className:"lookup-container",children:[e.jsxs("div",{className:"lookup-header",children:[e.jsx("h2",{children:"🔍 Document Lookup"}),e.jsx("p",{children:"Enter a transaction ID to verify document authenticity"})]}),e.jsxs("div",{className:"lookup-form",children:[e.jsxs("div",{className:"input-group",children:[e.jsx("input",{type:"text",value:o,onChange:l=>a(l.target.value),onKeyPress:c,placeholder:"Enter VeChain Transaction ID (0x...)",className:"lookup-input"}),e.jsx("button",{onClick:h,disabled:t,className:"lookup-button",children:t?"Searching...":"Lookup"})]}),n&&e.jsxs("div",{className:"error-message",children:["❌ ",n]})]}),s&&e.jsxs("div",{className:"lookup-results",children:[e.jsx("div",{className:"result-header",children:e.jsx("h3",{children:"✅ Document Found"})}),e.jsxs("div",{className:"result-details",children:[e.jsxs("div",{className:"detail-row",children:[e.jsx("span",{className:"label",children:"Original Filename:"}),e.jsx("span",{className:"value",children:s.original_filename})]}),e.jsxs("div",{className:"detail-row",children:[e.jsx("span",{className:"label",children:"File Hash:"}),e.jsx("span",{className:"value hash-display",children:s.file_hash})]}),e.jsxs("div",{className:"detail-row",children:[e.jsx("span",{className:"label",children:"Transaction ID:"}),e.jsx("span",{className:"value hash-display",children:s.tx_id})]}),e.jsxs("div",{className:"detail-row",children:[e.jsx("span",{className:"label",children:"Notarized On:"}),e.jsx("span",{className:"value",children:new Date(s.created_at).toLocaleString()})]})]}),e.jsx("div",{className:"result-actions",children:e.jsx("a",{href:`https://explore.vechain.org/transactions/${s.tx_id}`,target:"_blank",rel:"noopener noreferrer",className:"verify-button",children:"🔗 View on VeChain Explorer"})}),e.jsxs("div",{className:"verification-info",children:[e.jsx("h4",{children:"How to Verify:"}),e.jsxs("ol",{children:[e.jsx("li",{children:'Click "View on VeChain Explorer" above'}),e.jsx("li",{children:"Check that the transaction exists and is confirmed"}),e.jsx("li",{children:"Compare the file hash with your document's SHA-256 hash"}),e.jsx("li",{children:"Verify the timestamp matches your records"})]})]})]}),e.jsxs("div",{className:"lookup-help",children:[e.jsx("h4",{children:"Need Help?"}),e.jsxs("ul",{children:[e.jsx("li",{children:'Transaction IDs start with "0x" followed by 64 characters'}),e.jsx("li",{children:"You received this ID when you notarized your document"}),e.jsx("li",{children:"Contact support if you can't find your transaction ID"})]})]})]})}function O(){const[o,a]=u.useState({}),[s,i]=u.useState({}),t=async(n,d="GET",h=null)=>{i(c=>({...c,[n]:!0}));try{const c={method:d,headers:{"Content-Type":"application/json"}};h&&(c.body=JSON.stringify(h));const l=await fetch(`/api/${n}`,c),p=await l.json();a(x=>({...x,[n]:{status:l.status,data:p,success:l.ok}}))}catch(c){a(l=>({...l,[n]:{status:"ERROR",data:c.message,success:!1}}))}finally{i(c=>({...c,[n]:!1}))}},r=async()=>{i(n=>({...n,upload:!0}));try{const n="This is a test document for notarization.",d=new File([n],"test-document.txt",{type:"text/plain"}),h=new FormData;h.append("file",d),h.append("description","Test document upload");const c=await fetch("/api/upload",{method:"POST",body:h}),l=await c.json();a(p=>({...p,upload:{status:c.status,data:l,success:c.ok}}))}catch(n){a(d=>({...d,upload:{status:"ERROR",data:n.message,success:!1}}))}finally{i(n=>({...n,upload:!1}))}};return e.jsxs("div",{className:"api-test",children:[e.jsx("h2",{children:"API Endpoint Tests"}),e.jsxs("div",{className:"test-buttons",children:[e.jsx("button",{onClick:()=>t("health"),disabled:s.health,children:s.health?"Testing...":"Test Health"}),e.jsx("button",{onClick:()=>t("test"),disabled:s.test,children:s.test?"Testing...":"Test Basic"}),e.jsx("button",{onClick:()=>t("lookup","POST",{hash:"test-hash"}),disabled:s.lookup,children:s.lookup?"Testing...":"Test Lookup"}),e.jsx("button",{onClick:()=>t("create-payment-intent","POST",{amount:1e3}),disabled:s["create-payment-intent"],children:s["create-payment-intent"]?"Testing...":"Test Payment Intent"}),e.jsx("button",{onClick:r,disabled:s.upload,children:s.upload?"Testing...":"Test File Upload"}),e.jsx("button",{onClick:()=>t("hash-and-chain","POST",{hash:"test-hash-123",description:"Test document"}),disabled:s["hash-and-chain"],children:s["hash-and-chain"]?"Testing...":"Test Hash & Chain"})]}),e.jsx("div",{className:"results",children:Object.entries(o).map(([n,d])=>e.jsxs("div",{className:`result ${d.success?"success":"error"}`,children:[e.jsx("h3",{children:n}),e.jsxs("p",{children:[e.jsx("strong",{children:"Status:"})," ",d.status]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Success:"})," ",d.success?"✅":"❌"]}),e.jsxs("details",{children:[e.jsx("summary",{children:"Response Data"}),e.jsx("pre",{children:JSON.stringify(d.data,null,2)})]})]},n))}),e.jsx("style",{jsx:!0,children:`
        .api-test {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .test-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .test-buttons button {
          padding: 10px 15px;
          border: none;
          border-radius: 5px;
          background: #007bff;
          color: white;
          cursor: pointer;
          font-size: 14px;
        }
        
        .test-buttons button:hover:not(:disabled) {
          background: #0056b3;
        }
        
        .test-buttons button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        
        .results {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .result {
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 15px;
        }
        
        .result.success {
          border-color: #28a745;
          background: #f8fff9;
        }
        
        .result.error {
          border-color: #dc3545;
          background: #fff8f8;
        }
        
        .result h3 {
          margin: 0 0 10px 0;
          text-transform: uppercase;
        }
        
        .result p {
          margin: 5px 0;
        }
        
        .result pre {
          background: #f5f5f5;
          padding: 10px;
          border-radius: 3px;
          overflow-x: auto;
          font-size: 12px;
        }
      `})]})}function E(){const[o,a]=u.useState("upload"),[s,i]=u.useState(null),[t,r]=u.useState(null),n=c=>{const l=c.target.files[0];i(l)},d=c=>{r(c),a("certificate")},h=()=>{a("upload"),i(null),r(null)};return e.jsxs("div",{className:"App",children:[e.jsxs("header",{className:"App-header",children:[e.jsx("h1",{children:"Document Notarization Service"}),e.jsxs("nav",{className:"navigation",children:[e.jsx("button",{onClick:()=>a("upload"),className:o==="upload"?"active":"",children:"Upload Document"}),e.jsx("button",{onClick:()=>a("api-test"),className:o==="api-test"?"active":"",children:"API Test"}),e.jsx("button",{onClick:()=>a("lookup"),className:o==="lookup"?"active":"",children:"Lookup Document"})]})]}),e.jsxs("main",{className:"App-main",children:[o==="upload"&&e.jsxs("div",{className:"upload-flow",children:[e.jsxs("section",{className:"file-selection",children:[e.jsx("h2",{children:"Select Document to Notarize"}),e.jsx("p",{children:"Choose a document to hash and store on VeChain blockchain (payment skipped for testing)"}),e.jsx("input",{type:"file",onChange:n,accept:".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png",className:"file-input"}),s&&e.jsxs("div",{children:[e.jsxs("p",{className:"file-selected",children:["Selected: ",e.jsx("strong",{children:s.name})]}),e.jsxs("p",{children:["Size: ",(s.size/1024).toFixed(2)," KB"]}),e.jsxs("p",{children:["Type: ",s.type||"Unknown"]})]})]}),s&&e.jsxs("section",{className:"notarization-section",children:[e.jsx("h2",{children:"Process with VeChain"}),e.jsx(I,{fileToUpload:s,paymentIntentId:"test-payment-skipped",onSuccess:d})]})]}),o==="api-test"&&e.jsx(O,{}),o==="lookup"&&e.jsx(P,{}),o==="certificate"&&t&&e.jsx(R,{result:t,fileName:s==null?void 0:s.name,onNewDocument:h})]})]})}j.createRoot(document.getElementById("root")).render(e.jsx(y.StrictMode,{children:e.jsx(E,{})}));
