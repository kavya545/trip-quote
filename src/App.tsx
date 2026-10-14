import { useTripQuote, type TripQuoteProps } from './model/useTripQuote';
import { Drawer } from './components/Drawer';
import { Hero } from './components/Hero';
import { Planner } from './components/Planner';
import { ReviewView } from './components/ReviewView';
import { RouteStrip } from './components/RouteStrip';
import { SentView } from './components/SentView';
import { Sidebar } from './components/Sidebar';
import { StepBar } from './components/StepBar';
import { Toast } from './components/Toast';
import { TopBar } from './components/TopBar';

export default function App(props: TripQuoteProps) {
  const v = useTripQuote(props);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `${v.navW} minmax(0,1fr)`, transition: 'grid-template-columns .2s ease', minHeight: '100vh', background: '#F2F2F2', color: '#1E1F21', fontFamily: 'Manrope,system-ui,sans-serif' }}>
      <Sidebar open={v.navOpen} padX={v.navPadX} justify={v.navJustify} toggleLabel={v.navToggleLabel} chevron={v.navChevron} onToggle={v.toggleNav} />
      <main style={{ minWidth: 0 }}>
        <TopBar />
        <Hero quoteLabel={v.quoteLabel} perPerson={v.perPerson} totalLine={v.totalLine} />
        <RouteStrip kochi={v.routeKochi} munnar={v.routeMunnar} alleppey={v.routeAlleppey} />
        <StepBar steps={v.steps} />
        <div style={{ padding: 'clamp(28px,4vw,48px) clamp(16px,4vw,40px) 112px', maxWidth: 1520 }}>
          {v.isPlanner && <Planner v={v} />}
          {v.isReview && <ReviewView {...v} />}
          {v.isSent && <SentView {...v} />}
        </div>
      </main>
      {v.hasToast && <Toast msg={v.toastMsg} total={v.toastTotal} onUndo={v.undoToast} onClose={v.closeToast} />}
      {v.drawerOpen && <Drawer {...v} />}
    </div>
  );
}
