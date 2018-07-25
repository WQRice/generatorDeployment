package OITWeb.sample.repository;
import OITWeb.sample.model.*;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurerAdapter;

@Configuration
public class RepositoryAdapter extends RepositoryRestConfigurerAdapter{
@Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
        config.exposeIdsFor(Professor.class);
        config.exposeIdsFor(Course.class);
    }
}
