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

  constructor(private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private authService: AuthService,
    private layoutService : LayoutService
  ) { }

  ngOnInit(): void {
    this.pageId = this.route.snapshot.paramMap.get('pageId');
    this.layoutService.checkPadding(false);
  }

  onFlutterAppLoaded(state: any) {
    this.flutterState = state;
    this.flutterState.onTextChanged(() => {
      this.onTextChanged();
    });
    console.log(this.pageId);

    this.flutterState?.setScreen("text");
    this.onTokenSet(this.authService.getAuthToken());
    this.onTextSet(this.pageId);
  }

  onCounterSet(event: Event) {
    let clicks = parseInt((event.target as HTMLInputElement).value, 10) || 0;
    this.flutterState.setClicks(clicks);
  }

  onTextSet(event: String | null) {
    this.flutterState.setText(event || '');
  }

  onTokenSet(event: String | null) {
    this.flutterState.setToken(event || '');
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
