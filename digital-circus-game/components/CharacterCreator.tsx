'use client';

import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import AvatarModel from '@/components/AvatarModel';
import { useGameStore } from '@/lib/store/useGameStore';
import { ACCENT_COLORS, ACCESSORIES, BODY_COLORS, EYE_STYLES, HEAD_SHAPES } from '@/lib/data/customization';
import { Accessory, EyeStyle, HeadShape } from '@/lib/types';

function SwatchRow<T extends string>({
  options,
  value,
  onChange,
  swatchColor,
}: {
  options: { value: T; label: string }[] | T[];
  value: T;
  onChange: (v: T) => void;
  swatchColor?: boolean;
}) {
  const normalized = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  return (
    <div className="flex flex-wrap gap-2">
      {normalized.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded-full border-2 px-3 py-1 text-sm transition ${
            value === opt.value ? 'border-white scale-110' : 'border-transparent opacity-70 hover:opacity-100'
          }`}
          style={swatchColor ? { backgroundColor: opt.value, width: 36, height: 36, padding: 0 } : { background: '#2a2a3d' }}
          aria-label={opt.label}
          title={opt.label}
        >
          {!swatchColor && opt.label}
        </button>
      ))}
    </div>
  );
}

export default function CharacterCreator() {
  const createCharacter = useGameStore((s) => s.createCharacter);
  const [name, setName] = useState('');
  const [bodyColor, setBodyColor] = useState(BODY_COLORS[0]);
  const [accentColor, setAccentColor] = useState(ACCENT_COLORS[0]);
  const [headShape, setHeadShape] = useState<HeadShape>('round');
  const [eyeStyle, setEyeStyle] = useState<EyeStyle>('sparkle');
  const [accessory, setAccessory] = useState<Accessory>('none');

  const appearance = { bodyColor, accentColor, headShape, eyeStyle, accessory };

  const canSubmit = name.trim().length > 0;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#1a0f2e] to-[#0a0612] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
        <div className="h-80 md:h-96 rounded-2xl overflow-hidden bg-black/30 border border-white/10">
          <Canvas camera={{ position: [0, 1.4, 3.2], fov: 40 }}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[3, 5, 2]} intensity={1.2} />
            <pointLight position={[-3, 2, -2]} intensity={0.4} color="#ff5d8f" />
            <group position={[0, -1, 0]}>
              <AvatarModel appearance={appearance} bounceSpeed={1.2} />
            </group>
          </Canvas>
        </div>

        <div className="space-y-5">
          <div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: 'system-ui' }}>
              Step Into the Circus
            </h1>
            <p className="text-white/60 mt-1">Create your performer before the show begins.</p>
          </div>

          <div>
            <label className="block text-sm mb-1 text-white/70">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 20))}
              placeholder="Your performer name"
              className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 outline-none focus:border-pink-400"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-white/70">Body color</label>
            <SwatchRow options={BODY_COLORS} value={bodyColor} onChange={setBodyColor} swatchColor />
          </div>

          <div>
            <label className="block text-sm mb-1 text-white/70">Accent color</label>
            <SwatchRow options={ACCENT_COLORS} value={accentColor} onChange={setAccentColor} swatchColor />
          </div>

          <div>
            <label className="block text-sm mb-1 text-white/70">Head shape</label>
            <SwatchRow options={HEAD_SHAPES} value={headShape} onChange={setHeadShape} />
          </div>

          <div>
            <label className="block text-sm mb-1 text-white/70">Eyes</label>
            <SwatchRow options={EYE_STYLES} value={eyeStyle} onChange={setEyeStyle} />
          </div>

          <div>
            <label className="block text-sm mb-1 text-white/70">Accessory</label>
            <SwatchRow options={ACCESSORIES} value={accessory} onChange={setAccessory} />
          </div>

          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => createCharacter({ name: name.trim(), ...appearance })}
            className="w-full mt-2 rounded-lg bg-pink-500 hover:bg-pink-400 disabled:bg-white/10 disabled:text-white/40 transition py-3 font-semibold"
          >
            Enter the Circus
          </button>
        </div>
      </div>
    </div>
  );
}
