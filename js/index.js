const tilForm = document.querySelector("#til-form");
const tilList = document.querySelector("#til-list");
const themeToggle = document.querySelector("#theme-toggle");

tilForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const date = document.querySelector("#til-date").value;
  const title = document.querySelector("#til-title").value;
  const content = document.querySelector("#til-content").value;

  const newTilItem = document.createElement("article");
  newTilItem.classList.add("til-item");

  const time = document.createElement("time");
  time.textContent = date;

  const h3 = document.createElement("h3");
  h3.textContent = title;

  const p = document.createElement("p");
  p.textContent = content;

  newTilItem.append(time, h3, p);
  tilList.prepend(newTilItem);

  tilForm.reset();
  console.log("새로운 TIL이 등록되었습니다!");
});

document.querySelectorAll(".nav-links a").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    document.querySelector(targetId).scrollIntoView({
      behavior: "smooth",
    });
  });
});

const mbtiData = {
  EI: 15,
  SN: 50,
  TF: 95,
  JP: 50
};

function renderMBTI(id, leftPercent) {
  const row = document.getElementById(id);
  if (!row) return;

  const bar = row.querySelector('.mbti-bar-fill');
  const labelLeft = row.querySelector('.mbti-label.left');
  const labelRight = row.querySelector('.mbti-label.right');

  let targetWidth = 0;

  if (leftPercent >= 50) {
    labelLeft.className = 'mbti-label left mbti-active';
    labelRight.className = 'mbti-label right mbti-inactive';
    bar.style.marginLeft = '0';
    targetWidth = leftPercent;
  } else {
    labelLeft.className = 'mbti-label left mbti-inactive';
    labelRight.className = 'mbti-label right mbti-active';
    bar.style.marginLeft = 'auto';
    targetWidth = 100 - leftPercent;
  }

  setTimeout(() => {
    bar.style.width = targetWidth + '%';
  }, 100);
}

window.addEventListener('DOMContentLoaded', () => {
  renderMBTI('row-ei', mbtiData.EI);
  renderMBTI('row-sn', mbtiData.SN);
  renderMBTI('row-tf', mbtiData.TF);
  renderMBTI('row-jp', mbtiData.JP);
});
