import * as React from "react";

import "./Recommend.less";
import { useMappedState, IStoreState } from "store/store";
import {useCallback,useState,useEffect } from "utils/declare";
// const defaultProps: IProps = {
//   title: "黑臭水体详情",
//   tips: "数据来源  全国城市黑臭水体发布平台"
// }


function Recommend(props:any):JSX.Element {
    
  const { data } = useMappedState(
    useCallback((state: IStoreState) => ({
        data: state.APPReducer.searchData
    }), [])
  )

  const [topTenData, SetTopTenData] = useState([])

  useEffect(() => {      
    const arr = data.slice(0,10);
    SetTopTenData(arr)
  }, [data])
    
  return (
        <div className="scroll-container">
          <div className="recommendation">
            <div className="title">
              推介
            </div>
            <div className="section-container">
              <div className="wrap-scroll-x" style ={{width:`${topTenData.length * .65}rem` }} >
                {
                  topTenData.length && topTenData.map((item: any) =>
                    // tslint:disable-next-line:no-unused-expression
                    // tslint:disable-next-line:jsx-key
                    <div className="section-item" key={item.id.label} >
                      <img className="section-image" src={item["im:image"][2].label} alt="" />
                      <div className="pic-name">{item["im:name"].label}</div>
                      <div className="pic-category">{item.category.attributes.label}</div>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>
  )
}

export default Recommend;
