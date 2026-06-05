export interface Props {
  streetcodeId: number;
}

export interface VideoCreateDto {
  title: string;
  url: string;
  streetcodeId: number;
}

export interface TextCreateDto {
  title: string;
  textContent: string;
  streetcodeId: number;
  additionalText: string | null;
}