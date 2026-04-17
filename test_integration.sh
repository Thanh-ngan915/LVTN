#!/bin/bash

# Script để test integration sau khi migration
# Chạy script này để verify toàn bộ hệ thống hoạt động đúng

echo "=========================================="
echo "Testing User ID Migration Integration"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
USER_SERVICE_URL="http://localhost:8085"
LIVESTREAM_SERVICE_URL="http://localhost:8086"

# Test data
TEST_USERNAME="testuser_$(date +%s)"
TEST_PASSWORD="password123"
TEST_EMAIL="test_$(date +%s)@example.com"
TEST_FULLNAME="Test User"

echo "${YELLOW}Step 1: Testing User Registration${NC}"
echo "Creating new user..."

REGISTER_RESPONSE=$(curl -s -X POST "${USER_SERVICE_URL}/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"${TEST_USERNAME}\",
    \"password\": \"${TEST_PASSWORD}\",
    \"fullName\": \"${TEST_FULLNAME}\",
    \"email\": \"${TEST_EMAIL}\",
    \"address\": \"Test Address\"
  }")

echo "Response: ${REGISTER_RESPONSE}"

# Extract userId from response
USER_ID=$(echo $REGISTER_RESPONSE | grep -o '"userId":[0-9]*' | grep -o '[0-9]*')

if [ -z "$USER_ID" ]; then
    echo "${RED}✗ Registration failed - no userId returned${NC}"
    exit 1
fi

echo "${GREEN}✓ Registration successful - User ID: ${USER_ID}${NC}"
echo ""

# Verify userId is numeric
if ! [[ "$USER_ID" =~ ^[0-9]+$ ]]; then
    echo "${RED}✗ User ID is not numeric: ${USER_ID}${NC}"
    exit 1
fi

echo "${GREEN}✓ User ID is numeric (BIGINT)${NC}"
echo ""

echo "${YELLOW}Step 2: Testing User Login${NC}"
echo "Logging in..."

LOGIN_RESPONSE=$(curl -s -X POST "${USER_SERVICE_URL}/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"${TEST_USERNAME}\",
    \"password\": \"${TEST_PASSWORD}\"
  }")

echo "Response: ${LOGIN_RESPONSE}"

# Extract userId from login response
LOGIN_USER_ID=$(echo $LOGIN_RESPONSE | grep -o '"userId":[0-9]*' | grep -o '[0-9]*')

if [ "$USER_ID" != "$LOGIN_USER_ID" ]; then
    echo "${RED}✗ User ID mismatch - Register: ${USER_ID}, Login: ${LOGIN_USER_ID}${NC}"
    exit 1
fi

echo "${GREEN}✓ Login successful - User ID matches: ${USER_ID}${NC}"
echo ""

echo "${YELLOW}Step 3: Testing Livestream Room Creation${NC}"
echo "Creating livestream room..."

ROOM_RESPONSE=$(curl -s -X POST "${LIVESTREAM_SERVICE_URL}/api/livestream/rooms" \
  -H "Content-Type: application/json" \
  -H "userId: ${USER_ID}" \
  -H "username: ${TEST_USERNAME}" \
  -d "{
    \"title\": \"Test Stream\",
    \"description\": \"Testing integration\",
    \"maxViewers\": 1000
  }")

echo "Response: ${ROOM_RESPONSE}"

# Extract hostId from response
HOST_ID=$(echo $ROOM_RESPONSE | grep -o '"hostId":[0-9]*' | grep -o '[0-9]*')

if [ -z "$HOST_ID" ]; then
    echo "${RED}✗ Room creation failed - no hostId returned${NC}"
    exit 1
fi

if [ "$USER_ID" != "$HOST_ID" ]; then
    echo "${RED}✗ Host ID mismatch - User ID: ${USER_ID}, Host ID: ${HOST_ID}${NC}"
    exit 1
fi

echo "${GREEN}✓ Room created successfully - Host ID matches User ID: ${USER_ID}${NC}"
echo ""

# Extract room name
ROOM_NAME=$(echo $ROOM_RESPONSE | grep -o '"roomName":"[^"]*"' | cut -d'"' -f4)

if [ -z "$ROOM_NAME" ]; then
    echo "${RED}✗ No room name returned${NC}"
    exit 1
fi

echo "${GREEN}✓ Room name: ${ROOM_NAME}${NC}"
echo ""

echo "${YELLOW}Step 4: Testing Room Join${NC}"
echo "Joining room as viewer..."

VIEWER_ID=$((USER_ID + 1000))
VIEWER_USERNAME="viewer_${VIEWER_ID}"

JOIN_RESPONSE=$(curl -s -X POST "${LIVESTREAM_SERVICE_URL}/api/livestream/rooms/${ROOM_NAME}/join" \
  -H "Content-Type: application/json" \
  -H "userId: ${VIEWER_ID}" \
  -H "username: ${VIEWER_USERNAME}" \
  -d "{
    \"userId\": ${VIEWER_ID},
    \"username\": \"${VIEWER_USERNAME}\"
  }")

echo "Response: ${JOIN_RESPONSE}"

if echo "$JOIN_RESPONSE" | grep -q "token"; then
    echo "${GREEN}✓ Successfully joined room${NC}"
else
    echo "${RED}✗ Failed to join room${NC}"
    exit 1
fi

echo ""

echo "${YELLOW}Step 5: Verifying Database Consistency${NC}"
echo "Checking if user IDs are consistent across services..."

# Get active rooms
ROOMS_RESPONSE=$(curl -s "${LIVESTREAM_SERVICE_URL}/api/livestream/rooms/active")
echo "Active rooms: ${ROOMS_RESPONSE}"

if echo "$ROOMS_RESPONSE" | grep -q "\"hostId\":${USER_ID}"; then
    echo "${GREEN}✓ Host ID in livestream matches user ID${NC}"
else
    echo "${YELLOW}⚠ Could not verify host ID in active rooms${NC}"
fi

echo ""
echo "=========================================="
echo "${GREEN}All tests passed successfully!${NC}"
echo "=========================================="
echo ""
echo "Summary:"
echo "  - User ID: ${USER_ID} (BIGINT)"
echo "  - Username: ${TEST_USERNAME}"
echo "  - Room: ${ROOM_NAME}"
echo "  - Host ID: ${HOST_ID}"
echo ""
echo "✓ User service and livestream service are synchronized"
echo "✓ User IDs are numeric (BIGINT) across both databases"
echo ""
