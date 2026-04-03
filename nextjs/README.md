# Revisionary Design — Next.js Components

Blog 및 Blog Detail 페이지 디자인을 Next.js + Tailwind CSS로 변환한 컴포넌트입니다.

---

## 파일 구조

```
nextjs/
  components/
    Nav.tsx          # 상단 네비게이션 바
    Footer.tsx       # 하단 푸터
    Badge.tsx        # 카테고리 뱃지
    Avatar.tsx       # 작성자 아바타
  app/
    blog/
      page.tsx       # 블로그 목록 페이지
    blog/[slug]/
      page.tsx       # 블로그 상세 페이지
```

---

## 설치 및 적용

### 1. 파일 복사

`nextjs/` 폴더 안의 파일을 프로젝트의 해당 경로에 복사해주세요.

### 2. 이미지 에셋

아래 파일들을 프로젝트의 `public/` 폴더에 추가해주세요. 파일은 레포 루트에 있습니다.

| 파일 | 용도 |
|------|------|
| `combination.svg` | GNB 로고 |
| `symbol.svg` | 푸터 심볼 |
| `wordmark.png` | 푸터 워드마크 |
| `subjects-gem.svg` | 블로그 히어로 일러스트 |
| `mail-subscribe.png` | 뉴스레터 섹션 메일 아이콘 |

### 3. VCE 히어로 이미지

Blog Detail 페이지의 상단 히어로 이미지는 별도 에셋이 필요합니다.

```
public/images/vce-hero.jpg
```

현재 `<Image src="/images/vce-hero.jpg" />` placeholder로 되어 있습니다. 실제 이미지로 교체해주세요.

### 4. Tailwind 설정

`tailwind.config.ts`에 Nunito 폰트를 추가해주세요.

```ts
theme: {
  extend: {
    fontFamily: {
      nunito: ['Nunito', 'sans-serif'],
    },
  },
},
```

### 5. 폰트 로드

`app/layout.tsx`에서 Google Fonts를 통해 Inter와 Nunito를 불러와주세요.

```ts
import { Inter, Nunito } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const nunito = Nunito({ subsets: ['latin'], weight: ['700', '800'] });
```

### 6. Article body 스타일

Blog Detail의 아티클 본문 스타일(`article-body`, `callout`, `tip` 클래스)은 전역 CSS에 추가가 필요합니다. `app/globals.css`에 아래를 추가해주세요.

```css
.article-body { font-size: 16px; line-height: 1.78; color: #292524; }
.article-body h2 { font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 25px; color: #1c1917; margin: 44px 0 16px; }
.article-body h3 { font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 18px; color: #292524; margin: 32px 0 12px; }
.article-body p  { margin-bottom: 22px; }
.article-body ul, .article-body ol { padding-left: 26px; margin-bottom: 22px; }
.article-body li { margin-bottom: 10px; }
.article-body strong { font-weight: 600; color: #1c1917; }

.article-body .callout {
  background: #f5f2ff; border-left: 3px solid #783cf0;
  border-radius: 0 10px 10px 0; padding: 18px 22px; margin: 28px 0;
}
.article-body .callout p { margin-bottom: 0; }
.article-body .callout strong { color: #783cf0; }

.article-body .tip {
  background: #d1faea; border-left: 3px solid #07947a;
  border-radius: 0 10px 10px 0; padding: 18px 22px; margin: 28px 0;
}
.article-body .tip p { margin-bottom: 0; }
.article-body .tip strong { color: #07947a; }
```

---

## 디자인 토큰

| 토큰 | 값 | 용도 |
|------|----|------|
| `revision-500` | `#783cf0` | Primary purple |
| `stone-900` | `#1c1917` | 본문 텍스트 |
| `stone-600` | `#57534d` | 서브 텍스트 |
| `stone-400` | `#a6a09b` | 메타 텍스트 |
| `stone-200` | `#e7e5e4` | 보더 |
| `stone-300` | `#D6D3D1` | 푸터 배경 |
| Page bg | `#F5F5F5` | 기본 배경 |
