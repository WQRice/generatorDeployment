


 

/**
 * Car Table module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'promise', 'ojs/ojinputtext', 'ojs/ojinputnumber', 'ojs/ojtable', 'ojs/ojarraydataprovider', 'ojs/ojlabel', 'ojs/ojdialog',
        'ojs/ojdatetimepicker', 'ojs/ojpagingcontrol', 'ojs/ojpagingtabledatasource', 'ojs/ojarraytabledatasource', 'ojs/ojselectcombobox', 'ojs/ojlistdataproviderview'],
function(oj, ko, $)
{   
  function viewModel() {
      var self = this;
      //

      self.oneArray = [];
      self.manyArray = [];

      self.attMap = {};


          self.CarObservableArray = ko.observableArray();
      

      self.initialize = function() {

      self.CarObservableArray.removeAll();



      $.get('http://localhost:8080/Car',function(data) {
          //alert(data);
          //console.log(data);
          //console.log(self.deptObservableArray());

          //self.deptObservableArray([]);
          //console.log(self.deptObservableArray().length);

          
          var extractedData = data["_embedded"]["Car"];

           var counter = 0;


          for (var i = 0; i < extractedData.length; i++) {

                                     (function (i) {

                            var topush = {
                        

                              'Car_Id': extractedData[i].id,

                       
                      'Car_Brand': extractedData[i].Brand,                                                                                                          
                       'Car_Price': extractedData[i].Price
              
                            };

                              var defs = [];
                              for (var ii = 0; ii < self.oneArray.length; ii++) {
                               defs.push(new $.Deferred());
                             }

                             

                            $.when.apply($, defs).then(function() {
                                self.CarObservableArray.push(topush);
                                counter++;
                                if (counter == extractedData.length) {
                                    self.CarObservableArray.sort(function (left, right) {
                                        return left.Car_Id == right.Car_Id ? 0 : (left.Car_Id < right.Car_Id ? -1 : 1)
                                    });
                                    // alert(JSON.stringify(self.CourseObservableArray()));
                                }
                            });

                        })(i);



          }
      })

     };
  

              self.addButtonClick=function(){
                oj.Router.rootInstance.store({'page':"Car"});
                oj.Router.rootInstance.go("AddCar");
//            alert('next');
            };
            self.editButtonClick=function(){

                var element = document.getElementById('table');
                var currentRow = element.currentRow;

                var rowIndex = currentRow['rowIndex'];
                var Car = vm.CarObservableArray()[rowIndex];
                // alert("course id" + Course['Course_Id']);
                // vm.inputCourseId(Course['Course_Id']);


                // vm.inputCourseclassroom(Course['Course_classroom']);

                var rootViewModel = ko.dataFor(document.getElementById('globalBody'));
                rootViewModel.frontToEditData(
                    {
                    

                      'id': Car.Car_Id,


                      
                      'Brand': Car.Car_Brand,                                                                                                          
                       'Price': Car.Car_Price         
                    }
                );



                oj.Router.rootInstance.store({'page':"Car"});
                oj.Router.rootInstance.go("EditCar");
//            alert('next');
            };



      self.dataprovider = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.CarObservableArray, {idAttribute: 'Car_Id', sortCriteria : [{key: 'Car_Id', direction: 'ascending'}]}));


      self.columnArray = [
                                            
            {"headerText": "Car Id", "field": "Car_Id", "headerStyle": 'font-weight:bold'},
                  
                    {"headerText": "Car Brand", "field": "Car_Brand", "headerStyle": 'font-weight:bold'},
                 
                    {"headerText": "Car Price", "field": "Car_Price", "headerStyle": 'font-weight:bold'},
                 

                  

          { "renderer": oj.KnockoutTemplateUtils.getRenderer("button_tmpl", true), "style":"text-align: right"}

          ];


        //used to remove the selected row
      self.removeRow = function () {
          var element = document.getElementById('table');
          var currentRow = element.currentRow;


          if (currentRow != null) {
              $.ajax({
                  url: "http://localhost:8080/api/Car/" + self.CarObservableArray()[currentRow['rowIndex']].Car_Id,
                  type: "DELETE",
                  success: function (response) {
                      console.log("delete success");
                      console.log(response);
                      self.CarObservableArray.splice(currentRow['rowIndex'], 1);

                  },

                  error: function (e) {
                      console.log(currentRow['rowIndex']);
                      console.log(e);

                  }
              })
          }


      };




  }

    var vm = new viewModel;

  
  return vm;
});	
