"use client";

import { IdemsFeed } from "./IdemsFeed";
import { IdemForm } from "./IdemForm";

const enableForm = process.env.NEXT_PUBLIC_ENABLE_IDEM_FORM === "true";
const showSeededIdems = process.env.NEXT_PUBLIC_SHOW_SEEDED_IDEMS === "true";

export function FeedContainer() {
  return (
    <>
      {enableForm && <IdemForm />}
      <IdemsFeed includeSeeded={showSeededIdems} />
    </>
  );
}
