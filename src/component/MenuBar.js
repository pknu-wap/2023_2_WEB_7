import { NavLink } from "react-router-dom";
import styled, { css } from "styled-components";
import SearchBar from "./SearchBar";

const Container = styled.div`
  display: flex;
  gap: 65px;
  align-items: center;
  position: absolute;
  top: 64px;
  right: 330px;

  ${(props) =>
      props.search &&
      css`
        right: 180px;
      `}
`
const StyledNavLink = styled(NavLink)`
  color: #000000;
  font-family: Noto Sans KR;
  font-size: 19px;
  font-weight: 400;
  text-decoration: none;

  &.active {
    color: #FF9A23;
  }
`

function MenuBar({showSearchBar = true, ...props}) {
  return (
    <Container {...props}>
      <StyledNavLink to="/planner" activeClassName="active">
        식단
      </StyledNavLink>
      <StyledNavLink to="/refrigerator" activeClassName="active">
        냉장고
      </StyledNavLink>
      <StyledNavLink to="/report" activeClassName="active">
        리포트
      </StyledNavLink>
      <StyledNavLink to="/mypage" activeClassName="active">
        마이페이지
      </StyledNavLink>
      {showSearchBar && <SearchBar menu/>}
    </Container>
  );
};

export default MenuBar;