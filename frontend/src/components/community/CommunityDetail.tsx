import { useQuery } from '@tanstack/react-query';

import { _axios } from '../../services/JYapi';

interface CommunityDetailProps {
  articleId: number;
  setSelectedPost: (value: number | null) => void; // 상태 변경 함수 타입 정의
}

export const CommunityDetail: React.FC<CommunityDetailProps> = ({ articleId, setSelectedPost }) => {
  const { data: articleDetail } = useQuery({
    queryKey: ['lecture', articleId],
    queryFn: async () => {
      const { data } = await _axios.get(`/article/${articleId}`);
      return data.body.data;
    },
  });
  return (
    <div>
      <div>
        <button onClick={() => setSelectedPost(null)}>asd</button>

        {articleDetail}
      </div>
    </div>
  );
};
