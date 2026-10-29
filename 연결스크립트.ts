// Hermes(이 컴퓨터, 로컬 전용)를 DeskRPG 2D 사무실에 등록한다.
// 토큰은 Hermes의 .env 파일에서 읽어 앱 함수에만 넘기고 출력하지 않는다.
//
// 실행 (deskrpg-2d 폴더에서, OFFICE_ROOT는 '가상사무실' 폴더 경로):
//   NODE_PATH="$PWD/node_modules" DB_TYPE=sqlite SQLITE_PATH=data/deskrpg.db \
//   OFFICE_ROOT="$(cd .. && pwd)" npx tsx --env-file=.env.local 연결스크립트.ts
// 주의: 반드시 --env-file=.env.local 을 붙여야 서버와 같은 암호 키로 저장된다.
import fs from "node:fs";
import Database from "better-sqlite3";

const ROOT = process.env.OFFICE_ROOT;
if (!ROOT) throw new Error("OFFICE_ROOT 환경변수(가상사무실 폴더 경로)가 필요합니다");

async function main() {
  const { upsertOwnedGatewayResource } = await import(`${ROOT}/deskrpg-2d/src/lib/gateway-resources`);
  const { registerHermesProfile } = await import(`${ROOT}/deskrpg-2d/src/lib/hermes-profiles`);

  const env = fs.readFileSync(`${ROOT}/hermes-홈/hermes/.env`, "utf8");
  const token = (env.match(/^API_SERVER_KEY=(.+)$/m) || [])[1]?.trim();
  if (!token) throw new Error("API_SERVER_KEY 없음");

  const db = new Database(`${ROOT}/deskrpg-2d/data/deskrpg.db`, { readonly: true });
  const user = db.prepare("select id from users order by created_at limit 1").get() as { id: string };
  db.close();

  const gw = await upsertOwnedGatewayResource({ ownerUserId: user.id, baseUrl: "http://127.0.0.1:8642", token, displayName: "내 컴퓨터 Hermes" });
  console.log("게이트웨이 등록:", gw.displayName, gw.baseUrl);
  const prof = await registerHermesProfile({ userId: user.id, gatewayId: gw.id, profileName: "default", token, displayName: "비서" });
  console.log("프로필 등록:", "error" in prof ? prof.error : `${prof.profile.displayName} (${prof.profile.profileName})`);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
