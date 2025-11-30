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
                className
            )}
            {...props}
        >
            <div className="p-8">
                <h2 className="text-2xl font-bold text-black tracking-tighter">
                    {title}
                </h2>
                <p className="mt-2 text-sm text-black/80 tracking-tighter">
                    {description}
                </p>
            </div>

            <div className="">
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

    return (
        <motion.div
            className={cn(
                "p-6 cursor-pointer relative group",
                "transition-colors duration-200"
            )}
            onClick={onClick}
            initial={false}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            <div className="flex items-start justify-between gap-4">
                <span
                    className={cn(
                        "text-left text-base font-medium tracking-tighter transition-colors duration-200",
                        "text-black"
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
                            "text-black"
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
                        <p className="text-sm text-black/80 leading-relaxed tracking-tighter">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
