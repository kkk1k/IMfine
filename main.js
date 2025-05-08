document.addEventListener("DOMContentLoaded", () => {
  // --- 데이터 초기화 ---
  let data = [
    { id: 0, value: 75 },
    { id: 1, value: 20 },
    { id: 2, value: 80 },
    { id: 3, value: 100 },
    { id: 4, value: 70 },
  ];

  // --- 렌더 함수들 ---
  function renderChart() {
    const chart = document.getElementById("chart");
    chart.innerHTML = "";
    // value 값에 따라 높이를 조정하여 막대 그래프를 그립니다.
    const max = Math.max(...data.map((d) => d.value), 1);
    data.forEach((d) => {
      const bar = document.createElement("div");
      bar.className = "bar";
      bar.style.height = (d.value / max) * 100 + "%";
      const label = document.createElement("span");
      label.textContent = d.value;
      bar.appendChild(label);
      chart.appendChild(bar);
    });
  }

  function renderTable() {
    const tbody = document.getElementById("table-body");
    tbody.innerHTML = "";
    data.forEach((d, idx) => {
      const tr = document.createElement("tr");
      // ID
      const tdId = document.createElement("td");
      tdId.textContent = d.id;
      // 값 (input)
      const tdVal = document.createElement("td");
      const inp = document.createElement("input");
      inp.type = "number";
      inp.value = d.value;
      inp.dataset.index = idx;
      tdVal.appendChild(inp);
      // 삭제
      const tdDel = document.createElement("td");
      const del = document.createElement("a");
      del.textContent = "삭제";
      del.className = "delete";
      del.dataset.index = idx;
      del.addEventListener("click", (e) => {
        deleteRow(e);
        renderTable();
      });
      tdDel.appendChild(del);

      tr.append(tdId, tdVal, tdDel);
      tbody.appendChild(tr);
    });
  }

  function deleteRow(e) {
    const idx = e.target.dataset.index;
    data.splice(idx, 1);
  }

  function renderJSON() {
    document.getElementById("json-editor").value = JSON.stringify(
      data,
      null,
      2
    );
  }

  function renderAll() {
    renderChart();
    renderTable();
    renderJSON();
  }

  // 테이블 Apply
  document.getElementById("apply-table").addEventListener("click", () => {
    document.querySelectorAll("#table-body input").forEach((inp) => {
      const idx = inp.dataset.index;
      data[idx].value = Number(inp.value);
    });
    renderAll();
  });

  // 값 추가
  document.getElementById("btn-add").addEventListener("click", () => {
    const nid = Number(document.getElementById("new-id").value);
    const nval = Number(document.getElementById("new-val").value);
    if (!isNaN(nid) && !isNaN(nval)) {
      data.push({ id: nid, value: nval });
      document.getElementById("new-id").value = "";
      document.getElementById("new-val").value = "";
      renderAll();
    }
  });

  // JSON Apply
  document.getElementById("apply-json").addEventListener("click", () => {
    try {
      const parsed = JSON.parse(document.getElementById("json-editor").value);
      if (
        Array.isArray(parsed) &&
        parsed.every((o) => "id" in o && "value" in o)
      ) {
        data = parsed.map((o) => ({
          id: Number(o.id),
          value: Number(o.value),
        }));
        renderAll();
      } else {
        alert("올바른 형식의 JSON 배열이 아닙니다!");
      }
    } catch (err) {
      alert("JSON 파싱 에러: " + err.message);
    }
  });

  // 초기 렌더
  renderAll();
});
