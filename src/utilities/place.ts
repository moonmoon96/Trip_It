export const convertStringToJson = (data: string) => {
  const jsonStrings = splitJSONObjects(data);

  const jsonData = jsonStrings.map((jsonString) => JSON.parse(jsonString));
  return jsonData;
};

function splitJSONObjects(text: string) {
  const objects = [];
  let startIndex = 0;
  let bracesCount = 0;

  for (let i = 0; i < text.length; i++) {
    if (text[i] === "{") {
      if (bracesCount === 0) startIndex = i;
      bracesCount++;
    } else if (text[i] === "}") {
      bracesCount--;
      if (bracesCount === 0) {
        objects.push(text.slice(startIndex, i + 1));
      }
    }
  }

  return objects;
}

export const getPureletter = (origin: string) => {
  // 정규 표현식: 첫 번째 특수 문자까지의 문자열을 매칭
  const match = origin.match(/^[^!@#$%^&*()_+{}\[\]:;"'<>,.?\/\\|`~]*/);
  return match ? match[0] : "";
};
