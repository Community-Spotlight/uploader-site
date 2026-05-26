const IMG_RATIOS = {
  "250x250": [250, 250],
  "300x250": [300, 250],
  "480x270": [480, 270],
  "300x50": [300, 50],
  "50x300": [50, 300],
  "360x120": [360, 120],
  "120x360": [120, 360],
};

const VIDEO_HTML_RATIOS = {
  "1:1": [150, 150],
  "4:3": [240, 180],
  "4:5": [240, 300],
  "16:9": [360, 202.5],
  "9:16": [202.5, 360],
};

const VIDEO_LENGTHS = [5, 10, 15, 30];

const FILE_TYPES = {
  SVG: { t: "svg", m: "image/svg+xml" },
  PNG: { t: "png", m: "image/png" },
  JPEG: { t: "jpeg", m: "image/jpeg, image/jpeg" },
  VIDEO: { t: "mp4", m: "video/mp4" },
  HTML: { t: "html", m: "text/html" },
};

/**
 * Gets the safe file type from a file. Used by our servers.
 *
 * @param {String} type File type
 * @returns Safe file type if valid, otherwise null
 */
const getSafeFileType = function (type) {
  switch (type) {
    case "image/svg+xml":
      return FILE_TYPES.SVG.t;
    case "image/png":
      return FILE_TYPES.PNG.t;
    case "image/jpg":
    case "image/jpeg":
      return FILE_TYPES.JPEG.t;
    case "video/mp4":
      return FILE_TYPES.VIDEO.t;
    case "text/html":
      return FILE_TYPES.HTML.t;
    default:
      return null;
  }
};

/**
 * Get a string of accepted MIME types.
 *
 * @returns String of MIMEs
 */
const getFileMIMEs = function () {
  const MIMEs = Object.values(FILE_TYPES).map((f) => f.m);
  return MIMEs.join(", ");
};

// prettier-ignore
export {
  IMG_RATIOS,
  VIDEO_HTML_RATIOS,
  VIDEO_LENGTHS,
  FILE_TYPES,
  getSafeFileType,
  getFileMIMEs,
};
