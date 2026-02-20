# ⚡ 전기기능사 회로 시뮬레이터 (Circuit Simulator)

전기기능사 자격증 취득을 준비하는 수험생들을 위한 **직렬/병렬 회로 학습용 시뮬레이터**입니다. 저항의 연결 방식에 따른 합성저항의 변화와 전류의 흐름을 시각적으로 학습할 수 있습니다.

## ✨ 주요 기능

- **실시간 회로 시뮬레이션**: 직렬 및 병렬 회로를 자유롭게 전환하며 저항 소자를 추가/삭제할 수 있습니다.
- **전류 흐름 시각화 (Particle Animation)**: 옴의 법칙(I = V/R)에 따라 전류의 세기를 애니메이션 속도로 표현합니다. 특히 병렬 회로에서 저항값에 따른 지로 전류의 차이를 직관적으로 보여줍니다.
- **수식 자동 계산**: 합성저항, 전체 전류, 각 저항별 전압강하 및 분로 전류를 실시간으로 계산합니다.
- **n²배의 법칙 가이드**: 기능사 시험 단골 문제인 "동일 저항 n개 연결 시 직/병렬 저항비"를 실시간 수치로 설명합니다.
- **AI 학습 가이드**: Google Gemini API를 활용하여 현재 회로 구성에 맞는 기능사 시험 핵심 팁을 제공합니다.

## 🛠 기술 스택

- **Frontend**: React (v19), TypeScript, Tailwind CSS
- **Graphics**: SVG + SMIL Animation (회로 및 입자 시각화)
- **AI**: Google Gemini API (@google/genai)
- **Build Tool**: Vite (권장)

## 🚀 설치 및 실행 방법

### 1. 환경 설정
프로젝트를 로컬에 복사한 후 필요한 패키지를 설치합니다.

```bash
npm install
```

### 2. API 키 설정
Gemini API 기능을 사용하려면 환경 변수(`process.env.API_KEY`) 설정이 필요합니다.

### 3. 개발 서버 실행
```bash
npm run dev
```

### 4. 배포용 빌드
Vercel이나 GitHub Pages에 배포하기 위해 최적화된 파일을 생성합니다.
```bash
npm run build
```

## 🌐 배포 가이드

### Vercel (추천)
1. GitHub 저장소에 코드를 push합니다.
2. [Vercel](https://vercel.com)에서 해당 저장소를 연결합니다.
3. 빌드 설정에서 `Framework Preset`을 **Vite** 또는 **Other**로 선택하고 `Build Command`에 `npm run build`를 입력합니다.
4. `Environment Variables`에 `API_KEY`를 추가합니다.

### GitHub Pages
1. `npm install gh-pages --save-dev`를 설치합니다.
2. `package.json`에 `homepage` 주소를 추가합니다.
3. `scripts`에 `"predeploy": "npm run build"`, `"deploy": "gh-pages -d dist"`를 추가합니다.
4. `npm run deploy` 명령어를 실행합니다.

---
본 프로젝트는 **Senior Frontend Engineer**의 가이드에 따라 설계된 교육용 애플리케이션입니다.
