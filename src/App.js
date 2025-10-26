import HomePage from './Components/HomePage';
import LoginButton from './Components/Login';
import logo from './logo.svg';
import { BrowserRouter, Route, Routes} from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginButton/>} />
        <Route path='/homePage' element={<HomePage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
