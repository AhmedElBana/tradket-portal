import { UPDATESTATE, SETTABLESTATE } from './tables.types';


const INITIAL_STATE = {};

const reducer = (state = INITIAL_STATE, action) => {
    
    switch (action.type) {
        case SETTABLESTATE:
            let tableState = {};
            tableState[action.payload.name] = {
                path: action.payload.path,
                data: [],
                totalLength: 0,
                pageNumber: 0,
                pageSize: action.payload.table && action.payload.table.setting.default_size ? action.payload.table.setting.default_size : 10,
                pointerRow: action.payload.details ? true : false,
                filters: {
                    filtersMenuOpen: false,
                    filtersStatus: false,
                    currentFilters: {},
                    currentFiltersError: {}
                },
                waiting: true,
                loading: false,
                details_waiting: true,
                selectedRow: false,
                selectedRowData: {},
                selectedRowParentData: {},
                detailsActiveTab: 0
            }
            return {
             ...state, ...tableState,
            };

        case UPDATESTATE:
            let currentState = {...state};
            let newData = action.payload.newState;
            let currentTableState = {...currentState[action.payload.name]};
            for (const [key, value] of Object.entries(newData)) {
                currentTableState[key] = value;
            }
            currentState[action.payload.name] = currentTableState;
            return {
                ...currentState
            };

        default: return state;

    }

};

export default reducer;