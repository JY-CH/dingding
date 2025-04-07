// src/hooks/useTemplateData.ts
import { useState, useEffect } from 'react';

import { TemplateData, TemplateDataResponse } from '../types/guitar-chord';

interface UseTemplateDataProps {
  backendUrl: string;
}

const useTemplateData = ({ backendUrl }: UseTemplateDataProps) => {
  const [templates, setTemplates] = useState<TemplateData[]>([]);
  const [duration, setDuration] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplateData = async () => {
      if (!backendUrl) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${backendUrl}/template-data`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: TemplateDataResponse = await response.json();

        setTemplates(data.templates);
        setDuration(data.duration);
      } catch (err) {
        console.error('템플릿 데이터 로드 에러:', err);
        setError(err instanceof Error ? err.message : '템플릿 데이터 로드 오류');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplateData();
  }, [backendUrl]);

  return { templates, duration, loading, error };
};

export default useTemplateData;
