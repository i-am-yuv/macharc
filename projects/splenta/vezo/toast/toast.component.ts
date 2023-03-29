import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Message, MessageService } from '@splenta/vezo';



@Component({
  selector: 'vezo-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {

  @Input() key: string | undefined;

  @Input() preventOpenDuplicates: boolean = true;

  @Input() preventDuplicates: boolean = true;

  @Output() onClose: EventEmitter<any> = new EventEmitter();

  messages: Message[] = [];

  messagesArchieve: Message[] = [];

  constructor(private messageService: MessageService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.messageService.messageObserver.subscribe((messages) => {
      if (messages) {
        if (Array.isArray(messages)) {
          const filteredMessages = messages.filter((m) => this.canAdd(m));
          this.add(filteredMessages);
        } else if (this.canAdd(messages)) {
          this.add([messages]);
        }
      }
    });
  }
  add(messages: Message[]): void {
    this.messages = this.messages ? [...this.messages, ...messages] : [...messages];
    if (this.preventDuplicates) {
      this.messagesArchieve = this.messagesArchieve ? [...this.messagesArchieve, ...messages] : [...messages];
    }
    this.cd.markForCheck();
    this.closeAfterDelay(messages);
  }

  closeAfterDelay(messages: Message[]) {
    messages.forEach((e) => {
      const life: number = (e.life) ? e.life : 5000;
      setTimeout(() => {
        this.messages.splice(messages.indexOf(e), 1);
        this.messagesArchieve.splice(messages.indexOf(e), 1);
      }, life);
    })
  }

  canAdd(message: Message): boolean {
    let allow = this.key === message.key;

    if (allow && this.preventOpenDuplicates) {
      allow = !this.containsMessage(this.messages, message);

    }

    if (allow && this.preventDuplicates) {
      allow = !this.containsMessage(this.messagesArchieve, message);

    }
    return allow;
  }

  containsMessage(collection: Message[], message: Message): boolean {
    if (!collection) {
      return false;
    }

    return (
      collection.find((m) => {
        return m.summary === message.summary && m.detail == message.detail && m.severity === message.severity;
      }) != null
    );
  }
  onMessageClose(event: any) {
    this.messages.splice(event.index, 1);
    this.messagesArchieve.splice(event.index, 1);

    this.onClose.emit({
      message: event.message
    });

    this.cd.detectChanges();
  }



}
