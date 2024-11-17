import { createColumnHelper, CellContext } from '@tanstack/react-table';
import { useCurrentStateAndParams } from '@uirouter/react';

import { Link } from '@@/Link';

import { useRepositoryTags } from './useRepositoryTags';
import { Repository } from './types';

const helper = createColumnHelper<Repository>();

export const columns = [
  helper.accessor('Name', {
    header: '仓库',
    cell: NameCell,
  }),
  helper.display({
    header: '标签计数',
    cell: TagsCell,
  }),
];

function useParams() {
  const {
    params: { endpointId, id },
  } = useCurrentStateAndParams();

  const registryId = number(id);

  if (!registryId) {
    throw new Error('缺少注册表ID');
  }

  return {
    environmentId: number(endpointId),
    registryId,
  };
}

function number(value: string | undefined) {
  const num = parseInt(value || '', 10);
  return Number.isNaN(num) ? undefined : num;
}

function NameCell({ getValue }: CellContext<Repository, string>) {
  const { environmentId } = useParams();
  const name = getValue();
  return (
    <Link
      to="portainer.registries.registry.repository"
      params={{ repository: name, endpointId: environmentId }}
      title={name}
    >
      {name}
    </Link>
  );
}

function TagsCell({ row }: CellContext<Repository, unknown>) {
  const { environmentId, registryId } = useParams();

  const tagsQuery = useRepositoryTags({
    environmentId,
    registryId,
    repository: row.original.Name,
  });

  return tagsQuery.data?.tags.length || 0;
}
