import MyEditor from "@/components/input-custom-v2/editor";
import React, { useState } from "react";
import "../createBlog.scss";
type Props = {
    contentData: string;
    setContentData: (data: string) => void;
    isEditable: boolean;
    hasEror: boolean;
};

const CkEditorCustom = (props: Props) => {
    const { contentData, setContentData, isEditable, hasEror } = props;
    const handleChange = (e: any) => {
        // const { name, value } = e.target;
        setContentData(e.target.value);
    };
    console.log("contentData", contentData);
    return (
        <div className={`dontHaveLabel ${hasEror ? "errorCkEditor" : ""}`}>
            <MyEditor
                disabled={!isEditable}
                label=""
                name="value"
                values={{ value: contentData }}
                errors={[]}
                validate={{}}
                configUI={{}}
                handleChange={handleChange}
            />
        </div>
    );
};

export default CkEditorCustom;
