"use client";

import { useCallback, useEffect, useState } from "react";

export interface HistoryManager {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function useHistory(
  undoFn: () => void,
  redoFn: () => void,
  canUndoFn: () => boolean,
  canRedoFn: () => boolean
): HistoryManager {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const updateState = useCallback(() => {
    setCanUndo(canUndoFn());
    setCanRedo(canRedoFn());
  }, [canUndoFn, canRedoFn]);

  useEffect(() => {
    const interval = setInterval(updateState, 200);
    return () => clearInterval(interval);
  }, [updateState]);

  const undo = useCallback(() => {
    undoFn();
    updateState();
  }, [undoFn, updateState]);

  const redo = useCallback(() => {
    redoFn();
    updateState();
  }, [redoFn, updateState]);

  return { undo, redo, canUndo, canRedo };
}
