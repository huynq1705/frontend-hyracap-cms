import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface UserState {
    userInfo: any | null;
}

const initialState: UserState = {
    userInfo: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserInfo(state, action: PayloadAction<any | null>) {
            state.userInfo = action.payload;
        },
    },
});

export const { setUserInfo } = userSlice.actions;

export default userSlice.reducer;
