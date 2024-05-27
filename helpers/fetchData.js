export const fetchData = async (lang) => {
  const res = await fetch(
    `https://strapi-portfolio-krzysztofg.herokuapp.com/api/page-contents?locale=${lang}`,
  );
  return res.json();
};
export const fetchRecommendations = async (lang) => {
  const res = await fetch(
    `https://strapi-portfolio-krzysztofg.herokuapp.com/api/recommendations?locale=${lang}`,
  );
  return res.json();
};
