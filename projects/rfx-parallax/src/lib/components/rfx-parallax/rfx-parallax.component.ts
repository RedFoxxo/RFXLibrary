import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { RegistryService } from '../../services';

@Component({
  selector: '[libRfxParallax]',
  templateUrl: './rfx-parallax.component.html',
  styleUrls: ['./rfx-parallax.component.less']
})
export class RfxParallaxComponent implements OnInit {
  /**
   * Parallax element speed.
   * e.g. 0 = no parallax, 1 = same speed as page
   * Default is 0.5.
   * @type {number}
   */
  @Input()
  public parallaxSpeed: number;

  /**
   * Disable parallax effect and restore default
   * element position.
   * Useful on low performance devices.
   * @type {boolean}
   */
  @Input()
  public isDisabled: boolean;

  /**
   * Registered element index inside service.
   * @type {number}
   */
  private elementIndex: number;

  constructor(
    private htmlElement: ElementRef,
    private registryService: RegistryService
  ) {
    this.parallaxSpeed = 0.5;
    this.isDisabled = false;
    this.elementIndex = this.registryService.registerSolidElement(this);
  }

  public ngOnInit(): void {
    // TODO CALC
    this.registryService.setSolidElementReady(this.elementIndex);
  }
}

