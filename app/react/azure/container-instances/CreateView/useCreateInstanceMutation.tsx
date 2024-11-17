import { useMutation, useQueryClient } from 'react-query';

import { createContainerGroup } from '@/react/azure/services/container-groups.service';
import { queryKeys } from '@/react/azure/queries/query-keys';
import { EnvironmentId } from '@/react/portainer/environments/types';
import PortainerError from '@/portainer/error';
import {
  ContainerGroup,
  ContainerInstanceFormValues,
  ResourceGroup,
} from '@/react/azure/types';
import { applyResourceControl } from '@/react/portainer/access-control/access-control.service';

import { getSubscriptionResourceGroups } from './utils';

export function useCreateInstanceMutation(
  resourceGroups: {
    [k: string]: ResourceGroup[];
  },
  environmentId: EnvironmentId
) {
  const queryClient = useQueryClient();
  return useMutation<ContainerGroup, unknown, ContainerInstanceFormValues>(
    (values) => {
      if (!values.subscription) {
        throw new PortainerError('订阅是必需的');
      }

      const subscriptionResourceGroup = getSubscriptionResourceGroups(
        values.subscription,
        resourceGroups
      );
      const resourceGroup = subscriptionResourceGroup.find(
        (r) => r.value === values.resourceGroup
      );
      if (!resourceGroup) {
        throw new PortainerError('未找到资源组');
      }

      return createContainerGroup(
        values,
        environmentId,
        values.subscription,
        resourceGroup.label
      );
    },
    {
      async onSuccess(containerGroup, values) {
        const resourceControl = containerGroup.Portainer?.ResourceControl;
        if (!resourceControl) {
          throw new PortainerError('创建后需要资源控制');
        }

        const accessControlData = values.accessControl;
        await applyResourceControl(accessControlData, resourceControl.Id);
        return queryClient.invalidateQueries(
          queryKeys.subscriptions(environmentId)
        );
      },
    }
  );
}
