export const CHANGE_APP_DATA = "CHANGE_APP_DATA";
export const SEARCH_APP_DATA = "SEARCH_APP_DATA";

interface IChangeAPPInfoAction {
    type: typeof CHANGE_APP_DATA,
    data: any,
}

interface IChangeSearchAction {
    type: typeof SEARCH_APP_DATA,
    searchData: any,
}

interface IAPPState {
    data?: any,
    searchData?:any
}

const defaultState: IAPPState = {
    data: [],
    searchData:[]
}

export type APPActionTypes = IChangeAPPInfoAction | IChangeSearchAction;
export type IAPPReducer = IAPPState;

export const APPReducer = (state: IAPPState = defaultState, action: APPActionTypes): IAPPState => {
    switch (action.type) {
        case CHANGE_APP_DATA:
            return { ...state, ...{ data: action.data } };
        case SEARCH_APP_DATA:
            return { ...state, ...{ searchData: action.searchData } };
        default:
            return state;
    }
} 