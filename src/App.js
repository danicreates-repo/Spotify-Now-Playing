import React from 'react';
import NowPlaying from './components/NowPlaying';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="default-background"></div>
      <NowPlaying />
      <Footer />
    </div>
  );
}

export default App;