// chart 랜더링
export function renderChart(data, colors) {
  const bars = document.getElementById("bars");

  bars.innerHTML = "";

  const max = Math.max(...data.map((d) => d.value), 1);

  data.forEach((d, idx) => {
    // 1) Bar 생성
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = (d.value / max) * 100 + "%";
    bar.style.backgroundColor = colors[idx % colors.length];
    // 1-1) 값 레이블
    const valueLabel = document.createElement("span");
    valueLabel.textContent = d.value;
    bar.appendChild(valueLabel);
    bars.appendChild(bar);

    // 2) X축 레이블 생성
    const xLabel = document.createElement("div");
    xLabel.className = "x-label";
    xLabel.textContent = d.id;
    bar.appendChild(xLabel);

    // 3) tooltip 생성
    const tooltip = document.getElementById("tooltip");
    bar.addEventListener("mouseover", (e) => {
      // 1) 툴팁 보이기
      tooltip.textContent = `ID: ${d.id}\nValue: ${d.value}`;
      tooltip.style.display = "block";

      // 2) 한 번만 레이아웃 읽기
      const rect = bar.getBoundingClientRect();
      const scrollX = window.pageXOffset;
      const scrollY = window.pageYOffset;

      // 3) 쓰기: CSS left/top 만 설정
      tooltip.style.left = `${rect.left + scrollX + rect.width / 2}px`;
      tooltip.style.top = `${rect.top + scrollY}px`;
    });
    bar.addEventListener("mouseout", () => {
      tooltip.style.display = "none";
    });
  });
}

// 테이블 랜더링
export function renderTable(data) {
  const tbody = document.getElementById("table-body");
  tbody.innerHTML = "";
  data.forEach((d, idx) => {
    const tr = document.createElement("tr");
    tr.draggable = true;
    // 1) ID
    const tdId = document.createElement("td");
    tdId.textContent = d.id;
    // 2) 값 (input)
    const tdVal = document.createElement("td");
    const inp = document.createElement("input");
    inp.className = "table-input";
    inp.type = "number";
    inp.value = d.value;
    inp.dataset.index = idx;
    tdVal.appendChild(inp);
    // 3) 삭제
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

// JSON 랜더링
export function renderJSON(data) {
  document.getElementById("json-editor").value = JSON.stringify(data, null, 2);
}
