# DreamArchive

DreamArchive is a surreal, interactive 3D web experience built with React 19, Three.js, and React Three Fiber (R3F). Designed for web developers, 3D graphics enthusiasts, and digital artists, the application transports users into a mysterious virtual archive space where they navigate an atmospheric sanctuary toward a floating central crystal monument. Featuring automated first-person camera movement, procedural head bobbing, cursor-driven parallax mouse looking, dynamic GLTF model streaming, post-processing bloom, reactive particle systems, and state-driven scene transitions, DreamArchive serves as a high-performance foundation for immersive web-based storytelling and digital archives.

---

## Key Features

- **3D Environment & Model Streaming**
  - Modular GLTF model preloading and scene mounting (`PillarsAndFloor.glb`, `Rocks.glb`, `PedestalAndCenterMid.glb`, `Crystal.glb`).
  - Automated world bounding box calculation to dynamically position player spawn and camera targets.
  - Multi-layered lighting setup combining ambient illumination, hemisphere lighting, directional key shadows (4K map size), and point lights.
  - Custom environment mapping (warehouse preset) coupled with deep distance fog (`#07070b`) for cinematic depth.

- **Interactive Crystal Mechanics & Animations**
  - Dynamic floating crystal levitation powered by sinusoidal vertical displacement and continuous Y-axis rotation.
  - Proximity-based activation sequence: arriving at the crystal triggers intensified floating height, rapid rotation, boosted light intensity (12 to 40 units), and amplified material emissive glow.

- **First-Person Camera Navigation**
  - Smooth automated camera walk controller (`AutoWalk`) heading towards world targets with frame-rate-independent damped interpolation (`MathUtils.damp`).
  - Mouse look system (`MouseLook`) translating viewport cursor offsets into smooth camera pitch and yaw movements.
  - Procedural walking motion generator (`HeadBob`) simulating horizontal sway, vertical bobbing, and camera roll when moving.

- **Visual Effects & Post-Processing**
  - Custom ambient dust particle system (`DustParticles`) rendering 500 orbital point particles that contract inward upon crystal activation.
  - Post-processing pipeline (`@react-three/postprocessing`) featuring ACES Filmic tone mapping and mipmap-blurred bloom.

- **State Management & UI Transitions**
  - Centralized Zustand stores isolating application scene state (`appStore`), crystal activation (`crystalStore`), asset preloading (`loaderStore`), and transition screens (`fadeStore`).
  - Animated preloader overlay (`LoaderOverlay`) with Framer Motion glow effects, real-time loading percentage, and reactive status messaging.
  - Full-screen animated fade overlay (`FadeOverlay`) providing smooth visual transitions between world interactions.

---

## Tech Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Language** | TypeScript (v6.0) | Strongly typed JavaScript targeting ES2023 |
| **Frontend Framework** | React 19 (`react`, `react-dom`) | Component framework for UI and scene mounting |
| **3D Rendering** | Three.js (`three`) | WebGL 3D graphics library |
| **React 3D Binding** | React Three Fiber (`@react-three/fiber`) | Declarative R3F wrapper for Three.js |
| **R3F Utilities** | Drei (`@react-three/drei`) | Pre-built helpers, asset loaders (`useGLTF`), and environment maps |
| **Post-Processing** | `@react-three/postprocessing` | Shader post-processing effects (Bloom, ToneMapping) |
| **State Management** | Zustand (`zustand`) | Lightweight reactive state stores |
| **UI & Animations** | Framer Motion (`framer-motion`), GSAP | Declarative UI animations and smooth interpolations |
| **Build Tool & Server** | Vite (`vite`, `@vitejs/plugin-react`) | Next-generation frontend tooling and HMR dev server |
| **Code Quality** | ESLint (`eslint`, `typescript-eslint`) | Code quality and React hooks linting |

---

## Project Structure Overview

```text
DreamArchive/
├── public/
│   └── models/
│       └── archive/
│           ├── Crystal.glb                 # Floating central crystal 3D model
│           ├── PedestalAndCenterMid.glb    # Pedestal & center architecture 3D model
│           ├── PillarsAndFloor.glb         # Surrounding pillars & floor mesh
│           └── Rocks.glb                   # Decorative terrain rock meshes
├── src/
│   ├── components/
│   │   ├── effects/
│   │   │   ├── DustParticles.tsx           # Custom 3D orbital dust particle effect
│   │   │   └── PostProcessing.tsx          # Bloom & ACES Filmic post-processing pipeline
│   │   ├── loader/
│   │   │   ├── Loader.tsx                  # Preloader lifecycle & progress connector
│   │   │   ├── LoaderOverlay.tsx           # Framer Motion animated loader UI overlay
│   │   │   ├── LoadingText.tsx             # Animated dot loading text component
│   │   │   └── ProgressBar.tsx             # Animated progress bar component
│   │   ├── player/
│   │   │   ├── AutoWalk.ts                 # Automated movement vector dampening logic
│   │   │   ├── FirstPersonCamera.tsx       # First-person view controller & frame loop
│   │   │   ├── HeadBob.ts                  # Sinusoidal head-bobbing calculations
│   │   │   ├── MouseLook.ts                # Viewport mouse cursor tracking & dampening
│   │   │   └── Player.tsx                  # Player camera wrapper & activation trigger
│   │   └── transitions/
│   │       └── FadeOverlay.tsx             # Full-screen fade transition overlay component
│   ├── constants/
│   │   └── scenes.ts                       # Scene enumeration definitions & TypeScript types
│   ├── scenes/
│   │   ├── ArchiveScene.tsx                # Main 3D Canvas scene composition
│   │   └── SceneManager.tsx                # Scene switching component
│   ├── store/
│   │   ├── appStore.ts                     # Active scene route state store
│   │   ├── crystalStore.ts                 # Crystal activation status & progress store
│   │   ├── fadeStore.ts                    # Full-screen fade transition state store
│   │   └── loaderStore.ts                  # Asset loading progress state store
│   ├── styles/
│   │   └── globals.css                     # Reset styles, font definitions, full-bleed canvas
│   ├── world/
│   │   └── archive/
│   │       ├── ArchiveEnvironment.tsx      # Scene environment map & fog parameters
│   │       ├── ArchiveLights.tsx           # Ambient, directional, rim & point lights
│   │       ├── ArchiveModels.tsx           # GLTF model preloading, rendering & animation
│   │       └── ArchiveWorld.tsx            # Composition component for lights, environment, models
│   ├── App.tsx                             # Application root component
│   └── main.tsx                            # React DOM entry point
├── .gitignore                              # Git exclusion rules
├── eslint.config.js                        # ESLint flat configuration
├── index.html                              # HTML shell with canvas root mount
├── package.json                            # Dependency definitions and scripts
├── tsconfig.json                           # Root TypeScript configuration
├── tsconfig.app.json                       # Client app TypeScript compilation settings
├── tsconfig.node.json                      # Node environment TypeScript settings
└── vite.config.ts                          # Vite build tool configuration
```

---

## Prerequisites

Before running DreamArchive locally, ensure you have the following installed:

- **Node.js**: `v18.0.0` or higher (tested on Node v20/v22/v24)
- **Package Manager**: `npm` (`v9.0.0` or higher) bundled with Node.js (or compatible alternatives `pnpm`, `yarn`, `bun`)
- **Browser**: Modern WebGL 2.0 supported web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, or Apple Safari) with hardware acceleration enabled.

---

## Setup Instructions

1. **Clone the Repository**`
   ```bash
   git clone https://github.com/Aniketbhil/DreamArchive.git
   cd DreamArchive
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   - DreamArchive runs purely client-side without external backend services or API keys.
   - **No `.env` file or environment variables are required** to run the application locally or in production.

4. **Database & Migrations**
   - Not applicable. All assets and state are managed statically via GLTF model files and local Zustand client stores.

---

## How to Run Locally

### 1. Development Server
Start the local Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

- **Default URL**: `http://localhost:5173`
- If port `5173` is occupied, Vite will automatically use the next open port.

### 2. Production Build
Compile TypeScript code and build minified production bundles:

```bash
npm run build
```

- Output assets will be generated in the `dist/` directory.

### 3. Production Preview
Locally preview the built production app from the `dist/` folder:

```bash
npm run preview
```

- **Default URL**: `http://localhost:4173`

---

## Architecture & State Overview

DreamArchive operates as a client-side Single Page Application (SPA). State management is decoupled from React component trees using **Zustand stores**:

- `useAppStore` ([src/store/appStore.ts]): Tracks `currentScene` (`loader`, `archive`, `dream1`, `dream2`, `dream3`, `credits`).
- `useCrystalStore` ([src/store/crystalStore.ts]): Manages `activated` flag and `activationProgress` value (`0.0` to `1.0`).
- `useLoaderStore` ([src/store/loaderStore.ts]): Tracks asset downloading `progress` percentage and `finished` status.
- `useFadeStore` ([src/store/fadeStore.ts]): Controls `visible` visibility state of the global black fade overlay.

---

## Testing & Quality Verification

- **TypeScript Compilation Check**
  ```bash
  npm run build
  ```
  Runs `tsc -b` to verify strict TypeScript type correctness across all components and stores.

- **ESLint Code Quality Audit**
  ```bash
  npm run lint
  ```
  Runs ESLint checks across all `.ts` and `.tsx` source files.

- **Manual Component Verification**
  - **Asset Loader**: Verified by inspecting GLTF download progress via Drei's `useProgress()` hook during initial page load.
  - **Camera Controller**: Verified player spawn point computation (`bounds.getSize`), forward dampening (`AutoWalk`), mouse tracking (`MouseLook`), and head bobbing (`HeadBob`).
  - **Crystal Interaction**: Verified position threshold triggers activation (`onReachedCrystal`), resulting in dynamic light and material emissive scaling.

---

## Deployment Notes

- **Static Hosting**: The application compiles to static HTML, JS, CSS, and GLB asset files in the `dist/` directory using `npm run build`.
- **Deployment Platforms**: Can be hosted directly on platforms such as Vercel, Netlify, Cloudflare Pages, GitHub Pages, or any web server (Nginx, Apache).
- **Server Configuration**: Ensure the hosting server serves static assets with proper headers for 3D binaries (`.glb` files served with `model/gltf-binary` or `application/octet-stream`) and fallbacks to `index.html` for client-side SPA routing.

---

## Known Limitations & Stubs

- **Future Scene Placeholders**: `SCENES` in `scenes.ts` defines constants for `DREAM1`, `DREAM2`, `DREAM3`, and `CREDITS`. Currently, `SceneManager.tsx` handles `LOADER` and `ARCHIVE` scenes; remaining scenes return `null` and are reserved for future environment expansions.
- **Pointer Lock**: Mouse look currently relies on normalized viewport mouse coordinates rather than browser Pointer Lock API.

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## Contributors

- Aniket Bhil 
- Krehant Gajjar 
