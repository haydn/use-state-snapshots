declare module "use-state-snapshots" {
  interface Snapshot<T> {
    id: number;
    state: T;
    firstChange: number;
    lastChange: number;
  }

  type useStateSnapshots = <T>(
    initial: T | (() => T),
    delay?: number | false,
    limit?: number
  ) => [
    T,
    (action: T | ((state: T) => T), force?: boolean) => void,
    number,
    (action: number | ((pointer: number) => number)) => void,
    Array<Snapshot<T>>
  ];

  export = useStateSnapshots;
}
