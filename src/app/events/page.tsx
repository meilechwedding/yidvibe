import { EVENTS_COPY } from "@/content/pages/events";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { listAllEvents } from "@/lib/events";
import { Container } from "@/components/brand/layout";
import { PageHeader } from "@/components/brand/page-header";
import { EmptyState } from "@/components/brand/empty-state";
import { EventsBoard } from "@/components/events/events-board";

export const metadata = EVENTS_COPY.metadata;

export default async function EventsPage() {
  const events = await listAllEvents();

  return (
    <Container className="max-w-4xl py-12 md:py-16">
      <PageHeader
        accent="sage"
        eyebrow={EVENTS_COPY.eyebrow}
        title={EVENTS_COPY.title}
        subtitle={EVENTS_COPY.subtitle}
      />

      {events.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon={<CalendarDays size={22} />}
          title="No events yet"
          description="Hosting a workshop or meetup? Add it so the community can join."
          actionHref="/events/request"
          actionLabel="Request an event"
        />
      ) : (
        <EventsBoard events={events} />
      )}

      <div className="mt-12 rounded-card border border-border bg-surface p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Hosting a workshop or meetup?
        </p>
        <Link href="/events/request" className="btn btn-primary btn-sm mt-3">
          Request to post an event
        </Link>
      </div>
    </Container>
  );
}
