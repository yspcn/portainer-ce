import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';

import { VariableDefinition } from '../CustomTemplatesVariablesDefinitionField/CustomTemplatesVariablesDefinitionField';

export function VariableFieldItem({
  definition,
  error,
  onChange,
  value,
}: {
  definition: VariableDefinition;
  error?: string;
  onChange: (value: string) => void;
  value?: string;
}) {
  const inputId = `${definition.name}-input`;

  return (
    <FormControl
      required={!definition.defaultValue}
      label={definition.label}
      key={definition.name}
      inputId={inputId}
      tooltip={definition.description}
      size="small"
      errors={error}
    >
      <Input
        name={`variables.${definition.name}`}
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`请输入值，或留空以使用默认值 ${definition.defaultValue}`}
      />
    </FormControl>
  );
}
