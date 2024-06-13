//css
import '@/App.css';
import { Reset } from 'styled-reset';

//lib
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//pages, component
import Head from '@/components/HeadComponent/Head';
import Login from '@/pages/Login';
import Main from '@/pages/Main';

function App() {
  return (
    <div className="App">
      <Reset />
      <BrowserRouter>
        <Head />
        <Routes>
          <Route path="*" element={<Main />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
