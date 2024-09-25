import { Box, LinearProgress } from "@mui/material";
import { useState, useEffect, memo } from "react";


const LinearLoading = (): JSX.Element =>  {
    const [progress, setProgress] = useState<number>(0);
  
   useEffect(() => {
        const timer = window.setInterval(() => {
            setProgress((oldProgress) => {
                const remain = 100 - oldProgress;
                const amount = remain / Math.max(remain/2, 30);
                return Math.min(oldProgress + amount, 100);
            });
        }, 200);
  
        return () => {
            clearInterval(timer);
        };
    }, []);
  
    return (
        <Box sx={{ width: '100%' }}>
            <LinearProgress variant="determinate" value={progress} className="rounded" />
        </Box>
    );
  }

export default memo(LinearLoading)