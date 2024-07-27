import { ChangeDetectorRef, Component } from '@angular/core';

@Component({
  selector: 'app-mobile-preview',
  templateUrl: './mobile-preview.component.html',
  styleUrls: ['./mobile-preview.component.scss'],
})
export class MobilePreviewComponent {
  flutterState?: any;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  onFlutterAppLoaded(state: any) {
    this.flutterState = state;
    this.flutterState.onClicksChanged(() => {
      this.onCounterChanged();
    });
    this.flutterState.onTextChanged(() => {
      this.onTextChanged();
    });
  }

  onCounterSet(event: Event) {
    let clicks = parseInt((event.target as HTMLInputElement).value, 10) || 0;
    this.flutterState.setClicks(clicks);
  }

  onTextSet(event: Event) {
    this.flutterState.setText((event.target as HTMLInputElement).value || '');
  }

  // I need to force a change detection here. When clicking on the "Decrement"
  // button, everything works fine, but clicking on Flutter doesn't trigger a
  // repaint (even though this method is called)
  onCounterChanged() {
    this.changeDetectorRef.detectChanges();
  }

  onTextChanged() {
    this.changeDetectorRef.detectChanges();
  }
}
