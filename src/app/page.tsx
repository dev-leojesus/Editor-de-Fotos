import dynamic from 'next/dynamic';

const PhotoEditor = dynamic(() => import('@/components/PhotoEditor'), {
  ssr: false,
  loading: () => <div className="h-screen w-full bg-zinc-950 flex flex-col items-center justify-center text-[#ccff00]">Loading FX Engine...</div>
});

export default function Home() {
  return (
    <main className="w-full h-screen overflow-hidden">
      <PhotoEditor />
    </main>
  );
}
