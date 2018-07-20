


 

/**
 * Office Table module
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
        "inputAttRef": "inputOfficeProfessorArray",
        "attInSelfName": "professorInOffice",
        "selfInAttName": "officeInProfessor",
        "inputColumnArray": "inputProfessorColumnArray"
    }
};


          self.OfficeObservableArray = ko.observableArray();
      

      self.initialize = function() {

      self.OfficeObservableArray.removeAll();



      $.get('http://localhost:8080/Office',function(data) {
          //alert(data);
          //console.log(data);
          //console.log(self.deptObservableArray());

          //self.deptObservableArray([]);
          //console.log(self.deptObservableArray().length);

          
          var extractedData = data["_embedded"]["Office"];

           var counter = 0;


          for (var i = 0; i < extractedData.length; i++) {

                                     (function (i) {

                            var topush = {
                        

                              'Office_Id': extractedData[i].id,

                                                                                                          
                       'Office_building': extractedData[i].building
              
                            };

                              var defs = [];
                              for (var ii = 0; ii < self.oneArray.length; ii++) {
                               defs.push(new $.Deferred());
                             }

                             
                                $.ajax({
                                    type: "GET",
                                    url: extractedData[i]._links.professorInOffice.href
                                }).done(function (data0) {
                                        topush['Office_professor'] = data0.id;
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
                                self.OfficeObservableArray.push(topush);
                                counter++;
                                if (counter == extractedData.length) {
                                    self.OfficeObservableArray.sort(function (left, right) {
                                        return left.Office_Id == right.Office_Id ? 0 : (left.Office_Id < right.Office_Id ? -1 : 1)
                                    });
                                    // alert(JSON.stringify(self.CourseObservableArray()));
                                }
                            });

                        })(i);



          }
      })

     };
  

              self.addButtonClick=function(){
                oj.Router.rootInstance.store({'page':"Office"});
                oj.Router.rootInstance.go("AddOffice");
//            alert('next');
            };
            self.editButtonClick=function(){

                var element = document.getElementById('table');
                var currentRow = element.currentRow;

                var rowIndex = currentRow['rowIndex'];
                var Office = vm.OfficeObservableArray()[rowIndex];
                // alert("course id" + Course['Course_Id']);
                // vm.inputCourseId(Course['Course_Id']);


                // vm.inputCourseclassroom(Course['Course_classroom']);

                var rootViewModel = ko.dataFor(document.getElementById('globalBody'));
                rootViewModel.frontToEditData(
                    {
                    

                      'id': Office.Office_Id,


                                                                                                         
                       'building': Office.Office_building         
                    }
                );



                oj.Router.rootInstance.store({'page':"Office"});
                oj.Router.rootInstance.go("EditOffice");
//            alert('next');
            };



      self.dataprovider = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.OfficeObservableArray, {idAttribute: 'Office_Id', sortCriteria : [{key: 'Office_Id', direction: 'ascending'}]}));


      self.columnArray = [
                                            
            {"headerText": "Office Id", "field": "Office_Id", "headerStyle": 'font-weight:bold'},
                  
                    {"headerText": "Office building", "field": "Office_building", "headerStyle": 'font-weight:bold'},
                 

                  
                    {"headerText": "Professor", "field": "Office_professor", "headerStyle": 'font-weight:bold'},
                 

          { "renderer": oj.KnockoutTemplateUtils.getRenderer("button_tmpl", true), "style":"text-align: right"}

          ];


        //used to remove the selected row
      self.removeRow = function () {
          var element = document.getElementById('table');
          var currentRow = element.currentRow;


          if (currentRow != null) {
              $.ajax({
                  url: "http://localhost:8080/api/Office/" + self.OfficeObservableArray()[currentRow['rowIndex']].Office_Id,
                  type: "DELETE",
                  success: function (response) {
                      console.log("delete success");
                      console.log(response);
                      self.OfficeObservableArray.splice(currentRow['rowIndex'], 1);

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
