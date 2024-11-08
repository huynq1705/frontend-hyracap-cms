import React, { useCallback, useRef, useState } from "react";
import {
    FormControl,
    FormHelperText,
    Stack,
    Box,
    SelectChangeEvent,
} from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
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
    disabled?: boolean;
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
        disabled,
        ...prop
    } = props;

    const [editorData, setEditorData] = useState(
        values[name] ? values[name] : ""
    );
    React.useEffect(() => {
        setEditorData(values[name]);
    }, [values]);
    const width = configUI?.width ? configUI.width : "100%";
    const reactQuillRef = useRef<ReactQuill>(null);
    const handleEditorChange = (value: any) => {
        setEditorData(value);
        handleChange({ target: { name: name, value: value } });
    };
    const { uploadsImageBlog } = apiCommonService();
    const imageHandler = useCallback(() => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();
        input.onchange = async () => {
            if (input !== null && input.files !== null) {
                const API_URL_IMG = import.meta.env.VITE_APP_URL_IMG;
                const file = input.files[0];
                const response = await uploadsImageBlog([file]);
                const imageUrl = response.data[0].Location;
                const quill = reactQuillRef.current;
                if (quill) {
                    const range = quill.getEditorSelection();
                    range &&
                        quill
                            .getEditor()
                            .insertEmbed(range.index, "image", imageUrl);
                }
            }
        };
    }, []);
    return (
        <Stack
            direction={direction}
            sx={{
                width: width,
                height: "fit-content",
            }}
        >
            <label className="label">
                {label}{" "}
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
                    <ReactQuill
                        ref={reactQuillRef}
                        theme="snow"
                        placeholder="Bắt đầu viết..."
                        modules={{
                            toolbar: {
                                container: [
                                    [
                                        { header: "1" },
                                        { header: "2" },
                                        { font: [] },
                                    ],
                                    [{ size: [] }],
                                    [
                                        "bold",
                                        "italic",
                                        "underline",
                                        "strike",
                                        "blockquote",
                                    ],
                                    [
                                        { list: "ordered" },
                                        { list: "bullet" },
                                        { indent: "-1" },
                                        { indent: "+1" },
                                    ],
                                    [{ align: [] }],
                                    ["link", "image", "video"],
                                    ["code-block"],
                                    ["clean"],
                                    [{ color: [] }],
                                ],
                                handlers: {
                                    image: imageHandler, // <-
                                },
                            },
                            clipboard: {
                                matchVisual: false,
                            },
                        }}
                        formats={[
                            "header",
                            "font",
                            "size",
                            "bold",
                            "italic",
                            "underline",
                            "strike",
                            "blockquote",
                            "list",
                            "bullet",
                            "indent",
                            "link",
                            "image",
                            "video",
                            "code-block",
                            "color",
                            "align",
                        ]}
                        value={editorData}
                        onChange={handleEditorChange}
                        {...prop}
                        readOnly={disabled}
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
