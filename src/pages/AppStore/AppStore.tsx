import * as React from "react";
import { IProps } from "./AppStore.d";

import "./AppStore.less";
import { MySearchBar, useEffect, useCallback } from 'utils/declare';
import ApiFetch from 'utils/api-fetch';
import { useDispatch, useMappedState, IStoreState } from 'store/store';
import { CHANGE_APP_DATA, SEARCH_APP_DATA } from 'store/APPData/reducer';
import AppList from "./AppList/AppList";

// const defaultProps: IProps = {
//   title: "黑臭水体详情",
//   tips: "数据来源  全国城市黑臭水体发布平台"
// }

function AppStore(propsIn: IProps): JSX.Element {
  const { data } = useMappedState(
    useCallback((state: IStoreState) => ({
        data: state.APPReducer.data
    }), [])
  )
  const { searchData } = useMappedState(
    useCallback((state: IStoreState) => ({
      searchData: state.APPReducer.searchData
    }), [])
  )
  const dispatch = useDispatch();
  // const [topTenData, SetTopTenData] = useState([])
  useEffect(() => {
    getTopTen()
  }, [])

  const getTopTen = () => {
    ApiFetch.get("/data/appListData.json").then((res) => {
      if (res.feed && res.feed.entry) {
        // tslint:disable-next-line:no-unused-expression
        res.feed.entry.length && res.feed.entry.map((item:any,index:number)=>
          item.index = index + 1
        )
        dispatch({
          type: CHANGE_APP_DATA,
          data: [...res.feed.entry]
        })
        dispatch({
          type: SEARCH_APP_DATA,
          searchData: [...res.feed.entry]
        })
        // SetTopTenData(res.feed.entry.slice(0, 10));
      }

    })
  }

  const searchList = (value:string)=>{
    handleData(value);
  }

  const handleData = (value:string)=>{
    if(value ===""){
      data.map((item:any,index:number)=>
          item.index = index + 1
        )
      dispatch({
        type: SEARCH_APP_DATA,
        searchData: data
      })
    }else{
      if(data.length){
        const newArr = data.filter((item:any)=>{
              // if(item["im:name"].label.indexOf(value)){
              //   return true;
              // }      
              return item["im:name"].label.indexOf(value) > -1 || item.category.attributes.label.indexOf(value) > -1 || item["im:artist"].label.indexOf(value) > -1 || item.summary.label.indexOf(value) > -1
          }
        )
        newArr.map((item:any,index:number)=>
          item.index = index + 1
        )
        dispatch({
          type: SEARCH_APP_DATA,
          searchData: newArr
        })
      }
    }
    
  }


  return (
    <div className="app-container">
      <MySearchBar 
      placeholder="搜索" 
      maxLength={8}  
      onChange={searchList}
      />
     {searchData.length?<AppList/>:
      <div className="no-data">暂无数据</div>
    }
    </div>
  )
}

export default AppStore;
