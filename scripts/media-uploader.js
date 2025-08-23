/*
  Special Thanks to MubiLop with YeetYourFiles.lol for powering
  the Community Spotlight File Uploader!

  https://yeetyourfiles.lol/
*/

async function uploadFiles(mediaObj, id) {
  let mediaPaths = [];
  const allMedia = Object.values(mediaObj);
  for (let i = 0; i < allMedia.length; i++) {
    const json = await uploadFile(allMedia[i].d, id, i);
    if (json) mediaPaths.push({ t: allMedia[i].t, id: json.fileId, url: json.fileUrl });
  }
  return mediaPaths;
}

async function uploadFile(base64, id, i) {
  const fileName = `CSpotlight-Media-${id}${i}}.txt`;

  const byteChars = atob(base64);
  const byteNums = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) { byteNums[i] = byteChars.charCodeAt(i) }
  const byteArray = new Uint8Array(byteNums);
  const blob = new Blob([byteArray], { type: "text/plain" });

  const formData = new FormData();
  formData.append("file", blob, fileName);
  formData.append("deletable", "true");
  return fetch("https://yyf.mubilop.com/api/upload", { method: "POST", body: formData })
    .then(response => response.json())
    .then(data => { return data })
    .catch(e => {
      console.warn("POST ERROR:", e);
      return undefined;
    });
}
