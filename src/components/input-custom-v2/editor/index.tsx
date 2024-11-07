import React, { useEffect, useState } from "react";
import { FormControl, FormHelperText, Stack, Box } from "@mui/material";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import apiCommonService from "@/api/apiCommon.service";

interface MyEditorProps {
    label: string;
    required?: string[];
    name: string;
    handleChange: (event: any) => void;
    values: { [key: string]: any };
    errors: string[];
    validate: { [key: string]: string };
    configUI?: {
        [key: string]: string;
    };
    direction?: "row" | "column" | "row-reverse" | "column-reverse";
    [x: string]: any; // This allows any additional props
}

const MyEditor: React.FC<MyEditorProps> = (props: MyEditorProps) => {
    const {
        label,
        required,
        name,
        handleChange,
        values,
        validate,
        errors,
        configUI,
        direction = "column",
        ...prop
    } = props;

    const [editorData, setEditorData] = useState(values[name] || "");

    useEffect(() => {
        setEditorData(values[name] || "");
    }, [values[name]]);

    const width = configUI?.width ? configUI.width : "100%";
    const { uploads } = apiCommonService();
    const handleEditorChange = (event: any, editor: any) => {
        const data = editor.getData();
        setEditorData(data);
        handleChange({ target: { name: name, value: data } });
    };

    const uploadAdapter = (loader: any) => {
        console.log("loader :", loader);
        return {
            upload: async () => {
                const API_URL_IMG = import.meta.env.VITE_APP_URL_IMG;
                try {
                    const file = await loader.file;
                    const response = await uploads([file]);
                    console.log("response :", response);
                    const imageUrl = API_URL_IMG + response[0];
                    return {
                        default: imageUrl,
                    };
                } catch (error) {
                    console.log("error :", error);
                    return Promise.reject(error);
                }
            },
        };
    };

    function MyCustomUploadAdapterPlugin(editor: any) {
        console.log("upload :");
        editor.plugins.get("FileRepository").createUploadAdapter = (
            loader: any
        ) => {
            return uploadAdapter(loader);
        };
    }

    console.log("editorData", editorData);
    return (
        <Stack
            direction={direction}
            sx={{
                width: width,
                height: "fit-content",
            }}
        >
            <label className="label">
                {label}
                {required && required.includes(name) && (
                    <span style={{ color: "red" }}>(*)</span>
                )}
            </label>
            <FormControl
                fullWidth
                variant="outlined"
                size="small"
                sx={{ mt: 1 }}
                error={Boolean(validate[name] && errors.includes(name))}
            >
                <Box sx={{ mb: 2 }}>
                    <CKEditor
                        editor={ClassicEditor}
                        data={editorData}
                        onInit={(editor) => {
                            MyCustomUploadAdapterPlugin(editor); // Cấu hình upload adapter
                        }} // Use onInit here instead of onReady
                        onChange={handleEditorChange}
                    />
                </Box>
                {validate[name] && errors.includes(name) && (
                    <FormHelperText>{validate[name]}</FormHelperText>
                )}
            </FormControl>
        </Stack>
    );
};

export default MyEditor;
