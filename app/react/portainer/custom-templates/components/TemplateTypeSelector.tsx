import { StackType } from '@/react/common/stacks/types';

import { FormControl } from '@@/form-components/FormControl';
import { Select } from '@@/form-components/Input';

const typeOptions = [
  { label: 'Swarm', value: StackType.DockerSwarm },
  { label: 'Standalone', value: StackType.DockerCompose },
];

export function TemplateTypeSelector({
  onChange,
  value,
}: {
  onChange: (type: StackType) => void;
  value: StackType;
}) {
  return (
    <FormControl label="类型" required inputId="template-type">
      <Select
        name="type"
        id="template-type"
        required
        options={typeOptions}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
      />
    </FormControl>
  );
}
