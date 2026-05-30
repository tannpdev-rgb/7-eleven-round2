package com.tannpdev.backend.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@MapperScan({"com.tannpdev.backend.mbg.mapper","com.tannpdev.backend.dao"})
public class MyBatisConfig {
}
