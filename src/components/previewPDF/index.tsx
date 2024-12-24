import React, { useEffect, useMemo, useRef, useState } from "react";
import * as PDFJS from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";

PDFJS.GlobalWorkerOptions.workerSrc =
    "https://unpkg.com/pdfjs-dist@4.9.155/build/pdf.worker.min.mjs";

interface PDFPreviewProps {
    files: string[];
}

const PDFPreview: React.FC<PDFPreviewProps> = ({ files }) => {
    const [error, setError] = useState<string | null>(null);
    const normalizedImageUrl = useMemo(() => {
        return Array.isArray(files) ? files : [files];
    }, [files]);
    console.log("normalizedImageUrl", normalizedImageUrl);
    // const renderPDF = async (
    //     file: string,
    //     canvasRef: React.RefObject<HTMLCanvasElement>
    // ) => {
    //     try {
    //         const pdf = await PDFJS.getDocument(file).promise;
    //         const page = await pdf.getPage(1); // Render trang đầu tiên
    //         const viewport = page.getViewport({ scale: 1.5 });

    //         if (canvasRef.current) {
    //             const canvas = canvasRef.current;
    //             const context = canvas.getContext("2d");
    //             if (context) {
    //                 canvas.width = viewport.width;
    //                 canvas.height = viewport.height;

    //                 const renderContext = {
    //                     canvasContext: context,
    //                     viewport,
    //                 };
    //                 await page.render(renderContext).promise;
    //             }
    //         }
    //     } catch (err) {
    //         console.error("Error rendering PDF:", err);
    //         setError("Không thể hiển thị file PDF.");
    //     }
    // };
    const renderPDF = async (
        file: string,
        containerRef: React.RefObject<HTMLDivElement>
    ) => {
        try {
            const pdf = await PDFJS.getDocument(file).promise;

            if (containerRef.current) {
                containerRef.current.innerHTML = ""; // Xóa nội dung cũ (nếu có)

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
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {normalizedImageUrl.map((file, index) => (
                <div
                    key={index}
                    style={{ border: "1px solid #ccc", padding: "8px" }}
                    ref={(containerRef) =>
                        renderPDF(file, { current: containerRef })
                    }
                >
                    {/* <canvas
                        ref={(canvasRef) =>
                            renderPDF(file, { current: canvasRef })
                        }
                    /> */}
                </div>
            ))}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default PDFPreview;
