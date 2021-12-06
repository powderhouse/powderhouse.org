export function getStrapiURL(path = "") {
  return `${
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337/api"
  }${path}`;
}


// Helper to make GET requests to Strapi
export async function fetchAPI(path) {
  const requestUrl = getStrapiURL(path);

  let myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    ["Bearer", "2290de48745530f4f2770e6e4270d3947fd95af3a8c7c46359ee3830d11907947165182c11314934d23bcd99e42ab5ed0c3af9db42e56e7e5495c38f011a63d71d339162cf6791aa30da1d3ccbe0101436048093bcd019e7d21dd260c8d2fe62e9426bf84d0663da3f3e5d9dc0e84fec4e3e56f8d2e53413578a8cb9d43ecd8a" /*process.env.STRAPI_API_TOKEN*/].join(" ")
  );

  let raw = "";

  let requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return await fetch(requestUrl, requestOptions)
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => console.log("error", error));  
}
