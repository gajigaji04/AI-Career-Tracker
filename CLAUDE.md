# CLAUDE.md

## Git 규칙 (필수)

- **커밋(`git commit`)과 푸시(`git push`)는 사용자만 한다.** Claude는 어떤 경우에도 커밋·푸시·PR 생성·머지를 하지 않는다.
- Claude는 파일 수정까지만 하고, 작업이 끝나면 변경된 파일 목록과 제안 커밋 메시지(`feat: ...` / `fix: ...` 형식)만 알려준다.
- `git add`, `git stash`, `git reset`, `git checkout -- <file>`처럼 작업 트리나 스테이징을 바꾸는 명령도 사용자가 요청할 때만 실행한다. `git status`, `git diff`, `git log` 같은 읽기 전용 명령은 자유롭게 사용해도 된다.

## 참고 문서

- 프로젝트 분석 / 이슈 목록: [.claude/PROJECT_ANALYSIS.md](.claude/PROJECT_ANALYSIS.md)
- 개발 가이드 (실행·검증 명령, 기능 추가 패턴, 주의사항): [.claude/DEV_GUIDE.md](.claude/DEV_GUIDE.md)
