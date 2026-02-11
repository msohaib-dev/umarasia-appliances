import { SectionHeading } from "../../components/ui/section-heading";
import { SectionReveal } from "../../components/ui/section-reveal";

export default function AboutPage() {
  return (
    <section className="section-space">
      <div className="ui-container max-w-4xl">
        <SectionReveal>
          <SectionHeading
            eyebrow="About UmarAsia-Appliances"
            title="Engineering-Led Appliances for Pakistanâ€™s Real Power Conditions"
            description="We focus on practical reliability, efficient operation, and long service life for households, shops, workshops, and growing businesses."
          />
        </SectionReveal>

        <SectionReveal delay={0.1} className="card-surface rounded-[24px] p-7 md:p-9">
          <div className="space-y-6 text-base leading-relaxed text-slate-700">
            <p>
              UmarAsia-Appliances was built around a simple approach: electrical appliances should perform reliably in
              Pakistanâ€™s day-to-day reality, not only in ideal lab conditions. Our product lineup is selected for stable
              operation during load-shedding cycles, compatibility with backup systems, and practical long-term use.
            </p>
            <p>
              We serve practical buyers who need dependable results: homeowners managing daily power gaps, shop owners
              running customer-facing operations, workshop teams depending on consistent airflow and motor performance,
              and small businesses that cannot afford frequent equipment failure.
            </p>
            <p>
              Our focus is engineering discipline over marketing noise. That means better material quality, meaningful
              efficiency gains, original copper winding where required, and clear product specifications so buyers can
              choose confidently. As we grow, our goal remains unchanged: provide reliable DC electronics solutions that
              make daily operations easier across Pakistan.
            </p>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}

