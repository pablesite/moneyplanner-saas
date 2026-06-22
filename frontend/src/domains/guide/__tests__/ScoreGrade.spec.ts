/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import ScoreGrade from '@/domains/guide/components/ScoreGrade.vue';

describe('ScoreGrade', () => {
  it('renders a badge with the grade letter and matching grade color class', () => {
    const wrapper = mount(ScoreGrade, { props: { score: 90 } });
    const span = wrapper.get('span');
    const grade = span.text();
    expect(grade).toMatch(/^[A-E]$/);
    expect(span.classes()).toContain('guide-grade');
    expect(span.classes()).toContain(`grade-${grade.toLowerCase()}`);
  });

  it('renders the label variant with is-large when large', () => {
    const wrapper = mount(ScoreGrade, { props: { score: 40, variant: 'label', large: true } });
    const span = wrapper.get('span');
    expect(span.classes()).toContain('guide-grade-label');
    expect(span.classes()).toContain('is-large');
    expect(span.classes()).not.toContain('guide-grade');
  });
});
