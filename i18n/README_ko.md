# LinuxDo Scripts

LinuxDo Scripts는 LinuxDo 포럼의 사용 경험을 향상시키기 위해 설계된 기능이 풍부한 브라우저 확장 프로그램입니다. 기본 인터페이스 최적화부터 고급 AI 지원 기능까지 다양한 실용 기능을 통합하여 포럼 탐색과 상호작용을 더욱 원활하고 효율적으로 만듭니다.

## ✨ 주요 기능

### 🔍 탐색 경험 최적화
- 주제 목록에 생성 시간 표시
- 층(플로어) 번호 표시
- 새 탭에서 주제 열기
- 주제 목록에서 세부 정보 및 댓글 미리보기
- 중영문 혼합 표시 최적화
- 서명 이미지 표시 최적화, 이미지 깨짐 방지
- 자동 다크 모드 전환

### 📚 콘텐츠 관리
- 완벽한 북마크 기능
- 사용자 태그 기능
- 지정 사용자 주제 강제 차단(블랙리스트)
- 원글 작성자만 보기 전환

### 💬 상호작용 강화
- 주제 빠른 답글(사용자 정의 지원)
- 댓글 입력란 이모지 최적화
- 층(플로어) 추첨 기능
- 레벨 정보 조회

### 🤖 AI 인텔리전스
- AI 주제 요약
- 스마트 답글 생성
- AI 지원 답글

### 🎨 개인화
- 포럼 테마 스킨 전환
- 포럼 이모지 스타일 전환
- 사용자 정의 CSS 스타일 지원
- 설정 패널 데이터 동기화

## 📥 설치 및 사용법

### 지원 브라우저
- **Chrome / Edge / Arc / Brave**: [Chrome Web Store](https://chromewebstore.google.com/detail/fbgblmjbeebanackldpbmpacppflgmlj)
- **중국 본토 사용자**: [Crx 스토어](https://www.crxsoso.com/webstore/detail/fbgblmjbeebanackldpbmpacppflgmlj)
- **Firefox**: [Firefox Addons](https://addons.mozilla.org/zh-CN/firefox/addon/linux_do-scripts/)

## 🛠️ 개발 가이드

### 환경 요구 사항
```
node: v22.12.0
```

### 로컬 개발
1. 저장소를 클론하고 의존성 설치:
```shell
git clone https://github.com/ezyshu/linuxdo-scripts
npm install
```

2. 개발 서버 시작:
```shell
npm run dev
```

3. 확장 프로그램 로드:
- 로컬 `.output` 폴더 열기
- `chrome-mv3` 폴더를 `chrome://extensions/`에 드래그

### 개발 안내
- 컴포넌트 기반 개발
- 각 신규 기능은 독립 컴포넌트로 개발하여 충돌 방지
- PR 제출 후 코드 리뷰, 큰 문제 없으면 신속 병합

## 🚀 기여자

![Contributor](https://contrib.rocks/image?repo=ezyshu/linuxdo-scripts)

## 🤝 기여 가이드

새로운 기능 제안과 개선 의견을 환영합니다! 다음 방법으로 프로젝트에 참여할 수 있습니다:
- Issue 제출로 문제 또는 제안 보고
- Pull Request로 코드 기여
- Discord 커뮤니티 참여 및 토론

## ⭐️ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=ezyshu/linuxdo-scripts&type=Timeline)](https://www.star-history.com/#ezyshu/linuxdo-scripts&Timeline)

## 📄 라이선스

이 프로젝트는 MIT 라이선스로 오픈소스입니다. 자세한 내용은 [LICENSE](../LICENSE) 파일을 참조하세요.

## 📖 면책 조항

이 프로젝트는 무료이자 오픈소스이지만, 완전히 버그가 없음을 보장하지 않습니다. 사용 전 스스로 위험을 감수해야 하며, 관련 법규를 준수하고 남용하지 마십시오.

권리 침해가 있을 경우 [ezyshu](https://github.com/ezyshu)에게 연락해 주시면 신속히 처리하겠습니다. 