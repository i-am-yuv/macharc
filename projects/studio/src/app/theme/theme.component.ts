import { Component, OnInit } from '@angular/core';
import { GenericComponent } from '../utils/genericcomponent';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Font, FontWeight, Theme, ThemeData } from './theme';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from '../application/application.service';
import { CollectionService } from '../collection/collection.service';
import { FieldService } from '../fields/field.service';
import { MicroserviceService } from '../microservice/microservice.service';
import { ScreenService } from '../screen/screen.service';
import { ThemeService } from './themeservice.service';
import { MessageService } from '@splenta/vezo';

@Component({
  selector: 'app-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.scss']
})

export class ThemeComponent extends GenericComponent implements OnInit {

  form!: FormGroup<any>;
  customColorForm!: FormGroup<any>;
  customFontForm!: FormGroup<any>;

  data: any[] = [];
  componentName: string = "themecomponent";
  fontForm: boolean = false;
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

  themeList: Theme[] = []
  /// ______________________________________________
  /// | NAME           | SIZE |  WEIGHT |  SPACING |
  /// |----------------|------|---------|----------|
  /// | displayLarge   | 96.0 | light   | -1.5     |
  /// | displayMedium  | 60.0 | light   | -0.5     |
  /// | displaySmall   | 48.0 | regular |  0.0     |
  /// | headlineMedium | 34.0 | regular |  0.25    |
  /// | headlineSmall  | 24.0 | regular |  0.0     |
  /// | titleLarge     | 20.0 | medium  |  0.15    |
  /// | titleMedium    | 16.0 | regular |  0.15    |
  /// | titleSmall     | 14.0 | medium  |  0.1     |
  /// | bodyLarge      | 16.0 | regular |  0.5     |
  /// | bodyMedium     | 14.0 | regular |  0.25    |
  /// | bodySmall      | 12.0 | regular |  0.4     |
  /// | labelLarge     | 14.0 | medium  |  1.25    |
  /// | labelSmall     | 10.0 | regular |  1.5     |

  // /// Thin, the least thick.
  // static const FontWeight w100 = FontWeight._(0, 100);

  // /// Extra-light.
  // static const FontWeight w200 = FontWeight._(1, 200);

  // /// Light.
  // static const FontWeight w300 = FontWeight._(2, 300);

  // /// Normal / regular / plain.
  // static const FontWeight w400 = FontWeight._(3, 400);

  // /// Medium.
  // static const FontWeight w500 = FontWeight._(4, 500);

  // /// Semi-bold.
  // static const FontWeight w600 = FontWeight._(5, 600);

  // /// Bold.
  // static const FontWeight w700 = FontWeight._(6, 700);

  // /// Extra-bold.
  // static const FontWeight w800 = FontWeight._(7, 800);

  // /// Black, the most thick.
  // static const FontWeight w900 = FontWeight._(8, 900);

  // fontList: Font[] = [
  //   {
  //     key: "titleLarge",
  //     name: "Title Large",
  //     font: "Roboto",
  //     size: "20",
  //     weight: "medium",
  //   },
  //   {
  //     key: "titleMedium",
  //     name: "Title Medium",
  //     font: "Roboto",
  //     size: "16",
  //     weight: "regular",
  //   },
  //   {
  //     name: "Title Small",
  //     key: "titleSmall",
  //     font: "Roboto",
  //     size: "14",
  //     weight: "medium",
  //   },
  //   {
  //     key: "bodyLarge",
  //     name: "Body Large",
  //     font: "Roboto",
  //     size: "16",
  //     weight: "regular",
  //   },
  //   {
  //     key: "bodyMedium",
  //     name: "Body Medium",
  //     font: "Roboto",
  //     size: "14",
  //     weight: "regular",
  //   },
  //   {
  //     key: "bodySmall",
  //     name: "Body Small",
  //     font: "Roboto",
  //     size: "12",
  //     weight: "regular",
  //   },
  //   {
  //     key: "labelLarge",
  //     name: "Label Large",
  //     font: "Roboto",
  //     size: "14",
  //     weight: "medium",
  //   },
  //   {
  //     key: "labelSmall",
  //     name: "Label Small",
  //     font: "Roboto",
  //     size: "10",
  //     weight: "regular",
  //   }
  // ];

  fontWeight: FontWeight[] = [
    {
      value: "w100",
      key: "Thin"
    },
    {
      value: "w200",
      key: "Extra-light"
    },
    {
      value: "w300",
      key: "Light"
    },
    {
      value: "w400",
      key: "Normal"
    },
    {
      value: "w500",
      key: "Medium"
    },
    {
      value: "w600",
      key: "Semi-bold"
    },
    {
      value: "w700",
      key: "Bold"
    },
    {
      value: "w800",
      key: "Extra-bold"
    },
    {
      value: "w900",
      key: "Black"
    }
  ]

  fonts: string[] = ["Lato", "Roboto", "Inter"]

  constructor(
    private fb: FormBuilder,
    screenService: ScreenService,
    messageService: MessageService,
    private themeService: ThemeService
  ) {
    super(screenService, messageService);

    // TODO - Call API to get the theme by application number

    this.form = this.fb.group({
      colorModels: this.fb.array([]),
      fontModels: this.fb.array([])
    })

    this.customColorForm = this.fb.group({
      key: [''],
      name: ['', Validators.required],
      code: ['', Validators.required],
      custom: [true]
    });

    this.customFontForm = this.fb.group({
      key: ['', Validators.required],
      font: ['', Validators.required],
      name: ['', Validators.required],
      size: ['', Validators.required],
      weight: ['', Validators.required],
      custom: [true]
    });

  }

  get colorModels() {
    return this.form.controls["colorModels"] as FormArray;
  }

  get fontModels() {
    return this.form.controls["fontModels"] as FormArray;
  }

  addTheme(theme: Theme) {
    const themeForm = this.fb.group({
      key: [theme.key, Validators.required],
      name: [theme.name, Validators.required],
      code: [theme.code, Validators.required],
      custom: [theme.custom, Validators.required]
    });
    this.colorModels.push(themeForm);
  }

  addThemeItem() {
    this.customColorForm = this.fb.group({
      key: [''],
      name: ['', Validators.required],
      code: ['', Validators.required],
      custom: [true]
    });
    this.visible = true
    // this.colorModels.push(this.createTheme());
  }


  createTheme(): FormGroup {
    return this.fb.group({
      key: ['', Validators.required],
      name: ['', Validators.required],
      code: ['', Validators.required],
      custom: [true, Validators.required]
    });
  }

  addFont(font: Font) {
    const fontForm = this.fb.group({
      key: [font.key, Validators.required],
      font: [font.font, Validators.required],
      name: [font.name, Validators.required],
      size: [font.size, Validators.required],
      weight: [font.weight, Validators.required],
      custom: [font.custom, Validators.required]
    });
    this.fontModels.push(fontForm);
  }

  createFont(): FormGroup {
    return this.fb.group({
      key: ['', Validators.required],
      font: ['', Validators.required],
      name: ['', Validators.required],
      size: ['', Validators.required],
      weight: ['', Validators.required],
      custom: [true, Validators.required]
    });
  }


  ngOnInit() {
    // Get Theme by Application 
    this.themeService.getThemeByApplicationId(`54619f65-b8fb-4ba8-af8f-f6aacdb5aa3a`).then((res: ThemeData) => {
      this.themeList = res.colorModels;
      res.colorModels.forEach((value, index) => {
        this.addTheme(value);
      });
      res.fontModels.forEach((value, index) => {
        this.addFont(value);
      });
    });
  }


  // Function to handle changes to the ngModel
  handleInputChange(code: string, element: any): void {
    console.log(code);
    console.log(element);
    let colorArrays = this.form.get('colorModels') as FormArray;
    this.themeList.forEach((value, index) => {
      if (value.key === element) {
        this.themeList[index].code = code;
        colorArrays.controls[index].patchValue({ "code": code });
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      // TODO - Call API to save the data
      console.log(this.form.value);

      this.themeService.updateThemeByApplicationId(`54619f65-b8fb-4ba8-af8f-f6aacdb5aa3a`, this.form.value);
    } else {
      console.log('Form is invalid');
    }
  }

  // Setting empty color form values in popup
  savePopupColorForm(): void {
    if (this.customColorForm.valid) {

      // TODO - convert the name into key
      var key = this.customColorForm.get("name")?.value;
      this.customColorForm.patchValue({ "key": this.toLowerCamelCase(key) })
      this.colorModels.push(this.customColorForm)

      // TODO - Call API to save the data
      this.visible = false;
    } else {
      console.log('Form is invalid');
    }
  }

  // Changing the human read-able to lowerCamelCase
  toLowerCamelCase(input: string): string {
    return input
      .split(' ') // Split the string by spaces
      .map((word, index) => {
        // Capitalize the first letter of each word except the first one
        if (index === 0) {
          return word.toLowerCase(); // Keep the first word in lowercase
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); // Capitalize the first letter of subsequent words
      })
      .join(''); // Join the words back together
  }

  // Setting color form values in popup
  editCustomColor(form: any) {
    this.customColorForm = form;
    this.visible = true;
  }

  // Setting font form values in popup
  editCustomFont(form: any) {
    this.customFontForm = form;
    this.fontForm = true;
  }

  savePopupFontForm(): void {
    if (this.customFontForm.valid) {

      // TODO - convert the name into key
      var key = this.customFontForm.get("name")?.value;
      this.customFontForm.patchValue({ "key": this.toLowerCamelCase(key) })
      this.fontModels.push(this.customFontForm)

      // TODO - Call API to save the data
      this.fontForm = false;
    } else {
      console.log('Form is invalid');
    }
  }

  // Setting empty font form values in popup
  addFontItem() {
    this.customFontForm = this.fb.group({
      key: [''],
      font: ['', Validators.required],
      name: ['', Validators.required],
      size: ['', Validators.required],
      weight: ['', Validators.required],
      custom: [true]
    });
    this.fontForm = true
    // this.colorModels.push(this.createTheme());
  }

}
