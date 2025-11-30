"use client";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "next-themes";

interface AccordionItem {
    question: string;
    answer: string;
}

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    description: string;
    items: AccordionItem[];
}

const accentColors = [
    { light: "rgb(240, 249, 255)", dark: "rgb(30, 41, 59)" },
    { light: "rgb(255, 247, 237)", dark: "rgb(41, 37, 36)" },
    { light: "rgb(240, 253, 244)", dark: "rgb(28, 25, 23)" },
    { light: "rgb(254, 242, 242)", dark: "rgb(30, 27, 27)" },
];

export default function Accordion({
    title = "Frequently asked questions",
    description = "Hopefully we can answer all your questions here.",
    items,
    className,
    ...props
}: AccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div
            className={cn(
                "w-full max-w-2xl",
                "bg-white dark:bg-[#1a1a1a]",
                "border border-zinc-200 dark:border-zinc-800/50",
                "ring-1 ring-zinc-100 dark:ring-zinc-800/50",
                "shadow-lg shadow-zinc-200/20 dark:shadow-black/20",
                "rounded-xl",
                "overflow-hidden",
                className
            )}
            {...props}
        >
            <div className="p-8 border-b border-zinc-200 dark:border-zinc-800/50 bg-zinc-50 dark:bg-[#121212]">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tighter">
                    {title}
                </h2>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 tracking-tighter">
                    {description}
                </p>
            </div>

            <div className="divide-y divide-zinc-200 dark:divide-zinc-800/50">
                {items?.map((item, index) => (
                    <AccordionItemComponent
                        key={index}
                        {...item}
                        index={index}
                        isOpen={index === openIndex}
                        onClick={() =>
                            setOpenIndex(index === openIndex ? null : index)
                        }
                    />
                ))}
            </div>
        </div>
    );
}

function AccordionItemComponent({
    question,
    answer,
    index,
    isOpen,
    onClick,
}: AccordionItem & {
    index: number;
    isOpen: boolean;
    onClick: () => void;
}) {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    const colorSet = accentColors[index % accentColors.length];
    const backgroundColor = isOpen
        ? isDark
            ? colorSet.dark
            : colorSet.light
        : "transparent";

    return (
        <motion.div
            className={cn(
                "p-6 cursor-pointer relative group",
                "hover:bg-zinc-50 dark:hover:bg-[#222222]",
                "transition-colors duration-200"
            )}
            onClick={onClick}
            initial={false}
            animate={{
                backgroundColor,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            <div className="flex items-start justify-between gap-4">
                <span
                    className={cn(
                        "text-left text-base font-medium tracking-tighter transition-colors duration-200",
                        "text-zinc-900 dark:text-zinc-100"
                    )}
                >
                    {question}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex-shrink-0 mt-0.5"
                >
                    <ChevronDown
                        className={cn(
                            "w-5 h-5 transition-colors duration-200",
                            "text-zinc-700 dark:text-zinc-300"
                        )}
                    />
                </motion.div>
            </div>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{
                            opacity: 1,
                            height: "auto",
                            marginTop: 16,
                        }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{
                            duration: 0.3,
                            ease: "easeInOut",
                            opacity: { duration: 0.2 },
                        }}
                        className="overflow-hidden"
                    >
                        <p className="text-sm text-zinc-700 dark:text-zinc-400 leading-relaxed tracking-tighter">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
