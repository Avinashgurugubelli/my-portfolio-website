import{u as x,r as t,b as h,j as s,A as g,m as n,N as u,L as o,B as c,C as j,a as f,c as N,d as p,e as y,f as C,F as b}from"./index-BwTwRnCB.js";import{A as w,C as v}from"./calendar-lwXUxdJw.js";const D=()=>{const{categoryId:i}=x(),[l,d]=t.useState(null),[e,m]=t.useState(null);return t.useEffect(()=>{window.scrollTo(0,0),d(h)},[]),t.useEffect(()=>{if(l&&i){const a=l.categories.find(r=>r.id===i);m(a||null)}},[l,i]),e?s.jsx(g,{children:s.jsxs(n.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.5},className:"min-h-screen bg-background text-foreground relative",children:[s.jsx(u,{}),s.jsx("main",{children:s.jsx("section",{className:"py-20 px-4 mt-16",children:s.jsxs("div",{className:"max-w-7xl mx-auto",children:[s.jsx("div",{className:"mb-8",children:s.jsx(o,{to:"/blogs",children:s.jsxs(c,{variant:"ghost",className:"gap-2",children:[s.jsx(w,{className:"h-4 w-4"})," Back to All Categories"]})})}),s.jsxs("div",{className:"mb-12",children:[s.jsx("h1",{className:"text-4xl font-bold mb-4",children:e.title}),s.jsx("p",{className:"text-xl text-muted-foreground",children:e.description})]}),s.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:e.posts.map((a,r)=>s.jsx(n.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5,delay:r*.1},children:s.jsxs(j,{className:"h-full flex flex-col hover:shadow-md transition-shadow",children:[s.jsxs(f,{children:[s.jsx(N,{children:a.title}),s.jsxs(p,{className:"flex items-center gap-2 mt-2",children:[s.jsx(v,{className:"h-4 w-4"}),new Date(a.date).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})]})]}),s.jsx(y,{className:"flex-grow",children:s.jsx("p",{className:"text-muted-foreground",children:a.description})}),s.jsx(C,{children:s.jsx(o,{to:`/blogs/${e.id}/${a.id}`,className:"w-full",children:s.jsx(c,{variant:"outline",className:"w-full",children:"Read Article"})})})]})},a.id))})]})})}),s.jsx(b,{})]})}):null};export{D as default};
