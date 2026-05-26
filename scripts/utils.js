/* Constants */
const ID_SOUP =
  "@#+-~_=;[]{}()^ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const ID_LENGTH = 15;

/**
 * Special Thanks to YeetYourFiles.com for powering
 * the Community Spotlight File Uploader!
 *
 * https://yyf.mubilop.com
 */
const FILE_SERV_API = "https://yyf.mubilop.com/api/";
const FILE_SERV_NAME = "CSpotlight-Media-"; // CSpotlight-Media-<ID>-<MEDIA_ID>.<TYPE>

/**
 * Get todays date as Google Spreadsheet syntax.
 *
 * @private
 * @returns Todays date string
 */
const genTodaysDate = function () {
  const d = new Date();
  const hr = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");

  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()} ${hr}:${min}`;
};

/**
 * Wrap a DOM event with callback.
 *
 * @param {String} type DOM Event type
 * @param {Function} func Callback function
 */
const _ioWrap = function (type, func) {
  this.addEventListener(type, (e) => {
    func(e, this);
    e.stopPropagation();
  });
};

/**
 * Safely Base64 encodes text (and non-latin characters).
 *
 * @param {String} txt Text to encode
 * @returns Base64 encoded string
 */
const _btoa = function (txt) {
  const encoded = [];
  for (let i = 0; i < txt.length; i++) encoded.push(txt.charCodeAt(i));
  return btoa(encoded.join(","));
};

/**
 * Gets a CSS variable value.
 *
 * @param {String} name CSS variable name
 * @returns Variable value
 */
const getCSSVar = function (name) {
  const bodyStyle = getComputedStyle(document.body);

  return bodyStyle.getPropertyValue("--" + name);
};

/**
 * Sets a CSS variable value.
 *
 * @param {String} name CSS variable name
 * @param {String} value CSS value
 */
const setCSSVar = function (name, value) {
  const bodyStyle = document.body.style;
  bodyStyle.setProperty("--" + name, value);
};

/**
 * Compresses a SVG.
 *
 * @param {String} svg SVG text content
 * @returns Compressed SVG
 */
const compressSVG = function (svg) {
  return svg
    .replace(/data-paper-data="[^"]*" /g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<title>[\s\S]*?<\/title>/g, "")
    .replace(/<desc>[\s\S]*?<\/desc>/g, "")
    .replaceAll("#000000", "#000")
    .replaceAll("#ffffff", "#fff")
    .replaceAll("#00000000", "none")
    .replace('svg version="1.1" ', "svg ")
    .replace(/<metadata>[\s\S]*?<\/metadata>/g, "")
    .replace(/<\?xml[\s\S]*?\?>/g, "")
    .replace(/(\d+)\.0+(?!\d)/g, "$1")
    .replace(/(\d+\.\d*?)0+(?!\d)/g, "$1")
    .replace(/<g>\s*<\/g>/g, "")
    .replace(/\s*style=""/g, "")
    .replace(/>\s+</g, "><")
    .replace(/\s+$/g, "")
    .trim();
};

/**
 * Gets the aspect ratio of a given width and height.
 *
 * @param {Number} width Width to compute
 * @param {Number} height Height to compute
 * @returns Aspect Ratio 'X:Y'
 */
const getAspectRatio = (width, height) => {
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);

  const ratio = gcd(width, height);
  return `${width / ratio}:${height / ratio}`;
};

/**
 * Generates a random UUID.
 *
 * @returns Random UUID
 */
const genUUID = function () {
  const id = [];
  for (let i = 0; i < ID_LENGTH; i++) {
    id[i] = ID_SOUP.charAt(Math.random() * ID_SOUP.length);
  }

  return id.join("");
};

/**
 * Uploads a single file to our file provider.
 *
 * @param {String} name File name
 * @param {Base64URLString} data File data in a base64 format
 * @returns Provider response object
 */
const _uploadFile = async function (name, data) {
  const byteChars = atob(data);
  const byteNums = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) {
    byteNums[i] = byteChars.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNums);
  const blob = new Blob([byteArray], { type: "text/plain" });

  const formData = new FormData();
  formData.append("file", blob, name);
  formData.append("deletable", "true");

  const response = await fetch(FILE_SERV_API + "upload", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    console.warn("POST ERROR:", e);
    return undefined;
  }

  const responseData = await response.json();
  return responseData;
};

/**
 * Uploads all media in a promotion to file provider.
 *
 * @param {String} id ID of this promotion
 * @param {Object} media Object containing promotion media
 * @returns List of URLs and hashes leading to media stored on provider's server
 */
const uploadMediaFiles = async function (id, media) {
  const mediaPaths = [];

  const mediaList = Object.values(media);
  for (let i = 0; i < mediaList.length; i++) {
    const thisMedia = mediaList[i];
    const name = `${FILE_SERV_NAME}${id}-${i}.${thisMedia.t}`;

    const json = await _uploadFile(name, thisMedia.d);
    if (json) {
      mediaPaths.push({
        t: thisMedia.t,
        id: json.fileId,
        url: json.fileUrl,
      });
    }
  }

  return mediaPaths;
};

/**
 * Constructs a GET url for uploading a promotion to our review server.
 *
 * @param {String} id ID of this promotion
 * @param {Object} uploadData Object containing promotional data
 * @param {Array} mediaPaths Array of paths leading to media files stored by our provider
 * @returns URL for uploading a promotion
 */
const constructUploadPost = function (id, uploadData, mediaPaths) {
  const webhook =
    "https://script.google.com/macros/s/AKfycbwb49wDXQjOBxtGfjg-bpyMXckewOntlqIyqZejA8MkEUu7I7juDctKLbMXrf6IBjUc-w/exec?gid=0";

  const date = encodeURIComponent(genTodaysDate());
  const name = encodeURIComponent(_btoa(uploadData.name));
  const url = encodeURIComponent(_btoa(uploadData.url));
  const tags = encodeURIComponent(_btoa(uploadData.tags.join(",")));
  const mediaUrls = encodeURIComponent(JSON.stringify(mediaPaths));

  let params = "";
  params += `&upload-id=${id}&date=${date}`;
  params += `&product-name=${name}&product-url=${url}`;
  params += `&tags=${tags}&media=${mediaUrls}`;
  params += `&opt-ping-id=${uploadData.optID || "0"}`;

  return webhook + params;
};

export {
  _ioWrap,
  _btoa,
  getCSSVar,
  setCSSVar,
  compressSVG,
  getAspectRatio,
  genUUID,
  uploadMediaFiles,
  constructUploadPost,
};
