import { HomepageFilter } from '@/react/portainer/HomeView/EnvironmentList/HomepageFilter';
import { useGroups } from '@/react/portainer/environments/environment-groups/queries';
import { useEdgeGroups } from '@/react/edge/edge-groups/queries/useEdgeGroups';
import { useTags } from '@/portainer/tags/queries';

import { PortainerSelect } from '@@/form-components/PortainerSelect';

import { useFilterStore } from './filter-store';

const checkInOptions = [
  { value: 0, label: '显示全部时间' },
  { value: 60 * 60, label: '显示过去一小时' },
  { value: 60 * 60 * 24, label: '显示过去一天' },
  { value: 60 * 60 * 24 * 7, label: '显示过去一周' },
  { value: 60 * 60 * 24 * 14, label: '显示过去14天' },
];

export function Filter() {
  const edgeGroupsQuery = useEdgeGroups();
  const groupsQuery = useGroups();
  const tagsQuery = useTags();

  const filterStore = useFilterStore();

  if (!edgeGroupsQuery.data || !groupsQuery.data || !tagsQuery.data) {
    return null;
  }

  return (
    <div className="flex w-full gap-5 [&>*]:w-1/5">
      <HomepageFilter
        onChange={(f) => filterStore.setEdgeGroups(f)}
        placeHolder="Edge groups"
        value={filterStore.edgeGroups}
        filterOptions={edgeGroupsQuery.data.map((g) => ({
          label: g.Name,
          value: g.Id,
        }))}
      />
      <HomepageFilter
        onChange={(f) => filterStore.setGroups(f)}
        placeHolder="Group"
        value={filterStore.groups}
        filterOptions={groupsQuery.data.map((g) => ({
          label: g.Name,
          value: g.Id,
        }))}
      />
      <HomepageFilter
        onChange={(f) => filterStore.setTags(f)}
        placeHolder="Tags"
        value={filterStore.tags}
        filterOptions={tagsQuery.data.map((g) => ({
          label: g.Name,
          value: g.ID,
        }))}
      />

      <div className="ml-auto" />
      <PortainerSelect
        onChange={(f) => filterStore.setCheckIn(f || 0)}
        value={filterStore.checkIn}
        options={checkInOptions}
        bindToBody
      />
    </div>
  );
}
