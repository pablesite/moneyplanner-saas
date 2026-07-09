import { storeToRefs } from 'pinia';
import { usePlanStore } from '@/domains/plan/store';

export function usePlan() {
  const store = usePlanStore();
  return {
    store,
    ...storeToRefs(store),
  };
}
