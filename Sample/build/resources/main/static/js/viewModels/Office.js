

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Office Table module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'promise', 'ojs/ojinputtext', 'ojs/ojinputnumber', 'ojs/ojtable', 'ojs/ojarraydataprovider', 'ojs/ojlabel', 'ojs/ojdialog',
        'ojs/ojdatetimepicker', 'ojs/ojpagingcontrol', 'ojs/ojpagingtabledatasource', 'ojs/ojarraytabledatasource', 'ojs/ojselectcombobox'],
function(oj, ko, $)
{   
  function viewModel() {
      var self = this;
      //

          self.OfficeObservableArray = ko.observableArray();


      $.get('http://localhost:8080/api/Office',function(data) {
          //alert(data);
          //console.log(data);
          //console.log(self.deptObservableArray());

          //self.deptObservableArray([]);
          //console.log(self.deptObservableArray().length);


          for (var i = 0; i < data.length; i++) {
              console.log("add data");

              self.OfficeObservableArray.push({

              'Office_Id': data[i].id,

                                                                                                 
              'Office_building': data[i].building
              });
          }
      });

  

      self.dataprovider = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.OfficeObservableArray, {idAttribute: 'Office_Id'}));

      self.columnArray = [
                                            
            {"headerText": "Office Id", "field": "Office_Id", "headerStyle": 'font-weight:bold'},
                  
                    {"headerText": "Office building", "field": "Office_building", "headerStyle": 'font-weight:bold'},
                 

          { "renderer": oj.KnockoutTemplateUtils.getRenderer("button_tmpl", true), "style":"text-align": right"}

          ];


      self.editButtonClick = function(data, event){
          //alert(DepartmentId);
          self.editOrAdd("edit");
          document.getElementById("buttontext").innerHTML = 'Update';
          document.getElementById("dialogTitleId").innerHTML = 'Edit Office Record';
          
          document.querySelector('#modalDialog1').open();

          return true;
      };


     self.closeDialog = function() {

         var elementArray = [];

                     
                elementArray.push(document.getElementById("OfficebuildingInput"));

          

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
          document.getElementById("dialogTitleId").innerHTML = 'Add Office Record';


          //clear up input fields
          self.inputOfficeId(null);
                      self.inputOfficebuilding(null);
          

          document.querySelector('#modalDialog1').open();
          return true;



      };

      //add to the observableArray
      self.addRow = function () {
          var Office = {
              'Office_Id': self.inputOfficeId(),
              
              'Office_building': self.inputOfficebuilding()          
            };

          var Office2database = $.ajax({
              type: "POST",
              contentType: 'application/json',
              url: "http://localhost:8080/api/Office",
              data: JSON.stringify(
                  {
              'Id': self.inputOfficeId(),
              
              'building': self.inputOfficebuilding()

                  }),
              dataType: "json",
              success: function (returndata) {
                  console.log(returndata);
                  self.OfficeObservableArray.push(
                      {

             'Office_Id': returndata.id,

                                                                                                 
              'Office_building': returndata.building
                   
                      });
                  console.log('length' + self.OfficeObservableArray().length);

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
                  url: "http://localhost:8080/api/Office/" + self.inputOfficeId(),
                  data: JSON.stringify(
                      {
               'Id': self.inputOfficeId(),
              
              'building': self.inputOfficebuilding()
                      }
                  ),
                  dataType: 'json',
                  success: function (returndata) {
                      console.log(returndata);
                      self.OfficeObservableArray.splice(currentRow['rowIndex'], 1,
                          {

             'Office_Id': returndata.id,

                                                                                                 
              'Office_building': returndata.building
                   
 
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



      //intialize the observable values in the forms
      self.inputOfficeId = ko.observable();

      
      self.inputOfficebuilding = ko.observable();                                                                                         

      self.editOrAdd = ko.observable();

      self.currentRowListener = function(event)
      {
          var data = event.detail;
          if (event.type == 'currentRowChanged' && data['value'] != null)
          {
              var rowIndex = data['value']['rowIndex'];
              var Office = vm.OfficeObservableArray()[rowIndex];
              vm.inputOfficeId(Office['Office_Id']);

              
              vm.inputOfficebuilding(Office['Office_building']);              

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
