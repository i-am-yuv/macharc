import { ActionsComponent } from './actions.component';

export class OpenEditor {
  static openConditionEditor(actions: ActionsComponent, editor: any) {
    // For New Entry Reseting the data
    if (Object.keys(editor.step.properties).length === 0) {
      actions.conditionGroups = [
        {
          conditions: [
            {
              firstValue: '',
              operator: '=',
              secondValue: null,
              manualEntry: false,
            },
          ],
        },
      ];
    } else {
      for (var i = 0; i < actions.definition.sequence.length; i++) {
        var currDefination = actions.definition.sequence[i];
        if (currDefination.id == editor.step.id) {
          actions.conditionGroups =
            currDefination.properties['conditionGroups'];
        }
      }
    }
    actions.conditionEditor = editor;
    actions.showConditionEditor = !actions.showConditionEditor;
  }

  static openLoopEditor(actions: ActionsComponent, editor: any) {
    if (Object.keys(editor.step.properties).length === 0) {
      actions.loopFirstValue = {};
      actions.loopOperator = {};
      actions.loopSecondValue = {};
      actions.loopStaticValue = null;
    } else {
      for (var i = 0; i < actions.definition.sequence.length; i++) {
        var currDefination = actions.definition.sequence[i];
        if (currDefination.id == editor.step.id) {
          const logicGroup: any = currDefination.properties['conditionGroups'];

          logicGroup.forEach((group: any) => {
            // Loop through each condition within the group
            group.conditions.forEach((condition: any) => {
              actions.loopFirstValue = condition.firstValue;
              actions.loopOperator = condition.operator;
              if (condition.secondValue == 'manual') {
                actions.loopStaticValue = condition.manualEntryValue;
                actions.loopManualEntry = condition.manualEntry;
                actions.loopSecondValue = 'manual';
              } else {
                actions.loopSecondValue = condition.secondValue;
                actions.loopStaticValue = null;
                actions.loopManualEntry = false;
              }
            });
          });
        }
      }
    }
    actions.loopEditor = editor;
    actions.showLoopEditor = !actions.showLoopEditor;
  }

  static openVariablesPopup(actions: ActionsComponent, editor: any) {
    actions.showVariablesOptions = !actions.showVariablesOptions;
    actions.VariablesEditor = editor;
  }

  static openParamsPopup(actions: ActionsComponent, editor: any) {
    actions.showParamsOptions = !actions.showParamsOptions;
    actions.paramsEditor = editor;
  }

  static openAPIEditor(actions: ActionsComponent, editor: any) {
    // For New Entry Reseting the data
    console.log('editor', editor);
    if (
      editor.step.properties.collection == '' &&
      editor.step.properties.endpoint == ''
    ) {
      console.log('here1');
      actions.modelSelectedAPI = {};
      actions.currentEndpointByModel = {};
      actions.allEndpointsByModel = [];
      actions.allFieldsByReqDto = [];
      actions.reqDtoModelMappedList = [];
      actions.manualEntryStates = [];
    } else {
      console.log('here');
      for (var i = 0; i < actions.definition.sequence.length; i++) {
        var currDefination = actions.definition.sequence[i];

        if (currDefination.id == editor.step.id) {
          console.log('here');
          actions.selectedMicroserviceAPI =
            currDefination.properties['microServiceId'];
          actions.getAllModels(
            actions.allModels,
            actions.selectedMicroserviceAPI,
          );
          actions.modelSelectedAPI = currDefination.properties['collection'];
          actions.getTheDtos(actions.modelSelectedAPI.id);

          actions.currentEndpointByModel =
            currDefination.properties['endpoint'];
          // actions.endpointChange(actions.currentEndpointByModel);

          actions.reqDtoModelMappedList = currDefination.properties[
            'mappedData'
          ] as any[];
          // actions.selectedModelForDtoField = [];
          // for (var j = 0; j < actions.reqDtoModelMappedList.length; j++) {
          //   var newObj = actions.reqDtoModelMappedList[j];
          //   if (newObj.mappedModelField?.id == null) {
          //     actions.manualEntryAPIStates[j] = true;
          //   } else {
          //     actions.manualEntryAPIStates[j] = false;
          //   }
          //   actions.selectedModelForDtoField.push(newObj.mappedModelField);
          // }
        }
      }
    }
    actions.apiEditor = editor;
    actions.showAPIEditor = !actions.showAPIEditor;
  }

  static openSaveDataEditor(actions: ActionsComponent, editor: any) {
    if (Object.keys(editor.step.properties).length === 0) {
      actions.saveDataModel = {};
    } else {
      for (var i = 0; i < actions.definition.sequence.length; i++) {
        var currDefination = actions.definition.sequence[i];
        if (currDefination.id == editor.step.id) {
          actions.saveDataModel = currDefination.properties['model'];
        }
      }
    }
    actions.saveDataEditor = editor;
    actions.showSaveDataEditor = !actions.showSaveDataEditor;
  }

  static openSetResponseDataEditor(actions: ActionsComponent, editor: any) {
    // For New Entry Reseting the data
    if (Object.keys(editor.step.properties).length === 0) {
      actions.selectedResPojo = {};
      actions.pojoModelMappedList = [];
      actions.selectedPojoFields = [];
    } else {
      for (var i = 0; i < actions.definition.sequence.length; i++) {
        var currDefination = actions.definition.sequence[i];

        if (currDefination.id == editor.step.id) {
          actions.selectedResPojo = currDefination.properties['pojo'];
          actions.pojoModelMappedList = currDefination.properties['mappedData'];
          actions.getPojoFields(actions.selectedResPojo);
          actions.selectedModelForsetResField = [];

          for (var j = 0; j < actions.pojoModelMappedList.length; j++) {
            var newObj = actions.pojoModelMappedList[j];
            actions.selectedModelForsetResField.push(newObj.mappedModelField);
          }
        }
      }
    }
    actions.setResDataEditor = editor;
    actions.showSetResponseDataEditor = !actions.showSetResponseDataEditor;
  }
  static openNavigateEditor(actions: ActionsComponent, editor: any) {
    actions.navigateEditor = editor;

    // Code for data population
    if (editor.step.properties?.screen) {
      actions.currentScreenToNavigate = {};
      actions.navigateToMappedData = [];
      actions.finalMappedParamsList = [];
      actions.manualEntryStates = [];
    } else {
      actions.currentScreenToNavigate = editor.step.properties.screen;
      actions.mappedObjList = editor.step.properties.mappedData;
      actions.finalMappedParamsList = editor.step.properties.mappedData;
      actions.navigateToMappedData = [];

      for (var i = 0; i < actions.mappedObjList.length; i++) {
        var oneObj = actions.mappedObjList[i];
        actions.navigateToMappedData.push(oneObj.mappedValue);
        if (oneObj.mappedValue?.id == null) {
          actions.manualEntryStates[i] = true;
        } else {
          actions.manualEntryStates[i] = false;
        }
      }
    }
    actions.navigatePopup = !actions.navigatePopup;
  }
}
