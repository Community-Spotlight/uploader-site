/* Imports */
import { TAGS } from "../static/tags.js";
import {
  FILE_TYPES,
  getFileMIMEs,
  getSafeFileType,
} from "../static/file-types.js";
import { PANELS, openPanel } from "./gui-utils.js";
import {
  _ioWrap,
  getCSSVar,
  setCSSVar,
  genUUID,
  uploadMediaFiles,
  constructUploadPost,
} from "./utils.js";

/* CONSTANTS */
const TAG_EXPAND_CSS = "tag-expand";
const WARN_DISPLAY_CSS = "warn-alert-display";
const COMPRESSED_TAG_LIMIT = 20;
const MAX_UPLOADS = 5;
const MAX_MEDIA_SIZE = 10000000; // 10 MB

/* Main Variables */
const uploadData = {};
const guiData = {};

window.__guiData = guiData; // safe to expose

/* Internals */
const resetUploadData = () => {
  uploadData.name = null;
  uploadData.url = null;
  uploadData.tags = [];
  uploadData.media = {};
  uploadData.optID = null;
};

const resetGUIData = () => {
  guiData.nextMediaID = 1;
  guiData.selectedMediaRatios = new Set(); // stores which media scale ratios are already taken

  if (!guiData._mediaDiv) return;

  // prettier-ignore
  Array.from(guiData._metaContainer.querySelectorAll("v-input")).forEach(i => i.setValue(""));
  Array.from(guiData._tagContainer.children).forEach((t) => {
    t.firstElementChild.checked = false;
  });

  const mediaItems = guiData._mediaDiv.children;
  for (let i = mediaItems.length - 1; i > 0; i--) {
    // prettier-ignore
    if (i === 1) mediaItems[i].querySelector(`[class*="media-upload"]`).textContent = "Upload Media";
    else mediaItems[i].remove();
  }
  setCSSVar(WARN_DISPLAY_CSS, "none");
};

/* GUI Setup */
function initTagList() {
  /* Expand Button */
  const toggleMoreBtn = document.getElementById("more-tags");
  _ioWrap.call(toggleMoreBtn, "click", () => {
    const shouldExpand = getCSSVar(TAG_EXPAND_CSS) === "none";
    setCSSVar(TAG_EXPAND_CSS, shouldExpand ? "flex" : "none");
    toggleMoreBtn.style.transform = shouldExpand
      ? "rotate(270deg) scale(1, 1.5)"
      : "";
  });

  /* Tag List */
  const reusableTagDiv = document.querySelector(`div[class="promo-tag"]`);
  const container = reusableTagDiv.parentNode;
  guiData._tagContainer = container;

  const tagDivs = [];
  for (let i = 0; i < TAGS.length; i++) {
    const tag = TAGS[i];
    const tagDiv = reusableTagDiv.cloneNode(true);

    tagDiv.querySelector("input").id = tag;
    tagDiv.querySelector("label").setAttribute("for", tag);
    tagDiv.querySelector("label span").textContent = tag;
    if (i > COMPRESSED_TAG_LIMIT) tagDiv.setAttribute("hidable", true);

    tagDivs.push(tagDiv);
  }

  reusableTagDiv.remove();
  container.append(...tagDivs);

  _ioWrap.call(container, "click", (e) => {
    /* Tag Click */
    const target = e.target;
    if (target.localName !== "input") return;

    const id = target.id;
    if (!TAGS.includes(id)) {
      console.warn("Illegal tag!");
      return;
    }

    if (target.checked) uploadData.tags.push(id);
    else {
      const index = uploadData.tags.indexOf(id);
      uploadData.tags.splice(index, 1);
    }
  });
}

function initTextFields() {
  const warnAlert = document.getElementById("warn-alert-msg");
  const container = document.querySelector(`div[id="meta"]`);
  guiData._metaContainer = container;

  const validateInput = (type, input) => {
    const value = input.getValue();
    uploadData[type] = value;

    setCSSVar(WARN_DISPLAY_CSS, "none");
    if (!uploadData.name) {
      setCSSVar(WARN_DISPLAY_CSS, "flex");
      warnAlert.textContent = "Product name is invalid or not long enough!";
    }
    if (!uploadData.url) {
      setCSSVar(WARN_DISPLAY_CSS, "flex");
      warnAlert.textContent = "Product url is invalid!";
    }
  };

  const nameField = container.querySelector(".product-name");
  _ioWrap.call(nameField, "change", () => validateInput("name", nameField));

  const urlField = container.querySelector(".product-url");
  _ioWrap.call(urlField, "change", () => validateInput("url", urlField));

  const pingField = document.querySelector(`div[id="optNotif"] .promoter-id`);
  _ioWrap.call(pingField, "change", () => {
    uploadData.optID = pingField.getValue();
  });
}

function initMediaField() {
  const fileInput = document.getElementById("file-input");
  fileInput.setAttribute("accept", getFileMIMEs());

  const guidelinesBtn = document.getElementById("guidelines");
  _ioWrap.call(guidelinesBtn, "click", () => Events.emit("OPEN_GUIDELINES"));

  const reusableUploadDiv = document.querySelector(".media-item");
  const mediaDiv = reusableUploadDiv.parentNode;
  guiData._mediaDiv = mediaDiv;
  reusableUploadDiv.style.display = "none"; // we will use this element for reference

  const removeUpload = (_, target) => {
    const container = target.closest(".media-item");

    delete uploadData.media[container.id];
    if (container.id === "0") {
      container.querySelector(".media-upload").textContent = "Upload Media";
    } else {
      guiData.nextMediaID--;
      container.remove();
    }
  };

  const newUpload = () => {
    if (guiData.nextMediaID >= MAX_UPLOADS) {
      openPanel(PANELS.alert, {
        title: "Max Uploads",
        desc: `You can only upload ${MAX_UPLOADS} pieces of media per submission`,
      });
      return;
    }

    const mediaBar = reusableUploadDiv.cloneNode(true);
    mediaBar.id = guiData.nextMediaID++;
    mediaBar.style.display = "";
    mediaDiv.appendChild(mediaBar);

    const removeItemBtn = mediaBar.querySelector(`[class*="remove"]`);
    _ioWrap.call(removeItemBtn, "click", removeUpload);

    const addItemBtn = mediaBar.querySelector(`[class*="add"]`);
    _ioWrap.call(addItemBtn, "click", newUpload);

    const fileInput = mediaBar.querySelector(`input[id="file-input"]`);
    const uploadBtn = mediaBar.querySelector(".media-upload");
    _ioWrap.call(uploadBtn, "click", () => fileInput.click());
    _ioWrap.call(fileInput, "change", (e) => {
      const file = e.target.files[0];
      if (file) {
        Events.emit("NEW_UPLOAD", String(mediaBar.id), file, uploadBtn);
        e.target.value = "";
      }
    });
  };

  newUpload();
}

function initSubmitBtn() {
  const btn = document.getElementById("submit-promo");
  _ioWrap.call(btn, "click", async () => {
    const loader = openPanel(PANELS.loader, {
      title: "Uploading",
      desc: "Submitting Promotion...",
    });

    const failure = (reason, focusElement) => {
      if (focusElement) {
        focusElement.scrollIntoView({ behavior: "smooth", block: "center" });
        focusElement.parentNode.style.boxShadow = "inset pink 0px 0px 0px 5px";
        setTimeout(() => {
          focusElement.parentNode.style.boxShadow = "";
        }, 5000);
      }

      loader.close();
      openPanel(PANELS.alert, {
        title: "Submission Invalid",
        desc: reason,
      });
    };
    const success = () => {
      resetUploadData();
      resetGUIData();

      loader.close();
      openPanel(PANELS.alert, {
        title: "Success!",
        desc: "Promotion Submitted!<br>A Team member will review this soon...",
      });
    };

    // validation
    if (!uploadData.name || !uploadData.url) {
      const thing = uploadData.name ? "url" : "name";
      failure(`No Promotion ${thing} submitted!`, guiData._metaContainer);
      return;
    }
    if (uploadData.tags.length < 3) {
      failure(
        "You must select at least 3 tags to submit a promotion!",
        guiData._tagContainer,
      );
      return;
    }
    if (Object.keys(uploadData.media).length === 0) {
      failure(
        "You must upload at least 1 piece of media to submit a promotion!",
        guiData._mediaDiv,
      );
      return;
    }

    const promoID = genUUID();
    const mediaPaths = await uploadMediaFiles(promoID, uploadData.media);
    if (mediaPaths.length === 0) {
      failure("Failed to upload promotion media to server!");
      return;
    }

    fetch(constructUploadPost(promoID, uploadData, mediaPaths))
      .then(success)
      .catch((e) => {
        /**
         * Important Note:
         * This is not a fool-proof error check. Unfortunately this is the
         * only way to check to see if the Promotion uploaded to the form
         * at this time. (CORS issue "Access-Control-Allow-Origin")
         */
        const probableSuccessMsgs = [
          "failed to fetch", // chrome
          "load failed", // safari
          "networkerror when attempting to fetch resource.", // firefox
        ];
        if (probableSuccessMsgs.includes(e.message.toLowerCase())) success();
        else failure("Upload Error: " + e);
      });
  });
}

Events.on("NEW_UPLOAD", (id, file, btn) => {
  // validation
  const type = getSafeFileType(file.type);
  if (type === null) {
    openPanel(PANELS.alert, {
      title: "Unsupported File Type",
      desc: `'${file.type}' files are not supported!<br>Please see the Media Guidelines.`,
    });
    return;
  }

  if (file.size > MAX_MEDIA_SIZE) {
    openPanel(PANELS.alert, {
      title: "File too Large",
      desc: "File size exceeds the 10MB limit!",
    });
    return;
  }

  // delete old media if different
  if (btn.textContent !== file.name) delete uploadData.media[id];

  const reader = new FileReader();
  reader.onerror = (err) => {
    console.warn(err);
    openPanel(PANELS.alert, {
      title: "Couldnt Read File",
      desc: "An error occured while reading this file.<br>Check the console.",
    });
  };
  reader.onload = () => {
    btn.textContent = file.name;
    uploadData.media[id] = { t: type, d: reader.result };
    Events.emit("OPEN_MEDIA_VIEWER", id, uploadData.media);
  };

  if (type === FILE_TYPES.SVG.t) reader.readAsText(file);
  else reader.readAsDataURL(file);
});

Events.on("GUI_INIT", () => {
  resetGUIData();
  resetUploadData();
  initTagList();
  initTextFields();
  initMediaField();
  initSubmitBtn();
});

document.addEventListener("DOMContentLoaded", () => {
  Events.emit("GUI_INIT");
});
