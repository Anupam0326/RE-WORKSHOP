/**
 * Dots, arrows and the pause button for a photo strip (hooks/useCarousel.ts). The dots show which photo is on screen
 * and how many there are; each is a button with a 44px touch area around a small mark. The pause button appears only
 * where the strip turns by itself, so anyone can stop it (and start it again).
 */

import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

type Props = {
  count: number;
  active: number;
  onSelect: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  /** Present only when the strip can turn by itself. */
  playing?: boolean;
  onToggle?: () => void;
  /** What the photos are, for screen readers: "Photos of Re Workshop". */
  label: string;
  className?: string;
};

export function CarouselControls({ count, active, onSelect, onPrevious, onNext, playing, onToggle, label, className }: Props) {
  if (count < 2) return null;
  return (
    <div className={className ? `strip-ctl ${className}` : "strip-ctl"} role="group" aria-label={label}>
      <button type="button" className="strip-ctl__arrow" onClick={onPrevious} aria-label="Previous photo">
        <ChevronLeft size={20} aria-hidden="true" />
      </button>
      <div className="strip-ctl__dots">
        {Array.from({ length: count }, (_, index) => (
          <button key={index} type="button" className={index === active ? "strip-ctl__dot is-active" : "strip-ctl__dot"} onClick={() => onSelect(index)} aria-label={`Photo ${index + 1} of ${count}`} aria-current={index === active ? "true" : undefined} />
        ))}
      </div>
      <button type="button" className="strip-ctl__arrow" onClick={onNext} aria-label="Next photo">
        <ChevronRight size={20} aria-hidden="true" />
      </button>
      {onToggle && (
        <button type="button" className="strip-ctl__arrow strip-ctl__play" onClick={onToggle} aria-label={playing ? "Pause the photos" : "Play the photos"} aria-pressed={!playing}>
          {playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
        </button>
      )}
    </div>
  );
}
