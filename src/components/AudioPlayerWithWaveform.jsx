/* eslint-disable react/prop-types */
import { useRef, useEffect, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa6";
import { FaVolumeUp } from "react-icons/fa";
import { FaVolumeDown } from "react-icons/fa";
import { IoMdVolumeOff } from "react-icons/io";

const formWaveSurferOptions = (ref) => ({
  container: ref,
  waveColor: "#ccc",
  progressColor: "#0178ff",
  responsive: true,
  height: 80,
  normalize: true,
  backend: 'webAudio',
  braWidth: 2,
  barGap: 3,
})

// const formWaveSurferOptions = (ref) => ({
//   container: ref,
//   waveColor: "#CECFD2",
//   progressColor: "#000",
//   responsive: true,
//   height: 50,
//   normalize: true,
//   backend: "webAudio",
//   barWidth: 3,
//   barGap: 4,
//   barRadius: 10,
// });

const formatTime = (seconds) => {
  let date = new Date(0);
  date.setSeconds(seconds);
  return date.toISOString().substr(11, 8);
};

const AudioPlayerWithWaveform = ({ audioFile }) => {
  const waveFormRef = useRef(null);
  const waveSurferRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioFileName, setAudioFileName] = useState("");

  useEffect(() => {
    const options = formWaveSurferOptions(waveFormRef.current);
    waveSurferRef.current = WaveSurfer.create(options);

    waveSurferRef.current.load(audioFile);

    waveSurferRef.current.on('ready', () => {
      setVolume(waveSurferRef.current.getVolume());
      setDuration(waveSurferRef.current.getDuration());
      setAudioFileName(audioFile.split("/").pop());
    });

    waveSurferRef.current.on('audioprocess', () => {
      setCurrentTime(waveSurferRef.current.getCurrentTime());
    })

    return () => {
      waveSurferRef.current.un("audioprocess");
      waveSurferRef.current.un("ready");
      waveSurferRef.current.destroy();
    }
  }, [audioFile]);

  const handlePlayPause = () => {
    setPlaying(!playing);
    waveSurferRef.current.playPause();
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    waveSurferRef.current.setVolume(newVolume);
    setMuted(newVolume === 0);
  };

  const handleMute = () => {
    setMuted(!muted);
    waveSurferRef.current.setVolume(muted ? volume : 0);
  };

  const handleVolumeUp = () => {
    handleVolumeChange(Math.min(volume + 0.1, 1));
  };
  const handleVolumeDown = () => {
    handleVolumeChange(Math.max(volume - 0.1, 0));
  };

  return (
    <>
      <div id="waveform" className="" ref={waveFormRef} style={{ width: "100%" }}>
        <div className="controls">
          <button onClick={handlePlayPause}>
            {
              playing ? (
                <FaPause />
              ) : (
                <FaPlay />
              )
            }
          </button>

          <button onClick={handleMute}>
            {
              muted ? (
                <IoMdVolumeOff />
              ) : (
                <FaVolumeDown />
              )
            }
          </button>

          <input type="range" min={0} max={1} step={0.05} value={muted ? 0 : volume} name="volume" id="volume"
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          />

          <button onClick={handleVolumeDown}>
            <FaVolumeDown />
          </button>

          <button onClick={handleVolumeUp}>
            <FaVolumeUp />
          </button>
        </div>

        <div className="audio-info">
          <span> Playing: {audioFileName} <br /> </span>

          <span>
            Duration: {formatTime(duration)} | Current Time: {formatTime(currentTime)} <br />
          </span>

          <span>Volume: {Math.round(volume * 100)}%</span>
        </div>

      </div>
    </>
  );
};

export default AudioPlayerWithWaveform;
