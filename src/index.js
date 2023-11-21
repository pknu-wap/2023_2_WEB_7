import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SignupProvider } from './component/MyContext';
import App from './App';
import './index.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <SignupProvider>
      <App/>
    </SignupProvider>
  </BrowserRouter>
);

