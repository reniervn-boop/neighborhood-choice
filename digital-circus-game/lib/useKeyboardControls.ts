'use client';

import { useEffect, useRef } from 'react';

export interface MovementState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
}

const MOVE_KEYS: Record<string, keyof MovementState> = {
  KeyW: 'forward',
  ArrowUp: 'forward',
  KeyS: 'backward',
  ArrowDown: 'backward',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
};

export function useMovementControls() {
  const state = useRef<MovementState>({ forward: false, backward: false, left: false, right: false });

  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => {
      const key = MOVE_KEYS[e.code];
      if (key) state.current[key] = true;
    };
    const handleUp = (e: KeyboardEvent) => {
      const key = MOVE_KEYS[e.code];
      if (key) state.current[key] = false;
    };
    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  }, []);

  return state;
}

export function useInteractKey(onInteract: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'KeyE' || e.code === 'Space') {
        onInteract();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onInteract]);
}
