/// <reference types='codeceptjs' />
type steps_file = typeof import('./E2E/steps_file.js').default;

declare namespace CodeceptJS {
  interface SupportObject { I: I, current: any }
  interface Methods extends Playwright {}
  interface I extends ReturnType<steps_file> {}
  namespace Translation {
    interface Actions {}
  }
}
