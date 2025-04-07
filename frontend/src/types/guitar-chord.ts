export interface TemplateData {
    label: string;
    mel_profile: number[];
    chroma_profile: number[][];
  }
  
  export interface TemplateDataResponse {
    templates: TemplateData[];
    duration: number;
  }
  
  export interface PredictionResult {
    chord: string;
    confidence: number;
    template_matching: {
      label: string;
      confidence: number;
      all_similarities: Record<string, number>;
    };
    ml_models: Record<string, {
      label: string;
      confidence: number;
      all_probs: Record<string, number>;
    }>;
  }