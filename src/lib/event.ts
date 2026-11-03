import { weddingConfig } from "@/wedding.config";
import type { CalendarEvent } from "./calendar";

/** The wedding as a calendar event, built only from wedding.config.ts. */
export function weddingCalendarEvent(): CalendarEvent {
  const { couple, event, siteUrl } = weddingConfig;
  return {
    title: `${couple.partner1} & ${couple.partner2}'s wedding`,
    start: event.start,
    end: event.end,
    location: event.fullAddress,
    description: `Muhurtham: ${event.muhurthamTime}\nVenue: ${event.venue}, ${event.address}`,
    url: siteUrl,
  };
}

/** Path of the .ics file, relative to the site root. */
export const ICS_PATH = "/wedding.ics";
