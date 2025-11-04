# Admin Panel Color Scheme

## Design Philosophy
Clean, professional admin interface with a light background similar to the manager dashboard, featuring a dark navy sidebar for contrast.

## Color Palette

### Main Background
- **Background**: `#f3f4f6` (Light Gray - Same as manager dashboard)
- **Content Area**: Light and clean for better readability

### Sidebar
- **Background**: `#1e293b` (Dark Navy/Slate)
- **Text**: White
- **Brand Color**: `#3b82f6` (Blue)
- **User Role**: `#60a5fa` (Light Blue)

### Primary Actions & Accents
- **Primary Blue**: `#3b82f6` → `#2563eb` (Gradient)
- Used for: Buttons, Icons, Links, Active states

### Status Colors
- **Success/Green**: `#10b981` (Emerald)
- **Warning/Orange**: `#f59e0b` (Amber)
- **Error/Red**: `#ef4444` (Red)
- **Info/Blue**: `#3b82f6` (Blue)

### Card Design
- **Background**: White (`#ffffff`)
- **Border**: `#e5e7eb` (Light Gray)
- **Shadow**: Subtle `0 1px 3px rgba(0, 0, 0, 0.1)`
- **Hover Shadow**: `0 4px 12px rgba(0, 0, 0, 0.1)`
- **Accent Border**: 4px left border with status colors

### Typography
- **Headings**: `#1f2937` (Dark Gray)
- **Body Text**: `#1f2937` (Dark Gray)
- **Secondary Text**: `#6b7280` (Medium Gray)
- **Placeholder**: `#9ca3af` (Light Gray)

### Stat Cards
Each stat card has a colored left border:
- **Purple**: `#8b5cf6` (Violet)
- **Green**: `#10b981` (Emerald)
- **Blue**: `#3b82f6` (Blue)
- **Orange**: `#f59e0b` (Amber)
- **Teal**: `#14b8a6` (Teal)
- **Indigo**: `#6366f1` (Indigo)

### Interactive Elements

#### Buttons
- **Primary**: Blue gradient `#3b82f6` → `#2563eb`
- **Logout**: Red gradient `#ef4444` → `#dc2626`
- **Hover**: Lift effect with enhanced shadow

#### Cards
- **Default**: White with light gray border
- **Hover**: 
  - Lift up 4px
  - Enhanced shadow
  - Blue border on stores/inventory cards

#### Store Cards
- **Icon Background**: Blue gradient `#3b82f6` → `#2563eb`
- **Card Background**: White
- **Hover**: Blue border `#3b82f6`

### Tables
- **Header Background**: `#f9fafb` (Very Light Gray)
- **Header Text**: `#6b7280` (Medium Gray)
- **Row Border**: `#e5e7eb` (Light Gray)
- **Hover**: Subtle highlight

### Status Badges
- **Delivered/Success**: `#d1fae5` background, `#065f46` text
- **Pending**: `#fef3c7` background, `#92400e` text
- **Processing**: `#dbeafe` background, `#1e40af` text
- **Cancelled/Failed**: `#fee2e2` background, `#991b1b` text
- **Warning**: `#fef3c7` background, `#92400e` text
- **Good**: `#d1fae5` background, `#065f46` text

### Stock Indicators
- **Low Stock**: Red badge `#fee2e2` background, `#dc2626` text
- **Medium Stock**: Amber badge `#fef3c7` background, `#d97706` text
- **High Stock**: Green badge `#d1fae5` background, `#059669` text

## Layout Spacing
- **Main Padding**: 2rem (32px)
- **Card Padding**: 1.5rem (24px)
- **Section Margin**: 2rem (32px)
- **Element Gap**: 1rem (16px)

## Visual Effects
- **Card Hover**: Transform Y -4px with shadow enhancement
- **Button Hover**: Transform Y -2px with colored shadow
- **Transitions**: 0.3s ease for smooth animations
- **Border Radius**: 12px for modern rounded corners

## Consistency with Manager Dashboard
✅ Same light background (#f3f4f6)
✅ Same card design (white with subtle shadows)
✅ Similar spacing and typography
✅ Consistent status colors
✅ Professional and clean appearance

## Key Differences from Manager
- Dark navy sidebar (vs. blue sidebar)
- View-only design (no action buttons except view)
- Blue accent color (#3b82f6 vs. teal in manager)
- More emphasis on data visualization
- Colored left borders on stat cards
