import React, { useState, useEffect } from "react";
interface CountdownTimerProps {
  initialMinutes?: number;
  initialSeconds?: number;
  setEndTime: () => void;
}
const CountdownTimer = (props: CountdownTimerProps) => {
  const { initialMinutes = 10, initialSeconds = 0, setEndTime } = props;
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const countdown = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(countdown);
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
      if (!minutes && !seconds) setEndTime();
    }, 1000);

    return () => clearInterval(countdown);
  }, [seconds, minutes]);

  return (
    <div className="text-sm">
      {minutes === 0 && seconds === 0 ? (
        <h1>Time's up!</h1>
      ) : (
        <h1>
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </h1>
      )}
    </div>
  );
};

export default CountdownTimer;
