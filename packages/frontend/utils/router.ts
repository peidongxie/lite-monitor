import { useRouter } from 'next/router';

export const useName = () => {
  const router = useRouter();
  const name = router.query.name;
  if (Array.isArray(name)) return name[0] || '';
  return name || '';
};
