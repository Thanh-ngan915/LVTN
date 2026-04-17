# Architecture Diagram - Before & After Migration

## Before Migration ❌

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                       │
│                                                              │
│  Uses numeric IDs: userId = "1", "2", "3"                  │
└──────────────────┬──────────────────┬───────────────────────┘
                   │                  │
                   │                  │
        ┌──────────▼─────────┐   ┌───▼──────────────────┐
        │  User Service      │   │ Livestream Service   │
        │  Port: 8085        │   │ Port: 8086           │
        └──────────┬─────────┘   └───┬──────────────────┘
                   │                 │
                   │                 │
        ┌──────────▼─────────┐   ┌───▼──────────────────┐
        │   anvi_db          │   │   livestreamdb       │
        │                    │   │                      │
        │  user.id           │   │  livestream_rooms    │
        │  = VARCHAR(50)     │   │  .host_id = BIGINT   │
        │  = UUID            │   │                      │
        │  "023dc255..."     │   │  livestream_         │
        │                    │   │  participants        │
        │  account.user_id   │   │  .user_id = BIGINT   │
        │  = VARCHAR(50)     │   │                      │
        │  = UUID            │   │                      │
        └────────────────────┘   └──────────────────────┘
                ❌                          ✅
        INCOMPATIBLE!              Already correct
```

### Problems:
- ❌ User service uses UUID (String)
- ❌ Livestream service uses BIGINT (Long)
- ❌ Cannot join data between services
- ❌ Frontend sends numbers but backend expects UUID
- ❌ Larger storage (36-50 bytes vs 8 bytes)
- ❌ Slower joins and indexes

---

## After Migration ✅

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                       │
│                                                              │
│  Uses numeric IDs: userId = "1", "2", "3"                  │
└──────────────────┬──────────────────┬───────────────────────┘
                   │                  │
                   │                  │
        ┌──────────▼─────────┐   ┌───▼──────────────────┐
        │  User Service      │   │ Livestream Service   │
        │  Port: 8085        │   │ Port: 8086           │
        │                    │   │                      │
        │  User.id: Long     │   │  Room.hostId: Long   │
        │  Account.userId:   │   │  Participant.userId: │
        │  Long              │   │  Long                │
        └──────────┬─────────┘   └───┬──────────────────┘
                   │                 │
                   │                 │
        ┌──────────▼─────────┐   ┌───▼──────────────────┐
        │   anvi_db          │   │   livestreamdb       │
        │                    │   │                      │
        │  user.id           │   │  livestream_rooms    │
        │  = BIGINT          │   │  .host_id = BIGINT   │
        │  AUTO_INCREMENT    │   │                      │
        │  1, 2, 3, 4...     │   │  livestream_         │
        │                    │   │  participants        │
        │  account.user_id   │   │  .user_id = BIGINT   │
        │  = BIGINT          │   │                      │
        │  1, 2, 3, 4...     │   │  1, 2, 3, 4...       │
        └────────────────────┘   └──────────────────────┘
                ✅                          ✅
           SYNCHRONIZED!            Already correct
```

### Benefits:
- ✅ Both services use BIGINT (Long)
- ✅ Can join data between services
- ✅ Frontend compatible without changes
- ✅ Smaller storage (8 bytes)
- ✅ Faster joins and indexes
- ✅ Simpler code (no UUID generation)
- ✅ Sequential IDs (easier debugging)

---

## Data Flow Example

### User Registration & Livestream Creation

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ POST /api/auth/register
       │ { username: "john", password: "..." }
       │
       ▼
┌──────────────────┐
│  User Service    │
│  (Port 8085)     │
└──────┬───────────┘
       │
       │ 1. Create User (ID auto-generated)
       │
       ▼
┌──────────────────┐
│    anvi_db       │
│                  │
│  INSERT INTO     │
│  user (...)      │
│  VALUES (...)    │
│                  │
│  ← Returns ID: 1 │
└──────┬───────────┘
       │
       │ 2. Return response
       │
       ▼
┌──────────────────┐
│   Browser        │
│                  │
│  Response:       │
│  {               │
│    userId: 1,    │ ← BIGINT!
│    username:     │
│    "john"        │
│  }               │
└──────┬───────────┘
       │
       │ 3. Create livestream room
       │ POST /api/livestream/rooms
       │ Headers: { userId: 1, username: "john" }
       │
       ▼
┌──────────────────┐
│ Livestream Svc   │
│  (Port 8086)     │
└──────┬───────────┘
       │
       │ 4. Create room with hostId = 1
       │
       ▼
┌──────────────────┐
│  livestreamdb    │
│                  │
│  INSERT INTO     │
│  livestream_     │
│  rooms (         │
│    host_id,      │ ← Uses same ID: 1
│    host_name,    │
│    ...           │
│  ) VALUES (      │
│    1,            │ ← Matches user.id!
│    'john',       │
│    ...           │
│  )               │
└──────────────────┘

✅ Both databases now use the same user ID: 1
✅ Can join: anvi_db.user.id = livestreamdb.livestream_rooms.host_id
```

---

## Database Schema Comparison

### User Table

| Aspect | Before | After |
|--------|--------|-------|
| Column Type | `VARCHAR(50)` | `BIGINT` |
| Primary Key | ✅ | ✅ |
| Auto Increment | ❌ | ✅ |
| Example Value | `"023dc255-bc27-4ed2-ae81-a69fccb724eb"` | `1` |
| Storage Size | 36-50 bytes | 8 bytes |
| Index Size | Large | Small |
| Generation | Application (UUID) | Database (AUTO_INCREMENT) |

### Account Table

| Aspect | Before | After |
|--------|--------|-------|
| user_id Type | `VARCHAR(50)` | `BIGINT` |
| Foreign Key | ❌ (different type) | ✅ (same type) |
| Example Value | `"023dc255-bc27-4ed2-ae81-a69fccb724eb"` | `1` |
| Can Join | ❌ | ✅ |

### Permission Table

| Aspect | Before | After |
|--------|--------|-------|
| user_id Type | `VARCHAR(50)` | `BIGINT` |
| Foreign Key | ❌ (different type) | ✅ (same type) |
| Example Value | `"023dc255-bc27-4ed2-ae81-a69fccb724eb"` | `1` |
| Can Join | ❌ | ✅ |

---

## Code Changes Summary

### Entity Classes

```java
// BEFORE
@Entity
public class User {
    @Id
    @Column(name = "id", length = 50)
    private String id;  // UUID
}

// AFTER
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;  // Auto-generated BIGINT
}
```

### Service Layer

```java
// BEFORE
public RegisterResponse register(RegisterRequest request) {
    String userId = UUID.randomUUID().toString();  // Generate UUID
    User user = User.builder()
        .id(userId)  // Set manually
        .fullName(request.getFullName())
        .build();
    userRepository.save(user);
    return RegisterResponse.builder()
        .userId(userId)  // String
        .build();
}

// AFTER
public RegisterResponse register(RegisterRequest request) {
    User user = User.builder()
        .fullName(request.getFullName())
        .build();
    user = userRepository.save(user);  // ID auto-generated
    Long userId = user.getId();  // Get generated ID
    return RegisterResponse.builder()
        .userId(userId)  // Long
        .build();
}
```

---

## Performance Comparison

### Storage

```
UUID Storage:
- user table: 50 bytes × 1,000,000 users = 50 MB
- account table: 50 bytes × 1,000,000 = 50 MB
- permission table: 50 bytes × 1,000,000 = 50 MB
Total: 150 MB

BIGINT Storage:
- user table: 8 bytes × 1,000,000 users = 8 MB
- account table: 8 bytes × 1,000,000 = 8 MB
- permission table: 8 bytes × 1,000,000 = 8 MB
Total: 24 MB

Savings: 126 MB (84% reduction)
```

### Index Performance

```
UUID Index:
- Larger index size
- More disk I/O
- Slower lookups
- Random distribution

BIGINT Index:
- Smaller index size
- Less disk I/O
- Faster lookups
- Sequential distribution
```

### Join Performance

```
UUID Join:
- String comparison (slower)
- Larger memory footprint
- More CPU cycles

BIGINT Join:
- Integer comparison (faster)
- Smaller memory footprint
- Fewer CPU cycles
```

---

## Migration Path

```
┌─────────────────┐
│  Current State  │
│  (UUID)         │
└────────┬────────┘
         │
         │ Step 1: Backup
         ▼
┌─────────────────┐
│  Backup DB      │
└────────┬────────┘
         │
         │ Step 2: Run Migration
         ▼
┌─────────────────┐
│  Add new        │
│  BIGINT columns │
└────────┬────────┘
         │
         │ Step 3: Map Data
         ▼
┌─────────────────┐
│  Create mapping │
│  UUID → BIGINT  │
└────────┬────────┘
         │
         │ Step 4: Update FKs
         ▼
┌─────────────────┐
│  Update foreign │
│  keys           │
└────────┬────────┘
         │
         │ Step 5: Drop old
         ▼
┌─────────────────┐
│  Drop UUID      │
│  columns        │
└────────┬────────┘
         │
         │ Step 6: Rebuild
         ▼
┌─────────────────┐
│  Rebuild code   │
│  & test         │
└────────┬────────┘
         │
         │ Step 7: Verify
         ▼
┌─────────────────┐
│  New State      │
│  (BIGINT)       │
│  ✅ Synchronized│
└─────────────────┘
```

---

## Success Metrics

✅ **Database Level**
- user.id is BIGINT AUTO_INCREMENT
- account.user_id is BIGINT
- permission.user_id is BIGINT
- All foreign keys are consistent

✅ **Code Level**
- User entity uses Long
- All DTOs use Long for userId
- No UUID generation in code
- All repositories use Long

✅ **Integration Level**
- Registration returns numeric userId
- Login returns numeric userId
- Livestream uses numeric hostId
- Frontend works without changes

✅ **Performance Level**
- Smaller database size
- Faster queries
- Better index performance
- Reduced memory usage
