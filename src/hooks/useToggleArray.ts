import { useCallback, useMemo, useState } from "react";

const useToggleArray = <T>(values: T[], initIndex: number = 0) => {
  // lazy initialize
  const [index, setIndex] = useState(() => values && values.length > 0 ? (0 <= initIndex && initIndex < values.length ? initIndex : 0) : -1);

  const toggle = useCallback(() => {
    setIndex((prevIndex) => values.length > 0 ? (prevIndex + 1) % values.length : -1);
  }, [values]);

  const value = useMemo(() => values ? values[index] : undefined,
    [values, index]);

  return useMemo(() => ({
    value,
    index,
    toggle,
    setIndex
  }), [value, index, toggle])
};

export default useToggleArray;