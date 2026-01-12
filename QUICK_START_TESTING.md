# Quick Start - Testing the Backend Improvements

This guide helps you quickly test the security and code quality improvements made to the backend.

## Prerequisites

```bash
# Navigate to backend directory
cd backend

# Install dependencies (if not already done)
pip install -r requirements.txt

# Ensure MongoDB is running
# Local: mongosh (should connect successfully)
# Or use MongoDB Atlas connection string in .env
```

## Test 1: Verify Python Syntax ✅

```bash
python3 -m py_compile main.py auth.py models.py crud.py database.py rate_limiter.py
echo "✅ All Python files compile successfully"
```

## Test 2: Test Password Validation 🔐

```bash
# Start Python REPL
python3

# Test password validation
from models import UserCreate, UserRole

# This should FAIL (too short)
try:
    user = UserCreate(name="Test", email="test@example.com", role=UserRole.CLIENT, password="short")
    print("❌ FAILED: Weak password accepted")
except ValueError as e:
    print(f"✅ PASSED: Weak password rejected - {e}")

# This should FAIL (no uppercase)
try:
    user = UserCreate(name="Test", email="test@example.com", role=UserRole.CLIENT, password="lowercase123")
    print("❌ FAILED: Weak password accepted")
except ValueError as e:
    print(f"✅ PASSED: Weak password rejected - {e}")

# This should PASS
try:
    user = UserCreate(name="Test", email="test@example.com", role=UserRole.CLIENT, password="Strong123!")
    print("✅ PASSED: Strong password accepted")
except ValueError as e:
    print(f"❌ FAILED: Strong password rejected - {e}")

exit()
```

## Test 3: Test Rate Limiter 🚦

```bash
python3

from rate_limiter import login_limiter

# Simulate 6 login attempts from same IP
for i in range(6):
    allowed, remaining = login_limiter.is_allowed("192.168.1.1")
    print(f"Attempt {i+1}: Allowed={allowed}, Remaining={remaining}")
    if i < 5:
        assert allowed == True, f"❌ FAILED: Attempt {i+1} should be allowed"
    else:
        assert allowed == False, "✅ PASSED: 6th attempt blocked"

exit()
```

## Test 4: Start Backend Server 🚀

```bash
# Set environment variables
export MONGODB_URL="mongodb://localhost:27017"
export MONGODB_DB_NAME="sowgen_test"
export SECRET_KEY="test-secret-key-at-least-32-chars-long"

# Start server
python main.py
```

Expected output:
```
⚠️  WARNING: SECRET_KEY not set in environment. Using random key.
⚠️  This is acceptable for development but NOT for production!
⚠️  Set SECRET_KEY environment variable for production deployment.
✅ Connected to MongoDB: sowgen_test
✅ Database indexes created
🔄 Initializing demo users...
✅ Demo users initialized
INFO:     Started server process [PID]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

## Test 5: Test Health Endpoint ❤️

```bash
# In a new terminal
curl http://localhost:8000/health

# Expected response:
# {
#   "status": "healthy",
#   "database": "connected",
#   "timestamp": 1705027200000
# }
```

## Test 6: Test Login with New Passwords 🔑

```bash
# Test with client account
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "client@example.com", "password": "Demo123!"}'

# Expected: Returns access_token and user object

# Test with wrong password
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "client@example.com", "password": "wrong"}'

# Expected: HTTP 401 Unauthorized
```

## Test 7: Test Rate Limiting 🛡️

```bash
# Attempt 6 logins quickly
for i in {1..6}; do
  echo "Attempt $i:"
  curl -X POST http://localhost:8000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email": "client@example.com", "password": "wrong"}' \
    -w "\nHTTP Status: %{http_code}\n"
  sleep 1
done

# Expected: First 5 attempts return 401, 6th returns 429
```

## Test 8: Test Atomic Delete Operations 🗑️

```bash
# First, login and get token
TOKEN=$(curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@xebia.com", "password": "Admin123!"}' \
  -s | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

# Try to delete a non-existent SOW
curl -X DELETE http://localhost:8000/api/sows/non-existent-id \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nHTTP Status: %{http_code}\n"

# Expected: HTTP 404
```

## Test 9: Interactive API Documentation 📚

Open in browser:
```
http://localhost:8000/docs
```

Try these operations:
1. POST /api/auth/login with Demo123!
2. Test /health endpoint
3. View all available endpoints
4. Try creating a user with weak password (should fail)

## Test 10: Database Error Handling 💾

```bash
# Stop MongoDB
# Linux: sudo systemctl stop mongod
# macOS: brew services stop mongodb-community

# Try to start backend
python main.py

# Expected output:
# ❌ Failed to connect to MongoDB: [error details]
#    Connection string: mongodb://localhost:27017
#    Please ensure MongoDB is running and accessible.

# Restart MongoDB
# Linux: sudo systemctl start mongod
# macOS: brew services start mongodb-community
```

## Summary Checklist ✅

After completing all tests, verify:

- [ ] All Python files compile without syntax errors
- [ ] Password validation rejects weak passwords
- [ ] Rate limiter blocks 6th attempt
- [ ] Backend starts successfully
- [ ] Health endpoint returns correct response
- [ ] Login works with new demo passwords (Demo123!, etc.)
- [ ] Rate limiting works (429 on 6th attempt)
- [ ] Atomic delete operations work correctly
- [ ] Interactive docs are accessible
- [ ] Database errors are handled gracefully

## Troubleshooting

### "ModuleNotFoundError: No module named 'X'"
```bash
pip install -r requirements.txt
```

### "Connection refused" when accessing endpoints
```bash
# Check if backend is running
ps aux | grep python
# If not, start it: python main.py
```

### MongoDB connection issues
```bash
# Check MongoDB status
mongosh
# If fails, start MongoDB service
```

### Rate limiter not working
```bash
# Rate limiter is in-memory, so restart backend to reset
# Or wait 5 minutes for window to expire
```

## Next Steps

After all tests pass:
1. Review the changes in detail (see BACKEND_REVIEW_FINAL.md)
2. Update your production environment variables
3. Deploy to staging for further testing
4. Update team documentation on new demo passwords
5. Monitor production logs for security events

## Getting Help

- See `BACKEND_REVIEW_FINAL.md` for comprehensive review
- See `backend/SECURITY_IMPROVEMENTS.md` for security details
- See `backend/README.md` for full documentation
- Check API docs at http://localhost:8000/docs

---

**Quick Start Guide** | Backend Security Improvements | 2026-01-12
