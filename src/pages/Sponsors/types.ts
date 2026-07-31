export interface CircleShape {
  type: 'circle';
  cx: number;      // center
  cy: number;
  r: number;       // radius
}

export interface RectShape {
  type: 'rect';
  x: number;       // center
  y: number;
  w: number;
  h: number;
  angle?: number;  // radians, unrotated if unset
  rx?: number;     // corner radius, square corners if unset
}

export type LogoShape = CircleShape | RectShape;

export interface LogoPhysics {
  scale: number;         // sprite width as a fraction of the world width
  aspect: number;        // width / height, sets the sprite height
  shapes?: LogoShape[];  // collider, defaults to a circle filling the sprite
}

export interface Logo extends LogoPhysics {
  id: string;
  src: string;
  alt: string;
}

// The info shown beside the jar
export interface SponsorDetails {
  name: string;
  role: string;
  description: string;
}

export interface SponsorSpec extends Omit<Logo, 'src'> {
  file: string;          // file name inside src/assets/logos/, case-sensitive
  info: SponsorDetails;
}

export interface Sponsor extends Logo {
  info: SponsorDetails;
}
