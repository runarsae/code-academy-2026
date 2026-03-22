/**
 * Represents a single tweet-like post in the Idempotweet application.
 */
export interface Idem {
  /** Unique identifier for the idem */
  id: string;
  /** Display name of the poster (max 50 chars) */
  author: string;
  /** The text content of the idem (max 280 chars) */
  content: string;
  /** ISO 8601 timestamp when the idem was created */
  createdAt: string;
  /** Whether this idem was created by the seed script */
  isSeeded: boolean;
}

/**
 * Generic paginated response for API endpoints supporting infinite scroll.
 */
export interface PaginatedResponse<T> {
  /** Array of items for the current page */
  items: T[];
  /** Current page number (1-indexed) */
  page: number;
  /** Number of items per page */
  pageSize: number;
  /** Total number of items available */
  totalCount: number;
  /** Whether more pages exist */
  hasMore: boolean;
  /** Next page number, or null if no more pages */
  nextPage: number | null;
  /** Whether the response is served from demo data (no database) */
  demoMode?: boolean;
}

/**
 * Paginated response specifically for idems.
 */
export type PaginatedIdems = PaginatedResponse<Idem>;
