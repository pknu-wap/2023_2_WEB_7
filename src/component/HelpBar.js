import Logo from "./Logo";
import { useState, useEffect} from 'react';
import { Bar } from "react-chartjs-2"; 
import styled from "styled-components";

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
`

function HelpBar() {
  const [chartData, setChartData] = useState(null);
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
          userName: data.username,
          todayCal: data.todayCal,
          basalMetabolic: data.basalMetabolic,
          morningCal: data.morningCal,
          lunchCal: data.lunchCal,
          dinnerCal: data.dinnerCal,
          weight: data.weight,
          targetWeight: data.targetWeight,
        });
        setChartData({
          labels: ['아침', '점심', '저녁'],
          datasets: [
            {
              label: '아침',
              backgroundColor: 'rgba(75, 192, 192, 0.4)',
              borderColor: 'rgba(75,192,192,1)',
              borderWidth: 1,
              hoverBackgroundColor: 'rgba(75,192,192,0.6)',
              hoverBorderColor: 'rgba(75,192,192,1)',
              data: [data.morningCal],
            },
            {
              label: '점심',
              backgroundColor: 'rgba(255, 205, 86, 0.4)',
              borderColor: 'rgba(255, 205, 86, 1)',
              borderWidth: 1,
              hoverBackgroundColor: 'rgba(255, 205, 86, 0.6)',
              hoverBorderColor: 'rgba(255, 205, 86, 1)',
              data: [data.lunchCal],
            },
            {
              label: '저녁',
              backgroundColor: 'rgba(255, 99, 132, 0.4)',
              borderColor: 'rgba(255,99,132,1)',
              borderWidth: 1,
              hoverBackgroundColor: 'rgba(255,99,132,0.6)',
              hoverBorderColor: 'rgba(255,99,132,1)',
              data: [data.dinnerCal],
            },
          ],
        });
      })
      .catch(error => {
        console.error('데이터를 불러오는데 실패했습니다.', error);
      });
  }, []);

  const fetchDataFromServer = async () => {
    try {
      const response = await fetch('/your-server-endpoint');
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

  let recommendCalories = userData.basalMetabolism;
  if (action === '증량') {
    recommendCalories += 500;
  } else if (action === '감량') {
    recommendCalories -= 500;
  };

  return (
    <Container>
      <h2><Logo/></h2>
      <TextBox>
        <div>
          <h1><span>{userData.userName}</span>님,</h1>
          <h3>오늘 {userData.todayCal}kcal 섭취했어요!</h3>
          <h5>남은 칼로리는 {recommendCalories - userData.todayCal}kcal입니다.</h5>
        </div>
      </TextBox>
      <Stats>
        {chartData && (
          <Bar
            data={chartData}
            options={{
              scales: {
                x: {beginAtZero: true},
                y: {beginAtZero: true, max: userData.recommendCalories / 3},
              },
            }}
          />
        )}
      </Stats>
    </Container>
  );
};

export default HelpBar;