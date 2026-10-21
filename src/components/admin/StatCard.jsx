import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  isLoading = false,
  trend,
}) {
  return (
    <div className="bg-gradient-to-br from-white/5 to-transparent border border-champagne/10 rounded-lg p-6 hover:border-champagne/20 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.3em] text-champagne/60 font-medium mb-2">
            {title}
          </p>
          {isLoading ? (
            <Skeleton className="h-8 w-24 mb-2" />
          ) : (
            <h3 className="text-3xl font-bold text-white font-display mb-2">
              {value}
            </h3>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {trend && (
            <p className={`text-xs mt-2 font-medium ${
              trend.positive ? 'text-green-400' : 'text-red-400'
            }`}>
              {trend.positive ? '↑' : '↓'} {trend.text}
            </p>
          )}
        </div>
        {Icon && (
          <div className="ml-4 p-3 bg-champagne/10 rounded-lg flex-shrink-0">
            <Icon className="w-6 h-6 text-champagne" />
          </div>
        )}
      </div>
    </div>
  );
}
