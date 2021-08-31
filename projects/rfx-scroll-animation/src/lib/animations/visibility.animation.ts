import { animate, AnimationTriggerMetadata, state, style, transition, trigger } from "@angular/animations";

export const visibilityAnimation: AnimationTriggerMetadata[] = [
  trigger('visibility', [
    state('visible', style({
      opacity: 1,
      transform: 'translate(0, 0)'
    })),
    state('hidden', style({
      opacity: 0,
      transform: '{{ currentTransform }}'
    }), { params: { currentTransform: 'translate(0, 0) scale(1)' }}),
    transition('visible <=> hidden', [
      animate('{{ transitionDurationMs }}ms {{ transitionDelayMs }}ms {{ transitionTimingFunction }}')
    ], { params: { transitionDurationMs: 0, transitionDelayMs: 0, transitionTimingFunction: 'ease' }})
  ])
];
