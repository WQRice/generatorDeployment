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
public class CarController {

    @Autowired
    CarRepository carRepository;

    //get all entitys
    //@CrossOrigin
    //@GetMapping("/Car")
    //public List<Car> getAllCars(){
    //    return carRepository.findAll();
    //}

    //create entity profile
    //@CrossOrigin
    @PostMapping("/Car")
    public Car createCar(@Valid @RequestBody Car entity){
        return carRepository.save(entity);
    }

    //get entity by id
    //@CrossOrigin
    //@GetMapping("/Car/{id}")
    //public Car getCarById(@PathVariable(value="id") Long id){
    //   return carRepository.findById(id)
    //            .orElseThrow(()->new ResourceNotFoundException("Car","id",id));
    //}

    //update profile
    //@CrossOrigin
    @PutMapping("/Car/{id}")
    public Car updateCar(@PathVariable(value="id") Long id, @Valid @RequestBody Car entityDetail){
        Car entity=carRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Car","id",id));
        entity.setBrand(entityDetail.getBrand());
        entity.setPrice(entityDetail.getPrice());
		Car updateCar=carRepository.save(entity);
        return updateCar;
    }

    //Delete entity profile
    //@CrossOrigin
    @DeleteMapping("/Car/{id}")
    public ResponseEntity<?> deleteCar(@PathVariable(value="id") Long id){
        Car carEntity=carRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Car","id",id));
        carRepository.delete(carEntity);
        return ResponseEntity.ok().build();
    }

}