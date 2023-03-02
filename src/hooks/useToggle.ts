import { useCallback, useMemo, useState } from "react";

const useToggle = (initialValue: boolean) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  return useMemo(() => ({
    value,
    toggle
  }), [value, toggle]
  );
};

export default useToggle;