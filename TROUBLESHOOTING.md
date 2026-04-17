# Troubleshooting Guide - User ID Migration

## Common Issues & Solutions

---

## 1. Compilation Errors

### Error: "incompatible types: String cannot be converted to Long"

**Cause**: Some files still use String for userId

**Solution**: Check these files have been updated:
```bash
# Check User entity
grep "private String id" userservice/src/main/java/org/example/userservice/entity/User.java

# Should return nothing. If it returns a match, update to:
# private Long id;
```

**Files to verify**:
- ✅ User.java: `private Long id`
- ✅ Account.java: `private Long userId`
- ✅ Permission.java: `private Long userId`
- ✅ LoginResponse.java: `private Long userId`
- ✅ RegisterResponse.java: `private Long userId`

---

### Error: "cannot find symbol: method getId()"

**Cause**: User entity not properly saved before getting ID

**Solution**: Update service code:
```java
// WRONG
User user = User.builder().fullName(...).build();
userRepository.save(user);
Long userId = user.getId(); // May be null!

// CORRECT
User user = User.builder().fullName(...).build();
user = userRepository.save(user); // Reassign!
Long userId = user.getId(); // Now has ID
```

---

## 2. Database Errors

### Error: "Column 'id' cannot be null"

**Cause**: User.id doesn't have @GeneratedValue

**Solution**: Verify User entity:
```java
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ← Must have this!
    @Column(name = "id")
    private Long id;
}
```

---

### Error: "Incorrect integer value: '023dc255-...' for column 'user_id'"

**Cause**: Database still has VARCHAR columns

**Solution**: Run migration script:
```bash
mysql -u root -p anvi_db < anvi_db_migration.sql
```

Verify schema:
```sql
DESCRIBE user;
-- id should be: bigint(20) NOT NULL AUTO_INCREMENT

DESCRIBE account;
-- user_id should be: bigint(20) DEFAULT NULL
```

---

### Error: "Duplicate entry '1' for key 'PRIMARY'"

**Cause**: AUTO_INCREMENT counter is wrong

**Solution**: Reset AUTO_INCREMENT:
```sql
-- Check current max ID
SELECT MAX(id) FROM user;

-- Set AUTO_INCREMENT to max + 1
ALTER TABLE user AUTO_INCREMENT = 10; -- Use max + 1
```

---

### Error: "Foreign key constraint fails"

**Cause**: Foreign keys not updated during migration

**Solution**: Check foreign key relationships:
```sql
-- Verify account.user_id matches user.id
SELECT 
    a.username,
    a.user_id,
    u.id,
    CASE WHEN a.user_id = u.id THEN 'OK' ELSE 'MISMATCH' END AS status
FROM account a
LEFT JOIN user u ON a.user_id = u.id;
```

If mismatches found, re-run migration:
```bash
mysql -u root -p anvi_db < anvi_db_migration.sql
```

---

## 3. Runtime Errors

### Error: "User not found" after login

**Cause**: UserRepository still uses String as ID type

**Solution**: Update repository:
```java
// WRONG
public interface UserRepository extends JpaRepository<User, String>

// CORRECT
public interface UserRepository extends JpaRepository<User, Long>
```

Rebuild:
```bash
cd userservice
./gradlew clean build
```

---

### Error: "Cannot cast Long to String"

**Cause**: Some code still expects String userId

**Solution**: Search for String userId usage:
```bash
# Find all String userId declarations
grep -r "String userId" userservice/src/

# Update each occurrence to Long userId
```

---

### Error: "JSON parse error: Cannot deserialize value of type `java.lang.Long`"

**Cause**: Frontend sending userId as string with quotes

**Solution**: Frontend should send as number:
```javascript
// WRONG
{ "userId": "1" }

// CORRECT
{ "userId": 1 }

// Or let backend parse it (usually works)
```

---

## 4. Service Startup Issues

### Error: "Port 8085 already in use"

**Solution**:
```bash
# Windows
netstat -ano | findstr :8085
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8085 | xargs kill -9
```

---

### Error: "Unable to connect to MySQL"

**Solution**: Check MySQL is running:
```bash
# Windows
net start MySQL

# Linux
sudo systemctl start mysql

# Mac
brew services start mysql
```

Verify connection:
```bash
mysql -u root -p -e "SELECT 1"
```

---

### Error: "Unknown database 'anvi_db'"

**Solution**: Create database:
```bash
mysql -u root -p -e "CREATE DATABASE anvi_db"
mysql -u root -p anvi_db < anvi_db_updated.sql
```

---

## 5. Integration Issues

### Issue: userId is null in response

**Cause**: User not saved properly or ID not generated

**Solution**: Debug service code:
```java
User user = User.builder().fullName(...).build();
System.out.println("Before save: " + user.getId()); // Should be null
user = userRepository.save(user);
System.out.println("After save: " + user.getId()); // Should be 1, 2, 3...
```

Check database:
```sql
SELECT * FROM user ORDER BY id DESC LIMIT 1;
-- Should show the newly created user with numeric ID
```

---

### Issue: Livestream hostId doesn't match userId

**Cause**: Frontend sending wrong userId or service not reading header

**Solution**: Verify headers:
```javascript
// Frontend
fetch('/api/livestream/rooms', {
  headers: {
    'userId': userId.toString(), // Ensure it's a string in header
    'username': username
  }
})
```

Backend:
```java
// Controller
Long userId = Long.parseLong(request.getHeader("userId"));
```

---

### Issue: Cannot join livestream room

**Cause**: User ID mismatch or service not running

**Solution**: 
1. Check both services are running:
```bash
curl http://localhost:8085/actuator/health
curl http://localhost:8086/actuator/health
```

2. Verify user exists:
```sql
SELECT id, full_name FROM user WHERE id = 1;
```

3. Check livestream service logs for errors

---

## 6. Migration Issues

### Issue: Migration script fails halfway

**Solution**: Rollback and retry:
```bash
# Restore from backup
mysql -u root -p -e "DROP DATABASE anvi_db; CREATE DATABASE anvi_db;"
mysql -u root -p anvi_db < backup.sql

# Check what went wrong
mysql -u root -p anvi_db < anvi_db_migration.sql 2>&1 | tee migration.log

# Fix the issue and retry
```

---

### Issue: Old UUID data lost after migration

**Cause**: Migration script dropped mapping table

**Solution**: Mapping table should still exist:
```sql
SELECT * FROM user_id_mapping LIMIT 5;
```

If dropped, restore from backup and re-run migration without dropping mapping table.

---

### Issue: Some users have NULL user_id in account table

**Cause**: Mapping failed for some users

**Solution**: Manually fix:
```sql
-- Find accounts with NULL user_id
SELECT username, user_id FROM account WHERE user_id IS NULL;

-- Update manually if needed
UPDATE account 
SET user_id = (SELECT id FROM user WHERE email = 'user@example.com')
WHERE username = 'username';
```

---

## 7. Testing Issues

### Issue: Test script fails with "command not found: curl"

**Solution**: Install curl:
```bash
# Windows (use Git Bash or install curl)
# Or use test_integration.bat instead

# Linux
sudo apt-get install curl

# Mac
brew install curl
```

---

### Issue: Test returns 404 Not Found

**Cause**: Services not running or wrong URL

**Solution**: 
1. Check services are running
2. Verify URLs:
```bash
# Should return service info
curl http://localhost:8085/actuator/info
curl http://localhost:8086/actuator/info
```

---

### Issue: Test returns 500 Internal Server Error

**Cause**: Database connection or code error

**Solution**: Check service logs:
```bash
# Look for stack traces in console where service is running
# Common issues:
# - Database connection failed
# - NullPointerException (user.getId() is null)
# - Type mismatch (String vs Long)
```

---

## 8. Performance Issues

### Issue: Queries are slow after migration

**Cause**: Missing indexes

**Solution**: Add indexes:
```sql
-- Check existing indexes
SHOW INDEX FROM account;
SHOW INDEX FROM permission;

-- Add indexes if missing
ALTER TABLE account ADD INDEX idx_user_id (user_id);
ALTER TABLE permission ADD INDEX idx_user_id (user_id);
```

---

### Issue: Database size didn't decrease

**Cause**: Need to optimize tables

**Solution**: Optimize tables:
```sql
OPTIMIZE TABLE user;
OPTIMIZE TABLE account;
OPTIMIZE TABLE permission;
```

---

## 9. Rollback Issues

### Issue: Need to rollback but no backup

**Solution**: If you have the old SQL dump files:
```bash
# Use the original anvi_db (1).sql
mysql -u root -p -e "DROP DATABASE anvi_db; CREATE DATABASE anvi_db;"
mysql -u root -p anvi_db < "anvi_db (1).sql"
```

Then revert code:
```bash
git checkout HEAD -- userservice/
cd userservice
./gradlew clean build
```

---

## 10. Verification Issues

### Issue: Not sure if migration succeeded

**Solution**: Run verification script:
```bash
mysql -u root -p anvi_db < verify_migration.sql
```

Check these key points:
```sql
-- 1. User.id should be BIGINT
DESCRIBE user;
-- id | bigint(20) | NO | PRI | NULL | auto_increment

-- 2. Account.user_id should be BIGINT
DESCRIBE account;
-- user_id | bigint(20) | YES | MUL | NULL |

-- 3. Data should exist
SELECT COUNT(*) FROM user;
SELECT COUNT(*) FROM account;

-- 4. Foreign keys should match
SELECT COUNT(*) FROM account a
JOIN user u ON a.user_id = u.id;
-- Should equal total accounts
```

---

## Quick Diagnostic Commands

```bash
# Check database schema
mysql -u root -p anvi_db -e "DESCRIBE user; DESCRIBE account; DESCRIBE permission;"

# Check data types
mysql -u root -p anvi_db -e "
SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, COLUMN_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA='anvi_db' 
AND COLUMN_NAME IN ('id', 'user_id');"

# Check sample data
mysql -u root -p anvi_db -e "
SELECT u.id, u.full_name, a.username, a.user_id 
FROM user u 
LEFT JOIN account a ON u.id = a.user_id 
LIMIT 5;"

# Test registration endpoint
curl -X POST http://localhost:8085/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123","fullName":"Test","email":"test@test.com"}'

# Check service logs
# Look at console where ./gradlew bootRun is running
```

---

## Getting Help

If none of these solutions work:

1. **Check logs**: Look for stack traces in service console
2. **Run verification**: `mysql -u root -p anvi_db < verify_migration.sql`
3. **Test manually**: Use curl commands to test each endpoint
4. **Check files**: Ensure all files were updated correctly
5. **Rebuild clean**: `./gradlew clean build`
6. **Restart services**: Stop and start both services
7. **Check database**: Verify schema and data are correct

---

## Prevention

To avoid issues in the future:

✅ Always backup before migration  
✅ Test in development environment first  
✅ Run verification script after migration  
✅ Keep migration scripts for reference  
✅ Document any custom changes  
✅ Use version control (git)  
✅ Test thoroughly before production  

---

## Emergency Rollback

If everything fails:

```bash
# 1. Stop all services
# Kill Java processes

# 2. Restore database
mysql -u root -p -e "DROP DATABASE anvi_db; CREATE DATABASE anvi_db;"
mysql -u root -p anvi_db < backup_YYYYMMDD.sql

# 3. Revert code
git checkout HEAD -- userservice/

# 4. Rebuild
cd userservice
./gradlew clean build

# 5. Restart
./gradlew bootRun
```

Then investigate the issue before trying again.
