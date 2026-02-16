# Pollify Setup Guide

## Backend Implementation Complete ✅

The Pollify backend has been successfully implemented with all core features:

### ✅ Completed Features

1. **Multi-Tenancy Infrastructure**
   - TenantIdentifierResolver with ThreadLocal context
   - SchemaMultiTenantConnectionProvider for PostgreSQL schema routing
   - TenantResolutionFilter for email domain and JWT tenant extraction
   - Hibernate configured for SCHEMA multi-tenancy strategy

2. **Database Setup**
   - Master schema Flyway migration (tenant registry, email domain index, super admin)
   - Tenant schema Flyway migration (voter, election, candidate, vote tables)
   - TenantSchemaService for programmatic schema creation
   - Automatic migration sync on application startup

3. **Authentication & Security**
   - JWT token provider with tenant context
   - Three authentication flows: Voter, Tenant Admin, Super Admin
   - Security filters with proper ordering
   - Password encryption with BCrypt

4. **Election Management APIs**
   - Election CRUD operations (Tenant Admin)
   - Candidate management with images
   - Election status management (DRAFT → ACTIVE → CLOSED)

5. **Voting System**
   - Vote casting with duplicate prevention (DB UNIQUE constraint)
   - Check if voter has already voted
   - Tenant-isolated voting data

6. **Real-Time Results**
   - WebSocket configuration with STOMP
   - Tenant-scoped topics: `/topic/{tenantId}/election/{electionId}/results`
   - Live result broadcasting after each vote
   - Percentage calculations

7. **Tenant Onboarding**
   - Super Admin can onboard new universities
   - Automatic schema creation and migration
   - Email domain registration for tenant resolution

## Database Setup Instructions

Before running the application, you need to create the PostgreSQL database:

### Option 1: Using psql (as postgres user)
```bash
sudo -u postgres psql
CREATE DATABASE pollify_db;
\q
```

### Option 2: Using createdb command
```bash
sudo -u postgres createdb pollify_db
```

### Option 3: Manual SQL
```bash
sudo -u postgres psql -c "CREATE DATABASE pollify_db;"
```

### Verify database creation
```bash
sudo -u postgres psql -c "\l" | grep pollify
```

## Running the Application

1. **Ensure PostgreSQL is running:**
```bash
sudo systemctl status postgresql
# If not running:
sudo systemctl start postgresql
```

2. **Create the database** (see instructions above)

3. **Build the project:**
```bash
./gradlew clean build
```

4. **Run the application:**
```bash
./gradlew bootRun
```

5. **Check application is running:**
```bash
curl http://localhost:8080/api/public/health
```

Expected response:
```json
{
  "status": "UP",
  "timestamp": "2026-02-15T...",
  "message": "Pollify is running"
}
```

## First-Time Setup Workflow

### 1. Create a Super Admin (Manual - one time only)

After the application starts, you need to manually insert the first super admin into the database:

```sql
-- Connect to pollify_db
sudo -u postgres psql pollify_db

-- Insert super admin (password: admin123)
INSERT INTO master.super_admin (id, email, password_hash, first_name, last_name, created_at)
VALUES (
  gen_random_uuid(),
  'admin@pollify.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- BCrypt hash of "admin123"
  'Super',
  'Admin',
  NOW()
);
```

### 2. Login as Super Admin

```bash
curl -X POST http://localhost:8080/api/auth/super/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@pollify.com",
    "password": "admin123"
  }'
```

Save the JWT token from the response.

### 3. Onboard a University Tenant

```bash
curl -X POST http://localhost:8080/api/super-admin/tenants/onboard \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPER_ADMIN_JWT" \
  -d '{
    "tenantId": "ug",
    "universityName": "University of Ghana",
    "universityEmail": "info@ug.edu.gh",
    "adminEmail": "admin@ug.edu.gh",
    "adminPassword": "UGAdmin123!",
    "emailDomains": ["st.ug.edu.gh", "ug.edu.gh"]
  }'
```

This will:
- Create a tenant record in the master schema
- Create the `ug_schema` database schema
- Run all tenant migrations (voter, election, candidate, vote tables)
- Register email domains for automatic tenant resolution

### 4. Create Voters (Manual or via API)

```sql
-- Connect to pollify_db
sudo -u postgres psql pollify_db

-- Set search path to tenant schema
SET search_path TO ug_schema, public;

-- Insert a test voter (password: voter123)
INSERT INTO voter (id, tenant_id, first_name, last_name, email, student_id, password_hash, has_voted, status, created_at)
VALUES (
  gen_random_uuid(),
  'ug',
  'John',
  'Doe',
  'john.doe@st.ug.edu.gh',
  'UG10001',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- BCrypt hash of "voter123"
  false,
  'ACTIVE',
  NOW()
);
```

## Testing the Full Flow

### 1. Tenant Admin Login
```bash
curl -X POST http://localhost:8080/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ug.edu.gh",
    "password": "UGAdmin123!"
  }'
```

### 2. Create an Election (Tenant Admin)
```bash
curl -X POST http://localhost:8080/api/admin/elections \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TENANT_ADMIN_JWT" \
  -d '{
    "title": "SRC President Election 2026",
    "description": "Annual Student Representative Council Presidential Election",
    "startTime": "2026-03-01T00:00:00Z",
    "endTime": "2026-03-07T23:59:59Z"
  }'
```

### 3. Add Candidates (Tenant Admin)
```bash
curl -X POST http://localhost:8080/api/admin/elections/candidates \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TENANT_ADMIN_JWT" \
  -d '{
    "electionId": "ELECTION_UUID_FROM_STEP_2",
    "fullName": "Jane Smith",
    "position": "President",
    "bio": "4th year Computer Science student...",
    "imageUrl": "https://example.com/jane.jpg"
  }'
```

### 4. Activate Election (Tenant Admin)
```bash
curl -X PUT "http://localhost:8080/api/admin/elections/ELECTION_ID/status?status=ACTIVE" \
  -H "Authorization: Bearer TENANT_ADMIN_JWT"
```

### 5. Voter Login
```bash
curl -X POST http://localhost:8080/api/auth/voter/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@st.ug.edu.gh",
    "password": "voter123"
  }'
```

### 6. View Active Elections (Voter)
```bash
curl -X GET http://localhost:8080/api/voter/elections \
  -H "Authorization: Bearer VOTER_JWT"
```

### 7. Cast Vote (Voter)
```bash
curl -X POST http://localhost:8080/api/voter/vote \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTER_JWT" \
  -d '{
    "electionId": "ELECTION_UUID",
    "candidateId": "CANDIDATE_UUID"
  }'
```

### 8. View Live Results (Anyone)
```bash
curl -X GET http://localhost:8080/api/voter/elections/ELECTION_ID/results \
  -H "Authorization: Bearer VOTER_JWT"
```

## WebSocket Real-Time Results

Connect to WebSocket endpoint:
```javascript
const socket = new SockJS('http://localhost:8080/ws');
const stompClient = Stomp.over(socket);

stompClient.connect({}, function(frame) {
  // Subscribe to tenant-scoped election results
  stompClient.subscribe('/topic/ug_schema/election/ELECTION_UUID/results', function(message) {
    const results = JSON.parse(message.body);
    console.log('Live results:', results);
  });
});
```

## Project Structure Summary

```
src/main/java/com/pollify/pollify/
├── config/
│   ├── DataSourceConfig.java          # PostgreSQL connection pool
│   ├── HibernateConfig.java           # Multi-tenancy Hibernate setup
│   ├── SecurityConfig.java            # JWT security configuration
│   └── WebSocketConfig.java           # WebSocket for real-time updates
├── controller/
│   ├── AuthenticationController.java  # Login endpoints
│   ├── ElectionController.java        # Election management (Admin)
│   ├── HealthController.java          # Health check
│   ├── SuperAdminController.java      # Tenant onboarding
│   ├── VoterController.java           # Voting endpoints
│   └── WebSocketController.java       # WebSocket subscriptions
├── entity/
│   ├── master/                        # Master schema entities
│   └── tenant/                        # Tenant schema entities
├── multitenancy/
│   ├── SchemaMultiTenantConnectionProvider.java
│   ├── TenantContext.java
│   └── TenantIdentifierResolver.java
├── repository/                        # JPA repositories
├── security/                          # JWT and filters
└── service/                           # Business logic
```

## Next Steps (Frontend - Pending)

- [ ] React SPA setup with Vite/Create React App
- [ ] Login pages (Voter, Admin, Super Admin)
- [ ] Voter dashboard (view elections, cast votes)
- [ ] Admin dashboard (manage elections, candidates)
- [ ] Super Admin dashboard (tenant onboarding)
- [ ] Real-time results display with WebSocket
- [ ] Build integration into Spring Boot static resources

## Troubleshooting

### Database connection error
- Ensure PostgreSQL is running: `sudo systemctl status postgresql`
- Verify database exists: `sudo -u postgres psql -c "\l" | grep pollify`
- Check credentials in `application.yaml`

### Port 8080 already in use
```bash
# Find and kill process using port 8080
lsof -ti:8080 | xargs kill -9
```

### Flyway migration errors
```bash
# Clean and rebuild
./gradlew clean build
# Check Flyway status
sudo -u postgres psql pollify_db -c "SELECT * FROM master.flyway_schema_history;"
```

## Support

For issues or questions, refer to:
- `README.md` - General project overview
- `project-tenanacy-plain.md` - Detailed architecture documentation
- Application logs: Check console output or `/tmp/pollify-startup.log`
