sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device",
    "sap/ui/core/syncStyleClass",
    "sap/ui/core/Fragment",
], function (Controller, Device, SyncStyleClass, Fragment) {
    "use strict"

    return Controller.extend("z3pm.controller.BaseController", {

        /**
         * Initialize base controller
         * @public
         */
        initialize: function () {
            sap.ui.getCore().AppContext = new Object();
        },

        /**
         * Determine content density - cozy for desktop, compact for all other devices
         * @public
         * @returns {String} Content density class name
         */
        getContentDensity: function () {
            if (!this._sContentDensityClass) {
                if (Device.system.desktop) {
                    this._sContentDensityClass = "sapUiSizeCozy";
                } else {
                    this._sContentDensityClass = "sapUiSizeCompact";
                }
            }
            return this._sContentDensityClass;
        },

        /**
         * Get sender id, remove prefix
         * @public
         * @param {sap.ui.base.Event} oEvent - Event Object
         * @param {String} sFullId - Full Id
         * @returns {String} - Sender ID
         */
        getSenderId: function (oEvent, sFullId) {
            var sId
            if (oEvent === undefined) {
                sId = sFullId;
            } else {
                sId = oEvent.getParameter("id");
            }

            // Example: "container-.z3pm---Home--idButtonAddSerialnumber'"
            //split the ID at every -- and use the last part
            if (sId.includes("--")) {
                var aHelp = sId.split("--");
                sId = aHelp[aHelp.length - 1];
                // If it contains a line indicator (like idSerialNumbersList-1) remove it 
                if (sId.includes("-")) {
                    aHelp = sId.split("-");
                    sId = aHelp[0];
                }
            }
            return sId;
        },

        /**
         * Return the index of an Id e.g. the row index of a table
         * @public
         * @param {sap.ui.base.Event} oEvent - Event Object
         * @returns {String} - Sender ID Index
         */
        getIndexFromSenderId: function (oEvent) {
            var sId = oEvent.getParameter("id");
            if (sId.includes("-")) {
                var aHelp = sId.split("-");
                sId = aHelp[aHelp.length - 1];
            }
            return sId;
        },

        /**
         * Return the from the i18n files
         * @public
         * @param {String} oTable - Text Name
         * @param {String} oModelName - Arguments
         */
        getText: function(sText, args) {

            return this.getView().getModel("i18n").getResourceBundle().getText(sText, args);
            
        },

        /**
         * Add a new line to the table and return the new index
         * @public
         * @param {sap.m.Table} oTable - Table Object
         * @param {String} oModelName - Model name
         * @returns {String} - Sender ID
         */
        addLineToTable: function (oTable, sModelName, oItem) {

            //Get a reference to the Model
            var oModel;
            if (sModelName === undefined) {
                oModel = oTable.getModel();
            } else {
                oModel = oTable.getModel(sModelName);
            }

            var oNewEntry = {};
            if (oItem !== undefined){
                oNewEntry = oItem;
            }

            //Add a new row to the model
            var sIndex = oModel.oData.push(oNewEntry);
            sIndex--;
            oModel.updateBindings();
            oTable.setModel(oModel, sModelName);

            return sIndex;
        },

        /**
         * Remove a line with a particular index from a Table
         * @public
         * @param {sap.ui.base.Event} oEvent - Event Object
         * @param {sap.m.Table} oTable - Table Object
         * @param {String} oModelName - Model name
         * @returns {String} - Sender ID
         */
        removeLineFromTable: function(sIndex, oTable, sModelName){
            var oModel = oTable.getModel(sModelName);
            var oData = oModel.oData;
            oData.splice(sIndex, 1);

            oModel.updateBindings();
            oTable.setModel(oModel, sModelName);
        },

        /**
         * Remove a line with a particular index from a Table
         * @public
         * @param {sap.ui.core.mvc.View} oView - View
         * @param {String} sFolder - Folder name
         * @param {String} sName - Fragment name
         * @param {sap.ui.base.Event} oEvent - Event Object
         */
        openDialog: function(oView, sFolder, sName, oEvent){

			// Create array for dialogs
            if (!this._mDialogs) { 
                this._mDialogs = {}; 
            }

			// creates requested dialog if not yet created
            if (!this._mDialogs[sName]) {
                this._mDialogs[sName] = Fragment.load({
                    id: oView.getId(),
                    name: "z3pm.fragments." + sFolder + "." + sName,
                    controller: this
                }).then(function(oDialog){
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

			// Get event source, if supplied
            var that = this;
            if (oEvent) {
                var oSource = oEvent.getSource();
            }

			// open dialog
            this._mDialogs[sName].then(function(oDialog){
                SyncStyleClass(that.getContentDensity(), oView, oDialog);
                if (sName === "messages") {
                    oDialog.setModel(sap.ui.getCore().getMessageManager().getMessageModel(), "messages");
                    oDialog.toggle(oSource);
                } else if (oSource) {
                    oDialog.openBy(oSource);
                } else {
                    oDialog.open();
                    // if (sName.substring(0,9) === "valueHelp") {
                    //     console.log("TODO: Set Filter");
                    // }
                }
            });
		},

        /**
         * Cancel a dialog
         * @param {sap.ui.base.Event} oEvent - Event Object
         * @public
         */
        onCancelDialog: function(oEvent) {
            oEvent.getSource().getParent().close();
        },

    })

})