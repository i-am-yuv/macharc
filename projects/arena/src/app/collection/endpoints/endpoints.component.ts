import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../collection.service';
import { ActivatedRoute } from '@angular/router';
import { FilterBuilder } from '../../utils/FilterBuilder';
import { Collection } from '../collection';

@Component({
  selector: 'app-endpoints',
  templateUrl: './endpoints.component.html',
  styleUrls: ['./endpoints.component.scss']
})
export class EndpointsComponent implements OnInit {
  collectionId: string | null;
  collection: Collection = {};

  constructor(
    private collectionService: CollectionService,
    private route: ActivatedRoute) {
    this.collectionId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    if (this.collectionId) {
      this.collectionService.getData({ id: this.collectionId }).then((res) => {
        this.collection = res;
      })
    }
  }
}
