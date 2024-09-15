package com.zendrive.api.core.configuration.datasource;

import com.zaxxer.hikari.HikariDataSource;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;
import java.util.HashMap;

@Setter
@Configuration()
@EnableJpaRepositories(
	basePackages = "com.zendrive.api.core.repository.zendrive.pgdb",
	entityManagerFactoryRef = "zendriveEntityManager",
	transactionManagerRef = "zendriveTransactionManager"
)
@ComponentScan(
	basePackages = "com.zendrive.api.core.repository.zendrive.pgdb"
)
@EntityScan("com.zendrive.api.core.model.dao.pgdb.*")
@RequiredArgsConstructor
public class ZendriveDataSource {
	@Bean
	@ConfigurationProperties(prefix = "spring.datasource.zendrive")
	public DataSourceProperties zendriveProperties() {
		return new DataSourceProperties();
	}

	@Bean
	public HikariDataSource zendriveDatasource() {
		return zendriveProperties()
						 .initializeDataSourceBuilder()
						 .type(HikariDataSource.class)
						 .build();
	}

	@Bean
	public LocalContainerEntityManagerFactoryBean zendriveEntityManager(
		@Qualifier("zendriveDatasource") DataSource dataSource
	) {
		LocalContainerEntityManagerFactoryBean entityManager = new LocalContainerEntityManagerFactoryBean();
		entityManager.setDataSource(dataSource);
		entityManager.setPackagesToScan("com.zendrive.api.core.model.dao.pgdb");

		HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
		entityManager.setJpaVendorAdapter(vendorAdapter);

		HashMap<String, Object> properties = new HashMap<>();
		properties.put("hibernate.hbm2ddl.auto", "update");
		properties.put("hibernate.dialect", "org.hibernate.dialect.PostgreSQLDialect");
		properties.put(
			"hibernate.physical_naming_strategy",
			"org.hibernate.boot.model.naming.CamelCaseToUnderscoresNamingStrategy"
		);
		entityManager.setJpaPropertyMap(properties);

		entityManager.setJpaVendorAdapter(vendorAdapter);

		return entityManager;
	}

	@Bean
	public PlatformTransactionManager zendriveTransactionManager(
		@Qualifier("zendriveDatasource") DataSource dataSource
	) {
		JpaTransactionManager transactionManager = new JpaTransactionManager();
		transactionManager.setEntityManagerFactory(zendriveEntityManager(dataSource).getObject());
		return transactionManager;
	}
}
