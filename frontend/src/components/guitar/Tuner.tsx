// import React, { useState, useRef } from 'react';

// import { TunerData } from '../../types/guitar';

// const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
// const GUITAR_STRINGS = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'];

// const Tuner: React.FC = () => {
//   const [tunerData, setTunerData] = useState<TunerData>({
//     note: '',
//     frequency: 0,
//     cents: 0,
//     isInTune: false,
//   });

//   const audioContext = useRef<AudioContext | null>(null);
//   const analyser = useRef<AnalyserNode | null>(null);
//   const mediaStreamSource = useRef<MediaStreamAudioSourceNode | null>(null);

//   const startTuner = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       audioContext.current = new AudioContext();
//       analyser.current = audioContext.current.createAnalyser();
//       mediaStreamSource.current = audioContext.current.createMediaStreamSource(stream);

//       mediaStreamSource.current.connect(analyser.current);
//       analyser.current.fftSize = 2048;

//       detectPitch();
//     } catch (error) {
//       console.error('Error accessing microphone:', error);
//     }
//   };

//   const detectPitch = () => {
//     if (!analyser.current) return;

//     const bufferLength = analyser.current.frequencyBinCount;
//     const dataArray = new Float32Array(bufferLength);
//     analyser.current.getFloatTimeDomainData(dataArray);

//     const ac = autoCorrelate(dataArray, audioContext.current!.sampleRate);
//     if (ac !== -1) {
//       const note = noteFromPitch(ac);
//       const cents = centsOffFromPitch(ac, note);

//       setTunerData({
//         note: NOTES[note % 12],
//         frequency: ac,
//         cents: cents,
//         isInTune: Math.abs(cents) < 5,
//       });
//     }

//     requestAnimationFrame(detectPitch);
//   };

//   // 자동 상관 함수로 피치 감지
//   const autoCorrelate = (buffer: Float32Array, sampleRate: number): number => {
//     // 피치 감지 알고리즘 구현
//     // ... (실제 구현은 복잡하므로 생략)
//     return 440; // 예시 값
//   };

//   const noteFromPitch = (frequency: number): number => {
//     const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
//     return Math.round(noteNum) + 69;
//   };

//   const centsOffFromPitch = (frequency: number, note: number): number => {
//     return Math.floor(
//       (1200 * Math.log(frequency / (440 * Math.pow(2, (note - 69) / 12)))) / Math.log(2),
//     );
//   };

//   return (
//     <div className="bg-white/5 rounded-xl p-6">
//       <h3 className="text-lg font-semibold text-white mb-4">튜너</h3>

//       <div className="text-center">
//         <div className="text-6xl font-bold mb-4">
//           <span className={tunerData.isInTune ? 'text-green-500' : 'text-white'}>
//             {tunerData.note || '-'}
//           </span>
//         </div>

//         <div className="relative h-4 bg-white/10 rounded-full mb-4">
//           <div
//             className="absolute h-full bg-gradient-to-r from-red-500 via-green-500 to-red-500 rounded-full transition-all duration-100"
//             style={{
//               left: '50%',
//               width: '4px',
//               transform: `translateX(${tunerData.cents * 2}px)`,
//             }}
//           />
//         </div>

//         <div className="text-sm text-zinc-400">{tunerData.frequency.toFixed(1)} Hz</div>

//         <div className="grid grid-cols-6 gap-2 mt-6">
//           {GUITAR_STRINGS.map((string) => (
//             <button
//               key={string}
//               className="px-3 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
//             >
//               {string}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Tuner;
