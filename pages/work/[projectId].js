import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { parse } from "node-html-parser";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PageContainer2 from "../../components/PageContainer2";
import Region2 from "../../components/Region2";

import { baseGrid, PageContainer, Div } from "../../components/global.js";

import { getStrapiMedia } from "../../lib/media";
import { fetchAPI } from "../../lib/api";
import { useRouter } from "next/router";

function ProjectDetailPage({ projectData }) {
  const router = useRouter();
  const { projectId } = router.query;
  console.log(projectData);
  return (
    <PageContainer2>
      <Header backgroundColor="--off-white" />
      <ProjectSplash backgroundColor="--off-white">
        <ProjectTitle>{projectData.ProjectTitle}</ProjectTitle>
        <ProjectFeatureImage>
          <ProjectImage
            src={projectData.ProjectFeatureImageInfo.url}
            alt={projectData.ProjectFeatureImageInfo.alternativeText}
          />
        </ProjectFeatureImage>
        <ProjectInfo>
          <ProjectSubtitle>{projectData.ProjectSubtitle}</ProjectSubtitle>
          <ProjectDescription markdown>
            {projectData.ProjectDescription}
          </ProjectDescription>
          <ProjectInfoList>
            <li>
              {projectData.YearStart}-{projectData.YearEnd}
            </li>

            {projectData.ProjectInfoList.map((n, i) => (
              <a key={i} href={n.Link}>
                <li>{n.LinkText}</li>
              </a>
            ))}
          </ProjectInfoList>
        </ProjectInfo>
      </ProjectSplash>
      <Footer backgroundColor="--off-white" />
    </PageContainer2>
  );
}

let ProjectSplashDiv = styled.div`
  grid-column: 1 / -1;

  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    "title title"
    "info image";
  gap: var(--gap);

  min-height: 640px;
  padding: var(--gap);
`;

function ProjectSplash(props) {
  return (
    <Region2 backgroundColor="--off-white">
      <ProjectSplashDiv {...props} />
    </Region2>
  );
}

let ProjectTitle = styled.h2`
  grid-area: title;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  font-size: 87px; /*TK Explicit?*/
`;

let ProjectInfo = styled.div`
  grid-area: info;

  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

let ProjectSubtitle = styled.div`
  font-size: 38px; /*TK Explicit?*/
`;

let ProjectDescription = styled(Div)``;

let ProjectInfoList = styled.ul``;

let ProjectFeatureImage = styled.div`
  grid-area: image;

  height: 450px;
  overflow: hidden;
`;

let ProjectImage = styled.img`
  height: 100%;
  object-fit: cover;

  /*Masonry*/
  display: block;
  width: 100%;
  margin-bottom: var(--gap);
`;

let PageGallery = styled.div`
  grid-column: 1 / -1;

  /*Masonry*/
  list-style-type: none;
  column-count: 3;
  column-gap: var(--gap);
  padding: var(--gap);
`;

let ProjectMediaDiv = styled.li`
  overflow: hidden;

  /*Masonry*/
  break-inside: avoid;
`;

let ProjectIframeDiv = styled(ProjectMediaDiv)`
  /* iframe responsive full-width, via "https://www.w3schools.com/howto/howto_css_responsive_iframes.asp" */
  position: relative;
  width: 100%;
  padding-top: 75%; // 16:9 Aspect Ratio (divide 9 by 16 = 0.5625)
  margin-bottom: var(--gap);
  overflow: hidden;
`;

let GalleryIframe = styled.iframe`
  /* iframe responsive full-width, via "https://www.w3schools.com/howto/howto_css_responsive_iframes.asp" */
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
`;

// let getMethods = (obj) => Object.getOwnPropertyNames(obj).filter(item => typeof obj[item] === 'function')

function htmlToElement(htmlString) {
  return parse(htmlString).childNodes[0];
}

function getAspectRatio(htmlString) {
  let element = htmlToElement(htmlString);
  console.log("#############################" + element);
  let width = parseInt(element.getAttribute("width"));
  let height = parseInt(element.getAttribute("height"));
  return ((height / width) * 100).toString();
}

function getSrc(htmlString) {
  let element = htmlToElement(htmlString);
  // console.log("############################"+element);
  return element.getAttribute("src");
}

function isVideo(fileExt) {
  let vidExts = ["mov", "mp4", "flv", "mkv", "webm"];
  // join with uppercase
  if (vidExts.includes(fileExt)) {
    return true;
  } else {
    return false;
  }
}

function findLargestFormat(formatDict, maxSize = "large") {
  let formats = ["large", "medium", "small", "thumbnail"];
  formats = formats.slice(formats.indexOf(maxSize), formats.length);
  for (let size in formats) {
    if (formatDict.hasOwnProperty(formats[size])) {
      return formats[size];
    }
  }
}

function getProjectCardById(projectId, projectCards) {
  let project = projectCards.data.find(
    ({ attributes: { ProjectId } }) => ProjectId == projectId
  ).attributes;

  project.ProjectFeatureImageInfo = {
    url:
      project.ProjectFeatureImage.data.attributes.formats == null
        ? project.ProjectFeatureImage.data.attributes.url
        : project.ProjectFeatureImage.data.attributes.formats[
            findLargestFormat(
              project.ProjectFeatureImage.data.attributes.formats,
              "large"
            )
          ].url,
    alternativeText:
      project.ProjectFeatureImage.data.attributes.alternativeText,
  };

  // TODO: We don't need project.ProjectFeatureImage, and could (maybe should) delete it at this point.  This would require a deep clone of the project object.

  return project;
}

export async function getStaticPaths() {
  let projectCards = await fetchAPI("/project-cards");
  let projectIds = projectCards.data.map((i) => i.attributes.ProjectId);
  return {
    paths: projectIds.map((i) => ({
      params: {
        projectId: i,
      },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params: { projectId } }) {
  let projectData = (
    await fetchAPI(
      `/project-cards?filters[ProjectId][$eq]=${projectId}&populate=*`
    )
  ).data[0].attributes;

  projectData.ProjectFeatureImageInfo = {
    url:
      projectData.ProjectFeatureImage.data.attributes.formats == null
        ? projectData.ProjectFeatureImage.data.attributes.url
        : projectData.ProjectFeatureImage.data.attributes.formats[
            findLargestFormat(
              projectData.ProjectFeatureImage.data.attributes.formats,
              "large"
            )
          ].url,
    alternativeText:
      projectData.ProjectFeatureImage.data.attributes.alternativeText,
  };

  return {
    props: {
      projectData: projectData,
    }, // will be passed to the page component as props
  };
}

export default ProjectDetailPage;
