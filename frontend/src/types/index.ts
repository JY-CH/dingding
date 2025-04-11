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
  articleId: number;
  userId: number;
  username: string;
  userProfile?: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  recommend: number;
  isLike: boolean;
  commentCount: number;
  comments: Comment[];
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
  userProfile?: string;
  content: string;
  createdAt: string;
  updateAt: string;
  isDeleted: boolean;
  comments: Comment[];
}

export interface CommunityListProps {
  post: Post;
}

export interface CommunityPost extends Post {
  popularPost: boolean;
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
