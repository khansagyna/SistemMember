import { useEffect, useState } from 'react';
import { memberApi } from '../api/member.api';
import { Member } from '../types';

export function useMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await memberApi.getAll();
    setMembers(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return {
    members,
    loading,
    reload: load,
  };
}
