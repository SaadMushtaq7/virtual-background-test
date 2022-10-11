import React, { useState } from "react";
import "./App.css";
//import BlurImageBackground from "./components/image/BlurImageBackground";
//import ChangeImageBackground from "./components/image/ChangeImageBackground";
import BlurVideoBackground from "./components/video/BlurVideoBackground";
import ChangeVideoBackground from "./components/video/ChangeVideoBackground";
function App() {
  const [blurCheck, setBlurCheck] = useState<boolean>(false);
  return (
    // <div className="App">
    //   <TestComponent />
    // </div>

    <div className="main-app-container">
      <div>
        {!blurCheck ? (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setBlurCheck(true)}
          >
            Blur Background
          </button>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setBlurCheck(false)}
          >
            Change Background
          </button>
        )}
      </div>
      <div>
        {blurCheck ? <BlurVideoBackground /> : <ChangeVideoBackground />}
      </div>
    </div>
  );
}

export default App;
