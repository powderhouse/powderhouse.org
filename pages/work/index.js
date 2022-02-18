import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import styled from "styled-components";
import { css } from "styled-components";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Region2 from "../../components/Region2";
import PageContainer2 from "../../components/PageContainer2";

import PageTableOfContents from "../../components/PageTableOfContents";
import { asteriskSVG, mediaQueries } from "../../site-data.js";

import {
	baseGrid,
	Spacer,
	PageSplash,
	PageHeading,
	Asterisk,
	PageIntroduction,
	SectionHeader,
	PageSection,
	PageSectionContent,
	FullBleedImage,
	findLargestFormat,
	getBgFromLight,
	Div,
	tenureSort,
} from "../../components/global";

import { getStrapiMedia } from "../../lib/media";
import { fetchAPI } from "../../lib/api";

function WorkPage({
	workPage: {
		data: {
			attributes: {
				PageSplash: { PageHeader, PageIntro },
				PageSections,
			},
		},
	},
	partnerCards: {
		data: {
			attributes: { PartnerCards: PartnerCards },
		},
	},
	projectCards: { data: projectCards },
	pastLifeCards: {
		data: {
			attributes: { PastLifeCards: PastLifeCards },
		},
	},
}) {
	let accentColor = "--green";

	let partnersDesc = PageSections.find(
		(s) => s.SectionHeader == "Selected Partners"
	);
	let partners = PartnerCards.map(
		(
			{
				Image: {
					data: {
						attributes: { formats, url, alternativeText },
					},
				},
				Link,
				LinkText,
			},
			i
		) => {
			return (
				<PartnerLink key={i} href={Link}>
					<PartnerCard>
						<PartnerLogo
							src={
								formats == null ||
								Object.keys(formats).length == 0
									? url
									: formats[
											findLargestFormat(formats, "medium")
									  ].url
							}
							alt={alternativeText}
						/>
					</PartnerCard>
				</PartnerLink>
			);
		}
	);
	let projectsDesc = PageSections.find(
		(s) => s.SectionHeader == "Selected Work"
	);
	let projects = projectCards.map(
		(
			{
				attributes: {
					ProjectFeatureImage: {
						data: {
							attributes: { url, formats, alternativeText },
						},
					},
					ProjectTitle: title,
					ProjectSubtitle: subtitle,
					ProjectId: id,
				},
			},
			index
		) => {
			return (
				<ProjectCard key={index}>
					<ProjectLink href={"/work/" + id}>
						{/* TK There's probably a better way to do this with relative URLS? */}
						<ProjectImageDiv>
							<ProjectFeatureImage
								src={
									formats == null ||
									Object.keys(formats).length == 0
										? url
										: formats[
												findLargestFormat(
													formats,
													"small"
												)
										  ].url
								}
								alt={alternativeText}
							/>
						</ProjectImageDiv>
						<ProjectTitle>{title}</ProjectTitle>
						<ProjectSubtitle markdown>{subtitle}</ProjectSubtitle>
					</ProjectLink>
				</ProjectCard>
			);
		}
	);
	let pastLivesDesc = PageSections.find(
		(s) => s.SectionHeader == "Past Lives"
	);
	let pastLives = PastLifeCards.map(
		(
			{
				Image: {
					data: {
						attributes: { formats, url, alternativeText },
					},
				},
				Link,
				LinkText,
			},
			i
		) => (
			<PastLifeLink key={i} href={Link}>
				<PastLifeCard>
					<PastLifeImage
						src={
							formats == null || Object.keys(formats).length == 0
								? url
								: formats[findLargestFormat(formats, "medium")]
										.url
						}
						alt={alternativeText}
					/>
				</PastLifeCard>
			</PastLifeLink>
		)
	);

	return (
		<PageContainer2>
			<Header backgroundColor="--off-white" />
			<PageSplash backgroundColor={accentColor}>
				<PageHeading>{PageHeader}</PageHeading>
				<PageTableOfContents sections={PageSections} />
			</PageSplash>
			<PageIntroduction backgroundColor="--off-white" markdown>
				{PageIntro}
			</PageIntroduction>
			<Region2
				backgroundColor={getBgFromLight(projectsDesc.isLightSection)}
				header={projectsDesc.SectionHeader}
				left={projectsDesc.isLeftHeader}
			>
				<PageSectionContent $wide={true} $grid={true}>
					{projects}
				</PageSectionContent>
			</Region2>
			<Region2
				backgroundColor={getBgFromLight(partnersDesc.isLightSection)}
				header={partnersDesc.SectionHeader}
				left={partnersDesc.isLeftHeader}
			>
				<PageSectionContent $wide={true}>
					<PartnerSectionContent>{partners}</PartnerSectionContent>
				</PageSectionContent>
			</Region2>
			<Region2
				backgroundColor={getBgFromLight(pastLivesDesc.isLightSection)}
				header={pastLivesDesc.SectionHeader}
				left={pastLivesDesc.isLeftHeader}
			>
				<PageSectionContent $wide={true} $grid={false}>
					{pastLivesDesc.PageSectionContent ? (
						<SectionDesc>
							{pastLivesDesc.PageSectionContent}
						</SectionDesc>
					) : (
						""
					)}
					<PastLifeSectionContent>{pastLives}</PastLifeSectionContent>
				</PageSectionContent>
			</Region2>
			<Footer backgroundColor="--off-white" accentColor={accentColor} />
		</PageContainer2>
	);
}

let SectionDesc = styled(Div)`
	padding-bottom: 1.3rem;
	font-size: calc(1 * 1.3rem);
	grid-column: 1 / -1;
`;

let PartnerSectionContent = styled.div`
	display: grid;
	column-gap: var(--gap);
	row-gap: 1.3rem;
	grid-template-columns: repeat(5, 1fr);

	@media ${mediaQueries.uptoTablet} {
		grid-template-columns: repeat(4, 1fr);
	}
	@media ${mediaQueries.uptoMobile} {
		grid-template-columns: repeat(2, 1fr);
	}
`;

let PartnerCard = styled.div`
	height: 110px;
	overflow: hidden;
	transition: 0.375s;
	opacity: 0.75;

	filter: grayscale(100%);

	&:hover {
		opacity: 1;
		filter: grayscale(0%);
	}
`;

let PartnerLogo = styled.img`
	pointer-events: none;
	height: 100%;
	width: 100%;
	object-fit: contain;
`;

let PartnerLink = styled.a``;

let ProjectCard = styled.div`
	grid-column: span 3;
`;

let ProjectLink = styled.a`
	text-decoration: none;
`;

let ProjectImageDiv = styled.div`
	background-color: var(--yellow);
	height: 200px; /*TK Explicit?*/
	overflow: hidden;
`;

let ProjectFeatureImage = styled.img`
	height: 100%;
	width: 100%;
	object-fit: cover;
`;

let ProjectTitle = styled.h3`
	grid-column: 1 / span 3;
	font-weight: 300;
	line-height: calc(1.3rem * 1.5);
	font-size: calc(1.3rem * 1.5);
	padding: calc(1.3rem / 2) 0;
	margin: 0;
`;

let ProjectSubtitle = styled(Div)`
	line-height: 1.3rem;
	padding: 0;
	margin: 0;
`;

let PastLifeSectionContent = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	column-gap: var(--gap);
	row-gap: 1.3rem;

	@media ${mediaQueries.uptoTablet} {
		grid-template-columns: repeat(1, 1fr);
	}
`;

let PastLifeCard = styled.div`
	height: 330px; /*TK Explicit?*/
	overflow: hidden;
`;

let PastLifeImage = styled.img`
	height: 100%;
	width: 100%;
	object-fit: cover;
`;

let PastLifeLink = styled.a``;

export async function getStaticProps(context) {
	let workPage = await fetchAPI("/work?populate=*");
	let partnerCards = await fetchAPI(
		"/work?populate[PartnerCards][populate]=*"
	);
	let projectCards = await fetchAPI("/project-cards?populate=*");
	projectCards.data.sort(
		tenureSort(
			(x) => x.attributes.YearStart,
			(x) => x.attributes.YearEnd,
			(x) => x.attributes.ProjectTitle,
			"descending"
		)
	);
	let pastLifeCards = await fetchAPI(
		"/work?populate[PastLifeCards][populate]=*"
	);
	return {
		props: {
			workPage: workPage,
			partnerCards: partnerCards,
			projectCards: projectCards,
			pastLifeCards: pastLifeCards,
		}, // will be passed to the page component as props
	};
}
export default WorkPage;
