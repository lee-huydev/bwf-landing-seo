# Multi-Page SEO Automation Guide

## Current State: Single Page SEO

Hiện tại, hệ thống chỉ lấy SEO content của **1 page duy nhất** (homepage hoặc URL được chỉ định). Mỗi request đến server sẽ fetch và parse SEO content của page đó.

## Các phương án để lấy SEO cho TẤT CẢ pages:

### 🚀 Option 1: Dynamic Catch-All Routes (RECOMMENDED)

**File được tạo:** `src/app/[...slug]/page.tsx`

**Cách hoạt động:**

- Tự động detect tất cả pages từ sitemap.xml hoặc crawl từ homepage
- Tạo dynamic routes cho mọi path được tìm thấy
- Mỗi page sẽ có SEO riêng được fetch server-side

**Ưu điểm:**

- ✅ Automatic page discovery
- ✅ Individual SEO cho từng page
- ✅ Static generation at build time
- ✅ Perfect SEO score for all pages

**Usage:**

```bash
# Build sẽ tự động generate tất cả pages
npm run build

# Các routes sẽ work automatically:
# /about → fetch SEO từ https://bwfventures.framer.website/about
# /services → fetch SEO từ https://bwfventures.framer.website/services
# /contact → fetch SEO từ https://bwfventures.framer.website/contact
```

### 📊 Option 2: Bulk SEO API

**Endpoint:** `/api/bulk-seo`

**Cách hoạt động:**

- Crawl tất cả pages một lúc
- Return JSON với SEO data của tất cả pages
- Useful cho analytics hoặc SEO audit

**Usage:**

```bash
curl http://localhost:3000/api/bulk-seo
```

**Response example:**

```json
{
  "success": true,
  "totalPages": 15,
  "successfulPages": 14,
  "failedPages": 1,
  "data": [
    {
      "path": "/",
      "url": "https://bwfventures.framer.website",
      "seo": {
        "title": "BWF Ventures - Home",
        "description": "Professional investment platform",
        "keywords": "investment, ventures, BWF"
      }
    },
    {
      "path": "/about",
      "url": "https://bwfventures.framer.website/about",
      "seo": {
        "title": "About BWF Ventures",
        "description": "Learn about our mission and team"
      }
    }
  ]
}
```

### 🔄 Option 3: Auto-Sync với Webhooks

**Endpoint:** `/api/revalidate-seo`

**Cách hoạt động:**

- Webhook để auto-sync khi source site có changes
- Revalidate cache của tất cả pages
- Có thể setup với Framer webhooks hoặc cron jobs

**Setup Webhook:**

```bash
# Method 1: Manual trigger
curl -X POST http://localhost:3000/api/revalidate-seo \
  -H "Authorization: Bearer your-secure-webhook-secret-here"

# Method 2: Setup với Framer webhooks (if available)
# Add webhook URL to Framer: https://yourdomain.com/api/revalidate-seo
```

**Setup Cron Job (trên server):**

```bash
# Revalidate SEO mỗi giờ
0 * * * * curl -X POST https://yourdomain.com/api/revalidate-seo -H "Authorization: Bearer $WEBHOOK_SECRET"
```

### 🛠️ Option 4: Manual Pre-generation

**Cách hoạt động:**

- Run script để generate static pages trước
- Control được exactly những pages nào cần SEO

**Implementation:**

```typescript
// scripts/generate-seo-pages.ts
import { getAllPagePaths } from "../src/lib/sitemap-crawler";
import { fetchSEOContent } from "../src/lib/seo-content";

async function generateAllPages() {
  const baseUrl = "https://bwfventures.framer.website";
  const paths = await getAllPagePaths(baseUrl);

  for (const path of paths) {
    const fullUrl = path === "/" ? baseUrl : `${baseUrl}${path}`;
    const seoContent = await fetchSEOContent(fullUrl);
    console.log(`Generated SEO for: ${path}`);
  }
}

generateAllPages();
```

## 🎯 Recommended Setup

### Step 1: Enable Dynamic Routes

```bash
# Dynamic routing đã được setup tại src/app/[...slug]/page.tsx
# Chỉ cần build là sẽ work:
npm run build
```

### Step 2: Test All Pages

```bash
# Start development server
npm run dev

# Test một vài URLs:
# http://localhost:3000/ (homepage)
# http://localhost:3000/about (about page)
# http://localhost:3000/services (services page)
```

### Step 3: Monitor SEO

```bash
# Check bulk SEO status
curl http://localhost:3000/api/bulk-seo

# View individual page SEO in browser dev tools
# SEO preview tool sẽ hiện ở bottom-right khi development
```

### Step 4: Setup Auto-Sync (Optional)

```bash
# Add to your deployment pipeline:
curl -X POST https://yourdomain.com/api/revalidate-seo \
  -H "Authorization: Bearer $WEBHOOK_SECRET"
```

## 📈 Performance Considerations

**Caching Strategy:**

- SEO content được cache 1 hour (3600s)
- Static generation at build time
- ISR (Incremental Static Regeneration) support

**Build Time:**

- Với nhiều pages, build time sẽ tăng
- Consider limiting số pages trong development

**Memory Usage:**

- Cheerio parsing có thể memory-intensive
- Monitor server resources với nhiều concurrent requests

## 🔍 Debugging

**Check discovered pages:**

```typescript
// In any server component
import { getAllPagePaths } from "@/lib/sitemap-crawler";

const paths = await getAllPagePaths("https://bwfventures.framer.website");
console.log("Discovered paths:", paths);
```

**Check SEO content:**

```bash
# Individual page
curl http://localhost:3000/api/fetch-content?url=https://bwfventures.framer.website/about

# All pages
curl http://localhost:3000/api/bulk-seo
```

**Common Issues:**

1. **No sitemap.xml**: System sẽ fallback to manual discovery
2. **CORS issues**: Server-side fetch should work, nhưng check network policies
3. **Rate limiting**: Add delays between requests nếu cần
4. **Memory issues**: Implement pagination cho bulk operations
