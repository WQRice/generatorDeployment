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
public class ProfessorController {

    @Autowired
    ProfessorRepository professorRepository;

    @Autowired
    CourseRepository courseRepository;

    //get all entitys
    //@CrossOrigin
    //@GetMapping("/Professor")
    //public List<Professor> getAllProfessors(){
    //    return professorRepository.findAll();
    //}

    //create entity profile
    //@CrossOrigin
    @PostMapping("/Professor")
    public Professor createProfessor(@Valid @RequestBody Professor entity){
        return professorRepository.save(entity);
    }

    //get entity by id
    //@CrossOrigin
    //@GetMapping("/Professor/{id}")
    //public Professor getProfessorById(@PathVariable(value="id") Long id){
    //   return professorRepository.findById(id)
    //            .orElseThrow(()->new ResourceNotFoundException("Professor","id",id));
    //}

    //update profile
    //@CrossOrigin
    @PutMapping("/Professor/{id}")
    public Professor updateProfessor(@PathVariable(value="id") Long id, @Valid @RequestBody Professor entityDetail){
        Professor entity=professorRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Professor","id",id));
        entity.setFirstName(entityDetail.getFirstName());
        entity.setLastName(entityDetail.getLastName());
		Professor updateProfessor=professorRepository.save(entity);
        return updateProfessor;
    }

    //associate Professor and Course
    //@CrossOrigin
    @PostMapping("/Professor/{id1}/Course/{id2}")
    public ResponseEntity<?> associateProfessorCourse(@PathVariable(value="id1") Long id1, @PathVariable(value="id2") Long id2){
        Professor professorEntity=professorRepository.findById(id1).orElseThrow(()->new ResourceNotFoundException("Course","id",id1));
        Course courseEntity=courseRepository.findById(id2).orElseThrow(()->new ResourceNotFoundException("Course","id",id2));
        if(courseEntity.getProfessorInCourse()!=null){
            Professor old=courseEntity.getProfessorInCourse();
            old.getCourseInProfessor().remove(courseEntity);
            professorRepository.save(old);
        }
        courseEntity.setProfessorInCourse(professorEntity);
        courseRepository.save(courseEntity);
        if(!professorEntity.getCourseInProfessor().contains(courseEntity))
            professorEntity.getCourseInProfessor().add(courseEntity);
        professorRepository.save(professorEntity);
        return ResponseEntity.ok().build();
    }

    //Delete entity profile
    //@CrossOrigin
    @DeleteMapping("/Professor/{id}")
    public ResponseEntity<?> deleteProfessor(@PathVariable(value="id") Long id){
        Professor professorEntity=professorRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Professor","id",id));
        List<Course> courseList=courseRepository.findByProfessorInCourse(professorEntity);
        for(Course entity:courseList){
            entity.setProfessorInCourse(null);
            courseRepository.save(entity);
        }
        professorRepository.delete(professorEntity);
        return ResponseEntity.ok().build();
    }

}