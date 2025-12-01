"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { FEATURES } from "./FeatureData";
import { FeatureHeader } from "./FeatureHeader";
import { FeatureImage } from "./FeatureImage";
import { FeatureList } from "./FeatureList";

export default function Feature() {
  const [selectedFeature, setSelectedFeature] = useState(FEATURES[0]);

  const handleFeatureChange = (featureId: string) => {
    const feature = FEATURES.find((f) => f.id === featureId);
    if (feature) {
      setSelectedFeature(feature);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative mx-auto flex w-full max-w-7xl flex-col px-6 pt-12 pb-24 sm:pt-16 sm:pb-32"
    >
      <FeatureHeader />

      <div className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left side: Feature Media */}
        <div className="relative h-[400px] w-full lg:h-[500px]">
          <FeatureImage
            alt={selectedFeature.title}
            mediaType={selectedFeature.mediaType}
            src={selectedFeature.mediaUrl}
          />
        </div>

        {/* Right side: Feature List */}
        <div className="flex flex-col justify-center">
          <FeatureList
            features={FEATURES}
            onFeatureChange={handleFeatureChange}
          />
        </div>
      </div>
    </motion.section>
  );
}
