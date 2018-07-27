


 

/**
 * Student Table module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'promise', 'ojs/ojinputtext', 'ojs/ojinputnumber', 'ojs/ojtable', 'ojs/ojarraydataprovider', 'ojs/ojlabel', 'ojs/ojdialog',
        'ojs/ojdatetimepicker', 'ojs/ojpagingcontrol', 'ojs/ojpagingtabledatasource', 'ojs/ojarraytabledatasource', 'ojs/ojselectcombobox', 'ojs/ojlistdataproviderview'],
function(oj, ko, $)
{   
  function viewModel() {
      var self = this;
      //

      self.oneArray = [];
      self.manyArray = ["Course"];

      self.attMap = {
    "Course": {
        "oneOrMany": "many",
        "inputAttRef": "inputStudentCourseArray",
        "attInSelfName": "courseInStudent",
        "selfInAttName": "studentInCourse",
        "inputColumnArray": "inputCourseColumnArray"
    }
};


          self.StudentObservableArray = ko.observableArray();
      

      self.initialize = function() {

      self.StudentObservableArray.removeAll();



      $.get('http://localhost:8080/Student',function(data) {
          //alert(data);
          //console.log(data);
          //console.log(self.deptObservableArray());

          //self.deptObservableArray([]);
          //console.log(self.deptObservableArray().length);

          
          var extractedData = data["_embedded"]["Student"];

           var counter = 0;


          for (var i = 0; i < extractedData.length; i++) {

                                     (function (i) {

                            var topush = {
                        

                              'Student_Id': extractedData[i].id,

                       
                      'Student_studentId': extractedData[i].studentId,                       
                      'Student_firstName': extractedData[i].firstName,                                                                                                          
                       'Student_lastName': extractedData[i].lastName
              
                            };

                              var defs = [];
                              for (var ii = 0; ii < self.oneArray.length; ii++) {
                               defs.push(new $.Deferred());
                             }

                             

                            $.when.apply($, defs).then(function() {
                                self.StudentObservableArray.push(topush);
                                counter++;
                                if (counter == extractedData.length) {
                                    self.StudentObservableArray.sort(function (left, right) {
                                        return left.Student_Id == right.Student_Id ? 0 : (left.Student_Id < right.Student_Id ? -1 : 1)
                                    });
                                    // alert(JSON.stringify(self.CourseObservableArray()));
                                }
                            });

                        })(i);



          }
      })

     };
  

              self.addButtonClick=function(){
                oj.Router.rootInstance.store({'page':"Student"});
                oj.Router.rootInstance.go("AddStudent");
//            alert('next');
            };
            self.editButtonClick=function(){

                var element = document.getElementById('table');
                var currentRow = element.currentRow;

                var rowIndex = currentRow['rowIndex'];
                var Student = vm.StudentObservableArray()[rowIndex];
                // alert("course id" + Course['Course_Id']);
                // vm.inputCourseId(Course['Course_Id']);


                // vm.inputCourseclassroom(Course['Course_classroom']);

                var rootViewModel = ko.dataFor(document.getElementById('globalBody'));
                rootViewModel.frontToEditData(
                    {
                    

                      'id': Student.Student_Id,


                      
                      'studentId': Student.Student_studentId,                       
                      'firstName': Student.Student_firstName,                                                                                                          
                       'lastName': Student.Student_lastName         
                    }
                );



                oj.Router.rootInstance.store({'page':"Student"});
                oj.Router.rootInstance.go("EditStudent");
//            alert('next');
            };



      self.dataprovider = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.StudentObservableArray, {idAttribute: 'Student_Id', sortCriteria : [{key: 'Student_Id', direction: 'ascending'}]}));


      self.columnArray = [
                                            
            {"headerText": "Student Id", "field": "Student_Id", "headerStyle": 'font-weight:bold'},
                  
                    {"headerText": "Student studentId", "field": "Student_studentId", "headerStyle": 'font-weight:bold'},
                 
                    {"headerText": "Student firstName", "field": "Student_firstName", "headerStyle": 'font-weight:bold'},
                 
                    {"headerText": "Student lastName", "field": "Student_lastName", "headerStyle": 'font-weight:bold'},
                 

                  

          { "renderer": oj.KnockoutTemplateUtils.getRenderer("button_tmpl", true), "style":"text-align: right"}

          ];


        //used to remove the selected row
      self.removeRow = function () {
          var element = document.getElementById('table');
          var currentRow = element.currentRow;


          if (currentRow != null) {
              $.ajax({
                  url: "http://localhost:8080/api/Student/" + self.StudentObservableArray()[currentRow['rowIndex']].Student_Id,
                  type: "DELETE",
                  success: function (response) {
                      console.log("delete success");
                      console.log(response);
                      self.StudentObservableArray.splice(currentRow['rowIndex'], 1);

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
