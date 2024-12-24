import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type PageState = {
    logo: {
        min: string | null;
        max: string | null
    }
};

const initialState: PageState = {
    logo: {
        min : null,
        max : null
    }
};

const logoSlice = createSlice({
    name: "logo",
    initialState,
    reducers: {
        setLogo(state, action: PayloadAction<any>) {
            state.logo = action.payload;
        },
    },
});
export const { setLogo } = logoSlice.actions;

export default logoSlice.reducer;
