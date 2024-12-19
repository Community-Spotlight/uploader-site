/* Main Variables */
let uploadData = { name: "", url: "", tags: [], media: {}, optID: "" };

let showAllTags = false;

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
  
}

function showMediaRules() {
  
}

function showMediaEditor(namespace, fileType) {
  
}

/* Internal Utils */
function toFixedType(fileType) {
  switch (fileType) {
    case "image/svg+xml": return "svg";
    case "image/png": return "png";
    case "image/jpg":
    case "image/jpeg": return "jpeg";
    case "video/mp4": return "mp4";
    // TODO add HTML later
    default: return undefined;
  }  
}

function mediaBarSetup(bar) {
  bar.style.display = ""; // We use the empty sample element
  const mediaBtns = bar.children;
  mediaBtns[0].addEventListener("click", (e) => {
    delete uploadData.media[mediaBtns[1].textContent];
    const parent = e.target.parentNode;
    if (parent.previousElementSibling.previousElementSibling.tagName !== "I") parent.remove();
    else mediaBtns[1].textContent = "Upload Media";
    e.stopPropagation();
  });
  mediaBtns[3].addEventListener("click", (e) => {
    const newBar = document.querySelector(`div[class="media-ctrl"]`).cloneNode(true);
    mediaBarSetup(newBar);
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

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  if (e.target.checkValidity()) {
    console.log("Submitting Data...");
    showLoadingGUI();
    // TODO add to spreadsheet, add GUI
  }
});
document.addEventListener("DOMContentLoaded", () => {
  setupBtnFncs();
  refreshTagList();
});
