import * as React from 'react';
import { useDispatch } from "./store/store";
import { CHANGE_ROOT_FONT } from "./store/UI/reducer";
import { useEffect, Switch, Route, BrowserRouter} from "./utils/declare";

import "./assets/css/App.less";

import AppStore from "pages/AppStore/AppStore";
// import ListContainer from 'pages/AppStore/demo';

interface IAppProps {
  [extra: string]: any
}

const pxHeight = 667;
const pxWidth = 375;
const rootFontSizeRate = 100;

function App(props: IAppProps): JSX.Element {
  let timer: any;
  let rootDom: HTMLElement;
  const dispatch = useDispatch();

  const setHtmlFontSize = () => {
    const html = document.documentElement;
    const height = html.clientHeight;
    let bodyWidth = html.clientWidth;
    let bodyHeight = bodyWidth * (pxHeight / pxWidth);
    if (bodyHeight > height) {
      bodyHeight = html.clientHeight
      bodyWidth = height / (pxHeight / pxWidth)
    }
    const fontSize = rootFontSizeRate * (bodyWidth / pxWidth);
    html.style.fontSize = `${fontSize}px`;
    if (!rootDom) { rootDom = document.querySelector("#root") as HTMLElement; }
    if (rootDom) { rootDom.style.minHeight = `${bodyHeight}px`; }
    dispatch({ type: CHANGE_ROOT_FONT, value: fontSize, height: `${height}px`});
  }

  const handleOnResize = () => {
    if (timer) { clearTimeout(timer); }
    timer = setTimeout(() => {
      setHtmlFontSize();
      clearTimeout(timer);
    }, 100);
  }

  window.onresize = handleOnResize;

  useEffect(() => { 
    setHtmlFontSize();
    rootDom = document.querySelector("#root") as HTMLElement; 
  }, []);

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact={true} component={AppStore} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
