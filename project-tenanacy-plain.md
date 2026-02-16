# Pollify — Multi-Tenancy Architecture Documentation
> University Voting SaaS Platform | Version 1.0 | Last Updated: 2026-02-15

| Property | Value |
|----------|-------|
| Version | 1.0 |
| Last Updated | 2026-02-15 |
| Stack | Java Spring Boot + React SPA + PostgreSQL |
| Strategy | Schema-per-Tenant (PostgreSQL) |
| Maintained By | Pollify Development Team |

---

## Table of Contents
1. [Overview](#1-overview)
2. [Architecture Pattern](#2-architecture-pattern)
3. [Core Components](#3-core-components)
4. [Tenant Isolation Strategy](#4-tenant-isolation-strategy)
5. [Tenant Routing Mechanisms](#5-tenant-routing-mechanisms)
6. [Authentication & Authorization](#6-authentication--authorization)
7. [Database Schema Management](#7-database-schema-management)
8. [Tenant Onboarding Service](#8-tenant-onboarding-service)
9. [Real-Time Voting Results](#9-real-time-voting-results)
10. [Best Practices & Rules](#10-best-practices--rules)
11. [Recommended Build Sequence](#11-recommended-build-sequence)
12. [Summary](#12-summary)

---

## 1. Overview

Pollify is a multi-tenant university voting SaaS platform where multiple universities (tenants) share the same application infrastructure while maintaining complete data isolation. Each university operates its own isolated voting environment with its own elections, candidates, voters, and real-time results.

### Key Characteristics

- **Strategy:** Schema-based isolation using PostgreSQL schemas
- **Database:** Single PostgreSQL database with multiple schemas
- **Tenant Resolution:** Email domain detection at login (e.g. `student@ug.edu.gh` resolves to UG tenant)
- **Hibernate Integration:** Multi-tenancy via `MultiTenantConnectionProvider`
- **Migration Management:** Flyway for both master and tenant schemas
- **Real-time Updates:** WebSockets scoped per tenant election

---

## 2. Architecture Pattern

### Multi-Tenancy Model: SCHEMA Isolation

Each university is assigned its own PostgreSQL schema inside a single database. A master schema holds the global tenant registry, super admin accounts, and the email-domain-to-tenant mapping. All tenant schemas share identical table structures but are completely isolated from each other.

```
┌──────────────────────────────────────────────────────────────────┐
│                      PostgreSQL Database                          │
├──────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐            │
│  │   master    │   │  ug_schema  │   │ knust_schema │  ...       │
│  │   schema    │   │             │   │              │            │
│  ├─────────────┤   ├─────────────┤   ├─────────────┤            │
│  │pollify_     │   │   voter     │   │   voter      │            │
│  │  tenant     │   │  election   │   │  election    │            │
│  │super_admin  │   │  candidate  │   │  candidate   │            │
│  │email_domain │   │    vote     │   │    vote      │            │
│  │   _index    │   │election_    │   │election_     │            │
│  │refresh_token│   │  result     │   │  result      │            │
│  └─────────────┘   └─────────────┘   └─────────────┘            │
└──────────────────────────────────────────────────────────────────┘
```

### Schema Structure

| Schema | Tables | Purpose |
|--------|--------|---------|
| `master` | `pollify_tenant`, `super_admin`, `email_domain_index`, `refresh_token`, `password_reset_tokens` | Global platform registry and super admin management |
| `{tenant}_schema` | `voter`, `election`, `candidate`, `vote`, `election_result`, `notification` | Per-university isolated voting data |
| Example: `ug_schema` | voter, election, candidate, vote ... | University of Ghana tenant data |
| Example: `knust_schema` | voter, election, candidate, vote ... | KNUST tenant data |

---

## 3. Core Components

### 3.1 TenantIdentifierResolver

Resolves the current tenant schema for Hibernate using a `ThreadLocal` variable. Default schema is `master`. Thread-safe for concurrent requests across all universities simultaneously.

```java
@Component
public class TenantIdentifierResolver implements CurrentTenantIdentifierResolver {
    private static final String DEFAULT_TENANT = "master";
    private static final ThreadLocal<String> currentTenant = new ThreadLocal<>();

    @Override
    public String resolveCurrentTenantIdentifier() {
        String tenant = currentTenant.get();
        return (tenant != null) ? tenant : DEFAULT_TENANT;
    }

    public static void setCurrentTenant(String tenantId) {
        currentTenant.set(tenantId);
    }

    public static void clear() {
        currentTenant.remove();
    }
}
```

**Key Points:**
- Uses `ThreadLocal` to store tenant context per request thread
- Default is `master` schema
- Thread-safe for concurrent requests from multiple universities

---

### 3.2 SchemaMultiTenantConnectionProvider

Switches PostgreSQL `search_path` to route all Hibernate queries to the correct university schema. Includes SQL injection prevention via regex validation of tenant identifiers.

```java
@Override
public Connection getConnection(String tenantIdentifier) throws SQLException {
    validateTenantIdentifier(tenantIdentifier); // Prevent SQL injection
    final Connection connection = getAnyConnection();
    connection.createStatement().execute(
        "SET search_path TO \"" + tenantIdentifier + "\", public"
    );
    return connection;
}

@Override
public void releaseConnection(String tenantId, Connection conn) throws SQLException {
    conn.createStatement().execute("SET search_path TO \"master\", public");
    conn.close();
}
```

**Security Features:**
- Regex validation prevents SQL injection via schema name
- PostgreSQL identifier length limit enforced (63 chars max)
- Safe schema switching using parameterized `search_path`

---

### 3.3 TenantContext

Application-level tenant ID storage that stays synchronized with `TenantIdentifierResolver`. Services use `TenantContext.getTenantId()` for business logic while Hibernate uses `TenantIdentifierResolver` for schema routing.

```java
public class TenantContext {

    public static void setTenantId(String id) {
        TenantIdentifierResolver.setCurrentTenant(id);
    }

    public static String getTenantId() {
        String id = TenantIdentifierResolver.getCurrentTenant();
        return "master".equals(id) ? null : id; // null = super admin context
    }

    public static void clear() {
        TenantIdentifierResolver.clear();
    }
}
```

---

### 3.4 HibernateConfig

Configures Hibernate to use `SCHEMA` multi-tenancy strategy, wiring together the connection provider and tenant resolver. DDL is disabled and managed entirely by Flyway.

```java
@Bean
public HibernatePropertiesCustomizer hibernatePropertiesCustomizer() {
    return hibernateProperties -> {
        hibernateProperties.put("hibernate.multi_tenancy_strategy",
            MultiTenancyStrategy.SCHEMA);
        hibernateProperties.put("hibernate.multi_tenant_connection_provider",
            connectionProvider);
        hibernateProperties.put("hibernate.tenant_identifier_resolver",
            tenantResolver);
        hibernateProperties.put("hibernate.hbm2ddl.auto", "none"); // Flyway manages DDL
    };
}
```

---

## 4. Tenant Isolation Strategy

### Data Isolation Levels

| Level | Mechanism | Pollify Application |
|-------|-----------|---------------------|
| Physical | Separate PostgreSQL schema per university | `ug_schema`, `knust_schema`, `ucc_schema` |
| Logical | Application enforces tenant context in all operations | `TenantContext` set on every request |
| Access Control | Queries automatically scoped to current tenant schema | No cross-schema queries possible |

### Schema Isolation Benefits for Pollify

- ✅ Strong data isolation — University A can never access University B election data
- ✅ Easy backup and restore per university tenant
- ✅ Clear separation — voters, elections, candidates all university-scoped
- ✅ Performance optimization possible per tenant schema
- ✅ Simpler than database-per-tenant while stronger than row-level isolation

### Trade-offs

- ⚠️ Schema count limits — PostgreSQL handles thousands of schemas but monitor growth
- ⚠️ Migration complexity — new Flyway migrations must run across all tenant schemas
- ⚠️ Connection pool management at scale

---

## 5. Tenant Routing Mechanisms

### Email Domain Detection (Primary Method)

When a student logs in, the system extracts the domain from their university email and looks it up in `master.email_domain_index` to resolve the correct tenant schema. This is the cleanest approach since every student already has a university email.

| Email | Extracted Domain | Resolved Tenant Schema |
|-------|-----------------|----------------------|
| `kwame@st.ug.edu.gh` | `st.ug.edu.gh` | `ug_schema` |
| `abena@knust.edu.gh` | `knust.edu.gh` | `knust_schema` |
| `kofi@ucc.edu.gh` | `ucc.edu.gh` | `ucc_schema` |
| `admin@pollify.com` | `pollify.com` | `master` (super admin) |

### Filter Execution Order

Every incoming HTTP request passes through two filters before reaching the controller. This ensures tenant context is always resolved before any database operation occurs.

```
Request Flow:
1. TenantResolutionFilter (Order 1)
   ├─ Extract email domain from login request  OR
   ├─ Extract tenantId from JWT token for subsequent requests
   ├─ Look up tenant in master.email_domain_index
   ├─ Set tenant context in ThreadLocal
   └─ Continue to next filter

2. JwtAuthenticationFilter (Order 2)
   ├─ Validate JWT, extract userId and role
   └─ Set Spring SecurityContext

3. Controller
   └─ Execute business logic (tenant context already set)

4. Finally Block (ALWAYS runs)
   └─ TenantContext.clear() → prevents context leaks between requests
```

---

## 6. Authentication & Authorization

### User Roles & Storage

| Role | Stored In | Schema | Purpose |
|------|-----------|--------|---------|
| Super Admin | `master.super_admin` | master | Platform-level management, school onboarding |
| Tenant Admin | `master.pollify_tenant` (embedded) | master | School admin, creates elections |
| Voter | `{tenant_schema}.voter` | tenant | University student, casts votes |

### JWT Token Structure

Every JWT token carries the `tenantId` claim which routes all subsequent requests to the correct university schema.

```json
{
  "sub": "kwame@st.ug.edu.gh",
  "userId": "uuid-here",
  "tenantId": "ug_schema",
  "roles": ["VOTER"],
  "iat": 1234567890,
  "exp": 1234569690
}
```

### Authentication Flows

#### Voter Login
1. Student submits email + password to `/api/auth/login`
2. System extracts domain from email (e.g. `st.ug.edu.gh`)
3. Looks up domain in `master.email_domain_index` → gets `ug_schema`
4. Sets `TenantContext` to `ug_schema`
5. Queries `ug_schema.voter` to validate credentials
6. Issues JWT with `tenantId: ug_schema` and `role: VOTER`
7. All subsequent requests route via JWT `tenantId`

#### Tenant Admin Login
1. School admin submits credentials to `/api/auth/admin/login`
2. System looks up admin in `master.pollify_tenant`
3. Validates credentials against stored hash
4. Issues JWT with their tenant schema and `role: TENANT_ADMIN`

#### Super Admin Login
1. Super admin submits credentials to `/api/auth/super/login`
2. System queries `master.super_admin` directly (no tenant lookup)
3. Issues JWT with `tenantId: master` and `role: SUPER_ADMIN`

### Authentication Service Example

```java
@Transactional
public LoginResponse loginVoter(LoginRequest request) {
    // 1. Extract domain from email
    String domain = extractDomain(request.getEmail());

    // 2. Resolve tenant from domain
    EmailDomainIndex index = emailDomainRepo.findByDomain(domain)
        .orElseThrow(() -> new UnknownTenantException(domain));

    // 3. Set tenant context
    TenantContext.setTenantId(index.getTenantId());

    try {
        // 4. Query tenant schema (automatically routed)
        Voter voter = voterRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), voter.getPasswordHash())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        // 5. Issue JWT with tenantId embedded
        return buildLoginResponse(voter, index.getTenantId(), "VOTER");

    } finally {
        TenantContext.clear(); // Always clear after login
    }
}
```

---

## 7. Database Schema Management

### Master Schema Migration

The master schema is created once on application startup by Flyway. It holds the global tenant registry, email domain index, super admin accounts, and shared token tables.

```sql
-- V1__master_init.sql
CREATE SCHEMA IF NOT EXISTS master;

CREATE TABLE master.pollify_tenant (
    tenant_id        VARCHAR(12) PRIMARY KEY,
    tenant_uuid      UUID NOT NULL UNIQUE,
    university_name  VARCHAR(255) NOT NULL,
    university_email VARCHAR(255) NOT NULL UNIQUE,
    database_schema  VARCHAR(255) NOT NULL UNIQUE,
    tenant_status    VARCHAR(50) NOT NULL,  -- ACTIVE, PENDING, SUSPENDED
    admin_email      VARCHAR(255) NOT NULL UNIQUE,
    admin_password_hash TEXT NOT NULL,
    created_at       TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE master.email_domain_index (
    id           UUID PRIMARY KEY,
    email_domain VARCHAR(255) NOT NULL UNIQUE,  -- e.g. st.ug.edu.gh
    tenant_id    VARCHAR(12) NOT NULL,
    created_at   TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE master.super_admin (
    id            UUID PRIMARY KEY,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    first_name    VARCHAR(100) NOT NULL,
    last_name     VARCHAR(100) NOT NULL,
    created_at    TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE master.refresh_token (
    id         UUID PRIMARY KEY,
    token      TEXT NOT NULL UNIQUE,
    user_id    UUID NOT NULL,
    tenant_id  VARCHAR(12) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
);
```

### Tenant Schema Migration

Each university schema is created programmatically on onboarding. Flyway runs these migrations automatically. All tenant schemas share the same structure.

```sql
-- V2__tenant_init.sql (runs for every new university schema)

CREATE TABLE voter (
    id            UUID PRIMARY KEY,
    tenant_id     VARCHAR(12) NOT NULL,  -- redundant safety field
    first_name    VARCHAR(100) NOT NULL,
    last_name     VARCHAR(100) NOT NULL,
    email         VARCHAR(255) NOT NULL,
    student_id    VARCHAR(50),
    password_hash TEXT NOT NULL,
    has_voted     BOOLEAN NOT NULL DEFAULT FALSE,
    status        VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at    TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT uq_voter_email UNIQUE (email)
);

CREATE TABLE election (
    id               UUID PRIMARY KEY,
    tenant_id        VARCHAR(12) NOT NULL,
    title            VARCHAR(255) NOT NULL,
    description      TEXT,
    election_status  VARCHAR(50) NOT NULL,  -- DRAFT, ACTIVE, CLOSED
    start_time       TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time         TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by       UUID NOT NULL,
    created_at       TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE candidate (
    id          UUID PRIMARY KEY,
    tenant_id   VARCHAR(12) NOT NULL,
    election_id UUID NOT NULL REFERENCES election(id),
    full_name   VARCHAR(255) NOT NULL,
    position    VARCHAR(255) NOT NULL,
    bio         TEXT,
    image_url   VARCHAR(500),
    vote_count  BIGINT NOT NULL DEFAULT 0,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE vote (
    id           UUID PRIMARY KEY,
    tenant_id    VARCHAR(12) NOT NULL,
    election_id  UUID NOT NULL REFERENCES election(id),
    candidate_id UUID NOT NULL REFERENCES candidate(id),
    voter_id     UUID NOT NULL REFERENCES voter(id),
    voted_at     TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT uq_one_vote_per_voter_election
        UNIQUE (voter_id, election_id)  -- duplicate vote prevention
);
```

---

## 8. Tenant Onboarding Service

When a new university is approved by the super admin, `TenantSchemaService` programmatically creates their schema and runs all Flyway migrations. No manual database steps required.

```java
@Service
public class TenantSchemaService {

    private static final Pattern SCHEMA_NAME_PATTERN =
        Pattern.compile("^[a-zA-Z_][a-zA-Z0-9_]*$");

    private final DataSource dataSource;

    public void createTenantSchema(String tenantId) {
        // 1. Validate to prevent SQL injection
        if (!SCHEMA_NAME_PATTERN.matcher(tenantId).matches())
            throw new InvalidTenantIdException(tenantId);

        Connection conn = null;
        try {
            conn = dataSource.getConnection();

            // 2. Create the schema
            conn.createStatement().execute(
                "CREATE SCHEMA IF NOT EXISTS \"" + tenantId + "\"");

            // 3. Switch search_path to new schema
            conn.createStatement().execute(
                "SET search_path TO \"" + tenantId + "\", public");

            // 4. Run Flyway tenant migrations
            Flyway.configure()
                .dataSource(new SingleConnectionDataSource(conn, true))
                .schemas(tenantId)
                .defaultSchema(tenantId)
                .locations("/db/tenant")
                .load()
                .migrate();

        } catch (SQLException e) {
            throw new SchemaCreationException(tenantId, e);
        } finally {
            if (conn != null) conn.close();
        }
    }
}
```

### Auto Migration Sync on Startup

```java
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 10)
public class TenantMigrationBootstrap implements ApplicationRunner {

    @Value("${pollify.tenant.auto-sync-migrations:true}")
    private boolean autoSyncMigrations;

    @Override
    public void run(ApplicationArguments args) {
        if (!autoSyncMigrations) return;

        List<PollifyTenant> tenants = tenantRepository.findAll();
        for (PollifyTenant tenant : tenants) {
            try {
                migrationService.applyPendingMigrations(tenant.getTenantId());
            } catch (Exception e) {
                log.error("Migration failed for tenant: {}", tenant.getTenantId(), e);
            }
        }
    }
}
```

### Application Configuration

```yaml
# application.yml
pollify:
  tenant:
    auto-sync-migrations: true

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/pollify_db
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5

jwt:
  secret: ${JWT_SECRET}      # Must be 256+ bits — never hardcode
  expiration: 1800000        # 30 minutes
```

---

## 9. Real-Time Voting Results

### WebSocket Architecture

Live voting results are delivered via WebSockets. Each subscription is scoped to a specific tenant and election ensuring a voter at University A never receives live updates from University B.

| Aspect | Implementation |
|--------|---------------|
| WebSocket Endpoint | `/ws/elections/{electionId}/results` |
| Tenant Scoping | Tenant extracted from JWT on WebSocket handshake |
| Topic Pattern | `/topic/{tenantId}/election/{electionId}/results` |
| Broadcast Trigger | Fired after every successful vote cast |
| Payload | Candidate list with current vote counts and percentages |
| Security | JWT validated on handshake, tenant verified per message |

### Tenant-Scoped Broadcasting

```java
// Each tenant + election gets its own isolated WebSocket topic
// /topic/ug_schema/election/uuid-here/results
// /topic/knust_schema/election/uuid-here/results

// After a vote is cast, broadcast ONLY to that tenant's topic
public void broadcastResults(String tenantId, UUID electionId) {
    String topic = "/topic/" + tenantId + "/election/" + electionId + "/results";
    LiveResultsResponse results = electionResultsService.getLiveResults(electionId);
    messagingTemplate.convertAndSend(topic, results);
}
```

### Vote Casting Service

```java
@Transactional
public VoteResponse castVote(CastVoteRequest request) {
    String tenantId = TenantContext.getTenantId();
    if (tenantId == null) throw new IllegalStateException("No tenant context");

    // Duplicate vote prevention handled by DB UNIQUE constraint
    // UNIQUE (voter_id, election_id) will throw DataIntegrityViolationException
    Vote vote = new Vote();
    vote.setTenantId(tenantId);
    vote.setElectionId(request.getElectionId());
    vote.setCandidateId(request.getCandidateId());
    vote.setVoterId(getCurrentVoterId());
    vote.setVotedAt(OffsetDateTime.now());

    voteRepository.save(vote);

    // Broadcast live results after successful vote
    broadcastResults(tenantId, request.getElectionId());

    return new VoteResponse("Vote cast successfully");
}
```

---

## 10. Best Practices & Rules

### Critical Development Rules

| Rule | Why It Matters | How to Enforce |
|------|---------------|----------------|
| Always set tenant context **BEFORE** `@Transactional` | Transaction opens with wrong schema if set inside | Set context in filter, never in service methods |
| Always clear context in `finally` block | Prevents tenant context leak between requests | `TenantContext.clear()` in filter's finally block |
| Validate tenant identifiers with regex | Prevents SQL injection via schema name | `Pattern.compile("^[a-zA-Z_][a-zA-Z0-9_]*$")` |
| Include `tenant_id` column on all tenant tables | Safety net for debugging and auditing | Add to all entity classes as `@Column` |
| Never query across tenant schemas | Fundamental isolation violation | Code review + `TenantIsolationTest` |
| Cache tenant domain lookups | Domain resolution happens on every request | `@Cacheable` on `getTenantByDomain()` |
| WebSocket sessions must carry tenant context | Live results must be tenant-isolated | Extract JWT on WS handshake |

### Context Leak Detection (AOP)

```java
@Component
@Aspect
public class TenantContextLeakDetector {

    @AfterReturning("@annotation(org.springframework.web.bind.annotation.RequestMapping)")
    public void checkContextCleared(JoinPoint joinPoint) {
        String currentTenant = TenantIdentifierResolver.getCurrentTenant();
        if (!"master".equals(currentTenant)) {
            log.error("TENANT CONTEXT LEAK DETECTED! Tenant '{}' not cleared after: {}",
                currentTenant, joinPoint.getSignature());
            TenantIdentifierResolver.clear(); // Force clear to prevent data leak
        }
    }
}
```

### Correct vs Incorrect Patterns

```java
// ✅ CORRECT — tenant context set BEFORE transaction
TenantIdentifierResolver.setCurrentTenant(schema);
try {
    transactionalService.performOperation();
} finally {
    TenantIdentifierResolver.clear();
}

// ❌ WRONG — context set INSIDE transaction (too late, wrong schema used)
@Transactional
public void performOperation(String tenantId) {
    TenantIdentifierResolver.setCurrentTenant(tenantId); // Transaction already started!
}
```

### Tenant Isolation Test

```java
@SpringBootTest
@Transactional
public class TenantIsolationTest {

    @Test
    public void testElectionsAreIsolatedByTenant() {
        // University of Ghana tenant
        TenantIdentifierResolver.setCurrentTenant("ug_schema");
        try {
            electionService.createElection(new ElectionRequest("SRC Elections 2026"));
            List<Election> ugElections = electionService.getAllElections();
            assertEquals(1, ugElections.size());
        } finally {
            TenantIdentifierResolver.clear();
        }

        // KNUST tenant — must NOT see UG elections
        TenantIdentifierResolver.setCurrentTenant("knust_schema");
        try {
            List<Election> knustElections = electionService.getAllElections();
            assertEquals(0, knustElections.size()); // Isolated!
            assertFalse(knustElections.stream()
                .anyMatch(e -> e.getTitle().equals("SRC Elections 2026")));
        } finally {
            TenantIdentifierResolver.clear();
        }
    }
}
```

### Performance Optimizations

```java
// Cache tenant domain lookups — runs on every login request
@Service
public class TenantService {

    @Cacheable(value = "tenants", key = "#domain")
    public Optional<PollifyTenant> getTenantByDomain(String domain) {
        return emailDomainIndexRepository.findByDomain(domain);
    }

    @CacheEvict(value = "tenants", allEntries = true)
    public PollifyTenant updateTenant(String tenantId, TenantUpdateRequest request) {
        return tenantRepository.save(updatedTenant);
    }
}
```

---

## 11. Recommended Build Sequence

Follow this exact order — each step must be stable before building on top of it.

| Step | Task | Key Deliverable |
|------|------|----------------|
| **1** | PostgreSQL setup — master schema with tenant registry and email domain index | Master schema live, Flyway running |
| **2** | `AbstractRoutingDataSource` + `ThreadLocal` `TenantIdentifierResolver` | Schema switching working |
| **3** | `TenantResolutionFilter` — email domain lookup and JWT tenant extraction | Every request has tenant context |
| **4** | `TenantSchemaService` — programmatic schema creation with Flyway migrations | New schools onboarded automatically |
| **5** | JWT authentication layered on tenant context | Tokens carry `tenantId` claim |
| **6** | Election and candidate management APIs for tenant admins | Admin can create elections with candidate images |
| **7** | Vote casting with duplicate prevention via `UNIQUE` constraint | One voter, one vote per election |
| **8** | Real-time results via WebSockets scoped per tenant election | Live leaderboard working |
| **9** | React SPA — voter UI, admin dashboard, super admin panel | Full frontend complete |
| **10** | React build integrated into Spring Boot static resources | Single deployable JAR |

---

## 12. Summary

### Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Isolation Strategy** | Schema-based | Strong isolation without complexity of database-per-tenant |
| **Tenant Resolution** | Email domain detection | Every university student already has a university email |
| **Migration Management** | Flyway per schema | Automated, version-controlled, repeatable |
| **Connection Handling** | Single pool + `search_path` switching | Cost-effective for multi-university load |
| **Context Management** | ThreadLocal | Thread-safe per-request tenant context |
| **Real-time Updates** | WebSockets per tenant-election | Live results without polling overhead |

### Strengths

- ✅ **Strong Data Isolation** — Schema-level separation between all universities
- ✅ **Scalable** — PostgreSQL handles hundreds of university tenant schemas well
- ✅ **Secure** — SQL injection prevention and validation at all entry points
- ✅ **Automated Onboarding** — New schools provisioned without any manual DB work
- ✅ **Real-time** — Live election results via tenant-scoped WebSockets
- ✅ **Single Deployable** — React SPA served directly from Spring Boot JAR

### Trade-offs to Monitor

- ⚠️ **Schema Limits** — PostgreSQL practical limit ~1000 schemas per database
- ⚠️ **Migration Complexity** — New Flyway migrations must be applied across all tenant schemas
- ⚠️ **Connection Overhead** — `search_path` switching adds slight per-request overhead
- ⚠️ **Context Discipline** — Developers must always clear `ThreadLocal` in `finally` blocks

---

> **The key to Pollify's multi-tenancy success is disciplined tenant context management: always set context in filters, always clear in finally blocks, validate all tenant identifiers, and scope every WebSocket connection to its tenant.**

---

**Document Version:** 1.0  
**Last Updated:** 2026-02-15  
**Maintained By:** Pollify Development Team