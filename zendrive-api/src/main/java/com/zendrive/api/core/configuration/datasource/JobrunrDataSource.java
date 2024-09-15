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
import java.util.Properties;

@Setter
@Configuration()
@EnableJpaRepositories(
	basePackages = "com.zendrive.api.core.repository.jobrunr",
	entityManagerFactoryRef = "jobrunrEntityManager",
	transactionManagerRef = "jobrunrTransactionManager"
)
@ComponentScan(
	basePackages = "com.zendrive.api.core.repository.jobrunr"
)
@EntityScan("com.zendrive.api.core.model.dao.jobrunr.*")
@RequiredArgsConstructor
public class JobrunrDataSource {
	@Bean
	@ConfigurationProperties(prefix = "spring.datasource.jobrunr")
	public DataSourceProperties jobrunrProperties() {
		return new DataSourceProperties();
	}

	@Bean
	public HikariDataSource jobrunrDatasource() {
		return jobrunrProperties()
						 .initializeDataSourceBuilder()
						 .type(HikariDataSource.class)
						 .build();
	}

	@Bean
	public LocalContainerEntityManagerFactoryBean jobrunrEntityManager(
		@Qualifier("jobrunrDatasource") DataSource dataSource
	) {
		LocalContainerEntityManagerFactoryBean entityManager = new LocalContainerEntityManagerFactoryBean();
		entityManager.setDataSource(dataSource);
		entityManager.setPackagesToScan("com.zendrive.api.core.model.dao.jobrunr");

		HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
		entityManager.setJpaVendorAdapter(vendorAdapter);

		Properties properties = new Properties();
		properties.put("hibernate.hbm2ddl.auto", "update");
		properties.put("hibernate.dialect", "org.hibernate.dialect.PostgreSQLDialect");
		properties.put(
			"hibernate.physical_naming_strategy",
			"org.hibernate.boot.model.naming.CamelCaseToUnderscoresNamingStrategy"
		);

		entityManager.setJpaProperties(properties);
		return entityManager;
	}

	@Bean
	public PlatformTransactionManager jobrunrTransactionManager(
		@Qualifier("jobrunrDatasource") DataSource dataSource
	) {
		JpaTransactionManager transactionManager = new JpaTransactionManager();
		transactionManager.setEntityManagerFactory(jobrunrEntityManager(dataSource).getObject());
		return transactionManager;
	}
}
