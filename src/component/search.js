import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import styled from 'styled-components';

function search() {
  const [input, setInput] = useState('');
  const navigate = useNavigate();  // 주소창 넘겨주는 역할

  const serchHandler = (e) => {

  }
  return (
    <input>레시피를 검색하세요.</input>
  )
}