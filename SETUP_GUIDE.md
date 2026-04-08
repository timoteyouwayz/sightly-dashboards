# YFC Kenya Dashboard - Admin Setup Guide

This document explains the new features added to the dashboard admin portal.

## 📋 Quick Navigation

### 1. Login Email Address
**File**: [src/pages/EditPortal.tsx](src/pages/EditPortal.tsx)
**Location**: Admin login page
- **Email**: `helpdesk@kenyayfc.org`
- **Password**: `admin123` (default)
- Used as the placeholder on the login form (line ~155)

---

## 2. Testimonies Management

### Access
- Navigate to `/edit` → Click on **"Testimonies"** tab in the Edit Portal

### Features
- **Add New Testimony**: Click the "Add Testimony" button to add a new testimonial
- **Edit Existing**: Modify name, location, statement (quote), full story, and image URL
- **Delete**: Click the trash icon to remove a testimony

### Fields
- **Name**: Person's name
- **Location**: Where the person is from
- **Statement**: Short quote displayed in carousel
- **Full Story**: Detailed testimonial text
- **Image URL**: Path to image (e.g., `/images/testimonial-1.jpg`)

### Upload Images
1. Place your images in `/public/images/` folder
2. Use path: `/images/your-image-name.jpg`
3. Or paste a full URL to an external image

---

## 3. Carousel Auto-play Time Interval

### Access
- Navigate to `/edit` → Click on **"Settings"** tab → **"Testimonies Carousel"** section

### How to Change
1. Find the **"Auto-play Interval (milliseconds)"** input field
2. Enter desired milliseconds (e.g., 7000 = 7 seconds)
3. Click "Apply" button

### Current Default
- **7000ms** (7 seconds)

### Usage in Component
To apply the interval setting to the carousel component:

**File**: [src/pages/Index.tsx](src/pages/Index.tsx) (line ~150)

Change:
```jsx
<TestimoniesHeroCarousel 
  testimonials={testimonials} 
  autoPlayInterval={7000}
/>
```

To use the state value from EditPortal, you'll need to:
1. Create shared state in MinistryDataContext (or localStorage)
2. Pass the interval value to the TestimoniesHeroCarousel component

**Example in Index.tsx**:
```jsx
// Read from localStorage or context
const carouselInterval = localStorage.getItem('carouselInterval') || 7000;

<TestimoniesHeroCarousel 
  testimonials={testimonials} 
  autoPlayInterval={parseInt(carouselInterval)}
/>
```

---

## 4. Activity Cards

### Access
- Navigate to `/edit` → Click on **"Settings"** tab → **"Activity Cards"** section

### Current Activities
The dashboard displays 4 activity cards on the homepage:
1. **Prayer Gatherings** - Weekly prayer and worship evenings
2. **Bible Schools** - Training leaders with practical theology
3. **Community Outreach** - Feeding, counseling, and prayer
4. **Youth Camps** - Campfires and worship nights

### How to Add/Edit Activities
1. Open [src/pages/Index.tsx](src/pages/Index.tsx)
2. Find the `defaultActivities` array (around line 31-35)
3. Add or modify entries:

```jsx
const defaultActivities: ActivityItem[] = [
  { 
    title: 'Prayer Gatherings', 
    description: 'Weekly prayer and worship evenings for young people across counties.',
    icon: Users,
    bgImage: '/images/activity-weekend-clubs.jpg'
  },
  // Add more activities here...
];
```

### Activity Fields
- **title**: Display name
- **description**: Description text
- **icon**: Lucide icon component (Users, BookOpen, Heart, School, etc.)
- **bgImage**: Background image path

---

## 5. User Management

### Access
- Navigate to `/edit` → Click on **"Users"** tab

### Features
- **Add User**: Fill in email, name, and role, then click "Add User"
- **Delete User**: Click trash icon (cannot delete default helpdesk user)
- **Manage Roles**:
  - **Admin** - Full access to edit portal
  - **Editor** - Can edit data and testimonies
  - **Viewer** - View-only access

### Default Admin User
- **Email**: `helpdesk@kenyayfc.org`
- **Role**: Admin (cannot be deleted)
- **Status**: Always active

### Adding New Users
1. Enter user's email address
2. Enter user's full name
3. Select role (Admin, Editor, or Viewer)
4. Click "Add User"

---

## 6. Navigation Bar Theme Toggle

### Status
✅ **Removed** from the navigation bar

This feature was removed from:
- Desktop navigation (top right)
- Mobile navigation menu

**File**: [src/components/dashboard/NavBar.tsx](src/components/dashboard/NavBar.tsx)

---

## 📁 File Locations Reference

### Main Files Modified
| Feature | File | Location |
|---------|------|----------|
| Login & Admin Portal | `src/pages/EditPortal.tsx` | Line 1-750 |
| Navigation (Theme toggle removed) | `src/components/dashboard/NavBar.tsx` | Line 1-70 |
| Homepage with testimonies | `src/pages/Index.tsx` | Line 1-200 |
| Activity cards & testimonials data | `src/pages/Index.tsx` | Line 31-70 |

### Key Components
- **TestimoniesHeroCarousel**: [src/components/dashboard/TestimoniesHeroCarousel.tsx](src/components/dashboard/TestimoniesHeroCarousel.tsx)
- **Edit Portal**: [src/pages/EditPortal.tsx](src/pages/EditPortal.tsx)
- **Index/Homepage**: [src/pages/Index.tsx](src/pages/Index.tsx)

---

## 🔐 Security Notes

⚠️ **Important**: 
- The password is currently hardcoded (`admin123`)
- This is for development/demo purposes
- For production, implement proper authentication:
  - Use JWT tokens
  - Verify emails
  - Hash passwords
  - Implement role-based access control (RBAC)

---

## 📝 Example: Editing Carousel Interval with Persistence

To make the carousel interval persistent across page reloads:

**1. Update EditPortal.tsx** - Save to localStorage:
```jsx
const handleCarouselIntervalChange = (value: number) => {
  setCarouselInterval(value);
  localStorage.setItem('carouselInterval', String(value));
  recordSnapshot(`Changed carousel interval to ${value}ms`);
};
```

**2. Update Index.tsx** - Read from localStorage:
```jsx
const carouselInterval = 
  parseInt(localStorage.getItem('carouselInterval') || '7000');

<TestimoniesHeroCarousel 
  testimonials={testimonials}
  autoPlayInterval={carouselInterval}
/>
```

---

## 🚀 Getting Started

1. **Access Admin Portal**: Navigate to `http://localhost:5173/edit`
2. **Login**: 
   - Email: `helpdesk@kenyayfc.org`
   - Password: `admin123`
3. **Choose a Tab**:
   - **Data**: Edit ministry metrics
   - **Testimonies**: Manage testimonial stories
   - **Settings**: Configure carousel and activities
   - **Users**: Manage admin access

---

## ❓ Troubleshooting

### Can't see new users?
- Users are only stored in component state
- Refresh page will reset to default list
- Store in database/localStorage for persistence

### Images not showing?
- Place images in `/public/images/` folder
- Use path: `/images/filename.jpg`
- Or use full external URL (https://...)

### Carousel not changing interval?
- Apply the interval in Index.tsx component
- Use localStorage method (see example above)
- Restart development server

---

## 📞 Support

For questions or issues, contact: `helpdesk@kenyayfc.org`
