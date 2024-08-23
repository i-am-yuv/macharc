import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '@splenta/vezo';
import { BusinessLogic } from '../business-logic';
import { BusinessLogicService } from '../business-logic.service';

@Component({
  selector: 'app-business-logic-ai',
  templateUrl: './business-logic-ai.component.html',
  styleUrls: ['./business-logic-ai.component.scss'],
})
export class BusinessLogicAiComponent implements OnInit {
  editorOptions = { theme: 'vs-dark', language: 'text', formatOnPaste: true };
  javaEditorOptions = {
    theme: 'vs-dark',
    language: 'java',
    formatOnPaste: true,
  };
  wfId: string | null = '';
  wf: BusinessLogic = {};
  dataDef: string | undefined = '';
  // public definition: Definition = createDefinition();
  public definitionJSON?: string;
  prompt: string = 'convert celcius to fahrenheit';
  generatedCode: string = '';

  constructor(
    private businessLogicService: BusinessLogicService,
    private route: ActivatedRoute,
    private msgService: MessageService
  ) {}
  ngOnInit(): void {
    this.wfId = this.route.snapshot.paramMap.get('id');
    this.businessLogicService.getData({ id: this.wfId }).then((res: any) => {
      if (res) {
        this.wf = res;
        this.dataDef = this.wf.workflowDefinition;
        if (this.dataDef) {
          // this.definition = JSON.parse(this.dataDef);
          // this.updateDefinitionJSON();
        }
      }
    });
  }
  getCode() {
    this.generatedCode = '';
    this.businessLogicService
      .getLLMGeneratedCode(
        this.prompt,
        this.wf.workflowName!,
        this.wf.microService?.packageName!
      )
      .then((res) => {
        this.readAllChunks(res.body);
      });
  }

  saveCode() {
    this.wf.generatedCode = this.generatedCode;
    this.businessLogicService.saveGeneratedCode(this.wf).then((res: any) => {
      this.msgService.add({
        severity: 'success',
        summary: 'Generated',
        detail: 'Code generated',
      });
    });
  }

  async readAllChunks(readableStream: any) {
    const reader = readableStream.getReader();
    const chunks = [];

    let done, value;
    while (!done) {
      ({ value, done } = await reader.read());
      if (done) {
        return chunks;
      }
      chunks.push(value);
      // this.generatedCode += new TextDecoder().decode(value.response);
      const data = JSON.parse(new TextDecoder().decode(value));
      this.generatedCode += data.response;
    }
    return chunks;
  }
}
