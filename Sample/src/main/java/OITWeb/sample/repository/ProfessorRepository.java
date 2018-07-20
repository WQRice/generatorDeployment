package OITWeb.sample.repository;

import OITWeb.sample.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RepositoryRestResource(collectionResourceRel = "Professor", path = "Professor")
public interface ProfessorRepository extends JpaRepository<Professor,Long>{
	List<Professor> findByCourseInProfessor(Course course);

	List<Professor> findByOfficeInProfessor(Office office);

}