// types.ts
export type SectionKey = 'about' | 'skills' | 'projects';

export interface SectionData {
  title: string;
  content: string;
}

export interface ProjectData {
  id: string;
  title: string;
  github: string | null;
  github2: string | null;
  youtube: string | null;
  description: string;
  tech: string;
  details: string;
  color: {
    bg: string;
    text: string;
    hover: string;
    gradient: string;
  };
}

export type SectionDataMap = Record<SectionKey, SectionData>;