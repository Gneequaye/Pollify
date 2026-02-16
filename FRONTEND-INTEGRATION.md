# 📋 Pollify: SPA + Backend Integration Guide

## 🎯 Overview

The Pollify project integrates a React SPA (`pollify-frontend`) with a Spring Boot backend to run seamlessly on **localhost:8080**. The backend serves both API endpoints AND the frontend static files, eliminating CORS issues and providing a unified deployment.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    localhost:8080                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │         Spring Boot Application                  │   │
│  │                                                   │   │
│  │  ┌──────────────┐      ┌──────────────┐        │   │
│  │  │  REST API    │      │  React SPA   │        │   │
│  │  │  /api/**     │      │  /*, /login  │        │   │
│  │  │  /ws/**      │      │  /dashboard  │        │   │
│  │  └──────────────┘      └──────────────┘        │   │
│  │                                                   │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Key Benefits:**
- ✅ **Single Port (8080)** - No CORS issues
- ✅ **Auto-Build** - Gradle handles frontend automatically
- ✅ **Smart Routing** - SPA routing works, API calls work
- ✅ **Optimized Caching** - Fast load times
- ✅ **Single JAR Deployment** - Frontend + Backend in one file
- ✅ **Security** - Bot scanner protection

---

## 🔧 Configuration Files

### 1. Build Configuration (`build.gradle.kts`)

#### Node.js Plugin
```kotlin
plugins {
    java
    id("org.springframework.boot") version "4.0.2"
    id("io.spring.dependency-management") version "1.1.7"
    id("com.github.node-gradle.node") version "7.1.0"  // ← Added
}

node {
    download.set(true)              // Auto-downloads Node.js
    version.set("20.19.1")         // Specific Node version
    npmVersion.set("10.2.4")       // Specific npm version
    workDir.set(file("${project.projectDir}/.gradle/nodejs"))
    npmWorkDir.set(file("${project.projectDir}/.gradle/npm"))
    nodeProjectDir.set(file("${project.projectDir}/pollify-frontend"))  // Frontend location
}
```

**Purpose:** Gradle automatically downloads and manages Node.js, so you don't need it installed globally.

#### Frontend Build Tasks

**Task 1: buildFrontend**
```kotlin
tasks.register<com.github.gradle.node.npm.task.NpmTask>("buildFrontend") {
    description = "Build React frontend application"
    group = "frontend"
    dependsOn(tasks.npmInstall)
    args.set(listOf("run", "build"))
}
```
- Runs `npm install` in `pollify-frontend/`
- Executes `npm run build` → triggers Vite build

**Task 2: copyFrontend**
```kotlin
tasks.register<Copy>("copyFrontend") {
    description = "Copy frontend build to Spring Boot static resources"
    group = "frontend"
    dependsOn("buildFrontend")
    from("${project.projectDir}/pollify-frontend/dist")
    into("${project.projectDir}/src/main/resources/static")
}
```
- Waits for `buildFrontend` to complete
- Copies all files from `pollify-frontend/dist/` → `src/main/resources/static/`
- Spring Boot automatically serves files from `static/`

**Task 3: cleanFrontend**
```kotlin
tasks.register<Delete>("cleanFrontend") {
    description = "Clean frontend build artifacts"
    group = "frontend"
    delete("${project.projectDir}/pollify-frontend/dist")
    delete("${project.projectDir}/pollify-frontend/node_modules")
    delete("${project.projectDir}/src/main/resources/static")
}
```
- Removes all build artifacts for fresh builds

#### Task Dependencies
```kotlin
tasks.named("processResources") { dependsOn("copyFrontend") }
tasks.named("bootRun") { dependsOn("copyFrontend") }
tasks.named("bootJar") { dependsOn("copyFrontend") }
tasks.named("clean") { dependsOn("cleanFrontend") }
```

**Impact:** Every Gradle command automatically builds the frontend first!

---

### 2. Vite Configuration (`pollify-frontend/vite.config.ts`)

#### Production Build
```typescript
build: {
    outDir: '../src/main/resources/static',  // ✅ Outputs directly to Spring Boot
    emptyOutDir: true,                        // Cleans before build
    sourcemap: false,                         // No source maps in production
    rollupOptions: {
        output: {
            manualChunks: {
                vendor: ['react', 'react-dom', 'react-router-dom'],
                ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', ...]
            }
        }
    }
}
```

**Key Point:** `outDir: '../src/main/resources/static'` makes Vite build directly into Spring Boot's static resource folder!

#### Development Server
```typescript
server: {
    port: 5173,
    proxy: {
        '/api': {
            target: 'http://localhost:8080',  // Proxy API calls to Spring Boot
            changeOrigin: true,
            secure: false
        },
        '/ws': {
            target: 'http://localhost:8080',  // Proxy WebSocket calls
            changeOrigin: true,
            secure: false,
            ws: true
        }
    }
}
```

**Development Mode:**
- Frontend runs on `localhost:5173` (Vite dev server with hot-reload)
- API calls to `/api/*` and `/ws/*` are proxied to `localhost:8080` (Spring Boot)
- No CORS issues during development

**Production Mode:**
- Everything runs on `localhost:8080` (Spring Boot serves both frontend and API)

---

### 3. Spring Boot Configuration

#### SpaConfig.java - SPA Routing Logic

**Key Features:**
1. Serves static files from `classpath:/static/`
2. Fallback to `index.html` for client-side routing (SPA behavior)
3. Smart routing logic:
   ```java
   if (!resourcePath.startsWith("api/") &&    // Not an API call
       !resourcePath.startsWith("ws/") &&      // Not a WebSocket call
       !isStaticResource(resourcePath)) {      // Not a .js, .css, .png, etc.
       return new ClassPathResource("/static/index.html");  // Serve React app
   }
   ```
4. Security: Blocks scanner/bot paths (`.php`, `wp-admin`, `.env`, etc.)

**Example Routing:**
- `GET /` → `index.html` ✅
- `GET /dashboard` → `index.html` ✅ (React Router handles it)
- `GET /api/elections` → Spring Boot API ✅
- `GET /assets/index-abc123.js` → Actual JS file ✅
- `GET /wp-admin.php` → Blocked ❌

#### StaticResourceConfig.java - Caching Strategy

```java
// Aggressive caching for hashed assets (1 year)
registry.addResourceHandler("/assets/**")
    .setCacheControl(CacheControl.maxAge(Duration.ofDays(365))
        .cachePublic()
        .immutable());

// No caching for index.html (must be fresh)
registry.addResourceHandler("/", "/index.html")
    .setCacheControl(CacheControl.noCache()
        .mustRevalidate());
```

**Why?**
- Vite generates hashed filenames: `index-BDk2GE_u.css`
- Hashed files never change → cache forever (performance++)
- `index.html` has no hash → must be fresh (always loads latest app)

#### application.yaml - Server Configuration

```yaml
server:
  port: ${SERVER_PORT:8080}  # Defaults to 8080
```

#### SecurityConfig.java - Security Configuration for SPA

**CRITICAL:** Spring Security must permit access to static resources and SPA routes!

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .sessionManagement(session -> 
            session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            // Public API endpoints
            .requestMatchers("/api/public/**").permitAll()
            .requestMatchers("/api/auth/**").permitAll()
            .requestMatchers("/api/health").permitAll()
            .requestMatchers("/ws/**").permitAll()
            
            // Static resources for SPA - MUST BE PERMITTED
            .requestMatchers(
                "/",
                "/index.html",
                "/assets/**",
                "/favicon.ico",
                "/*.css", "/*.js", "/*.png", "/*.svg", "/*.ico",
                "/*.woff", "/*.woff2", "/*.ttf", "/*.eot"
            ).permitAll()
            
            // Protected API endpoints
            .requestMatchers("/api/super-admin/**").authenticated()
            .requestMatchers("/api/admin/**").authenticated()
            .requestMatchers("/api/voter/**").authenticated()
            .requestMatchers("/api/**").authenticated()
            
            // All other requests (SPA routes) - permit all
            // React Router handles authentication client-side
            .anyRequest().permitAll()
        );
    
    return http.build();
}
```

**Why this matters:**
- ❌ **WRONG**: `.anyRequest().authenticated()` blocks the SPA
- ✅ **CORRECT**: `.anyRequest().permitAll()` allows SPA routes
- The frontend (React) handles authentication/authorization UI
- Protected API endpoints still require JWT authentication

---

### 4. .gitignore - Build Artifacts

```
### Frontend Build Artifacts ###
src/main/resources/static/assets/       # Generated by Vite
src/main/resources/static/index.html    # Generated by Vite
src/main/resources/static/vite.svg

# Node.js
pollify-frontend/dist/
pollify-frontend/node_modules/
.gradle/nodejs/
.gradle/npm/
```

**Why?** These are build artifacts—generated on every build, not checked into Git.

---

## 🏃 Usage Guide

### Development Workflow

#### Option 1: Full Stack (Recommended for testing)
```bash
./gradlew bootRun
```
- Auto-builds frontend
- Starts Spring Boot on `localhost:8080`
- Serves both API + SPA
- Access: http://localhost:8080

#### Option 2: Frontend Development (Hot Reload)
```bash
# Terminal 1: Start Backend
./gradlew bootRun

# Terminal 2: Start Frontend Dev Server
cd pollify-frontend
npm run dev
```
- Backend runs on `localhost:8080`
- Frontend runs on `localhost:5173` with hot-reload
- API calls automatically proxied to `:8080`
- Access: http://localhost:5173

### Production Build

```bash
./gradlew clean bootJar
```

**What happens:**
1. `cleanFrontend` deletes old files
2. `npm install` installs dependencies
3. `npm run build` creates optimized bundle in `src/main/resources/static/`
4. `bootJar` packages everything into a single JAR
5. Run: `java -jar build/libs/pollify-0.0.1-SNAPSHOT.jar`

### Available Gradle Tasks

```bash
./gradlew tasks --group=frontend
```

**Frontend tasks:**
- `buildFrontend` - Build React frontend application
- `cleanFrontend` - Clean frontend build artifacts
- `copyFrontend` - Copy frontend build to Spring Boot static resources

### Manual Frontend Build (Optional)

```bash
./build-frontend.sh
```

Standalone script for manual frontend builds (not used by Gradle).

---

## 📊 File Flow Diagram

```
pollify-frontend/
    ├── src/          (React source code)
    └── dist/         (Vite build output) ──┐
                                             │
                                    [copyFrontend task]
                                             │
                                             ↓
src/main/resources/static/
    ├── index.html
    ├── assets/
    │   ├── index-Bgq7i37d.js
    │   ├── index-BxnaUXaq.css
    │   ├── vendor-D3aBI0Go.js
    │   └── ui-DjyyTd0D.js
    └── ...
                                             │
                                    [Spring Boot serves]
                                             │
                                             ↓
                                    localhost:8080
                                    (Frontend + API)
```

---

## 🔍 Verification

### Check Build Output
```bash
ls -la src/main/resources/static/
```

Expected files:
- `index.html`
- `assets/index-*.js`
- `assets/index-*.css`
- `assets/vendor-*.js`
- `assets/ui-*.js`

### Test the Application
```bash
./gradlew bootRun
```

Visit: http://localhost:8080

**Expected behavior:**
- `/` → Loads React app
- `/dashboard` → Loads React app (client-side routing)
- `/api/health` → Returns API response
- Browser console: No CORS errors

---

## 🚨 Troubleshooting

### Frontend doesn't build
```bash
./gradlew cleanFrontend buildFrontend --info
```

### Static files not found (404)
1. Check if files exist: `ls src/main/resources/static/`
2. Rebuild: `./gradlew clean copyFrontend`
3. Check `SpaConfig.java` is in classpath
4. **MOST COMMON**: Check `SecurityConfig.java` permits static resources (see above)

### API calls fail in production
- Ensure API paths start with `/api/` or `/ws/`
- Check `SpaConfig.java` routing logic

### CORS errors in development
- Ensure Vite proxy is configured (`vite.config.ts`)
- Check backend allows `localhost:5173` if using CORS config

---

## 🎯 Key Innovations

1. ✅ **Single Port (8080)** - No CORS, no complexity
2. ✅ **Auto-Build** - Gradle handles frontend automatically
3. ✅ **Smart Routing** - SPA routing works, API calls work
4. ✅ **Optimized Caching** - Fast load times with content-hashed assets
5. ✅ **Single JAR Deployment** - Frontend + Backend in one file
6. ✅ **Security** - Bot scanner protection built-in
7. ✅ **Development Flexibility** - Full-stack or hot-reload options

---

## 📚 Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [Spring Boot Static Resources](https://docs.spring.io/spring-boot/docs/current/reference/html/web.html#web.servlet.spring-mvc.static-content)
- [Gradle Node Plugin](https://github.com/node-gradle/gradle-node-plugin)

---

**Happy Coding! 🚀**
