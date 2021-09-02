import { Component, OnInit } from '@angular/core';
import { AnimationTypeEnum } from 'rfx-scroll-animation';

@Component({
  templateUrl: './rfx-scroll-animation.component.html',
  styleUrls: ['./rfx-scroll-animation.component.less']
})
export class RfxScrollAnimationComponent implements OnInit {
  test1 = AnimationTypeEnum.BOTTOM;
  test2 = AnimationTypeEnum.LEFT;
  test3 = AnimationTypeEnum.RIGHT;

  constructor() { }

  ngOnInit(): void {
  }

}
