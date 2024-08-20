const calcTime = (timestamp) => {
  const curTime = new Date().getTime() - 9 * 60 * 60 * 1000; // 시간대 조정
  const timeDiff = curTime - timestamp;
  const time = new Date(timeDiff);
  const hour = time.getUTCHours();
  const minute = time.getUTCMinutes();
  const second = time.getUTCSeconds();

  if (hour > 0) return `${hour}시간 전`;
  if (minute > 0) return `${minute}분 전`;
  if (second > 0) return `${second}초 전`;
  return "방금 전";
};

const renderData = async (data) => {
  const main = document.querySelector("main");

  data.reverse().forEach(async (obj) => {
    const div = document.createElement("div");
    div.className = "item-list";

    const imgDiv = document.createElement("div");
    imgDiv.className = "item-list__img";

    const img = document.createElement("img");
    img.alt = obj.title; // 접근성을 위해 alt 속성 추가
    try {
      const res = await fetch(`/images/${obj.id}`);
      if (!res.ok) throw new Error(`이미지 로딩 실패: ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      img.src = url;
    } catch (error) {
      console.error("이미지 로딩 에러:", error);
      img.src = "/path/to/placeholder/image.png"; // 이미지 로딩 실패 시 대체 이미지 사용
    }

    const infoDiv = document.createElement("div");
    infoDiv.className = "item-list__info";

    const infoTitleDiv = document.createElement("div");
    infoTitleDiv.className = "item-list__info-title";
    infoTitleDiv.innerText = obj.title;

    const infoMetaDiv = document.createElement("div");
    infoMetaDiv.className = "item-list__info-meta";
    infoMetaDiv.innerText = `${obj.place} ${calcTime(obj.insertAt)}`;

    const infoPriceDiv = document.createElement("div");
    infoPriceDiv.className = "item-list__info-price";
    infoPriceDiv.innerText = obj.price;

    infoDiv.appendChild(infoTitleDiv);
    infoDiv.appendChild(infoMetaDiv);
    infoDiv.appendChild(infoPriceDiv);
    imgDiv.appendChild(img);
    div.appendChild(imgDiv);
    div.appendChild(infoDiv);
    main.appendChild(div);
  });
};

const fetchList = async () => {
  try {
    const res = await fetch("/items");
    if (!res.ok) throw new Error(`아이템 목록 로딩 실패: ${res.status}`);
    const data = await res.json();
    renderData(data);
  } catch (error) {
    console.error("아이템 목록 로딩 에러:", error);
    // 에러 처리 로직 추가 가능
  }
};

fetchList();
