# BWF Ventures Iframe SEO

A Next.js 15 project optimized for SEO that displays an iframe of the BWF Ventures platform with advanced performance optimization and accessibility features.

## Features

- 🚀 **Next.js 15** with App Router
- 🎯 **Advanced SEO** with next-seo
- ⚡ **Performance Optimized** iframe loading
- 🎨 **Tailwind CSS** for styling
- 📱 **Responsive Design**
- ♿ **Accessibility Compliant**
- 🔒 **Security Headers** configured
- 📊 **Bundle Analysis** support

## Environment Setup

Create a `.env.local` file in the root directory:

```env
# Iframe URL configuration
NEXT_PUBLIC_IFRAME_URL=https://bwfventures.framer.website

# SEO Configuration
NEXT_PUBLIC_SITE_NAME=BWF Ventures - Iframe SEO
NEXT_PUBLIC_SITE_DESCRIPTION=Professional iframe embedding with advanced SEO optimization
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run the development server:**

   ```bash
   npm run dev
   ```

3. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking
- `npm run analyze` - Analyze bundle size

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── fetch-content/
│   │       └── route.ts    # Server-side content fetching API
│   ├── layout.tsx          # Root layout with SEO configuration
│   ├── page.tsx            # Home page with server-side SEO + client iframe
│   ├── sitemap.ts          # Dynamic sitemap generation
│   └── globals.css         # Global styles
├── components/
│   ├── OptimizedIframe.tsx # Optimized iframe component
│   └── SEOPreview.tsx      # Development SEO preview tool
├── lib/
│   └── seo-content.ts      # SEO content fetching utilities
└── config/
    └── seo.ts              # SEO configuration
```

## SEO Optimizations

### Meta Tags

- Comprehensive meta tags including Open Graph and Twitter Cards
- Dynamic title templates
- Structured data support
- Canonical URLs

### Performance

- Lazy loading iframe with Intersection Observer
- Preconnect and DNS prefetch for external domains
- Optimized bundle with tree shaking
- Image optimization with Next.js Image component

### Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Screen reader friendly content
- Keyboard navigation support

### Security

- CSP headers configured
- Iframe sandboxing
- Secure referrer policies
- XSS protection headers

## 🎯 Key Features:

- **🔒 Security**: Proper iframe sandboxing and security headers
- **⚡ Performance**: Optimized loading with intersection observer
- **📱 Responsive**: Mobile-friendly design
- **♿ Accessibility**: Screen reader friendly with ARIA labels
- **🎨 Modern UI**: Clean loading states and error handling
- **📊 Advanced SEO**: Server-side content fetching for better indexing
- **🔍 Smart Content Extraction**: Automatic parsing of external content

### 🌟 Advanced SEO Features:

- **Server-side Content Fetching**: Automatically fetches and parses content from the iframe source
- **Dynamic Meta Generation**: Creates SEO meta tags based on fetched content
- **Content Extraction**: Extracts headings, paragraphs, and images for search engines
- **Cached Results**: 1-hour cache for performance optimization
- **Fallback Content**: Graceful degradation when fetching fails
- **SEO Preview**: Development tool to preview extracted SEO data
