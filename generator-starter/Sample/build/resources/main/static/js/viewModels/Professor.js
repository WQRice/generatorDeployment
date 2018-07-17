

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

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

          self.ProfessorObservableArray = ko.observableArray();


      $.get('http://localhost:8080/api/Professor',function(data) {
          //alert(data);
          //console.log(data);
          //console.log(self.deptObservableArray());

          //self.deptObservableArray([]);
          //console.log(self.deptObservableArray().length);


          for (var i = 0; i < data.length; i++) {
              console.log("add data");

              self.ProfessorObservableArray.push({

              'Professor_Id': data[i].id,

              
              'Professor_firstName': data[i].firstName,                                                                                               
              'Professor_lastName': data[i].lastName
              });
          }
      });

  

      self.dataprovider = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.ProfessorObservableArray, {idAttribute: 'Professor_Id'}));

      self.columnArray = [
                                            
            {"headerText": "Professor Id", "field": "Professor_Id", "headerStyle": 'font-weight:bold'},
                  
                    {"headerText": "Professor firstName", "field": "Professor_firstName", "headerStyle": 'font-weight:bold'},
                 
                    {"headerText": "Professor lastName", "field": "Professor_lastName", "headerStyle": 'font-weight:bold'},
                 

          { "renderer": oj.KnockoutTemplateUtils.getRenderer("button_tmpl", true), "style":"text-align": right"}

          ];


      self.editButtonClick = function(data, event){
          //alert(DepartmentId);
          self.editOrAdd("edit");
          document.getElementById("buttontext").innerHTML = 'Update';
          document.getElementById("dialogTitleId").innerHTML = 'Edit Professor Record';
          
          document.querySelector('#modalDialog1').open();

          return true;
      };


     self.closeDialog = function() {

         var elementArray = [];

                     
                elementArray.push(document.getElementById("ProfessorfirstNameInput"));

                     
                elementArray.push(document.getElementById("ProfessorlastNameInput"));

          

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
          document.getElementById("dialogTitleId").innerHTML = 'Add Professor Record';


          //clear up input fields
          self.inputProfessorId(null);
                      self.inputProfessorfirstName(null);
                      self.inputProfessorlastName(null);
          

          document.querySelector('#modalDialog1').open();
          return true;



      };

      //add to the observableArray
      self.addRow = function () {
          var Professor = {
              'Professor_Id': self.inputProfessorId(),
              
              'Professor_firstName': self.inputProfessorfirstName(),              
              'Professor_lastName': self.inputProfessorlastName()          
            };

          var Professor2database = $.ajax({
              type: "POST",
              contentType: 'application/json',
              url: "http://localhost:8080/api/Professor",
              data: JSON.stringify(
                  {
              'Id': self.inputProfessorId(),
              
              'firstName': self.inputProfessorfirstName(),              
              'lastName': self.inputProfessorlastName()

                  }),
              dataType: "json",
              success: function (returndata) {
                  console.log(returndata);
                  self.ProfessorObservableArray.push(
                      {

             'Professor_Id': returndata.id,

              
              'Professor_firstName': returndata.firstName,                                                                                               
              'Professor_lastName': returndata.lastName
                   
                      });
                  console.log('length' + self.ProfessorObservableArray().length);

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
                  url: "http://localhost:8080/api/Professor/" + self.inputProfessorId(),
                  data: JSON.stringify(
                      {
               'Id': self.inputProfessorId(),
              
              'firstName': self.inputProfessorfirstName(),              
              'lastName': self.inputProfessorlastName()
                      }
                  ),
                  dataType: 'json',
                  success: function (returndata) {
                      console.log(returndata);
                      self.ProfessorObservableArray.splice(currentRow['rowIndex'], 1,
                          {

             'Professor_Id': returndata.id,

              
              'Professor_firstName': returndata.firstName,                                                                                               
              'Professor_lastName': returndata.lastName
                   
 
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



      //intialize the observable values in the forms
      self.inputProfessorId = ko.observable();

      
      self.inputProfessorfirstName = ko.observable();      
      self.inputProfessorlastName = ko.observable();                                                                                         

      self.editOrAdd = ko.observable();

      self.currentRowListener = function(event)
      {
          var data = event.detail;
          if (event.type == 'currentRowChanged' && data['value'] != null)
          {
              var rowIndex = data['value']['rowIndex'];
              var Professor = vm.ProfessorObservableArray()[rowIndex];
              vm.inputProfessorId(Professor['Professor_Id']);

              
              vm.inputProfessorfirstName(Professor['Professor_firstName']);              
              vm.inputProfessorlastName(Professor['Professor_lastName']);              

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
