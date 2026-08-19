import { logger } from "../config/logger";

// SOLAPI_API_KEY/SECRET이 설정돼 있지 않으면(로컬/포트폴리오 배포 기본값) 실제 문자를
// 보내는 대신 로그로만 남긴다 — SMS는 이메일과 달리 무료 샌드박스가 없어서, 실제 발송
// 자격증명 없이도 기능 자체는 끝까지 검증할 수 있도록 하기 위함.
export const sendSms = async (phone: string, message: string) => {
  const apiKey = process.env.SOLAPI_API_KEY;
  const apiSecret = process.env.SOLAPI_API_SECRET;
  const senderNumber = process.env.SOLAPI_SENDER_NUMBER;

  if (!apiKey || !apiSecret || !senderNumber) {
    logger.info(
      { phone, message },
      "[SMS dev mode] SOLAPI_API_KEY/SECRET/SENDER_NUMBER 미설정 — 실제 발송 대신 로그로 대체",
    );
    return;
  }

  const { SolapiMessageService } = await import("solapi");
  const client = new SolapiMessageService(apiKey, apiSecret);

  await client.send({
    to: phone.replace(/-/g, ""),
    from: senderNumber,
    text: message,
  });
};
