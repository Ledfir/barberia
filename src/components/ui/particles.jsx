import { useEffect, useMemo, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { cn } from '@/lib/utils';

/**
 * Magic UI — Particles
 * Fondo de partículas animadas. Se monta como capa absoluta dentro de un
 * contenedor `relative`, por lo que el contenido debe quedar encima.
 */
export default function ParticlesBackground({
  className,
  id = 'particles',
  quantity = 110,
  color = '#ffffff',
  linkOpacity = 0.14,
  speed = 0.6
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      if (active) setReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const options = useMemo(
    () => ({
      fullScreen: { enable: false },
      background: { color: { value: 'transparent' } },
      fpsLimit: 60,
      detectRetina: true,
      interactivity: {
        events: {
          onHover: { enable: true, mode: 'grab' },
          resize: { enable: true }
        },
        modes: {
          grab: { distance: 170, links: { opacity: 0.3 } }
        }
      },
      particles: {
        color: { value: color },
        links: {
          color,
          distance: 140,
          enable: true,
          opacity: linkOpacity,
          width: 1
        },
        move: {
          enable: true,
          speed,
          direction: 'none',
          outModes: { default: 'out' }
        },
        number: {
          density: { enable: true, width: 1200 },
          value: quantity
        },
        opacity: { value: { min: 0.1, max: 0.5 } },
        shape: { type: 'circle' },
        size: { value: { min: 0.6, max: 2.6 } }
      }
    }),
    [color, linkOpacity, quantity, speed]
  );

  if (!ready) return null;

  return (
    <Particles
      id={id}
      className={cn('absolute inset-0 h-full w-full', className)}
      options={options}
    />
  );
}