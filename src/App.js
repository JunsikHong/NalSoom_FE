//css
import './App.css';
import { Reset } from 'styled-reset';

//lib
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//pages, component
import Head from 'component/Head';
import * as pages from 'pages';

function App() {
  return (
    <div className="App">
      <Reset />
      <BrowserRouter>
        <Head />
        <Routes>
          <Route path="*" element={<pages.Main />} />
          <Route path="/login" element={<pages.Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
