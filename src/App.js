import './App.css';
import Mypage from './pages/Mypage';
import Recipe from './pages/Recipe';
import Search from './pages/Search';
import Refrigerator from './pages/Refrigerator';
import Report from './pages/Report';
import Planner from './pages/Planner';
import Main from './pages/Main';
import Login from './pages/Login';
import IDPW from './pages/Join/IDPW';
import UserInfo from './pages/Join/UserInfo';
import Activity from './pages/Join/Activity';
import Goals from './pages/Join/Goals';
import MainIsLogin from './pages/MainIsLogin';
import ChUserInfo from './pages/Change/ChUserInfo';
import ChActivity from './pages/Change/ChActivity';
import ChGoals from './pages/Change/ChGoals';
import { Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Routes>
      <Route path="/" exact={true} element={<Main/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/main" element={<MainIsLogin/>} />
      <Route path="/join1" element={<IDPW/>} />
      <Route path="/join2" element={<UserInfo/>} />
      <Route path="/join3" element={<Activity/>} />
      <Route path="/join4" element={<Goals/>} />
      <Route path="/refrigerator" element={<Refrigerator/>} />
      <Route path="/planner" element={<Planner/>} />
      <Route path="/report" element={<Report/>} />
      <Route path="/mypage" element={<Mypage/>} />
      <Route path="/search/:query" element={<Search/>} />
      <Route path="/recipe/:recipeId" element={<Recipe/>} />
      <Route path="/changeinfo1" element={<ChUserInfo/>} />
      <Route path="/changeinfo2" element={<ChActivity/>} />
      <Route path="/changeinfo3" element={<ChGoals/>} />
    </Routes>
  );
};

export default App;
