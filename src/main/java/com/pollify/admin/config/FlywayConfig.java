package com.pollify.admin.config;

import org.flywaydb.core.Flyway;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import javax.sql.DataSource;

/**
 * Flyway configuration that runs BEFORE JPA initialization.
 * This ensures the master schema is created before Hibernate tries to use it.
 */
@Configuration
public class FlywayConfig {

    @Value("${spring.flyway.locations:classpath:db/migration/master}")
    private String locations;

    @Bean(initMethod = "migrate", name = "flyway")
    @Order(1)  // Run first
    public Flyway flyway(DataSource dataSource) {
        return Flyway.configure()
                .dataSource(dataSource)
                .locations(locations)
                .schemas("master")
                .defaultSchema("master")
                .baselineOnMigrate(true)
                .load();
    }
}
