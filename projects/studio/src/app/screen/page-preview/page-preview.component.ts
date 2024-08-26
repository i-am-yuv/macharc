import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Screen } from '../screen';
import { ScreenService } from '../screen.service';

@Component({
  selector: 'app-page-preview',
  templateUrl: './page-preview.component.html',
  styleUrls: ['./page-preview.component.scss'],
})
export class PagePreviewComponent implements OnInit {
  @Input() draggableListRight: any;
  // private previewWindow: Window | null = null;
  screenId: string | null = '';
  screenData: Screen = {};
  screenDefinition: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private screenService: ScreenService,
  ) {
    this.screenId = this.route.snapshot.paramMap.get('pageId');
  }

  ngOnInit() {
    this.getPageData();
  }

  getPageData() {
    this.screenService.getData({ id: this.screenId }).then((res: any) => {
      this.screenData = res;
      if (this.screenData.screenDefinition) {
        this.screenDefinition = JSON.parse(this.screenData.screenDefinition);
      }
    });
  }
  // renderNewPage(screenDefination: any) {
  //
  //
  //   if (screenDefination !== null && screenDefination !== undefined) {
  //     this.draggableListRight = JSON.parse(screenDefination);
  //     setTimeout(() => {
  //       this.previewInWeb();
  //     }, 2000);
  //   }
  // }

  // private previewWindow: Window | null = null;

  // previewInWeb() {
  //   const manContent = document.querySelector('app-page-preview')?.innerHTML;
  //   const manStyles = Array.from(document.styleSheets)
  //     .map((sheet) => {
  //       try {
  //         return Array.from(sheet.cssRules || [])
  //           .map((rule) => rule.cssText)
  //           .join('');
  //       } catch (e) {
  //         console.warn('Could not read stylesheet:', sheet, e);
  //         return '';
  //       }
  //     })
  //     .join('');

  //   this.previewWindow = window.open('', 'preview');
  //   if (this.previewWindow) {
  //     this.previewWindow.document.write(`
  //       <html>
  //         <head>
  //           <style>${manStyles}</style>
  //         </head>
  //         <body>${manContent}</body>
  //         <script>
  //           window.addEventListener('message', function(event) {
  //             if (event.data && event.data.type === 'UPDATE_CONTENT') {
  //               document.body.innerHTML = event.data.content;
  //             }
  //           });
  //         </script>
  //       </html>
  //     `);
  //     this.previewWindow.document.close();
  //   } else {
  //     console.error('Failed to open new tab');
  //   }
  // }
}
