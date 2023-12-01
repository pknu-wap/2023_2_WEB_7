import styled from "styled-components";
import MenuBar from "../component/MenuBar";
import CalendarHook from "../component/CalendarHook";
import HelpBar from "../component/HelpBar";
import { subMonths, isToday } from "date-fns";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

const Body = styled.div`
  margin: 0;
  background-color: #FFFDFA;
  width: 100%;
  height: 100%;
`
const Content = styled.div`
  margin-left: 476px;
  padding: 150px 180px 0 150px;
  h3 {
    margin: 0 0 15px 10px;
    color: #000000;
    font-family: Noto Sans KR;
    font-size: 30px;
    font-weight: 600;
  }
`
const Container = styled.div`
  width: 100%;
  height: 675px;
  border-radius: 20px;
  border: 1px solid #F3B04D;
  background-color: #FFFFFF;
  padding: 0 55px;
`
const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  margin-top: 15px;
  color: #000000;
  font-family: Noto Sans KR;
  font-size: 22px;
  font-weight: 500;
`
const PrevMonthButton = styled.button`
  border: none;
  width: 30px;
  height: 30px;
  background-color: #FFF8ED;
  color: #F3B04D;
  font-size: 20px;

  &:hover {
    cursor: pointer;
  }
`
const NextMonthButton = styled.button`
  border: none;
  width: 30px;
  height: 30px;
  background-color: #FFF8ED;
  color: #F3B04D;
  font-size: 20px;

  &:hover {
    cursor: pointer;
  }
`
const DayOfWeek = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-top: 50px;
`
const DayOfWeekLabel = styled.div`
  width: calc((100% - 60px) / 7);
  text-align: center;
  font-size: 18px;
  color: #F3B04D;
`
const DayContainer = styled.div`
  height: 530px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, 1fr);
  margin-top: 20px;
`
const DayButton = styled.div`
  position: relative;
  border: none;
  display: flex;
  justify-content: center;
  // background-color: ${({ isCurrentMonth }) => (isCurrentMonth ? '#FFF8ED' : '#E5E5E5')};
  color: ${({ isCurrentMonth, today }) => isToday(today) ? '#FFD699' : isCurrentMonth ? '#FFF8ED' : '#E5E5E5'};
  color: #000000;
  font-size: 20px;

  &:hover {
    cursor: pointer;
  }
`
const EmojiSticker = styled.span`
  position: absolute;
  top: 27px;
  font-size: 40px;
`
const MealRecord = styled.div`
  display: flex;
  width: 100%;
  height: 675px;
  border-radius: 20px;
  border: 1px solid #F3B04D;
  background-color: #FFFFFF;
  margin-top: 130px;
`
const RecordContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 548px;
  height: 100%;
  border-right: 1px solid #F3B04D;

  h4 {
    color: #000000;
    font-family: Noto Sans KR;
    font-size: 20px;
    font-weight: 500;
    margin: 47px 0 30px;
    text-align: center;
  }
`
const RecordSection = styled.div`
  display: grid;
  grid-template-column: repeat(5, 1fr);
`
const AddRecord = styled.div`
  margin: 47px 0 30px;
  padding: 0 50px;
  width: 547px;
  height: 100%;
  color: #000000;
  font-family: Noto Sans KR;

  h2 {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 30px;
  }
  h4 {
    color: #8F8F8F;
    font-size: 16px;
    font-weight: 500;
    margin: 5px 0 40px;
  }
  p {
    font-size: 17px;
    font-weight: 500;
    margin-bottom: 7px;
  }
  input {
    border: none;
    border-radius: 5px;
    background-color: #EFEFEF;
    width: 426px;
    height: 50px;
    margin-bottom: 45px;
    padding: 0 20px;
    font-size: 16px;
    color: #B9B9B9;
    overflow: auto;
  }
  input: focus {
    outline: none;
  }
`
const Scroll = styled.div`
`
const MealTime = styled.div`
  display: flex;
  flex-direction: column;
  color: #000000;
  font-family: Noto Sans KR;
  padding: 20px 50px 0 50px;
  height: 180px;

  div {
    display: flex;
    width: 100%;
    align-items: center;
  }
  h5 {
    font-size: 18px;
    font-weight: 500;
  }
  h4 {
    font-size: 30px;
    font-weight: 500;
    margin: 0 30px 0 5px;
  }
  h4,h5:hover {
    cursor: pointer;
  }
  table {
    border-collapse: collapse;
    width: 100%;
  }
  tr {
    border-bottom: 1px solid #000000;
    height: 40px;
  }
  td {
    text-align: center;
    font-size: 16px;
    font-weight: 400;
  }
  button {
    border: none;
  }
  button:hover {
    cursor: pointer;
  }
`
const TableContainer = styled.div`
  width: 315px;
  max-height: 300px;
  overflow: auto;
`
const NutInfo = styled.div`
  display: grid;
  grid-template:
    1fr 1fr/
    1fr 1fr;
  color: #B9B9B9;
  font-family: Noto Sansa KR:
  font-size: 18px;
  font-weight:500;

  div {
    position: relative;
  }
  p {
    color: #8F8F8F;
  }
  input {
    width: 203px;
    margin-bottom: 20px;
    padding: 0 60px 0 20px;
    font-size: 16px;
    color: #B9B9B9;
  }
  span {
    position: absolute;
    top: 45px;
    right: 38px;
    color: #B9B9B9;
  }
  input: focus {
    outline: none;
  }
`
const AddButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 426px;
  height: 56px;
  border: none;
  border-radius: 30px;
  font-family: Noto Sans KR;
  font-weight: 500;
  color: #FFFFFF;
  font-family: Noto Sans KR;
  font-size: 20px;
  font-weight: 500;
  background-color: ${(props) => (props.hasText ? '#FF9A23' : '#D9D9D9')};

  &: hover {
    cursor: pointer;
  }
`

const DEFAULT_TRASH_VALUE = 0;
const DAY_LIST = ['일', '월', '화', '수', '목', '금', '토'];


function Planner() {
  const calender = CalendarHook();
  const [userData, setUserData] = useState({});
  const [emojiColor, setEmojiColor] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [newFoodName, setNewFoodName] = useState('');
  const [newFoodCal, setNewFoodCal] = useState('');
  const [newFoodCarbs, setNewFoodCarbs] = useState('');
  const [newFoodProtein, setNewFoodProtein] = useState('');
  const [newFoodFat, setNewFoodFat] = useState('');
  const [clickedDate, setClickedDate] = useState(null);
  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://3.112.14.157:5000/user/planner');
        setUserData(response.data);
      } catch (error) {
        console.error('서버 요청 실패', error);
      }
    };
    fetchUserData();
  }, []);

  const extractNumbers = (str) => {
    const numbers = str.match(/\d+/g);
    return numbers ? Number(numbers[numbers.length - 1]) : null;
  };

  const fetchChatGPT = async (question) => {
    const messages = [
      { role: 'system', content: 'You are a helpful assistant.'},
      { role: 'user', content: `${newFoodName}에 대한 ${question}를 알려줘. 정확하지 않아도 돼. 범위 말고 평균을 하나의 값으로 알려줘. 대답은 숫자로만 해. 명심해 숫자말고 다른 대답은 하지마. 예를 들어 500`}
    ];
    const api_key = process.env.REACT_APP_GPT_KEY;
    const config = {
      headers: {
        Authorization: `Bearer ${api_key}`,
        'Content-Type': 'application/json',
      },
      timeout: 100000,
    }

    const gptData = {
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
      n: 1,
      messages: messages,
    };
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', gptData, config);
      const extractedNumbers = extractNumbers(response.data.choices[0].message.content);
      console.log(extractedNumbers);
      return extractedNumbers;
    } catch (error) {
      console.error('API 호출 실패', error);
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
  
  const fifteenPercent = recommendCalories * 0.15;
  const thirtyPercent = recommendCalories * 0.3;

  const calculateColor = () => {
    if (userData.todayEatCal >= (recommendCalories - fifteenPercent) && userData.todayEatCal <= (recommendCalories + fifteenPercent)) {
      return '🟢';
    } else if (userData.todayEatCal > (recommendCalories + fifteenPercent) && userData.todayEatCal <= ( recommendCalories + thirtyPercent)) {
      return '🟡';
    } else if (userData.todayEatCal > 0) {
      return '🟠';
    } else {
      return '';
    }
  };

  useEffect(() => {
    setEmojiColor(calculateColor());
  }, [userData.todayEatCal]);

  const scrollEndRef = useRef(null);

  const handleDayClick = (dayOfMonth) => {
    if (typeof dayOfMonth === 'number' && dayOfMonth >= 1 && dayOfMonth <= 31) {
      const clickedDate = new Date(calender.currentDate);
      clickedDate.setDate(dayOfMonth);

      setSelectedDate(clickedDate);
      setClickedDate(clickedDate === null ? clickedDate : dayOfMonth);
      setNewFoodName('');
      setNewFoodCal('');
      setNewFoodCarbs('');
      setNewFoodProtein('');
      setNewFoodFat('');

      const updatedClickedDate = new Date(clickedDate);
      updatedClickedDate.setDate(clickedDate.getDate() + 1);
      const formattedDate = updatedClickedDate.toISOString().split('T')[0];
      axios.get(`http://3.112.14.157:5000/user/mealrecords/${formattedDate}`)
        .then(response => {
          setSelectedRecord(response.data);
        })
        .catch(error => {
          console.error('플래너 데이터를 가져오는데 실패했습니다.', error);
        });
    } else {
      console.error('Invalid date:', dayOfMonth);
    }
  };

  const handleMealTimeClick = (mealWhen) => {
    setSelectedMeal(mealWhen);
  };

  useEffect(() => {
    if (selectedDate && scrollEndRef.current) {
      scrollEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedDate]);

  const handleAddRecord = async () => {
    const isInputEmpty = newFoodCal === '' || newFoodCarbs === '' || newFoodProtein === '' || newFoodFat === '';
    let CalResponse, CarbsResponse, ProteinResponse, FatResponse;
    
    if (isInputEmpty) {
      try {
        if (newFoodCal === '') {
          CalResponse = await fetchChatGPT('칼로리 정보');
          setNewFoodCal(CalResponse);
        }
        if (newFoodCarbs === '') {
          CarbsResponse = await fetchChatGPT('탄수화물 정보');
          setNewFoodCarbs(CarbsResponse);
        }
        if (newFoodProtein === '') {
          ProteinResponse = await fetchChatGPT('단백질 정보');
          setNewFoodProtein(ProteinResponse);
        }
        if (newFoodFat === '') {
          FatResponse = await fetchChatGPT('지방 정보');
          setNewFoodFat(FatResponse);
        }
      } catch (error) {
        console.error('챗 GPT API 호출 실패', error);
      }
    }
    const newFood = {
      food_name: newFoodName,
      food_carbo: newFoodCarbs !== '' ? newFoodCarbs : CarbsResponse,
      food_protein: newFoodProtein !== '' ? newFoodProtein : ProteinResponse,
      food_fat: newFoodFat !== '' ? newFoodFat : FatResponse,
      food_kcal: newFoodCal !== '' ? newFoodCal: CalResponse,
    };

    const requestData = {
      meals: [
      {
        mealWhen: 1,
        foods: selectedMeal === 1 ? [...(selectedRecord?.breakfast || []), newFood] : [],
      },
      {
        mealWhen: 2,
        foods: selectedMeal === 2 ? [...(selectedRecord?.lunch || []), newFood] : [],
      },
      {
        mealWhen: 3,
        foods: selectedMeal === 3 ? [...(selectedRecord?.dinner || []), newFood] : [],
      }
      ]
    };

    try {
      const updatedSelectedDate = new Date(selectedDate);
      updatedSelectedDate.setDate(selectedDate.getDate() + 1);
      const formattedDate = updatedSelectedDate.toISOString().split('T')[0];
      const response = await axios.post(`http://3.112.14.157:5000/user/mealrecords/${formattedDate}`, requestData);

      const newRecord = {
        food_name: newFoodName,
        food_carbs: newFoodCarbs,
        food_protein: newFoodProtein,
        food_fat: newFoodFat,
        food_kcal: newFoodCal,
      };

      if (selectedMeal !== null) {
        switch (selectedMeal) {
          case 1:
            setSelectedRecord({
              ...selectedRecord,
              breakfast: [...(selectedRecord?.breakfast || []), newRecord],
            });
            break;
          case 2:
            setSelectedRecord({
              ...selectedRecord,
              lunch: [...(selectedRecord?.lunch || []), newRecord],
            });
            break;
          case 3:
            setSelectedRecord({
              ...selectedRecord,
              dinner: [...(selectedRecord?.dinner || []), newRecord],
            });
            break;
          default:
            break;
        }
      }

      console.log('음식 등록 성공', response.data);

      setNewFoodName('');
      setNewFoodCal('');
      setNewFoodCarbs('');
      setNewFoodProtein('');
      setNewFoodFat('');
    } catch (error) {
      console.error('음식 등록 실패', error);
    }
  };

  const handleRemoveRecord = async (mealWhen, index) => {
    const updatedRecord = { ...selectedRecord };

    switch (mealWhen) {
      case 1:
        updatedRecord.breakfast = updatedRecord.breakfast.filter((_, i) => i !== index);
        break;
      case 2:
        updatedRecord.lunch = updatedRecord.lunch.filter((_, i) => i !== index);
        break;
      case 3:
        updatedRecord.dinner = updatedRecord.dinner.filter((_, i) => i !== index);
        break;
      default:
        return; 
    }
    setSelectedRecord(updatedRecord);

    try {
      const updatedSelectedDate = new Date(selectedDate);
      updatedSelectedDate.setDate(selectedDate.getDate() + 1);
      const formattedDate = updatedSelectedDate.toISOString().split('T')[0];

      const mealUpdateData = {
        meals: [
          { mealWhen: 1, foods: updatedRecord.breakfast },
          { mealWhen: 2, foods: updatedRecord.lunch },
          { mealWhen: 3, foods: updatedRecord.dinner },
        ],
      };


      await axios.post(`/mealrecords/${formattedDate}`, mealUpdateData);
      console.log('음식 삭제 성공');
    } catch (error) {
      console.error('음식 삭제 실패', error);
      setSelectedRecord(selectedRecord);
    }
  };


  return (
    <Body>
      <HelpBar/>
      <Content>
        <MenuBar search/>
        <h3>플래너</h3>
        <Container>
          <Header>
            <PrevMonthButton onClick={() => {calender.setCurrentDate(subMonths(calender.currentDate, 1));}}>&lt;</PrevMonthButton>
            <p>{calender.currentDate.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit'})}</p>
            <NextMonthButton onClick={() => {calender.setCurrentDate(subMonths(calender.currentDate, -1));}}>&gt;</NextMonthButton>
          </Header>
          <DayOfWeek>
            {DAY_LIST.map((day, index) => (
              <DayOfWeekLabel key={index}>{day}</DayOfWeekLabel>
            ))}
          </DayOfWeek>
          <DayContainer rows={calender.weekCalendarList.length}>
            {calender.weekCalendarList.map((week, weekIndex) => (
              week.map((day, dayIndex) => (
                <DayButton 
                  key={`${weekIndex}-${dayIndex}`} 
                  isCurrentMonth={day !== DEFAULT_TRASH_VALUE} 
                  today={isToday(calender.today)}
                  onClick={() => handleDayClick(day)}
                  style={{ color: clickedDate === day ? '#FF9A23' : ''}}
                >
                  {day !== DEFAULT_TRASH_VALUE && (
                    <>
                      {day}
                      <EmojiSticker>{emojiColor}</EmojiSticker>
                    </>
                  )}
                </DayButton>
              ))
            ))}
          </DayContainer>
        </Container>
        {selectedDate && (
          <>
            <MealRecord>
              <RecordContainer>
                <h4>{selectedDate ? selectedDate.toLocaleDateString('ko-KR', {year: 'numeric', month: '2-digit', day: '2-digit' }) : '날짜를 선택해주세요.'}</h4>
                  <MealTime>
                    <div>
                      <h5 onClick={() => handleMealTimeClick(1)} style={{color: selectedMeal === 1 ? '#FF9A23':''}}>아침</h5>
                      <h4 onClick={() => handleMealTimeClick(1)} style={{color: selectedMeal === 1 ? '#FF9A23':''}}>+</h4>  
                    </div>
                    <TableContainer>
                      <table>
                        <tr>
                          <td>음식 이름</td>
                          <td>탄수화물</td>
                          <td>단백질</td>
                          <td>지방</td>
                          <td>열량</td>
                        </tr> 
                        {selectedRecord && selectedRecord.breakfast && selectedRecord.breakfast.map((record, index) => (
                          <tr key={`breakfast-${index}`}>
                            <td>{record.food_name}</td>
                            <td>{record.food_carbo}</td>
                            <td>{record.food_protein}</td>
                            <td>{record.food_fat}</td>
                            <td>{record.food_kcal}</td>
                            <td>
                              <button onClick={() => handleRemoveRecord(1, index)}>X</button>
                            </td>
                          </tr>
                          ))}
                      </table>
                    </TableContainer>
                  </MealTime>
                  <MealTime>
                    <div>
                      <h5 onClick={() => handleMealTimeClick(2)} style={{color: selectedMeal === 2 ? '#FF9A23':''}}>점심</h5>
                      <h4 onClick={() => handleMealTimeClick(2)} style={{color: selectedMeal === 2 ? '#FF9A23':''}}>+</h4>
                    </div>
                    <table>
                      <tr>
                        <td>음식 이름</td>
                        <td>탄수화물</td>
                        <td>단백질</td>
                        <td>지방</td>
                        <td>열량</td>
                      </tr> 
                      {selectedRecord && selectedRecord.lunch && selectedRecord.lunch.map((record, index) => (
                        <tr key={`lunch-${index}`}>
                          <td>{record.food_name}</td>
                          <td>{record.food_carbo}</td>
                          <td>{record.food_protein}</td>
                          <td>{record.food_fat}</td>
                          <td>{record.food_kcal}</td>
                          <td>
                            <button onClick={() => handleRemoveRecord(2, index)}>X</button>
                          </td>
                        </tr>
                        ))}
                    </table>
                  </MealTime>
                  <MealTime>
                    <div>
                      <h5 onClick={() => handleMealTimeClick(3)} style={{color: selectedMeal === 3 ? '#FF9A23':''}}>저녁</h5>
                      <h4 onClick={() => handleMealTimeClick(3)} style={{color: selectedMeal === 3 ? '#FF9A23':''}}>+</h4>
                    </div>
                    <table>
                      <tr>
                        <td>음식 이름</td>
                        <td>탄수화물</td>
                        <td>단백질</td>
                        <td>지방</td>
                        <td>열량</td>
                      </tr> 
                      {selectedRecord && selectedRecord.dinner && selectedRecord.dinner.map((record, index) => (
                        <tr key={`dinner-${index}`}>
                          <td>{record.food_name}</td>
                          <td>{record.food_carbo}</td>
                          <td>{record.food_protein}</td>
                          <td>{record.food_fat}</td>
                          <td>{record.food_kcal}</td>
                          <td>
                            <button onClick={() => handleRemoveRecord(3, index)}>X</button>
                          </td>
                        </tr>
                        ))}
                    </table>
                  </MealTime>
              </RecordContainer>
              <AddRecord>
                  <h2>오늘 먹은 식단을 기록해보세요!</h2>
                  <p>음식 이름 <span style={{color: '#FF9A23'}}>(필수)</span></p>
                  <input 
                    value={newFoodName}
                    onChange={(e) => setNewFoodName(e.target.value)}
                    placeholder="음식 이름"
                  />
                  <p style={{marginBottom: '30px'}}>영양정보 <span style={{color: '#8F8F8F'}}>(선택)</span></p>
                  <NutInfo>
                    <div>
                      <p>칼로리</p>
                      <input
                        value={newFoodCal}
                        onChange={(e) => setNewFoodCal(e.target.value)}
                        placeholder="0"
                      />
                      <span>kcal</span>
                    </div>
                    <div>
                      <p>탄수화물</p>
                      <input 
                        value={newFoodCarbs}
                        onChange={(e) => setNewFoodCarbs(e.target.value)}
                        placeholder="0"
                      />
                      <span>g</span>
                    </div>
                    <div>
                      <p>단백질</p>
                      <input 
                        value={newFoodProtein}
                        onChange={(e) => setNewFoodProtein(e.target.value)}
                        placeholder="0"
                      />
                      <span>g</span>
                    </div>
                    <div>
                      <p>지방</p>
                      <input 
                        value={newFoodFat}
                        onChange={(e) => setNewFoodFat(e.target.value)}
                        placeholder="0"
                      />
                      <span>g</span>
                    </div>
                  </NutInfo>
                  <h4>*입력하지 않은 영양정보는 잇플리가 추정값으로 대신해요<br/>계산이 끝날 때까지 잠시만 기다려주세요!</h4>
                  <AddButton hasText={newFoodName.length > 0} onClick={handleAddRecord}>추가하기</AddButton>
              </AddRecord>
            </MealRecord>
            <Scroll ref={scrollEndRef}></Scroll>
          </>
        )}
      </Content>
    </Body>
  );
};

export default Planner;