import { Pagination } from '@splenta/vezo';
import { Application } from '../application/application';
import { Field } from '../fields/field';
import { FilterBuilder } from '../utils/FilterBuilder';
import { ActionsComponent } from './actions.component';

export class DataHandler {
  static generateServiceCode(actions: ActionsComponent) {
    actions.updateDefinitionJSON();
    actions.currentAction.taskDefinition = actions.definitionJSON;
    actions.actionService
      .generateServiceCode(actions.currentAction)
      .then((res: any) => {
        actions.msgService.add({
          severity: 'success',
          summary: 'Generated',
          detail: 'Code generated',
        });
      });
  }

  static getThisAction(actions: ActionsComponent, actionId: any) {
    actions.actionService
      .getActionByActionId(actionId)
      .then((res: any) => {
        if (res) {
          actions.currentAction = res.content;
        } else {
          actions.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error while fetching actions action.',
            life: 3000,
          });
        }
      })
      .catch((err: any) => {
        actions.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message,
          life: 3000,
        });
      });
  }

  static getActionContent(actions: ActionsComponent) {
    actions.actionId = actions.route.snapshot.paramMap.get('id');
    if (actions.actionId !== null) {
      actions.actionService
        .getData({ id: actions.actionId })
        .then((res: any) => {
          actions.currentAction = res;
          actions.dataDef = res.taskDefinition;

          if (
            actions.dataDef !== null &&
            actions.dataDef !== undefined &&
            actions.dataDef !== '' &&
            actions.dataDef !== 'null'
          ) {
            actions.definition = JSON.parse(actions.dataDef);
            actions.updateDefinitionJSON();
            actions.populateEditorFormsData();
          } else {
            // actions.definition = JSON.parse(actions.dataDef!);
            actions.definition = actions.createDefinition();
            actions.updateDefinitionJSON();
            actions.populateEditorFormsData();
          }
        });
    } else {
      actions.currentAction = {};
      actions.actionId = null;
      // actions.router.navigate(['/actions/' + null]);
    }
  }
  static saveDefinition(actions: ActionsComponent) {
    if (actions.currentAction.id == null) {
      actions.getActionContent();
    }
    actions.currentAction.taskDefinition = actions.definitionJSON;
    actions.actionService.updateData(actions.currentAction).then((res: any) => {
      actions.msgService.add({
        severity: 'success',
        summary: 'Updated',
        detail: 'Definition updated',
      });
    });
  }

  static getCurrentAction(actions: ActionsComponent) {
    actions.actionId = actions.route.snapshot.paramMap.get('id');

    if (actions.actionId !== 'null') {
      actions.actionService
        .getData({ id: actions.actionId })
        .then((res: any) => {
          actions.currentAction = res;
          actions.currentAction.taskDefinition = actions.definitionJSON;
        });
    }
  }

  static getAllScreens(actions: ActionsComponent, app: Application) {
    const filterStr = FilterBuilder.equal('application.id', app.id + '');
    actions.search = filterStr;
    let pagination!: Pagination;

    actions.screenService
      .getAllData(pagination, actions.search)
      .then((res: any) => {
        actions.allScreens = res.content;
      })
      .catch((err) => {});
  }

  static getAllActions(actions: ActionsComponent, app: Application) {
    // Code to get All the screens by Application Id
    const filterStr = FilterBuilder.equal('application.id', app.id + '');
    actions.search = filterStr;
    let pagination!: Pagination;

    actions.actionService
      .getAllData(pagination, actions.search)
      .then((res: any) => {
        actions.data = res.content;
      })
      .catch((err) => {});
  }

  static getAllModels(
    actions: ActionsComponent,
    selectedVar: any,
    msId: string,
  ) {
    actions.businessLogicService
      .getModelsByMicroserivce(msId!)
      .then((res: any) => {
        selectedVar.allModels = res;
      })
      .catch((err) => {});
  }

  static getAllPojos(actions: ActionsComponent) {
    actions.businessLogicService
      .getPojosByMicroserivce(actions.currentAction.microService?.id!)
      .then((res: any) => {
        actions.allPojos = res;
      })
      .catch((err) => {});
  }

  static getTheDtos(actions: ActionsComponent, selectedModel: string) {
    actions.requestDto = {};
    actions.responseDto = {};

    actions.collectionService.getRequestDto(selectedModel).then((res: any) => {
      actions.requestDto = res;
      res.fields.forEach((e: Field) => {
        if (actions.reqDtoModelMappedList.length === 0) {
          actions.reqDtoModelMappedList.push({ fieldId: e.id });
        }
      });
    });
    actions.collectionService.getResponseDto(selectedModel).then((res: any) => {
      actions.responseDto = res;
    });
    actions.endpointService
      .getAllEndpointsByCollection(selectedModel)
      .then((res: any) => {
        actions.allEndpointsByModel = res;
      });
  }

  static getTheFields(
    actions: ActionsComponent,
    selectedVar: any,
    selectedModelId: string,
  ) {
    var filterStr = FilterBuilder.equal('collection.id', selectedModelId);
    var search = filterStr;

    actions.fieldsService.getAllData(undefined, search).then((res: any) => {
      selectedVar.allFieldsByModel = res.content;
    });
    // actions.collectionService
    //   .getAllFieldsByCollection(selectedModel.id)
    //   .then((res: any) => {
    //     actions.allFieldsByModel = res;
    //   });
  }
}
