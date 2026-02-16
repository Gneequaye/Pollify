package com.pollify.pollify.service;

import com.pollify.pollify.multitenancy.TenantIdentifierResolver;
import lombok.extern.slf4j.Slf4j;
import org.flywaydb.core.Flyway;
import org.springframework.jdbc.datasource.SingleConnectionDataSource;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.regex.Pattern;

/**
 * Service for programmatic tenant schema creation and migration management.
 * When a new university is approved, this service creates their schema
 * and runs all Flyway migrations automatically.
 */
@Service
@Slf4j
public class TenantSchemaService {

    private static final Pattern SCHEMA_NAME_PATTERN = Pattern.compile("^[a-zA-Z_][a-zA-Z0-9_]*$");
    private static final int MAX_SCHEMA_NAME_LENGTH = 63; // PostgreSQL identifier length limit

    private final DataSource dataSource;

    public TenantSchemaService(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    /**
     * Creates a new tenant schema and runs all migrations
     */
    public void createTenantSchema(String tenantId) {
        log.info("Creating tenant schema: {}", tenantId);
        
        // 1. Validate to prevent SQL injection
        validateTenantIdentifier(tenantId);

        Connection conn = null;
        try {
            conn = dataSource.getConnection();

            // 2. Create the schema
            String createSchemaSql = "CREATE SCHEMA IF NOT EXISTS \"" + tenantId + "\"";
            conn.createStatement().execute(createSchemaSql);
            log.info("Created schema: {}", tenantId);

            // 3. Switch search_path to new schema
            String setSearchPathSql = "SET search_path TO \"" + tenantId + "\", public";
            conn.createStatement().execute(setSearchPathSql);

            // 4. Run Flyway tenant migrations
            Flyway flyway = Flyway.configure()
                .dataSource(new SingleConnectionDataSource(conn, true))
                .schemas(tenantId)
                .defaultSchema(tenantId)
                .locations("classpath:db/migration/tenant")
                .load();
            
            flyway.migrate();
            log.info("Flyway migrations completed for tenant: {}", tenantId);

        } catch (SQLException e) {
            log.error("Failed to create schema for tenant: {}", tenantId, e);
            throw new RuntimeException("Schema creation failed for tenant: " + tenantId, e);
        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                    log.error("Failed to close connection", e);
                }
            }
        }
    }

    /**
     * Applies pending migrations to an existing tenant schema
     */
    public void applyPendingMigrations(String tenantId) {
        log.info("Applying pending migrations for tenant: {}", tenantId);
        
        validateTenantIdentifier(tenantId);

        // Set tenant context before running migrations
        TenantIdentifierResolver.setCurrentTenant(tenantId);
        
        try {
            Connection conn = dataSource.getConnection();
            try {
                // Switch to tenant schema
                conn.createStatement().execute(
                    "SET search_path TO \"" + tenantId + "\", public"
                );

                // Run pending migrations
                Flyway flyway = Flyway.configure()
                    .dataSource(new SingleConnectionDataSource(conn, true))
                    .schemas(tenantId)
                    .defaultSchema(tenantId)
                    .locations("classpath:db/migration/tenant")
                    .load();
                
                flyway.migrate();
                log.info("Migrations applied successfully for tenant: {}", tenantId);
                
            } finally {
                conn.close();
            }
        } catch (SQLException e) {
            log.error("Failed to apply migrations for tenant: {}", tenantId, e);
            throw new RuntimeException("Migration failed for tenant: " + tenantId, e);
        } finally {
            TenantIdentifierResolver.clear();
        }
    }

    /**
     * Validates tenant identifier to prevent SQL injection attacks
     */
    private void validateTenantIdentifier(String tenantIdentifier) {
        if (tenantIdentifier == null || tenantIdentifier.trim().isEmpty()) {
            throw new IllegalArgumentException("Tenant identifier cannot be null or empty");
        }
        
        if (tenantIdentifier.length() > MAX_SCHEMA_NAME_LENGTH) {
            throw new IllegalArgumentException(
                "Tenant identifier exceeds maximum length: " + MAX_SCHEMA_NAME_LENGTH
            );
        }
        
        if (!SCHEMA_NAME_PATTERN.matcher(tenantIdentifier).matches()) {
            throw new IllegalArgumentException(
                "Invalid tenant identifier format: " + tenantIdentifier + 
                ". Must start with letter or underscore and contain only alphanumeric characters and underscores."
            );
        }
    }
}
