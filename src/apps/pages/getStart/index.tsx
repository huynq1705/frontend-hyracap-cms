import React from "react";

import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "/src/assets/styles/signUp.scss";


import useSignUp from "@/api/useSignUp";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material";
import { PageWelcome } from "./components/PageWelcome";
import { PageType } from "./components/PageType";
import { PagePayment } from "./components/PagePayment";




const GetStart = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const { signUp, isLoading } = useSignUp();
    const [value, setValue] = useState(0);
    const { T, t } = useCustomTranslation();

    const handleFormSubmit = async (values: any) => {
        setLoading(true);
        try {
            const registerPayload = {
                full_name: values.full_name,
                email: values.email,
                user_name: values.username,
                password: values.password,
                phone_number: values.phone_number,
                date_of_birth: values.date_of_birth,
                address: values.address,
                role_id: values.role_id,
            };

            await signUp(registerPayload);
            setLoading(false);
        } catch (e) {
            setLoading(false);
        }
    };


    return (
        <div className="page-register !p-0">
         {value != 0 &&
                <div className="btn-back top-7 left-7" onClick={() => setValue(value - 1)}>
                    <img
                        className="btn-back-image"
                        src="/assets/icons/chevron-left.svg"
                        alt=""
                    />
                </div>
         }
            <SwipeableViews
                axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                index={value}
                onChangeIndex={setValue}
                style={{ height:"100%",width :"100%" }}
            >
                {/* {listTab.map((item) => (item.element))} */}
                <PageWelcome setPage={()=> setValue(value + 1)} />
                <PageType setPage={() => setValue(value + 1)} />
                <PagePayment />
            </SwipeableViews>
             
        </div>
    );
};

export default GetStart;
