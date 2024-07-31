import { Component, OnInit } from '@angular/core';
import { GenericComponent } from '../utils/genericcomponent';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Theme } from './theme';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@splenta/vezo/src/public-api';
import { ApplicationService } from '../application/application.service';
import { CollectionService } from '../collection/collection.service';
import { FieldService } from '../fields/field.service';
import { MicroserviceService } from '../microservice/microservice.service';
import { ScreenService } from '../screen/screen.service';
import { ThemeService } from './themeservice.service';

@Component({
  selector: 'app-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.scss']
})

export class ThemeComponent extends GenericComponent implements OnInit {

  form!: FormGroup<any>;
  data: any[] = [];
  componentName: string = "themecomponent";

  //   "primary": "#4C662B",
  // "onPrimary": "#FFFFFF",
  // "secondary": "#586249",
  // "onSecondary": "#FFFFFF",
  // "tertiary": "#386663",
  // "onTertiary": "#FFFFFF",
  // "tertiaryContainer": "#BCECE7",
  // "onTertiaryContainer": "#00201E",
  // "error": "#BA1A1A",
  // "onError": "#FFFFFF",
  // "background": "#F9FAEF",
  // "onBackground": "#1A1C16",
  // "surface": "#F9FAEF",
  // "onSurface": "#1A1C16",

  themeList: Theme[] = [
    {
      key: "primary",
      name: "Primary",
      code: "#488aff"
    },
    {
      key: "onPrimary",
      name: "On Primary",
      code: "#e6f4ff"
    },
    {
      name: "Secondary",
      key: "secondary",
      code: "#e6f4f7"
    },
    {
      name: "On Secondary",
      key: "onSecondary",
      code: "#1b1f48"
    },
    {
      name: "Background",
      key: "background",
      code: "#ffffff"
    },
    {
      name: "On Background",
      key: "onBackground",
      code: "#0a0e85"
    },
    {
      name: "Muted",
      key: "muted",
      code: "#e6f4f7"
    },
    {
      name: "On Muted",
      key: "on-muted",
      code: "#596678"
    },
    {
      name: "Accent",
      key: "accent",
      code: "#e6f4f7"
    },
    {
      name: "On Accent",
      key: "on-accent",
      code: "#1b1f48"
    },
    {
      name: "Error",
      key: "error",
      code: "#ff3d1c"
    },
    {
      name: "On Error",
      key: "on-error",
      code: "#e6f4ff"
    }
  ]
  constructor(
    private fb: FormBuilder,
    screenService: ScreenService,
    messageService: MessageService,
    private themeService: ThemeService
  ) {
    super(screenService, messageService);
    this.form = this.fb.group({
      themes: this.fb.array([])
    })

    this.themeList.forEach((value, index) => {
      this.addLesson(value);
    });
  }

  get themes() {
    return this.form.controls["themes"] as FormArray;
  }

  addLesson(theme: Theme) {
    const lessonForm = this.fb.group({
      key: [theme.key, Validators.required],
      name: [theme.name, Validators.required],
      code: [theme.code, Validators.required]
    });
    this.themes.push(lessonForm);
  }

  ngOnInit() {

  }

  saveThemeData() {
    console.log(this.themeList);
  }

  // Function to handle changes to the ngModel
  handleInputChange(code: string, element: any): void {
    console.log(code);
    console.log(element);

    this.themeList.forEach((value, index) => {
      if (value.key === element) {
        this.themeList[index].code = code;
      }
    });
  }

  getInputValue(element: any): string {
    return '';
  }
}
