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
  testSteps?: string[];
  variants: Variant[];
};

export const tests: Test[] = [
  {
    id: 'sms-invite',
    label: '발송정보입력',
    description: '앱 초대 문자 발송을 위해 휴대폰 번호를 입력하는 A/B 테스트입니다.',
    testSteps: [
      '"고객 휴대전화 번호" 입력창에 이미 웰체크 앱 가입자라서 메시지를 보낼 수 없는 번호 (예: 01012345678)를 입력하세요.',
      '이 때, 천천히 입력하며 사용자 경험을 테스트 해주세요.',
      '"고객 휴대전화 번호" 입력창에 웰체크 앱 가입자가 아니라서 메시지를 보낼 수 있는 번호 (예: 01011112222)를 입력하세요.',
      '이 때, 천천히 입력하며 사용자 경험을 테스트 해주세요.',
    ],
    variants: [
      { id: 'a', label: 'A안', component: SmsInviteA },
      { id: 'b', label: 'B안', component: SmsInviteB },
    ],
  },
];
