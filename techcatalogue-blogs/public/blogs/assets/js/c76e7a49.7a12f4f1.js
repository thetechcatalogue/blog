"use strict";(self.webpackChunkdoc=self.webpackChunkdoc||[]).push([[819],{9785:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>c,contentTitle:()=>r,default:()=>h,frontMatter:()=>i,metadata:()=>a,toc:()=>l});var t=s(6070),o=s(5710);const i={},r=void 0,a={id:"system-design/pre-checklist",title:"pre-checklist",description:"---",source:"@site/docs/system-design/pre-checklist.md",sourceDirName:"system-design",slug:"/system-design/pre-checklist",permalink:"/blogs/docs/system-design/pre-checklist",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/system-design/pre-checklist.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"selecting-architecture",permalink:"/blogs/docs/system-design/selecting-architecture"},next:{title:"system-design-questions-2",permalink:"/blogs/docs/system-design/system-design-questions-2"}},c={},l=[{value:"sidebar_position: 2",id:"sidebar_position-2",level:2},{value:"Basic Stationery Box",id:"basic-stationery-box",level:3}];function d(e){const n={h2:"h2",h3:"h3",hr:"hr",li:"li",mermaid:"mermaid",p:"p",ul:"ul",...(0,o.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.hr,{}),"\n",(0,t.jsx)(n.h2,{id:"sidebar_position-2",children:"sidebar_position: 2"}),"\n",(0,t.jsx)(n.h3,{id:"basic-stationery-box",children:"Basic Stationery Box"}),"\n",(0,t.jsx)(n.p,{children:"Design interviews mostly talk about choice the right solution for the problem in hand, but most of solutions are picked up from a box of several choices.\nIn-order for someone to choose from a box, somene must put something in the box , and this is where the box of tools comes into picture."}),"\n",(0,t.jsx)(n.p,{children:"Mostly in interviews a few things are common amongst which you need to make a choice."}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Services"}),"\n",(0,t.jsx)(n.li,{children:"Databases"}),"\n",(0,t.jsx)(n.li,{children:"Networks"}),"\n",(0,t.jsx)(n.li,{children:"Caches"}),"\n",(0,t.jsx)(n.li,{children:"Languages"}),"\n",(0,t.jsx)(n.li,{children:"Protocols"}),"\n",(0,t.jsx)(n.li,{children:"Security Options"}),"\n",(0,t.jsx)(n.li,{children:"Operating Systems"}),"\n",(0,t.jsx)(n.li,{children:"Memory Managements"}),"\n",(0,t.jsx)(n.li,{children:"Data Structures"}),"\n",(0,t.jsx)(n.li,{children:"Messaging"}),"\n",(0,t.jsx)(n.li,{children:"Algorithms"}),"\n",(0,t.jsx)(n.li,{children:"integration patterns"}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"etc."}),"\n",(0,t.jsx)(n.p,{children:"These can be considered as subsection in your tool-box and you will see you have a pool of choices within each sub-section and you need to make a choice , and in order to do that you need to understand the basic requirement of the problem and then basic capability of that tool , for example to make a hole in a wall you will not take out a pin-hole bit."}),"\n",(0,t.jsx)(n.p,{children:"Below diagram talks a 1 key info you should know about you tools inside the tool box"}),"\n",(0,t.jsx)(n.mermaid,{value:"graph TD;\n  subgraph System Design\n    A[System] --\x3e B[Key Considerations];\n    B --\x3e C[Key Technologies to Remember];\n  end\n  subgraph Algorithms\n    D[Algorithm] --\x3e E[Data Structures];\n    E --\x3e F[Complexity Analysis];\n  end\n  subgraph Data Structures\n    G[Data Structure] --\x3e H[Key Operations];\n    H --\x3e I[Time Complexity];\n  end\n  subgraph Networks\n    J[Network] --\x3e K[Key Concepts];\n    K --\x3e L[Protocols];\n  end\n  subgraph Operating Systems\n    M[Operating System] --\x3e N[Key Concepts];\n    N --\x3e O[Processes];\n  end\n  subgraph Databases\n    P[Database] --\x3e Q[Key Concepts];\n    Q --\x3e R[SQL vs NoSQL , Read and Write Throughput];\n  end\n  subgraph Caches\n    S[Cache] --\x3e T[Key Concepts];\n    T --\x3e U[Eviction Policies , Scale , Sharding];\n  end\n  subgraph Languages\n    V[Language] --\x3e W[Key Concepts];\n    W --\x3e X[Syntax];\n  end\n\n  subgraph Linux Kernels\n    AB[Linux Kernel] --\x3e AC[Key Concepts];\n    AC --\x3e AD[Process Management];\n  end"})]})}function h(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}},5710:(e,n,s)=>{s.d(n,{R:()=>r,x:()=>a});var t=s(758);const o={},i=t.createContext(o);function r(e){const n=t.useContext(i);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:r(e.components),t.createElement(i.Provider,{value:n},e.children)}}}]);