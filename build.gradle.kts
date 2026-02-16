plugins {
    java
    id("org.springframework.boot") version "4.0.2"
    id("io.spring.dependency-management") version "1.1.7"
    id("com.github.node-gradle.node") version "7.1.0"
}

group = "com.pollify"
version = "0.0.1-SNAPSHOT"
description = "pollify"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-websocket")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.postgresql:postgresql")
    implementation("org.flywaydb:flyway-core")
    implementation("org.flywaydb:flyway-database-postgresql")
    implementation("io.jsonwebtoken:jjwt-api:0.12.5")
    runtimeOnly("io.jsonwebtoken:jjwt-impl:0.12.5")
    runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.12.5")
    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.security:spring-security-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.withType<Test> {
    useJUnitPlatform()
}

node {
    download.set(true)
    version.set("20.19.1")
    npmVersion.set("10.2.4")
    workDir.set(file("${project.projectDir}/.gradle/nodejs"))
    npmWorkDir.set(file("${project.projectDir}/.gradle/npm"))
    nodeProjectDir.set(file("${project.projectDir}/pollify-frontend"))
}

tasks.register<com.github.gradle.node.npm.task.NpmTask>("buildFrontend") {
    description = "Build React frontend application"
    group = "frontend"
    dependsOn(tasks.npmInstall)
    args.set(listOf("run", "build"))
}

tasks.register<Copy>("copyFrontend") {
    description = "Copy frontend build to Spring Boot static resources"
    group = "frontend"
    dependsOn("buildFrontend")
    from("${project.projectDir}/pollify-frontend/dist")
    into("${project.projectDir}/src/main/resources/static")
}

tasks.register<Delete>("cleanFrontend") {
    description = "Clean frontend build artifacts"
    group = "frontend"
    delete("${project.projectDir}/pollify-frontend/dist")
    delete("${project.projectDir}/pollify-frontend/node_modules")
    delete("${project.projectDir}/src/main/resources/static")
}

tasks.named("processResources") {
    dependsOn("copyFrontend")
}

tasks.named("bootRun") {
    dependsOn("copyFrontend")
}

tasks.named("bootJar") {
    dependsOn("copyFrontend")
}

tasks.named("clean") {
    dependsOn("cleanFrontend")
}
