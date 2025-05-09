// dragDrop.js
export function enableRowDragAndDrop(tbody, data, onReorder) {
  let dragSrcIndex = null;
  let isDragging = false;

  // 마우스 다운 이벤트 핸들러 - 드래그 핸들에서만 드래그 가능하도록
  function handleMouseDown(e) {
    const isHandle =
      e.target.closest("td.drag-handle") ||
      e.target.closest("svg") ||
      e.target.nodeName === "path";

    if (isHandle) {
      // 드래그 핸들 클릭 시 tr에 플래그 설정
      const tr = e.target.closest("tr");
      if (tr) {
        tr.setAttribute("data-draggable", "true");
      }
    }
  }

  function handleDragStart(e) {
    // 드래그 핸들을 통해 시작된 경우에만 드래그 허용
    if (this.getAttribute("data-draggable") !== "true") {
      e.preventDefault();
      return false;
    }

    dragSrcIndex = Number(this.dataset.index);
    this.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";

    this.removeAttribute("data-draggable");
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    this.classList.add("over");
  }

  function handleDragLeave() {
    this.classList.remove("over");
  }

  function handleDrop(e) {
    e.stopPropagation();
    this.classList.remove("over");
    const dropIndex = Number(this.dataset.index);
    if (dragSrcIndex !== null && dragSrcIndex !== dropIndex) {
      // data 재정렬
      const item = data.splice(dragSrcIndex, 1)[0];
      data.splice(dropIndex, 0, item);
      onReorder(data);
    }
    return false;
  }

  function handleDragEnd() {
    this.classList.remove("dragging");
    tbody.querySelectorAll("tr").forEach((row) => row.classList.remove("over"));
  }

  tbody.addEventListener("mousedown", handleMouseDown);

  // <tbody> 안의 모든 tr 에 이벤트 붙이기
  Array.from(tbody.children).forEach((tr, idx) => {
    tr.setAttribute("draggable", "true");
    tr.dataset.index = idx;
    tr.addEventListener("dragstart", handleDragStart);
    tr.addEventListener("dragover", handleDragOver);
    tr.addEventListener("dragleave", handleDragLeave);
    tr.addEventListener("drop", handleDrop);
    tr.addEventListener("dragend", handleDragEnd);
  });
}
