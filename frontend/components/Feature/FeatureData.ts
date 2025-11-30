import type { ComponentType, SVGProps } from "react";
import { MessageCircle, Users, Heart } from "lucide-react";

export type MediaType = "image" | "video" | "gif";

export type Feature = {
  id: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: MediaType;
  color: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export const FEATURES: Feature[] = [
  {
    id: "share",
    title: "Share Your Story",
    description:
      "Open up about what you're going through in a safe, anonymous space. No judgement, no pressure—just a place where you can be real about how you're feeling.",
    mediaUrl: "/share-story-video.mp4",
    mediaType: "video",
    color: "blue",
    icon: MessageCircle as ComponentType<SVGProps<SVGSVGElement>>,
  },
  {
    id: "connect",
    title: "Connect with Others",
    description:
      "Read stories from others who've been where you are. Discover you're not alone, and find comfort in shared experiences from guys just like you.",
    mediaUrl: "/connect-video.mp4",
    mediaType: "video",
    color: "purple",
    icon: Users as ComponentType<SVGProps<SVGSVGElement>>,
  },
  {
    id: "support",
    title: "Find Your Way Forward",
    description:
      "Get peer support that feels natural, not clinical. Chat anonymously, explore resources, and take small steps toward feeling better—at your own pace.",
    mediaUrl: "/forward-video.mp4",
    mediaType: "video",
    color: "pink",
    icon: Heart as ComponentType<SVGProps<SVGSVGElement>>,
  },
];
