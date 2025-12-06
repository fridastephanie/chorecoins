import { useEffect } from "react";

/**
 * Custom hook for setting the document title dynamically.
 * Updates the browser tab title whenever the `title` value changes,
 * appending a fixed suffix " | ChoreCoins".
 */
export default function useDocumentTitle(title) {
  useEffect(() => {
    document.title = `${title} | ChoreCoins`;
  }, [title]);
}