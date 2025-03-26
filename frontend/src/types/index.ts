// 예시 사용자 타입
export interface User {
    id: string;
    name: string;
    email: string;
  }
  
  // 기타 필요한 타입 정의
  export interface ThingItem {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
  }

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  audio: string;
  duration: number;
  plays: number;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  cover: string;
  songs: Song[];
}

export interface Artist {
  id: string;
  name: string;
  image: string;
  followers: number;
  genres: string[];
}

export interface Category {
  id: string;
  title: string;
  cover: string;
  color: string;
  count: number;
}