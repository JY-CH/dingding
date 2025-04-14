import { useState, useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { HiOutlinePencilAlt, HiOutlineUserGroup, HiOutlineChat, HiOutlineLightBulb, HiOutlineMusicNote, HiOutlineAcademicCap } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

import { _axiosAuth } from '@/services/JYapi';
import { Post } from '@/types/index';

import { CommunityCreate } from '../components/community/CommunityCreate';
import { CommunityDetail } from '../components/community/CommunityDetail';
import { CommunityList } from '../components/community/CommunityList';

type CommunityResponse = Post[];

export const CommunityPage: React.FC = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const postsPerPage = 8;
  const location = useLocation();

  const categories = [
    { 
      id: 'all', 
      name: '전체 보기', 
      icon: <HiOutlineUserGroup className="w-5 h-5" />,
      description: '모든 게시물을 확인해보세요'
    },
    { 
      id: 'practice', 
      name: '연습 일지', 
      icon: <HiOutlineMusicNote className="w-5 h-5" />,
      description: '나만의 연습 경험을 공유해요'
    },
    { 
      id: 'tips', 
      name: '연주 팁', 
      icon: <HiOutlineLightBulb className="w-5 h-5" />,
      description: '실력 향상을 위한 꿀팁'
    },
    { 
      id: 'question', 
      name: '질문하기', 
      icon: <HiOutlineChat className="w-5 h-5" />,
      description: '궁금한 점을 물어보세요'
    },
    { 
      id: 'study', 
      name: '스터디', 
      icon: <HiOutlineAcademicCap className="w-5 h-5" />,
      description: '함께 성장하는 스터디'
    }
  ];

  useEffect(() => {
    if (location.state?.articleId) {
      setSelectedPost(location.state.articleId);
    }
  }, [location.state]);

  const { data: posts = [],  } = useQuery<CommunityResponse, Error>({
    queryKey: ['articles'],
    queryFn: async () => {
      try {
        const { data } = await _axiosAuth.get<CommunityResponse>('/article');
        return data;
      } catch (err) {
        console.error('게시물 가져오기 오류:', err);
        throw err;
      }
    },
    staleTime: 0,
  });

  const filteredPosts = posts
    .filter(post => 
      selectedCategory === 'all' || post.category.toLowerCase() === selectedCategory
    )
    .filter(post =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice().reverse().slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handleCancelCreate = () => {
    setShowCreate(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 pb-32">
        <AnimatePresence mode="wait">
          {selectedPost !== null ? (
            <CommunityDetail
              articleId={selectedPost}
              setSelectedPost={setSelectedPost}
              posts={posts.slice().reverse()}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* 헤더 섹션 */}
              <div className="text-center mb-12">
                <motion.h1 
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  className="text-5xl font-bold mb-4"
                >
                  <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
                    Ding Ding
                  </span>
                  <span className="text-white"> Community</span>
                </motion.h1>
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg text-zinc-400"
                >
                  함께 연주하고, 배우고, 성장하는 공간
                </motion.p>
              </div>

              {/* 검색 및 필터 섹션 */}
              <div className="mb-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
                  {/* 검색바 */}
                  <div className="relative w-full md:w-96">
                    <input
                      type="text"
                      placeholder="게시물 검색..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-5 py-3 bg-zinc-800/50 border border-zinc-700 rounded-full
                               text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500
                               transition-colors"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* 글쓰기 버튼 */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCreate(!showCreate)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 
                             hover:from-amber-600 hover:to-amber-700 text-white font-medium rounded-full 
                             transition-all duration-200 shadow-lg shadow-amber-500/20 min-w-[140px]"
                  >
                    <HiOutlinePencilAlt className="w-5 h-5" />
                    {showCreate ? '돌아가기' : '글쓰기'}
                  </motion.button>
                </div>

                {/* 카테고리 필터 */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {categories.map((category) => (
                    <motion.button
                      key={category.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all
                                ${selectedCategory === category.id
                                  ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30'
                                  : 'bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600'
                                }`}
                    >
                      <div className={`p-3 rounded-full ${
                        selectedCategory === category.id
                          ? 'bg-amber-500 text-white'
                          : 'bg-zinc-700/50 text-zinc-400'
                      }`}>
                        {category.icon}
                      </div>
                      <span className={`font-medium ${
                        selectedCategory === category.id ? 'text-amber-500' : 'text-zinc-300'
                      }`}>
                        {category.name}
                      </span>
                      <span className="text-xs text-zinc-500">{category.description}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* 게시물 목록 */}
              <AnimatePresence mode="wait">
                {showCreate ? (
                  <motion.div
                    key="create"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <CommunityCreate onCancel={handleCancelCreate} />
                  </motion.div>
                ) : (
                  <div className="space-y-8">
                    <motion.div
                      key="list"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                      {currentPosts.length > 0 ? (
                        currentPosts.map((post, index) => (
                          <motion.div
                            key={post.articleId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ 
                              opacity: 1, 
                              y: 0,
                              transition: { delay: index * 0.1 }
                            }}
                            whileHover={{ 
                              scale: 1.02,
                              transition: { duration: 0.2 }
                            }}
                            onClick={() => setSelectedPost(post.articleId)}
                            className="cursor-pointer transform-gpu"
                          >
                            <CommunityList post={post} />
                          </motion.div>
                        ))
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="col-span-2 text-center py-16 bg-zinc-800/30 rounded-2xl border border-zinc-700/30"
                        >
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-700/50 flex items-center justify-center">
                            <HiOutlinePencilAlt className="w-8 h-8 text-zinc-400" />
                          </div>
                          <h3 className="text-xl font-medium text-zinc-300 mb-2">게시물이 없습니다</h3>
                          <p className="text-zinc-500">첫 번째 게시물의 주인공이 되어보세요!</p>
                        </motion.div>
                      )}
                    </motion.div>

                    {/* 페이지네이션 */}
                    {!showCreate && totalPages > 1 && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-center gap-2 mt-8 mb-4"
                      >
                        {Array.from({ length: totalPages }, (_, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`w-10 h-10 rounded-full transition-all duration-200 ${
                              currentPage === index + 1
                                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                                : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700/50 border border-zinc-700/50'
                            }`}
                          >
                            {index + 1}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
