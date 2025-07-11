<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Project: BWF Ventures Iframe SEO

## Overview

This is a Next.js 15 project optimized for SEO that displays an iframe of the BWF Ventures platform. The project focuses on performance, accessibility, and search engine optimization.

## Key Technologies

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- next-seo for advanced SEO
- React Server Components

## Development Guidelines

### SEO Best Practices

- Always include proper meta tags using next-seo
- Use semantic HTML structure
- Include structured data when applicable
- Optimize images with Next.js Image component
- Implement proper heading hierarchy (h1, h2, h3, etc.)
- Add descriptive alt text for images
- Use meaningful link text

### Performance Optimization

- Lazy load iframes when possible
- Use intersection observers for performance
- Optimize bundle size with dynamic imports
- Implement proper caching strategies
- Minimize layout shifts (CLS)
- Optimize Core Web Vitals

### Environment Variables

- `NEXT_PUBLIC_IFRAME_URL`: The URL for the iframe content
- `NEXT_PUBLIC_SITE_NAME`: Site name for SEO
- `NEXT_PUBLIC_SITE_DESCRIPTION`: Site description for SEO
- `NEXT_PUBLIC_SITE_URL`: Base URL for canonical links

### Code Style

- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Implement proper error boundaries
- Add loading states for better UX
- Use Tailwind CSS for styling

### Testing Considerations

- Test iframe loading and error states
- Verify SEO meta tags
- Check accessibility compliance
- Test on different screen sizes
- Validate performance metrics

### Security

- Implement proper iframe sandboxing
- Use secure referrer policies
- Add appropriate CSP headers
- Validate external URLs
