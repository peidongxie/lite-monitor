import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete, {
  AutocompleteChangeReason,
  AutocompleteRenderInputParams,
  createFilterOptions,
} from '@material-ui/lab/Autocomplete';
import { useRouter } from 'next/router';
import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import { jsonFetcher } from '../../utils/fetcher';

interface ComboBoxProps {
  link: string;
}

const useOptions = (link: string) => {
  const { data, error } = useSWR<{ name: string; showName: string }[]>(
    link,
    jsonFetcher,
  );
  if (error) return error === 401 ? 401 : null;
  return data;
};

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0, 1),
    width: 256,
    margin: theme.spacing(0, 1),
  },
}));

const filterOptions = createFilterOptions<{ name: string; showName: string }>({
  stringify: ({ name, showName }) => `${name} ${showName}`,
});

const getOptionLabel = (option: { name: string; showName: string }) =>
  option.showName;

const Input = (params: AutocompleteRenderInputParams) => {
  return <TextField {...params} variant={'outlined'} />;
};

const ComboBox: FC<ComboBoxProps> = (props) => {
  const { link } = props;
  const [option, setOption] = useState<{
    name: string;
    showName: string;
  } | null>(null);
  const options = useOptions(link);
  const router = useRouter();
  const classes = useStyles();

  const handleRootChange = useCallback(
    (
      event: ChangeEvent,
      value: { name: string; showName: string },
      reason: AutocompleteChangeReason,
    ) => {
      if (reason === 'select-option') {
        router.push(`/project/error?name=` + value.name);
      }
    },
    [router],
  );

  useEffect(() => {
    if (Array.isArray(options)) {
      const findOption = (option) => option.name === router.query.name;
      setOption(options.find(findOption) || null);
    }
  }, [options, router]);
  useEffect(() => {
    router.prefetch('/project/error');
  }, [router]);

  return (
    <Autocomplete
      className={classes.root}
      filterOptions={filterOptions}
      fullWidth
      getOptionLabel={getOptionLabel}
      onChange={handleRootChange}
      options={Array.isArray(options) ? options : []}
      renderInput={Input}
      value={option}
      size={'small'}
    />
  );
};

export default ComboBox;
