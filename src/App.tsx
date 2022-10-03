import React, { useState } from "react";
//import "./App.css";
//import BlurImageBackground from "./components/image/BlurImageBackground";
//import ChangeImageBackground from "./components/image/ChangeImageBackground";
import BlurVideoBackground from "./components/video/BlurVideoBackground";
import ChangeVideoBackground from "./components/video/ChangeVideoBackground";
function App() {
  const [blurCheck, setBlurCheck] = useState<boolean>(true);
  return (
    <div className="h-screen flex flex-col bg-gray-bg1">
      <div className="flex justify-center items-center my-6">
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
