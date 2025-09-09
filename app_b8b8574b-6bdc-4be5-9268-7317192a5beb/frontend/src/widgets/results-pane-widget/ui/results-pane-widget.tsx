import React from 'react';
import { ShowResultsPane } from '@/features/show-results-pane';
import { cn } from '@/shared/lib/utils';

interface ResultsPaneWidgetProps {
  className?: string;
}

export const ResultsPaneWidget = React.memo<ResultsPaneWidgetProps>(
  ({ className }) => {
    return (
      <div className={cn('border-l bg-background', className)}>
        <ShowResultsPane className="h-full" />
      </div>
    );
  }
);
