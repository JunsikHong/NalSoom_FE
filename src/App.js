//css
import '@/App.css';
import { Reset } from 'styled-reset';

//lib
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//pages, component
import Head from '@HeadComponent/Head';
import Foot from '@FootComponent/Foot';
import Login from '@Pages/Login';
import Main from '@Pages/Main';
import Mypage from '@Pages/Mypage';

function App() {
  return (
    <div className="App">
      <Reset />
      <BrowserRouter>
        <Head />
        <Routes>
          <Route path="*" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mypage" element={<Mypage />} />
        </Routes>
        <Foot/>
      </BrowserRouter>
    </div>
  );
}

export default App;
