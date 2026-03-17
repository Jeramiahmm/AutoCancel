import { z } from "zod";
import { handleApiError, ok } from "@/src/lib/api";
import { log } from "@/src/server/security/logger";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().email(),
  company: z.string().trim().max(120).optional(),
  message: z.string().trim().min(10).max(2000),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = contactSchema.parse(body);

    log("info", "Contact request received", {
      name: input.name,
      email: input.email,
      company: input.company,
      messagePreview: input.message.slice(0, 180),
    });

    return ok({ received: true });
  } catch (error) {
    return handleApiError(error);
  }
}
