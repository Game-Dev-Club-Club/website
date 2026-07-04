import { useRef, useEffect } from 'react';
import '../pages/Contact.css';

export interface SocialLink {
    name: string;
    url: string;
    color: string;
    orbitRadius: number;
    speed: number;
    startAngle: number;
    Icon: () => React.ReactElement;
}

export function OrbitPlanet({ social }: { social: SocialLink }) {
    const ringRef = useRef<HTMLDivElement>(null);
    const planetRef = useRef<HTMLAnchorElement>(null);

    console.log(social);

    const setPaused = (paused: boolean) => {
        const state = paused ? 'paused' : 'running';
        if (ringRef.current) ringRef.current.style.animationPlayState = state;
        if (planetRef.current) planetRef.current.style.animationPlayState = state;
    };

    const delay = `-${(social.startAngle / 360) * social.speed}s`;

    return (
        <div
            ref={ringRef}
            className="orbit-ring"
            style={{
                width: `${social.orbitRadius * 2}px`,
                height: `${social.orbitRadius * 2}px`,
                top: `calc(50% - ${social.orbitRadius}px)`,
                left: `calc(50% - ${social.orbitRadius}px)`,
                animationDuration: `${social.speed}s`,
                animationDelay: delay,
            }}
        >
            <a
                ref={planetRef}
                href={social.url}
                className="planet"
                style={{
                    animationDuration: `${social.speed}s`,
                    animationDelay: delay,
                }}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                aria-label={social.name}
                title={social.name}
            >
                <div className="planet-bubble no-cursor" style={{ background: social.color }}>
                    <social.Icon />
                </div>
                <span className="planet-label">{social.name}</span>
            </a>
        </div>
    );
}