"use client";

import { useState } from "react";
import type { Feature } from "./FeatureData";
import { FeatureItem } from "./FeatureItem";

type FeatureListProps = {
  features: Feature[];
  onFeatureChange: (featureId: string) => void;
};

export function FeatureList({ features, onFeatureChange }: FeatureListProps) {
  const [activeFeature, setActiveFeature] = useState<string>(features[0].id);

  const handleToggle = (featureId: string) => {
    setActiveFeature(featureId);
    onFeatureChange(featureId);
  };

  return (
    <div className="flex flex-col gap-4">
      {features.map((feature) => (
        <FeatureItem
          feature={feature}
          isActive={activeFeature === feature.id}
          key={feature.id}
          onToggle={() => handleToggle(feature.id)}
        />
      ))}
    </div>
  );
}
