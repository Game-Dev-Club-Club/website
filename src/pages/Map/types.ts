export interface SchoolMarker {
    id: number;
    name: string;
    description: string;
    coordinates: [number, number];
    link: string;
}

export interface TooltipState {
    location: SchoolMarker | null;
    show: boolean;
}

export interface ViewBoxRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface ZoomParams {
    x: number;
    y: number;
    k: number;
    viewBox: ViewBoxRect; // the "true" SVG viewBox this transform is animating toward
}