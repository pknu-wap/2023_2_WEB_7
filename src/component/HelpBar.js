import Logo from "./Logo";
import { useState, useEffect} from 'react';
import styled from "styled-components";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Legend } from 'chart.js/auto';

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Legend
);

const Container = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 476px;
  height: 100%;
  background-color: #FFF8ED;
  padding: 40px 30px;
  h2 {
    margin-left: 27px;
  }
`
const TextBox = styled.div`
  padding-bottom: 10px;
  border-bottom: 1px solid #F3B04D;
  div {
    margin: 40px 0 0 27px;
    color: #000000;
    font-family: Noto Sans KR;
  }
  h1 {
    font-size: 40px;
    font-weight: 400;
  }
  span {
    font-weight: 700;
  }
  h3 {
    font-size: 30px;
    font-weight: 400;
  }
  h5 {
    margin-top: 40px;
    font-size: 22px;
    font-weight: 300;
  }
`
const Stats = styled.div`
  flex: 1;
`

function HelpBar() {
  const [userData, setUserData] = useState({
  userName: '',
  todayCal: '',
  basalMetabolic: '',
  morningCal: '',
  lunchCal: '',
  dinnerCal: '',
  weight: '',
  targetWeight: '',
  });

useEffect(() => {
  fetchDataFromServer()
  .then(data => {
      setUserData({
      userName: data.helpbar_info.name[0],
      todayCal: data.helpbar_info.total_calories,
      basalMetabolic: data.helpbar_info.basal_meta[0],
      morningCal: data.helpbar_info.calories_per_meal.breakfast,
      lunchCal: data.helpbar_info.calories_per_meal.lunch,
      dinnerCal: data.helpbar_info.calories_per_meal.dinner,
      weight: data.helpbar_info.user_weight,
      targetWeight: data.helpbar_info.user_goal_weight,
      });
  })
  .catch(error => {
      console.error('데이터를 불러오는데 실패했습니다.', error);
  });
}, []);

const fetchDataFromServer = async () => {
  try {
  const response = await fetch('http://3.112.14.157:5000/user/planner');
  const data = await response.json();
  
  return data;
  } catch (error) {
  throw new Error('데이터를 불러오는데 실패했습니다.');
  }
};

const weightDifference = userData.targetWeight - userData.weight;
let action = '유지';
if (weightDifference > 0) {
  action = '증량';
} else if (weightDifference < 0) {
  action = '감량';
};

let recommendCalories = userData.basalMetabolic;
if (action === '증량') {
  recommendCalories += 500;
} else if (action === '감량') {
  recommendCalories -= 500;
};

const recCal = Math.round(recommendCalories);

const Percentage = (actual) => {
  const recommended = recCal / 3;
  return Math.min((actual / recommended) * 100, 100);
};

const chartData = [
  {
      name: '아침',
      actual: Percentage(userData.morningCal),
      recommended: 100,
  },
  {
      name: '점심',
      actual: Percentage(userData.morningCal),
      recommended: 100,
  },
  {
      name: '저녁',
      actual: Percentage(userData.morningCal),
      recommended: 100, 
  },
];


return (
  <Container>
  <h2><Logo/></h2>
  <TextBox>
      <div>
      <h1><span>{userData.userName}</span>님,</h1>
      <h3>오늘 {userData.todayCal}kcal 섭취했어요!</h3>
      <h5>남은 칼로리는 {recCal - userData.todayCal}kcal입니다.</h5>
      </div>
  </TextBox>
  <Stats>
      <ResponsiveContainer width="100%" height={250} >
      <BarChart data={chartData} layout="vertical" >
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} />
          <Bar dataKey="recommended" fill="#FFFFFF" radius={10} barSize={20}/>
          <Bar dataKey="actual" fill="#FF9A23" radius={10} barSize={20}/>
      </BarChart>
      </ResponsiveContainer>
  </Stats>
  </Container>
);
};

export default HelpBar;