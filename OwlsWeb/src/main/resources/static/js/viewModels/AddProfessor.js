



/**
* Add Professor module
*/

define(['ojs/ojcore', 'knockout', 'ojs/ojcheckboxset'
], function (oj, ko) {
    /**
     * The view model for the main content view template
     */
    function viewModel() {
        var self = this;
        // var rootViewModel = ko.dataFor(document.getElementById('globalBody'));
        // self.userName = rootViewModel.appName();

        self.initialize = function () {

            ////// alert(self.userName);
        
        self.inputProfessorfirstName(null);
        
        self.inputProfessorlastName(null);
        

            for (var property in self.attMap){
                if(self.attMap.hasOwnProperty(property)){
                    if(!self.dropdownMap.hasOwnProperty(property)){
                    self[self.attMap[property].inputAttRef].removeAll();
                } else {
                    self[self.attMap[property].dropInputAttData](null);
                    self["drop_ItemOrder"+property+"Array"].removeAll();
                    self["get"+property]();
                    }
                }

            }
            // self[]
            //
            // self.inputCourseProfessorArray.removeAll();

        };

        self.oneArray = ["Office"];
        self.manyArray = ["Course"];
        self.attMap = {
    "Office": {
        "oneOrMany": "one",
        "inputAttRef": "inputProfessorOfficeArray",
        "attInSelfName": "officeInProfessor",
        "selfInAttName": "professorInOffice",
        "inputColumnArray": "inputOfficeColumnArray",
        "dropInputAttData": "drop_inputOfficeDataProvider"
    },
    "Course": {
        "oneOrMany": "many",
        "inputAttRef": "inputProfessorCourseArray",
        "attInSelfName": "courseInProfessor",
        "selfInAttName": "professorInCourse",
        "inputColumnArray": "inputCourseColumnArray"
    }
};

        self.dropdownMap = {};
        self.curAtt = ko.observable("");

        // self.selectAllDisabled = ko.observable();
        self.selectAllDisabled = ko.computed(function ()
            {   if(self.attMap[self.curAtt()]!=undefined)
                return self.attMap[self.curAtt()].oneOrMany === "one";
            else return false;}
        );


        self.selectAtt = ko.computed(function() {
                if (self.attMap[self.curAtt()] != undefined) {
                    if (self.attMap[self.curAtt()].oneOrMany === "one") {
                        return "Select " + self.curAtt();
                    } else {
                        return "Select " + self.curAtt() + " (multiple)";
                    }
                }
                else return "";
            }
               );



        //intialize the observable values in the forms
        self.inputProfessorId = ko.observable();

        
        self.inputProfessorfirstName = ko.observable();
        
        self.inputProfessorlastName = ko.observable();
        


// for  one array (many to one or one to one)

     



    self.inputProfessorOfficeArray = ko.observableArray().extend({ deferred: true });
    self.inputOfficeDataProvider = new oj.ArrayDataProvider(self.inputProfessorOfficeArray, {keyAttributes: 'id'});

self.inputOfficeColumnArray = [

{"headerText": "id", "field": "id", "headerStyle": 'font-weight:bold;  Height:8px; background-color: white'},

    {
    "headerText": "building",
    "field" : "building",
    "headerStyle" : 'font-weight:bold;Height:8px; background-color: white'
    }
];







        self.attObservableArray = ko.observableArray();


        self.attArraydataprovider = new oj.ArrayTableDataSource(self.attObservableArray, {keyAttributes: 'id'});


        self.selectAttColumnArray_single = ko.observable();


// for  many array (one to many or many to many)



        
        self.inputProfessorCourseArray = ko.observableArray().extend({ deferred: true });
        self.inputCourseDataProvider = new oj.ArrayDataProvider(self.inputProfessorCourseArray, {keyAttributes: 'id'});

        self.inputCourseColumnArray = [

        {"headerText": "id", "field": "id", "headerStyle": 'font-weight:bold;  Height:8px; background-color: white'},

                {
        "headerText": "classroom",
        "field" : "classroom",
        "headerStyle" : 'font-weight:bold;Height:8px; background-color: white'
        }
                        ];
        



        self.selectAttColumnArray_multi = ko.observable();



        self.selectAttributeinEditDialog = function(data, event) {

            // document.getElementById('selectAttTable').selection = [];
            ////// alert("open nested popup");
            ////// alert(self.selectAllDisabled());


            self.curAtt(data.substring(4));
           //// alert(self.curAtt());
           //// alert(self.selectAllDisabled());

            // self.selectAllDisabled(self.attMap[self.curAtt()].oneOrMany === "one");
            // self.selectAllDisabled(true);

            self.attObservableArray.removeAll();

            var callback = function() {
                var q = jQuery.Deferred(), queue = q;

                queue = queue.then(function () {

                    if (self.selectAllDisabled()) {
                        var array = JSON.parse(JSON.stringify(self[self.attMap[self.curAtt()].inputColumnArray]));

                        array.unshift({
                            "renderer": oj.KnockoutTemplateUtils.getRenderer("checkbox_tmpl_single", true),
                            "headerRenderer": oj.KnockoutTemplateUtils.getRenderer("checkbox_hdr_tmpl_single", true)
                        });
                        self.selectAttColumnArray_single(array);
                    } else {
                        var array = JSON.parse(JSON.stringify(self[self.attMap[self.curAtt()].inputColumnArray]));

                        // array.splice(0,0,{
                        //     "renderer": oj.KnockoutTemplateUtils.getRenderer("checkbox_tmpl_single", true),
                        //     "headerRenderer": oj.KnockoutTemplateUtils.getRenderer("checkbox_hdr_tmpl_single", true)
                        // });

                        array.unshift({
                            "renderer": oj.KnockoutTemplateUtils.getRenderer("checkbox_tmpl_multi", true),
                            "headerRenderer": oj.KnockoutTemplateUtils.getRenderer("checkbox_hdr_tmpl_multi", true)
                        });
                        self.selectAttColumnArray_multi(array);

                    }
                });
                queue.done();
                return q.resolve(true);
            };


            var selectAttTable = self.selectAllDisabled()? "selectAttTable_single" : "selectAttTable_multi";
            var attSelectDialog = self.selectAllDisabled()? "#attSelectDialog_single" : "#attSelectDialog_multi";


            callback().then(
            $.get('http://localhost:8080/'+self.curAtt(), function (data) {
               //// alert(JSON.stringify(data));
                //console.log(data);

                // for (var i = 0; i < data.length; i++) {
                var extractedData = data["_embedded"][self.curAtt()];
                //// alert(JSON.stringify(extractedData));


                for (var i = 0; i < extractedData.length; i++) {
                    //// alert(i);
                    //// alert("test");

                    var topush = JSON.parse(JSON.stringify(extractedData[i]));
                    delete topush["_links"];
                    topush.Selected =  ko.observable([]);

                    // var topush = {
                    //     Selected: ko.observable([]),
                    //     id: extractedData[i].id,
                    //     firstName: extractedData[i].firstName,
                    //     lastName: extractedData[i].lastName
                    // };

                    var inputAttRef = self.attMap[self.curAtt()].inputAttRef;
                    //// alert("topush"+JSON.stringify(topush));
                    //// alert(JSON.stringify(self[inputAttRef]()));
                    if (self[inputAttRef]()!=null) {
                        for (var j = 0; j < self[inputAttRef]().length; j++) {
                            if (self[inputAttRef]()[j].id == topush.id) {
                                topush.Selected(["checked"]);
                            }
                        }
                    }

                    self.attObservableArray.push(topush);
                    //// alert(JSON.stringify(self.attObservableArray()));
                    self.attArraydataprovider = new oj.ArrayTableDataSource(self.attObservableArray, {keyAttributes: 'id'});

                }

                var selectionObj = [];
                var totalSize = self.attArraydataprovider.totalSize();
                for (var i = 0; i < totalSize; i++) {
                    self.attArraydataprovider.at(i).then(function (row) {
                        if (row.data.Selected().length > 0 &&
                            row.data.Selected()[0] == 'checked') {
                            selectionObj.push({startIndex: {row: row.index}, endIndex: {row: row.index}});
                        }

                        if (row.index == totalSize - 1) {
                            document.getElementById(selectAttTable).selection = selectionObj;
                        }
                    });
                }

            })
            ).done(function() {
                document.querySelector(attSelectDialog).open();
                document.getElementById('selectAttTable_single').selection =[];
            });


        };



        self.selectionListener_single = function(event)
        {

            //// alert(JSON.stringify(event.detail.previousValue));
           // alert('selectionlistner');
            var data = event.detail;


            if (data != null) {

                var totalSize = self.attArraydataprovider.totalSize();
                for (var i = 0; i < totalSize; i++) {
                    self.attArraydataprovider.at(i).then(function (row) {
                        var oldObj = document.getElementById('selectAttTable_single').selection;
                       // alert(oldObj);

                        for (var j=0; j<oldObj.length; j++) {
                            if(oldObj[j].startIndex.row === row.index){
                                row.data.Selected([]);
                            }
                        }


                    });
                }


                var selectionObj = data.value;
                // var totalSize = self.attArraydataprovider.totalSize();


                for (var i = 0; i < totalSize; i++) {
                    self.attArraydataprovider.at(i).then(function (row) {
                        var foundInSelection = false;
                        if (selectionObj) {
                            //// alert(JSON.stringify(selectionObj));
                            for (var j = 0; j < selectionObj.length; j++) {
                                var range = selectionObj[j];
                                var startIndex = range.startIndex;
                                var endIndex = range.endIndex;

                                if (startIndex != null && startIndex.row != null) {
                                    if (row.index >= startIndex.row && row.index <= endIndex.row) {
                                        row.data.Selected(['checked']);
                                        foundInSelection = true;
                                    }
                                }
                            }
                        }
                        if (!foundInSelection) {
                            row.data.Selected([]);
                        }
                    });
                }
            }



        };
        self.selectionListener_multi = function(event)
        {

            //// alert(JSON.stringify(event.detail.previousValue));
            //// alert('selectionlistner');
            var data = event.detail;

            if (data != null) {
                var selectionObj = data.value;
                var totalSize = self.attArraydataprovider.totalSize();
                var i, j;
                for (i = 0; i < totalSize; i++) {
                    self.attArraydataprovider.at(i).then(function (row) {
                        var foundInSelection = false;
                        if (selectionObj) {
                            //// alert(JSON.stringify(selectionObj));
                            for (j = 0; j < selectionObj.length; j++) {
                                var range = selectionObj[j];
                                var startIndex = range.startIndex;
                                var endIndex = range.endIndex;

                                if (startIndex != null && startIndex.row != null) {
                                    if (row.index >= startIndex.row && row.index <= endIndex.row) {
                                        row.data.Selected(['checked']);
                                        foundInSelection = true;
                                    }
                                }
                            }
                        }
                        if (!foundInSelection) {
                            row.data.Selected([]);
                        }
                    });
                }
            }


        };
        self.selectAllListener = function(event)
        {
            //// alert("selectall");
            if (self._clearCheckboxHdr)
            {
                return;
            }
            var data = event.detail;
            if (data != null)
            {
                var table = document.getElementById('selectAttTable_multi');
                if (data['value'].length > 0)
                {
                    var totalSize = self.attArraydataprovider.totalSize();
                    table.selection = [{startIndex: {"row":0}, endIndex:{"row": totalSize - 1}}];
                }
                else
                {
                    table.selection = [];
                }
            }
        };
        self.syncCheckboxes = function(event)
        {
            //// alert("sync");
            //// alert(JSON.stringify(event));
            event.stopPropagation();

            if(self.selectAllDisabled()) {

                setTimeout(function () {
                    // sync the checkboxes with selection obj
                    var selectionObj = [];
                    var totalSize = self.attArraydataprovider.totalSize();
                    var i;
                    var oldSelectionObj = document.getElementById('selectAttTable_single').selection;

                    for (i = 0; i < totalSize; i++) {
                        self.attArraydataprovider.at(i).then(function (row) {
                            if (row.data.Selected().length > 0 &&
                                row.data.Selected()[0] == 'checked') {
                                if(oldSelectionObj!=null && oldSelectionObj.length>0 && oldSelectionObj[0].startIndex.row == row.index) {
                                    row.data.Selected([]);
                                } else {
                                    selectionObj.push({startIndex: {row: row.index}, endIndex: {row: row.index}});
                                }
                            }

                            if (row.index == totalSize - 1) {
                                document.getElementById('selectAttTable_single').selection = selectionObj;
                                //// alert("selectionobj after sync"+ JSON.stringify(selectionObj));
                            }
                        });
                    }
                }, 0);

            } else {

                if (event.currentTarget.id != 'table_checkboxset_hdr_multi') {
                    self._clearCheckboxHdr = true;
                    $('#table_checkboxset_hdr_multi')[0].value = [];

                    self._clearCheckboxHdr = false;
                }
                setTimeout(function () {
                    // sync the checkboxes with selection obj
                    var selectionObj = [];
                    var totalSize = self.attArraydataprovider.totalSize();
                    var i;
                    for (i = 0; i < totalSize; i++) {
                        self.attArraydataprovider.at(i).then(function (row) {
                            if (row.data.Selected().length > 0 &&
                                row.data.Selected()[0] == 'checked') {
                                selectionObj.push({startIndex: {row: row.index}, endIndex: {row: row.index}});
                            }

                            if (row.index == totalSize - 1) {
                                document.getElementById('selectAttTable_multi').selection = selectionObj;
                                //// alert("selectionobj after sync"+ JSON.stringify(selectionObj));
                            }
                        });
                    }
                }, 0);
            }
        };
        self.clearAttributeSelect = function() {
            var selectAttTable = self.selectAllDisabled()? "selectAttTable_single" : "selectAttTable_multi";

            var totalSize = self.attArraydataprovider.totalSize();
            for (var i = 0; i < totalSize; i++) {
                self.attArraydataprovider.at(i).then(function (row) {
                    var oldObj = document.getElementById(selectAttTable).selection;

                    for (var j=0; j<oldObj.length; j++) {
                        if(oldObj[j].startIndex.row === row.index){
                            row.data.Selected([]);
                        }
                    }


                });
            }
            document.getElementById(selectAttTable).selection=[];
            if(!self.selectAllDisabled()) {
                self._clearCheckboxHdr = true;
                $('#table_checkboxset_hdr_multi')[0].value = [];

                self._clearCheckboxHdr = false;
            }


        };
        self.closeAttributeSelect = function () {


            // // get current id of record being updated on current page
            //
            // var main_element = document.getElementById('table');
            // var main_currentRow = main_element.currentRow;
            //
            // var main_rowIndex = main_currentRow['rowIndex'];
            // var main = vm.CourseObservableArray()[main_rowIndex];

            // get selected id of associated attributes
            // var element = document.getElementById('selectAttTable');
            // var currentRow = element.currentRow;
            var selectAttTable = self.selectAllDisabled()? "selectAttTable_single" : "selectAttTable_multi";
            var attSelectDialog = self.selectAllDisabled()? "#attSelectDialog_single" : "#attSelectDialog_multi";

            var selection = document.getElementById(selectAttTable).selection;

            self[self.attMap[self.curAtt()].inputAttRef].removeAll();

            if (selection != null && selection.length>0) {

                for (var i=0; i< selection.length; i++) {

                    var rowIndex = selection[i].startIndex.row;
                    var selected = self.attObservableArray()[rowIndex];
                    //// alert(JSON.stringify(self.attObservableArray()));
                    self[self.attMap[self.curAtt()].inputAttRef].push(selected);

                    // self.inputCourseProfessorArray.push(selected);
                    //// alert(JSON.stringify(self.inputCourseProfessorArray()));

                    //// alert(JSON.stringify(selected));
                }



                document.querySelector(attSelectDialog).close();
            } else {
                if(confirm("Are you sure you do not want to select any row?")){
                    document.querySelector(attSelectDialog).close();
                }
            }
        };
        self.clearSelectedAtt =  function(data) {

            self[self.attMap[data.substring(5)].inputAttRef].removeAll();
        };

        self.saveButtonClick = function() {
            var elementArray = [];


            
            elementArray.push(document.getElementById("ProfessorfirstNameInput"));
            
            elementArray.push(document.getElementById("ProfessorlastNameInput"));
            



            var invalidflag=false;
            for (var i=0; i<elementArray.length; i++) {
                if (!(elementArray[i].valid === "valid")) {
                 if(elementArray[i].showMessages !== undefined){
                    elementArray[i].showMessages();
                    if (invalidflag==false) invalidflag = true;
                    }
                }
            }


            //proceed to add or update record only if all input fields are valid
            if(invalidflag==false) {

                // if it is a adding action, do POS
                self.addRow();

            }

            };


        self.addRow = function () {
            // var Course = {
            //     // 'Course_Id': self.inputCourseId(),
            //
            //     'Course_classroom': self.addCourseclassroom()
            //   };
            // var q = jQuery.Deferred(),
            //     queuechain = q;




            $.ajax({
                type: "POST",
                contentType: 'application/json',
                url: "http://localhost:8080/Professor",
                data: JSON.stringify(
                    {
                        // 'Id': self.inputCourseId(),

        
        'firstName' : self.inputProfessorfirstName()
        
        ,
        
        
        'lastName' : self.inputProfessorlastName()
        
        


                    }),
                dataType: "json"}
            ).done(
                function (returndata) {
                    var q = jQuery.Deferred(),
                        queuechain = q;

                    for (var j in self.oneArray) {
                        var inputAttRef;
                        var array = [];
                        var attId;

                        if(self.dropdownMap.hasOwnProperty(self.oneArray[j])){
                            inputAttRef = self.attMap[self.oneArray[j]].dropInputAttData;
                            if (self[inputAttRef]()!=null){
                              array.push({
                              id : self[inputAttRef]()
                              });
                            attId = "value";
                              }
                            } else {
                              inputAttRef = self.attMap[self.oneArray[j]].inputAttRef;
                              array = self[inputAttRef]();
                            }

                            if (array.length > 0) {

                                var associationUrl = "http://localhost:8080/api/Professor/" + returndata.id + "/"+ self.oneArray[j]+ "/" + array[0].id;
                               // alert(associationUrl);
                                queuechain = queuechain.then( function () {
                                    $.ajax({
                                            type: "POST",
                                            url: associationUrl,
                                            success: function () {
                                               // alert("connection success one");

                                            },
                                            error: function (xhr) {
                                                console.log('error', xhr);
                                               // alert("connection failed");
                                            }
                                        }
                                    );
                                }
                            );

                            }

                            //
                            // queuechain1.done();
                            // q1.resolve();
                        }


                    for (var j in self.manyArray) {
                        var inputAttRef = self.attMap[self.manyArray[j]].inputAttRef;
                       // alert(self[inputAttRef]().length);

                        if (self[inputAttRef]().length > 0) {

                            for (var i=0; i<self[inputAttRef]().length; i++)

                            {

                                (function (i) {

                                    var associationUrl = "http://localhost:8080/api/Professor/" + returndata.id + "/" + self.manyArray[j] + "/" + self[inputAttRef]()[i].id;
                                   // alert(associationUrl);
                                    queuechain = queuechain.then(function () {
                                            return $.ajax({
                                                    type: "POST",
                                                    url: associationUrl
                                                    ,
                                                    success: function () {
                                                       // alert("connection success many" + associationUrl);

                                                    },
                                                    error: function (xhr) {
                                                        console.log('error', xhr);
                                                       // alert("connection failed");
                                                    }
                                                }
                                            );
                                        }
                                    );
                                }(i));

                            }

                        }

                        //

                    }


                    queuechain.done();
                    q.resolve();

                    }).done(function() {
                oj.Router.rootInstance.go("Professor");
            });


            // ready for adding attribute entities
            // var attAssociationUrl = "http://localhost:8080/Course/" + self.inputCourseId() + "/" + self.attMap["Professor"].attInCourseName;
            // var attUrl = "http://localhost:8080/Professor";
            //
            // queuechain.done( function() {
            //     var q1 = jQuery.Deferred(),
            //         queuechain1 = q1;
            //
            //
            //
            //     if (self.attMap["Professor"].oneOrMany == "one") {
            //
            //         if (self[inputAttRef]().length > 0) {
            //
            //
            //
            //            // alert(self.CourseObservableArray().length);
            //             var associationUrl = "http://localhost:8080/api/Course/" + self.CourseObservableArray()[self.CourseObservableArray().length - 1]['Course_Id'] + "/Professor/" + self[inputAttRef]()[0].id;
            //            // alert(associationUrl);
            //             queuechain1 = queuechain1.then(
            //                 $.ajax({
            //                         type: "POST",
            //                         url: associationUrl,
            //                         success: function () {
            //                            // alert("connection success");
            //
            //                         },
            //                         error: function (xhr) {
            //                             console.log('error', xhr);
            //                            // alert("connection failed");
            //                         }
            //                     }
            //                 ));
            //
            //             q1.resolve();
            //         }
            //
            //         //
            //         // queuechain1.done();
            //         // q1.resolve();
            //     }
            // });

            // $.ajax({
            //     type: "GET",
            //     url: attAssociationUrl
            // }).done(
            // if (output != null) {
            // function (output) {
            //    // alert("pass");
            //     var q = jQuery.Deferred(),
            //         queuechain = q;
            //
            //     queuechain = queuechain.then(
            //         $.ajax({
            //             url: "http://localhost:8080/Course/" + self.inputCourseId() + "/professorInCourse/",
            //             type: "DELETE",
            //             success: function (response) {
            //                // alert("delete success");
            //
            //             },
            //
            //             error: function (e) {
            //                 console.log(e);
            //                // alert("delete failed");
            //
            //             }
            //         }));
            //
            //     queuechain = queuechain.then(
            //         $.ajax({
            //             url: "http://localhost:8080/Professor/" + output.id + "/courseInProfessor/" + self.inputCourseId(),
            //             type: "DELETE",
            //             success: function (response) {
            //                // alert("delete success");
            //                 console.log(response);
            //
            //             },
            //             error: function (e) {
            //                 console.log(e);
            //                // alert("delete failed");
            //             }
            //         })
            //     );
            //
            //     queuechain.done(function () {
            //             var q1 = jQuery.Deferred(),
            //                 queuechain1 = q1;
            //             if (self[inputAttRef]().length > 0) {
            //
            //                 var associationUrl = "http://localhost:8080/api/Course/" + self.inputCourseId() + "/Professor/" + self[inputAttRef]()[0].id;
            //
            //                // alert(associationUrl);
            //                 queuechain1 = queuechain1.then($.ajax({
            //                         type: "POST",
            //                         url: associationUrl,
            //                         success: function () {
            //                            // alert("connection success");
            //
            //                         },
            //                         error: function (xhr) {
            //                             console.log('error', xhr);
            //                            // alert("connection failed");
            //                         }
            //                     })
            //                 );
            //
            //                 queuechain1.done();
            //                 q1.resolve();
            //             }
            //         }
            //     );
            //
            //     q.resolve();
            //
            // }
            // ).fail(function () {
            //     var q1 = jQuery.Deferred(),
            //         queuechain1 = q1;
            //
            //     if (self[inputAttRef]().length > 0) {
            //
            //         var associationUrl = "http://localhost:8080/api/Course/" + self.inputCourseId() + "/Professor/" + self[inputAttRef]()[0].id;
            //
            //        // alert(associationUrl);
            //         queuechain1 = queuechain1.then($.ajax({
            //                 type: "POST",
            //                 url: associationUrl,
            //                 success: function () {
            //                    // alert("connection success");
            //
            //                 },
            //                 error: function (xhr) {
            //                     console.log('error', xhr);
            //                    // alert("connection failed");
            //                 }
            //             })
            //         );
            //
            //         // var data = attUrl + "/" + self[inputAttRef]()[0].id;
            //         // self.putRelation(attAssociationUrl, data);
            //         // }
            //     }
            //     queuechain1.done();
            //     q1.resolve();
            //
            // })



        };

        self.backButtonClick=function(){
           // alert("hi, I going back to page: "+oj.Router.rootInstance.retrieve().page);
            oj.Router.rootInstance.go("Professor");
        }

    }

    vm=new viewModel;

    $(document).ready
    (
        function()
        {
//                 //ko.applyBindings(vm, document.getElementById('tableDemo'));
// //      var table = document.getElementById('table');
// //      table.addEventListener('currentRowChanged', vm.currentRowListener);
// //        $('#table').on('currentRowChanged', vm.currentRowListener);
//                 var table_single = document.getElementById('selectAttTable_single');
//                 // ko.applyBindings(vm, table);
//                 // table_single.addEventListener('selectionChanged', vm.selectionListener_single);
//                 var table_multi = document.getElementById('selectAttTable_multi');
//                 // ko.applyBindings(vm, table);
//                 // table_multi.addEventListener('selectionChanged', vm.selectionListener_multi);
//                 // // $('#selectionButton').on('click', vm.currentSelection);
//             $('#selectAttTable_single').on('click', '.oj-checkboxset', vm.syncCheckboxes);
//             $('#selectAttTable_multi').on('click', '.oj-checkboxset', vm.syncCheckboxes);

        }
    );

    return vm;
});