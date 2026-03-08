import { useNews } from '../context/NewsContext';

export default function BreakingNewsBar() {
  const { getBreakingNews } = useNews();
  const breaking = getBreakingNews();

  if (breaking.length === 0) return null;

  const titles = breaking.map(a => a.title).join('   ⚡   ');

  return (
    <div style={{ background: 'linear-gradient(90deg, #b71c1c, #c62828, #b71c1c)' }} className="text-white py-2 overflow-hidden">
      <div className="flex items-center">
        <div className="shrink-0 flex items-center gap-1.5 bg-white text-red-700 font-black px-4 py-1 mx-3 rounded text-sm pulse-badge shadow-md">
          <span className="animate-pulse text-red-600">●</span> عاجل
        </div>
        <div className="overflow-hidden whitespace-nowrap flex-1">
          <div className="inline-block animate-[marquee_30s_linear_infinite] text-sm font-semibold tracking-wide">
            {titles}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{titles}
          </div>
        </div>
      </div>
    </div>
  );
}
