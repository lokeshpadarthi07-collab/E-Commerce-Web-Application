import React from 'react';
import { CheckCircle2, Clock, Truck, PackageCheck, Home } from 'lucide-react';

export const OrderTimeline = ({ status = 'Processing' }) => {
  const steps = [
    { label: 'Order Confirmed', icon: CheckCircle2, stage: 1 },
    { label: 'Processing', icon: Clock, stage: 2 },
    { label: 'Shipped', icon: Truck, stage: 3 },
    { label: 'Out for Delivery', icon: PackageCheck, stage: 4 },
    { label: 'Delivered', icon: Home, stage: 5 }
  ];

  let currentStage = 2;
  if (status === 'Shipped') currentStage = 3;
  if (status === 'Out for Delivery') currentStage = 4;
  if (status === 'Delivered') currentStage = 5;

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-0 h-1 bg-indigo-600 -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: `${((currentStage - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const Icon = step.icon;
          const isCompleted = step.stage <= currentStage;
          const isCurrent = step.stage === currentStage;

          return (
            <div key={step.stage} className="relative z-10 flex flex-col items-center gap-1.5 group">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                  isCompleted
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-4 ring-white'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                } ${isCurrent ? 'scale-110 ring-4 ring-indigo-100' : ''}`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={`text-[11px] font-extrabold tracking-tight text-center hidden sm:block ${
                  isCompleted ? 'text-indigo-950' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
