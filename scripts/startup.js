/* Main Variables */
let uploadData = { name: "", url: "", tags: [], media: {}, optID: "" };

let showAllTags = false, openMediaBtns = 1;

/* Setup */
function setupBtnFncs() {
  const allHoverTxts = document.querySelectorAll(`i[class="hover-desc"]`);

  // Meta Inputs
  const productName = document.querySelector(`input[id="name"]`);
  productName.addEventListener("change", (e) => { uploadData.name = e.target.value });

  const productUrl = document.querySelector(`input[id="url"]`);
  productUrl.addEventListener("change", (e) => { uploadData.url = e.target.value });

  // Tags
  const allTags = document.querySelectorAll(`div[class="promo-tag"]`);
  allTags.forEach((tag) => {
    tag.addEventListener("click", (e) => {
      const tagName = tag.children[1].textContent;
      if (e.target.tagName === "SPAN") tag.children[0].checked = !tag.children[0].checked;
      else if (e.target.tagName === "DIV") return;

      if (tag.children[0].checked) uploadData.tags.push(tagName);
      else uploadData.tags.splice(uploadData.tags.indexOf(tagName), 1);
      e.stopPropagation();
    });
  });

  const showMore = allHoverTxts[0];
  showMore.addEventListener("click", (e) => {
    showAllTags = !showAllTags;
    refreshTagList();
    e.stopPropagation();
  });

  // Media Inputs
  const guidelines = allHoverTxts[1];
  guidelines.addEventListener("click", (e) => {
    showMediaRules();
    e.stopPropagation();
  });

  const sampleMediaBar = document.querySelector(`div[class="media-ctrl"]`);
  const mediaBar = sampleMediaBar.cloneNode(true);
  sampleMediaBar.style.display = "none";
  sampleMediaBar.insertAdjacentElement("afterend", mediaBar);
  mediaBarSetup(mediaBar);

  // Opt Ping Input
  const optPing = document.querySelector(`input[id="pingID"]`);
  optPing.addEventListener("change", (e) => { uploadData.optID = e.target.value });
}

/* GUI Utils */
function refreshTagList() {
  const allTags = document.querySelectorAll(`div[class="promo-tag"]`);
  for (let i = 20; i < allTags.length; i++) allTags[i].style.display = showAllTags ? "" : "none";

  const hoverTxt = document.querySelector(`i[class="hover-desc"]`);
  if (showAllTags) hoverTxt.textContent = "...See Less";
  else hoverTxt.textContent = "...See More";
}

function showLoadingGUI() {
  const css = document.createElement("link");
  css.setAttribute("rel", "stylesheet");
  css.setAttribute("href", "css/loader.css");
  document.head.appendChild(css);
  
  const holder = document.createElement("div");
  holder.classList.add("overlay");
  const loadCirc = document.createElement("div");
  loadCirc.classList.add("load-circle");
  loadCirc.innerHTML = `<img width="200" src="assets/loader.svg" draggable="false">`;

  holder.appendChild(loadCirc);
  document.body.appendChild(holder);
  return holder;
}

function showMediaRules() {
  const css = document.createElement("link");
  css.setAttribute("rel", "stylesheet");
  css.setAttribute("href", "css/guidelines.css");
  document.head.appendChild(css);
  
  const holder = document.createElement("div");
  holder.classList.add("overlay");
  const inner = document.createElement("div");
  inner.classList.add("guideline-inner");
  inner.innerHTML = `
    <u class="header">Promotion Media Guidelines</u>
    <div class="exit-btn"><img width="20" src="assets/exit.svg" draggable="false"></div>
    <div class="title">-= General Rules =-</div>
    <div class="gdesc">
      <ul class="list">
        <li>All Files must be 10MB or Under</li>
        <li>Promotions must be Appropriate</li>
        <li>Promotions will be Active for Approximately 2 Weeks after being Approved by a Team Member</li>
      </ul>
    </div>
    <div class="title">-= Rules for Image Promotions =-</div>
    <div class="gdesc">
      <ul class="list">
        <li>Accepted Image Formats: PNG, JPG, JPEG, SVG</li>
        <li>Acceptable Aspect Ratios: 250x250, 300x250, 480x270, 300x50, 50x300, 360x120, 120x360
      </ul>
    </div>
    <div class="title">-= Rules for Video Promotions =-</div>
    <div class="gdesc">
      <ul class="list">
        <li>Accepted Video Formats: MP4</li>
        <li>Acceptable Aspect Ratios: 1:1, 4:3, 4:5, 16:9, 9:16</li>
        <li>Mandatory Video Length: 5s, 10s, 15s, 30s</li>
      </ul>
    </div>
    <div class="title">-= Rules for HTML Promotions =-</div>
    <div class="list">...Coming Soon</div>
  `;

  inner.querySelector(`div[class="exit-btn"]`).addEventListener("click", (e) => {
    const anim = inner.animate(
      [{ transform: "translate(-50%, -50%) scale(1)" }, { transform: "translate(-50%, -50%) scale(0)" }], { duration: 250, easing: "ease-in" }
    );
    anim.onfinish = () => {
      css.remove();
      holder.remove();
    };
    e.stopPropagation();
  });

  holder.appendChild(inner);
  document.body.appendChild(holder);
  inner.animate(
    [{ transform: "translate(-50%, -50%) scale(0)" }, { transform: "translate(-50%, -50%) scale(1)" }], { duration: 300, easing: "ease-in-out" }
  );
}

function showMediaEditor(namespace, fileType) {
  const media = uploadData.media[namespace];
  
  const css = document.createElement("link");
  css.setAttribute("rel", "stylesheet");
  css.setAttribute("href", "css/media-editor.css");
  document.head.appendChild(css);
  
  const holder = document.createElement("div");
  holder.classList.add("overlay");
  const editor = document.createElement("div");
  editor.classList.add("editor");
  editor.innerHTML = `
    <div class="header">Promotion Media Editor</div>
    <div class="exit-btn"><img width="20" src="assets/exit.svg" draggable="false"></div>
    <div class="media-holder">
      ${ fileType === "mp4" ? 
        `<video class="video-media" src="${media.d}"></video>` : `<canvas class="image-media"></canvas>`
      }
    </div>
    <div class="title">Aspect Ratio</div>
    <div class="selector-ui">
      <select>
        <option value="" selected disabled hidden>Choose Scale</option>
        ${ fileType === "mp4" ? `
          <option value="1">1:1</option>
          <option value="2">4:3</option>
          <option value="3">4:5</option>
          <option value="4">16:9</option>
          <option value="5">9:16</option>
        ` : `
          <option value="[250,250]">250x250</option>
          <option value="[300,250]">300x250</option>
          <option value="[480,270]">480x270</option>
          <option value="[300,50]">300x50</option>
          <option value="[50,300]">50x300</option>
          <option value="[360,120]">360x120</option>
          <option value="[120,360]">120x360</option>
        `
        }
      </select>
    </div>
    <div class="title">Important Checks</div>
    <div class="box">
      <img width="20" src="assets/bad.svg" draggable="false">
      <img width="20" src="assets/good.svg" draggable="false">
      <span class="check-desc">Aspect Ratio Selected</span>
    </div>
    ${ fileType === "mp4" ? `<div class="box">
      <img width="20" src="assets/bad.svg" draggable="false">
      <img width="20" src="assets/good.svg" draggable="false">
      <span class="check-desc">Video Length in Range</span>
    </div>` : ""
    }
  `;

  editor.querySelector(`div[class="exit-btn"]`).addEventListener("click", (e) => {
    const anim = editor.animate(
      [{ transform: "translate(-50%, -50%) scale(1)" }, { transform: "translate(-50%, -50%) scale(0)" }], { duration: 250, easing: "ease-in" }
    );
    anim.onfinish = () => {
      css.remove();
      holder.remove();
    };
    e.stopPropagation();
  });

  holder.appendChild(editor);
  document.body.appendChild(holder);
  editor.animate(
    [{ transform: "translate(-50%, -50%) scale(0)" }, { transform: "translate(-50%, -50%) scale(1)" }], { duration: 300, easing: "ease-in-out" }
  );
}

/* Internal Utils */
function toFixedType(fileType) {
  switch (fileType) {
    case "image/svg+xml": return "svg";
    case "image/png": return "png";
    case "image/jpg":
    case "image/jpeg": return "jpeg";
    case "video/mp4": return "mp4";
    // TODO add HTML when implemented
    default: return undefined;
  }  
}

function generateID() {
  const soup = "!?@#%*+-~_=,.:;[]{}()^/|ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const id = [];
  for (let i = 0; i < 15; i++) { id[i] = soup.charAt(Math.random() * soup.length) }
  return id.join("");
}

function generateDate() {
  const d = new Date();
  const hr = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()} ${hr}:${min}`;
}

function constructPost() {
  let url = "https://...";
  url += `&upload-id=${encodeURIComponent(generateID())}&date=${encodeURIComponent(generateDate())}`;
  url += `&product-name=${encodeURIComponent(uploadData.name)}&product-name=${encodeURIComponent(uploadData.url)}`;
  url += `&tags=${encodeURIComponent(JSON.stringify(uploadData.tags))}&media=${encodeURIComponent(JSON.stringify(uploadData.media))}`;
  url += `&opt-ping-id=${uploadData.optID || "0"}`;
  return url;
}

function mediaBarSetup(bar) {
  bar.style.display = ""; // we always use the empty sample element
  const mediaBtns = bar.children;
  mediaBtns[0].addEventListener("click", (e) => {
    delete uploadData.media[mediaBtns[1].textContent];
    const parent = e.target.parentNode;
    if (parent.previousElementSibling.previousElementSibling.tagName !== "I") {
      openMediaBtns--;
      parent.remove();
    } else mediaBtns[1].textContent = "Upload Media";
    e.stopPropagation();
  });
  mediaBtns[3].addEventListener("click", (e) => {
    if (openMediaBtns > 2) return alert("You can only Upload 3 Promotions at a Time")
    const newBar = document.querySelector(`div[class="media-ctrl"]`).cloneNode(true);
    mediaBarSetup(newBar);
    openMediaBtns++;
    bar.insertAdjacentElement("afterend", newBar);
    e.stopPropagation();
  });

  const fileLabel = bar.querySelector(`div[class="media-file"]`);
  fileLabel.addEventListener("click", () => fileBtn.click());

  const fileBtn = bar.querySelector(`input[id="file-input"]`);
  fileBtn.setAttribute("required", "true");
  fileBtn.setAttribute("name", "media");
  fileBtn.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const type = toFixedType(file.type);
      if (type === undefined) {
        e.target.value = "";
        return alert("Unsupported File Type! Please Read the Guidelines");
      }
      if (file.size > 10000000) {
        e.target.value = "";
        return alert("File Size Exceeds the 10MB Limit!");
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        fileLabel.textContent = file.name;
        uploadData.media[file.name] = { t: type, d: reader.result };
        showMediaEditor(file.name, type);
      };
      reader.onerror = (err) => { console.warn(err) };
    }
  });
}

document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (e.target.checkValidity()) {
    console.log("Submitting Data...");
    const loadScreen = showLoadingGUI();
    const urlData = constructPost();
    // TODO send post, then end loadScreen, prevent submit button from working again
  }
});
document.addEventListener("DOMContentLoaded", () => {
  setupBtnFncs();
  refreshTagList();
});
