import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FunctionsUsingCSI, NgTerminal } from 'ng-terminal';
import {
  IdentitySerializer,
  JsonSerializer,
  RSocketClient,
} from 'rsocket-core';
import { Payload, ReactiveSocket } from 'rsocket-types';
import RSocketWebSocketClient from 'rsocket-websocket-client';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-web-terminal',
  templateUrl: './web-terminal.component.html',
  styleUrls: ['./web-terminal.component.scss'],
})
export class WebTerminalComponent implements OnInit, OnDestroy {
  @Input() serviceId: string | null = '';

  webSocketUrl = environment.webTerminal;

  message = '';
  messages: any[] = [];
  client: RSocketClient<any, any> | undefined;
  socket: ReactiveSocket<any, any> | undefined;
  sub = new Subject();

  readonly prompt = FunctionsUsingCSI.cursorColumn(1) + '$ ';

  @ViewChild('term', { static: false }) child!: NgTerminal;
  @Input() serviceType: string = '';

  ngOnInit(): void {
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

  requestStream(data: any) {
    // return new Observable((observer) => {
    if (this.socket) {
      this.socket
        .requestStream({
          data: data,
          metadata:
            String.fromCharCode('execute.command'.length) + 'execute.command',
        })
        .subscribe({
          onNext: (payload: Payload<any, any>) => {
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
      serviceId: this.serviceId,
      serviceType: this.serviceType,
    });
  }
  stopServer() {
    this.requestStream({
      message: 'stop',
      serviceId: this.serviceId,
      serviceType: this.serviceType,
    });
  }

  stopMessages() {
    if (this.client) this.client.close();
  }
  sendMessage() {
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
