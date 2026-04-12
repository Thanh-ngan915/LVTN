package org.example.livetreamservice.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import lombok.Getter;
import lombok.Setter;

@Configuration
@ConfigurationProperties(prefix = "livekit")
@Getter
@Setter
public class LiveKitConfig {
    private String url;
    private String apiKey;
    private String apiSecret;
}
