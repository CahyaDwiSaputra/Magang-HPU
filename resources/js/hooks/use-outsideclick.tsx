import { useEffect, useRef } from "react";

export function useOutsideClick(callback) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      // If the ref exists and the clicked element is NOT inside the ref
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }

    // Bind the event listener to the document
    document.addEventListener("mousedown", handleClickOutside);
    
    // Clean up the listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback]);

  return ref;
}