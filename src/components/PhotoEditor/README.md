# Photo Editor SPA - Integration Guide

Este diretório contém a SPA completa do Editor de Fotos, dividida em componentes modulares com gerenciamento de estado via `zustand`. A interface foi projetada com a estética "Dark Industrial Studio" (foco profissional, alta performance, sem "Safe Harbors" visuais).

## 🚀 Instalação e Dependências

Copie esta pasta para `src/components/PhotoEditor` no seu projeto Next.js (App Router).

Certifique-se de ter as seguintes dependências instaladas:

```bash
npm install zustand lucide-react
```

## 🧩 Como usar na sua Página (Next.js)

Basta importar o componente principal e desabilitar o SSR se necessário, pois ele usa APIs do navegador (`window.addEventListener`, `canvas`, `FileReader`).

No seu `src/app/page.tsx`:

```tsx
import dynamic from 'next/dynamic';

// Carrega o editor apenas no cliente
const PhotoEditor = dynamic(() => import('@/components/PhotoEditor'), {
  ssr: false,
  loading: () => <div className="h-screen w-full bg-zinc-950 flex items-center justify-center text-[#ccff00]">Loading Editor Engine...</div>
});

export default function Home() {
  return (
    <main className="w-full h-screen">
      <PhotoEditor />
    </main>
  );
}
```

## 🧠 Arquitetura: Híbrida (CSS + Canvas API)

Como definido no Socratic Gate, o editor funciona de forma otimizada para manter os **60 FPS** ao arrastar os sliders:

1. **Tempo Real (Preview):** A imagem (`<img />`) na tela aplica as transformações utilizando Filtros CSS (`brightness()`, `contrast()`, `saturate()`, `hue-rotate()`) e camadas de *overlay* para Tint/Temperatura sem custo computacional alto.
2. **Tempo de Exportação:** Ao clicar em **Download**, o `CanvasView.tsx` cria um `<canvas>` offscreen com as dimensões reais da imagem e aplica as mesmas operações nativamente (`ctx.filter` e `ctx.globalCompositeOperation` para Overlays/Vignette), exportando um arquivo PNG de altíssima qualidade.
