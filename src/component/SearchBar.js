import { BiSearch } from 'react-icons/bi';
import styled, { css } from 'styled-components';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

const Click = styled.div`
  width: 50px;
  height: 50px;
  position: absolute;
  top: 15px;
  right: 22px;
  color: #6A3900;
  width: 34.17px;
  height: 30px;

  &:hover {
    cursor: pointer;
  }
`

const Container = styled.div`
  display: inline-block;

  ${(props) =>
      props.home &&
      css`
        display: inline-block;

        fieldset {
          display: flex;
          justify-content: center;
          position: relative;
          border: 0 none;
          margin: 0;
          padding: 0;
        }
        input {
          padding: 18px 65px 18px 35px;
          background-color: #FFFFFF;
          border-radius: 50px;
          color: #6A3900;
          font-family: Noto Sans KR;
          font-size: 20px;
          font-style: normal;
          font-weight: 500;
          overflow: auto;
          width: 388px;
          height: 59px;
        }
        svg {
          // position: absolute;
          // top: 15px;
          // right: 22px;
          color: #6A3900;
          width: 34.17px;
          height: 30px;
        }
      `}
`


function SearchBar({...props}) {
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const handleSVGClick = async () => {
    try {
      const response = await fetch('/search', {
        method: 'POST',
        body: JSON.stringify({ data: inputValue }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        navigate(`/search/${inputValue}`);
      } else {
        console.error('서버 요청 실패');
      }
    } catch (error) {
      console.error('오류 발생', error);
    }
  };

  const handleEnterPress = (e) => {
    if (e.key === 'Enter') {
      handleSVGClick();
    }
  };

  return (
    <Container {...props}>
      <fieldset>
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyUp={handleEnterPress}
          placeholder="레시피 검색"
        />
        <Click onClick={handleSVGClick}>
          <BiSearch onClick={handleSVGClick}/>
        </Click>
      </fieldset>
    </Container>  
  );
};

export default SearchBar;