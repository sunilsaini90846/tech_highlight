# TechHighlight - Design System Reference

Quick reference for the minimalist design system implemented in TechHighlight.

---

## 🎨 Color Palette

### Primary (Blue)
```css
primary-50:  #f0f9ff  /* Lightest */
primary-100: #e0f2fe
primary-200: #bae6fd
primary-300: #7dd3fc
primary-400: #38bdf8
primary-500: #0ea5e9  /* Base */
primary-600: #0284c7  /* Buttons, links */
primary-700: #0369a1
primary-800: #075985
primary-900: #0c4a6e  /* Darkest */
```

### Neutral (Gray)
```css
neutral-50:  #fafafa  /* Backgrounds */
neutral-100: #f5f5f5  /* Footer background */
neutral-200: #e5e5e5  /* Borders */
neutral-300: #d4d4d4
neutral-400: #a3a3a3
neutral-500: #737373
neutral-600: #525252  /* Secondary text */
neutral-700: #404040
neutral-800: #262626
neutral-900: #171717  /* Headings, primary text */
```

---

## 📝 Typography

### Font Family
- **Primary**: Inter (Google Fonts)
- **Fallback**: system-ui, -apple-system, sans-serif

### Font Sizes
```css
h1: text-4xl md:text-5xl  (36px → 48px)
h2: text-3xl md:text-4xl  (30px → 36px)
h3: text-2xl md:text-3xl  (24px → 30px)
h4: text-xl md:text-2xl   (20px → 24px)
p:  text-base             (16px)
small: text-sm            (14px)
```

### Font Weights
```css
Headings: font-semibold (600)
Body:     font-normal (400)
Bold:     font-bold (700)
```

### Line Height
```css
Headings: tracking-tight
Body:     leading-relaxed (1.625)
```

---

## 📦 Layout

### Container
```tsx
<div className="container-custom">
  {/* Max-width: 1024px, responsive padding */}
</div>
```

**CSS**:
```css
.container-custom {
  margin: 0 auto;
  max-width: 1024px;
  padding: 0 1rem;      /* Mobile */
  padding: 0 1.5rem;    /* sm: */
  padding: 0 2rem;      /* lg: */
}
```

### Spacing
```css
py-12  /* Vertical padding: 3rem (48px) */
mb-8   /* Margin bottom: 2rem (32px) */
gap-6  /* Grid gap: 1.5rem (24px) */
```

---

## 🎴 Components

### Card
```tsx
<div className="card">
  <h3>Card Title</h3>
  <p>Card content...</p>
</div>
```

**Styles**:
- Border: 1px solid neutral-200
- Border radius: 0.5rem (8px)
- Padding: 1.5rem (24px)
- Shadow: soft (shadow-sm)
- Hover: shadow-md
- Transition: 200ms

---

### Buttons

#### Primary Button
```tsx
<button className="btn btn-primary">
  Click Me
</button>
```

**Styles**:
- Background: primary-600
- Text: white
- Hover: primary-700
- Focus ring: primary-500

#### Secondary Button
```tsx
<button className="btn btn-secondary">
  Cancel
</button>
```

**Styles**:
- Background: white
- Border: neutral-300
- Text: neutral-900
- Hover: neutral-50

---

### Input
```tsx
<input 
  type="text" 
  className="input" 
  placeholder="Enter text..."
/>
```

**Styles**:
- Border: neutral-300
- Focus border: primary-500
- Focus ring: primary-500
- Padding: 0.5rem 0.75rem

---

## 🎯 Focus States

All interactive elements have visible focus states:

```css
focus:outline-none
focus:ring-2
focus:ring-primary-500
focus:ring-offset-2
```

**Applies to**:
- Links
- Buttons
- Inputs
- Navigation items

---

## 📱 Responsive Breakpoints

```css
sm:  640px   /* Small tablets */
md:  768px   /* Tablets */
lg:  1024px  /* Desktops */
xl:  1280px  /* Large desktops */
2xl: 1536px  /* Extra large */
```

### Usage Examples
```tsx
{/* Mobile: stack, Desktop: 3 columns */}
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  ...
</div>

{/* Hide on mobile, show on desktop */}
<div className="hidden md:flex">
  ...
</div>

{/* Show on mobile, hide on desktop */}
<div className="md:hidden">
  ...
</div>
```

---

## 🧩 Component Patterns

### Page Layout
```tsx
export default function Page() {
  return (
    <div className="container-custom py-12">
      <h1 className="mb-8 text-4xl font-bold">
        Page Title
      </h1>
      <p className="text-neutral-600">
        Page content...
      </p>
    </div>
  )
}
```

### Card Grid
```tsx
<section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  <div className="card">
    <h3 className="mb-2 text-xl font-semibold">Card 1</h3>
    <p className="text-neutral-600">Description...</p>
  </div>
  {/* More cards... */}
</section>
```

### Hero Section
```tsx
<section className="mb-16 text-center">
  <h1 className="mb-4 text-5xl font-bold tracking-tight">
    Hero Title
  </h1>
  <p className="mx-auto max-w-2xl text-lg text-neutral-600">
    Hero description...
  </p>
</section>
```

---

## 🔗 Link Styles

### Navigation Links
```tsx
<Link
  href="/page"
  className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
>
  Link Text
</Link>
```

### Footer Links
```tsx
<Link
  href="/page"
  className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
>
  Footer Link
</Link>
```

---

## 🎭 Shadows

```css
shadow-sm   /* Soft shadow for cards */
shadow-md   /* Medium shadow on hover */
shadow-lg   /* Large shadow for modals */
```

**Card Shadow**:
```css
Default: shadow-sm
Hover:   shadow-md
```

---

## 🌈 State Colors

### Success
```css
bg-green-50
text-green-700
border-green-200
```

### Error
```css
bg-red-50
text-red-700
border-red-200
```

### Warning
```css
bg-yellow-50
text-yellow-700
border-yellow-200
```

### Info
```css
bg-blue-50
text-blue-700
border-blue-200
```

---

## ♿ Accessibility

### Focus Indicators
✅ All interactive elements have visible focus rings  
✅ Focus ring color: primary-500  
✅ Focus ring width: 2px  
✅ Focus ring offset: 2px  

### Keyboard Navigation
✅ Tab through all interactive elements  
✅ Enter/Space to activate buttons  
✅ Escape to close mobile menu  

### Screen Readers
✅ Semantic HTML (header, nav, main, footer)  
✅ ARIA labels on icon buttons  
✅ Alt text on images (when added)  

---

## 🎨 Usage Examples

### Importing Components
```tsx
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
```

### Using Custom Classes
```tsx
{/* Container */}
<div className="container-custom">
  
  {/* Card */}
  <div className="card">
    <h3>Title</h3>
    <p>Content</p>
  </div>
  
  {/* Buttons */}
  <button className="btn btn-primary">Primary</button>
  <button className="btn btn-secondary">Secondary</button>
  
  {/* Input */}
  <input type="text" className="input" />
</div>
```

---

## 🎯 Design Principles

1. **Minimalism**: Clean, uncluttered interfaces
2. **Readability**: Generous whitespace, readable typography
3. **Consistency**: Uniform spacing, colors, and components
4. **Accessibility**: Keyboard navigation, focus states, semantic HTML
5. **Responsiveness**: Mobile-first, works on all devices
6. **Performance**: Lightweight, fast loading

---

## 📐 Spacing Scale

```css
0.5  → 0.125rem → 2px
1    → 0.25rem  → 4px
2    → 0.5rem   → 8px
3    → 0.75rem  → 12px
4    → 1rem     → 16px
6    → 1.5rem   → 24px
8    → 2rem     → 32px
12   → 3rem     → 48px
16   → 4rem     → 64px
```

---

## 🖼️ Image Guidelines

### Aspect Ratios
- **Hero images**: 16:9
- **Card images**: 4:3
- **Thumbnails**: 1:1

### Sizes
- **Max width**: 1200px
- **Compression**: WebP preferred
- **Lazy loading**: Use Next.js Image component

---

## 🔄 Transitions

All transitions use:
```css
transition-colors duration-200
transition-shadow duration-200
```

**Duration**: 200ms (fast, responsive feel)

---

## ✨ Quick Reference

### Common Patterns
```tsx
{/* Page wrapper */}
<div className="container-custom py-12">

{/* Section spacing */}
<section className="mb-16">

{/* Grid layout */}
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

{/* Card */}
<div className="card">

{/* Button */}
<button className="btn btn-primary">

{/* Input */}
<input className="input" />

{/* Text colors */}
<h1 className="text-neutral-900">
<p className="text-neutral-600">
```

---

**Design System Version**: 1.0  
**Last Updated**: November 7, 2025  
**Status**: Active

