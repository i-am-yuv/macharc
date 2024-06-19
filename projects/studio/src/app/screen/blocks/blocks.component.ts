import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { EffectAllowed } from 'ngx-drag-drop';

interface DraggableItem {
  name: string;
  content: string;
  effectAllowed: EffectAllowed;
  disable: boolean;
  handle: boolean;
  data?: any;
  children?: any[];
  id ?: any;
}

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.scss']
})
export class BlocksComponent {


   @Input() block!: DraggableItem;

   @Input() activeItem: any;

  // @ViewChild('videoPlayer') videoPlayer!: ElementRef;

  // playVideo() {
  //   this.videoPlayer.nativeElement.play();
  // }

  // pauseVideo() {
  //   this.videoPlayer.nativeElement.pause();
  // }

  // stopVideo() {
  //   this.videoPlayer.nativeElement.pause();
  //   this.videoPlayer.nativeElement.currentTime = 0;
  // }

}
