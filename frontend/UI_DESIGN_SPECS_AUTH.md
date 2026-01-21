# UI Design Specifications - Login & Signup Pages

## Color Palette

### Login Page

- **Primary Gradient**: Indigo (50) → Purple (50) → Pink (50)
- **Accent Colors**:
  - Requester: Blue (500) → Cyan (500)
  - Supporter: Rose (500) → Pink (500)
- **Background Blobs**: Purple (300), Pink (300), Indigo (300)

### Signup Page

- **Primary Gradient**: Violet (50) → Purple (50) → Fuchsia (50)
- **Accent Colors**:
  - Requester: Blue (500) → Cyan (500) → Teal (500)
  - Supporter: Rose (500) → Pink (500) → Fuchsia (500)
- **Background Blobs**: Purple (300), Fuchsia (300), Violet (300)

## Typography

- **Page Title**: 3xl - 4xl, font-bold
- **Section Headings**: 2xl - 3xl, font-bold
- **Card Titles**: xl - 2xl, font-bold
- **Form Labels**: sm, font-medium
- **Body Text**: base, font-normal
- **Helper Text**: sm - xs, text-gray-600

## Component Specifications

### 1. Login Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  [Background: Animated gradient with floating blobs]            │
│                                                                  │
│  ┌───────────────────────┐  ┌──────────────────────────┐       │
│  │  BRANDING PANEL       │  │  LOGIN FORM PANEL        │       │
│  │  (Desktop Only)       │  │                          │       │
│  │                       │  │  ┌────────────────────┐  │       │
│  │  [HelaFund Logo]      │  │  │    Sign In         │  │       │
│  │                       │  │  │  Choose your role  │  │       │
│  │  "Welcome Back to     │  │  └────────────────────┘  │       │
│  │   Your Community"     │  │                          │       │
│  │                       │  │  [Role Selection OR      │       │
│  │  • Secure & Private   │  │   Login Form]            │       │
│  │  • Instant Access     │  │                          │       │
│  │                       │  │  ┌────────────────────┐  │       │
│  │  [Testimonial Quote]  │  │  │ [Requester] Card   │  │       │
│  │                       │  │  │ [Supporter] Card   │  │       │
│  │                       │  │  └────────────────────┘  │       │
│  │                       │  │                          │       │
│  └───────────────────────┘  │  OR                      │       │
│                             │                          │       │
│                             │  ┌────────────────────┐  │       │
│                             │  │ Email Input        │  │       │
│                             │  │ Password Input     │  │       │
│                             │  │ [Remember Me]      │  │       │
│                             │  │ [Sign In Button]   │  │       │
│                             │  │ [Signup Link]      │  │       │
│                             │  └────────────────────┘  │       │
│                             │                          │       │
│                             └──────────────────────────┘       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Signup Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  [Background: Animated gradient with floating blobs]            │
│                                                                  │
│                    [HelaFund Logo]                              │
│                  Create Account                                 │
│            Join our community and make a difference             │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              REGISTRATION CARD                           │  │
│  │                                                          │  │
│  │  Step 1: Role Selection                                 │  │
│  │  ┌────────────────────┐  ┌────────────────────┐        │  │
│  │  │   REQUESTER        │  │   SUPPORTER        │        │  │
│  │  │   [Student Icon]   │  │   [Heart Icon]     │        │  │
│  │  │                    │  │                    │        │  │
│  │  │ University student │  │ Help students      │        │  │
│  │  │ seeking support    │  │ in need            │        │  │
│  │  │                    │  │                    │        │  │
│  │  │ [Select Button] →  │  │ [Select Button] →  │        │  │
│  │  └────────────────────┘  └────────────────────┘        │  │
│  │                                                          │  │
│  │  OR                                                      │  │
│  │                                                          │  │
│  │  Step 2: Registration Form                              │  │
│  │  ┌────────────────────────────────────────────┐         │  │
│  │  │ [Role Badge: Requester/Supporter] [Change] │         │  │
│  │  ├────────────────────────────────────────────┤         │  │
│  │  │                                            │         │  │
│  │  │  [Form Fields Based on Role]               │         │  │
│  │  │  • Input with icon                         │         │  │
│  │  │  • Dropdown selects                        │         │  │
│  │  │  • Image upload area                       │         │  │
│  │  │  • Password with toggle                    │         │  │
│  │  │                                            │         │  │
│  │  │  [Terms & Conditions Checkbox]             │         │  │
│  │  │  [Create Account Button]                   │         │  │
│  │  │  [Login Link]                              │         │  │
│  │  └────────────────────────────────────────────┘         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## UI Components Detail

### Role Selection Cards

**Requester Card:**

```
┌────────────────────────────────────────────────┐
│  [Blue-Cyan Gradient Background]               │
│                                                │
│        [GraduationCap Icon in Circle]          │
│                                                │
│              Requester                         │
│    University Student seeking support          │
│                                                │
│         ✓ Verified student accounts only       │
│                                   [Arrow →]    │
└────────────────────────────────────────────────┘
```

**Supporter Card:**

```
┌────────────────────────────────────────────────┐
│  [Rose-Pink Gradient Background]               │
│                                                │
│          [Heart Icon in Circle]                │
│                                                │
│              Supporter                         │
│       I want to help students in need          │
│                                                │
│         ✓ Make a difference today              │
│                                   [Arrow →]    │
└────────────────────────────────────────────────┘
```

### Form Input Fields

**Standard Input:**

```
Label Text *
┌──────────────────────────────────────────────┐
│ [Icon]  Placeholder text...                 │
└──────────────────────────────────────────────┘
```

**Password Input:**

```
Password *
┌──────────────────────────────────────────────┐
│ [Lock] ••••••••••••           [Eye Icon]     │
└──────────────────────────────────────────────┘
```

**Dropdown Select:**

```
University *
┌──────────────────────────────────────────────┐
│ [Building] Select your university        ▼  │
└──────────────────────────────────────────────┘
```

**Image Upload Area (Empty):**

```
Upload Student ID Image *
┌──────────────────────────────────────────────┐
│                                              │
│           [Upload Icon]                      │
│                                              │
│     Click to upload or drag and drop         │
│     PNG, JPG or JPEG (max. 5MB)              │
│                                              │
└──────────────────────────────────────────────┘
```

**Image Upload Area (With Preview):**

```
Upload Student ID Image *
┌──────────────────────────────────────────────┐
│                                    [X]       │
│                                              │
│        [Student ID Image Preview]            │
│                                              │
└──────────────────────────────────────────────┘
```

### Buttons

**Primary Button (Requester):**

```
┌──────────────────────────────────────────┐
│  [Blue-Cyan Gradient]                    │
│         Sign In            [→]           │
└──────────────────────────────────────────┘
```

**Primary Button (Supporter):**

```
┌──────────────────────────────────────────┐
│  [Rose-Pink Gradient]                    │
│         Sign In            [→]           │
└──────────────────────────────────────────┘
```

**Loading State:**

```
┌──────────────────────────────────────────┐
│  [Dimmed Gradient]                       │
│         Signing In...                    │
└──────────────────────────────────────────┘
```

### Role Badge

```
┌───────────────────────────────────────┐
│ [Icon] Requester Registration  [Change] │
└───────────────────────────────────────┘
```

### Error Messages

```
Email Address *
┌──────────────────────────────────────────────┐
│ [Mail] invalid-email              [RED]     │
└──────────────────────────────────────────────┘
⚠ Email is invalid
```

## Animations

### Background Blobs

- **Animation**: Floating, morphing circles
- **Duration**: 7 seconds
- **Pattern**: Translate and scale
- **Colors**: Semi-transparent purple, pink, indigo/fuchsia/violet

### Card Hover Effects

- **Transform**: scale(1.05)
- **Shadow**: Increases on hover
- **Shimmer**: Light sweep animation
- **Duration**: 300ms

### Button Interactions

- **Hover**: Slightly darker gradient
- **Active**: Scale down slightly
- **Loading**: Opacity 50%, no hover effect

### Form Focus

- **Border**: Changes to accent color
- **Ring**: 2px colored ring appears
- **Transition**: 200ms smooth

## Responsive Breakpoints

### Desktop (≥1024px)

- Two-column layout (branding + form)
- Full-width cards
- Large text and spacing

### Tablet (768px - 1023px)

- Single column
- Reduced padding
- Medium text

### Mobile (<768px)

- Single column
- Compact spacing
- Smaller text
- Stacked buttons
- Logo at top

## Accessibility Features

- ✅ Proper heading hierarchy (h1, h2, h3)
- ✅ Form labels associated with inputs
- ✅ Error messages linked to inputs
- ✅ Sufficient color contrast ratios
- ✅ Focus indicators visible
- ✅ Keyboard navigation support
- ✅ Screen reader friendly
- ✅ Required fields marked with asterisk

## Icon Usage

| Context           | Icon          | Library      |
| ----------------- | ------------- | ------------ |
| Requester Role    | GraduationCap | lucide-react |
| Supporter Role    | Heart         | lucide-react |
| Email Input       | Mail          | lucide-react |
| Password Input    | Lock          | lucide-react |
| Name Input        | User          | lucide-react |
| Phone Input       | Phone         | lucide-react |
| NIC Input         | CreditCard    | lucide-react |
| University Select | Building2     | lucide-react |
| Faculty Input     | BookOpen      | lucide-react |
| Upload            | Upload        | lucide-react |
| Success           | CheckCircle2  | lucide-react |
| Remove            | X             | lucide-react |
| Show Password     | Eye           | lucide-react |
| Hide Password     | EyeOff        | lucide-react |
| Submit            | ArrowRight    | lucide-react |
| Security          | Shield        | lucide-react |
| Features          | Sparkles      | lucide-react |

## Special Effects

### Glassmorphism

- Background: white with opacity
- Backdrop filter: blur
- Border: subtle white border
- Used in: Floating cards, input fields

### Gradient Text

```css
bg-gradient-to-r from-purple-400 to-cyan-400
bg-clip-text text-transparent
```

### Shadow Layers

- sm: Subtle elevation
- lg: Card elevation
- xl: Button emphasis
- 2xl: Modal/primary elements

## State Indicators

### Loading

- Button text changes
- Spinner/animation appears
- Disabled state applied
- Cursor: not-allowed

### Error

- Red border on input
- Red text for message
- Icon indicator
- Shake animation (optional)

### Success

- Green checkmark
- Success message
- Brief highlight

### Disabled

- Opacity: 50%
- Cursor: not-allowed
- No hover effects
- Grayscale filter (optional)
