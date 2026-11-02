/** Label for tooltips when an unsaved item has no name yet. */
export const displayName = (name: string, fallback: string) => name.trim() || fallback

/** Name to send to the API; null lets the server assign a default ("Polygon 3", "Object 7"). */
export const nameForApi = (name: string) => name.trim() || null
