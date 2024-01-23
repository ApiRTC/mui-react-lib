import { useCallback, useEffect, useMemo, useState } from "react";

const useToggle = (iValue: boolean) => {
  const [value, setValue] = useState(iValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  useEffect(() => {
    setValue(iValue)
  }, [iValue])

  return useMemo(() => ({
    value, setValue,
    toggle
  }), [value, toggle]);
};

export default useToggle;