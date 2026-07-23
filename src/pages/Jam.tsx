import { useEffect, useMemo, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  JAM_EDITIONS,
  getStatus,
  jamTime,
  nextBoundary,
  type JamEdition,
  type JamStatus,
} from './jams';
import './Jam.css';

/* Jams are loaded from `assets/jams.json`,
   read `jams.ts` for instructions on how to add/edit a jam */

/* ------------------------------------------------------------------
   Helpers
------------------------------------------------------------------- */

// clock counts down to start time or submission end time
function getCountdownTarget(jam: JamEdition, status: JamStatus): number | null {
  return status === 'announced' ? jamTime(jam.startsAt) : jamTime(jam.endsAt);
}

// re-renders when jam starts or finishes
function useBoundaryRefresh(jam: JamEdition | undefined) {
  const [tick, bump] = useState(0);

  useEffect(() => {
    if (!jam) return;
    const next = nextBoundary(jam);
    if (next === null) return;
    const delay = Math.min(next - Date.now() + 1000, 2 ** 31 - 1);
    const id = window.setTimeout(() => bump((n) => n + 1), delay);
    return () => window.clearTimeout(id);
  }, [jam, tick]);
}

interface TimeLeft { days: number; hours: number; mins: number; secs: number; done: boolean; }

function getTimeLeft(target: number): TimeLeft {
  const diff = target - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0, done: true };
  const secs = Math.floor(diff / 1000) % 60;
  const mins = Math.floor(diff / 1000 / 60) % 60;
  const hours = Math.floor(diff / 1000 / 60 / 60) % 24;
  const days = Math.floor(diff / 1000 / 60 / 60 / 24);
  return { days, hours, mins, secs, done: false };
}

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

/* ------------------------------------------------------------------
   Countdown
------------------------------------------------------------------- */

function Countdown({ target, doneLabel }: { target: number; doneLabel: string }) {
  const [left, setLeft] = useState<TimeLeft>(() => getTimeLeft(target));

  useEffect(() => {
    const tick = () => setLeft(getTimeLeft(target));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const cells: { label: string; value: string }[] = [
    { label: 'DAYS', value: pad(left.days) },
    { label: 'HRS', value: pad(left.hours) },
    { label: 'MIN', value: pad(left.mins) },
    { label: 'SEC', value: pad(left.secs) },
  ];

  if (left.done) {
    return (
      <div className="font-bebas text-3xl tracking-widest text-(--pale)">
        {doneLabel}
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2 sm:gap-3">
      {cells.map((c, i) => (
        <div key={c.label} className="flex items-end gap-2 sm:gap-3">
          <div className="jam-clock-cell flex flex-col items-center">
            <span className="font-bebas text-4xl sm:text-5xl leading-none text-(--pale) tabular-nums">
              {c.value}
            </span>
            <span className="font-cascadia text-[0.6rem] tracking-[0.2em] text-(--pale)/80 mt-1">
              {c.label}
            </span>
          </div>
          {i < cells.length - 1 && (
            <span className="font-bebas text-3xl sm:text-4xl text-(--pale)/40 pb-3">:</span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------
   Join meter — animates toward the goal on mount / selection.
   A jam with no `goal` just shows the count.
------------------------------------------------------------------- */

function JoinMeter({ joined, goal }: { joined: number; goal?: number }) {
  const pct = goal ? Math.min(100, Math.round((joined / goal) * 100)) : 0;
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const id = window.setTimeout(() => setWidth(pct), 120);
    return () => window.clearTimeout(id);
  }, [pct]);

  if (!goal) {
    return (
      <p className="font-bebas text-2xl text-(--pale) tracking-wide">
        {joined}
        <span className="text-(--pale)/60"> joined</span>
      </p>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-2">
        <span className="font-bebas text-2xl text-(--pale) tracking-wide">
          {joined}
          <span className="text-(--pale)/60"> / {goal} joined</span>
        </span>
        <span className="font-cascadia text-sm text-(--pale)/90">{pct}%</span>
      </div>
      <div className="h-5 w-full rounded-full bg-(--blackberry)/30 overflow-hidden ring-1 ring-(--pale)/30">
        <div
          className="jam-meter-fill h-full rounded-full"
          style={{ width: `${width}%` }}
        />
      </div>
      <p className="font-cascadia text-xs text-(--pale)/80 mt-2">
        {goal - joined > 0
          ? `Just ${goal - joined} more devs to hit the goal.`
          : `Goal has been reached!`}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------
   Theme word — letters pop in
------------------------------------------------------------------- */

function ThemeWord({ text }: { text: string }) {
  const chars = useMemo(() => text.split(''), [text]);
  return (
    <h2 className="jam-theme-display font-hiruko text-(--blackberry) leading-none text-5xl sm:text-7xl md:text-8xl text-center break-words">
      {chars.map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          className="jam-theme-char"
          style={{ animationDelay: `${i * 0.04}s` }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </h2>
  );
}

/* ------------------------------------------------------------------
   Hero — adapts to announced / running vs finished editions
------------------------------------------------------------------- */

function Hero({ jam, status }: { jam: JamEdition; status: JamStatus }) {
  const announced = status === 'announced';
  const active = status === 'in progress';
  // announced and running jams both count down and take sign-ups
  const counting = announced || active;
  const target = getCountdownTarget(jam, status);
  // only show second part when there is a time to count down to
  const statusLabel = announced
    ? target !== null
      ? 'Upcoming — the jam starts in'
      : 'Upcoming'
    : active
    ? target !== null
      ? 'Live now — submissions close in'
      : 'Live now'
    : 'Wrapped — the results are in';
  // only show stats if data is filled in
  const stats = jam.stats;
  const statGrid = stats ? (
    <div className="grid grid-cols-3 gap-6 sm:gap-10">
      <Stat value={stats.participants} label="DEVS" />
      <Stat value={stats.submissions} label="GAMES" />
      <Stat value={stats.ratings} label="RATINGS" />
    </div>
  ) : null;
  const winner = stats ? (
    <p className="font-cascadia text-sm text-(--pale)">
      Winner: <span className="font-bebas text-xl text-(--pale) tracking-wide">{stats.topGame}</span>
      <span className="text-(--pale)/70"> by {stats.topAuthor}</span>
    </p>
  ) : null;

  return (
    <motion.div
      key={jam.id}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.34, 1.2, 0.64, 1] }}
    >
      {/* ---- green status / timer strip ---- */}
      <div
        className="relative rounded-2xl px-6 py-6 sm:px-10 sm:py-8 shadow-xl flex flex-col items-center gap-5 text-center"
        style={{ background: 'linear-gradient(135deg, var(--verdant), var(--leaf))' }}
      >
        <div className="flex items-center gap-2">
          {active && <span className="jam-live-dot h-3 w-3 rounded-full bg-(--strawberry2)" />}
          <span className="font-cascadia text-sm uppercase tracking-[0.25em] text-(--pale)">
            {statusLabel}
          </span>
        </div>

        {counting ? (
          target !== null ? (
            <Countdown
              target={target}
              doneLabel={announced ? 'STARTING NOW' : 'SUBMISSIONS CLOSED'}
            />
          ) : (
            <div className="font-capriola text-2xl text-(--pale) tracking-wide">
              Dates coming soon
            </div>
          )
        ) : (
          statGrid
        )}

        {(counting || winner) && (
          <div className="w-full max-w-xl mt-1">
            {counting ? <JoinMeter joined={jam.joined} goal={jam.goal} /> : winner}
          </div>
        )}
      </div>

      {/* ---- orange THEME hero + straddling join pill ---- */}
      <div
        className="relative rounded-2xl mt-5 px-6 pt-10 pb-20 sm:px-10 sm:pt-14 sm:pb-24 shadow-2xl flex flex-col items-center"
        style={{ background: 'linear-gradient(160deg, var(--orange), #ffb347)' }}
      >
        <span className="font-cascadia text-sm uppercase tracking-[0.3em] text-(--blackberry)/70 mb-4">
          {counting ? 'This jam\u2019s theme' : 'The theme was'}
        </span>

        <ThemeWord text={jam.theme} />

        <p className="font-capriola text-(--blackberry)/80 text-center max-w-xl mt-6 text-sm sm:text-base">
          {announced
            ? 'Sign up on itch now so you\u2019re ready when the clock starts.'
            : active
            ? 'Make a game in 48 hours.'
            : 'See what the game devs were able to make on our itch.'}
        </p>

        {/* itch CTA - "join" while announced or running, "play" once wrapped */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 z-20">
          <a
            href={jam.itchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="jam-join-btn no-cursor block rounded-2xl px-8 py-5 text-center"
            style={{ background: 'linear-gradient(180deg, var(--ripe), #c9e04a)' }}
          >
            <span className="font-bebas text-2xl sm:text-3xl tracking-wide text-(--blackberry)">
              {counting ? 'JOIN ON ITCH' : 'PLAY THE ENTRIES'}
            </span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-bebas text-4xl sm:text-5xl leading-none text-(--pale) tabular-nums">
        {value.toLocaleString()}
      </span>
      <span className="font-cascadia text-[0.6rem] tracking-[0.2em] text-(--pale)/80 mt-1">
        {label}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------
   Timeline edition card with expanding circle reveal
------------------------------------------------------------------- */

interface TimelineCardProps {
  jam: JamEdition;
  selected: boolean;
  status: JamStatus;
  onSelect: () => void;
  delay: number;
}

function TimelineCard({ jam, selected, status, onSelect, delay }: TimelineCardProps) {
  // announced and running jams show sign-up numbers, completed ones show results
  const counting = status !== 'completed';
  // a completed jam with no stats does not render results
  const stats = jam.stats;
  // first line under the theme
  const summary = counting
    ? `${jam.joined} joined`
    : stats
    ? `${stats.submissions} games · ${stats.participants} devs`
    : null;
  // second line, shown under the theme on mobile and inside the hover reveal
  const spotsLeft = jam.goal ? Math.max(0, jam.goal - jam.joined) : 0;
  const detail = counting
    ? !jam.goal
      ? 'Sign-ups open'
      : spotsLeft > 0
      ? `${spotsLeft} spots left`
      : 'Goal reached!'
    : stats
    ? `${stats.participants} creators`
    : null;
  const containerRef = useRef<HTMLButtonElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0, r: 0 });
  const current = useRef({ x: 0, y: 0, r: 0 });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    setIsMobile(mq.matches);
    const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    let frame: number;

    const animate = () => {
      // Position tracking
      const posLerp = 0.1;
      current.current.x += (target.current.x - current.current.x) * posLerp;
      current.current.y += (target.current.y - current.current.y) * posLerp;

      // Radius: slow grow, fast shrink
      const isGrowing = target.current.r > 0;
      const radiusLerp = isGrowing ? 0.03 : 0.15;
      current.current.r += (target.current.r - current.current.r) * radiusLerp;

      // Apply clip path
      if (revealRef.current) {
        revealRef.current.style.clipPath = `circle(${current.current.r}px at ${current.current.x}px ${current.current.y}px)`;
      }

      frame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frame);
  }, [isMobile]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    target.current.x = e.clientX - rect.left;
    target.current.y = e.clientY - rect.top;
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (isMobile || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    current.current.x = startX;
    current.current.y = startY;
    target.current.x = startX;
    target.current.y = startY;
    target.current.r = 300; // Expand to reveal
  };

  const handleMouseLeave = () => {
    target.current.r = 0; // Shrink back
  };

  return (
    <motion.button
      ref={containerRef}
      type="button"
      onClick={onSelect}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.4, delay, ease: [0.34, 1.2, 0.64, 1] }}
      className={`jam-edition-card no-cursor relative shrink-0 w-44 text-left rounded-xl p-4 ring-2 overflow-hidden ${
        selected ? 'ring-(--ripe)' : 'ring-transparent'
      }`}
      style={{ background: selected ? 'var(--pale)' : 'rgba(255,247,206,0.14)' }}
    >
      {/* Base layer */}
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <span
            className={`font-bebas text-xl tracking-wide ${
              selected ? 'text-(--blueberry)' : 'text-(--pale)'
            }`}
          >
            #{pad(jam.number)}
          </span>
          {status === 'announced' ? (
            <span className={`font-cascadia text-[0.6rem] uppercase tracking-widest ${selected ? 'text-(--grape)' : 'text-(--pale)/60'}`}>
              soon
            </span>
          ) : status === 'in progress' ? (
            <span className="flex items-center gap-1">
              <span className="jam-live-dot h-2 w-2 rounded-full bg-(--strawberry2)" />
              <span className={`font-cascadia text-[0.6rem] uppercase tracking-widest ${selected ? 'text-(--strawberry1)' : 'text-(--strawberry3)'}`}>
                live
              </span>
            </span>
          ) : (
            <span className={`font-cascadia text-[0.6rem] uppercase tracking-widest ${selected ? 'text-(--blueberry)/60' : 'text-(--pale)/60'}`}>
              done
            </span>
          )}
        </div>

        <p className={`font-hiruko text-lg leading-tight mt-2 ${selected ? 'text-(--blackberry)' : 'text-(--pale)'}`}>
          {jam.theme}
        </p>

        {summary && (
          <p className={`font-cascadia text-[0.7rem] mt-3 ${selected ? 'text-(--blueberry)/70' : 'text-(--pale)/70'}`}>
            {summary}
          </p>
        )}

        {isMobile && detail && (
          <p className={`font-cascadia text-[0.7rem] mt-1 ${selected ? 'text-(--blueberry)/70' : 'text-(--pale)/70'}`}>
            {detail}
          </p>
        )}
      </div>

      {/* Reveal layer (expands on hover, desktop only) */}
      {!isMobile && (
        <div
          ref={revealRef}
          className="absolute inset-0 flex items-center justify-center p-4 z-20 pointer-events-none"
          style={{ clipPath: 'circle(0px at 0px 0px)', background: 'rgba(70, 40, 89, 0.95)' }}
        >
          <div className="text-center">
            <p className="font-bebas text-sm text-(--pale) mb-2">#{pad(jam.number)}</p>
            <p className="font-hiruko text-base text-(--ripe) leading-tight">{jam.theme}</p>
            {detail && <p className="font-cascadia text-xs text-(--pale) mt-2">{detail}</p>}
          </div>
        </div>
      )}
    </motion.button>
  );
}

/* ------------------------------------------------------------------
   Timeline archive — selecting an edition swaps the hero
------------------------------------------------------------------- */

function Timeline({
  editions,
  selectedId,
  onSelect,
}: {
  editions: JamEdition[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      className="relative rounded-2xl mt-6 px-5 pt-14 pb-7 sm:px-8 shadow-2xl"
      style={{ background: 'linear-gradient(160deg, var(--blueberry), var(--grape))' }}
    >
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="font-bebas text-2xl sm:text-3xl tracking-wide text-(--pale)">
          JAM TIMELINE
        </h3>
        <span className="font-cascadia text-xs text-(--pale)/70 hidden sm:block">
          tap an edition to relive it &rarr;
        </span>
      </div>

      <div className="jam-timeline-scroll flex gap-4 overflow-x-auto pb-3 -mx-1 px-1">
        {editions.map((jam, i) => (
          <TimelineCard
            key={jam.id}
            jam={jam}
            selected={jam.id === selectedId}
            status={getStatus(jam)}
            onSelect={() => onSelect(jam.id)}
            delay={i * 0.06}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Page
------------------------------------------------------------------- */

function Jam() {
  // null until an edition is picked, live jam is the default
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // default view: whatever is running, or next one announced, or most recent edition
  const liveJam =
    JAM_EDITIONS.find((j) => getStatus(j) === 'in progress') ??
    JAM_EDITIONS.find((j) => getStatus(j) === 'announced') ??
    JAM_EDITIONS[JAM_EDITIONS.length - 1];
  const selected = JAM_EDITIONS.find((j) => j.id === selectedId) ?? liveJam;

  useBoundaryRefresh(selected);

  return (
    <div className="relative z-10 w-full flex justify-center">
      <div className="w-full max-w-screen-4xl bg-(--verdant-faded) py-8 px-4 sm:px-8 shadow-2xl overflow-hidden">
        <div className="relative z-10 w-full flex flex-col bg-white py-8 px-4 sm:px-8 shadow-2xl">

          {!selected ? (
            <div className="flex flex-col items-center text-center py-24">
              <p className="font-capriola text-(--blueberry)">
                No jams to show yet, check back soon!
              </p>
            </div>
          ) : (
            <>
              {/* header */}
              <div className="flex flex-col items-center text-center mb-6">
                <span className="font-cascadia text-xs uppercase tracking-[0.35em] text-(--grape)">
                  game dev club club presents
                </span>
                <h1 className="jam-heading-main font-hiruko text-4xl sm:text-6xl text-(--blackberry) mt-2">
                  GDCC JAM #{pad(selected.number)}
                </h1>
                <p className="font-capriola text-(--blueberry) mt-1">{selected.title}</p>
              </div>

              <Hero jam={selected} status={getStatus(selected)} />

              <Timeline editions={JAM_EDITIONS} selectedId={selected.id} onSelect={setSelectedId} />

              <p className="font-cascadia text-xs sm:text-sm text-(--grape)/80 text-center mt-5 max-w-2xl mx-auto">
                Scroll the timeline to see all the game jams brought to you by GDCC.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Jam;