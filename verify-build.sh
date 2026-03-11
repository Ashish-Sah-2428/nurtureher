#!/bin/bash

echo "🔍 NurtureHer Build Verification Script"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check 1: _redirects file
echo "1️⃣  Checking _redirects file..."
if [ -f "public/_redirects" ]; then
    echo -e "${GREEN}✓${NC} _redirects file exists"
    if [ -d "public/_redirects" ]; then
        echo -e "${RED}✗${NC} ERROR: _redirects is a directory, should be a file!"
        exit 1
    fi
    echo "   Content:"
    cat public/_redirects | sed 's/^/   /'
else
    echo -e "${RED}✗${NC} _redirects file missing!"
    exit 1
fi
echo ""

# Check 2: package.json configuration
echo "2️⃣  Checking package.json..."
if grep -q '"enabled": false' package.json && grep -q '"functions": false' package.json; then
    echo -e "${GREEN}✓${NC} Supabase integration disabled in package.json"
else
    echo -e "${YELLOW}⚠${NC}  Warning: Supabase config might not be disabled"
fi
echo ""

# Check 3: figma.config.json
echo "3️⃣  Checking figma.config.json..."
if [ -f "figma.config.json" ]; then
    if grep -q '"deployEdgeFunctions": false' figma.config.json; then
        echo -e "${GREEN}✓${NC} Edge functions deployment disabled"
    else
        echo -e "${YELLOW}⚠${NC}  Warning: Edge functions might deploy"
    fi
else
    echo -e "${YELLOW}⚠${NC}  figma.config.json not found"
fi
echo ""

# Check 4: index.html
echo "4️⃣  Checking index.html..."
if [ -f "index.html" ]; then
    echo -e "${GREEN}✓${NC} index.html exists"
    if grep -q 'id="root"' index.html; then
        echo -e "${GREEN}✓${NC} Root div found"
    else
        echo -e "${RED}✗${NC} Root div missing!"
    fi
    if grep -q 'src="/src/main.tsx"' index.html; then
        echo -e "${GREEN}✓${NC} Main script reference correct"
    else
        echo -e "${RED}✗${NC} Main script reference incorrect!"
    fi
else
    echo -e "${RED}✗${NC} index.html missing!"
    exit 1
fi
echo ""

# Check 5: main.tsx
echo "5️⃣  Checking main.tsx..."
if [ -f "src/main.tsx" ]; then
    echo -e "${GREEN}✓${NC} main.tsx exists"
else
    echo -e "${RED}✗${NC} main.tsx missing!"
    exit 1
fi
echo ""

# Check 6: Environment variables template
echo "6️⃣  Checking environment setup..."
if [ -f ".env.example" ] || [ -f ".env.local" ]; then
    echo -e "${GREEN}✓${NC} Environment file found"
else
    echo -e "${YELLOW}⚠${NC}  No environment template found"
    echo "   Required variables:"
    echo "   - VITE_SUPABASE_URL"
    echo "   - VITE_SUPABASE_ANON_KEY"
fi
echo ""

# Check 7: Supabase client config
echo "7️⃣  Checking Supabase client..."
if [ -f "src/app/utils/supabaseClient.ts" ]; then
    echo -e "${GREEN}✓${NC} Supabase client file exists"
    if grep -q 'VITE_SUPABASE_URL' src/app/utils/supabaseClient.ts; then
        echo -e "${GREEN}✓${NC} Using environment variables"
    fi
else
    echo -e "${RED}✗${NC} Supabase client not found!"
fi
echo ""

# Check 8: Build test
echo "8️⃣  Testing build..."
if npm run build; then
    echo -e "${GREEN}✓${NC} Build successful!"
    
    # Check if dist folder was created
    if [ -d "dist" ]; then
        echo -e "${GREEN}✓${NC} dist folder created"
        
        # Check dist contents
        if [ -f "dist/index.html" ]; then
            echo -e "${GREEN}✓${NC} dist/index.html exists"
        fi
        
        if [ -f "dist/_redirects" ]; then
            echo -e "${GREEN}✓${NC} _redirects copied to dist"
        else
            echo -e "${RED}✗${NC} _redirects NOT in dist folder!"
        fi
        
        # Count JavaScript files
        js_count=$(find dist -name "*.js" | wc -l)
        echo "   JavaScript files: $js_count"
        
        # Check for source maps (should be none in production)
        map_count=$(find dist -name "*.map" | wc -l)
        if [ $map_count -eq 0 ]; then
            echo -e "${GREEN}✓${NC} No source maps (good for production)"
        else
            echo -e "${YELLOW}⚠${NC}  Source maps found: $map_count"
        fi
    else
        echo -e "${RED}✗${NC} dist folder not created!"
        exit 1
    fi
else
    echo -e "${RED}✗${NC} Build failed!"
    exit 1
fi
echo ""

# Summary
echo "========================================"
echo -e "${GREEN}✅ Verification Complete!${NC}"
echo ""
echo "📋 Deployment Checklist:"
echo "   □ Set environment variables in Figma Make"
echo "   □ Verify Supabase project is active"
echo "   □ Test authentication after deployment"
echo "   □ Clear browser cache before testing"
echo ""
echo "🚀 Ready to deploy!"
