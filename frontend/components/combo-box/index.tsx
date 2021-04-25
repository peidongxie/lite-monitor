import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete, {
  AutocompleteChangeReason,
  AutocompleteRenderInputParams,
  createFilterOptions,
} from '@material-ui/lab/Autocomplete';
import clsx from 'clsx';
import { ChangeEvent, PropsWithChildren, useCallback } from 'react';

interface Option {
  name: string;
  showName: string;
}

interface ComboBoxProps<T extends Option = Option> {
  className?: string;
  onSelect?: (option: T) => void;
  option: T | null;
  options: T[];
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0, 1),
    width: 256,
    marginLeft: theme.spacing(4),
  },
}));

const filterOptions = createFilterOptions<Option>({
  stringify: ({ name, showName }) => `${name} ${showName}`,
});

const getOptionLabel = (option: Option) => option.showName;

const Input = (params: AutocompleteRenderInputParams) => {
  return <TextField {...params} variant={'outlined'} />;
};

const ComboBox = <T extends Option>(
  props: PropsWithChildren<ComboBoxProps<T>>,
) => {
  const { className, onSelect, option, options } = props;
  const classes = useStyles();

  const handleRootChange = useCallback(
    (event: ChangeEvent, value: T, reason: AutocompleteChangeReason) => {
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
      value={option}
      size={'small'}
    />
  );
};

export default ComboBox;
