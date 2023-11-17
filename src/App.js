import './App.css';
import Mypage from './pages/Mypage';
import Recipe from './pages/Recipe';
import Search from './pages/Search';
import Refrigerator from './pages/Refrigerator';
import Report from './pages/Report';
import Main from './pages/Main';
import Login from './pages/Login';
import IDPW from './pages/Join/IDPW';
import UserInfo from './pages/Join/UserInfo';
import Activity from './pages/Join/Activity';
import Goals from './pages/Join/Goals';
import { Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Routes>
      <Route path="/" exact={true} element={<Main/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/join1" element={<IDPW/>} />
      <Route path="/join2" element={<UserInfo/>} />
      <Route path="/join3" element={<Activity/>} />
      <Route path="/join4" element={<Goals/>} />
      <Route path="/refrigerator" element={<Refrigerator/>} />
      <Route path="/planer" element={<Planer/>} />
      <Route path="/report" element={<Report/>} />
      <Route path="/mypage" element={<Mypage/>} />
      <Route path="/search/:query" element={<Search/>} />
      <Route path="/recipe/:recipeId" element={<Recipe/>} />
    </Routes>
  );
};

export default App;
