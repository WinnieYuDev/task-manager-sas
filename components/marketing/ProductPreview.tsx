"use client";

import { motion } from "framer-motion";
import { InteractiveTaskListMock } from "@/components/marketing/InteractiveTaskListMock";

export function ProductPreview() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-3xl font-bold"
        >
          See it in action
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-4 max-w-2xl text-center text-[var(--muted)]"
        >
          A clean, fast interface that gets out of your way.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-12 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-glass"
        >
          <div className="aspect-video rounded-xl overflow-hidden">
            <InteractiveTaskListMock />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
