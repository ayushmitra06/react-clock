import React, { useState, useEffect } from 'react';
import './App.css'; // Optional: Add your custom styling here

const BreakControl = ({ breakLength, incrementBreak, decrementBreak }) => (
  <div className="control">
    <h2 id="break-label">Break Length</h2>
    <button id="break-decrement" onClick={decrementBreak}>-</button>
    <span id="break-length">{breakLength}</span>
    <button id="break-increment" onClick={incrementBreak}>+</button>
  </div>
);

const SessionControl = ({ sessionLength, incrementSession, decrementSession }) => (
  <div className="control">
    <h2 id="session-label">Session Length</h2>
    <button id="session-decrement" onClick={decrementSession}>-</button>
    <span id="session-length">{sessionLength}</span>
    <button id="session-increment" onClick={incrementSession}>+</button>
  </div>
);

const TimerDisplay = ({ timerLabel, timeLeft }) => (
  <div className="timer">
    <h2 id="timer-label">{timerLabel}</h2>
    <div id="time-left">{timeLeft}</div>
  </div>
);

const Controls = ({ isRunning, handleStartStop, handleReset }) => (
  <div className="controls">
    <button id="start_stop" onClick={handleStartStop}>
      {isRunning ? 'Pause' : 'Start'}
    </button>
    <button id="reset" onClick={handleReset}>Reset</button>
  </div>
);

const App = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(1500); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const [intervalId, setIntervalId] = useState(null);

  const decrementTime = () => {
    setTimeLeft(prev => prev - 1);
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const id = setInterval(decrementTime, 1000);
      setIntervalId(id);
    } else if (timeLeft === 0) {
      handleSessionBreakSwitch();
      playBeep();
    }
    return () => clearInterval(intervalId);
  }, [isRunning, timeLeft]);

  const handleSessionBreakSwitch = () => {
    setIsSession(!isSession);
    setTimeLeft(isSession ? breakLength * 60 : sessionLength * 60);
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    clearInterval(intervalId);
    setIsRunning(false);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(1500);
    setIsSession(true);
    resetBeep();
  };

  const playBeep = () => {
    const beep = document.getElementById('beep');
    beep.play();
  };

  const resetBeep = () => {
    const beep = document.getElementById('beep');
    beep.pause();
    beep.currentTime = 0;
  };

  return (
    <div id="app">
      <BreakControl
        breakLength={breakLength}
        incrementBreak={() => setBreakLength(prev => Math.min(prev + 1, 60))}
        decrementBreak={() => setBreakLength(prev => Math.max(prev - 1, 1))}
      />
      <SessionControl
        sessionLength={sessionLength}
        incrementSession={() => setSessionLength(prev => Math.min(prev + 1, 60))}
        decrementSession={() => setSessionLength(prev => Math.max(prev - 1, 1))}
      />
      <TimerDisplay
        timerLabel={isSession ? 'Session' : 'Break'}
        timeLeft={formatTime(timeLeft)}
      />
      <Controls
        isRunning={isRunning}
        handleStartStop={handleStartStop}
        handleReset={handleReset}
      />
      <audio id="beep" src="https://www.soundjay.com/button/beep-07.wav" />
    </div>
  );
};

const formatTime = (time) => {
  let minutes = Math.floor(time / 60);
  let seconds = time % 60;
  return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
};

export default App;
