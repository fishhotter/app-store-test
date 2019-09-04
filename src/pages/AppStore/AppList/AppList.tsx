// tslint:disable-next-line:no-unused-expression
// @ts-nocheck
import * as React from "react";
import * as ReactDOM from 'react-dom';
import "./AppList.less";

import { ListView } from 'antd-mobile';
import Recommend from "../Recommend/Recommend";
import { useState, useEffect, useCallback } from 'utils/declare';
// import ApiFetch from 'utils/api-fetch';
// import { CHANGE_APP_DATA } from 'store/APPData/reducer';
import { useMappedState, IStoreState } from 'store/store';

// let totalData:any= []
function MyBody(props: any) {
  return (
    <div className="am-list-body my-body">
      <Recommend/>
      {props.children}
    </div>
  );
}

let data = [
  {
    img: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
    title: 'Meet hotel',
    des: '不是所有的兼职汪都需要风吹日晒',
  },
  {
    img: 'https://zos.alipayobjects.com/rmsportal/XmwCzSeJiqpkuMB.png',
    title: 'McDonald\'s invites you',
    des: '不是所有的兼职汪都需要风吹日晒',
  }
];



const NUM_SECTIONS = 10;
const NUM_ROWS_PER_SECTION = 1;
let pageIndex = 0;

const dataBlobs = {};
let sectionIDs: any = [];
let rowIDs: any = [];

function genData(pIndex = 0) {
  for (let i = 0; i < NUM_SECTIONS; i++) {
    const ii = (pIndex * NUM_SECTIONS) + i;
    const sectionName = `Section ${ii}`;
    sectionIDs.push(sectionName);
    dataBlobs[sectionName] = sectionName;
    rowIDs[ii] = [];

    for (let jj = 0; jj < NUM_ROWS_PER_SECTION; jj++) {
      const rowName = `S${ii}, R${jj}`;
      rowIDs[ii].push(rowName);
      dataBlobs[rowName] = rowName;
    }
  }
  sectionIDs = [...sectionIDs];
  rowIDs = [...rowIDs];
}

function AppList(props: any) {
    const { dataList } = useMappedState(
        useCallback((state: IStoreState) => ({
            dataList: state.APPReducer.searchData
        }), [])
      )
      
//   const dispatch = useDispatch();
  // const getSectionData = (dataBlob: any, sectionID: any) => dataBlob[sectionID];
  // const getRowData = (dataBlob: any, sectionID: any, rowID: any) => dataBlob[rowID];
  let lv: any;
  const initDataSource = new ListView.DataSource({
    // getRowData,
    // getSectionHeaderData: getSectionData,
    rowHasChanged: (row1: any, row2: any) => row1 !== row2,
    // sectionHeaderHasChanged: (s1: any, s2: any) => s1 !== s2,
  });
  const [dataSource, setDataSource] = useState(initDataSource)
  const [isLoading, setIsLoading] = useState(true);
  const [height, setHeight] = useState(document.documentElement.clientHeight * 3 / 4)

//   const getTopTen = ()=>{
//     ApiFetch.get("/data/appListData.json").then((res)=>{
//       if(res.feed && res.feed.entry){
//         dispatch({
//           type:CHANGE_APP_DATA,
//           data:res.feed.entry
//         })
//         totalData = res.feed.entry;
//         data = totalData.slice(0,10);
//         // SetTopTenData(res.feed.entry.slice(0,10));
//       }
      
//     })
//   }

  useEffect(() => {
    pageIndex = 0;
    data = dataList.slice(0,10);
    // @ts-ignore
    const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(lv).parentNode.offsetTop;
    setTimeout(() => {
      genData();      
      setDataSource(dataSource.cloneWithRows(data))
      setIsLoading(false);
      setHeight(hei);
    }, 600);
  }, [dataList])

  // If you use redux, the data maybe at props, you need use `componentWillReceiveProps`
  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.dataSource !== this.props.dataSource) {
  //     this.setState({
  //       dataSource: this.state.dataSource.cloneWithRowsAndSections(nextProps.dataSource),
  //     });
  //   }
  // }

  const onEndReached = (event: any) => {
    // load new data
    // hasMore: from backend data, indicates whether it is the last page, here is false
    // @ts-ignore
    if (isLoading && !hasMore) {
      return;
    }
    console.log('reach end', event);
    setIsLoading(true);
    setTimeout(() => {
      pageIndex ++;
      
      data = dataList.slice( 0,(pageIndex + 1) * 10);
      
      genData(pageIndex);
      setDataSource(dataSource.cloneWithRows(data))
      setIsLoading(false);
    }, 1000);
  }

  const getRender = () => {
    // const separator = (sectionID: any, rowID: any) => (
    //   <div
    //     key={`${sectionID}-${rowID}`}
    //     style={{
    //       backgroundColor: '#F5F5F9',
    //       height: 1,
    //       borderTop: '1px solid #ECECED',
    //     }}
    //   />
    // );

    const row = (rowData: any, sectionID: any, rowID: any) => {      
      
      return (
        <div key={rowID} className="row-app">
          <div className="item-row">
            <div className="item-index">{rowData.index}</div>
            <img className="item-pic left" src={rowData["im:image"][2].label} alt="" />
            <div className= "item-info">
                <div className="title">{rowData["im:name"].label}</div>
                <div className="category">{rowData.category.attributes.label}</div>
            </div>
            {/* <div style={{ lineHeight: 1 }}>
              <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>{obj.des}</div>
              <div><span style={{ fontSize: '30px', color: '#FF6E27' }}>35</span>¥ {rowID}</div>
            </div> */}
          </div>
        </div>
      );
    };

    return (
      <ListView
        ref={el => lv = el}
        dataSource={dataSource}
        renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
          {isLoading ? 'Loading...' : 'Loaded'}
        </div>)}
        renderBodyComponent={() => <MyBody />}
        renderRow={row}
        // renderSeparator={separator}
        style={{
          height,
          overflow: 'auto',
        }}
        pageSize={10}
        onScroll={() => { console.log('scroll'); }}
        scrollRenderAheadDistance={500}
        onEndReached={onEndReached}
        onEndReachedThreshold={10}
      />
    );
  }
  return (
    getRender()
  )
}

export default AppList;

