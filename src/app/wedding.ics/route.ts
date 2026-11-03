import { icsFile } from "@/lib/calendar";
import { weddingCalendarEvent } from "@/lib/event";

// Pre-rendered to out/wedding.ics at build time (static export).
export const dynamic = "force-static";

export function GET() {
  const body = icsFile(weddingCalendarEvent(), "wedding-2027-01-31@savethesadhya");
  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="gayathri-anand-wedding.ics"',
    },
  });
}
