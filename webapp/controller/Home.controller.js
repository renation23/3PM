sap.ui.define([
    "./BaseController",
    "../model/models.js"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, Models) {
        "use strict";

        return BaseController.extend("z3pm.controller.Home", {
            
            /**
             * Initialize controller
             * @public
             */
            onInit: function () {

                this.initialize();
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("RouteHome").attachPatternMatched(this.onRouteMatched, this);

            },

            /**
             * Route matched
             * @private
             * @param {sap.ui.base.Event} oEvent - Event Object
             */
            onRouteMatched: function (oEvent) {
                var aFilters = [];
            },

            /**
             * Event Handler for Button Press event
             * @public
             * @param {sap.ui.base.Event} oEvent - Event Object
             */
            onButtonPress: function (oEvent) {

                var sId = this.getSenderId(oEvent);
                console.log(sId);

                switch (sId) {
                    case "idButtonAddSerialnumber":
                        this.validateSerialnumber();
                        break;
                    case "idTableSerialNumber":
                        this.removeItem(oEvent);
                        break;
                    case "idButtonDelete":
                        this.deleteSerialnumber(oEvent);
                        break;
                    case "idButtonSubmit":
                        this.submitSerialNumber(oEvent);
                        break;
                }
            }


        });
    });
