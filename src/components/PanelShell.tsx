import { type ReactNode } from 'react';

interface PanelShellProps {
  children: ReactNode;
  tabKey: string;
}

/** Animated panel wrapper for tab transitions. */
export function PanelShell({ children, tabKey }: PanelShellProps) {
  return (
    <div key={tabKey} className="panel-shell">
      {children}
    </div>
  );
}
