'use client';

import { useState, useEffect, useCallback } from 'react';
import AppHeader from '@/components/AppHeader';

// ── Static data ──────────────────────────────────────────────────────────────

const catData = [
  { name: 'Arrest / SAPS',      count: 662, color: '#30D158' },
  { name: 'Theft',              count: 344, color: '#FF9F0A' },
  { name: 'Shooting / Violence',count: 327, color: '#FF3B30' },
  { name: 'House Break-in',     count: 160, color: '#BF5AF2' },
  { name: 'Scam / Fraud',       count: 144, color: '#FFD60A' },
  { name: 'Armed Robbery',      count: 113, color: '#FF6340' },
  { name: 'Suspicious',         count:  57, color: '#32ADE6' },
  { name: 'Hijacking',          count:  41, color: '#0A84FF' },
];

type YearRow = { y: string; [key: string]: string | number };
const yearData: YearRow[] = [
  { y:'2016', SAPS:55, 'Break-in':20, Robbery:8,  Theft:10,  Violence:16, Suspicious:8,  Scam:12, Hijacking:3 },
  { y:'2017', SAPS:86, 'Break-in':18, Robbery:23, Theft:28,  Violence:39, Suspicious:10, Scam:11, Hijacking:8 },
  { y:'2020', SAPS:118,'Break-in':38, Robbery:20, Theft:32,  Violence:73, Suspicious:14, Scam:32, Hijacking:8 },
  { y:'2021', SAPS:82, 'Break-in':23, Robbery:12, Theft:23,  Violence:46, Suspicious:1,  Scam:23, Hijacking:6 },
  { y:'2022', SAPS:78, 'Break-in':18, Robbery:12, Theft:97,  Violence:55, Suspicious:6,  Scam:16, Hijacking:1 },
  { y:'2023', SAPS:97, 'Break-in':10, Robbery:13, Theft:100, Violence:48, Suspicious:5,  Scam:33, Hijacking:6 },
  { y:'2024', SAPS:97, 'Break-in':26, Robbery:24, Theft:35,  Violence:34, Suspicious:10, Scam:14, Hijacking:8 },
  { y:'2025', SAPS:33, 'Break-in':6,  Robbery:1,  Theft:12,  Violence:13, Suspicious:1,  Scam:2,  Hijacking:1 },
  { y:'2026*',SAPS:16, 'Break-in':1,  Robbery:0,  Theft:7,   Violence:3,  Suspicious:2,  Scam:1,  Hijacking:0 },
];

const stackKeys   = ['SAPS','Theft','Violence','Break-in','Scam','Robbery','Suspicious','Hijacking'];
const stackColors = ['#30D158','#FF9F0A','#FF3B30','#BF5AF2','#FFD60A','#FF6340','#32ADE6','#0A84FF'];

const hourData = [8,13,2,2,6,6,38,78,132,101,112,106,106,93,102,94,76,107,109,113,113,82,32,12];

const dowData = [
  { day:'Mon', count:274 }, { day:'Tue', count:246 }, { day:'Wed', count:233 },
  { day:'Thu', count:278 }, { day:'Fri', count:267 }, { day:'Sat', count:210 }, { day:'Sun', count:135 },
];

const monthlyRaw: Record<string, Record<string, number>> = {
  '2016':{'07':4,'08':27,'09':31,'10':13,'11':19,'12':16},
  '2017':{'01':34,'02':15,'03':71,'04':21,'05':18,'06':17,'07':9},
  '2020':{'01':9,'02':8,'03':54,'04':21,'05':29,'06':40,'07':22,'08':26,'09':17,'10':6,'11':17,'12':40},
  '2021':{'01':18,'02':6,'03':9,'04':8,'05':16,'06':10,'07':53,'08':15,'09':8,'10':13,'11':19,'12':8},
  '2022':{'01':7,'02':5,'03':7,'04':23,'05':24,'06':31,'07':28,'08':19,'09':9,'10':35,'11':18,'12':31},
  '2023':{'01':34,'02':31,'03':49,'04':14,'05':14,'06':6,'07':21,'08':18,'09':21,'10':30,'11':26,'12':10},
  '2024':{'01':18,'02':24,'03':27,'04':21,'05':27,'06':11,'07':11,'08':15,'09':6,'10':23,'11':22,'12':10},
  '2025':{'01':3,'02':4,'03':5,'04':4,'05':9,'06':6,'08':2,'09':4,'10':7,'11':12,'12':3},
  '2026':{'01':7,'02':1,'03':5,'04':10,'05':4},
};

// ── SVG helpers ───────────────────────────────────────────────────────────────

function svgEl(tag: string, attrs: Record<string, string | number> = {}) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  return el;
}

function makeSVG(id: string) {
  const svg = document.getElementById(id) as SVGSVGElement | null;
  if (!svg) return null;
  svg.innerHTML = '';
  const w = svg.parentElement?.clientWidth || 500;
  const h = +svg.getAttribute('height')!;
  svg.setAttribute('width', String(w));
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  return { svg, w, h };
}

// ── Component ─────────────────────────────────────────────────────────────────

type Tab = 'overview' | 'timeline' | 'timing' | 'heatmap';

// ── Panel & section helpers ──────────────────────────────────────────────────
// Defined at module scope on purpose: declared inside CrimeDashboardPage these
// were new component types on every render, so every state change (including a
// chart hover) remounted the panels — and with them the <svg> elements the
// charts are drawn into imperatively.


const Panel = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ background: '#13161E', border: '1px solid #1F2433', borderRadius: 14, padding: 20, ...style }}>
    {children}
  </div>
);

const SecTitle = ({ color, children }: { color: string; children: React.ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 800, color, marginBottom: 4 }}>
    <span style={{ display: 'block', width: 3, height: 18, borderRadius: 2, background: color, flexShrink: 0 }} />
    {children}
  </div>
);

const SecSub = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontSize: 12, color: '#8A93A2', marginBottom: 16, paddingLeft: 11 }}>{children}</div>
);

const TBucket = ({ pct, label, sub, count, color }: { pct: string; label: string; sub: string; count: string; color: string }) => (
  <div style={{ background: '#1A1E29', borderRadius: 10, padding: '12px 14px', borderLeft: `3px solid ${color}` }}>
    <div style={{ fontSize: 22, fontWeight: 900, fontFamily: 'monospace', color }}>{pct}</div>
    <div style={{ fontSize: 13, fontWeight: 700, color: '#E8EAF0', marginTop: 2 }}>{label}</div>
    <div style={{ fontSize: 11, color: '#8A93A2' }}>{sub}</div>
    <div style={{ fontSize: 11, color: '#48505F', marginTop: 2 }}>{count}</div>
  </div>
);

export default function CrimeDashboardPage() {
  const [tab, setTab] = useState<Tab>('overview');
  const [activeCat, setActiveCat] = useState<string | null>(null);

  // ── Tooltip state ──
  const [tip, setTip] = useState<{ x: number; y: number; label: string; val: string } | null>(null);

  const showTip = useCallback((e: MouseEvent, label: string, val: string) => {
    setTip({ x: e.clientX + 14, y: e.clientY - 10, label, val });
  }, []);
  const hideTip = useCallback(() => setTip(null), []);

  // ── Chart drawing ─────────────────────────────────────────────────────────

  const drawCatChart = useCallback((currentActiveCat: string | null) => {
    const res = makeSVG('cat-chart');
    if (!res) return;
    const { svg, w, h } = res;
    const pad = { l: 150, r: 60, t: 10, b: 10 };
    const cw = w - pad.l - pad.r, ch = h - pad.t - pad.b;
    const barH = Math.floor(ch / catData.length * 0.55);
    const gap = ch / catData.length;
    const maxV = catData[0].count;

    catData.forEach((d, i) => {
      const y = pad.t + i * gap + (gap - barH) / 2;
      const bw = Math.round((d.count / maxV) * cw);
      const faded = currentActiveCat && currentActiveCat !== d.name;

      const lbl = svgEl('text', { x: pad.l - 8, y: y + barH / 2 + 5, fill: faded ? '#48505F' : d.color, 'font-size': 11, 'text-anchor': 'end', 'font-family': 'system-ui' });
      lbl.textContent = d.name; svg.appendChild(lbl);

      svg.appendChild(svgEl('rect', { x: pad.l, y, width: cw, height: barH, rx: 4, fill: '#1A1E29' }));

      const bar = svgEl('rect', { x: pad.l, y, width: bw, height: barH, rx: 4, fill: faded ? '#48505F' : d.color, opacity: faded ? 0.35 : 1, cursor: 'pointer' });
      bar.addEventListener('mouseenter', (e) => showTip(e as MouseEvent, d.name, d.count + ' messages'));
      bar.addEventListener('mouseleave', hideTip);
      bar.addEventListener('click', () => setActiveCat(prev => prev === d.name ? null : d.name));
      svg.appendChild(bar);

      const val = svgEl('text', { x: pad.l + bw + 6, y: y + barH / 2 + 5, fill: faded ? '#48505F' : d.color, 'font-size': 12, 'font-weight': 700, 'font-family': 'system-ui' });
      val.textContent = String(d.count); svg.appendChild(val);
    });
  }, [showTip, hideTip]);

  const drawStackChart = useCallback(() => {
    const res = makeSVG('stack-chart');
    if (!res) return;
    const { svg, w, h } = res;
    const pad = { l: 40, r: 20, t: 20, b: 30 };
    const cw = w - pad.l - pad.r, ch = h - pad.t - pad.b;
    const totals = yearData.map(d => stackKeys.reduce((s, k) => s + (Number(d[k]) || 0), 0));
    const maxTotal = Math.max(...totals);
    const bw = Math.floor(cw / yearData.length * 0.6);
    const gapW = cw / yearData.length;

    [0, 50, 100, 150, 200, 250].forEach(v => {
      if (v > maxTotal) return;
      const y = pad.t + ch - (v / maxTotal) * ch;
      svg.appendChild(svgEl('line', { x1: pad.l, x2: pad.l + cw, y1: y, y2: y, stroke: '#1F2433', 'stroke-width': 1 }));
      const lbl = svgEl('text', { x: pad.l - 6, y: y + 4, fill: '#8A93A2', 'font-size': 10, 'text-anchor': 'end' });
      lbl.textContent = String(v); svg.appendChild(lbl);
    });

    yearData.forEach((d, i) => {
      const x = pad.l + i * gapW + (gapW - bw) / 2;
      let yOff = 0;
      stackKeys.forEach((k, ki) => {
        const v = Number(d[k]) || 0;
        if (!v) return;
        const barH = (v / maxTotal) * ch;
        const y = pad.t + ch - yOff - barH;
        const r = svgEl('rect', { x, y, width: bw, height: barH, fill: stackColors[ki], rx: 2, cursor: 'pointer' });
        r.addEventListener('mouseenter', e => showTip(e as MouseEvent, `${d.y} — ${k}`, v + ' messages'));
        r.addEventListener('mouseleave', hideTip);
        svg.appendChild(r);
        yOff += barH;
      });
      const lbl = svgEl('text', { x: x + bw / 2, y: pad.t + ch + 16, fill: '#8A93A2', 'font-size': 11, 'text-anchor': 'middle' });
      lbl.textContent = d.y; svg.appendChild(lbl);
    });

    // legend
    let legX = pad.l;
    stackKeys.forEach((k, i) => {
      svg.appendChild(svgEl('rect', { x: legX, y: 8, width: 10, height: 10, fill: stackColors[i], rx: 2 }));
      const lt = svgEl('text', { x: legX + 13, y: 17, fill: '#8A93A2', 'font-size': 10 });
      lt.textContent = k; svg.appendChild(lt);
      legX += k.length * 6.5 + 28;
    });
  }, [showTip, hideTip]);

  const drawAreaChart = useCallback((svgId: string, dataKey: string, color: string) => {
    const res = makeSVG(svgId);
    if (!res) return;
    const { svg, w, h } = res;
    const pad = { l: 36, r: 16, t: 14, b: 26 };
    const cw = w - pad.l - pad.r, ch = h - pad.t - pad.b;
    const vals = yearData.map(d => Number(d[dataKey]) || 0);
    const maxV = Math.max(...vals) || 1;
    const n = vals.length;
    const pts = vals.map((v, i) => [pad.l + i * (cw / (n - 1)), pad.t + ch - (v / maxV) * ch]);

    for (let s = 0; s <= 4; s++) {
      const v = Math.round(maxV * s / 4);
      const y = pad.t + ch - (v / maxV) * ch;
      svg.appendChild(svgEl('line', { x1: pad.l, x2: pad.l + cw, y1: y, y2: y, stroke: '#1F2433', 'stroke-width': 1 }));
      const lbl = svgEl('text', { x: pad.l - 4, y: y + 4, fill: '#8A93A2', 'font-size': 9, 'text-anchor': 'end' });
      lbl.textContent = String(v); svg.appendChild(lbl);
    }

    const gId = 'g' + svgId;
    const defs = svgEl('defs');
    const grad = svgEl('linearGradient', { id: gId, x1: 0, y1: 0, x2: 0, y2: 1 });
    const s1 = svgEl('stop', { offset: '5%', 'stop-color': color, 'stop-opacity': 0.4 });
    const s2 = svgEl('stop', { offset: '95%', 'stop-color': color, 'stop-opacity': 0 });
    grad.appendChild(s1); grad.appendChild(s2); defs.appendChild(grad); svg.appendChild(defs);

    const dPath = `M${pts[0][0]},${pad.t + ch} L${pts.map(p => `${p[0]},${p[1]}`).join(' L')} L${pts[pts.length-1][0]},${pad.t + ch} Z`;
    svg.appendChild(svgEl('path', { d: dPath, fill: `url(#${gId})` }));
    svg.appendChild(svgEl('path', { d: `M${pts.map(p => `${p[0]},${p[1]}`).join(' L')}`, fill: 'none', stroke: color, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }));

    pts.forEach((p, i) => {
      const dot = svgEl('circle', { cx: p[0], cy: p[1], r: 4, fill: color, cursor: 'pointer' });
      dot.addEventListener('mouseenter', e => showTip(e as MouseEvent, yearData[i].y, vals[i] + ' messages'));
      dot.addEventListener('mouseleave', hideTip);
      svg.appendChild(dot);
    });

    yearData.forEach((d, i) => {
      const lbl = svgEl('text', { x: pts[i][0], y: pad.t + ch + 16, fill: '#8A93A2', 'font-size': 10, 'text-anchor': 'middle' });
      lbl.textContent = d.y; svg.appendChild(lbl);
    });
  }, [showTip, hideTip]);

  const drawHourChart = useCallback(() => {
    const res = makeSVG('hour-chart');
    if (!res) return;
    const { svg, w, h } = res;
    const pad = { l: 36, r: 10, t: 10, b: 24 };
    const cw = w - pad.l - pad.r, ch = h - pad.t - pad.b;
    const maxV = 132;
    const bw = Math.floor(cw / 24 * 0.75);
    const gapW = cw / 24;
    const cols = ['#0A84FF','#0A84FF','#0A84FF','#0A84FF','#0A84FF','#0A84FF',
      '#FFD60A','#FFD60A','#FFD60A','#FFD60A','#FFD60A','#FFD60A',
      '#FF9F0A','#FF9F0A','#FF9F0A','#FF9F0A','#FF9F0A','#FF9F0A',
      '#BF5AF2','#BF5AF2','#BF5AF2','#BF5AF2','#BF5AF2','#0A84FF'];

    [0, 50, 100].forEach(v => {
      const y = pad.t + ch - (v / maxV) * ch;
      svg.appendChild(svgEl('line', { x1: pad.l, x2: pad.l + cw, y1: y, y2: y, stroke: '#1F2433', 'stroke-width': 1 }));
      const lbl = svgEl('text', { x: pad.l - 4, y: y + 4, fill: '#8A93A2', 'font-size': 9, 'text-anchor': 'end' });
      lbl.textContent = String(v); svg.appendChild(lbl);
    });

    hourData.forEach((v, i) => {
      const bh = (v / maxV) * ch;
      const x = pad.l + i * gapW + (gapW - bw) / 2;
      const y = pad.t + ch - bh;
      const bar = svgEl('rect', { x, y, width: bw, height: bh, fill: cols[i], rx: 3, cursor: 'pointer' });
      bar.addEventListener('mouseenter', e => showTip(e as MouseEvent, `${String(i).padStart(2, '0')}:00`, v + ' messages'));
      bar.addEventListener('mouseleave', hideTip);
      svg.appendChild(bar);
      if (i % 3 === 0) {
        const lbl = svgEl('text', { x: x + bw / 2, y: pad.t + ch + 14, fill: '#8A93A2', 'font-size': 9, 'text-anchor': 'middle' });
        lbl.textContent = `${String(i).padStart(2, '0')}h`; svg.appendChild(lbl);
      }
    });
  }, [showTip, hideTip]);

  const drawDow = useCallback((containerId: string) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    const maxV = 278;
    const colors = ['#FF9F0A','#FFD60A','#8A93A2','#FF9F0A','#FF9F0A','#FF9F0A','#48505F'];
    dowData.forEach((d, i) => {
      const pct = Math.round((d.count / maxV) * 100);
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;gap:10px;margin-bottom:6px';
      const lbl = document.createElement('div');
      lbl.style.cssText = 'font-size:12px;color:#8A93A2;width:30px;flex-shrink:0';
      lbl.textContent = d.day;
      const track = document.createElement('div');
      track.style.cssText = 'flex:1;height:20px;background:#1A1E29;border-radius:4px;overflow:hidden';
      const fill = document.createElement('div');
      fill.style.cssText = `height:100%;border-radius:4px;display:flex;align-items:center;padding-left:8px;font-size:11px;font-weight:700;color:rgba(0,0,0,.7);width:${pct}%;background:${colors[i]}`;
      fill.textContent = String(d.count);
      track.appendChild(fill); row.appendChild(lbl); row.appendChild(track);
      container.appendChild(row);
    });
  }, []);

  const drawStrip = useCallback(() => {
    const strip = document.getElementById('strip24');
    if (!strip) return;
    strip.innerHTML = '';
    const cols = hourData.map((_, i) => i < 6 ? '#0A84FF' : i < 12 ? '#FFD60A' : i < 18 ? '#FF9F0A' : '#BF5AF2');
    const maxV = 132;
    hourData.forEach((v, i) => {
      const col = document.createElement('div');
      col.style.cssText = 'flex:1;display:flex;align-items:flex-end';
      const bar = document.createElement('div');
      bar.style.cssText = `width:100%;border-radius:2px 2px 0 0;height:${Math.max(4, Math.round((v / maxV) * 100))}%;background:${cols[i]}`;
      bar.title = `${String(i).padStart(2,'0')}:00 — ${v} msgs`;
      col.appendChild(bar); strip.appendChild(col);
    });
  }, []);

  const drawHeatmap = useCallback(() => {
    const container = document.getElementById('heatmap-grid');
    if (!container) return;
    container.innerHTML = '';
    const years = ['2016','2017','2020','2021','2022','2023','2024','2025','2026'];
    const months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    const labels = ['J','F','M','A','M','J','J','A','S','O','N','D'];
    const maxV = 71;

    const getColor = (v: number) => {
      if (!v) return '#1A1E29';
      const t = v / maxV;
      if (t > 0.7) return '#FF3B30';
      if (t > 0.4) return '#FF9F0A';
      if (t > 0.2) return '#F59E0B';
      if (t > 0.05) return '#92400E';
      return '#2A1A0A';
    };

    // header
    const hdr = document.createElement('div');
    hdr.style.cssText = 'display:grid;grid-template-columns:52px repeat(12,1fr);gap:3px;margin-bottom:3px';
    hdr.appendChild(document.createElement('div'));
    labels.forEach(l => {
      const c = document.createElement('div');
      c.style.cssText = 'text-align:center;font-size:10px;color:#8A93A2';
      c.textContent = l; hdr.appendChild(c);
    });
    container.appendChild(hdr);

    years.forEach(yr => {
      const row = document.createElement('div');
      row.style.cssText = 'display:grid;grid-template-columns:52px repeat(12,1fr);gap:3px;margin-bottom:3px';
      const yl = document.createElement('div');
      yl.style.cssText = 'font-size:11px;color:#8A93A2;display:flex;align-items:center';
      yl.textContent = yr; row.appendChild(yl);
      months.forEach(mo => {
        const v = monthlyRaw[yr]?.[mo] || 0;
        const cell = document.createElement('div');
        cell.style.cssText = `height:24px;border-radius:4px;background:${getColor(v)};border:1px solid transparent;cursor:default;transition:transform .1s`;
        if (v) {
          cell.style.cursor = 'pointer';
          cell.addEventListener('mouseenter', (e) => {
            cell.style.transform = 'scale(1.2)';
            cell.style.border = '1px solid #E8EAF0';
            showTip(e as MouseEvent, `${yr}/${mo}`, v + ' messages');
          });
          cell.addEventListener('mouseleave', () => {
            cell.style.transform = '';
            cell.style.border = '1px solid transparent';
            hideTip();
          });
        }
        row.appendChild(cell);
      });
      container.appendChild(row);
    });
  }, [showTip, hideTip]);

  const renderAll = useCallback((currentActiveCat: string | null) => {
    requestAnimationFrame(() => {
      try { drawCatChart(currentActiveCat); } catch { /* noop */ }
      try { drawStackChart(); } catch { /* noop */ }
      try { drawAreaChart('theft-chart', 'Theft', '#FF9F0A'); } catch { /* noop */ }
      try { drawAreaChart('viol-chart', 'Violence', '#FF3B30'); } catch { /* noop */ }
      try { drawAreaChart('bi-chart', 'Break-in', '#BF5AF2'); } catch { /* noop */ }
      try { drawAreaChart('ar-chart', 'Robbery', '#FF6340'); } catch { /* noop */ }
      try { drawHourChart(); } catch { /* noop */ }
      try { drawDow('dow-bars'); } catch { /* noop */ }
      try { drawDow('dow-bars2'); } catch { /* noop */ }
      try { drawStrip(); } catch { /* noop */ }
      try { drawHeatmap(); } catch { /* noop */ }
    });
  }, [drawCatChart, drawStackChart, drawAreaChart, drawHourChart, drawDow, drawStrip, drawHeatmap]);

  // Re-render on tab change, activeCat change, or resize
  useEffect(() => {
    const timer = setTimeout(() => renderAll(activeCat), 30);
    return () => clearTimeout(timer);
  }, [tab, activeCat, renderAll]);

  useEffect(() => {
    const onResize = () => renderAll(activeCat);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [activeCat, renderAll]);

  // ── Tab bar ───────────────────────────────────────────────────────────────

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'timeline', label: 'By Year' },
    { id: 'timing',   label: 'By Time' },
    { id: 'heatmap',  label: 'Heatmap' },
  ];

  return (
    <div style={{ background: '#0D0F14', minHeight: '100dvh', paddingBottom: 96, color: '#E8EAF0', fontFamily: 'system-ui,-apple-system,"Segoe UI",sans-serif' }}>

      {/* Tooltip */}
      {tip && (
        <div style={{ position: 'fixed', left: tip.x, top: tip.y, background: '#1A1E29', border: '1px solid #1F2433', borderRadius: 10, padding: '10px 14px', fontSize: 12, pointerEvents: 'none', zIndex: 999 }}>
          <div style={{ color: '#8A93A2', fontSize: 11, marginBottom: 5 }}>{tip.label}</div>
          <div style={{ fontWeight: 700, color: '#E8EAF0' }}>{tip.val}</div>
        </div>
      )}

      <AppHeader title="Crime & Security" showBack backHref="/" />

      <div style={{ maxWidth: 980, margin: '0 auto', padding: '20px 16px' }}>

        {/* Header stats */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF3B30', boxShadow: '0 0 8px #FF3B30', display: 'inline-block' }} />
              <span style={{ fontSize: 11, letterSpacing: 3, color: '#8A93A2', textTransform: 'uppercase' }}>Sundowner Ext 7 · Crime Intelligence</span>
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.5 }}>Crime &amp; Security Report</h1>
            <div style={{ fontSize: 13, color: '#8A93A2', marginTop: 4 }}>1,643 categorised messages · WhatsApp group 2015–2026</div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[
              { val: '1,643', lbl: 'Total incidents', color: '#FF3B30' },
              { val: '8',     lbl: 'Categories',      color: '#FF9F0A' },
              { val: '2020',  lbl: 'Peak year',       color: '#BF5AF2' },
            ].map(s => (
              <div key={s.lbl} style={{ background: '#13161E', border: '1px solid #1F2433', borderRadius: 10, padding: '8px 14px', textAlign: 'right' }}>
                <div style={{ fontSize: 20, fontWeight: 900, fontFamily: 'monospace', color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 10, color: '#8A93A2', textTransform: 'uppercase', letterSpacing: 1 }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 22 }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: '7px 18px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: tab === t.id ? 700 : 500,
                background: tab === t.id ? '#FF3B30' : '#1A1E29',
                color: tab === t.id ? '#fff' : '#8A93A2',
                transition: 'all .2s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        <div style={{ display: tab === 'overview' ? 'flex' : 'none', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '5fr 4fr', gap: 16 }}>
            <Panel>
              <SecTitle color="#FF3B30">Incidents by Type</SecTitle>
              <SecSub>Click a bar to highlight</SecSub>
              <svg id="cat-chart" width="100%" height="260" style={{ overflow: 'visible', display: 'block' }} />
            </Panel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Panel style={{ flex: 1 }}>
                <SecTitle color="#FF9F0A">Time of Day Split</SecTitle>
                <div style={{ height: 8 }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <TBucket pct="2.9%"  label="Night"     sub="23:00–06:00" count="47 msgs"  color="#0A84FF" />
                  <TBucket pct="33%"   label="Morning"   sub="06:00–12:00" count="542 msgs" color="#FFD60A" />
                  <TBucket pct="34.3%" label="Afternoon" sub="12:00–18:00" count="563 msgs" color="#FF9F0A" />
                  <TBucket pct="26%"   label="Evening"   sub="18:00–23:00" count="427 msgs" color="#BF5AF2" />
                </div>
              </Panel>
              <Panel>
                <SecTitle color="#BF5AF2">Day of Week</SecTitle>
                <div style={{ height: 10 }} />
                <div id="dow-bars" />
                <div style={{ fontSize: 11, color: '#8A93A2', marginTop: 10 }}>Mon &amp; Thu busiest · Sundays 40% quieter</div>
              </Panel>
            </div>
          </div>

          {/* Insight cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
            {[
              { icon: '🚔', title: 'Arrest / SAPS', color: '#30D158', text: 'Most discussed at 662 msgs — community actively shares police activity & CPF updates' },
              { icon: '📱', title: 'Scam Surge',    color: '#FFD60A', text: 'Fraud messages shot up in 2023 with WhatsApp & phishing scams targeting residents' },
              { icon: '🏠', title: 'Break-ins Peak',color: '#BF5AF2', text: 'House break-ins peaked in 2020 — notably the July–August lockdown period' },
              { icon: '🔫', title: 'Violence Reports',color: '#FF3B30',text: 'Shooting/violence mentions highest in 2020 (73 msgs), coinciding with the unrest' },
            ].map(c => (
              <div key={c.title} style={{ background: '#13161E', border: '1px solid #1F2433', borderTop: `2px solid ${c.color}`, borderRadius: 14, padding: 18, fontSize: 12, color: '#8A93A2', lineHeight: 1.5 }}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{c.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: c.color, marginBottom: 4 }}>{c.title}</div>
                {c.text}
              </div>
            ))}
          </div>
        </div>

        {/* ── TIMELINE ── */}
        <div style={{ display: tab === 'timeline' ? 'flex' : 'none', flexDirection: 'column', gap: 16 }}>
          <Panel>
            <SecTitle color="#FF9F0A">Crime Categories by Year — Stacked</SecTitle>
            <SecSub>Full picture of how incidents shifted over time</SecSub>
            <svg id="stack-chart" width="100%" height="300" style={{ display: 'block', overflow: 'visible' }} />
          </Panel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { id: 'theft-chart', color: '#FF9F0A', title: 'Theft Trend',         sub: 'Rose sharply in 2022–2023' },
              { id: 'viol-chart',  color: '#FF3B30', title: 'Violence / Shooting', sub: 'Peaked dramatically in 2020' },
              { id: 'bi-chart',    color: '#BF5AF2', title: 'House Break-ins',     sub: 'Lockdown 2020 saw a clear spike' },
              { id: 'ar-chart',    color: '#FF6340', title: 'Armed Robbery',       sub: '2024 saw a return of armed crime' },
            ].map(c => (
              <Panel key={c.id}>
                <SecTitle color={c.color}>{c.title}</SecTitle>
                <SecSub>{c.sub}</SecSub>
                <svg id={c.id} width="100%" height="160" style={{ display: 'block', overflow: 'visible' }} />
              </Panel>
            ))}
          </div>
        </div>

        {/* ── TIMING ── */}
        <div style={{ display: tab === 'timing' ? 'flex' : 'none', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16 }}>
            <Panel>
              <SecTitle color="#FFD60A">Crime Discussion by Hour of Day</SecTitle>
              <SecSub>When does the neighbourhood talk about crime?</SecSub>
              <svg id="hour-chart" width="100%" height="220" style={{ display: 'block', overflow: 'visible' }} />
              <div style={{ display: 'flex', gap: 16, marginTop: 10, flexWrap: 'wrap' }}>
                {[['#0A84FF','Night 23–06: 47'],['#FFD60A','Morning 06–12: 542'],['#FF9F0A','Afternoon 12–18: 563'],['#BF5AF2','Evening 18–23: 427']].map(([c,l]) => (
                  <span key={l} style={{ fontSize: 11, color: '#8A93A2', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 14, height: 14, borderRadius: 3, background: c, display: 'inline-block' }} /> {l}
                  </span>
                ))}
              </div>
            </Panel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Panel>
                <SecTitle color="#BF5AF2">Day of Week</SecTitle>
                <div style={{ height: 10 }} />
                <div id="dow-bars2" />
              </Panel>
              <Panel>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#8A93A2', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Key Timing Insights</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    ['☀️','Afternoon (12–18) is peak crime-discussion time at 34%'],
                    ['🌙','Night reports (23–06) are rare — only 2.9% of messages'],
                    ['📅','Mondays & Thursdays generate the most crime talk'],
                    ['😴','Sundays see 50% fewer reports than the weekday average'],
                    ['🚨','8am spike: residents reporting overnight incidents on waking'],
                  ].map(([icon, text]) => (
                    <div key={text} style={{ display: 'flex', gap: 10, fontSize: 12, color: '#8A93A2', lineHeight: 1.5 }}>
                      <span style={{ fontSize: 16 }}>{icon}</span>{text}
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
          </div>
          <Panel>
            <SecTitle color="#32ADE6">24-Hour Crime Activity Profile</SecTitle>
            <SecSub>Proportional height — one column per hour</SecSub>
            <div id="strip24" style={{ display: 'flex', height: 48, borderRadius: 8, overflow: 'hidden', gap: 1 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              {['00:00','06:00','12:00','18:00','23:00'].map(t => (
                <span key={t} style={{ fontSize: 10, color: '#48505F' }}>{t}</span>
              ))}
            </div>
          </Panel>
        </div>

        {/* ── HEATMAP ── */}
        <div style={{ display: tab === 'heatmap' ? 'flex' : 'none', flexDirection: 'column', gap: 16 }}>
          <Panel>
            <SecTitle color="#FF3B30">Monthly Crime Activity Heatmap</SecTitle>
            <SecSub>Hover over cells to see message counts · Note: 2018–2019 not in dataset</SecSub>
            <div id="heatmap-grid" />
            {/* Legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 10, color: '#8A93A2' }}>Less</span>
              {['#2A1A0A','#92400E','#F59E0B','#FF9F0A','#FF3B30'].map(c => (
                <span key={c} style={{ width: 14, height: 14, borderRadius: 3, background: c, display: 'inline-block' }} />
              ))}
              <span style={{ fontSize: 10, color: '#8A93A2' }}>More</span>
            </div>
          </Panel>

          {/* Peak month cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {[
              { month: 'March 2017',   count: 71, color: '#FF3B30', text: 'Highest single month — sustained CPF activity and armed robbery reports' },
              { month: 'March 2020',   count: 54, color: '#FF3B30', text: 'Early lockdown chaos — community security alerts and reported incidents' },
              { month: 'July 2021',    count: 53, color: '#FF9F0A', text: 'Unrest period — looting discussions and security mobilisation' },
              { month: 'March 2023',   count: 49, color: '#FF9F0A', text: 'Theft and scam surge during peak load shedding — opportunistic crime' },
              { month: 'January 2023', count: 34, color: '#FFD60A', text: 'Post-holiday crime wave combined with water and electricity outages' },
              { month: 'January 2017', count: 34, color: '#FFD60A', text: 'Strong start-of-year crime activity following high December 2016' },
            ].map(c => (
              <div key={c.month} style={{ background: '#13161E', border: '1px solid #1F2433', borderTop: `2px solid ${c.color}`, borderRadius: 14, padding: 18 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#E8EAF0', marginBottom: 4 }}>{c.month}</div>
                <div style={{ fontSize: 30, fontWeight: 900, color: c.color, fontFamily: 'monospace', marginBottom: 6 }}>{c.count}</div>
                <div style={{ fontSize: 12, color: '#8A93A2', lineHeight: 1.5 }}>{c.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 11, color: '#48505F' }}>
          Crime data derived from keyword analysis of 76,465 WhatsApp messages · Categories may overlap · * 2026 Jan–May only
        </div>
      </div>
    </div>
  );
}
