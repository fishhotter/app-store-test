/*
    import { useMappedState, IStoreState, useDispatch } from "store/store";
    import { useCallback, Memo } from "utils/declare";

    // mapStateToProps
    const { data } = useMappedState(
        useCallback((state: IStoreState) => ({
            data: state.LoginReducer.data
        }), [])
    )

    // mapDispatch
    const dispatch = useDispatch();
    dispatch({ type: CHANGE_LOGIN_INFO, data: res.data})
*/

import { createStore, combineReducers } from "redux";
import { create } from "redux-react-hook";

import * as UI from "./UI/reducer";
import * as APPData from "./APPData/reducer";

export interface IStoreState {
  UiReducer: UI.IUiReducer,
  APPReducer: APPData.IAPPReducer,
}

export const store = createStore(
  combineReducers({ 
    UiReducer: UI.UiReducer,
    APPReducer: APPData.APPReducer,
  })
);

export const { StoreContext, useDispatch, useMappedState } = create<any, any, any>(); 
