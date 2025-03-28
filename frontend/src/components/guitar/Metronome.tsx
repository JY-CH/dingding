import React, { useState, useEffect, useRef } from 'react';
import { MetronomeSettings } from '../../types/guitar';

interface MetronomeProps {
  settings: MetronomeSettings;
  onSettingsChange: (settings: MetronomeSettings) => void;
}

const Metronome: React.FC<MetronomeProps> = ({ settings, onSettingsChange }) => {
  const audioContext = useRef<AudioContext | null>(null);
  const nextNoteTime = useRef<number>(0);
  const timerID = useRef<number | null>(null);
  const currentBeat = useRef<number>(0);

  useEffect(() => {
    audioContext.current = new AudioContext();
    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  const scheduleNote = (time: number, isAccented: boolean) => {
    const osc = audioContext.current!.createOscillator();
    const gainNode = audioContext.current!.createGain();

    osc.connect(gainNode);
    gainNode.connect(audioContext.current!.destination);

    osc.frequency.value = isAccented ? 1000 : 800;
    gainNode.gain.value = isAccented ? 1 : 0.5;

    osc.start(time);
    osc.stop(time + 0.1);
  };

  const scheduler = () => {
    while (nextNoteTime.current < audioContext.current!.currentTime + 0.1) {
      const isAccented = currentBeat.current % settings.timeSignature.beats === 0;
      scheduleNote(nextNoteTime.current, isAccented);

      const secondsPerBeat = 60.0 / settings.bpm;
      nextNoteTime.current += secondsPerBeat;
      currentBeat.current = (currentBeat.current + 1) % settings.timeSignature.beats;
    }
    timerID.current = requestAnimationFrame(scheduler);
  };

  useEffect(() => {
    if (settings.isPlaying) {
      audioContext.current?.resume();
      nextNoteTime.current = audioContext.current!.currentTime;
      scheduler();
    } else {
      if (timerID.current) {
        cancelAnimationFrame(timerID.current);
      }
      audioContext.current?.suspend();
    }
  }, [settings.isPlaying]);

  return (
    <div className="bg-white/5 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">메트로놈</h3>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-zinc-400">BPM</label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="40"
              max="208"
              value={settings.bpm}
              onChange={(e) => onSettingsChange({
                ...settings,
                bpm: parseInt(e.target.value)
              })}
              className="flex-1"
            />
            <span className="text-white w-12 text-center">{settings.bpm}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => onSettingsChange({
              ...settings,
              isPlaying: !settings.isPlaying
            })}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              settings.isPlaying
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-amber-500 hover:bg-amber-600 text-white'
            }`}
          >
            {settings.isPlaying ? '중지' : '시작'}
          </button>

          <select
            value={`${settings.timeSignature.beats}/${settings.timeSignature.beatType}`}
            onChange={(e) => {
              const [beats, beatType] = e.target.value.split('/').map(Number);
              onSettingsChange({
                ...settings,
                timeSignature: { beats, beatType }
              });
            }}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
          >
            <option value="4/4">4/4</option>
            <option value="3/4">3/4</option>
            <option value="6/8">6/8</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Metronome; 