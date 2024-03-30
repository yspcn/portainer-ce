import { Layout } from 'lucide-react';

import { EnvironmentId } from '@/react/portainer/environments/types';
import { AutomationTestingProps } from '@/types';

import { SidebarItem } from '../SidebarItem';

interface Props extends AutomationTestingProps {
  environmentId: EnvironmentId;
  platformPath: string;
}

export function DashboardLink({
  environmentId,
  platformPath,
  'data-cy': dataCy,
}: Props) {
  return (
    <SidebarItem
      to={`${platformPath}.dashboard`}
      params={{ endpointId: environmentId }}
      icon={Layout}
      label="仪表盘"
      data-cy={dataCy}
    />
  );
}
