
let playerName = "";
let playerAnswers = {};
let completedMissions = [];

document.querySelectorAll('.cell').forEach(cell => {
  cell.addEventListener('click', () => {
    if (cell.classList.contains('mission')) {
      const missionNumber = cell.getAttribute('data-mission');
      handleMission(missionNumber);
    } else if (cell.id === "reveal") {
      handleRevealMission();
    } else {
  const role = cell.getAttribute('data-role');
  showMessage(`${role}：這裡什麼都沒有唷～<br/><button onclick="closeMessage()">關閉</button>`);
}
  });
});

function startGame() {
  const name = document.getElementById("playerName").value.trim();
  if (!name) {
    alert("請先輸入名字！");
    return;
  }

  playerName = name;
  document.getElementById("name-entry").style.display = "none";
  document.querySelector(".grid-container").style.display = "grid";

  alert(`歡迎你，${name}！開始挑戰吧～`);
}

function handleMission(number) {
  if (completedMissions.includes(number)) {
    showMessage(`你已經完成第 ${number} 關囉！`);
    return;
  }

  const msgBox = document.getElementById("message-box");
  const msgText = document.getElementById("message-text");

  if (number === "1") {
    msgText.innerHTML = `
      <p>第一關：猜猜我是誰？</p>
      <img src="black.png" style="width:250px" />
      <br/><br/>
      <button onclick="chooseAnswer('比卡超')">1. 比卡超</button>
      <button onclick="chooseAnswer('奇異種子')">2. 奇異種子</button>
      <button onclick="chooseAnswer('小火龍')">3. 小火龍</button>
    `;
  }

  if (number === "2") {
    msgText.innerHTML = `
      <p>第二關：哪一邊是肇鈞？</p>
      <img src="mama.jpg" style="width:250px" />
      <br/><br/>
      <button onclick="guessZhaojun('左')">1. 左邊</button>
      <button onclick="guessZhaojun('右')">2. 右邊</button>
    `;
  }

  if (number === "3") {
    msgText.innerHTML = `
      <p>第三關：猜猜他是男生定女生？</p>
      <img src="jun.jpg" style="width:250px" />
      <br/><br/>
      <button onclick="guessGender('男生')">1. 男生</button>
      <button onclick="guessGender('女生')">2. 女生</button>
    `;
  }

  msgBox.classList.remove("hidden");
}

function chooseAnswer(choice) {
  const correct = choice === "比卡超";
  playerAnswers["mission1"] = { question: "猜猜我是誰？", answer: choice, correct };

  document.getElementById("message-text").innerHTML = `
    <p>${correct ? "答對了！是比卡超～" : "錯了，是比卡超啦！"}</p>
    <img src="pika.png" style="width:250px" />
    <br/><button onclick="closeMessage()">關閉</button>
  `;

  completedMissions.push("1");
  checkReveal();
}

function guessZhaojun(choice) {
  const correct = choice === "右";
  playerAnswers["mission2"] = { question: "哪一邊是肇鈞？", answer: choice, correct };

  document.getElementById("message-text").innerHTML = `
    <p>${correct ? "答對了～你太了解他了！" : "錯啦～再觀察一下！"}</p>
    <img src="mama.jpg" style="width:250px" />
    <br/><button onclick="closeMessage()">關閉</button>
  `;

  completedMissions.push("2");
  checkReveal();
}

function guessGender(choice) {
  const correct = choice === "男生";
  playerAnswers["mission3"] = { question: "猜猜他是男生定女生？", answer: choice, correct };

  document.getElementById("message-text").innerHTML = `
    <p>${correct ? "答對了～他是男生，因為他是瑋臻唷！" : "錯啦～，因為他是瑋臻唷！"}</p>
    <img src="jun.jpg" style="width:150px" />
    <br/><button onclick="closeMessage()">關閉</button>
  `;

  completedMissions.push("3");
  checkReveal();
}

function handleRevealMission() {
  const msgBox = document.getElementById("message-box");
  const msgText = document.getElementById("message-text");

  msgText.innerHTML = `
    <p>最終揭示：你知道的寶寶性別是什麼？</p>
    <img src="small.png" style="width:200px" />
    <br/>
    <button onclick="finalReveal('男生')">1. 男生</button>
    <button onclick="finalReveal('女生')">2. 女生</button>
  `;
  msgBox.classList.remove("hidden");
}

function finalReveal(choice) {
  const correct = choice === "男生";
  playerAnswers["reveal"] = { question: "最終揭示", answer: choice, correct };

  // 
  document.getElementById("message-box").classList.remove("hidden");

  //
  document.getElementById("message-text").innerHTML = `
    <h2 class="typing">${correct ? "恭喜你答對了！他是男寶寶！" : "錯啦～他是男寶寶唷！"}</h2>
    <img src="sp.png" alt="慶祝圖案" style="width:400px" />
    <br/><p>${playerName} 的挑戰完成！</p>
    <button onclick="closeMessage()">關閉</button>
  `;

 
  sendToGoogleSheet();
}

function closeMessage() {
  document.getElementById("message-box").classList.add("hidden");
}

function showMessage(text) {
  document.getElementById("message-text").innerHTML = `<p>${text}</p>`;
  document.getElementById("message-box").classList.remove("hidden");
}

function checkReveal() {
  if (completedMissions.includes("1") && completedMissions.includes("2") && completedMissions.includes("3")) {
    document.getElementById("reveal").style.display = "flex";
  }
}

particlesJS.load('particles-js', 'particles.json', function () {
  console.log('Particles loaded!');
});

function sendToGoogleSheet() {
  const data = {
    name: playerName,
    mission1Answer: playerAnswers.mission1?.answer || "",
    mission1Correct: playerAnswers.mission1?.correct ? "✅" : "❌",
    mission2Answer: playerAnswers.mission2?.answer || "",
    mission2Correct: playerAnswers.mission2?.correct ? "✅" : "❌",
    mission3Answer: playerAnswers.mission3?.answer || "",
    mission3Correct: playerAnswers.mission3?.correct ? "✅" : "❌",
    finalRevealAnswer: playerAnswers.reveal?.answer || "",
    finalRevealCorrect: playerAnswers.reveal?.correct ? "✅" : "❌",
  };

  fetch("https://script.google.com/macros/s/AKfycbyUOgaMgOAuWPUerHG4gVlJwAnSmSlYCpPuOGXeVI8LmSCx8MGgk_ja01vsrR_9vl26DQ/exec", {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }).then(() => {
    console.log("✅ 已送出到 Google Sheet！");
  }).catch(err => {
    console.error("❌ 送出失敗：", err);
  });
}
