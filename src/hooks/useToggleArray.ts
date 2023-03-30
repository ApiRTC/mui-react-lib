import { useCallback, useMemo, useState } from "react";

const useToggleArray = <T>(values: T[], initIndex: number = 0) => {
  //const [index, setIndex] = useState(initIndex >= 0 && initIndex < values.length ? initIndex : 0);
  const [index, setIndex] = useState(values.length > 0 ? (0 <= initIndex && initIndex < values.length ? initIndex : 0) : -1);

  const toggle = useCallback(() => {
    setIndex((prevIndex) => values.length > 0 ? (prevIndex + 1) % values.length : -1);
  }, [values]);

  const value = useMemo(() => values[index],
    [values, index]);

  const outputs = useMemo(() => ({
    value,
    index,
    toggle,
    setIndex
  }), [value, toggle]);

  return outputs
};

export default useToggleArray;