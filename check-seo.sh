#!/bin/bash

# SEO Meta Tags Checker
echo "🔍 Checking SEO Meta Tags for localhost:3002"
echo "=================================================="

# Function to extract meta tag content
check_meta() {
    local url="http://localhost:3002"
    local html=$(curl -s "$url")
    
    echo "📄 Page Title:"
    echo "$html" | grep -o '<title[^>]*>[^<]*</title>' | sed 's/<[^>]*>//g'
    echo ""
    
    echo "📝 Meta Description:"
    echo "$html" | grep -o 'name="description"[^>]*content="[^"]*"' | sed 's/.*content="\([^"]*\)".*/\1/'
    echo ""
    
    echo "🔑 Meta Keywords:"
    echo "$html" | grep -o 'name="keywords"[^>]*content="[^"]*"' | sed 's/.*content="\([^"]*\)".*/\1/'
    echo ""
    
    echo "🌐 Open Graph Tags:"
    echo "$html" | grep -o 'property="og:[^"]*"[^>]*content="[^"]*"' | head -10
    echo ""
    
    echo "🐦 Twitter Tags:"
    echo "$html" | grep -o 'name="twitter:[^"]*"[^>]*content="[^"]*"' | head -5
    echo ""
    
    echo "🔗 Canonical URL:"
    echo "$html" | grep -o 'rel="canonical"[^>]*href="[^"]*"' | sed 's/.*href="\([^"]*\)".*/\1/'
    echo ""
    
    echo "🤖 Robots Meta:"
    echo "$html" | grep -o 'name="robots"[^>]*content="[^"]*"' | sed 's/.*content="\([^"]*\)".*/\1/'
    echo ""
    
    echo "📋 JSON-LD Structured Data:"
    echo "$html" | grep -o 'type="application/ld+json"[^>]*>[^<]*</script>' | wc -l | xargs echo "Found JSON-LD scripts:"
    echo ""
    
    echo "🎯 All Meta Tags Count:"
    echo "$html" | grep -o '<meta[^>]*>' | wc -l | xargs echo "Total meta tags:"
    
    echo ""
    echo "✅ SEO Check Complete!"
}

check_meta
