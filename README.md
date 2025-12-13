# Generative UI Portfolio ✨

An experimental portfolio where content spawns as **draggable sticker cards** based on text commands. Type, create, and arrange your story.

## 🎨 Design Philosophy

Inspired by:
- **Glassmorphism** - Frosted glass UI elements with blur effects
- **Geometric Stickers** - Minimalist shapes (circles, squares, diamonds, organic blobs)
- **Generative Interface** - Content appears on demand via natural language

## ⚡ Features

### 1. **Magic Input** (Text Editor UI)
- Glassmorphism toolbar with formatting controls
- Natural language command input
- Execute with button or `⌘ + Enter`
- Quick command buttons

### 2. **Draggable Stickers**
Each sticker type has unique geometry:
- **Projects** → Blue circles (round perfection)
- **Skills** → Purple rounded squares (structured creativity)
- **Contact** → Green diamonds (sharp connections)
- **About** → Orange organic blobs (human touch)

### 3. **Command System**
Type natural commands:
```
projects     → Spawn 3 project stickers
skills       → Spawn 3 skill stickers
about        → Spawn about sticker
contact      → Spawn contact stickers
clear        → Clear all stickers
surprise     → Random sticker
[any text]   → Custom sticker with your text
```

### 4. **Physics & Interaction**
- **Drag** - Grab and move stickers anywhere
- **Spring animations** - Bouncy, playful motion
- **Spawn effects** - Scale + rotate entrance
- **Hover states** - Subtle scale and rotation
- **Shadows** - Animated glow effects

## 🛠️ Tech Stack

- **Next.js 16** (App Router)
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Physics & animations
- **Lucide React** - Icons

## 🏗️ Project Structure

```
components/
  ├── MagicInput.tsx       # Glassmorphism text editor
  └── StickerCard.tsx      # Draggable sticker with shapes

app/
  ├── page.tsx             # Main canvas with spawn logic
  ├── layout.tsx           # Root layout
  └── globals.css          # Global styles
```

## 🎮 How to Use

1. **Type a command** in the magic input (top)
2. **Press execute** button or hit `⌘ + Enter`
3. **Watch stickers spawn** with animations
4. **Drag them anywhere** on the canvas
5. **Arrange your story** however you want

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Visit [http://localhost:3000](http://localhost:3000)

## 🎯 Use Cases

- **Interactive Portfolio** - Let visitors explore your work
- **Presentation Tool** - Spawn content on demand
- **Creative Playground** - Experiment with layouts
- **Storytelling** - Build narratives visually

## 🎨 Customization

### Add New Commands
Edit `app/page.tsx` and add your spawn function:

```typescript
const spawnCustom = () => {
  const custom: StickerData = {
    id: `custom-${Date.now()}`,
    type: "project",
    content: {
      title: "Your Title",
      description: "Your description",
      icon: <YourIcon className="w-8 h-8" />,
    },
    position: getRandomPosition(),
  };
  setStickers((prev) => [...prev, custom]);
};
```

### Change Sticker Shapes
Edit `components/StickerCard.tsx` → `getShape()` function

### Modify Colors
Edit the gradients in `StickerCard.tsx` → `getGradient()` function

## 🌟 Features to Add

- [ ] Save canvas state (localStorage)
- [ ] Export as image
- [ ] Sticker connections (lines between cards)
- [ ] Sticker clustering/grouping
- [ ] More shape types
- [ ] Sound effects
- [ ] Multiplayer mode (real-time)

## 💡 Inspiration

- Minimalist geometric design
- iOS sticker systems
- Generative art
- Natural language interfaces
- Playful interactions

---

**Built with creativity, code, and a lot of stickers.**
