import { FormGroup } from '@angular/forms';
import { MessageService, Pagination } from '@splenta/vezo/src/public-api';
import { GenericService } from './genericservice';
import { Router } from '@angular/router';

export abstract class GenericComponent {
  visible: boolean = false;

  abstract form: FormGroup;

  abstract data: any[];

  dataSingle: any = {};

  // dataService: GenericService;

  // messageService: any;

  abstract componentName: string;

  search?: string;

  pageData?: Pagination = {};

  constructor(
    public dataService: GenericService,
    public messageService: MessageService
  ) {
    this.dataService = dataService;
    this.messageService = messageService;
  }
  getAllData(callBack?: (resData: any) => void) {
    this.dataService.getAllData(this.pageData, this.search).then((res: any) => {
      this.data = res.content;
      this.pageData!.totalElements = res.totalElements;
      this.pageData!.pageNo = res.pageable.pageNumber;
      this.pageData!.pageSize = res.pageable.pageSize;
      this.pageData!.offset = res.pageable.offset;
      this.pageData!.sortField = '';
      this.pageData!.sortDir = '';
      if (callBack) {
        callBack(res);
      }
      // {
      //     "sort": {
      //       "sorted": false,
      //       "unsorted": true,
      //       "empty": true
      //     },
      //     "pageNumber": 1,
      //     "pageSize": 10,
      //     "offset": 10,
      //     "paged": true,
      //     "unpaged": false
      //   }
    });
  }

  getAllDataById(applicationId: any, callBack?: (resData: any) => void) {
    this.dataService.getAllDataByApplicationId(applicationId, this.pageData, this.search).then((res: any) => {
      this.data = res.content;
      // this.pageData!.totalElements = res.totalElements;
      // this.pageData!.pageNo = res.pageable.pageNumber;
      // this.pageData!.pageSize = res.pageable.pageSize;
      // this.pageData!.offset = res.pageable.offset;
      // this.pageData!.sortField = '';
      // this.pageData!.sortDir = '';
      if (callBack) {
        callBack(res);
      }
    });
  }

  getData(ds: any, callBack?: (resData: any) => void) {
    this.dataService.getData(ds).then((res: any) => {
      this.dataSingle = res;
      if (callBack) callBack(res);
    });
  }
  preSave() { }
  preSaveByApplication() { }


  postSave(data: any) { 
  }

  postSaveByApplication(data: any) { }


  saveData() {
    this.preSave();
    //this.form.value.collection = null ;// No collection for page
    const formData = this.form.value;
    if (!formData.id) {
      this.dataService.createData(formData).then((res: any) => {
        if (res) {
          this.visible = false;
          this.messageService.add({
            severity: 'success',
            detail: this.componentName + ' created',
            summary: this.componentName + ' created',
          });
          this.getAllData();
          this.postSave(res);
        }
      });
    } else {
      this.dataService.updateData(formData).then((res: any) => {
        if (res) {
          this.visible = false;
          this.messageService.add({
            severity: 'success',
            detail: this.componentName + ' updated',
            summary: this.componentName + ' updated',
          });
          this.getAllData();
          this.postSave(res);
        }
      });
    }
  }

  saveDataByApplication(applicationId: any) {
    this.preSaveByApplication();
    //this.form.value.collection = null ;// No collection for page
    // this.form.value.application['id'] = applicationId ; 

    // Clone the form value
    //const formData = { ...this.form.value };

    // Ensure application is an object and add the id
    

    const formData = this.form.value;
    formData.application = { ...formData.application, id: applicationId };
    
    if (!formData.id) {
      this.dataService.createData(formData).then((res: any) => {
        if (res) {
          this.visible = false;
          this.messageService.add({
            severity: 'success',
            detail: this.componentName + ' created',
            summary: this.componentName + ' created',
          });
          this.getAllDataById(applicationId);
          this.postSaveByApplication(res);
        }
      });
    } else {
      this.dataService.updateData(formData).then((res: any) => {
        if (res) {
          this.visible = false;
          this.messageService.add({
            severity: 'success',
            detail: this.componentName + ' updated',
            summary: this.componentName + ' updated',
          });
          this.getAllDataById(applicationId);
          this.postSaveByApplication(res);
        }
      });
    }
  }

  addData() {
    this.visible = true;
    this.form.reset();
  }
  editData(ds: any) {
    this.visible = true;
    this.form.patchValue({ ...ds });
  }

  deleteData(ds: any) {
    this.dataService.deleteData(ds).then((res: any) => {
      if (res) {
        this.messageService.add({
          severity: 'success',
          detail: this.componentName + ' deleted',
          summary: this.componentName + ' deleted',
        });
        this.getAllData();
      }
    });
  }

  deleteDataByApplication(ds: any, applicationId: any) {
    this.dataService.deleteData(ds).then((res: any) => {
      if (res) {
        this.messageService.add({
          severity: 'success',
          detail: this.componentName + ' deleted',
          summary: this.componentName + ' deleted',
        });
        this.getAllDataById(applicationId);
      }
    });
  }
}
