import { SETTABLESTATE, UPDATESTATE } from './tables.types';

export const setTableState = (data) => {
    return {
        type: SETTABLESTATE,
        payload: data
    };
};

export const updateState = (newState, name) => {
    return {
        type: UPDATESTATE,
        payload: {name: name, newState: newState}
    };
};