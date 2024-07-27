import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

// The global _flutter namespace
declare var _flutter: any;
declare var window: {
  _debug: any;
};

@Component({
  selector: 'ng-flutter',
  standalone: true,
  template: `
    <div #flutterTarget>
      <div class="spinner">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100px"
          height="100px"
          viewBox="0 0 24 24"
        >
          <circle cx="4" cy="12" r="3" fill="currentColor">
            <animate
              id="svgSpinners3DotsBounce0"
              attributeName="cy"
              begin="0;svgSpinners3DotsBounce1.end+0.25s"
              calcMode="spline"
              dur="0.6s"
              keySplines=".33,.66,.66,1;.33,0,.66,.33"
              values="12;6;12"
            />
          </circle>
          <circle cx="12" cy="12" r="3" fill="currentColor">
            <animate
              attributeName="cy"
              begin="svgSpinners3DotsBounce0.begin+0.1s"
              calcMode="spline"
              dur="0.6s"
              keySplines=".33,.66,.66,1;.33,0,.66,.33"
              values="12;6;12"
            />
          </circle>
          <circle cx="20" cy="12" r="3" fill="currentColor">
            <animate
              id="svgSpinners3DotsBounce1"
              attributeName="cy"
              begin="svgSpinners3DotsBounce0.begin+0.2s"
              calcMode="spline"
              dur="0.6s"
              keySplines=".33,.66,.66,1;.33,0,.66,.33"
              values="12;6;12"
            />
          </circle>
        </svg>
      </div>
    </div>
  `,
  styles: [
    `
      :host div {
        width: 100%;
        height: 100%;
      }
      .spinner {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `,
  ],
  imports: [],
})
export class NgFlutterComponent implements AfterViewInit {
  // The target that will host the Flutter app.
  @ViewChild('flutterTarget') flutterTarget!: ElementRef;

  @Input() src: String = 'main.dart.js';
  @Input() assetBase: String = '';
  @Output() appLoaded: EventEmitter<Object> = new EventEmitter<Object>();

  ngAfterViewInit(): void {
    const target: HTMLElement = this.flutterTarget.nativeElement;

    _flutter.loader.loadEntrypoint({
      entrypointUrl: this.src,
      onEntrypointLoaded: async (engineInitializer: any) => {
        let appRunner = await engineInitializer.initializeEngine({
          hostElement: target,
          assetBase: this.assetBase,
        });
        await appRunner.runApp();
      },
    });

    target.addEventListener(
      'flutter-initialized',
      (event: Event) => {
        let state = (event as CustomEvent).detail;
        window._debug = state;
        this.appLoaded.emit(state);
      },
      {
        once: true,
      }
    );
  }
}
