import styled from "styled-components";
import { useState, useEffect } from "react";
import Logo from "../component/Logo";
import MenuBar from "../component/MenuBar";
import {
  Chart as ChartJS,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

const Body = styled.div`
  margin: 0;
  background-color: #FFFDFA;
  padding: 60px 330px;
  width: 100%;
  height: 100%;

  h2 {
    margin: 50px 0 30px;
    color: #000000;
    font-family: Noto Sans KR;
    font-size: 37px;
    font-weight: 700;
  }

  span {
    font-size: 25px;
    font-weight: 600;
  }
`
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`


function Report() {
  const [userData, setUserData] = useState({
    name: '',
    basalMeta:0,
    weight: 0,
    targetWeight: 0,
  });
  const [dailyData, setDailyData] = useState({
    date: '',
    Carb: 0,
    protein: 0,
    fat: 0,
    kcal: 0,
    currentWeight: 0,
  });
  const [weekData, setWeekData] = useState({
    startDate: '',
    endDate: '',
    carb: 0,
    protein: 0,
    fat: 0,
    kcal: 0,
    recentWeight: 0,
  });
  const [monthData, setMonthData] = useState({
    startDate: '',
    endDate: '',
    carb: 0,
    protein: 0,
    fat: 0,
    kcal: 0,
    recentWeight: 0,
  });

  const options = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  const Data1 = () => {
    const labels = ['일', '월', '화', '수', '목', '금', '토'];
    const datasets = [
      {
        label: '탄수화물',
        data: labels.map(() => Math.floor(Math.random() * 1000)),
        backgroundColor: '#FFA3A3',
      },
      {
        label: '단백질',
        data: labels.map(() => Math.floor(Math.random() * 1000)),
        backgroundColor: '#FFEE95',
      },
      {
        label: '지방',
        data: labels.map(() => Math.floor(Math.random() * 1000)),
        backgroundColor: '#CFDD8C',
      },
    ];
    return { labels, datasets };
  };

  const Data2 = () => {
    const labels = ['1주차', '2주차', '3주차', '4주차'];
    const datasets = [
      {
        label: '탄수화물',
        data: labels.map(() => Math.floor(Math.random() * 1000)),
        backgroundColor: '#FFA3A3',
      },
      {
        label: '단백질',
        data: labels.map(() => Math.floor(Math.random() * 1000)),
        backgroundColor: '#FFEE95',
      },
      {
        label: '지방',
        data: labels.map(() => Math.floor(Math.random() * 1000)),
        backgroundColor: '#CFDD8C',
      },
    ];
    return { labels, datasets };
  };

  const Data3 = () => {
    const labels = ['저저번달','저번달','이번달'];
    const datasets = [
      {
        label: '탄수화물',
        data: labels.map(() => Math.floor(Math.random() * 1000)),
        backgroundColor: '#FFA3A3',
      },
      {
        label: '단백질',
        data: labels.map(() => Math.floor(Math.random() * 1000)),
        backgroundColor: '#FFEE95',
      },
      {
        label: '지방',
        data: labels.map(() => Math.floor(Math.random() * 1000)),
        backgroundColor: '#CFDD8C',
      },
    ];
    return { labels, datasets };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://3.112.14.157:5000/user/report');
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error('서버 응답 실패');
        }
      } catch (error) {
        console.error('데이터 가져오기 실패', error);
      }
    };
    fetchData();
  }, []);


  const daily = Data1();
  const week = Data2();
  const month = Data3();

  return (
    <Body>
      <Header>
        <Logo/>
        <MenuBar/>
      </Header>
      <h2>리포트</h2>
      <span>일간</span>
      <Bar options={options} data={daily} style={{margin:'30px'}}/>
      <span>주간</span>
      <Bar options={options} data={week} style={{margin:'30px'}}/>
      <span>월간</span>
      <Bar options={options} data={month} style={{margin:'30px'}}/>
    </Body>
  );
};

export default Report;