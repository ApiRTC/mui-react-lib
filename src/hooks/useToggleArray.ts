import { useCallback, useMemo, useState } from "react";

const useToggleArray = (values: any[], initIndex: number = 0) => {
  const [index, setIndex] = useState(initIndex >= 0 && initIndex < values.length ? initIndex : 0);

  const toggle = useCallback(() => {
    setIndex((prevIndex) => (prevIndex + 1) % values.length);
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