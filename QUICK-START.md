# 🚀 Pollify Quick Start Guide

## ⚡ Getting Started in 3 Steps

### 1. Setup Database
```bash
./setup-database.sh
```

### 2. Run the Application
```bash
./gradlew bootRun
```
✅ This automatically builds the frontend and starts the backend on **localhost:8080**

### 3. Open Your Browser
```
http://localhost:8080
```

---

## 🛠️ Common Commands

### Development

#### Full Stack Development (Single Port)
```bash
./gradlew bootRun
```
- Frontend + Backend on `localhost:8080`
- Frontend auto-builds before server starts
- Best for: Testing full integration

#### Frontend Development with Hot Reload
```bash
# Terminal 1: Backend
./gradlew bootRun

# Terminal 2: Frontend
cd pollify-frontend && npm run dev
```
- Backend: `localhost:8080`
- Frontend: `localhost:5173` (with hot-reload)
- Best for: Frontend development

### Production

#### Build JAR
```bash
./gradlew clean bootJar
```
Output: `build/libs/pollify-0.0.1-SNAPSHOT.jar`

#### Run JAR
```bash
java -jar build/libs/pollify-0.0.1-SNAPSHOT.jar
```

### Frontend Tasks

#### List Frontend Tasks
```bash
./gradlew tasks --group=frontend
```

#### Build Frontend Only
```bash
./gradlew buildFrontend
```

#### Clean Frontend
```bash
./gradlew cleanFrontend
```

---

## 📂 Project Structure

```
pollify/
├── pollify-frontend/          # React SPA
│   ├── src/                   # React source code
│   ├── dist/                  # Build output (gitignored)
│   └── vite.config.ts         # Vite configuration
│
├── src/main/
│   ├── java/                  # Spring Boot backend
│   │   └── .../config/
│   │       ├── SpaConfig.java              # SPA routing
│   │       └── StaticResourceConfig.java   # Caching strategy
│   └── resources/
│       ├── static/            # Frontend build (gitignored)
│       └── application.yaml   # Server config (port: 8080)
│
├── build.gradle.kts           # Gradle config with Node.js plugin
├── FRONTEND-INTEGRATION.md    # Detailed documentation
└── QUICK-START.md            # This file
```

---

## 🌐 URL Reference

### Production (localhost:8080)
- Frontend: `http://localhost:8080`
- API: `http://localhost:8080/api/*`
- WebSocket: `http://localhost:8080/ws/*`
- Health: `http://localhost:8080/api/health`

### Development (with hot-reload)
- Frontend: `http://localhost:5173` (proxies API to :8080)
- Backend: `http://localhost:8080`

---

## ✅ Verification Checklist

After running `./gradlew bootRun`:

- [ ] Server starts on port 8080
- [ ] Frontend builds successfully (see logs)
- [ ] `src/main/resources/static/` contains `index.html` and `assets/`
- [ ] Browser loads React app at `http://localhost:8080`
- [ ] No CORS errors in browser console
- [ ] API endpoints respond (e.g., `/api/health`)

---

## 🐛 Troubleshooting

### Port 8080 already in use
```bash
# Find and kill the process
lsof -ti:8080 | xargs kill -9
```

### Frontend not building
```bash
./gradlew cleanFrontend buildFrontend --info
```

### Database connection issues
```bash
./reset-database.sh
./setup-database.sh
```

### Clean everything and start fresh
```bash
./gradlew clean
./reset-database.sh
./setup-database.sh
./gradlew bootRun
```

---

## 📖 Need More Details?

See **[FRONTEND-INTEGRATION.md](./FRONTEND-INTEGRATION.md)** for:
- Complete architecture explanation
- Configuration details
- Advanced usage
- Security features
- Caching strategy

---

**You're all set! 🎉**
