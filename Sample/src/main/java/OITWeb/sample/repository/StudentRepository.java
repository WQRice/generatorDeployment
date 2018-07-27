package OITWeb.sample.repository;

import OITWeb.sample.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RepositoryRestResource(collectionResourceRel = "Student", path = "Student")
public interface StudentRepository extends JpaRepository<Student,Long>{
	List<Student> findByCourseInStudent(Course course);

}