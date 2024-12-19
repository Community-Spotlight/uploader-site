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

function showMediaRules() {
  
}

function showMediaEditor() {
  
}

/* Internal Utils */
function mediaBarSetup(bar) {
  const mediaBtns = bar.children;
  mediaBtns[0].addEventListener("click", (e) => {
    // TODO reset media
    const parent = e.target.parentNode;
    console.log(parent.previousElementSibling.tagName);
    if (parent.previousElementSibling.tagName !== "I") parent.remove();
    e.stopPropagation();
  });
  mediaBtns[2].addEventListener("change", (e) => {
    console.log(e);
    e.stopPropagation();
  });
  mediaBtns[3].addEventListener("click", (e) => {
    const newBar = bar.cloneNode(true);
    mediaBarSetup(newBar);
    bar.insertAdjacentElement("afterend", newBar);
    e.stopPropagation();
  });
}

function mediaHandler() {
  
}

document.addEventListener("DOMContentLoaded", () => {
  setupBtnFncs();
  refreshTagList();
});
