# 🎓 College Yatri - 3D Fullstack Student Portfolio

A portfolio website crafted specifically for student software engineers, builders, and college innovators.

---

## 🌟 Highlights & Key Features

1. **3D Interactive Canvas (Three.js WebGL)**:
   - Dynamic geometric core (nested wireframe Icosahedron & glowing Torus Knot).
   - Orbiting satellite polyhedra representing core tech pillars.
   - Mouse cursor raycasting parallax: the camera, lighting, and 1,200+ particle stardust constellation tilt in real-time as you move the cursor.
   - Dynamic theme integration: lights and particle colors synchronize when switching themes!

2. **3D Interactive Tilt Cards**:
   - Realistic 3D perspective mouse tilt (`transform: perspective(1000px) rotateX(...) rotateY(...) scale3d(...)`) with dynamic glare tracking.
   - Categorized project filtering (`All`, `Fullstack`, `AI / ML`, `3D WebGL`).

3. **Multi-Theme Engine**:
   - **Dark Mode**: Cosmic Deep Space & Cyan glow (default).
   - **Light Mode**: Clean Minimalist Slate & Electric Indigo.
   - **Cyber Matrix Mode**: Midnight Obsidian & Matrix Emerald Green.
   - Persisted across reloads in `localStorage`.

4. **Fullstack Contact & Collaboration Hub**:
   - Frontend form with real-time feedback, field validation, and animated state transitions.
   - Fullstack REST API endpoint `POST /api/contact` storing message dispatches to `data/messages.json`.
   - Offline fallback: If run without backend server, seamlessly saves submissions to browser `localStorage` and alerts the user.

5. **Interactive Academic & Technical Resume**:
   - Glassmorphism modal viewer with ESC key, backdrop dismiss, and clean print/save to PDF styling.
   - Highlights CGPA (9.2), coursework, hackathon victories, and student leadership roles.

6. **Animated Performance Metrics**:
   - Smooth numerical counter easing on scroll using `IntersectionObserver`.

7. **Responsive & Mobile-First**:
   - Collapsible mobile navigation drawer, fluid typography with `clamp()`, and touch-friendly controls.

---

## 📂 Project Architecture

```
Antigravity web dev/
├── server.js              # Fullstack Node/Express server (Dual-Engine: Native HTTP & Express)
├── package.json           # Project metadata & start scripts
├── data/
│   └── messages.json      # JSON datastore for contact submissions
├── public/
│   ├── index.html         # Main semantic, accessible, SEO-friendly HTML5
│   ├── css/
│   │   └── style.css      # Custom design system, 3D cards, themes & glassmorphism
│   ├── js/
│   │   ├── three-scene.js # Three.js 3D WebGL hero interactive scene
│   │   └── app.js         # Theme toggle, tilt physics, project loader, contact API
│   └── data/
│       └── projects.json  # Curated student portfolio project data
└── README.md              # Project documentation & guide
```

---

## 🚀 How to Run the Project

### Option A: Direct Browser Preview (Instant - Zero Installation)
1. Navigate to the `public/` folder.
2. Double-click [index.html](file:///c:/Users/Sadaan%20Nasim/OneDrive/Antigravity%20web%20dev/public/index.html) to open it in Chrome, Edge, Firefox, or Brave.
3. Everything (3D Three.js canvas, theme switcher, 3D tilt cards, resume modal) works right out of the box!

### Option B: Fullstack Server Mode (With Node.js)
If Node.js is installed or once you install it (`winget install OpenJS.NodeJS.LTS`):
```bash
# 1. Start the server (Zero external dependencies needed!)
node server.js

# 2. Open in browser:
http://localhost:3000
```

---

## 🛠️ Customization Guide

- **Change Display Name or Title**: Open [index.html](file:///c:/Users/Sadaan%20Nasim/OneDrive/Antigravity%20web%20dev/public/index.html) and search for `College Yatri`.
- **Add / Edit Projects**: Open [projects.json](file:///c:/Users/Sadaan%20Nasim/OneDrive/Antigravity%20web%20dev/public/data/projects.json) and modify project titles, tags, and highlights.
- **Update Contact Info**: Edit the email and social links in the `#contact` section of [index.html](file:///c:/Users/Sadaan%20Nasim/OneDrive/Antigravity%20web%20dev/public/index.html).
- **Customize 3D Visuals**: Modify geometry or lighting parameters in [three-scene.js](file:///c:/Users/Sadaan%20Nasim/OneDrive/Antigravity%20web%20dev/public/js/three-scene.js).

