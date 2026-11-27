import { logger } from "../config/logger";

// SOLAPI_API_KEY/SECRET/SENDER_NUMBER 가 없을 때:
// - development: 실제 발송 대신 로그로 남긴다. SMS 는 이메일과 달리 무료 샌드박스가 없어서,
//   자격증명 없이도 아이디 찾기 기능을 끝까지 테스트할 수 있게 하기 위함.
// - 그 외(production 등): 인증번호가 운영 로그에 평문으로 남지 않도록 로그 없이 에러를 던진다.
export const sendSms = async (phone: string, message: string) => {
  const apiKey = process.env.SOLAPI_API_KEY;
  const apiSecret = process.env.SOLAPI_API_SECRET;
  const senderNumber = process.env.SOLAPI_SENDER_NUMBER;

  if (!apiKey || !apiSecret || !senderNumber) {
    if (process.env.NODE_ENV === "development") {
      logger.info(
        { phone, message },
        "[SMS dev mode] SOLAPI_API_KEY/SECRET/SENDER_NUMBER 미설정 — 실제 발송 대신 로그로 대체",
      );
      return;
    }

    throw new Error("SMS 발송 설정(SOLAPI_*)이 없습니다.");
  }

  const { SolapiMessageService } = await import("solapi");
  const client = new SolapiMessageService(apiKey, apiSecret);

  await client.send({
    to: phone.replace(/-/g, ""),
    from: senderNumber,
    text: message,
  });
};
