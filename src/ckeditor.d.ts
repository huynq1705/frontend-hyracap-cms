declare module "@ckeditor/ckeditor5-react" {
  import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
  import { ComponentType } from "react";

  export const CKEditor: ComponentType<{
    editor: typeof ClassicEditor;
    data?: string;
    onInit?: (editor: any) => void;
    onChange?: (event: any, editor: any) => void;
    onBlur?: (event: any, editor: any) => void;
    onFocus?: (event: any, editor: any) => void;
  }>;
}

declare module "@ckeditor/ckeditor5-build-classic" {
  const ClassicEditor: any;
  export default ClassicEditor;
}
