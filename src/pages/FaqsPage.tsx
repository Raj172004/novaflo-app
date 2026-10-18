import { PageHero } from '@/components/PageHero';
import { Accordion } from '@/components/Accordion';
import { Reveal } from '@/components/Reveal';
import { FAQS } from '@/data/content';

export function FaqsPage() {
  return (
    <div>
      <PageHero
        eyebrow="FAQs"
        title="Questions,"
        highlight="answered honestly."
        description="The things business owners most often ask before working with us. If your question is not here, ask on your growth call."
      />
      <section className="pb-24">
        <div className="container-page max-w-3xl">
          <Reveal>
            <Accordion items={FAQS} />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
