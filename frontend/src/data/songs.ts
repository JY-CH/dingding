import { Song } from '../types/performance';

// 디버깅을 위한 로그
console.log('songs.ts 로드됨');

// 상세 곡 목록 (노트 포함)
export const songs: Song[] = [
  {
    id: 1,
    songId: 1,
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    difficulty: 'medium',
    duration: '3:23',
    thumbnail: 'https://i.scdn.co/image/ab67616d0000b27301f1d35d045186e5c8c05a50',
    bpm: 120,
    songTitle: 'Blinding Lights',
    songImage: 'https://i.scdn.co/image/ab67616d0000b27301f1d35d045186e5c8c05a50',
    songWriter: 'The Weeknd',
    songSinger: 'The Weeknd',
    songVoiceFileUrl: '',
    releaseDate: '2020-01-01',
    category: 'Pop',
    songDuration: '3:23',
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
    songId: 2,
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    difficulty: 'easy',
    duration: '3:54',
    thumbnail: 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96',
    bpm: 96,
    songTitle: 'Shape of You',
    songImage: 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96',
    songWriter: 'Ed Sheeran',
    songSinger: 'Ed Sheeran',
    songVoiceFileUrl: '',
    releaseDate: '2017-01-06',
    category: 'Pop',
    songDuration: '3:54',
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
    songId: 3,
    title: 'Gurenge',
    artist: 'LiSA',
    difficulty: 'hard',
    duration: '3:59',
    thumbnail: 'https://i.scdn.co/image/ab67616d0000b273293957d62299eda50a3b38e0',
    bpm: 135,
    songTitle: 'Gurenge',
    songImage: 'https://i.scdn.co/image/ab67616d0000b273293957d62299eda50a3b38e0',
    songWriter: 'LiSA',
    songSinger: 'LiSA',
    songVoiceFileUrl: '',
    releaseDate: '2019-04-22',
    category: 'J-Pop',
    songDuration: '3:59',
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

export default songs; 