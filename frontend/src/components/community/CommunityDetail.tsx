interface CommunityDetailProps {
  articleId: number;
  setSelectedPost: (value: number | null) => void; // 상태 변경 함수 타입 정의
}

export const CommunityDetail: React.FC<CommunityDetailProps> = ({ articleId, setSelectedPost }) => {
  return (
    <div>
      <div></div>
    </div> 
  );
};
