import React from 'react';

const App = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="relative z-10 border-b border-cyan-500/20 bg-slate-950/50 backdrop-blur-xl py-4 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-samarkan tracking-wider">
            Dhanvantari Verification
          </h1>
        </div>
      </header>

      {/* Footer */}
      <footer className="relative z-10 border-t border-cyan-500/20 bg-slate-950/50 backdrop-blur-xl py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2024 <span className="font-samarkan text-lg">Dhanvantari</span>. Powered by Blockchain Technology.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;