sap.ui.define([
    "project10/controller/BaseController"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
    function (Controller) {
        "use strict";

        return Controller.extend("project10.controller.App", {
            onInit: function () {
                this.getRouter().getRoute("Table").attachMatched(this._attachMatched, this);
            },

            _attachMatched: function (oEvent) {
                this.sPath = `/${oEvent.getParameters().arguments.sPath}`;
                this.sAction = oEvent.getParameters().arguments.sAction;
                this.getModel("app").setProperty("/Table/editMode", this.sAction);
                //If the page is refreshed, the temporary entry is lost 
                //So we recreate one and bind it to the form
                if (!!!this.getModel().getProperty(this.sPath)) {
                    let oContext = this.getModel().createEntry("/ZCDSPINBALL", {
                        properties: {
                            Tableid: '9999999999',
                            Units: 'EA'
                        }
                    });
                    this.sPath = oContext.sPath;
                    this.getView().byId("smartform0").bindElement(this.sPath);
                } else {
                    this.getView().byId("smartform0").bindElement(this.sPath);
                }
            },

            onChange: function (oSource, bDropdown) {
                //this method highilghts the errors in the form
                this.getView().byId("smartform0")._checkClientError();
                //if the onChange event is triggered from the Vendor list
                //and if the selected item is part for the dropdown menu items
                //then we bind the new selected Vendor id to the Vendor ID property 
                if (bDropdown && oSource.getContent().getSelectedItem()) {
                    let nVendor = oSource.getContent().getSelectedItem()._getBindingContext().getProperty("Vendorid");
                    this.getModel().setProperty(`${this.sPath}/Vendorid`, nVendor);
                }
                this.getModel("app").setProperty("/Table/saveEnabled", true);
            },

            onSave: function () {
                var oErrors = this.getView().byId("smartform0")._checkClientError();
                if (oErrors.length === 0) {
                    this.getModel().submitChanges({
                        success: oResponse => {
                            this.navTo("Tables");
                        }, error: oError => {
                            console.log(oError)
                        }
                    });
                }
            },

            onBack: function () {
                if (this.getModel().hasPendingChanges()) {
                    this.getModel().resetChanges();
                }
                this.onNavBack();
            }

        });
    });
