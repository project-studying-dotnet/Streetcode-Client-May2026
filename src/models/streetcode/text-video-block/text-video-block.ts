export interface TextVideoBlock {
  title: string;
  textContent: string;
  additionalText?: string;
  videoUrl: string;
}

export interface TextVideoBlockFormProps {
  streetcodeId: number;
}