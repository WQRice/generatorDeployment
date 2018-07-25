package OITWeb.sample.controller;

import OITWeb.sample.exception.ResourceNotFoundException;
import OITWeb.sample.model.*;
import OITWeb.sample.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api")
public class CourseController {

    @Autowired
    ProfessorRepository professorRepository;

    @Autowired
    CourseRepository courseRepository;

    //get all entitys
    //@CrossOrigin
    //@GetMapping("/Course")
    //public List<Course> getAllCourses(){
    //    return courseRepository.findAll();
    //}

    //create entity profile
    //@CrossOrigin
    @PostMapping("/Course")
    public Course createCourse(@Valid @RequestBody Course entity){
        return courseRepository.save(entity);
    }

    //get entity by id
    //@CrossOrigin
    //@GetMapping("/Course/{id}")
    //public Course getCourseById(@PathVariable(value="id") Long id){
    //   return courseRepository.findById(id)
    //            .orElseThrow(()->new ResourceNotFoundException("Course","id",id));
    //}

    //update profile
    //@CrossOrigin
    @PutMapping("/Course/{id}")
    public Course updateCourse(@PathVariable(value="id") Long id, @Valid @RequestBody Course entityDetail){
        Course entity=courseRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Course","id",id));
        entity.setClassroom(entityDetail.getClassroom());
		Course updateCourse=courseRepository.save(entity);
        return updateCourse;
    }

    //associate Course and Professor
    //@CrossOrigin
    @PostMapping("/Course/{id1}/Professor/{id2}")
    public ResponseEntity<?> associateCourseProfessor(@PathVariable(value="id1") Long id1, @PathVariable(value="id2") Long id2){
        Course courseEntity=courseRepository.findById(id1).orElseThrow(()->new ResourceNotFoundException("Professor","id",id1));
        Professor professorEntity=professorRepository.findById(id2).orElseThrow(()->new ResourceNotFoundException("Professor","id",id2));
        if(courseEntity.getProfessorInCourse()!=null){
            Professor old=courseEntity.getProfessorInCourse();
            old.getCourseInProfessor().remove(courseEntity);
            professorRepository.save(old);
        }
        if(!professorEntity.getCourseInProfessor().contains(courseEntity))
            professorEntity.getCourseInProfessor().add(courseEntity);
        professorRepository.save(professorEntity);
        courseEntity.setProfessorInCourse(professorEntity);
        courseRepository.save(courseEntity);
        return ResponseEntity.ok().build();
    }

    //Delete entity profile
    //@CrossOrigin
    @DeleteMapping("/Course/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable(value="id") Long id){
        Course courseEntity=courseRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Course","id",id));
        List<Professor> professorList=professorRepository.findByCourseInProfessor(courseEntity);
        for(Professor entity:professorList){
            entity.getCourseInProfessor().remove(courseEntity);
            professorRepository.save(entity);
        }
        courseRepository.delete(courseEntity);
        return ResponseEntity.ok().build();
    }

}