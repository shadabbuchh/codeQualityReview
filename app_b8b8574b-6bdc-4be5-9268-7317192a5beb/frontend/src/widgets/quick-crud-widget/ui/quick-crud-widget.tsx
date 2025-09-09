import React from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';
import { Plus, Eye, Edit, Trash2, Database } from 'lucide-react';
import {
  useTableById,
  useCrudTemplates,
  useTableStore,
} from '@/entities/table';
import { useRequestDraftStore } from '@/entities/request-draft';
import type { paths } from '@app/shared/generated-types';

interface QuickCrudWidgetProps {
  className?: string;
}

type CrudTemplates =
  paths['/tables/{id}/crud-templates']['get']['responses'][200]['content']['application/json'];

const crudButtons = [
  {
    key: 'create',
    label: 'Create',
    icon: Plus,
    color: 'bg-green-100 text-green-700 hover:bg-green-200',
    description: 'Insert new record',
  },
  {
    key: 'read',
    label: 'Read',
    icon: Eye,
    color: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    description: 'Select records',
  },
  {
    key: 'update',
    label: 'Update',
    icon: Edit,
    color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
    description: 'Modify existing records',
  },
  {
    key: 'delete',
    label: 'Delete',
    icon: Trash2,
    color: 'bg-red-100 text-red-700 hover:bg-red-200',
    description: 'Remove records',
  },
] as const;

export const QuickCrudWidget = React.memo<QuickCrudWidgetProps>(
  ({ className }) => {
    const selectedTableId = useTableStore(state => state.selectedTableId);
    const { data: table } = useTableById(selectedTableId || '');
    const { data: crudTemplates, isLoading: templatesLoading } =
      useCrudTemplates(selectedTableId || '');
    const createDraft = useRequestDraftStore(state => state.createDraft);
    const setCurrentDraftId = useRequestDraftStore(
      state => state.setCurrentDraftId
    );

    const handleCrudAction = React.useCallback(
      (action: keyof CrudTemplates, template: string) => {
        if (!selectedTableId || !table) return;

        // Create a new SQL draft with the template
        const draftId = createDraft({
          connectionId: '', // This should come from the connection store - will be handled by EditorTabsWidget
          type: 'sql',
          title: `${action.toUpperCase()} ${table.name}`,
          content: template,
        });

        setCurrentDraftId(draftId);
      },
      [selectedTableId, table, createDraft, setCurrentDraftId]
    );

    if (!selectedTableId) {
      return (
        <Card className={className}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Database className="h-4 w-4" />
              Quick CRUD
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Database className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Select a table to see CRUD shortcuts
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (!table) {
      return (
        <Card className={className}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Database className="h-4 w-4" />
              Quick CRUD
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                Loading table information...
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Database className="h-4 w-4" />
            Quick CRUD for {table.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {crudButtons.map(button => {
              const Icon = button.icon;
              const template = crudTemplates?.[button.key];
              const isDisabled = templatesLoading || !template;

              return (
                <Button
                  key={button.key}
                  variant="ghost"
                  disabled={isDisabled}
                  className={`h-auto p-3 flex flex-col items-center gap-2 ${button.color} ${
                    isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() =>
                    template && handleCrudAction(button.key, template)
                  }
                >
                  <Icon className="h-4 w-4" />
                  <div className="text-center">
                    <div className="text-xs font-medium">{button.label}</div>
                    <div className="text-xs opacity-80">
                      {button.description}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>

          {templatesLoading && (
            <div className="mt-3 text-xs text-center text-muted-foreground">
              Loading templates...
            </div>
          )}

          <div className="mt-3 text-xs text-muted-foreground">
            <p>
              Click any button to prefill the editor with a {table.name}{' '}
              template.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
);
