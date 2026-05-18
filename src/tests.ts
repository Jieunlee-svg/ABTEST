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
공통: 휴대전화 번호 입력 시 단골 고객을 검색 결과로 보여줍니다.

- A안: 검색 결과는 뷰 전용이라 클릭할 수 없습니다. 단골 번호를 11자리까지 다 입력하면 인풋 아래에 유효성 메시지가 뜨고, 내용을 지우기 전까지 메시지가 유지됩니다. 칩으로 추가되지 않아 실수로 발송 대상이 되는 일을 미리 막습니다.
- B안: 검색 결과를 클릭하면 칩으로 추가됩니다. 단골은 빨간색 칩으로 들어가고, 칩이 있는 동안 에러 메시지가 떠 있으며, 단골 칩을 직접 삭제해야 발송 버튼이 활성화됩니다.

어느 안이 더 직관적이고 단골 오발송을 잘 막아주는지 의견을 모읍니다.`,
    variants: [
      { id: 'a', label: 'A안', component: SmsInviteA },
      { id: 'b', label: 'B안', component: SmsInviteB },
    ],
  },
];
