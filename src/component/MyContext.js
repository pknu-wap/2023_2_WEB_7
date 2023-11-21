import { createContext, useReducer, useContext } from "react";

const SignupContext = createContext();

const initialState = {
  join1: { id: '', password: ''},
  join2: {name: '', age: '', weight: '', height: '', gender: ''},
  join3: {activity: ''},
  join4: {targetWeight: ''},
};

const SET_INFO = 'SET_INFO';

const reducer = (state, action) => {
  switch (action.type) {
    case SET_INFO:
      return { ...state, [action.step]: action.data};
    default:
      return state;
  }
};

const SignupProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setInfo = (step, data) => {
    dispatch({type: SET_INFO, step, data});
  };

  return (
    <SignupContext.Provider value={{ state, setInfo }}>
      {children}
    </SignupContext.Provider>
  );
};

const useSignupContext = () => {
  const context = useContext(SignupContext);
  if (!context) {
    throw new Error('useSignupContext must be used within a SingupProvider');
  }
  return context;
};

export { SignupProvider, useSignupContext };