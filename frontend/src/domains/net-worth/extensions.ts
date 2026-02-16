import type { Component } from 'vue';
import { capabilities } from '@/domains/capabilities';
import PremiumPeopleActionButton from '@/domains/net-worth/components/PremiumPeopleActionButton.vue';

export type NetWorthViewExtensions = {
  HeaderActions: Component | null;
};

export function useNetWorthViewExtensions(): NetWorthViewExtensions {
  return {
    HeaderActions: capabilities.people ? PremiumPeopleActionButton : null,
  };
}
