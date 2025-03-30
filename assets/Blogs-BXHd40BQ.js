import{r as i,b as n,j as e,A as d,m as l,N as o,C as c,a as x,c as m,d as h,e as u,f as j,L as p,B as g,g as f,F as N}from"./index-BwTwRnCB.js";const b=()=>{const[t,r]=i.useState(null);return i.useEffect(()=>{window.scrollTo(0,0),r(n)},[]),t?e.jsx(d,{children:e.jsxs(l.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.5},className:"min-h-screen bg-background text-foreground relative",children:[e.jsx(o,{}),e.jsx("main",{children:e.jsx("section",{className:"py-20 px-4 mt-16",children:e.jsxs("div",{className:"max-w-7xl mx-auto",children:[e.jsxs("div",{className:"text-center mb-16",children:[e.jsx("h1",{className:"text-4xl md:text-5xl font-bold mb-4",children:"Blog"}),e.jsx("p",{className:"text-xl text-muted-foreground max-w-2xl mx-auto",children:"Explore articles on various topics ranging from design patterns to the latest in React development."})]}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",children:t.categories.map(s=>e.jsx(l.div,{initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},transition:{duration:.5,delay:.1*t.categories.indexOf(s)},viewport:{once:!0},children:e.jsxs(c,{className:"h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow",children:[e.jsxs(x,{children:[e.jsx(m,{className:"text-2xl",children:s.title}),e.jsx(h,{children:s.description})]}),e.jsx(u,{className:"flex-grow",children:e.jsx("div",{className:"space-y-4",children:s.posts.slice(0,3).map(a=>e.jsxs("div",{className:"border-b pb-3 last:border-0",children:[e.jsx("h4",{className:"font-medium text-lg",children:a.title}),e.jsx("p",{className:"text-sm text-muted-foreground mb-2",children:a.description}),e.jsx("p",{className:"text-xs text-muted-foreground",children:new Date(a.date).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})})]},a.id))})}),e.jsx(j,{children:e.jsx(p,{to:`/blogs/${s.id}`,className:"w-full",children:e.jsxs(g,{variant:"outline",className:"gap-2 w-full",children:["View All ",s.title," Articles ",e.jsx(f,{className:"h-4 w-4"})]})})})]})},s.id))})]})})}),e.jsx(N,{})]})}):null};export{b as default};
