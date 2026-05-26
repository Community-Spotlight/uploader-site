/* Imports */
import { IMG_RATIOS, VIDEO_HTML_RATIOS } from "../static/file-types.js";

/* Constants */
const ASSET_PATH = "https://cdn.jsdelivr.net/gh/Community-Spotlight/assets/";

const PANELS = {
  alert: 1,
  media: 2,
  loader: 3,
};

/**
 * @typedef {Object} PanelData
 * @property {String} title (Optional) Title of Panel
 * @property {String} desc (Optional) Description of Panel
 * @property {String} input (Optional) Input type of Popup Panel
 */
/**
 * Opens a GUI Panel.
 *
 * @param {String} type Type of panel to open from PANELS
 * @param {PanelData} optData
 * @returns GUI Panel
 */
const openPanel = function (type, optData) {
  const holder = document.createElement("div");
  holder.classList.add("panel-overlay");
  const panel = document.createElement("div");
  panel.classList.add("panel");

  switch (type) {
    case PANELS.alert: {
      panel.innerHTML = `
        <u class="header">${optData.title}</u>
        <div class="status-holder">${optData.desc}</div>
        <button class="btn">Okay</button>`;
      break;
    }
    case PANELS.loader: {
      panel.innerHTML = `
        <u class="header">${optData.title}</u>
        <div class="load-holder">
          <div class="load-circle">
            <img width="200" src="${ASSET_PATH}loader.svg" draggable="false">
          </div>
        </div>
        ${
          optData.desc ? `<div class="status-holder">${optData.desc}</div>` : ""
        }`;
      break;
    }
    case PANELS.media: {
      panel.innerHTML = `
        <u class="header">Media Editor</u>
        <div class="media-zone">
          <div class="data-holder"></div>
        </div>
        <div class="editor-section settings"></div>
        <div class="editor-section requirements"></div>
        <button class="btn" awaitingchecks>Cancel</button>`;
      break;
    }
  }

  holder.appendChild(panel);
  document.body.appendChild(holder);
  panel.animate(
    [
      { transform: "translate(-50%, -50%) scale(0)" },
      { transform: "translate(-50%, -50%) scale(1)" },
    ],
    { duration: 300, easing: "ease-in-out" },
  );
  panel.close = () => {
    const anim = panel.animate(
      [
        { transform: "translate(-50%, -50%) scale(1)" },
        { transform: "translate(-50%, -50%) scale(0)" },
      ],
      { duration: 250, easing: "ease-in" },
    );
    anim.onfinish = () => holder.remove();
  };

  // Accessible UI
  panel._submitBtn = panel.querySelector(`button[class="btn"]`);
  panel._loadingMsg = panel.querySelector(`div[class="status-holder"]`);
  panel._mediaContent = panel.querySelector(`div[class="data-holder"]`);
  panel._settingsDiv = panel.querySelector(`div[class*="settings"]`);
  panel._requirementDiv = panel.querySelector(`div[class*="requirements"]`);

  if (type === PANELS.alert) {
    panel._submitBtn.addEventListener("click", (e) => {
      panel.close();
      e.stopPropagation();
    });
  }

  return panel;
};

const genSelectMenu = function (title, options, opt_forceHidden) {
  let selectMenu = `<div class="title">${title}</div>`;
  selectMenu += `<div class="selector-ui"><select>`;

  if (typeof options === "object" && !Array.isArray(options)) {
    options = Object.keys(options);
  }

  selectMenu += `<option value="" selected disabled hidden>Choose Scale</option>`;
  for (const option of options) {
    const isDisabled =
      opt_forceHidden && opt_forceHidden.has(option) ? "disabled" : "";

    selectMenu += `<option value="${option}" ${isDisabled}>${option}</option>`;
  }

  selectMenu += `</select></div>`;
  return selectMenu;
};

export { ASSET_PATH, PANELS, openPanel, genSelectMenu };
