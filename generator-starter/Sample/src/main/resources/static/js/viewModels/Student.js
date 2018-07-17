

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Student Table module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'promise', 'ojs/ojinputtext', 'ojs/ojinputnumber', 'ojs/ojtable', 'ojs/ojarraydataprovider', 'ojs/ojlabel', 'ojs/ojdialog',
        'ojs/ojdatetimepicker', 'ojs/ojpagingcontrol', 'ojs/ojpagingtabledatasource', 'ojs/ojarraytabledatasource', 'ojs/ojselectcombobox'],
function(oj, ko, $)
{   
  function viewModel() {
      var self = this;
      //

          self.StudentObservableArray = ko.observableArray();


      $.get('http://localhost:8080/api/Student',function(data) {
          //alert(data);
          //console.log(data);
          //console.log(self.deptObservableArray());

          //self.deptObservableArray([]);
          //console.log(self.deptObservableArray().length);


          for (var i = 0; i < data.length; i++) {
              console.log("add data");

              self.StudentObservableArray.push({

              'Student_Id': data[i].id,

              
              'Student_studentId': data[i].studentId,            
              'Student_firstName': data[i].firstName,                                                                                               
              'Student_lastName': data[i].lastName
              });
          }
      });

  

      self.dataprovider = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.StudentObservableArray, {idAttribute: 'Student_Id'}));

      self.columnArray = [
                                            
            {"headerText": "Student Id", "field": "Student_Id", "headerStyle": 'font-weight:bold'},
                  
                    {"headerText": "Student studentId", "field": "Student_studentId", "headerStyle": 'font-weight:bold'},
                 
                    {"headerText": "Student firstName", "field": "Student_firstName", "headerStyle": 'font-weight:bold'},
                 
                    {"headerText": "Student lastName", "field": "Student_lastName", "headerStyle": 'font-weight:bold'},
                 

          { "renderer": oj.KnockoutTemplateUtils.getRenderer("button_tmpl", true), "style":"text-align": right"}

          ];


      self.editButtonClick = function(data, event){
          //alert(DepartmentId);
          self.editOrAdd("edit");
          document.getElementById("buttontext").innerHTML = 'Update';
          document.getElementById("dialogTitleId").innerHTML = 'Edit Student Record';
          
          document.querySelector('#modalDialog1').open();

          return true;
      };


     self.closeDialog = function() {

         var elementArray = [];

                     
                elementArray.push(document.getElementById("StudentstudentIdInput"));

                     
                elementArray.push(document.getElementById("StudentfirstNameInput"));

                     
                elementArray.push(document.getElementById("StudentlastNameInput"));

          

          var invalidflag=false;
          for (var i=0; i<elementArray.length; i++) {
              if (!(elementArray[i].valid === "valid")) {
                  elementArray[i].showMessages();
                  if (invalidflag==false) invalidflag = true;
              }
          }


          //proceed to add or update record only if all input fields are valid
          if(invalidflag==false) {

          // if it is a adding action, do POST

              if (self.editOrAdd() == "add") {
                  self.addRow();
              }


              // if it is during an Editing action, do PUT

              if (self.editOrAdd() == "edit") {
                  // alert('updating');

                  self.updateRow();

              }

              //closing dialog window
              // alert('closing dialog');
              document.querySelector('#modalDialog1').close();
          }
      };


      self.addButtonClick = function () {

          //
          self.editOrAdd("add");

          document.getElementById("buttontext").innerHTML = 'Add';
          document.getElementById("dialogTitleId").innerHTML = 'Add Student Record';


          //clear up input fields
          self.inputStudentId(null);
                      self.inputStudentstudentId(null);
                      self.inputStudentfirstName(null);
                      self.inputStudentlastName(null);
          

          document.querySelector('#modalDialog1').open();
          return true;



      };

      //add to the observableArray
      self.addRow = function () {
          var Student = {
              'Student_Id': self.inputStudentId(),
              
              'Student_studentId': self.inputStudentstudentId(),              
              'Student_firstName': self.inputStudentfirstName(),              
              'Student_lastName': self.inputStudentlastName()          
            };

          var Student2database = $.ajax({
              type: "POST",
              contentType: 'application/json',
              url: "http://localhost:8080/api/Student",
              data: JSON.stringify(
                  {
              'Id': self.inputStudentId(),
              
              'studentId': self.inputStudentstudentId(),              
              'firstName': self.inputStudentfirstName(),              
              'lastName': self.inputStudentlastName()

                  }),
              dataType: "json",
              success: function (returndata) {
                  console.log(returndata);
                  self.StudentObservableArray.push(
                      {

             'Student_Id': returndata.id,

              
              'Student_studentId': returndata.studentId,            
              'Student_firstName': returndata.firstName,                                                                                               
              'Student_lastName': returndata.lastName
                   
                      });
                  console.log('length' + self.StudentObservableArray().length);

              }
          });


      };


      //used to update the fields based on the selected row
      self.updateRow = function () {
          var element = document.getElementById('table');
          var currentRow = element.currentRow;

          if (currentRow != null) {
              // DO PUT
              $.ajax({
                  type: "PUT",
                  contentType: 'application/json; charset=utf-8',
                  url: "http://localhost:8080/api/Student/" + self.inputStudentId(),
                  data: JSON.stringify(
                      {
               'Id': self.inputStudentId(),
              
              'studentId': self.inputStudentstudentId(),              
              'firstName': self.inputStudentfirstName(),              
              'lastName': self.inputStudentlastName()
                      }
                  ),
                  dataType: 'json',
                  success: function (returndata) {
                      console.log(returndata);
                      self.StudentObservableArray.splice(currentRow['rowIndex'], 1,
                          {

             'Student_Id': returndata.id,

              
              'Student_studentId': returndata.studentId,            
              'Student_firstName': returndata.firstName,                                                                                               
              'Student_lastName': returndata.lastName
                   
 
                          });

                  }

              })


          }
      };

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



      //intialize the observable values in the forms
      self.inputStudentId = ko.observable();

      
      self.inputStudentstudentId = ko.observable();      
      self.inputStudentfirstName = ko.observable();      
      self.inputStudentlastName = ko.observable();                                                                                         

      self.editOrAdd = ko.observable();

      self.currentRowListener = function(event)
      {
          var data = event.detail;
          if (event.type == 'currentRowChanged' && data['value'] != null)
          {
              var rowIndex = data['value']['rowIndex'];
              var Student = vm.StudentObservableArray()[rowIndex];
              vm.inputStudentId(Student['Student_Id']);

              
              vm.inputStudentstudentId(Student['Student_studentId']);              
              vm.inputStudentfirstName(Student['Student_firstName']);              
              vm.inputStudentlastName(Student['Student_lastName']);              

              //console.log(event)
              //alert("It is working")
          }
      };




  }

    var vm = new viewModel;






  //alert("model create!")
  
//  $(document).ready
//  (
//    function()
//    {
//      //ko.applyBindings(vm, document.getElementById('tableDemo'));
////      var table = document.getElementById('table');
////      table.addEventListener('currentRowChanged', vm.currentRowListener);
//        $('#table').on('currentRowChanged', vm.currentRowListener);
//    }
//  );
  
  return vm;
});	
