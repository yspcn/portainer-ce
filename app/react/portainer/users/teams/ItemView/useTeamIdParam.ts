import { useCurrentStateAndParams } from '@uirouter/react';

export function useTeamIdParam() {
  const {
    params: { id: teamIdParam },
  } = useCurrentStateAndParams();
  const teamId = parseInt(teamIdParam, 10);

  if (!teamIdParam || Number.isNaN(teamId)) {
    throw new Error('缺少团队 ID');
  }

  return teamId;
}
