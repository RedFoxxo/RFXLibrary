import { animate, AnimationTriggerMetadata, state, style, transition, trigger } from "@angular/animations";

export const visibilityAnimation: AnimationTriggerMetadata[] = [
  trigger('visibility', [
    state('true', style({
      opacity: 1
    })),
    state('false', style({
      opacity: 0,
    }))
    //   transition('true <=> false', [
    //     animate('{{ transitionDurationMs }}ms {{ transitionDelayMs }}ms {{ transitionTimingFunction }}')
    //   ], { params: { transitionDurationMs: 0, transitionDelayMs: 0, transitionTimingFunction: 'ease' }})
  ])
];
