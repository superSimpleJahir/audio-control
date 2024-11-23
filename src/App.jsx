import AudioPlayerWithWaveform from "./components/AudioPlayerWithWaveform"

import AudioFile from "./assets/jahir.mp4"


function App() {

  return (
    <AudioPlayerWithWaveform audioFile={AudioFile} />
  )
}

export default App
