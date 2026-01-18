export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  stats: string | null;
  featured: number | boolean; 
  tags: string[];
  links: {
    github: string | null;
    live: string | null;
  };
}
