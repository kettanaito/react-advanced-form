export default function warn(testValue, message, ...optionalParams) {
  if (!testValue) console.warn(message, ...optionalParams);
}
