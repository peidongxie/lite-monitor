import TextField from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';
import Autocomplete, {
  type AutocompleteRenderInputParams,
  type createFilterOptions,
  type AutocompleteProps,
} from '@mui/material/Autocomplete';
import clsx from 'clsx';
import { PropsWithChildren, ReactElement, useCallback } from 'react';

interface Option {
  name: string;
  showName: string;
}

interface ComboBoxProps<T extends Option = Option> {
  className?: string;
  onSelect?: (option: T | null) => void;
  option: T | null;
  options: T[];
}

const useStyles = makeStyles(() => ({
  root: {},
}));

const Input = (props: AutocompleteRenderInputParams) => {
  return <TextField {...props} size={'small'} variant={'outlined'} />;
};

const ComboBox = <T extends Option>(
  props: PropsWithChildren<ComboBoxProps<T>>,
): ReactElement => {
  const { className, onSelect, option, options } = props;
  const classes = useStyles();

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
      if (reason === 'select-option' && onSelect) onSelect(value);
    },
    [onSelect],
  );

  return (
    <Autocomplete
      className={clsx(classes.root, className)}
      filterOptions={filterOptions}
      fullWidth
      getOptionLabel={getOptionLabel}
      onChange={handleRootChange}
      options={options}
      renderInput={Input}
      size={'small'}
      value={option}
    />
  );
};

export default ComboBox;
