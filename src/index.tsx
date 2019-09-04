import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import { store, StoreContext } from "./store/store";
import registerServiceWorker from './registerServiceWorker';

import "antd-mobile/dist/antd-mobile.css";
import "./assets/css/reset.css";
import "./assets/css/animate.css";
import { MyLocaleProvider } from "./utils/declare";

// import enUS from 'antd-mobile/lib/locale-provider/en_US'; // For English
const zhCN = undefined;


ReactDOM.render(
  <StoreContext.Provider value={store} >
    <MyLocaleProvider locale={zhCN}><App /></MyLocaleProvider>
  </StoreContext.Provider>, 
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
