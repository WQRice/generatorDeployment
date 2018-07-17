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
public class StudentController {

    @Autowired
    StudentRepository studentRepository;

    @Autowired
    CourseRepository courseRepository;

    @Autowired
    ProfessorRepository professorRepository;

    @Autowired
    OfficeRepository officeRepository;

    //get all entitys
    //@CrossOrigin
    //@GetMapping("/Student")
    //public List<Student> getAllStudents(){
    //    return studentRepository.findAll();
    //}

    //create entity profile
    //@CrossOrigin
    @PostMapping("/Student")
    public Student createStudent(@Valid @RequestBody Student entity){
        return studentRepository.save(entity);
    }

    //get entity by id
    //@CrossOrigin
    //@GetMapping("/Student/{id}")
    //public Student getStudentById(@PathVariable(value="id") Long id){
    //   return studentRepository.findById(id)
    //            .orElseThrow(()->new ResourceNotFoundException("Student","id",id));
    //}

    //update profile
    //@CrossOrigin
    @PutMapping("/Student/{id}")
    public Student updateStudent(@PathVariable(value="id") Long id, @Valid @RequestBody Student entityDetail){
        Student entity=studentRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Student","id",id));
        entity.setStudentId(entityDetail.getStudentId());
        entity.setFirstName(entityDetail.getFirstName());
        entity.setLastName(entityDetail.getLastName());
		Student updateStudent=studentRepository.save(entity);
        return updateStudent;
    }

    //associate Student and Course
    //@CrossOrigin
    @PostMapping("/Student/{id1}/Course/{id2}")
    public ResponseEntity<?> associateStudentCourse(@PathVariable(value="id1") Long id1, @PathVariable(value="id2") Long id2){
        Student studentEntity=studentRepository.findById(id1).orElseThrow(()->new ResourceNotFoundException("Course","id",id1));
        Course courseEntity=courseRepository.findById(id2).orElseThrow(()->new ResourceNotFoundException("Course","id",id2));
        if(!studentEntity.getCourseInStudent().contains(courseEntity))
            studentEntity.getCourseInStudent().add(courseEntity);
        if(!courseEntity.getStudentInCourse().contains(studentEntity))
            courseEntity.getStudentInCourse().add(studentEntity);
        studentRepository.save(studentEntity);
        courseRepository.save(courseEntity);
        return ResponseEntity.ok().build();
    }

    //Delete entity profile
    //@CrossOrigin
    @DeleteMapping("/Student/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable(value="id") Long id){
        Student studentEntity=studentRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Student","id",id));
        List<Course> courseList=courseRepository.findByStudentInCourse(studentEntity);
        for(Course entity:courseList){
            entity.getStudentInCourse().remove(studentEntity);
            courseRepository.save(entity);
        }
        studentRepository.delete(studentEntity);
        return ResponseEntity.ok().build();
    }

}