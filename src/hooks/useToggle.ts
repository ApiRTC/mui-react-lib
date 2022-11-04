import { useState, useCallback, useMemo } from "react"

const useToggle = () => {
  const [status, setStatus] = useState(false);

  const toggleStatus = useCallback(() => {
    setStatus((prevStatus) => !prevStatus);
  }, []);

  const values = useMemo(
    () => ({
      status,
      toggleStatus
    }),
    [status, toggleStatus]
  );

  return values;
};

export default useToggle;