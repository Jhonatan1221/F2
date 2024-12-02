const db = PouchDB("ev2-db");
const server = "https://pwa-express-back.onrender.com/api/users/";

function manageAPIPOSTS(CACHE_DYNAMIC, CACHE_DYNAMIC_LIMIT, req) {
  const method = req.clone().method;
  if (method === "PUT") {
    if (self.registration.sync) {
      return req
        .clone()
        .text()
        .then((body) => {
          console.log("SW API PUT request to: ", req.url, "with body: ", body);
          const jsonObject = JSON.parse(body);
          return saveDisplayNameInDB(jsonObject);
        })
        .catch((err) => {
          console.log("SW API PUT request failed: ", err);
        });
    } else {
      return fetch(req).catch((err) => {
        console.log("SW API PUT request failed: ", err);
      });
    }
  } else {
    return fetch(req).catch((err) => {
      console.log("SW API POST request failed: ", err);
    });
  }
}

//--------------------displayname------------------

function saveDisplayNameInDB(jsonObject) {
  jsonObject._id = new Date().toISOString();
  console.log("SW-saveObjectInDB: ", jsonObject);

  return db.put(jsonObject).then(() => {
    self.registration.sync.register("sync-post-edit-username");
    const newResp = { ok: true, offline: true };
    return new Response(JSON.stringify(newResp));
  });
}

function postUpdateUsername() {
  return db.allDocs({ include_docs: true }).then((docs) => {
    docs.rows.forEach((doc) => {
      console.log("SW-postUpdateUsername: ", doc.doc);
      const docData = doc.doc;
      const userId = docData.id;
      const newDisplayName = docData.displayName;
      fetch(server + userId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName: newDisplayName,
        }),
      })
        .then((res) => {
          if (res.ok) {
            db.remove(doc);
          }
        })
        .catch((err) => {
          console.log("SW-postUpdateUsername: ", err);
        });
    });
  });
}

//--------------------displayname------------------
