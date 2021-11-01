import { combineReducers } from 'redux';
import tablesReducer from './Tables/tables.reducer';

    const rootReducer = combineReducers({
        tables: tablesReducer,
    });

export default rootReducer;