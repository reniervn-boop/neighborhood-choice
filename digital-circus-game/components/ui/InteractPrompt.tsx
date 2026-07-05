import { getNPC } from '@/lib/data/npcs';

export default function InteractPrompt({ npcId }: { npcId: string }) {
  const npc = getNPC(npcId);
  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm backdrop-blur animate-pulse">
      Press <span className="font-bold">E</span> to talk to {npc.name}
    </div>
  );
}
