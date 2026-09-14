/**
 * RSVP API — in-memory stub.
 *
 * Replace the `rsvps` array with your Supabase / Turso / Prisma logic
 * when you're ready to persist data.
 */

export const dynamic = "force-static";

interface RSVP {
  id: string;
  name: string;
  email: string;
  attending: "yes" | "no";
  mealPreference: string;
  plusOnes: number;
  plusOneNames: string[];
  message: string;
  createdAt: string;
}

const rsvps: RSVP[] = [];

export async function GET() {
  return Response.json({ rsvps });
}

export async function POST(request: Request) {
  const body = await request.json();

  const rsvp: RSVP = {
    id: crypto.randomUUID(),
    name: body.name ?? "",
    email: body.email ?? "",
    attending: body.attending ?? "no",
    mealPreference: body.mealPreference ?? "",
    plusOnes: body.plusOnes ?? 0,
    plusOneNames: body.plusOneNames ?? [],
    message: body.message ?? "",
    createdAt: new Date().toISOString(),
  };

  rsvps.push(rsvp);

  return Response.json({ rsvp }, { status: 201 });
}
