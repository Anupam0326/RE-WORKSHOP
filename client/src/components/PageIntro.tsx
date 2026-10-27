/**
 * First screen of the Café and Our story pages: the same pale field as the home hero, a two-tone heading (the quiet
 * line, then the main line), the page's own words, its actions, and one wide site photo. Until the client uploads
 * that photo the slot shows the branded placeholder (the client is sending café, farm and founder photos).
 */

import type { ReactNode } from "react";
import { SiteImage, useSiteMedia } from "@/components/SiteImage";
import type { MediaSlotKey } from "@/data/media";

/** `lead` is a quiet line above the heading (a sentence of the page's own copy); `quiet` opens the heading itself in a muted tone. */
type Props = { lead?: string; quiet?: string; title: string; children?: ReactNode; actions?: ReactNode; photo: MediaSlotKey };

export function PageIntro({ lead, quiet, title, children, actions, photo }: Props) {
  const { caption } = useSiteMedia(photo);
  return (
    <section className="intro" aria-labelledby="page-title">
      <div className="wrap intro__inner">
        <div className="intro__top">
          <h1 id="page-title" className="intro__title">
            {lead && (
              <>
                <span className="intro__lead">{lead}</span>{" "}
              </>
            )}
            <span className="intro__main">
              {quiet && <span className="intro__quiet">{quiet} </span>}
              {title}
            </span>
          </h1>
          <div className="intro__side">
            {children}
            {actions && <div className="intro__actions">{actions}</div>}
          </div>
        </div>
        <figure className="intro__photo">
          <SiteImage slot={photo} sizes="(min-width: 1264px) 1200px, 100vw" eager />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      </div>
    </section>
  );
}
