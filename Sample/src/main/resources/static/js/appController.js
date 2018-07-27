/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your application specific code will go here
 */
define(['ojs/ojcore', 'knockout', 'ojs/ojmodule-element-utils', 'ojs/ojmodule-element', 'ojs/ojrouter', 'ojs/ojknockout', 'ojs/ojarraytabledatasource',
  'ojs/ojoffcanvas','ojs/ojmessages'],
  function(oj, ko, moduleUtils) {
     function ControllerViewModel() {
       var self = this;

      // Media queries for repsonsive layouts
      var smQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      self.smScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
      var mdQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP);
      self.mdScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);

      // Router setup
      self.router = oj.Router.rootInstance;
      self.router.configure({

      
      'Professor': {label: 'Professor Table'
            , isDefault: true
         }, 

    'AddProfessor': {label: 'Add Professor'
    },

    'EditProfessor': {label: 'Edit Professor'
    } 
          ,
      
    
      'Course': {label: 'Course Table'
          }, 

    'AddCourse': {label: 'Add Course'
    },

    'EditCourse': {label: 'Edit Course'
    } 
    
    
      });


      self.navData = [

      
              {  name: 'Professor', id: 'Professor'},
                  {  name: 'Course', id: 'Course'}      
      

      ];

           oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();

            self.moduleConfig = ko.observable({'view': [], 'viewModel': null});
            self.tabData = ko.observableArray();
            self.selectedItem = ko.observable();
            self.tabFocus = '';
            self.tabCount = 0;

            // handle selection for dynamic tab
            self.selectedItem.subscribe(function (id) {
                if (id == null)
                    return;
                self.tabFocus = id;
                self.router.go(id).then(
                    function (result) {
                    }
                );
            });


            ko.computed(function () {
                var name = self.router.moduleConfig.name();
                var viewPath = 'views/' + name + '.html';
                var modelPath = 'viewModels/' + name;
                var masterPromise = Promise.all([
                    moduleUtils.createView({'viewPath': viewPath}),
                    moduleUtils.createViewModel({'viewModelPath': modelPath})
                ]);
                masterPromise.then(
                    function (values) {
                        self.moduleConfig({'view': values[0], 'viewModel': values[1]});
                        values[1].initialize();

                    },
                    function (reason) {
                    }
                );

                if (self.tabFocus != name) {
                    for (var k = 0; k < self.tabData().length; k++) {
                        if (self.tabData()[k].id === name) {
                            self.selectedItem(name);
                            return;
                        }
                    }
                    var items = self.navData;
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].id === name) {
                            self.tabData.push(items[i]);
                            self.tabCount++;
                            self.selectedItem(name);
                            break;
                        }
                    }
                }


            });


            self.navDataSource = new oj.ArrayTableDataSource(self.navData, {idAttribute: 'id'});

            // Drawer
            // Close offcanvas on medium and larger screens
            self.mdScreen.subscribe(function () {
                oj.OffcanvasUtils.close(self.drawerParams);
            });
            self.drawerParams = {
                displayMode: 'push',
                selector: '#navDrawer',
                content: '#pageContent'
            };
            // Called by navigation drawer toggle button and after selection of nav drawer item
            self.toggleDrawer = function () {
                return oj.OffcanvasUtils.toggle(self.drawerParams);
            };
            // Add a close listener so we can move focus back to the toggle button when the drawer closes
            $("#navDrawer").on("ojclose", function () {
                $('#drawerToggleButton').focus();
            });

            // Header
            // Application Name used in Branding Area
            self.appName = ko.observable("OwlsWeb");
            // User Info used in Global Navigation area
            self.userLogin = ko.observable("OIT@rice.edu");

            // Footer
            function footerLink(name, id, linkTarget) {
                this.name = name;
                this.linkId = id;
                this.linkTarget = linkTarget;
            }

            self.footerLinks = ko.observableArray([
                new footerLink('About OwlApp', 'aboutOwlApp', 'http://www.oracle.com/us/corporate/index.html#menu-about'),
                new footerLink('Contact Us', 'contactUs', 'https://oit.rice.edu/'),
                new footerLink('Legal Notices', 'legalNotices', 'http://www.oracle.com/us/legal/index.html'),
                new footerLink('Terms Of Use', 'termsOfUse', 'http://www.oracle.com/us/legal/terms/index.html'),
                new footerLink('Your Privacy Rights', 'yourPrivacyRights', 'http://www.oracle.com/us/legal/privacy/index.html')

            ]);

//----------------------------code for dynamic tab-------------------------------

            self.tabDataSource=new oj.ArrayTableDataSource(self.tabData, {idAttribute: 'id'});
            self.currentItem = ko.observable();
            self.message=ko.observable();


            self.entityMenuItemAction = function (event) {
                var searchId=event.target.value;
                //check if tab already exists
                for(var k=0;k<self.tabData().length;k++){
                    if(self.tabData()[k].id===searchId){
                        // alert("tab already exists");
                        self.message([{
                            severity: 'info',
                            summary: 'Tab \''+searchId+'\' already exists.',
                            detail: '',
                            autoTimeout: 3000
                        }]);
                        self.selectedItem(searchId);
                        return;
                    }
                }

                var items = self.navData;
                for(var i=0; i < items.length; i++ ){
                    if(items[i].id===searchId){
                        self.tabData.push(items[i]);
                        self.selectedItem(searchId);
                        self.tabCount++;
                        break;
                    }
                }
            };


            self.deleteTab = function(id){
                var items = self.tabData();
                // $('#entityTab').fadeOut();//test animation
                var i=0;
                for(; i < items.length; i++ ){
                    if(items[i].id===id) {
                        self.tabData.splice(i, 1);
                        break;
                    }
                }
                if(self.tabFocus===id) {
                    if (items[i] === undefined) {
                        i--;
                    }
                    self.selectedItem(items[i].id);
                }
            };

            self.removeTab=function(event){
                if(self.tabCount>1) {
                    self.deleteTab(event.detail.key);
                    self.tabCount--;
                    event.preventDefault();
                    event.stopPropagation();
                }
            };


//----------------------------code for global variable for passing between modules-------------------------------


            self.frontToEditData = ko.observable();



     }
     return new ControllerViewModel();
  }
);