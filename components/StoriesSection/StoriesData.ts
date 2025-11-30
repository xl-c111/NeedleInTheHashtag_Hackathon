export interface Story {
  id: string;
  title: string;
  preview: string;
  tags: string[];
}

export const stories: Story[] = [
  {
    id: "1",
    title: "I used to blame everyone else",
    preview:
      "For years I thought the world was against me. The turning point came when I realised I was pushing people away...",
    tags: ["loneliness", "growth"],
  },
  {
    id: "2",
    title: "The gym didn't fix me, but it helped",
    preview:
      "Everyone says 'just go to the gym' like it solves everything. It doesn't. But what it gave me was...",
    tags: ["self-esteem", "small-wins"],
  },
  {
    id: "3",
    title: "She wasn't the answer",
    preview:
      "I thought if I just got a girlfriend, everything would be fixed. When I stopped treating relationships as a solution...",
    tags: ["dating", "growth"],
  },
];
