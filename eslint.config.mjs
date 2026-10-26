import { defineConfig } from 'eslint/config';
import next from 'eslint-config-next';

export default defineConfig([
  { ignores: ['.next/**', 'node_modules/**', '.aistudio/**'] },
  {
    extends: [...next],
    rules: {
      // As mídias são trocadas pelo professor em qualquer formato (inclusive SVG),
      // por isso usamos <img> com dimensões e carregamento preguiçoso.
      '@next/next/no-img-element': 'off',
    },
  },
]);
