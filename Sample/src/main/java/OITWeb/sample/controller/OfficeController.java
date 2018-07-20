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
public class OfficeController {

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
    //@GetMapping("/Office")
    //public List<Office> getAllOffices(){
    //    return officeRepository.findAll();
    //}

    //create entity profile
    //@CrossOrigin
    @PostMapping("/Office")
    public Office createOffice(@Valid @RequestBody Office entity){
        return officeRepository.save(entity);
    }

    //get entity by id
    //@CrossOrigin
    //@GetMapping("/Office/{id}")
    //public Office getOfficeById(@PathVariable(value="id") Long id){
    //   return officeRepository.findById(id)
    //            .orElseThrow(()->new ResourceNotFoundException("Office","id",id));
    //}

    //update profile
    //@CrossOrigin
    @PutMapping("/Office/{id}")
    public Office updateOffice(@PathVariable(value="id") Long id, @Valid @RequestBody Office entityDetail){
        Office entity=officeRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Office","id",id));
        entity.setBuilding(entityDetail.getBuilding());
		Office updateOffice=officeRepository.save(entity);
        return updateOffice;
    }

    //associate Office and Professor
    //@CrossOrigin
    @PostMapping("/Office/{id1}/Professor/{id2}")
    public ResponseEntity<?> associateOfficeProfessor(@PathVariable(value="id1") Long id1, @PathVariable(value="id2") Long id2){
        Office officeEntity=officeRepository.findById(id1).orElseThrow(()->new ResourceNotFoundException("Professor","id",id1));
        Professor professorEntity=professorRepository.findById(id2).orElseThrow(()->new ResourceNotFoundException("Professor","id",id2));
        if(officeEntity.getProfessorInOffice()!=null){
            Professor old1=officeEntity.getProfessorInOffice();
            old1.setOfficeInProfessor(null);
            professorRepository.save(old1);
        }
        if(professorEntity.getOfficeInProfessor()!=null){
            Office old2=professorEntity.getOfficeInProfessor();
            old2.setProfessorInOffice(null);
            officeRepository.save(old2);
        }
            professorEntity.setOfficeInProfessor(officeEntity);
        professorRepository.save(professorEntity);
        officeEntity.setProfessorInOffice(professorEntity);
        officeRepository.save(officeEntity);
        return ResponseEntity.ok().build();
    }

    //Delete entity profile
    //@CrossOrigin
    @DeleteMapping("/Office/{id}")
    public ResponseEntity<?> deleteOffice(@PathVariable(value="id") Long id){
        Office officeEntity=officeRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Office","id",id));
        List<Professor> professorList=professorRepository.findByOfficeInProfessor(officeEntity);
        for(Professor entity:professorList){
            entity.setOfficeInProfessor(null);
            professorRepository.save(entity);
        }
        officeRepository.delete(officeEntity);
        return ResponseEntity.ok().build();
    }

}