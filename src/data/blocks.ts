export const blockMsgs = [
  {
    msgId: 1,
    type: 1, // 에러
    msgs: {
      header: "이미 차단한 사용자입니다.",
      main: "이미 차단한 사용자를 다시 차단할 수 없습니다.",
    },
  },
];

export const fetchProfileMsg = (msgId: number) => {
  return blockMsgs.find((msg) => msg.msgId === msgId);
};
