/** Generate a random ID */
export const uid = () => Math.random().toString(36).slice(2, 10);

/** Read a File as a base64 data URL */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Persist theme in localStorage */
export function saveTheme(theme: "dark" | "light") {
  try { localStorage.setItem("instapreview-theme", theme); } catch {}
}

/** Read theme from localStorage */
export function loadTheme(): "dark" | "light" | null {
  try {
    const v = localStorage.getItem("instapreview-theme");
    if (v === "dark" || v === "light") return v;
  } catch {}
  return null;
}
