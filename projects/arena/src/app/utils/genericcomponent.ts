import { FormGroup } from "@angular/forms";
import { MessageService } from "@splenta/vezo";
import { GenericService } from "./genericservice";

export abstract class GenericComponent {
    visible: boolean = false;

    abstract form: FormGroup;

    abstract data: any[];

    dataService: GenericService;

    messageService: any;

    abstract componentName: string;

    pageNo?: number;
    pageSize?: number;
    sortField?: string;
    sortDir?: string;
    search?: string;

    constructor(dataService: GenericService, messageService: MessageService) {
        this.dataService = dataService;
        this.messageService = messageService;
    }
    getAllData() {
        this.dataService.getAllData(this.pageNo, this.pageSize, this.sortField, this.sortDir, this.search).then((res: any) => {
            this.data = res.content;
        })
    }

    getData(ds: any) {
        this.dataService.getData(ds).then((res: any) => {
            this.data = res;
        })
    }
    saveData() {
        const formData = this.form.value
        if (!formData.id) {
            this.dataService.createData(formData).then((res: any) => {
                if (res) {
                    this.visible = false;
                    this.messageService.add({ severity: 'success', detail: this.componentName + ' created', summary: this.componentName + ' created' });
                    this.getAllData();
                }
            })

        } else {
            this.dataService.updateData(formData).then((res: any) => {
                if (res) {
                    this.visible = false;
                    this.messageService.add({ severity: 'success', detail: this.componentName + ' updated', summary: this.componentName + ' updated' });
                    this.getAllData();
                }
            })
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
                this.messageService.add({ severity: 'success', detail: this.componentName + ' deleted', summary: this.componentName + ' deleted' });
                this.getAllData();
            }
        })
    }
}