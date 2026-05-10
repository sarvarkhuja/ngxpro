export class NxpDynamicContext<T> {
  constructor(public readonly $implicit: T) {}

  get nxpDynamicOutlet(): T {
    return this.$implicit;
  }
}
