# useStateSnapshots

A React hook to keep track of state changes for undo/redo functionality.

Demo: https://codesandbox.io/s/peaceful-rgb-i6fuq

## Features

- Drop-in replacement for [useState](https://reactjs.org/docs/hooks-reference.html#usestate) including support for [functional updates](https://reactjs.org/docs/hooks-reference.html#functional-updates) and [lazy initial state](https://reactjs.org/docs/hooks-reference.html#lazy-initial-state).
- Three ways to track changes:
  - Create a snapshot for every change.
  - Create snapshots at regular intervals.
  - Only create snapshots for specific changes.
- Snapshots include timestamps and ID's so you can display a timeline of changes.
- Configurable limit for the number of snapshots to keep.
- Flow and TypeScript declarations included.
- Zero dependencies.

## Install

```shell
yarn add useStateSnapshots
```

## Basic Usage

```js
import React from "react";
import useStateSnapshots from "useStateSnapshots";

const MyComponent = () => {
  const [state, setState, pointer, setPointer] = useStateSnapshots("Hello");
  return (
    <div>
      <button
        onClick={() => {
          setPointer(pointer - 1);
        }}
      >
        Undo
      </button>
      <textarea value={state} onChange={e => setState(e.target.value)} />
    </div>
  );
};
```

## API

### useStateSnapshots

```js
const [state, setState, pointer, setPointer, snapshots] = useStateSnapshots(
  initialState,
  delay,
  limit
);
```

Returns a list of snapshots, a pointer to the current snapshot, state derived from the current snapshot and functions for updating the state and setting the pointer.

The `initialState` argument is that same as [useState](https://reactjs.org/docs/hooks-reference.html#usestate).

The `delay` argument is the number of milliseconds to wait before automatically creating a new snapshot. When set to `false` the automatic snapshots behaviour is disabled and when set to `0` a new snapshot will be created every time `setState` is called. Default value: `2000`.

The `limit` argument is the number of snapshots to keep. When the limit is reached the oldest snapshot will be removed before when adding a new one. Default value: `Number.MAX_SAFE_INTEGER`.

```js
const { id, state, firstChange, lastChange } = snapshots[pointer];
```

The `pointer` value returned is the index of the current snapshot in `snapshots`.

(generated with `Date.now()`)

### setState

```js
setState(newState, forceSnapshot);
```

The `setState` function works just like the [useState](https://reactjs.org/docs/hooks-reference.html#usestate) version, with the exception of an additional `forceSnapshot` argument. When the `forceSnapshot` argument is true a new snapshot will be created irrespective of the amount of time since the last snapshot was created.

## setPointer

```js
setPointer(index);
```

The `index` argument is the index of the snapshot you want to restore in the `snapshots` list. If a value less than 0 or greater than the list length is provide it will be automatically clamped to the lowest (`0`) or highest (`snapshots.length - 1`) allowed value.

## Functional Updates

Both `setState` and `setPointer` accept functional updates as explained in
the [useState documentation](https://reactjs.org/docs/hooks-reference.html#functional-updates).

## Roadmap

- Document browser compatibility.
- Add tests.
- Create a `useReducerSnapshots` hook.
