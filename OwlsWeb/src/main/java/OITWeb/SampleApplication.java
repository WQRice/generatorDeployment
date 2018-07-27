package OITWeb.sample;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class SampleApplication {
    public static void main(String[] args) {
        System.out.println("Hello word!");
        SpringApplication.run(SampleApplication.class, args);
    }
}
