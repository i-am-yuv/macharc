export class ToolBoxMethods {
  public static createTaskStepAPI(
    id: null,
    type: string,
    name: string,
    properties: any | undefined,
  ) {
    return {
      id,
      componentType: 'task',
      type,
      name,
      properties: properties || {
        collection: '',
        endpoint: '',
        mappedData: [],
      },
    };
  }

  public static createSaveDataTaskStep(
    id: null,
    type: string,
    name: string,
    properties: any | undefined,
  ) {
    return {
      id,
      componentType: 'task',
      type,
      name,
      properties: properties || {},
    };
  }

  public static createSetResponseDataStep(
    id: null,
    type: string,
    name: string,
    properties: any | undefined,
  ) {
    return {
      id,
      componentType: 'task',
      type,
      name,
      properties: properties || {},
    };
  }

  public static createFetchDataStep(
    id: null,
    type: string,
    name: string,
    properties: any | undefined,
  ) {
    return {
      id,
      componentType: 'task',
      type,
      name,
      properties: properties || {
        schedule: 0,
        model: name,
        queryType: '',
        customQuery: null,
      },
    };
  }

  public static createImportStep(
    id: null,
    type: string,
    name: string,
    properties: any | undefined,
  ) {
    return {
      id,
      componentType: 'task',
      type,
      name,
      properties: properties || { velocity: 0, name: name, models: [] },
    };
  }

  public static createIfStep(id: null, _true: never[], _false: never[]) {
    return {
      id,
      componentType: 'switch',
      type: 'if',
      name: 'If',
      branches: {
        true: _true,
        false: _false,
      },
      properties: {},
    };
  }

  public static createContainerStep(id: any, steps: any) {
    return {
      id,
      componentType: 'container',
      type: 'loop',
      name: 'Loop',
      properties: {},
      sequence: steps,
    };
  }

  public static navigateTo(
    id: null,
    type: string,
    name: string,
    properties: any | undefined,
  ) {
    return {
      id,
      componentType: 'task',
      type,
      name,
      properties: properties || {
        link: '',
        screen: {},
        target: '_self',
      },
    };
  }

  public static createNotification(
    id: null,
    type: string,
    name: string,
    properties: any | undefined,
  ) {
    return {
      id,
      componentType: 'task',
      type,
      name,
      properties: properties || {
        message: '',
        type: '',
        details: '',
      },
    };
  }

  // createTaskStepAPI(
  //   id: null,
  //   type: string,
  //   name: string,
  //   properties: any | undefined,
  // ) {
  //   return {
  //     id,
  //     componentType: 'task',
  //     type,
  //     name,
  //     properties: properties || {
  //       collection: '',
  //       endpoint: '',
  //       mappedData: [],
  //     },
  //   };
  // }
}
