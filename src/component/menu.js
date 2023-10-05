import salad from '../salad.png';
import broccoli from '../broccoli.png';
import './menu.css';

function Menu() {
  return (
    <>
      <div id="back-circle">
        <div id="circle1"></div>
        <div id="circle2"></div>
        <img id="salad" src={salad} alt="샐러드" />
        <img id="broccoli" src={broccoli} alt="브로콜리" />
        <div className="container">
          <a className="menu-box" href="#!">
            <div className="image-box">
              <img src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80" alt="냉장고" />
            </div>
            <p>냉장고</p>
          </a>
          <a className="menu-box" href="#!">
            <div className="image-box">
              <img src="https://images.unsplash.com/photo-1529651737248-dad5e287768e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1965&q=80" alt="식단" />
            </div>
            <p>식단</p>
          </a>
          <a className="menu-box" href="#!">
            <div className="image-box">
              <img src="https://images.unsplash.com/photo-1634117622592-114e3024ff27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1925&q=80" alt="리포트" />
            </div>
            <p>리포트</p>
          </a>
          <a className="menu-box" href="#!">
            <div className="image-box">
              <img src="https://images.unsplash.com/photo-1470790376778-a9fbc86d70e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2008&q=80" alt="마이페이지" />
            </div>
            <p>마이페이지</p>
          </a>
        </div>
      </div>
    </>
  )
}

export default Menu;