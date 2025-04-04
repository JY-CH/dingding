import { Song } from '../types/performance';

// 디버깅을 위한 로그
console.log('songs.ts 로드됨');

export const songs: Song[] = [
  {
    id: 1,
    title: "Wonderwall",
    artist: "Oasis",
    difficulty: "medium",
    duration: "4:18",
    thumbnail: "/images/wonderwall.jpg",
    bpm: 82,
    notes: [
      {
        id: 1,
        stringNumber: 6,
        position: 20,
        chord: "Em",
        timing: 0,
        fret: 0,
        isChord: true,
        chordId: 1
      },
      {
        id: 2,
        stringNumber: 5,
        position: 20,
        chord: "Em",
        timing: 0,
        fret: 2,
        isChord: true,
        chordId: 1
      },
      {
        id: 3,
        stringNumber: 4,
        position: 20,
        chord: "Em",
        timing: 0,
        fret: 2,
        isChord: true,
        chordId: 1
      },
      {
        id: 4,
        stringNumber: 3,
        position: 20,
        chord: "Em",
        timing: 0,
        fret: 0,
        isChord: true,
        chordId: 1
      },
      {
        id: 5,
        stringNumber: 2,
        position: 20,
        chord: "Em",
        timing: 0,
        fret: 0,
        isChord: true,
        chordId: 1
      },
      {
        id: 6,
        stringNumber: 1,
        position: 20,
        chord: "Em",
        timing: 0,
        fret: 0,
        isChord: true,
        chordId: 1
      }
    ]
  },
  {
    id: 2,
    title: "Let It Be",
    artist: "The Beatles",
    difficulty: "easy",
    duration: "3:50",
    thumbnail: "/images/letitbe.jpg",
    bpm: 72,
    notes: [
      {
        id: 1,
        stringNumber: 5,
        position: 20,
        chord: "C",
        timing: 0,
        fret: 3,
        isChord: true,
        chordId: 1
      },
      {
        id: 2,
        stringNumber: 4,
        position: 20,
        chord: "C",
        timing: 0,
        fret: 2,
        isChord: true,
        chordId: 1
      },
      {
        id: 3,
        stringNumber: 3,
        position: 20,
        chord: "C",
        timing: 0,
        fret: 0,
        isChord: true,
        chordId: 1
      },
      {
        id: 4,
        stringNumber: 2,
        position: 20,
        chord: "C",
        timing: 0,
        fret: 1,
        isChord: true,
        chordId: 1
      },
      {
        id: 5,
        stringNumber: 1,
        position: 20,
        chord: "C",
        timing: 0,
        fret: 0,
        isChord: true,
        chordId: 1
      }
    ]
  },
  {
    id: 3,
    title: "Nothing Else Matters",
    artist: "Metallica",
    difficulty: "hard",
    duration: "6:28",
    thumbnail: "/images/songs/nothingelsematters.jpg",
    bpm: 140,
    notes: [
      {
        id: 1,
        stringNumber: 6,
        position: 20,
        chord: "Em",
        timing: 0,
        fret: 0,
        isChord: true,
        chordId: 1
      },
      {
        id: 2,
        stringNumber: 5,
        position: 20,
        chord: "Em",
        timing: 0,
        fret: 2,
        isChord: true,
        chordId: 1
      },
      {
        id: 3,
        stringNumber: 4,
        position: 20,
        chord: "Em",
        timing: 0,
        fret: 2,
        isChord: true,
        chordId: 1
      },
      {
        id: 4,
        stringNumber: 3,
        position: 20,
        chord: "Em",
        timing: 0,
        fret: 0,
        isChord: true,
        chordId: 1
      },
      {
        id: 5,
        stringNumber: 2,
        position: 20,
        chord: "Em",
        timing: 0,
        fret: 0,
        isChord: true,
        chordId: 1
      },
      {
        id: 6,
        stringNumber: 1,
        position: 20,
        chord: "Em",
        timing: 0,
        fret: 0,
        isChord: true,
        chordId: 1
      }
    ]
  }
];

// 디버깅을 위한 로그
console.log('songs 데이터:', songs); 