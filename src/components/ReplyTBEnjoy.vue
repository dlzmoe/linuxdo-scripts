<template></template>

<script>
// 获取最近使用的表情
var recentEmoji = JSON.parse(localStorage.getItem("emojiData") || "[]");
// 添加最近使用的表情
function addRecentEmoji(data) {
  for (let i = 0; i < recentEmoji.length; i++) {
    if (data.name === recentEmoji[i].name) {
      recentEmoji.splice(i, 1);
      break;
    }
  }
  recentEmoji.unshift(data);
  if (recentEmoji.length >= 9) {
    recentEmoji.pop();
  }
  localStorage.setItem("emojiData", JSON.stringify(recentEmoji));
}

const emojiSet = [
  // 贴吧表情
  {
    size: "45x45",
    name: "tieba25",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon25.png",
  },
  {
    size: "45x45",
    name: "tieba1",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon.png",
  },
  {
    size: "45x45",
    name: "tieba2",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon2.png",
  },
  {
    size: "45x45",
    name: "tieba3",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon3.png",
  },
  {
    size: "45x45",
    name: "tieba4",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon4.png",
  },
  {
    size: "45x45",
    name: "tieba5",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon5.png",
  },
  {
    size: "45x45",
    name: "tieba6",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon6.png",
  },
  {
    size: "45x45",
    name: "tieba7",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon7.png",
  },
  {
    size: "45x45",
    name: "tieba8",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon8.png",
  },
  {
    size: "45x45",
    name: "tieba9",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon9.png",
  },
  {
    size: "45x45",
    name: "tieba10",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon10.png",
  },
  {
    size: "45x45",
    name: "tieba11",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon11.png",
  },
  {
    size: "45x45",
    name: "tieba12",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon12.png",
  },
  {
    size: "45x45",
    name: "tieba13",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon13.png",
  },
  {
    size: "45x45",
    name: "tieba14",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon14.png",
  },
  {
    size: "45x45",
    name: "tieba15",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon15.png",
  },
  {
    size: "45x45",
    name: "tieba16",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon16.png",
  },
  {
    size: "45x45",
    name: "tieba17",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon17.png",
  },
  {
    size: "45x45",
    name: "tieba18",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon18.png",
  },
  {
    size: "45x45",
    name: "tieba19",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon19.png",
  },
  {
    size: "45x45",
    name: "tieba20",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon20.png",
  },
  {
    size: "45x45",
    name: "tieba21",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon21.png",
  },
  {
    size: "45x45",
    name: "tieba22",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon22.png",
  },
  {
    size: "45x45",
    name: "tieba23",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon23.png",
  },
  {
    size: "45x45",
    name: "tieba24",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon24.png",
  },
  {
    size: "45x45",
    name: "tieba26",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon26.png",
  },
  {
    size: "45x45",
    name: "tieba27",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon27.png",
  },
  {
    size: "45x45",
    name: "tieba28",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon28.png",
  },
  {
    size: "45x45",
    name: "tieba29",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon29.png",
  },
  {
    size: "45x45",
    name: "tieba30",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon30.png",
  },
  {
    size: "45x45",
    name: "tieba31",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon31.png",
  },
  {
    size: "45x45",
    name: "tieba32",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon32.png",
  },
  {
    size: "45x45",
    name: "tieba33",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon33.png",
  },
  {
    size: "45x45",
    name: "tieba34",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon34.png",
  },
  {
    size: "45x45",
    name: "tieba35",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon35.png",
  },
  {
    size: "45x45",
    name: "tieba36",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon36.png",
  },
  {
    size: "45x45",
    name: "tieba37",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon37.png",
  },
  {
    size: "45x45",
    name: "tieba38",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon38.png",
  },
  {
    size: "45x45",
    name: "tieba39",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon39.png",
  },
  {
    size: "45x45",
    name: "tieba40",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon40.png",
  },
  {
    size: "45x45",
    name: "tieba41",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon41.png",
  },
  {
    size: "45x45",
    name: "tieba42",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon42.png",
  },
  {
    size: "45x45",
    name: "tieba43",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon43.png",
  },
  {
    size: "45x45",
    name: "tieba44",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon44.png",
  },
  {
    size: "45x45",
    name: "tieba45",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon45.png",
  },
  {
    size: "45x45",
    name: "tieba46",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon46.png",
  },
  {
    size: "45x45",
    name: "tieba47",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon47.png",
  },
  {
    size: "45x45",
    name: "tieba48",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon48.png",
  },
  {
    size: "45x45",
    name: "tieba49",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon49.png",
  },
  {
    size: "45x45",
    name: "tieba50",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon50.png",
  },
  {
    size: "45x45",
    name: "tieba62",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon62.png",
  },
  {
    size: "45x45",
    name: "tieba63",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon63.png",
  },
  {
    size: "45x45",
    name: "tieba64",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon64.png",
  },
  {
    size: "45x45",
    name: "tieba65",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon65.png",
  },
  {
    size: "45x45",
    name: "tieba66",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon66.png",
  },
  {
    size: "45x45",
    name: "tieba67",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon67.png",
  },
  {
    size: "45x45",
    name: "tieba68",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon68.png",
  },
  {
    size: "45x45",
    name: "tieba69",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon69.png",
  },
  {
    size: "45x45",
    name: "tieba70",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon70.png",
  },
  {
    size: "45x45",
    name: "tieba71",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon71.png",
  },
  {
    size: "45x45",
    name: "tieba72",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon72.png",
  },
  {
    size: "45x45",
    name: "tieba73",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon73.png",
  },
  {
    size: "45x45",
    name: "tieba74",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon74.png",
  },
  {
    size: "45x45",
    name: "tieba75",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon75.png",
  },
  {
    size: "45x45",
    name: "tieba76",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon76.png",
  },
  {
    size: "45x45",
    name: "tieba77",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon77.png",
  },
  {
    size: "45x45",
    name: "tieba78",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon78.png",
  },
  {
    size: "45x45",
    name: "tieba79",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon79.png",
  },
  {
    size: "45x45",
    name: "tieba80",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon80.png",
  },
  {
    size: "45x45",
    name: "tieba81",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon81.png",
  },
  {
    size: "45x45",
    name: "tieba82",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon82.png",
  },
  {
    size: "45x45",
    name: "tieba83",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon83.png",
  },
  {
    size: "45x45",
    name: "tieba84",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon84.png",
  },
  {
    size: "45x45",
    name: "tieba85",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon85.png",
  },
  {
    size: "45x45",
    name: "tieba86",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon86.png",
  },
  {
    size: "45x45",
    name: "tieba87",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon87.png",
  },
  {
    size: "45x45",
    name: "tieba88",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon88.png",
  },
  {
    size: "45x45",
    name: "tieba89",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon89.png",
  },
  {
    size: "45x45",
    name: "tieba90",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon90.png",
  },
  {
    size: "45x45",
    name: "tieba91",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon91.png",
  },
  {
    size: "45x45",
    name: "tieba92",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon92.png",
  },
  {
    size: "45x45",
    name: "tieba93",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon93.png",
  },
  {
    size: "45x45",
    name: "tieba94",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon94.png",
  },
  {
    size: "45x45",
    name: "tieba95",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon95.png",
  },
  {
    size: "45x45",
    name: "tieba96",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon96.png",
  },
  {
    size: "45x45",
    name: "tieba97",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon97.png",
  },
  {
    size: "45x45",
    name: "tieba98",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon98.png",
  },
  {
    size: "45x45",
    name: "tieba99",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon99.png",
  },
  {
    size: "45x45",
    name: "tieba100",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon100.png",
  },
  {
    size: "45x45",
    name: "tieba101",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon101.png",
  },
  {
    size: "45x45",
    name: "tieba102",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon102.png",
  },
  {
    size: "45x45",
    name: "tieba103",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon103.png",
  },
  {
    size: "45x45",
    name: "tieba104",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon104.png",
  },
  {
    size: "45x45",
    name: "tieba105",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon105.png",
  },
  {
    size: "45x45",
    name: "tieba106",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon106.png",
  },
  {
    size: "45x45",
    name: "tieba107",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon107.png",
  },
  {
    size: "45x45",
    name: "tieba108",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon108.png",
  },
  {
    size: "45x45",
    name: "tieba109",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon109.png",
  },
  {
    size: "45x45",
    name: "tieba110",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon110.png",
  },
  {
    size: "45x45",
    name: "tieba111",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon111.png",
  },
  {
    size: "45x45",
    name: "tieba112",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon112.png",
  },
  {
    size: "45x45",
    name: "tieba113",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon113.png",
  },
  {
    size: "45x45",
    name: "tieba114",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon114.png",
  },
  {
    size: "45x45",
    name: "tieba115",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon115.png",
  },
  {
    size: "45x45",
    name: "tieba116",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon116.png",
  },
  {
    size: "45x45",
    name: "tieba117",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon117.png",
  },
  {
    size: "45x45",
    name: "tieba118",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon118.png",
  },
  {
    size: "45x45",
    name: "tieba119",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon119.png",
  },
  {
    size: "45x45",
    name: "tieba120",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon120.png",
  },
  {
    size: "45x45",
    name: "tieba121",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon121.png",
  },
  {
    size: "45x45",
    name: "tieba122",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon122.png",
  },
  {
    size: "45x45",
    name: "tieba123",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon123.png",
  },
  {
    size: "45x45",
    name: "tieba124",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/image_emoticon124.png",
  },
  // 抖音表情
  {
    size: "45x45",
    name: "1f005",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f005.png",
  },
  {
    size: "45x45",
    name: "1f308",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f308.png",
  },
  {
    size: "45x45",
    name: "1f31a",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f31a.png",
  },
  {
    size: "45x45",
    name: "1f31c",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f31c.png",
  },
  {
    size: "45x45",
    name: "1f31e",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f31e.png",
  },
  {
    size: "45x45",
    name: "1f339",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f339.png",
  },
  {
    size: "45x45",
    name: "1f349",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f349.png",
  },
  {
    size: "45x45",
    name: "1f37a",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f37a.png",
  },
  {
    size: "45x45",
    name: "1f381",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f381.png",
  },
  {
    size: "45x45",
    name: "1f382",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f382.png",
  },
  {
    size: "45x45",
    name: "1f389",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f389.png",
  },
  {
    size: "45x45",
    name: "1f3a7",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f3a7.png",
  },
  {
    size: "45x45",
    name: "1f436",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f436.png",
  },
  {
    size: "45x45",
    name: "1f437",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f437.png",
  },
  {
    size: "45x45",
    name: "1f43b",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f43b.png",
  },
  {
    size: "45x45",
    name: "1f444",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f444.png",
  },
  {
    size: "45x45",
    name: "1f446",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f446.png",
  },
  {
    size: "45x45",
    name: "1f448",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f448.png",
  },
  {
    size: "45x45",
    name: "1f449",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f449.png",
  },
  {
    size: "45x45",
    name: "1f44b",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f44b.png",
  },
  {
    size: "45x45",
    name: "1f44c",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f44c.png",
  },
  {
    size: "45x45",
    name: "1f44d",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f44d.png",
  },
  {
    size: "45x45",
    name: "1f44e",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f44e.png",
  },
  {
    size: "45x45",
    name: "1f44f",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f44f.png",
  },
  {
    size: "45x45",
    name: "1f480",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f480.png",
  },
  {
    size: "45x45",
    name: "1f494",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f494.png",
  },
  {
    size: "45x45",
    name: "1f4a3",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f4a3.png",
  },
  {
    size: "45x45",
    name: "1f4a9",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f4a9.png",
  },
  {
    size: "45x45",
    name: "1f4aa",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f4aa.png",
  },
  {
    size: "45x45",
    name: "1f51e",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f51e.png",
  },
  {
    size: "45x45",
    name: "1f52a",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f52a.png",
  },
  {
    size: "45x45",
    name: "1f600",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f600.png",
  },
  {
    size: "45x45",
    name: "1f601",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f601.png",
  },
  {
    size: "45x45",
    name: "1f602",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f602.png",
  },
  {
    size: "45x45",
    name: "1f604",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f604.png",
  },
  {
    size: "45x45",
    name: "1f604-new",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f604-new.png",
  },
  {
    size: "45x45",
    name: "1f605",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f605.png",
  },
  {
    size: "45x45",
    name: "1f605-new",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f605-new.png",
  },
  {
    size: "45x45",
    name: "1f60a",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f60a.png",
  },
  {
    size: "45x45",
    name: "1f60c",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f60c.png",
  },
  {
    size: "45x45",
    name: "1f60d",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f60d.png",
  },
  {
    size: "45x45",
    name: "1f60e",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f60e.png",
  },
  {
    size: "45x45",
    name: "1f60f",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f60f.png",
  },
  {
    size: "45x45",
    name: "1f60f-new",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f60f-new.png",
  },
  {
    size: "45x45",
    name: "1f611",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f611.png",
  },
  {
    size: "45x45",
    name: "1f612",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f612.png",
  },
  {
    size: "45x45",
    name: "1f613",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f613.png",
  },
  {
    size: "45x45",
    name: "1f615",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f615.png",
  },
  {
    size: "45x45",
    name: "1f618",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f618.png",
  },
  {
    size: "45x45",
    name: "1f61a",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f61a.png",
  },
  {
    size: "45x45",
    name: "1f61b",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f61b.png",
  },
  {
    size: "45x45",
    name: "1f61c",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f61c.png",
  },
  {
    size: "45x45",
    name: "1f61e",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f61e.png",
  },
  {
    size: "45x45",
    name: "1f621",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f621.png",
  },
  {
    size: "45x45",
    name: "1f622",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f622.png",
  },
  {
    size: "45x45",
    name: "1f622-new",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f622-new.png",
  },
  {
    size: "45x45",
    name: "1f624",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f624.png",
  },
  {
    size: "45x45",
    name: "1f624-new",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f624-new.png",
  },
  {
    size: "45x45",
    name: "1f625",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f625.png",
  },
  {
    size: "45x45",
    name: "1f628",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f628.png",
  },
  {
    size: "45x45",
    name: "1f62a",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f62a.png",
  },
  {
    size: "45x45",
    name: "1f62b",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f62b.png",
  },
  {
    size: "45x45",
    name: "1f62c",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f62c.png",
  },
  {
    size: "45x45",
    name: "1f62d",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f62d.png",
  },
  {
    size: "45x45",
    name: "1f630",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f630.png",
  },
  {
    size: "45x45",
    name: "1f631",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f631.png",
  },
  {
    size: "45x45",
    name: "1f632",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f632.png",
  },
  {
    size: "45x45",
    name: "1f633",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f633.png",
  },
  {
    size: "45x45",
    name: "1f635",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f635.png",
  },
  {
    size: "45x45",
    name: "1f637",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f637.png",
  },
  {
    size: "45x45",
    name: "1f641",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f641.png",
  },
  {
    size: "45x45",
    name: "1f641-new",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f641-new.png",
  },
  {
    size: "45x45",
    name: "1f642",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f642.png",
  },
  {
    size: "45x45",
    name: "1f644",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f644.png",
  },
  {
    size: "45x45",
    name: "1f644-new",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f644-new.png",
  },
  {
    size: "45x45",
    name: "1f648",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f648.png",
  },
  {
    size: "45x45",
    name: "1f64c",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f64c.png",
  },
  {
    size: "45x45",
    name: "1f64f",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f64f.png",
  },
  {
    size: "45x45",
    name: "1f64f-new",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f64f-new.png",
  },
  {
    size: "45x45",
    name: "1f6ac",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f6ac.png",
  },
  {
    size: "45x45",
    name: "1f910",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f910.png",
  },
  {
    size: "45x45",
    name: "1f911",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f911.png",
  },
  {
    size: "45x45",
    name: "1f914",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f914.png",
  },
  {
    size: "45x45",
    name: "1f915",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f915.png",
  },
  {
    size: "45x45",
    name: "1f915-new",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f915-new.png",
  },
  {
    size: "45x45",
    name: "1f91b",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f91b.png",
  },
  {
    size: "45x45",
    name: "1f91d",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f91d.png",
  },
  {
    size: "45x45",
    name: "1f91e",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f91e.png",
  },
  {
    size: "45x45",
    name: "1f926",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f926.png",
  },
  {
    size: "45x45",
    name: "1f929",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f929.png",
  },
  {
    size: "45x45",
    name: "1f92b",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f92b.png",
  },
  {
    size: "45x45",
    name: "1f92c",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f92c.png",
  },
  {
    size: "45x45",
    name: "1f92d",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f92d.png",
  },
  {
    size: "45x45",
    name: "1f92e",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f92e.png",
  },
  {
    size: "45x45",
    name: "1f92f",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f92f.png",
  },
  {
    size: "45x45",
    name: "1f940",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f940.png",
  },
  {
    size: "45x45",
    name: "1f952",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f952.png",
  },
  {
    size: "45x45",
    name: "1f970",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f970.png",
  },
  {
    size: "45x45",
    name: "1f971",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f971.png",
  },
  {
    size: "45x45",
    name: "1f97a",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f97a.png",
  },
  {
    size: "45x45",
    name: "1f9b7",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f9b7.png",
  },
  {
    size: "45x45",
    name: "1f9e7",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/1f9e7.png",
  },
  {
    size: "45x45",
    name: "2615",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/2615.png",
  },
  {
    size: "45x45",
    name: "270a",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/270a.png",
  },
  {
    size: "45x45",
    name: "270c",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/270c.png",
  },
  {
    size: "45x45",
    name: "270c-new",
    url:
      "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/270c-new.png",
  },
  {
    size: "45x45",
    name: "2764",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/2764.png",
  },
  {
    size: "45x45",
    name: "clv",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/clv.png",
  },
  {
    size: "45x45",
    name: "clw",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/clw.png",
  },
  {
    size: "45x45",
    name: "cm8",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/cm8.png",
  },
  {
    size: "45x45",
    name: "cm9",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/cm9.png",
  },
  {
    size: "45x45",
    name: "cmt",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/cmt.png",
  },
  {
    size: "45x45",
    name: "cn0",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/cn0.png",
  },
  {
    size: "45x45",
    name: "cn1",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/cn1.png",
  },
  {
    size: "45x45",
    name: "cn2",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/cn2.png",
  },
  {
    size: "45x45",
    name: "cna",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/cna.png",
  },
  {
    size: "45x45",
    name: "cnb",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/cnb.png",
  },
  {
    size: "45x45",
    name: "cnc",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/cnc.png",
  },
  {
    size: "45x45",
    name: "cnd",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/cnd.png",
  },
  {
    size: "45x45",
    name: "cnf",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/cnf.png",
  },
  {
    size: "45x45",
    name: "cnj",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/cnj.png",
  },
  {
    size: "45x45",
    name: "cnq",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/cnq.png",
  },
  {
    size: "45x45",
    name: "cnv",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/cnv.png",
  },
  {
    size: "45x45",
    name: "co1",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/co1.png",
  },
  {
    size: "45x45",
    name: "co3",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/co3.png",
  },
  {
    size: "45x45",
    name: "co8",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/co8.png",
  },
  {
    size: "45x45",
    name: "co9",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/co9.png",
  },
  {
    size: "45x45",
    name: "cof",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/cof.png",
  },
  {
    size: "45x45",
    name: "cog",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/cog.png",
  },
  {
    size: "45x45",
    name: "coj",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/coj.png",
  },
  {
    size: "45x45",
    name: "cop",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/cop.png",
  },
  {
    size: "45x45",
    name: "coq",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/coq.png",
  },
  {
    size: "45x45",
    name: "cor",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/cor.png",
  },
  {
    size: "45x45",
    name: "cot",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/cot.png",
  },
  {
    size: "45x45",
    name: "cox",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/cox.png",
  },
  {
    size: "45x45",
    name: "coz",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/coz.png",
  },
  {
    size: "45x45",
    name: "cp2",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/cp2.png",
  },
  {
    size: "45x45",
    name: "cp3",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/cp3.png",
  },
  {
    size: "45x45",
    name: "cp7",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/cp7.png",
  },
  {
    size: "45x45",
    name: "cp8",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/cp8.png",
  },
  {
    size: "45x45",
    name: "cpc",
    url: "https://cdn.jsdelivr.net/gh/RitterHou/tieba_mobile_emotions/douyin/cpc.png",
  },
  // 小真寻
  {
    size: "116x100",
    name: "求求你啦",
    url: "https://static.flss.world/api/image.php?gif-packet=1&no=001",
  },
  {
    size: "116x100",
    name: "布吉岛诶",
    url: "https://static.flss.world/api/image.php?gif-packet=1&no=002",
  },
  {
    size: "116x100",
    name: "愉悦",
    url: "https://static.flss.world/api/image.php?gif-packet=1&no=003",
  },
  {
    size: "116x100",
    name: "啊嘿",
    url: "https://static.flss.world/api/image.php?gif-packet=1&no=004",
  },
  {
    size: "116x100",
    name: "一起吃瓜",
    url: "https://static.flss.world/api/image.php?gif-packet=1&no=005",
  },
  {
    size: "116x100",
    name: "心心",
    url: "https://static.flss.world/api/image.php?gif-packet=1&no=006",
  },
  {
    size: "116x100",
    name: "嘻嘻嘻",
    url: "https://static.flss.world/api/image.php?gif-packet=1&no=007",
  },
  {
    size: "116x100",
    name: "思考中",
    url: "https://static.flss.world/api/image.php?gif-packet=1&no=008",
  },
  {
    size: "116x100",
    name: "请多关照",
    url: "https://static.flss.world/api/image.php?gif-packet=1&no=009",
  },
  {
    size: "116x100",
    name: "少蹬鼻子上脸",
    url: "https://static.flss.world/api/image.php?gif-packet=1&no=010",
  },
  {
    size: "116x100",
    name: "空调已开启",
    url: "https://static.flss.world/api/image.php?gif-packet=1&no=011",
  },
  {
    size: "116x100",
    name: "喂 在吗",
    url: "https://static.flss.world/api/image.php?gif-packet=1&no=012",
  },
  {
    size: "116x100",
    name: "荣幸至极",
    url: "https://static.flss.world/api/image.php?gif-packet=1&no=013",
  },
  {
    size: "116x100",
    name: "还没好",
    url: "https://static.flss.world/api/image.php?gif-packet=1&no=014",
  },
  {
    size: "116x100",
    name: "稍等片刻",
    url: "https://static.flss.world/api/image.php?gif-packet=1&no=015",
  },
  {
    size: "116x100",
    name: "啊啦",
    url: "https://static.flss.world/api/image.php?gif-packet=1&no=016",
  },
  {
    size: "116x100",
    name: "摸鱼",
    url: "https://static.flss.world/api/image.php?gif-packet=1&no=017",
  },
  {
    size: "116x100",
    name: "肚肚饿饿",
    url: "https://static.flss.world/api/image.php?gif-packet=1&no=018",
  },
  {
    size: "116x100",
    name: "凝视",
    url: "https://static.flss.world/api/image.php?gif-packet=1&no=019",
  },
  {
    size: "116x100",
    name: "心塞",
    url: "https://static.flss.world/api/image.php?gif-packet=1&no=020",
  },
  {
    size: "116x100",
    name: "哟",
    url: "https://static.flss.world/api/image.php?gif-packet=1&no=021",
  },
  {
    size: "116x100",
    name: "不吉",
    url: "https://static.flss.world/api/image.php?gif-packet=1&no=022",
  },
  {
    size: "116x100",
    name: "哎呀呀",
    url: "https://static.flss.world/api/image.php?gif-packet=1&no=023",
  },
  {
    size: "116x100",
    name: "喵",
    url: "https://static.flss.world/api/image.php?gif-packet=1&no=024",
  },
  {
    size: "116x100",
    name: "这是秘密",
    url: "https://static.flss.world/api/image.php?gif-packet=1&no=025",
  },
  {
    size: "116x100",
    name: "好成熟",
    url: "https://static.flss.world/api/image.php?gif-packet=1&no=026",
  },
  {
    size: "116x100",
    name: "闪亮",
    url: "https://static.flss.world/api/image.php?gif-packet=1&no=027",
  },
  {
    size: "116x100",
    name: "围观",
    url: "https://static.flss.world/api/image.php?gif-packet=1&no=028",
  },
  {
    size: "116x100",
    name: "谢谢",
    url: "https://static.flss.world/api/image.php?gif-packet=1&no=029",
  },
  {
    size: "116x100",
    name: "震惊",
    url: "https://static.flss.world/api/image.php?gif-packet=1&no=030",
  },
  {
    size: "116x100",
    name: "差不多得了",
    url: "https://static.flss.world/api/image.php?gif-packet=1&no=031",
  },
  {
    size: "116x100",
    name: "真差劲",
    url: "https://static.flss.world/api/image.php?gif-packet=1&no=032",
  },
  {
    size: "116x100",
    name: "针不戳",
    url: "https://static.flss.world/api/image.php?gif-packet=1&no=033",
  },
  {
    size: "116x100",
    name: "诶呀",
    url: "https://static.flss.world/api/image.php?gif-packet=1&no=034",
  },
  {
    size: "116x100",
    name: "好棒啊",
    url: "https://static.flss.world/api/image.php?gif-packet=1&no=035",
  },
  {
    size: "116x100",
    name: "很棒",
    url: "https://static.flss.world/api/image.php?gif-packet=1&no=036",
  },
  {
    size: "116x100",
    name: "不可以",
    url: "https://static.flss.world/api/image.php?gif-packet=1&no=037",
  },
  {
    size: "116x100",
    name: "有事吗",
    url: "https://static.flss.world/api/image.php?gif-packet=1&no=038",
  },
  {
    size: "116x100",
    name: "GOOD",
    url: "https://static.flss.world/api/image.php?gif-packet=1&no=039",
  },
  {
    size: "116x100",
    name: "羊",
    url: "https://static.flss.world/api/image.php?gif-packet=1&no=040",
  },
  {
    size: "116x100",
    name: "到家咯",
    url: "https://static.flss.world/api/image.php?gif-packet=2&no=01",
  },
  {
    size: "116x100",
    name: "哇伊",
    url: "https://static.flss.world/api/image.php?gif-packet=2&no=02",
  },
  {
    size: "116x100",
    name: "好不讲理",
    url: "https://static.flss.world/api/image.php?gif-packet=2&no=03",
  },
  {
    size: "116x100",
    name: "对不起啦",
    url: "https://static.flss.world/api/image.php?gif-packet=2&no=04",
  },
  {
    size: "116x100",
    name: "?",
    url: "https://static.flss.world/api/image.php?gif-packet=2&no=05",
  },
  {
    size: "116x100",
    name: "哥强吧",
    url: "https://static.flss.world/api/image.php?gif-packet=2&no=06",
  },
  {
    size: "116x100",
    name: "迷茫",
    url: "https://static.flss.world/api/image.php?gif-packet=2&no=07",
  },
  {
    size: "116x100",
    name: "生气",
    url: "https://static.flss.world/api/image.php?gif-packet=2&no=08",
  },
  {
    size: "116x100",
    name: "快去睡觉",
    url: "https://static.flss.world/api/image.php?gif-packet=2&no=09",
  },
  {
    size: "116x100",
    name: "我睡了",
    url: "https://static.flss.world/api/image.php?gif-packet=2&no=10",
  },
  {
    size: "116x100",
    name: "早啊",
    url: "https://static.flss.world/api/image.php?gif-packet=2&no=11",
  },
  {
    size: "116x100",
    name: "呜嘤嘤",
    url: "https://static.flss.world/api/image.php?gif-packet=2&no=12",
  },
  {
    size: "116x100",
    name: "喵",
    url: "https://static.flss.world/api/image.php?gif-packet=2&no=13",
  },
  {
    size: "116x100",
    name: "好可爱",
    url: "https://static.flss.world/api/image.php?gif-packet=2&no=14",
  },
  {
    size: "116x100",
    name: "呜嘿嘿",
    url: "https://static.flss.world/api/image.php?gif-packet=2&no=15",
  },
  {
    size: "116x100",
    name: "Zzz",
    url: "https://static.flss.world/api/image.php?gif-packet=2&no=16",
  },
  {
    size: "116x100",
    name: "赞",
    url: "https://static.flss.world/api/image.php?gif-packet=2&no=17",
  },
  {
    size: "116x100",
    name: "再见啦",
    url: "https://static.flss.world/api/image.php?gif-packet=2&no=18",
  },
  {
    size: "116x100",
    name: "保密",
    url: "https://static.flss.world/api/image.php?gif-packet=2&no=19",
  },
  {
    size: "116x100",
    name: "交给我吧",
    url: "https://static.flss.world/api/image.php?gif-packet=2&no=20",
  },
  {
    size: "116x100",
    name: "哦吼",
    url: "https://static.flss.world/api/image.php?gif-packet=2&no=21",
  },
  {
    size: "116x100",
    name: "AWSL",
    url: "https://static.flss.world/api/image.php?gif-packet=2&no=22",
  },
  {
    size: "116x100",
    name: "可不是嘛",
    url: "https://static.flss.world/api/image.php?gif-packet=2&no=23",
  },
  {
    size: "116x100",
    name: "你这大懒蛋",
    url: "https://static.flss.world/api/image.php?gif-packet=2&no=24",
  },
];

setInterval(() => {
  var editor = document.querySelector(".d-editor-button-bar");
  if (!document.querySelector(".emoji-picker-button") && editor) {
    var emojiButton = document.createElement("button");
    emojiButton.classList.add(
      "btn",
      "no-text",
      "btn-icon",
      "emoji",
      "emoji-picker-button"
    );
    emojiButton.title = "插入贴吧表情包";
    emojiButton.innerHTML =
      "<svg class='fa d-icon d-icon-far-smile svg-icon svg-string' xmlns='http://www.w3.org/2000/svg'><use href='#far-smile'></use></svg>";
    editor.appendChild(emojiButton);
    emojiButton.addEventListener("click", function () {
      var emojiPicker = document.createElement("div");
      emojiPicker.className = "emojiPicker";
      var recentEmojiHtml = recentEmoji
        .map(
          (emo) =>
            `<img style="background-color: #e2e6ec;" title="最近使用过的表情" src="${emo.url}" name="${emo.name}" url="${emo.url}" alt="${emo.size}" onclick="insertEmoji(event)"/>`
        )
        .join("");
      var emojiSetHtml = emojiSet
        .map(
          (emo) =>
            `<img src="${emo.url}" name="${emo.name}" url="${emo.url}" alt="${emo.size}" onclick="insertEmoji(event)"/>`
        )
        .join("");
      emojiPicker.innerHTML = recentEmojiHtml + emojiSetHtml;
      emojiPicker.style.position = "absolute";
      emojiPicker.style.background = "#FFF";
      emojiPicker.style.border = "1px solid #ddd";
      emojiPicker.style.padding = "10px";
      if (document.body.contains(document.querySelector(".emojiPicker"))) {
        document.querySelector(".emojiPicker").remove();
      } else {
        emojiButton.after(emojiPicker);
      }
      emojiPicker.addEventListener("click", function (e) {
        if (e.target.tagName === "IMG") {
          var textArea = document.querySelector(".d-editor-input");
          if (!textArea) {
            alert("找不到输入框");
            return;
          }
          var emojiMarkdown = `![${e.target.name}|${e.target.alt}](${e.target.src})`;
          addRecentEmoji({ size: e.target.alt, name: e.target.name, url: e.target.src });

          // 在光标位置插入表情包
          var startPos = textArea.selectionStart;
          var endPos = textArea.selectionEnd;
          textArea.value =
            textArea.value.substring(0, startPos) +
            emojiMarkdown +
            textArea.value.substring(endPos, textArea.value.length);
          // 触发输入事件
          var event = new Event("input", {
            bubbles: true,
            cancelable: true,
          });
          textArea.dispatchEvent(event);
          // 隐藏选择器
          emojiPicker.remove();
        }
      });
    });
  }
}, 100);
export default {};
</script>

<style lang="less">
.emojiPicker {
  top: 0;
  left: 100%;
  position: absolute;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 10px;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 10px;
  border-radius: 5px;

  img {
    cursor: pointer;
    width: 50px;
    height: 50px;
  }
}
</style>
