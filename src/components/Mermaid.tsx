import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
}

const Mermaid = ({ chart }: MermaidProps) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Clean previous content
    if (container.current) {
      container.current.innerHTML = '';

      // Mermaid config
      mermaid.initialize({
        startOnLoad: false,
        theme: 'neutral' // Or 'dark', 'forest', etc.
      });

      // Use a truly unique ID each time
      const uniqueId = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      try {
        mermaid.render(uniqueId, chart)
          .then(({ svg }) => {
            container.current!.innerHTML = svg;
          })
          .catch((err) => {
            container.current!.innerHTML = `<pre style="color: red;">Invalid Mermaid syntax</pre>`;
            console.error('Mermaid render error:', err);
          });
      } catch (err) {
        container.current!.innerHTML = `<pre style="color: red;">Invalid Mermaid syntax</pre>`;
        console.error('Mermaid render error:', err);
      }
    }
  }, [chart]);

  return <div ref={container} className="my-4" />;
};

export default Mermaid;
