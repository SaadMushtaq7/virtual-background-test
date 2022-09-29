import React, { useState } from "react";
import "./App.css";
import BlurImageBackground from "./components/image/BlurImageBackground";
import ChangeImageBackground from "./components/image/ChangeImageBackground";
import BlurVideoBackground from "./components/video/BlurVideoBackground";
import ChangeVideoBackground from "./components/video/ChangeVideoBackground";
function App() {
  const [videoCheck, setVideoCheck] = useState<boolean>(true);
  const [blurCheck, setBlurCheck] = useState<boolean>(true);
  return (
    <div className="App">
      <ChangeVideoBackground />
      {/* {videoCheck ? (
        <button className="blur-btn" onClick={() => setVideoCheck(false)}>
          Image
        </button>
      ) : (
        <button className="blur-btn" onClick={() => setVideoCheck(true)}>
          Video
        </button>
      )}
      {!blurCheck ? (
        <button className="blur-btn" onClick={() => setBlurCheck(true)}>
          Blur Background
        </button>
      ) : (
        <button className="blur-btn" onClick={() => setBlurCheck(false)}>
          Change Background
        </button>
      )}
      {videoCheck ? (
        <>{blurCheck ? <BlurVideoBackground /> : <ChangeVideoBackground />}</>
      ) : (
        <>{blurCheck ? <BlurImageBackground /> : <ChangeImageBackground />}</>
      )} */}
    </div>
  );
}

export default App;
