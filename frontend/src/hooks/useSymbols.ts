import { useQuery } from '@tanstack/react-query';
import { fetchSymbolList } from '../service/symbolListApi';

export function useSymbols() {
  return useQuery({
    queryKey: ['symbols'],
    queryFn: fetchSymbolList,
    staleTime: 60 * 60 * 1000, // 60 دقیقه
    gcTime: 60 * 60 * 1000,   // 60 دقیقه
  });
}
