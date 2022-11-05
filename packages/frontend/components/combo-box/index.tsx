import {
  Autocomplete,
  TextField,
  createFilterOptions,
  type AutocompleteRenderInputParams,
  type AutocompleteProps,
  type SxProps,
  type Theme,
} from '@mui/material';
import { useCallback, type PropsWithChildren, type ReactElement } from 'react';

interface Option {
  name: string;
  showName: string;
}

interface ComboBoxProps<T extends Option = Option> {
  onSelect?: (option: T | null) => void;
  option: T | null;
  options: T[];
  sx?: SxProps<Theme>;
}

const Input = (params: AutocompleteRenderInputParams) => {
  return (
    <TextField
      {...params}
      InputLabelProps={{
        ...params.InputLabelProps,
        className: params.InputLabelProps.className || '',
        style: params.InputLabelProps.style || {},
      }}
      size={'small'}
      variant={'outlined'}
    />
  );
};

const ComboBox = <T extends Option>(
  props: PropsWithChildren<ComboBoxProps<T>>,
): ReactElement => {
  const { onSelect, option, options, sx } = props;

  const filterOptions = createFilterOptions<T>({
    stringify: ({ name, showName }) => `${name} ${showName}`,
  });
  const getOptionLabel = (option: T) => option.showName;
  const handleRootChange = useCallback<
    NonNullable<
      AutocompleteProps<T, undefined, undefined, undefined>['onChange']
    >
  >(
    (event, value, reason) => {
      if (reason === 'selectOption' && onSelect) onSelect(value);
    },
    [onSelect],
  );

  return (
    <Autocomplete
      filterOptions={filterOptions}
      fullWidth
      getOptionLabel={getOptionLabel}
      onChange={handleRootChange}
      options={options}
      renderInput={Input}
      size={'small'}
      sx={{ ...sx }}
      value={option}
    />
  );
};

export default ComboBox;
