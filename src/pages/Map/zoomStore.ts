let zoomK = 1;
let listeners: ((v: number) => void)[] = [];

export function setZoomK(v: number) {
    zoomK = v;
    listeners.forEach(fn => fn(v));
}

export function subscribeZoom(fn: (v: number) => void) {
    listeners.push(fn);
    fn(zoomK);

    return () => {
        listeners = listeners.filter(l => l !== fn);
    };
}