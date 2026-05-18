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
  description: string;
  variants: Variant[];
};

export const tests: Test[] = [
  {
    id: 'sms-invite',
    label: '발송정보입력',
    description: `SMS 발송 전, 사용자가 발신정보·수신자·메시지를 입력하는 화면의 레이아웃 A/B 테스트입니다.

- A안: (작성 예정)
- B안: 입력 폼을 한 화면에 모두 노출하여 한눈에 확인할 수 있도록 구성

어느 안이 더 직관적이고 입력 흐름이 매끄러운지 의견을 모읍니다.`,
    variants: [
      { id: 'a', label: 'A안', component: SmsInviteA },
      { id: 'b', label: 'B안', component: SmsInviteB },
    ],
  },
];
