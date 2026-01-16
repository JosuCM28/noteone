"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type StepperProps = {
    steps: string[];
    step: number; // index actual (0-based)
    className?: string;
};

export function Stepper({ steps, step, className }: StepperProps) {
    return (
        <div
            className={cn(
                "flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0",
                className
            )}
        >
            {steps.map((label, i) => {
                const isCompleted = i < step;
                const isActive = i === step;

                return (
                    <div key={`${label}-${i}`} className="flex items-center shrink-0">
                        {/* Circle */}
                        <div
                            className={cn(
                                "step-indicator",
                                isCompleted ? "completed" : isActive ? "active" : "pending"
                            )}
                        >
                            {isCompleted ? (
                                <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                            ) : (
                                i + 1
                            )}
                        </div>

                        {/* Label */}
                        <span
                            className={cn(
                                "ml-1.5 sm:ml-2 text-xs sm:text-sm",
                                isActive ? "font-medium" : "text-muted-foreground"
                            )}
                        >
                            {label}
                        </span>

                        {/* Connector line */}
                        {i < steps.length - 1 && (
                            <div
                                className={cn(
                                    "w-6 sm:w-8 lg:w-16 h-px mx-1 sm:mx-2 shrink-0",
                                    isCompleted ? "bg-accent" : "bg-border"
                                )}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
