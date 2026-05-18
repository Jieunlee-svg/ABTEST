import type { ComponentType } from 'react';
import { SmsInviteA } from './components/SmsInviteA';
import { SmsInviteB } from './components/SmsInviteB';

export type Variant = {
  id: string;
  label: string;
  component: ComponentType;
};

export type Test = {
  id: string;
  label: string;
  variants: Variant[];
};

export const tests: Test[] = [
  {
    id: 'sms-invite',
    label: '발송정보입력',
    variants: [
      { id: 'a', label: 'A안', component: SmsInviteA },
      { id: 'b', label: 'B안', component: SmsInviteB },
    ],
  },
];
