


 

/**
 * Professor Table module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'promise', 'ojs/ojinputtext', 'ojs/ojinputnumber', 'ojs/ojtable', 'ojs/ojarraydataprovider', 'ojs/ojlabel', 'ojs/ojdialog',
        'ojs/ojdatetimepicker', 'ojs/ojpagingcontrol', 'ojs/ojpagingtabledatasource', 'ojs/ojarraytabledatasource', 'ojs/ojselectcombobox'],
function(oj, ko, $)
{   
  function viewModel() {
      var self = this;
      //

      self.oneArray = ["Office"];
      self.manyArray = ["Course"];

      self.attMap = {
    "Office": {
        "oneOrMany": "one",
        "inputAttRef": "inputProfessorOfficeArray",
        "attInSelfName": "officeInProfessor",
        "selfInAttName": "professorInOffice",
        "inputColumnArray": "inputOfficeColumnArray"
    },
    "Course": {
        "oneOrMany": "many",
        "inputAttRef": "inputProfessorCourseArray",
        "attInSelfName": "courseInProfessor",
        "selfInAttName": "professorInCourse",
        "inputColumnArray": "inputCourseColumnArray"
    }
};


          self.ProfessorObservableArray = ko.observableArray();
      

      self.initialize = function() {

      self.ProfessorObservableArray.removeAll();



      $.get('http://localhost:8080/Professor',function(data) {
          //alert(data);
          //console.log(data);
          //console.log(self.deptObservableArray());

          //self.deptObservableArray([]);
          //console.log(self.deptObservableArray().length);

          
          var extractedData = data["_embedded"]["Professor"];

           var counter = 0;


          for (var i = 0; i < extractedData.length; i++) {

                                     (function (i) {

                            var topush = {
                        

                              'Professor_Id': extractedData[i].id,

                       
                      'Professor_firstName': extractedData[i].firstName,                                                                                                          
                       'Professor_lastName': extractedData[i].lastName
              
                            };

                              var defs = [];
                              for (var ii = 0; ii < self.oneArray.length; ii++) {
                               defs.push(new $.Deferred());
                             }

                             
                                $.ajax({
                                    type: "GET",
                                    url: extractedData[i]._links.officeInProfessor.href
                                }).done(function (data0) {
                                        topush['Professor_office'] = data0.id;
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
                                self.ProfessorObservableArray.push(topush);
                                counter++;
                                if (counter == extractedData.length) {
                                    self.ProfessorObservableArray.sort(function (left, right) {
                                        return left.Professor_Id == right.Professor_Id ? 0 : (left.Professor_Id < right.Professor_Id ? -1 : 1)
                                    });
                                    // alert(JSON.stringify(self.CourseObservableArray()));
                                }
                            });

                        })(i);



          }
      })

     };
  

              self.addButtonClick=function(){
                oj.Router.rootInstance.store({'page':"Professor"});
                oj.Router.rootInstance.go("AddProfessor");
//            alert('next');
            };
            self.editButtonClick=function(){

                var element = document.getElementById('table');
                var currentRow = element.currentRow;

                var rowIndex = currentRow['rowIndex'];
                var Professor = vm.ProfessorObservableArray()[rowIndex];
                // alert("course id" + Course['Course_Id']);
                // vm.inputCourseId(Course['Course_Id']);


                // vm.inputCourseclassroom(Course['Course_classroom']);

                var rootViewModel = ko.dataFor(document.getElementById('globalBody'));
                rootViewModel.frontToEditData(
                    {
                    

                      'id': Professor.Professor_Id,


                      
                      'firstName': Professor.Professor_firstName,                                                                                                          
                       'lastName': Professor.Professor_lastName         
                    }
                );



                oj.Router.rootInstance.store({'page':"Professor"});
                oj.Router.rootInstance.go("EditProfessor");
//            alert('next');
            };



      self.dataprovider = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.ProfessorObservableArray, {idAttribute: 'Professor_Id', sortCriteria : [{key: 'Professor_Id', direction: 'ascending'}]}));


      self.columnArray = [
                                            
            {"headerText": "Professor Id", "field": "Professor_Id", "headerStyle": 'font-weight:bold'},
                  
                    {"headerText": "Professor firstName", "field": "Professor_firstName", "headerStyle": 'font-weight:bold'},
                 
                    {"headerText": "Professor lastName", "field": "Professor_lastName", "headerStyle": 'font-weight:bold'},
                 

                  
                    {"headerText": "Office", "field": "Professor_office", "headerStyle": 'font-weight:bold'},
                 

          { "renderer": oj.KnockoutTemplateUtils.getRenderer("button_tmpl", true), "style":"text-align: right"}

          ];


        //used to remove the selected row
      self.removeRow = function () {
          var element = document.getElementById('table');
          var currentRow = element.currentRow;


          if (currentRow != null) {
              $.ajax({
                  url: "http://localhost:8080/api/Professor/" + self.ProfessorObservableArray()[currentRow['rowIndex']].Professor_Id,
                  type: "DELETE",
                  success: function (response) {
                      console.log("delete success");
                      console.log(response);
                      self.ProfessorObservableArray.splice(currentRow['rowIndex'], 1);

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
