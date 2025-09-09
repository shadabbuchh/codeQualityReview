import React from 'react';
import { ConnectionPicker } from '@/features/select-connection';
import {
  EditorTabsWidget,
  ResultsPaneWidget,
  QuickCrudWidget,
} from '@/widgets';
import { Separator } from '@/shared/ui';

export const WorkspacePage = React.memo(() => {
  return (
    <div className="flex h-full">
      {/* Left sidebar - Connection picker and CRUD shortcuts */}
      <div className="w-80 border-r p-6 flex flex-col gap-4">
        <div className="flex-1 min-h-0">
          <ConnectionPicker />
        </div>
        <div className="flex-shrink-0">
          <QuickCrudWidget />
        </div>
      </div>

      <Separator orientation="vertical" />

      {/* Main content area - Request/Query Editor */}
      <div className="flex-1 min-w-0 flex">
        {/* Editor section */}
        <div className="flex-1 min-w-0">
          <EditorTabsWidget className="h-full" />
        </div>

        {/* Results pane */}
        <div className="w-96 min-w-0">
          <ResultsPaneWidget className="h-full" />
        </div>
      </div>
    </div>
  );
});
