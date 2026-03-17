"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DetectionQueueItem = {
  id: string;
  subject: string;
  confidence: number;
  extractionJson: unknown;
};

export function ReviewQueue({ detections }: { detections: DetectionQueueItem[] }) {
  const [items, setItems] = useState(detections);
  const [pending, setPending] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  async function parseApiResponse(response: Response) {
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        typeof payload === "object" &&
        payload !== null &&
        "error" in payload &&
        typeof payload.error === "string"
          ? payload.error
          : `Request failed (${response.status})`;
      throw new Error(message);
    }
  }

  async function review(id: string, action: "approve" | "reject") {
    setPending(id);
    setNotice("");
    try {
      await parseApiResponse(
        await fetch(`/api/detections/${id}/${action}`, {
          method: "POST",
        }),
      );
      setItems((prev) => prev.filter((item) => item.id !== id));
      setNotice(action === "approve" ? "Detection approved and trial added." : "Detection rejected.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to update detection.");
    } finally {
      setPending(null);
    }
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>Detection review queue</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {notice ? <div className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-900">{notice}</div> : null}
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No pending detections.</p>
        ) : (
          items.map((item) => {
            const extraction = item.extractionJson as {
              serviceName?: string;
              billingDate?: string;
              subscriptionCost?: number;
            };

            return (
              <div key={item.id} className="rounded-xl border border-white/15 bg-white/[0.04] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">{extraction.serviceName ?? item.subject}</p>
                    <p className="text-xs text-white/65">{item.subject}</p>
                    <p className="mt-1 text-sm text-white/70">
                      Billing: {extraction.billingDate ? new Date(extraction.billingDate).toLocaleDateString() : "Unknown"}
                      {extraction.subscriptionCost ? ` | $${extraction.subscriptionCost}` : ""}
                    </p>
                  </div>
                  <p className="text-xs text-white/70">Confidence {Math.round(item.confidence * 100)}%</p>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" onClick={() => review(item.id, "approve")} disabled={pending === item.id}>
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => review(item.id, "reject")}
                    disabled={pending === item.id}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
