export interface ModalMessageType {
  type: string;
  msgs: { title: string; detail: string };
}

export interface ModalMessageExtend extends ModalMessageType {
  theme: string;
}
