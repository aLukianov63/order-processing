export function translate_status(string_status: string) {
  switch (string_status) {
    case "CANCELED":
      return "отменён";
    case "CREATED":
      return "создан";
    case "PROCESSED":
      return "обработан";
    case "COLLECTED":
      return "собран";
    case "SENT":
      return "отправлен";
    case "RECEIVED":
      return "получен";
    default:
      return "ошибка";
  }
}
