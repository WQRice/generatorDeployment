/**
 * Add course module
 */
define(['ojs/ojcore', 'knockout'
], function (oj, ko) {
    /**
     * The view model for the main content view template
     */
    function viewModel() {
        var self = this;
        var rootViewModel = ko.dataFor(document.getElementById('globalBody'));


        self.initialize = function () {
            // document.getElementById("buttontext").innerHTML = 'Update';
            // document.getElementById("dialogTitleId").innerHTML = 'Edit Course Record';



            self.inputCourseId(rootViewModel.frontToEditData().id);


            self.inputCourseclassroom(rootViewModel.frontToEditData().classroom);

            //input into the professor table in pop-up modial


            // for many to one relationship
            for (var i in self.oneArray) {
                var url = 'http://localhost:8080/Course/'+self.inputCourseId()+"/"+self.attMap[self.oneArray[i]].attInCourseName;

                // alert(url);
                self[self.attMap[self.oneArray[i]].inputAttRef].removeAll();
                getAssociatedAtt(url, function (output) {

                    delete output["_links"];
                    self[self.attMap[self.oneArray[i]].inputAttRef].push(output);
                    // alert(JSON.stringify(output));

                });
            }
            // delete topush.ele["_links"];
            // self.inputCourseProfessorArray.push(topush.ele);

            // for one to many relationship

                // var toPushList = {};
                for(var j in self.manyArray) {
                    var url = 'http://localhost:8080/Course/'+self.inputCourseId()+"/"+self.attMap[self.manyArray[j]].attInCourseName;

                    alert(url);
                    // alert(url);
                    self[self.attMap[self.manyArray[j]].inputAttRef].removeAll();

                    getAssociatedAtt(url, function (output) {
                        for (var ii in output["_embedded"][self.manyArray[j]]) {
                            delete output["_embedded"][self.manyArray[j]][ii]["_links"];
                            self[self.attMap[self.manyArray[j]].inputAttRef].push(output["_embedded"][self.manyArray[j]][ii]);
                        }

                    });

            }


        };

        self.oneArray = ["Professor"];

        self.manyArray = ["TA"];

        self.attMap = {
            Professor : {
                oneOrMany : "one",
                inputAttRef: "inputCourseProfessorArray",
                attInCourseName: "professorInCourse",
                courseInAttName: "courseInProfessor",
                inputColumnArray : "inputProfessorColumnArray"


            },
            TA : {
                oneOrMany : "many",
                inputAttRef: "inputCourseTAArray",
                attInCourseName: "tAInCourse",
                courseInAttName: "courseInTA",
                inputColumnArray : "inputTAColumnArray"

            }

        };

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
        self.inputCourseId = ko.observable();


        self.inputCourseclassroom = ko.observable();


        // for many to one relationships

        self.inputCourseProfessorArray = ko.observableArray().extend({ deferred: true });
        // self.inputCourseProfessorArray = ko.observableArray();
        self.inputProfessorDataProvider = new oj.ArrayDataProvider(self.inputCourseProfessorArray, {keyAttributes: 'id'});

        self.inputProfessorColumnArray = [

            {"headerText": "id", "field": "id", "headerStyle": 'font-weight:bold'},

            {"headerText": "firstName", "field": "firstName", "headerStyle": 'font-weight:bold'},

            {"headerText": "lastName", "field": "lastName", "headerStyle": 'font-weight:bold'}

        ];

        self.attObservableArray = ko.observableArray();


        self.attArraydataprovider = new oj.ArrayTableDataSource(self.attObservableArray, {keyAttributes: 'id'});


        self.selectAttColumnArray_single = ko.observable();

        // self.selectAttColumnArray_single = [
        //     {
        //         "renderer": oj.KnockoutTemplateUtils.getRenderer("checkbox_tmpl_single", true),
        //         "headerRenderer": oj.KnockoutTemplateUtils.getRenderer("checkbox_hdr_tmpl_single", true)
        //     },
        // {"headerText": "id", "field": "id", "headerStyle": 'font-weight:bold'},
        //
        // {"headerText": "firstName", "field": "firstName", "headerStyle": 'font-weight:bold'},
        //
        // {"headerText": "lastName", "field": "lastName", "headerStyle": 'font-weight:bold'}
        // ];

        // --------- for many to one relationships

        self.inputCourseTAArray = ko.observableArray().extend({ deferred: true });
        // self.inputCourseProfessorArray = ko.observableArray();
        self.inputTADataProvider = new oj.ArrayDataProvider(self.inputCourseTAArray, {keyAttributes: 'id'});

        self.inputTAColumnArray = [

            {"headerText": "id", "field": "id", "headerStyle": 'font-weight:bold'},

            {"headerText": "firstName", "field": "firstName", "headerStyle": 'font-weight:bold'},

            {"headerText": "lastName", "field": "lastName", "headerStyle": 'font-weight:bold'}

        ];

        self.selectAttColumnArray_multi = ko.observable();


        function getAssociatedAtt(url, handledata) {

            $.ajax({
                type:"GET",
                url: url
            })
                .done(function (data0) {
                    handledata(data0);
                    //
                    // professorInput.ele = data0;
                    // alert(JSON.stringify(professorInput.ele));

                }).fail(function (data1){
                // professorInput(null);
            });
        }

        function getAssociatedProfessorList(url, professorInput) {

            // var data ={};
            $.ajax({
                type:"GET",
                url: url
            })
                .done(function (data0) {

                    professorInput.push(data0["_embedded"]);

                }).fail(function (data1){
                // professorInput(null);
            });
        }

        self.selectAttributeinEditDialog = function(data, event) {

            // document.getElementById('selectAttTable').selection = [];
            // alert("open nested popup");
            // alert(self.selectAllDisabled());


            self.curAtt(data.substring(4));
            alert(self.curAtt());
            alert(self.selectAllDisabled());
            self.attObservableArray.removeAll();


            // self.selectAllDisabled(self.attMap[self.curAtt()].oneOrMany === "one");
            // self.selectAllDisabled(true);
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
                alert(JSON.stringify(data));
                //console.log(data);
                //console.log(self.deptObservableArray());

                //self.deptObservableArray([]);


                // for (var i = 0; i < data.length; i++) {
                var extractedData = data["_embedded"][self.curAtt()];
                // alert(JSON.stringify(extractedData));


                for (var i = 0; i < extractedData.length; i++) {
                    // alert(i);
                    // alert("test");
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
                    // alert("topush"+JSON.stringify(topush));
                    // alert(JSON.stringify(self[inputAttRef]()));
                    if (self[inputAttRef]()!=null) {
                        for (var j = 0; j < self[inputAttRef]().length; j++) {
                            if (self[inputAttRef]()[j].id == topush.id) {
                                topush.Selected(["checked"]);
                            }
                        }
                    }

                    self.attObservableArray.push(topush);
                    // alert(JSON.stringify(self.attObservableArray()));
                    self.attArraydataprovider = new oj.ArrayTableDataSource(self.attObservableArray, {keyAttributes: 'id'});

                }

                // self.clearAttributeSelect();
                // alert("clear");
                // document.getElementById(selectAttTable).selection = [];


                var selectionObj = [];
                var totalSize = self.attArraydataprovider.totalSize();
                for (var i = 0; i < totalSize; i++) {
                    self.attArraydataprovider.at(i).then(function (row) {
                        if (row.data.Selected().length > 0 &&
                            row.data.Selected()[0] == 'checked') {
                            selectionObj.push({startIndex: {row: row.index}, endIndex: {row: row.index}});
                        }

                        if (row.index == totalSize - 1) {
                            alert("selection set");
                            document.getElementById(selectAttTable).selection = selectionObj;
                        }
                    });
                }

            })
            ).then( function(){
                // document.getElementById(selectAttTable).selection=[];

                alert("open");
                document.querySelector(attSelectDialog).open();
            });


        };

        // self.modalAddProfessorColumnArray = [
        //
        //     {"headerText": "id", "field": "id", "headerStyle": 'font-weight:bold'},
        //
        //     {"headerText": "firstName", "field": "firstName", "headerStyle": 'font-weight:bold'},
        //
        //     {"headerText": "lastName", "field": "lastName", "headerStyle": 'font-weight:bold'}
        //
        // ];

        self.selectionListener_single = function(event)
        {

            alert(JSON.stringify(event.detail.previousValue));
            alert('selectionlistner-single');
            var data = event.detail;


            if (data != null) {

                var totalSize = self.attArraydataprovider.totalSize();
                for (var i = 0; i < totalSize; i++) {
                    self.attArraydataprovider.at(i).then(function (row) {
                        var oldObj = document.getElementById('selectAttTable_single').selection;
                        alert(JSON.stringify(oldObj));

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
                            // alert(JSON.stringify(selectionObj));
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

            alert(JSON.stringify(event.detail.previousValue));
            alert('selectionlistner-multi');
            var data = event.detail;

            if (data != null) {
                var selectionObj = data.value;
                var totalSize = self.attArraydataprovider.totalSize();
                var i, j;
                for (i = 0; i < totalSize; i++) {
                    self.attArraydataprovider.at(i).then(function (row) {
                        var foundInSelection = false;
                        if (selectionObj) {
                            // alert(JSON.stringify(selectionObj));
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
            // alert("selectall");
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
            // alert("sync");
            // alert(JSON.stringify(event));
            event.stopPropagation();

            if(self.selectAllDisabled()) {
                alert("synccheckbox single");

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
                                // alert("selectionobj after sync"+ JSON.stringify(selectionObj));
                            }
                        });
                    }
                }, 0);

            } else {
                alert("synccheckbox multi");


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
                                // alert("selectionobj after sync"+ JSON.stringify(selectionObj));
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
                    // alert(JSON.stringify(self.attObservableArray()));
                    self[self.attMap[self.curAtt()].inputAttRef].push(selected);
                    // alert(JSON.stringify(self.inputCourseProfessorArray()));

                    // alert(JSON.stringify(selected));
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


            elementArray.push(document.getElementById("CourseclassroomInput"));




            var invalidflag=false;
            for (var i=0; i<elementArray.length; i++) {
                if (!(elementArray[i].valid === "valid")) {
                    elementArray[i].showMessages();
                    if (invalidflag==false) invalidflag = true;
                }
            }


            //proceed to add or update record only if all input fields are valid
            if(invalidflag==false) {

                self.updateRow();
            }

        };

        self.updateRow = function () {

            // self.calculated(false);
            // DO PUT


            $.ajax({
                type: "PUT",
                contentType: 'application/json; charset=utf-8',
                url: "http://localhost:8080/Course/" + self.inputCourseId(),
                data: JSON.stringify(
                    {
                        'Id': self.inputCourseId(),

                        'classroom': self.inputCourseclassroom()
                    }
                ),
                dataType: 'json',
                success: function (returndata) {
                    console.log(returndata);



                }

            });

            // ready for updating attribute entities

            var defs = [new $.Deferred(), new $.Deferred()];


            var queuechain1 =defs[0];
            var queuechain2 =defs[1];
            for (var j in self.manyArray) {

                var inputAttRefMany = self.attMap[self.manyArray[j]].inputAttRef;


                var attAssociationUrl = "http://localhost:8080/Course/" + self.inputCourseId() + "/" + self.attMap[self.manyArray[j]].attInCourseName;
                var attUrl = "http://localhost:8080/"+self.manyArray[j];

                // var oldList = {};
                // getAssociatedProfessorList(attAssociationUrl, oldList);



                $.ajax({
                    type:"GET",
                    url: attAssociationUrl
                })
                    .done(function (data0) {

                        // var q = jQuery.Deferred(),
                        //     queuechain = q;

                        var oldList = data0["_embedded"];
                        alert("old list" + JSON.stringify(oldList));

                        // var foundInOld = false;
                        // var foundInNew = false;
                        // var id = output["_embedded"][self.manyArray[j]][k].id; // this id is in the list of available list
                        //

                        for (var i = 0; i < oldList[self.manyArray[j]].length; i++) {
                            var overlap = false;
                            for (var jj = 0; jj < self[inputAttRefMany]().length; jj++) {

                                if (self[inputAttRefMany]()[jj].id === oldList[self.manyArray[j]][i].id) {
                                    //
                                    overlap = true;
                                    break;
                                }
                            }
                            if (overlap!==true) {

                                //need to delete the old relationship
                                queuechain1 = queuechain1.then(
                                    $.ajax({
                                        url: "http://localhost:8080/Course/" + self.inputCourseId() + "/" + self.attMap[self.manyArray[j]].attInCourseName +"/" + oldList[self.manyArray[j]][i].id,

                                        type: "DELETE",
                                        success: function (response) {
                                            alert("delete success");

                                        },

                                        error: function (e) {
                                            console.log(e);
                                            alert("delete failed");

                                        }
                                    })
                                );


                                //delete from the other direction
                                queuechain1 = queuechain1.then(
                                    $.ajax({
                                        url: "http://localhost:8080/"+self.manyArray[j]+"/" + oldList[self.manyArray[j]][i].id + "/courseIn" + self.manyArray[j]+"/" + self.inputCourseId(),
                                        type: "DELETE",
                                        success: function (response) {
                                            alert("delete success");
                                            console.log(response);

                                        },
                                        error: function (e) {
                                            console.log(e);
                                            alert("delete failed");
                                        }
                                    })
                                );

                            }

                        }

                        alert(inputAttRefMany);
                        alert("input length many" +JSON.stringify(self[inputAttRefMany]()));

                            for (var jj = 0; jj < self[inputAttRefMany]().length; jj++) {

                                (function (jj) {

                                    var overlap = false;
                                for (var i = 0; i < oldList[self.manyArray[j]].length; i++) {

                                    if (oldList[self.manyArray[j]][i].id === self[inputAttRefMany]()[jj].id) {
                                        //
                                        overlap = true;
                                        break;

                                    }
                                }
                                alert("overlap"+overlap);

                                if (overlap != true) {
                                    //post the newly added
                                    alert("start post because not overlap");
                                    var associationUrl = "http://localhost:8080/api/Course/" + self.inputCourseId() + "/" + self.manyArray[j] + "/" + self[inputAttRefMany]()[jj].id;
                                    alert("post many" + associationUrl);
                                    queuechain1 = queuechain1.then(
                                        $.ajax({
                                            type: "POST",
                                            url: associationUrl,
                                            success: function (returndata) {
                                                alert("connection success many");

                                            },
                                            error: function (xhr) {
                                                console.log('error', xhr);
                                                console.log(associationUrl);
                                            }
                                        })
                                    )
                                }}(jj));
                            }

                        if (j==self.manyArray.length-1) {
                            queuechain1.done(
                                function () {

                                }
                            );
                            defs[0].resolve(true);
                        }
                        //
                        //
                        // queuechain.done(
                        //     function(){
                        //
                        //     }
                        // );
                        // q.resolve();

                        // for (var jj = 0; jj < self[inputAttRef]().length; jj++) {
                        //     if (id === self[inputAttRef]()[jj].id) {
                        //         //
                        //         foundInNew = true;
                        //     }
                        // }
                        // getAjax(attUrl, function (output) {
                        //     var q = jQuery.Deferred(),
                        //         queuechain = q;
                        //
                        //     for (var k = 0; k < output["_embedded"][self.manyArray[j]].length; k++) {
                        //         var foundInOld = false;
                        //         var foundInNew = false;
                        //         var id = output["_embedded"][self.manyArray[j]][k].id; // this id is in the list of available list
                        //
                        //
                        //         for (var i = 0; i < oldList[self.manyArray[j]].length; i++) {
                        //             if (id === oldList[self.manyArray[j]][i].id) {
                        //                 //
                        //                 foundInOld = true;
                        //             }
                        //         }
                        //
                        //         for (var jj = 0; jj < self[inputAttRef]().length; jj++) {
                        //             if (id === self[inputAttRef]()[jj].id) {
                        //                 //
                        //                 foundInNew = true;
                        //             }
                        //         }
                        //
                        //         if (foundInOld && !foundInNew) {
                        //             //need to delete it
                        //             queuechain = queuechain.then(
                        //                 $.ajax({
                        //                     url: "http://localhost:8080/Course/" + self.inputCourseId() + "/" + self.attMap[self.manyArray[j]].attInCourseName +"/" + id,
                        //
                        //                     type: "DELETE",
                        //                     success: function (response) {
                        //                         alert("delete success");
                        //
                        //                     },
                        //
                        //                     error: function (e) {
                        //                         console.log(e);
                        //                         alert("delete failed");
                        //
                        //                     }
                        //                 })
                        //             );
                        //
                        //
                        //             //delete from the other direction
                        //             queuechain = queuechain.then(
                        //                 $.ajax({
                        //                     url: "http://localhost:8080/"+self.manyArray[j]+"/" + id + "/courseIn" + self.manyArray[j]+"/" + self.inputCourseId(),
                        //                     type: "DELETE",
                        //                     success: function (response) {
                        //                         alert("delete success");
                        //                         console.log(response);
                        //
                        //                     },
                        //                     error: function (e) {
                        //                         console.log(e);
                        //                         alert("delete failed");
                        //                     }
                        //                 })
                        //             );                                }
                        //
                        //         if (!foundInOld && foundInNew) {
                        //             //post association for one direction first
                        //             var associationUrl = "http://localhost:8080/api/Course/" + self.inputCourseId() + "/"+ self.manyArray[j]+"/" + id;
                        //             queuechain = queuechain.then(
                        //             $.ajax({
                        //                 type: "POST",
                        //                 url: associationUrl,
                        //                 success: function (returndata) {
                        //                     alert("connection success");
                        //
                        //                 },
                        //                 error: function (xhr) {
                        //                     console.log('error', xhr);
                        //                 }
                        //             })
                        //             );
                        //
                        //
                        //             // var data = attUrl+"/"+id;
                        //             // self.postRelation(attAssociationUrl, data);
                        //             //
                        //             // //then, add association reversely
                        //             // var attAssociationUrlReverse = attUrl+"/"+id+"/"+self.attMap["Professor"].courseInAttName;
                        //             // var dataReverse ="http://localhost:8080/Course/"+self.inputCourseId();
                        //             // self.putRelation(attAssociationUrlReverse, dataReverse);
                        //         }
                        //
                        //     }
                        // });


                    }).fail(function (data1){
                    //     alert("fail get for many");
                    //
                    // for (var jj = 0; jj < self[inputAttRefMany]().length; jj++) {
                    //
                    //     var q = jQuery.Deferred(),
                    //         queuechain = q;
                    //
                    //         //post the newly added
                    //         var associationUrl = "http://localhost:8080/api/Course/" + self.inputCourseId() + "/"+ self.manyArray[j]+"/" + self[inputAttRefMany]()[jj].id;
                    //         queuechain = queuechain.then(
                    //             $.ajax({
                    //                 type: "POST",
                    //                 url: associationUrl,
                    //                 success: function (returndata) {
                    //                     alert("connection success");
                    //
                    //                 },
                    //                 error: function (xhr) {
                    //                     console.log('error', xhr);
                    //                 }
                    //             })
                    //         )
                    //     }
                    //     queuechain.done(
                    //         function(){
                    //         }
                    //     );
                    // q.resolve();
                    if (j==self.manyArray.length-1) {
                        queuechain1.done(
                            function () {

                            }
                        );
                        defs[0].resolve(true);
                    }

                });
                //
                // function getAjax(url, handleData) {
                //     $.ajax({
                //         url: url,
                //         success: function (data) {
                //             handleData(data);
                //         }
                //     });


                }





            for (var j in self.oneArray) {

                var inputAttRef = self.attMap[self.oneArray[j]].inputAttRef;


                if (self[inputAttRef]().length > 0) {

                    var associationUrl = "http://localhost:8080/api/Course/" + self.inputCourseId() + "/" + self.oneArray[j] + "/" + self[inputAttRef]()[0].id;

                    alert(associationUrl);
                    queuechain2 = queuechain2.then(
                        $.ajax({
                            type: "POST",
                            url: associationUrl,
                            success: function () {
                                alert("connection success one");
                                // oj.Router.rootInstance.go("Course");

                            },
                            error: function (xhr) {
                                console.log('error', xhr);
                                alert("connection failed");
                            }
                        }));

                    if (j == self.oneArray.length - 1) {
                        queuechain2.done(
                            function () {

                            }
                        );
                        defs[1].resolve(true);
                    }
                }


                    //
                    // queuechain1.done();
                    // q1.resolve();
                 else {
                    var attAssociationUrl = "http://localhost:8080/Course/" + self.inputCourseId() + "/" + self.attMap[self.oneArray[j]].attInCourseName;

                    $.ajax({
                        type: "GET",
                        url: attAssociationUrl
                    }).done(
                        function (output) {
                            alert(JSON.stringify(output));
                            // var q = jQuery.Deferred(),
                            //     queuechain = q;

                            queuechain2 = queuechain2.then(
                                $.ajax({
                                    url: attAssociationUrl,
                                    type: "DELETE",
                                    success: function (response) {
                                        alert("delete success one");

                                    },

                                    error: function (e) {
                                        console.log(e);
                                        alert("delete failed");

                                    }
                                })
                            );


                            queuechain2 = queuechain2.then(
                                $.ajax({
                                    url: "http://localhost:8080/"+ self.oneArray[j]+"/" + output.id + "/courseIn" + self.oneArray[j]+"/" + self.inputCourseId(),
                                    type: "DELETE",
                                    success: function (response) {
                                        alert("delete success one");
                                        console.log(response);

                                    },
                                    error: function (e) {
                                        console.log(e);
                                        alert("delete failed one");
                                    }
                                })
                            );
                            // queuechain2.done(function(){
                            //     // oj.Router.rootInstance.go("Course");
                            //
                            // });
                            //
                            // q.resolve();
                            if (j==self.oneArray.length-1) {
                                queuechain2.done(
                                    function () {

                                    }
                                );
                                defs[1].resolve(true);
                            }
                        }
                    ).fail(
                        function(){
                            // oj.Router.rootInstance.go("Course");
                            if (j==self.oneArray.length-1) {
                                queuechain2.done(
                                    function () {

                                    }
                                );
                                defs[1].resolve(true);
                            }

                        }
                    );





                    // $.ajax({
                    //     type: "GET",
                    //     url: attAssociationUrl
                    // }).done(
                    //     // if (output != null) {
                    //     function (output) {
                    //         alert(JSON.stringify(output));
                    //         var q = jQuery.Deferred(),
                    //             queuechain = q;
                    //
                    //         queuechain = queuechain.then(
                    //             $.ajax({
                    //                 url: "http://localhost:8080/Course/" + self.inputCourseId() + "/professorInCourse/",
                    //                 type: "DELETE",
                    //                 success: function (response) {
                    //                     alert("delete success");
                    //
                    //                 },
                    //
                    //                 error: function (e) {
                    //                     console.log(e);
                    //                     alert("delete failed");
                    //
                    //                 }
                    //             }));
                    //
                    //         queuechain = queuechain.then(
                    //             $.ajax({
                    //                 url: "http://localhost:8080/Professor/" + output.id + "/courseInProfessor/" + self.inputCourseId(),
                    //                 type: "DELETE",
                    //                 success: function (response) {
                    //                     alert("delete success");
                    //                     console.log(response);
                    //
                    //                 },
                    //                 error: function (e) {
                    //                     console.log(e);
                    //                     alert("delete failed");
                    //                 }
                    //             })
                    //         );
                    //
                    //         queuechain.done(function () {
                    //                 var q1 = jQuery.Deferred(),
                    //                     queuechain1 = q1;
                    //                 if (self[inputAttRef]().length > 0) {
                    //
                    //                     var associationUrl = "http://localhost:8080/api/Course/" + self.inputCourseId() + "/Professor/" + self[inputAttRef]()[0].id;
                    //
                    //                     alert(associationUrl);
                    //                     queuechain1 = queuechain1.then($.ajax({
                    //                             type: "POST",
                    //                             url: associationUrl,
                    //                             success: function () {
                    //                                 alert("connection success");
                    //
                    //                             },
                    //                             error: function (xhr) {
                    //                                 console.log('error', xhr);
                    //                                 alert("connection failed");
                    //                             }
                    //                         })
                    //                     );
                    //
                    //                     queuechain1.done();
                    //                     q1.resolve();
                    //                 }
                    //             }
                    //         );
                    //
                    //         q.resolve();
                    //
                    //     }
                    // ).fail(function () {
                    //     var q1 = jQuery.Deferred(),
                    //         queuechain1 = q1;
                    //
                    //     if (self[inputAttRef]().length > 0) {
                    //
                    //         var associationUrl = "http://localhost:8080/api/Course/" + self.inputCourseId() + "/Professor/" + self[inputAttRef]()[0].id;
                    //
                    //         alert(associationUrl);
                    //         queuechain1 = queuechain1.then($.ajax({
                    //                 type: "POST",
                    //                 url: associationUrl,
                    //                 success: function () {
                    //                     alert("connection success");
                    //
                    //                 },
                    //                 error: function (xhr) {
                    //                     console.log('error', xhr);
                    //                     alert("connection failed");
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
                }


                // $.ajax({
                //     type: "POST",
                //     url: associationUrl,
                //     success: function () {
                //         alert("connection success");
                //
                //     },


            }

            $.when.apply($, defs).then(function() {
                    oj.Router.rootInstance.go("Course");
            })
        };


        self.backButtonClick=function(){
            alert("hi, I going back to page: "+oj.Router.rootInstance.retrieve().page);
            oj.Router.rootInstance.go("Course");
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
            // $('#selectAttTable_multi').on('click', '.oj-checkboxset', vm.syncCheckboxes);

        }
    );

    return vm;
});