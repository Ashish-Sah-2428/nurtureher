#!/bin/bash

# 🚀 NurtureHer - Deployment Test Script
# This script tests the build before deploying

echo "🔧 NurtureHer Deployment Test Script"
echo "====================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Function to print test result
test_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ PASS${NC}: $2"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC}: $2"
        ((FAILED++))
    fi
}

echo "📦 Step 1: Checking Dependencies"
echo "--------------------------------"

# Check if node_modules exists
if [ -d "node_modules" ]; then
    test_result 0 "node_modules directory exists"
else
    echo -e "${YELLOW}⚠ Installing dependencies...${NC}"
    npm install
    test_result $? "Dependencies installed"
fi

# Check if package.json has React in dependencies
if grep -q '"react":' package.json | head -1 | grep -q "dependencies"; then
    test_result 0 "React is in dependencies (not devDependencies)"
else
    test_result 1 "React should be in dependencies"
fi

echo ""
echo "🏗️  Step 2: Building Application"
echo "--------------------------------"

# Clean dist folder
rm -rf dist
test_result $? "Cleaned dist folder"

# Run build
npm run build > /tmp/build-output.txt 2>&1
BUILD_RESULT=$?
test_result $BUILD_RESULT "Build completed"

if [ $BUILD_RESULT -eq 0 ]; then
    echo -e "${GREEN}Build successful!${NC}"
else
    echo -e "${RED}Build failed! Output:${NC}"
    cat /tmp/build-output.txt
fi

echo ""
echo "📁 Step 3: Checking Build Output"
echo "--------------------------------"

# Check if dist folder exists
if [ -d "dist" ]; then
    test_result 0 "dist folder created"
else
    test_result 1 "dist folder not found"
fi

# Check if index.html exists
if [ -f "dist/index.html" ]; then
    test_result 0 "index.html exists"
else
    test_result 1 "index.html not found"
fi

# Check if assets folder exists
if [ -d "dist/assets" ]; then
    test_result 0 "assets folder exists"
    
    # Count JS files
    JS_COUNT=$(find dist/assets -name "*.js" | wc -l)
    if [ $JS_COUNT -gt 0 ]; then
        test_result 0 "JavaScript files generated ($JS_COUNT files)"
    else
        test_result 1 "No JavaScript files found"
    fi
    
    # Count CSS files
    CSS_COUNT=$(find dist/assets -name "*.css" | wc -l)
    if [ $CSS_COUNT -gt 0 ]; then
        test_result 0 "CSS files generated ($CSS_COUNT files)"
    else
        test_result 1 "No CSS files found"
    fi
else
    test_result 1 "assets folder not found"
fi

echo ""
echo "📄 Step 4: Checking Configuration Files"
echo "---------------------------------------"

# Check vite.config.ts
if grep -q 'base: "/"' vite.config.ts || grep -q "base: '/'" vite.config.ts; then
    test_result 0 "vite.config.ts has correct base path"
else
    test_result 1 "vite.config.ts base path should be '/'"
fi

# Check for _redirects file
if [ -f "public/_redirects" ]; then
    test_result 0 "_redirects file exists"
else
    test_result 1 "_redirects file not found (needed for Netlify)"
fi

# Check for render.yaml
if [ -f "render.yaml" ]; then
    test_result 0 "render.yaml exists"
else
    test_result 1 "render.yaml not found (needed for Render)"
fi

echo ""
echo "🔍 Step 5: Testing Build Content"
echo "--------------------------------"

# Check if index.html has root div
if grep -q 'id="root"' dist/index.html; then
    test_result 0 "index.html has root div"
else
    test_result 1 "index.html missing root div"
fi

# Check if index.html references JS files
if grep -q '<script' dist/index.html; then
    test_result 0 "index.html references JavaScript files"
else
    test_result 1 "index.html missing script tags"
fi

echo ""
echo "📊 Test Summary"
echo "==============="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed! Ready to deploy!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Test locally: npm run serve"
    echo "2. Push to GitHub: git push origin main"
    echo "3. Deploy on Render"
    exit 0
else
    echo -e "${RED}⚠️  Some tests failed. Please fix issues before deploying.${NC}"
    echo ""
    echo "Common fixes:"
    echo "1. Move React to dependencies: Check package.json"
    echo "2. Fix vite.config.ts: Ensure base: '/'"
    echo "3. Add _redirects file in /public/"
    echo "4. Run: npm install && npm run build"
    exit 1
fi
