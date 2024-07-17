import { useEffect } from "react";

/**
 * Klik diluar element tersebut (include children)
 * @param ref Ref ke DIV element
 * @param handler Outside click, bikin ref
 * 
 * @link https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
 */
export function useOutsideClick(ref: React.RefObject<HTMLDivElement>, handler: (e: MouseEvent) => void) {
  useEffect(() => {
    function handleClickOutside(e : MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as HTMLDivElement)) handler(e);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handler, ref]);
}