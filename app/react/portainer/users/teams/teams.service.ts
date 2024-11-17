import axios, { parseAxiosError } from '@/portainer/services/axios';
import { type UserId } from '@/portainer/users/types';

import { createTeamMembership } from './team-membership.service';
import { Team, TeamId, TeamMembership, TeamRole } from './types';

export async function getTeams(onlyLedTeams = false, environmentId = 0) {
  try {
    const { data } = await axios.get<Team[]>(buildUrl(), {
      params: { onlyLedTeams, environmentId },
    });
    return data;
  } catch (error) {
    throw parseAxiosError(error as Error);
  }
}

export async function getTeam(id: TeamId) {
  try {
    const { data } = await axios.get<Team>(buildUrl(id));
    return data;
  } catch (error) {
    throw parseAxiosError(error as Error);
  }
}

export async function deleteTeam(id: TeamId) {
  try {
    await axios.delete(buildUrl(id));
  } catch (error) {
    throw parseAxiosError(error as Error);
  }
}

export async function createTeam(name: string, leaders: UserId[]) {
  try {
    const { data: team } = await axios.post(buildUrl(), { name });
    await Promise.all(
      leaders.map((leaderId) =>
        createTeamMembership(leaderId, team.Id, TeamRole.Leader)
      )
    );
  } catch (e) {
    throw parseAxiosError(e as Error, '无法创建团队');
  }
}

export async function getTeamMemberships(teamId: TeamId) {
  try {
    const { data } = await axios.get<TeamMembership[]>(
      buildUrl(teamId, 'memberships')
    );
    return data;
  } catch (e) {
    throw parseAxiosError(e as Error, '无法获取团队成员资格');
  }
}

function buildUrl(id?: TeamId, action?: string) {
  let url = '/teams';

  if (id) {
    url += `/${id}`;
  }

  if (action) {
    url += `/${action}`;
  }

  return url;
}
