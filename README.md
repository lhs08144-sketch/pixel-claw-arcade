# PIXEL CLAW ARCADE

레트로 오락실 스타일의 인형뽑기 웹 게임입니다. 순수 HTML, CSS, JavaScript로 구성되어 별도 빌드나 패키지 설치 없이 GitHub Pages에 배포할 수 있습니다.

## 기능

- 메인 화면과 게임 화면 이동
- 방향키와 화면 버튼으로 집게 조작 (모바일 터치 지원)
- 집게를 내리는 동작과 인형 획득 판정
- 획득 실패 시 10 PT 차감, 포인트 소진 시 다시하기
- 모바일 화면 대응

## 파일 구성

```text
index.html       페이지 구조
css/style.css    화면 스타일
js/main.js       화면 전환과 게임 동작
```

## 로컬에서 확인

`index.html`을 브라우저에서 직접 열거나 VS Code의 Live Server로 실행합니다. Google Fonts를 불러오려면 인터넷 연결이 필요하며, 오프라인에서도 기본 글꼴로 표시됩니다.

## GitHub Pages 배포

1. GitHub에서 새 저장소를 만듭니다. 예: `pixel-claw-arcade`.
2. 이 프로젝트의 `index.html`, `css/`, `js/`, `README.md`를 저장소 최상위(root)에 올립니다.
3. 저장소의 **Settings → Pages**로 이동합니다.
4. **Build and deployment**에서 **Deploy from a branch**를 선택합니다.
5. 브랜치는 `main`, 폴더는 `/(root)`를 선택하고 **Save**를 누릅니다.
6. Pages 화면의 사이트 주소를 열어 배포 상태를 확인합니다. 첫 배포와 업데이트 반영에 몇 분 걸릴 수 있습니다.

빌드 명령, 패키지 설치, GitHub Actions 파일은 필요하지 않습니다. `index.html`은 저장소 최상위에 있어야 하며 CSS/JS 경로는 현재처럼 상대 경로(`css/style.css`, `js/main.js`)로 유지합니다.

GitHub Free 계정에서 Pages를 사용하려면 저장소를 공개(public)로 설정해야 합니다. 저장소가 비공개여도 Pages 사이트는 공개될 수 있으므로 배포할 파일에 비밀 정보가 없는지 확인하세요.
