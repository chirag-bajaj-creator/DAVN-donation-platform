# Hravinder Design System v1.0
**Modern, Minimalist, Aligned & Beautiful** ✨

Last Updated: April 7, 2026

---

## 🎨 Design Philosophy

- **Minimalist**: Clean, spacious, white-first approach
- **Modern**: Contemporary design patterns used by leading companies (Stripe, Figma, Notion)
- **Consistent**: Unified design across all apps (Client, Admin, Volunteer)
- **Accessible**: WCAG 2.1 AA compliant, readable contrast ratios
- **Responsive**: Mobile-first approach, scales beautifully

---

## 📋 Color Palette

### Primary Colors (Sky Blue - Modern & Trustworthy)
```
Primary 50:   #f0f9ff   (Lightest background)
Primary 100:  #e0f2fe   (Light backgrounds)
Primary 200:  #bae6fd
Primary 300:  #7dd3fc
Primary 400:  #38bdf8
Primary 500:  #0ea5e9   (Main Primary - use for CTAs)
Primary 600:  #0284c7   (Hover state)
Primary 700:  #0369a1   (Active state)
Primary 800:  #075985
Primary 900:  #0c3d66
```

### Secondary Colors (Purple - Creative & Smart)
```
Secondary 50:  #faf5ff  (Lightest background)
Secondary 100: #f3e8ff  (Light backgrounds)
Secondary 200: #e9d5ff
Secondary 300: #d8b4fe
Secondary 400: #c084fc
Secondary 500: #a855f7  (Accent, features)
Secondary 600: #9333ea  (Hover state)
Secondary 700: #7e22ce  (Active state)
Secondary 800: #6b21a8
Secondary 900: #581c87
```

### Semantic Colors
```
Success:       #10b981  (Green - Confirmations, success states)
Warning:       #f59e0b  (Amber - Alerts, warnings)
Danger:        #ef4444  (Red - Errors, destructive actions)
Info:          #3b82f6  (Blue - Information, tips)
```

### Neutrals (Clean & Professional)
```
White:         #ffffff  (Pure white backgrounds)
Light:         #f9fafb  (Off-white, subtle backgrounds)
Gray 50:       #f9fafb
Gray 100:      #f3f4f6
Gray 200:      #e5e7eb  (Borders, dividers)
Gray 300:      #d1d5db
Gray 400:      #9ca3af
Gray 500:      #6b7280  (Secondary text)
Gray 600:      #4b5563
Gray 700:      #374151
Gray 800:      #1f2937  (Primary text)
Dark:          #111827  (Darkest - headings)
```

---

## 🔤 Typography

### Font Family
- **Primary**: Inter (system font stack fallback)
  - Installation: Already in Tailwind, from Google Fonts
  - Used for: Everything by default

### Font Sizes & Weights
```
Display (H1):        40-48px, weight 700 (bold)
Heading 1 (H2):      32-36px, weight 700
Heading 2 (H3):      24-28px, weight 600 (semibold)
Heading 3 (H4):      20-24px, weight 600
Body Large:          18px, weight 500 (used for prominent text)
Body Regular:        16px, weight 400 (default body text)
Body Small:          14px, weight 400 (secondary text)
Caption:             12px, weight 400 (labels, metadata)
```

### Line Heights
```
Display/Headings:  1.2 (tight)
Body:              1.5 (comfortable)
Labels/Caption:    1.4
```

### Text Colors
```
Primary Text:      Gray 800 (#1f2937) - main content
Secondary Text:    Gray 600 (#4b5563) - helper text
Tertiary Text:     Gray 500 (#6b7280) - metadata
Disabled Text:     Gray 400 (#9ca3af)
On Primary:        White (#ffffff) - text on primary buttons
```

---

## 🎯 Spacing System

All spacing based on 4px base unit (Tailwind defaults):

```
xs:    4px    (t-0.5, p-0.5)
sm:    8px    (t-1, p-1)
md:    12px   (t-1.5, p-1.5)   -- NOT COMMONLY USED IN TAILWIND
base:  16px   (t-4, p-4)       -- Default spacing
lg:    24px   (t-6, p-6)       -- Section spacing
xl:    32px   (t-8, p-8)       -- Major section spacing
2xl:   48px   (t-12, p-12)     -- Hero/large sections
3xl:   64px   (t-16, p-16)
```

### Usage Guidelines
```
Padding:
  - Button:       px-4 py-2.5 (16px h, 10px v)
  - Card:         p-6 (24px all sides)
  - Section:      py-12 (48px vertical, breathing room)
  - Page:         px-4 md:px-8 (responsive gutters)

Margin:
  - Between sections: my-12 (48px)
  - Between items: gap-4 (16px)
  - Between paragraphs: mb-4 (16px)

Gap (Flex/Grid):
  - Tight grid: gap-3 (12px)
  - Standard: gap-4 (16px)
  - Spacious: gap-6 (24px)
```

---

## 📦 Component Guidelines

### Buttons
```
Primary Button:
  - Background: primary-500
  - Text: white
  - Padding: px-6 py-2.5
  - Border radius: rounded-lg (8px)
  - Hover: bg-primary-600
  - Active: bg-primary-700
  - Focus: ring-2 ring-primary-300

Secondary Button (Outline):
  - Background: transparent
  - Border: 1px solid gray-300
  - Text: gray-700
  - Padding: px-6 py-2.5
  - Hover: bg-gray-50
  - Focus: ring-2 ring-primary-300

Danger Button:
  - Background: danger (#ef4444)
  - Text: white
  - Padding: px-6 py-2.5
  - Hover: bg-red-600
  - Focus: ring-2 ring-red-300

Button States:
  - Loading: opacity-60, pointer-events-none, show spinner
  - Disabled: opacity-50, cursor-not-allowed, pointer-events-none
```

### Cards
```
Default Card:
  - Background: white
  - Border: 1px solid gray-200
  - Padding: p-6
  - Border radius: rounded-lg (8px)
  - Shadow: shadow-soft (0 1px 3px rgba(0,0,0,0.1))
  - Hover: shadow-medium, transition-all

Elevated Card (Featured):
  - Shadow: shadow-medium or shadow-lg
  - Border: 1px solid gray-100 (lighter)
```

### Inputs
```
Text Input:
  - Padding: px-4 py-2.5
  - Border: 1px solid gray-300
  - Border radius: rounded-lg
  - Focus: ring-2 ring-primary-500, border-transparent
  - Background: white
  - Disabled: bg-gray-50, text-gray-400, cursor-not-allowed

Input Error:
  - Border: 1px solid danger (#ef4444)
  - Ring: ring-danger-300
  - Error message: text-danger text-sm mt-1

Input Success:
  - Border: 1px solid success (#10b981)
  - Check icon: text-success
```

### Cards with Header
```
Header:
  - padding: p-6
  - border-bottom: border-b border-gray-200
  - title: font-semibold text-lg text-gray-900

Body:
  - padding: p-6

Footer:
  - padding: p-6
  - border-top: border-t border-gray-200
  - alignment: flex justify-between items-center
```

### Modals
```
Backdrop:
  - Background: bg-black/50 (50% opacity)
  - Position: fixed inset-0 z-40
  - Animation: fade-in 0.2s

Modal Container:
  - Position: fixed inset-0 z-50
  - Display: flex items-center justify-center
  - Padding: p-4 (responsive)

Modal Content:
  - Background: white
  - Border radius: rounded-xl (12px)
  - Max width: max-w-md (28rem) or max-w-lg (32rem)
  - Shadow: shadow-lg
  - Animation: slide-up 0.3s ease-out
  - Padding: p-6

Close Button:
  - Position: absolute top-4 right-4
  - Icon: X (24px)
  - Color: gray-400
  - Hover: gray-500
```

### Navigation/Navbar
```
Navbar:
  - Background: white
  - Border-bottom: 1px solid gray-200
  - Padding: py-4 px-6
  - Height: h-16 (64px)
  - Position: sticky top-0 z-40
  - Shadow (on scroll): shadow-soft

Logo:
  - Font size: text-lg
  - Font weight: semibold
  - Color: primary-700

Nav Items:
  - Padding: px-4 py-2
  - Font size: text-sm
  - Font weight: medium
  - Color: gray-700
  - Active: text-primary-600, border-b-2 primary-600
  - Hover: text-primary-600, transition-colors 0.2s
```

---

## ✨ Animations & Transitions

### Standard Transitions
```
Fast:     0.15s ease-out   (quick feedback, hovers, small changes)
Normal:   0.3s ease-out    (default transitions)
Slow:     0.5s ease-out    (modal opens, major layout changes)
```

### Common Animations
```
Fade In:
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  animation: fadeIn 0.3s ease-out;

Slide Up:
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  animation: slideUp 0.3s ease-out;

Scale In:
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.95); }
    to   { opacity: 1; transform: scale(1); }
  }
  animation: scaleIn 0.2s ease-out;

Modal Slide In:
  @keyframes modalSlideIn {
    from { opacity: 0; transform: translateY(-16px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  animation: modalSlideIn 0.25s ease-out;
```

### When to Use
- **Button Hover**: color change 0.15s
- **Page Transitions**: fade-in 0.3s
- **Modal Opens**: slide-up/scale-in 0.25s
- **Dropdown**: fade-in 0.2s
- **Loading States**: opacity transition 0.2s + spinner animation

---

## 🎭 Shadow System

```
None:              none
Soft:              0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)
                   (cards, light elevation)

Medium:            0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
                   (dropdowns, floating elements)

Large:             0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)
                   (modals, major overlays)

Extra Large:       0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)
                   (hero sections, focal points)

Usage:
  - Default card: shadow-soft
  - Hover card: shadow-medium
  - Modal: shadow-lg
  - Dropdown: shadow-medium
```

---

## 📐 Border Radius System

```
sm:    rounded-sm (2px)    — small elements, tight design
base:  rounded (4px)       — form inputs, small components
md:    rounded-md (6px)    — NOT commonly used
lg:    rounded-lg (8px)    — DEFAULT for most components (buttons, cards, inputs)
xl:    rounded-xl (12px)   — modals, featured cards
2xl:   rounded-2xl (16px)  — hero sections, large containers
full:  rounded-full        — avatars, pills, circular buttons
```

### Usage
- Buttons: rounded-lg
- Cards: rounded-lg
- Inputs: rounded-lg
- Modals: rounded-xl
- Avatar: rounded-full
- Pills/Badges: rounded-full or rounded-lg

---

## 🎨 Specific Component Styles

### Form Labels
```
Font size:        text-sm
Font weight:      medium (font-medium)
Color:            gray-700
Margin bottom:    mb-2
Display:          block
```

### Form Helper Text
```
Font size:        text-xs
Color:            gray-500
Margin top:       mt-1
```

### Error Messages
```
Font size:        text-sm
Color:            danger (#ef4444)
Margin top:       mt-2
Icon:             ⚠️ or ✕ (12px)
```

### Success Messages / Alerts
```
Background:       success-50 (#dcfce7)
Border:           1px solid success (#10b981)
Text color:       success-900 (#145231)
Padding:          p-4
Border radius:    rounded-lg
Margin:           mb-4
Icon:             ✓ (16px, success-500)
```

### Info Messages / Alerts
```
Background:       info-50 (#eff6ff)
Border:           1px solid info (#3b82f6)
Text color:       info-900 (#1e40af)
Padding:          p-4
Border radius:    rounded-lg
Margin:           mb-4
Icon:             ℹ️ (16px, info-500)
```

### Warning Messages / Alerts
```
Background:       warning-50 (#fffbeb)
Border:           1px solid warning (#f59e0b)
Text color:       warning-900 (#7c2d12)
Padding:          p-4
Border radius:    rounded-lg
Margin:           mb-4
Icon:             ⚠️ (16px, warning-500)
```

---

## 📱 Responsive Design

### Breakpoints (Tailwind defaults)
```
sm:  640px   (tablets in portrait)
md:  768px   (tablets in landscape)
lg:  1024px  (laptops)
xl:  1280px  (large screens)
2xl: 1536px  (very large screens)
```

### Mobile-First Approach
```
1. Design for mobile (no prefix)
2. Add tablets: sm: prefix
3. Add landscape: md: prefix
4. Add desktops: lg: prefix

Example:
  w-full sm:w-1/2 md:w-1/3 lg:w-1/4
  (100% width on mobile, 50% on tablets, 33% on landscape, 25% on desktop)
```

### Padding/Margin Adjustments
```
Page padding:
  px-4 sm:px-6 lg:px-8
  (16px on mobile, 24px on tablets, 32px on desktop)

Section padding:
  py-6 sm:py-8 lg:py-12
  (24px on mobile, 32px on tablets, 48px on desktop)

Container width:
  w-full md:max-w-2xl lg:max-w-4xl
  (100% on mobile, constrained on larger screens)
```

---

## 🌙 Dark Mode (Future Optional)

Color adjustments for dark mode:
```
Background:        gray-900 instead of white
Text Primary:      gray-50 instead of gray-800
Text Secondary:    gray-400 instead of gray-600
Border:            gray-700 instead of gray-200
Card:              gray-800 instead of white
```

Enable in tailwind.config.js:
```javascript
darkMode: 'class',
```

Use in HTML:
```html
<html class="dark">
```

---

## 🛠️ Implementation Checklist

### For Each App (Client, Admin, Volunteer):

- [ ] Update tailwind.config.js with color palette
- [ ] Update globals.css with animations & base styles
- [ ] Audit all buttons - apply button styles consistently
- [ ] Audit all cards - apply card styles consistently
- [ ] Audit all forms - apply input/label/error styles
- [ ] Audit all modals - apply modal styles
- [ ] Remove any custom/zig-zag styles
- [ ] Ensure spacing uses gap, margin, padding consistently
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Check contrast ratios for accessibility
- [ ] Remove inline styles - use Tailwind classes only

---

## 📖 Quick Reference (Copy-Paste Snippets)

### Primary Button
```jsx
<button className="bg-primary-500 text-white px-6 py-2.5 rounded-lg 
  hover:bg-primary-600 active:bg-primary-700 transition-colors focus:ring-2 
  focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed">
  Click Me
</button>
```

### Card
```jsx
<div className="bg-white border border-gray-200 rounded-lg shadow-soft p-6 
  hover:shadow-medium transition-all">
  Content here
</div>
```

### Form Group
```jsx
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Label Text
  </label>
  <input 
    type="text"
    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg 
    focus:ring-2 focus:ring-primary-500 focus:border-transparent 
    transition-all"
  />
  <p className="text-xs text-gray-500 mt-1">Helper text</p>
</div>
```

### Alert
```jsx
<div className="bg-success-50 border border-success-200 rounded-lg p-4 mb-4">
  <p className="text-success-900 text-sm">✓ Success message</p>
</div>
```

### Modal
```jsx
<div className="fixed inset-0 bg-black/50 z-40"></div>
<div className="fixed inset-0 flex items-center justify-center z-50 p-4">
  <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 
    animate-[slideUp_0.3s_ease-out]">
    Modal content
  </div>
</div>
```

---

## 🎯 Design Goals Achieved

✅ **Smooth**: Consistent animations and transitions for fluid UX  
✅ **Good Looking**: Modern color palette, professional typography  
✅ **Best in Class**: Inspired by Stripe, Figma, Notion design systems  
✅ **Well Aligned**: Consistent spacing, grid-based layout  
✅ **Minimalist**: White-first, clean, spacious design  
✅ **Modern**: Contemporary patterns, accessible by default  

---

## 📞 Questions?

This design system is living documentation. Update as needed.
All apps should follow this consistently for a unified brand experience.

**Version**: 1.0  
**Last Updated**: April 7, 2026  
**Status**: Ready for Implementation