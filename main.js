import { captureChart } from "./captureChart.js";
import { renderChart, renderJSON, renderTable } from "./render.js";

document.addEventListener("DOMContentLoaded", () => {
  // 데이터 초기화
  let data = localStorage.getItem("data");
  if (data !== undefined && data !== null) {
    data = JSON.parse(data);
  } else {
    data = [
      { id: 0, value: 75 },
      { id: 1, value: 20 },
      { id: 2, value: 80 },
      { id: 3, value: 100 },
      { id: 4, value: 70 },
    ];
  }
  let originalData = [...data]; // 원본 데이터 백업

  const colors = [
    "#BEE4D0",
    "#6DE1D2",
    "#FFD63A",
    "#FFA955",
    "#F75A5A",
    "#8EE8E0",
  ];

  function saveData() {
    localStorage.setItem("data", JSON.stringify(data));
    originalData = data.map((d) => ({ ...d }));
  }

  function renderAll() {
    renderChart(data, colors);
    renderTable(data);
    renderJSON(data);
  }

  // capture chart
  document
    .getElementById("btn-capture-chart")
    .addEventListener("click", () => captureChart(data, colors));

  // table edit Apply
  document.getElementById("apply-table").addEventListener("click", () => {
    document.querySelectorAll("#table-body input").forEach((input) => {
      const idx = input.dataset.index;
      data[idx] = {
        id: Number(data[idx].id),
        value: Number(input.value),
      };
    });
    saveData();
    renderAll();
  });

  // {id : value} Add
  document.getElementById("btn-add").addEventListener("click", () => {
    const nid = Number(document.getElementById("new-id").value);
    const nval = Number(document.getElementById("new-val").value);
    if (!isNaN(nid) && !isNaN(nval)) {
      if (data.some((d) => d.id === nid)) {
        alert("중복된 ID입니다!");
        return;
      } else {
        data.push({ id: nid, value: nval });
        document.getElementById("new-id").value = "";
        document.getElementById("new-val").value = "";
        renderAll();
      }
    }
  });

  // JSON Apply
  document.getElementById("apply-json").addEventListener("click", () => {
    try {
      const parsed = JSON.parse(document.getElementById("json-editor").value);
      if (
        Array.isArray(parsed) &&
        parsed.every((i) => "id" in i && "value" in i)
      ) {
        const ids = parsed.map((item) => item.id);
        const uniqueIds = new Set(ids);
        // 중복된 ID 체크
        if (uniqueIds.size !== ids.length) {
          const dupIds = ids.filter((id, idx) => ids.indexOf(id) !== idx);
          const dupList = [...new Set(dupIds)].join(", ");
          alert(`id ${dupList} 중복 되었습니다`);
          return;
        }
        data = parsed.map((item) => ({
          id: Number(item.id),
          value: Number(item.value),
        }));
        saveData(data);
        renderAll();
      } else {
        alert("올바른 형식의 JSON 배열이 아닙니다!");
      }
    } catch (err) {
      alert("JSON 파싱 에러: " + err.message);
    }
  });

  // 데이터 되돌리기
  const undoBtn = document.querySelectorAll(".undo-changes");
  undoBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      data = originalData.map((d) => ({ ...d }));
      renderAll();
    });
  });

  // 초기 렌더
  renderAll();
});
