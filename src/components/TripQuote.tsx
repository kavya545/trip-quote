import type { TripData } from '../model/data';
import { useTripQuote, type TripQuoteProps } from '../model/useTripQuote';
import { Drawer } from './Drawer';
import { Hero } from './Hero';
import { Planner } from './Planner';
import { ReviewView } from './ReviewView';
import { RouteStrip } from './RouteStrip';
import { SentView } from './SentView';
import { StepBar } from './StepBar';
import { Toast } from './Toast';
import { TopBar } from './TopBar';

/** The loaded quotation: itinerary, review and sent screens, plus the toast and side panels. */
export function TripQuote({ data, ...props }: TripQuoteProps & { data: TripData }) {
  const v = useTripQuote(data, props);
  const t = v.trip;
  return <>
    <main style={{ minWidth: 0 }}>
      <TopBar agent={v.agent} validUntil={t.validUntil} daysLeft={v.daysLeft} user={t.user} />
      <Hero trip={t} quoteLabel={v.quoteLabel} perPerson={v.perPerson} totalLine={v.totalLine} />
      <RouteStrip route={v.route} homeCity={t.homeCity} startDay={t.startDay} endDay={t.endDay} />
      <StepBar steps={v.steps} />
      <div className="trip-content" style={{ padding: 'clamp(28px,4vw,48px) clamp(16px,4vw,40px) 112px' }}>
        {v.isPlanner && <Planner v={v} />}
        {v.isReview && <ReviewView {...v} />}
        {v.isSent && <SentView {...v} />}
      </div>
    </main>
    {v.hasToast && <Toast msg={v.toastMsg} total={v.toastTotal} onUndo={v.undoToast} onClose={v.closeToast} />}
    {v.drawerOpen && <Drawer {...v} />}
  </>;
}
