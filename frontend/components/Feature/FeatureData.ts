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
  icon: ComponentType<SVGProps<SVGSVGElement>> | string;
};

export const FEATURES: Feature[] = [
  {
    id: "share",
    title: "write your story",
    description:
      "share your story as a mentor to help others. or, add to your diary to reflect on your own journey privately.",
    mediaUrl: "/share-story-video.mp4",
    mediaType: "video",
    color: "blue",
    icon: "/rolledscroll.svg",
  },
  {
    id: "connect",
    title: "connect with others",
    description:
      "chat with our owl to read stories from people who have been there. find mentors who understand your journey.",
    mediaUrl: "/connect-video.mp4",
    mediaType: "video",
    color: "purple",
    icon: "/owlaitransparent.svg",
  },
  {
    id: "support",
    title: "find your way forward",
    description:
      "through reflection and connnection, discover new perspectives and paths to genuine growth.",
    mediaUrl: "/forward-video.mp4",
    mediaType: "video",
    color: "pink",
    icon: "/pathwithfootsteps.svg",
  },
];
