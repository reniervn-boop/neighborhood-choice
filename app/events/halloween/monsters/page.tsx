'use client';

import { useState, useMemo } from 'react';
import MonsterCard from '@/components/halloween/MonsterCard';
import { monsters, MONSTER_CATEGORIES } from '@/lib/halloween/monsters';

export default function MonstersPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [danger, setDanger] = useState(0);

  const filtered = useMemo(() => {
    return monsters.filter((m) => {
      const matchesQuery =
        !query ||
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.description.toLowerCase().includes(query.toLowerCase()) ||
        m.origin.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === 'all' || m.category === category;
      const matchesDanger = danger === 0 || m.dangerLevel === danger;
      return matchesQuery && matchesCategory && matchesDanger;
    });
  }, [query, category, danger]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-7">
        <h1
          className="text-4xl md:text-5xl text-white mb-2"
          style={{ fontFamily: 'var(--font-creepster), cursive' }}
        >
          Monster <span style={{ color: '#ff6b00' }}>Index</span>
        </h1>
        <p className="text-gray-400">
          Know your enemy. Search the index to find weaknesses and survival strategies.
        </p>
      </div>

      {/* Filters */}
      <div
        className="rounded-2xl p-4 mb-7 flex flex-col sm:flex-row gap-3 border border-white/10"
        style={{ backgroundColor: '#12121e' }}
      >
        <input
          type="text"
          placeholder="🔍 Search monsters…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
          style={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
          style={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {MONSTER_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value} style={{ backgroundColor: '#0a0a0f' }}>
              {c.label}
            </option>
          ))}
        </select>
        <select
          value={danger}
          onChange={(e) => setDanger(Number(e.target.value))}
          className="rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
          style={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <option value={0} style={{ backgroundColor: '#0a0a0f' }}>All danger levels</option>
          <option value={1} style={{ backgroundColor: '#0a0a0f' }}>⚠ Mild</option>
          <option value={2} style={{ backgroundColor: '#0a0a0f' }}>⚠ Moderate</option>
          <option value={3} style={{ backgroundColor: '#0a0a0f' }}>⚠ Dangerous</option>
          <option value={4} style={{ backgroundColor: '#0a0a0f' }}>⚠ Very Dangerous</option>
          <option value={5} style={{ backgroundColor: '#0a0a0f' }}>💀 LETHAL</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-xl" style={{ fontFamily: 'var(--font-creepster), cursive' }}>
            No monsters found
          </p>
          <p className="text-sm mt-1">Try adjusting your search</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-gray-500 mb-4">
            {filtered.length} monster{filtered.length === 1 ? '' : 's'} found
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((monster) => (
              <MonsterCard key={monster.id} monster={monster} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
