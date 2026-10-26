import {
  Box,
  Code2,
  Cpu,
  GitBranch,
  Lightbulb,
  Network,
  Radio,
  Wrench,
  BookOpen,
  FileText,
  Github,
  Globe,
  PenTool,
  PlayCircle,
  Presentation,
  type LucideIcon,
} from 'lucide-react';
import type { Disciplina, Material } from '@/lib/tipos';

export const iconesDisciplina: Record<Disciplina['icone'], LucideIcon> = {
  cubo: Box,
  arvore: GitBranch,
  codigo: Code2,
  rede: Network,
  chip: Cpu,
  ferramenta: Wrench,
  livro: BookOpen,
  transmissao: Radio,
  lampada: Lightbulb,
};

export const iconesMaterial: Record<Material['tipo'], LucideIcon> = {
  portal: Globe,
  repositorio: Github,
  apostila: FileText,
  slides: Presentation,
  video: PlayCircle,
  exercicio: PenTool,
};

export const nomesMaterial: Record<Material['tipo'], string> = {
  portal: 'Portal',
  repositorio: 'Repositório',
  apostila: 'Roteiro',
  slides: 'Slides',
  video: 'Vídeo',
  exercicio: 'Prática',
};
