import { animate, state, style, transition, trigger } from "@angular/animations";

export const IMAGE_ANIMATION = trigger('image', [
  state('true', style({
    opacity: 1
  })),
  transition('void => true', [
    animate('{{ duration }}ms {{ timingFunction }}', style({
      opacity: 1
    }))
  ], {
    params: {
      duration: 300,
      timingFunction: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
    }
  })
])
