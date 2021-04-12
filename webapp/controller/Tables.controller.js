sap.ui.define([
    "project10/controller/BaseController",
    "sap/m/MessageBox"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
    function (Controller, MessageBox) {
        "use strict";

        return Controller.extend("project10.controller.App", {
            onInit: function () {

            },

            onSelectionChange: function () {
                this.getModel("app").setProperty("/Tables/editEnabled", true);
            },

            onAction: function (sAction) {
                if (sAction === "add") {
                    //This method creates a temporary entry for the form in the next screen
                    var oCreatedPath = this.getModel().createEntry("/ZCDSPINBALL", {
                        properties: {
                            Tableid: '9999999999',
                            Units: 'EA'
                        }
                    });
                    this._onNavigate(oCreatedPath.sPath.split("/")[1], sAction);
                } else {
                    //Get the selected context to bind it to the next view
                    let sPath = this.getView().byId("table0").getSelectedItem().getBindingContext().getPath().split("/")[1];
                    this._onNavigate(sPath, sAction);
                }
            },

            onDelete: function () {
                MessageBox.confirm("Are you sure you want to delete the Table?", {
                    onClose: (sAction) => {
                        if (sAction === "OK") {
                            var sPath = this.getView().byId("table0").getSelectedItem().getBindingContextPath();
                            this.getModel().remove(sPath, {
                                success: function (oResponse) {
                                    console.log(oResponse);
                                },
                                error: function (oError) {
                                    console.log(oError);
                                }
                            });
                        }
                    }
                });
            },

            _onNavigate: function (sPath, sAction) {
                this.navTo("Table", {
                    "sPath": sPath,
                    "sAction": sAction
                });
            }
        });
    });
