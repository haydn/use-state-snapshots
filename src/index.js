import { useState } from "react";

const useStateSnapshots = (
  initial,
  delay = 2000,
  limit = Number.MAX_SAFE_INTEGER
) => {
  const now = Date.now();
  const [history, setHistory] = useState(() => ({
    snapshots: [
      {
        id: 0,
        firstChange: now,
        lastChange: now,
        state: typeof initial === "function" ? initial() : initial
      }
    ],
    pointer: 0,
    seq: 0
  }));
  return [
    history.snapshots[history.pointer].state,
    (action, force = false) => {
      setHistory(({ snapshots, pointer, seq }) => {
        const timestamp = Date.now();
        const diff = timestamp - snapshots[pointer].firstChange;
        return force || (delay !== false && (delay === 0 || diff >= delay))
          ? pointer + 1 === limit
            ? {
                snapshots: snapshots.slice(1).concat({
                  id: seq + 1,
                  firstChange: timestamp,
                  lastChange: timestamp,
                  state:
                    typeof action === "function"
                      ? action(snapshots[pointer].state)
                      : action
                }),
                pointer,
                seq: seq + 1
              }
            : {
                snapshots: snapshots.slice(0, pointer + 1).concat({
                  id: seq + 1,
                  firstChange: timestamp,
                  lastChange: timestamp,
                  state:
                    typeof action === "function"
                      ? action(snapshots[pointer].state)
                      : action
                }),
                pointer: pointer + 1,
                seq: seq + 1
              }
          : {
              snapshots: snapshots.map((snapshot, index) =>
                index === pointer
                  ? {
                      ...snapshot,
                      lastChange: timestamp,
                      state:
                        typeof action === "function"
                          ? action(snapshot.state)
                          : action
                    }
                  : snapshot
              ),
              pointer,
              seq
            };
      });
    },
    history.pointer,
    action => {
      setHistory(({ snapshots, pointer, ...state }) => ({
        ...state,
        snapshots,
        pointer: Math.max(
          0,
          Math.min(
            snapshots.length - 1,
            typeof action === "function" ? action(pointer) : action
          )
        )
      }));
    },
    history.snapshots
  ];
};

export default useStateSnapshots;
