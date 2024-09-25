import { AnyAction, configureStore, } from "@reduxjs/toolkit";
import rootReducer, { rootEpic, RootState } from "./rootReducers";
import { createEpicMiddleware } from 'redux-observable';
const epicMiddleware = createEpicMiddleware<AnyAction, AnyAction, RootState>();

const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => [
        ...getDefaultMiddleware({
            thunk: true,
            immutableCheck: false,
            serializableCheck: false
        }),
        epicMiddleware
    ] as any,
});

epicMiddleware.run(rootEpic as any);

export default store;