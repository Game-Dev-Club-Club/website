import Matter from 'matter-js';

import type { LogoPhysics, LogoShape } from './types';

const { Engine, Composite, Bodies, Body, Mouse, MouseConstraint } = Matter;

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const SIM = {
  stepMs: 1000 / 60,
  maxSubsteps: 5,
  gravity: 1,
  positionIterations: 8
};

const MATERIAL = {
  restitution: 0.4,
  friction: 0.25,
  frictionAir: 0.015,
  density: 0.001
};

const WALL_THICKNESS = 200;
const WALL_LENGTH = 20000;

// World width per breakpoint
const BREAKPOINTS = [
  { upTo: 768, worldWidth: 600 },
  { upTo: 1200, worldWidth: 1000 },
  { upTo: Infinity, worldWidth: 1400 }
];

// The last breakpoint is unbounded, so there is always a match.
const worldWidthFor = (viewportWidth: number): number =>
  BREAKPOINTS.find((bp) => viewportWidth < bp.upTo)!.worldWidth;

// ---------------------------------------------------------------------------
// Geometry helpers
// ---------------------------------------------------------------------------

const rotate = ({ x, y }: Matter.Vector, angle: number): Matter.Vector => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return { x: x * cos - y * sin, y: x * sin + y * cos };
};

const boundingRadius = ({ bounds }: Matter.Body): number =>
  Math.max(bounds.max.x - bounds.min.x, bounds.max.y - bounds.min.y) / 2;

// ---------------------------------------------------------------------------
// Building a logo body
//
// spec.shapes are normalized against sprite WIDTH.
// ---------------------------------------------------------------------------

const DEFAULT_SHAPE: LogoShape = { type: 'circle', cx: 0.5, cy: 0.5, r: 0.5 };

const createPart = (shape: LogoShape, width: number): Matter.Body =>
  shape.type === 'circle'
    ? Bodies.circle(shape.cx * width, shape.cy * width, shape.r * width)
    : Bodies.rectangle(
        shape.x * width,
        shape.y * width,
        shape.w * width,
        shape.h * width,
        {
          angle: shape.angle ?? 0,
          chamfer: shape.rx ? { radius: shape.rx * width } : undefined
        }
      );

interface PitItem {
  body: Matter.Body;
  element: HTMLImageElement | null;
  width: number;
  height: number;
  offset: Matter.Vector;
  radius: number;
}

// Body.create re-centers on the composite center of mass. The sprite's own
// center sits at (width/2, height/2) in that same local space, so this is
// how far the image must be pulled back off the body origin.
const spriteOffset = (body: Matter.Body, width: number, height: number): Matter.Vector => ({
  x: body.position.x - width / 2,
  y: body.position.y - height / 2
});

const createLogo = (
  spec: LogoPhysics,
  width: number,
  element: HTMLImageElement | null
): PitItem => {
  const height = width / spec.aspect;
  const shapes = spec.shapes ?? [DEFAULT_SHAPE];
  const parts = shapes.map((shape) => createPart(shape, width));
  const body = Body.create({ parts, ...MATERIAL });

  return {
    body,
    element,
    width,
    height,
    offset: spriteOffset(body, width, height),
    radius: boundingRadius(body)
  };
};

const scatter = (logo: PitItem, worldWidth: number, worldHeight: number): void => {
  Body.setPosition(logo.body, {
    x: worldWidth * Math.random(),
    y: worldHeight * Math.random()
  });
  Body.setAngle(logo.body, (Math.random() - 0.5) * 0.6);
};

// ---------------------------------------------------------------------------
// Walls
//
// Walls are oversized so that only their position changes on resize
// ---------------------------------------------------------------------------

type Walls = Record<'top' | 'bottom' | 'left' | 'right', Matter.Body>;

const createWalls = (): Walls => ({
  top: Bodies.rectangle(0, 0, WALL_LENGTH, WALL_THICKNESS, { isStatic: true }),
  bottom: Bodies.rectangle(0, 0, WALL_LENGTH, WALL_THICKNESS, { isStatic: true }),
  left: Bodies.rectangle(0, 0, WALL_THICKNESS, WALL_LENGTH, { isStatic: true }),
  right: Bodies.rectangle(0, 0, WALL_THICKNESS, WALL_LENGTH, { isStatic: true })
});

const positionWalls = (walls: Walls, worldWidth: number, worldHeight: number): void => {
  Body.setPosition(walls.top, { x: worldWidth / 2, y: -WALL_THICKNESS / 2 });
  Body.setPosition(walls.bottom, { x: worldWidth / 2, y: worldHeight + WALL_THICKNESS / 2 });
  Body.setPosition(walls.left, { x: -WALL_THICKNESS / 2, y: worldHeight / 2 });
  Body.setPosition(walls.right, { x: worldWidth + WALL_THICKNESS / 2, y: worldHeight / 2 });
};

// ---------------------------------------------------------------------------
// Pointer input
// ---------------------------------------------------------------------------

type MouseListeners = Record<
  'mousemove' | 'mousedown' | 'mouseup' | 'mousewheel',
  EventListener
>;

type PitMouse = Matter.Mouse & MouseListeners;

const MOUSE_EVENTS = [
  ['mousemove', 'mousemove'],
  ['mousedown', 'mousedown'],
  ['mouseup', 'mouseup'],
  ['touchmove', 'mousemove'],
  ['touchstart', 'mousedown'],
  ['touchend', 'mouseup']
] as const;

const attachPointer = (engine: Matter.Engine, element: HTMLElement) => {
  const mouse = Mouse.create(element) as PitMouse;
  const constraint = MouseConstraint.create(engine, {
    mouse,
    constraint: {
      stiffness: 0.01,
      damping: 0.1,
      render: { visible: false }
    }
  });
  Composite.add(engine.world, constraint);

  // Let the page keep scrolling over the pit
  element.removeEventListener('wheel', mouse.mousewheel);
  element.removeEventListener('DOMMouseScroll', mouse.mousewheel);

  return {
    // Matter reads raw element coordinates so this is needed to recenter drag
    setScale(scale: number) {
      Mouse.setScale(mouse, { x: 1 / scale, y: 1 / scale });
    },
    detach() {
      for (const [event, handler] of MOUSE_EVENTS) {
        element.removeEventListener(event, mouse[handler]);
      }
    }
  };
};

// ---------------------------------------------------------------------------
// Fixed-timestep loop
// ---------------------------------------------------------------------------

interface LoopHandlers {
  step: (delta: number) => void;
  draw: () => void;
}

const createLoop = ({ step, draw }: LoopHandlers) => {
  let frameId = 0;
  let accumulated = 0;
  let previous = performance.now();

  const resync = () => {
    if (document.hidden) return;
    previous = performance.now();
    accumulated = 0;
  };

  const tick = (now: number) => {
    frameId = requestAnimationFrame(tick);

    accumulated = Math.min(
      accumulated + (now - previous),
      SIM.stepMs * SIM.maxSubsteps
    );
    previous = now;

    while (accumulated >= SIM.stepMs) {
      step(SIM.stepMs);
      accumulated -= SIM.stepMs;
    }
    draw();
  };

  return {
    start() {
      document.addEventListener('visibilitychange', resync);
      frameId = requestAnimationFrame(tick);
    },
    stop() {
      cancelAnimationFrame(frameId);
      document.removeEventListener('visibilitychange', resync);
    }
  };
};

// ---------------------------------------------------------------------------
// Ball pit
// ---------------------------------------------------------------------------

export interface BallPitOptions {
  container: HTMLElement;                 // clipping box, sized by CSS
  world: HTMLElement;                     // scaled layer the sprites live in
  elements: (HTMLImageElement | null)[];  // sprites, in the same order as `logos`
  logos: LogoPhysics[];
}

export interface BallPitHandle {
  destroy(): void;
}

export const createBallPit = ({
  container,
  world,
  elements,
  logos
}: BallPitOptions): BallPitHandle => {
  const engine = Engine.create();
  engine.gravity.y = SIM.gravity;
  engine.enableSleeping = true;
  engine.positionIterations = SIM.positionIterations;

  const walls = createWalls();
  Composite.add(engine.world, Object.values(walls));

  const pointer = attachPointer(engine, container);

  let worldWidth = 0;
  let worldHeight = 0;
  let items: PitItem[] = [];

  const populate = () => {
    for (const item of items) Composite.remove(engine.world, item.body);

    items = logos.map((spec, i) =>
      createLogo(spec, spec.scale * worldWidth, elements[i])
    );

    for (const item of items) {
      scatter(item, worldWidth, worldHeight);
      Composite.add(engine.world, item.body);
      if (!item.element) continue;
      item.element.style.width = `${item.width}px`;
      item.element.style.height = `${item.height}px`;
    }
  };

  const clampIntoWorld = () => {
    for (const { body, radius } of items) {
      if (body.position.y <= worldHeight - radius) continue;
      Body.setPosition(body, { x: body.position.x, y: worldHeight - radius });
      Body.setVelocity(body, { x: 0, y: 0 });
      Body.setAngularVelocity(body, 0);
    }
  };

  const layout = () => {
    const viewportWidth = container.clientWidth;
    const viewportHeight = container.clientHeight;
    if (!viewportWidth || !viewportHeight) return;

    const nextWidth = worldWidthFor(viewportWidth);
    const crossedBreakpoint = nextWidth !== worldWidth;
    worldWidth = nextWidth;

    const scale = viewportWidth / worldWidth;
    worldHeight = viewportHeight / scale;

    world.style.width = `${worldWidth}px`;
    world.style.height = `${worldHeight}px`;
    world.style.transform = `scale(${scale})`;
    pointer.setScale(scale);

    positionWalls(walls, worldWidth, worldHeight);
    if (crossedBreakpoint) populate();
    else clampIntoWorld();
  };

  const draw = () => {
    for (const { body, element, offset } of items) {
      if (!element) continue;
      const { x, y } = body.position;
      const shift = rotate(offset, body.angle);
      element.style.transform =
        `translate3d(${x - shift.x}px, ${y - shift.y}px, 0) ` +
        `translate(-50%, -50%) rotate(${body.angle}rad)`;
    }
  };

  const loop = createLoop({
    step: (delta) => Engine.update(engine, delta),
    draw
  });

  const observer = new ResizeObserver(layout);
  observer.observe(container);

  layout();
  populate();
  loop.start();

  return {
    destroy() {
      loop.stop();
      observer.disconnect();
      pointer.detach();
      Composite.clear(engine.world, false);
      Engine.clear(engine);
      items = [];
    }
  };
};
