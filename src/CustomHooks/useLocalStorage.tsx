import { useCallback, useEffect, useState } from "react";

const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      let item = localStorage.getItem("key");
      item !== null ? JSON.parse(item) : initialValue;
      return item as T;
    } catch (err) {
      console.log("Some error occured", err);
      return initialValue;
    }
  });

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.storageArea !== window.localStorage || e.key !== key) return;
      try {
        setStoredValue(
          e.newValue !== null ? (JSON.parse(e.newValue) as T) : initialValue,
        );
      } catch (error) {
        setStoredValue(initialValue);
      }
    };

    addEventListener("storage", handleStorage);
    setValue(initialValue);

    return () => removeEventListener("storage", handleStorage);
  }, [key, initialValue]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        let next = value instanceof Function ? value(prev) : value;
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch (err) {
          console.log("Some error occured while setting the item", err);
        }
        return next;
      });
    },
    [key],
  );

  const removeValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.log("Some error occured while removing the item", err);
    }
    setStoredValue(null as T);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
};

export default useLocalStorage;
