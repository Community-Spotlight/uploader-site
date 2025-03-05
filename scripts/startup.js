/* Main Variables */
let uploadData = { name: "", url: "", tags: [], media: {}, optID: "" };

let showAllTags = false, hasSubmitted = false, openMediaBtns = 1;

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
  loadCirc.innerHTML = `<img width="200" src="https://raw.githubusercontent.com/Community-Spotlight/assets/refs/heads/main/loader.svg" draggable="false">`;

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
  const heightOffset = document.createElement("div");
  heightOffset.style.height = "140vh";
  const inner = document.createElement("div");
  inner.classList.add("guideline-inner");
  inner.innerHTML = `
    <u class="header">Promotion Media Guidelines</u>
    <div class="exit-btn"><img width="20" src="https://raw.githubusercontent.com/Community-Spotlight/assets/refs/heads/main/exit.svg" draggable="false"></div>
    <div class="gtext-box"><b>Important:</b> Accepted Promotions will be active for 2 Weeks after being Approved by a Team Member</div>
    <div class="title">-= General Rules =-</div>
    <div class="gdesc">
      <ul class="list">
        <li>All Promotional Media <b>must</b> be 10MB or Under</li>
        <li>Promotions <b>must</b> be Appropriate</li>
        <li>NSFW/Racism/Homophobia/Spam is <b>not</b> allowed</li>
        <li>Viruses, Trojans, and other Malware are <b>not</b> allowed</li>
        <li>Copyrighted Content is <b>not</b> allowed unless Permission is granted by the Copyright Owner</li>
      </ul>
    </div>
    <div class="title">-= Rules for Image Promotions =-</div>
    <div class="gdesc">
      <ul class="list">
        <li><b>Accepted Formats:</b> PNG, JPG, JPEG, SVG</li>
        <li><b>Accepted Aspect Ratios:</b> 250x250, 300x250, 480x270, 300x50, 50x300, 360x120, 120x360</li>
      </ul>
    </div>
    <div class="title">-= Rules for Video Promotions =-</div>
    <div class="gdesc">
      <ul class="list">
        <li><b>Accepted Formats:</b> MP4</li>
        <li><b>Accepted Aspect Ratios:</b> 1:1, 4:3, 4:5, 16:9, 9:16</li>
        <li><b>Mandatory Video Length:</b> 5s, 10s, 15s, 30s</li>
      </ul>
    </div>
    <div class="title">-= Rules for HTML Promotions =-</div>
    <div class="gdesc">
      <ul class="list">
        <li><b>Accepted Aspect Ratios:</b> 1:1, 4:3, 4:5, 16:9, 9:16</li>
        <li>Popups, Downloads, or Code that modifies the outter DOM is <b>not</b> allowed</li>
        <li>Tracking/use of Local Storage is <b>not</b> allowed</li>
        <li>All Audio/Video <b>must</b> be User-Initiated or Muted by default</li>
      </ul>
    </div>
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

  holder.append(inner, heightOffset);
  document.body.appendChild(holder);
  inner.animate(
    [{ transform: "translate(-50%, -50%) scale(0)" }, { transform: "translate(-50%, -50%) scale(1)" }], { duration: 300, easing: "ease-in-out" }
  );
}

function showMediaEditor(namespace, fileType) {
  let canSubmit = false;
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
    <u class="header">Promotion Media Editor</u>
    <div class="media-holder">
      ${ fileType === "mp4" ?
        `<video class="video-media" src="${media.d}" controls></video>` :
        fileType === "html" ? `<iframe class="html-media" src="${media.d}"></iframe>` :
        fileType === "svg" ? `<div class="image-media">${compressSVG(media.d)}</div>` :
        `<canvas class="image-media"></canvas>`
      }
    </div>
    ${ fileType === "mp4"? "" : `
      <div class="title">Aspect Ratio</div>
      <div class="selector-ui">
        <select>
          ${ fileType === "html" ? `
            <option value="" selected disabled hidden>Choose Scale</option>
            <option value="[150,150]">1:1</option>
            <option value="[240,180]">4:3</option>
            <option value="[240,300]">4:5</option>
            <option value="[360,202.5]">16:9</option>
            <option value="[202.5,360]">9:16</option>
          ` : `
            <option value="" selected disabled hidden>Choose Scale</option>
            <option value="[250,250]">250x250</option>
            <option value="[300,250]">300x250</option>
            <option value="[480,270]">480x270</option>
            <option value="[300,50]">300x50</option>
            <option value="[50,300]">50x300</option>
            <option value="[360,120]">360x120</option>
            <option value="[120,360]">120x360</option>`
          }
        </select>
      </div>
    `
    }
    <div class="title">Required Checks</div>
    ${ fileType === "mp4" ? `
      <div class="box">
        <img width="20" src="https://raw.githubusercontent.com/Community-Spotlight/assets/refs/heads/main/bad.svg" draggable="false">
        <img width="20" src="https://raw.githubusercontent.com/Community-Spotlight/assets/refs/heads/main/good.svg" draggable="false" style="display: none">
        <span class="check-desc">Aspect Ratio Allowed</span>
      </div>
      <div class="box">
        <img width="20" src="https://raw.githubusercontent.com/Community-Spotlight/assets/refs/heads/main/bad.svg" draggable="false">
        <img width="20" src="https://raw.githubusercontent.com/Community-Spotlight/assets/refs/heads/main/good.svg" draggable="false" style="display: none">
        <span class="check-desc">Video Length in Range</span>
      </div>` : `
      <div class="box">
        <img width="20" src="https://raw.githubusercontent.com/Community-Spotlight/assets/refs/heads/main/bad.svg" draggable="false">
        <img width="20" src="https://raw.githubusercontent.com/Community-Spotlight/assets/refs/heads/main/good.svg" draggable="false" style="display: none">
        <span class="check-desc">Aspect Ratio Selected</span>
      </div>
      `
    }
    <button class="media-submit" style="background: linear-gradient(125deg, #ff3b3b, #bd0202); border: solid 3px #910000; -webkit-text-stroke: 1px #910000;">Cancel</button>
  `;

  const submitBtn = editor.querySelector(`button[class="media-submit"]`);
  const testRequirements = () => {
    if (
      allCheckers[0].children[0].style.display === "none" &&
      (fileType === "mp4" ? allCheckers[1].children[0].style.display === "none" : true)
    ) {
      canSubmit = true;
      submitBtn.style = "";
      submitBtn.textContent = "Submit";
    }
  };
  submitBtn.addEventListener("click", (e) => {
    if (!canSubmit) delete uploadData.media[namespace];
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

  const allCheckers = editor.querySelectorAll(`div[class="box"]`);
  if (fileType === "mp4") {
    const video = editor.querySelector(`div[class="media-holder"] video`);
    video.addEventListener("loadedmetadata", () => {
      // check if the video aspect ratio is valid
      //// we cant reliably set the video aspect ratio... so make our users do it
      const videoAspectRatio = (w, h) => {
        let gcd = (a, b) => { return b ? gcd(b, a % b) : a };
        gcd = gcd(w, h);
        return `${w / gcd}:${h / gcd}`;
      }

      const commonRatios = ["1:1", "4:3", "4:5", "16:9", "9:16"];
      const vidRatio = videoAspectRatio(video.videoWidth, video.videoHeight);

      const ratioChildren = allCheckers[0].children;
      if (commonRatios.indexOf(vidRatio) > -1) {
        ratioChildren[0].style.display = "none";
        ratioChildren[1].style.display = "";
        media.d = media.d.split(",")[1];
      } else {
        ratioChildren[2].style.color = "pink";
      }

      // check if the video length is valid
      const lengthChildren = allCheckers[1].children;
      const length = Math.floor(video.duration);
      if (length === 5 || length === 10 || length === 15 || length === 30) {
        lengthChildren[0].style.display = "none";
        lengthChildren[1].style.display = "";
      } else {
        lengthChildren[2].style.color = "pink";
      }
      testRequirements();
    });
  } else {
    if (fileType === "svg") {
      const svg = editor.querySelector(`div[class="media-holder"] svg`);
      svg.setAttribute("preserveAspectRatio", "none");

      editor.querySelector(`div[class="selector-ui"] select`).addEventListener("change", (e) => {
        const children = allCheckers[0].children;
        children[0].style.display = "none";
        children[1].style.display = "";
        const value = JSON.parse(e.target.value);
        svg.setAttribute("width", value[0]);
        svg.setAttribute("height", value[1]);

        media.d = btoa(svg.outerHTML);
        testRequirements();
        e.stopPropagation();
      });
    } else if (fileType === "html") {
      const iframe = editor.querySelector(`div[class="media-holder"] iframe`);
      const ogHTML = media.d.split(",")[1];

      editor.querySelector(`div[class="selector-ui"] select`).addEventListener("change", (e) => {
        const children = allCheckers[0].children;
        children[0].style.display = "none";
        children[1].style.display = "";
        const value = JSON.parse(e.target.value);
        media.d = btoa(`<!-- CS META: ${value[0]},${value[1]} -->`) + ogHTML;
        iframe.style.width = value[0];
        iframe.style.height = value[1];

        testRequirements();
        e.stopPropagation();
      });
    } else {
      const canvas = editor.querySelector(`div[class="media-holder"] canvas`);
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.onerror = (e) => { console.warn(e) };
      img.src = media.d;

      editor.querySelector(`div[class="selector-ui"] select`).addEventListener("change", (e) => {
        const children = allCheckers[0].children;
        children[0].style.display = "none";
        children[1].style.display = "";
        const value = JSON.parse(e.target.value);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = value[0];
        canvas.height = value[1];
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        media.d = canvas.toDataURL().split(",")[1];
        testRequirements();
        e.stopPropagation();
      });
    }
  }
}

/* Internal Utils */
function toFixedType(fileType) {
  switch (fileType) {
    case "image/svg+xml": return "svg";
    case "image/png": return "png";
    case "image/jpg":
    case "image/jpeg": return "jpeg";
    case "video/mp4": return "mp4";
    case "text/html": return "html";
    default: return undefined;
  }
}

function generateID() {
  const soup = "!?@#*+-~_=:;[]{}()^|ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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

function encodeTxt(txt) {
  let encoded = [];
  for (let i = 0; i < txt.length; i++) encoded.push(txt.charCodeAt(i));
  return btoa(encoded.join(","));
}

async function constructPost() {
  const id = generateID(), date = generateDate();

  // compress data
  const fixedTags = encodeTxt(uploadData.tags.join(","));
  const fixedName = encodeTxt(uploadData.name);
  const fixedUrl = encodeTxt(uploadData.url);

  // send media to file servers
  let fixedMedia = await uploadFiles(uploadData.media, id);
  if (fixedMedia.length === 0) return ""; // shouldnt happen
  fixedMedia = JSON.stringify(fixedMedia);

  let url = "https://script.google.com/macros/s/AKfycbwb49wDXQjOBxtGfjg-bpyMXckewOntlqIyqZejA8MkEUu7I7juDctKLbMXrf6IBjUc-w/exec?gid=0";
  url += `&upload-id=${encodeURIComponent(id)}&date=${encodeURIComponent(date)}`;
  url += `&product-name=${encodeURIComponent(fixedName)}&product-url=${encodeURIComponent(fixedUrl)}`;
  url += `&tags=${encodeURIComponent(fixedTags)}&media=${encodeURIComponent(fixedMedia)}`;
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
    if (openMediaBtns > 4) return alert("You can only Upload 5 Promotions at a Time");
    const newBar = document.querySelector(`div[class="media-ctrl"]`).cloneNode(true);
    mediaBarSetup(newBar);
    openMediaBtns++;
    bar.insertAdjacentElement("afterend", newBar);
    e.stopPropagation();
  });

  const fileLabel = bar.querySelector(`div[class="media-file"]`);
  fileLabel.addEventListener("click", () => {
    fileLabel.removeAttribute("style");
    fileBtn.click();
  });

  const fileBtn = bar.querySelector(`input[id="file-input"]`);
  fileBtn.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      e.target.value = "";
      // delete old media if different
      if (fileLabel.textContent !== file.name) delete uploadData.media[fileLabel.textContent];

      const type = toFixedType(file.type);
      if (type === undefined) return alert("Unsupported File Type! Please Read the Guidelines");
      if (file.size > 10000000) return alert("File Size Exceeds the 10MB Limit!");
      const reader = new FileReader();
      if (type === "svg") reader.readAsText(file);
      else reader.readAsDataURL(file);
      reader.onload = () => {
        fileLabel.textContent = file.name;
        uploadData.media[file.name] = { t: type, d: reader.result };
        showMediaEditor(file.name, type);
      };
      reader.onerror = (err) => { console.warn(err) };
    }
  });
}

function compressSVG(svg) {
  return svg
    .replace(/data-paper-data="[^"]*" /g, "").replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<title>[\s\S]*?<\/title>/g, "").replace(/<desc>[\s\S]*?<\/desc>/g, "")
    .replaceAll("#000000", "#000").replaceAll("#ffffff", "#fff").replaceAll("#00000000", "none")
    .replace("svg version=\"1.1\" ", "svg ").replace(/<metadata>[\s\S]*?<\/metadata>/g, "")
    .replace(/<\?xml[\s\S]*?\?>/g, "").replace(/(\d+)\.0+(?!\d)/g, "$1").replace(/(\d+\.\d*?)0+(?!\d)/g, "$1")
    .replace(/<g>\s*<\/g>/g, "").replace(/\s*style=""/g, "")
    .replace(/>\s+</g, "><").replace(/\s+$/g, "").trim();
}

document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (Object.keys(uploadData.media).length === 0) {
    const fileInp = document.querySelectorAll(`input[type="file"]`)[1];
    fileInp.previousElementSibling.style.borderColor = "pink";
    fileInp.previousElementSibling.style.color = "pink";
    fileInp.scrollIntoView({ behavior: "smooth", block: "center" });
    return alert("You must Upload at least 1 Promotion to Submit");
  }
  if (e.target.checkValidity() && !hasSubmitted) {
    document.querySelector(`input[class="submit"]`).style.filter = "brightness(0.4)";
    hasSubmitted = true;

    console.log("Submitting Promotion...");
    const loadScreen = showLoadingGUI();
    const urlData = await constructPost();
    if (!urlData) alert("Submission Error! Server Failed to Upload Media, please reload and try again. Sorry!");
    else fetch(urlData)
      .then((r) => {
        alert("Promotion Submitted!");
        loadScreen.remove();
      })
      .catch((e) => {
        /* Note:
          This is not a fool-proof check, but this is the only one we're able
          to do to actually check if this uploaded to the form.
        */
        if (e.message === "Failed to fetch") alert("Promotion Submitted!");
        else console.warn("Submission Error", e);
        loadScreen.remove();
      });
  }
});
document.addEventListener("DOMContentLoaded", () => {
  setupBtnFncs();
  refreshTagList();
});
