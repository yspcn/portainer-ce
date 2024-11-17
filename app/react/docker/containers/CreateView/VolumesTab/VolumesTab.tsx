import { InputList } from '@@/form-components/InputList';
import { ArrayError } from '@@/form-components/InputList/InputList';

import { Values, Volume } from './types';
import { InputContext } from './context';
import { Item } from './Item';

export function VolumesTab({
  onChange,
  values,
  allowBindMounts,
  errors,
}: {
  onChange: (values: Values) => void;
  values: Values;
  allowBindMounts: boolean;
  errors?: ArrayError<Values>;
}) {
  return (
    <InputContext.Provider value={allowBindMounts}>
      <InputList<Volume>
        errors={Array.isArray(errors) ? errors : []}
        label="存储卷映射"
        onChange={(volumes) => handleChange(volumes)}
        value={values}
        addLabel="映射额外的存储卷"
        item={Item}
        itemBuilder={() => ({
          containerPath: '',
          type: 'volume',
          name: '',
          readOnly: false,
        })}
      />
    </InputContext.Provider>
  );

  function handleChange(newValues: Values) {
    onChange(newValues);
  }
}
