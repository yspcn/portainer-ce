import { useMutation, useQueryClient } from 'react-query';

import axios, { parseAxiosError } from '@/portainer/services/axios';
import {
  mutationOptions,
  withError,
  withInvalidate,
} from '@/react-tools/react-query';

import { ExperimentalFeatures } from '../types';
import { buildUrl } from '../settings.service';

import { queryKeys } from './queryKeys';

export function useUpdateExperimentalSettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation(
    updateExperimentalSettings,
    mutationOptions(
      withInvalidate(queryClient, [queryKeys.base()]),
      withError('无法更新实验设置')
    )
  );
}

async function updateExperimentalSettings(
  settings: Partial<ExperimentalFeatures>
) {
  try {
    await axios.put(buildUrl('experimental'), settings);
  } catch (e) {
    throw parseAxiosError(e as Error, '无法更新实验设置');
  }
}
