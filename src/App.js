//css
import '@/App.css';
import { Reset } from 'styled-reset';

//lib
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//pages, component
import Head from '@HeadComponent/Head';
import Login from '@Pages/Login';
import Main from '@Pages/Main';

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
