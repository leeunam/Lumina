import React from 'react';
// reuse existing legacy view in this package: views/pages/Home.js
import { Home } from './views/pages/Home';
import './App.css';
import './index.css';

function App() {
  // The legacy `Home` in this package returns a DOM node (vanilla view).
  // We'll mount it into a container when the component mounts.
  const ref = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (!ref.current) return;
    // append the legacy DOM node
    const node = Home();
    ref.current.innerHTML = '';
    ref.current.appendChild(node);
    return () => {
      ref.current && (ref.current.innerHTML = '');
    };
  }, []);

  return <div className="App" ref={ref} />;
}

export default App;
