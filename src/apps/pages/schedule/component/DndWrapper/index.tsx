// DndWrapper.tsx
import React, { ReactNode } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface DndWrapperProps {
    children: ReactNode;
}

const DndWrapper: React.FC<DndWrapperProps> = ({ children }) => (
    <DndProvider backend={HTML5Backend}>{children}</DndProvider>
);

export default DndWrapper;
