import { useState, useCallback, useMemo } from "react"

const useToggle = (initialStatus: boolean) => {
  const [status, setStatus] = useState(initialStatus);

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