import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss']
})
export class TemplatesComponent {
  scrId: string | null;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.scrId = this.route.snapshot.paramMap.get('id');
  }
  designScreen(type: string) {
    // TODO: collect more info about the type and insert the type into screen definition before sending to next page
    this.router.navigate(['/builder/screens/designer/' + this.scrId]);
  }
}
