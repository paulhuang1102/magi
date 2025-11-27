import { useState } from 'react';
import { MAGIProvider } from './context/MAGIContext';
import { MAGISystem } from './components/MAGISystem';
import { Vote } from './pages/Vote';

type PageView = 'system' | 'vote';

function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('vote');

  return (
    <MAGIProvider>
      {/* Navigation */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => setCurrentPage('vote')}
          className={`px-4 py-2 font-bold border-2 transition-colors ${
            currentPage === 'vote'
              ? 'bg-eva-orange text-black border-eva-orange'
              : 'bg-black text-eva-orange border-eva-orange hover:bg-eva-orange hover:text-black'
          }`}
        >
          VOTE VIEW
        </button>
        <button
          onClick={() => setCurrentPage('system')}
          className={`px-4 py-2 font-bold border-2 transition-colors ${
            currentPage === 'system'
              ? 'bg-eva-green text-black border-eva-green'
              : 'bg-black text-eva-green border-eva-green hover:bg-eva-green hover:text-black'
          }`}
        >
          SYSTEM VIEW
        </button>
      </div>

      {/* Page Content */}
      {currentPage === 'vote' ? <Vote /> : <MAGISystem />}
    </MAGIProvider>
  );
}

export default App;
