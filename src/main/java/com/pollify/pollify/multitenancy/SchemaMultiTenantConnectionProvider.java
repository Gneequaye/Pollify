package com.pollify.pollify.multitenancy;

import org.hibernate.engine.jdbc.connections.spi.MultiTenantConnectionProvider;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.regex.Pattern;

/**
 * Switches PostgreSQL search_path to route all Hibernate queries to the correct university schema.
 * Includes SQL injection prevention via regex validation of tenant identifiers.
 */
@Component
public class SchemaMultiTenantConnectionProvider implements MultiTenantConnectionProvider<String> {

    private static final long serialVersionUID = 1L;
    
    // Regex to validate schema names and prevent SQL injection
    private static final Pattern SCHEMA_NAME_PATTERN = Pattern.compile("^[a-zA-Z_][a-zA-Z0-9_]*$");
    private static final int MAX_SCHEMA_NAME_LENGTH = 63; // PostgreSQL identifier length limit

    private final DataSource dataSource;

    public SchemaMultiTenantConnectionProvider(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public Connection getAnyConnection() throws SQLException {
        return dataSource.getConnection();
    }

    @Override
    public void releaseAnyConnection(Connection connection) throws SQLException {
        connection.close();
    }

    @Override
    public Connection getConnection(String tenantIdentifier) throws SQLException {
        validateTenantIdentifier(tenantIdentifier);
        
        final Connection connection = getAnyConnection();
        try {
            // Switch search_path to tenant schema
            connection.createStatement().execute(
                "SET search_path TO \"" + tenantIdentifier + "\", public"
            );
        } catch (SQLException e) {
            connection.close();
            throw e;
        }
        return connection;
    }

    @Override
    public void releaseConnection(String tenantIdentifier, Connection connection) throws SQLException {
        try {
            // Reset search_path to master schema
            connection.createStatement().execute("SET search_path TO \"master\", public");
        } catch (SQLException e) {
            // Log but don't throw - connection is being closed anyway
        } finally {
            connection.close();
        }
    }

    @Override
    public boolean supportsAggressiveRelease() {
        return false;
    }

    @Override
    public boolean isUnwrappableAs(Class<?> unwrapType) {
        return MultiTenantConnectionProvider.class.isAssignableFrom(unwrapType);
    }

    @Override
    public <T> T unwrap(Class<T> unwrapType) {
        if (isUnwrappableAs(unwrapType)) {
            return unwrapType.cast(this);
        }
        throw new IllegalArgumentException("Cannot unwrap to: " + unwrapType);
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
                "Invalid tenant identifier format: " + tenantIdentifier
            );
        }
    }
}
