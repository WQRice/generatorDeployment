


 

/**
 * Course Table module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'promise', 'ojs/ojinputtext', 'ojs/ojinputnumber', 'ojs/ojtable', 'ojs/ojarraydataprovider', 'ojs/ojlabel', 'ojs/ojdialog',
        'ojs/ojdatetimepicker', 'ojs/ojpagingcontrol', 'ojs/ojpagingtabledatasource', 'ojs/ojarraytabledatasource', 'ojs/ojselectcombobox', 'ojs/ojlistdataproviderview'],
function(oj, ko, $)
{   
  function viewModel() {
      var self = this;
      //

      self.oneArray = ["Professor"];
      self.manyArray = [];

      self.attMap = {
    "Professor": {
        "oneOrMany": "one",
        "inputAttRef": "inputCourseProfessorArray",
        "attInSelfName": "professorInCourse",
        "selfInAttName": "courseInProfessor",
        "inputColumnArray": "inputProfessorColumnArray"
    }
};


          self.CourseObservableArray = ko.observableArray();
      

      self.initialize = function() {

      self.CourseObservableArray.removeAll();



      $.get('http://localhost:8080/Course',function(data) {
          //alert(data);
          //console.log(data);
          //console.log(self.deptObservableArray());

          //self.deptObservableArray([]);
          //console.log(self.deptObservableArray().length);

          
          var extractedData = data["_embedded"]["Course"];

           var counter = 0;


          for (var i = 0; i < extractedData.length; i++) {

                                     (function (i) {

                            var topush = {
                        

                              'Course_Id': extractedData[i].id,

                       
                      'Course_classroom': extractedData[i].classroom,                                                                                                          
                       'Course_courseNum': extractedData[i].courseNum
              
                            };

                              var defs = [];
                              for (var ii = 0; ii < self.oneArray.length; ii++) {
                               defs.push(new $.Deferred());
                             }

                             
                                $.ajax({
                                    type: "GET",
                                    url: extractedData[i]._links.professorInCourse.href
                                }).done(function (data0) {

                                                                         topush['Course_professor'] = data0.id;
                                     
                                        // alert(JSON.stringify(data0));
                                        defs[0].resolve(true);

                                    
                                  }
                                // counter++;
                                // if (counter == extractedData.length) {
                                //     self.CourseObservableArray.sort(function (left, right) {
                                //         return left.Course_Id == right.Course_Id ? 0 : (left.Course_Id < right.Course_Id ? -1 : 1)
                                //     });
                                //     alert(JSON.stringify(self.CourseObservableArray()));
                                // }

                                // data = data0;
                            ).fail(function (data0) {
                                defs[0].resolve(false);
                                // alert("failed");
                                // self.CourseObservableArray.push({
                                //     'Course_Id': extractedData[i].id,
                                //     'Course_classroom': extractedData[i].classroom
                                // });
                                // counter++;
                                // if (counter == extractedData.length) {
                                //     self.CourseObservableArray.sort(function (left, right) {
                                //         return left.Course_Id == right.Course_Id ? 0 : (left.Course_Id < right.Course_Id ? -1 : 1)
                                //     });
                                //     alert(JSON.stringify(self.CourseObservableArray()));
                                // }
                            });
                          

                            $.when.apply($, defs).then(function() {
                                self.CourseObservableArray.push(topush);
                                counter++;
                                if (counter == extractedData.length) {
                                    self.CourseObservableArray.sort(function (left, right) {
                                        return left.Course_Id == right.Course_Id ? 0 : (left.Course_Id < right.Course_Id ? -1 : 1)
                                    });
                                    // alert(JSON.stringify(self.CourseObservableArray()));
                                }
                            });

                        })(i);



          }
      })

     };
  

              self.addButtonClick=function(){
                oj.Router.rootInstance.store({'page':"Course"});
                oj.Router.rootInstance.go("AddCourse");
//            alert('next');
            };
            self.editButtonClick=function(){

                var element = document.getElementById('table');
                var currentRow = element.currentRow;

                var rowIndex = currentRow['rowIndex'];
                var Course = vm.CourseObservableArray()[rowIndex];
                // alert("course id" + Course['Course_Id']);
                // vm.inputCourseId(Course['Course_Id']);


                // vm.inputCourseclassroom(Course['Course_classroom']);

                var rootViewModel = ko.dataFor(document.getElementById('globalBody'));
                rootViewModel.frontToEditData(
                    {
                    

                      'id': Course.Course_Id,


                      
                      'classroom': Course.Course_classroom,                                                                                                          
                       'courseNum': Course.Course_courseNum         
                    }
                );



                oj.Router.rootInstance.store({'page':"Course"});
                oj.Router.rootInstance.go("EditCourse");
//            alert('next');
            };



      self.dataprovider = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.CourseObservableArray, {idAttribute: 'Course_Id', sortCriteria : [{key: 'Course_Id', direction: 'ascending'}]}));


      self.columnArray = [
                                            
            {"headerText": "Course Id", "field": "Course_Id", "headerStyle": 'font-weight:bold'},
                  
                    {"headerText": "Course classroom", "field": "Course_classroom", "headerStyle": 'font-weight:bold'},
                 
                    {"headerText": "Course Number", "field": "Course_courseNum", "headerStyle": 'font-weight:bold'},
                 

                  
                    {"headerText": "Professor", "field": "Course_professor", "headerStyle": 'font-weight:bold'},
                 

          { "renderer": oj.KnockoutTemplateUtils.getRenderer("button_tmpl", true), "style":"text-align: right"}

          ];


        //used to remove the selected row
      self.removeRow = function () {
          var element = document.getElementById('table');
          var currentRow = element.currentRow;


          if (currentRow != null) {
              $.ajax({
                  url: "http://localhost:8080/api/Course/" + self.CourseObservableArray()[currentRow['rowIndex']].Course_Id,
                  type: "DELETE",
                  success: function (response) {
                      console.log("delete success");
                      console.log(response);
                      self.CourseObservableArray.splice(currentRow['rowIndex'], 1);

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
