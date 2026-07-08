// src/globals.d.ts (or anywhere included by tsconfig)
import { ThreeElements } from "@react-three/fiber";

declare module "react/jsx-runtime" {
    namespace JSX {
        interface IntrinsicElements extends ThreeElements { }
    }
}
