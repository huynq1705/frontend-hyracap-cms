import React, { useState, useMemo } from "react";
import * as PDFJS from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";

PDFJS.GlobalWorkerOptions.workerSrc =
    "https://unpkg.com/pdfjs-dist@4.9.155/build/pdf.worker.min.mjs";

interface PreviewMultiFileProps {
    files: string[];
}

const PreviewMultiFile: React.FC<PreviewMultiFileProps> = ({ files }) => {
    const [error, setError] = useState<string | null>(null);

    const normalizedFiles = useMemo(() => {
        return Array.isArray(files) ? files : [files];
    }, [files]);

    const renderPDF = async (
        file: string,
        containerRef: React.RefObject<HTMLDivElement>
    ) => {
        try {
            const pdf = await PDFJS.getDocument(file).promise;

            if (containerRef.current) {
                containerRef.current.innerHTML = "";

                for (
                    let pageNumber = 1;
                    pageNumber <= Math.min(pdf.numPages, 3);
                    pageNumber++
                ) {
                    const page = await pdf.getPage(pageNumber);
                    const viewport = page.getViewport({ scale: 1.5 });

                    const canvas = document.createElement("canvas");
                    const context = canvas.getContext("2d");

                    canvas.width = viewport.width;
                    canvas.height = viewport.height;

                    if (context) {
                        const renderContext = {
                            canvasContext: context,
                            viewport,
                        };
                        await page.render(renderContext).promise;
                        containerRef.current.appendChild(canvas);
                    }
                }
            }
        } catch (err) {
            console.error("Error rendering PDF:", err);
            setError("Không thể hiển thị file PDF.");
        }
    };

    const renderImage = (file: string) => (
        <img
            src={file}
            alt="Preview"
            style={{
                maxWidth: "100%",
                maxHeight: "500px",
                objectFit: "contain",
            }}
        />
    );

    const renderDoc = (file: string) => (
        <iframe
            src={`https://docs.google.com/gview?url=${file}&embedded=true`}
            style={{
                width: "100%",
                height: "500px",
                border: "none",
            }}
            title="Document Preview"
        />
    );

    const renderFile = (file: string) => {
        const fileExtension = file.split(".").pop()?.toLowerCase() ?? "";

        if (fileExtension === "pdf") {
            return (
                <div
                    style={{
                        border: "1px solid #ccc",
                        padding: "8px",
                        maxHeight: "500px",
                        overflowY: "scroll",
                    }}
                    ref={(containerRef) =>
                        renderPDF(file, { current: containerRef })
                    }
                ></div>
            );
        }

        if (["jpg", "jpeg", "png", "gif"].includes(fileExtension)) {
            return renderImage(file);
        }

        if (["doc", "docx"].includes(fileExtension)) {
            return renderDoc(file);
        }

        return (
            <p className="text-red-500 text-xs">
                Không thể hiển thị do lỗi file hoặc không đúng định dạng.
            </p>
        );
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {normalizedFiles.map((file, index) => (
                <div key={index}>{renderFile(file)}</div>
            ))}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default PreviewMultiFile;
