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
      colorName: "primary",
      colorCode: "#488aff"
    },
    {
      colorName: "onPrimary",
      colorCode: "#e6f4ff"
    },
    {
      colorName: "secondary",
      colorCode: "#e6f4f7"
    },
    {
      colorName: "onSecondary",
      colorCode: "#1b1f48"
    },
    {
      colorName: "background",
      colorCode: "#ffffff"
    },
    {
      colorName: "onBackground",
      colorCode: "#0a0e85"
    },
    {
      colorName: "muted",
      colorCode: "#e6f4f7"
    },
    {
      colorName: "on-muted",
      colorCode: "#596678"
    },
    {
      colorName: "accent",
      colorCode: "#e6f4f7"
    },
    {
      colorName: "accent-foreground",
      colorCode: "#1b1f48"
    },
    {
      colorName: "error",
      colorCode: "#ff3d1c"
    },
    {
      colorName: "on-error",
      colorCode: "#e6f4ff"
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
      colorName: [theme.colorName, Validators.required],
      colorCode: [theme.colorCode, Validators.required]
    });
    this.themes.push(lessonForm);
  }

  ngOnInit() {

  }

  saveThemeData() {
    console.log(this.themeList);
  }

  // Function to handle changes to the ngModel
  handleInputChange(colorCode: string, element: any): void { 
    console.log(colorCode);
    console.log(element);

    this.themeList.forEach((value, index) => {
      if(value.colorName === element) {
        this.themeList[index].colorCode = colorCode;
      }
    });
  }

  getInputValue(element: any): string {
    return '';
  }
}
