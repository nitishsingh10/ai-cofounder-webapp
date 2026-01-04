import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import LandingPage from './components/landing/LandingPage';
// import Hero from './components/landing/Hero'; // Replaced
// import IntelligenceFlow from './components/landing/IntelligenceFlow'; // Replaced
import CommandInput from './components/command/CommandInput';
import ExecutionMode from './components/execution/ExecutionMode';
import './App.css';

function App() {
  const [view, setView] = useState('landing'); // landing, command, execution
  const [headerActions, setHeaderActions] = useState(null);

  // If in landing view, using the new LandingPage component which wraps its own layout basically.
  // Actually, Layout wrapper might double up nav if LandingPage has one.
  // The LandingPage code has its own nav.
  // So we might render LandingPage OUTSIDE Layout, or adjust Layout.
  // Layout in App.jsx usually handles the persistent header. 
  // Let's see Layout.jsx to be sure. 
  // For now, let's keep Layout but maybe pass a prop to hide header if needed.
  // OR just render LandingPage inside Layout if Layout is simple.

  return (
    <ThemeProvider>
      <div className="app-root">
        {view === 'landing' && (
          <LandingPage onStart={() => setView('command')} />
        )}

        {view !== 'landing' && (
          <Layout headerActions={headerActions}>
            {view === 'command' && (
              <CommandInput onExecute={(cmd) => {
                console.log("Executing:", cmd);
                setView('execution');
              }} />
            )}

            {view === 'execution' && (
              <ExecutionMode onComplete={(data) => {
                // ... existing logic
                const previewUrl = data?.previewUrl;
                setHeaderActions(
                  <div className="header-actions fade-in">
                    <span className="status-ready">Blueprint Ready</span>
                    {previewUrl && (
                      <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="btn-primary-sm" style={{ textDecoration: 'none' }}>
                        View Live Site
                      </a>
                    )}
                    <button className="btn-secondary-sm">Download PDF</button>
                  </div>
                );
              }} />
            )}
          </Layout>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;

