import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LayoutService } from '../layout/layout.service';

@Component({
  selector: 'app-mobile-preview',
  templateUrl: './mobile-preview.component.html',
  styleUrls: ['./mobile-preview.component.scss'],
})
export class MobilePreviewComponent implements OnInit {
  flutterState?: any;

  constructor(private changeDetectorRef: ChangeDetectorRef , private layoutService : LayoutService) {}
  ngOnInit(): void {
    this.layoutService.checkPadding(false);
  }

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
