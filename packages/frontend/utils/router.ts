import { useRouter } from 'next/router';

const useName = (): string => {
  const router = useRouter();
  const name = router.query.name;
  if (Array.isArray(name)) return name[0] || '';
  return name || '';
};

export { useName };
