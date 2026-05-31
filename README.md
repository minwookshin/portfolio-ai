# minwook

An AI-native portfolio site for Minwook Shin. The interface combines selected work, conversational project intake, and case-study routing in one Next.js experience.

## Design Philosophy

Inspired by Silicon Valley product studios and AI-native agency sites: minimal positioning, strong interface craft, live product proof, and a conversational surface that helps visitors move from curiosity to a project brief.

## Features

### 1. AI Project Intake
- Conversational input powered by Gemini
- Quick-start prompts for AI websites, prototypes, UX audits, and selected work
- Hidden routing directives open the right project or profile view

### 2. Selected Work Field
- App-icon style project grid
- Category filters for Engineering, AI, and Design
- Hover labels that describe each project as studio proof

### 3. Data-Driven Case Studies
- Structured case-study renderer
- Project-specific sections for challenge, build, features, and outcome
- Inline follow-up questions wired back into the chat

### 4. Motion + Material Language
- Framer Motion transitions
- Monochrome light theme
- Dotted outlines, app-icon tiles, and floating composer UI

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
