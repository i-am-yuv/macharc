import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { LayoutService } from '../layout/layout.service';

@Component({
  selector: 'app-mobile-preview',
  templateUrl: './mobile-preview.component.html',
  styleUrls: ['./mobile-preview.component.scss'],
})
export class MobilePreviewComponent implements OnInit {
  flutterState?: any;

  pageId: any;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private authService: AuthService,
    private layoutService: LayoutService,
  ) {}

  ngOnInit(): void {
    this.pageId = this.route.snapshot.paramMap.get('pageId');
    setTimeout(() => {
      this.layoutService.checkPadding(false);
    });
  }

  ngOnDestroy(): void {
    this.layoutService.checkPadding(true);
  }

  onFlutterAppLoaded(state: any) {
    this.flutterState = state;
    this.flutterState.onTextChanged(() => {
      this.onTextChanged();
    });

    this.flutterState?.setScreen('text');
    this.onTokenSet(this.authService.getAuthToken());
    this.onTextSet(this.pageId);
  }

  onTokenSet(event: String | null) {
    this.flutterState.setToken(event || '');
  }

  onCounterSet(event: Event) {
    let clicks = parseInt((event.target as HTMLInputElement).value, 10) || 0;
    this.flutterState.setClicks(clicks);
  }

  onTextSet(event: Event) {
    // this.flutterState.setText((event.target as HTMLInputElement).value || '');
    this.flutterState.setText(event || '');
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
