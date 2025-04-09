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
export interface Post {
  articleId: number; // Int
  userId: number; // Int
  username: string; // String
  title: string; // String
  createdAt: string; // Date (ISO 형식 문자열)
  updatedAt: string;
  category: string; // String
  popularPost: boolean; // Boolean
  recommend: number; // Int
  isLike: boolean; // Boolean
}

export interface NestedComment {
  commentId: number;
  id: number;
  username: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  commentId2: number;
}

export interface Comment {
  commentId: number;
  userId: number;
  username: string;
  content: string;
  createdAt: string;
  updateAt: string;
  userProfile: string;
  isDeleted: boolean;
  comments: Comment[]; // 대댓글
}

export interface CommunityListProps {
  post: Post;
}

export interface CommunityPost {
  articleId: number;
  userId: number;
  username: string;
  title: string;
  createdAt: string;
  content?: string;
  category?: string;
  isLike?: boolean;
  recommend?: number;
  popularPost?: boolean;
}

export interface SearchCommunityPost {
  articleId: number;
  username: string;
  title: string;
  createdAt: string; // Date 객체로 변환할 수도 있음
  category: string;
  popularPost: boolean;
  recommend: number;
}

export interface SearchSong {
  songId: string;
  songTitle: string;
  songImage: string;
  songWriter: string;
  songSinger: string;
  songVoiceFileUrl: string;
  releaseDate: string;
  category: string;
  songDuration: string;
}
