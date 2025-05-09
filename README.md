# IMfine 과제

## 주요 기능

### 1. 차트 캡처 기능

- 차트를 이미지(PNG)로 저장할 수 있는 기능 구현
- Canvas API를 활용한 직접 구현 방식으로 외부 라이브러리 의존성 없음
- 현재 차트 데이터를 동일한 스타일로 캔버스에 렌더링

### 2. 테이블 행 드래그 앤 드롭 기능

- 사용자가 테이블의 각 행을 드래그하여 순서를 변경할 수 있음
- 드래그 핸들로 지정된 셀(.drag-handle)에서만 드래그를 시작하도록 구현
- 드롭 시 테이블만 즉시 리렌더링 되어 순서가 반영되고, 차트/JSON 업데이트는 Save 버튼 클릭 시에만 반영

```javascript
import { enableRowDragAndDrop } from "./dragDrop.js";

// Save 버튼 클릭 후
const tbody = document.getElementById("table-body");
enableRowDragAndDrop(tbody, data, () => {
  renderTable(data); // 테이블만 리렌더링
});
```

### 3. Undo 기능

- 사용자가 Save(Apply) 이전 상태로 언제든 되돌릴 수 있는 Undo 버튼 제공

- Save 버튼 클릭 시 원본 데이터 복제본(originalData)을 갱신하고, Undo 클릭 시 해당 복제본으로 복원

```javascript
// Save 클릭 시
saveData(); // localStorage 저장 + originalData 갱신
renderAll();

// Undo 클릭 시
data = originalData.map((d) => ({ ...d }));
renderAll();
```

## 주요 에러 처리 기능

### 1. 데이터 초기화 안전 처리

- localStorage에서 데이터 로드 시 `undefined` 또는 `null` 체크로 초기 실행 시 기본 데이터 제공
- JSON 파싱 오류에 대비한 조건부 처리

### 2. ID 중복 방지

- 새 항목 추가 시 ID 중복 검사 후 사용자에게 알림

```javascript
if (data.some((d) => d.id === nid)) {
  alert("중복된 ID입니다!");
  return;
}
```

### 3. 입력 유효성 검증

- 숫자 입력 필드에 대한 `isNaN()` 검사로 유효한 숫자만 허용
- JSON 에디터의 입력이 올바른 배열 형식인지 검증

### 4. JSON 파싱 예외 처리

- JSON 파싱 시 try-catch 블록으로 오류 포착 및 사용자 피드백 제공

```javascript
try {
  const parsed = JSON.parse(document.getElementById("json-editor").value);
  // 데이터 처리
} catch (err) {
  alert("JSON 파싱 에러: " + err.message);
}
```

### 5. 구조 검증

- JSON 데이터가 필요한 속성(`id`, `value`)을 포함하는지 확인

```javascript
if (Array.isArray(parsed) && parsed.every((i) => "id" in i && "value" in i)) {
  // 유효한 데이터 처리
} else {
  alert("올바른 형식의 JSON 배열이 아닙니다!");
}
```

### 6. 다중 ID 중복 검사

- JSON 업데이트 시 전체 데이터에서 중복된 ID 목록 생성 및 표시

```javascript
const ids = parsed.map((item) => item.id);
const uniqueIds = new Set(ids);
if (uniqueIds.size !== ids.length) {
  const dupIds = ids.filter((id, idx) => ids.indexOf(id) !== idx);
  const dupList = [...new Set(dupIds)].join(", ");
  alert(`id ${dupList} 중복 되었습니다`);
  return;
}
```

## 모듈 구조

- captureChart.js: 차트 이미지 캡처 기능
- dragDrop.js: 테이블 행 드래그 앤 드롭 기능
- render.js: 차트, 테이블, JSON 렌더링 기능
- main.js: 메인 로직 및 이벤트 처리
