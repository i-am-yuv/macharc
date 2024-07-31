import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@splenta/vezo/src/public-api';
import { FunctionsUsingCSI, NgTerminal } from 'ng-terminal';
import RSocketWebSocketClient from 'rsocket-websocket-client';
import { ProjectService } from '../../project/project.service';
import { GenericComponent } from '../../utils/genericcomponent';

import {
  IdentitySerializer,
  JsonSerializer,
  RSocketClient,
} from 'rsocket-core';

import { environment } from 'projects/studio/src/environments/environment';
import { Payload, ReactiveSocket } from 'rsocket-types';
import { Subject } from 'rxjs';
import { MicroserviceService } from '../microservice.service';

@Component({
  selector: 'app-ms-form',
  templateUrl: './ms-form.component.html',
  styleUrls: ['./ms-form.component.scss'],
})
export class MsFormComponent
  extends GenericComponent
  implements OnInit, OnDestroy
{
  override form!: FormGroup<any>;
  override data: any[] = [];
  override componentName: string = 'Microservice Form';
  msId: string | null;
  packaging: any[] = ['Jar', 'War'];
  projects: any[] = [];
  loading: boolean = false;

  webSocketUrl = environment.webTerminal;

  constructor(
    private fb: FormBuilder,
    private msService: MicroserviceService,
    messageService: MessageService,
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute) {
    super(msService, messageService);
    this.msId = this.route.snapshot.paramMap.get('id');
    this.form = this.fb.group({
      id: '',
      microServiceCode: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      microServiceName: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      packageName: ['', [Validators.required, this.packageNameValidator]],
      packaging: ['Jar'],
      portNumber: ['', [Validators.required]],
      project: [''],
    });
  }

  ngOnInit(): void {
    if (this.msId) {
      this.getData({ id: this.msId }, this.loadData.bind(this));
    }
    this.projectService.getAllData().then((res: any) => {
      this.projects = res.content;
    });
    // Code for web-terminal

    this.messages = [];

    // Create an instance of a client
    this.client = new RSocketClient({
      serializers: {
        data: JsonSerializer,
        metadata: IdentitySerializer,
      },
      setup: {
        // ms btw sending keepalive to server
        keepAlive: 60000,
        // ms timeout if no keepalive response
        lifetime: 180000,
        // format of `data`
        dataMimeType: 'application/json',
        // format of `metadata`
        metadataMimeType: 'message/x.rsocket.routing.v0',
      },
      transport: new RSocketWebSocketClient({
        url: this.webSocketUrl,
      }),
    });

    // Open the connection
    this.client.connect().subscribe({
      onComplete: (socket: ReactiveSocket<any, any>) => {
        // socket provides the rsocket interactions fire/forget, request/response,
        // request/stream, etc as well as methods to close the socket.
        // socket
        //   .requestStream({
        //     data: { message: 'start' }, // null is a must if it does not include a message payload, else the Spring server side will not be matched.
        //     metadata:
        //       String.fromCharCode('execute.command'.length) + 'execute.command',
        //     // String.fromCharCode('stream'.length) + 'stream',
        //   })
        //   .subscribe({
        //     onComplete: () => console.log('complete'),
        //     onError: (error: string) => {
        //       console.log('Connection has been closed due to:: ' + error);
        //     },
        //     onNext: (payload: { data: any }) => {
        //       console.log(payload);
        //       this.addMessage(payload.data);
        //     },
        //     onSubscribe: (subscription: {
        //       request: (arg0: number) => void;
        //     }) => {
        //       subscription.request(1000000);
        //     },
        //   });

        // this.sub.subscribe({
        //   next: (data) => {
        //     console.log(data);
        //     socket.fireAndForget({
        //       data: data,
        //       metadata:
        //         String.fromCharCode('execute.command'.length) +
        //         'execute.command',
        //     });
        //   },
        // });
        this.socket = socket;
      },
      onError: (error: any) => {
        console.log('Connection has been refused due to:: ' + error);
      },
      onSubscribe: (cancel: any) => {
        /* call cancel() to abort */
      },
    });
  }


  loadData(res: any): void {
    this.form.patchValue({ ...res });
  }

  packageNameValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isValid = /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+){2}$/.test(value);
    return isValid ? null : { invalidFormat: true };
  }

  checkPackageName() {
    this.form.get('packageName')?.updateValueAndValidity();
  }

  // override postSave(data:any)
  // {
  //   this.msService.generateCode(data).then((res: any) => {
  //     if (res) {
  //       // this.messageService.add({
  //       //   severity: 'success',
  //       //   detail: this.componentName + ' created',
  //       //   summary: this.componentName + ' created',
  //       // });
  //     }
  //   });
  // }

  override saveData() {
    // this.preSave();
    //this.form.value.collection = null ;// No collection for page
    const formData = this.form.value;
    if (!formData.id) {
      formData.id = null;
      this.msService.createMS(formData).then((res: any) => {
        if (res) {
          this.visible = false;
          this.messageService.add({
            severity: 'success',
            detail: this.componentName + ' created',
            summary: this.componentName + ' created',
          });
          this.getAllData();
          // this.postSave(res);
        }
      });
    } else {
      this.msService.createMS(formData).then((res: any) => {
        if (res) {
          this.visible = false;
          this.messageService.add({
            severity: 'success',
            detail: this.componentName + ' updated',
            summary: this.componentName + ' updated',
          });
          this.getAllData();
          // this.postSave(res);
        }
      });
    }
  }
  override postSave(data: any) {
    this.msService.generateCode(data).then((res: any) => {
      if (res) {
        // this.messageService.add({
        //   severity: 'success',
        //   detail: this.componentName + ' created',
        //   summary: this.componentName + ' created',
        // });
        console.log(res);
      }
    }).catch((err) => {
      this.messageService.add({
        severity: 'error',
        detail: 'Error',
        summary: 'Error while generating the code',
      });
    })
  }

  // Code added for web Terminal

  title = 'client';
  message = '';
  messages: any[] = [];
  client: RSocketClient<any, any> | undefined;
  socket: ReactiveSocket<any, any> | undefined;
  sub = new Subject();

  readonly prompt = FunctionsUsingCSI.cursorColumn(1) + '$ ';

  @ViewChild('term', { static: false }) child!: NgTerminal;

  requestStream(data: any) {
    // return new Observable((observer) => {
    if (this.socket) {
      console.log(data);

      this.socket
        .requestStream({
          data: data,
          metadata:
            String.fromCharCode('execute.command'.length) + 'execute.command',
        })
        .subscribe({
          onNext: (payload: Payload<any, any>) => {
            console.log(payload.data);
            this.addMessage(payload.data);
          },
          onComplete: () => console.log('complete'),
          onError: (error: Error) => console.error(error),
          onSubscribe: (subscription: {
            cancel: () => void;
            request: (n: number) => void;
          }) => {
            // Request all available items from the stream
            // subscription.request(Number.MAX_SAFE_INTEGER);
            subscription.request(1000000);
          },
        });
    }
    // });
  }

  addMessage(newMessage: any) {
    console.log('add message:' + JSON.stringify(newMessage));
    // write to xterm
    this.child.write(this.prompt + newMessage['message'] + '\n');
    this.messages = [...this.messages, newMessage];
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    if (this.client) {
      this.client.close();
    }
  }
  startServer() {
    console.log(this.socket);
    this.requestStream({
      message: 'start',
      serviceId: this.msId,
      serviceType: 'backend',
    });
  }
  stopServer() {
    this.requestStream({
      message: 'stop',
      serviceId: this.msId,
      serviceType: 'backend',
    });
  }

  stopMessages() {
    if (this.client) this.client.close();
  }
  sendMessage() {
    console.log('sending message:' + this.message);
    this.sub.next(this.message);
    this.message = '';
  }

  ngAfterViewInit() {
    this.child.onData().subscribe((input) => {
      if (input === '\r') {
        // Carriage Return (When Enter is pressed)
        this.child.write(this.prompt);
      } else if (input === '\u007f') {
        // Delete (When Backspace is pressed)
        if (this.child.underlying!.buffer.active.cursorX > 2) {
          this.child.write('\b \b');
        }
      } else if (input === '\u0003') {
        // End of Text (When Ctrl and C are pressed)
        this.child.write('^C');
        this.child.write(this.prompt);
      } else this.child.write(input);
    });
  }
}
