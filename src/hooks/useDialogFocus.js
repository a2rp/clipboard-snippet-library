import { useEffect, useRef } from "react";

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

const useDialogFocus = (dialogRef, onCancel, initialFocusRef) => {
  const onCancelRef = useRef(onCancel);

  useEffect(() => {
    onCancelRef.current = onCancel;
  }, [onCancel]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    const previouslyFocused = document.activeElement;
    const initialFocus = initialFocusRef?.current ?? dialog.querySelector(focusableSelector);
    initialFocus?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancelRef.current();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = Array.from(dialog.querySelectorAll(focusableSelector))
        .filter((element) => element.getClientRects().length > 0);
      if (focusableElements.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      const focusIsOutsideDialog = !dialog.contains(document.activeElement);

      if (focusIsOutsideDialog) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      if (previouslyFocused instanceof HTMLElement && previouslyFocused.isConnected) {
        previouslyFocused.focus();
      }
    };
  }, [dialogRef, initialFocusRef]);
};

export default useDialogFocus;
