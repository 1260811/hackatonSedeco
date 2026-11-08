package mx.sedeco.tandas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TandasApplication {

    public static void main(String[] args) {
        SpringApplication.run(TandasApplication.class, args);
    }
}
