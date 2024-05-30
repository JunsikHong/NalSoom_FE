import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import currentStateReducer from "./currentPositionReducer";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById('root'));
const stateStore = createStore(currentStateReducer);
root.render(
  <React.StrictMode>
    <Provider store={stateStore}>
      <App />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
