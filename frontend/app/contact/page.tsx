"use client";

import { useState } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { SectionHeading } from "@/components/ui/section-heading";
import { SectionReveal } from "@/components/ui/section-reveal";
import { API_ROUTES } from "@/lib/api";
import { useToastStore } from "@/lib/store/toast-store";

type ContactForm = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

const initialForm: ContactForm = {
  name: "",
  email: "",
  phone: "",
  message: ""
};

export default function ContactPage() {
  const pushToast = useToastStore((state) => state.pushToast);

  const [form, setForm] = useState<ContactForm>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
  const phoneValid = /^(?:\+92|0)3\d{9}$/.test(form.phone.replace(/[\s-]/g, ""));

  const errors = {
    name: submitted && form.name.trim().length < 3,
    email: submitted && !emailValid,
    phone: submitted && !phoneValid,
    message: submitted && form.message.trim().length < 10
  };

  const hasErrors = Object.values(errors).some(Boolean);

  const onChange = (field: keyof ContactForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setSubmitted(true);

    if (hasErrors) {
      pushToast("Please complete the contact form correctly.", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_ROUTES.contact, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          message: form.message.trim()
        })
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "Unable to submit contact form.");
      }

      setForm(initialForm);
      setSubmitted(false);
      pushToast("Message sent successfully.", "success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to send message.";
      pushToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-space">
      <div className="ui-container">
        <SectionReveal>
          <SectionHeading
            eyebrow="Contact"
            title="Talk to UmarAsia-Appliances"
            description="For product guidance, category recommendations, and order support, reach out directly through phone or message form."
          />
        </SectionReveal>

        <div className="grid gap-6 lg:grid-cols-12">
          <SectionReveal className="lg:col-span-5">
            <div className="card-surface h-full rounded-[22px] p-6">
              <h2 className="font-heading text-xl font-bold text-slate-900">Contact Details</h2>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-slate-800">Contact Person:</span> Umair Nazeer
                </p>
                <p>
                  <span className="font-semibold text-slate-800">Phone:</span> +92-317-3725024
                </p>
                <p>
                  <span className="font-semibold text-slate-800">Region:</span> Pakistan
                </p>
                <p>
                  <span className="font-semibold text-slate-800">Support Hours:</span> Monday to Saturday, 10:00 AM to
                  7:00 PM
                </p>
              </div>
            </div>
          </SectionReveal>

          <SectionReveal className="lg:col-span-7">
            <form className="card-surface space-y-4 rounded-[22px] p-6" onSubmit={(e) => e.preventDefault()}>
              <h2 className="font-heading text-xl font-bold text-slate-900">Send a Message</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="floating-group">
                  <input
                    className={`floating-input ${errors.name ? "floating-error" : ""}`}
                    type="text"
                    placeholder=" "
                    value={form.name}
                    onChange={(e) => onChange("name", e.target.value)}
                  />
                  <label className="floating-label">Name *</label>
                </div>
                <div className="floating-group">
                  <input
                    className={`floating-input ${errors.phone ? "floating-error" : ""}`}
                    type="tel"
                    placeholder=" "
                    value={form.phone}
                    onChange={(e) => onChange("phone", e.target.value)}
                  />
                  <label className="floating-label">Phone *</label>
                </div>
              </div>

              <div className="floating-group">
                <input
                  className={`floating-input ${errors.email ? "floating-error" : ""}`}
                  type="email"
                  placeholder=" "
                  value={form.email}
                  onChange={(e) => onChange("email", e.target.value)}
                />
                <label className="floating-label">Email *</label>
              </div>

              <div className="floating-group">
                <textarea
                  className={`floating-textarea min-h-[130px] ${errors.message ? "floating-error" : ""}`}
                  rows={5}
                  placeholder=" "
                  value={form.message}
                  onChange={(e) => onChange("message", e.target.value)}
                />
                <label className="floating-label">Message *</label>
              </div>

              <button className="btn-primary" type="button" onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <LoadingSpinner /> Sending
                  </span>
                ) : (
                  "Send Inquiry"
                )}
              </button>
            </form>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}

