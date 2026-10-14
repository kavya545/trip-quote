import type { SaveMode } from '../api/progressApi';
import type { Progress } from '../api/schema';
import { useAutosave } from '../api/useAutosave';
import type { TripData } from '../model/data';
import { useTripQuote, type TripQuoteProps } from '../model/useTripQuote';
import { SaveStatus } from './SaveStatus';
import { Drawer } from './Drawer';
import { Hero } from './Hero';
import { Planner } from './Planner';
import { ReviewView } from './ReviewView';
import { RouteStrip } from './RouteStrip';
import { SentView } from './SentView';
import { StepBar } from './StepBar';
import { Toast } from './Toast';
import { TopBar } from './TopBar';
import { color } from '../tokens';

/** The loaded quotation: itinerary, review and sent screens, plus the toast and side panels. */
interface Props extends TripQuoteProps { data: TripData; quoteId: string; progress: Progress; saveMode: SaveMode }

export function TripQuote({ data, quoteId, progress, saveMode, ...props }: Props) {
  const autosave = useAutosave(quoteId, saveMode);
  const v = useTripQuote(data, props, { quoteId, saveMode, progress, autosave });
  const t = v.trip;
  return <>
    <main style={{ minWidth: 0 }}>
      <TopBar agent={v.agent} validUntil={t.validUntil} daysLeft={v.daysLeft} user={t.user} />
      <Hero trip={t} quoteLabel={v.quoteLabel} perPerson={v.perPerson} totalLine={v.totalLine} />
      <RouteStrip route={v.route} homeCity={t.homeCity} startDay={t.startDay} endDay={t.endDay} />
      <StepBar steps={v.steps} />
      <div className="trip-content" style={{ position: 'relative', padding: 'clamp(28px,4vw,48px) clamp(16px,4vw,40px) 112px' }}>
        {v.isPlanner && <Planner v={v} />}
        {v.isReview && <ReviewView {...v} />}
        {v.isSent && <SentView {...v} />}
        {/* Sits inside the existing bottom padding so the page keeps its height. */}
        <footer style={{ position: 'absolute', left: 0, right: 0, bottom: 40, textAlign: 'center', fontSize: '0.875rem' }}>
          <a href="assets/a/credits.txt" target="_blank" rel="noopener" style={{ color: color.textSecondary }}>Photo credits</a>
        </footer>
      </div>
    </main>
    {v.hasToast && <Toast msg={v.toastMsg} total={v.toastTotal} onUndo={v.undoToast} onClose={v.closeToast} />}
    {v.drawerOpen && <Drawer {...v} />}
    <SaveStatus status={autosave.status} onRetry={autosave.retry} />
  </>;
}
