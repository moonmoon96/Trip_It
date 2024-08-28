// debounce 함수를 정의합니다. 이 함수는 제너릭 타입 T를 사용하며,
// T는 여러 개의 인자를 받아들이고 아무 값이나 반환할 수 있는 함수 타입입니다.
export const debounce = <T extends (...args: any[]) => void>(
  // 실행할 함수와 지연 시간을 매개변수로 받습니다.
  fn: T,
  delay: number
) => {
  // timeout 변수를 선언합니다. setTimeout 함수의 반환 타입을 저장할 것입니다.
  let timeout: ReturnType<typeof setTimeout>;

  // debounce된 함수를 반환합니다. 이 함수는 원래의 함수와 동일한 매개변수를 받습니다.
  return (...args: Parameters<T>) => {
    // result 변수를 선언하여 결과를 저장합니다.
    // let result: any;

    // 기존에 설정된 타이머가 있으면 이를 취소합니다.
    if (timeout) clearTimeout(timeout);

    // 새로운 타이머를 설정합니다. delay 후에 원래의 함수를 호출합니다.
    timeout = setTimeout(() => {
      fn(...args);
    }, delay);

    // 결과를 반환합니다.
    // return result;
  };
};
